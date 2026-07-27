import { createCurriculumCatalog, type CurriculumCatalog } from "./curriculum-catalog.ts";
import type { CurriculumDatasetDescriptor } from "./curriculum-registry.ts";

export type CanonicalCurriculumOutcome = Readonly<{ outcome_code: string } & Record<string, unknown>>;
export type CanonicalCurriculumUnit = Readonly<{
  grade: number;
  unit_code: string;
  learning_outcomes: readonly CanonicalCurriculumOutcome[];
} & Record<string, unknown>>;
export type CanonicalCurriculumDataset = Readonly<{
  schema_version: string;
  dataset_version: string;
  grades: Readonly<Record<string, Readonly<{ units: readonly CanonicalCurriculumUnit[] } & Record<string, unknown>>>>;
} & Record<string, unknown>>;

export type LoadedCurriculumDataset = Readonly<{
  descriptor: CurriculumDatasetDescriptor;
  dataset: CanonicalCurriculumDataset;
  units: readonly CanonicalCurriculumUnit[];
  catalog: CurriculumCatalog;
}>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function invalid(key: string, detail: string): never {
  throw new Error(`${key} ${detail}`);
}

export function loadCurriculumDataset(
  descriptor: CurriculumDatasetDescriptor,
  input: unknown,
): LoadedCurriculumDataset {
  if (!isRecord(input)) invalid(descriptor.key, "veri seti nesne olmalıdır.");
  if (input.schema_version !== descriptor.schemaVersion) invalid(descriptor.key, "şema sürümü uyuşmuyor.");
  if (input.dataset_version !== descriptor.datasetVersion) invalid(descriptor.key, "veri seti sürümü uyuşmuyor.");
  if (!isRecord(input.grades)) invalid(descriptor.key, "sınıf kayıtları bulunamadı.");

  const units: CanonicalCurriculumUnit[] = [];
  for (const [gradeKey, gradeValue] of Object.entries(input.grades)) {
    if (!isRecord(gradeValue) || !Array.isArray(gradeValue.units)) {
      invalid(descriptor.key, `${gradeKey}. sınıf üniteleri geçersiz.`);
    }
    for (const candidate of gradeValue.units) {
      if (!isRecord(candidate) || !Number.isInteger(candidate.grade) || String(candidate.grade) !== gradeKey ||
          typeof candidate.unit_code !== "string" || !candidate.unit_code.trim() || !Array.isArray(candidate.learning_outcomes)) {
        invalid(descriptor.key, `${gradeKey}. sınıfta geçersiz ünite içeriyor.`);
      }
      const outcomes: CanonicalCurriculumOutcome[] = candidate.learning_outcomes.map((outcome) => {
        if (!isRecord(outcome) || typeof outcome.outcome_code !== "string" || !outcome.outcome_code.trim()) {
          invalid(descriptor.key, `${candidate.unit_code} ünitesinde geçersiz öğrenme çıktısı içeriyor.`);
        }
        return outcome as CanonicalCurriculumOutcome;
      });
      units.push({ ...candidate, grade: candidate.grade, unit_code: candidate.unit_code, learning_outcomes: outcomes });
    }
  }
  if (!units.length) invalid(descriptor.key, "hiç ünite içermiyor.");

  const unitCodes = units.map((unit) => unit.unit_code);
  const outcomeCodes = units.flatMap((unit) => unit.learning_outcomes.map((outcome) => outcome.outcome_code));
  if (new Set(unitCodes).size !== unitCodes.length) invalid(descriptor.key, "yinelenen ünite kodu içeriyor.");
  if (new Set(outcomeCodes).size !== outcomeCodes.length) invalid(descriptor.key, "yinelenen öğrenme çıktısı kodu içeriyor.");

  const dataset = input as CanonicalCurriculumDataset;
  const catalog = createCurriculumCatalog({
    datasetVersion: descriptor.datasetVersion,
    subject: descriptor.subject,
    units: units.map((unit) => ({
      grade: unit.grade,
      code: unit.unit_code,
      outcomeCodes: unit.learning_outcomes.map((outcome) => outcome.outcome_code),
    })),
  });
  return Object.freeze({ descriptor, dataset, units: Object.freeze(units), catalog });
}
