import {
  getAccountDataPolicy,
  movePedagogicalRecordsToTrash,
  RECORD_DELETE_CONFIRMATION,
  restorePedagogicalRecords,
} from "../../../db/account-data-management";
import { ensureWorkspaceAccount } from "../../../db/teacher-workspace";
import { getChatGPTUser } from "../../chatgpt-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Oturum gerekli." }, { status: 401 });
  try {
    const account = await ensureWorkspaceAccount(user.email);
    return Response.json({ policy: await getAccountDataPolicy(account.id) });
  } catch {
    return Response.json({ error: "Saklama politikası okunamadı." }, { status: 500 });
  }
}

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
    return Response.json({ error: "Veri işlemi okunamadı." }, { status: 400 });
  }
  try {
    const account = await ensureWorkspaceAccount(user.email);
    const input = body as {
      action?: unknown;
      confirmed?: unknown;
      confirmationText?: unknown;
      expectedRevisionCount?: unknown;
    };
    if (input.action === "restore_records") {
      return Response.json({ policy: await restorePedagogicalRecords(account.id) });
    }
    if (
      input.action !== "delete_records" ||
      input.confirmed !== true ||
      input.confirmationText !== RECORD_DELETE_CONFIRMATION ||
      !Number.isInteger(input.expectedRevisionCount)
    ) {
      return Response.json(
        { error: "Güvenli silme için onay ve doğrulama metni gerekir." },
        { status: 400 },
      );
    }
    return Response.json({
      policy: await movePedagogicalRecordsToTrash(
        account.id,
        input.expectedRevisionCount as number,
      ),
    });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "Veri işlemi tamamlanamadı.",
      },
      { status: 400 },
    );
  }
}
