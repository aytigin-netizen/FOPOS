import assert from "node:assert/strict";
import test from "node:test";

import {
  getOfficialSource,
  listOfficialSources,
  validateOfficialSourceIdentity,
  validateOfficialSourceSnapshot,
  validatePackageSourceAttestation,
} from "../src/core/curriculum/source-registry.ts";

test("source registry canonical kaynak kimliklerini açıkça kaydeder", () => {
  assert.deepEqual(
    listOfficialSources().map(({ sourceId, disciplineCode, datasetVersion, packageKey }) => ({
      sourceId,
      disciplineCode,
      datasetVersion,
      packageKey,
    })),
    [
      { sourceId: "meb:philosophy:2024", disciplineCode: "philosophy", datasetVersion: "2024.1", packageKey: "philosophy@2024.1" },
      { sourceId: "meb:philosophy:2026", disciplineCode: "philosophy", datasetVersion: "2026.1", packageKey: "philosophy@2026.1" },
      { sourceId: "meb:sociology:2026", disciplineCode: "sociology", datasetVersion: "2026.1", packageKey: "sociology@2026.1" },
    ],
  );
});
test("registry girdileri dış mutasyona kapalıdır", () => {
  const source = getOfficialSource("meb:philosophy:2026");
  assert.ok(source);
  assert.equal(Object.isFrozen(source), true);
  assert.throws(() => {
    source.disciplineCode = "corrupted";
  }, TypeError);
  assert.equal(
    getOfficialSource("meb:philosophy:2026")?.disciplineCode,
    "philosophy",
  );
});

test("D1 zamanlanmış kontrolü etkinleştirmez", () => {
  assert.ok(
    listOfficialSources().every(
      ({ monitoringMode }) => monitoringMode === "MANUAL_REVIEW",
    ),
  );
});

test("geçersiz kaynak kimliği ve güvenli olmayan adres reddedilir", () => {
  assert.throws(
    () => validateOfficialSourceIdentity({
      sourceId: "MEB Philosophy",
      disciplineCode: "philosophy",
      datasetVersion: "2026.1",
      packageKey: "philosophy@2026.1",
      publisher: "MEB",
      canonicalUrl: "https://mufredat.meb.gov.tr/",
      monitoringMode: "MANUAL_REVIEW",
    }),
    /kaynak kimliği geçersiz/u,
  );
  assert.throws(
    () => validateOfficialSourceIdentity({
      sourceId: "meb:philosophy:test",
      disciplineCode: "philosophy",
      datasetVersion: "2026.1",
      packageKey: "philosophy@2026.1",
      publisher: "MEB",
      canonicalUrl: "http://example.invalid/",
      monitoringMode: "MANUAL_REVIEW",
    }),
    /yayıncı veya adres bilgisi geçersiz/u,
  );
  assert.throws(
    () => validateOfficialSourceIdentity({
      sourceId: "meb:philosophy:test",
      disciplineCode: "philosophy",
      datasetVersion: "2026.1",
      packageKey: "philosophy@2026.1",
      publisher: "MEB",
      canonicalUrl: "https://mufredat.meb.gov.tr/",
      monitoringMode: "AUTO",
    }),
    /izleme modu geçersiz/u,
  );
});

test("kaynak kimliği dataset sürümü ve paket anahtarını tutarlı eşler", () => {
  const base = {
    sourceId: "meb:philosophy:test",
    disciplineCode: "philosophy",
    publisher: "MEB",
    canonicalUrl: "https://mufredat.meb.gov.tr/",
    monitoringMode: "MANUAL_REVIEW",
  };
  assert.throws(
    () => validateOfficialSourceIdentity({
      ...base,
      datasetVersion: "2024.1",
      packageKey: "philosophy@2026.1",
    }),
    /paket eşlemesi geçersiz/u,
  );
  assert.throws(
    () => validateOfficialSourceIdentity({
      ...base,
      datasetVersion: "2026.1",
      packageKey: "sociology@2026.1",
    }),
    /paket eşlemesi geçersiz/u,
  );
});

