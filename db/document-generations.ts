import type { GenerationProvenance } from "../app/core/opus-generation-bridge";
import type { PedagogicalRecord } from "../app/core/pedagogical-record";
import { assertGenerationMatchesRecord, recordReference, type DocumentGenerationRecord } from "../app/core/document-generation-record";
import { getDatabase } from "./runtime-env";

function isGenerationProvenance(value: unknown): value is GenerationProvenance {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<GenerationProvenance>;
  return item.contractVersion === "1.1.0" && typeof item.eventId === "string" &&
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
        curriculum_dataset_version, curriculum_outcome_code, curriculum_json, academic_year
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).bind(
      eventId, userId, provenance.requestId, provenance.decisionId, recordId,
      revision, provenance.documentType, provenance.contractVersion, provenance.approvedAt,
      generatedAt, provenance.curriculum.curriculumId, record.curriculum.datasetVersion,
      provenance.curriculum.outcomeCode, JSON.stringify(provenance.curriculum), source.academic_year,
  ).run();
  if (!result.success) throw new Error("Üretim izi kalıcı arşive kaydedilemedi.");
  return { ...provenance, eventId, generatedAt, recordId, revision,
    curriculumDatasetVersion: record.curriculum.datasetVersion, academicYear: source.academic_year };
}

export async function listDocumentGenerations(userId: string, academicYear: string): Promise<DocumentGenerationRecord[]> {
  const result = await getDatabase().prepare(
    `SELECT id, request_id, decision_id, record_id, revision, document_type, contract_version,
            approved_at, generated_at, curriculum_dataset_version, curriculum_json, academic_year
     FROM document_generations WHERE user_id = ? AND academic_year = ?
     ORDER BY generated_at DESC LIMIT 500`,
  ).bind(userId, academicYear).all<Record<string, string | number>>();
  return (result.results ?? []).map((row) => ({
    eventId: String(row.id), contractVersion: row.contract_version as "1.1.0", requestId: String(row.request_id),
    decisionId: String(row.decision_id), recordId: String(row.record_id), revision: Number(row.revision),
    documentType: row.document_type as "daily-plan" | "annual-plan" | "exam" | "department-meeting-minutes", teacherId: "current-teacher",
    approvedAt: String(row.approved_at), generatedAt: String(row.generated_at),
    curriculum: JSON.parse(String(row.curriculum_json)),
    curriculumDatasetVersion: String(row.curriculum_dataset_version), academicYear: String(row.academic_year),
  }));
}
