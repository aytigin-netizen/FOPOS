import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { createAnonymousClassSummary } from "../app/core/anonymous-class-summary.ts";

const exam = await readFile(new URL("../app/modules/exam-analysis/ExamAnalysisModule.tsx", import.meta.url), "utf8");
const performance = await readFile(new URL("../app/modules/student-performance/StudentPerformanceModule.tsx", import.meta.url), "utf8");
const navigation = await readFile(new URL("../app/components/navigation/AppNavigation.tsx", import.meta.url), "utf8");
const hook = await readFile(new URL("../app/hooks/use-sensitive-session.ts", import.meta.url), "utf8");

test("hassas öğrenci oturumu sayfa ve modül ayrılışında uyarır", () => {
  assert.match(hook, /beforeunload/);
  assert.match(navigation, /data-sensitive-session/);
  assert.match(navigation, /window\.confirm/);
  assert.match(exam, /data-sensitive-session/);
  assert.match(performance, /data-sensitive-session/);
});

test("öğrenci oturumu ayrı silme onayı olmadan temizlenmez", () => {
  for (const source of [exam, performance]) {
    assert.match(source, /clearConfirmed/);
    assert.match(source, /disabled={!clearConfirmed}/);
  }
  assert.match(exam, /setStudents\(\[\]\)/);
  assert.match(performance, /setStudents\(\[\]\)/);
});

test("kimliksiz özet küçük grubu ve kişisel alan anahtarını reddeder", () => {
  assert.throws(() => createAnonymousClassSummary({ module: "exam_analysis", grade: 10, groupSize: 4, metrics: { average: 70 } }), /en az 5/);
  assert.throws(() => createAnonymousClassSummary({ module: "exam_analysis", grade: 10, groupSize: 5, metrics: { studentName: 1 } }), /kişisel alan/);
  const summary = createAnonymousClassSummary({ module: "student_performance", grade: 11, groupSize: 5, metrics: { classAverage: 2.7 } });
  assert.deepEqual(Object.keys(summary).sort(), ["grade", "groupSize", "metrics", "module", "schemaVersion"]);
});

test("öğrenci modülleri kalıcı tarayıcı deposu veya harici istek kullanmaz", () => {
  for (const source of [exam, performance]) assert.doesNotMatch(source, /localStorage|sessionStorage|fetch\(|axios/);
});
