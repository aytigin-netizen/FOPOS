import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { operationErrorMessage } from "../app/core/operation-error.ts";

const files = [
  "../app/page.tsx",
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
