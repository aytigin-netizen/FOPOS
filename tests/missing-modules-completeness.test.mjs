import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const meeting = await readFile(new URL("../app/modules/department-meeting/DepartmentMeetingModule.tsx", import.meta.url), "utf8");
const examTypes = await readFile(new URL("../app/core/exam-types.ts", import.meta.url), "utf8");
const examBuilder = await readFile(new URL("../app/modules/exam-builder/ExamBuilder.tsx", import.meta.url), "utf8");
const analysis = await readFile(new URL("../app/modules/exam-analysis/ExamAnalysisModule.tsx", import.meta.url), "utf8");
const navigation = await readFile(new URL("../app/components/navigation/AppNavigation.tsx", import.meta.url), "utf8");
const page = await readFile(new URL("../app/ClientApp.tsx", import.meta.url), "utf8");
const performance = await readFile(new URL("../app/modules/student-performance/StudentPerformanceModule.tsx", import.meta.url), "utf8");
const examTransfer = await readFile(new URL("../app/core/exam-blueprint-transfer.ts", import.meta.url), "utf8");
const studentSpreadsheet = await readFile(new URL("../app/core/student-spreadsheet-import.ts", import.meta.url), "utf8");
const studentImportPreview = await readFile(new URL("../app/components/student-import/StudentImportPreview.tsx", import.meta.url), "utf8");

test("zümre tutanağı öğretmen kontrollü ek gündem maddesi destekler", () => {
  assert.match(meeting, /addCustomItem/);
  assert.match(meeting, /Ek gündem maddesi ekle/);
  assert.match(meeting, /Ek gündem maddesi başlığı/);
  assert.match(meeting, /removeCustomItem/);
  assert.match(meeting, /item\.title\.trim\(\)/);
  assert.match(meeting, /Yeni gündem maddesi ekle/);
  assert.match(meeting, /Sonradan gündem maddesi ekle/);
  assert.match(meeting, /Taslağı oluşturmadan önce veya oluşturduktan sonra/);
});

test("sınav analizi örnek resmî raporun dört çıktı bölümünü üretir", () => {
  for (const heading of [
    "ÖĞRENCİ PUAN DAĞILIMI",
    "SINAV SONUÇ DEĞERLENDİRME TUTANAĞI",
    "Eksik Öğrenme Çıktılarının Belirlenmesi",
    "KAZANIMLARA GÖRE SINIF GELİŞİM RAPORU",
  ]) assert.match(analysis, new RegExp(heading));
  assert.ok(analysis.includes("Öğrenci Puan Dağılımı (1-4 Arası)"));
  assert.match(analysis, /PageOrientation\.LANDSCAPE/);
  assert.match(analysis, /Bakanlık Destek Materyalleri/);
  assert.match(analysis, /MEBİ Uygulamaları/);
});

test("iki dönemin ikişer yazılısı ve sorumluluk sınavı seçilebilir", () => {
  for (const name of [
    "1. Dönem 1. Yazılı Sınavı",
    "1. Dönem 2. Yazılı Sınavı",
    "2. Dönem 1. Yazılı Sınavı",
    "2. Dönem 2. Yazılı Sınavı",
    "Sorumluluk Sınavı",
  ]) assert.match(examTypes, new RegExp(name));
  assert.match(examBuilder, /examNames\.map/);
  assert.match(analysis, /examNames\.map/);
});

test("öğrenci performansı ayrı ve mahremiyet korumalı modüldür", () => {
  assert.match(navigation, /Öğrenci Performansı/);
  assert.match(page, /StudentPerformanceModule/);
  assert.match(performance, /Felsefi beceri gelişim görünümü/);
  assert.match(performance, /Sorgulama/);
  assert.match(performance, /Gerekçelendirme/);
  assert.match(performance, /kalıcı başarı veya yetenek kategorilerine ayrılmaz/);
  assert.match(performance, /Süreç değerlendirme formunu DOCX indir/);
  assert.doesNotMatch(performance, /localStorage|fetch\(|axios/);
});

test("onaylı sınav yapısı analize öğrenci verisi olmadan aktarılır", () => {
  assert.match(examBuilder, /Sınav analizine aktar/);
  assert.match(examBuilder, /createExamBlueprintTransfer/);
  assert.match(page, /pendingExamTransfer/);
  assert.match(analysis, /Sınav Oluşturucudan sınav yapısı geldi/);
  assert.match(analysis, /otomatik uygulanmaz/);
  assert.match(analysis, /acceptIncomingExam/);
  assert.match(analysis, /gradeUnits\.flatMap/);
  assert.match(analysis, /incomingExamRef\.current\?\.scrollIntoView/);
  assert.match(analysis, /setCreated\(true\)/);
  assert.match(analysis, /preview\.current\?\.scrollIntoView/);
  assert.match(examTransfer, /outcomeCode/);
  assert.match(examTransfer, /unitCode/);
  assert.match(examTransfer, /maxPoints/);
  assert.doesNotMatch(examTransfer, /studentName|studentNo|students|scores/i);
});

test("e-Okul Y1 toplamı soru puanlarından ayrı kontrol edilir ve boş puan karar bekler", () => {
  assert.match(studentSpreadsheet, /totalColumn/);
  assert.match(studentSpreadsheet, /Y1\|1YAZILI\|YAZILI1\|SINAV1/);
  assert.match(studentImportPreview, /Toplam puan soru puanlarına dağıtılmaz/);
  assert.match(analysis, /reportedTotal/);
  assert.match(analysis, /findLastIndex/);
  assert.match(analysis, /const attendanceReview: AttendanceReview = .*"pending"/);
  assert.match(analysis, /Karar bekliyor/);
  assert.match(analysis, /Soru puanları bekleniyor/);
  assert.match(analysis, /Uyumlu/);
});
