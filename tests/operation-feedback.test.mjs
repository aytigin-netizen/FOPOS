import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { operationErrorMessage } from "../app/core/operation-error.ts";
import { CurriculumFeatureUnavailableError } from "../app/core/curriculum-feature-unavailable.ts";

const files = [
  "../app/ClientApp.tsx",
  "../app/modules/annual-plan/AnnualPlanModule.tsx",
  "../app/modules/exam-builder/ExamBuilder.tsx",
  "../app/modules/exam-analysis/ExamAnalysisModule.tsx",
  "../app/modules/department-meeting/DepartmentMeetingModule.tsx",
];
const sources = await Promise.all(
  files.map((file) => readFile(new URL(file, import.meta.url), "utf8")),
);
const combined = sources.join("\n");

test("işlem hatası güvenli ve anlaşılır mesaja çevrilir", () => {
  assert.equal(
    operationErrorMessage(new Error("Açık hata"), "Yedek"),
    "Açık hata",
  );
  assert.equal(
    operationErrorMessage({}, "İşlem tamamlanamadı."),
    "İşlem tamamlanamadı.",
  );
});

test("yayınlanmamış müfredat özelliği öğretmene sebebiyle birlikte anlatılır", () => {
  const message = operationErrorMessage(
    new CurriculumFeatureUnavailableError(
      "Ders Tasarım Stüdyosu aşama kataloğu",
      "sociology",
      "2026.1",
    ),
    "Ders planı hazırlanamadı.",
  );

  // Öğretmen dili: branş adı okunur, sebep ve geçici çıkış yolu belirtilir.
  assert.match(message, /Sosyoloji/);
  assert.match(message, /henüz yayınlanmadı/);
  assert.match(message, /felsefe/i);
  assert.match(message, /devam edebilirsin/);

  // Teknik jargon öğretmene sızmaz.
  assert.doesNotMatch(message, /sociology/);
  assert.doesNotMatch(message, /2026\.1/);
  assert.doesNotMatch(message, /Error|throw|katalog özelliği/);
  assert.notEqual(message, "Ders planı hazırlanamadı.");
});

test("tanımsız branş adı çözümlenemese de mesaj üretilir", () => {
  const message = operationErrorMessage(
    new CurriculumFeatureUnavailableError("Yıllık plan çerçevesi", "fizik", "2026.1"),
    "Yedek",
  );
  assert.match(message, /fizik/);
  assert.match(message, /henüz yayınlanmadı/);
});

test("felsefe öğretmenine başka bir branşa geçme önerisi verilmez", () => {
  const message = operationErrorMessage(
    new CurriculumFeatureUnavailableError(
      "Ders Tasarım Stüdyosu aşama kataloğu",
      "philosophy",
      "2027.1",
    ),
    "Yedek",
  );
  assert.match(message, /Felsefe/);
  assert.match(message, /henüz yayınlanmadı/);
  // Felsefe öğretmeni zaten felsefede; "felsefeden devam et" anlamsız olur.
  assert.doesNotMatch(message, /felsefe dersinden devam/i);
  assert.doesNotMatch(message, /2027\.1/);
});

test("uzun süren işlemler erişilebilir canlı durum bildirir", () => {
  for (const source of sources) {
    assert.match(source, /role="status"/);
    assert.match(source, /aria-live="polite"/);
    assert.match(source, /operationMessage/);
  }
});

test("dışa aktarma hataları yakalanır ve meşgul durumu temizlenir", () => {
  assert.match(combined, /operationErrorMessage/);
  assert.match(combined, /catch \(error\)/);
  assert.match(combined, /finally/);
  assert.doesNotMatch(combined, /onClick=\{\(\) => void docx\(/);
  assert.match(sources[1], /operationErrorMessage/);
  assert.match(sources[1], /setExporting\(false\)/);
});
