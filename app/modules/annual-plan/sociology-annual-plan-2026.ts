import { sociology2026Package } from '../../../src/curriculum-packages/sociology-2026.ts';

/** Program-derived draft allocation; not an official weekly framework.
 * Outcomes stay in canonical order. Each component is covered; a component
 * is revisited when its outcome has more allocated weeks than components.
 */
export function getSociologyAnnualPlanWeek2026(unitCode: string, zeroBasedUnitWeek: number) {
  const unit = sociology2026Package.units.find(candidate => candidate.code === unitCode);
  const weeklyHours = sociology2026Package.manifest.programRules?.weeklyHours;
  if (weeklyHours === undefined || !Number.isInteger(weeklyHours) || weeklyHours < 1) {
    throw new Error('Sosyoloji yıllık planı için haftalık ders saati kuralı bulunamadı.');
  }
  if (!unit || !Number.isInteger(zeroBasedUnitWeek) || zeroBasedUnitWeek < 0 || unit.durationHours % weeklyHours !== 0) {
    throw new Error(`${unitCode} için geçerli Sosyoloji yıllık plan haftası bulunamadı.`);
  }
  const weekCount = unit.durationHours / weeklyHours;
  if (zeroBasedUnitWeek >= weekCount || !unit.outcomes.length || unit.outcomes.length > weekCount) {
    throw new Error(`${unitCode} için ${zeroBasedUnitWeek + 1}. hafta kapsam dışında.`);
  }
  const outcomeIndex = Math.floor(zeroBasedUnitWeek * unit.outcomes.length / weekCount);
  const outcome = unit.outcomes[outcomeIndex];
  const start = Math.ceil(outcomeIndex * weekCount / unit.outcomes.length);
  const end = Math.ceil((outcomeIndex + 1) * weekCount / unit.outcomes.length);
  const localWeek = zeroBasedUnitWeek - start;
  const components = outcome.processComponents ?? [];
  const componentCount = components.length;
  if (!componentCount) throw new Error(`${outcome.code} süreç bileşenleri boş olamaz.`);
  const first = Math.floor(localWeek * componentCount / (end - start));
  const last = Math.max(first + 1, Math.floor((localWeek + 1) * componentCount / (end - start)));
  return Object.freeze({
    outcomeCode: outcome.code,
    componentSteps: Object.freeze(components.slice(first, last).map(component => component.step)),
  });
}
