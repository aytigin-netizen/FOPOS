export type ExperimentKind = "thought_experiment" | "allegory" | "dilemma";

export type ExperimentSource = {
  label: string;
  url: string;
  note: string;
};

export type ThoughtExperiment = {
  id: string;
  contentVersion: "1.0.0";
  title: string;
  subtitle: string;
  kind: ExperimentKind;
  grade: 10 | 11;
  unitCode: string;
  outcomeCodes: string[];
  theme: string;
  estimatedMinutes: number;
  summary: string;
  scenario: string;
  centralQuestion: string;
  concepts: string[];
  discussionQuestions: string[];
  counterArgumentPrompts: string[];
  transferQuestion: string;
  facilitatorNotes: string[];
  ageAppropriateness: string;
  sourceNotes: string[];
  sources: ExperimentSource[];
};

export const experimentKindLabels: Record<ExperimentKind, string> = {
  thought_experiment: "Düşünce deneyi",
  allegory: "Alegori",
  dilemma: "Etik ikilem",
};
