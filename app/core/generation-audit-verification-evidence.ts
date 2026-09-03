import {
  GENERATION_AUDIT_PACKAGE_INTEGRITY_ALGORITHM,
  GENERATION_AUDIT_PACKAGE_MAX_EVENT_COUNT,
  GENERATION_AUDIT_PACKAGE_MAX_FILE_SIZE_BYTES,
  calculateCanonicalJsonDigest,
  calculateGenerationAuditPackageDigest,
  type GenerationAuditPackageValidationResult,
} from "./generation-audit-package.ts";

export const GENERATION_AUDIT_VERIFICATION_EVIDENCE_SCHEMA_VERSION = "1.0.0" as const;
export const GENERATION_AUDIT_VERIFICATION_POLICY_VERSION = "1.0.0" as const;

export type GenerationAuditVerificationIssue = {
  readonly code: string;
  readonly message: string;
};

export type GenerationAuditVerificationEvidence = {
  readonly schemaVersion: typeof GENERATION_AUDIT_VERIFICATION_EVIDENCE_SCHEMA_VERSION;
  readonly verifiedAt: string;
  readonly sourcePackage: {
    readonly schemaVersion: GenerationAuditPackageValidationResult["schemaVersion"];
    readonly digestAlgorithm: typeof GENERATION_AUDIT_PACKAGE_INTEGRITY_ALGORITHM;
    readonly computedDigest: string;
  };
  readonly result: {
    readonly status: GenerationAuditPackageValidationResult["status"];
    readonly eventCount: number;
    readonly errors: readonly GenerationAuditVerificationIssue[];
    readonly warnings: readonly GenerationAuditVerificationIssue[];
  };
  readonly policy: {
    readonly version: typeof GENERATION_AUDIT_VERIFICATION_POLICY_VERSION;
    readonly maxEventCount: typeof GENERATION_AUDIT_PACKAGE_MAX_EVENT_COUNT;
    readonly maxFileSizeBytes: number;
  };
  readonly containsStudentPersonalData: false;
  readonly evidenceIntegrity: {
    readonly algorithm: typeof GENERATION_AUDIT_PACKAGE_INTEGRITY_ALGORITHM;
    readonly digest: string;
  };
};


export type GenerationAuditVerificationEvidenceValidationResult = {
  readonly status: "valid" | "rejected";
  readonly schemaVersion: typeof GENERATION_AUDIT_VERIFICATION_EVIDENCE_SCHEMA_VERSION | null;
  readonly verifiedAt: string | null;
  readonly sourcePackageSchemaVersion: string | null;
  readonly sourcePackageDigest: string | null;
  readonly evidenceStatus: "valid" | "warning" | "rejected" | null;
  readonly eventCount: number;
  readonly policyVersion: typeof GENERATION_AUDIT_VERIFICATION_POLICY_VERSION | null;
  readonly computedDigest: string | null;
  readonly errors: readonly string[];
};

type EvidenceWithoutIntegrity = Omit<GenerationAuditVerificationEvidence, "evidenceIntegrity">;

const digestPattern = /^[0-9a-f]{64}$/u;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const isTimestamp = (value: string): boolean =>
  value.trim().length > 0 && !Number.isNaN(Date.parse(value));

const issueCode = async (kind: "ERROR" | "WARNING", message: string): Promise<string> =>
  `AUDIT_${kind}_${(await calculateCanonicalJsonDigest(message)).slice(0, 12).toUpperCase()}`;

const toIssues = async (
  kind: "ERROR" | "WARNING",
  messages: readonly string[],
): Promise<readonly GenerationAuditVerificationIssue[]> =>
  Object.freeze(await Promise.all(messages.map(async (message) => Object.freeze({
    code: await issueCode(kind, message),
    message,
  }))));


const issueCodePattern = /^AUDIT_(ERROR|WARNING)_[0-9A-F]{12}$/u;
const forbiddenPersonalDataKeys = new Set([
  "student", "students", "studentid", "studentname", "studentnumber", "schoolnumber",
  "ogrenci", "ogrenciler", "ogrenciadi", "ogrencino", "tckimlikno", "nationalid",
  "identitynumber", "email", "phone", "telephone", "address",
]);

const normalizeKey = (key: string): string =>
  key.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/giu, "").toLocaleLowerCase("en-US");

const collectForbiddenPersonalDataPaths = (value: unknown): readonly string[] => {
  const matches: string[] = [];
  const visit = (candidate: unknown, path: string): void => {
    if (Array.isArray(candidate)) {
      candidate.forEach((item, index) => visit(item, `${path}[${index}]`));
      return;
    }
    if (!isRecord(candidate)) return;
    for (const [key, item] of Object.entries(candidate)) {
      const itemPath = path ? `${path}.${key}` : key;
      if (
        itemPath !== "containsStudentPersonalData" &&
        forbiddenPersonalDataKeys.has(normalizeKey(key))
      ) matches.push(itemPath);
      visit(item, itemPath);
    }
  };
  visit(value, "");
  return Object.freeze(matches);
};

