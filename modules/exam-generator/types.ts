import type { GradeLevel } from "@/curriculum";

export type ExamName =
  | "1. Dönem 1. Yazılı"
  | "1. Dönem 2. Yazılı"
  | "2. Dönem 1. Yazılı"
  | "2. Dönem 2. Yazılı"
  | "Sorumluluk Sınavı";

export type QuestionType = "open-ended" | "short-answer";
export type CognitiveLevel = "anlama" | "çıkarım" | "analiz" | "gerekçelendirme";
export type ExamMode = "standard" | "iep";
export type IepProfile = "reading" | "writing" | "attention" | "cognitive" | "visual";

export interface ExamMetadata {
  schoolName: string;
  academicYear: string;
  teacherName: string;
  classBranch: string;
  date: string;
  duration: 40 | 50 | 60 | 80;
  examName: ExamName;
}

export interface ExamInput {
  grade: GradeLevel;
  unitCode: string;
  outcomeCodes: readonly string[];
  questionCount: 5 | 8 | 10;
  textQuestionRatio: 50 | 75 | 100;
  mode: ExamMode;
  iepProfile: IepProfile | null;
  iepDecision: string;
  teacherApproved: boolean;
  metadata: ExamMetadata;
}

export interface ExamQuestion {
  id: string;
  order: number;
  type: QuestionType;
  cognitiveLevel: CognitiveLevel;
  outcomeCode: string;
  unitTitle: string;
  stimulus: string | null;
  prompt: string;
  points: number;
  answerKey: string;
  rubric: readonly string[];
}

export interface BlueprintRow {
  outcomeCode: string;
  outcomeTitle: string;
  questionCount: number;
  totalPoints: number;
  cognitiveLevels: readonly CognitiveLevel[];
}

export interface IepAdaptation {
  profile: IepProfile;
  label: string;
  adjustments: readonly string[];
  preservesTarget: true;
}

export interface GeneratedExam {
  status: "draft";
  metadata: ExamMetadata;
  grade: GradeLevel;
  unitTitle: string;
  bookletA: readonly ExamQuestion[];
  bookletB: readonly ExamQuestion[];
  blueprint: readonly BlueprintRow[];
  iepAdaptation: IepAdaptation | null;
  iepDecision: string | null;
  totalPoints: 100;
  validation: {
    outcomeAlignment: boolean;
    scoreBalance: boolean;
    uniqueQuestions: boolean;
    bookletEquivalence: boolean;
    answerPackageComplete: boolean;
    teacherApproved: boolean;
    exportAllowed: boolean;
  };
}
