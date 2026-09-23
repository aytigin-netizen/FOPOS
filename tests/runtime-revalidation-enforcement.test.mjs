import assert from "node:assert/strict";
import test from "node:test";

import { philosophy2024Package } from "../src/curriculum-packages/philosophy-2024.ts";
import { philosophy2026Package } from "../src/curriculum-packages/philosophy-2026.ts";
import { sociology2026Package } from "../src/curriculum-packages/sociology-2026.ts";
import {
  applySourceRevalidationResult,
  createCurriculumRuntimeVerificationState,
  evaluateCurriculumRuntimeEligibility,
} from "../src/core/curriculum/runtime-verification.ts";
import { orchestrateSourceRevalidation } from "../src/core/curriculum/source-revalidation-orchestrator.ts";

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
  evidenceReferences: Object.freeze([
    "tests/philosophy-curriculum-2026-source-parity.test.mjs",
  ]),
});

function genuineD6Input(currentStatus, previousStaleTransition = null) {
  const observedContentHash = Object.freeze({
    algorithm: "sha256",
    value: "b".repeat(64),
  });
  return {
    packageKey: philosophy2026Attestation.packageKey,
    currentStatus,
    baselineSnapshot: philosophy2026Snapshot,
    baselineAttestation: philosophy2026Attestation,
    observation: {
      sourceId: philosophy2026Snapshot.sourceId,
      sourceVersion: philosophy2026Snapshot.sourceVersion,
      observedAt: "2026-09-20T10:00:00Z",
      contentHash: observedContentHash,
    },
    reviewBundle: currentStatus === "STALE"
      ? {
          replacementSnapshot: {
            ...philosophy2026Snapshot,
            snapshotId: "meb:philosophy:2026:2026-09-20",
            retrievedAt: "2026-09-20T10:05:00Z",
            contentHash: observedContentHash,
            artifactReference: "evidence/philosophy-2026-source-2026-09-20.pdf",
          },
          replacementAttestation: {
            ...philosophy2026Attestation,
            snapshotId: "meb:philosophy:2026:2026-09-20",
            sourceContentHash: observedContentHash,
            verifiedAt: "2026-09-20T10:10:00Z",
            evidenceReferences: Object.freeze([
              "evidence/philosophy-2026-source-2026-09-20.pdf",
            ]),
          },
          review: {
            actorType: "HUMAN",
            actorId: "curriculum-reviewer",
            decision: "APPROVED",
            reviewedAt: "2026-09-20T10:15:00Z",
          },
        }
      : null,
    previousStaleTransition,
  };
}

function d6Result(currentState, overrides = {}) {
  return {
    sourceId: currentState.sourceId,
    packageKey: currentState.packageKey,
    previousStatus: currentState.status,
    nextStatus: currentState.status,
    transitionApplied: false,
    requiresHumanReview: false,
    reason: "SOURCE_UNCHANGED",
    detection: {
      sourceId: currentState.sourceId,
      baselineSnapshotId: "snapshot-baseline",
      baselineSourceVersion: currentState.sourceVersion,
      observedSourceVersion: currentState.sourceVersion,
      observedAt: "2026-09-20T10:00:00Z",
      baselineContentHash: { algorithm: "sha256", value: "a".repeat(64) },
      observedContentHash: { algorithm: "sha256", value: "a".repeat(64) },
      classification: "UNCHANGED",
      contentChanged: false,
      versionChanged: false,
      requiresRevalidation: false,
    },
    staleTransition: {
      sourceId: currentState.sourceId,
      baselineSnapshotId: "snapshot-baseline",
      observedAt: "2026-09-20T10:00:00Z",
      classification: "UNCHANGED",
      previousStatus: currentState.status,
      nextStatus: currentState.status,
      transitionApplied: false,
      requiresHumanReview: false,
      reason: "SOURCE_UNCHANGED",
    },
    controlledTransition: null,
    evidence: null,
    ...overrides,
  };
}

function changedDetection(currentState, overrides = {}) {
  return {
    ...d6Result(currentState).detection,
    observedContentHash: { algorithm: "sha256", value: "b".repeat(64) },
    classification: "CONTENT_CHANGED",
    contentChanged: true,
    requiresRevalidation: true,
    ...overrides,
  };
}

function approvedD6Result(currentState, detection) {
  const evidence = Object.freeze({
    sourceId: currentState.sourceId,
    packageKey: currentState.packageKey,
    previousSnapshotId: detection.baselineSnapshotId,
    replacementSnapshotId: "snapshot-revalidated",
    sourceVersion: detection.observedSourceVersion,
    sourceContentHash: detection.observedContentHash,
    classification: detection.classification,
    revalidatedAt: "2026-09-20T10:05:00Z",
    verificationMethod: "human-review",
    evidenceReferences: Object.freeze(["evidence/revalidation-record.json"]),
    review: Object.freeze({
      actorType: "HUMAN",
      actorId: "curriculum-reviewer",
      decision: "APPROVED",
      reviewedAt: "2026-09-20T10:10:00Z",
    }),
  });
  const controlledTransition = Object.freeze({
    sourceId: currentState.sourceId,
    packageKey: currentState.packageKey,
    previousStatus: "STALE",
    nextStatus: "VERIFIED",
    transitionApplied: true,
    requiresHumanReview: false,
    evidence,
    reason: "REVALIDATION_APPROVED",
  });
  return d6Result(currentState, {
    nextStatus: "VERIFIED",
    transitionApplied: true,
    reason: "REVALIDATION_APPROVED",
    detection,
    staleTransition: {
      sourceId: currentState.sourceId,
      baselineSnapshotId: detection.baselineSnapshotId,
      observedAt: detection.observedAt,
      classification: detection.classification,
      previousStatus: "VERIFIED",
      nextStatus: "STALE",
      transitionApplied: true,
      requiresHumanReview: true,
      reason: "SOURCE_CHANGE_REQUIRES_REVALIDATION",
    },
    controlledTransition,
    evidence,
  });
}