const validateIssues = (
  value: unknown,
  field: "errors" | "warnings",
  errors: string[],
): void => {
  if (!Array.isArray(value)) {
    errors.push(`result.${field} dizi olmalıdır.`);
    return;
  }
  value.forEach((issue, index) => {
    if (!isRecord(issue)) {
      errors.push(`result.${field}[${index}] nesne olmalıdır.`);
      return;
    }
    if (typeof issue.code !== "string" || !issueCodePattern.test(issue.code)) {
      errors.push(`result.${field}[${index}].code geçersizdir.`);
    }
    if (typeof issue.message !== "string" || issue.message.trim().length === 0) {
      errors.push(`result.${field}[${index}].message boş olmayan dize olmalıdır.`);
    }
  });
};

const withoutEvidenceIntegrity = (value: unknown): Record<string, unknown> => {
  if (!isRecord(value)) throw new TypeError("Doğrulama kanıtı nesne olmalıdır.");
  const { evidenceIntegrity: _ignored, ...payload } = value;
  void _ignored;
  return payload;
};

export async function calculateGenerationAuditVerificationEvidenceDigest(
  value: unknown,
): Promise<string> {
  return calculateCanonicalJsonDigest(withoutEvidenceIntegrity(value));
}

export async function createGenerationAuditVerificationEvidence(input: {
  readonly sourcePackage: unknown;
  readonly validation: GenerationAuditPackageValidationResult;
  readonly verifiedAt: string;
}): Promise<GenerationAuditVerificationEvidence> {
  if (!isRecord(input.sourcePackage)) {
    throw new TypeError("Kaynak denetim paketi nesne olmalıdır.");
  }
  if (!isTimestamp(input.verifiedAt)) {
    throw new TypeError("verifiedAt geçerli zaman damgası olmalıdır.");
  }

  const unsigned: EvidenceWithoutIntegrity = Object.freeze({
    schemaVersion: GENERATION_AUDIT_VERIFICATION_EVIDENCE_SCHEMA_VERSION,
    verifiedAt: input.verifiedAt,
    sourcePackage: Object.freeze({
      schemaVersion: input.validation.schemaVersion,
      digestAlgorithm: GENERATION_AUDIT_PACKAGE_INTEGRITY_ALGORITHM,
      computedDigest: await calculateGenerationAuditPackageDigest(input.sourcePackage),
    }),
    result: Object.freeze({
      status: input.validation.status,
      eventCount: input.validation.eventCount,
      errors: await toIssues("ERROR", input.validation.errors),
      warnings: await toIssues("WARNING", input.validation.warnings),
    }),
    policy: Object.freeze({
      version: GENERATION_AUDIT_VERIFICATION_POLICY_VERSION,
      maxEventCount: GENERATION_AUDIT_PACKAGE_MAX_EVENT_COUNT,
      maxFileSizeBytes: GENERATION_AUDIT_PACKAGE_MAX_FILE_SIZE_BYTES,
    }),
    containsStudentPersonalData: false,
  });

  return Object.freeze({
    ...unsigned,
    evidenceIntegrity: Object.freeze({
      algorithm: GENERATION_AUDIT_PACKAGE_INTEGRITY_ALGORITHM,
      digest: await calculateGenerationAuditVerificationEvidenceDigest(unsigned),
    }),
  });
}


