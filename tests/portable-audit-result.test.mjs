import assert from "node:assert/strict";
import test from "node:test";
import { createGenerationAuditPackage, validateGenerationAuditPackage } from "../app/core/generation-audit-package.ts";
import { createGenerationAuditVerificationEvidence } from "../app/core/generation-audit-verification-evidence.ts";
import { createPortableAuditResult, validatePortableAuditResult } from "../app/core/portable-audit-result.ts";

const artifactDigest = "a".repeat(64);
const event = (eventId, digest = artifactDigest) => ({
  eventId, requestId: `request-${eventId}`, decisionId: `decision-${eventId}`,
  recordId: `record-${eventId}`, revision: 1, documentType: "daily-plan",
  contractVersion: "1.2.0", approvedAt: "2026-08-13T07:00:00.000Z",
  generatedAt: "2026-08-13T07:30:00.000Z",
  curriculum: { moduleId: "fopos", curriculumId: "philosophy", gradeLevelId: "10", unitId: "unit-1", outcomeCode: "FEL.10.1.1" },
  curriculumDatasetVersion: "2024.1", academicYear: "2026-2027",
  artifactIntegrity: { algorithm: "SHA-256", digest, source: "final-artifact-bytes" },
});
const packageWith = (events) => createGenerationAuditPackage({
  exportedAt: "2026-08-13T08:00:00.000Z", academicYear: "2026-2027",
  exportScope: "academic-year", queryScope: { type: "academic-year", academicYear: "2026-2027" },
  containsStudentPersonalData: false, events,
});
const evidenceFor = async (sourcePackage) => createGenerationAuditVerificationEvidence({
  sourcePackage, validation: await validateGenerationAuditPackage(sourcePackage),
  verifiedAt: "2026-08-13T08:30:00.000Z",
});

test("Pilot 3.0 tek başarılı eşleşmeden bütünlük korumalı sonuç üretir", async () => {
  const sourcePackage = await packageWith([event("event-1")]);
  const result = await createPortableAuditResult({
    sourcePackage, evidence: await evidenceFor(sourcePackage), artifactDigest,
    createdAt: "2026-08-13T09:00:00.000Z",
  });
  assert.equal(result.status, "matched");
  assert.equal(result.match.eventId, "event-1");
  assert.equal((await validatePortableAuditResult(result)).status, "valid");
  assert.doesNotMatch(JSON.stringify(result), /studentName|studentNumber|fileName|filePath/iu);
});

test("Pilot 3.0 değiştirilmiş sonuç belgesini reddeder", async () => {
  const sourcePackage = await packageWith([event("event-1")]);
  const result = await createPortableAuditResult({
    sourcePackage, evidence: await evidenceFor(sourcePackage), artifactDigest,
    createdAt: "2026-08-13T09:00:00.000Z",
  });
  const changed = { ...result, match: { ...result.match, outcomeCode: "FEL.10.9.9" } };
  assert.ok((await validatePortableAuditResult(changed)).errors.includes(
    "Taşınabilir denetim sonucu SHA-256 bütünlük özeti uyuşmuyor.",
  ));
});

test("Pilot 3.0 yanlış belge ve çoklu eşleşmeden sonuç üretmez", async () => {
  const single = await packageWith([event("event-1")]);
  await assert.rejects(() => createPortableAuditResult({
    sourcePackage: single, evidence: await evidenceFor(single), artifactDigest: "b".repeat(64),
    createdAt: "2026-08-13T09:00:00.000Z",
  }));
  const multiple = await packageWith([event("event-1"), event("event-2")]);
  await assert.rejects(() => createPortableAuditResult({
    sourcePackage: multiple, evidence: await evidenceFor(multiple), artifactDigest,
    createdAt: "2026-08-13T09:00:00.000Z",
  }));
});

test("Pilot 3.0 kişisel veri ve dosya adı anahtarlarını reddeder", async () => {
  const sourcePackage = await packageWith([event("event-1")]);
  const result = await createPortableAuditResult({
    sourcePackage, evidence: await evidenceFor(sourcePackage), artifactDigest,
    createdAt: "2026-08-13T09:00:00.000Z",
  });
  assert.equal((await validatePortableAuditResult({ ...result, studentName: "Gizli" })).status, "rejected");
  assert.equal((await validatePortableAuditResult({ ...result, fileName: "belge.docx" })).status, "rejected");
});
