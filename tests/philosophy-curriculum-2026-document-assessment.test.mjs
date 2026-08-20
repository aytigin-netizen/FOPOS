import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  buildAssessmentRegressionFixtures2026,
  buildDocumentRegressionFixtures2026,
} from "../app/core/philosophy-2026-document-assessment-preview.ts";
import { createExamDecision } from "../app/core/exam-decision.ts";
import { generateApprovedDocument, toApprovedGenerationDecision } from "../app/core/opus-generation-bridge.ts";
import { approveRecord, submitForReview } from "../app/core/pedagogical-record.ts";
import { philosophyPhaseCatalog2026 } from "../app/modules/lesson-studio/phase-catalog-2026.ts";

const curriculum2026 = JSON.parse(
  readFileSync(new URL("../app/data/felsefe_curriculum_2026.json", import.meta.url), "utf8"),
);
const legacy2024 = JSON.parse(
  readFileSync(new URL("../app/data/felsefe_curriculum_2024.json", import.meta.url), "utf8"),
);
const transition = JSON.parse(
  readFileSync(new URL("../app/data/felsefe_curriculum_2026_transition.json", import.meta.url), "utf8"),
);
const documents = buildDocumentRegressionFixtures2026(curriculum2026, philosophyPhaseCatalog2026);
const assessments = buildAssessmentRegressionFixtures2026(curriculum2026);

test("22 kanonik çıktı günlük plan belge fikstürü taşır", () => {
  assert.equal(documents.length, 22);
  assert.equal(documents.filter((item) => item.grade === 10).length, 10);
  assert.equal(documents.filter((item) => item.grade === 11).length, 12);
  assert.equal(new Set(documents.map((item) => item.outcomeCode)).size, 22);
  assert.equal(documents.some((item) => item.outcomeCode === "FEL.10.1.2"), false);
  for (const fixture of documents) {
    assert.equal(fixture.datasetVersion, "2026.1");
    assert.equal(fixture.phases.length, 9);
    assert.equal(fixture.phases.reduce((sum, phase) => sum + phase.duration, 0), 80);
    assert.ok(fixture.processComponents.length >= 2);
    assert.ok(fixture.contentFramework.length > 0);
    assert.ok(fixture.keywords.length > 0);
    assert.ok(fixture.competencyFields.fieldSkills.length > 0);
  }
});

test("10 ve 11. sınıf standart ve BEP sınav kapsamları kanonik kodları taşır", () => {
  assert.equal(assessments.length, 4);
  for (const grade of [10, 11]) {
    const expectedUnits = curriculum2026.grades[String(grade)].units;
    const expectedUnitCodes = expectedUnits.map((unit) => unit.unit_code);
    const expectedOutcomeCodes = expectedUnits.flatMap((unit) =>
      unit.learning_outcomes.map((outcome) => outcome.outcome_code),
    );
    for (const fixture of assessments.filter((item) => item.grade === grade)) {
      assert.deepEqual(fixture.unitCodes, expectedUnitCodes);
      assert.deepEqual(fixture.outcomeCodes, expectedOutcomeCodes);
      assert.equal(fixture.totalPoints, 100);
      assert.equal(fixture.mode === "bep", fixture.adaptationKey === "reading");
    }
  }
  assert.equal(assessments.some((item) => item.outcomeCodes.includes("FEL.10.1.2")), false);
});