test("ACTIVE ve VERIFIED manifest runtime için hazırdır", () => {
  const state = createCurriculumRuntimeVerificationState(
    philosophy2026Package.manifest,
  );
  assert.deepEqual(evaluateCurriculumRuntimeEligibility(
    philosophy2026Package.manifest,
    state,
  ), {
    packageKey: "philosophy@2026.1",
    eligible: true,
    status: "VERIFIED",
    reason: "READY",
  });
});

test("manifest kaynağı registry içinde aynı paket ve sürüme bağlı olmalıdır", () => {
  const manifest = {
    ...philosophy2026Package.manifest,
    verification: {
      ...philosophy2026Package.manifest.verification,
      sourceId: "meb:sociology:2026",
    },
  };
  assert.throws(
    () => createCurriculumRuntimeVerificationState(manifest),
    /Runtime doğrulama başlangıç durumu manifest kimliğiyle eşleşmiyor/u,
  );
});

test("VERIFIED manifest kanonik doğrulama kanıtı olmadan güvenilir durum üretemez", () => {
  const manifest = {
    ...sociology2026Package.manifest,
    verification: {
      ...sociology2026Package.manifest.verification,
      status: "VERIFIED",
    },
  };
  assert.throws(
    () => createCurriculumRuntimeVerificationState(manifest),
    /doğrulama kaydı eksik/u,
  );
});

test("ARCHIVED paket doğrulanmış olsa da runtime üretimine açılamaz", () => {
  const state = createCurriculumRuntimeVerificationState(
    philosophy2024Package.manifest,
  );
  const eligibility = evaluateCurriculumRuntimeEligibility(
    philosophy2024Package.manifest,
    state,
  );
  assert.equal(eligibility.eligible, false);
  assert.equal(eligibility.reason, "INACTIVE_LIFECYCLE");
});

test("güvenilir durum manifestin ilk yaşam döngüsüne bağlı kalır", () => {
  const archived = philosophy2024Package.manifest;
  const archivedState = createCurriculumRuntimeVerificationState(archived);
  assert.equal(evaluateCurriculumRuntimeEligibility(
    { ...archived, lifecycle: "ACTIVE" }, archivedState,
  ).reason, "STATE_MISMATCH");

  const active = philosophy2026Package.manifest;
  const activeState = createCurriculumRuntimeVerificationState(active);
  assert.equal(evaluateCurriculumRuntimeEligibility(
    { ...active, lifecycle: "ARCHIVED" }, activeState,
  ).reason, "STATE_MISMATCH");
});

test("UNVERIFIED paket incelemeye açık kalırken runtime üretimine kapalıdır", () => {
  const state = createCurriculumRuntimeVerificationState(
    sociology2026Package.manifest,
  );
  const eligibility = evaluateCurriculumRuntimeEligibility(
    sociology2026Package.manifest,
    state,
  );
  assert.equal(eligibility.eligible, false);
  assert.equal(eligibility.reason, "UNVERIFIED");
});

test("D6 STALE sonucu manifest VERIFIED olsa bile etkin duruma sahip olur", () => {
  const initial = createCurriculumRuntimeVerificationState(
    philosophy2026Package.manifest,
  );
  const stale = applySourceRevalidationResult(initial, d6Result(initial, {
    nextStatus: "STALE",
    transitionApplied: true,
    requiresHumanReview: true,
    reason: "AWAITING_HUMAN_REVIEW",
    detection: changedDetection(initial),
  }));
  const eligibility = evaluateCurriculumRuntimeEligibility(
    philosophy2026Package.manifest,
    stale,
  );
  assert.equal(stale.provenance, "REVALIDATION");
  assert.equal(eligibility.eligible, false);
  assert.equal(eligibility.reason, "STALE");
});

test("STALE durum yalnız sıralı D6 onayıyla VERIFIED olabilir", () => {
  const initial = createCurriculumRuntimeVerificationState(
    philosophy2026Package.manifest,
  );
  const detection = changedDetection(initial);
  const stale = applySourceRevalidationResult(initial, d6Result(initial, {
    nextStatus: "STALE",
    transitionApplied: true,
    requiresHumanReview: true,
    reason: "AWAITING_HUMAN_REVIEW",
    detection,
  }));
  const verified = applySourceRevalidationResult(
    stale,
    approvedD6Result(stale, detection),
  );
  assert.equal(
    evaluateCurriculumRuntimeEligibility(
      philosophy2026Package.manifest,
      verified,
    ).reason,
    "READY",
  );
});

