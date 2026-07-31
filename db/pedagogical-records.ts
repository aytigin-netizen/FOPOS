import type { PedagogicalRecord, RecordStatus } from "../app/core/pedagogical-record";
import { getDatabase } from "./runtime-env";
import { listDocumentGenerations } from "./document-generations";

const MAX_RECORD_BYTES = 64_000;
const transitions: Partial<Record<RecordStatus, RecordStatus[]>> = {
  draft: ["in_review"],
  in_review: ["approved"],
  approved: ["superseded"],
};

export type AcademicYearArchiveSummary = {
  academicYear: string;
  recordCount: number;
  revisionCount: number;
};

function validAcademicYear(value: string) {
  const match = /^(\d{4})-(\d{4})$/u.exec(value);
  return Boolean(match && Number(match[2]) === Number(match[1]) + 1);
}

async function currentAcademicYear(userId: string) {
  const row = await getDatabase()
    .prepare(
      `SELECT academic_year
       FROM teacher_profiles
       WHERE user_id = ?
       LIMIT 1`,
    )
    .bind(userId)
    .first<{ academic_year: string }>();
  if (!row || !validAcademicYear(row.academic_year)) {
    throw new Error("Etkin öğretim yılı doğrulanamadı.");
  }
  return row.academic_year;
}

function isRecord(value: unknown): value is PedagogicalRecord {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<PedagogicalRecord>;
  return (
    item.schemaVersion === "1.0.0" &&
    typeof item.recordId === "string" &&
    item.recordId.length >= 8 &&
    Number.isInteger(item.revision) &&
    (item.revision ?? 0) > 0 &&
    ["draft", "in_review", "approved", "superseded"].includes(item.status ?? "") &&
    typeof item.curriculum?.outcomeCode === "string" &&
    typeof item.pedagogicalDecision?.strategy === "string"
  );
}

function immutableData(record: PedagogicalRecord) {
  return JSON.stringify({
    schemaVersion: record.schemaVersion,
    recordId: record.recordId,
    revision: record.revision,
    createdAt: record.createdAt,
    previousRevision: record.previousRevision,
    curriculum: record.curriculum,
    lessonContext: record.lessonContext,
    pedagogicalDecision: record.pedagogicalDecision,
  });
}

async function fingerprint(record: PedagogicalRecord) {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(immutableData(record)),
  );
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

