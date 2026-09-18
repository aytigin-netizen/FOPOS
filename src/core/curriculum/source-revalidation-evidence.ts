import {
  validateOfficialSourceSnapshot,
  validatePackageSourceAttestation,
} from "./source-registry.ts";
import { deriveSourceRevalidationTransition } from "./source-revalidation-transition.ts";
import type {
  ControlledSourceRevalidationTransitionResult,
  OfficialSourceSnapshot,
  PackageSourceAttestation,
  SourceChangeDetectionResult,
  SourceContentDigest,
  SourceRevalidationEvidence,
  SourceRevalidationReview,
  SourceRevalidationTransitionResult,
  SourceRevalidationTransitionStatus,
} from "./source-types.ts";

const EXPLICIT_OFFSET_TIMESTAMP =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/u;

function isExplicitOffsetTimestamp(value: string): boolean {
  return EXPLICIT_OFFSET_TIMESTAMP.test(value) && !Number.isNaN(Date.parse(value));
}

function cloneDigest(digest: SourceContentDigest): SourceContentDigest {
  return Object.freeze({ ...digest });
}

function cloneReview(review: SourceRevalidationReview): SourceRevalidationReview {
  return Object.freeze({ ...review });
}

function freezeEvidence(
  evidence: SourceRevalidationEvidence,
): SourceRevalidationEvidence {
  return Object.freeze({
    ...evidence,
    sourceContentHash: cloneDigest(evidence.sourceContentHash),
    evidenceReferences: Object.freeze([...evidence.evidenceReferences]),
    review: cloneReview(evidence.review),
  });
}

function assertStaleTransition(
  detection: SourceChangeDetectionResult,
  transition: SourceRevalidationTransitionResult,
): void {
  const expected = deriveSourceRevalidationTransition({
    currentStatus: "VERIFIED",
    detection,
  });
  if (
    expected.previousStatus !== "VERIFIED" ||
    expected.nextStatus !== "STALE" ||
    !expected.transitionApplied ||
    !expected.requiresHumanReview ||
    transition.sourceId !== expected.sourceId ||
    transition.baselineSnapshotId !== expected.baselineSnapshotId ||
    transition.observedAt !== expected.observedAt ||
    transition.classification !== expected.classification ||
    transition.previousStatus !== expected.previousStatus ||
    transition.nextStatus !== expected.nextStatus ||
    transition.transitionApplied !== expected.transitionApplied ||
    transition.requiresHumanReview !== expected.requiresHumanReview ||
    transition.reason !== expected.reason
  ) {
    throw new Error("D5 yalnız doğrulanmış VERIFIED → STALE D4 geçişini kabul eder.");
  }
}

export type CreateSourceRevalidationEvidenceInput = {
  readonly detection: SourceChangeDetectionResult;
  readonly staleTransition: SourceRevalidationTransitionResult;
  readonly replacementSnapshot: OfficialSourceSnapshot;
  readonly replacementAttestation: PackageSourceAttestation;
  readonly review: SourceRevalidationReview;
};

export function createSourceRevalidationEvidence({
  detection,
  staleTransition,
  replacementSnapshot,
  replacementAttestation,
  review,
}: CreateSourceRevalidationEvidenceInput): SourceRevalidationEvidence {
  assertStaleTransition(detection, staleTransition);
  if (detection.versionChanged) {
    throw new Error("Kaynak sürümü değişti; mevcut paket için yeniden doğrulama kanıtı üretilemez.");
  }

  const snapshot = validateOfficialSourceSnapshot(replacementSnapshot);
  const attestation = validatePackageSourceAttestation(
    replacementAttestation,
    snapshot,
  );
  if (
    snapshot.sourceId !== detection.sourceId ||
    snapshot.sourceVersion !== detection.observedSourceVersion ||
    snapshot.contentHash.algorithm !== detection.observedContentHash.algorithm ||
    snapshot.contentHash.value !== detection.observedContentHash.value ||
    Date.parse(snapshot.retrievedAt) < Date.parse(detection.observedAt)
  ) {
    throw new Error("Yeniden doğrulama snapshot'ı D3 gözlemiyle eşleşmiyor.");
  }
  if (
    review.actorType !== "HUMAN" ||
    !review.actorId.trim() ||
    !isExplicitOffsetTimestamp(review.reviewedAt) ||
    Date.parse(review.reviewedAt) < Date.parse(attestation.verifiedAt)
  ) {
    throw new Error("Yeniden doğrulama insan incelemesi geçersiz.");
  }
  if (review.decision !== "APPROVED" && review.decision !== "REJECTED") {
    throw new Error("Yeniden doğrulama insan kararı geçersiz.");
  }

  return freezeEvidence({
    sourceId: snapshot.sourceId,
    packageKey: attestation.packageKey,
    previousSnapshotId: detection.baselineSnapshotId,
    replacementSnapshotId: snapshot.snapshotId,
    sourceVersion: snapshot.sourceVersion,
    sourceContentHash: cloneDigest(snapshot.contentHash),
    classification: detection.classification,
    revalidatedAt: attestation.verifiedAt,
    verificationMethod: attestation.verificationMethod,
    evidenceReferences: Object.freeze([...attestation.evidenceReferences]),
    review: cloneReview(review),
  });
}

