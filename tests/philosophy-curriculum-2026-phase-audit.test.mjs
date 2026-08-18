import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { philosophyPhaseCatalog2026 } from "../app/modules/lesson-studio/phase-catalog-2026.ts";
import { specialPhaseCatalog } from "../app/modules/lesson-studio/phase-catalog.ts";

const curriculum = JSON.parse(
  readFileSync(new URL("../app/data/felsefe_curriculum_2026.json", import.meta.url), "utf8"),
);
const transition = JSON.parse(
  readFileSync(new URL("../app/data/felsefe_curriculum_2026_transition.json", import.meta.url), "utf8"),
);

const canonicalEntries = Object.values(curriculum.grades).flatMap((grade) =>
  grade.units.flatMap((unit) =>
    unit.learning_outcomes.map((outcome) => ({ unit, outcome })),
  ),
);
const canonicalCodes = canonicalEntries.map(({ outcome }) => outcome.outcome_code);
const normalize = (value) => value.toLocaleLowerCase("tr-TR").replaceAll("ı", "i");

test("15 ünite ve 22 öğrenme çıktısı denetim evrenini oluşturur", () => {
  assert.equal(Object.values(curriculum.grades).flatMap((grade) => grade.units).length, 15);
  assert.equal(canonicalEntries.length, 22);
  assert.deepEqual(
    [...Object.keys(philosophyPhaseCatalog2026)].sort(),
    [...canonicalCodes].sort(),
  );
});

test("22 akışın her biri dokuz aşama, 80 dakika ve yeterli kanıt çeşitliliği taşır", () => {
  for (const code of canonicalCodes) {
    const phases = philosophyPhaseCatalog2026[code];
    assert.equal(phases.length, 9, `${code} dokuz aşama taşımalıdır.`);
    assert.equal(phases.reduce((sum, phase) => sum + phase.duration, 0), 80);
    assert.equal(new Set(phases.map((phase) => phase.label)).size, 9);
    assert.ok(new Set(phases.map((phase) => phase.evidence)).size >= 8);
  }
});

test("akışlar alan kavramlarıyla izlenebilir biçimde hizalanır", () => {
  for (const { unit, outcome } of canonicalEntries) {
    const phases = philosophyPhaseCatalog2026[outcome.outcome_code];
    const searchable = normalize(
      phases
        .flatMap((phase) => [phase.facilitator, phase.learner, phase.evidence])
        .join(" "),
    );
    const matchedKeywords = unit.keywords.filter((keyword) =>
      searchable.includes(normalize(keyword)),
    );
    assert.ok(
      matchedKeywords.length >= Math.min(2, unit.keywords.length),
      `${outcome.outcome_code} en az iki kanonik alan kavramını görünür kılmalıdır.`,
    );
  }
});

test("11. sınıf düşünce ortaya koyma çıktıları argüman ve metin üretim zinciri taşır", () => {
  const productionCodes = ["FEL.11.1.2", "FEL.11.2.2", "FEL.11.3.2", "FEL.11.4.2", "FEL.11.5.2", "FEL.11.6.2"];
  const requiredLabels = [
    "Argüman Çözümleme",
    "Görüş ve Argüman Oluşturma",
    "Felsefi Metin Yazma",
    "Akran Dönütü ve Yansıtma",
  ];
  for (const code of productionCodes) {
    const labels = philosophyPhaseCatalog2026[code].map((phase) => phase.label);
    for (const label of requiredLabels) assert.ok(labels.includes(label), `${code}: ${label}`);
  }
});

test("soru ve problem odaklı çıktılar muhakeme, metin ve hayatla ilişkilendirme kanıtı taşır", () => {
  const inquiryCodes = ["FEL.11.1.1", "FEL.11.2.1", "FEL.11.3.1", "FEL.11.4.1", "FEL.11.5.1", "FEL.11.6.1"];
  for (const code of inquiryCodes) {
    const phases = philosophyPhaseCatalog2026[code];
    assert.ok(phases.some((phase) => phase.label === "Felsefi Muhakeme"));
    assert.ok(phases.some((phase) => phase.label === "Metin İncelemesi ve Uygulama"));
    assert.ok(
      phases.some((phase) => /günlük|güncel|hayat|yerel|toplumsal|eser|teknoloji|inanç|hukuk/u.test(
        normalize(`${phase.facilitator} ${phase.learner}`),
      )),
      `${code} hayatla ilişkilendirme taşımalıdır.`,
    );
  }
});

test("hiçbir iki öğrenme çıktısı aynı tam pedagojik akışı paylaşmaz", () => {
  const signatures = Object.entries(philosophyPhaseCatalog2026).map(([code, phases]) => ({
    code,
    signature: JSON.stringify(phases),
  }));
  assert.equal(new Set(signatures.map(({ signature }) => signature)).size, signatures.length);
});

test("kanonik program bileşenleri 15 ünitenin tamamında denetlenebilir durumdadır", () => {
  for (const grade of Object.values(curriculum.grades)) {
    for (const unit of grade.units) {
      const competency = unit.competency_framework;
      assert.ok(competency.field_skills.length > 0, `${unit.unit_code}: alan becerisi`);
      assert.ok(competency.tendencies.length > 0, `${unit.unit_code}: eğilim`);
      assert.ok(competency.cross_program_components.social_emotional_learning.length > 0);
      assert.ok(competency.cross_program_components.values.length > 0);
      assert.ok(competency.cross_program_components.literacy.length > 0);
      assert.ok(competency.interdisciplinary_relations.length > 0);
      assert.ok(competency.inter_skill_relations.length > 0);
    }
  }
});

test("etkinleştirme 2024 arşiv kataloğunu korur ve denetim kapısını taşır", () => {
  assert.deepEqual(Object.keys(specialPhaseCatalog), ["FEL.10.1.1", "FEL.10.1.2"]);
  assert.equal(transition.status, "runtime-enabled-deployment-pending");
  assert.equal(transition.runtimeEnabled, true);
  assert.equal(transition.compatibilityPolicy.preserveDataset, "2024.1");
  assert.deepEqual(transition.compatibilityPolicy.runtimeActivationRequires, []);
  assert.ok(transition.completedGates.includes("2026.1 all phase flows integrity and alignment audit"));
});
