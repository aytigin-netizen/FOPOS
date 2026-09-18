import type {
  SourceChangeClassification,
  SourceChangeDetectionResult,
  SourceRevalidationTransitionResult,
  SourceRevalidationTransitionStatus,
} from "./source-types.ts";

export type DeriveSourceRevalidationTransitionInput = {
  readonly currentStatus: SourceRevalidationTransitionStatus;
  readonly detection: SourceChangeDetectionResult;
};

function classifyReportedSourceValues(
  versionChanged: boolean,
  contentChanged: boolean,
): SourceChangeClassification {
  if (versionChanged && contentChanged) return "VERSION_AND_CONTENT_CHANGED";
  if (versionChanged) return "VERSION_CHANGED";
  if (contentChanged) return "CONTENT_CHANGED";
  return "UNCHANGED";
}

function assertConsistentDetection(detection: SourceChangeDetectionResult): void {
  const versionChanged =
    detection.observedSourceVersion !== detection.baselineSourceVersion;
  const contentChanged =
    detection.observedContentHash.algorithm !== detection.baselineContentHash.algorithm ||
    detection.observedContentHash.value !== detection.baselineContentHash.value;
  const classification = classifyReportedSourceValues(versionChanged, contentChanged);
  const requiresRevalidation = classification !== "UNCHANGED";
  if (
    detection.classification !== classification ||
    detection.contentChanged !== contentChanged ||
    detection.versionChanged !== versionChanged ||
    detection.requiresRevalidation !== requiresRevalidation
  ) {
    throw new Error("Kaynak değişiklik sonucu yeniden doğrulama geçişiyle tutarsız.");
  }
}

export function deriveSourceRevalidationTransition({
  currentStatus,
  detection,
}: DeriveSourceRevalidationTransitionInput): SourceRevalidationTransitionResult {
  assertConsistentDetection(detection);

  if (!detection.requiresRevalidation) {
    return Object.freeze({
      sourceId: detection.sourceId,
      baselineSnapshotId: detection.baselineSnapshotId,
      observedAt: detection.observedAt,
      classification: detection.classification,
      previousStatus: currentStatus,
      nextStatus: currentStatus,
      transitionApplied: false,
      requiresHumanReview: false,
      reason: "SOURCE_UNCHANGED",
    });
  }

  if (currentStatus === "VERIFIED") {
    return Object.freeze({
      sourceId: detection.sourceId,
      baselineSnapshotId: detection.baselineSnapshotId,
      observedAt: detection.observedAt,
      classification: detection.classification,
      previousStatus: currentStatus,
      nextStatus: "STALE",
      transitionApplied: true,
      requiresHumanReview: true,
      reason: "SOURCE_CHANGE_REQUIRES_REVALIDATION",
    });
  }

  return Object.freeze({
    sourceId: detection.sourceId,
    baselineSnapshotId: detection.baselineSnapshotId,
    observedAt: detection.observedAt,
    classification: detection.classification,
    previousStatus: currentStatus,
    nextStatus: currentStatus,
    transitionApplied: false,
    requiresHumanReview: true,
    reason: "AUTOMATIC_PROMOTION_FORBIDDEN",
  });
}