test("2026 sınav kararları standart ve BEP üretim izine güvenle dönüşür", async () => {
  for (const fixture of assessments) {
    const record = createExamDecision({
      scope: {
        academicYear: "2026-2027",
        subjectCode: fixture.subjectCode,
        datasetVersion: fixture.datasetVersion,
        grade: fixture.grade,
        examName: "1. Dönem 1. Sınav",
        mode: fixture.mode,
        unitCodes: fixture.unitCodes,
        outcomeCodes: fixture.outcomeCodes,
        questionCount: fixture.questionCount,
        durationMinutes: fixture.durationMinutes,
        totalPoints: fixture.totalPoints,
        adaptationKey: fixture.adaptationKey,
      },
    });
    const approved = approveRecord(submitForReview(record), "2026 sınav kapsamını kontrol ettim.");
    const decision = toApprovedGenerationDecision(approved, "exam");
    const generated = await generateApprovedDocument(
      decision,
      { id: `${approved.recordId}:exam-regression`, decisionId: decision.id, documentType: "exam" },
      async () => ({ blob: new Blob([fixture.mode]), fileName: `exam-${fixture.grade}-${fixture.mode}.docx` }),
    );
    assert.equal(generated.provenance.curriculum.curriculumId, "philosophy-tr-2026");
    assert.equal(generated.provenance.curriculum.gradeLevelId, `grade-${fixture.grade}`);
    assert.equal(generated.provenance.documentType, "exam");
    assert.match(approved.pedagogicalDecision.learningEvidence, /Öğrenci listesi, puan verisi, tanı ve sağlık bilgisi üretim izine dahil değildir/u);
  }
});

test("2026 günlük plan belge izleri her kanonik çıktıya bağlanır", async () => {
  for (const fixture of documents) {
    const now = new Date().toISOString();
    const record = {
      schemaVersion: "1.0.0",
      recordId: `OPUS-PR-2026-${fixture.outcomeCode}`,
      revision: 1,
      status: "draft",
      createdAt: now,
      updatedAt: now,
      previousRevision: null,
      approval: null,
      curriculum: {
        subjectCode: fixture.subjectCode,
        datasetVersion: fixture.datasetVersion,
        grade: fixture.grade,
        unitCode: fixture.unitCode,
        outcomeCode: fixture.outcomeCode,
      },
      lessonContext: { week: 1, durationMinutes: 80, profile: "2026 belge regresyonu" },
      pedagogicalDecision: {
        strategy: "2026 alan-özgü dokuz aşamalı akış",
        methods: fixture.phases.map((phase) => phase.label),
        learningEvidence: fixture.phases.map((phase) => phase.evidence).join(" • "),
      },
    };
    const approved = approveRecord(submitForReview(record), "2026 günlük plan kapsamını kontrol ettim.");
    const decision = toApprovedGenerationDecision(approved, "daily-plan");
    const generated = await generateApprovedDocument(
      decision,
      { id: `${approved.recordId}:daily-plan-regression`, decisionId: decision.id, documentType: "daily-plan" },
      async () => ({ blob: new Blob([fixture.outcomeCode]), fileName: `${fixture.outcomeCode}.docx` }),
    );
    assert.equal(generated.provenance.curriculum.curriculumId, "philosophy-tr-2026");
    assert.equal(generated.provenance.curriculum.outcomeCode, fixture.outcomeCode);
    assert.equal(generated.provenance.documentType, "daily-plan");
  }
});

test("fikstürler yalıtılmış, 2024 arşivi korunmuş ve 2026 runtime etkindir", () => {
  assert.equal(Object.isFrozen(documents), true);
  assert.equal(Object.isFrozen(assessments), true);
  assert.ok(documents.every((item) => Object.isFrozen(item) && Object.isFrozen(item.phases)));
  assert.ok(assessments.every((item) => Object.isFrozen(item) && Object.isFrozen(item.outcomeCodes)));
  assert.equal(legacy2024.dataset_version, "2024.1");
  assert.equal(curriculum2026.runtime_enabled, true);
  assert.equal(transition.runtimeEnabled, true);
  assert.equal(transition.status, "runtime-enabled-deployment-pending");
  assert.ok(transition.completedGates.includes("2026.1 document and assessment regression"));
  assert.equal(transition.compatibilityPolicy.runtimeActivationRequires.includes("document and assessment regression"), false);
  assert.deepEqual(transition.compatibilityPolicy.runtimeActivationRequires, []);
});
