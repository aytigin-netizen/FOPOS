import { createId } from "./id.js";
import { assertSafeCellText, assertTabularBounds, STUDENT_IMPORT_LIMITS } from "./student-import-security.ts";

export type ManagedStudentRoster = { id: string; title: string; grade: SchoolGrade; branch: string; students: Array<{ no: string; name: string }> };

export function createManagedRoster(input: { title: string; grade: SchoolGrade; branch: string; pastedRows: string }): ManagedStudentRoster {
  const rows = input.pastedRows.trim().split(/\r?\n/).map((row) => row.split(/\t|;/));
  if (!input.pastedRows.trim()) throw new Error("Öğrenci listesi boş olamaz.");
  assertTabularBounds(rows);
  if (rows.length > STUDENT_IMPORT_LIMITS.maxStudents) throw new Error(`Liste ${STUDENT_IMPORT_LIMITS.maxStudents} öğrenci sınırını aşıyor.`);
  const seen = new Set<string>();
  const students = rows.map((row, index) => {
    const no = assertSafeCellText(row[0], `${index + 1}. satır öğrenci numarası`), name = assertSafeCellText(row[1], `${index + 1}. satır ad soyad`);
    if (!no || !name) throw new Error(`${index + 1}. satırda öğrenci numarası veya ad soyad eksik.`);
    if (seen.has(no)) throw new Error(`${index + 1}. satırda yinelenen öğrenci numarası var: ${no}`);
    seen.add(no); return { no, name };
  });
  const title = assertSafeCellText(input.title, "Liste adı");
  if (!title) throw new Error("Liste adı boş olamaz.");
  return { id: `OPUS-ROSTER-${createId()}`, title, grade: input.grade, branch: input.branch, students };
}
import type { SchoolGrade } from "./class-workspace";
