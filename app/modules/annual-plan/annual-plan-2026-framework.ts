type OfficialAnnualPlanWeek = Readonly<{
  outcomeCode: string;
  componentSteps: readonly string[];
}>;

const officialAnnualPlanWeeks2026: Readonly<Record<string, readonly OfficialAnnualPlanWeek[]>> = Object.freeze({
  F10_U1: [
    { outcomeCode: "FEL.10.1.1", componentSteps: ["a"] },
    { outcomeCode: "FEL.10.1.1", componentSteps: ["b"] },
    { outcomeCode: "FEL.10.1.1", componentSteps: ["c"] },
    { outcomeCode: "FEL.10.1.1", componentSteps: ["ç"] },
    { outcomeCode: "FEL.10.1.1", componentSteps: ["d"] },
  ],
  F10_U2: [
    { outcomeCode: "FEL.10.2.1", componentSteps: ["a", "b"] },
    { outcomeCode: "FEL.10.2.2", componentSteps: ["a", "b"] },
    { outcomeCode: "FEL.10.2.2", componentSteps: ["c"] },
  ],
  F10_U3: [
    { outcomeCode: "FEL.10.3.1", componentSteps: ["a"] },
    { outcomeCode: "FEL.10.3.1", componentSteps: ["b"] },
    { outcomeCode: "FEL.10.3.1", componentSteps: ["c"] },
    { outcomeCode: "FEL.10.3.1", componentSteps: ["ç"] },
    { outcomeCode: "FEL.10.3.1", componentSteps: ["ç"] },
  ],
  F10_U4: [
    { outcomeCode: "FEL.10.4.1", componentSteps: ["a"] },
    { outcomeCode: "FEL.10.4.1", componentSteps: ["b"] },
    { outcomeCode: "FEL.10.4.1", componentSteps: ["c"] },
    { outcomeCode: "FEL.10.4.1", componentSteps: ["ç"] },
  ],
  F10_U5: [
    { outcomeCode: "FEL.10.5.1", componentSteps: ["a"] },
    { outcomeCode: "FEL.10.5.1", componentSteps: ["b"] },
    { outcomeCode: "FEL.10.5.1", componentSteps: ["c"] },
    { outcomeCode: "FEL.10.5.1", componentSteps: ["ç"] },
  ],
  F10_U6: [
    { outcomeCode: "FEL.10.6.1", componentSteps: ["a", "b"] },
    { outcomeCode: "FEL.10.6.1", componentSteps: ["c"] },
    { outcomeCode: "FEL.10.6.1", componentSteps: ["ç"] },
  ],
  F10_U7: [
    { outcomeCode: "FEL.10.7.1", componentSteps: ["a"] },
    { outcomeCode: "FEL.10.7.1", componentSteps: ["b"] },
    { outcomeCode: "FEL.10.7.1", componentSteps: ["c"] },
    { outcomeCode: "FEL.10.7.1", componentSteps: ["ç"] },
  ],
  F10_U8: [
    { outcomeCode: "FEL.10.8.1", componentSteps: ["a", "b"] },
    { outcomeCode: "FEL.10.8.1", componentSteps: ["c"] },
    { outcomeCode: "FEL.10.8.1", componentSteps: ["ç"] },
  ],
  F10_U9: [
    { outcomeCode: "FEL.10.9.1", componentSteps: ["a", "b"] },
    { outcomeCode: "FEL.10.9.1", componentSteps: ["c"] },
    { outcomeCode: "FEL.10.9.1", componentSteps: ["ç"] },
  ],
  F11_U1: [
    { outcomeCode: "FEL.11.1.1", componentSteps: ["a"] },
    { outcomeCode: "FEL.11.1.1", componentSteps: ["b"] },
    { outcomeCode: "FEL.11.1.2", componentSteps: ["a"] },
    { outcomeCode: "FEL.11.1.2", componentSteps: ["b"] },
    { outcomeCode: "FEL.11.1.2", componentSteps: ["c"] },
    { outcomeCode: "FEL.11.1.2", componentSteps: ["c"] },
  ],
  F11_U2: [
    { outcomeCode: "FEL.11.2.1", componentSteps: ["a"] },
    { outcomeCode: "FEL.11.2.1", componentSteps: ["b"] },
    { outcomeCode: "FEL.11.2.2", componentSteps: ["a"] },
    { outcomeCode: "FEL.11.2.2", componentSteps: ["b"] },
    { outcomeCode: "FEL.11.2.2", componentSteps: ["c"] },
    { outcomeCode: "FEL.11.2.2", componentSteps: ["c"] },
  ],
  F11_U3: [
    { outcomeCode: "FEL.11.3.1", componentSteps: ["a"] },
    { outcomeCode: "FEL.11.3.1", componentSteps: ["b"] },
    { outcomeCode: "FEL.11.3.2", componentSteps: ["a"] },
    { outcomeCode: "FEL.11.3.2", componentSteps: ["b"] },
    { outcomeCode: "FEL.11.3.2", componentSteps: ["c"] },
  ],
  F11_U4: [
    { outcomeCode: "FEL.11.4.1", componentSteps: ["a"] },
    { outcomeCode: "FEL.11.4.1", componentSteps: ["b"] },
    { outcomeCode: "FEL.11.4.2", componentSteps: ["a"] },
    { outcomeCode: "FEL.11.4.2", componentSteps: ["b"] },
    { outcomeCode: "FEL.11.4.2", componentSteps: ["c"] },
    { outcomeCode: "FEL.11.4.2", componentSteps: ["c"] },
  ],
  F11_U5: [
    { outcomeCode: "FEL.11.5.1", componentSteps: ["a"] },
    { outcomeCode: "FEL.11.5.1", componentSteps: ["b"] },
    { outcomeCode: "FEL.11.5.2", componentSteps: ["a"] },
    { outcomeCode: "FEL.11.5.2", componentSteps: ["b"] },
    { outcomeCode: "FEL.11.5.2", componentSteps: ["c"] },
    { outcomeCode: "FEL.11.5.2", componentSteps: ["c"] },
  ],
  F11_U6: [
    { outcomeCode: "FEL.11.6.1", componentSteps: ["a"] },
    { outcomeCode: "FEL.11.6.1", componentSteps: ["b"] },
    { outcomeCode: "FEL.11.6.2", componentSteps: ["a"] },
    { outcomeCode: "FEL.11.6.2", componentSteps: ["b"] },
    { outcomeCode: "FEL.11.6.2", componentSteps: ["c"] },
  ],
});

export function getOfficialAnnualPlanWeek2026(unitCode: string, zeroBasedUnitWeek: number) {
  const unitWeeks = officialAnnualPlanWeeks2026[unitCode];
  const week = unitWeeks?.[zeroBasedUnitWeek];
  if (!week) {
    throw new Error(`${unitCode} için ${zeroBasedUnitWeek + 1}. hafta 2026 çerçeve planında bulunamadı.`);
  }
  return Object.freeze({
    ...week,
    componentSteps: Object.freeze([...week.componentSteps]),
  });
}

export function officialAnnualPlanWeekCount2026(unitCode: string) {
  return officialAnnualPlanWeeks2026[unitCode]?.length ?? 0;
}
