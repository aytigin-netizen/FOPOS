import type { CurriculumPackage } from "./package-types.ts";

const DISCIPLINE_CODE = /^[a-z][a-z0-9_-]{1,31}$/u;

export function validateCurriculumPackage(value: CurriculumPackage) {
  const code = value.manifest.discipline.code;
  if (!DISCIPLINE_CODE.test(code)) {
    throw new Error("Müfredat paketinin branş kodu geçersiz.");
  }
  if (!value.manifest.discipline.name.trim()) {
    throw new Error("Müfredat paketinin branş adı boş olamaz.");
  }
  if (!value.manifest.datasetVersion.trim()) {
    throw new Error("Müfredat paketinin veri seti sürümü gereklidir.");
  }
  if (!new Set(["ACTIVE", "ARCHIVED"]).has(value.manifest.lifecycle)) {
    throw new Error("Müfredat paketinin yaşam döngüsü geçersiz.");
  }
  if (
    !value.manifest.source.title.trim() ||
    !Number.isInteger(value.manifest.source.year) ||
    !value.manifest.source.url.startsWith("https://")
  ) {
    throw new Error("Müfredat paketinin resmî kaynak bilgisi geçersiz.");
  }

  const unitCodes = new Set<string>();
  const outcomeCodes = new Set<string>();
  const requiresCompleteCanonicalCore = code === "philosophy";
  if (requiresCompleteCanonicalCore && (!value.manifest.programRules || !value.manifest.grades)) {
    throw new Error("Felsefe canonical paketi program ve sınıf kurallarını korumalıdır.");
  }
  for (const unit of value.units) {
    if (!unit.code.trim() || unitCodes.has(unit.code)) {
      throw new Error(`Geçersiz veya yinelenen ünite kodu: ${unit.code}`);
    }
    if (!Number.isInteger(unit.grade) || unit.grade < 1 || unit.grade > 12) {
      throw new Error(`Geçersiz sınıf düzeyi: ${unit.grade}`);
    }
    if (!Number.isInteger(unit.durationHours) || unit.durationHours < 1) {
      throw new Error(`Geçersiz ünite süresi: ${unit.code}`);
    }
    if (requiresCompleteCanonicalCore) {
      if (!Number.isInteger(unit.unitNumber) || (unit.unitNumber ?? 0) < 1) {
        throw new Error(`Canonical ünite numarası geçersiz: ${unit.code}`);
      }
      if (!unit.keywords?.length || !unit.contentFramework?.length || !unit.competencyFramework) {
        throw new Error(`Canonical ünite alanları eksik: ${unit.code}`);
      }
    }
    unitCodes.add(unit.code);
    for (const outcome of unit.outcomes) {
      if (!outcome.code.trim() || outcomeCodes.has(outcome.code)) {
        throw new Error(
          `Geçersiz veya yinelenen öğrenme çıktısı: ${outcome.code}`,
        );
      }
      if (requiresCompleteCanonicalCore && !outcome.processComponents?.length) {
        throw new Error(`Canonical süreç bileşenleri eksik: ${outcome.code}`);
      }
      outcomeCodes.add(outcome.code);
    }
  }

  if (requiresCompleteCanonicalCore) {
    const programRules = value.manifest.programRules!;
    for (const [grade, summary] of Object.entries(value.manifest.grades!)) {
      const gradeNumber = Number(grade);
      const gradeUnits = value.units.filter((unit) => unit.grade === gradeNumber);
      if (
        gradeUnits.length !== summary.unitCount ||
        gradeUnits.flatMap((unit) => unit.outcomes).length !== summary.learningOutcomeCount ||
        gradeUnits.reduce((sum, unit) => sum + unit.durationHours, 0) !== summary.instructionHours ||
        summary.schoolBasedPlanningHours !== programRules.schoolBasedPlanningHoursPerGrade ||
        summary.instructionHours + summary.schoolBasedPlanningHours !==
          programRules.annualTotalHoursPerGrade
      ) {
        throw new Error(`${grade}. sınıf canonical paket özeti tutarsız.`);
      }
    }
    if (value.manifest.datasetVersion === "2024.1") {
      for (const unit of value.units) {
        if (
          !unit.purpose?.trim() ||
          !unit.canonicalLearningEvidence?.trim() ||
          !unit.learningTeachingExperiences ||
          !unit.differentiation
        ) {
          throw new Error(`2024 canonical ünite alanları eksik: ${unit.code}`);
        }
      }
    }
  }

  for (const assessment of value.assessments) {
    for (const outcomeCode of assessment.outcomeCodes) {
      if (!outcomeCodes.has(outcomeCode)) {
        throw new Error(
          `${assessment.code} ölçmesi bilinmeyen çıktıya bağlı: ${outcomeCode}`,
        );
      }
    }
  }
  return value;
}
