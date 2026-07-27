import { resolveCatalogUnit } from "./curriculum-catalog.ts";
import type { LoadedCurriculumDataset, CanonicalCurriculumUnit } from "./curriculum-loader.ts";
import type { CurriculumRegistry } from "./curriculum-registry.ts";

export type CurriculumResolution =
  | { ok: true; descriptorKey: string; dataset: LoadedCurriculumDataset["dataset"]; unit: CanonicalCurriculumUnit }
  | { ok: false; code: "DATASET_NOT_FOUND" | "DATASET_NOT_LOADED" | "UNIT_NOT_FOUND"; message: string };

export function resolveCurriculumUnit(input: {
  registry: CurriculumRegistry;
  loadedDatasets: ReadonlyMap<string, LoadedCurriculumDataset>;
  subjectCode: string;
  datasetVersion: string;
  grade: number;
  unitCode: string;
}): CurriculumResolution {
  const descriptor = input.registry.find(input.subjectCode, input.datasetVersion);
  if (!descriptor) {
    return { ok: false, code: "DATASET_NOT_FOUND", message: `${input.subjectCode}@${input.datasetVersion} müfredat kaydı bulunamadı.` };
  }
  const loaded = input.loadedDatasets.get(descriptor.key);
  if (!loaded || loaded.descriptor.key !== descriptor.key) {
    return { ok: false, code: "DATASET_NOT_LOADED", message: `${descriptor.key} müfredat veri seti yüklenmedi.` };
  }
  const resolution = resolveCatalogUnit(loaded.catalog, descriptor.subject.code, input.grade, input.unitCode);
  if (!resolution.ok) return { ok: false, code: "UNIT_NOT_FOUND", message: resolution.message };
  const unit = loaded.units.find((candidate) => candidate.grade === input.grade && candidate.unit_code === input.unitCode);
  return unit
    ? { ok: true, descriptorKey: descriptor.key, dataset: loaded.dataset, unit }
    : { ok: false, code: "UNIT_NOT_FOUND", message: `${input.unitCode} kodlu ünite yüklenen veri setinde bulunamadı.` };
}
