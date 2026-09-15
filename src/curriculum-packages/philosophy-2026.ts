import canonicalCurriculum from "../../app/data/felsefe_curriculum_2026.json" with { type: "json" };

import type { CurriculumPackage } from "../core/curriculum/package-types.ts";

const gradeEntries = [
  ["10", canonicalCurriculum.grades["10"]],
  ["11", canonicalCurriculum.grades["11"]],
] as const;

export const philosophy2026Package: CurriculumPackage = {
  manifest: {
    schemaVersion: "1.0.0",
    datasetVersion: canonicalCurriculum.dataset_version,
    lifecycle: "ACTIVE",
    discipline: { code: "philosophy", name: "Felsefe" },
    defaultGrade: 10,
    source: {
      title: canonicalCurriculum.title,
      year: canonicalCurriculum.source.year,
      url: "https://mufredat.meb.gov.tr/",
      document: canonicalCurriculum.source.document,
      publisher: canonicalCurriculum.source.publisher,
      scope: canonicalCurriculum.source.scope,
      pageCount: canonicalCurriculum.source.page_count,
      verificationNote: canonicalCurriculum.source.verification_note,
    },
    programRules: {
      weeklyHours: canonicalCurriculum.program_rules.weekly_hours,
      annualTotalHoursPerGrade: canonicalCurriculum.program_rules.annual_total_hours_per_grade,
      instructionHoursPerGrade: canonicalCurriculum.program_rules.instruction_hours_per_grade,
      schoolBasedPlanningHoursPerGrade:
        canonicalCurriculum.program_rules.school_based_planning_hours_per_grade,
      schoolBasedPlanningFocus:
        canonicalCurriculum.program_rules.school_based_planning_focus,
      coreFieldSkills: [...canonicalCurriculum.program_rules.core_field_skills],
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
  units: gradeEntries.flatMap(([, grade]) =>
    grade.units.map((unit) => ({
      code: unit.unit_code,
      grade: unit.grade,
      unitNumber: unit.unit_number,
      name: unit.unit_name,
      durationHours: unit.duration_hours,
      keywords: [...unit.keywords],
      contentFramework: [...unit.content_framework],
      competencyFramework: {
        fieldSkills: [...unit.competency_framework.field_skills],
        conceptualSkills: [...unit.competency_framework.conceptual_skills],
        tendencies: [...unit.competency_framework.tendencies],
        socialEmotionalLearning: [
          ...unit.competency_framework.cross_program_components.social_emotional_learning,
        ],
        values: [...unit.competency_framework.cross_program_components.values],
        literacy: [...unit.competency_framework.cross_program_components.literacy],
        interdisciplinaryRelations: [
          ...unit.competency_framework.interdisciplinary_relations,
        ],
        interSkillRelations: [...unit.competency_framework.inter_skill_relations],
      },
      outcomes: unit.learning_outcomes.map((outcome) => ({
        code: outcome.outcome_code,
        description: outcome.description,
        processComponents: outcome.process_components.map((component) => ({ ...component })),
      })),
    })),
  ),
  assessments: gradeEntries.map(([grade, gradeData]) => ({
    code: `philosophy-${grade}`,
    name: `Felsefe ${grade}. sınıf öğrenme kanıtları`,
    outcomeCodes: gradeData.units.flatMap((unit) =>
      unit.learning_outcomes.map((outcome) => outcome.outcome_code),
    ),
  })),
};
