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

test("UNVERIFIED veya REJECTED durum doğrudan onayla VERIFIED yapılamaz", () => {
  for (const status of ["UNVERIFIED", "REJECTED"]) {
    const manifest = {
      ...philosophy2026Package.manifest,
      verification: {
        ...philosophy2026Package.manifest.verification,
        status,
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
