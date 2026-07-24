import { analyzeExam, getAnalysisDefaults } from "../modules/exam-analysis/model";
import { createDecisionSupport } from "../modules/fopos-ai/model";

const defaults = getAnalysisDefaults();
const questions = defaults.exam.bookletA;
const analysis = analyzeExam({
  ...defaults,
  students: Array.from({ length: 6 }, (_, index) => ({
    ...defaults.students[index % defaults.students.length],
    id: `anonymous-${index}`,
    attendance: "present" as const,
    questionScores: questions.map((question) => Math.max(0, question.points - index)),
  })),
});
const support = createDecisionSupport(analysis);
const errors: string[] = [];
if (support.status !== "suggestion") errors.push("AI çıktısı öneri olarak işaretlenmedi.");
if (support.confidence !== "adequate") errors.push("Yeterli kanıt güven düzeyi hatalı.");
if (!support.recommendations.every((item) => item.evidence.participantCount > 0)) errors.push("Kanıtsız öneri üretildi.");
if (!support.governance.teacherApprovalRequired || support.governance.changesOfficialRecords) errors.push("İnsan kontrolü ihlal edildi.");
if (!support.privacy.aggregateDataOnly || support.privacy.studentNamesReceived) errors.push("Gizlilik sınırı ihlal edildi.");
if (createDecisionSupport(analyzeExam(defaults)).recommendations.length) errors.push("Yetersiz kanıtla öneri üretildi.");
if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
console.log("FOPOS AI doğrulaması başarılı: kanıt, gizlilik ve öğretmen onay sınırları korunuyor.");
