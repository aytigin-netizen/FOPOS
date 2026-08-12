import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateGenerationAuditPackageDigest,
  createGenerationAuditPackage,
  validateGenerationAuditPackage,
} from "../app/core/generation-audit-package.ts";
import {
  createGenerationAuditVerificationEvidence,
} from "../app/core/generation-audit-verification-evidence.ts";
import {
  matchGenerationArtifactToAuditPackage,
} from "../app/core/generation-audit-package-artifact-match.ts";

const artifactDigest = "a".repeat(64);
const event = (eventId, digest = artifactDigest) => ({
  eventId,
  requestId: `request-${eventId}`,
  decisionId: `decision-${eventId}`,
  recordId: `record-${eventId}`,
  revision: 1,
  documentType: "daily-plan",
  contractVersion: "1.2.0",
  approvedAt: "2026-08-12T07:00:00.000Z",
  generatedAt: "2026-08-12T07:30:00.000Z",
  curriculum: {
    moduleId: "fopos",
    curriculumId: "philosophy",
    gradeLevelId: "10",
    unitId: "unit-1",
    outcomeCode: "FEL.10.1.1",
  },
  curriculumDatasetVersion: "2024.1",
  academicYear: "2026-2027",
  artifactIntegrity: digest === null ? null : {
    algorithm: "SHA-256",
    digest,
    source: "final-artifact-bytes",
  },
});

const packageWith = async (events) => createGenerationAuditPackage({
  exportedAt: "2026-08-12T08:00:00.000Z",
  academicYear: "2026-2027",
  exportScope: "academic-year",
  queryScope: { type: "academic-year", academicYear: "2026-2027" },
  containsStudentPersonalData: false,
  events,
});

const evidenceFor = async (sourcePackage) =>
  createGenerationAuditVerificationEvidence({
    sourcePackage,
    validation: await validateGenerationAuditPackage(sourcePackage),
    verifiedAt: "2026-08-12T08:30:00.000Z",
  });

test("Pilot 2.8 özgün belgeyi tek üretim olayıyla eşleştirir", async () => {
  const sourcePackage = await packageWith([event("event-1")]);
  const evidence = await evidenceFor(sourcePackage);
  const result = await matchGenerationArtifactToAuditPackage({
    sourcePackage,
    evidence,
    artifactDigest,
  });

  assert.equal(result.status, "matched");
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.matches, [{
    eventId: "event-1",
    documentType: "daily-plan",
    generatedAt: "2026-08-12T07:30:00.000Z",
    outcomeCode: "FEL.10.1.1",
    digest: artifactDigest,
  }]);
});

test("Pilot 2.8 değiştirilmiş veya ilgisiz belgeyi reddeder", async () => {
  const sourcePackage = await packageWith([event("event-1")]);
  const evidence = await evidenceFor(sourcePackage);
  const result = await matchGenerationArtifactToAuditPackage({
    sourcePackage,
    evidence,
    artifactDigest: "b".repeat(64),
  });

  assert.equal(result.status, "rejected");
  assert.ok(result.errors.some((error) => error.includes("hiçbir üretim olayıyla eşleşmiyor")));
});

test("Pilot 2.8 aynı özeti taşıyan çoklu olayı belirsiz bildirir", async () => {
  const sourcePackage = await packageWith([event("event-1"), event("event-2")]);
  const evidence = await evidenceFor(sourcePackage);
  const result = await matchGenerationArtifactToAuditPackage({
    sourcePackage,
    evidence,
    artifactDigest,
  });

  assert.equal(result.status, "ambiguous");
  assert.equal(result.matches.length, 2);
});

test("Pilot 2.8 paket ile kanıt eşleşmeden belgeyi incelemez", async () => {
  const sourcePackage = await packageWith([event("event-1")]);
  const unrelatedPackage = await packageWith([event("event-2", "b".repeat(64))]);
  const evidence = await evidenceFor(unrelatedPackage);
  const result = await matchGenerationArtifactToAuditPackage({
    sourcePackage,
    evidence,
    artifactDigest,
  });

  assert.equal(result.status, "rejected");
  assert.deepEqual(result.matches, []);
  assert.ok(result.errors.includes("Denetim paketi ile doğrulama kanıtı eşleşmiyor."));
});

for (const invalidDigest of [null, "geçersiz", "A".repeat(64)]) {
  test(`Pilot 2.8 geçersiz belge özetini reddeder: ${String(invalidDigest)}`, async () => {
    const sourcePackage = await packageWith([event("event-1")]);
    const evidence = await evidenceFor(sourcePackage);
    const result = await matchGenerationArtifactToAuditPackage({
      sourcePackage,
      evidence,
      artifactDigest: invalidDigest,
    });

    assert.equal(result.status, "rejected");
    assert.deepEqual(result.matches, []);
    assert.ok(result.errors.includes("Belge özeti geçerli SHA-256 değeri olmalıdır."));
  });
}

test("Pilot 2.8 bütünlük özeti olmayan eski üretim olayını eşleşmiş saymaz", async () => {
  const sourcePackage = await packageWith([event("event-1", null)]);
  const evidence = await evidenceFor(sourcePackage);
  const result = await matchGenerationArtifactToAuditPackage({
    sourcePackage,
    evidence,
    artifactDigest,
  });

  assert.equal(result.status, "rejected");
  assert.deepEqual(result.matches, []);
});

test("Pilot 2.8 paket özeti değişirse üçlü doğrulamayı reddeder", async () => {
  const sourcePackage = await packageWith([event("event-1")]);
  const evidence = await evidenceFor(sourcePackage);
  const changed = { ...sourcePackage, exportedAt: "2026-08-12T09:00:00.000Z" };
  const resigned = {
    ...changed,
    packageIntegrity: {
      ...changed.packageIntegrity,
      digest: await calculateGenerationAuditPackageDigest(changed),
    },
  };
  const result = await matchGenerationArtifactToAuditPackage({
    sourcePackage: resigned,
    evidence,
    artifactDigest,
  });

  assert.equal(result.status, "rejected");
});
