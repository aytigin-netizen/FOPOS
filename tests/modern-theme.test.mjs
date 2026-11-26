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
});
