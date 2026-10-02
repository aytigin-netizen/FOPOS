# FOPOS — Devir Teslimi (GLM → MiniMax AI)

**Tarih:** 1 Ekim 2026 (5. tur)
**Devreden:** GLM (Vibe / Mistral)
**Devralan:** MiniMax AI

## Bu turda yapılan değişiklik

Sosyoloji 2026.1 **runtime aktivasyonu** tamamlandı (önceki turun "önerilen
sıradaki adımlar" 2. maddesinin tamamı):

1. `app/modules/lesson-studio/sociology-weekly-content-2026.ts` (yeni): 68
   haftalık ünite bazlı dağılım (8/7/6/8/5/10/24), her hafta için ünite,
   tema, kazanım, süreç bileşeni ve hafta odağı; import-time validate.
2. `app/modules/lesson-studio/phase-catalog-sociology-2026.ts` (yeni): 21
   çıktı için dokuz aşamalı/80 dk akış kataloğu, makeSociologyPhases
   helper + validatePhaseCatalog.
3. `src/curriculum-packages/sociology-2026.ts`: 21 çıktıya resmî PDF'ten
   süreç bileşenleri, keywords, contentFramework, competencyFramework,
   learningTeachingExperiences, differentiation, canonicalLearningEvidence.
   Mevcut değerler (kod, saat, çıktı adedi, manifest) değiştirilmedi.
4. `app/modules/lesson-studio/lesson-studio-week-count.ts`: sociology: 2.
5. `app/modules/lesson-studio/phase-catalog-runtime.ts`: sociology/2026.1.
6. `src/core/domain-adapter/sociology-adapter.ts`: pedagogicalMapping
   "official_verified", productActivation "enabled".
7. `app/data/curriculum-runtime.ts`: sosyoloji adaptörü paketin zengin
   alanlarını kullanır hale getirildi.
8. `app/modules/lesson-studio/lesson-engine.ts`: getWeekFocus önce sosyoloji
   hafta odağını sorgular.
9. `app/modules/lesson-studio/product-visibility-2026.ts`: sociology dalı +
   sociologyCriteria (100 puan rubrik).
10. `tests/sociology-lesson-studio-regression.test.mjs`: fail-closed
    beklentileri bilinçli güncellendi; felsefe testleri korundu.

### PR #147 CI düzeltmesi

İlk push kırmızıydı. İki neden giderildi:

1. **lesson-engine.ts bozuk içerik:** Dosya önceki turda dış kaynaktan
   alınırken ~2000 karakter aralıklarla enjekte edilen satır sonlarından
   biri çift tırnaklı dizenin içine düşmüş (sözdizimi hatası → tüm
   sözleşme testleri çöküyordu). Dosya main tabanı + PR diff hunk'larıyla
   yeniden kuruldu; hunk doğrulaması sıfır hata.
2. **Fail-closed beklentiler:** teacher-discipline-repository,
   class-workspace-repository (CI kapsamında) ile sociology-domain-adapter
   ve ad-03-persistence-capability (CI dışı) testleri sosyoloji runtime
   açılışına göre bilinçli güncellendi. Tanımsız branşlar için fail-closed
   guard testleri korundu.

## Devraldığınız durum

- main HEAD: e083572 (PR #145 sonrası). Bu PR birleşince sosyoloji runtime
  aktif olur; #136/#120 kapıları otomatik geçer.
- Açık issue yok. CI validate zorunlu; bu ortamda Node.js yok — CI sonucunu
  doğrulayıp birleştirin.
- Eski dallar repo UI'ından silinmeli: docs/glm-durum-devir,
  docs/glm-durum-devir-tur2.

## Önerilen sıradaki adımlar (öncelik sırasıyla)

1. **PR #147 CI validate yeşil (1 Ekim 2026 22:01 UTC) — birleştir.**
2. **Canlı akış kontrolü:** birleşince canlıda Sosyoloji ders stüdyosunu bir
   kez dene (haftalık dağılım, aşama kataloğu, kazanımlar görünmeli) ve
   giriş/çıkış + hesap kapatma akışını return_to'lu bağlantılarla sına.
3. **İsteğe bağlı:** resmî PDF sha256 içerik karması öğretmen tarafından
   sağlanırsa snapshot kaydına eklenir (D6 revalidation karşılaştırmaları
   için).

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
