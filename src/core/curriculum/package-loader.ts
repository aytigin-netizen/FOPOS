import type { CurriculumPackage } from "./package-types.ts";
import { validateCurriculumPackage } from "./validation.ts";
import { sociology2026Package } from "../../curriculum-packages/sociology-2026.ts";

const philosophyPackage: CurriculumPackage = {
  manifest: {
    schemaVersion: "1.0.0",
    datasetVersion: "2024.1",
    discipline: { code: "philosophy", name: "Felsefe" },
    defaultGrade: 10,
    source: {
      title: "Felsefe Dersi Öğretim Programı",
      year: 2024,
      url: "https://mufredat.meb.gov.tr/ProgramDetay.aspx?PID=1986",
    },
  },
  units: [],
  assessments: [],
};

const packages: Readonly<Record<string, CurriculumPackage>> = Object.freeze({
  philosophy: philosophyPackage,
  sociology: sociology2026Package,
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
