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

export type DomainCapability = {
  readonly domainCode: string;
  readonly adapterFound: boolean;
  readonly packageInspection: "allowed" | "denied";
  readonly productRuntime: "enabled" | "disabled";
  readonly pedagogicalGeneration: "enabled" | "disabled";
  readonly documentGeneration: "enabled" | "disabled";
  readonly aiGeneration: "enabled" | "disabled";
  readonly reason:
    | "ready"
    | "unknown_domain"
    | "curriculum_core_not_verified"
    | "pedagogical_mapping_not_verified"
    | "product_activation_disabled";
};

export type DomainAdapter = {
  readonly discipline: Discipline;
  readonly supportedGrades: readonly number[];
  readonly readiness: DomainAdapterReadiness;
  loadCurriculumPackage(): CurriculumPackage;
};
