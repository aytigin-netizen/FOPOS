import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { specialPhaseCatalog } from "../app/modules/lesson-studio/phase-catalog.ts";
import { philosophyPhaseCatalog2026 } from "../app/modules/lesson-studio/phase-catalog-2026.ts";

const curriculum2026 = JSON.parse(
  readFileSync(new URL("../app/data/felsefe_curriculum_2026.json", import.meta.url), "utf8"),
);
const transition = JSON.parse(
  readFileSync(new URL("../app/data/felsefe_curriculum_2026_transition.json", import.meta.url), "utf8"),
);

const canonicalOutcomeCodes = new Set(
  Object.values(curriculum2026.grades).flatMap((grade) =>
    grade.units.flatMap((unit) => unit.learning_outcomes.map((outcome) => outcome.outcome_code)),
  ),
);
const requiredFields = ["label", "facilitator", "learner", "evidence"];

test("2026 önizleme kataloğu yalnız yeniden yazılan ve yeni çıktıları taşır", () => {
  assert.deepEqual(Object.keys(philosophyPhaseCatalog2026), ["FEL.10.1.1", "FEL.10.2.2"]);
  assert.equal(philosophyPhaseCatalog2026["FEL.10.1.2"], undefined);
});

test("2026 akışları dokuz aşama, 80 dakika ve eksiksiz alanlar taşır", () => {
  for (const [code, phases] of Object.entries(philosophyPhaseCatalog2026)) {
    assert.equal(phases.length, 9, `${code} dokuz aşama taşımalıdır.`);
    assert.equal(
      phases.reduce((sum, phase) => sum + phase.duration, 0),
      80,
      `${code} toplam 80 dakika olmalıdır.`,
    );
    for (const phase of phases) {
      assert.ok(Number.isFinite(phase.duration) && phase.duration > 0);
      for (const field of requiredFields) {
        assert.equal(typeof phase[field], "string");
        assert.ok(phase[field].trim().length > 0, `${code} ${field} alanı zorunludur.`);
      }
    }
  }
});

test("2026 katalog kodları kanonik veri kümesinde bulunur ve arşiv kodu bulunmaz", () => {
  for (const code of Object.keys(philosophyPhaseCatalog2026)) {
    assert.equal(canonicalOutcomeCodes.has(code), true, `${code} kanonik 2026 veri kümesinde bulunmalıdır.`);
  }
  assert.equal(canonicalOutcomeCodes.has("FEL.10.1.2"), false);
});

test("2026 katalog ve içindeki bütün girdiler dondurulmuştur", () => {
  assert.equal(Object.isFrozen(philosophyPhaseCatalog2026), true);
  for (const phases of Object.values(philosophyPhaseCatalog2026)) {
    assert.equal(Object.isFrozen(phases), true);
    for (const phase of phases) assert.equal(Object.isFrozen(phase), true);
  }
  assert.throws(() => {
    philosophyPhaseCatalog2026["FEL.10.1.1"][0].label = "Bozuk";
  }, TypeError);
});

test("2024 canlı katalog ve çalışma zamanı geçiş boyunca korunur", () => {
  assert.deepEqual(Object.keys(specialPhaseCatalog), ["FEL.10.1.1", "FEL.10.1.2"]);
  assert.equal(specialPhaseCatalog["FEL.10.2.2"], undefined);
  assert.equal(transition.compatibilityPolicy.preserveDataset, "2024.1");
  assert.equal(transition.runtimeEnabled, false);
});

test("geçiş manifesti 1.4 akış kapısını tamamlanmış olarak kaydeder", () => {
  assert.equal(transition.status, "phase-flows-present-runtime-disabled");
  assert.ok(transition.completedGates.includes("2026.1 outcome-specific nine-phase flows"));
  assert.ok(
    !transition.compatibilityPolicy.runtimeActivationRequires.includes(
      "author 2026.1 outcome-specific phase flows",
    ),
  );
});
