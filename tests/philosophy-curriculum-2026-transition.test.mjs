import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const legacy = JSON.parse(
  readFileSync(new URL("../app/data/felsefe_curriculum_2024.json", import.meta.url), "utf8"),
);
const transition = JSON.parse(
  readFileSync(new URL("../app/data/felsefe_curriculum_2026_transition.json", import.meta.url), "utf8"),
);

test("2026 geçiş manifesti doğrulanmış toplamları korur", () => {
  assert.equal(transition.invariants.unitCount, 15);
  assert.equal(transition.invariants.learningOutcomeCount, 22);
  assert.equal(transition.invariants.instructionHoursPerGrade, 68);
  assert.equal(transition.invariants.schoolBasedPlanningHoursPerGrade, 4);
  assert.equal(transition.invariants.annualTotalHoursPerGrade, 72);
});

test("2024.1 veri seti geçiş sırasında yerinde değiştirilmez", () => {
  assert.equal(legacy.dataset_version, "2024.1");
  assert.equal(transition.compatibilityPolicy.preserveDataset, "2024.1");
  assert.equal(transition.compatibilityPolicy.preserveHistoricalAuditRecords, true);
  assert.equal(transition.compatibilityPolicy.doNotRewriteArchivedOutcomeCodes, true);
});

test("10. sınıf yapısal kod geçişi açıkça tanımlıdır", () => {
  const [unit1, unit2, unit3] = transition.grade10StructuralChanges;
  assert.deepEqual(unit1.outcomes.to, ["FEL.10.1.1"]);
  assert.equal(unit1.migration["FEL.10.1.2"], "retired-and-merged-into-FEL.10.1.1");
  assert.deepEqual(unit2.outcomes.to, ["FEL.10.2.1", "FEL.10.2.2"]);
  assert.equal(unit2.durationHours.to, 6);
  assert.equal(unit3.durationHours.to, 10);
});

test("1.9 belge ve sınav kapısı tamamlansa da çalışma zamanı etkinleştirilemez", () => {
  assert.equal(transition.status, "document-assessment-regression-complete-runtime-disabled");
  assert.equal(transition.runtimeEnabled, false);
  assert.ok(transition.completedGates.includes("2026.1 annual plan regression"));
  assert.equal(transition.compatibilityPolicy.runtimeActivationRequires.includes("annual plan regression"), false);
  assert.equal(transition.compatibilityPolicy.runtimeActivationRequires.includes("document and assessment regression"), false);
  assert.ok(transition.compatibilityPolicy.runtimeActivationRequires.includes("explicit user approval"));
});
