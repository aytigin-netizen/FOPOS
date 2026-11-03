import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { createStudentRosterTransfer } from "../app/core/student-roster-transfer.ts";

const exam = await readFile(new URL("../app/modules/exam-analysis/ExamAnalysisModule.tsx", import.meta.url), "utf8");
const homework = await readFile(new URL("../app/modules/homework-tracking/HomeworkTrackingModule.tsx", import.meta.url), "utf8");
const rosterModule = await readFile(new URL("../app/modules/student-rosters/StudentRostersModule.tsx", import.meta.url), "utf8");
const page = await readFile(new URL("../app/ClientApp.tsx", import.meta.url), "utf8");

test("FOPOS içindeki sınav analizi aktarımı yalnız sınıf, şube, numara ve ad taşır", () => {
  const transfer = createStudentRosterTransfer({ grade: 10, branch: "a", students: [{ no: "12", name: "Ada", scores: [100], absent: true }] });
  assert.equal(transfer.branch, "A");
  assert.deepEqual(transfer.students, [{ no: "12", name: "Ada" }]);
  assert.doesNotMatch(JSON.stringify(transfer), /score|puan|absent|devamsız/i);
});

test("sınav analizi gelen listeyi öğretmen onayıyla uygular", () => {
  assert.match(exam, /incomingRoster/);
  assert.match(exam, /acceptIncomingRoster/);
  assert.match(exam, /Aktarımı reddet ve sil/);
  assert.ok(exam.includes("incomingRoster.students.map((student) =>"));
});

test("ödev takibi kendi öğrenci listelerini yönetir ve FOPOS aktarımını kabul etmez", () => {
  assert.match(homework, /HOMEWORK_APP_URL/);
  assert.match(homework, /iframe/);
  assert.match(homework, /Öğrenci listeleri bu bağımsız uygulamanın kendi hesabında saklanır/);
  assert.doesNotMatch(homework, /incomingRoster|onResolveRoster|postMessage/);
  assert.doesNotMatch(rosterModule, /Ödev Takibine gönder/);
  assert.doesNotMatch(page, /onTransferRoster/);
});

test("ödev takibi URL'si sınıf, şube, ders ve öğretim yılı bağlamını taşır", () => {
  assert.match(homework, /grade: classContext\.grade/);
  assert.match(homework, /branch: classContext\.branchCode/);
  assert.match(homework, /subject: subjectName/);
  assert.match(homework, /academicYear: baseMeta\.academicYear/);
  assert.match(homework, /workspaceId: classContext\.id/);
  assert.match(homework, /embedded: "true"/);
});

test("sınav analizi aktarımı geçici üst seviye oturumda tutulur", () => {
  assert.match(page, /pendingRosterTransfer/);
  assert.doesNotMatch(page, /localStorage.*pendingRosterTransfer|sessionStorage.*pendingRosterTransfer/);
});
