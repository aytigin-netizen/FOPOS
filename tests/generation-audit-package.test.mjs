import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  createGenerationAuditPackage,
  validateGenerationAuditPackage,
} from "../app/core/generation-audit-package.ts";

const event = {
  eventId: "123e4567-e89b-42d3-a456-426614174000",
  requestId: "OPUS-OUT-pilot:daily-plan",
  decisionId: "decision:OPUS-PR-pilot:r2",
  recordId: "OPUS-PR-pilot",
  revision: 2,
  documentType: "daily-plan",
  contractVersion: "1.2.0",
  approvedAt: "2026-08-08T20:00:00.000Z",
  generatedAt: "2026-08-08T20:01:00.000Z",
  curriculum: { moduleId: "fopos", curriculumId: "philosophy-tr-2024", gradeLevelId: "grade-10", unitId: "f10-u1", outcomeCode: "FEL.10.1.1" },
  curriculumDatasetVersion: "2024.1",
  academicYear: "2026-2027",
  artifactIntegrity: null,
};

const input = () => ({
  exportedAt: "2026-08-09T00:00:00.000Z",
  academicYear: "2026-2027",
  exportScope: "academic-year",
  queryScope: { type: "academic-year", academicYear: "2026-2027" },
  containsStudentPersonalData: false,
  events: [event],
});

test("Pilot 2.2 değişmemiş paketi üretir ve doğrular", async () => {
  const payload = await createGenerationAuditPackage(input());
  const result = await validateGenerationAuditPackage(payload);
  assert.equal(payload.schemaVersion, "1.2.0");
  assert.equal(payload.eventCount, 1);
  assert.match(payload.packageIntegrity.digest, /^[0-9a-f]{64}$/u);
  assert.equal(result.status, "valid");
});

test("Pilot 2.2 değiştirilen paketi reddeder", async () => {
  const payload = await createGenerationAuditPackage(input());
  const result = await validateGenerationAuditPackage({ ...payload, exportedAt: "2026-08-09T00:00:01.000Z" });
  assert.equal(result.status, "rejected");
  assert.match(result.errors.join(" "), /SHA-256 bütünlük özeti uyuşmuyor/u);
});

test("Pilot 2.2 kişisel veri anahtarını reddeder", async () => {
  const payload = await createGenerationAuditPackage(input());
  const result = await validateGenerationAuditPackage({ ...payload, events: [{ ...event, studentName: "Örnek" }] });
  assert.equal(result.status, "rejected");
  assert.match(result.errors.join(" "), /studentName/u);
});

test("Pilot 2.2 kapsam ve olay sayısı uyuşmazlığını reddeder", async () => {
  const payload = await createGenerationAuditPackage(input());
  const result = await validateGenerationAuditPackage({ ...payload, exportScope: "search-results", eventCount: 2 });
  assert.equal(result.status, "rejected");
  assert.match(result.errors.join(" "), /exportScope/u);
  assert.match(result.errors.join(" "), /eventCount/u);
});

test("Pilot 2.2 eski 1.1.0 paketini uyarıyla açar", async () => {
  const legacy = { schemaVersion: "1.1.0", ...input() };
  const result = await validateGenerationAuditPackage(legacy);
  assert.equal(result.status, "warning");
  assert.match(result.warnings.join(" "), /bütünlük özeti taşımıyor/u);
});


const auditParityFixtures = JSON.parse(
  readFileSync(new URL("./fixtures/generation-audit-parity.json", import.meta.url), "utf8"),
);

test("Pilot 2.3 ortak fikstür güvenlik ve kapsam beyanını doğrular", () => {
  assert.equal(auditParityFixtures.fixtureSet, "opus-fopos-audit-parity-2.3");
  assert.equal(auditParityFixtures.containsRealStudentData, false);
  assert.deepEqual(auditParityFixtures.cases.map(({ id }) => id), [
    "valid-1.2.0",
    "reordered-equivalent",
    "tampered-content",
    "legacy-1.1.0",
    "scope-and-academic-year-mismatch",
    "event-count-mismatch",
    "duplicate-event-id",
    "nested-student-personal-data",
  ]);
});

for (const fixture of auditParityFixtures.cases) {
  test(`Pilot 2.3 ${fixture.id} için ortak beklenen sonucu üretir`, async () => {
    const result = await validateGenerationAuditPackage(fixture.payload);
    assert.equal(result.status, fixture.expected.status);
    assert.equal(result.eventCount, fixture.expected.eventCount);
    assert.equal(result.computedDigest, fixture.expected.computedDigest);
    assert.deepEqual(result.errors, fixture.expected.errors);
    assert.deepEqual(result.warnings, fixture.expected.warnings);
  });
}

test("Pilot 2.3 alan sırası değişen eşdeğer pakette aynı SHA-256 özetini korur", () => {
  const [valid, reordered] = auditParityFixtures.cases;
  assert.match(valid.expected.computedDigest, /^[0-9a-f]{64}$/u);
  assert.equal(reordered.expected.computedDigest, valid.expected.computedDigest);
});
