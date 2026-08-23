import assert from "node:assert/strict";
import test from "node:test";

import { getCurriculumContext } from "../app/data/curriculum-runtime.ts";
import { philosophyPhaseCatalog2026 } from "../app/modules/lesson-studio/phase-catalog-2026.ts";
import { getOutcomeForWeek } from "../app/modules/lesson-studio/week-outcome.ts";
import { getLessonStudioWeekCount, getUnitWeekFocus, specializePhasesForWeek } from "../app/modules/lesson-studio/weekly-content-2026.ts";

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

test("Felsefenin Doğası on ayrı ve müfredat sıralı hafta odağı taşır", () => {
  const titles = Array.from({ length: 10 }, (_, index) => getUnitWeekFocus("F10_U1", index + 1));
  assert.equal(new Set(titles).size, 10);
  assert.match(titles[0], /Felsefenin anlamı/u);
  assert.match(titles[2], /temel özellikleri/u);
  assert.match(titles[5], /Dünya felsefe gelenekleri/u);
  assert.match(titles[6], /Felsefi sorunun/u);
  assert.match(titles[7], /bilim, din ve sanatla/u);
  assert.match(titles[8], /bireysel ve toplumsal işlevleri/u);
  assert.match(titles[9], /röportaj ve performans görevi/u);
});

test("Felsefenin Doğası ilk, geçiş ve son haftalarda ayrı plan içeriği üretir", () => {
  const basePhases = philosophyPhaseCatalog2026["FEL.10.1.1"];
  const first = specializePhasesForWeek("FEL.10.1.1", 1, basePhases);
  const transition = specializePhasesForWeek("FEL.10.1.1", 7, basePhases);
  const last = specializePhasesForWeek("FEL.10.1.1", 10, basePhases);

  assert.notDeepEqual(first, transition);
  assert.notDeepEqual(transition, last);
  assert.match(JSON.stringify(first), /bilgelik sevgisi/u);
  assert.match(JSON.stringify(transition), /özgün soru/u);
  assert.match(JSON.stringify(last), /röportaj ürünü/u);

  for (const phases of [first, transition, last]) {
    assert.equal(phases.length, 9);
    assert.equal(phases.reduce((sum, phase) => sum + phase.duration, 0), 80);
    assert.ok(phases.every((phase) => phase.facilitator && phase.learner && phase.evidence));
  }
});

test("Felsefe, Mantık ve Argümantasyon altı ayrı ve çıktı geçişli hafta odağı taşır", () => {
  const unit = getCurriculumContext("philosophy").units.find((item) => item.code === "F10_U2");
  assert.ok(unit);
  const titles = Array.from({ length: unit.hours }, (_, index) => getUnitWeekFocus("F10_U2", index + 1));

  assert.equal(unit.hours, 6);
  assert.equal(new Set(titles).size, 6);
  assert.match(titles[0], /Düşünme, dil, anlam/u);
  assert.match(titles[2], /uyumlu bir model/u);
  assert.match(titles[3], /temel kavramları/u);
  assert.match(titles[4], /Argümanın yapısı/u);
  assert.match(titles[5], /safsata çözümleme/u);
  assert.equal(getOutcomeForWeek(unit, 3).code, "FEL.10.2.1");
  assert.equal(getOutcomeForWeek(unit, 4).code, "FEL.10.2.2");
});

test("Felsefe, Mantık ve Argümantasyon ilk, geçiş ve son haftalarda ayrı plan içeriği üretir", () => {
  const first = specializePhasesForWeek("FEL.10.2.1", 1, philosophyPhaseCatalog2026["FEL.10.2.1"]);
  const beforeTransition = specializePhasesForWeek("FEL.10.2.1", 3, philosophyPhaseCatalog2026["FEL.10.2.1"]);
  const afterTransition = specializePhasesForWeek("FEL.10.2.2", 4, philosophyPhaseCatalog2026["FEL.10.2.2"]);
  const last = specializePhasesForWeek("FEL.10.2.2", 6, philosophyPhaseCatalog2026["FEL.10.2.2"]);

  assert.notDeepEqual(first, beforeTransition);
  assert.notDeepEqual(beforeTransition, afterTransition);
  assert.notDeepEqual(afterTransition, last);
  assert.match(JSON.stringify(first), /Düşünme–dil–anlam kavram ağı/u);
  assert.match(JSON.stringify(beforeTransition), /nedensel ilişki şeması/u);
  assert.match(JSON.stringify(afterTransition), /Mantık kavramları güvenlik tablosu/u);
  assert.match(JSON.stringify(last), /safsata karşı örneği/u);

  for (const phases of [first, beforeTransition, afterTransition, last]) {
    assert.equal(phases.length, 9);
    assert.equal(phases.reduce((sum, phase) => sum + phase.duration, 0), 80);
    assert.ok(phases.every((phase) => phase.facilitator && phase.learner && phase.evidence));
  }
});

test("Varlık Felsefesi kanonik 10 ders saatini beş haftalık stüdyo kapsamına dönüştürür", () => {
  const unit = getCurriculumContext("philosophy").units.find((item) => item.code === "F10_U3");
  assert.ok(unit);
  assert.equal(unit.hours, 10);
  assert.equal(getLessonStudioWeekCount(unit.code, unit.hours), 5);
  assert.equal(getUnitWeekFocus("F10_U3", 6), null);
});

test("Varlık Felsefesi beş ayrı ve müfredat sıralı hafta odağı taşır", () => {
  const titles = Array.from({ length: 5 }, (_, index) => getUnitWeekFocus("F10_U3", index + 1));
  assert.equal(new Set(titles).size, 5);
  assert.match(titles[0], /konusu ve temel kavramları/u);
  assert.match(titles[1], /Parmenides ve Gorgias/u);
  assert.match(titles[2], /temel açıklama modelleri/u);
  assert.match(titles[3], /Değişme, görünüş/u);
  assert.match(titles[4], /metni inceleme/u);
});

test("Varlık Felsefesi ilk, ara ve son haftalarda ayrı ve güvenli plan içeriği üretir", () => {
  const basePhases = philosophyPhaseCatalog2026["FEL.10.3.1"];
  const first = specializePhasesForWeek("FEL.10.3.1", 1, basePhases);
  const middle = specializePhasesForWeek("FEL.10.3.1", 3, basePhases);
  const transition = specializePhasesForWeek("FEL.10.3.1", 4, basePhases);
  const last = specializePhasesForWeek("FEL.10.3.1", 5, basePhases);

  assert.notDeepEqual(first, middle);
  assert.notDeepEqual(middle, transition);
  assert.notDeepEqual(transition, last);
  assert.match(JSON.stringify(first), /bilim–felsefe karşılaştırması/u);
  assert.match(JSON.stringify(middle), /sınıflandırma karşı örneği/u);
  assert.match(JSON.stringify(transition), /fenomeni yanılsamayla eşitlemeden/u);
  assert.match(JSON.stringify(last), /kaynaklı metin inceleme formu/u);

  for (const phases of [first, middle, transition, last]) {
    assert.equal(phases.length, 9);
    assert.equal(phases.reduce((sum, phase) => sum + phase.duration, 0), 80);
    assert.ok(phases.every((phase) => phase.facilitator && phase.learner && phase.evidence));
  }
});
