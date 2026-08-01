import type { PedagogicalRecord } from "./pedagogical-record";

export type ExamDecisionMode = "standard" | "bep";

export type ExamDecisionScope = {
  readonly academicYear: string;
  readonly subjectCode: string;
  readonly datasetVersion: string;
  readonly grade: 10 | 11 | 12;
  readonly examName: string;
  readonly mode: ExamDecisionMode;
  readonly unitCodes: readonly string[];
  readonly outcomeCodes: readonly string[];
  readonly questionCount: number;
  readonly durationMinutes: number;
  readonly totalPoints: number;
  readonly adaptationKey?: string | null;
};

function requireText(value: string, label: string): string {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${label} boş olamaz.`);
  return normalized;
}

function stableFingerprint(value: string): string {
  let hash = 2166136261;
  for (const character of value) {
    hash ^= character.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0").toUpperCase();
}

function normalizedScope(scope: ExamDecisionScope) {
  const academicYear = requireText(scope.academicYear, "Öğretim yılı");
  if (!/^\d{4}-\d{4}$/u.test(academicYear)) throw new Error("Öğretim yılı YYYY-YYYY biçiminde olmalıdır.");
  const subjectCode = requireText(scope.subjectCode, "Branş").toLocaleLowerCase("en-US");
  const datasetVersion = requireText(scope.datasetVersion, "Müfredat veri seti sürümü");
  const examName = requireText(scope.examName, "Sınav türü");
  const unitCodes = [...new Set(scope.unitCodes.map((value) => requireText(value, "Ünite kodu")))].sort();
  const outcomeCodes = [...new Set(scope.outcomeCodes.map((value) => requireText(value, "Öğrenme çıktısı kodu")))].sort();
  if (!unitCodes.length || !outcomeCodes.length) throw new Error("Sınav kararı en az bir ünite ve öğrenme çıktısı içermelidir.");
  if (!Number.isInteger(scope.questionCount) || scope.questionCount < 1) throw new Error("Soru sayısı geçersiz.");
  if (!Number.isInteger(scope.durationMinutes) || scope.durationMinutes < 1) throw new Error("Sınav süresi geçersiz.");
  if (scope.totalPoints !== 100) throw new Error("Sınav paketi toplam 100 puan olmalıdır.");
  const adaptationKey = scope.mode === "bep"
    ? requireText(scope.adaptationKey ?? "", "BEP eğitimsel uyarlama türü")
    : null;
  return { ...scope, academicYear, subjectCode, datasetVersion, examName, unitCodes, outcomeCodes, adaptationKey };
}

export function examScopeFingerprint(scope: ExamDecisionScope): string {
  const value = normalizedScope(scope);
  return stableFingerprint(JSON.stringify({
    academicYear: value.academicYear,
    subjectCode: value.subjectCode,
    datasetVersion: value.datasetVersion,
    grade: value.grade,
    examName: value.examName,
    mode: value.mode,
    unitCodes: value.unitCodes,
    outcomeCodes: value.outcomeCodes,
    questionCount: value.questionCount,
    durationMinutes: value.durationMinutes,
    totalPoints: value.totalPoints,
    adaptationKey: value.adaptationKey,
  }));
}

export function examRecordId(scope: ExamDecisionScope): string {
  const value = normalizedScope(scope);
  return `OPUS-PR-EXAM-${value.academicYear}-${value.subjectCode.toLocaleUpperCase("en-US")}-G${value.grade}-${value.mode.toLocaleUpperCase("en-US")}-${examScopeFingerprint(value)}`;
}

export function createExamDecision(input: {
  readonly scope: ExamDecisionScope;
  readonly revision?: number;
  readonly previousRevision?: number | null;
}): PedagogicalRecord {
  const scope = normalizedScope(input.scope);
  const fingerprint = examScopeFingerprint(scope);
  const revision = input.revision ?? 1;
  if (!Number.isInteger(revision) || revision < 1) throw new Error("Sınav karar revizyonu geçersiz.");
  const now = new Date().toISOString();
  return {
    schemaVersion: "1.0.0",
    recordId: examRecordId(scope),
    revision,
    status: "draft",
    createdAt: now,
    updatedAt: now,
    previousRevision: input.previousRevision ?? null,
    approval: null,
    curriculum: {
      subjectCode: scope.subjectCode,
      datasetVersion: scope.datasetVersion,
      grade: scope.grade,
      unitCode: "EXAM_PACKAGE",
      outcomeCode: `EXAM.${scope.grade}.${fingerprint}`,
    },
    lessonContext: {
      week: 1,
      durationMinutes: scope.durationMinutes,
      profile: scope.mode === "bep" ? `BEP eğitimsel uyarlama: ${scope.adaptationKey}` : "Standart sınav",
    },
    pedagogicalDecision: {
      strategy: "Öğrenme çıktısı temelli sınav paketi",
      methods: ["Belirtke tablosu", "Kural tabanlı puanlama", "Öğretmen incelemesi"],
      learningEvidence: [
        `Sınav türü: ${scope.examName}`,
        `Paket: soru kâğıdı + cevap anahtarı + puanlama ölçütü`,
        `Üniteler: ${scope.unitCodes.join(", ")}`,
        `Öğrenme çıktıları: ${scope.outcomeCodes.join(", ")}`,
        `Soru/Puan: ${scope.questionCount}/${scope.totalPoints}`,
        scope.mode === "bep" ? `Eğitimsel uyarlama: ${scope.adaptationKey}` : "Uyarlama: yok",
        "Öğrenci listesi, puan verisi, tanı ve sağlık bilgisi üretim izine dahil değildir.",
      ].join(" • "),
    },
  };
}