export async function validateGenerationAuditVerificationEvidence(
  value: unknown,
): Promise<GenerationAuditVerificationEvidenceValidationResult> {
  const errors: string[] = [];
  let schemaVersion: GenerationAuditVerificationEvidenceValidationResult["schemaVersion"] = null;
  let verifiedAt: string | null = null;
  let sourcePackageSchemaVersion: string | null = null;
  let sourcePackageDigest: string | null = null;
  let evidenceStatus: GenerationAuditVerificationEvidenceValidationResult["evidenceStatus"] = null;
  let eventCount = 0;
  let policyVersion: GenerationAuditVerificationEvidenceValidationResult["policyVersion"] = null;
  let computedDigest: string | null = null;

  if (!isRecord(value)) {
    return Object.freeze({
      status: "rejected",
      schemaVersion,
      verifiedAt,
      sourcePackageSchemaVersion,
      sourcePackageDigest,
      evidenceStatus,
      eventCount,
      policyVersion,
      computedDigest,
      errors: Object.freeze(["Doğrulama kanıtı nesne olmalıdır."]),
    });
  }

  if (value.schemaVersion === GENERATION_AUDIT_VERIFICATION_EVIDENCE_SCHEMA_VERSION) {
    schemaVersion = value.schemaVersion;
  } else {
    errors.push("Doğrulama kanıtı şema sürümü desteklenmiyor.");
  }

  if (typeof value.verifiedAt === "string" && isTimestamp(value.verifiedAt)) {
    verifiedAt = value.verifiedAt;
  } else {
    errors.push("verifiedAt geçerli zaman damgası olmalıdır.");
  }

  if (value.containsStudentPersonalData !== false) {
    errors.push("containsStudentPersonalData değeri false olmalıdır.");
  }

  if (!isRecord(value.sourcePackage)) {
    errors.push("sourcePackage nesne olmalıdır.");
  } else {
    if (typeof value.sourcePackage.schemaVersion === "string" || value.sourcePackage.schemaVersion === null) {
      sourcePackageSchemaVersion = value.sourcePackage.schemaVersion;
    } else {
      errors.push("sourcePackage.schemaVersion dize veya null olmalıdır.");
    }
    if (value.sourcePackage.digestAlgorithm !== GENERATION_AUDIT_PACKAGE_INTEGRITY_ALGORITHM) {
      errors.push("sourcePackage.digestAlgorithm SHA-256 olmalıdır.");
    }
    if (typeof value.sourcePackage.computedDigest === "string" && digestPattern.test(value.sourcePackage.computedDigest)) {
      sourcePackageDigest = value.sourcePackage.computedDigest;
    } else {
      errors.push("sourcePackage.computedDigest geçerli SHA-256 özeti olmalıdır.");
    }
  }

  if (!isRecord(value.result)) {
    errors.push("result nesne olmalıdır.");
  } else {
    if (value.result.status === "valid" || value.result.status === "warning" || value.result.status === "rejected") {
      evidenceStatus = value.result.status;
    } else {
      errors.push("result.status desteklenmiyor.");
    }
    if (Number.isInteger(value.result.eventCount) && Number(value.result.eventCount) >= 0) {
      eventCount = Number(value.result.eventCount);
    } else {
      errors.push("result.eventCount negatif olmayan tam sayı olmalıdır.");
    }
    validateIssues(value.result.errors, "errors", errors);
    validateIssues(value.result.warnings, "warnings", errors);
  }

  if (!isRecord(value.policy)) {
    errors.push("policy nesne olmalıdır.");
  } else {
    if (value.policy.version === GENERATION_AUDIT_VERIFICATION_POLICY_VERSION) {
      policyVersion = value.policy.version;
    } else {
      errors.push("policy.version desteklenmiyor.");
    }
    if (value.policy.maxEventCount !== GENERATION_AUDIT_PACKAGE_MAX_EVENT_COUNT) {
      errors.push("policy.maxEventCount geçerli politika sınırıyla uyuşmuyor.");
    }
    if (value.policy.maxFileSizeBytes !== GENERATION_AUDIT_PACKAGE_MAX_FILE_SIZE_BYTES) {
      errors.push("policy.maxFileSizeBytes geçerli politika sınırıyla uyuşmuyor.");
    }
  }

  const forbiddenPaths = collectForbiddenPersonalDataPaths(value);
  if (forbiddenPaths.length > 0) {
    errors.push(`Öğrenci kişisel verisi anahtarları bulundu: ${forbiddenPaths.join(", ")}`);
  }

  if (
    !isRecord(value.evidenceIntegrity) ||
    value.evidenceIntegrity.algorithm !== GENERATION_AUDIT_PACKAGE_INTEGRITY_ALGORITHM ||
    typeof value.evidenceIntegrity.digest !== "string" ||
    !digestPattern.test(value.evidenceIntegrity.digest)
  ) {
    errors.push("evidenceIntegrity geçerli SHA-256 özeti taşımalıdır.");
  } else {
    try {
      computedDigest = await calculateGenerationAuditVerificationEvidenceDigest(value);
      if (computedDigest !== value.evidenceIntegrity.digest) {
        errors.push("Doğrulama kanıtı SHA-256 bütünlük özeti uyuşmuyor.");
      }
    } catch {
      errors.push("Doğrulama kanıtı özeti hesaplanamadı.");
    }
  }

  return Object.freeze({
    status: errors.length === 0 ? "valid" : "rejected",
    schemaVersion,
    verifiedAt,
    sourcePackageSchemaVersion,
    sourcePackageDigest,
    evidenceStatus,
    eventCount,
    policyVersion,
    computedDigest,
    errors: Object.freeze(errors),
  });
}

export async function validateGenerationAuditVerificationEvidenceIntegrity(
  value: unknown,
): Promise<boolean> {
  if (!isRecord(value) || !isRecord(value.evidenceIntegrity)) return false;
  const { algorithm, digest } = value.evidenceIntegrity;
  if (
    algorithm !== GENERATION_AUDIT_PACKAGE_INTEGRITY_ALGORITHM ||
    typeof digest !== "string" ||
    !digestPattern.test(digest)
  ) return false;

  return await calculateGenerationAuditVerificationEvidenceDigest(value) === digest;
}
