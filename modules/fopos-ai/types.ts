import type { OutcomePriority } from "@/modules/exam-analysis/types";

export interface EvidenceRef {
  outcomeCode: string;
  achievementRate: number;
  participantCount: number;
  questionCount: number;
}

export interface AiRecommendation {
  id: string;
  priority: OutcomePriority;
  outcomeCode: string;
  title: string;
  rationale: string;
  action: string;
  monitoring: string;
  evidence: EvidenceRef;
}

export interface FoposAiDecisionSupport {
  status: "suggestion";
  confidence: "insufficient" | "limited" | "adequate";
  summary: {
    classAverage: number | null;
    passRate: number | null;
    strongestOutcome: string | null;
    weakestOutcome: string | null;
    warnings: readonly string[];
  };
  recommendations: readonly AiRecommendation[];
  privacy: {
    studentNamesReceived: false;
    aggregateDataOnly: true;
  };
  governance: {
    changesOfficialRecords: false;
    changesIepTargets: false;
    teacherApprovalRequired: true;
  };
}
