import {
  calculateGenerationAuditPackageDigest,
  rejectedGenerationAuditPackageResult,
  validateGenerationAuditPackage,
  type GenerationAuditPackageValidationResult,
} from "./generation-audit-package.ts";
import {
  validateGenerationAuditVerificationEvidence,
  type GenerationAuditVerificationEvidenceValidationResult,
} from "./generation-audit-verification-evidence.ts";

export type GenerationAuditPackageEvidenceMatchResult = {
  readonly status: "matched" | "rejected";
  readonly computedPackageDigest: string | null;
  readonly evidencePackageDigest: string | null;
  readonly packageValidation: GenerationAuditPackageValidationResult;
  readonly evidenceValidation: GenerationAuditVerificationEvidenceValidationResult;
  readonly errors: readonly string[];
};

export async function matchGenerationAuditPackageToVerificationEvidence(input: {
  readonly sourcePackage: unknown;
  readonly evidence: unknown;
}): Promise<GenerationAuditPackageEvidenceMatchResult> {
  const errors: string[] = [];
  const evidenceValidation = await validateGenerationAuditVerificationEvidence(input.evidence);

  let packageValidation: GenerationAuditPackageValidationResult;
  try {
    packageValidation = await validateGenerationAuditPackage(input.sourcePackage);
  } catch (error) {
    packageValidation = rejectedGenerationAuditPackageResult(
      error instanceof Error ? error.message : "Denetim paketi doğrulanamadı.",
    );
  }

  let computedPackageDigest: string | null = null;
  try {
    computedPackageDigest = await calculateGenerationAuditPackageDigest(input.sourcePackage);
  } catch (error) {
    errors.push(error instanceof Error ? error.message : "Denetim paketi SHA-256 özeti hesaplanamadı.");
  }

  if (evidenceValidation.status !== "valid") {
    errors.push("Doğrulama kanıtı geçerli değildir.");
  }
  if (packageValidation.status === "rejected") {
    errors.push("Denetim paketi geçerli değildir.");
  }

  const evidencePackageDigest = evidenceValidation.sourcePackageDigest;
  if (
    computedPackageDigest !== null &&
    evidencePackageDigest !== null &&
    computedPackageDigest !== evidencePackageDigest
  ) {
    errors.push("Denetim paketi SHA-256 özeti doğrulama kanıtındaki kaynak paket özetiyle uyuşmuyor.");
  }

  if (
    evidenceValidation.sourcePackageSchemaVersion !== null &&
    packageValidation.schemaVersion !== evidenceValidation.sourcePackageSchemaVersion
  ) {
    errors.push("Denetim paketi şema sürümü doğrulama kanıtıyla uyuşmuyor.");
  }

  if (packageValidation.eventCount !== evidenceValidation.eventCount) {
    errors.push("Denetim paketi olay sayısı doğrulama kanıtıyla uyuşmuyor.");
  }

  if (
    evidenceValidation.evidenceStatus !== null &&
    packageValidation.status !== evidenceValidation.evidenceStatus
  ) {
    errors.push("Denetim paketi doğrulama sonucu doğrulama kanıtıyla uyuşmuyor.");
  }

  return Object.freeze({
    status: errors.length === 0 ? "matched" : "rejected",
    computedPackageDigest,
    evidencePackageDigest,
    packageValidation,
    evidenceValidation,
    errors: Object.freeze([...new Set(errors)]),
  });
}
