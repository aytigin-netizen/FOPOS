import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { createAnonymousClassSummary } from "../app/core/anonymous-class-summary.ts";

const exam = await readFile(new URL("../app/modules/exam-analysis/ExamAnalysisModule.tsx", import.meta.url), "utf8");
const homework = await readFile(new URL("../app/modules/homework-tracking/HomeworkTrackingModule.tsx", import.meta.url), "utf8");
const navigation = await readFile(new URL("../app/components/navigation/AppNavigation.tsx", import.meta.url), "utf8");
const hook = await readFile(new URL("../app/hooks/use-sensitive-session.ts", import.meta.url), "utf8");

test("hassas \u00f6\u011frenci oturumu sayfa ve mod\u00fcl ayr\u0131l\u0131\u015f\u0131nda uyar\u0131r", () => {
  assert.match(hook, /beforeunload/);
  assert.match(navigation, /data-sensitive-session/);
  assert.match(navigation, /window\.confirm/);
  assert.match(exam, /data-sensitive-session/);
  assert.doesNotMatch(homework, /data-sensitive-session/);
});

test("\u00f6\u011frenci oturumu ayr\u0131 silme onay\u0131 olmadan temizlenmez", () => {
  assert.match(exam, /clearConfirmed/);
  assert.match(exam, /disabled={!clearConfirmed}/);
  assert.match(exam, /setStudents\(\[\]\)/);
  assert.doesNotMatch(homework, /clearConfirmed|setClearConfirmed|onResolveRoster/);
});

test("kimliksiz \u00f6zet k\u00fcc\u00fck grubu ve ki\u015fisel alan anahtar\u0131n\u0131 reddeder", () => {
  assert.throws(() => createAnonymousClassSummary({ module: "exam_analysis", grade: 10, groupSize: 4, metrics: { average: 70 } }), /en az 5/);
  assert.throws(() => createAnonymousClassSummary({ module: "exam_analysis", grade: 10, groupSize: 5, metrics: { studentName: 1 } }), /ki\u015fisel alan/);
  const summary = createAnonymousClassSummary({ module: "student_homework", grade: 11, groupSize: 5, metrics: { classAverage: 2.7 } });
  assert.deepEqual(Object.keys(summary).sort(), ["grade", "groupSize", "metrics", "module", "schemaVersion"]);
});

test("\u00f6\u011frenci mod\u00fclleri kal\u0131c\u0131 taray\u0131c\u0131 deposu veya harici istek kullanmaz", () => {
  for (const source of [exam, homework]) assert.doesNotMatch(source, /localStorage|sessionStorage|fetch\(|axios/);
});