export async function savePedagogicalRecord(
  userId: string,
  value: unknown,
): Promise<PedagogicalRecord[]> {
  if (!isRecord(value)) throw new Error("Pedagojik kayıt doğrulanamadı.");
  const record = value;
  const serialized = JSON.stringify(record);
  if (new TextEncoder().encode(serialized).length > MAX_RECORD_BYTES) {
    throw new Error("Pedagojik kayıt güvenli boyut sınırını aşıyor.");
  }
  if (record.status === "approved" && !record.approval) {
    throw new Error("Onaylanan kayıtta öğretmen beyanı bulunmalıdır.");
  }

  const db = getDatabase();
  const academicYear = await currentAcademicYear(userId);
  const existing = await db
    .prepare(
      `SELECT status, immutable_fingerprint, payload_json, academic_year
       FROM pedagogical_records
       WHERE user_id = ? AND record_id = ? AND revision = ?
         AND deleted_at IS NULL
       LIMIT 1`,
    )
    .bind(userId, record.recordId, record.revision)
    .first<{
      status: RecordStatus;
      immutable_fingerprint: string;
      payload_json: string;
      academic_year: string | null;
    }>();
  const immutableFingerprint = await fingerprint(record);

  if (existing) {
    if (existing.academic_year !== academicYear) {
      throw new Error(
        "Bu pedagojik kayıt farklı bir öğretim yılına aittir ve yerinde değiştirilemez.",
      );
    }
    if (existing.payload_json === serialized) {
      return listPedagogicalRecordRevisions(
        userId,
        record.recordId,
        academicYear,
      );
    }
    if (existing.immutable_fingerprint !== immutableFingerprint) {
      throw new Error("Aynı revizyonun pedagojik içeriği değiştirilemez.");
    }
    if (!transitions[existing.status]?.includes(record.status)) {
      throw new Error(`${existing.status} durumundan ${record.status} durumuna geçilemez.`);
    }
    const result = await db
      .prepare(
        `UPDATE pedagogical_records
         SET status = ?, payload_json = ?, updated_at = ?
         WHERE user_id = ? AND record_id = ? AND revision = ?
           AND academic_year = ?
           AND deleted_at IS NULL`,
      )
      .bind(
        record.status,
        serialized,
        record.updatedAt,
        userId,
        record.recordId,
        record.revision,
        academicYear,
      )
      .run();
    if (!result.success) throw new Error("Pedagojik kayıt güncellenemedi.");
  } else {
    const previous =
      record.revision === 1
        ? null
        : await db
            .prepare(
              `SELECT revision
               FROM pedagogical_records
               WHERE user_id = ? AND record_id = ? AND academic_year = ?
                 AND deleted_at IS NULL
               ORDER BY revision DESC
               LIMIT 1`,
            )
            .bind(userId, record.recordId, academicYear)
            .first<{ revision: number }>();
    if (
      (record.revision === 1 && record.status !== "draft") ||
      (record.revision > 1 && previous?.revision !== record.revision - 1)
    ) {
      throw new Error("Pedagojik kayıt revizyon sırası geçersiz.");
    }
    const result = await db
      .prepare(
        `INSERT INTO pedagogical_records (
          id, user_id, record_id, revision, status, immutable_fingerprint,
          payload_json, academic_year, created_at, updated_at, deleted_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL)`,
      )
      .bind(
        crypto.randomUUID(),
        userId,
        record.recordId,
        record.revision,
        record.status,
        immutableFingerprint,
        serialized,
        academicYear,
        record.createdAt,
        record.updatedAt,
      )
      .run();
    if (!result.success) throw new Error("Pedagojik kayıt kaydedilemedi.");
  }

  return listPedagogicalRecordRevisions(userId, record.recordId, academicYear);
}

export async function listPedagogicalRecordRevisions(
  userId: string,
  recordId: string,
  academicYear?: string,
): Promise<PedagogicalRecord[]> {
  const year = academicYear ?? (await currentAcademicYear(userId));
  const result = await getDatabase()
    .prepare(
      `SELECT payload_json
       FROM pedagogical_records
       WHERE user_id = ? AND record_id = ? AND academic_year = ?
         AND deleted_at IS NULL
       ORDER BY revision ASC
       LIMIT 20`,
    )
    .bind(userId, recordId, year)
    .all<{ payload_json: string }>();

  return (result.results ?? []).map((row) => {
    const parsed: unknown = JSON.parse(row.payload_json);
    if (!isRecord(parsed)) throw new Error("Saklanan pedagojik kayıt bozuk.");
    return parsed;
  });
}

export async function listPedagogicalRecords(
  userId: string,
  academicYear?: string,
): Promise<PedagogicalRecord[]> {
  const year = academicYear ?? (await currentAcademicYear(userId));
  if (!validAcademicYear(year)) throw new Error("Öğretim yılı filtresi geçersiz.");
  const result = await getDatabase()
    .prepare(
      `SELECT payload_json
       FROM pedagogical_records
       WHERE user_id = ? AND academic_year = ?
         AND deleted_at IS NULL
       ORDER BY updated_at DESC, record_id ASC, revision DESC
       LIMIT 200`,
    )
    .bind(userId, year)
    .all<{ payload_json: string }>();

  return (result.results ?? []).map((row) => {
    const parsed: unknown = JSON.parse(row.payload_json);
    if (!isRecord(parsed)) throw new Error("Saklanan pedagojik kayıt bozuk.");
    return parsed;
  });
}

export async function listAcademicYearArchiveSummaries(
  userId: string,
): Promise<AcademicYearArchiveSummary[]> {
  const result = await getDatabase()
    .prepare(
      `SELECT
         academic_year,
         COUNT(*) AS revision_count,
         COUNT(DISTINCT record_id) AS record_count
       FROM pedagogical_records
       WHERE user_id = ?
         AND deleted_at IS NULL
         AND academic_year IS NOT NULL
       GROUP BY academic_year
       ORDER BY academic_year DESC
       LIMIT 20`,
    )
    .bind(userId)
    .all<{
      academic_year: string;
      revision_count: number;
      record_count: number;
    }>();
  return (result.results ?? []).map((row) => ({
    academicYear: row.academic_year,
    recordCount: row.record_count,
    revisionCount: row.revision_count,
  }));
}

