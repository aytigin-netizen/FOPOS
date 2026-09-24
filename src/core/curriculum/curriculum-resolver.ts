import { getCurriculumRegistration } from "./curriculum-registry.ts";
import type { CurriculumPackage } from "./package-types.ts";

export type CurriculumResolution = {
  curriculumPackage: CurriculumPackage;
  disciplineCode: string;
  datasetVersion: string;
  source: "registry";
};

export function resolveCurriculumPackage(input: {
  disciplineCode: string;
  datasetVersion: string;
}): CurriculumResolution {
  if (!input) {
    throw new Error("Müfredat çözümlemesi için branş ve veri seti sürümü gereklidir.");
  }
  const disciplineCode = input.disciplineCode.trim().toLocaleLowerCase("en-US");
  const datasetVersion = input.datasetVersion.trim();
  if (!disciplineCode || !datasetVersion) {
    throw new Error("Müfredat çözümlemesi için branş ve veri seti sürümü gereklidir.");
  }
  const registration = getCurriculumRegistration(disciplineCode, datasetVersion);
  if (!registration) {
    throw new Error(`${disciplineCode}@${datasetVersion} için müfredat kaydı bulunamadı.`);
  }
  return {
    curriculumPackage: registration.load(),
    disciplineCode: registration.discipline.code,
    datasetVersion: registration.datasetVersion,
    source: "registry",
  };
}
