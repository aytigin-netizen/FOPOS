import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { buildAnnualPlanRegressionFixture2026 } from "../app/modules/annual-plan/annual-plan-2026-preview.ts";
import { officialAnnualPlanWeekCount2026 } from "../app/modules/annual-plan/annual-plan-2026-framework.ts";

const curriculum2026 = JSON.parse(
  readFileSync(new URL("../app/data/felsefe_curriculum_2026.json", import.meta.url), "utf8"),
);
const transition = JSON.parse(
  readFileSync(new URL("../app/data/felsefe_curriculum_2026_transition.json", import.meta.url), "utf8"),
);
const plans = new Map(
  [10, 11].map((grade) => [grade, buildAnnualPlanRegressionFixture2026(curriculum2026, grade)]),
);

test("2026 yıllık planlarında 68 öğretim + 4 planlama = 72 saat korunur", () => {
  for (const [grade, rows] of plans) {
    const lessons = rows.filter((row) => row.kind === "lesson");
    const planning = rows.filter((row) => row.kind === "planning");
    assert.equal(lessons.reduce((sum, row) => sum + row.hours, 0), 68, `${grade}. sınıf`);
    assert.equal(planning.reduce((sum, row) => sum + row.hours, 0), 4, `${grade}. sınıf`);
    assert.equal(rows.reduce((sum, row) => sum + row.hours, 0), 72, `${grade}. sınıf`);
    assert.ok(rows.every((row) => row.hours === 2));
    assert.equal(lessons.length, 34);
    assert.equal(planning.length, 2);
  }
});

test("ünite sırası ve hafta süreleri kanonik 2026 verisiyle bire bir eşleşir", () => {
  for (const [grade, rows] of plans) {
    const lessons = rows.filter((row) => row.kind === "lesson");
    const actualCodes = [...new Set(lessons.map((row) => row.unitCode))];
    const canonicalUnits = curriculum2026.grades[String(grade)].units;
    assert.deepEqual(actualCodes, canonicalUnits.map((unit) => unit.unit_code));
    for (const unit of canonicalUnits) {
      assert.equal(
        lessons.filter((row) => row.unitCode === unit.unit_code).length,
        unit.duration_hours / 2,
        unit.unit_code,
      );
      assert.equal(officialAnnualPlanWeekCount2026(unit.unit_code), unit.duration_hours / 2, unit.unit_code);
    }
  }
  const grade10 = plans.get(10);
  assert.equal(grade10.filter((row) => row.unitCode === "F10_U2").length, 3);
  assert.equal(grade10.filter((row) => row.unitCode === "F10_U3").length, 5);
});

test("haftalık çıktı ve süreç bileşeni dağılımı 2026-2027 çerçeve planını izler", () => {
  const grade10 = plans.get(10).filter((row) => row.kind === "lesson");
  assert.deepEqual(grade10[5].componentSteps, ["a", "b"]);
  assert.equal(grade10[5].outcomeCode, "FEL.10.2.1");
  assert.deepEqual(grade10[6].componentSteps, ["a", "b"]);
  assert.equal(grade10[6].outcomeCode, "FEL.10.2.2");
  assert.deepEqual(grade10[7].componentSteps, ["c"]);
  assert.deepEqual(grade10.slice(8, 13).map((row) => row.componentSteps), [["a"], ["b"], ["c"], ["ç"], ["ç"]]);

  const grade11 = plans.get(11).filter((row) => row.kind === "lesson");
  assert.deepEqual(grade11.slice(0, 6).map((row) => row.componentSteps), [["a"], ["b"], ["a"], ["b"], ["c"], ["c"]]);
  assert.deepEqual(grade11.slice(12, 17).map((row) => row.componentSteps), [["a"], ["b"], ["a"], ["b"], ["c"]]);
});

test("yıllık plan kod kümeleri kanonik çıktıları eksiksiz taşır", () => {
  for (const [grade, rows] of plans) {
    const actual = [...new Set(rows.map((row) => row.outcomeCode).filter(Boolean))].sort();
    const expected = curriculum2026.grades[String(grade)].units
      .flatMap((unit) => unit.learning_outcomes.map((outcome) => outcome.outcome_code))
      .sort();
    assert.deepEqual(actual, expected);
  }
  assert.equal(plans.get(10).some((row) => row.outcomeCode === "FEL.10.1.2"), false);
  assert.equal(plans.get(10).filter((row) => row.kind === "lesson").length, 34);
  assert.equal(new Set(plans.get(10).map((row) => row.outcomeCode).filter(Boolean)).size, 10);
  assert.equal(new Set(plans.get(11).map((row) => row.outcomeCode).filter(Boolean)).size, 12);
});

test("okul temelli planlama kariyer rehberliği odağını açıkça taşır", () => {
  for (const rows of plans.values()) {
    const planning = rows.filter((row) => row.kind === "planning");
    assert.ok(planning.every((row) => /meslek seçimi/iu.test(row.outcomeDescription)));
    assert.ok(planning.every((row) => /kariyer (planlaması|danışmanlığı)/iu.test(row.outcomeDescription)));
  }
});

test("2026 yıllık plan çıktıları mutasyondan yalıtılır ve runtime etkinliğini taşır", () => {
  for (const rows of plans.values()) {
    assert.equal(Object.isFrozen(rows), true);
    assert.ok(rows.every((row) => Object.isFrozen(row)));
    assert.ok(rows.every((row) => Object.isFrozen(row.componentSteps)));
    assert.throws(() => rows.push({}), TypeError);
  }
  assert.equal(curriculum2026.runtime_enabled, true);
  assert.equal(transition.runtimeEnabled, true);
  assert.equal(transition.status, "runtime-enabled-deployment-complete");
  assert.ok(transition.completedGates.includes("2026.1 annual plan regression"));
  assert.equal(transition.compatibilityPolicy.runtimeActivationRequires.includes("annual plan regression"), false);
  assert.equal(transition.compatibilityPolicy.runtimeActivationRequires.includes("document and assessment regression"), false);
  assert.deepEqual(transition.compatibilityPolicy.runtimeActivationRequires, []);
});
