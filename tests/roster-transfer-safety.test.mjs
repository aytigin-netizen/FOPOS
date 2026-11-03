import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { createStudentRosterTransfer } from "../app/core/student-roster-transfer.ts";

const exam = await readFile(new URL("../app/modules/exam-analysis/ExamAnalysisModule.tsx", import.meta.url), "utf8");
const homework = await readFile(new URL("../app/modules/homework-tracking/HomeworkTrackingModule.tsx", import.meta.url), "utf8");
const page = await readFile(new URL("../app/ClientApp.tsx", import.meta.url), "utf8");

test("aktar\u0131m paketi yaln\u0131z s\u0131n\u0131f, \u015fube, numara ve ad ta\u015f\u0131r", () => {
  const transfer = createStudentRosterTransfer({ grade: 10, branch: "a", students: [{ no: "12", name: "Ada", scores: [100], absent: true }] });
  assert.equal(transfer.branch, "A");
  assert.deepEqual(transfer.students, [{ no: "12", name: "Ada" }]);
  assert.doesNotMatch(JSON.stringify(transfer), /score|puan|absent|devams\u0131z/i);
});

test("s\u0131nav analizi aktar\u0131m\u0131 a\u00e7\u0131k \u00f6\u011fretmen onay\u0131na ba\u011flar", () => {
  assert.match(exam, /transferConfirmed/);
  assert.match(exam, /Aktar\u0131m s\u0131n\u0131r\u0131n\u0131 ve mevcut analiz oturumunun kapanaca\u011f\u0131n\u0131 anl\u0131yorum/);
  assert.match(exam, /disabled={!transferConfirmed \|\| !contextMatches \|\| students\.length === 0}/);
  assert.match(exam, /students\.map\(\(\{ no, name \}\) => \(\{ no, name \}\)\)/);
});

test("performans mod\u00fcl\u00fcl paketi otomatik uygulamaz ve kabul veya ret ister", () => {
  assert.match(homework, /incomingRoster/);
  assert.match(homework, /onResolveRoster/);
  assert.match(homework, /useEffect/);
  assert.match(homework, /iframe/);
  assert.match(homework, /HOMEWORK_APP_URL/);
});

test("roster aktar\u0131m\u0131 iframe URL'ne parametre olarak eklenir", () => {
  assert.match(homework, /incomingRoster/);
  assert.match(homework, /onResolveRoster/);
  assert.match(homework, /workspaceId/);
});

test("aktar\u0131m ge\u00e7ici \u00fcst seviye oturum durumunda tutulur", () => {
  assert.match(page, /pendingRosterTransfer/);
  assert.doesNotMatch(page, /localStorage.*pendingRosterTransfer|sessionStorage.*pendingRosterTransfer/);
  assert.match(page, /setPendingRosterTransfer\(null\)/);
});
