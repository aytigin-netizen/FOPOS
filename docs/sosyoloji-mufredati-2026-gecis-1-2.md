# Sosyoloji Müfredatı 2026 Geçiş Belgesi 1-2 — Doğrulama Zinciri Tamamlanması (VERIFIED)

**Tarih:** 1 Ekim 2026
**Hazırlayan:** GLM (Vibe / Mistral)
**Kaynak snapshot:** meb:sociology:2026 — resmî PDF URL'i (48 sayfa)

## Zincir kaydı (MP-H01 D2–D7 modeli)

| Bileşen | Değer |
| --- | --- |
| sourceId | meb:sociology:2026 |
| sourceVersion | 2026.1 (sociology@2026.1) |
| Snapshot referansı | Resmî MEB PDF URL'i (48 sayfa) — gecis-1-1'de kayıtlı |
| İçerik karması | Öğretmen kararıyla eklenmedi ("Karmayı atla, snapshot'ı kaynak URL'iyle kaydet", 1 Ekim 2026) |
| İnsan onayı | Aytekin YILMAZ (öğretmen, HUMAN), APPROVED, 1 Ekim 2026 |
| Doğrulama yöntemi | official-source-parity-and-contract-tests |
| Kanıt kaydı | tests/sociology-curriculum-2026-source-parity.test.mjs (VERIFICATION_RECORD) |
| verifiedAt | 2026-10-01T17:30:00Z |

## Yapılan geçiş

- Manifest verification.status: UNVERIFIED → **VERIFIED**.
- VERIFICATION_RECORD evidence kaydı eklendi (insan onayı + parite sözleşme testi).
- tests/sociology-curriculum-2026-source-parity.test.mjs son bloğu VERIFIED zincir
  iddiasını sabitler.
- tests/runtime-revalidation-enforcement.test.mjs:
  - "VERIFIED manifest kanonik doğrulama kanıtı olmadan …" testi, kanıt sıyıran
    mutasyonla throw beklentisini korur (sosyoloji artık gerçekten VERIFIED olduğundan
    evidence açıkça filtrelenir).
  - "UNVERIFIED paket …" testi sentetik felsefe manifest'ine taşındı; sosyoloji için
    yeni "VERIFIED ve runtime üretimine hazır" testi eklendi (eligible: true, READY).

## Sınırlar (değişmeyen)

- Sosyoloji **ürün runtime'ı hâlâ fail-closed**: aşama kataloğu
  (phaseCatalogForDataset sociology/2026.1), hafta içerikleri ve domain registry
  productRuntime girişleri bu PR'da açılmadı.
- İçerik karması olmadığından D6 kaynak yeniden doğrulama (revalidation) zincirindeki
  contentHash karşılaştırmaları sosyoloji için ilk tam snapshot'ta üretilecektir;
  öğretmen talebiyle sonradan eklenebilir.
- 2024.1 arşiv uyumluluk politikası değişmez; arşiv çıktı kodları yeniden yazılmaz.
