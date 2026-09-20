import { detectOfficialSourceChange } from "./source-change-detection.ts";
import {
  createSourceRevalidationEvidence,
  deriveControlledSourceRevalidationTransition,
} from "./source-revalidation-evidence.ts";
import { getOfficialSource } from "./source-registry.ts";
import { deriveSourceRevalidationTransition } from "./source-revalidation-transition.ts";
import type {
  OfficialSourceObservation,
  OfficialSourceSnapshot,
  PackageSourceAttestation,
  SourceRevalidationOrchestrationResult,
  SourceRevalidationReview,
  SourceRevalidationTransitionResult,
  SourceRevalidationTransitionStatus,
} from "./source-types.ts";

export type SourceRevalidationReviewBundle = {
  readonly replacementSnapshot: OfficialSourceSnapshot;
  readonly replacementAttestation: PackageSourceAttestation;
  readonly review: SourceRevalidationReview;
};

export type OrchestrateSourceRevalidationInput = {
  readonly packageKey: string;
  readonly currentStatus: SourceRevalidationTransitionStatus;
  readonly baselineSnapshot: OfficialSourceSnapshot;
  readonly baselineAttestation: PackageSourceAttestation;
  readonly observation: OfficialSourceObservation;
  readonly reviewBundle?: SourceRevalidationReviewBundle | null;
  readonly previousStaleTransition?: SourceRevalidationTransitionResult | null;
};

function freezeResult(
  result: SourceRevalidationOrchestrationResult,
): SourceRevalidationOrchestrationResult {
  return Object.freeze(result);
}

function cloneTransition(
  transition: SourceRevalidationTransitionResult,
): SourceRevalidationTransitionResult {
  return Object.freeze({ ...transition });
}

export function orchestrateSourceRevalidation({
  packageKey,
  currentStatus,
  baselineSnapshot,
  baselineAttestation,
  observation,
  reviewBundle = null,
  previousStaleTransition = null,
}: OrchestrateSourceRevalidationInput): SourceRevalidationOrchestrationResult {
  const source = getOfficialSource(baselineSnapshot.sourceId);
  if (!source || source.packageKey !== packageKey) {
    throw new Error("D6 paketi kayıtlı resmî kaynakla eşleşmiyor.");
  }

  const detection = detectOfficialSourceChange({
    baselineSnapshot,
    baselineAttestation,
    observation,
  });
  const derivedTransition = deriveSourceRevalidationTransition({
    currentStatus: detection.versionChanged ? "VERIFIED" : currentStatus,
    detection,
  });
  const resumingFromStale = currentStatus === "STALE" && reviewBundle !== null;
  if (resumingFromStale && previousStaleTransition === null) {
    throw new Error("STALE durumundan devam etmek için önceki doğrulanmış D4 geçişi zorunludur.");
  }
  if (!resumingFromStale && previousStaleTransition !== null) {
    throw new Error("Önceki D4 geçişi yalnız kalıcı STALE incelemesini sürdürürken kabul edilir.");
  }
  const staleTransition = previousStaleTransition === null
    ? derivedTransition
    : cloneTransition(previousStaleTransition);

  if (!detection.requiresRevalidation) {
    if (reviewBundle !== null) {
      throw new Error("Değişmeyen kaynak için yeniden doğrulama kanıtı kabul edilmez.");
    }
    return freezeResult({
      sourceId: detection.sourceId,
      packageKey,
      previousStatus: currentStatus,
      nextStatus: currentStatus,
      transitionApplied: false,
      requiresHumanReview: false,
      reason: "SOURCE_UNCHANGED",
      detection,
      staleTransition,
      controlledTransition: null,
      evidence: null,
    });
  }

  if (detection.versionChanged) {
    if (reviewBundle !== null) {
      throw new Error("Yeni kaynak sürümü mevcut paket kanıtıyla ilişkilendirilemez.");
    }
    const controlledTransition = deriveControlledSourceRevalidationTransition({
      packageKey,
      currentStatus: staleTransition.nextStatus,
      detection,
      staleTransition,
      evidence: null,
    });
    return freezeResult({
      sourceId: detection.sourceId,
      packageKey,
      previousStatus: currentStatus,
      nextStatus: controlledTransition.nextStatus,
      transitionApplied: currentStatus === "VERIFIED" && staleTransition.transitionApplied,
      requiresHumanReview: controlledTransition.requiresHumanReview,
      reason: "NEW_PACKAGE_REQUIRED",
      detection,
      staleTransition,
      controlledTransition,
      evidence: null,
    });
  }

  if (currentStatus !== "VERIFIED" && !resumingFromStale) {
    if (reviewBundle !== null) {
      throw new Error("Uygun olmayan durum için yeniden doğrulama kanıtı kabul edilmez.");
    }
    return freezeResult({
      sourceId: detection.sourceId,
      packageKey,
      previousStatus: currentStatus,
      nextStatus: currentStatus,
      transitionApplied: false,
      requiresHumanReview: true,
      reason: "STATUS_NOT_ELIGIBLE",
      detection,
      staleTransition,
      controlledTransition: null,
      evidence: null,
    });
  }

  if (reviewBundle === null) {
    return freezeResult({
      sourceId: detection.sourceId,
      packageKey,
      previousStatus: currentStatus,
      nextStatus: staleTransition.nextStatus,
      transitionApplied: staleTransition.transitionApplied,
      requiresHumanReview: true,
      reason: "AWAITING_HUMAN_REVIEW",
      detection,
      staleTransition,
      controlledTransition: null,
      evidence: null,
    });
  }

  const evidence = createSourceRevalidationEvidence({
    detection,
    staleTransition,
    replacementSnapshot: reviewBundle.replacementSnapshot,
    replacementAttestation: reviewBundle.replacementAttestation,
    review: reviewBundle.review,
  });
  const controlledTransition = deriveControlledSourceRevalidationTransition({
    packageKey,
    currentStatus: resumingFromStale ? currentStatus : staleTransition.nextStatus,
    detection,
    staleTransition,
    evidence,
  });

  return freezeResult({
    sourceId: detection.sourceId,
    packageKey,
    previousStatus: currentStatus,
    nextStatus: controlledTransition.nextStatus,
    transitionApplied: resumingFromStale
      ? controlledTransition.transitionApplied
      : staleTransition.transitionApplied || controlledTransition.transitionApplied,
    requiresHumanReview: controlledTransition.requiresHumanReview,
    reason: controlledTransition.reason,
    detection,
    staleTransition,
    controlledTransition,
    evidence,
  });
}
