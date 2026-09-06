import { philosophyDomainAdapter } from "./philosophy-adapter.ts";
import { sociologyDomainAdapter } from "./sociology-adapter.ts";
import type { DomainAdapter } from "./types.ts";

const adapters: Readonly<Record<string, DomainAdapter>> = Object.freeze({
  philosophy: philosophyDomainAdapter,
  sociology: sociologyDomainAdapter,
});

function normalizeDisciplineCode(code: string): string {
  return code.trim().toLocaleLowerCase("en-US");
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
