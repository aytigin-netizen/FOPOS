import { getChatGPTUser } from "../../chatgpt-auth";
import { ensureWorkspaceAccount } from "../../../db/teacher-workspace";
import { saveDocumentGeneration } from "../../../db/document-generations";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Oturum gerekli." }, { status: 401 });
  const origin = request.headers.get("origin");
  if (!origin || new URL(request.url).origin !== new URL(origin).origin) {
    return Response.json({ error: "İstek kaynağı doğrulanamadı." }, { status: 403 });
  }
  try {
    const account = await ensureWorkspaceAccount(user.email);
    return Response.json({ generation: await saveDocumentGeneration(account.id, await request.json()) });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Üretim izi kaydedilemedi." }, { status: 400 });
  }
}
