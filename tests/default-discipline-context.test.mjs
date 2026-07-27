import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const route = await readFile(
  new URL("../app/api/class-workspaces/route.ts", import.meta.url),
  "utf8",
);
const repository = await readFile(
  new URL("../db/class-workspaces.ts", import.meta.url),
  "utf8",
);
const moduleSource = await readFile(
  new URL(
    "../app/modules/class-workspaces/ClassWorkspacesModule.tsx",
    import.meta.url,
  ),
  "utf8",
);
const emptyState = await readFile(
  new URL(
    "../app/components/workspace/ClassWorkspaceEmptyState.tsx",
    import.meta.url,
  ),
  "utf8",
);

test("sınıf API'si varsayılan branşı kullanıcı hesabından çözer", () => {
  assert.match(route, /ensureDefaultTeacherDiscipline/);
  assert.match(route, /listTeacherDisciplines/);
  assert.match(route, /assignment\.isDefault/);
  assert.match(route, /defaultDisciplineCode/);
  assert.doesNotMatch(route, /subjectCode.*\?\?.*"philosophy"/s);
});

test("yalnız kayıtlı müfredat paketi olan atanmış branşlar sınıf bağlamına açılır", () => {
  assert.match(route, /listRegisteredDisciplines/);
  assert.match(route, /registeredCodes\.has\(requestedSubject\)/);
  assert.match(
    route,
    /Sınıf yalnız müfredat paketi hazır bir branşla oluşturulabilir/,
  );
  assert.match(repository, /assertAssignedDiscipline/);
});

test("sınıf deposu eksik branşı sessizce felsefeye dönüştürmez", () => {
  assert.match(repository, /branş seçimi gereklidir/);
  assert.doesNotMatch(repository, /: "philosophy"/);
});

test("sınıf yönetimi branş seçimini ve branşa özgü şube önerisini kullanır", () => {
  assert.match(moduleSource, /subjectCode: string/);
  assert.match(moduleSource, /item\.subjectCode === subjectCode/);
  assert.match(moduleSource, /JSON\.stringify\(\{ subjectCode, grade, branchCode \}\)/);
  assert.match(moduleSource, /discipline\.isDefault \? " • Varsayılan"/);
  assert.match(emptyState, /defaultDisciplineCode/);
  assert.match(emptyState, /item\.subjectCode === subjectCode/);
  assert.match(emptyState, /subjectCode,/);
  assert.doesNotMatch(moduleSource, /localStorage|sessionStorage/);
  assert.doesNotMatch(emptyState, /localStorage|sessionStorage/);
});
