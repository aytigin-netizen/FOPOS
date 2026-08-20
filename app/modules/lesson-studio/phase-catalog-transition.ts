export type PhaseMigrationState =
  | "active"
  | "general-fallback"
  | "requires-reauthoring"
  | "requires-authoring"
  | "archived-only";

export type PhaseMigrationEntry = Readonly<{
  outcomeCode: string;
  state: PhaseMigrationState;
  note: string;
}>;

export const phaseCatalogTransition = Object.freeze({
  fromDatasetVersion: "2024.1",
  toDatasetVersion: "2026.1",
  runtimeEnabled: true,
  entries: Object.freeze([
    Object.freeze({
      outcomeCode: "FEL.10.1.1",
      state: "active",
      note: "2026 çıktısı, 2024 FEL.10.1.1 ve FEL.10.1.2 kapsamlarını birleştiren alan-özgü akışla etkindir.",
    }),
    Object.freeze({
      outcomeCode: "FEL.10.1.2",
      state: "archived-only",
      note: "Kod yalnız 2024.1 belgeleri ve üretim izleri için korunur; 2026.1 kataloğuna taşınmaz.",
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
