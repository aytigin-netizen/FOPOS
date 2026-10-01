export type Grade = 10 | 11 | 12;
export type UnitCode = string;
export type Unit = {
  subjectCode: string; code: UnitCode; name: string; hours: number; grade: Grade; keywords: string[];
  purpose: string;
  outcomes: { code: string; description: string; short: string; processComponents: { step: string; description: string }[] }[];
  competencyFramework: {
    fieldSkills: string[]; conceptualSkills: string[]; tendencies: string[];
    socialEmotionalLearning: string[]; values: string[]; literacy: string[];
    interdisciplinaryRelations: string[]; interSkillRelations: string[];
  };
  contentFramework: string[];
  canonicalLearningEvidence: string | null;
  pedagogicalEvidence: string;
  learningTeachingExperiences: { basicAssumptions: string; preAssessment: string; bridging: string };
  differentiation: { enrichment: string; support: string };
  strategy: string; methods: string[]; opening: string; inquiry: string;
  discussion: string; application: string; evidence: string;
};

export type Resolution<T> = {ok: true; value: T} | {ok: false; message: string};

export function resolveOutcome(unit: Unit, outcomeCode: string): Resolution<Unit["outcomes"][number]> {
  const outcome = unit.outcomes.find(candidate => candidate.code === outcomeCode);
  return outcome ? {ok: true, value: outcome} : {ok: false, message: `${outcomeCode} kodlu öğrenme çıktısı ${unit.code} ünitesinde bulunamadı.`};
}
