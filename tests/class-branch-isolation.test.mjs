import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const exam = await readFile(new URL("../app/modules/exam-analysis/ExamAnalysisModule.tsx", import.meta.url), "utf8");
const homework = await readFile(new URL("../app/modules/homework-tracking/HomeworkTrackingModule.tsx", import.meta.url), "utf8");

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

test("ödev takibi iframe URL parametreleri sınıf ve şube bilgilerini içerir", () => {
  assert.match(homework, /grade: classContext\.grade/);
  assert.match(homework, /branch: classContext\.branchCode/);
  assert.match(homework, /URLSearchParams/);
  assert.match(homework, /embedded: "true"/);
});
