import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { createAnnualPlanDecision, annualPlanRecordId } from "../app/core/annual-plan-decision.ts";
import { approveRecord, submitForReview } from "../app/core/pedagogical-record.ts";
import { generateApprovedDocument, toApprovedGenerationDecision } from "../app/core/opus-generation-bridge.ts";
import { getCurriculumContext } from "../app/data/curriculum-runtime.ts";

const curriculum = getCurriculumContext("philosophy");
const scope = {
  academicYear: "2026-2027",
  subjectCode: curriculum.subjectCode,
  datasetVersion: curriculum.datasetVersion,
  grade: 10,
};

test("yıllık plan kararı öğretim yılı, branş ve sınıf bileşimine bağlıdır", () => {
  assert.equal(
    annualPlanRecordId(scope),
    "OPUS-PR-ANNUAL-2026-2027-PHILOSOPHY-G10",
  );
  assert.notEqual(
    annualPlanRecordId({ ...scope, grade: 11 }),
    annualPlanRecordId(scope),
  );
  const record = createAnnualPlanDecision({ scope, units: curriculum.units });
  assert.equal(record.curriculum.unitCode, "ANNUAL_PLAN");
  assert.equal(record.curriculum.outcomeCode, "ANNUAL.10.2026-2027");
  assert.match(record.pedagogicalDecision.learningEvidence, /FEL\.10\./u);
});

test("onaylı yıllık plan ayrı üretim olayı bırakır", async () => {
  const draft = createAnnualPlanDecision({ scope, units: curriculum.units });
  const approved = approveRecord(submitForReview(draft), "Yıllık plan kapsamını kontrol ettim.");
  const decision = toApprovedGenerationDecision(approved, "annual-plan");
  const generated = await generateApprovedDocument(
    decision,
    { id: `${approved.recordId}:annual-plan`, decisionId: decision.id, documentType: "annual-plan" },
    async () => ({ fileName: "annual.docx" }),
  );
  assert.equal(generated.provenance.documentType, "annual-plan");
  assert.equal(generated.provenance.curriculum.gradeLevelId, "grade-10");
  assert.match(generated.provenance.eventId, /^[0-9a-f-]{36}$/u);
});

test("yıllık plan arayüzü onay, kalıcı iz ve indirme sırasını korur", () => {
  const source = fs.readFileSync(new URL("../app/modules/annual-plan/AnnualPlanModule.tsx", import.meta.url), "utf8");
  assert.match(source, /OPUS öğretmen onayı ver/u);
  assert.match(source, /documentType: "annual-plan"/u);
  assert.ok(source.indexOf('fetch("\/api\/document-generations"') < source.indexOf("downloadBlob(generated.artifact.blob"));
});