test("gerçek D5/D6 onayı eşdeğer kanıt kopyasıyla runtime durumuna uygulanır", () => {
  const initial = createCurriculumRuntimeVerificationState(
    philosophy2026Package.manifest,
  );
  const pendingResult = orchestrateSourceRevalidation(
    genuineD6Input("VERIFIED"),
  );
  const stale = applySourceRevalidationResult(initial, pendingResult);
  const approvedResult = orchestrateSourceRevalidation(
    genuineD6Input("STALE", pendingResult.staleTransition),
  );

  assert.notEqual(
    approvedResult.evidence,
    approvedResult.controlledTransition.evidence,
  );
  const verified = applySourceRevalidationResult(stale, approvedResult);
  assert.equal(
    evaluateCurriculumRuntimeEligibility(
      philosophy2026Package.manifest,
      verified,
    ).reason,
    "READY",
  );
});

test("kontrollü geçişle değerleri uyuşmayan onay kanıtı reddedilir", () => {
  const initial = createCurriculumRuntimeVerificationState(
    philosophy2026Package.manifest,
  );
  const pendingResult = orchestrateSourceRevalidation(
    genuineD6Input("VERIFIED"),
  );
  const stale = applySourceRevalidationResult(initial, pendingResult);
  const approvedResult = orchestrateSourceRevalidation(
    genuineD6Input("STALE", pendingResult.staleTransition),
  );
  const mismatchedTransitionEvidence = {
    ...approvedResult.controlledTransition.evidence,
    review: {
      ...approvedResult.controlledTransition.evidence.review,
      actorId: "different-reviewer",
    },
  };

  assert.throws(
    () => applySourceRevalidationResult(stale, {
      ...approvedResult,
      controlledTransition: {
        ...approvedResult.controlledTransition,
        evidence: mismatchedTransitionEvidence,
      },
    }),
    /güncel runtime doğrulama durumuyla eşleşmiyor/u,
  );
});

test("runtime state doğrulanmış onay kanıtını derin kopyalayıp dondurur", () => {
  const initial = createCurriculumRuntimeVerificationState(
    philosophy2026Package.manifest,
  );
  const detection = changedDetection(initial);
  const stale = applySourceRevalidationResult(initial, d6Result(initial, {
    nextStatus: "STALE",
    transitionApplied: true,
    requiresHumanReview: true,
    reason: "AWAITING_HUMAN_REVIEW",
    detection,
  }));
  const approved = approvedD6Result(stale, detection);
  const evidence = {
    ...approved.evidence,
    sourceContentHash: { ...approved.evidence.sourceContentHash },
    evidenceReferences: [...approved.evidence.evidenceReferences],
    review: { ...approved.evidence.review },
  };
  const verified = applySourceRevalidationResult(stale, {
    ...approved,
    evidence,
    controlledTransition: {
      ...approved.controlledTransition,
      evidence,
    },
  });

  evidence.review.actorId = "";
  evidence.verificationMethod = "";
  evidence.replacementSnapshotId = "";
  evidence.sourceContentHash.value = "c".repeat(64);
  evidence.evidenceReferences[0] = "";

  assert.notEqual(verified.approvalEvidence, evidence);
  assert.equal(verified.approvalEvidence.review.actorId, "curriculum-reviewer");
  assert.equal(verified.approvalEvidence.verificationMethod, "human-review");
  assert.equal(verified.approvalEvidence.replacementSnapshotId, "snapshot-revalidated");
  assert.equal(verified.approvalEvidence.sourceContentHash.value, "b".repeat(64));
  assert.deepEqual(verified.approvalEvidence.evidenceReferences, [
    "evidence/revalidation-record.json",
  ]);
  assert.equal(Object.isFrozen(verified.approvalEvidence), true);
  assert.equal(Object.isFrozen(verified.approvalEvidence.sourceContentHash), true);
  assert.equal(Object.isFrozen(verified.approvalEvidence.evidenceReferences), true);
  assert.equal(Object.isFrozen(verified.approvalEvidence.review), true);
  assert.equal(
    evaluateCurriculumRuntimeEligibility(
      philosophy2026Package.manifest,
      verified,
    ).reason,
    "READY",
  );
});

