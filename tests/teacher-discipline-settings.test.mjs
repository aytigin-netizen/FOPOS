import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const route = await readFile(
  new URL("../app/api/teacher-disciplines/route.ts", import.meta.url),
  "utf8",
);
const settings = await readFile(
  new URL(
    "../app/modules/profile-settings/ProfileSettingsModule.tsx",
    import.meta.url,
  ),
  "utf8",
);
const repository = await readFile(
  new URL("../db/teacher-disciplines.ts", import.meta.url),
  "utf8",
);

test("branş API'si doğrulanmış oturum ve aynı-origin sınırını korur", () => {
  assert.match(route, /getChatGPTUser/);
  assert.match(route, /status: 401/);
  assert.match(route, /sameOrigin\(request\)/);
  assert.match(route, /status: 403/);
  assert.match(route, /ensureWorkspaceAccount\(user\.email\)/);
  assert.doesNotMatch(route, /oai-authenticated-user-email.*body/s);
});

test("API yalnız kayıtlı müfredat paketlerini atanabilir olarak sunar", () => {
  assert.match(route, /listRegisteredDisciplines/);
  assert.match(route, /supportedCodes/);
  assert.match(route, /Yalnız müfredat paketi hazır branşlar atanabilir/);
  assert.match(route, /replaceTeacherDisciplines/);
});

test("branş ayarları kullanıcıya özgü D1 deposunda korunur", () => {
  assert.match(repository, /WHERE user_id = \?/g);
  assert.match(repository, /Tam olarak bir varsayılan branş seçilmelidir/);
  assert.match(repository, /archived_at IS NULL/);
  assert.doesNotMatch(repository, /localStorage|sessionStorage/);
});

test("Ayarlar ekranı çoklu seçim ve tek varsayılan branş denetimi sunar", () => {
  assert.match(settings, /fetch\("\/api\/teacher-disciplines"/);
  assert.match(settings, /method: "PUT"/);
  assert.match(settings, /type="checkbox"/);
  assert.match(settings, /type="radio"/);
  assert.match(settings, /name="default-discipline"/);
  assert.match(settings, /Branşları kaydet/);
  assert.match(settings, /en az bir branş seçili kalmalıdır/);
  assert.match(settings, /Etkin bir sınıfta kullanılan branş/);
  assert.doesNotMatch(settings, /localStorage|sessionStorage/);
});