test("snapshot ve paket attestation kayıtları doğrulanıp dondurulur", () => {
  const contentHash = {
    algorithm: "sha256",
    value: "a".repeat(64),
  };
  const snapshot = validateOfficialSourceSnapshot({
    snapshotId: "meb:philosophy:2026:2026-08-16",
    sourceId: "meb:philosophy:2026",
    sourceVersion: "2026.1",
    retrievedAt: "2026-08-16T17:54:44+03:00",
    effectiveDate: "2026-08-16",
    contentHash,
    artifactReference: "evidence/philosophy-2026-source.pdf",
  });
  const attestation = validatePackageSourceAttestation({
    packageKey: "philosophy@2026.1",
    sourceId: snapshot.sourceId,
    sourceVersion: snapshot.sourceVersion,
    snapshotId: snapshot.snapshotId,
    sourceContentHash: snapshot.contentHash,
    verifiedAt: "2026-08-16T17:54:44+03:00",
    verificationMethod: "official-source-parity-and-contract-tests",
    evidenceReferences: ["tests/philosophy-curriculum-2026-source-parity.test.mjs"],
  });
  assert.equal(Object.isFrozen(snapshot), true);
  assert.equal(Object.isFrozen(snapshot.contentHash), true);
  assert.equal(Object.isFrozen(attestation), true);
  assert.equal(Object.isFrozen(attestation.evidenceReferences), true);
});

test("snapshot ve attestation uydurma ya da eksik kanıtı reddeder", () => {
  assert.throws(
    () => validateOfficialSourceSnapshot({
      snapshotId: "unknown",
      sourceId: "meb:unknown:2026",
      sourceVersion: "2026.1",
      retrievedAt: "2026-09-16T00:00:00.000Z",
      effectiveDate: null,
      contentHash: { algorithm: "sha256", value: "b".repeat(64) },
      artifactReference: "evidence/unknown.pdf",
    }),
    /bilinmeyen bir resmî kaynağa/u,
  );
  assert.throws(
    () => validatePackageSourceAttestation({
      packageKey: "philosophy@2026.1",
      sourceId: "meb:philosophy:2026",
      sourceVersion: "2026.1",
      snapshotId: "snapshot",
      sourceContentHash: { algorithm: "sha256", value: "not-a-hash" },
      verifiedAt: "2026-08-16T17:54:44+03:00",
      verificationMethod: "manual-review",
      evidenceReferences: [],
    }),
    /attestation kaydı geçersiz/u,
  );
});

test("attestation paket branşı ile kayıtlı kaynak branşını eşleştirir", () => {
  assert.throws(
    () => validatePackageSourceAttestation({
      packageKey: "sociology@2026.1",
      sourceId: "meb:philosophy:2026",
      sourceVersion: "2026.1",
      snapshotId: "snapshot",
      sourceContentHash: { algorithm: "sha256", value: "c".repeat(64) },
      verifiedAt: "2026-08-16T17:54:44+03:00",
      verificationMethod: "manual-review",
      evidenceReferences: ["evidence/verification.json"],
    }),
    /kayıtlı kaynak paketiyle eşleşmiyor/u,
  );
});

test("attestation paket sürümü ile kaynak sürümünü eşleştirir", () => {
  const base = {
    sourceId: "meb:philosophy:2026",
    snapshotId: "snapshot",
    sourceContentHash: { algorithm: "sha256", value: "d".repeat(64) },
    verifiedAt: "2026-08-16T17:54:44+03:00",
    verificationMethod: "manual-review",
    evidenceReferences: ["evidence/verification.json"],
  };
  assert.throws(
    () => validatePackageSourceAttestation({
      ...base,
      packageKey: "philosophy@2026.1",
      sourceVersion: "2024.1",
    }),
    /kayıtlı kaynak paketiyle eşleşmiyor/u,
  );
  assert.throws(
    () => validatePackageSourceAttestation({
      ...base,
      packageKey: "philosophy@2026.1@extra",
      sourceVersion: "2026.1",
    }),
    /attestation kaydı geçersiz/u,
  );
});

test("attestation aynı branştaki yanlış resmî kaynak edisyonunu reddeder", () => {
  assert.throws(
    () => validatePackageSourceAttestation({
      packageKey: "philosophy@2026.1",
      sourceId: "meb:philosophy:2024",
      sourceVersion: "2026.1",
      snapshotId: "snapshot",
      sourceContentHash: { algorithm: "sha256", value: "e".repeat(64) },
      verifiedAt: "2026-08-16T17:54:44+03:00",
      verificationMethod: "manual-review",
      evidenceReferences: ["evidence/verification.json"],
    }),
    /kayıtlı kaynak paketiyle eşleşmiyor/u,
  );
});
