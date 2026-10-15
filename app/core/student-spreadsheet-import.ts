import { assertSafeCellText, assertPassiveWorksheet, assertSafeXlsxArchive, assertSpreadsheetSignature, assertTabularBounds, assertWorkbookSheetCount, assertWorksheetDimensions, STUDENT_IMPORT_LIMITS } from "./student-import-security.ts";

export type StudentSpreadsheetPreview = {
  fileName: string;
  rows: string[][];
  headerRow: number;
  numberColumn: number;
  nameColumn: number;
  nameMode?: "combined" | "separate";
  surnameColumn?: number;
  totalColumn: number;
  columnLabels: string[];
};

function detectCsvDelimiter(text: string): "," | ";" | "\t" {
  const line = text.split(/\r?\n/).find((candidate) => candidate.trim()) ?? "";
  const counts = new Map<"," | ";" | "\t", number>([[",", 0], [";", 0], ["\t", 0]]);
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    if (line[index] === '"') {
      if (quoted && line[index + 1] === '"') index += 1;
      else quoted = !quoted;
    } else if (!quoted && counts.has(line[index] as "," | ";" | "\t")) {
      const delimiter = line[index] as "," | ";" | "\t";
      counts.set(delimiter, (counts.get(delimiter) ?? 0) + 1);
    }
  }

  return [...counts.entries()].sort((left, right) => right[1] - left[1])[0]?.[0] ?? ",";
}

export async function readStudentSpreadsheet(file: File): Promise<StudentSpreadsheetPreview> {
  const extension = file.name.toLocaleLowerCase("tr-TR").split(".").at(-1);
  if (!extension || !["xls", "xlsx", "csv"].includes(extension)) throw new Error("Yalnız XLS, XLSX veya CSV dosyaları kabul edilir.");
  if (file.size > STUDENT_IMPORT_LIMITS.maxFileBytes) throw new Error("Dosya 5 MB sınırını aşıyor.");
  const bytes = new Uint8Array(await file.arrayBuffer());
  assertSpreadsheetSignature(extension, bytes);
  if (extension === "xlsx") assertSafeXlsxArchive(bytes);
  const XLSXModule = await import("xlsx"), XLSX = XLSXModule.default ?? XLSXModule;
  const workbook = extension === "csv"
    ? await file.text().then((text) => XLSX.read(text, { type: "string", FS: detectCsvDelimiter(text), sheetRows: STUDENT_IMPORT_LIMITS.maxRows + 1 }))
    : XLSX.read(bytes, { type: "array", sheetRows: STUDENT_IMPORT_LIMITS.maxRows + 1 });
  if (!workbook.SheetNames.length) throw new Error("Dosyada çalışma sayfası bulunamadı.");
  assertWorkbookSheetCount(workbook.SheetNames.length);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  if (!sheet) throw new Error("İlk çalışma sayfası okunamadı.");
  assertPassiveWorksheet(sheet);
  if (sheet["!ref"]) { const range = XLSX.utils.decode_range(sheet["!ref"]); assertWorksheetDimensions(range.e.r - range.s.r + 1, range.e.c - range.s.c + 1); }
  const rows = XLSX.utils.sheet_to_json<(string | number)[]>(sheet, { header: 1, defval: "", raw: false });
  assertTabularBounds(rows);
  const norm = (value: unknown) => String(value || "").toLocaleUpperCase("tr-TR").replace(/[^A-ZÇĞİÖŞÜ0-9]/g, "");
  const isNumberHeader = (value: string) => /^(OKULNUMARASI|OKULNO|ÖĞRENCİNO|ÖĞRENCİNUMARASI|ÖĞRENCİNİNNO|ÖĞRENCİNİNOKULNUMARASI|OGRNO|ÖĞRNO|NUMARASI|NUMARA)$/.test(value);
  const isFullNameHeader = (value: string) => /^(ADISOYADI|ADSOYADI|ADISOYAD|ADSOYAD|ADIVESOYADI|ADVESOYAD|ÖĞRENCİNİNADISOYADI|ÖĞRENCİADISOYADI)$/.test(value);
  const isFirstNameHeader = (value: string) => /^(ADI|AD|İSİM|ISIM|ÖĞRENCİNİNADI|ÖĞRENCİADI)$/.test(value);
  const isSurnameHeader = (value: string) => /^(SOYADI|SOYAD|ÖĞRENCİNİNSOYADI|ÖĞRENCİSOYADI)$/.test(value);
  let numberColumn = -1, nameColumn = -1, surnameColumn = -1, totalColumn = -1, headerRow = 0, bestScore = 0;
  let nameMode: "combined" | "separate" = "combined";
  rows.slice(0, 40).forEach((row, rowIndex) => {
    const cells = row.map(norm);
    const full = cells.findIndex(isFullNameHeader), first = cells.findIndex(isFirstNameHeader), surname = cells.findIndex(isSurnameHeader);
    const strongNumber = cells.findIndex(isNumberHeader);
    const number = strongNumber >= 0 ? strongNumber : cells.findIndex(value => value === "NO");
    const name = full >= 0 ? full : first;
    const score = (number >= 0 ? 4 : 0) + (name >= 0 ? 4 : 0) + (full < 0 && first >= 0 && surname >= 0 ? 2 : 0);
    // Keep the first complete header when printed pages repeat their headings.
    if (score > bestScore) {
      bestScore = score; headerRow = rowIndex; numberColumn = number; nameColumn = name;
      surnameColumn = surname; nameMode = full < 0 && surname >= 0 ? "separate" : "combined";
    }
  });
  const columnCount = Math.max(...rows.map((row) => row.length), 0);
  const firstStudentRow = rows.findIndex((row, rowIndex) => rowIndex > headerRow && numberColumn >= 0 && /^\d+$/.test(String(row[numberColumn] ?? "").trim()));
  const labelRowLimit = firstStudentRow >= 0 ? firstStudentRow : headerRow + 1;
  rows.slice(headerRow, labelRowLimit).forEach(row => row.forEach((cell, columnIndex) => {
    if (/^(Y1|1YAZILI|YAZILI1|SINAV1)$/.test(norm(cell))) totalColumn = columnIndex;
  }));
  const columnLabels = Array.from({ length: columnCount }, (_, columnIndex) => {
    const labels = rows.slice(0, labelRowLimit).map(row => String(row[columnIndex] ?? "").trim()).filter(Boolean);
    return labels.at(-1) ?? "Başlıksız";
  });
  return {
    fileName: file.name,
    rows: rows.map((row) => row.map((cell) => String(cell ?? "").trim())),
    headerRow,
    numberColumn,
    nameColumn,
    nameMode,
    surnameColumn,
    totalColumn,
    columnLabels,
  };
}


