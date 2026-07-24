import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const css = await readFile(
  new URL("../app/globals.css", import.meta.url),
  "utf8",
);
const compact = css.replace(/\s+/g, " ");
const examAnalysisSource = await readFile(
  new URL(
    "../app/modules/exam-analysis/ExamAnalysisModule.tsx",
    import.meta.url,
  ),
  "utf8",
);
const navigationSource = await readFile(
  new URL("../app/components/navigation/AppNavigation.tsx", import.meta.url),
  "utf8",
);
const dashboardSource = await readFile(
  new URL("../app/components/dashboard/Dashboard.tsx", import.meta.url),
  "utf8",
);
const homeSource = await readFile(
  new URL("../app/page.tsx", import.meta.url),
  "utf8",
);

test("klavye odağı renk ve biçimle görünürdür", () => {
  assert.match(css, /:focus-visible/);
  assert.match(compact, /outline: 3px solid #0b5c8e/);
  assert.match(css, /\.upload-drop:focus-within/);
});

test("temel etkileşim hedefleri en az 44 pikseldir", () => {
  assert.match(
    compact,
    /button, input:not\(\[type="checkbox"\]\).*min-height: 44px/,
  );
  assert.match(compact, /\.row-delete \{ min-width: 44px; min-height: 44px/);
});

test("hareket azaltma ve yüksek kontrast tercihleri desteklenir", () => {
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /animation-iteration-count: 1 !important/);
  assert.match(css, /@media \(forced-colors: active\)/);
});

test("mobil modül menüsü okunabilir yatay hedefler kullanır", () => {
  assert.match(
    compact,
    /\.main-nav button \{ flex: 0 0 auto; min-width: 96px; min-height: 48px/,
  );
  assert.match(css, /font-size: 11px/);
});

test("mobil menü masaüstündeki daraltılmış durumu devralmaz", () => {
  assert.match(navigationSource, /if\(opening\)setCollapsed\(false\)/);
  assert.match(compact, /\.app-sidebar\.collapsed\{width:min\(86vw,300px\)\}/);
  assert.match(compact, /\.app-sidebar\.collapsed \.brand-copy\{display:flex\}/);
  assert.match(compact, /\.app-sidebar \.collapse-button\{display:none\}/);
});

test("telefon çekmece menüsü eski yatay üst menü kurallarından yalıtılır", () => {
  assert.match(
    compact,
    /\.app-sidebar \.main-nav\{ position:static; inset:auto; width:auto; height:auto; min-height:0; justify-content:flex-start; overflow-x:hidden; overflow-y:auto; background:transparent; border:0;/,
  );
  assert.match(
    compact,
    /\.app-sidebar \.main-nav button\{ width:100%; min-width:0; flex:0 0 48px;/,
  );
});

test("dashboard tüm etkin modülleri ve gerçek zamanlı karşılamayı gösterir", () => {
  assert.match(dashboardSource, /\["rosters","Öğrenci Listeleri"/);
  assert.match(dashboardSource, /\["performance","Öğrenci Performansı"/);
  assert.match(dashboardSource, /cards\.length\} etkin modül/);
  assert.match(dashboardSource, /Intl\.DateTimeFormat\("tr-TR"/);
});

test("hazır olmayan hızlı erişim bağlantıları açıkça devre dışıdır", () => {
  assert.match(dashboardSource, /disabled=\{!item\.ready\}/);
  assert.match(dashboardSource, /item\.ready&&onOpen\("resources",item\.label==="BEP"\?"bep":item\.label==="Örnek Belgeler"\?"documents":"curriculum"\)/);
  assert.match(dashboardSource, /\{label:"BEP",ready:true\}/);
  assert.match(dashboardSource, /\{label:"Örnek Belgeler",ready:true\}/);
  assert.match(dashboardSource, /\{label:"Değerler",ready:false\}/);
});

test("ders tasarım stüdyosu durum temelli ve erişilebilir çalışma akışı sunar", () => {
  assert.match(homeSource, /className="studio-workflow" aria-label="Ders tasarımı çalışma akışı"/);
  assert.match(homeSource, /Müfredat bağlamı/);
  assert.match(homeSource, /Öğretmen incelemesi/);
  assert.match(homeSource, /result\?\.pedagogicalRecord\.status === "approved"/);
  assert.match(compact, /\.studio-workflow ol\{.*grid-template-columns:repeat\(4,minmax\(0,1fr\)\)/);
});

test("web günlük plan önizlemesi kanonik TYMM alanlarıyla DOCX yapısını eşler", () => {
  assert.match(homeSource, /document-curriculum-sections/);
  assert.match(homeSource, /result\.outcome\.processComponents/);
  assert.match(homeSource, /result\.unit\.competencyFramework\.fieldSkills/);
  assert.match(homeSource, /result\.unit\.learningTeachingExperiences\.preAssessment/);
  assert.match(homeSource, /result\.unit\.differentiation\.enrichment/);
});

test("sınav analizi dosya durumları ekran okuyucuya canlı bildirilir", () => {
  assert.match(
    examAnalysisSource,
    /<small role="status" aria-live="polite">\{importStatus\}<\/small>/,
  );
  assert.match(
    examAnalysisSource,
    /<p className="import-status" role="status" aria-live="polite">\{importStatus\}<\/p>/,
  );
});

test("sınav analizi içe aktarma alanları dar ekranda tek sütuna iner", () => {
  assert.match(
    compact,
    /@media\(max-width:680px\).*\.import-mapping-grid\{grid-template-columns:1fr\}.*\.import-preview-actions\{align-items:stretch;flex-direction:column\}/,
  );
});

test("öğrenci listesi girişi soru tanımlarından önce ve tam genişlikte gösterilir", () => {
  assert.match(examAnalysisSource, /className="analysis-roster-entry"/);
  assert.match(examAnalysisSource, /className="analysis-question-entry"/);
  assert.match(css, /\.analysis-grid\s*\{[^}]*display:flex[^}]*flex-direction:column/);
  assert.match(css, /\.analysis-roster-entry\s*\{[^}]*order:-1[^}]*width:100%/);
});

test("sınav puanları dar ekranda yatay tablo yerine dokunmatik öğrenci kartlarıyla girilir", () => {
  assert.match(examAnalysisSource, /className="mobile-score-list"/);
  assert.match(examAnalysisSource, /className="mobile-question-scores"/);
  assert.match(examAnalysisSource, /inputMode="decimal"/);
  assert.match(examAnalysisSource, /mobil öğrenci boş E-Okul puanı kararı/);
  assert.match(compact, /@media\(max-width:800px\).*\.student-score-table\{display:none\}.*\.mobile-score-list\{display:grid/);
  assert.match(compact, /@media\(max-width:520px\).*\.mobile-question-scores\{grid-template-columns:repeat\(2,minmax\(0,1fr\)\)\}/);
});