test("onaylanan gözlem watermark'ı eski değişiklik ve onay tekrarını reddeder", () => {
  const initial = createCurriculumRuntimeVerificationState(
    philosophy2026Package.manifest,
  );
  const changeA = changedDetection(initial, {
    observedAt: "2026-09-20T09:00:00Z",
  });
  const pendingA = applySourceRevalidationResult(initial, d6Result(initial, {
    nextStatus: "STALE",
    transitionApplied: true,
    requiresHumanReview: true,
    reason: "AWAITING_HUMAN_REVIEW",
    detection: changeA,
  }));
  const changeB = changedDetection(pendingA, {
    observedAt: "2026-09-20T10:00:00Z",
    observedContentHash: { algorithm: "sha256", value: "c".repeat(64) },
  });
  const pendingB = applySourceRevalidationResult(pendingA, d6Result(pendingA, {
    requiresHumanReview: true,
    reason: "STATUS_NOT_ELIGIBLE",
    detection: changeB,
  }));
  const verifiedB = applySourceRevalidationResult(
    pendingB,
    approvedD6Result(pendingB, changeB),
  );

  assert.throws(
    () => applySourceRevalidationResult(verifiedB, d6Result(verifiedB, {
      nextStatus: "STALE",
      transitionApplied: true,
      requiresHumanReview: true,
      reason: "AWAITING_HUMAN_REVIEW",
      detection: changeA,
    })),
    /güncel runtime doğrulama durumuyla eşleşmiyor/u,
  );
  assert.throws(
    () => applySourceRevalidationResult(
      verifiedB,
      approvedD6Result(verifiedB, changeA),
    ),
    /güncel runtime doğrulama durumuyla eşleşmiyor/u,
  );

  const nextChange = changedDetection(verifiedB, {
    baselineSnapshotId: "snapshot-revalidated",
    baselineContentHash: { algorithm: "sha256", value: "c".repeat(64) },
    observedContentHash: { algorithm: "sha256", value: "d".repeat(64) },
    observedAt: "2026-09-20T11:00:00Z",
  });
  const nextPending = applySourceRevalidationResult(verifiedB, d6Result(verifiedB, {
    nextStatus: "STALE",
    transitionApplied: true,
    requiresHumanReview: true,
    reason: "AWAITING_HUMAN_REVIEW",
    detection: nextChange,
  }));
  assert.equal(nextPending.pendingObservation.baselineSnapshotId, "snapshot-revalidated");
  assert.equal(nextPending.pendingObservation.observedContentHash.value, "d".repeat(64));
});

test("replacement snapshot sonrası gözlem attestation tamamlanmadan ilerleyebilir", () => {
  const initial = createCurriculumRuntimeVerificationState(
    philosophy2026Package.manifest,
  );
  const pendingResult = orchestrateSourceRevalidation(
    genuineD6Input("VERIFIED"),
  );
  const stale = applySourceRevalidationResult(initial, pendingResult);
  const approvedResult = orchestrateSourceRevalidation(
    genuineD6Input("STALE", pendingResult.staleTransition),
  );
  const verified = applySourceRevalidationResult(stale, approvedResult);
  const nextDetection = changedDetection(verified, {
    baselineSnapshotId: approvedResult.evidence.replacementSnapshotId,
    baselineContentHash: approvedResult.evidence.sourceContentHash,
    observedContentHash: { algorithm: "sha256", value: "c".repeat(64) },
    observedAt: "2026-09-20T10:07:00Z",
  });
  const nextPending = applySourceRevalidationResult(verified, d6Result(verified, {
    nextStatus: "STALE",
    transitionApplied: true,
    requiresHumanReview: true,
    reason: "AWAITING_HUMAN_REVIEW",
    detection: nextDetection,
  }));

  assert.equal(approvedResult.evidence.revalidatedAt, "2026-09-20T10:10:00Z");
  assert.equal(verified.approvedObservationAt, "2026-09-20T10:00:00Z");
  assert.equal(nextPending.status, "STALE");
  assert.equal(nextPending.pendingObservation.observedAt, "2026-09-20T10:07:00Z");
});

test("bekleyen yeni gözlem son onaylanan snapshot bağını korur", () => {
  const initial = createCurriculumRuntimeVerificationState(philosophy2026Package.manifest);
  const first = changedDetection(initial);
  const stale = applySourceRevalidationResult(initial, d6Result(initial, {
    nextStatus: "STALE", transitionApplied: true, requiresHumanReview: true,
    reason: "AWAITING_HUMAN_REVIEW", detection: first,
  }));
  const verified = applySourceRevalidationResult(stale, approvedD6Result(stale, first));
  const next = changedDetection(verified, {
    baselineSnapshotId: "snapshot-revalidated",
    baselineContentHash: first.observedContentHash,
    observedContentHash: { algorithm: "sha256", value: "c".repeat(64) },
    observedAt: "2026-09-20T11:00:00Z",
  });
  const pending = applySourceRevalidationResult(verified, d6Result(verified, {
    nextStatus: "STALE", transitionApplied: true, requiresHumanReview: true,
    reason: "AWAITING_HUMAN_REVIEW", detection: next,
  }));
  assert.equal(pending.approvalEvidence.replacementSnapshotId, "snapshot-revalidated");
  const olderBaseline = changedDetection(pending, {
    observedAt: "2026-09-20T12:00:00Z",
    observedContentHash: { algorithm: "sha256", value: "d".repeat(64) },
  });
  assert.throws(() => applySourceRevalidationResult(pending, d6Result(pending, {
    requiresHumanReview: true, reason: "STATUS_NOT_ELIGIBLE",
    detection: olderBaseline,
  })), /güncel runtime doğrulama durumuyla eşleşmiyor/u);
});

