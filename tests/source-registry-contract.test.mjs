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
import { deriveSourceRevalidationTransition } from "../src/core/curriculum/source-revalidation-transition.ts";
import {
  createSourceRevalidationEvidence,
  deriveControlledSourceRevalidationTransition,
} from "../src/core/curriculum/source-revalidation-evidence.ts";

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

test("D4 değişmeyen kaynakta mevcut doğrulama durumunu korur", () => {
  const transition = deriveSourceRevalidationTransition({
    currentStatus: "VERIFIED",
    detection: detect(),
  });
  assert.equal(transition.previousStatus, "VERIFIED");
  assert.equal(transition.nextStatus, "VERIFIED");
  assert.equal(transition.transitionApplied, false);
  assert.equal(transition.requiresHumanReview, false);
  assert.equal(transition.reason, "SOURCE_UNCHANGED");
});

test("D4 doğrulanmış paketi gerçek kaynak değişikliğinde stale durumuna düşürür", () => {
  for (const observation of [
    { contentHash: { algorithm: "sha256", value: "b".repeat(64) } },
    { sourceVersion: "2026.2" },
    {
      sourceVersion: "2026.2",
      contentHash: { algorithm: "sha256", value: "c".repeat(64) },
    },
  ]) {
    const transition = deriveSourceRevalidationTransition({
      currentStatus: "VERIFIED",
      detection: detect(observation),
    });
    assert.equal(transition.nextStatus, "STALE");
    assert.equal(transition.transitionApplied, true);
    assert.equal(transition.requiresHumanReview, true);
    assert.equal(transition.reason, "SOURCE_CHANGE_REQUIRES_REVALIDATION");
  }
});

test("D4 stale, unverified ve rejected durumlarını otomatik yükseltmez", () => {
  const changed = detect({ sourceVersion: "2026.2" });
  for (const currentStatus of ["STALE", "UNVERIFIED", "REJECTED"]) {
    const transition = deriveSourceRevalidationTransition({ currentStatus, detection: changed });
    assert.equal(transition.previousStatus, currentStatus);
    assert.equal(transition.nextStatus, currentStatus);
    assert.equal(transition.transitionApplied, false);
    assert.equal(transition.requiresHumanReview, true);
    assert.equal(transition.reason, "AUTOMATIC_PROMOTION_FORBIDDEN");
  }
});

test("D4 sınıflandırmayla çelişen yeniden doğrulama sonucunu reddeder", () => {
  const inconsistent = {
    ...detect(),
    requiresRevalidation: true,
  };
  assert.throws(
    () => deriveSourceRevalidationTransition({
      currentStatus: "VERIFIED",
      detection: inconsistent,
    }),
    /yeniden doğrulama geçişiyle tutarsız/u,
  );
});

test("D4 sürüm değerleriyle çelişen unchanged sonucunu reddeder", () => {
  const inconsistent = {
    ...detect(),
    observedSourceVersion: "2026.2",
  };
  assert.throws(
    () => deriveSourceRevalidationTransition({
      currentStatus: "VERIFIED",
      detection: inconsistent,
    }),
    /yeniden doğrulama geçişiyle tutarsız/u,
  );
});

test("D4 hash değerleriyle çelişen unchanged sonucunu reddeder", () => {
  const inconsistent = {
    ...detect(),
    observedContentHash: { algorithm: "sha256", value: "d".repeat(64) },
  };
  assert.throws(
    () => deriveSourceRevalidationTransition({
      currentStatus: "VERIFIED",
      detection: inconsistent,
    }),
    /yeniden doğrulama geçişiyle tutarsız/u,
  );
});

test("D4 sonucu immutable kalır ve D3 girdisini değiştirmez", () => {
  const detection = detect({ sourceVersion: "2026.2" });
  const detectionBefore = structuredClone(detection);
  const transition = deriveSourceRevalidationTransition({
    currentStatus: "VERIFIED",
    detection,
  });
  assert.equal(Object.isFrozen(transition), true);
  assert.throws(() => {
    transition.nextStatus = "VERIFIED";
  }, TypeError);
  assert.deepEqual(detection, detectionBefore);
});

function d5Fixture(decision = "APPROVED") {
  const detection = detect({
    contentHash: { algorithm: "sha256", value: "b".repeat(64) },
  });
  const staleTransition = deriveSourceRevalidationTransition({
    currentStatus: "VERIFIED",
    detection,
  });
  const replacementSnapshot = {
    ...philosophy2026Snapshot,
    snapshotId: "meb:philosophy:2026:2026-09-17",
    retrievedAt: "2026-09-17T10:05:00Z",
    contentHash: detection.observedContentHash,
    artifactReference: "evidence/philosophy-2026-source-2026-09-17.pdf",
  };
  const replacementAttestation = {
    ...philosophy2026Attestation,
    snapshotId: replacementSnapshot.snapshotId,
    sourceContentHash: replacementSnapshot.contentHash,
    verifiedAt: "2026-09-17T10:10:00Z",
    evidenceReferences: [
      "evidence/philosophy-2026-source-2026-09-17.pdf",
      "tests/philosophy-curriculum-2026-source-parity.test.mjs",
    ],
  };
  const review = {
    actorType: "HUMAN",
    actorId: "curriculum-reviewer",
    decision,
    reviewedAt: "2026-09-17T10:15:00Z",
  };
  const evidence = createSourceRevalidationEvidence({
    detection,
    staleTransition,
    replacementSnapshot,
    replacementAttestation,
    review,
  });
  return {
    detection,
    staleTransition,
    replacementSnapshot,
    replacementAttestation,
    review,
    evidence,
  };
}

