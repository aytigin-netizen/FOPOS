import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { getCurriculumContext } from "../app/data/curriculum-runtime.ts";
import { philosophyPhaseCatalog2026 } from "../app/modules/lesson-studio/phase-catalog-2026.ts";

const baseline = JSON.parse(
  await readFile(new URL("../config/release-baseline-2026.2.json", import.meta.url), "utf8"),
);
const transition = JSON.parse(
  await readFile(new URL("../app/data/felsefe_curriculum_2026_transition.json", import.meta.url), "utf8"),
);
const integratedWorkflowSource = await readFile(
  new URL("./integrated-document-workflow-2026.test.mjs", import.meta.url),
  "utf8",
);
const curriculum = getCurriculumContext("philosophy");

test("2026.2 sürüm temeli kabul kimliklerini sabit tutar", () => {
  assert.equal(baseline.schemaVersion, "1.0.0");
  assert.equal(baseline.baselineId, "OPUS-FOPOS-2026.2-INTEGRATED-REGRESSION");
  assert.equal(baseline.acceptedMainCommit, "7749b47f3ca0a56429d0f1049ca3e46483f4ce41");
  assert.equal(baseline.acceptedLiveVersion, 130);
  assert.equal(baseline.tests.targetedIntegratedBaseline, 60);
  assert.equal(baseline.tests.contractBaseline, 502);
});

test("sürüm temeli kanonik runtime ile 15 ünite, 22 çıktı ve 68 hafta eşleşir", () => {
  const outcomes = curriculum.units.flatMap((unit) => unit.outcomes);
  const canonicalWeeks = curriculum.units.reduce((sum, unit) => sum + unit.hours / 2, 0);
  const instructionHours = curriculum.units.reduce((sum, unit) => sum + unit.hours, 0);

  assert.equal(curriculum.datasetVersion, baseline.curriculum.datasetVersion);
  assert.deepEqual(curriculum.supportedGrades, baseline.curriculum.grades);
  assert.equal(curriculum.units.length, baseline.curriculum.unitCount);
  assert.equal(outcomes.length, baseline.curriculum.learningOutcomeCount);
  assert.equal(canonicalWeeks, baseline.curriculum.canonicalWeekCount);
  assert.equal(instructionHours, baseline.curriculum.instructionHours);
  assert.equal(baseline.curriculum.schoolBasedPlanningHoursPerGrade, 4);
});

test("sürüm temeli 22 alan-özgü akışta 9 aşama ve 80 dakikayı korur", () => {
  const outcomeCodes = curriculum.units.flatMap((unit) =>
    unit.outcomes.map((outcome) => outcome.code)
  );

  assert.equal(Object.keys(philosophyPhaseCatalog2026).length, baseline.curriculum.learningOutcomeCount);
  for (const outcomeCode of outcomeCodes) {
    const phases = philosophyPhaseCatalog2026[outcomeCode];
    assert.ok(phases, outcomeCode);
    assert.equal(phases.length, baseline.pedagogy.phaseCount, outcomeCode);
    assert.equal(
      phases.reduce((sum, phase) => sum + phase.duration, 0),
      baseline.pedagogy.durationMinutes,
      outcomeCode,
    );
  }
});

test("sürüm temeli 15 bütünleşik senaryo ve 90 belge zinciri adımını eşler", () => {
  const catalogBlock = integratedWorkflowSource.match(
    /const integratedScenarioCatalog = Object\.freeze\(\[([\s\S]*?)\n\]\);/u,
  )?.[1];
  assert.ok(catalogBlock, "Bütünleşik senaryo kataloğu bulunmalıdır.");
  const scenarioCodes = [...catalogBlock.matchAll(/unitCode: "(F(?:10|11)_U\d+)"/gu)]
    .map((match) => match[1])
    .sort();
  const expectedCodes = [...baseline.integratedWorkflow.scenarioUnitCodes].sort();

  assert.equal(scenarioCodes.length, baseline.integratedWorkflow.scenarioCount);
  assert.deepEqual(scenarioCodes, expectedCodes);
  assert.equal(
    baseline.integratedWorkflow.scenarioCount * baseline.integratedWorkflow.documentStages.length,
    baseline.integratedWorkflow.documentChainStepCount,
  );
  assert.match(integratedWorkflowSource, /scenario\.week \+ 1/gu);
  assert.equal(baseline.pedagogy.rejectFirstOutOfScopeWeek, true);
});

test("sürüm temeli 2024 arşivini ve etkin çıktı sınırlarını korur", () => {
  const activeOutcomeCodes = curriculum.units.flatMap((unit) =>
    unit.outcomes.map((outcome) => outcome.code)
  );

  assert.equal(transition.compatibilityPolicy.preserveDataset, baseline.compatibility.preserveDataset);
  assert.equal(transition.compatibilityPolicy.preserveHistoricalAuditRecords, true);
  assert.equal(baseline.compatibility.doNotRewriteHistoricalRecords, true);
  for (const code of baseline.compatibility.excludedActiveOutcomeCodes) {
    assert.equal(activeOutcomeCodes.includes(code), false, code);
  }
  for (const code of baseline.compatibility.requiredActiveOutcomeCodes) {
    assert.equal(activeOutcomeCodes.includes(code), true, code);
  }
});
