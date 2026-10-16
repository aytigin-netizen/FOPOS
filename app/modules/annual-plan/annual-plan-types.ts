import type { Grade, Unit } from "../../data/curriculum.ts";
import type { CurriculumContext } from "../../data/curriculum-runtime.ts";

// Annual planning needs official content, not a lesson-generation adapter.
export type AnnualPlanUnit = Pick<Unit, "code" | "grade" | "subjectCode" | "name" | "hours" | "contentFramework"> & {
  outcomes: Array<Pick<Unit["outcomes"][number], "code" | "description" | "processComponents">>;
  requiredEnrichment?: string[];
  competencyFramework: Pick<Unit["competencyFramework"], "socialEmotionalLearning" | "values" | "literacy">;
};
export type AnnualPlanContext = Pick<CurriculumContext, "subjectCode" | "subjectName" | "datasetVersion" | "sourceTitle" | "sourceYear" | "defaultGrade" | "supportedGrades" | "schoolType" | "applicabilityNote"> & {
  units: AnnualPlanUnit[];
  distributionNote?: string;
  schoolBasedPlanningFocus?: string;
};
export type AnnualOnlySource = {
  subjectCode: string;
  datasetVersion: string;
  sourceTitle: string;
  sourceYear: number;
  sourcePdf: string;
  weeklyHours: number;
  instructionHours: number;
  schoolBasedPlanningHours: number;
  schoolBasedPlanningFocus: string;
  units: Array<Omit<AnnualPlanUnit, "grade" | "subjectCode"> & { sourcePages: string }>;
};
export type AnnualPlanGrade = Grade;
