import type {
  CurriculumManifest,
  OfficialVerificationStatus,
} from "./package-types.ts";
import type {
  SourceRevalidationOrchestrationReason,
  SourceRevalidationOrchestrationResult,
} from "./source-types.ts";

export type CurriculumRuntimeVerificationState = {
  readonly packageKey: string;
  readonly sourceId: string;
  readonly sourceVersion: string;
  readonly status: OfficialVerificationStatus;
  readonly provenance: "MANIFEST" | "REVALIDATION";
  readonly reason: SourceRevalidationOrchestrationReason | null;
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
  return Object.freeze(state);
}

function freezeEligibility(
  eligibility: CurriculumRuntimeEligibility,
): CurriculumRuntimeEligibility {
  return Object.freeze(eligibility);
}

function revalidationResultMatchesReason(
  result: SourceRevalidationOrchestrationResult,
): boolean {
  switch (result.reason) {
    case "SOURCE_UNCHANGED":
      return result.nextStatus === result.previousStatus &&
        !result.requiresHumanReview && result.evidence === null;
    case "AWAITING_HUMAN_REVIEW":
      return result.nextStatus === "STALE" &&
        result.requiresHumanReview && result.evidence === null;
    case "REVALIDATION_APPROVED":
      return result.nextStatus === "VERIFIED" &&
        !result.requiresHumanReview && result.evidence !== null;
    case "HUMAN_REVIEW_REJECTED":
      return result.nextStatus === "STALE" && result.requiresHumanReview;
    case "NEW_PACKAGE_REQUIRED":
      return result.nextStatus !== "VERIFIED" &&
        result.requiresHumanReview && result.evidence === null;
    case "STATUS_NOT_ELIGIBLE":
      return result.nextStatus === result.previousStatus &&
        result.requiresHumanReview && result.evidence === null;
  }
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
  });
}

export function applySourceRevalidationResult(
  currentState: CurriculumRuntimeVerificationState,
  result: SourceRevalidationOrchestrationResult,
): CurriculumRuntimeVerificationState {
  if (
    currentState.packageKey !== result.packageKey ||
    currentState.sourceId !== result.sourceId ||
    currentState.sourceId !== result.detection.sourceId ||
    currentState.sourceVersion !== result.detection.baselineSourceVersion ||
    currentState.status !== result.previousStatus ||
    !revalidationResultMatchesReason(result)
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
  });
}

function stateMatchesManifest(
  manifest: CurriculumManifest,
  state: CurriculumRuntimeVerificationState,
): boolean {
  return (
    state.packageKey === packageKeyFor(manifest) &&
    state.sourceId === manifest.verification.sourceId &&
    state.sourceVersion === manifest.verification.sourceVersion
  );
}

export function evaluateCurriculumRuntimeEligibility(
  manifest: CurriculumManifest,
  state: CurriculumRuntimeVerificationState,
): CurriculumRuntimeEligibility {
  const packageKey = packageKeyFor(manifest);
  if (!stateMatchesManifest(manifest, state)) {
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
