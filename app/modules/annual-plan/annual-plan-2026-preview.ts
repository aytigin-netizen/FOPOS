type CanonicalOutcome2026 = {
  outcome_code: string;
  description: string;
};

type CanonicalUnit2026 = {
  grade: number;
  unit_code: string;
  unit_name: string;
  duration_hours: number;
  learning_outcomes: CanonicalOutcome2026[];
};

type CanonicalGrade2026 = {
  instruction_hours: number;
  school_based_planning_hours: number;
  units: CanonicalUnit2026[];
};

export type AnnualPlanDataset2026 = {
  dataset_version: string;
  runtime_enabled: boolean;
  program_rules: {
    weekly_hours: number;
    annual_total_hours_per_grade: number;
    instruction_hours_per_grade: number;
    school_based_planning_hours_per_grade: number;
    school_based_planning_focus: string;
  };
  grades: Record<"10" | "11", CanonicalGrade2026>;
};

export type AnnualPlanRegressionRow2026 = Readonly<{
  week: number;
  hours: number;
  kind: "lesson" | "planning";
  unitCode: string | null;
  unitName: string;
  outcomeCode: string | null;
  outcomeDescription: string;
}>;

function freezeRows(rows: AnnualPlanRegressionRow2026[]) {
  for (const row of rows) Object.freeze(row);
  return Object.freeze(rows);
}

/**
 * Produces a versioned annual-plan fixture without exposing the 2026 dataset to
 * the live curriculum loader. It mirrors the live engine's two-hour weekly
 * allocation rule and keeps school-based planning outside instruction time.
 */
export function buildAnnualPlanRegressionFixture2026(
  source: AnnualPlanDataset2026,
  grade: 10 | 11,
): readonly AnnualPlanRegressionRow2026[] {
  if (source.dataset_version !== "2026.1" || source.runtime_enabled !== false) {
    throw new Error("Yıllık plan önizlemesi yalnız kapalı 2026.1 veri sınırında çalışabilir.");
  }
  const weeklyHours = source.program_rules.weekly_hours;
  if (weeklyHours !== 2) throw new Error("2026 yıllık planı haftada iki ders saati olmalıdır.");

  const gradeData = source.grades[String(grade) as "10" | "11"];
  const rows: AnnualPlanRegressionRow2026[] = [];
  for (const unit of gradeData.units) {
    if (unit.grade !== grade || unit.duration_hours % weeklyHours !== 0) {
      throw new Error(`${unit.unit_code} yıllık plan hafta dağılımına uygun değildir.`);
    }
    const unitWeeks = unit.duration_hours / weeklyHours;
    for (let unitWeek = 0; unitWeek < unitWeeks; unitWeek += 1) {
      const outcomeIndex = Math.min(
        unit.learning_outcomes.length - 1,
        Math.floor((unitWeek * unit.learning_outcomes.length) / unitWeeks),
      );
      const outcome = unit.learning_outcomes[outcomeIndex];
      rows.push({
        week: rows.length + 1,
        hours: weeklyHours,
        kind: "lesson",
        unitCode: unit.unit_code,
        unitName: unit.unit_name,
        outcomeCode: outcome.outcome_code,
        outcomeDescription: outcome.description,
      });
    }
  }

  const planningHours = gradeData.school_based_planning_hours;
  if (planningHours % weeklyHours !== 0) {
    throw new Error("Okul temelli planlama saatleri haftalık dağılıma uygun değildir.");
  }
  for (let index = 0; index < planningHours / weeklyHours; index += 1) {
    rows.push({
      week: rows.length + 1,
      hours: weeklyHours,
      kind: "planning",
      unitCode: null,
      unitName: "OKUL TEMELLİ PLANLAMA",
      outcomeCode: null,
      outcomeDescription: source.program_rules.school_based_planning_focus,
    });
  }

  const instructionHours = rows
    .filter((row) => row.kind === "lesson")
    .reduce((sum, row) => sum + row.hours, 0);
  const totalHours = rows.reduce((sum, row) => sum + row.hours, 0);
  if (
    instructionHours !== gradeData.instruction_hours ||
    instructionHours !== source.program_rules.instruction_hours_per_grade ||
    totalHours !== source.program_rules.annual_total_hours_per_grade
  ) {
    throw new Error(`${grade}. sınıf yıllık plan saat bütünlüğü doğrulanamadı.`);
  }
  return freezeRows(rows);
}
