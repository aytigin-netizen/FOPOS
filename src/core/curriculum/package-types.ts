export type Discipline = {
  code: string;
  name: string;
};

export type CurriculumManifest = {
  schemaVersion: "1.0.0";
  datasetVersion: string;
  discipline: Discipline;
  defaultGrade: number;
  source: {
    title: string;
    year: number;
    url: string;
  };
};

export type LearningOutcome = {
  code: string;
  description: string;
};

export type CurriculumUnit = {
  code: string;
  grade: number;
  name: string;
  durationHours: number;
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
