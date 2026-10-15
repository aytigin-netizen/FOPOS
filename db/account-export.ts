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
import { getDatabase } from "./runtime-env";

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
    timetables,
    profile,
    classWorkspaces,
    pedagogicalRecords,
    pedagogicalRecordAcademicYears,
    examHistory,
  ] = await Promise.all([
    getDatabase().prepare("SELECT academic_year,timetable_json,revision,updated_at FROM teaching_timetables WHERE user_id=? ORDER BY academic_year").bind(account.id).all<{academic_year:string;timetable_json:string;revision:number;updated_at:string}>(),
    getTeacherProfile(account.id),
    listAllClassWorkspacesForExport(account.id),
    listAllPedagogicalRecordsForExport(account.id),
    listPedagogicalRecordYearAssignments(account.id),
    getDatabase().prepare("SELECT subject, dataset, rounds_json, updated_at FROM exam_generation_history WHERE user_id = ? ORDER BY subject, dataset")
      .bind(account.id).all<{ subject: string; dataset: string; rounds_json: string; updated_at: string }>(),
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
    teachingTimetables:(timetables.results??[]).map(row=>({academicYear:row.academic_year,timetable:JSON.parse(row.timetable_json),revision:row.revision,updatedAt:row.updated_at})),
    examGenerationHistory: (examHistory.results ?? []).map(row => ({ subject: row.subject, dataset: row.dataset, rounds: JSON.parse(row.rounds_json), updatedAt: row.updated_at })),
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
