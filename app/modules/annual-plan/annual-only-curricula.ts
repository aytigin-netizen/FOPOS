import psychology from "./psychology-annual-source-2026.json" with { type: "json" };
import logic from "./logic-annual-source-2026.json" with { type: "json" };
import { getCurriculumContext } from "../../data/curriculum-runtime.ts";
import { CurriculumFeatureUnavailableError } from "../../core/curriculum-feature-unavailable.ts";
import type { SchoolType } from "../../../src/core/curriculum/package-types.ts";
import type { AnnualOnlySource, AnnualPlanContext } from "./annual-plan-types.ts";

export const annualOnlySources: Readonly<Record<string, AnnualOnlySource>> = { psychology, logic };
export const annualPlanningSubjects = [
  {code:"philosophy",name:"Felsefe"}, {code:"sociology",name:"Sosyoloji"},
  {code:"psychology",name:"Psikoloji"}, {code:"logic",name:"Mantık"},
];
export function getAnnualPlanContext(subjectCode: string, schoolType: SchoolType = "general_secondary"): AnnualPlanContext {
  const source = annualOnlySources[subjectCode];
  if (!source) {
    const context = getCurriculumContext(subjectCode,schoolType);
    return {
    ...context,
    units:context.units.map(unit=>({...unit,...(subjectCode === "sociology" && schoolType === "social_sciences_high_school" && unit.differentiation.enrichment ? {requiredEnrichment:["Programdaki zenginleştirme önerilerinden en az biri seçilir: " + unit.differentiation.enrichment]} : {})})),
    ...(subjectCode === "sociology" ? {distributionNote:"Haftalık dağılım, 2026 programındaki ünite süreleri ve çıktı sırası esas alınarak hazırlanmış öğretmen kontrolüne açık taslaktır."} : {}),
  };
  }
  // These programs contain no grade-coded outcomes. Grade is the teacher's
  // timetable placement; it does not create a new official curriculum version.
  const supportedGrades = [10,11,12] as const;
  return {
    subjectCode,subjectName:subjectCode === "psychology" ? "Psikoloji" : "Mantık",
    datasetVersion:source.datasetVersion,sourceTitle:source.sourceTitle,sourceYear:source.sourceYear,
    defaultGrade:11,supportedGrades:[...supportedGrades],schoolType,
    applicabilityNote:"Program sınıfa özgü çıktı kodu içermez. Sınıfı okulunuzun ders programına göre seçin.",
    distributionNote:"Haftalık dağılım, 2026 programındaki ünite süreleri ve çıktı sırası esas alınarak hazırlanmış öğretmen kontrolüne açık taslaktır.",
    schoolBasedPlanningFocus:source.schoolBasedPlanningFocus,
    units:supportedGrades.flatMap(grade=>source.units.map(unit=>({...unit,grade,subjectCode,requiredEnrichment:schoolType === "social_sciences_high_school" ? unit.requiredEnrichment : undefined}))),
  };
}
export function annualOnlyWeek(subjectCode: string, unitCode: string, zeroBasedWeek: number) {
  const source = annualOnlySources[subjectCode];
  const unit = source?.units.find(candidate=>candidate.code===unitCode);
  const weeks = unit ? unit.hours / source.weeklyHours : 0;
  if (!unit || !Number.isInteger(zeroBasedWeek) || zeroBasedWeek < 0 || zeroBasedWeek >= weeks)
    throw new CurriculumFeatureUnavailableError("Yıllık plan haftası",subjectCode,"2026.1");
  const index = Math.floor(zeroBasedWeek * unit.outcomes.length / weeks);
  const outcome = unit.outcomes[index];
  const start = Math.ceil(index * weeks / unit.outcomes.length);
  const end = Math.ceil((index + 1) * weeks / unit.outcomes.length);
  const local = zeroBasedWeek - start;
  const components = outcome.processComponents;
  const first = Math.floor(local * components.length / (end - start));
  const last = Math.max(first + 1,Math.floor((local + 1) * components.length / (end - start)));
  return {outcomeCode:outcome.code,componentSteps:components.slice(first,last).map(component=>component.step)};
}
