import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const dataset = JSON.parse(
  await readFile(new URL("../app/data/felsefe_curriculum_2026.json", import.meta.url), "utf8"),
);
const transition = JSON.parse(
  await readFile(new URL("../app/data/felsefe_curriculum_2026_transition.json", import.meta.url), "utf8"),
);
const units = [...dataset.grades["10"].units, ...dataset.grades["11"].units];
const outcomes = units.flatMap((unit) => unit.learning_outcomes);

test("2026 kanonik çekirdek kaynak kimliğini korur", () => {
  assert.equal(dataset.schema_version, "1.0.0");
  assert.equal(dataset.dataset_version, "2026.1");
  assert.equal(dataset.source.year, 2026);
  assert.equal(dataset.source.page_count, 76);
  assert.equal(dataset.status, "canonical-core-runtime-disabled");
  assert.equal(dataset.runtime_enabled, false);
});

test("resmî ünite, çıktı ve süre toplamları kaynak tablosuyla eşleşir", () => {
  assert.equal(units.length, 15);
  assert.equal(outcomes.length, 22);
  assert.equal(dataset.grades["10"].unit_count, 9);
  assert.equal(dataset.grades["10"].learning_outcome_count, 10);
  assert.equal(dataset.grades["11"].unit_count, 6);
  assert.equal(dataset.grades["11"].learning_outcome_count, 12);
  for (const grade of ["10", "11"]) {
    const gradeData = dataset.grades[grade];
    assert.equal(
      gradeData.units.reduce((sum, unit) => sum + unit.duration_hours, 0),
      68,
    );
    assert.equal(gradeData.school_based_planning_hours, 4);
    assert.equal(
      gradeData.instruction_hours + gradeData.school_based_planning_hours,
      72,
    );
  }
});

test("10. sınıf 2026 çıktı dağılımı ve süre değişimleri sabittir", () => {
  const [unit1, unit2, unit3] = dataset.grades["10"].units;
  assert.deepEqual(
    unit1.learning_outcomes.map((outcome) => outcome.outcome_code),
    ["FEL.10.1.1"],
  );
  assert.equal(unit1.duration_hours, 10);
  assert.deepEqual(
    unit2.learning_outcomes.map((outcome) => outcome.outcome_code),
    ["FEL.10.2.1", "FEL.10.2.2"],
  );
  assert.equal(unit2.duration_hours, 6);
  assert.equal(unit3.duration_hours, 10);
  assert.equal(outcomes.some((outcome) => outcome.outcome_code === "FEL.10.1.2"), false);
});

test("22 öğrenme çıktısının süreç bileşenleri boş değildir", () => {
  for (const outcome of outcomes) {
    assert.match(outcome.outcome_code, /^FEL\.(10|11)\.\d+\.\d+$/u);
    assert.ok(outcome.description.length > 0);
    assert.ok(outcome.process_components.length >= 2);
    assert.ok(
      outcome.process_components.every(
        (component) => component.step.length > 0 && component.description.length > 0,
      ),
    );
  }
  assert.equal(new Set(outcomes.map((outcome) => outcome.outcome_code)).size, 22);
});

test("2026 içerik çerçevesi ve anahtar kavram alanları her ünitede doludur", () => {
  for (const unit of units) {
    assert.ok(unit.content_framework.length > 0, unit.unit_code);
    assert.ok(unit.keywords.length > 0, unit.unit_code);
  }
});

test("kritik yeni çıktıların resmî süreç bileşenleri korunur", () => {
  const byCode = new Map(outcomes.map((outcome) => [outcome.outcome_code, outcome]));
  assert.deepEqual(
    byCode.get("FEL.10.2.1").process_components.map((item) => item.step),
    ["a", "b"],
  );
  assert.deepEqual(
    byCode.get("FEL.10.2.2").process_components.map((item) => item.step),
    ["a", "b", "c"],
  );
  assert.equal(
    byCode.get("FEL.10.1.1").process_components.at(-1).description,
    "Felsefenin bireysel ve toplumsal işlevlerini tartışır.",
  );
});

test("geçiş politikası 2024 arşivini korur ve 2026 runtime'ını kapalı tutar", () => {
  assert.equal(transition.compatibilityPolicy.preserveDataset, "2024.1");
  assert.equal(transition.compatibilityPolicy.doNotRewriteArchivedOutcomeCodes, true);
  assert.equal(dataset.runtime_enabled, false);
});
