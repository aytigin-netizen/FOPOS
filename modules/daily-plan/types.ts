import type { LessonDraft, LessonStudioSelection } from "@/modules/lesson-studio/types";

export interface DailyPlanMetadata {
  schoolName: string;
  academicYear: string;
  teacherName: string;
  principalName: string;
  date: string;
  specialDay: string;
  materials: string;
  differentiation: string;
  dailyLifeConnection: string;
}

export interface DailyPlanInput {
  metadata: DailyPlanMetadata;
  lesson: LessonStudioSelection;
}

export interface DailyPlan {
  id: string;
  courseName: "Felsefe";
  lessonHours: 2;
  metadata: DailyPlanMetadata;
  lesson: LessonDraft;
  assessment: {
    evidence: string;
    criteria: readonly string[];
  };
  approvalChecks: readonly string[];
}
