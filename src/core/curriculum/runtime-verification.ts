import type {
  CurriculumManifest,
  OfficialVerificationStatus,
} from "./package-types.ts";
import type {
  SourceChangeDetectionResult,
  SourceRevalidationEvidence,
  SourceRevalidationOrchestrationReason,
  SourceRevalidationOrchestrationResult,
} from "./source-types.ts";
import { deriveSourceRevalidationTransition } from "./source-revalidation-transition.ts";

const trustedRuntimeStates = new WeakSet<object>();

export type PendingSourceObservation = {
  readonly sourceId: string;
  readonly baselineSnapshotId: string;
  readonly observedAt: string;
  readonly observedSourceVersion: string;
  readonly observedContentHash: {
    readonly algorithm: "sha256";
    readonly value: string;
  };
};

export type CurriculumRuntimeVerificationState = {
  readonly packageKey: string;
  readonly sourceId: string;
  readonly sourceVersion: string;
  readonly status: OfficialVerificationStatus;
  readonly provenance: "MANIFEST" | "REVALIDATION";
  readonly reason: SourceRevalidationOrchestrationReason | null;
  readonly pendingObservation: PendingSourceObservation | null;
  readonly approvalEvidence: SourceRevalidationEvidence | null;
};

export type CurriculumRuntimeEligibilityReason =
  | "READY"
  | "INACTIVE_LIFECYCLE"
  | "UNVERIFIED"
  | "STALE"
  | "REJECTED"
  | "NEW_PACKAGE_REQUIRED"
  | "STATE_MISMATCH";

export type CurriculumRuntimeEligibility = {
  readonly packageKey: string;
  readonly eligible: boolean;
  readonly status: OfficialVerificationStatus | null;
  readonly reason: CurriculumRuntimeEligibilityReason;
};

function packageKeyFor(manifest: CurriculumManifest): string {
  return `${manifest.discipline.code}@${manifest.datasetVersion}`;
}

function freezeState(
  state: CurriculumRuntimeVerificationState,
): CurriculumRuntimeVerificationState {
  const frozen = Object.freeze(state);
  trustedRuntimeStates.add(frozen);
  return frozen;
}

function freezeEligibility(
  eligibility: CurriculumRuntimeEligibility,
): CurriculumRuntimeEligibility {
  return Object.freeze(eligibility);
}

function detectionIsConsistent(
  result: SourceRevalidationOrchestrationResult,
): boolean {
  try {
    deriveSourceRevalidationTransition({
      currentStatus: result.previousStatus,
      detection: result.detection,
    });
    return true;
  } catch {
    return false;
  }
}

function revalidationResultMatchesReason(
  result: SourceRevalidationOrchestrationResult,
): boolean {
  switch (result.reason) {
    case "SOURCE_UNCHANGED":
      return result.nextStatus === result.previousStatus &&
        result.detection.classification === "UNCHANGED" &&
        !result.detection.contentChanged && !result.detection.versionChanged &&
        result.detection.baselineSourceVersion ===
          result.detection.observedSourceVersion &&
        result.detection.baselineContentHash.algorithm ===
          result.detection.observedContentHash.algorithm &&
        result.detection.baselineContentHash.value ===
          result.detection.observedContentHash.value &&
        !result.detection.requiresRevalidation &&
        !result.requiresHumanReview && result.evidence === null;
    case "AWAITING_HUMAN_REVIEW":
      return result.previousStatus === "VERIFIED" &&
        result.nextStatus === "STALE" &&
        result.detection.requiresRevalidation &&
        result.requiresHumanReview && result.evidence === null;
    case "REVALIDATION_APPROVED":
      return (result.previousStatus === "VERIFIED" || result.previousStatus === "STALE") &&
        result.nextStatus === "VERIFIED" &&
        !result.detection.versionChanged &&
        result.detection.requiresRevalidation &&
        !result.requiresHumanReview && result.evidence !== null;
    case "HUMAN_REVIEW_REJECTED":
      return (result.previousStatus === "VERIFIED" || result.previousStatus === "STALE") &&
        result.nextStatus === "STALE" && result.detection.requiresRevalidation &&
        result.requiresHumanReview;
    case "NEW_PACKAGE_REQUIRED":
      return result.nextStatus !== "VERIFIED" &&
        result.detection.versionChanged && result.detection.requiresRevalidation &&
        result.requiresHumanReview && result.evidence === null;
    case "STATUS_NOT_ELIGIBLE":
      return result.previousStatus !== "VERIFIED" &&
        result.nextStatus === result.previousStatus &&
        result.detection.requiresRevalidation &&
        result.requiresHumanReview && result.evidence === null;
  }
}

