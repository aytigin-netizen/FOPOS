import canonicalCurriculum from "../../app/data/felsefe_curriculum_2024.json" with { type: "json" };

import type { CurriculumPackage } from "../core/curriculum/package-types.ts";

type CanonicalOutcome = {
  readonly outcome_code: string;
  readonly description: string;
  readonly process_components: readonly {
    readonly step: string;
    readonly description: string;
  }[];
};

type CanonicalUnit = {
  readonly grade: number;
  readonly unit_number: number;
  readonly unit_code: string;
  readonly unit_name: string;
  readonly purpose: string;
  readonly duration_hours: number;
  readonly keywords: readonly string[];
  readonly competency_framework: {
    readonly field_skills: readonly string[];
    readonly conceptual_skills: readonly string[];
    readonly tendencies: readonly string[];
    readonly cross_program_components: {
      readonly social_emotional_learning: readonly string[];
      readonly values: readonly string[];
      readonly literacy: readonly string[];
    };
    readonly interdisciplinary_relations: readonly string[];
    readonly inter_skill_relations: readonly string[];
  };
  readonly content_framework: readonly string[];
  readonly learning_evidence: string;
  readonly learning_teaching_experiences: {
    readonly basic_assumptions: string;
    readonly pre_assessment: string;
    readonly bridging: string;
    readonly applications: string;
  };
  readonly differentiation: {
    readonly enrichment: string;
    readonly support: string;
  };
  readonly learning_outcomes: readonly CanonicalOutcome[];
};

type CanonicalGrade = {
  readonly unit_count: number;
  readonly learning_outcome_count: number;
  readonly instruction_hours: number;
  readonly school_based_planning_hours: number;
  readonly units: readonly CanonicalUnit[];
};

type CanonicalDataset = {
  readonly schema_version: string;
  readonly dataset_version: string;
  readonly title: string;
  readonly source: {
    readonly year: number;
    readonly document: string;
    readonly publisher: string;
    readonly scope: string;
    readonly page_count: number;
    readonly extraction_method: string;
    readonly verification_note: string;
  };
  readonly program_rules: {
    readonly weekly_hours: number;
    readonly annual_total_hours_per_grade: number;
    readonly school_based_planning_hours_per_grade: number;
    readonly core_field_skills: readonly string[];
    readonly assessment_principles: readonly string[];
    readonly performance_task_rules: unknown;
  };
  readonly grades: {
    readonly "10": CanonicalGrade;
    readonly "11": CanonicalGrade;
  };
};

const dataset = canonicalCurriculum as CanonicalDataset;
const gradeEntries = [
  ["10", dataset.grades["10"]],
  ["11", dataset.grades["11"]],
] as const;
const canonicalUnits = gradeEntries.flatMap(([, grade]) => grade.units);

function assertCanonicalPhilosophyDataset(): void {
  if (dataset.schema_version !== "1.0.0" || dataset.dataset_version !== "2024.1") {
    throw new Error("Desteklenmeyen felsefe müfredatı veri seti sürümü.");
  }
  if (
    dataset.source.year !== 2024 ||
    dataset.grades["10"].unit_count !== 9 ||
    dataset.grades["11"].unit_count !== 6 ||
    canonicalUnits.length !== 15
  ) {
    throw new Error("Felsefe müfredatı ünite kapsamı doğrulanamadı.");
  }
  const outcomeCount = canonicalUnits.reduce(
    (sum, unit) => sum + unit.learning_outcomes.length,
    0,
  );
  if (outcomeCount !== 22) {
    throw new Error("Felsefe müfredatı öğrenme çıktısı kapsamı doğrulanamadı.");
  }
  for (const [grade, gradeData] of gradeEntries) {
    const durationHours = gradeData.units.reduce(
      (sum, unit) => sum + unit.duration_hours,
      0,
    );
    if (
      durationHours !== 68 ||
      gradeData.instruction_hours !== 68 ||
      gradeData.school_based_planning_hours !== 4 ||
      gradeData.school_based_planning_hours !==
        dataset.program_rules.school_based_planning_hours_per_grade ||
      durationHours + gradeData.school_based_planning_hours !==
        dataset.program_rules.annual_total_hours_per_grade
    ) {
      throw new Error(`${grade}. sınıf felsefe ders saati kapsamı doğrulanamadı.`);
    }
  }
}

