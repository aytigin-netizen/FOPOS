export const ARTIFACT_INTEGRITY_ALGORITHM = "SHA-256" as const;
export const ARTIFACT_INTEGRITY_SOURCE = "final-artifact-bytes" as const;

export type ArtifactIntegrity = {
  readonly algorithm: typeof ARTIFACT_INTEGRITY_ALGORITHM;
  readonly digest: string;
  readonly source: typeof ARTIFACT_INTEGRITY_SOURCE;
};

const SHA256_HEX = /^[0-9a-f]{64}$/u;

export function isArtifactIntegrity(value: unknown): value is ArtifactIntegrity {
  if (!value || typeof value !== "object") return false;
  const integrity = value as Partial<ArtifactIntegrity>;
  return integrity.algorithm === ARTIFACT_INTEGRITY_ALGORITHM &&
    integrity.source === ARTIFACT_INTEGRITY_SOURCE &&
    typeof integrity.digest === "string" && SHA256_HEX.test(integrity.digest);
}

export async function sha256Hex(bytes: ArrayBuffer): Promise<string> {
  const digest = await crypto.subtle.digest(ARTIFACT_INTEGRITY_ALGORITHM, bytes);
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function artifactIntegrity(blob: Blob): Promise<ArtifactIntegrity> {
  return Object.freeze({
    algorithm: ARTIFACT_INTEGRITY_ALGORITHM,
    digest: await sha256Hex(await blob.arrayBuffer()),
    source: ARTIFACT_INTEGRITY_SOURCE,
  });
}