export type DeriveControlledSourceRevalidationTransitionInput = {
  readonly packageKey: string;
  readonly currentStatus: SourceRevalidationTransitionStatus;
  readonly detection: SourceChangeDetectionResult;
  readonly staleTransition: SourceRevalidationTransitionResult;
  readonly evidence: SourceRevalidationEvidence | null;
};

export function deriveControlledSourceRevalidationTransition({
  packageKey,
  currentStatus,
  detection,
  staleTransition,
  evidence,
}: DeriveControlledSourceRevalidationTransitionInput): ControlledSourceRevalidationTransitionResult {
  assertStaleTransition(detection, staleTransition);
  if (!packageKey.trim()) {
    throw new Error("Kontrollü yeniden doğrulama paket anahtarı geçersiz.");
  }

  if (detection.versionChanged) {
    if (evidence !== null) {
      throw new Error("Yeni kaynak sürümü mevcut paket kanıtıyla ilişkilendirilemez.");
    }
    return Object.freeze({
      sourceId: detection.sourceId,
      packageKey,
      previousStatus: currentStatus,
      nextStatus: currentStatus,
      transitionApplied: false,
      requiresHumanReview: true,
      evidence: null,
      reason: "NEW_PACKAGE_REQUIRED",
    });
  }

  if (currentStatus !== "STALE") {
    return Object.freeze({
      sourceId: detection.sourceId,
      packageKey,
      previousStatus: currentStatus,
      nextStatus: currentStatus,
      transitionApplied: false,
      requiresHumanReview: true,
      evidence: null,
      reason: "STATUS_NOT_ELIGIBLE",
    });
  }
  if (!evidence) {
    throw new Error("STALE → VERIFIED geçişi için yeniden doğrulama kanıtı zorunludur.");
  }
  if (
    evidence.sourceId !== detection.sourceId ||
    evidence.previousSnapshotId !== detection.baselineSnapshotId ||
    evidence.sourceVersion !== detection.observedSourceVersion ||
    evidence.classification !== detection.classification ||
    evidence.sourceContentHash.algorithm !== detection.observedContentHash.algorithm ||
    evidence.sourceContentHash.value !== detection.observedContentHash.value ||
    !evidence.packageKey.trim() ||
    !evidence.replacementSnapshotId.trim() ||
    !evidence.verificationMethod.trim() ||
    evidence.evidenceReferences.length === 0 ||
    evidence.evidenceReferences.some((reference) => !reference.trim()) ||
    evidence.review.actorType !== "HUMAN" ||
    !evidence.review.actorId.trim() ||
    (evidence.review.decision !== "APPROVED" &&
      evidence.review.decision !== "REJECTED") ||
    evidence.packageKey !== packageKey ||
    !isExplicitOffsetTimestamp(evidence.revalidatedAt) ||
    !isExplicitOffsetTimestamp(evidence.review.reviewedAt) ||
    Date.parse(evidence.review.reviewedAt) < Date.parse(evidence.revalidatedAt)
  ) {
    throw new Error("Yeniden doğrulama kanıt zinciri D3/D4 sonuçlarıyla eşleşmiyor.");
  }

  const frozenEvidence = freezeEvidence(evidence);
  const approved = frozenEvidence.review.decision === "APPROVED";
  return Object.freeze({
    sourceId: detection.sourceId,
    packageKey: evidence.packageKey,
    previousStatus: currentStatus,
    nextStatus: approved ? "VERIFIED" : "STALE",
    transitionApplied: approved,
    requiresHumanReview: !approved,
    evidence: frozenEvidence,
    reason: approved ? "REVALIDATION_APPROVED" : "HUMAN_REVIEW_REJECTED",
  });
}