export async function listAcademicYearArchive(
  userId: string,
  requestedAcademicYear?: string,
) {
  const activeAcademicYear = await currentAcademicYear(userId);
  const years = await listAcademicYearArchiveSummaries(userId);
  const academicYear = requestedAcademicYear ?? activeAcademicYear;
  if (!validAcademicYear(academicYear)) {
    throw new Error("Öğretim yılı filtresi geçersiz.");
  }
  if (
    academicYear !== activeAcademicYear &&
    !years.some((item) => item.academicYear === academicYear)
  ) {
    throw new Error("İstenen öğretim yılı arşivde bulunamadı.");
  }
  return {
    activeAcademicYear,
    selectedAcademicYear: academicYear,
    years,
    records: await listPedagogicalRecords(userId, academicYear),
    generations: await listDocumentGenerations(userId, academicYear),
  };
}

export async function listAllPedagogicalRecordsForExport(
  userId: string,
): Promise<PedagogicalRecord[]> {
  const db = getDatabase();
  const count = await db
    .prepare(
      `SELECT COUNT(*) AS total
       FROM pedagogical_records
       WHERE user_id = ?
         AND deleted_at IS NULL`,
    )
    .bind(userId)
    .first<{ total: number }>();
  if ((count?.total ?? 0) > 1_000) {
    throw new Error("Hesap arşivi tek pakette dışa aktarma sınırını aşıyor.");
  }
  const result = await db
    .prepare(
      `SELECT payload_json
       FROM pedagogical_records
       WHERE user_id = ?
         AND deleted_at IS NULL
       ORDER BY record_id ASC, revision ASC
       LIMIT 1000`,
    )
    .bind(userId)
    .all<{ payload_json: string }>();

  return (result.results ?? []).map((row) => {
    const parsed: unknown = JSON.parse(row.payload_json);
    if (!isRecord(parsed)) throw new Error("Dışa aktarılacak pedagojik kayıt bozuk.");
    return parsed;
  });
}

export async function listPedagogicalRecordYearAssignments(userId: string) {
  const result = await getDatabase()
    .prepare(
      `SELECT record_id, revision, academic_year
       FROM pedagogical_records
       WHERE user_id = ?
         AND deleted_at IS NULL
       ORDER BY record_id ASC, revision ASC
       LIMIT 1000`,
    )
    .bind(userId)
    .all<{
      record_id: string;
      revision: number;
      academic_year: string | null;
    }>();
  return (result.results ?? []).map((row) => ({
    recordId: row.record_id,
    revision: row.revision,
    academicYear: row.academic_year,
  }));
}

export async function importPedagogicalRecords(
  userId: string,
  values: unknown[],
) {
  if (values.length === 0 || values.length > 200) {
    throw new Error("İçe aktarma paketi 1–200 revizyon içermelidir.");
  }
  const imported: PedagogicalRecord[] = [];
  for (const value of values) {
    if (!isRecord(value)) throw new Error("İçe aktarma paketinde geçersiz kayıt var.");
    const record = value;
    if (record.revision === 1 && record.status !== "draft") {
      const draft = { ...record, status: "draft" as const, approval: null };
      await savePedagogicalRecord(userId, draft);
      if (record.status === "in_review" || record.status === "approved" || record.status === "superseded") {
        await savePedagogicalRecord(userId, { ...record, status: "in_review", approval: null });
      }
      if (record.status === "approved" || record.status === "superseded") {
        await savePedagogicalRecord(userId, { ...record, status: "approved" });
      }
      if (record.status === "superseded") {
        await savePedagogicalRecord(userId, record);
      }
    } else {
      await savePedagogicalRecord(userId, record);
    }
    imported.push(record);
  }
  return { imported: imported.length, records: await listPedagogicalRecords(userId) };
}
