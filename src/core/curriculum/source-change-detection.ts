import {
  validateOfficialSourceObservation,
  validateOfficialSourceSnapshot,
  validatePackageSourceAttestation,
} from "./source-registry.ts";
import type {
  OfficialSourceObservation,
  OfficialSourceSnapshot,
  PackageSourceAttestation,
  SourceChangeClassification,
  SourceChangeDetectionResult,
  SourceContentDigest,
} from "./source-types.ts";

export type DetectOfficialSourceChangeInput = {
  readonly baselineSnapshot: OfficialSourceSnapshot;
  readonly baselineAttestation: PackageSourceAttestation;
  readonly observation: OfficialSourceObservation;
};

function cloneDigest(digest: SourceContentDigest): SourceContentDigest {
  return Object.freeze({ ...digest });
}

function classifyChange(
  versionChanged: boolean,
  contentChanged: boolean,
): SourceChangeClassification {
  if (versionChanged && contentChanged) return "VERSION_AND_CONTENT_CHANGED";
  if (versionChanged) return "VERSION_CHANGED";
  if (contentChanged) return "CONTENT_CHANGED";
  return "UNCHANGED";
}

export function detectOfficialSourceChange({
  baselineSnapshot,
  baselineAttestation,
  observation,
}: DetectOfficialSourceChangeInput): SourceChangeDetectionResult {
  const baseline = validateOfficialSourceSnapshot(baselineSnapshot);
  validatePackageSourceAttestation(baselineAttestation, baseline);
  const observed = validateOfficialSourceObservation(observation);

  if (observed.sourceId !== baseline.sourceId) {
    throw new Error("Kaynak gözlemi doğrulanmış baseline kaynağıyla eşleşmiyor.");
  }
  if (Date.parse(observed.observedAt) < Date.parse(baseline.retrievedAt)) {
    throw new Error("Kaynak gözlemi doğrulanmış baseline kaydından eski olamaz.");
  }

  const versionChanged = observed.sourceVersion !== baseline.sourceVersion;
  const contentChanged =
    observed.contentHash.algorithm !== baseline.contentHash.algorithm ||
    observed.contentHash.value !== baseline.contentHash.value;
  const classification = classifyChange(versionChanged, contentChanged);

  return Object.freeze({
    sourceId: baseline.sourceId,
    baselineSnapshotId: baseline.snapshotId,
    baselineSourceVersion: baseline.sourceVersion,
    observedSourceVersion: observed.sourceVersion,
    observedAt: observed.observedAt,
    baselineContentHash: cloneDigest(baseline.contentHash),
    observedContentHash: cloneDigest(observed.contentHash),
    classification,
    contentChanged,
    versionChanged,
    requiresRevalidation: classification !== "UNCHANGED",
  });
}
