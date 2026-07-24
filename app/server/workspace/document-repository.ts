import {
  WORKSPACE_SCHEMA_VERSION,
  type WorkspaceDocument,
} from "../../core/secure-workspace.ts";
import type { SessionDatabase } from "../auth/session-repository.ts";

const MAX_DOCUMENT_PAYLOAD_BYTES = 512_000;

interface DocumentRow {
  id: string;
  owner_user_id: string;
  workspace_id: string;
  kind: WorkspaceDocument["kind"];
  state: WorkspaceDocument["state"];
  revision: number;
  previous_revision_id: string | null;
  schema_version: typeof WORKSPACE_SCHEMA_VERSION;
  trace_id: string;
  curriculum_source_refs_json: string;
  created_at: string;
  updated_at: string;
}

export interface StoredWorkspaceDocument extends WorkspaceDocument {
  payload: unknown;
}

function serializePayload(payload: unknown): string {
  const serialized = JSON.stringify(payload);
  const bytes = new TextEncoder().encode(serialized).length;

  if (bytes > MAX_DOCUMENT_PAYLOAD_BYTES) {
    throw new Error("Belge güvenli saklama boyutu sınırını aşıyor.");
  }

  return serialized;
}

function parseStringArray(value: string): string[] {
  const parsed: unknown = JSON.parse(value);
  if (
    !Array.isArray(parsed) ||
    parsed.some((item) => typeof item !== "string")
  ) {
    throw new Error("Belgenin müfredat kaynakları doğrulanamadı.");
  }
  return parsed;
}

function toDocument(row: DocumentRow, payload: unknown): StoredWorkspaceDocument {
  if (row.schema_version !== WORKSPACE_SCHEMA_VERSION) {
    throw new Error("Belge şema sürümü desteklenmiyor.");
  }

  return {
    schemaVersion: row.schema_version,
    id: row.id,
    ownerUserId: row.owner_user_id,
    workspaceId: row.workspace_id,
    kind: row.kind,
    state: row.state,
    revision: row.revision,
    previousRevisionId: row.previous_revision_id,
    curriculumSourceRefs: parseStringArray(row.curriculum_source_refs_json),
    traceId: row.trace_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    payload,
  };
}

export async function insertWorkspaceDocument(
  database: SessionDatabase,
  document: StoredWorkspaceDocument,
): Promise<void> {
  if (!document.ownerUserId || !document.workspaceId || !document.id) {
    throw new Error("Belge sahiplik bilgisi eksik.");
  }
  if (document.state !== "draft") {
    throw new Error("Yeni belge yalnız taslak durumunda oluşturulabilir.");
  }

  const payloadJson = serializePayload(document.payload);
  const result = await database
    .prepare(
      `INSERT INTO workspace_documents (
        id, owner_user_id, workspace_id, kind, state, revision,
        previous_revision_id, schema_version, trace_id,
        curriculum_source_refs_json, payload_json, created_at, updated_at
      ) VALUES (?, ?, ?, ?, 'draft', ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      document.id,
      document.ownerUserId,
      document.workspaceId,
      document.kind,
      document.revision,
      document.previousRevisionId,
      document.schemaVersion,
      document.traceId,
      JSON.stringify(document.curriculumSourceRefs),
      payloadJson,
      document.createdAt,
      document.updatedAt,
    )
    .run();

  if (!result.success) throw new Error("Çalışma alanı belgesi kaydedilemedi.");
}

export async function findWorkspaceDocument(
  database: SessionDatabase,
  scope: { userId: string; workspaceId: string },
  documentId: string,
): Promise<StoredWorkspaceDocument | null> {
  const row = await database
    .prepare(
      `SELECT
         id, owner_user_id, workspace_id, kind, state, revision,
         previous_revision_id, schema_version, trace_id,
         curriculum_source_refs_json, created_at, updated_at, payload_json
       FROM workspace_documents
       WHERE id = ? AND owner_user_id = ? AND workspace_id = ?
       LIMIT 1`,
    )
    .bind(documentId, scope.userId, scope.workspaceId)
    .first<DocumentRow & { payload_json: string }>();

  if (!row) return null;

  let payload: unknown;
  try {
    payload = JSON.parse(row.payload_json);
  } catch {
    throw new Error("Belge içeriği bozuk; otomatik olarak değiştirilmedi.");
  }

  return toDocument(row, payload);
}

export async function listWorkspaceDocuments(
  database: SessionDatabase,
  scope: { userId: string; workspaceId: string },
  kind?: WorkspaceDocument["kind"],
): Promise<WorkspaceDocument[]> {
  const statement = kind
    ? database
        .prepare(
          `SELECT
             id, owner_user_id, workspace_id, kind, state, revision,
             previous_revision_id, schema_version, trace_id,
             curriculum_source_refs_json, created_at, updated_at
           FROM workspace_documents
           WHERE owner_user_id = ? AND workspace_id = ? AND kind = ?
           ORDER BY updated_at DESC
           LIMIT 100`,
        )
        .bind(scope.userId, scope.workspaceId, kind)
    : database
        .prepare(
          `SELECT
             id, owner_user_id, workspace_id, kind, state, revision,
             previous_revision_id, schema_version, trace_id,
             curriculum_source_refs_json, created_at, updated_at
           FROM workspace_documents
           WHERE owner_user_id = ? AND workspace_id = ?
           ORDER BY updated_at DESC
           LIMIT 100`,
        )
        .bind(scope.userId, scope.workspaceId);

  const result = await statement.run<DocumentRow>();
  if (!result.success) throw new Error("Çalışma alanı belgeleri listelenemedi.");

  return (result.results ?? []).map((row) => {
    const { payload: _payload, ...document } = toDocument(row, null);
    return document;
  });
}