assertCanonicalPhilosophyDataset();

const units = canonicalUnits.map((unit) => ({
  code: unit.unit_code,
  grade: unit.grade,
  unitNumber: unit.unit_number,
  name: unit.unit_name,
  durationHours: unit.duration_hours,
  purpose: unit.purpose,
  keywords: [...unit.keywords],
  competencyFramework: {
    fieldSkills: [...unit.competency_framework.field_skills],
    conceptualSkills: [...unit.competency_framework.conceptual_skills],
    tendencies: [...unit.competency_framework.tendencies],
    socialEmotionalLearning: [
      ...unit.competency_framework.cross_program_components.social_emotional_learning,
    ],
    values: [...unit.competency_framework.cross_program_components.values],
    literacy: [...unit.competency_framework.cross_program_components.literacy],
    interdisciplinaryRelations: [...unit.competency_framework.interdisciplinary_relations],
    interSkillRelations: [...unit.competency_framework.inter_skill_relations],
  },
  contentFramework: [...unit.content_framework],
  canonicalLearningEvidence: unit.learning_evidence,
  learningTeachingExperiences: {
    basicAssumptions: unit.learning_teaching_experiences.basic_assumptions,
    preAssessment: unit.learning_teaching_experiences.pre_assessment,
    bridging: unit.learning_teaching_experiences.bridging,
    applications: unit.learning_teaching_experiences.applications,
  },
  differentiation: { ...unit.differentiation },
  outcomes: unit.learning_outcomes.map((outcome) => ({
    code: outcome.outcome_code,
    description: outcome.description,
    processComponents: outcome.process_components.map((component) => ({ ...component })),
  })),
}));

export const philosophy2024Package: CurriculumPackage = {
  manifest: {
    schemaVersion: "1.0.0",
    datasetVersion: dataset.dataset_version,
    lifecycle: "ARCHIVED",
    discipline: { code: "philosophy", name: "Felsefe" },
    defaultGrade: 10,
    source: {
      title: dataset.title,
      year: dataset.source.year,
      url: "https://mufredat.meb.gov.tr/ProgramDetay.aspx?PID=1986",
      document: dataset.source.document,
      publisher: dataset.source.publisher,
      scope: dataset.source.scope,
      pageCount: dataset.source.page_count,
      extractionMethod: dataset.source.extraction_method,
      verificationNote: dataset.source.verification_note,
    },
    programRules: {
      weeklyHours: dataset.program_rules.weekly_hours,
      annualTotalHoursPerGrade: dataset.program_rules.annual_total_hours_per_grade,
      schoolBasedPlanningHoursPerGrade:
        dataset.program_rules.school_based_planning_hours_per_grade,
      coreFieldSkills: [...dataset.program_rules.core_field_skills],
      assessmentPrinciples: [...dataset.program_rules.assessment_principles],
      performanceTaskRules: structuredClone(dataset.program_rules.performance_task_rules),
    },
    grades: Object.fromEntries(
      gradeEntries.map(([grade, gradeData]) => [grade, {
        unitCount: gradeData.unit_count,
        learningOutcomeCount: gradeData.learning_outcome_count,
        instructionHours: gradeData.instruction_hours,
        schoolBasedPlanningHours: gradeData.school_based_planning_hours,
      }]),
    ),
  },
  units,
  assessments: gradeEntries.map(([grade, gradeData]) => ({
    code: `philosophy-${grade}`,
    name: `Felsefe ${grade}. sınıf öğrenme kanıtları`,
    outcomeCodes: gradeData.units.flatMap((unit) =>
      unit.learning_outcomes.map((outcome) => outcome.outcome_code),
    ),
  })),
};
