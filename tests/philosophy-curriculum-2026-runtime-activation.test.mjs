import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { getCurriculumContext } from "../app/data/curriculum-runtime.ts";
import { philosophyPhaseCatalog2026 } from "../app/modules/lesson-studio/phase-catalog-2026.ts";
import { phaseCatalogForDataset } from "../app/modules/lesson-studio/phase-catalog-runtime.ts";
import { specialPhaseCatalog } from "../app/modules/lesson-studio/phase-catalog.ts";
import { loadPackage } from "../src/core/curriculum/package-loader.ts";

const legacy2024 = JSON.parse(
  readFileSync(new URL("../app/data/felsefe_curriculum_2024.json", import.meta.url), "utf8"),
);
const transition = JSON.parse(
  readFileSync(new URL("../app/data/felsefe_curriculum_2026_transition.json", import.meta.url), "utf8"),
);

test("varsayılan felsefe paketi 2026.1 çalışma zamanını yükler", () => {
  const active = loadPackage("philosophy");
  assert.equal(active.manifest.datasetVersion, "2026.1");
  assert.equal(active.manifest.source.year, 2026);
  assert.equal(active.units.length, 15);
  assert.equal(active.units.flatMap((unit) => unit.outcomes).length, 22);
  assert.equal(active.units.find((unit) => unit.code === "F10_U2").durationHours, 6);
  assert.equal(active.units.find((unit) => unit.code === "F10_U3").durationHours, 10);
  assert.equal(active.units.some((unit) => unit.outcomes.some((outcome) => outcome.code === "FEL.10.1.2")), false);
  assert.ok(active.units.find((unit) => unit.code === "F10_U2").outcomes.some((outcome) => outcome.code === "FEL.10.2.2"));
});

test("felsefe runtime bağlamı 15 ünite ve 22 zenginleştirilmiş çıktı taşır", () => {
  const context = getCurriculumContext("philosophy");
  assert.equal(context.datasetVersion, "2026.1");
  assert.equal(context.sourceYear, 2026);
  assert.deepEqual(context.supportedGrades, [10, 11]);
  assert.equal(context.units.length, 15);
  assert.equal(context.units.flatMap((unit) => unit.outcomes).length, 22);
  for (const unit of context.units) {
    assert.equal(unit.subjectCode, "philosophy");
    assert.ok(unit.keywords.length > 0);
    assert.ok(unit.contentFramework.length > 0);
    assert.ok(unit.competencyFramework.fieldSkills.length > 0);
    assert.ok(unit.learningEvidence.length > 0);
    assert.ok(unit.outcomes.every((outcome) => outcome.processComponents.length >= 2));
  }
});

test("etkin ders motoru kataloğu 22 çıktının her birinde 2026 alan-özgü akışı seçer", () => {
  const context = getCurriculumContext("philosophy");
  const activeCatalog = phaseCatalogForDataset(context.datasetVersion);
  for (const unit of context.units) {
    for (const outcome of unit.outcomes) {
      assert.equal(activeCatalog[outcome.code], philosophyPhaseCatalog2026[outcome.code]);
      assert.equal(activeCatalog[outcome.code].reduce((sum, phase) => sum + phase.duration, 0), 80);
    }
  }
});

test("2024 veri ve özel katalog yalnız geriye dönük uyumluluk için korunur", () => {
  assert.equal(legacy2024.dataset_version, "2024.1");
  assert.equal(legacy2024.grades["10"].units[0].learning_outcomes.some((item) => item.outcome_code === "FEL.10.1.2"), true);
  assert.deepEqual(Object.keys(specialPhaseCatalog), ["FEL.10.1.1", "FEL.10.1.2"]);
  assert.equal(transition.compatibilityPolicy.preserveDataset, "2024.1");
  assert.equal(transition.compatibilityPolicy.preserveHistoricalAuditRecords, true);
  assert.equal(transition.compatibilityPolicy.doNotRewriteArchivedOutcomeCodes, true);
});

test("runtime etkin, canlı dağıtım ve kullanıcı kabulü tamamlanmıştır", () => {
  assert.equal(transition.runtimeEnabled, true);
  assert.equal(transition.status, "runtime-enabled-deployment-complete");
  assert.deepEqual(transition.compatibilityPolicy.runtimeActivationRequires, []);
  assert.ok(transition.completedGates.includes("2026.1 annual plan regression"));
  assert.ok(transition.completedGates.includes("2026.1 document and assessment regression"));
  assert.ok(transition.completedGates.includes("explicit user approval for 2026.1 runtime activation"));
  assert.ok(transition.completedGates.includes("2026.1 runtime activation"));
  assert.ok(transition.completedGates.includes("2026.1 live deployment"));
  assert.ok(transition.completedGates.includes("2026.1 live user acceptance"));
});
