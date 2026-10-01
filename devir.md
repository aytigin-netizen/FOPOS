# FOPOS — Devir Teslimi (GLM → MiniMax AI)

**Tarih:** 1 Ekim 2026 (4. tur)
**Devreden:** GLM (Vibe / Mistral)
**Devralan:** MiniMax AI

## Bu turda yapılan değişiklik

Sosyoloji 2026.1 doğrulama zinciri tamamlandı ve manifest **VERIFIED** yapıldı:

1. Öğretmenden insan onayı alındı (Aytekin YILMAZ, APPROVED, 1 Ekim 2026);
   içerik karması öğretmen kararıyla atlandı — snapshot resmî PDF URL'i ile
   kaydedildi (docs/sosyoloji-mufredati-2026-gecis-1-2.md tablosu).
2. src/curriculum-packages/sociology-2026.ts: verification.status VERIFIED,
   verifiedAt 2026-10-01T17:30:00Z, yöntem
   official-source-parity-and-contract-tests; OFFICIAL_SOURCE + VERIFICATION_RECORD
   kanıtları eklendi.
3. tests/sociology-curriculum-2026-source-parity.test.mjs: son blok VERIFIED zincir
   iddiasını sabitler.
4. tests/runtime-revalidation-enforcement.test.mjs: "VERIFIED manifest kanonik
   doğrulama kanıtı olmadan …" testi kanıt sıyırma mutasyonuyla throw beklentisini
   korur; "UNVERIFIED paket …" testi sentetik felsefe manifest'ine taşındı;
   sosyoloji için yeni VERIFIED/READY (eligible: true) testi eklendi.
5. durum.md / devir.md 4. tur olarak güncellendi.

## Devraldığınız durum

- main HEAD: 672b958 (PR #144). Bu PR birleşince sosyoloji VERIFIED olur.
- Açık issue yok. CI validate zorunlu; bu ortamda Node.js yok — CI sonucunu
  doğrulayıp birleştirin.
- Eski dallar repo UI'ından silinmeli: docs/glm-durum-devir,
  docs/glm-durum-devir-tur2.

## Önerilen sıradaki adımlar (öncelik sırasıyla)

1. **Bu PR'ın CI validate kontrolünü doğrula ve birleştir.**
2. **Runtime aktivasyonu (sosyoloji, ayrı PR'larla):**
   - sociologyPhaseCatalog2026: dokuz aşamalı/80 dk akış kataloğu +
     phase-catalog-runtime.ts'e sociology/2026.1 girişi (felsefe
     phase-catalog-2026.ts şablonu).
   - lesson-studio-week-count.ts: lessonStudioWeeklyHours'a sociology: 2.
   - 21 çıktının süreç bileşenleri (resmî PDF s. 12–48, her çıktının a/b/c
     bileşenleri; OCR çıktısı elden geçirilmeli) + hafta içerikleri.
   - src/core/domain-adapter/registry.ts: sociology productRuntime /
     pedagogicalGeneration / documentGeneration açılışı.
   - tests/sociology-lesson-studio-regression.test.mjs fail-closed
     beklentilerinin bilinçli güncellenmesi (artık VERIFIED olduğundan).
   - Sosyoloji ürün runtime'ı açılınca #136/#120 kapıları otomatik geçer.
3. **Canlı akış kontrolü (ertelenmiş):** giriş/çıkış ve hesap kapatma akışını
   canlıda bir kez dene (return_to'lu bağlantılar dahil).
4. **İsteğe bağlı:** resmî PDF sha256 içerik karması öğretmen tarafından
   sağlanırsa snapshot kaydına eklenir (D6 revalidation karşılaştırmaları için).

## Çalışma kuralları (ekip koordinasyonu)

- Her çalışma turundan sonra durum.md ve devir.md güncelle; gönderen adı ve tarih yaz.
- MiniMax AI ile GLM aynı depoda sırayla çalışır; başlamadan önce bu iki dosyayı
  ve son commit'leri oku.
- Değişiklikleri PR üzerinden geçir; main'e doğrudan push engellidir.
- Sözleşme testleri, typecheck, lint ve build lokalde çalıştırılmadan PR açma
  (Node.js olan ortamda; bu turlarda CI validate tek doğrulama kapısıydı).
- Öğrenci kişisel verisi harici yapay zekâya gönderilmez; gerçek öğrenci verisi
  test fixture'ı yapılmaz; geçmiş kayıtlar ve denetim izleri asla yeniden yazılmaz.
- Resmî doğrulama iddiası yalnız insan onaylı kanıt zinciriyle yapılır.

## Hızlı bağlamlar

- Canlı: https://fopos-ders-studyosu.aytigin.chatgpt.site
- Doğrulama: `npm run test:contracts` · `npm run lint` · `npm run build` ·
  şema sonrası `npm run db:generate`
- Resmî sosyoloji PDF'i: meb:sociology:2026 (48 sayfa),
  https://mufredat.meb.gov.tr/Dosyalar/2026625151446241-Sosyoloji%20d%C3%B6p.pdf
- Mimari özet: README.md "Güncel mimari gerçekler" bölümü.
