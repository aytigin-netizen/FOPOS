import type { Grade, Unit } from "../data/curriculum";
import type { PedagogicalRecord } from "./pedagogical-record";

export type AnnualPlanScope = {
  readonly academicYear: string;
  readonly subjectCode: string;
  readonly datasetVersion: string;
  readonly grade: Grade;
};

function scopeToken(value: string) {
  return value.toLocaleUpperCase("en-US").replace(/[^A-Z0-9-]+/gu, "-").replace(/^-|-$/gu, "");
}

export function annualPlanRecordId(scope: AnnualPlanScope) {
  return `OPUS-PR-ANNUAL-${scopeToken(scope.academicYear)}-${scopeToken(scope.subjectCode)}-G${scope.grade}`;
}

export function createAnnualPlanDecision(input: {
  readonly scope: AnnualPlanScope;
  readonly units: readonly Unit[];
  readonly revision?: number;
  readonly previousRevision?: number | null;
}): PedagogicalRecord {
  const scopeUnits = input.units.filter(
    (unit) => unit.grade === input.scope.grade && (unit.subjectCode ?? "philosophy") === input.scope.subjectCode,
  );
  if (scopeUnits.length === 0) {
    throw new Error("Yıllık plan için sınıf ve branşla eşleşen müfredat bulunamadı.");
  }
  const outcomeCodes = scopeUnits.flatMap((unit) => unit.outcomes.map((outcome) => outcome.code));
  if (outcomeCodes.length === 0) {
    throw new Error("Yıllık planın öğrenme çıktısı kapsamı boş olamaz.");
  }
  const now = new Date().toISOString();
  const revision = input.revision ?? 1;
  return {
    schemaVersion: "1.0.0",
    recordId: annualPlanRecordId(input.scope),
    revision,
    status: "draft",
    createdAt: now,
    updatedAt: now,
    previousRevision: input.previousRevision ?? null,
    approval: null,
    curriculum: {
      subjectCode: input.scope.subjectCode,
      datasetVersion: input.scope.datasetVersion,
      grade: input.scope.grade,
      unitCode: "ANNUAL_PLAN",
      outcomeCode: `ANNUAL.${input.scope.grade}.${scopeToken(input.scope.academicYear)}`,
    },
    lessonContext: {
      week: 1,
      durationMinutes: scopeUnits.reduce((total, unit) => total + unit.hours, 0) * 40,
      profile: input.scope.academicYear,
    },
    pedagogicalDecision: {
      strategy: "Öğretim yılı müfredat dağılımı",
      methods: ["Haftalık ünite ve öğrenme çıktısı dağılımı", "MEB çalışma takvimi doğrulaması"],
      learningEvidence: outcomeCodes.join(" • "),
    },
  };
}
