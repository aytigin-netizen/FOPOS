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
  const stale = applySourceRevalidationResult(initial, d6Result(initial, {
    nextStatus: "STALE",
    transitionApplied: true,
    requiresHumanReview: true,
    reason: "AWAITING_HUMAN_REVIEW",
  }));
  const verified = applySourceRevalidationResult(stale, d6Result(stale, {
    nextStatus: "VERIFIED",
    transitionApplied: true,
    reason: "REVALIDATION_APPROVED",
    evidence: { approved: true },
  }));
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
