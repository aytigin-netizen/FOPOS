import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(new URL("../app/modules/student-performance/StudentPerformanceModule.tsx", import.meta.url), "utf8");

test("öğrenci performansı çoklu tarihli kanıt kaydı kullanır", () => {
  assert.match(source, /type EvidenceRecord/);
  assert.match(source, /evidenceRecords: EvidenceRecord\[\]/);
  assert.match(source, /Yeni tarihli kanıt ekle/);
  assert.match(source, /removeEvidence/);
  assert.match(source, /type="date"/);
});

test("gelişim eğilimi ve sınıf öğrenme haritası kural tabanlıdır", () => {
  assert.match(source, /evidenceAverages/);
  assert.match(source, /const delta/);
  assert.match(source, /Sınıf öğrenme haritası/);
  assert.match(source, /const skillMap/);
});

test("grup desteği öğretmen seçimi ve açık onay gerektirir", () => {
  assert.match(source, /selectedStudentIds/);
  assert.match(source, /supportConfirmed/);
  assert.match(source, /nihai plan kararının bana ait olduğunu onaylıyorum/);
  assert.match(source, /disabled={!supportConfirmed/);
});

test("performans verisi dış servise gönderilmez ve kalıcı etiket üretilmez", () => {
  assert.doesNotMatch(source, /localStorage|sessionStorage|fetch\(|axios/);
  assert.match(source, /harici yapay zekâya gönderilmez/);
  assert.match(source, /kalıcı başarı veya yetenek kategorilerine ayrılmaz/);
});

test("örnekle uyumlu resmî süreç değerlendirme formu üretilir", () => {
  for (const text of [
    "SÜREÇ DEĞERLENDİRME FORMU",
    "Form Başlığı",
    "Puanlama Aralığı",
    "Sınıf Ortalaması",
    "Form Maddeleri",
    "Başlangıç",
    "Gelişmekte",
    "Çok İyi",
    "Süreç değerlendirme formunu DOCX indir",
  ]) assert.match(source, new RegExp(text));
  assert.match(source, /M\$\{level\}/);
  assert.match(source, /latestEvidence/);
  assert.match(source, /Math\.round\(value\)/);
  assert.doesNotMatch(source, /UYGUNDUR/);
});
