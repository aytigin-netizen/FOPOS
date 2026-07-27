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

  const unitCodes = new Set<string>();
  const outcomeCodes = new Set<string>();
  for (const unit of value.units) {
    if (!unit.code.trim() || unitCodes.has(unit.code)) {
      throw new Error(`Geçersiz veya yinelenen ünite kodu: ${unit.code}`);
    }
    if (!Number.isInteger(unit.grade) || unit.grade < 1 || unit.grade > 12) {
      throw new Error(`Geçersiz sınıf düzeyi: ${unit.grade}`);
    }
    unitCodes.add(unit.code);
    for (const outcome of unit.outcomes) {
      if (!outcome.code.trim() || outcomeCodes.has(outcome.code)) {
        throw new Error(
          `Geçersiz veya yinelenen öğrenme çıktısı: ${outcome.code}`,
        );
      }
      outcomeCodes.add(outcome.code);
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
