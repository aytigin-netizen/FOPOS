import type { GradeLevel } from "@/curriculum";

export interface LessonStudioSelection {
  grade: GradeLevel;
  unitCode: string;
  outcomeCode: string;
  week: number;
  classProfile: "balanced" | "support" | "advanced";
  method: string;
  evidence: string;
}

export interface LessonPhase {
  order: number;
  title: string;
  minutes: number;
  teacherAction: string;
  studentAction: string;
}

export interface LessonDraft {
  title: string;
  totalMinutes: 80;
  selection: LessonStudioSelection;
  curriculum: {
    unitTitle: string;
    outcomeTitle: string;
    processComponents: readonly string[];
    contentFramework: readonly string[];
    keyConcepts: readonly string[];
    fieldSkills: readonly string[];
    values: readonly string[];
    literacies: readonly string[];
  };
  phases: readonly LessonPhase[];
}
