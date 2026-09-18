export type SourceMonitoringMode = "MANUAL_REVIEW" | "SCHEDULED_CHECK_ALLOWED";

export type SourceContentDigest = {
  readonly algorithm: "sha256";
  readonly value: string;
};
export type OfficialSourceIdentity = {
  readonly sourceId: string;
  readonly disciplineCode: string;
  readonly datasetVersion: string;
  readonly packageKey: string;
  readonly publisher: string;
  readonly canonicalUrl: string;
  readonly monitoringMode: SourceMonitoringMode;
};

export type OfficialSourceSnapshot = {
  readonly snapshotId: string;
  readonly sourceId: string;
  readonly sourceVersion: string;
  readonly retrievedAt: string;
  readonly effectiveDate: string | null;
  readonly contentHash: SourceContentDigest;
  readonly artifactReference: string;
};

export type OfficialSourceObservation = {
  readonly sourceId: string;
  readonly sourceVersion: string;
  readonly observedAt: string;
  readonly contentHash: SourceContentDigest;
};

export type SourceChangeClassification =
  | "UNCHANGED"
  | "CONTENT_CHANGED"
  | "VERSION_CHANGED"
  | "VERSION_AND_CONTENT_CHANGED";

export type SourceChangeDetectionResult = {
  readonly sourceId: string;
  readonly baselineSnapshotId: string;
  readonly baselineSourceVersion: string;
  readonly observedSourceVersion: string;
  readonly observedAt: string;
  readonly baselineContentHash: SourceContentDigest;
  readonly observedContentHash: SourceContentDigest;
  readonly classification: SourceChangeClassification;
  readonly contentChanged: boolean;
  readonly versionChanged: boolean;
  readonly requiresRevalidation: boolean;
};

export type SourceRevalidationTransitionStatus =
  | "UNVERIFIED"
  | "VERIFIED"
  | "STALE"
  | "REJECTED";

export type SourceRevalidationTransitionResult = {
  readonly sourceId: string;
  readonly baselineSnapshotId: string;
  readonly observedAt: string;
  readonly classification: SourceChangeClassification;
  readonly previousStatus: SourceRevalidationTransitionStatus;
  readonly nextStatus: SourceRevalidationTransitionStatus;
  readonly transitionApplied: boolean;
  readonly requiresHumanReview: boolean;
  readonly reason:
    | "SOURCE_UNCHANGED"
    | "SOURCE_CHANGE_REQUIRES_REVALIDATION"
    | "AUTOMATIC_PROMOTION_FORBIDDEN";
};

export type PackageSourceAttestation = {
  readonly packageKey: string;
  readonly sourceId: string;
  readonly sourceVersion: string;
  readonly snapshotId: string;
  readonly sourceContentHash: SourceContentDigest;
  readonly verifiedAt: string;
  readonly verificationMethod: string;
  readonly evidenceReferences: readonly string[];
};
