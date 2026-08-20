import type { ScoreCell } from "./score-model";

export function scoreToDevelopmentLevel(score: ScoreCell, max: number) {
  if (score === null || max <= 0) return "-";
  const ratio = score / max;
  if (ratio < 0.25) return "1";
  if (ratio < 0.5) return "2";
  if (ratio < 0.75) return "3";
  return "4";
}

export function developmentBand(max: number, level: number) {
  const start = level === 1 ? 0 : ((level - 1) * max) / 4;
  const end = level === 4 ? max : (level * max) / 4 - 0.01;
  const format = (value: number) =>
    Number.isInteger(value) ? String(value) : value.toFixed(2);
  return `${format(start)}-${format(end)}`;
}
