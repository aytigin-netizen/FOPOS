import type { ExamName } from "./exam-types";
import type { SchoolGrade } from "./class-workspace";

export type ExamBlueprintTransfer = {
  schemaVersion: "1.0.0";
  grade: SchoolGrade;
  examName: ExamName;
  questions: Array<{
    outcomeCode: string;
    unitCode: string;
    maxPoints: number;
    // Sorunun bağlandığı süreç bileşeni (a, b, c, ç…); eski aktarımlarda yoktur.
    componentStep?: string;
  }>;
};

export function createExamBlueprintTransfer(
  transfer: Omit<ExamBlueprintTransfer, "schemaVersion">,
): ExamBlueprintTransfer {
  if (!transfer.questions.length)
    throw new Error("Aktarılacak sınav sorusu bulunamadı.");
  if (transfer.questions.some((question) => question.maxPoints <= 0))
    throw new Error("Sınav aktarımındaki bütün soruların puanı pozitif olmalıdır.");
  if (transfer.questions.some((question) => question.componentStep !== undefined && !question.componentStep.trim()))
    throw new Error("Sınav aktarımındaki süreç bileşeni boş olamaz.");
  if (
    transfer.questions.reduce(
      (sum, question) => sum + question.maxPoints,
      0,
    ) !== 100
  )
    throw new Error("Sınav aktarımındaki soru puanları toplamı 100 olmalıdır.");
  return { schemaVersion: "1.0.0", ...transfer };
}
