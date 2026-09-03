import assert from "node:assert/strict";
import test from "node:test";
import { measureClientBundle } from "../scripts/client-bundle-metrics.mjs";

const BASELINE = {
  clientAppRawBytes: 1_093_323,
  clientAppGzipBytes: 277_281,
  initialApplicationGzipBytes: 362_145,
};

const expectedDynamicEntries = [
  "annual-plan/AnnualPlanModule.tsx",
  "department-meeting/DepartmentMeetingModule.tsx",
  "exam-builder/ExamBuilder.tsx",
  "exam-analysis/ExamAnalysisModule.tsx",
  "student-performance/StudentPerformanceModule.tsx",
  "student-rosters/StudentRostersModule.tsx",
  "resource-center/ResourceCenterModule.tsx",
  "fopos-ai/FoposAiModule.tsx",
  "privacy/PrivacyCenterModule.tsx",
  "record-archive/RecordArchiveModule.tsx",
  "profile-settings/ProfileSettingsModule.tsx",
  "class-workspaces/ClassWorkspacesModule.tsx",
];

const metrics = await measureClientBundle();

test("üretim manifesti her ertelenmiş ekranı ayrı dinamik giriş olarak taşır", () => {
  const dynamicEntries = Object.entries(metrics.manifest)
    .filter(([, item]) => item.isDynamicEntry)
    .map(([key]) => key);
  for (const suffix of expectedDynamicEntries) {
    assert.ok(dynamicEntries.some((key) => key.endsWith(suffix)), `${suffix} ayrı parça değil`);
  }
});

test("ClientApp 500 KB sınırının altına iner ve başlangıçtan küçülür", () => {
  assert.ok(metrics.clientApp);
  assert.ok(metrics.clientApp.rawBytes < 500_000);
  assert.ok(metrics.clientApp.rawBytes < BASELINE.clientAppRawBytes);
  assert.ok(metrics.clientApp.gzipBytes < BASELINE.clientAppGzipBytes);
});

test("ilk uygulama JS gzip toplamı en az yüzde 15 azalır", () => {
  const maximumAccepted = Math.floor(BASELINE.initialApplicationGzipBytes * 0.85);
  assert.ok(
    metrics.initialApplicationJs.gzipBytes <= maximumAccepted,
    `${metrics.initialApplicationJs.gzipBytes} bayt, ${maximumAccepted} bayt eşiğini aşıyor`,
  );
});
