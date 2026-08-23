import type { Unit } from "../../data/curriculum.ts";

export function getOutcomeForWeek(unit: Unit, week: number) {
  if (!Number.isInteger(week) || week < 1 || week > unit.hours) {
    throw new Error(`${week}. hafta ${unit.code} ünitesinin 1-${unit.hours} haftalık kapsamı dışında.`);
  }
  if (unit.outcomes.length === 0) {
    throw new Error(`${unit.code} ünitesinde haftaya eşlenecek öğrenme çıktısı bulunamadı.`);
  }

  const outcomeIndex = Math.min(
    unit.outcomes.length - 1,
    Math.floor(((week - 1) * unit.outcomes.length) / unit.hours),
  );
  return unit.outcomes[outcomeIndex];
}
