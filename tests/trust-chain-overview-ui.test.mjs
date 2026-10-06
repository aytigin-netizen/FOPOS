import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { GENERATION_AUDIT_PACKAGE_SCHEMA_VERSION } from "../app/core/generation-audit-package.ts";
import { PORTABLE_AUDIT_RESULT_SCHEMA_VERSION, PORTABLE_AUDIT_RESULT_POLICY_VERSION } from "../app/core/portable-audit-result.ts";
import { PORTABLE_AUDIT_VERIFICATION_RECEIPT_SCHEMA_VERSION } from "../app/core/portable-audit-verification-receipt.ts";
import { INDEPENDENT_RECEIPT_MAX_FILE_SIZE_BYTES } from "../app/core/independent-receipt-verification.ts";
const source = readFileSync(new URL("../app/modules/record-archive/RecordArchiveModule.tsx", import.meta.url), "utf8");
test("Kayıt Arşivi dosya eşleme, sonuç kontrolü ve makbuz adımlarını doğru sırada gösterir", () => {
  const labels = ["1. Denetim paketini seç", "Taşınabilir denetim sonucunu indir", "Taşınabilir sonucu doğrula", "Doğrulama makbuzunu indir", "Doğrulama makbuzunu doğrula"];
  let previous = -1;
  for (const label of labels) { const current = source.indexOf(label); assert.ok(current > previous, `${label} doğru sırada bulunmalıdır.`); previous = current; }
});
test("dosya kontrolü sürüm, boyut ve güven sınırlarını korur", () => {
  assert.equal(GENERATION_AUDIT_PACKAGE_SCHEMA_VERSION, "1.2.0");
  assert.equal(PORTABLE_AUDIT_RESULT_SCHEMA_VERSION, "1.0.0");
  assert.equal(PORTABLE_AUDIT_RESULT_POLICY_VERSION, "1.0.0");
  assert.equal(PORTABLE_AUDIT_VERIFICATION_RECEIPT_SCHEMA_VERSION, "1.0.0");
  assert.equal(INDEPENDENT_RECEIPT_MAX_FILE_SIZE_BYTES, 256 * 1024);
  assert.match(source, /ve Kayıt Arşivi değiştirilmez/u);
  assert.match(source, /Bu kontrol makbuzun kaynağını veya özgün belgeyle eşleşmesini kanıtlamaz/u);
  assert.match(source, /Kayıt Arşivi’ne, veritabanına veya kalıcı tarayıcı depolamasına yazılmadı/u);
});
test("mevcut dört dosya girişi ve ayrıntılı doğrulama bölümleri korunur", () => {
  assert.match(source, /Özgün DOCX belgeyi seç/u);
  assert.match(source, /Taşınabilir sonuç JSON’unu seç/u);
  assert.match(source, /Doğrulama makbuzu JSON’unu seç/u);
  assert.match(source, /JSON denetim paketini seç/u);
});
