export const STUDENT_IMPORT_LIMITS = {
  maxFileBytes: 5 * 1024 * 1024,
  maxExpandedXlsxBytes: 20 * 1024 * 1024,
  maxZipEntries: 256,
  maxZipCompressionRatio: 100,
  maxRows: 1000,
  maxColumns: 64,
  maxStudents: 500,
  maxCellCharacters: 200,
} as const;

const XLS_MAGIC = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1] as const;
const ZIP_LOCAL_MAGIC = [0x50, 0x4b, 0x03, 0x04] as const;
const ZIP_EMPTY_MAGIC = [0x50, 0x4b, 0x05, 0x06] as const;
const ZIP_SPANNED_MAGIC = [0x50, 0x4b, 0x07, 0x08] as const;

const startsWith = (bytes: Uint8Array, signature: readonly number[]) =>
  signature.every((value, index) => bytes[index] === value);

export function assertSpreadsheetSignature(extension: string, bytes: Uint8Array) {
  const isXls = startsWith(bytes, XLS_MAGIC);
  const isZip = startsWith(bytes, ZIP_LOCAL_MAGIC) || startsWith(bytes, ZIP_EMPTY_MAGIC) || startsWith(bytes, ZIP_SPANNED_MAGIC);
  if (extension === "xls" && !isXls) throw new Error("Dosya uzantısı XLS olsa da içerik geçerli bir XLS dosyası değil.");
  if (extension === "xlsx" && !isZip) throw new Error("Dosya uzantısı XLSX olsa da içerik geçerli bir XLSX dosyası değil.");
  if (extension === "csv" && (isXls || isZip)) throw new Error("CSV uzantısı ile dosya içeriği uyuşmuyor.");
}

export function assertSafeXlsxArchive(bytes: Uint8Array) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let end = -1;
  for (let index = Math.max(0, bytes.length - 65_557); index <= bytes.length - 22; index += 1) {
    if (view.getUint32(index, true) === 0x06054b50) end = index;
  }
  if (end < 0) throw new Error("XLSX arşiv sonu kaydı bulunamadı; dosya bozuk olabilir.");

  const entries = view.getUint16(end + 10, true);
  const centralSize = view.getUint32(end + 12, true);
  const centralOffset = view.getUint32(end + 16, true);
  if (entries > STUDENT_IMPORT_LIMITS.maxZipEntries) throw new Error(`XLSX ${STUDENT_IMPORT_LIMITS.maxZipEntries} arşiv girdisi sınırını aşıyor.`);
  if (centralOffset + centralSize > end || centralOffset + 46 > bytes.length) throw new Error("XLSX merkez dizini geçersiz.");

  let cursor = centralOffset;
  let expandedBytes = 0;
  for (let index = 0; index < entries; index += 1) {
    if (cursor + 46 > bytes.length || view.getUint32(cursor, true) !== 0x02014b50) throw new Error("XLSX merkez dizini bozuk.");
    const flags = view.getUint16(cursor + 8, true);
    const compressed = view.getUint32(cursor + 20, true);
    const expanded = view.getUint32(cursor + 24, true);
    const nameLength = view.getUint16(cursor + 28, true);
    const extraLength = view.getUint16(cursor + 30, true);
    const commentLength = view.getUint16(cursor + 32, true);
    if ((flags & 0x1) !== 0) throw new Error("Şifreli XLSX arşivleri içe aktarılamaz.");
    expandedBytes += expanded;
    if (expandedBytes > STUDENT_IMPORT_LIMITS.maxExpandedXlsxBytes) throw new Error("XLSX açılmış içerik boyutu güvenlik sınırını aşıyor.");
    if (expanded > 0 && expanded / Math.max(1, compressed) > STUDENT_IMPORT_LIMITS.maxZipCompressionRatio) throw new Error("XLSX olağan dışı sıkıştırma oranı içeriyor.");
    cursor += 46 + nameLength + extraLength + commentLength;
  }
  if (cursor > centralOffset + centralSize) throw new Error("XLSX merkez dizini boyutu geçersiz.");
}

const activePrefix = /^[\t\r\n ]*[=+@-]/;
const externalTarget = /^(?:https?:|file:|ftp:|mailto:)/i;

export function assertSafeCellText(value: unknown, location = "Hücre") {
  const text = String(value ?? "").trim();
  if (text.length > STUDENT_IMPORT_LIMITS.maxCellCharacters) throw new Error(`${location} ${STUDENT_IMPORT_LIMITS.maxCellCharacters} karakter sınırını aşıyor.`);
  if (activePrefix.test(text)) throw new Error(`${location} etkin formül/komut başlangıcı içeriyor.`);
  return text;
}

export function assertTabularBounds(rows: unknown[][]) {
  if (rows.length > STUDENT_IMPORT_LIMITS.maxRows) throw new Error(`Dosya ${STUDENT_IMPORT_LIMITS.maxRows} satır sınırını aşıyor.`);
  const columns = rows.reduce((maximum, row) => Math.max(maximum, row.length), 0);
  if (columns > STUDENT_IMPORT_LIMITS.maxColumns) throw new Error(`Dosya ${STUDENT_IMPORT_LIMITS.maxColumns} sütun sınırını aşıyor.`);
  rows.forEach((row, rowIndex) => row.forEach((cell, columnIndex) => assertSafeCellText(cell, `${rowIndex + 1}. satır ${columnIndex + 1}. sütun`)));
}

export function assertPassiveWorksheet(sheet: Record<string, unknown>) {
  for (const [address, value] of Object.entries(sheet)) {
    if (address.startsWith("!") || !value || typeof value !== "object") continue;
    const cell = value as { f?: unknown; l?: { Target?: unknown } };
    if (typeof cell.f === "string" && cell.f.trim()) throw new Error(`${address} hücresinde formül bulundu; dosya içe aktarılmadı.`);
    const target = typeof cell.l?.Target === "string" ? cell.l.Target.trim() : "";
    if (externalTarget.test(target)) throw new Error(`${address} hücresinde dış bağlantı bulundu; dosya içe aktarılmadı.`);
  }
}

export function assertWorksheetDimensions(rowCount: number, columnCount: number) {
  if (rowCount > STUDENT_IMPORT_LIMITS.maxRows) throw new Error(`Çalışma sayfası ${STUDENT_IMPORT_LIMITS.maxRows} satır sınırını aşıyor.`);
  if (columnCount > STUDENT_IMPORT_LIMITS.maxColumns) throw new Error(`Çalışma sayfası ${STUDENT_IMPORT_LIMITS.maxColumns} sütun sınırını aşıyor.`);
}
