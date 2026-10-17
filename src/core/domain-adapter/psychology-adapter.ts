// src/core/domain-adapter/psychology-adapter.ts
// Controlled seviye — üretim kapalı, katalog görünür

import { resolveCurriculumPackage } from "../curriculum/curriculum-resolver.ts";
import type { DomainAdapter } from "./types.ts";

const loadCurriculumPackage = () =>
  resolveCurriculumPackage({
    disciplineCode: "psychology",
    datasetVersion: "2026.1",
  }).curriculumPackage;

export const psychologyDomainAdapter: DomainAdapter = Object.freeze({
  discipline: Object.freeze({ code: "psychology", name: "Psikoloji" }),
  supportedGrades: Object.freeze([11]),
  readiness: Object.freeze({
    curriculumCore: "missing_official_mapping",
    pedagogicalMapping: "teacher_review",
    productActivation: "controlled",
  }),
  loadCurriculumPackage,
});
