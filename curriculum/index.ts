import { grade10Curriculum } from "@/curriculum/data/grade-10";
import { grade11Curriculum } from "@/curriculum/data/grade-11";
import type { GradeCurriculum, GradeLevel, LearningOutcome } from "@/curriculum/types";

export const philosophyCurricula = {
  10: grade10Curriculum,
  11: grade11Curriculum,
} as const satisfies Record<GradeLevel, GradeCurriculum>;

const curriculumList: readonly GradeCurriculum[] = Object.values(philosophyCurricula);

export function getCurriculum(grade: GradeLevel): GradeCurriculum {
  return philosophyCurricula[grade];
}

export function getUnit(unitCode: string) {
  return curriculumList
    .flatMap((curriculum) => curriculum.units)
    .find((unit) => unit.code === unitCode);
}

export function getLearningOutcome(outcomeCode: string): LearningOutcome | undefined {
  return curriculumList
    .flatMap((curriculum) => curriculum.units)
    .flatMap((unit) => unit.outcomes)
    .find((outcome) => outcome.code === outcomeCode);
}

export type {
  CurriculumComponents,
  CurriculumUnit,
  GradeCurriculum,
  GradeLevel,
  LearningOutcome,
} from "@/curriculum/types";