test("D5 geçerli kanıt ve açık insan onayıyla STALE durumunu VERIFIED yapar", () => {
  const fixture = d5Fixture();
  const result = deriveControlledSourceRevalidationTransition({
    packageKey: fixture.evidence.packageKey,
    currentStatus: "STALE",
    detection: fixture.detection,
    staleTransition: fixture.staleTransition,
    evidence: fixture.evidence,
  });
  assert.equal(result.previousStatus, "STALE");
  assert.equal(result.nextStatus, "VERIFIED");
  assert.equal(result.transitionApplied, true);
  assert.equal(result.requiresHumanReview, false);
  assert.equal(result.reason, "REVALIDATION_APPROVED");
});

test("D5 insan reddinde STALE durumunu korur", () => {
  const fixture = d5Fixture("REJECTED");
  const result = deriveControlledSourceRevalidationTransition({
    packageKey: fixture.evidence.packageKey,
    currentStatus: "STALE",
    detection: fixture.detection,
    staleTransition: fixture.staleTransition,
    evidence: fixture.evidence,
  });
  assert.equal(result.nextStatus, "STALE");
  assert.equal(result.transitionApplied, false);
  assert.equal(result.requiresHumanReview, true);
  assert.equal(result.reason, "HUMAN_REVIEW_REJECTED");
});

test("D5 insan kararı veya kanıt olmadan STALE durumunu yükseltmez", () => {
  const fixture = d5Fixture();
  assert.throws(
    () => createSourceRevalidationEvidence({
      ...fixture,
      review: { ...fixture.review, actorId: "" },
    }),
    /insan incelemesi geçersiz/u,
  );
  assert.throws(
    () => deriveControlledSourceRevalidationTransition({
      packageKey: fixture.evidence.packageKey,
      currentStatus: "STALE",
      detection: fixture.detection,
      staleTransition: fixture.staleTransition,
      evidence: null,
    }),
    /kanıtı zorunludur/u,
  );
});

test("D5 snapshot kimliği, kaynak, hash ve zaman zincirini D3 ile eşler", () => {
  const fixture = d5Fixture();
  for (const replacementSnapshot of [
    { ...fixture.replacementSnapshot, sourceId: "meb:philosophy:2024", sourceVersion: "2024.1" },
    { ...fixture.replacementSnapshot, contentHash: { algorithm: "sha256", value: "c".repeat(64) } },
    { ...fixture.replacementSnapshot, retrievedAt: "2026-09-17T09:00:00Z" },
  ]) {
    assert.throws(
      () => createSourceRevalidationEvidence({
        detection: fixture.detection,
        staleTransition: fixture.staleTransition,
        replacementSnapshot,
        replacementAttestation: {
          ...fixture.replacementAttestation,
          sourceId: replacementSnapshot.sourceId,
          sourceVersion: replacementSnapshot.sourceVersion,
          snapshotId: replacementSnapshot.snapshotId,
          sourceContentHash: replacementSnapshot.contentHash,
        },
        review: fixture.review,
      }),
      /(eşleşmiyor|eski olamaz)/u,
    );
  }
});

test("D5 paket anahtarı, attestation ve inceleme zamanını doğrular", () => {
  const fixture = d5Fixture();
  assert.throws(
    () => createSourceRevalidationEvidence({
      ...fixture,
      replacementAttestation: {
        ...fixture.replacementAttestation,
        packageKey: "sociology@2026.1",
      },
    }),
    /kayıtlı kaynak paketiyle eşleşmiyor/u,
  );
  assert.throws(
    () => createSourceRevalidationEvidence({
      ...fixture,
      review: { ...fixture.review, reviewedAt: "2026-09-17T10:00:00Z" },
    }),
    /insan incelemesi geçersiz/u,
  );
});

test("D5 eski yeniden doğrulama kanıtını daha yeni D3 gözleminde reddeder", () => {
  const fixture = d5Fixture();
  const laterDetection = {
    ...fixture.detection,
    observedAt: "2026-10-01T10:00:00Z",
  };
  const laterStaleTransition = deriveSourceRevalidationTransition({
    currentStatus: "VERIFIED",
    detection: laterDetection,
  });
  assert.throws(
    () => deriveControlledSourceRevalidationTransition({
      packageKey: fixture.evidence.packageKey,
      currentStatus: "STALE",
      detection: laterDetection,
      staleTransition: laterStaleTransition,
      evidence: fixture.evidence,
    }),
    /kanıt zinciri/u,
  );
});

