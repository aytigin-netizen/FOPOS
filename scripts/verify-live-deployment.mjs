#!/usr/bin/env node
// Canlı sürüm doğrulaması: canlı SPA'nın JS parçalarını indirir ve PR'lara bağlı metin işaretlerini arar.
// Kullanım: node scripts/verify-live-deployment.mjs <canlı-adres>   (ör. https://fopos-ders-studyosu.aytigin.chatgpt.site)
// Not: chunk hash'i sürüm kimliği değildir (aynı commit farklı hash üretir); yalnız içerik işaretleri kanıttır.
const base = (process.argv[2] || '').replace(/\/+$/, '');
if (!/^https?:\/\//.test(base)) { console.error('Kullanım: node scripts/verify-live-deployment.mjs https://<canlı-adres>'); process.exit(2); }

// İşaret → ilk görüldüğü PR. İşaretler kaynakta birebir aranmıştır (20 Ekim 2026, main 4334eba).
const MARKERS = [
  ['#234', 'Önceki sorularla sınav oluştur'],
  ['#235/#238', 'Sadelik'],
  ['#235/#238', 'Taş, su ve hava madde midir?'],
  ['#241', 'TYMM ÇERÇEVE İZİ'],
  ['#242', 'Sınav aktarımındaki süreç bileşeni boş olamaz.'],
  ['#246', 'Beceriler arası ilişkiler'],
  ['#246', 'Okuryazarlık becerileri'],
];
const fetchText = async (url) => { const r = await fetch(url, { redirect: 'follow' }); if (!r.ok) throw new Error(`${r.status} ${url}`); return r.text(); };
// Vite parçaları birbirini "./Ad-hash.js" (importing dosyaya göre göreli) veya "assets/Ad-hash.js" biçiminde anar.
const refRe = /["'`]((?:\.{1,2}\/|\/)?(?:[A-Za-z0-9_.\-]+\/)*[A-Za-z0-9_.\-]+\.js)["'`]/g;
// "assets/X.js" (Vite __vite__mapDeps) kök adrese göre, "./X.js" importing dosyaya göre çözülür.
const refs = (text, from) => [...text.matchAll(refRe)].map((m) => { try { return new URL(m[1], m[1].startsWith('assets/') ? base + '/' : from).href; } catch { return null; } }).filter((u) => u && u.startsWith(base + '/'));

// Paketleyici ASCII olmayan harfleri kaçışlı yazabilir (\xF6, \u00f6); üç biçimi de ara.
const esc = (str, fn) => str.replace(/[^\x00-\x7f]/g, fn);
const hex = (c, n) => c.charCodeAt(0).toString(16).padStart(n, '0');
const forms = (str) => [str, esc(str, (c) => '\\u' + hex(c, 4)), esc(str, (c) => '\\u' + hex(c, 4).toUpperCase()), esc(str, (c) => (c.charCodeAt(0) < 256 ? '\\x' + hex(c, 2) : '\\u' + hex(c, 4))), esc(str, (c) => (c.charCodeAt(0) < 256 ? '\\x' + hex(c, 2).toUpperCase() : '\\u' + hex(c, 4).toUpperCase()))];
const has = (text, str) => forms(str).some((f) => text.includes(f));
const html = await fetchText(base + '/');
const rawSrc = [...html.matchAll(/(?:src|href)=["']([^"']+\.js)["']/g)].map((m) => new URL(m[1], base + '/').href);
const queue = rawSrc.filter((u) => u.startsWith(base + '/'));
const seen = new Set(); const texts = new Map(); const failed = [];
while (queue.length && seen.size < 200) {
  const url = queue.shift(); if (seen.has(url)) continue; seen.add(url);
  try {
    const t = await fetchText(url); texts.set(url.slice(base.length + 1), t);
    for (const u of refs(t, url)) if (!seen.has(u)) queue.push(u);
  } catch (e) { failed.push(url); }
}
console.log(`İndirilen JS parçası: ${texts.size}; erişilemeyen aday: ${failed.length}`);
if (failed.length) console.log('Erişilemeyen adaylar (ilk 5):', failed.slice(0, 5).join(', '));
let missing = 0;
for (const [pr, s] of MARKERS) {
  const where = [...texts].filter(([, t]) => has(t, s)).map(([k]) => k);
  const ok = where.length > 0; if (!ok) missing++;
  console.log(`${ok ? 'VAR  ' : 'YOK  '} ${pr.padEnd(10)} ${JSON.stringify(s)}${ok ? '  ← ' + where[0] : ''}`);
}
// #238: onay kaydı (kapasite 2→8) yalnız metin olarak aranabilir; aynı parçada ikisi birlikte olmalı.
const approval = [...texts].find(([, t]) => t.includes('Aytekin YILMAZ') && t.includes('2026-10-17'));
console.log(`${approval ? 'VAR  ' : 'YOK  '} #238       onay kaydı (Aytekin YILMAZ + 2026-10-17)${approval ? '  ← ' + approval[0] : ''}`);
if (!approval) missing++;
console.log(missing ? `\nSONUÇ: ${missing} işaret eksik — canlı main'in gerisinde.` : '\nSONUÇ: tüm işaretler canlıda — canlı en az #246 içeriğini taşıyor.');
process.exit(missing ? 1 : 0);
