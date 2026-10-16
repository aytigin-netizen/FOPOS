import { getDatabase } from './runtime-env.ts';
import { planExamReservation } from '../app/core/exam-variant-reservation.ts';

type Scope = { subject: string; dataset: string; codes: string[] };
function validate({ subject, dataset, codes }: Scope) {
  if (!/^(philosophy|sociology)$/.test(subject) || !/^\d{4}\.\d+$/.test(dataset)
    || !Array.isArray(codes) || codes.length < 1 || codes.length > 40
    || codes.some(code => typeof code !== 'string' || !/^[A-Z]{2,8}\.\d{2}\.\d{1,2}\.\d{1,2}$/.test(code))) {
    throw new Error('Sınav geçmişi kapsamı geçersiz.');
  }
}

function parse(raw: string | undefined): Record<string, number> {
  let value: unknown;
  try { value = JSON.parse(raw ?? '{}'); }
  catch { throw new Error('Hesap üretim geçmişi okunamadı; tekrar riski nedeniyle üretim durduruldu.'); }
  if (!value || typeof value !== 'object' || Array.isArray(value)
    || Object.values(value).some(n => !Number.isSafeInteger(n) || (n as number) < 0)) {
    throw new Error('Hesap üretim geçmişi okunamadı; tekrar riski nedeniyle üretim durduruldu.');
  }
  return value as Record<string, number>;
}

export async function readExamHistory(userId: string, scope: Scope): Promise<number> {
  return (await readExamHistoryState(userId, scope)).round;
}

export async function readExamHistoryState(userId: string, scope: Scope) {
  validate(scope);
  const row = await getDatabase().prepare('SELECT rounds_json FROM exam_generation_history WHERE user_id = ? AND subject = ? AND dataset = ?')
    .bind(userId, scope.subject, scope.dataset).first<{ rounds_json: string }>();
  const state = parse(row?.rounds_json);
  return {
    round: Math.max(0, ...scope.codes.map(code => state[code] ?? 0)),
    reuseRound: Math.max(0, ...scope.codes.map(code => state[`reuse:${code}`] ?? 0)),
  };
}

// One compare-and-swap covers every selected outcome. Concurrent tabs cannot claim the same A/B band.
export async function reserveExamHistory(userId: string, scope: Scope, width: number, maxRound: number, allowReuse = false) {
  validate(scope);
  if (!Number.isSafeInteger(width) || width < 1 || width > 10 || !Number.isSafeInteger(maxRound) || maxRound < 1 || maxRound > 100) {
    throw new Error('Sınav varyant kapasitesi geçersiz.');
  }
  const db = getDatabase();
  await db.prepare(`INSERT INTO exam_generation_history (user_id, subject, dataset, rounds_json, updated_at)
    VALUES (?, ?, ?, '{}', ?) ON CONFLICT(user_id,subject,dataset) DO NOTHING`)
    .bind(userId, scope.subject, scope.dataset, new Date().toISOString()).run();
  for (let attempt = 0; attempt < 8; attempt++) {
    const row = await db.prepare('SELECT rounds_json FROM exam_generation_history WHERE user_id = ? AND subject = ? AND dataset = ?')
      .bind(userId, scope.subject, scope.dataset).first<{ rounds_json: string }>();
    if (!row) throw new Error('Hesap üretim geçmişi alınamadı.');
    const state = parse(row.rounds_json);
    const round = Math.max(0, ...scope.codes.map(code => state[code] ?? 0));
    const reuseRound = Math.max(0, ...scope.codes.map(code => state[`reuse:${code}`] ?? 0));
    const reservation = planExamReservation(round, reuseRound, width, maxRound, allowReuse);
    const updated = { ...state };
    for (const code of scope.codes) {
      if (reservation.reused) updated[`reuse:${code}`] = reservation.reuseRound;
      else updated[code] = reservation.next;
    }
    const result = await db.prepare(`UPDATE exam_generation_history SET rounds_json = ?, updated_at = ?
      WHERE user_id = ? AND subject = ? AND dataset = ? AND rounds_json = ?`)
      .bind(JSON.stringify(updated), new Date().toISOString(), userId, scope.subject, scope.dataset, row.rounds_json).run();
    if (result.success && result.meta?.changes === 1) return reservation;
  }
  throw new Error('Başka bir sekmede üretim yapıldı. Tekrar deneyiniz.');
}
