import { getDatabase } from "./runtime-env.ts";
import { isClassCourse } from "../app/core/class-course-catalog.ts";
import type { SchoolGrade } from "../app/core/class-workspace.ts";

function grade(value: unknown): SchoolGrade {
  if (value !== 9 && value !== 10 && value !== 11 && value !== 12) {
    throw new Error("Sınıf düzeyi yalnızca 9, 10, 11 veya 12 olabilir.");
  }
  return value;
}

function branchCode(value: unknown) {
  if (typeof value !== "string") throw new Error("Şube kodu geçersiz.");
  const normalized = value.trim().toLocaleUpperCase("tr-TR");
  if (!/^[A-ZÇĞİÖŞÜ0-9]{1,4}$/u.test(normalized)) {
    throw new Error("Şube kodu 1–4 harf veya rakamdan oluşmalıdır.");
  }
  return normalized;
}

function subjectCode(value: unknown) {
  if (typeof value !== "string") {
    throw new Error("Sınıf çalışma alanı için branş seçimi gereklidir.");
  }
  const normalized = value.trim().toLocaleLowerCase("en-US");
  if (!/^[a-z][a-z0-9_-]{1,31}$/u.test(normalized)) {
    throw new Error("Ders alanı kodu geçersiz.");
  }
  return normalized;
}

async function activeAcademicYear(userId: string) {
  const row = await getDatabase()
    .prepare("SELECT academic_year FROM teacher_profiles WHERE user_id = ? LIMIT 1")
    .bind(userId)
    .first<{ academic_year: string }>();
  if (!row) throw new Error("Etkin öğretim yılı bulunamadı.");
  return row.academic_year;
}

export async function listClassWorkspaces(userId: string) {
  const year = await activeAcademicYear(userId);
  const result = await getDatabase()
    .prepare(
      `SELECT id, academic_year, subject_code, grade, branch_code, archived_at, created_at, updated_at
       FROM class_workspaces
       WHERE user_id = ? AND academic_year = ?
       ORDER BY archived_at IS NOT NULL, grade, branch_code
       LIMIT 100`,
    )
    .bind(userId, year)
    .all<{
      id: string;
      academic_year: string;
      subject_code: string;
      grade: SchoolGrade;
      branch_code: string;
      archived_at: string | null;
      created_at: string;
      updated_at: string;
    }>();
  return {
    academicYear: year,
    workspaces: (result.results ?? []).map((row) => ({
      id: row.id,
      subjectCode: row.subject_code,
      academicYear: row.academic_year,
      grade: row.grade,
      branchCode: row.branch_code,
      archivedAt: row.archived_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    })),
  };
}

export async function listAllClassWorkspacesForExport(userId: string) {
  const result = await getDatabase()
    .prepare(
      `SELECT academic_year, subject_code, grade, branch_code, archived_at, created_at, updated_at
       FROM class_workspaces
       WHERE user_id = ?
       ORDER BY academic_year, subject_code, grade, branch_code
       LIMIT 500`,
    )
    .bind(userId)
    .all<{
      academic_year: string;
      subject_code: string;
      grade: SchoolGrade;
      branch_code: string;
      archived_at: string | null;
      created_at: string;
      updated_at: string;
    }>();

  return (result.results ?? []).map((row) => ({
    academicYear: row.academic_year,
    subjectCode: row.subject_code,
    grade: row.grade,
    branchCode: row.branch_code,
    archivedAt: row.archived_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

export async function createClassWorkspace(
  userId: string,
  input: { subjectCode?: unknown; grade?: unknown; branchCode?: unknown },
) {
  const year = await activeAcademicYear(userId);
  const subject = subjectCode(input.subjectCode);
  if (!isClassCourse(subject)) throw new Error("Sınıf kaydı için Felsefe, Sosyoloji, Psikoloji veya Mantık seçin.");
  const classGrade = grade(input.grade);
  const branch = branchCode(input.branchCode);
  const existing = await getDatabase()
    .prepare(
      `SELECT archived_at
       FROM class_workspaces
       WHERE user_id = ? AND academic_year = ? AND subject_code = ? AND grade = ? AND branch_code = ?
       LIMIT 1`,
    )
    .bind(userId, year, subject, classGrade, branch)
    .first<{ archived_at: string | null }>();
  if (existing) {
    throw new Error(
      existing.archived_at
        ? `${classGrade}/${branch} çalışma alanı arşivde bulunuyor; yeniden etkinleştirin.`
        : `${classGrade}/${branch} çalışma alanı zaten var.`,
    );
  }
  const now = new Date().toISOString();
  const result = await getDatabase()
    .prepare(
      `INSERT INTO class_workspaces (
        id, user_id, academic_year, subject_code, grade, branch_code, archived_at, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, NULL, ?, ?)
      ON CONFLICT(user_id, academic_year, subject_code, grade, branch_code) DO NOTHING`,
    )
    .bind(crypto.randomUUID(), userId, year, subject, classGrade, branch, now, now)
    .run();
  if (!result.success) throw new Error("Sınıf çalışma alanı oluşturulamadı.");
  return listClassWorkspaces(userId);
}

export async function setClassWorkspaceArchived(
  userId: string,
  input: { id?: unknown; archived?: unknown },
) {
  if (typeof input.id !== "string" || typeof input.archived !== "boolean") {
    throw new Error("Sınıf çalışma alanı işlemi geçersiz.");
  }
  const year = await activeAcademicYear(userId);
  if (!input.archived) {
    const workspace = await getDatabase()
      .prepare(
        `SELECT subject_code
         FROM class_workspaces
         WHERE id = ? AND user_id = ? AND academic_year = ?
         LIMIT 1`,
      )
      .bind(input.id, userId, year)
      .first<{ subject_code: string }>();
    if (!workspace) throw new Error("Sınıf çalışma alanı bulunamadı.");
    if (!isClassCourse(workspace.subject_code)) throw new Error("Bu ders için sınıf kaydı desteklenmiyor.");
  }
  const now = new Date().toISOString();
  const result = await getDatabase()
    .prepare(
      `UPDATE class_workspaces
       SET archived_at = ?, updated_at = ?
       WHERE id = ? AND user_id = ? AND academic_year = ?`,
    )
    .bind(input.archived ? now : null, now, input.id, userId, year)
    .run();
  if (!result.success) throw new Error("Sınıf çalışma alanı güncellenemedi.");
  return listClassWorkspaces(userId);
}
