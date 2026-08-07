import { getChatGPTUser } from "../../chatgpt-auth";
import { ensureWorkspaceAccount } from "../../../db/teacher-workspace";
import {
  listDocumentGenerations,
  listDocumentGenerationCurricula,
  saveDocumentGeneration,
  type DocumentGenerationType,
} from "../../../db/document-generations";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Oturum gerekli." }, { status: 401 });
  try {
    const account = await ensureWorkspaceAccount(user.email);
    const url = new URL(request.url);
    const academicYear = url.searchParams.get("academicYear") ?? "";
    const yearMatch = /^(\d{4})-(\d{4})$/u.exec(academicYear);
    if (!yearMatch || Number(yearMatch[2]) !== Number(yearMatch[1]) + 1) throw new Error("Öğretim yılı filtresi geçersiz.");
    const documentType = url.searchParams.get("documentType") || undefined;
    const curriculumId = url.searchParams.get("curriculumId") || undefined;
    const search = url.searchParams.get("search") || undefined;
    const cursor = url.searchParams.get("cursor") || undefined;
    const rawPageSize = url.searchParams.get("pageSize");
    const page = await listDocumentGenerations(account.id, academicYear, {
      cursor,
      documentType: documentType as DocumentGenerationType | undefined,
      curriculumId,
      search,
      pageSize: rawPageSize ? Number(rawPageSize) : undefined,
    });
    const curriculumSources = await listDocumentGenerationCurricula(account.id, academicYear);
    return Response.json({ page, curriculumSources });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Üretim arşivi açılamadı." }, { status: 400 });
  }
}

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
