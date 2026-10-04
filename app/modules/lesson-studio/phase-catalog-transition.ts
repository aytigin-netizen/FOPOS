export type PhaseMigrationState =
  | "active"
  | "general-fallback"
  | "requires-reauthoring"
  | "requires-authoring";

export type PhaseMigrationEntry = Readonly<{
  outcomeCode: string;
  state: PhaseMigrationState;
  note: string;
}>;

export const phaseCatalogTransition = Object.freeze({
  toDatasetVersion: "2026.1",
  runtimeEnabled: true,
  entries: Object.freeze([
    Object.freeze({
      outcomeCode: "FEL.10.1.1",
      state: "active",
      note: "FEL.10.1.1 için resmî 2026 öğrenme çıktısına bağlı alan-özgü akış etkindir.",
    }),
    Object.freeze({
      outcomeCode: "FEL.10.2.1",
      state: "active",
      note: "Düşünme ve dil ilişkisi için 2026 alan-özgü akış etkindir.",
    }),
    Object.freeze({
      outcomeCode: "FEL.10.2.2",
      state: "active",
      note: "Mantık ve argümantasyon için alan-özgü dokuz aşamalı akış etkindir.",
    }),
  ] satisfies readonly PhaseMigrationEntry[]),
});
