import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(new URL("../app/modules/homework-tracking/HomeworkTrackingModule.tsx", import.meta.url), "utf8");

test("\u00f6dev takibi mod\u00fcl\u00fcr iframe tabanl\u0131 g\u00f6m\u00fcl\u00fcr", () => {
  assert.match(source, /HOMEWORK_APP_URL/);
  assert.match(source, /iframe/);
  assert.match(source, /className="homework-iframe"/);
  assert.match(source, /onLoad/);
  assert.match(source, /onError/);
  assert.match(source, /allow-popups-to-escape-sandbox/);
  assert.match(source, /allow-storage-access-by-user-activation/);
});

test("ba\u011flam parametreleri oturum bilgilerini i\u00e7erir", () => {
  assert.match(source, /grade/);
  assert.match(source, /branch/);
  assert.match(source, /subjectName/);
  assert.match(source, /URLSearchParams/);
  assert.match(source, /embedded.*true/);
});

test("y\u00fckleme ve hata durumlar\u0131 kullan\u0131c\u0131ya bildirilir", () => {
  assert.match(source, /isLoading/);
  assert.match(source, /setIsLoading/);
  assert.match(source, /error/);
  assert.match(source, /setError/);
  assert.match(source, /loading-overlay/);
  assert.match(source, /error-state/);
});

test("fallback ba\u011flant\u0131 sunar", () => {
  assert.match(source, /external-link-button/);
  assert.match(source, /target="_blank"/);
  assert.match(source, /rel="noopener noreferrer"/);
});

test("mod\u00fcl verisi d\u0131\u015f servise g\u00f6nderilmez", () => {
  assert.doesNotMatch(source, /localStorage|sessionStorage|fetch\(|axios/);
});
