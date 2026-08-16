export function selectPhaseSequence<T>(
  specialPhases: Readonly<Record<string, readonly T[]>>,
  outcomeCode: string,
  createGeneralPhases: () => readonly T[],
): T[] {
  const selected = specialPhases[outcomeCode] ?? createGeneralPhases();
  return structuredClone(selected) as T[];
}
