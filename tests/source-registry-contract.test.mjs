import assert from "node:assert/strict";
import test from "node:test";

import {
  getOfficialSource,
  listOfficialSources,
  validateOfficialSourceIdentity,
  validateOfficialSourceSnapshot,
  validatePackageSourceAttestation,
} from "../src/core/curriculum/source-registry.ts";
import { detectOfficialSourceChange } from "../src/core/curriculum/source-change-detection.ts";

const philosophy2026Snapshot = Object.freeze({
  snapshotId: "meb:philosophy:2026:2026-08-16",
  sourceId: "meb:philosophy:2026",
  sourceVersion: "2026.1",
  retrievedAt: "2026-08-16T17:54:44+03:00",
  effectiveDate: "2026-08-16",
  contentHash: Object.freeze({ algorithm: "sha256", value: "a".repeat(64) }),
  artifactReference: "evidence/philosophy-2026-source.pdf",
});

const philosophy2026Attestation = Object.freeze({
  packageKey: "philosophy@2026.1",
  sourceId: philosophy2026Snapshot.sourceId,
  sourceVersion: philosophy2026Snapshot.sourceVersion,
  snapshotId: philosophy2026Snapshot.snapshotId,
  sourceContentHash: philosophy2026Snapshot.contentHash,
  verifiedAt: "2026-08-16T18:00:00+03:00",
  verificationMethod: "official-source-parity-and-contract-tests",
  evidenceReferences: Object.freeze(["tests/philosophy-curriculum-2026-source-parity.test.mjs"]),
});

function detect(overrides = {}, inputOverrides = {}) {
  return detectOfficialSourceChange({
    baselineSnapshot: philosophy2026Snapshot,
    baselineAttestation: philosophy2026Attestation,
    observation: {
      sourceId: philosophy2026Snapshot.sourceId,
      sourceVersion: philosophy2026Snapshot.sourceVersion,
      observedAt: "2026-09-17T10:00:00Z",
      contentHash: philosophy2026Snapshot.contentHash,
      ...overrides,
    },
    ...inputOverrides,
  });
}

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
  const snapshot = validateOfficialSourceSnapshot(philosophy2026Snapshot);
  const attestation = validatePackageSourceAttestation({
    packageKey: "philosophy@2026.1",
    sourceId: snapshot.sourceId,
    sourceVersion: snapshot.sourceVersion,
    snapshotId: snapshot.snapshotId,
    sourceContentHash: snapshot.contentHash,
    verifiedAt: "2026-08-16T17:54:44+03:00",
    verificationMethod: "official-source-parity-and-contract-tests",
    evidenceReferences: ["tests/philosophy-curriculum-2026-source-parity.test.mjs"],
  }, snapshot);
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
    }, philosophy2026Snapshot),
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
    }, philosophy2026Snapshot),
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
    }, philosophy2026Snapshot),
    /kayıtlı kaynak paketiyle eşleşmiyor/u,
  );
  assert.throws(
    () => validatePackageSourceAttestation({
      ...base,
      packageKey: "philosophy@2026.1@extra",
      sourceVersion: "2026.1",
    }, philosophy2026Snapshot),
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
    }, {
      ...philosophy2026Snapshot,
      sourceId: "meb:philosophy:2024",
      sourceVersion: "2024.1",
    }),
    /kayıtlı kaynak paketiyle eşleşmiyor/u,
  );
});

test("snapshot kaynak sürümünü registry dataset sürümüne bağlar", () => {
  assert.throws(
    () => validateOfficialSourceSnapshot({
      ...philosophy2026Snapshot,
      sourceVersion: "2024.1",
    }),
    /kayıtlı kaynak sürümüyle eşleşmiyor/u,
  );
});

test("attestation snapshot kimliği, kaynağı, sürümü ve hashini birebir eşler", () => {
  const base = {
    packageKey: "philosophy@2026.1",
    sourceId: philosophy2026Snapshot.sourceId,
    sourceVersion: philosophy2026Snapshot.sourceVersion,
    snapshotId: philosophy2026Snapshot.snapshotId,
    sourceContentHash: philosophy2026Snapshot.contentHash,
    verifiedAt: "2026-08-16T18:00:00+03:00",
    verificationMethod: "manual-review",
    evidenceReferences: ["evidence/verification.json"],
  };
  for (const mutation of [
    { snapshotId: "another-snapshot" },
    { sourceId: "meb:philosophy:2024", packageKey: "philosophy@2024.1", sourceVersion: "2024.1" },
    { sourceContentHash: { algorithm: "sha256", value: "f".repeat(64) } },
  ]) {
    assert.throws(
      () => validatePackageSourceAttestation({ ...base, ...mutation }, philosophy2026Snapshot),
      /snapshot kanıt zinciriyle eşleşmiyor/u,
    );
  }
});

test("attestation snapshot alınmadan önce doğrulanmış görünemez", () => {
  assert.throws(
    () => validatePackageSourceAttestation({
      packageKey: "philosophy@2026.1",
      sourceId: philosophy2026Snapshot.sourceId,
      sourceVersion: philosophy2026Snapshot.sourceVersion,
      snapshotId: philosophy2026Snapshot.snapshotId,
      sourceContentHash: philosophy2026Snapshot.contentHash,
      verifiedAt: "2026-08-16T17:00:00+03:00",
      verificationMethod: "manual-review",
      evidenceReferences: ["evidence/verification.json"],
    }, philosophy2026Snapshot),
    /snapshot kanıt zinciriyle eşleşmiyor/u,
  );
});

