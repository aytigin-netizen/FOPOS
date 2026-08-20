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
    discipline: { code: "philosophy", name: "Felsefe" },
    defaultGrade: 10,
    source: {
      title: canonicalCurriculum.title,
      year: canonicalCurriculum.source.year,
      url: "https://mufredat.meb.gov.tr/",
    },
  },
  units: gradeEntries.flatMap(([, grade]) =>
    grade.units.map((unit) => ({
      code: unit.unit_code,
      grade: unit.grade,
      name: unit.unit_name,
      durationHours: unit.duration_hours,
      outcomes: unit.learning_outcomes.map((outcome) => ({
        code: outcome.outcome_code,
        description: outcome.description,
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
