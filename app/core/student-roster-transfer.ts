import { createId } from "./id.js";

export type StudentRosterTransfer = {
  schemaVersion: "1.0.0";
  transferId: string;
  grade: SchoolGrade;
  branch: string;
  students: Array<{ no: string; name: string }>;
};

export function createStudentRosterTransfer(input: { grade: SchoolGrade; branch: string; students: Array<{ no: string; name: string }> }): StudentRosterTransfer {
  const branch = input.branch.trim().toLocaleUpperCase("tr-TR");
  if (!branch) throw new Error("Aktarım için şube bilgisi gereklidir.");
  if (!input.students.length) throw new Error("Aktarılacak öğrenci listesi boş olamaz.");
  if (input.students.length > 500) throw new Error("Aktarım 500 öğrenci sınırını aşıyor.");
  const seen = new Set<string>();
  const students = input.students.map((student, index) => {
    const no = student.no.trim(), name = student.name.trim();
    if (!no || !name) throw new Error(`${index + 1}. öğrencinin numarası veya adı eksik.`);
    if (seen.has(no)) throw new Error(`Aktarımda yinelenen öğrenci numarası var: ${no}`);
    seen.add(no);
    return { no, name };
  });
  return { schemaVersion: "1.0.0", transferId: `OPUS-ROSTER-${createId()}`, grade: input.grade, branch, students };
}
import type { SchoolGrade } from "./class-workspace";
