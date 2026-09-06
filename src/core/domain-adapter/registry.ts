import { philosophyDomainAdapter } from "./philosophy-adapter.ts";
import { sociologyDomainAdapter } from "./sociology-adapter.ts";
import type { DomainAdapter, DomainCapability } from "./types.ts";

const adapters: Readonly<Record<string, DomainAdapter>> = Object.freeze({
  philosophy: philosophyDomainAdapter,
  sociology: sociologyDomainAdapter,
});

function normalizeDisciplineCode(code: string): string {
  return code.trim().toLocaleLowerCase("en-US");
}

export function resolveDomainCapability(code: string): DomainCapability {
  const normalized = normalizeDisciplineCode(code);
  const adapter = adapters[normalized];
  if (!adapter) {
    return {
      domainCode: normalized,
      adapterFound: false,
      packageInspection: "denied",
      productRuntime: "disabled",
      pedagogicalGeneration: "disabled",
      documentGeneration: "disabled",
      aiGeneration: "disabled",
      reason: "unknown_domain",
    };
  }

  const { curriculumCore, pedagogicalMapping, productActivation } =
    adapter.readiness;
  const productRuntime =
    curriculumCore === "official_verified" &&
    pedagogicalMapping === "official_verified" &&
    productActivation === "enabled";
  const reason = productRuntime
    ? "ready"
    : curriculumCore !== "official_verified"
      ? "curriculum_core_not_verified"
      : pedagogicalMapping !== "official_verified"
        ? "pedagogical_mapping_not_verified"
        : "product_activation_disabled";

  return {
    domainCode: normalized,
    adapterFound: true,
    packageInspection: "allowed",
    productRuntime: productRuntime ? "enabled" : "disabled",
    pedagogicalGeneration: productRuntime ? "enabled" : "disabled",
    documentGeneration: productRuntime ? "enabled" : "disabled",
    aiGeneration: productRuntime ? "enabled" : "disabled",
    reason,
  };
}

export function listDomainAdapters(): DomainAdapter[] {
  return Object.values(adapters).map((adapter) => ({
    ...adapter,
    supportedGrades: [...adapter.supportedGrades],
    readiness: { ...adapter.readiness },
  }));
}

export function getDomainAdapter(code: string): DomainAdapter {
  const normalized = normalizeDisciplineCode(code);
  const adapter = adapters[normalized];
  if (!adapter) {
    throw new Error(`${normalized} branşı için domain adapter bulunamadı.`);
  }
  return {
    ...adapter,
    supportedGrades: [...adapter.supportedGrades],
    readiness: { ...adapter.readiness },
  };
}
