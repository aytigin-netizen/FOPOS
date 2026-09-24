import { resolveCurriculumPackage } from "../curriculum/curriculum-resolver.ts";
import {
  domainStatusFromOfficialVerification,
  type DomainAdapter,
} from "./types.ts";

const loadCurriculumPackage = () =>
  resolveCurriculumPackage({
    disciplineCode: "philosophy",
    datasetVersion: "2026.1",
  }).curriculumPackage;

export const philosophyDomainAdapter: DomainAdapter = Object.freeze({
  discipline: Object.freeze({ code: "philosophy", name: "Felsefe" }),
  supportedGrades: Object.freeze([10, 11]),
  readiness: Object.freeze({
    curriculumCore: domainStatusFromOfficialVerification(
      loadCurriculumPackage().manifest.verification.status,
    ),
    pedagogicalMapping: "official_verified",
    productActivation: "enabled",
  }),
  loadCurriculumPackage,
});
