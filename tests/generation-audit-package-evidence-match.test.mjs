import assert from "node:assert/strict";
import test from "node:test";

import {
  calculateGenerationAuditPackageDigest,
  createGenerationAuditPackage,
  validateGenerationAuditPackage,
} from "../app/core/generation-audit-package.ts";
import {
  calculateGenerationAuditVerificationEvidenceDigest,
  createGenerationAuditVerificationEvidence,
} from "../app/core/generation-audit-verification-evidence.ts";
import {
  matchGenerationAuditPackageToVerificationEvidence,
} from "../app/core/generation-audit-package-evidence-match.ts";

const packageInput = {
  exportedAt: "2026-08-12T06:00:00.000Z",
  academicYear: "2026-2027",
  exportScope: "academic-year",
  queryScope: { type: "academic-year", academicYear: "2026-2027" },
  containsStudentPersonalData: false,
  events: [{
    eventId: "event-1",
    requestId: "request-1",
    decisionId: "decision-1",
    recordId: "record-1",
    revision: 1,
    documentType: "daily-plan",
    contractVersion: "1.0.0",
    approvedAt: "2026-08-12T05:00:00.000Z",
    generatedAt: "2026-08-12T05:30:00.000Z",
    curriculum: {
      moduleId: "fopos",
      curriculumId: "philosophy",
      gradeLevelId: "10",
      unitId: "unit-1",
      outcomeCode: "FEL.10.1.1",
    },
    curriculumDatasetVersion: "2024.1",
    academicYear: "2026-2027",
    artifactIntegrity: null,
  }],
};

const evidenceFor = async (source) => {
  const validation = await validateGenerationAuditPackage(source);
  return createGenerationAuditVerificationEvidence({
    sourcePackage: source,
    validation,
    verifiedAt: "2026-08-12T06:30:00.000Z",
  });
};

test("Pilot 2.7 özgün paketi doğrulama kanıtıyla eşleştirir", async () => {
  const source = await createGenerationAuditPackage(packageInput);
  const evidence = await evidenceFor(source);
  const result = await matchGenerationAuditPackageToVerificationEvidence({
    sourcePackage: source,
    evidence,
  });

  assert.equal(result.status, "matched");
  assert.deepEqual(result.errors, []);
  assert.equal(result.computedPackageDigest, evidence.sourcePackage.computedDigest);
  assert.equal(result.packageValidation.status, "valid");
  assert.equal(result.evidenceValidation.status, "valid");
});

test("Pilot 2.7 değiştirilmiş paketi reddeder", async () => {
  const source = await createGenerationAuditPackage(packageInput);
  const evidence = await evidenceFor(source);
  const tampered = { ...source, exportedAt: "2026-08-12T07:00:00.000Z" };
  const result = await matchGenerationAuditPackageToVerificationEvidence({
    sourcePackage: tampered,
    evidence,
  });

  assert.equal(result.status, "rejected");
  assert.ok(result.errors.includes(
    "Denetim paketi SHA-256 özeti doğrulama kanıtındaki kaynak paket özetiyle uyuşmuyor.",
  ));
});

test("Pilot 2.7 ilgisiz kanıtı reddeder", async () => {
  const source = await createGenerationAuditPackage(packageInput);
  const unrelated = await createGenerationAuditPackage({
    ...packageInput,
    exportedAt: "2026-08-12T07:00:00.000Z",
  });
  const evidence = await evidenceFor(unrelated);
  const result = await matchGenerationAuditPackageToVerificationEvidence({
    sourcePackage: source,
    evidence,
  });

  assert.equal(result.status, "rejected");
  assert.ok(result.errors.some((error) => error.includes("kaynak paket özetiyle uyuşmuyor")));
});

test("Pilot 2.7 yeniden imzalanmış olay sayısı eşleşmezliğini reddeder", async () => {
  const source = await createGenerationAuditPackage(packageInput);
  const evidence = await evidenceFor(source);
  const { evidenceIntegrity: _ignored, ...unsigned } = {
    ...evidence,
    result: { ...evidence.result, eventCount: 2 },
  };
  void _ignored;
  const forged = {
    ...unsigned,
    evidenceIntegrity: {
      algorithm: "SHA-256",
      digest: await calculateGenerationAuditVerificationEvidenceDigest(unsigned),
    },
  };
  const result = await matchGenerationAuditPackageToVerificationEvidence({
    sourcePackage: source,
    evidence: forged,
  });

  assert.equal(result.status, "rejected");
  assert.ok(result.errors.includes("Denetim paketi olay sayısı doğrulama kanıtıyla uyuşmuyor."));
});

test("Pilot 2.7 kişisel veri anahtarı eklenmiş ve yeniden özetlenmiş paketi reddeder", async () => {
  const source = await createGenerationAuditPackage(packageInput);
  const evidence = await evidenceFor(source);
  const unsafeUnsigned = {
    ...source,
    studentName: "Örnek Öğrenci",
    packageIntegrity: { algorithm: "SHA-256", digest: "0".repeat(64) },
  };
  const unsafe = {
    ...unsafeUnsigned,
    packageIntegrity: {
      algorithm: "SHA-256",
      digest: await calculateGenerationAuditPackageDigest(unsafeUnsigned),
    },
  };
  const result = await matchGenerationAuditPackageToVerificationEvidence({
    sourcePackage: unsafe,
    evidence,
  });

  assert.equal(result.status, "rejected");
  assert.ok(result.errors.includes("Denetim paketi geçerli değildir."));
  assert.ok(result.packageValidation.errors.some((error) => error.includes("Öğrenci kişisel verisi")));
});

for (const primitive of [null, "geçersiz", 42]) {
  test(`Pilot 2.7 ilkel girdiyi güvenli biçimde reddeder: ${String(primitive)}`, async () => {
    const source = await createGenerationAuditPackage(packageInput);
    const evidence = await evidenceFor(source);
    const result = await matchGenerationAuditPackageToVerificationEvidence({
      sourcePackage: primitive,
      evidence,
    });

    assert.equal(result.status, "rejected");
    assert.ok(result.errors.length > 0);
  });
}
