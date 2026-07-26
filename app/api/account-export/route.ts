import { buildAccountExport } from "../../../db/account-export";
import { ensureWorkspaceAccount } from "../../../db/teacher-workspace";
import { getChatGPTUser } from "../../chatgpt-auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Oturum gerekli." }, { status: 401 });

  const origin = request.headers.get("origin");
  if (!origin || new URL(request.url).origin !== new URL(origin).origin) {
    return Response.json({ error: "İstek kaynağı doğrulanamadı." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Dışa aktarma onayı okunamadı." }, { status: 400 });
  }
  if (
    !body ||
    typeof body !== "object" ||
    (body as { confirmed?: unknown }).confirmed !== true
  ) {
    return Response.json(
      { error: "Hesap verilerini dışa aktarmak için öğretmen onayı gerekir." },
      { status: 400 },
    );
  }

  try {
    const account = await ensureWorkspaceAccount(user.email);
    const payload = await buildAccountExport(account);
    const date = new Date().toISOString().slice(0, 10);
    return new Response(`${JSON.stringify(payload, null, 2)}\n`, {
      headers: {
        "Cache-Control": "no-store",
        "Content-Disposition": `attachment; filename="FOPOS_Hesap_Verileri_${date}.json"`,
        "Content-Type": "application/json; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Hesap verileri dışa aktarılamadı.",
      },
      { status: 500 },
    );
  }
}
