import {
  ensureDefaultTeacherDiscipline,
  listTeacherDisciplines,
  replaceTeacherDisciplines,
} from "../../../db/teacher-disciplines";
import { ensureWorkspaceAccount } from "../../../db/teacher-workspace";
import { listRegisteredDisciplines } from "../../../src/core/curriculum/curriculum-registry";
import { getChatGPTUser } from "../../chatgpt-auth";

export const dynamic = "force-dynamic";

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return Boolean(origin && new URL(request.url).origin === new URL(origin).origin);
}

function availableDisciplines() {
  return listRegisteredDisciplines().map((discipline) => ({
    ...discipline,
    status: "available" as const,
  }));
}

export async function GET() {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Oturum gerekli." }, { status: 401 });

  try {
    const account = await ensureWorkspaceAccount(user.email);
    await ensureDefaultTeacherDiscipline(account.id);
    return Response.json({
      assignments: await listTeacherDisciplines(account.id),
      availableDisciplines: availableDisciplines(),
    });
  } catch {
    return Response.json(
      { error: "Branş atamaları okunamadı." },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Oturum gerekli." }, { status: 401 });
  if (!sameOrigin(request)) {
    return Response.json({ error: "İstek kaynağı doğrulanamadı." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Branş ayarları okunamadı." }, { status: 400 });
  }

  try {
    const input = body as { assignments?: unknown };
    if (!Array.isArray(input.assignments)) {
      throw new Error("Branş atama listesi gereklidir.");
    }
    const supportedCodes = new Set(
      listRegisteredDisciplines().map((discipline) => discipline.code),
    );
    for (const assignment of input.assignments) {
      const code =
        assignment && typeof assignment === "object"
          ? (assignment as { disciplineCode?: unknown }).disciplineCode
          : null;
      if (typeof code !== "string" || !supportedCodes.has(code)) {
        throw new Error("Yalnız müfredat paketi hazır branşlar atanabilir.");
      }
    }

    const account = await ensureWorkspaceAccount(user.email);
    return Response.json({
      assignments: await replaceTeacherDisciplines(
        account.id,
        input.assignments as Array<{
          disciplineCode?: unknown;
          isDefault?: unknown;
        }>,
      ),
      availableDisciplines: availableDisciplines(),
    });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Branş atamaları güncellenemedi.",
      },
      { status: 400 },
    );
  }
}