test("onay kanıtı zamanları açık UTC offset olmadan READY üretemez", () => {
  const initial = createCurriculumRuntimeVerificationState(
    philosophy2026Package.manifest,
  );
  const detection = changedDetection(initial);
  const stale = applySourceRevalidationResult(initial, d6Result(initial, {
    nextStatus: "STALE",
    transitionApplied: true,
    requiresHumanReview: true,
    reason: "AWAITING_HUMAN_REVIEW",
    detection,
  }));
  const approved = approvedD6Result(stale, detection);

  for (const evidenceOverrides of [
    {
      revalidatedAt: "2026-09-21",
      review: { ...approved.evidence.review, reviewedAt: "2026-09-21T01:00:00Z" },
    },
    {
      review: { ...approved.evidence.review, reviewedAt: "2026-09-21" },
    },
  ]) {
    const evidence = {
      ...approved.evidence,
      ...evidenceOverrides,
    };
    assert.throws(
      () => applySourceRevalidationResult(stale, {
        ...approved,
        evidence,
        controlledTransition: {
          ...approved.controlledTransition,
          evidence,
        },
      }),
      /güncel runtime doğrulama durumuyla eşleşmiyor/u,
    );
  }
});

test("yeni kaynak sürümü mevcut paketi VERIFIED görünse bile kapatır", () => {
  const initial = createCurriculumRuntimeVerificationState(
    philosophy2026Package.manifest,
  );
  const nextPackageRequired = applySourceRevalidationResult(initial, d6Result(initial, {
    nextStatus: "STALE",
    transitionApplied: true,
    requiresHumanReview: true,
    reason: "NEW_PACKAGE_REQUIRED",
    detection: {
      ...d6Result(initial).detection,
      observedSourceVersion: "2026.2",
      classification: "VERSION_CHANGED",
      versionChanged: true,
      requiresRevalidation: true,
    },
  }));
  assert.equal(
    evaluateCurriculumRuntimeEligibility(
      philosophy2026Package.manifest,
      nextPackageRequired,
    ).reason,
    "NEW_PACKAGE_REQUIRED",
  );
});

test("NEW_PACKAGE_REQUIRED aynı paket için terminal kalır", () => {
  const initial = createCurriculumRuntimeVerificationState(
    philosophy2026Package.manifest,
  );
  const versionChange = {
    ...d6Result(initial).detection,
    observedSourceVersion: "2026.2",
    classification: "VERSION_CHANGED",
    versionChanged: true,
    requiresRevalidation: true,
  };
  const terminal = applySourceRevalidationResult(initial, d6Result(initial, {
    nextStatus: "STALE",
    transitionApplied: true,
    requiresHumanReview: true,
    reason: "NEW_PACKAGE_REQUIRED",
    detection: versionChange,
  }));
  const laterContentChange = changedDetection(terminal, {
    observedAt: "2026-09-20T11:00:00Z",
  });

  assert.throws(
    () => applySourceRevalidationResult(terminal, d6Result(terminal, {
      requiresHumanReview: true,
      reason: "STATUS_NOT_ELIGIBLE",
      detection: laterContentChange,
    })),
    /güncel runtime doğrulama durumuyla eşleşmiyor/u,
  );
  assert.throws(
    () => applySourceRevalidationResult(
      terminal,
      approvedD6Result(terminal, laterContentChange),
    ),
    /güncel runtime doğrulama durumuyla eşleşmiyor/u,
  );
  assert.equal(
    evaluateCurriculumRuntimeEligibility(
      philosophy2026Package.manifest,
      terminal,
    ).reason,
    "NEW_PACKAGE_REQUIRED",
  );
});

test("sürüm değişikliği inceleme bekleyen veya uygun olmayan sonuca dönüşemez", () => {
  const initial = createCurriculumRuntimeVerificationState(philosophy2026Package.manifest);
  const changedVersion = {
    ...d6Result(initial).detection,
    observedSourceVersion: "2026.2", classification: "VERSION_CHANGED",
    versionChanged: true, requiresRevalidation: true,
  };
  assert.throws(() => applySourceRevalidationResult(initial, d6Result(initial, {
    nextStatus: "STALE", transitionApplied: true, requiresHumanReview: true,
    reason: "AWAITING_HUMAN_REVIEW", detection: changedVersion,
  })), /güncel runtime doğrulama durumuyla eşleşmiyor/u);

  const contentChange = changedDetection(initial);
  const stale = applySourceRevalidationResult(initial, d6Result(initial, {
    nextStatus: "STALE", transitionApplied: true, requiresHumanReview: true,
    reason: "AWAITING_HUMAN_REVIEW", detection: contentChange,
  }));
  assert.throws(() => applySourceRevalidationResult(stale, d6Result(stale, {
    requiresHumanReview: true, reason: "STATUS_NOT_ELIGIBLE",
    detection: changedVersion,
  })), /güncel runtime doğrulama durumuyla eşleşmiyor/u);
});

