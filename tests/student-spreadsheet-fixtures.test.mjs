import assert from "node:assert/strict";
import { File } from "node:buffer";
import test from "node:test";
import XLSX from "xlsx";
import { createManagedRoster } from "../app/core/managed-student-roster.ts";
import { readStudentSpreadsheet } from "../app/core/student-spreadsheet-import.ts";

const xlsxFile = (sheet, name = "anonim-liste.xlsx") => {
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, "Öğrenciler");
  const bytes = XLSX.write(workbook, { type: "array", bookType: "xlsx" });
  return new File([bytes], name, { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
};

test("anonim CSV Türkçe başlık ve karakterleri korur", async () => {
  const csv = "Okul Numarası;Adı Soyadı\n101;Çağrı Öztürk\n102;İpek Şen";
  const preview = await readStudentSpreadsheet(new File([csv], "anonim.csv", { type: "text/csv" }));
  assert.equal(preview.numberColumn, 0);
  assert.equal(preview.nameColumn, 1);
  assert.equal(preview.rows[1][1], "Çağrı Öztürk");
});

test("çok satırlı anonim e-Okul benzeri XLSX başlığı ve boş satırı işler", async () => {
  const sheet = XLSX.utils.aoa_to_sheet([
    ["T.C. MİLLÎ EĞİTİM BAKANLIĞI"],
    ["10-A Sınıf Listesi"],
    ["Sıra", "Okul Numarası", "Adı Soyadı"],
    [1, 201, "Ada Yılmaz"],
    ["", "", ""],
    [2, 202, "Deniz Çığ"],
  ]);
  const preview = await readStudentSpreadsheet(xlsxFile(sheet));
  assert.equal(preview.headerRow, 2);
  assert.equal(preview.numberColumn, 1);
  assert.equal(preview.nameColumn, 2);
  assert.equal(preview.rows[5][2], "Deniz Çığ");
});

test("e-Okul puan çizelgesindeki Y1 sütununu yalnız toplam kontrolü için tanır", async () => {
  const sheet = XLSX.utils.aoa_to_sheet([
    ["2025-2026 I. DÖNEM PUAN ÇİZELGESİ"],
    [],
    ["Sıra No", "Ö Ğ R E N C İ N İ N", "", "", "", "", "S I N A V L A R"],
    ["", "Okul Numarası", "Adı Soyadı", "", "", "", "Y A Z I L I"],
    ["", "", "", "", "", "", "Y1"],
    [1, 301, "Anonim Öğrenci", "", "", "", 74],
    [2, 302, "Puanı Boş Öğrenci", "", "", "", ""],
  ]);
  const preview = await readStudentSpreadsheet(xlsxFile(sheet, "e-okul-puan.xlsx"));
  assert.equal(preview.numberColumn, 1);
  assert.equal(preview.nameColumn, 2);
  assert.equal(preview.totalColumn, 6);
  assert.equal(preview.columnLabels[6], "Y1");
  assert.equal(preview.rows[5][6], "74");
  assert.equal(preview.rows[6][6], "");
});

test("gerçek XLSX formül hücresi içe aktarımı durdurur", async () => {
  const sheet = XLSX.utils.aoa_to_sheet([["Okul Numarası", "Adı Soyadı"], [301, "Anonim Öğrenci"]]);
  sheet.A2 = { t: "n", v: 301, f: "SUM(300,1)" };
  await assert.rejects(() => readStudentSpreadsheet(xlsxFile(sheet, "formullu.xlsx")), /formül bulundu/);
});

test("gerçek XLSX dış bağlantı hücresi içe aktarımı durdurur", async () => {
  const sheet = XLSX.utils.aoa_to_sheet([["Okul Numarası", "Adı Soyadı"], [401, "Anonim Öğrenci"]]);
  sheet.B2.l = { Target: "https://example.com/ogrenci" };
  await assert.rejects(() => readStudentSpreadsheet(xlsxFile(sheet, "baglantili.xlsx")), /dış bağlantı bulundu/);
});

test("dosyadan çıkarılan yinelenen numaralar yönetilen liste kapısında reddedilir", () => {
  assert.throws(() => createManagedRoster({ title: "Anonim 10-A", grade: 10, branch: "A", pastedRows: "501;Öğrenci Bir\n501;Öğrenci İki" }), /yinelenen öğrenci numarası/);
});
