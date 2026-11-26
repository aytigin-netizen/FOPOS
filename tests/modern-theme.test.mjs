import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");
const layout = await read("../app/layout.tsx");
const theme = await read("../app/theme-modern.css");
const navigation = await read("../app/components/navigation/AppNavigation.tsx");
const client = await read("../app/ClientApp.tsx");

test("modern tema, temel stillerden sonra yüklenir", () => {
  const base = layout.indexOf('import "./globals.css"');
  const modern = layout.indexOf('import "./theme-modern.css"');
  assert.ok(base >= 0 && modern > base);
});

test("Plus Jakarta Sans build'de self-host edilir; Latin Extended (Türkçe ş ğ ı İ) alt kümesi açıktır", () => {
  assert.match(layout, /from "next\/font\/google"/);
  assert.match(layout, /Plus_Jakarta_Sans\(\{[^}]*subsets: \["latin", "latin-ext"\]/);
  assert.match(layout, /variable: "--font-jakarta"/);
  assert.match(layout, /<html lang="tr" className=\{jakarta\.variable\}>/);
  assert.ok(!theme.includes("fonts.googleapis.com"), "çalışma anında Google Fonts isteği yapılmamalı");
  assert.match(theme, /var\(--font-jakarta/);
});

test("mercan zemin üstündeki metinler koyu indigo kalır (AA kontrast)", () => {
  assert.match(theme, /\.today-badge \{ background: var\(--m-coral\); color: var\(--m-indigo-950\)/);
  assert.match(theme, /\.today-path\.coral \{[^}]*--tone-fg: var\(--m-coral-ink\)/);
  assert.match(theme, /\.teacher-avatar \{[^}]*background: var\(--m-coral\);\s*color: var\(--m-indigo-950\)/);
});

test("tema erişilebilirlik güvencelerini korur", () => {
  assert.match(theme, /:focus-visible \{ outline: 3px solid #0b5c8e/);
  assert.match(theme, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(theme, /@media \(forced-colors: active\)/);
  assert.match(theme, /min-height: 46px/);
});

test("tema koyu görünümü eski yeşil yüzey belirteçlerinden devralır", () => {
  assert.match(theme, /html\[data-theme="dark"\],\s*html\[data-theme="dark"\] body/);
});

test("TYMM etiketi arayüzde görünür kalır", () => {
  assert.match(client, /TYMM \$\{curriculum\.sourceYear\}/);
  assert.match(navigation, /curriculum-pill/);
  assert.match(theme, /\.sidebar-bottom \.curriculum-pill \{ flex: 1 0 100%/);
  // Dar masaüstünde TYMM etiketi gizlenmez: kısa biçim görünür, tam metin ekran okuyucuda kalır.
  assert.match(navigation, /pill-short/);
  assert.match(navigation, /title=\{curriculumLabel\}/);
  assert.match(theme, /\.curriculum-pill \.pill-short \{ display: inline; \}|\.pill-short \{ display: inline; \}/);
  assert.ok(!/curriculum-pill span \{ display: none; \}/.test(theme));
});

test("üst gezinme: gruplar açılır menü, klavye ve ekran okuyucu uyumlu", () => {
  assert.match(navigation, /aria-expanded=\{open\}/);
  assert.match(navigation, /aria-haspopup="true"/);
  assert.match(navigation, /event\.key === "Escape"/);
  assert.match(theme, /\.topnav \.nav-panel/);
  assert.match(theme, /@media \(min-width: 901px\)/);
});

test("açılış sayfası bölümleri: yol kartları, adımlar, SSS ve TYMM bilgisi", async () => {
  const dashboard = await read("../app/components/dashboard/Dashboard.tsx");
  for (const cls of ["today-stats", "today-paths", "today-steps", "today-faq", "today-footer"]) assert.match(dashboard, new RegExp(cls));
  assert.match(dashboard, /Türkiye Yüzyılı Maarif Modeli ile uyumlu/);
  assert.match(dashboard, /isAuthenticated\|\|!path\.auth/);
  assert.match(dashboard, /today-tymm/);
  assert.match(client, /curriculum=\{curriculum\}/);
  assert.match(dashboard, /curriculum\.units\.find/);
  assert.match(dashboard, /frameworkOutcome\?\.processComponents/);
  for (const field of ["fieldSkills", "socialEmotionalLearning", "values", "literacy"]) assert.match(dashboard, new RegExp(field));
  assert.match(dashboard, /Öğrenmeyi değerlendir/);
  assert.match(dashboard, /Biçimlendirici değerlendirmede öğrenme kanıtlarını izle/);
});


test("Ders Tasarım Stüdyosu modern tema: form işlevleri korunurken görsel dil yenilenir", () => {
  assert.match(theme, /\.studio-hero \{/);
  assert.match(theme, /\.studio-hero \.builder-card \{/);
  assert.match(theme, /\.studio-hero \.primary-button \{/);
  assert.match(theme, /\.studio-workflow ol \{/);
  assert.match(theme, /html\[data-theme="dark"\] \.studio-hero/);
  assert.match(theme, /@media \(max-width: 640px\)/);
  assert.match(theme, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(client, /view === "studio"/);
  assert.match(client, /void generatePlan\(\)/);
});


test("Yıllık Plan modern tema: resmî form, kontrol ve belge önizlemesi korunarak yenilenir", async () => {
  const annual = await read("../app/modules/annual-plan/AnnualPlanModule.tsx");
  assert.match(theme, /\.annual-hero \{/);
  assert.match(theme, /\.annual-hero \.annual-fields \{/);
  assert.match(theme, /\.annual-results \.record-approval-bar/);
  assert.match(theme, /\.annual-results \.annual-preview/);
  assert.match(theme, /html\[data-theme="dark"\] \.annual-hero/);
  assert.match(theme, /@media \(max-width: 640px\)/);
  assert.match(theme, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(annual, /className="annual-hero"/);
  assert.match(annual, /onSubmit=\{\(e\) =>/);
  assert.match(annual, /Önce takvim ve müfredat kontrollerini tamamlayın/);
  assert.match(annual, /OPUS öğretmen onayı ver/);
  assert.match(annual, /Yıllık planı DOCX indir/);
  assert.match(annual, /annual-document/);
});


test("Sınav modülü modern tema: belirtke, A/B düzenleyici ve öğretmen onayı görsel olarak yenilenir", async () => {
  const exam = await read("../app/modules/exam-builder/ExamBuilder.tsx");
  for (const selector of [
    ".exam-hero .builder-card", ".exam-hero .exam-blueprint",
    ".exam-results .record-approval-bar", ".exam-results .booklet-switch",
    ".exam-results .question-editor", "html[data-theme=\"dark\"] .exam-results",
    "@media (max-width: 640px)", "@media (prefers-reduced-motion: reduce)"
  ]) assert.ok(theme.includes(selector), `eksik sınav stili: ${selector}`);
  for (const contract of [
    'className="annual-hero exam-hero"', 'className="exam-blueprint"',
    'className="record-approval-bar"', 'className="mode-switch booklet-switch"',
    'className="question-editor-list"', 'A Kitapçığı', 'B Kitapçığı',
    'OPUS öğretmen onayı ver', 'Sınav paketi OPUS öğretmen onayı tamamlanmadan dışa aktarılamaz.',
    'Sınav analizine aktar', 'Öğrenci kitapçığı', 'Öğretmen paketi'
  ]) assert.ok(exam.includes(contract), `sınav işlev sözleşmesi korunmalı: ${contract}`);
  assert.match(exam, /disabled=\{!exportReady \|\| exportingAudience !== null\}/);
  assert.match(exam, /sourceQuestionId/);
});


test("Sınav Analizi ve Zümre modülleri modern tema: hero, sonuç, onay ve koyu tema stilleri", async () => {
  const analysis = await read("../app/modules/exam-analysis/ExamAnalysisModule.tsx");
  const meeting = await read("../app/modules/department-meeting/DepartmentMeetingModule.tsx");
  for (const selector of [
    "--m-indigo-800: #25217a",
    ".annual-hero.analysis-hero", ".analysis-hero .builder-card",
    ".analysis-results .record-approval-bar", ".analysis-results .analysis-summary",
    ".annual-hero.meeting-hero", ".meeting-hero .agenda-builder",
    ".meeting-results .meeting-preview", ".meeting-results .record-approval-bar",
    'html[data-theme="dark"] .analysis-results',
    'html[data-theme="dark"] .meeting-results',
    "@media (max-width: 760px)"
  ]) assert.ok(theme.includes(selector), `eksik modern modül stili: ${selector}`);
  assert.match(analysis, /className="annual-hero analysis-hero"/);
  assert.match(analysis, /className="results-section analysis-results"/);
  assert.match(analysis, /className="record-approval-bar"/);
  assert.match(meeting, /className="annual-hero meeting-hero"/);
  assert.match(meeting, /className="agenda-builder"/);
  assert.match(meeting, /className="results-section meeting-results"/);
  assert.match(meeting, /className="meeting-preview"/);
});


test("Kaynak Merkezi ve Düşünce Deneyleri yeşil ağırlıklı eski paletten FOPOS 2026 paletine geçer", async () => {
  const moduleTheme = await read("../app/theme-module-overrides.css");
  const resources = await read("../app/modules/resource-center/ResourceCenterModule.tsx");
  const thought = await read("../app/modules/thought-experiments/ThoughtExperimentsModule.tsx");
  for (const selector of [
    ".resource-center .resource-hero", ".resource-center .resource-verification",
    ".resource-center .resource-sections button.active", ".resource-center .resource-summary > div",
    ".resource-center .resource-unit-card", ".resource-center .bep-principle",
    ".resource-center .document-guide-grid button",
    ".thought-lab .thought-lab-hero", ".thought-lab .thought-catalog-card",
    ".thought-lab .thought-panel", ".thought-lab .thought-central-question",
    ".thought-lab .thought-source-links a",
    'html[data-theme="dark"] .resource-center', 'html[data-theme="dark"] .thought-lab',
    "@media (max-width: 760px)", "@media (prefers-reduced-motion: reduce)"
  ]) assert.ok(moduleTheme.includes(selector), `eksik modül tema stili: ${selector}`);
  assert.match(resources, /className="resource-hero"/);
  assert.match(thought, /className="thought-lab-hero"/);
  assert.match(layout, /import "\.\/theme-module-overrides\.css"/);
});
