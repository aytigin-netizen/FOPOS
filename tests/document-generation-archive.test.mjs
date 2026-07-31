import assert from "node:assert/strict";
import test from "node:test";
import { assertGenerationMatchesRecord } from "../app/core/document-generation-record.ts";

const record = {
  schemaVersion: "1.0.0", recordId: "OPUS-PR-pilot", revision: 2, status: "approved",
  createdAt: "2026-07-31T15:00:00.000Z", updatedAt: "2026-07-31T15:30:00.000Z", previousRevision: 1,
  approval: { approvedAt: "2026-07-31T15:30:00.000Z", statement: "Kontrol ettim", actorRole: "teacher" },
  curriculum: { subjectCode: "philosophy", datasetVersion: "2024.1", grade: 10, unitCode: "F10_U1", outcomeCode: "FEL.10.1.1" },
  lessonContext: { week: 1, durationMinutes: 80, profile: "Dengeli" },
  pedagogicalDecision: { strategy: "Sorgulama", methods: [], learningEvidence: "Gerekçeli görüş" },
};
const trace = {
  contractVersion: "1.0.0", decisionId: "decision:OPUS-PR-pilot:r2", requestId: "OPUS-OUT-pilot:daily-plan",
  documentType: "daily-plan", teacherId: "current-teacher", approvedAt: "2026-07-31T15:30:00.000Z",
  curriculum: { moduleId: "fopos", curriculumId: "philosophy-tr-2024", gradeLevelId: "grade-10", unitId: "f10-u1", outcomeCode: "FEL.10.1.1" },
};

test("üretim izi onaylı karar, revizyon ve müfredat kaynağına bağlanır", () => {
  assert.deepEqual(assertGenerationMatchesRecord(trace, record), { recordId: record.recordId, revision: 2 });
});
test("başka revizyon veya müfredat kaynağı adına üretim izi oluşturulamaz", () => {
  assert.throws(() => assertGenerationMatchesRecord({ ...trace, decisionId: "decision:OPUS-PR-pilot:r3" }, record), /uyuşmuyor/);
  assert.throws(() => assertGenerationMatchesRecord({ ...trace, curriculum: { ...trace.curriculum, curriculumId: "logic-tr-2026" } }, record), /uyuşmuyor/);
});
test("onaysız karar kalıcı belge üretim izine dönüşemez", () => {
  assert.throws(() => assertGenerationMatchesRecord(trace, { ...record, status: "in_review", approval: null }), /uyuşmuyor/);
});
