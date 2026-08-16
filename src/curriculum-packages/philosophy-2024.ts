import canonicalCurriculum from "../../app/data/felsefe_curriculum_2024.json";

import type { CurriculumPackage } from "../core/curriculum/package-types.ts";

type CanonicalOutcome = {
  readonly outcome_code: string;
  readonly description: string;
};

type CanonicalUnit = {
  readonly grade: number;
  readonly unit_code: string;
  readonly unit_name: string;
  readonly duration_hours: number;
  readonly learning_outcomes: readonly CanonicalOutcome[];
};

type CanonicalGrade = {
  readonly unit_count: number;
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
  };
  readonly program_rules: {
    readonly annual_total_hours_per_grade: number;
    readonly school_based_planning_hours_per_grade: number;
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
  name: unit.unit_name,
  durationHours: unit.duration_hours,
  outcomes: unit.learning_outcomes.map((outcome) => ({
    code: outcome.outcome_code,
    description: outcome.description,
  })),
}));

export const philosophy2024Package: CurriculumPackage = {
  manifest: {
    schemaVersion: "1.0.0",
    datasetVersion: dataset.dataset_version,
    discipline: { code: "philosophy", name: "Felsefe" },
    defaultGrade: 10,
    source: {
      title: dataset.title,
      year: dataset.source.year,
      url: "https://mufredat.meb.gov.tr/ProgramDetay.aspx?PID=1986",
    },
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
