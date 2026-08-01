import assert from "node:assert/strict";
import test from "node:test";
import { assertGenerationMatchesRecord } from "../app/core/document-generation-record.ts";
import fs from "node:fs";

const record = {
  schemaVersion: "1.0.0", recordId: "OPUS-PR-pilot", revision: 2, status: "approved",
  createdAt: "2026-07-31T15:00:00.000Z", updatedAt: "2026-07-31T15:30:00.000Z", previousRevision: 1,
  approval: { approvedAt: "2026-07-31T15:30:00.000Z", statement: "Kontrol ettim", actorRole: "teacher" },
  curriculum: { subjectCode: "philosophy", datasetVersion: "2024.1", grade: 10, unitCode: "F10_U1", outcomeCode: "FEL.10.1.1" },
  lessonContext: { week: 1, durationMinutes: 80, profile: "Dengeli" },
  pedagogicalDecision: { strategy: "Sorgulama", methods: [], learningEvidence: "Gerekçeli görüş" },
};
const trace = {
  eventId: "123e4567-e89b-12d3-a456-426614174000", contractVersion: "1.1.0", decisionId: "decision:OPUS-PR-pilot:r2", requestId: "OPUS-OUT-pilot:daily-plan",
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

test("her gerçek indirme ayrı ve değişmez üretim olayıdır", () => {
  const repository = fs.readFileSync(new URL("../db/document-generations.ts", import.meta.url), "utf8");
  const migration = fs.readFileSync(new URL("../drizzle/0009_generation_events.sql", import.meta.url), "utf8");
  assert.match(repository, /const eventId = crypto\.randomUUID\(\)/u);
  assert.doesNotMatch(repository, /SELECT generated_at FROM document_generations/u);
  assert.match(migration, /DROP INDEX `document_generations_user_request_idx`/u);
  assert.match(migration, /CREATE INDEX `document_generations_user_request_idx`/u);
});

test("denetim görünümü filtreleme, karar ayrıntısı ve öğrenci verisiz JSON dışa aktarımı sunar", () => {
  const archive = fs.readFileSync(new URL("../app/modules/record-archive/RecordArchiveModule.tsx", import.meta.url), "utf8");
  assert.match(archive, /Karar veya olay kimliği/u);
  assert.match(archive, /Bu belge hangi karardan üretildi\?/u);
  assert.match(archive, /containsStudentPersonalData: false/u);
  assert.match(archive, /JSON denetim paketi/u);
  assert.match(archive, /annual-plan/u);
});
