import { assertPassiveWorksheet, assertSafeXlsxArchive, assertSpreadsheetSignature, assertTabularBounds, assertWorkbookSheetCount, assertWorksheetDimensions, STUDENT_IMPORT_LIMITS } from "./student-import-security.ts";

export type StudentSpreadsheetPreview = {
  fileName: string;
  rows: string[][];
  headerRow: number;
  numberColumn: number;
  nameColumn: number;
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
  let numberColumn = -1, nameColumn = -1, totalColumn = -1, headerRow = 0;
  rows.slice(0, 40).forEach((row, rowIndex) => row.forEach((cell, columnIndex) => {
    const value = norm(cell);
    if (/OKULNUMARASI|ÖĞRENCİNO|ÖĞRENCİNİNNO|OGRNO/.test(value)) { numberColumn = columnIndex; headerRow = Math.max(headerRow, rowIndex); }
    if (/ADISOYADI|ADSOYAD|ÖĞRENCİNİNADI/.test(value)) { nameColumn = columnIndex; headerRow = Math.max(headerRow, rowIndex); }
    if (/^(Y1|1YAZILI|YAZILI1|SINAV1)$/.test(value)) totalColumn = columnIndex;
  }));
  const columnCount = Math.max(...rows.map((row) => row.length), 0);
  const firstStudentRow = rows.findIndex((row, rowIndex) =>
    rowIndex > headerRow && numberColumn >= 0 && nameColumn >= 0 &&
    String(row[numberColumn] ?? "").trim() !== "" && String(row[nameColumn] ?? "").trim() !== "",
  );
  const labelRowLimit = firstStudentRow >= 0 ? firstStudentRow : Math.min(40, headerRow + 6);
  const columnLabels = Array.from({ length: columnCount }, (_, columnIndex) => {
    const labels = rows.slice(0, labelRowLimit)
      .map((row) => String(row[columnIndex] ?? "").trim())
      .filter(Boolean);
    return labels.at(-1) ?? "Başlıksız";
  });
  return {
    fileName: file.name,
    rows: rows.map((row) => row.map((cell) => String(cell ?? "").trim())),
    headerRow,
    numberColumn,
    nameColumn,
    totalColumn,
    columnLabels,
  };
}
