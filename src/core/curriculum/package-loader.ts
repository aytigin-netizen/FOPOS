import type { CurriculumPackage } from "./package-types.ts";
import { validateCurriculumPackage } from "./validation.ts";

const philosophyPackage: CurriculumPackage = {
  manifest: {
    schemaVersion: "1.0.0",
    datasetVersion: "2024.1",
    discipline: { code: "philosophy", name: "Felsefe" },
    defaultGrade: 10,
  },
  units: [],
  assessments: [],
};

const packages: Readonly<Record<string, CurriculumPackage>> = Object.freeze({
  philosophy: philosophyPackage,
});

export function loadPackage(
  disciplineCode = "philosophy",
): CurriculumPackage {
  const normalized = disciplineCode.trim().toLocaleLowerCase("en-US");
  const curriculumPackage = packages[normalized];
  if (!curriculumPackage) {
    throw new Error(`${normalized} branşı için müfredat paketi bulunamadı.`);
  }
  return validateCurriculumPackage(structuredClone(curriculumPackage));
}
