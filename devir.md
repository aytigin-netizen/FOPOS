# FOPOS — Devir Teslimi (GLM → MiniMax AI)

**Tarih:** 1 Ekim 2026 (3. tur)
**Devreden:** GLM (Vibe / Mistral)
**Devralan:** MiniMax AI

## Bu turda yapılan değişiklik

Öğretmen resmî 2026 Sosyoloji Dersi Öğretim Programı PDF'ini sağladı
(48 sayfa). PDF OCR ile tam çıkarıldı ve sosyoloji 2026.1 veri seti
hazırlığının ilk aşaması tamamlandı:

1. **Kanonik paket zaten mevcuttu** (src/curriculum-packages/sociology-2026.ts);
   resmî PDF ile birebir karşılaştırıldı: 7 ünite, 21 çıktı, tüm süreler
   ve adlar paritede (tek fark: SOS.11.3.2'de resmî PDF dizgi hatası
   "çözümlenebilme"; kanonik paket "çözümleyebilme" korur).
2. **Manifest'e programRules ve grades eklendi:** weeklyHours=2 (resmî
   program s. 6: her iki ders haftada ikişer saat), her sınıf 68 ders saati
   + 4 okul temelli planlama = 72 (s. 10–11 tabloları); alan becerileri
   Eleştirel Sosyolojik Düşünme ve Tarihsel Empati.
3. **tests/sociology-curriculum-2026-source-parity.test.mjs** eklendi:
   resmî tabloları sözleşme olarak sabitler (parite, süre dağılımı, çıktı
   kodları, program kuralları, UNVERIFIED iddiasızlığı).
4. **docs/sosyoloji-mufredati-2026-gecis-1-1.md** eklendi: doğrulanmış
   resmî gerçeklerin ve kalan kanıt zincirinin kaydı (felsefe gecis-1-1…1-9
   belgeleri yöntem şablonu).
5. Manifest **UNVERIFIED** bırakıldı: VERIFIED'a geçiş felsefedeki MP-H01
   D2–D7 zinciri gibi snapshot (sha256 içerik karması) + insan onaylı
   VERIFICATION_RECORD gerektirir; bu turda sahte doğrulama iddiası üretilmedi.
6. durum.md / devir.md bu PR ile güncellendi.

## Devraldığınız durum

- main HEAD: f5bea9d. Bu PR (feat/sociology-2026-program-rules dalı)
  birleştirilince sosyoloji veri temeli main'de olur.
- Açık issue yok.
- CI validate çalışması zorunludur; bu ortamda Node.js bulunmadığı için
  testler lokal çalıştırılamadı — CI sonucunu kontrol edin, sonra birleştirin.
- Eski dallar silinmeli: `docs/glm-durum-devir`, `docs/glm-durum-devir-tur2`
  (GitHub API aracında dal silme yok; repo UI'ından silinmeli).

## Önerilen sıradaki adımlar (öncelik sırasıyla)

1. **Bu PR'ın CI validate kontrolünü doğrula ve birleştir.**
2. **Canlı akış kontrolü (2. turdan ertelenmiş):** PR #141 sonrası dağıtımda
   giriş/çıkış ve hesap kapatma akışını canlıda bir kez dene.
3. **Sosyoloji doğrulama zincirini tamamla (VERIFIED'a geçiş):**
   - Resmî PDF snapshot'i + sha256 içerik karması (MP-H01 D2 modeli).
   - İnsan (öğretmen) onayı kaydı.
   - Manifest verification → VERIFIED + VERIFICATION_RECORD evidence.
   - Bu adım tests/runtime-revalidation-enforcement.test.mjs içindeki
     "UNVERIFIED paket …" ve "VERIFIED manifest kanonik doğrulama kanıtı
     olmadan …" testlerinin sosyoloji fixture'larını da güncellemeyi
     gerektirir — bu testler bilinçli olarak UNVERIFIED durumunu test eder.
4. **Runtime aktivasyonu (zincir tamamlanınca, ayrı PR'larla):**
   - sociologyPhaseCatalog2026: dokuz aşamalı/80 dk akış kataloğu
     (app/modules/lesson-studio/phase-catalog-runtime.ts'e sociology/2026.1
     girişi; felsefe phase-catalog-2026.ts şablonu).
   - lesson-studio-week-count.ts'e sociology: 2 girişi (şu an fail-closed).
   - 21 çıktı için hafta içerikleri / süreç bileşenleri (resmî PDF s. 12–48
     her çıktının a/b/c süreç bileşenlerini içerir; OCR sayfaları
     elden geçirilmeli).
   - Domain registry (src/core/domain-adapter/registry.ts) sociology
     productRuntime/pedagogicalGeneration/documentGeneration açılışı.
   - sociology-lesson-studio-regression.test.mjs fail-closed
     beklentilerinin bilinçli güncellenmesi.
5. **Öğretim yılı planlaması:** SOS.11.* üniteleri 11. sınıf, SOS.12.* üniteleri
   12. sınıf; yıllık plan çözümlemesi subjectCode+datasetVersion sınırında
   fail-closed kalmaya devam eder.

## Çalışma kuralları (ekip koordinasyonu)

- Her çalışma turundan sonra durum.md ve devir.md güncelle; gönderen adı ve tarih yaz.
- MiniMax AI ile GLM aynı depoda sırayla çalışır; başlamadan önce bu iki dosyayı
  ve son commit'leri oku.
- Değişiklikleri PR üzerinden geçir; main'e doğrudan push engellidir.
- Sözleşme testleri, typecheck, lint ve build lokalde çalıştırılmadan PR açma
  (Node.js olan ortamda; bu turda CI validate tek doğrulama kapısıydı).
- Öğrenci kişisel verisi harici yapay zekâya gönderilmez; gerçek öğrenci verisi
  test fixture'ı yapılmaz; geçmiş kayıtlar ve denetim izleri asla yeniden yazılmaz.
- Resmî doğrulama iddiası (VERIFIED) yalnız insan onaylı kanıt zinciriyle yapılır.

## Hızlı bağlamlar

- Canlı: https://fopos-ders-studyosu.aytigin.chatgpt.site
- Doğrulama: `npm run test:contracts` · `npm run lint` · `npm run build` ·
  şema sonrası `npm run db:generate`
- Resmî sosyoloji PDF'i: meb:sociology:2026 (48 sayfa),
  https://mufredat.meb.gov.tr/Dosyalar/2026625151446241-Sosyoloji%20d%C3%B6p.pdf
- Mimari özet: README.md "Güncel mimari gerçekler" bölümü.
