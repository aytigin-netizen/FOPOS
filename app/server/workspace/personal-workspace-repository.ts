import {
  createTeacherProfile,
  type TeacherProfileInput,
} from "../../core/teacher-profile.ts";
import type { TeacherProfile } from "../../core/secure-workspace.ts";
import type { SessionDatabase } from "../auth/session-repository.ts";

interface BatchDatabase extends SessionDatabase {
  batch<T = unknown>(
    statements: unknown[],
  ): Promise<Array<{ success: boolean; results?: T[] }>>;
}

interface PersonalWorkspaceRow {
  workspace_id: string;
  workspace_name: string;
  profile_id: string;
  owner_user_id: string;
  display_name: string;
  branch: "Felsefe";
  school_name: string;
  academic_year: string;
  locale: "tr-TR";
  profile_created_at: string;
  profile_updated_at: string;
}

export interface PersonalWorkspace {
  id: string;
  name: string;
  profile: TeacherProfile;
}

function toPersonalWorkspace(row: PersonalWorkspaceRow): PersonalWorkspace {
  return {
    id: row.workspace_id,
    name: row.workspace_name,
    profile: {
      schemaVersion: "47.0.0",
      id: row.profile_id,
      ownerUserId: row.owner_user_id,
      workspaceId: row.workspace_id,
      displayName: row.display_name,
      branch: row.branch,
      schoolName: row.school_name,
      academicYear: row.academic_year,
      locale: row.locale,
      createdAt: row.profile_created_at,
      updatedAt: row.profile_updated_at,
    },
  };
}

export async function findPersonalWorkspace(
  database: SessionDatabase,
  userId: string,
): Promise<PersonalWorkspace | null> {
  if (!userId) throw new Error("Kullanıcı kimliği eksik.");

  const row = await database
    .prepare(
      `SELECT
         w.id AS workspace_id,
         w.name AS workspace_name,
         p.id AS profile_id,
         p.owner_user_id,
         p.display_name,
         p.branch,
         p.school_name,
         p.academic_year,
         p.locale,
         p.created_at AS profile_created_at,
         p.updated_at AS profile_updated_at
       FROM workspaces AS w
       INNER JOIN workspace_memberships AS m
         ON m.workspace_id = w.id
        AND m.user_id = ?
        AND m.role = 'owner'
        AND m.revoked_at IS NULL
       INNER JOIN teacher_profiles AS p
         ON p.workspace_id = w.id
        AND p.owner_user_id = ?
       WHERE w.personal_owner_user_id = ?
         AND w.archived_at IS NULL
       LIMIT 1`,
    )
    .bind(userId, userId, userId)
    .first<PersonalWorkspaceRow>();

  return row ? toPersonalWorkspace(row) : null;
}

export async function ensurePersonalWorkspace(
  database: BatchDatabase,
  input: {
    userId: string;
    workspaceId: string;
    profileId: string;
    profile: TeacherProfileInput;
    now: Date;
  },
): Promise<PersonalWorkspace> {
  if (!input.userId || !input.workspaceId || !input.profileId) {
    throw new Error("Kişisel çalışma alanı kimlikleri eksik.");
  }

  const now = input.now.toISOString();
  const normalizedProfile = createTeacherProfile(
    {
      id: input.profileId,
      ownerUserId: input.userId,
      workspaceId: input.workspaceId,
    },
    input.profile,
    now,
  );
  const workspaceName = `${normalizedProfile.displayName} Çalışma Alanı`;

  const workspaceStatement = database
    .prepare(
      `INSERT INTO workspaces (
        id, name, kind, created_by_user_id, personal_owner_user_id, created_at, archived_at
      ) VALUES (?, ?, 'personal', ?, ?, ?, NULL)
      ON CONFLICT(personal_owner_user_id) DO NOTHING`,
    )
    .bind(
      input.workspaceId,
      workspaceName,
      input.userId,
      input.userId,
      now,
    );
  const membershipStatement = database
    .prepare(
      `INSERT INTO workspace_memberships (
        workspace_id, user_id, role, created_at, revoked_at
      )
      SELECT id, ?, 'owner', ?, NULL
      FROM workspaces
      WHERE personal_owner_user_id = ?
      ON CONFLICT(workspace_id, user_id) DO NOTHING`,
    )
    .bind(input.userId, now, input.userId);
  const profileStatement = database
    .prepare(
      `INSERT INTO teacher_profiles (
        id, owner_user_id, workspace_id, display_name, branch,
        school_name, academic_year, locale, created_at, updated_at
      )
      SELECT ?, ?, id, ?, 'Felsefe', ?, ?, 'tr-TR', ?, ?
      FROM workspaces
      WHERE personal_owner_user_id = ?
      ON CONFLICT(owner_user_id, workspace_id) DO NOTHING`,
    )
    .bind(
      input.profileId,
      input.userId,
      normalizedProfile.displayName,
      normalizedProfile.schoolName,
      normalizedProfile.academicYear,
      now,
      now,
      input.userId,
    );

  const results = await database.batch([
    workspaceStatement,
    membershipStatement,
    profileStatement,
  ]);

  if (results.length !== 3 || results.some((result) => !result.success)) {
    throw new Error("Kişisel çalışma alanı atomik olarak oluşturulamadı.");
  }

  const workspace = await findPersonalWorkspace(database, input.userId);
  if (!workspace) {
    throw new Error("Kişisel çalışma alanı oluşturulduktan sonra doğrulanamadı.");
  }

  return workspace;
}
