import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { assertPassiveWorksheet, assertSafeCellText, assertSafeXlsxArchive, assertSpreadsheetSignature, assertTabularBounds, assertWorksheetDimensions, STUDENT_IMPORT_LIMITS } from "../app/core/student-import-security.ts";

const source = await readFile(new URL("../app/modules/exam-analysis/ExamAnalysisModule.tsx", import.meta.url), "utf8");
const parser = await readFile(new URL("../app/core/student-spreadsheet-import.ts", import.meta.url), "utf8");
const preview = await readFile(new URL("../app/components/student-import/StudentImportPreview.tsx", import.meta.url), "utf8");
const rosters = await readFile(new URL("../app/modules/student-rosters/StudentRostersModule.tsx", import.meta.url), "utf8");

test("formül ve dış bağlantı içeren hücreler reddedilir", () => {
  for (const value of ["=SUM(A1:A2)", "+cmd", "@IMPORT", "-2+3"]) assert.throws(() => assertSafeCellText(value), /formül\/komut/);
  assert.throws(() => assertPassiveWorksheet({ A1: { f: "SUM(B1:B2)" } }), /formül/);
  assert.throws(() => assertPassiveWorksheet({ A1: { l: { Target: "https://example.com" } } }), /dış bağlantı/);
  assert.equal(assertSafeCellText("Ayşe Yılmaz"), "Ayşe Yılmaz");
});

test("satır, sütun ve hücre uzunluğu sınırları uygulanır", () => {
  assert.throws(() => assertWorksheetDimensions(STUDENT_IMPORT_LIMITS.maxRows + 1, 2), /satır sınırını/);
  assert.throws(() => assertWorksheetDimensions(2, STUDENT_IMPORT_LIMITS.maxColumns + 1), /sütun sınırını/);
  assert.throws(() => assertSafeCellText("x".repeat(STUDENT_IMPORT_LIMITS.maxCellCharacters + 1)), /karakter sınırını/);
  assert.throws(() => assertTabularBounds([Array(STUDENT_IMPORT_LIMITS.maxColumns + 1).fill("")]), /sütun sınırını/);
});

test("dosya ve yapıştırma akışları aynı güvenlik kapılarını kullanır", () => {
  assert.match(parser, /assertSpreadsheetSignature\(extension, bytes\)/);
  assert.match(parser, /assertSafeXlsxArchive\(bytes\)/);
  assert.match(parser, /assertPassiveWorksheet\(sheet\)/);
  assert.match(parser, /assertWorksheetDimensions/);
  assert.match(parser, /assertTabularBounds\(rows\)/);
  assert.match(parser, /sheetRows: STUDENT_IMPORT_LIMITS\.maxRows \+ 1/);
  assert.match(source, /readStudentSpreadsheet\(file\)/);
  assert.match(source, /yinelenen öğrenci numarası/);
  assert.doesNotMatch(source, /name: row\[1\] \|\| `Öğrenci/);
});

test("uzantı ile dosya imzası uyuşmazlığı reddedilir", () => {
  assert.throws(() => assertSpreadsheetSignature("xlsx", new TextEncoder().encode("sahte içerik")), /geçerli bir XLSX/);
  assert.throws(() => assertSpreadsheetSignature("xls", Uint8Array.from([0x50, 0x4b, 0x03, 0x04])), /geçerli bir XLS/);
  assert.throws(() => assertSpreadsheetSignature("csv", Uint8Array.from([0x50, 0x4b, 0x03, 0x04])), /uyuşmuyor/);
  assert.doesNotThrow(() => assertSpreadsheetSignature("csv", new TextEncoder().encode("No;Ad\n1;Ada")));
});

test("XLSX merkez dizini ve açılmış kaynak sınırları doğrulanır", () => {
  const makeArchive = ({ compressed = 10, expanded = 20, flags = 0 } = {}) => {
    const bytes = new Uint8Array(22 + 46);
    const view = new DataView(bytes.buffer);
    view.setUint32(0, 0x02014b50, true);
    view.setUint16(8, flags, true);
    view.setUint32(20, compressed, true);
    view.setUint32(24, expanded, true);
    view.setUint32(46, 0x06054b50, true);
    view.setUint16(56, 1, true);
    view.setUint32(58, 46, true);
    view.setUint32(62, 0, true);
    return bytes;
  };
  assert.doesNotThrow(() => assertSafeXlsxArchive(makeArchive()));
  assert.throws(() => assertSafeXlsxArchive(makeArchive({ compressed: 1, expanded: 101 })), /sıkıştırma oranı/);
  assert.throws(() => assertSafeXlsxArchive(makeArchive({ expanded: STUDENT_IMPORT_LIMITS.maxExpandedXlsxBytes + 1 })), /açılmış içerik boyutu/);
  assert.throws(() => assertSafeXlsxArchive(makeArchive({ flags: 1 })), /Şifreli XLSX/);
  assert.throws(() => assertSafeXlsxArchive(new Uint8Array([0x50, 0x4b, 0x03, 0x04])), /arşiv sonu/);
});

test("dosya doğrudan uygulanmaz; sütun eşleme, önizleme ve geri alma öğretmen denetimindedir", () => {
  assert.match(source, /type PendingStudentImport/);
  assert.match(source, /setPendingImport\(\{ \.\.\.previewData, grade, branch \}\)/);
  assert.match(source, /StudentImportPreview/);
  assert.match(preview, /İçe aktarma önizlemesi/);
  assert.match(preview, /Önizlemede yalnız numara ve ad-soyad gösterilir/);
  assert.match(source, /confirmStudentImport/);
  assert.match(preview, /Eşlemeyi onayla ve içe aktar/);
  assert.match(source, /previousStudents/);
  assert.match(source, /undoStudentImport/);
  assert.match(source, /Son öğrenci içe aktarmasını geri al/);
});

test("dosya seçiciler tarayıcı otomasyonuna ve aynı dosyayı yeniden seçmeye hazırdır", () => {
  assert.match(preview, /data-testid="student-import-preview"/);
  assert.match(rosters, /aria-label="Öğrenci listeleri dosyası"/);
  assert.match(rosters, /data-testid="roster-file-input"/);
  assert.match(source, /data-testid="analysis-setup-file-input"/);
  assert.match(source, /data-testid="analysis-score-file-input"/);
  assert.match(rosters, /event\.currentTarget\.value=""/);
  assert.equal((source.match(/e\.currentTarget\.value = ""/g) ?? []).length, 2);
});
