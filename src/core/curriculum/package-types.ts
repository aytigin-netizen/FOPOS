export type Discipline = {
  code: string;
  name: string;
};

export type CurriculumManifest = {
  schemaVersion: "1.0.0";
  datasetVersion: string;
  discipline: Discipline;
  defaultGrade: number;
};

export type LearningOutcome = {
  code: string;
  description: string;
};

export type CurriculumUnit = {
  code: string;
  grade: number;
  name: string;
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
