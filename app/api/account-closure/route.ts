import {
  ACCOUNT_DELETE_CONFIRMATION,
  getAccountClosureSummary,
  permanentlyDeleteAccount,
} from "../../../db/account-closure";
import { ensureWorkspaceAccount } from "../../../db/teacher-workspace";
import {
  chatGPTSignOutPath,
  getChatGPTUser,
} from "../../chatgpt-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Oturum gerekli." }, { status: 401 });
  try {
    const account = await ensureWorkspaceAccount(user.email);
    return Response.json({
      accountEmail: account.emailNormalized,
      summary: await getAccountClosureSummary(account.id),
    });
  } catch {
    return Response.json({ error: "Hesap kapsamı okunamadı." }, { status: 500 });
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
    return Response.json({ error: "Hesap kapatma isteği okunamadı." }, { status: 400 });
  }

  try {
    const account = await ensureWorkspaceAccount(user.email);
    const input = body as {
      confirmed?: unknown;
      confirmationText?: unknown;
      accountEmail?: unknown;
      expectedProfileExists?: unknown;
      expectedRecordRevisionCount?: unknown;
    };
    if (
      input.confirmed !== true ||
      input.confirmationText !== ACCOUNT_DELETE_CONFIRMATION ||
      typeof input.accountEmail !== "string" ||
      input.accountEmail.trim().toLocaleLowerCase("en-US") !==
        account.emailNormalized ||
      typeof input.expectedProfileExists !== "boolean" ||
      !Number.isInteger(input.expectedRecordRevisionCount)
    ) {
      return Response.json(
        { error: "Kalıcı hesap silme için tüm doğrulamalar gereklidir." },
        { status: 400 },
      );
    }

    await permanentlyDeleteAccount(
      account.id,
      input.expectedProfileExists,
      input.expectedRecordRevisionCount as number,
    );
    return Response.json({
      deleted: true,
      signOutPath: chatGPTSignOutPath("/"),
    });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Hesap kalıcı olarak silinemedi.",
      },
      { status: 400 },
    );
  }
}
