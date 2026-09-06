import type { CurriculumPackage, Discipline } from "../curriculum/package-types.ts";

export type DomainStatus =
  | "official_verified"
  | "package_verified"
  | "mismatch"
  | "missing_official_mapping"
  | "teacher_review";

export type DomainAdapterReadiness = {
  readonly curriculumCore: DomainStatus;
  readonly pedagogicalMapping: DomainStatus;
  readonly productActivation: "disabled" | "controlled" | "enabled";
};

export type DomainAdapter = {
  readonly discipline: Discipline;
  readonly supportedGrades: readonly number[];
  readonly readiness: DomainAdapterReadiness;
  loadCurriculumPackage(): CurriculumPackage;
};
