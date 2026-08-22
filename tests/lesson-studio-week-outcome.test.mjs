import assert from "node:assert/strict";
import test from "node:test";

import { getCurriculumContext } from "../app/data/curriculum-runtime.ts";
import { philosophyPhaseCatalog2026 } from "../app/modules/lesson-studio/phase-catalog-2026.ts";
import { getOutcomeForWeek } from "../app/modules/lesson-studio/week-outcome.ts";
import { getUnitWeekFocus, specializePhasesForWeek } from "../app/modules/lesson-studio/weekly-content-2026.ts";

test("tek çıktılı ünitenin bütün haftaları aynı öğrenme çıktısına eşlenir", () => {
  const unit = getCurriculumContext("philosophy").units.find((item) => item.code === "F10_U3");
  assert.ok(unit);
  for (let week = 1; week <= unit.hours; week += 1) {
    assert.equal(getOutcomeForWeek(unit, week).code, "FEL.10.3.1");
  }
});

test("çok çıktılı ünitenin haftaları çıktı sırasına göre otomatik bölüştürülür", () => {
  const unit = getCurriculumContext("philosophy").units.find((item) => item.code === "F10_U2");
  assert.ok(unit);
  assert.deepEqual(
    Array.from({ length: unit.hours }, (_, index) => getOutcomeForWeek(unit, index + 1).code),
    ["FEL.10.2.1", "FEL.10.2.1", "FEL.10.2.1", "FEL.10.2.2", "FEL.10.2.2", "FEL.10.2.2"],
  );
});

test("ünite kapsamı dışındaki hafta sessizce yanlış çıktıya bağlanmaz", () => {
  const unit = getCurriculumContext("philosophy").units.find((item) => item.code === "F10_U2");
  assert.ok(unit);
  assert.throws(() => getOutcomeForWeek(unit, 0), /kapsamı dışında/);
  assert.throws(() => getOutcomeForWeek(unit, unit.hours + 1), /kapsamı dışında/);
});

test("Bilgi Felsefesi sekiz ayrı ve müfredat sıralı hafta odağı taşır", () => {
  const titles = Array.from({ length: 8 }, (_, index) => getUnitWeekFocus("F10_U4", index + 1));
  assert.equal(new Set(titles).size, 8);
  assert.match(titles[0], /konusu.*bilgi ve sanı/u);
  assert.match(titles[5], /kritisizm ve entüisyonizm/u);
  assert.match(titles[6], /doğruluk ölçütleri/u);
  assert.match(titles[7], /metni inceleme/u);
});

test("Bilgi Felsefesi 1. ve 6. hafta ayrı günlük plan içeriği üretir", () => {
  const basePhases = philosophyPhaseCatalog2026["FEL.10.4.1"];
  const first = specializePhasesForWeek("FEL.10.4.1", 1, basePhases);
  const sixth = specializePhasesForWeek("FEL.10.4.1", 6, basePhases);
  assert.notDeepEqual(first, sixth);
  assert.match(JSON.stringify(first), /Platon'un mağara benzetmesi/u);
  assert.match(JSON.stringify(sixth), /Kant ve Bergson/u);
  for (const phases of [first, sixth]) {
    assert.equal(phases.length, 9);
    assert.equal(phases.reduce((sum, phase) => sum + phase.duration, 0), 80);
  }
});
