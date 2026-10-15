import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const navigation = await readFile(new URL("../app/components/navigation/AppNavigation.tsx", import.meta.url), "utf8");
const page = await readFile(new URL("../app/ClientApp.tsx", import.meta.url), "utf8");
const analysis = await readFile(new URL("../app/modules/exam-analysis/ExamAnalysisModule.tsx", import.meta.url), "utf8");
const ai = await readFile(new URL("../app/modules/fopos-ai/FoposAiModule.tsx", import.meta.url), "utf8");
const privacy = await readFile(new URL("../app/modules/privacy/PrivacyCenterModule.tsx", import.meta.url), "utf8");

const settings = await readFile(new URL("../app/modules/profile-settings/ProfileSettingsModule.tsx", import.meta.url), "utf8");

test("FOPOS AI gezinmede, Gizlilik Merkezi Ayarlar altında erişilebilirdir", () => {
  assert.match(navigation, /"ai", "FOPOS AI"/);
  assert.match(settings, /onOpen\("privacy"\)/);
  assert.match(page, /<FoposAiModule/);
  assert.match(page, /<PrivacyCenterModule/);
});

test("FOPOS AI yalnız kimliksiz sınıf özetini kabul eder", () => {
  assert.match(analysis, /createAnonymousClassSummary/);
  assert.match(analysis, /onSendToAi\(anonymousSummary\(\)\)/);
  assert.doesNotMatch(ai, /studentName|schoolNumber|fullName/);
  assert.match(ai, /AnonymousClassSummary/);
});

test("gizlilik merkezi bellek, silme ve çıktı yaşam döngüsünü açıklar", () => {
  assert.match(privacy, /Kayıt ve oturum ayrımı/);
  assert.match(privacy, /Açık silme onayı/);
  assert.match(privacy, /Denetimli çıktı/);
});
