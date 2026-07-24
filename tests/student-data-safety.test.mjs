import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(
  new URL("../app/modules/exam-analysis/ExamAnalysisModule.tsx", import.meta.url),
  "utf8",
);
const compactSource = source.replace(/\s+/g, " ");
const parser = await readFile(new URL("../app/core/student-spreadsheet-import.ts", import.meta.url), "utf8");

test("öğrenci dosyası tür ve boyut sınırıyla yerel işlenir", () => {
  assert.match(parser, /\["xls", "xlsx", "csv"\]/);
  assert.match(parser, /STUDENT_IMPORT_LIMITS\.maxFileBytes/);
  assert.match(compactSource, /harici yapay zekâ servisine gönderilmez/);
});

test("eksik analiz ve onaysız mahrem veri dışa aktarılamaz", () => {
  assert.match(
    compactSource,
    /analysisComplete && contextMatches && analysisReviewConfirmed && privacyConfirmed/,
  );
  assert.match(source, /disabled=\{exporting \|\| !exportReady\}/);
  assert.match(source, /yalnız yetkili kişilerle paylaşacağım/);
});

test("örnek öğrenci kimliği ve otomatik yönetici onayı yoktur", () => {
  assert.match(source, /const initialStudents: Student\[\] = \[\]/);
  assert.doesNotMatch(source, /Örnek Öğrenci/);
  assert.doesNotMatch(source, /\\nUYGUNDUR\\n/);
});
