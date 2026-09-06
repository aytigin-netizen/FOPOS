import { loadPackage } from "../curriculum/package-loader.ts";
import type { DomainAdapter } from "./types.ts";

export const philosophyDomainAdapter: DomainAdapter = Object.freeze({
  discipline: Object.freeze({ code: "philosophy", name: "Felsefe" }),
  supportedGrades: Object.freeze([10, 11]),
  readiness: Object.freeze({
    curriculumCore: "official_verified",
    pedagogicalMapping: "official_verified",
    productActivation: "enabled",
  }),
  loadCurriculumPackage: () => loadPackage("philosophy"),
});
