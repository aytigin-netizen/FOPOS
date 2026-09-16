import { resolveCurriculumPackage } from "../curriculum/curriculum-resolver.ts";
import {
  domainStatusFromOfficialVerification,
  type DomainAdapter,
} from "./types.ts";

const loadCurriculumPackage = () =>
  resolveCurriculumPackage({
    disciplineCode: "sociology",
    datasetVersion: "2026.1",
  }).curriculumPackage;

export const sociologyDomainAdapter: DomainAdapter = Object.freeze({
  discipline: Object.freeze({ code: "sociology", name: "Sosyoloji" }),
  supportedGrades: Object.freeze([11, 12]),
  readiness: Object.freeze({
    curriculumCore: domainStatusFromOfficialVerification(
      loadCurriculumPackage().manifest.verification.status,
    ),
    pedagogicalMapping: "missing_official_mapping",
    productActivation: "disabled",
  }),
  loadCurriculumPackage,
});
