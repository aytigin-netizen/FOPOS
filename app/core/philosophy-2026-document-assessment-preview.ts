type CanonicalOutcome = {
  outcome_code: string;
  description: string;
  process_components: { step: string; description: string }[];
};

type CanonicalUnit = {
  grade: 10 | 11;
  unit_code: string;
  unit_name: string;
  duration_hours: number;
  learning_outcomes: CanonicalOutcome[];
  content_framework: string[];
  keywords: string[];
  competency_framework: {
    field_skills: string[];
    conceptual_skills: string[];
    tendencies: string[];
    cross_program_components: {
      social_emotional_learning: string[];
      values: string[];
      literacy: string[];
    };
    interdisciplinary_relations: string[];
    inter_skill_relations: string[];
  };
};

export type PhilosophyDataset2026 = {
  dataset_version: string;
  runtime_enabled: boolean;
  grades: Record<"10" | "11", { units: CanonicalUnit[] }>;
};

type Phase = Readonly<{
  label: string;
  duration: number;
  facilitator: string;
  learner: string;
  evidence: string;
}>;

export type DocumentRegressionFixture2026 = Readonly<{
  documentType: "daily-plan";
  subjectCode: "philosophy";
  datasetVersion: "2026.1";
  grade: 10 | 11;
  unitCode: string;
  unitName: string;
  outcomeCode: string;
  outcomeDescription: string;
  processComponents: readonly Readonly<{ step: string; description: string }>[];
  contentFramework: readonly string[];
  keywords: readonly string[];
  competencyFields: Readonly<{
    fieldSkills: readonly string[];
    conceptualSkills: readonly string[];
    tendencies: readonly string[];
    socialEmotionalLearning: readonly string[];
    values: readonly string[];
    literacy: readonly string[];
    interdisciplinaryRelations: readonly string[];
    interSkillRelations: readonly string[];
  }>;
  phases: readonly Phase[];
}>;

export type AssessmentRegressionFixture2026 = Readonly<{
  documentType: "exam";
  subjectCode: "philosophy";
  datasetVersion: "2026.1";
  grade: 10 | 11;
  mode: "standard" | "bep";
  unitCodes: readonly string[];
  outcomeCodes: readonly string[];
  questionCount: 10;
  durationMinutes: 40 | 60;
  totalPoints: 100;
  adaptationKey: null | "reading";
}>;

function frozenStrings(values: string[]) {
  return Object.freeze([...values]);
}

function assertPreviewBoundary(dataset: PhilosophyDataset2026) {
  if (dataset.dataset_version !== "2026.1") {
    throw new Error("Belge ve sınav doğrulaması yalnız 2026.1 veri sınırında çalışabilir.");
  }
}

export function buildDocumentRegressionFixtures2026(
  dataset: PhilosophyDataset2026,
  phaseCatalog: Readonly<Record<string, readonly Phase[]>>,
): readonly DocumentRegressionFixture2026[] {
  assertPreviewBoundary(dataset);
  const fixtures = ([10, 11] as const).flatMap((grade) =>
    dataset.grades[String(grade) as "10" | "11"].units.flatMap((unit) =>
      unit.learning_outcomes.map((outcome) => {
        const phases = phaseCatalog[outcome.outcome_code];
        if (!phases || phases.length !== 9 || phases.reduce((sum, phase) => sum + phase.duration, 0) !== 80) {
          throw new Error(`${outcome.outcome_code} belge akışı dokuz aşama ve 80 dakika taşımalıdır.`);
        }
        const cross = unit.competency_framework.cross_program_components;
        const competencyFields = Object.freeze({
          fieldSkills: frozenStrings(unit.competency_framework.field_skills),
          conceptualSkills: frozenStrings(unit.competency_framework.conceptual_skills),
          tendencies: frozenStrings(unit.competency_framework.tendencies),
          socialEmotionalLearning: frozenStrings(cross.social_emotional_learning),
          values: frozenStrings(cross.values),
          literacy: frozenStrings(cross.literacy),
          interdisciplinaryRelations: frozenStrings(unit.competency_framework.interdisciplinary_relations),
          interSkillRelations: frozenStrings(unit.competency_framework.inter_skill_relations),
        });
        return Object.freeze({
          documentType: "daily-plan" as const,
          subjectCode: "philosophy" as const,
          datasetVersion: "2026.1" as const,
          grade,
          unitCode: unit.unit_code,
          unitName: unit.unit_name,
          outcomeCode: outcome.outcome_code,
          outcomeDescription: outcome.description,
          processComponents: Object.freeze(outcome.process_components.map((item) => Object.freeze({ ...item }))),
          contentFramework: frozenStrings(unit.content_framework),
          keywords: frozenStrings(unit.keywords),
          competencyFields,
          phases: Object.freeze(phases.map((phase) => Object.freeze({ ...phase }))),
        });
      }),
    ),
  );
  return Object.freeze(fixtures);
}

export function buildAssessmentRegressionFixtures2026(
  dataset: PhilosophyDataset2026,
): readonly AssessmentRegressionFixture2026[] {
  assertPreviewBoundary(dataset);
  const fixtures = ([10, 11] as const).flatMap((grade) => {
    const units = dataset.grades[String(grade) as "10" | "11"].units;
    const unitCodes = Object.freeze(units.map((unit) => unit.unit_code));
    const outcomeCodes = Object.freeze(
      units.flatMap((unit) => unit.learning_outcomes.map((outcome) => outcome.outcome_code)),
    );
    return (["standard", "bep"] as const).map((mode) =>
      Object.freeze({
        documentType: "exam" as const,
        subjectCode: "philosophy" as const,
        datasetVersion: "2026.1" as const,
        grade,
        mode,
        unitCodes,
        outcomeCodes,
        questionCount: 10 as const,
        durationMinutes: (mode === "standard" ? 40 : 60) as 40 | 60,
        totalPoints: 100 as const,
        adaptationKey: mode === "bep" ? "reading" as const : null,
      }),
    );
  });
  return Object.freeze(fixtures);
}
