import type { Unit } from "../../data/curriculum.ts";
import { getLessonStudioWeekCount } from "./weekly-content-2026.ts";

export function getOutcomeForWeek(unit: Unit, week: number) {
  const weekCount = getLessonStudioWeekCount(unit.code, unit.hours);
  if (!Number.isInteger(week) || week < 1 || week > weekCount) {
    throw new Error(`${week}. hafta ${unit.code} ünitesinin 1-${weekCount} haftalık kapsamı dışında.`);
  }
  if (unit.outcomes.length === 0) {
    throw new Error(`${unit.code} ünitesinde haftaya eşlenecek öğrenme çıktısı bulunamadı.`);
  }

  if ((unit.code === "F11_U2" || unit.code === "F11_U3" || unit.code === "F11_U4" || unit.code === "F11_U5" || unit.code === "F11_U6") && unit.outcomes.length >= 2) {
    return unit.outcomes[week <= 2 ? 0 : 1];
  }

  if (unit.code === "F10_U2" && unit.outcomes.length >= 2) {
    return unit.outcomes[week === 1 ? 0 : 1];
  }

  const outcomeIndex = Math.min(
    unit.outcomes.length - 1,
    Math.floor(((week - 1) * unit.outcomes.length) / weekCount),
  );
  return unit.outcomes[outcomeIndex];
}