test("D6 detection geçersiz kaynak primitive'leriyle runtime durumu üretemez", () => {
  const initial = createCurriculumRuntimeVerificationState(
    philosophy2026Package.manifest,
  );
  const valid = changedDetection(initial);
  for (const detection of [
    { ...valid, baselineSnapshotId: "   " },
    {
      ...valid,
      baselineContentHash: { algorithm: "sha256", value: "a" },
    },
    {
      ...valid,
      observedContentHash: { algorithm: "sha256", value: "b" },
    },
    { ...valid, observedAt: "2026-09-20T10:00:00" },
    { ...valid, baselineSourceVersion: "2026" },
    { ...valid, observedSourceVersion: "2026" },
  ]) {
    assert.throws(
      () => applySourceRevalidationResult(initial, d6Result(initial, {
        nextStatus: "STALE",
        transitionApplied: true,
        requiresHumanReview: true,
        reason: "AWAITING_HUMAN_REVIEW",
        detection,
      })),
      /güncel runtime doğrulama durumuyla eşleşmiyor/u,
    );
  }
});

test("yanlış paket, kaynak, sürüm veya sıra taşıyan D6 sonucu reddedilir", () => {
  const initial = createCurriculumRuntimeVerificationState(
    philosophy2026Package.manifest,
  );
  for (const mutation of [
    { packageKey: "sociology@2026.1" },
    { sourceId: "meb:philosophy:2024" },
    { previousStatus: "STALE" },
    {
      detection: {
        ...d6Result(initial).detection,
        baselineSourceVersion: "2024.1",
      },
    },
  ]) {
    assert.throws(
      () => applySourceRevalidationResult(
        initial,
        d6Result(initial, mutation),
      ),
      /güncel runtime doğrulama durumuyla eşleşmiyor/u,
    );
  }
});

test("D6 gerekçesiyle çelişen durum veya kanıt yükseltmesi reddedilir", () => {
  const initial = createCurriculumRuntimeVerificationState(
    philosophy2026Package.manifest,
  );
  for (const mutation of [
    { reason: "REVALIDATION_APPROVED", nextStatus: "VERIFIED", evidence: null },
    { reason: "SOURCE_UNCHANGED", nextStatus: "STALE" },
    { reason: "NEW_PACKAGE_REQUIRED", nextStatus: "VERIFIED", requiresHumanReview: true },
  ]) {
    assert.throws(
      () => applySourceRevalidationResult(initial, d6Result(initial, mutation)),
      /güncel runtime doğrulama durumuyla eşleşmiyor/u,
    );
  }
});

test("SOURCE_UNCHANGED çelişkili sürüm, hash ve sınıflandırmayı kabul etmez", () => {
  const initial = createCurriculumRuntimeVerificationState(
    philosophy2026Package.manifest,
  );
  const unchanged = d6Result(initial).detection;
  for (const detection of [
    { ...unchanged, observedSourceVersion: "2026.2" },
    {
      ...unchanged,
      observedContentHash: { algorithm: "sha256", value: "b".repeat(64) },
    },
    { ...unchanged, classification: "CONTENT_CHANGED" },
    { ...unchanged, contentChanged: true },
    { ...unchanged, versionChanged: true },
  ]) {
    assert.throws(
      () => applySourceRevalidationResult(
        initial,
        d6Result(initial, { detection }),
      ),
      /güncel runtime doğrulama durumuyla eşleşmiyor/u,
    );
  }
});

test("değişiklik sonucu çelişkili detection alanlarıyla bekleyen gözlem üretemez", () => {
  const initial = createCurriculumRuntimeVerificationState(
    philosophy2026Package.manifest,
  );
  const changed = changedDetection(initial);
  for (const detection of [
    {
      ...changed,
      observedContentHash: changed.baselineContentHash,
    },
    { ...changed, classification: "UNCHANGED" },
    { ...changed, contentChanged: false },
    {
      ...changed,
      observedSourceVersion: "2026.2",
      classification: "CONTENT_CHANGED",
      versionChanged: false,
    },
  ]) {
    assert.throws(
      () => applySourceRevalidationResult(initial, d6Result(initial, {
        nextStatus: "STALE",
        transitionApplied: true,
        requiresHumanReview: true,
        reason: "AWAITING_HUMAN_REVIEW",
        detection,
      })),
      /güncel runtime doğrulama durumuyla eşleşmiyor/u,
    );
  }
});

test("onay kanıtı boş replacement snapshot kimliğiyle READY üretemez", () => {
  const initial = createCurriculumRuntimeVerificationState(
    philosophy2026Package.manifest,
  );
  const detection = changedDetection(initial);
  const stale = applySourceRevalidationResult(initial, d6Result(initial, {
    nextStatus: "STALE",
    transitionApplied: true,
    requiresHumanReview: true,
    reason: "AWAITING_HUMAN_REVIEW",
    detection,
  }));
  const approved = approvedD6Result(stale, detection);
  const evidence = Object.freeze({
    ...approved.evidence,
    replacementSnapshotId: "",
  });
  assert.throws(
    () => applySourceRevalidationResult(stale, {
      ...approved,
      evidence,
      controlledTransition: Object.freeze({
        ...approved.controlledTransition,
        evidence,
      }),
    }),
    /güncel runtime doğrulama durumuyla eşleşmiyor/u,
  );
});