test("snapshot ve attestation zamanları açık UTC veya offset taşır", () => {
  const attestation = {
    packageKey: "philosophy@2026.1",
    sourceId: philosophy2026Snapshot.sourceId,
    sourceVersion: philosophy2026Snapshot.sourceVersion,
    snapshotId: philosophy2026Snapshot.snapshotId,
    sourceContentHash: philosophy2026Snapshot.contentHash,
    verifiedAt: "2026-08-16T15:00:00Z",
    verificationMethod: "manual-review",
    evidenceReferences: ["evidence/verification.json"],
  };
  assert.doesNotThrow(() => validatePackageSourceAttestation(
    attestation,
    {
      ...philosophy2026Snapshot,
      retrievedAt: "2026-08-16T14:54:44Z",
    },
  ));
  for (const retrievedAt of [
    "2026-08-16T17:54:44",
    "2026-08-16 17:54:44",
    "2026-08-16T17:54:44+03",
  ]) {
    assert.throws(
      () => validateOfficialSourceSnapshot({
        ...philosophy2026Snapshot,
        retrievedAt,
      }),
      /snapshot kaydı geçersiz/u,
    );
  }
  for (const verifiedAt of [
    "2026-08-16T18:00:00",
    "2026-08-16 18:00:00",
    "2026-08-16T18:00:00+03",
  ]) {
    assert.throws(
      () => validatePackageSourceAttestation({
        ...attestation,
        verifiedAt,
      }, philosophy2026Snapshot),
      /attestation kaydı geçersiz/u,
    );
  }
  assert.doesNotThrow(() => validateOfficialSourceSnapshot({
    ...philosophy2026Snapshot,
    retrievedAt: "2026-08-16T17:54:44.123+03:00",
    effectiveDate: "2026-08-16",
  }));
});

test("D3 kaynak gözlemlerini dört değişiklik sınıfına ayırır", () => {
  assert.equal(detect().classification, "UNCHANGED");
  assert.equal(
    detect({ contentHash: { algorithm: "sha256", value: "b".repeat(64) } }).classification,
    "CONTENT_CHANGED",
  );
  assert.equal(detect({ sourceVersion: "2026.2" }).classification, "VERSION_CHANGED");
  assert.equal(
    detect({
      sourceVersion: "2026.2",
      contentHash: { algorithm: "sha256", value: "c".repeat(64) },
    }).classification,
    "VERSION_AND_CONTENT_CHANGED",
  );
});

test("D3 yalnız gerçek kaynak değişikliğinde yeniden doğrulama ister", () => {
  const unchanged = detect();
  const changed = detect({ sourceVersion: "2026.2" });
  assert.equal(unchanged.requiresRevalidation, false);
  assert.equal(changed.requiresRevalidation, true);
  assert.equal(changed.versionChanged, true);
  assert.equal(changed.contentChanged, false);
});

test("D3 bilinmeyen veya baseline ile eşleşmeyen sourceId değerini reddeder", () => {
  assert.throws(
    () => detect({ sourceId: "meb:unknown:2026" }),
    /bilinmeyen bir resmî kaynağa/u,
  );
  assert.throws(
    () => detect({ sourceId: "meb:philosophy:2024" }),
    /baseline kaynağıyla eşleşmiyor/u,
  );
});

test("D3 eski, saat dilimsiz veya geçersiz hash taşıyan gözlemi reddeder", () => {
  assert.throws(
    () => detect({ observedAt: "2026-08-16T10:00:00Z" }),
    /baseline kaydından eski olamaz/u,
  );
  assert.throws(
    () => detect({ observedAt: "2026-09-17T10:00:00" }),
    /gözlem kaydı geçersiz/u,
  );
  assert.throws(
    () => detect({ contentHash: { algorithm: "sha256", value: "invalid" } }),
    /içerik özeti geçersiz/u,
  );
});

test("D3 gözlem sürümünü kanonik biçimde ister ve çevresel boşluğu reddeder", () => {
  for (const sourceVersion of ["2026.1\n", " 2026.1", "2026.1 ", "v2026.1"])
    assert.throws(
      () => detect({ sourceVersion }),
      /gözlem kaydı geçersiz/u,
    );
  assert.equal(detect({ sourceVersion: "2026.2" }).classification, "VERSION_CHANGED");
});

test("D3 yalnız kanıt zinciri doğrulanmış baseline kabul eder", () => {
  assert.throws(
    () => detect({}, {
      baselineAttestation: {
        ...philosophy2026Attestation,
        snapshotId: "unverified-snapshot",
      },
    }),
    /snapshot kanıt zinciriyle eşleşmiyor/u,
  );
});

test("D3 sonucu immutable kalır ve baseline girdisini değiştirmez", () => {
  const baselineBefore = structuredClone(philosophy2026Snapshot);
  const result = detect({ sourceVersion: "2026.2" });
  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.baselineContentHash), true);
  assert.equal(Object.isFrozen(result.observedContentHash), true);
  assert.throws(() => {
    result.classification = "UNCHANGED";
  }, TypeError);
  assert.deepEqual(philosophy2026Snapshot, baselineBefore);
});
