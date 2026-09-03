import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const clientApp = await readFile(new URL("../app/ClientApp.tsx", import.meta.url), "utf8");
const boundary = await readFile(new URL("../app/components/async/AsyncModuleBoundary.tsx", import.meta.url), "utf8");

const lazyModules = [
  "AnnualPlanModule", "DepartmentMeetingModule", "ExamBuilder",
  "ExamAnalysisModule", "StudentPerformanceModule", "StudentRostersModule",
  "ResourceCenterModule", "FoposAiModule", "PrivacyCenterModule",
  "RecordArchiveModule", "ProfileSettingsModule", "ClassWorkspacesModule",
];

test("bağımsız ekranlar ilk istemci paketinden ayrılır", () => {
  for (const moduleName of lazyModules) {
    assert.match(clientApp, new RegExp(`const ${moduleName} = lazy\\(\\(\\) => import\\(`));
    assert.doesNotMatch(clientApp, new RegExp(`import ${moduleName} from`));
  }
});

test("Ders Tasarım Stüdyosu kabuk içinde ve ilk yükleme yolunda kalır", () => {
  assert.match(clientApp, /view === "studio"/);
  assert.match(clientApp, /makeResult/);
  assert.doesNotMatch(clientApp, /lazy\(\(\) => import\("\.\/modules\/lesson-studio/);
});

test("tembel ekran sınırı erişilebilir Türkçe yükleme ve hata durumları sunar", () => {
  assert.match(clientApp, /<AsyncModuleBoundary key=\{view\}/);
  assert.match(boundary, /role="status"/);
  assert.match(boundary, /aria-live="polite"/);
  assert.match(boundary, /aria-busy="true"/);
  assert.match(boundary, /role="alert"/);
  assert.match(boundary, /yükleniyor/);
  assert.match(boundary, /açılamadı/);
  assert.match(boundary, /Yeniden dene/);
});

test("hassas oturum ve modüller arası aktarım durumu ClientApp sahipliğinde kalır", () => {
  for (const stateName of [
    "aiSummary", "pendingRosterTransfer", "pendingRosterTarget",
    "pendingExamTransfer", "sessionRosters", "classWorkspaces",
    "selectedClassWorkspaceId",
  ]) assert.match(clientApp, new RegExp(`\\[${stateName},`));
});

test("normal modül geçişleri oluşturulan ders planını korur", () => {
  const navigationHandler = clientApp.match(
    /<AppNavigation[\s\S]*?onChange=\{\(next\) => \{([\s\S]*?)\}\}\s*\/>/,
  )?.[1] ?? "";
  assert.match(navigationHandler, /setView\(next\)/);
  assert.doesNotMatch(navigationHandler, /setResult\(null\)/);
  assert.match(clientApp, /<Dashboard[\s\S]*?setView\(next\)\}\}\s*\/>/);
  assert.match(clientApp, /<ResourceCenterModule[\s\S]*?onOpen=\{\(next\)=>setView\(next\)\}/);
});

test("müfredat kapsamı ve özel aktarım değişiklikleri eski planı temizlemeyi sürdürür", () => {
  for (const functionName of ["changeGrade", "changeUnit", "changeWeek", "changeSubject"]) {
    const body = clientApp.match(
      new RegExp(`function ${functionName}\\([\\s\\S]*?\\n  \\}`),
    )?.[0] ?? "";
    assert.match(body, /setResult\(null\)/, `${functionName} eski planı temizlemeli`);
  }
  assert.match(clientApp, /setPendingExamTransfer\(transfer\); setView\("analysis"\); setResult\(null\)/);
  assert.match(clientApp, /setPendingRosterTarget\("performance"\); setView\("performance"\); setResult\(null\)/);
});
