import type { GenerationProvenance } from "../app/core/opus-generation-bridge.ts";
import type { PedagogicalRecord } from "../app/core/pedagogical-record.ts";
import { assertGenerationMatchesRecord, recordReference, type DocumentGenerationRecord } from "../app/core/document-generation-record.ts";
import { getDatabase } from "./runtime-env.ts";
import { isArtifactIntegrity } from "../app/core/artifact-integrity.ts";

function isGenerationProvenance(value: unknown): value is GenerationProvenance {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<GenerationProvenance>;
  return item.contractVersion === "1.2.0" && isArtifactIntegrity(item.artifactIntegrity) && typeof item.eventId === "string" &&
    /^[0-9a-f-]{36}$/iu.test(item.eventId) && typeof item.decisionId === "string" &&
    typeof item.requestId === "string" && item.requestId.length >= 8 &&
    ["daily-plan", "annual-plan", "exam", "department-meeting-minutes"].includes(item.documentType ?? "") && item.teacherId === "current-teacher" &&
    typeof item.approvedAt === "string" && item.curriculum?.moduleId === "fopos" &&
    typeof item.curriculum.curriculumId === "string" && typeof item.curriculum.outcomeCode === "string";
}

export async function saveDocumentGeneration(userId: string, value: unknown): Promise<DocumentGenerationRecord> {
  if (!isGenerationProvenance(value)) throw new Error("Üretim izi doğrulanamadı.");
  const provenance = value;
  const { recordId, revision } = recordReference(provenance.decisionId);
  const db = getDatabase();
  const source = await db.prepare(
    `SELECT payload_json, academic_year FROM pedagogical_records
     WHERE user_id = ? AND record_id = ? AND revision = ?
       AND status = 'approved' AND deleted_at IS NULL LIMIT 1`,
  ).bind(userId, recordId, revision).first<{ payload_json: string; academic_year: string }>();
  if (!source) throw new Error("Üretim izinin onaylı pedagojik kararı bulunamadı.");
  const record = JSON.parse(source.payload_json) as PedagogicalRecord;
  assertGenerationMatchesRecord(provenance, record);
  const eventId = provenance.eventId;
  const generatedAt = new Date().toISOString();
  const result = await db.prepare(
      `INSERT INTO document_generations (
        id, user_id, request_id, decision_id, record_id, revision, document_type,
        contract_version, approved_at, generated_at, curriculum_id,
        curriculum_dataset_version, curriculum_outcome_code, curriculum_json, academic_year,
        artifact_integrity_algorithm, artifact_sha256
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).bind(
      eventId, userId, provenance.requestId, provenance.decisionId, recordId,
      revision, provenance.documentType, provenance.contractVersion, provenance.approvedAt,
      generatedAt, provenance.curriculum.curriculumId, record.curriculum.datasetVersion,
      provenance.curriculum.outcomeCode, JSON.stringify(provenance.curriculum), source.academic_year,
      provenance.artifactIntegrity.algorithm, provenance.artifactIntegrity.digest,
  ).run();
  if (!result.success) throw new Error("Üretim izi kalıcı arşive kaydedilemedi.");
  return { ...provenance, eventId, generatedAt, recordId, revision,
    curriculumDatasetVersion: record.curriculum.datasetVersion, academicYear: source.academic_year };
}

export const DOCUMENT_GENERATION_PAGE_SIZES = [20, 50, 100] as const;
export type DocumentGenerationPageSize = (typeof DOCUMENT_GENERATION_PAGE_SIZES)[number];
export type DocumentGenerationType = DocumentGenerationRecord["documentType"];

export type DocumentGenerationCursorQueryScope = {
  academicYear: string;
  documentType: string | null;
  curriculumSource: string | null;
  eventId: string | null;
  decisionId: string | null;
  requestId: string | null;
  recordId: string | null;
};

export type DocumentGenerationCursor = {
  version: "1.1.0";
  generatedAt: string;
  eventId: string;
  queryScope: DocumentGenerationCursorQueryScope;
};

export type DocumentGenerationPage = {
  items: DocumentGenerationRecord[];
  nextCursor: string | null;
  hasMore: boolean;
  pageSize: DocumentGenerationPageSize;
};

export type DocumentGenerationPageQuery = {
  cursor?: string;
  documentType?: DocumentGenerationType | "all";
  curriculumId?: string;
  search?: string;
  pageSize?: number;
};

const generationTypes = ["daily-plan", "annual-plan", "exam", "department-meeting-minutes"] as const;

const FULL_EVENT_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu;

function validPageSize(value?: number): DocumentGenerationPageSize {
  return DOCUMENT_GENERATION_PAGE_SIZES.includes(value as DocumentGenerationPageSize)
    ? value as DocumentGenerationPageSize
    : 50;
}

function escapeLikePattern(value: string) {
  return value.replace(/([%_\\])/gu, "\\$1");
}

function appendSearchCondition(
  search: string,
  conditions: string[],
  bindings: Array<string | number>,
) {
  const trimmed = search.trim();
  if (!trimmed) return;
  const escaped = escapeLikePattern(trimmed);
  const prefix = `${escaped}%`;
  conditions.push(
    `(id = ? OR id LIKE ? ESCAPE '\\' COLLATE NOCASE OR request_id LIKE ? ESCAPE '\\' COLLATE NOCASE OR decision_id LIKE ? ESCAPE '\\' COLLATE NOCASE OR record_id LIKE ? ESCAPE '\\' COLLATE NOCASE)`,
  );
  bindings.push(trimmed, prefix, prefix, prefix, prefix);
}

function encodeCursor(cursor: DocumentGenerationCursor) {
  return btoa(JSON.stringify(cursor)).replace(/\+/gu, "-").replace(/\//gu, "_").replace(/=+$/gu, "");
}

function decodeCursor(value?: string): DocumentGenerationCursor | null {
  if (!value) return null;
  try {
    const normalized = value.replace(/-/gu, "+").replace(/_/gu, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
    const parsed = JSON.parse(atob(normalized)) as Partial<DocumentGenerationCursor>;
    if (
      parsed.version !== "1.1.0" ||
      typeof parsed.generatedAt !== "string" ||
      Number.isNaN(Date.parse(parsed.generatedAt)) ||
      typeof parsed.eventId !== "string" ||
      !FULL_EVENT_ID_PATTERN.test(parsed.eventId) ||
      !parsed.queryScope ||
      typeof parsed.queryScope.academicYear !== "string" ||
      (parsed.queryScope.documentType !== null && typeof parsed.queryScope.documentType !== "string") ||
      (parsed.queryScope.curriculumSource !== null && typeof parsed.queryScope.curriculumSource !== "string") ||
      (parsed.queryScope.eventId !== null && typeof parsed.queryScope.eventId !== "string") ||
      (parsed.queryScope.decisionId !== null && typeof parsed.queryScope.decisionId !== "string") ||
      (parsed.queryScope.requestId !== null && typeof parsed.queryScope.requestId !== "string") ||
      (parsed.queryScope.recordId !== null && typeof parsed.queryScope.recordId !== "string")
    ) {
      throw new Error("invalid");
    }
    return {
      version: "1.1.0",
      generatedAt: parsed.generatedAt,
      eventId: parsed.eventId,
      queryScope: {
        academicYear: parsed.queryScope.academicYear,
        documentType: parsed.queryScope.documentType,
        curriculumSource: parsed.queryScope.curriculumSource,
        eventId: parsed.queryScope.eventId,
        decisionId: parsed.queryScope.decisionId,
        requestId: parsed.queryScope.requestId,
        recordId: parsed.queryScope.recordId,
      },
    };
  } catch {
    throw new Error("Üretim arşivi imleci geçersiz.");
  }
}

function rowToDocumentGeneration(row: Record<string, string | number>): DocumentGenerationRecord {
  return {
    eventId: String(row.id), contractVersion: row.contract_version as "1.1.0" | "1.2.0", requestId: String(row.request_id),
    decisionId: String(row.decision_id), recordId: String(row.record_id), revision: Number(row.revision),
    documentType: row.document_type as DocumentGenerationType, teacherId: "current-teacher",
    approvedAt: String(row.approved_at), generatedAt: String(row.generated_at),
    curriculum: JSON.parse(String(row.curriculum_json)),
    curriculumDatasetVersion: String(row.curriculum_dataset_version), academicYear: String(row.academic_year),
    artifactIntegrity: row.artifact_sha256 ? {
      algorithm: "SHA-256", digest: String(row.artifact_sha256), source: "final-artifact-bytes",
    } : undefined,
  };
}

export async function listDocumentGenerations(
  userId: string,
  academicYear: string,
  query: DocumentGenerationPageQuery = {},
): Promise<DocumentGenerationPage> {
  const pageSize = validPageSize(query.pageSize);
  const cursor = decodeCursor(query.cursor);
  const yearMatch = /^(\d{4})-(\d{4})$/u.exec(academicYear);
  if (!yearMatch || Number(yearMatch[2]) !== Number(yearMatch[1]) + 1) {
    throw new Error("Öğretim yılı filtresi geçersiz.");
  }

  const search = query.search?.trim() ?? "";
  if (search && search.length < 3 && !FULL_EVENT_ID_PATTERN.test(search)) {
    throw new Error("Arama en az 3 karakter olmalıdır.");
  }

  if (query.documentType && query.documentType !== "all" && !generationTypes.includes(query.documentType as DocumentGenerationType)) {
    throw new Error("Belge türü filtresi geçersiz.");
  }

  const queryScope: DocumentGenerationCursorQueryScope = {
    academicYear,
    documentType: query.documentType && query.documentType !== "all" ? query.documentType : null,
    curriculumSource: query.curriculumId && query.curriculumId !== "all" ? query.curriculumId : null,
    eventId: search || null,
    decisionId: search || null,
    requestId: search || null,
    recordId: search || null,
  };

  if (cursor) {
    const sameScope =
      cursor.queryScope.academicYear === queryScope.academicYear &&
      cursor.queryScope.documentType === queryScope.documentType &&
      cursor.queryScope.curriculumSource === queryScope.curriculumSource &&
      cursor.queryScope.eventId === queryScope.eventId &&
      cursor.queryScope.decisionId === queryScope.decisionId &&
      cursor.queryScope.requestId === queryScope.requestId &&
      cursor.queryScope.recordId === queryScope.recordId;
    if (!sameScope) {
      throw new Error("İmleç mevcut filtre kapsamıyla uyuşmuyor.");
    }
  }

  const conditions = ["user_id = ?", "academic_year = ?"];
  const bindings: Array<string | number> = [userId, academicYear];
  if (query.documentType && query.documentType !== "all") {
    conditions.push("document_type = ?");
    bindings.push(query.documentType);
  }
  if (query.curriculumId && query.curriculumId !== "all") {
    conditions.push("curriculum_id = ?");
    bindings.push(query.curriculumId);
  }
  if (search) {
    appendSearchCondition(search, conditions, bindings);
  }
  if (cursor) {
    conditions.push("(generated_at < ? OR (generated_at = ? AND id < ?))");
    bindings.push(cursor.generatedAt, cursor.generatedAt, cursor.eventId);
  }
  const result = await getDatabase().prepare(
    `SELECT id, request_id, decision_id, record_id, revision, document_type, contract_version,
            approved_at, generated_at, curriculum_dataset_version, curriculum_json, academic_year,
            artifact_integrity_algorithm, artifact_sha256
     FROM document_generations WHERE ${conditions.join(" AND ")}
     ORDER BY generated_at DESC, id DESC LIMIT ?`,
  ).bind(...bindings, pageSize + 1).all<Record<string, string | number>>();
  const rows = result.results ?? [];
  const hasMore = rows.length > pageSize;
  const items = rows.slice(0, pageSize).map(rowToDocumentGeneration);
  const last = items.at(-1);
  return {
    items,
    hasMore,
    pageSize,
    nextCursor: hasMore && last
      ? encodeCursor({ version: "1.1.0", generatedAt: last.generatedAt, eventId: last.eventId, queryScope })
      : null,
  };
}

export async function listDocumentGenerationCurricula(
  userId: string,
  academicYear: string,
): Promise<string[]> {
  const result = await getDatabase()
    .prepare(
      `SELECT DISTINCT curriculum_id
       FROM document_generations
       WHERE user_id = ?
         AND academic_year = ?
       ORDER BY curriculum_id ASC`,
    )
    .bind(userId, academicYear)
    .all<{ curriculum_id: string }>();

  return (result.results ?? []).map((row) => String(row.curriculum_id));
}
