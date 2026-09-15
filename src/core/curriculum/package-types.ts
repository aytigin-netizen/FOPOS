export type Discipline = {
  code: string;
  name: string;
};

export type CurriculumManifest = {
  schemaVersion: "1.0.0";
  datasetVersion: string;
  lifecycle: "ACTIVE" | "ARCHIVED";
  discipline: Discipline;
  defaultGrade: number;
  source: {
    title: string;
    year: number;
    url: string;
    document?: string;
    publisher?: string;
    scope?: string;
    pageCount?: number;
    extractionMethod?: string;
    verificationNote?: string;
  };
  programRules?: {
    weeklyHours: number;
    annualTotalHoursPerGrade: number;
    instructionHoursPerGrade?: number;
    schoolBasedPlanningHoursPerGrade: number;
    schoolBasedPlanningFocus?: string;
    coreFieldSkills: string[];
    assessmentPrinciples?: string[];
    performanceTaskRules?: unknown;
  };
  grades?: Record<string, {
    unitCount: number;
    learningOutcomeCount: number;
    instructionHours: number;
    schoolBasedPlanningHours: number;
  }>;
};

export type ProcessComponent = {
  step: string;
  description: string;
};

export type LearningOutcome = {
  code: string;
  description: string;
  processComponents?: ProcessComponent[];
};

export type CompetencyFramework = {
  fieldSkills: string[];
  conceptualSkills: string[];
  tendencies: string[];
  socialEmotionalLearning: string[];
  values: string[];
  literacy: string[];
  interdisciplinaryRelations: string[];
  interSkillRelations: string[];
};

export type CurriculumUnit = {
  code: string;
  grade: number;
  unitNumber?: number;
  name: string;
  durationHours: number;
  purpose?: string;
  keywords?: string[];
  competencyFramework?: CompetencyFramework;
  contentFramework?: string[];
  canonicalLearningEvidence?: string;
  learningTeachingExperiences?: {
    basicAssumptions: string;
    preAssessment: string;
    bridging: string;
    applications?: string;
  };
  differentiation?: {
    enrichment: string;
    support: string;
  };
  outcomes: LearningOutcome[];
};

export type AssessmentDefinition = {
  code: string;
  name: string;
  outcomeCodes: string[];
};

export type CurriculumPackage = {
  manifest: CurriculumManifest;
  units: CurriculumUnit[];
  assessments: AssessmentDefinition[];
};

export type CurriculumPackageSelector = {
  disciplineCode: string;
  datasetVersion: string;
};
