import { CurriculumFeatureUnavailableError } from "../../core/curriculum-feature-unavailable.ts";
import { philosophyPhaseCatalog2026 } from "./phase-catalog-2026.ts";
import { sociologyPhaseCatalog2026 } from "./phase-catalog-sociology-2026.ts";
import { type PhaseCatalog } from "./phase-catalog.ts";

export function phaseCatalogForDataset(
  subjectCode: string,
  datasetVersion: string,
): PhaseCatalog {
  if (subjectCode === "philosophy" && datasetVersion === "2026.1") {
    return philosophyPhaseCatalog2026;
  }
  if (subjectCode === "sociology" && datasetVersion === "2026.1") {
    return sociologyPhaseCatalog2026;
  }
  throw new CurriculumFeatureUnavailableError(
    "Ders Tasarım Stüdyosu aşama kataloğu",
    subjectCode,
    datasetVersion,
  );
}