test("D5 paket anahtarını D3 kaynağının registry kaydına bağlar", () => {
  const fixture = d5Fixture();
  assert.throws(
    () => deriveControlledSourceRevalidationTransition({
      packageKey: "sociology@2026.1",
      currentStatus: "STALE",
      detection: fixture.detection,
      staleTransition: fixture.staleTransition,
      evidence: {
        ...fixture.evidence,
        packageKey: "sociology@2026.1",
      },
    }),
    /kayıtlı kaynakla eşleşmiyor/u,
  );
});

test("D5 replacement snapshot için baseline kimliğinin tekrar kullanımını reddeder", () => {
  const fixture = d5Fixture();
  const replacementSnapshot = {
    ...fixture.replacementSnapshot,
    snapshotId: fixture.detection.baselineSnapshotId,
  };
  assert.throws(
    () => createSourceRevalidationEvidence({
      detection: fixture.detection,
      staleTransition: fixture.staleTransition,
      replacementSnapshot,
      replacementAttestation: {
        ...fixture.replacementAttestation,
        snapshotId: replacementSnapshot.snapshotId,
      },
      review: fixture.review,
    }),
    /snapshot.*D3 gözlemiyle eşleşmiyor/iu,
  );
});

test("D5 yeniden kurulmuş kanıtta aynı snapshot kimliğiyle yükseltmeyi reddeder", () => {
  const fixture = d5Fixture();
  assert.throws(
    () => deriveControlledSourceRevalidationTransition({
      packageKey: fixture.evidence.packageKey,
      currentStatus: "STALE",
      detection: fixture.detection,
      staleTransition: fixture.staleTransition,
      evidence: {
        ...fixture.evidence,
        replacementSnapshotId: fixture.evidence.previousSnapshotId,
      },
    }),
    /kanıt zinciri/u,
  );
});

test("D5 kaynak sürümü değiştiğinde mevcut paketi yükseltmez", () => {
  const detection = detect({ sourceVersion: "2026.2" });
  const staleTransition = deriveSourceRevalidationTransition({
    currentStatus: "VERIFIED",
    detection,
  });
  const result = deriveControlledSourceRevalidationTransition({
    packageKey: "philosophy@2026.1",
    currentStatus: "STALE",
    detection,
    staleTransition,
    evidence: null,
  });
  assert.equal(result.nextStatus, "STALE");
  assert.equal(result.transitionApplied, false);
  assert.equal(result.reason, "NEW_PACKAGE_REQUIRED");
  assert.throws(
    () => createSourceRevalidationEvidence({
      detection,
      staleTransition,
      replacementSnapshot: philosophy2026Snapshot,
      replacementAttestation: philosophy2026Attestation,
      review: d5Fixture().review,
    }),
    /kaynak sürümü değişti.*mevcut paket/iu,
  );
});

test("D5 UNVERIFIED, REJECTED ve VERIFIED durumlarını yükseltmez", () => {
  const fixture = d5Fixture();
  for (const currentStatus of ["UNVERIFIED", "REJECTED", "VERIFIED"]) {
    const result = deriveControlledSourceRevalidationTransition({
      packageKey: fixture.evidence.packageKey,
      currentStatus,
      detection: fixture.detection,
      staleTransition: fixture.staleTransition,
      evidence: fixture.evidence,
    });
    assert.equal(result.nextStatus, currentStatus);
    assert.equal(result.transitionApplied, false);
    assert.equal(result.reason, "STATUS_NOT_ELIGIBLE");
  }
});

test("D5 sahte D4 sonucu ve yeniden kurulmuş çelişkili kanıtı reddeder", () => {
  const fixture = d5Fixture();
  assert.throws(
    () => deriveControlledSourceRevalidationTransition({
      packageKey: fixture.evidence.packageKey,
      currentStatus: "STALE",
      detection: fixture.detection,
      staleTransition: { ...fixture.staleTransition, baselineSnapshotId: "forged" },
      evidence: fixture.evidence,
    }),
    /doğrulanmış.*D4 geçişini/u,
  );
  assert.throws(
    () => deriveControlledSourceRevalidationTransition({
      packageKey: fixture.evidence.packageKey,
      currentStatus: "STALE",
      detection: fixture.detection,
      staleTransition: fixture.staleTransition,
      evidence: {
        ...fixture.evidence,
        sourceContentHash: { algorithm: "sha256", value: "f".repeat(64) },
      },
    }),
    /kanıt zinciri/u,
  );
});

test("D5 kanıtı immutable kalır ve girdileri değiştirmez", () => {
  const fixture = d5Fixture();
  const detectionBefore = structuredClone(fixture.detection);
  assert.equal(Object.isFrozen(fixture.evidence), true);
  assert.equal(Object.isFrozen(fixture.evidence.sourceContentHash), true);
  assert.equal(Object.isFrozen(fixture.evidence.evidenceReferences), true);
  assert.equal(Object.isFrozen(fixture.evidence.review), true);
  assert.throws(() => {
    fixture.evidence.review.decision = "REJECTED";
  }, TypeError);
  assert.deepEqual(fixture.detection, detectionBefore);
});
