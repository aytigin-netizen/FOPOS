import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { createExamDecision, examRecordId } from "../app/core/exam-decision.ts";
import { approveRecord, submitForReview } from "../app/core/pedagogical-record.ts";
import { generateApprovedDocument, toApprovedGenerationDecision } from "../app/core/opus-generation-bridge.ts";

const scope = {
  academicYear: "2026-2027",
  subjectCode: "philosophy",
  datasetVersion: "2024.1",
  grade: 10,
  examName: "1. Dönem 1. Sınav",
  mode: "standard",
  unitCodes: ["F10_U1", "F10_U2"],
  outcomeCodes: ["FEL.10.1.1", "FEL.10.2.1"],
  questionCount: 8,
  durationMinutes: 40,
  totalPoints: 100,
};

test("sınav kararı yıl, branş, sınıf, sınav türü ve müfredat kapsamına bağlıdır", () => {
  const id = examRecordId(scope);
  assert.match(id, /^OPUS-PR-EXAM-2026-2027-PHILOSOPHY-G10-STANDARD-[A-F0-9]{8}$/u);
  assert.equal(examRecordId({ ...scope, unitCodes: [...scope.unitCodes].reverse() }), id);
  assert.notEqual(examRecordId({ ...scope, examName: "1. Dönem 2. Sınav" }), id);
  assert.notEqual(examRecordId({ ...scope, mode: "bep", adaptationKey: "reading" }), id);
});

test("standart ve BEP kararları ortak paket bütünlüğünü, farklı uyarlama kuralını korur", () => {
  const standard = createExamDecision({ scope });
  assert.match(standard.pedagogicalDecision.learningEvidence, /soru kâğıdı \+ cevap anahtarı \+ puanlama ölçütü/u);
  assert.match(standard.pedagogicalDecision.learningEvidence, /Öğrenci listesi, puan verisi, tanı ve sağlık bilgisi üretim izine dahil değildir/u);
  assert.throws(
    () => createExamDecision({ scope: { ...scope, mode: "bep", adaptationKey: "" } }),
    /BEP eğitimsel uyarlama türü/u,
  );
  assert.throws(
    () => createExamDecision({ scope: { ...scope, totalPoints: 90 } }),
    /100 puan/u,
  );
});

test("onaylı sınav paketi tek exam üretim olayı bırakır", async () => {
  const draft = createExamDecision({ scope });
  const approved = approveRecord(submitForReview(draft), "Sınav paketini kontrol ettim.");
  const decision = toApprovedGenerationDecision(approved, "exam");
  const generated = await generateApprovedDocument(
    decision,
    { id: `${approved.recordId}:r1:exam:teacher`, decisionId: decision.id, documentType: "exam" },
    async () => ({ fileName: "exam.docx" }),
  );
  assert.equal(generated.provenance.documentType, "exam");
  assert.equal(generated.provenance.curriculum.unitId, "exam");
  assert.match(generated.provenance.eventId, /^[0-9a-f-]{36}$/u);
});

test("sınav arayüzü onay, kalıcı iz ve indirme sırasını korur", () => {
  const source = fs.readFileSync(new URL("../app/modules/exam-builder/ExamBuilder.tsx", import.meta.url), "utf8");
  assert.match(source, /OPUS öğretmen onayı ver/u);
  assert.match(source, /documentType: "exam"/u);
  assert.match(source, /body: JSON\.stringify\(generated\.provenance\)/u);
  assert.ok(source.indexOf('fetch("/api/document-generations"') < source.indexOf("downloadBlob(generated.artifact.blob"));
  assert.doesNotMatch(source, /JSON\.stringify\([^)]*bepGoals/u);
});