test("onay kanıtı boş insan kimliği veya doğrulama yöntemiyle READY üretemez", () => {
  const initial = createCurriculumRuntimeVerificationState(
    philosophy2026Package.manifest,
  );
  const detection = changedDetection(initial);
  const stale = applySourceRevalidationResult(initial, d6Result(initial, {
    nextStatus: "STALE",
    transitionApplied: true,
    requiresHumanReview: true,
    reason: "AWAITING_HUMAN_REVIEW",
    detection,
  }));
  const approved = approvedD6Result(stale, detection);
  for (const evidenceOverrides of [
    { review: Object.freeze({ ...approved.evidence.review, actorId: "   " }) },
    { verificationMethod: "   " },
  ]) {
    const evidence = Object.freeze({
      ...approved.evidence,
      ...evidenceOverrides,
    });
    assert.throws(
      () => applySourceRevalidationResult(stale, {
        ...approved,
        evidence,
        controlledTransition: Object.freeze({
          ...approved.controlledTransition,
          evidence,
        }),
      }),
      /güncel runtime doğrulama durumuyla eşleşmiyor/u,
    );
  }
});

test("UNVERIFIED veya REJECTED durum doğrudan onayla VERIFIED yapılamaz", () => {
  for (const status of ["UNVERIFIED", "REJECTED"]) {
    const manifest = {
      ...philosophy2026Package.manifest,
      verification: {
        ...philosophy2026Package.manifest.verification,
        status,
        verifiedAt: status === "UNVERIFIED"
          ? null
          : philosophy2026Package.manifest.verification.verifiedAt,
        verificationMethod: status === "UNVERIFIED"
          ? null
          : philosophy2026Package.manifest.verification.verificationMethod,
      },
    };
    const state = createCurriculumRuntimeVerificationState(manifest);
    assert.throws(
      () => applySourceRevalidationResult(state, d6Result(state, {
        nextStatus: "VERIFIED",
        reason: "REVALIDATION_APPROVED",
        detection: changedDetection(state),
        evidence: { approved: true },
      })),
      /güncel runtime doğrulama durumuyla eşleşmiyor/u,
    );
  }
});

test("kaynak sürümü değişen sonuç mevcut paketi VERIFIED tutamaz", () => {
  const state = createCurriculumRuntimeVerificationState(
    philosophy2026Package.manifest,
  );
  assert.throws(
    () => applySourceRevalidationResult(state, d6Result(state, {
      nextStatus: "VERIFIED",
      reason: "REVALIDATION_APPROVED",
      detection: changedDetection(state, {
        observedSourceVersion: "2026.2",
        classification: "VERSION_CHANGED",
        contentChanged: false,
        versionChanged: true,
      }),
      evidence: { approved: true },
    })),
    /güncel runtime doğrulama durumuyla eşleşmiyor/u,
  );
});

test("eski gözleme ait onay daha yeni bekleyen gözlemi doğrulayamaz", () => {
  const initial = createCurriculumRuntimeVerificationState(
    philosophy2026Package.manifest,
  );
  const changeA = changedDetection(initial, {
    observedAt: "2026-09-20T10:00:00Z",
  });
  const pendingA = applySourceRevalidationResult(initial, d6Result(initial, {
    nextStatus: "STALE",
    transitionApplied: true,
    requiresHumanReview: true,
    reason: "AWAITING_HUMAN_REVIEW",
    detection: changeA,
  }));
  const changeB = {
    ...changeA,
    observedAt: "2026-09-20T11:00:00Z",
    observedContentHash: { algorithm: "sha256", value: "c".repeat(64) },
  };
  const pendingB = applySourceRevalidationResult(pendingA, d6Result(pendingA, {
    requiresHumanReview: true,
    reason: "STATUS_NOT_ELIGIBLE",
    detection: changeB,
  }));
  assert.equal(pendingB.pendingObservation.observedContentHash.value, "c".repeat(64));
  assert.throws(
    () => applySourceRevalidationResult(pendingB, d6Result(pendingB, {
      requiresHumanReview: true,
      reason: "STATUS_NOT_ELIGIBLE",
      detection: changeA,
    })),
    /güncel runtime doğrulama durumuyla eşleşmiyor/u,
  );
  assert.throws(
    () => applySourceRevalidationResult(pendingB, d6Result(pendingB, {
      nextStatus: "VERIFIED",
      transitionApplied: true,
      reason: "REVALIDATION_APPROVED",
      detection: changeA,
      evidence: { approved: true },
    })),
    /güncel runtime doğrulama durumuyla eşleşmiyor/u,
  );
});

test("REJECTED etkin durum runtime üretimine kapalıdır", () => {
  const manifest = {
    ...philosophy2026Package.manifest,
    verification: {
      ...philosophy2026Package.manifest.verification,
      status: "REJECTED",
    },
  };
  const rejected = createCurriculumRuntimeVerificationState(manifest);
  const eligibility = evaluateCurriculumRuntimeEligibility(manifest, rejected);
  assert.equal(eligibility.eligible, false);
  assert.equal(eligibility.reason, "REJECTED");
});

test("manifest ile eşleşmeyen runtime durumu fail-closed davranır", () => {
  const state = createCurriculumRuntimeVerificationState(
    philosophy2026Package.manifest,
  );
  const eligibility = evaluateCurriculumRuntimeEligibility(
    philosophy2026Package.manifest,
    { ...state, packageKey: "philosophy@2024.1" },
  );
  assert.equal(eligibility.eligible, false);
  assert.equal(eligibility.status, null);
  assert.equal(eligibility.reason, "STATE_MISMATCH");
});

