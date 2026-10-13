// Yalnız çıktı kapsamı ve tüketilen A/B bantları; kişisel veri içermez.
const PREFIX = 'fopos-exam-variants-v2:';
const LEGACY = 'fopos-exam-variants-v1:';
type Storage = Pick<globalThis.Storage, 'getItem' | 'setItem'> & Partial<Pick<globalThis.Storage, 'length' | 'key' | 'removeItem'>>;
type Row = { code: string; questionCount: number; processComponents?: unknown[] };
type Scope = [string, string, [string, number][]];
export function examVariantHistoryKey(subject: string, dataset: string, rows: Row[]): string {
  return PREFIX + JSON.stringify([subject, dataset, rows.filter(r => r.questionCount > 0)
    .map(r => [r.code, r.processComponents?.length ?? 1]).sort((a, b) => String(a[0]).localeCompare(String(b[0])))]);
}
function scopeOf(key: string): Scope { return JSON.parse(key.slice(PREFIX.length)); }
function outcomeKey(subject: string, dataset: string, code: string): string {
  return PREFIX + JSON.stringify([subject, dataset, code]);
}
function parseRound(raw: string | null): number {
  if (raw === null) return 0;
  const round = Number(raw);
  if (!/^\d+$/.test(raw) || !Number.isSafeInteger(round)) throw new Error('Soru üretim geçmişi okunamadı; tekrar riski nedeniyle üretim durduruldu. Bu kapsamın geçmişini sıfırlayabilirsiniz.');
  return round;
}
function legacyKeys(storage: Storage): string[] {
  const keys: string[] = [];
  for (let i = 0; i < (storage.length ?? 0); i++) {
    const key = storage.key?.(i);
    if (key?.startsWith(LEGACY)) keys.push(key);
  }
  return keys;
}
export function readExamVariantRound(storage: Storage, key: string): number {
  const [subject, dataset, rows] = scopeOf(key);
  let highest = 0;
  for (const [code, components] of rows) {
    let round = parseRound(storage.getItem(outcomeKey(subject, dataset, code)));
    for (const oldKey of storage.getItem(outcomeKey(subject, dataset, code) + ':reset') === '1' ? [] : legacyKeys(storage)) {
      const [oldSubject, oldDataset, oldRows] = JSON.parse(oldKey.slice(LEGACY.length));
      if (oldSubject !== subject || oldDataset !== dataset) continue;
      const row = oldRows.find((r: unknown[]) => r[0] === code);
      if (row) round = Math.max(round, parseRound(storage.getItem(oldKey)) * Math.ceil(row[1] / components));
    }
    highest = Math.max(highest, round);
  }
  return highest;
}
export function reserveExamVariantRound(storage: Storage, key: string, expectedRound: number, width = 1): void {
  if (!Number.isSafeInteger(width) || width < 1) throw new Error('Geçersiz varyant bandı.');
  if (readExamVariantRound(storage, key) !== expectedRound) throw new Error('Bu kapsam başka bir sekmede üretildi. Sayfayı yenileyip kalan üretimi kontrol ediniz.');
  const [subject, dataset, rows] = scopeOf(key);
  for (const [code] of rows) storage.setItem(outcomeKey(subject, dataset, code), String(expectedRound + width));
  if (readExamVariantRound(storage, key) !== expectedRound + width) throw new Error('Üretim geçmişi kaydedilemedi; tekrar riski nedeniyle üretim durduruldu.');
}
export function resetExamVariantHistory(storage: Storage, key: string): void {
  if (!storage.removeItem) throw new Error('Tarayıcı üretim geçmişini sıfırlayamıyor.');
  const [subject, dataset, rows] = scopeOf(key);
  for (const [code] of rows) storage.setItem(outcomeKey(subject, dataset, code) + ':reset', '1');
  for (const [code] of rows) storage.removeItem(outcomeKey(subject, dataset, code));
}
