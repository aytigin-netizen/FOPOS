import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { getCurriculumContext } from "../app/data/curriculum-runtime.ts";
import { lessonValidationCheckCount, makeResult } from "../app/modules/lesson-studio/lesson-engine.ts";
import { loadPackage } from "../src/core/curriculum/package-loader.ts";

const page = await readFile(new URL("../app/ClientApp.tsx", import.meta.url), "utf8");

test("Sosyoloji Dersi 2 yalnız sosyal bilimler lisesi bağlamında açılır", () => {
  const general = getCurriculumContext("sociology", "general_secondary");
  assert.deepEqual(general.supportedGrades, [11]);
  assert.equal(general.unitCount, 5);
  assert.equal(general.learningOutcomeCount, 18);
  assert.ok(general.applicabilityNote?.includes("yalnızca sosyal bilimler liselerinde"));

  const socialSciences = getCurriculumContext("sociology", "social_sciences_high_school");
  assert.deepEqual(socialSciences.supportedGrades, [11, 12]);
  assert.equal(socialSciences.unitCount, 7);
  assert.equal(socialSciences.learningOutcomeCount, 21);
  assert.equal(socialSciences.applicabilityNote, null);

  const manifest = loadPackage({ disciplineCode: "sociology", datasetVersion: "2026.1" }).manifest;
  const course2 = manifest.applicability?.rules.find((rule) => rule.grade === 12);
  assert.equal(course2?.officialCourseName, "Sosyoloji Dersi 2");
  assert.deepEqual(course2?.schoolTypes, ["social_sciences_high_school"]);
});

test("Felsefe okul türünden bağımsız aynı kanonik kapsamı korur", () => {
  for (const schoolType of ["general_secondary", "social_sciences_high_school"]) {
    const context = getCurriculumContext("philosophy", schoolType);
    assert.deepEqual(context.supportedGrades, [10, 11]);
    assert.equal(context.unitCount, 15);
    assert.equal(context.learningOutcomeCount, 22);
  }
});

test("UI kapsam sayaçlarını aktif curriculum ve doğrulama sözleşmesinden alır", () => {
  assert.doesNotMatch(page, /<strong>15<\/strong>/);
  assert.doesNotMatch(page, /<strong>8<\/strong>/);
  assert.match(page, /curriculum\.unitCount/);
  assert.match(page, /lessonValidationCheckCount/);
  assert.match(page, /changeSchoolType/);
  assert.match(page, /social_sciences_high_school/);
  assert.match(page, /AnnualPlanModule[^\n]+curriculum=\{curriculum\}/);
  assert.match(page, /ExamBuilder[^\n]+units=\{units\}/);
});

test("tanıtım doğrulama sayısı gerçek plan doğrulama listesiyle aynıdır", () => {
  const context = getCurriculumContext("philosophy", "general_secondary");
  const unit = context.units[0];
  const result = makeResult(
    unit,
    unit.outcomes[0].code,
    "balanced",
    1,
    context.datasetVersion,
  );
  assert.equal(lessonValidationCheckCount, result.validation.checks.length);
  assert.equal(lessonValidationCheckCount, 5);
});
