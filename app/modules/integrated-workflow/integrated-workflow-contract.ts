import type { ExamBlueprintTransfer } from "../../core/exam-blueprint-transfer.ts";
import type { PedagogicalRecord } from "../../core/pedagogical-record.ts";
import type { Unit } from "../../data/curriculum.ts";
import { getOutcomeForWeek } from "../lesson-studio/week-outcome.ts";

export type IntegratedWorkflowScope = Readonly<{
  academicYear: string;
  subjectCode: string;
  datasetVersion: string;
  grade: 10 | 11;
  unitCode: string;
  week: number;
  outcomeCode: string;
  revision: number;
  key: string;
}>;

type IntegratedWorkflowChain = Readonly<{
  annualPlan: PedagogicalRecord;
  dailyPlan: PedagogicalRecord;
  departmentMeeting: PedagogicalRecord;
  standardExam: PedagogicalRecord;
  bepExam: PedagogicalRecord;
  examAnalysisTransfer: ExamBlueprintTransfer;
}>;

function requireText(value: string, label: string) {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${label} boş olamaz.`);
  return normalized;
}

function token(value: string) {
  return value
    .toLocaleUpperCase("en-US")
    .replace(/[^A-Z0-9.-]+/gu, "-")
    .replace(/^-|-$/gu, "");
}

export function createIntegratedWorkflowScope(input: {
  academicYear: string;
  subjectCode: string;
  datasetVersion: string;
  unit: Unit;
  week: number;
  outcomeCode: string;
  revision?: number;
}): IntegratedWorkflowScope {
  const academicYear = requireText(input.academicYear, "Öğretim yılı");
  if (!/^\d{4}-\d{4}$/u.test(academicYear))
    throw new Error("Öğretim yılı YYYY-YYYY biçiminde olmalıdır.");
  const subjectCode = requireText(input.subjectCode, "Branş").toLocaleLowerCase("en-US");
  const datasetVersion = requireText(input.datasetVersion, "Müfredat veri seti sürümü");
  const outcomeCode = requireText(input.outcomeCode, "Öğrenme çıktısı");
  const grade = input.unit.grade;
  if (grade !== 10 && grade !== 11)
    throw new Error("Bütünleşik FOPOS iş akışı yalnız 10. ve 11. sınıf kapsamını kabul eder.");
  const revision = input.revision ?? 1;
  if (!Number.isInteger(revision) || revision < 1)
    throw new Error("Bütünleşik iş akışı karar revizyonu geçersiz.");
  const expectedOutcome = getOutcomeForWeek(input.unit, input.week);
  if (expectedOutcome.code !== outcomeCode) {
    throw new Error(
      `${input.unit.code} ${input.week}. hafta ${expectedOutcome.code} çıktısına bağlıdır; ${outcomeCode} kullanılamaz.`,
    );
  }
  const base = [
    academicYear,
    subjectCode,
    datasetVersion,
    `G${grade}`,
    input.unit.code,
    `H${input.week}`,
    outcomeCode,
    `R${revision}`,
  ].map(token).join("-");
  return Object.freeze({
    academicYear,
    subjectCode,
    datasetVersion,
    grade,
    unitCode: input.unit.code,
    week: input.week,
    outcomeCode,
    revision,
    key: `OPUS-IWR-${base}`,
  });
}

export function integratedWorkflowReference(scope: IntegratedWorkflowScope) {
  return `Bütünleşik kapsam: ${scope.key}`;
}

function assertCommonRecordContext(record: PedagogicalRecord, scope: IntegratedWorkflowScope, label: string) {
  if (
    record.curriculum.subjectCode !== scope.subjectCode ||
    record.curriculum.datasetVersion !== scope.datasetVersion ||
    record.curriculum.grade !== scope.grade
  ) {
    throw new Error(`${label} branş, müfredat sürümü veya sınıf bakımından bütünleşik kapsamla uyuşmuyor.`);
  }
}

function assertEvidence(record: PedagogicalRecord, value: string, label: string) {
  if (!record.pedagogicalDecision.learningEvidence.includes(value))
    throw new Error(`${label} bütünleşik kapsam kanıtını taşımıyor: ${value}`);
}

export function assertIntegratedWorkflowChain(
  scope: IntegratedWorkflowScope,
  chain: IntegratedWorkflowChain,
) {
  assertCommonRecordContext(chain.annualPlan, scope, "Yıllık plan");
  assertEvidence(chain.annualPlan, scope.outcomeCode, "Yıllık plan");

  assertCommonRecordContext(chain.dailyPlan, scope, "Günlük plan");
  if (
    chain.dailyPlan.curriculum.unitCode !== scope.unitCode ||
    chain.dailyPlan.curriculum.outcomeCode !== scope.outcomeCode ||
    chain.dailyPlan.lessonContext.week !== scope.week
  ) throw new Error("Günlük plan ünite, hafta veya öğrenme çıktısı bakımından bütünleşik kapsamla uyuşmuyor.");

  assertCommonRecordContext(chain.departmentMeeting, scope, "Zümre tutanağı");
  assertEvidence(chain.departmentMeeting, integratedWorkflowReference(scope), "Zümre tutanağı");

  for (const [label, record, adaptation] of [
    ["Standart sınav", chain.standardExam, "Uyarlama: yok"],
    ["BEP sınavı", chain.bepExam, "Eğitimsel uyarlama:"],
  ] as const) {
    assertCommonRecordContext(record, scope, label);
    assertEvidence(record, `Üniteler: ${scope.unitCode}`, label);
    assertEvidence(record, `Öğrenme çıktıları: ${scope.outcomeCode}`, label);
    assertEvidence(record, adaptation, label);
  }

  const transfer = chain.examAnalysisTransfer;
  if (transfer.grade !== scope.grade)
    throw new Error("Sınav analizi aktarımı sınıf bakımından bütünleşik kapsamla uyuşmuyor.");
  if (transfer.questions.reduce((sum, question) => sum + question.maxPoints, 0) !== 100)
    throw new Error("Sınav analizi aktarımı 100 puan bütünlüğünü korumuyor.");
  if (!transfer.questions.some((question) =>
    question.unitCode === scope.unitCode && question.outcomeCode === scope.outcomeCode
  )) throw new Error("Sınav analizi aktarımı pilot ünite ve öğrenme çıktısını taşımıyor.");

  return Object.freeze({
    scopeKey: scope.key,
    unitCode: scope.unitCode,
    week: scope.week,
    outcomeCode: scope.outcomeCode,
    standardAndBepShareOutcome: true,
    examAnalysisTotalPoints: 100,
    documentStages: Object.freeze([
      "annual-plan",
      "daily-plan",
      "department-meeting-minutes",
      "standard-exam",
      "bep-exam",
      "exam-analysis",
    ]),
  });
}
