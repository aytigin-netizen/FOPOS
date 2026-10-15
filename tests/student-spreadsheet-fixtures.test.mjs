import assert from "node:assert/strict";
import { File } from "node:buffer";
import test from "node:test";
import XLSX from "xlsx";
import { createManagedRoster } from "../app/core/managed-student-roster.ts";
import { mappedStudentName, mappedStudentRows, assertStudentColumnMapping, readStudentSpreadsheet } from "../app/core/student-spreadsheet-import.ts";

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

test("sınıf listesi sıra, öğrenci numarası ve ad-soyad sütunlarını doğru eşler", async () => {
  const sheet = XLSX.utils.aoa_to_sheet([
    ["#", "Öğrenci No.", "Adı Soyadı"],
    [1, 44, "Anonim Öğrenci Bir"],
    [2, 104, "Anonim Öğrenci İki"],
  ]);
  const preview = await readStudentSpreadsheet(xlsxFile(sheet, "sinif-listesi.xlsx"));
  assert.equal(preview.headerRow, 0);
  assert.equal(preview.numberColumn, 1);
  assert.equal(preview.nameColumn, 2);
  assert.equal(preview.rows.slice(1).length, 2);
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


test("E-Okul Crystal Reports XLS: 11. satır, aralıklı sütunlar ve ayrı ad/soyad", async () => {
  const rows = Array.from({length:10},()=>[]);
  rows[0] = ["KURGUSAL SINIF LİSTESİ"];
  rows.push(["S.No","Öğrenci No","","","Adı","","","","Soyadı","","","Cinsiyeti","","Pansiyon Durum"]);
  rows.push([]);
  rows.push([1,17,"","","Ada Deniz","","","","Çığ","","","","Kız"]);
  rows.push([]);
  rows.push([2,804,"","","Çağrı","","","","Öztürk","","","","Erkek"]);
  rows.push([]);
  rows.push(["","Öğrenci sayısı: 2","","","Özet"]);
  rows.push(["","Sınıf öğretmeni"]);
  const sheet=XLSX.utils.aoa_to_sheet(rows);
  sheet["!merges"]=[{s:{r:10,c:1},e:{r:10,c:3}},{s:{r:10,c:4},e:{r:10,c:7}},{s:{r:10,c:8},e:{r:10,c:10}}];
  const workbook=XLSX.utils.book_new();XLSX.utils.book_append_sheet(workbook,sheet,"Sheet1");
  const preview=await readStudentSpreadsheet(new File([XLSX.write(workbook,{type:"array",bookType:"biff8"})],"kurgusal-eokul.XLS"));
  assert.equal(preview.headerRow,10);assert.equal(preview.numberColumn,1);assert.equal(preview.nameColumn,4);assert.equal(preview.surnameColumn,8);assert.equal(preview.nameMode,"separate");
  assert.equal(preview.columnLabels[4],"Adı");assert.equal(preview.columnLabels[8],"Soyadı");
  assert.deepEqual(mappedStudentRows(preview).map(({no,name})=>({no,name})),[{no:"17",name:"Ada Deniz Çığ"},{no:"804",name:"Çağrı Öztürk"}]);
});

test("ayrı ad-soyad sütunları elle seçilebilir, isimler kesilmez", async()=>{
  let preview=await readStudentSpreadsheet(new File(["Kimlik;Birinci;İkinci\n0012;Ada Deniz;Çığ"],"kurgusal.csv"));
  preview={...preview,headerRow:0,numberColumn:0,nameMode:"separate",nameColumn:1,surnameColumn:2};
  assert.equal(mappedStudentName(preview,preview.rows[1]),"Ada Deniz Çığ");
  assert.equal(mappedStudentRows(preview)[0].no,"0012");
  assert.throws(()=>mappedStudentRows({...preview,surnameColumn:0}),/farklı sütunlar/);
  assert.throws(()=>mappedStudentRows({...preview,surnameColumn:-1}),/geçerli sütunları/);
  assert.throws(()=>mappedStudentRows({...preview,headerRow:-1}),/Başlık satırını/);
});

test("eksik soyad sessizce atlanmaz ve soyad hücresinin güvenliği korunur",async()=>{
  const preview=await readStudentSpreadsheet(new File(["Öğrenci No;Adı;Soyadı\n12;Ada;Yılmaz\n13;Deniz;"],"kurgusal.csv"));
  assert.throws(()=>mappedStudentRows(preview),/3. satırda.*soyadı eksik/);
  assert.throws(()=>mappedStudentRows({...preview,rows:[preview.rows[0],["12","Ada","=CMD"]]}),/formül/);
});

test("birleşik ad-soyad desteği korunur ve toplam puan ayrı alandır",async()=>{
  const preview=await readStudentSpreadsheet(new File(["Okul Numarası;Ad Soyadı;Y1\n12;Çağrı Öztürk;75"],"kurgusal.csv"));
  assert.equal(preview.nameMode,"combined");assert.equal(mappedStudentRows(preview,true)[0].name,"Çağrı Öztürk");
  assert.equal(preview.totalColumn,2);
  assert.throws(()=>assertStudentColumnMapping({...preview,totalColumn:preview.nameColumn},true),/farklı sütunlar/);
});

test("yazdırma başlığı tekrarlandığında ilk sayfadaki öğrenciler korunur",async()=>{
  const text="Öğrenci No;Adı;Soyadı\n12;Ada;Yılmaz\nÖğrenci No;Adı;Soyadı\n13;Deniz;Çığ";
  const preview=await readStudentSpreadsheet(new File([text],"kurgusal.csv"));
  assert.equal(preview.headerRow,0);
  assert.deepEqual(mappedStudentRows(preview).map(row=>row.no),["12","13"]);
});

test("başlık hücresi boşken numarası eksik öğrenci satırı sessizce atlanmaz",()=>{
  const preview={fileName:"kurgusal.csv",headerRow:0,numberColumn:0,nameColumn:1,surnameColumn:2,nameMode:"separate",totalColumn:-1,columnLabels:[],rows:[["","Adı","Soyadı"],["12","Ada","Yılmaz"],["","Deniz","Çığ"],["14","İpek","Şen"]]};
  assert.throws(()=>mappedStudentRows(preview),/3. satırda.*eksik/);
});
