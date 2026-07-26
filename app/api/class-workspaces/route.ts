import { getChatGPTUser } from "../../chatgpt-auth";
import { ensureWorkspaceAccount } from "../../../db/teacher-workspace";
import {
  createClassWorkspace,
  listClassWorkspaces,
  setClassWorkspaceArchived,
} from "../../../db/class-workspaces";

export const dynamic = "force-dynamic";

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return Boolean(origin && new URL(request.url).origin === new URL(origin).origin);
}

export async function GET() {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Oturum gerekli." }, { status: 401 });
  try {
    const account = await ensureWorkspaceAccount(user.email);
    return Response.json(await listClassWorkspaces(account.id));
  } catch {
    return Response.json({ error: "Sınıf çalışma alanları açılamadı." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Oturum gerekli." }, { status: 401 });
  if (!sameOrigin(request)) {
    return Response.json({ error: "İstek kaynağı doğrulanamadı." }, { status: 403 });
  }
  try {
    const account = await ensureWorkspaceAccount(user.email);
    return Response.json(await createClassWorkspace(account.id, await request.json()));
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Sınıf oluşturulamadı." }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Oturum gerekli." }, { status: 401 });
  if (!sameOrigin(request)) {
    return Response.json({ error: "İstek kaynağı doğrulanamadı." }, { status: 403 });
  }
  try {
    const account = await ensureWorkspaceAccount(user.email);
    return Response.json(await setClassWorkspaceArchived(account.id, await request.json()));
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Sınıf güncellenemedi." }, { status: 400 });
  }
}
