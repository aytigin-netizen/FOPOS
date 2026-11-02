#!/usr/bin/env node
// Cloudflare API token bütünlük denetimi.
//
// Cloudflare'ın 2026 biçimindeki token'ları: `cfut_` + 40 karakter gövde +
// 8 karakter CRC32 checksum → toplam 53 karakter.
//
// Kullanım:
//   node scripts/verify-cloudflare-token.mjs <token>
//   node scripts/verify-cloudflare-token.mjs --stdin        (token'ı stdin'den okur)
//   node scripts/verify-cloudflare-token.mjs --quiet         (yeniden kurulan değeri YAZMAZ)
//
// Çıkış kodu: 0 = geçerli, 1 = geçersiz (tanı çıktısı yazılır).
//
// Amaç: secret panosuna yapıştırma sırasında kaybolan karakteri YAPILANDAN
// ÖNCE yakalamak. Panele yanlış değer yazılırsa CI sessizce yanlış sürüm
// yayınlayabilir; bu betik hatayı kaynağında gösterir.
//
// --quiet: CI gibi giriş denetimine uygun ortamlarda kullanılır; sırrın hiçbir
// parçasını (yeniden kurulan değer dâhil) loga yazmaz, yalnız konumu söyler.

import { createHash } from 'node:crypto';

const PREFIX = 'cfut_';
const BODY_LEN = 40;
const CHECKSUM_LEN = 8;
const TOTAL_LEN = PREFIX.length + BODY_LEN + CHECKSUM_LEN; // 53

const crc32 = (text) => {
  // Node'da CRC32 yok; tablodan hesaplanır.
  let table = crc32.table;
  if (!table) {
    table = crc32.table = new Int32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[i] = c;
    }
  }
  let crc = -1;
  for (let i = 0; i < text.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ text.charCodeAt(i)) & 0xff];
  }
  return ((crc ^ -1) >>> 0).toString(16).padStart(8, '0');
};

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';

const readToken = async () => {
  const args = process.argv.slice(2);
  if (args.includes('--stdin')) {
    const chunks = [];
    for await (const chunk of process.stdin) chunks.push(chunk);
    return Buffer.concat(chunks).toString('utf8');
  }
  // Bayrakları ayıkla; kalan ilk değer token'dır.
  return args.find((value) => !value.startsWith('--')) ?? '';
};

const raw = await readToken();
// Panele yapıştırırken gelen tırnak/boşlukları ayıkla (CI ile aynı normalleştirme).
const token = raw.replace(/\s+/g, '').replace(/["']/g, '');
const quiet = process.argv.includes('--quiet');

const report = (line) => console.log(line);

console.log(`uzunluk: ${token.length} (beklenen ${TOTAL_LEN})`);

if (token.length === TOTAL_LEN && token.startsWith(PREFIX)) {
  const body = token.slice(PREFIX.length, PREFIX.length + BODY_LEN);
  const checksum = token.slice(-CHECKSUM_LEN);
  const computed = crc32(body);
  if (computed === checksum) {
    console.log(`✓ checksum doğru (CRC32 = ${computed}) — token sağlam.`);
    process.exit(0);
  }
  console.log(`✗ checksum yanlış: hesaplanan ${computed}, token'da ${checksum}.`);
  console.log('  → Karakter kayması var (gövde içinde bir karakter eksik/fazla).');
  process.exit(1);
}

// Biçim/uzunluk hatası: eksik karakteri bulmaya çalış.
console.log(`✗ beklenen biçim: ${PREFIX} + ${BODY_LEN} gövde + ${CHECKSUM_LEN} checksum = ${TOTAL_LEN} karakter.`);

if (token.length === TOTAL_LEN - 1) {
  console.log('→ Tam 1 karakter eksik görünüyor; yeniden kurulum deneniyor…');
  for (let pos = 0; pos <= token.length; pos++) {
    for (const ch of ALPHABET) {
      const candidate = token.slice(0, pos) + ch + token.slice(pos);
      if (candidate.length !== TOTAL_LEN || !candidate.startsWith(PREFIX)) continue;
      const body = candidate.slice(PREFIX.length, PREFIX.length + BODY_LEN);
      const checksum = candidate.slice(-CHECKSUM_LEN);
      if (crc32(body) === checksum) {
        if (quiet) {
          console.log(`✓ Yeniden kuruldu. Eksik karakter ${pos}. konumda (konum: ${pos}, toplam ${TOTAL_LEN}).`);
          console.log("  → Sırrın kendisi loglanmadı; token'ın tamamını secret panosuna elle yapıştır.");
        } else {
          console.log(`✓ Yeniden kuruldu. Eksik karakter ${pos}. konumunda: '${ch}'`);
          console.log(`  ${candidate}`);
        }
        process.exit(1);
      }
    }
  }
  console.log('✗ Tek karakter eksiklikle eşleşen bir yeniden kurulum bulunamadı.');
  console.log('  → Gövde içinde karakter kayması olabilir (ör. iki karakter silinip biri eklenmiş).');
  process.exit(1);
}

if (token.length === TOTAL_LEN + 1) {
  console.log('→ Tam 1 karakter fazla görünüyor; çıkarılacak karakter aranıyor…');
  for (let pos = 0; pos < token.length; pos++) {
    const candidate = token.slice(0, pos) + token.slice(pos + 1);
    if (candidate.length !== TOTAL_LEN || !candidate.startsWith(PREFIX)) continue;
    const body = candidate.slice(PREFIX.length, PREFIX.length + BODY_LEN);
    const checksum = candidate.slice(-CHECKSUM_LEN);
    if (crc32(body) === checksum) {
      if (quiet) {
        console.log(`✓ Çözüldü. ${pos}. konumdaki karakter fazlaydı (konum: ${pos}).`);
        console.log("  → Sırrın kendisi loglanmadı; token'ın tamamını secret panosuna elle yapıştır.");
      } else {
        console.log(`✓ Çözüldü. ${pos}. konumdaki karakter fazlaydı: '${token[pos]}'`);
        console.log(`  ${candidate}`);
      }
      process.exit(1);
    }
  }
  console.log('✗ Tek karakter fazlalıkla eşleşen bir çözüm bulunamadı.');
  process.exit(1);
}

console.log(`✗ Uzunluk ${token.length}; ${TOTAL_LEN - token.length} karakter eksik ya da fazla.`);
console.log('  → Cloudflare panelinde token’ın göründüğü sayfadan kopyala; değer yalnız oluşturulurken bir kez gösterilir.');
process.exit(1);
