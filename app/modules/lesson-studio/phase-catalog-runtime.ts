import { philosophyPhaseCatalog2026 } from "./phase-catalog-2026.ts";
import { specialPhaseCatalog, type PhaseCatalog } from "./phase-catalog.ts";

export function phaseCatalogForDataset(datasetVersion: string): PhaseCatalog {
  return datasetVersion === "2026.1"
    ? philosophyPhaseCatalog2026
    : specialPhaseCatalog;
}