test("MANIFEST kökenli durum manifest statüsünü veya reason alanını taklit edemez", () => {
  const state = createCurriculumRuntimeVerificationState(
    sociology2026Package.manifest,
  );
  for (const forged of [
    { ...state, status: "VERIFIED" },
    { ...state, reason: "REVALIDATION_APPROVED" },
    {
      ...state,
      pendingObservation: {
        sourceId: state.sourceId,
        baselineSnapshotId: "forged",
        observedAt: "2026-09-20T10:00:00Z",
        observedSourceVersion: state.sourceVersion,
        observedContentHash: { algorithm: "sha256", value: "a".repeat(64) },
      },
    },
  ]) {
    const eligibility = evaluateCurriculumRuntimeEligibility(
      sociology2026Package.manifest,
      forged,
    );
    assert.equal(eligibility.eligible, false);
    assert.equal(eligibility.reason, "STATE_MISMATCH");
  }
});

test("bekleyen gözlem SOURCE_UNCHANGED gerekçesiyle sahte VERIFIED durum üretemez", () => {
  const state = createCurriculumRuntimeVerificationState(
    sociology2026Package.manifest,
  );
  const eligibility = evaluateCurriculumRuntimeEligibility(
    sociology2026Package.manifest,
    {
      ...state,
      provenance: "REVALIDATION",
      status: "VERIFIED",
      reason: "SOURCE_UNCHANGED",
      pendingObservation: {
        sourceId: state.sourceId,
        baselineSnapshotId: "forged",
        observedAt: "2026-09-20T10:00:00Z",
        observedSourceVersion: state.sourceVersion,
        observedContentHash: { algorithm: "sha256", value: "a".repeat(64) },
      },
    },
  );
  assert.equal(eligibility.eligible, false);
  assert.equal(eligibility.reason, "STATE_MISMATCH");
});

test("UNVERIFIED manifest sahte REVALIDATION_APPROVED durumuyla açılamaz", () => {
  const state = createCurriculumRuntimeVerificationState(
    sociology2026Package.manifest,
  );
  const eligibility = evaluateCurriculumRuntimeEligibility(
    sociology2026Package.manifest,
    {
      ...state,
      provenance: "REVALIDATION",
      status: "VERIFIED",
      reason: "REVALIDATION_APPROVED",
    },
  );
  assert.equal(eligibility.eligible, false);
  assert.equal(eligibility.reason, "STATE_MISMATCH");
});

test("STALE manifest geçerli yeniden doğrulama onayıyla READY olabilir", () => {
  const manifest = {
    ...philosophy2026Package.manifest,
    verification: {
      ...philosophy2026Package.manifest.verification,
      status: "STALE",
    },
  };
  const initial = createCurriculumRuntimeVerificationState(manifest);
  const detection = changedDetection(initial);
  const pending = applySourceRevalidationResult(initial, d6Result(initial, {
    requiresHumanReview: true,
    reason: "STATUS_NOT_ELIGIBLE",
    detection,
  }));
  const verified = applySourceRevalidationResult(
    pending,
    approvedD6Result(pending, detection),
  );
  assert.equal(
    evaluateCurriculumRuntimeEligibility(manifest, verified).reason,
    "READY",
  );
});

test("runtime durumu ve uygunluk sonuçları immutable kalır", () => {
  const state = createCurriculumRuntimeVerificationState(
    philosophy2026Package.manifest,
  );
  const eligibility = evaluateCurriculumRuntimeEligibility(
    philosophy2026Package.manifest,
    state,
  );
  assert.equal(Object.isFrozen(state), true);
  assert.equal(Object.isFrozen(eligibility), true);
  assert.throws(() => {
    state.status = "STALE";
  }, TypeError);
});

test("STALE manifestten elle oluşturulan onay durumu fail-closed kalır", () => {
  const manifest = {
    ...philosophy2026Package.manifest,
    verification: {
      ...philosophy2026Package.manifest.verification,
      status: "STALE",
    },
  };
  const state = createCurriculumRuntimeVerificationState(manifest);
  const forged = {
    ...state,
    provenance: "REVALIDATION",
    status: "VERIFIED",
    reason: "REVALIDATION_APPROVED",
  };
  assert.equal(
    evaluateCurriculumRuntimeEligibility(manifest, forged).reason,
    "STATE_MISMATCH",
  );
});

test("runtime state JSON round-trip sonrasında güvenini yeniden kullanamaz", () => {
  const state = createCurriculumRuntimeVerificationState(
    philosophy2026Package.manifest,
  );
  const restored = JSON.parse(JSON.stringify(state));
  assert.equal(
    evaluateCurriculumRuntimeEligibility(
      philosophy2026Package.manifest,
      restored,
    ).reason,
    "STATE_MISMATCH",
  );
  assert.throws(
    () => applySourceRevalidationResult(restored, d6Result(restored)),
    /güncel runtime doğrulama durumuyla eşleşmiyor/u,
  );
});
