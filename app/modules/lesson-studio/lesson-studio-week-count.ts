import { LessonStudioContentUnavailableError } from "./weekly-content-2026.ts";

/**
 * Ders Tasarım Stüdyosu haftalık ders saati program kuralı.
 * Değerler kanonik müfredat veri setindeki program_rules.weekly_hours
 * alanından gelir; birim kodu önek listelerinden türetilmez.
 */
export const lessonStudioWeeklyHours: Readonly<Record<string, number>> = Object.freeze({
  philosophy: 2,
  sociology: 2,
});

/**
 * Hafta sayısını program kuralından (haftalık ders saati) türetir.
 * Tanımsız branşlar için fail-closed davranır.
 */
export function getLessonStudioWeekCountByProgramRule(
  durationHours: number,
  subjectCode: string = "philosophy",
): number {
  const weeklyHours = lessonStudioWeeklyHours[subjectCode];
  if (!Number.isFinite(weeklyHours) || weeklyHours < 1) {
    throw new LessonStudioContentUnavailableError(subjectCode);
  }
  const weekCount = Math.ceil(durationHours / weeklyHours);
  if (!Number.isInteger(weekCount) || weekCount < 1) {
    throw new Error(
      `${subjectCode} branşı için ${durationHours} ders saatinden hafta sayısı türetilemedi.`,
    );
  }
  return weekCount;
}
