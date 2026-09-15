import type {
  CurriculumPackage,
  CurriculumPackageSelector,
} from "./package-types.ts";
import { philosophy2026Package } from "../../curriculum-packages/philosophy-2026.ts";
import { philosophy2024Package } from "../../curriculum-packages/philosophy-2024.ts";
import { validateCurriculumPackage } from "./validation.ts";
import { sociology2026Package } from "../../curriculum-packages/sociology-2026.ts";

export function curriculumDatasetKey(selector: CurriculumPackageSelector): string {
  if (!selector) {
    throw new Error("Müfredat paketi için branş ve veri seti sürümü gereklidir.");
  }
  const disciplineCode = selector.disciplineCode
    .trim()
    .toLocaleLowerCase("en-US");
  const datasetVersion = selector.datasetVersion.trim();
  if (!disciplineCode || !datasetVersion) {
    throw new Error("Müfredat paketi için branş ve veri seti sürümü gereklidir.");
  }
  return `${disciplineCode}@${datasetVersion}`;
}

const packages: Readonly<Record<string, CurriculumPackage>> = Object.freeze({
  [curriculumDatasetKey({ disciplineCode: "philosophy", datasetVersion: "2024.1" })]: philosophy2024Package,
  [curriculumDatasetKey({ disciplineCode: "philosophy", datasetVersion: "2026.1" })]: philosophy2026Package,
  [curriculumDatasetKey({ disciplineCode: "sociology", datasetVersion: "2026.1" })]: sociology2026Package,
});

export function loadPackage(selector: CurriculumPackageSelector): CurriculumPackage {
  const key = curriculumDatasetKey(selector);
  const curriculumPackage = packages[key];
  if (!curriculumPackage) {
    throw new Error(`${key} için müfredat paketi bulunamadı.`);
  }
  return validateCurriculumPackage(structuredClone(curriculumPackage));
}
