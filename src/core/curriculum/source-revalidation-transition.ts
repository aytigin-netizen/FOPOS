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

const expectedDetectionFlags: Readonly<
  Record<
    SourceChangeClassification,
    Readonly<{
      contentChanged: boolean;
      versionChanged: boolean;
      requiresRevalidation: boolean;
    }>
  >
> = Object.freeze({
  UNCHANGED: Object.freeze({
    contentChanged: false,
    versionChanged: false,
    requiresRevalidation: false,
  }),
  CONTENT_CHANGED: Object.freeze({
    contentChanged: true,
    versionChanged: false,
    requiresRevalidation: true,
  }),
  VERSION_CHANGED: Object.freeze({
    contentChanged: false,
    versionChanged: true,
    requiresRevalidation: true,
  }),
  VERSION_AND_CONTENT_CHANGED: Object.freeze({
    contentChanged: true,
    versionChanged: true,
    requiresRevalidation: true,
  }),
});

function assertConsistentDetection(detection: SourceChangeDetectionResult): void {
  const expected = expectedDetectionFlags[detection.classification];
  if (
    !expected ||
    detection.contentChanged !== expected.contentChanged ||
    detection.versionChanged !== expected.versionChanged ||
    detection.requiresRevalidation !== expected.requiresRevalidation
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
