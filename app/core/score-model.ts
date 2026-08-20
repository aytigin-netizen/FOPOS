export type ScoreCell = number | null;
export type ExamAttendance = "present" | "absent";

export function parseScoreCell(raw: string | number | null | undefined, maximum: number): ScoreCell {
  if (raw === null || raw === undefined || String(raw).trim() === "") return null;
  const value = Number(String(raw).replace(",", "."));
  if (!Number.isFinite(value)) return null;
  return Math.min(Math.max(value, 0), Math.max(maximum, 0));
}

export function hasCompleteScores(scores: ScoreCell[]): boolean {
  return scores.length > 0 && scores.every(score => score !== null);
}

export function scoreTotal(scores: ScoreCell[]): number | null {
  if (!hasCompleteScores(scores)) return null;
  return scores.reduce<number>((sum, score) => sum + (score as number), 0);
}

export function normalizedScore(scores: ScoreCell[], maxima: number[], attendance: ExamAttendance): number | null {
  if (attendance === "absent" || scores.length !== maxima.length) return null;
  const total = scoreTotal(scores);
  const maximum = maxima.reduce((sum, value) => sum + value, 0);
  return total === null || maximum <= 0 ? null : total * 100 / maximum;
}
