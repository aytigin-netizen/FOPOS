import { getCurriculumRegistration } from "./curriculum-registry.ts";
import { loadPackage } from "./package-loader.ts";
import type { CurriculumPackage } from "./package-types.ts";

export type CurriculumResolution = {
  curriculumPackage: CurriculumPackage;
  disciplineCode: string;
  source: "active_branch" | "default_branch" | "loader";
};

export function resolveCurriculumPackage(input: {
  activeBranch?: string | null;
  defaultBranch?: string | null;
} = {}): CurriculumResolution {
  const candidates = [
    ["active_branch", input.activeBranch],
    ["default_branch", input.defaultBranch],
  ] as const;

  for (const [source, code] of candidates) {
    if (!code?.trim()) continue;
    const registration = getCurriculumRegistration(code);
    if (registration) {
      return {
        curriculumPackage: registration.load(),
        disciplineCode: registration.discipline.code,
        source,
      };
    }
  }

  const curriculumPackage = loadPackage();
  return {
    curriculumPackage,
    disciplineCode: curriculumPackage.manifest.discipline.code,
    source: "loader",
  };
}
