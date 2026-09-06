import { loadPackage } from "../curriculum/package-loader.ts";
import type { DomainAdapter } from "./types.ts";

export const sociologyDomainAdapter: DomainAdapter = Object.freeze({
  discipline: Object.freeze({ code: "sociology", name: "Sosyoloji" }),
  supportedGrades: Object.freeze([11, 12]),
  readiness: Object.freeze({
    curriculumCore: "official_verified",
    pedagogicalMapping: "missing_official_mapping",
    productActivation: "disabled",
  }),
  loadCurriculumPackage: () => loadPackage("sociology"),
});
