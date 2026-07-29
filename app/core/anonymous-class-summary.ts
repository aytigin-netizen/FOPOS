export type AnonymousClassSummary = {
  schemaVersion: "1.0.0";
  module: "exam_analysis" | "student_performance";
  grade: SchoolGrade;
  groupSize: number;
  metrics: Record<string, number | null>;
};

const forbiddenKey = /name|student|öğrenci|number|numara|identity|kimlik|note|not/i;

export function createAnonymousClassSummary(input: Omit<AnonymousClassSummary, "schemaVersion">): AnonymousClassSummary {
  if (!Number.isInteger(input.groupSize) || input.groupSize < 5) {
    throw new Error("Kimliksiz sınıf özeti için en az 5 öğrenci gerekir.");
  }
  for (const [key, value] of Object.entries(input.metrics)) {
    if (forbiddenKey.test(key)) throw new Error(`Kimliksiz özette kişisel alan kullanılamaz: ${key}`);
    if (value !== null && !Number.isFinite(value)) throw new Error(`Geçersiz özet ölçümü: ${key}`);
  }
  return { schemaVersion: "1.0.0", module: input.module, grade: input.grade, groupSize: input.groupSize, metrics: { ...input.metrics } };
}
import type { SchoolGrade } from "./class-workspace";
