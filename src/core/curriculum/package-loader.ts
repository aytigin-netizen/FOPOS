import type { CurriculumPackage } from "./package-types.ts";
import { philosophy2026Package } from "../../curriculum-packages/philosophy-2026.ts";
import { validateCurriculumPackage } from "./validation.ts";
import { sociology2026Package } from "../../curriculum-packages/sociology-2026.ts";

const packages: Readonly<Record<string, CurriculumPackage>> = Object.freeze({
  philosophy: philosophy2026Package,
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
