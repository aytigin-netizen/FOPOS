import { getChatGPTUser } from "../../chatgpt-auth";
import { ensureWorkspaceAccount } from "../../../db/teacher-workspace";
import {
  createClassWorkspace,
  listClassWorkspaces,
  setClassWorkspaceArchived,
} from "../../../db/class-workspaces";
import {
  ensureDefaultTeacherDiscipline,
  listTeacherDisciplines,
} from "../../../db/teacher-disciplines";
import { listRegisteredDisciplines } from "../../../src/core/curriculum/curriculum-registry";

export const dynamic = "force-dynamic";

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return Boolean(origin && new URL(request.url).origin === new URL(origin).origin);
}

async function workspacePayload(userId: string) {
  await ensureDefaultTeacherDiscipline(userId);
  const [workspaceState, assignments] = await Promise.all([
    listClassWorkspaces(userId),
    listTeacherDisciplines(userId),
  ]);
  const registered = new Map(
    listRegisteredDisciplines().map((discipline) => [discipline.code, discipline]),
  );
  const disciplines = assignments.flatMap((assignment) => {
    const discipline = registered.get(assignment.disciplineCode);
    return discipline
      ? [{ ...discipline, isDefault: assignment.isDefault }]
      : [];
  });
  const defaultDisciplineCode = disciplines.find(
    (discipline) => discipline.isDefault,
  )?.code;
  if (!defaultDisciplineCode) {
    throw new Error("Varsayılan branş için hazır müfredat paketi bulunamadı.");
  }
  return { ...workspaceState, disciplines, defaultDisciplineCode };
}

export async function GET() {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Oturum gerekli." }, { status: 401 });
  try {
    const account = await ensureWorkspaceAccount(user.email);
    return Response.json(await workspacePayload(account.id));
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Sınıf çalışma alanları açılamadı.",
      },
      { status: 500 },
    );
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
    const input = (await request.json()) as {
      subjectCode?: unknown;
      grade?: unknown;
      branchCode?: unknown;
    };
    await ensureDefaultTeacherDiscipline(account.id);
    const assignments = await listTeacherDisciplines(account.id);
    const registeredCodes = new Set(
      listRegisteredDisciplines().map((discipline) => discipline.code),
    );
    const requestedSubject =
      typeof input.subjectCode === "string" && input.subjectCode.trim()
        ? input.subjectCode.trim().toLocaleLowerCase("en-US")
        : assignments.find((assignment) => assignment.isDefault)?.disciplineCode;
    if (!requestedSubject || !registeredCodes.has(requestedSubject)) {
      throw new Error("Sınıf yalnız müfredat paketi hazır bir branşla oluşturulabilir.");
    }
    await createClassWorkspace(account.id, {
      ...input,
      subjectCode: requestedSubject,
    });
    return Response.json(await workspacePayload(account.id));
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Sınıf oluşturulamadı." },
      { status: 400 },
    );
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
    await setClassWorkspaceArchived(account.id, await request.json());
    return Response.json(await workspacePayload(account.id));
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Sınıf güncellenemedi." },
      { status: 400 },
    );
  }
}
