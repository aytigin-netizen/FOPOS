import assert from "node:assert/strict";
import test from "node:test";
import { generateApprovedDocument, OPUS_GENERATION_CONTRACT_VERSION, OpusGenerationBridgeError, toApprovedGenerationDecision } from "../app/core/opus-generation-bridge.ts";

const approvedRecord = {
  schemaVersion: "1.0.0", recordId: "OPUS-PR-pilot", revision: 2, status: "approved",
  createdAt: "2026-07-31T15:00:00.000Z", updatedAt: "2026-07-31T15:30:00.000Z", previousRevision: 1,
  approval: { approvedAt: "2026-07-31T15:30:00.000Z", statement: "Bu pedagojik kararı onaylıyorum.", actorRole: "teacher" },
  curriculum: { subjectCode: "philosophy", datasetVersion: "2024.1", grade: 10, unitCode: "F10_U1", outcomeCode: "FEL.10.1.1" },
  lessonContext: { week: 1, durationMinutes: 80, profile: "Dengeli" },
  pedagogicalDecision: { strategy: "Felsefi sorgulama", methods: ["Sokratik tartışma"], learningEvidence: "Gerekçeli görüş" },
};

test("approved record maps to the OPUS generation decision", () => {
  const decision = toApprovedGenerationDecision(approvedRecord);
  assert.equal(decision.id, "decision:OPUS-PR-pilot:r2");
  assert.equal(decision.approval.decidedAt, approvedRecord.approval.approvedAt);
  assert.equal(decision.curriculum.curriculumId, "philosophy-tr-2024");
  assert.equal(decision.curriculum.gradeLevelId, "grade-10");
  assert.equal(decision.curriculum.unitId, "f10-u1");
  assert.equal(decision.curriculum.outcomeCode, "FEL.10.1.1");
});

test("an unapproved record cannot open the generation gate", () => {
  assert.throws(
    () => toApprovedGenerationDecision({ ...approvedRecord, status: "in_review", approval: undefined }),
    (error) => error instanceof OpusGenerationBridgeError && error.code === "DECISION_NOT_APPROVED",
  );
});

test("the approved decision is bound to the real generator and leaves provenance", async () => {
  const decision = toApprovedGenerationDecision(approvedRecord);
  let calls = 0;
  const result = await generateApprovedDocument(
    decision,
    { id: "pilot:daily-plan", decisionId: decision.id, documentType: "daily-plan" },
    async () => { calls += 1; return { blob: new Blob(["pilot"]), fileName: "pilot.docx" }; },
  );
  assert.equal(calls, 1);
  assert.equal(result.artifact.fileName, "pilot.docx");
  assert.equal(result.provenance.contractVersion, OPUS_GENERATION_CONTRACT_VERSION);
  assert.match(result.provenance.eventId, /^[0-9a-f-]{36}$/u);
  assert.equal(result.provenance.decisionId, decision.id);
  assert.equal(result.provenance.curriculum.outcomeCode, "FEL.10.1.1");
});

test("a mismatched decision is rejected before generation", async () => {
  const decision = toApprovedGenerationDecision(approvedRecord);
  let calls = 0;
  await assert.rejects(
    generateApprovedDocument(
      decision,
      { id: "pilot:daily-plan", decisionId: "decision:another-record:r1", documentType: "daily-plan" },
      async () => { calls += 1; return { blob: new Blob(), fileName: "should-not-exist.docx" }; },
    ),
    (error) => error instanceof OpusGenerationBridgeError && error.code === "GENERATION_DECISION_MISMATCH",
  );
  assert.equal(calls, 0);
});


test("annual plan uses its own approved intent and event identity", async () => {
  const annualRecord = {
    ...approvedRecord,
    recordId: "OPUS-PR-ANNUAL-2026-2027-PHILOSOPHY-G10",
    curriculum: { ...approvedRecord.curriculum, unitCode: "ANNUAL_PLAN", outcomeCode: "ANNUAL.10.2026-2027" },
  };
  const decision = toApprovedGenerationDecision(annualRecord, "annual-plan");
  assert.equal(decision.intent, "annual-plan");
  assert.equal(decision.curriculum.unitId, "annual-plan");
  const generated = await generateApprovedDocument(
    decision,
    { id: "annual:2026-2027:philosophy:grade-10", decisionId: decision.id, documentType: "annual-plan" },
    async () => ({ fileName: "annual.docx" }),
  );
  assert.equal(generated.provenance.documentType, "annual-plan");
  assert.match(generated.provenance.eventId, /^[0-9a-f-]{36}$/u);
});
