import { createExam, getExamDefaults } from "@/modules/exam-generator/model";
import type { ExamAnalysis, ExamAnalysisInput, OutcomePriority, StudentScoreRow } from "@/modules/exam-analysis/types";

export function getAnalysisDefaults(): ExamAnalysisInput {
  const exam = createExam({ ...getExamDefaults(), teacherApproved: true });
  return {
    exam,
    students: [
      createStudent("101", "Örnek Öğrenci 1", exam.bookletA.length),
      createStudent("102", "Örnek Öğrenci 2", exam.bookletA.length),
      createStudent("103", "Örnek Öğrenci 3", exam.bookletA.length),
    ],
    teacherReviewed: false,
    safeSharingConfirmed: false,
  };
}

export function createStudent(schoolNumber: string, fullName: string, questionCount: number): StudentScoreRow {
  return {
    id: `${schoolNumber}-${fullName}`.toLocaleLowerCase("tr-TR").replace(/\s+/g, "-"),
    schoolNumber,
    fullName,
    attendance: "undecided",
    questionScores: Array.from({ length: questionCount }, () => null),
    controlScore: null,
  };
}

export function parseStudentList(value: string, questionCount: number): StudentScoreRow[] {
  const rows = value.split(/\r?\n/).map((row) => row.trim()).filter(Boolean);
  if (rows.length > 1000) throw new Error("Öğrenci listesi 1000 satırı aşamaz.");
  return rows.flatMap((row) => {
    if (/^[=+\-@]/.test(row)) throw new Error("Formül veya dış bağlantı içeren hücre kabul edilmez.");
    const cells = row.split(/[;\t,]/).map((cell) => cell.trim()).filter(Boolean);
    if (cells.length > 64) throw new Error("Bir satır 64 sütunu aşamaz.");
    const numberIndex = cells.findIndex((cell) => /^\d{1,10}$/.test(cell));
    if (numberIndex < 0) return [];
    const name = cells.filter((_, cellIndex) => cellIndex !== numberIndex).join(" ").slice(0, 120);
    if (!name || /adı soyadı|okul numarası|imza|açıklama/i.test(name)) return [];
    return [createStudent(cells[numberIndex], name, questionCount)];
  }).filter((student, index, all) => all.findIndex((item) => item.schoolNumber === student.schoolNumber) === index);
}

export function calculateStudentTotal(student: StudentScoreRow): number | null {
  if (student.attendance !== "present" || student.questionScores.some((score) => score === null)) return null;
  return student.questionScores.reduce<number>((sum, score) => sum + (score ?? 0), 0);
}

export function analyzeExam(input: ExamAnalysisInput): ExamAnalysis {
  const questions = input.exam.bookletA;
  const examScoreIs100 = questions.reduce((sum, question) => sum + question.points, 0) === 100;
  const scoresWithinLimits = input.students.every((student) => student.questionScores.every(
    (score, index) => score === null || (score >= 0 && score <= questions[index].points),
  ));
  const resolved = input.students.filter((student) => student.attendance === "absent" || calculateStudentTotal(student) !== null);
  const participants = input.students.filter((student) => calculateStudentTotal(student) !== null);
  const totals = participants.map((student) => calculateStudentTotal(student) as number);
  const questionAnalysis = questions.map((question, index) => {
    const scores = participants.map((student) => student.questionScores[index] as number);
    const averageScore = average(scores);
    return {
      question,
      participantCount: scores.length,
      averageScore,
      achievementRate: question.points ? round(averageScore / question.points * 100) : 0,
    };
  });
  const outcomeCodes = [...new Set(questions.map((question) => question.outcomeCode))];
  const outcomeAnalysis = outcomeCodes.map((outcomeCode) => {
    const rows = questionAnalysis.filter((item) => item.question.outcomeCode === outcomeCode);
    const earned = rows.reduce((sum, row) => sum + row.averageScore, 0);
    const possible = rows.reduce((sum, row) => sum + row.question.points, 0);
    const achievementRate = possible ? round(earned / possible * 100) : 0;
    const priority = priorityFor(achievementRate);
    return {
      outcomeCode,
      participantCount: participants.length,
      achievementRate,
      priority,
      evidence: `${rows.length} soru, ${participants.length} katılımcı, %${achievementRate} başarı`,
      intervention: interventionFor(priority),
    };
  }).sort((a, b) => a.achievementRate - b.achievementRate);
  const allRowsResolved = resolved.length === input.students.length && input.students.length > 0;
  const exportAllowed = examScoreIs100 && allRowsResolved && scoresWithinLimits
    && input.teacherReviewed && input.safeSharingConfirmed;

  return {
    status: "draft",
    classSize: input.students.length,
    participantCount: participants.length,
    absentCount: input.students.filter((student) => student.attendance === "absent").length,
    incompleteCount: input.students.length - resolved.length,
    classAverage: totals.length ? round(average(totals)) : null,
    passRate: totals.length ? round(totals.filter((score) => score >= 50).length / totals.length * 100) : null,
    questionAnalysis,
    outcomeAnalysis,
    strongestOutcome: outcomeAnalysis.length ? outcomeAnalysis[outcomeAnalysis.length - 1] : null,
    weakestOutcome: outcomeAnalysis[0] ?? null,
    validation: {
      examScoreIs100,
      allRowsResolved,
      scoresWithinLimits,
      teacherReviewed: input.teacherReviewed,
      safeSharingConfirmed: input.safeSharingConfirmed,
      exportAllowed,
    },
  };
}

function priorityFor(rate: number): OutcomePriority {
  if (rate < 50) return "critical";
  if (rate < 70) return "monitor";
  return "sufficient";
}

function interventionFor(priority: OutcomePriority): string {
  if (priority === "critical") return "Yeniden öğretim, kavram yanılgısı çalışması ve kısa izleme uygulaması planlayın.";
  if (priority === "monitor") return "Felsefi metin çözümleme ve gerekçeli tartışmayla öğrenmeyi pekiştirin.";
  return "Transfer ve karşılaştırma görevleriyle yeterliği sürdürün.";
}

function average(values: readonly number[]): number {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function round(value: number): number {
  return Math.round(value * 10) / 10;
}