function approvalEvidenceMatchesResult(
  result: SourceRevalidationOrchestrationResult,
): boolean {
  const evidence = result.evidence;
  const transition = result.controlledTransition;
  return result.reason === "REVALIDATION_APPROVED" &&
    evidence !== null && transition !== null &&
    transition.reason === "REVALIDATION_APPROVED" &&
    transition.previousStatus === "STALE" &&
    transition.nextStatus === "VERIFIED" &&
    transition.transitionApplied && !transition.requiresHumanReview &&
    transition.evidence === evidence &&
    evidence.review.actorType === "HUMAN" &&
    evidence.review.actorId.trim().length > 0 &&
    evidence.review.decision === "APPROVED" &&
    evidence.sourceId === result.sourceId &&
    evidence.packageKey === result.packageKey &&
    evidence.previousSnapshotId === result.detection.baselineSnapshotId &&
    evidence.sourceVersion === result.detection.observedSourceVersion &&
    evidence.classification === result.detection.classification &&
    evidence.sourceContentHash.algorithm ===
      result.detection.observedContentHash.algorithm &&
    evidence.sourceContentHash.value === result.detection.observedContentHash.value &&
    evidence.replacementSnapshotId.trim().length > 0 &&
    evidence.replacementSnapshotId !== evidence.previousSnapshotId &&
    evidence.verificationMethod.trim().length > 0 &&
    evidence.evidenceReferences.length > 0 &&
    evidence.evidenceReferences.every((reference) => reference.trim().length > 0) &&
    Date.parse(evidence.revalidatedAt) >= Date.parse(result.detection.observedAt) &&
    Date.parse(evidence.review.reviewedAt) >= Date.parse(evidence.revalidatedAt);
}

function approvalEvidenceForNextState(
  currentState: CurriculumRuntimeVerificationState,
  result: SourceRevalidationOrchestrationResult,
): SourceRevalidationEvidence | null {
  if (result.reason === "REVALIDATION_APPROVED") return result.evidence;
  if (result.reason === "SOURCE_UNCHANGED") return currentState.approvalEvidence;
  return null;
}

function pendingObservationFrom(
  detection: SourceChangeDetectionResult,
): PendingSourceObservation {
  return Object.freeze({
    sourceId: detection.sourceId,
    baselineSnapshotId: detection.baselineSnapshotId,
    observedAt: detection.observedAt,
    observedSourceVersion: detection.observedSourceVersion,
    observedContentHash: Object.freeze({ ...detection.observedContentHash }),
  });
}

function pendingObservationMatches(
  pending: PendingSourceObservation,
  detection: SourceChangeDetectionResult,
): boolean {
  return pending.sourceId === detection.sourceId &&
    pending.baselineSnapshotId === detection.baselineSnapshotId &&
    pending.observedAt === detection.observedAt &&
    pending.observedSourceVersion === detection.observedSourceVersion &&
    pending.observedContentHash.algorithm === detection.observedContentHash.algorithm &&
    pending.observedContentHash.value === detection.observedContentHash.value;
}

function pendingObservationCanAdvance(
  pending: PendingSourceObservation,
  detection: SourceChangeDetectionResult,
): boolean {
  return pendingObservationMatches(pending, detection) ||
    Date.parse(detection.observedAt) > Date.parse(pending.observedAt);
}

function nextPendingObservation(
  currentState: CurriculumRuntimeVerificationState,
  result: SourceRevalidationOrchestrationResult,
): PendingSourceObservation | null {
  if (result.reason === "REVALIDATION_APPROVED") return null;
  if (result.reason === "SOURCE_UNCHANGED") {
    return currentState.pendingObservation;
  }
  return result.detection.requiresRevalidation
    ? pendingObservationFrom(result.detection)
    : currentState.pendingObservation;
}

export function createCurriculumRuntimeVerificationState(
  manifest: CurriculumManifest,
): CurriculumRuntimeVerificationState {
  const packageKey = packageKeyFor(manifest);
  if (
    !manifest.discipline.code.trim() ||
    !manifest.datasetVersion.trim() ||
    !manifest.verification.sourceId.trim() ||
    manifest.verification.sourceVersion !== manifest.datasetVersion
  ) {
    throw new Error("Runtime doğrulama başlangıç durumu manifest kimliğiyle eşleşmiyor.");
  }
  return freezeState({
    packageKey,
    sourceId: manifest.verification.sourceId,
    sourceVersion: manifest.verification.sourceVersion,
    status: manifest.verification.status,
    provenance: "MANIFEST",
    reason: null,
    pendingObservation: null,
    approvalEvidence: null,
  });
}

