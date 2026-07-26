import { getChatGPTUser } from "../../chatgpt-auth";
import {
  ensureWorkspaceAccount,
  getProfilePedagogicalRecordCount,
  getTeacherProfile,
  listTeacherProfileRevisions,
  saveInitialTeacherProfile,
  updateTeacherProfile,
} from "../../../db/teacher-workspace";

export const dynamic = "force-dynamic";

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return Boolean(origin && new URL(request.url).origin === new URL(origin).origin);
}

function publicProfile(
  profile: NonNullable<Awaited<ReturnType<typeof getTeacherProfile>>>,
) {
  return {
    displayName: profile.displayName,
    schoolName: profile.schoolName,
    academicYear: profile.academicYear,
    revision: profile.revision,
  };
}

export async function GET() {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: "Oturum gerekli." }, { status: 401 });
  try {
    const account = await ensureWorkspaceAccount(user.email);
    const profile = await getTeacherProfile(account.id);
    if (!profile) {
      return Response.json({ error: "Öğretmen profili bulunamadı." }, { status: 404 });
    }
    const [history, recordRevisionCount] = await Promise.all([
      listTeacherProfileRevisions(account.id),
      getProfilePedagogicalRecordCount(account.id),
    ]);
    return Response.json({
      profile: publicProfile(profile),
      history,
      recordRevisionCount,
    });
  } catch {
    return Response.json({ error: "Öğretmen profili okunamadı." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) {
    return Response.json({ error: "Oturum gerekli." }, { status: 401 });
  }

  if (!sameOrigin(request)) {
    return Response.json({ error: "İstek kaynağı doğrulanamadı." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Profil verisi okunamadı." }, { status: 400 });
  }

  try {
    const account = await ensureWorkspaceAccount(user.email);
    const input = body as {
      displayName?: unknown;
      schoolName?: unknown;
      academicYear?: unknown;
    };
    const profile = await saveInitialTeacherProfile(account.id, {
      displayName: input.displayName,
      schoolName: input.schoolName,
      academicYear: input.academicYear,
    });
    return Response.json({
      profile: publicProfile(profile),
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Profil kaydedilemedi." },
      { status: 400 },
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
    return Response.json({ error: "Profil verisi okunamadı." }, { status: 400 });
  }

  try {
    const account = await ensureWorkspaceAccount(user.email);
    const input = body as {
      displayName?: unknown;
      schoolName?: unknown;
      academicYear?: unknown;
      expectedRevision?: unknown;
      rolloverConfirmed?: unknown;
      rolloverConfirmationText?: unknown;
    };
    const profile = await updateTeacherProfile(account.id, input);
    return Response.json({
      profile: publicProfile(profile),
      history: await listTeacherProfileRevisions(account.id),
      recordRevisionCount: await getProfilePedagogicalRecordCount(account.id),
    });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "Profil güncellenemedi.",
      },
      { status: 400 },
    );
  }
}