export function mappedStudentName(preview: StudentSpreadsheetPreview, row: string[]) {
  const first = row[preview.nameColumn] ?? "";
  return (preview.nameMode === "separate" ? `${first} ${row[preview.surnameColumn ?? -1] ?? ""}` : first).replace(/\s+/g, " ").trim();
}

export function assertStudentColumnMapping(preview: StudentSpreadsheetPreview, includeTotal = false) {
  const count = Math.max(...preview.rows.map(row => row.length), 0);
  const columns = [preview.numberColumn, preview.nameColumn];
  if (preview.nameMode === "separate") columns.push(preview.surnameColumn ?? -1);
  if (includeTotal && preview.totalColumn >= 0) columns.push(preview.totalColumn);
  if (columns.some(column => !Number.isInteger(column) || column < 0 || column >= count)) throw new Error("Öğrenci numarası, ad ve gerekiyorsa soyadı için geçerli sütunları seçin.");
  if (new Set(columns).size !== columns.length) throw new Error("Numara, ad, soyadı ve toplam puan için farklı sütunlar seçilmelidir.");
  if (!Number.isInteger(preview.headerRow) || preview.headerRow < 0 || preview.headerRow >= preview.rows.length) throw new Error("Başlık satırını kontrol edin.");
}

export function mappedStudentRows(preview: StudentSpreadsheetPreview, includeTotal = false) {
  assertStudentColumnMapping(preview, includeTotal);
  const afterHeader = preview.rows.slice(preview.headerRow + 1);
  const last = afterHeader.findLastIndex(row => /^\d+$/.test(String(row[preview.numberColumn] ?? "").trim()));
  if (last < 0) throw new Error("Seçilen numara sütununda öğrenci satırı bulunamadı.");
  const found: Array<{ no: string; name: string; row: string[]; rowNumber: number }> = [];
  afterHeader.slice(0, last + 1).forEach((row, offset) => {
    const no = assertSafeCellText(row[preview.numberColumn], "Öğrenci numarası");
    const first = assertSafeCellText(row[preview.nameColumn], "Öğrenci adı");
    const surname = preview.nameMode === "separate" ? assertSafeCellText(row[preview.surnameColumn ?? -1], "Öğrenci soyadı") : "";
    if (!no && !first && !surname) return;
    // Multi-page reports may repeat the selected column headings between pupils.
    if (no && !/^\d+$/.test(no) && no === (preview.rows[preview.headerRow]?.[preview.numberColumn] ?? "")) return;
    const rowNumber = preview.headerRow + offset + 2;
    if (!no || !first || (preview.nameMode === "separate" && !surname)) throw new Error(`${rowNumber}. satırda öğrenci numarası, adı veya soyadı eksik.`);
    if (!/^\d+$/.test(no)) throw new Error(`${rowNumber}. satırdaki öğrenci numarası sayısal değil.`);
    const name = assertSafeCellText(mappedStudentName(preview, row), `${rowNumber}. satır ad soyad`);
    found.push({ no, name, row, rowNumber });
  });
  if (found.length > STUDENT_IMPORT_LIMITS.maxStudents) throw new Error(`Liste ${STUDENT_IMPORT_LIMITS.maxStudents} öğrenci sınırını aşıyor.`);
  return found;
}
