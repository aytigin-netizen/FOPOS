import {
  listAllPedagogicalRecordsForExport,
  listPedagogicalRecordYearAssignments,
} from "./pedagogical-records";
import {
  getTeacherProfile,
  type TeacherProfileRecord,
  type WorkspaceAccount,
} from "./teacher-workspace";
import { listAllClassWorkspacesForExport } from "./class-workspaces";

type PublicTeacherProfile = Pick<
  TeacherProfileRecord,
  "displayName" | "schoolName" | "academicYear" | "revision"
>;

function publicProfile(profile: TeacherProfileRecord | null): PublicTeacherProfile | null {
  if (!profile) return null;
  return {
    displayName: profile.displayName,
    schoolName: profile.schoolName,
    academicYear: profile.academicYear,
    revision: profile.revision,
  };
}

export async function buildAccountExport(account: WorkspaceAccount) {
  const [
    profile,
    classWorkspaces,
    pedagogicalRecords,
    pedagogicalRecordAcademicYears,
  ] = await Promise.all([
    getTeacherProfile(account.id),
    listAllClassWorkspacesForExport(account.id),
    listAllPedagogicalRecordsForExport(account.id),
    listPedagogicalRecordYearAssignments(account.id),
  ]);
  const exportedAt = new Date().toISOString();
  const data = {
    schemaVersion: "47.0.0",
    exportedAt,
    account: { email: account.emailNormalized },
    teacherProfile: publicProfile(profile),
    classWorkspaces,
    pedagogicalRecords,
    pedagogicalRecordAcademicYears,
  };
  const serializedData = JSON.stringify(data);
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(serializedData),
  );
  const contentSha256 = Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");

  return {
    exportType: "fopos-teacher-workspace",
    manifest: {
      schemaVersion: "1.0.0",
      exportedAt,
      recordCount: new Set(
        pedagogicalRecords.map((record) => record.recordId),
      ).size,
      revisionCount: pedagogicalRecords.length,
      contentSha256,
      exclusions: [
        "student_rosters",
        "student_scores",
        "student_performance",
        "bep_and_health_data",
        "session_tokens",
        "internal_database_ids",
      ],
    },
    data,
  };
}
