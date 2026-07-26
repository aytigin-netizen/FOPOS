import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const page = await readFile(new URL("../app/ClientApp.tsx", import.meta.url), "utf8");
const nav = await readFile(new URL("../app/components/navigation/AppNavigation.tsx", import.meta.url), "utf8");
const moduleSource = await readFile(new URL("../app/modules/student-rosters/StudentRostersModule.tsx", import.meta.url), "utf8");
const exam = await readFile(new URL("../app/modules/exam-analysis/ExamAnalysisModule.tsx", import.meta.url), "utf8");
const core = await readFile(new URL("../app/core/managed-student-roster.ts", import.meta.url), "utf8");

test("yönetilen liste sınıf ve şubeye bağlı, doğrulanmış numara-ad satırlarından oluşur", () => {
  assert.match(core, /createManagedRoster/);
  assert.match(core, /assertTabularBounds\(rows\)/);
  assert.match(core, /assertSafeCellText/);
  assert.match(core, /seen\.has\(no\)/);
  assert.match(core, /yinelenen öğrenci numarası/);
});

test("öğrenci listeleri ayrı ana menü modülüdür ve yalnız oturum belleğinde tutulur", () => {
  assert.match(nav, /\["rosters","Öğrenci Listeleri"\]/);
  assert.match(page, /sessionRosters/);
  assert.match(page, /useSensitiveSession\(sessionRosters\.length > 0/);
  assert.doesNotMatch(page, /localStorage.*sessionRosters|sessionStorage.*sessionRosters/);
  assert.match(moduleSource, /Puan, sağlık veya BEP bilgisi girmeyin/);
});

test("liste silme açık onay, modüle gönderme açık hedef seçimi gerektirir", () => {
  assert.match(moduleSource, /deleteConfirmedId/);
  assert.match(moduleSource, /Silmeyi onayla/);
  assert.match(moduleSource, /Sınav Analizine gönder/);
  assert.match(moduleSource, /Öğrenci Performansına gönder/);
});

test("sınav analizi gelen listeyi otomatik uygulamaz ve puanları boş kurar", () => {
  assert.match(exam, /incomingRoster/);
  assert.match(exam, /Liste otomatik uygulanmadı/);
  assert.match(exam, /Aktarımı reddet ve sil/);
  assert.match(exam, /scores: nextQuestions\.map\(\(\) => null\)/);
});

test("liste modülü ortak güvenli dosya okuyucu ve önizleme bileşenini kullanır", () => {
  assert.match(moduleSource, /readStudentSpreadsheet\(file\)/);
  assert.match(moduleSource, /StudentImportPreview/);
  assert.match(moduleSource, /accept="\.xls,\.xlsx,\.csv"/);
  assert.match(moduleSource, /dosyadan öğretmen onayıyla eklendi/);
});
