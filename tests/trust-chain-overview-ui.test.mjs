import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
const source = readFileSync(new URL("../app/modules/record-archive/RecordArchiveModule.tsx", import.meta.url), "utf8");
test("Kayıt Arşivi Pilot 3.0–3.3 güven zincirini doğru sırada gösterir", () => {
  const labels = ["Pilot 3.0 • Zinciri eşleştir", "Pilot 3.1 • Sonucu doğrula", "Pilot 3.2 • Makbuzu üret", "Pilot 3.3 • Makbuzu doğrula"];
  let previous = -1;
  for (const label of labels) { const current = source.indexOf(label); assert.ok(current > previous, `${label} doğru sırada bulunmalıdır.`); previous = current; }
});
test("güven zinciri özeti sürüm, boyut ve yazmama sınırlarını açıklar", () => {
  assert.match(source, /denetim paketi 1\.2\.0; sonuç, politika ve makbuz 1\.0\.0/u);
  assert.match(source, /Makbuz sınırı 256 KiB/u);
  assert.match(source, /yeni kanıt, kalıcı kayıt veya kişisel veri üretmez/u);
});
test("mevcut dört dosya girişi ve ayrıntılı doğrulama bölümleri korunur", () => {
  assert.match(source, /Özgün DOCX belgeyi seç/u);
  assert.match(source, /Taşınabilir sonuç JSON’unu seç/u);
  assert.match(source, /Doğrulama makbuzu JSON’unu seç/u);
  assert.match(source, /JSON denetim paketini seç/u);
});
