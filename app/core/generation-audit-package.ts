import { isArtifactIntegrity } from "./artifact-integrity.ts";
import { OPUS_DOCUMENT_TYPES } from "./opus-generation-bridge.ts";

export const GENERATION_AUDIT_PACKAGE_SCHEMA_VERSION = "1.2.0" as const;
export const GENERATION_AUDIT_PACKAGE_INTEGRITY_ALGORITHM = "SHA-256" as const;
export const GENERATION_AUDIT_PACKAGE_MAX_EVENT_COUNT = 10_000 as const;
export const GENERATION_AUDIT_PACKAGE_MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024;

export function isGenerationAuditPackageFileSizeAllowed(fileSizeBytes: number): boolean {
  return Number.isInteger(fileSizeBytes)
    && fileSizeBytes >= 0
    && fileSizeBytes <= GENERATION_AUDIT_PACKAGE_MAX_FILE_SIZE_BYTES;
}

export type GenerationAuditPackageValidationStatus = "valid" | "warning" | "rejected";
export type GenerationAuditPackageValidationResult = {
  readonly status: GenerationAuditPackageValidationStatus;
  readonly schemaVersion: "1.1.0" | "1.2.0" | null;
  readonly eventCount: number;
  readonly computedDigest: string | null;
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
};

type QueryScope =
  | { readonly type: "academic-year"; readonly academicYear: string }
  | {
      readonly type: "search-results";
      readonly academicYear: string;
      readonly documentType?: string;
      readonly curriculumSource?: string;
      readonly eventId?: string;
      readonly decisionId?: string;
      readonly requestId?: string;
      readonly recordId?: string;
    };

type AuditPackageInput = {
  readonly exportedAt: string;
  readonly academicYear: string;
  readonly exportScope: QueryScope["type"];
  readonly queryScope: QueryScope;
  readonly containsStudentPersonalData: false;
  readonly events: readonly unknown[];
};

type JsonValue = null | boolean | number | string | readonly JsonValue[] | { readonly [key: string]: JsonValue };

const digestPattern = /^[0-9a-f]{64}$/u;
const prefixPattern = /^\S{3,}$/u;
const forbiddenPersonalDataKeys = new Set([
  "student", "students", "studentid", "studentname", "studentnumber", "schoolnumber",
  "ogrenci", "ogrenciler", "ogrenciadi", "ogrencino", "tckimlikno", "nationalid",
  "identitynumber", "email", "phone", "telephone", "address",
]);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const isNonEmptyText = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const isTimestamp = (value: unknown): value is string =>
  isNonEmptyText(value) && !Number.isNaN(Date.parse(value));

const isAcademicYear = (value: unknown): value is string => {
  if (typeof value !== "string") return false;
  const match = /^(\d{4})-(\d{4})$/u.exec(value.trim());
  return Boolean(match && Number(match[2]) === Number(match[1]) + 1);
};

const isQueryScope = (value: unknown): value is QueryScope => {
  if (!isRecord(value) || !isAcademicYear(value.academicYear)) return false;
  if (value.type === "academic-year") {
    return Object.keys(value).every((key) => key === "type" || key === "academicYear");
  }
  if (value.type !== "search-results") return false;
  if (value.documentType !== undefined &&
    (typeof value.documentType !== "string" || !OPUS_DOCUMENT_TYPES.includes(value.documentType as (typeof OPUS_DOCUMENT_TYPES)[number]))) return false;
  if (value.curriculumSource !== undefined && !isNonEmptyText(value.curriculumSource)) return false;
  return [value.eventId, value.decisionId, value.requestId, value.recordId]
    .every((item) => item === undefined || (typeof item === "string" && prefixPattern.test(item.trim())));
};

const stableJsonValue = (value: unknown): JsonValue => {
  if (value === null || typeof value === "boolean" || typeof value === "string") return value;
  if (typeof value === "number") {
    if (!Number.isFinite(value)) throw new TypeError("Denetim paketi sonlu olmayan sayı içeremez.");
    return value;
  }
  if (Array.isArray(value)) return value.map(stableJsonValue);
  if (!isRecord(value)) throw new TypeError("Denetim paketi yalnızca JSON değerleri içermelidir.");
  return Object.freeze(Object.fromEntries(
    Object.keys(value).sort().filter((key) => value[key] !== undefined)
      .map((key) => [key, stableJsonValue(value[key])]),
  ));
};

