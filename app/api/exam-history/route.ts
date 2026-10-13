import { getChatGPTUser } from '../../chatgpt-auth';
import { ensureWorkspaceAccount } from '../../../db/teacher-workspace';
import { readExamHistory, reserveExamHistory } from '../../../db/exam-generation-history';
import { activeExamContentEngine } from '../../modules/exam-builder/exam-content-engine';

export const dynamic = 'force-dynamic';
type Scope = { subject: string; dataset: string; codes: string[] };
function engineFor(scope: Scope) {
  if (!Array.isArray(scope.codes) || !scope.codes.length || scope.codes.length > 40) throw new Error('Sınav kapsamı geçersiz.');
  const engine = activeExamContentEngine(scope.subject, scope.dataset, scope.codes);
  if (!engine) throw new Error('Bu çıktıların doğrulanmış soru bankası bulunamadı.');
  return engine;
}
export async function GET(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: 'Oturum gerekli.' }, { status: 401 });
  try {
    const url = new URL(request.url);
    const scope: Scope = { subject: url.searchParams.get('subject') ?? '', dataset: url.searchParams.get('dataset') ?? '', codes: url.searchParams.getAll('code') };
    engineFor(scope);
    const account = await ensureWorkspaceAccount(user.email);
    return Response.json({ round: await readExamHistory(account.id, scope) });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : 'Sınav geçmişi okunamadı.' }, { status: 400 }); }
}
export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: 'Oturum gerekli.' }, { status: 401 });
  const origin = request.headers.get('origin');
  if (!origin || origin !== new URL(request.url).origin) return Response.json({ error: 'İstek kaynağı doğrulanamadı.' }, { status: 403 });
  try {
    const body = await request.json() as Scope & { width: number; maxRound: number };
    const engine = engineFor(body);
    const pool = engine.variantPoolFor?.(body.codes) ?? engine.variantPool;
    if (body.maxRound !== Math.floor(pool / 2)) throw new Error('Sınav kapasitesi uyuşmuyor.');
    const account = await ensureWorkspaceAccount(user.email);
    return Response.json(await reserveExamHistory(account.id, body, body.width, body.maxRound));
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : 'Üretim geçmişi kaydedilemedi.' }, { status: 400 }); }
}
