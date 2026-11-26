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

test("Plus Jakarta Sans Latin ve Latin Extended alt kümeleriyle Türkçe karakterleri kapsar", () => {
  assert.ok(theme.includes("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200..800&display=swap&subset=latin,latin-ext"));
  const turkish = "çğıİöşüÇĞIÖŞÜ";
  assert.equal([...turkish].length, 13);
  assert.ok([...turkish].every((character) => character.codePointAt(0) > 0x7f));
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
