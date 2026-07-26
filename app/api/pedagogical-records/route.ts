import { getChatGPTUser } from "../../chatgpt-auth";
import { ensureWorkspaceAccount } from "../../../db/teacher-workspace";
import {
  importPedagogicalRecords,
  listAcademicYearArchive,
  listPedagogicalRecords,
  savePedagogicalRecord,
} from "../../../db/pedagogical-records";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Oturum gerekli." }, { status: 401 });
  try {
    const account = await ensureWorkspaceAccount(user.email);
    const url = new URL(request.url);
    if (url.searchParams.get("scope") === "archive") {
      const academicYear = url.searchParams.get("academicYear") ?? undefined;
      return Response.json(await listAcademicYearArchive(account.id, academicYear));
    }
    return Response.json({ records: await listPedagogicalRecords(account.id) });
  } catch {
    return Response.json({ error: "Kayıt arşivi açılamadı." }, { status: 500 });
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
    const body: unknown = await request.json();
    if (
      body &&
      typeof body === "object" &&
      "records" in body &&
      Array.isArray((body as { records?: unknown }).records)
    ) {
      return Response.json(
        await importPedagogicalRecords(
          account.id,
          (body as { records: unknown[] }).records,
        ),
      );
    }
    const history = await savePedagogicalRecord(account.id, body);
    return Response.json({ history });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Kayıt saklanamadı." },
      { status: 400 },
    );
  }
}
