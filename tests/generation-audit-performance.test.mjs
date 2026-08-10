import assert from "node:assert/strict";
import { memoryUsage } from "node:process";
import { performance } from "node:perf_hooks";
import test from "node:test";

import {
  calculateGenerationAuditPackageDigest,
  validateGenerationAuditPackage,
} from "../app/core/generation-audit-package.ts";

const LOAD_PROFILES = Object.freeze([100, 1_000, 5_000, 10_000]);
const CI_VALIDATION_BUDGET_MS = 30_000;

const eventFor = (index) => ({
  eventId: `pilot-2-4-event-${index.toString().padStart(5, "0")}`,
  requestId: `OPUS-OUT-pilot-2-4:${index}`,
  decisionId: `decision:OPUS-PR-pilot-2-4:r${index + 1}`,
  recordId: `OPUS-PR-pilot-2-4-${index}`,
  revision: 1,
  documentType: "daily-plan",
  contractVersion: "1.2.0",
  approvedAt: "2026-08-10T00:00:00.000Z",
  generatedAt: "2026-08-10T00:01:00.000Z",
  curriculum: {
    moduleId: "fopos",
    curriculumId: "philosophy-tr-2024",
    gradeLevelId: "grade-10",
    unitId: "f10-u1",
    outcomeCode: "FEL.10.1.1",
  },
  curriculumDatasetVersion: "2024.1",
  academicYear: "2026-2027",
  artifactIntegrity: null,
});

const unsignedPackage = (eventCount) => ({
  schemaVersion: "1.2.0",
  exportedAt: "2026-08-10T00:02:00.000Z",
  academicYear: "2026-2027",
  exportScope: "academic-year",
  queryScope: { type: "academic-year", academicYear: "2026-2027" },
  containsStudentPersonalData: false,
  eventCount,
  events: Array.from({ length: eventCount }, (_, index) => eventFor(index)),
});

const signedPackage = async (eventCount) => {
  const payload = unsignedPackage(eventCount);
  return {
    ...payload,
    packageIntegrity: {
      algorithm: "SHA-256",
      digest: await calculateGenerationAuditPackageDigest(payload),
    },
  };
};

test("Pilot 2.4 deterministik 100-10.000 olay profillerini güvenli bütçe içinde doğrular", { timeout: 60_000 }, async () => {
  const measurements = [];

  for (const eventCount of LOAD_PROFILES) {
    const heapBefore = memoryUsage().heapUsed;
    const startedAt = performance.now();
    const payload = await signedPackage(eventCount);
    const result = await validateGenerationAuditPackage(payload);
    const elapsedMs = performance.now() - startedAt;
    const heapDeltaBytes = Math.max(0, memoryUsage().heapUsed - heapBefore);
    const packageBytes = Buffer.byteLength(JSON.stringify(payload), "utf8");

    assert.equal(result.status, "valid");
    assert.equal(result.eventCount, eventCount);
    assert.equal(result.computedDigest, payload.packageIntegrity.digest);
    assert.ok(elapsedMs < CI_VALIDATION_BUDGET_MS);

    measurements.push({
      eventCount,
      packageBytes,
      elapsedMs: Number(elapsedMs.toFixed(2)),
      heapDeltaBytes,
    });
  }

  console.info("PILOT_2_4_FOPOS_MEASUREMENTS", JSON.stringify(measurements));
});

test("Pilot 2.4 10.000 olaylık değiştirilmiş paketi reddeder", { timeout: 60_000 }, async () => {
  const payload = await signedPackage(10_000);
  const result = await validateGenerationAuditPackage({
    ...payload,
    exportedAt: "2026-08-10T00:02:01.000Z",
  });
  assert.equal(result.status, "rejected");
  assert.ok(result.errors.includes("Denetim paketi SHA-256 bütünlük özeti uyuşmuyor."));
});

test("Pilot 2.4 10.000 olaylık pakette iç içe kişisel veri anahtarını reddeder", { timeout: 60_000 }, async () => {
  const payload = unsignedPackage(10_000);
  payload.events[0] = {
    ...payload.events[0],
    metadata: { studentName: "PILOT_2_4_SENTINEL" },
  };
  const protectedPayload = {
    ...payload,
    packageIntegrity: {
      algorithm: "SHA-256",
      digest: await calculateGenerationAuditPackageDigest(payload),
    },
  };
  const result = await validateGenerationAuditPackage(protectedPayload);
  assert.equal(result.status, "rejected");
  assert.ok(result.errors.includes(
    "Öğrenci kişisel verisi anahtarları bulundu: events[0].metadata.studentName",
  ));
});
