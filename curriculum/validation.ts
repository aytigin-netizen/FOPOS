import type { GradeCurriculum } from "@/curriculum/types";

export interface CurriculumValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateCurriculum(curriculum: GradeCurriculum): CurriculumValidationResult {
  const errors: string[] = [];
  const unitCodes = new Set<string>();
  const outcomeCodes = new Set<string>();
  const unitHours = curriculum.units.reduce((total, unit) => total + unit.lessonHours, 0);
  const expectedUnitHours = curriculum.annualLessonHours - curriculum.schoolBasedPlanningHours;

  if (unitHours !== expectedUnitHours) {
    errors.push(
      `${curriculum.grade}. sınıf ünite saatleri ${unitHours}; beklenen ${expectedUnitHours}.`,
    );
  }

  curriculum.units.forEach((unit, unitIndex) => {
    const expectedUnitCode = `FEL.${curriculum.grade}.${unitIndex + 1}`;

    if (unit.code !== expectedUnitCode) {
      errors.push(`${unit.code}: beklenen ünite kodu ${expectedUnitCode}.`);
    }

    if (unit.order !== unitIndex + 1) {
      errors.push(`${unit.code}: sıra değeri ${unit.order}; beklenen ${unitIndex + 1}.`);
    }

    if (unitCodes.has(unit.code)) {
      errors.push(`${unit.code}: yinelenen ünite kodu.`);
    }
    unitCodes.add(unit.code);

    if (unit.outcomes.length === 0) {
      errors.push(`${unit.code}: en az bir öğrenme çıktısı bulunmalıdır.`);
    }

    unit.outcomes.forEach((outcome, outcomeIndex) => {
      const expectedOutcomeCode = `${unit.code}.${outcomeIndex + 1}`;

      if (outcome.code !== expectedOutcomeCode) {
        errors.push(`${outcome.code}: beklenen öğrenme çıktısı kodu ${expectedOutcomeCode}.`);
      }

      if (outcomeCodes.has(outcome.code)) {
        errors.push(`${outcome.code}: yinelenen öğrenme çıktısı kodu.`);
      }
      outcomeCodes.add(outcome.code);

      if (outcome.processComponents.length === 0) {
        errors.push(`${outcome.code}: süreç bileşeni bulunmalıdır.`);
      }
    });
  });

  return { valid: errors.length === 0, errors };
}
