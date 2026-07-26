import type { PedagogicalRecord, RecordStatus } from "./pedagogical-record";

export type KeyValueStorage = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
};
type Archive = { schemaVersion: "1.0.0"; records: Record<string, PedagogicalRecord[]> };
export type RecordArchiveStatus = {
  state: "empty" | "ready" | "corrupt" | "unsupported" | "oversized";
  bytes: number;
  recordCount: number;
  revisionCount: number;
  message: string;
};
export class RecordArchiveError extends Error {
  readonly code: Exclude<RecordArchiveStatus["state"], "empty" | "ready">;
  constructor(code: Exclude<RecordArchiveStatus["state"], "empty" | "ready">, message: string) {
    super(message);
    this.code = code;
    this.name = "RecordArchiveError";
  }
}

export const RECORD_ARCHIVE_KEY = "opus.pedagogical-records.v1";
export const RECORD_ARCHIVE_LIMITS = { maxBytes: 512_000, maxRecords: 100, maxRevisionsPerRecord: 20 } as const;
const transitions: Partial<Record<RecordStatus, RecordStatus[]>> = { draft: ["in_review"], in_review: ["approved"], approved: ["superseded"] };
const emptyArchive = (): Archive => ({ schemaVersion: "1.0.0", records: {} });
const byteLength = (value: string) => new TextEncoder().encode(value).length;
const isRecord = (value: unknown): value is PedagogicalRecord => {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<PedagogicalRecord>;
  return item.schemaVersion === "1.0.0" && typeof item.recordId === "string" && Number.isInteger(item.revision) &&
    ["draft", "in_review", "approved", "superseded"].includes(item.status ?? "") &&
    typeof item.curriculum?.outcomeCode === "string" && typeof item.lessonContext?.week === "number" &&
    typeof item.pedagogicalDecision?.strategy === "string";
};

function parseArchive(raw: string): Archive {
  if (byteLength(raw) > RECORD_ARCHIVE_LIMITS.maxBytes) throw new RecordArchiveError("oversized", "Yerel pedagojik kayıt arşivi güvenli boyut sınırını aşıyor.");
  let value: unknown;
  try { value = JSON.parse(raw); } catch { throw new RecordArchiveError("corrupt", "Yerel pedagojik kayıt arşivi bozuk; otomatik olarak silinmedi."); }
  if (!value || typeof value !== "object") throw new RecordArchiveError("corrupt", "Yerel pedagojik kayıt arşivinin yapısı geçersiz.");
  const candidate = value as Partial<Archive>;
  if (candidate.schemaVersion !== "1.0.0") throw new RecordArchiveError("unsupported", "Yerel arşiv sürümü bu uygulamayla uyumlu değil; otomatik dönüştürme yapılmadı.");
  if (!candidate.records || typeof candidate.records !== "object" || Array.isArray(candidate.records)) throw new RecordArchiveError("corrupt", "Yerel pedagojik kayıt arşivinin kayıt alanı geçersiz.");
  const entries = Object.entries(candidate.records);
  if (entries.length > RECORD_ARCHIVE_LIMITS.maxRecords) throw new RecordArchiveError("oversized", "Yerel arşiv güvenli kayıt sayısı sınırını aşıyor.");
  for (const [recordId, history] of entries) {
    if (!Array.isArray(history) || history.length > RECORD_ARCHIVE_LIMITS.maxRevisionsPerRecord || history.some((record) => !isRecord(record) || record.recordId !== recordId)) {
      throw new RecordArchiveError("corrupt", "Yerel arşivde doğrulanamayan veya sınırı aşan revizyon geçmişi var.");
    }
  }
  return candidate as Archive;
}