const canonicalize = (value: unknown): string => JSON.stringify(stableJsonValue(value));

const withoutPackageIntegrity = (value: unknown): Record<string, unknown> => {
  if (!isRecord(value)) throw new TypeError("Denetim paketi nesne olmalıdır.");
  const { packageIntegrity: _ignored, ...payload } = value;
  return payload;
};

const bytesToHex = (bytes: Uint8Array): string =>
  Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");

export async function calculateGenerationAuditPackageDigest(value: unknown): Promise<string> {
  const bytes = new TextEncoder().encode(canonicalize(withoutPackageIntegrity(value)));
  const digest = await crypto.subtle.digest(GENERATION_AUDIT_PACKAGE_INTEGRITY_ALGORITHM, bytes);
  return bytesToHex(new Uint8Array(digest));
}

export async function createGenerationAuditPackage(input: AuditPackageInput) {
  const unsigned = Object.freeze({
    schemaVersion: GENERATION_AUDIT_PACKAGE_SCHEMA_VERSION,
    ...input,
    eventCount: input.events.length,
  });
  return Object.freeze({
    ...unsigned,
    packageIntegrity: Object.freeze({
      algorithm: GENERATION_AUDIT_PACKAGE_INTEGRITY_ALGORITHM,
      digest: await calculateGenerationAuditPackageDigest(unsigned),
    }),
  });
}

const safeDigestEqual = (left: string, right: string): boolean => {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
};

const normalizeKey = (key: string): string =>
  key.normalize("NFD").replace(/[\u0300-\u036f]/gu, "").replace(/[^a-z0-9]/giu, "").toLocaleLowerCase("en-US");

const findPersonalDataKeys = (value: unknown): string[] => {
  const matches = new Set<string>();
  const visit = (candidate: unknown, path: string): void => {
    if (Array.isArray(candidate)) {
      candidate.forEach((item, index) => visit(item, `${path}[${index}]`));
      return;
    }
    if (!isRecord(candidate)) return;
    for (const [key, item] of Object.entries(candidate)) {
      const childPath = path ? `${path}.${key}` : key;
      if (childPath !== "containsStudentPersonalData" && forbiddenPersonalDataKeys.has(normalizeKey(key))) {
        matches.add(childPath);
      }
      visit(item, childPath);
    }
  };
  visit(value, "");
  return [...matches].sort();
};

const validateEvent = (event: unknown, index: number, academicYear: string, errors: string[]): string | null => {
  const field = `events[${index}]`;
  if (!isRecord(event)) {
    errors.push(`${field} nesne olmalıdır.`);
    return null;
  }
  for (const key of ["eventId", "requestId", "decisionId", "recordId", "contractVersion", "curriculumDatasetVersion"] as const) {
    if (!isNonEmptyText(event[key])) errors.push(`${field}.${key} boş olmayan dize olmalıdır.`);
  }
  if (!Number.isInteger(event.revision) || Number(event.revision) < 1) errors.push(`${field}.revision pozitif tam sayı olmalıdır.`);
  if (typeof event.documentType !== "string" ||
    !OPUS_DOCUMENT_TYPES.includes(event.documentType as (typeof OPUS_DOCUMENT_TYPES)[number])) errors.push(`${field}.documentType desteklenmiyor.`);
  if (!isTimestamp(event.approvedAt)) errors.push(`${field}.approvedAt geçerli zaman damgası olmalıdır.`);
  if (!isTimestamp(event.generatedAt)) errors.push(`${field}.generatedAt geçerli zaman damgası olmalıdır.`);
  if (event.academicYear !== academicYear) errors.push(`${field}.academicYear paket öğretim yılıyla uyuşmuyor.`);
  if (!isRecord(event.curriculum)) errors.push(`${field}.curriculum nesne olmalıdır.`);
  else for (const key of ["moduleId", "curriculumId", "gradeLevelId", "unitId", "outcomeCode"] as const) {
    if (!isNonEmptyText(event.curriculum[key])) errors.push(`${field}.curriculum.${key} boş olmayan dize olmalıdır.`);
  }
  if (event.artifactIntegrity !== null && !isArtifactIntegrity(event.artifactIntegrity)) {
    errors.push(`${field}.artifactIntegrity geçersizdir.`);
  }
  return typeof event.eventId === "string" ? event.eventId : null;
};

