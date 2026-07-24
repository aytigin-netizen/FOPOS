import type { ExamQuestion, GeneratedExam } from "@/modules/exam-generator/types";

export type AttendanceStatus = "present" | "absent" | "undecided";
export type OutcomePriority = "critical" | "monitor" | "sufficient";

export interface StudentScoreRow {
  id: string;
  schoolNumber: string;
  fullName: string;
  attendance: AttendanceStatus;
  questionScores: readonly (number | null)[];
  controlScore: number | null;
}

export interface ExamAnalysisInput {
  exam: GeneratedExam;
  students: readonly StudentScoreRow[];
  teacherReviewed: boolean;
  safeSharingConfirmed: boolean;
}

export interface QuestionAnalysis {
  question: ExamQuestion;
  participantCount: number;
  averageScore: number;
  achievementRate: number;
}

export interface OutcomeAnalysis {
  outcomeCode: string;
  participantCount: number;
  achievementRate: number;
  priority: OutcomePriority;
  evidence: string;
  intervention: string;
}

export interface ExamAnalysis {
  status: "draft";
  classSize: number;
  participantCount: number;
  absentCount: number;
  incompleteCount: number;
  classAverage: number | null;
  passRate: number | null;
  questionAnalysis: readonly QuestionAnalysis[];
  outcomeAnalysis: readonly OutcomeAnalysis[];
  strongestOutcome: OutcomeAnalysis | null;
  weakestOutcome: OutcomeAnalysis | null;
  validation: {
    examScoreIs100: boolean;
    allRowsResolved: boolean;
    scoresWithinLimits: boolean;
    teacherReviewed: boolean;
    safeSharingConfirmed: boolean;
    exportAllowed: boolean;
  };
}