function read(storage: KeyValueStorage): Archive {
  const raw = storage.getItem(RECORD_ARCHIVE_KEY);
  return raw ? parseArchive(raw) : emptyArchive();
}
function fingerprint(record: PedagogicalRecord) {
  return JSON.stringify({ schemaVersion: record.schemaVersion, recordId: record.recordId, revision: record.revision, createdAt: record.createdAt, previousRevision: record.previousRevision, curriculum: record.curriculum, lessonContext: record.lessonContext, pedagogicalDecision: record.pedagogicalDecision });
}
function write(storage: KeyValueStorage, archive: Archive) {
  const serialized = JSON.stringify(archive);
  if (byteLength(serialized) > RECORD_ARCHIVE_LIMITS.maxBytes) throw new RecordArchiveError("oversized", "Yeni kayıt yerel arşivin güvenli boyut sınırını aşar; kayıt yapılmadı.");
  try { storage.setItem(RECORD_ARCHIVE_KEY, serialized); } catch { throw new Error("Tarayıcı yerel arşive yazamadı; mevcut kayıtlar değiştirilmedi."); }
}

export function saveRecordRevision(storage: KeyValueStorage, record: PedagogicalRecord) {
  if (!isRecord(record)) throw new Error("Pedagojik kayıt şeması doğrulanamadı.");
  const archive = read(storage), history = archive.records[record.recordId] ?? [], index = history.findIndex((item) => item.revision === record.revision);
  if (index >= 0) {
    const existing = history[index];
    if (JSON.stringify(existing) === JSON.stringify(record)) return;
    if (fingerprint(existing) !== fingerprint(record)) throw new Error("Aynı revizyonun pedagojik içeriği sessizce değiştirilemez.");
    if (!transitions[existing.status]?.includes(record.status)) throw new Error(`${existing.status} durumundan ${record.status} durumuna geçilemez.`);
    if (record.status === "approved" && !record.approval) throw new Error("Onaylanan kayıtta öğretmen onayı bulunmalıdır.");
    archive.records[record.recordId] = history.map((item, itemIndex) => itemIndex === index ? record : item);
  } else {
    const previous = history.at(-1);
    if (history.length >= RECORD_ARCHIVE_LIMITS.maxRevisionsPerRecord) throw new RecordArchiveError("oversized", "Bu kaydın güvenli revizyon sınırına ulaşıldı; eski revizyonlar otomatik silinmedi.");
    if (!previous && Object.keys(archive.records).length >= RECORD_ARCHIVE_LIMITS.maxRecords) throw new RecordArchiveError("oversized", "Yerel arşivin güvenli kayıt sayısı sınırına ulaşıldı.");
    if (previous && record.revision !== previous.revision + 1) throw new Error("Revizyon sırası kesintili olamaz.");
    if (!previous && record.revision !== 1) throw new Error("Arşiv ilk revizyonla başlamalıdır.");
    archive.records[record.recordId] = [...history, record];
  }
  write(storage, archive);
}

export function listRecordRevisions(storage: KeyValueStorage, recordId: string) {
  return [...(read(storage).records[recordId] ?? [])].sort((a, b) => a.revision - b.revision);
}
export function inspectRecordArchive(storage: KeyValueStorage): RecordArchiveStatus {
  const raw = storage.getItem(RECORD_ARCHIVE_KEY);
  if (!raw) return { state: "empty", bytes: 0, recordCount: 0, revisionCount: 0, message: "Yerel arşiv boş." };
  try {
    const archive = parseArchive(raw), histories = Object.values(archive.records);
    return { state: "ready", bytes: byteLength(raw), recordCount: histories.length, revisionCount: histories.reduce((sum, history) => sum + history.length, 0), message: "Yerel arşiv doğrulandı." };
  } catch (error) {
    const known = error instanceof RecordArchiveError ? error : new RecordArchiveError("corrupt", "Yerel arşiv doğrulanamadı.");
    return { state: known.code, bytes: byteLength(raw), recordCount: 0, revisionCount: 0, message: known.message };
  }
}
export function readRecordArchiveRecords(storage: KeyValueStorage) {
  const archive = read(storage);
  return Object.values(archive.records)
    .flat()
    .sort((a, b) =>
      a.recordId === b.recordId
        ? a.revision - b.revision
        : a.recordId.localeCompare(b.recordId),
    );
}
export function clearRecordArchive(storage: KeyValueStorage, confirmed: boolean) {
  if (!confirmed) throw new Error("Yerel arşivi temizlemek için öğretmen onayı gerekir.");
  storage.removeItem(RECORD_ARCHIVE_KEY);
}
