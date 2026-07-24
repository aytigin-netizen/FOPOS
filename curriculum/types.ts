export type GradeLevel = 10 | 11;

export interface LearningOutcome {
  code: `FEL.${GradeLevel}.${number}.${number}`;
  title: string;
  processComponents: readonly string[];
}

export interface CurriculumComponents {
  fieldSkills: readonly string[];
  tendencies: readonly string[];
  socialEmotionalSkills: readonly string[];
  values: readonly string[];
  literacies: readonly string[];
  interdisciplinaryRelations: readonly string[];
  crossSkills: readonly string[];
}

export interface CurriculumUnit {
  code: `FEL.${GradeLevel}.${number}`;
  grade: GradeLevel;
  order: number;
  title: string;
  slug: string;
  lessonHours: number;
  purpose: string;
  outcomes: readonly LearningOutcome[];
  contentFramework: readonly string[];
  keyConcepts: readonly string[];
  components: CurriculumComponents;
  sourceUrl: `https://tymm.meb.gov.tr/${string}`;
}

export interface GradeCurriculum {
  courseCode: "FEL";
  courseName: "Felsefe";
  model: "Türkiye Yüzyılı Maarif Modeli";
  publicationYear: 2024;
  grade: GradeLevel;
  weeklyLessonHours: 2;
  annualLessonHours: 72;
  schoolBasedPlanningHours: 4;
  units: readonly CurriculumUnit[];
}
