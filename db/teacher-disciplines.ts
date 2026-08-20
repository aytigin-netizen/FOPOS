import { getDatabase } from "./runtime-env.ts";

export type TeacherDisciplineAssignment = {
  disciplineCode: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};

const CODE_PATTERN = /^[a-z][a-z0-9_-]{1,31}$/u;
const MAX_ASSIGNMENTS = 8;

function disciplineCode(value: unknown) {
  if (typeof value !== "string") throw new Error("Branş kodu geçersiz.");
  const normalized = value.trim().toLocaleLowerCase("en-US");
  if (!CODE_PATTERN.test(normalized)) {
    throw new Error("Branş kodu geçersiz.");
  }
  return normalized;
}

export async function ensureDefaultTeacherDiscipline(userId: string) {
  const now = new Date().toISOString();
  const result = await getDatabase()
    .prepare(
      `INSERT INTO teacher_discipline_assignments (
        id, user_id, discipline_code, is_default, created_at, updated_at
      )
      SELECT ?, ?, 'philosophy', 1, ?, ?
      WHERE NOT EXISTS (
        SELECT 1 FROM teacher_discipline_assignments WHERE user_id = ?
      )`,
    )
    .bind(crypto.randomUUID(), userId, now, now, userId)
    .run();
  if (!result.success) {
    throw new Error("Varsayılan öğretmen branşı doğrulanamadı.");
  }
}

export async function listTeacherDisciplines(
  userId: string,
): Promise<TeacherDisciplineAssignment[]> {
  const result = await getDatabase()
    .prepare(
      `SELECT discipline_code, is_default, created_at, updated_at
       FROM teacher_discipline_assignments
       WHERE user_id = ?
       ORDER BY is_default DESC, discipline_code
       LIMIT ?`,
    )
    .bind(userId, MAX_ASSIGNMENTS)
    .all<{
      discipline_code: string;
      is_default: number;
      created_at: string;
      updated_at: string;
    }>();
  return (result.results ?? []).map((row) => ({
    disciplineCode: row.discipline_code,
    isDefault: row.is_default === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

export async function replaceTeacherDisciplines(
  userId: string,
  input: Array<{ disciplineCode?: unknown; isDefault?: unknown }>,
) {
  if (!Array.isArray(input) || input.length < 1 || input.length > MAX_ASSIGNMENTS) {
    throw new Error("Öğretmen 1–8 branşa atanmalıdır.");
  }
  const assignments = input.map((item) => ({
    disciplineCode: disciplineCode(item.disciplineCode),
    isDefault: item.isDefault === true,
  }));
  if (new Set(assignments.map((item) => item.disciplineCode)).size !== assignments.length) {
    throw new Error("Aynı branş birden fazla atanamaz.");
  }
  if (assignments.filter((item) => item.isDefault).length !== 1) {
    throw new Error("Tam olarak bir varsayılan branş seçilmelidir.");
  }

  const active = await getDatabase()
    .prepare(
      `SELECT DISTINCT subject_code
       FROM class_workspaces
       WHERE user_id = ? AND archived_at IS NULL`,
    )
    .bind(userId)
    .all<{ subject_code: string }>();
  const nextCodes = new Set(assignments.map((item) => item.disciplineCode));
  const blocked = (active.results ?? []).find(
    (row) => !nextCodes.has(row.subject_code),
  );
  if (blocked) {
    throw new Error(
      `${blocked.subject_code} branşı etkin sınıf çalışma alanında kullanılıyor.`,
    );
  }

  const now = new Date().toISOString();
  const db = getDatabase();
  const results = await db.batch([
    db
      .prepare("DELETE FROM teacher_discipline_assignments WHERE user_id = ?")
      .bind(userId),
    ...assignments.map((item) =>
      db
        .prepare(
          `INSERT INTO teacher_discipline_assignments (
            id, user_id, discipline_code, is_default, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?)`,
        )
        .bind(
          crypto.randomUUID(),
          userId,
          item.disciplineCode,
          item.isDefault ? 1 : 0,
          now,
          now,
        ),
    ),
  ]);
  if (results.some((result) => !result.success)) {
    throw new Error("Öğretmen branş atamaları güncellenemedi.");
  }
  return listTeacherDisciplines(userId);
}
