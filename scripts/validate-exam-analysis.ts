import { analyzeExam, getAnalysisDefaults } from "../modules/exam-analysis/model";

const errors: string[] = [];
const defaults = getAnalysisDefaults();
const questions = defaults.exam.bookletA;
const completed = {
  ...defaults,
  students: defaults.students.map((student, studentIndex) => ({
    ...student,
    attendance: "present" as const,
    questionScores: questions.map((question) => Math.max(0, question.points - studentIndex * 2)),
  })),
  teacherReviewed: true,
  safeSharingConfirmed: true,
};
const analysis = analyzeExam(completed);

if (analysis.classSize !== 3 || analysis.participantCount !== 3) errors.push("Katılımcı sayısı hatalı.");
if (analysis.classAverage === null || analysis.passRate === null) errors.push("Sınıf özeti üretilemedi.");
if (!analysis.validation.exportAllowed) errors.push("Tam analiz dışa aktarılamıyor.");
if (!analysis.questionAnalysis.length || !analysis.outcomeAnalysis.length) errors.push("Soru/çıktı analizi oluşmadı.");
if (analyzeExam(defaults).validation.exportAllowed) errors.push("Eksik analiz dışa aktarılabiliyor.");

const mixed = analyzeExam({
  ...completed,
  students: [
    completed.students[0],
    { ...completed.students[1], attendance: "absent", questionScores: questions.map(() => null) },
    { ...completed.students[2], attendance: "present", questionScores: questions.map(() => null) },
  ],
});
if (mixed.participantCount !== 1 || mixed.absentCount !== 1 || mixed.incompleteCount !== 1) {
  errors.push("Boş puan, sıfır ve katılmama ayrımı hatalı.");
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("Sınav analizi doğrulaması başarılı: katılım, puan, soru ve öğrenme çıktısı analizleri tutarlı.");
