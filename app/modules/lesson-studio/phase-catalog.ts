export type PhaseDefinition = {
  label: string;
  duration: number;
  facilitator: string;
  learner: string;
  evidence: string;
};

export type PhaseCatalog = Readonly<Record<string, readonly PhaseDefinition[]>>;

const requiredTextFields = ["label", "facilitator", "learner", "evidence"] as const;

export function validatePhaseCatalog(
  catalog: PhaseCatalog,
  expectedPhaseCount = 9,
  expectedDuration = 80,
): void {
  for (const [outcomeCode, phases] of Object.entries(catalog)) {
    if (phases.length !== expectedPhaseCount) {
      throw new Error(`${outcomeCode} özel akışı ${expectedPhaseCount} aşama taşımalıdır.`);
    }

    phases.forEach((phase, index) => {
      for (const field of requiredTextFields) {
        if (typeof phase[field] !== "string" || phase[field].trim().length === 0) {
          throw new Error(`${outcomeCode} ${index + 1}. aşamasında ${field} alanı zorunludur.`);
        }
      }
      if (!Number.isFinite(phase.duration) || phase.duration <= 0) {
        throw new Error(`${outcomeCode} ${index + 1}. aşamasında duration pozitif olmalıdır.`);
      }
    });

    const totalDuration = phases.reduce((sum, phase) => sum + phase.duration, 0);
    if (totalDuration !== expectedDuration) {
      throw new Error(`${outcomeCode} özel akışı toplam ${expectedDuration} dakika olmalıdır.`);
    }
  }
}
