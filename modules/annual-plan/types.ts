import type { GradeLevel } from "@/curriculum";

export interface AnnualPlanMetadata {
  province: string;
  district: string;
  schoolName: string;
  academicYear: string;
  teacherName: string;
  departmentHead: string;
  principalName: string;
  branches: string;
}

export interface AnnualPlanInput {
  grade: GradeLevel;
  metadata: AnnualPlanMetadata;
}

export interface AnnualPlanWeek {
  sequence: number;
  startDate: string;
  endDate: string;
  semester: 1 | 2;
  kind: "curriculum" | "school-based";
  unitCode: string | null;
  unitTitle: string;
  unitWeek: number;
  topic: string;
  outcomeCode: string | null;
  outcomeTitle: string;
  processComponents: readonly string[];
  values: readonly string[];
  literacies: readonly string[];
  specialDays: readonly string[];
}

export interface AnnualPlan {
  status: "draft";
  title: string;
  metadata: AnnualPlanMetadata;
  grade: GradeLevel;
  weeklyLessonHours: 2;
  totalLessonHours: 72;
  calendar: {
    schoolStart: string;
    firstBreak: readonly [string, string];
    firstSemesterEnd: string;
    semesterBreak: readonly [string, string];
    secondSemesterStart: string;
    secondBreak: readonly [string, string];
    schoolEnd: string;
  };
  weeks: readonly AnnualPlanWeek[];
  validation: {
    calendarReviewed: boolean;
    curriculumReviewed: boolean;
    exportAllowed: boolean;
  };
}
