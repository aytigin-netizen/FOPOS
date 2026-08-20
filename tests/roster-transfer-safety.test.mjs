import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { createStudentRosterTransfer } from "../app/core/student-roster-transfer.ts";

const exam = await readFile(new URL("../app/modules/exam-analysis/ExamAnalysisModule.tsx", import.meta.url), "utf8");
const performance = await readFile(new URL("../app/modules/student-performance/StudentPerformanceModule.tsx", import.meta.url), "utf8");
const page = await readFile(new URL("../app/ClientApp.tsx", import.meta.url), "utf8");

test("aktarım paketi yalnız sınıf, şube, numara ve ad taşır", () => {
  const transfer = createStudentRosterTransfer({ grade: 10, branch: "a", students: [{ no: "12", name: "Ada", scores: [100], absent: true }] });
  assert.equal(transfer.branch, "A");
  assert.deepEqual(transfer.students, [{ no: "12", name: "Ada" }]);
  assert.doesNotMatch(JSON.stringify(transfer), /score|puan|absent|devamsız/i);
});

test("sınav analizi aktarımı açık öğretmen onayına bağlar", () => {
  assert.match(exam, /transferConfirmed/);
  assert.match(exam, /Aktarım sınırını ve mevcut analiz oturumunun kapanacağını anlıyorum/);
  assert.match(exam, /disabled={!transferConfirmed \|\| !contextMatches \|\| students\.length === 0}/);
  assert.match(exam, /students\.map\(\(\{ no, name \}\) => \(\{ no, name \}\)\)/);
});

test("performans modülü paketi otomatik uygulamaz ve kabul veya ret ister", () => {
  assert.match(performance, /incomingRoster/);
  assert.match(performance, /Liste otomatik uygulanmadı/);
  assert.match(performance, /Aktarımı reddet ve sil/);
  assert.match(performance, /öğrenciyi performansa kabul et/);
  assert.match(performance, /scores: emptyScores\(\)/);
});

test("aktarım onayı görünür alana alınır ve kabul sonrası öğrenci kartlarına odaklanır", () => {
  assert.match(performance, /incomingRosterRef/);
  assert.match(performance, /incomingRosterRef\.current\?\.scrollIntoView/);
  assert.match(performance, /incomingRosterRef\.current\?\.focus/);
  assert.match(performance, /resultsRef\.current\?\.scrollIntoView/);
  assert.match(performance, /students\.length\} öğrenci performans görünümüne eklendi/);
  assert.match(exam, /incomingRosterRef\.current\?\.scrollIntoView/);
});

test("aktarım geçici üst seviye oturum durumunda tutulur", () => {
  assert.match(page, /pendingRosterTransfer/);
  assert.doesNotMatch(page, /localStorage.*pendingRosterTransfer|sessionStorage.*pendingRosterTransfer/);
  assert.match(page, /setPendingRosterTransfer\(null\)/);
});