export function rejectedGenerationAuditPackageResult(message: string): GenerationAuditPackageValidationResult {
  return Object.freeze({
    status: "rejected" as const,
    schemaVersion: null,
    eventCount: 0,
    computedDigest: null,
    errors: Object.freeze([message]),
    warnings: Object.freeze([]),
  });
}

export async function validateGenerationAuditPackage(value: unknown): Promise<GenerationAuditPackageValidationResult> {
  if (!isRecord(value)) return rejectedGenerationAuditPackageResult("Denetim paketi nesne olmalıdır.");
  const errors: string[] = [];
  const warnings: string[] = [];
  const schemaVersion = value.schemaVersion === "1.1.0" || value.schemaVersion === "1.2.0" ? value.schemaVersion : null;
  let eventCount = 0;
  let computedDigest: string | null = null;

  if (!schemaVersion) errors.push("Denetim paketi şema sürümü desteklenmiyor.");
  if (!isTimestamp(value.exportedAt)) errors.push("exportedAt geçerli zaman damgası olmalıdır.");
  const academicYear = isAcademicYear(value.academicYear) ? value.academicYear.trim() : "";
  if (!academicYear) errors.push("academicYear geçersizdir.");
  if (value.containsStudentPersonalData !== false) errors.push("containsStudentPersonalData değeri false olmalıdır.");
  if (!isQueryScope(value.queryScope)) errors.push("queryScope OPUS arşiv sözleşmesine uymuyor.");
  else {
    if (value.exportScope !== value.queryScope.type) errors.push("exportScope ile queryScope.type uyuşmuyor.");
    if (academicYear && value.queryScope.academicYear !== academicYear) errors.push("queryScope.academicYear paket öğretim yılıyla uyuşmuyor.");
  }

  if (!Array.isArray(value.events)) errors.push("events dizi olmalıdır.");
  else {
    eventCount = value.events.length;
    if (eventCount > GENERATION_AUDIT_PACKAGE_MAX_EVENT_COUNT) {
      errors.push(
        `Denetim paketi en fazla ${GENERATION_AUDIT_PACKAGE_MAX_EVENT_COUNT.toLocaleString("tr-TR")} olay içerebilir.`,
      );
    } else {
      const eventIds = new Set<string>();
      value.events.forEach((event, index) => {
        const eventId = validateEvent(event, index, academicYear, errors);
        if (eventId && eventIds.has(eventId)) errors.push(`Yinelenen olay kimliği: ${eventId}`);
        if (eventId) eventIds.add(eventId);
      });
    }
  }

  const personalDataKeys = findPersonalDataKeys(value);
  if (personalDataKeys.length) errors.push(`Öğrenci kişisel verisi anahtarları bulundu: ${personalDataKeys.join(", ")}`);

  if (schemaVersion === "1.2.0") {
    if (!Number.isInteger(value.eventCount) || value.eventCount !== eventCount) errors.push("eventCount olay dizisinin uzunluğuyla uyuşmuyor.");
    const integrity = value.packageIntegrity;
    if (!isRecord(integrity) || integrity.algorithm !== "SHA-256" ||
      typeof integrity.digest !== "string" || !digestPattern.test(integrity.digest)) {
      errors.push("packageIntegrity geçerli SHA-256 özeti taşımalıdır.");
    } else {
      computedDigest = await calculateGenerationAuditPackageDigest(value);
      if (!safeDigestEqual(computedDigest, integrity.digest)) errors.push("Denetim paketi SHA-256 bütünlük özeti uyuşmuyor.");
    }
  } else if (schemaVersion === "1.1.0") {
    warnings.push("Eski 1.1.0 paketi bütünlük özeti taşımıyor; içerik değişmezliği doğrulanamadı.");
  }

  return Object.freeze({
    status: errors.length ? "rejected" as const : warnings.length ? "warning" as const : "valid" as const,
    schemaVersion,
    eventCount,
    computedDigest,
    errors: Object.freeze(errors),
    warnings: Object.freeze(warnings),
  });
}
