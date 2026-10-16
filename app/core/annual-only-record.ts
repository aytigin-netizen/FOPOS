import type { PedagogicalRecord } from "./pedagogical-record.ts";
import { annualPlanRecordId } from "./annual-plan-decision.ts";
import { annualOnlySources } from "../modules/annual-plan/annual-only-curricula.ts";

// Permit the reviewed annual scope without activating daily/exam/AI generation.
export function isAnnualOnlyRecord(record: PedagogicalRecord) {
  const source = annualOnlySources[record.curriculum?.subjectCode];
  const year = record.lessonContext?.profile;
  const match = typeof year === "string" && /^(\d{4})-(\d{4})$/u.exec(year);
  if (!source || !match || Number(match[2]) !== Number(match[1])+1) return false;
  const scope = {academicYear:year,subjectCode:source.subjectCode,datasetVersion:source.datasetVersion,grade:record.curriculum.grade};
  return [10,11,12].includes(scope.grade)
    && record.curriculum.datasetVersion === source.datasetVersion
    && record.recordId === annualPlanRecordId(scope)
    && record.curriculum.unitCode === "ANNUAL_PLAN"
    && record.curriculum.outcomeCode === `ANNUAL.${scope.grade}.${year}`
    && record.lessonContext.week === 1
    && record.lessonContext.durationMinutes === source.instructionHours * 40
    && record.pedagogicalDecision.learningEvidence === source.units.flatMap(unit=>unit.outcomes.map(outcome=>outcome.code)).join(" • ")
    && record.pedagogicalDecision.strategy === "Öğretim yılı müfredat dağılımı";
}
export function annualOnlyDocumentAllowed(record: PedagogicalRecord, documentType: string) {
  return documentType === "annual-plan" && isAnnualOnlyRecord(record);
}