export function applySourceRevalidationResult(
  currentState: CurriculumRuntimeVerificationState,
  result: SourceRevalidationOrchestrationResult,
): CurriculumRuntimeVerificationState {
  if (
    !trustedRuntimeStates.has(currentState) ||
    currentState.packageKey !== result.packageKey ||
    currentState.sourceId !== result.sourceId ||
    currentState.sourceId !== result.detection.sourceId ||
    currentState.sourceVersion !== result.detection.baselineSourceVersion ||
    currentState.status !== result.previousStatus ||
    !detectionIsConsistent(result) ||
    (currentState.pendingObservation !== null &&
      result.detection.requiresRevalidation &&
      !pendingObservationCanAdvance(currentState.pendingObservation, result.detection)) ||
    (currentState.status === "STALE" &&
      (result.reason === "REVALIDATION_APPROVED" ||
        result.reason === "HUMAN_REVIEW_REJECTED") &&
      (!currentState.pendingObservation ||
        !pendingObservationMatches(currentState.pendingObservation, result.detection))) ||
    !revalidationResultMatchesReason(result) ||
    (result.reason === "REVALIDATION_APPROVED" &&
      !approvalEvidenceMatchesResult(result))
  ) {
    throw new Error("D6 sonucu güncel runtime doğrulama durumuyla eşleşmiyor.");
  }
  return freezeState({
    packageKey: currentState.packageKey,
    sourceId: currentState.sourceId,
    sourceVersion: currentState.sourceVersion,
    status: result.nextStatus,
    provenance: "REVALIDATION",
    reason: result.reason,
    pendingObservation: nextPendingObservation(currentState, result),
    approvalEvidence: approvalEvidenceForNextState(currentState, result),
  });
}

function approvalEvidenceMatchesState(
  state: CurriculumRuntimeVerificationState,
): boolean {
  const evidence = state.approvalEvidence;
  return evidence !== null &&
    evidence.sourceId === state.sourceId &&
    evidence.packageKey === state.packageKey &&
    evidence.sourceVersion === state.sourceVersion &&
    evidence.review.actorType === "HUMAN" &&
    evidence.review.decision === "APPROVED";
}

function revalidationStateIsCoherent(
  manifest: CurriculumManifest,
  state: CurriculumRuntimeVerificationState,
): boolean {
  switch (state.reason) {
    case "SOURCE_UNCHANGED":
      return state.status === "VERIFIED"
        ? state.pendingObservation === null &&
          (manifest.verification.status === "VERIFIED" ||
            approvalEvidenceMatchesState(state))
        : state.status === manifest.verification.status || state.pendingObservation !== null;
    case "AWAITING_HUMAN_REVIEW":
      return state.status === "STALE" && state.pendingObservation !== null;
    case "REVALIDATION_APPROVED":
      return (manifest.verification.status === "VERIFIED" ||
          manifest.verification.status === "STALE") &&
        state.status === "VERIFIED" && state.pendingObservation === null &&
        approvalEvidenceMatchesState(state);
    case "HUMAN_REVIEW_REJECTED":
      return state.status === "STALE" && state.pendingObservation !== null;
    case "NEW_PACKAGE_REQUIRED":
      return state.status !== "VERIFIED" && state.pendingObservation !== null;
    case "STATUS_NOT_ELIGIBLE":
      return state.status !== "VERIFIED" && state.pendingObservation !== null;
    case null:
      return false;
  }
}

function stateMatchesManifest(
  manifest: CurriculumManifest,
  state: CurriculumRuntimeVerificationState,
): boolean {
  const identityMatches =
    state.packageKey === packageKeyFor(manifest) &&
    state.sourceId === manifest.verification.sourceId &&
    state.sourceVersion === manifest.verification.sourceVersion;
  if (!identityMatches) return false;
  if (state.provenance === "MANIFEST") {
    return state.status === manifest.verification.status &&
      state.reason === null && state.pendingObservation === null &&
      state.approvalEvidence === null;
  }
  return state.reason !== null && revalidationStateIsCoherent(manifest, state);
}

export function evaluateCurriculumRuntimeEligibility(
  manifest: CurriculumManifest,
  state: CurriculumRuntimeVerificationState,
): CurriculumRuntimeEligibility {
  const packageKey = packageKeyFor(manifest);
  if (!trustedRuntimeStates.has(state) || !stateMatchesManifest(manifest, state)) {
    return freezeEligibility({
      packageKey,
      eligible: false,
      status: null,
      reason: "STATE_MISMATCH",
    });
  }
  if (manifest.lifecycle !== "ACTIVE") {
    return freezeEligibility({
      packageKey,
      eligible: false,
      status: state.status,
      reason: "INACTIVE_LIFECYCLE",
    });
  }
  if (state.reason === "NEW_PACKAGE_REQUIRED") {
    return freezeEligibility({
      packageKey,
      eligible: false,
      status: state.status,
      reason: "NEW_PACKAGE_REQUIRED",
    });
  }
  if (state.status !== "VERIFIED") {
    return freezeEligibility({
      packageKey,
      eligible: false,
      status: state.status,
      reason: state.status,
    });
  }
  return freezeEligibility({
    packageKey,
    eligible: true,
    status: state.status,
    reason: "READY",
  });
}
