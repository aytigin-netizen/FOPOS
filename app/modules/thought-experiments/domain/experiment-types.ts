export type ExperimentKind = "thought_experiment" | "allegory" | "dilemma";

export type ExperimentSource = {
  label: string;
  url: string;
  note: string;
};

export type ExperimentVisualKind =
  | "beetle-box"
  | "theseus-ship"
  | "plato-cave"
  | "trolley-dilemma"
  | "last-human"
  | "chinese-room"
  | "pascals-wager"
  | "antigone"
  | "veil-of-ignorance"
  | "circle-enlargement"
  | "brillo-boxes"
  | "euthyphro-dilemma"
  | "black-swan"
  | "niebla-mist"
  | "sisyphus-boulder"
  | "achilles-tortoise";

export type ThoughtExperiment = {
  visual: ExperimentVisualKind;
  id: string;
  contentVersion: "1.0.0";
  wave?: "pilot" | "wave2";
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
