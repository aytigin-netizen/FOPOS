import assert from "node:assert/strict";
import test from "node:test";

import {
  GENERATION_AUDIT_VERIFICATION_EVIDENCE_SCHEMA_VERSION,
  createGenerationAuditVerificationEvidence,
  validateGenerationAuditVerificationEvidenceIntegrity,
} from "../app/core/generation-audit-verification-evidence.ts";

const verifiedAt = "2026-08-10T09:00:00.000Z";
const sourceDigest = "aac479b348a1323d118d618daf90f5a54091a9fa892c3b4f32c5921c0b355985";

const sourcePackage = {
  schemaVersion: "1.2.0",
  exportedAt: "2026-08-10T08:00:00.000Z",
  academicYear: "2026-2027",
  containsStudentPersonalData: false,
  eventCount: 1,
  events: [{ eventId: "synthetic-event-1", documentType: "daily-plan" }],
  packageIntegrity: {
    algorithm: "SHA-256",
    digest: "0".repeat(64),
  },
};

const cases = [
  {
    status: "valid",
    schemaVersion: "1.2.0",
    errors: [],
    warnings: [],
    expectedEvidenceDigest: "aa32b01ffac8966891db2ff6bb8c9a73e7a2420a089f3ee6b72561982405d9c9",
  },
  {
    status: "warning",
    schemaVersion: "1.1.0",
    errors: [],
    warnings: ["Eski 1.1.0 paketi bütünlük özeti taşımıyor; içerik değişmezliği doğrulanamadı."],
    expectedEvidenceDigest: "f0101e256abb4e771eb2db19c9f0641daf2470daaf1551e0709f93d73faf96c6",
  },
  {
    status: "rejected",
    schemaVersion: "1.2.0",
    errors: ["Denetim paketi SHA-256 bütünlük özeti uyuşmuyor."],
    warnings: [],
    expectedEvidenceDigest: "2fa38c634f327077b30ea3feafd02f7b808915ec10ff8cc0ba732ffc5a60ab22",
  },
];

const forbiddenPersonalDataKeys = new Set([
  "student", "students", "studentid", "studentname", "studentnumber", "schoolnumber",
  "ogrenci", "ogrenciler", "ogrenciadi", "ogrencino", "tckimlikno", "nationalid",
  "identitynumber", "email", "phone", "telephone", "address",
]);

const normalizeKey = (key) =>
  key.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/giu, "").toLocaleLowerCase("en-US");

const collectForbiddenKeys = (value) => {
  const matches = [];
  const visit = (candidate) => {
    if (Array.isArray(candidate)) {
      candidate.forEach(visit);
      return;
    }
    if (!candidate || typeof candidate !== "object") return;
    for (const [key, item] of Object.entries(candidate)) {
      if (forbiddenPersonalDataKeys.has(normalizeKey(key))) matches.push(key);
      visit(item);
    }
  };
  visit(value);
  return matches;
};

for (const fixture of cases) {
  test(`Pilot 2.5 OPUS paritesi: ${fixture.status} kanıtı aynı SHA-256 özetini üretir`, async () => {
    const evidence = await createGenerationAuditVerificationEvidence({
      sourcePackage,
      verifiedAt,
      validation: {
        status: fixture.status,
        schemaVersion: fixture.schemaVersion,
        eventCount: 1,
        computedDigest: null,
        errors: fixture.errors,
        warnings: fixture.warnings,
      },
    });

    assert.equal(evidence.schemaVersion, GENERATION_AUDIT_VERIFICATION_EVIDENCE_SCHEMA_VERSION);
    assert.equal(evidence.sourcePackage.computedDigest, sourceDigest);
    assert.equal(evidence.evidenceIntegrity.digest, fixture.expectedEvidenceDigest);
    assert.equal(await validateGenerationAuditVerificationEvidenceIntegrity(evidence), true);
  });
}

test("Pilot 2.5 kanıtı olay içeriğini veya kişisel veri anahtarlarını kopyalamaz", async () => {
  const evidence = await createGenerationAuditVerificationEvidence({
    sourcePackage,
    verifiedAt,
    validation: {
      status: "valid",
      schemaVersion: "1.2.0",
      eventCount: 1,
      computedDigest: null,
      errors: [],
      warnings: [],
    },
  });

  assert.equal("events" in evidence, false);
  assert.equal("events" in evidence.sourcePackage, false);
  assert.equal(JSON.stringify(evidence).includes("synthetic-event-1"), false);
  assert.deepEqual(collectForbiddenKeys(evidence), []);
  assert.equal(evidence.containsStudentPersonalData, false);
  assert.equal(evidence.policy.maxEventCount, 10_000);
  assert.equal(evidence.policy.maxFileSizeBytes, 8 * 1024 * 1024);
});

test("Pilot 2.5 değiştirilmiş kanıtın bütünlüğünü reddeder", async () => {
  const evidence = await createGenerationAuditVerificationEvidence({
    sourcePackage,
    verifiedAt,
    validation: {
      status: "valid",
      schemaVersion: "1.2.0",
      eventCount: 1,
      computedDigest: null,
      errors: [],
      warnings: [],
    },
  });
  const tampered = {
    ...evidence,
    result: { ...evidence.result, eventCount: evidence.result.eventCount + 1 },
  };

  assert.equal(await validateGenerationAuditVerificationEvidenceIntegrity(tampered), false);
});
