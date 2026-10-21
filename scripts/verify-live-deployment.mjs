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
const refs = (text, from) => [...text.matchAll(refRe)].map((m) => { try { return new URL(m[1], from).href; } catch { return null; } }).filter((u) => u && u.startsWith(base + '/'));

const html = await fetchText(base + '/');
const rawSrc = [...html.matchAll(/(?:src|href)=["']([^"']+\.js)["']/g)].map((m) => new URL(m[1], base + '/').href);
const queue = rawSrc.filter((u) => u.startsWith(base + '/'));
const seen = new Set(); const texts = new Map();
while (queue.length && seen.size < 200) {
  const url = queue.shift(); if (seen.has(url)) continue; seen.add(url);
  try {
    const t = await fetchText(url); texts.set(url.slice(base.length + 1), t);
    for (const u of refs(t, url)) if (!seen.has(u)) queue.push(u);
  } catch (e) { console.error('Uyarı:', e.message); }
}
console.log(`İndirilen JS parçası: ${texts.size}`);
let missing = 0;
for (const [pr, s] of MARKERS) {
  const where = [...texts].filter(([, t]) => t.includes(s)).map(([k]) => k);
  const ok = where.length > 0; if (!ok) missing++;
  console.log(`${ok ? 'VAR  ' : 'YOK  '} ${pr.padEnd(10)} ${JSON.stringify(s)}${ok ? '  ← ' + where[0] : ''}`);
}
// #238: onay kaydı (kapasite 2→8) yalnız metin olarak aranabilir; aynı parçada ikisi birlikte olmalı.
const approval = [...texts].find(([, t]) => t.includes('Aytekin YILMAZ') && t.includes('2026-10-17'));
console.log(`${approval ? 'VAR  ' : 'YOK  '} #238       onay kaydı (Aytekin YILMAZ + 2026-10-17)${approval ? '  ← ' + approval[0] : ''}`);
if (!approval) missing++;
console.log(missing ? `\nSONUÇ: ${missing} işaret eksik — canlı main'in gerisinde.` : '\nSONUÇ: tüm işaretler canlıda — canlı en az #246 içeriğini taşıyor.');
process.exit(missing ? 1 : 0);
