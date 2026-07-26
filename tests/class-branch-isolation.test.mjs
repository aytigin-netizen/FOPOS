import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const exam = await readFile(new URL("../app/modules/exam-analysis/ExamAnalysisModule.tsx", import.meta.url), "utf8");
const performance = await readFile(new URL("../app/modules/student-performance/StudentPerformanceModule.tsx", import.meta.url), "utf8");

test("sınav öğrenci listesi sınıf ve şube bağlamına mühürlenir", () => {
  assert.match(exam, /type RosterContext/);
  assert.match(exam, /setRosterContext\(\{ grade, branch \}\)/);
  assert.match(exam, /contextMatches/);
  assert.match(exam, /analysisComplete && contextMatches/);
  assert.match(exam, /assertStudentImportWorkspace\(pendingImport, classContext\)/);
});

test("sınav analizinde bağlam değişimi öğrenci verisini onaysız silmez", () => {
  assert.match(exam, /Sınıf değişirse oturumdaki öğrenci listesi/);
  assert.match(exam, /Şube değişirse oturumdaki öğrenci listesi/);
  assert.match(exam, /window\.confirm/);
  assert.match(exam, /resetStudentData/);
});

test("performans kayıtları da sınıf ve şube değişiminde korunur", () => {
  assert.match(performance, /const \[branch, setBranch\]/);
  assert.match(performance, /changeContext/);
  assert.match(performance, /performans kayıtları ve destek planları silinir/);
  assert.match(performance, /window\.confirm/);
  assert.match(performance, /fopos-\$\{grade\}-\$\{branch\}-kimliksiz-performans-ozeti/);
});
