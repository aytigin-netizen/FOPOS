import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

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

test("0000.1 veri seti kaldırılır ve tarihsel denetim kayıtları değiştirilmez", () => {
  assert.equal(transition.compatibilityPolicy.preserveDataset, null);
  assert.equal(transition.compatibilityPolicy.preserveHistoricalAuditRecords, true);
  assert.equal(transition.compatibilityPolicy.doNotRewriteArchivedOutcomeCodes, true);
});

test("10. sınıf yapısı yalnız etkin öğrenme çıktılarını ve süreleri taşır", () => {
  const [unit1, unit2, unit3] = transition.grade10Structure;
  assert.deepEqual(unit1.outcomes, ["FEL.10.1.1"]);
  assert.deepEqual(unit2.outcomes, ["FEL.10.2.1", "FEL.10.2.2"]);
  assert.equal(unit1.durationHours, 10);
  assert.equal(unit2.durationHours, 6);
  assert.equal(unit3.durationHours, 10);
  assert.equal(Object.hasOwn(transition, "grade10StructuralChanges"), false);
});

test("2026 çalışma zamanı canlı dağıtım ve kullanıcı kabulüyle kapatılır", () => {
  assert.equal(transition.status, "runtime-enabled-deployment-complete");
  assert.equal(transition.runtimeEnabled, true);
  assert.ok(transition.completedGates.includes("2026.1 annual plan regression"));
  assert.equal(transition.compatibilityPolicy.runtimeActivationRequires.includes("annual plan regression"), false);
  assert.equal(transition.compatibilityPolicy.runtimeActivationRequires.includes("document and assessment regression"), false);
  assert.deepEqual(transition.compatibilityPolicy.runtimeActivationRequires, []);
  assert.ok(transition.completedGates.includes("explicit user approval for 2026.1 runtime activation"));
  assert.ok(transition.completedGates.includes("2026.1 runtime activation"));
  assert.ok(transition.completedGates.includes("2026.1 live deployment"));
  assert.ok(transition.completedGates.includes("2026.1 live user acceptance"));
});
