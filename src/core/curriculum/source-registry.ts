import type {
  OfficialSourceIdentity,
  OfficialSourceSnapshot,
  PackageSourceAttestation,
  SourceContentDigest,
} from "./source-types.ts";

const SOURCE_ID = /^[a-z][a-z0-9_-]*(?::[a-z0-9_-]+)+$/u;
const DISCIPLINE_CODE = /^[a-z][a-z0-9_-]{1,31}$/u;
const DATASET_VERSION = /^[0-9]{4}\.[0-9]+$/u;
const SHA256 = /^[a-f0-9]{64}$/u;
const SOURCE_MONITORING_MODES = new Set([
  "MANUAL_REVIEW",
  "SCHEDULED_CHECK_ALLOWED",
]);

function isTimestamp(value: string): boolean {
  return !Number.isNaN(Date.parse(value));
}

function parsePackageKey(packageKey: string): readonly [string, string] | null {
  const parts = packageKey.split("@");
  if (
    parts.length !== 2 ||
    !DISCIPLINE_CODE.test(parts[0]) ||
    !DATASET_VERSION.test(parts[1])
  ) {
    return null;
  }
  return [parts[0], parts[1]];
}
export function validateSourceContentDigest(
  digest: SourceContentDigest,
): SourceContentDigest {
  if (digest.algorithm !== "sha256" || !SHA256.test(digest.value)) {
    throw new Error("Resmî kaynak içerik özeti geçersiz.");
  }
  return Object.freeze({ ...digest });
}

const registry = new Map<string, OfficialSourceIdentity>([
  [
    "meb:philosophy:2024",
    Object.freeze({
      sourceId: "meb:philosophy:2024",
      disciplineCode: "philosophy",
      datasetVersion: "2024.1",
      packageKey: "philosophy@2024.1",
      publisher: "T.C. Millî Eğitim Bakanlığı",
      canonicalUrl: "https://mufredat.meb.gov.tr/",
      monitoringMode: "MANUAL_REVIEW",
    }),
  ],
  [
    "meb:philosophy:2026",
    Object.freeze({
      sourceId: "meb:philosophy:2026",
      disciplineCode: "philosophy",
      datasetVersion: "2026.1",
      packageKey: "philosophy@2026.1",
      publisher: "T.C. Millî Eğitim Bakanlığı",
      canonicalUrl: "https://mufredat.meb.gov.tr/",
      monitoringMode: "MANUAL_REVIEW",
    }),
  ],
  [
    "meb:sociology:2026",
    Object.freeze({
      sourceId: "meb:sociology:2026",
      disciplineCode: "sociology",
      datasetVersion: "2026.1",
      packageKey: "sociology@2026.1",
      publisher: "T.C. Millî Eğitim Bakanlığı",
      canonicalUrl: "https://mufredat.meb.gov.tr/",
      monitoringMode: "MANUAL_REVIEW",
    }),
  ],
]);

function cloneSource(source: OfficialSourceIdentity): OfficialSourceIdentity {
  return Object.freeze({ ...source });
}

export function validateOfficialSourceIdentity(
  source: OfficialSourceIdentity,
): OfficialSourceIdentity {
  const packageKeyParts = parsePackageKey(source.packageKey);
  if (!SOURCE_ID.test(source.sourceId)) {
    throw new Error("Resmî kaynak kimliği geçersiz.");
  }
  if (!DISCIPLINE_CODE.test(source.disciplineCode)) {
    throw new Error("Resmî kaynak branş kodu geçersiz.");
  }
  if (
    !packageKeyParts ||
    packageKeyParts[0] !== source.disciplineCode ||
    packageKeyParts[1] !== source.datasetVersion
  ) {
    throw new Error("Resmî kaynak paket eşlemesi geçersiz.");
  }
  if (!SOURCE_MONITORING_MODES.has(source.monitoringMode)) {
    throw new Error("Resmî kaynak izleme modu geçersiz.");
  }
  if (!source.publisher.trim() || !source.canonicalUrl.startsWith("https://")) {
    throw new Error("Resmî kaynak yayıncı veya adres bilgisi geçersiz.");
  }
  return cloneSource(source);
}

for (const source of registry.values()) validateOfficialSourceIdentity(source);

export function getOfficialSource(sourceId: string): OfficialSourceIdentity | null {
  const source = registry.get(sourceId.trim().toLocaleLowerCase("en-US"));
  return source ? cloneSource(source) : null;
}

export function listOfficialSources(): readonly OfficialSourceIdentity[] {
  return Object.freeze([...registry.values()].map(cloneSource));
}

export function validateOfficialSourceSnapshot(
  snapshot: OfficialSourceSnapshot,
): OfficialSourceSnapshot {
  if (
    !snapshot.snapshotId.trim() ||
    !snapshot.sourceVersion.trim() ||
    !snapshot.artifactReference.trim() ||
    !isTimestamp(snapshot.retrievedAt) ||
    (snapshot.effectiveDate !== null && !isTimestamp(snapshot.effectiveDate))
  ) {
    throw new Error("Resmî kaynak snapshot kaydı geçersiz.");
  }
  if (!getOfficialSource(snapshot.sourceId)) {
    throw new Error("Snapshot bilinmeyen bir resmî kaynağa bağlı.");
  }
  return Object.freeze({
    ...snapshot,
    contentHash: validateSourceContentDigest(snapshot.contentHash),
  });
}

export function validatePackageSourceAttestation(
  attestation: PackageSourceAttestation,
): PackageSourceAttestation {
  const packageKeyParts = parsePackageKey(attestation.packageKey);
  if (
    !packageKeyParts ||
    !attestation.sourceVersion.trim() ||
    !attestation.snapshotId.trim() ||
    !attestation.verificationMethod.trim() ||
    !isTimestamp(attestation.verifiedAt) ||
    attestation.evidenceReferences.length === 0 ||
    attestation.evidenceReferences.some((reference) => !reference.trim())
  ) {
    throw new Error("Paket kaynak attestation kaydı geçersiz.");
  }
  const source = getOfficialSource(attestation.sourceId);
  if (!source) {
    throw new Error("Paket attestation bilinmeyen bir resmî kaynağa bağlı.");
  }
  if (
    attestation.packageKey !== source.packageKey ||
    attestation.sourceVersion !== source.datasetVersion
  ) {
    throw new Error("Paket attestation kayıtlı kaynak paketiyle eşleşmiyor.");
  }
  return Object.freeze({
    ...attestation,
    sourceContentHash: validateSourceContentDigest(attestation.sourceContentHash),
    evidenceReferences: Object.freeze([...attestation.evidenceReferences]),
  });
}
