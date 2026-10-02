# FOPOS — Durum Raporu

**Tarih:** 1 Ekim 2026 (5. tur)
**Hazırlayan:** GLM (Vibe / Mistral) — MiniMax AI ile koordineli çalışma parçası
**Depo:** aytigin-netizen/FOPOS · dal: main · HEAD: e083572 (PR #145 sonrası)

## Genel görünüm

FOPOS v47, OPUS pedagojik işletim sistemi çekirdeğinin ilk alan uygulamaları
felsefe (aktif) ve sosyoloji (VERIFIED) ile main'de. 5. tur PR'ı sosyoloji
2026.1 **runtime aktivasyonunu** içerir: haftalık dağılım (68 hafta), 21
çıktının resmî süreç bileşenleri ve dokuz aşamalı/80 dk aşama kataloğu.

## Bu turda yapılan işler

- **Haftalık dağılım (68 hafta):** `app/modules/lesson-studio/sociology-weekly-content-2026.ts`
  — ünite bazlı hafta içerikleri; SOS.11.1: 8, SOS.11.2: 7, SOS.11.3: 6,
  SOS.11.4: 8, SOS.11.5: 5, SOS.12.1: 10, SOS.12.2: 24 hafta (altı içerik
  alanına bölündü). Import sırasında çalışan validate fonksiyonu içerir.
- **Süreç bileşenleri:** `src/curriculum-packages/sociology-2026.ts` içindeki
  21 çıktıya resmî MEB PDF'inden (s. 12–48) süreç bileşenleri, keywords,
  contentFramework, competencyFramework, learningTeachingExperiences,
  differentiation, canonicalLearningEvidence alanları eklendi. Kod/saat/çıktı
  adedi/manifest değerleri korunarak yalnızca alan eklendi.
- **Aşama kataloğu:** `app/modules/lesson-studio/phase-catalog-sociology-2026.ts`
  (21 çıktı × dokuz aşama/80 dk) + phase-catalog-runtime.ts'e sociology/2026.1
  girişi.
- **Runtime açılışı:** lesson-studio-week-count.ts'e `sociology: 2`;
  sociology-adapter.ts readiness: pedagogicalMapping "official_verified",
  productActivation "enabled"; curriculum-runtime.ts paketin zengin alanlarını
  kullanıyor; lesson-engine.ts getWeekFocus önce sosyoloji hafta odağını
  sorguluyor; product-visibility-2026.ts sociology dalı + sociologyCriteria.
- **Test:** sociology-lesson-studio-regression.test.mjs fail-closed beklentileri
  bilinçli güncellendi.

## CI düzeltmesi (PR #147 revizyonu)

İlk push'ta CI kırmızıydı; kademeli teşhisle beş kök neden bulundu ve
tümü giderildi (1 Ekim 2026, GLM):

1. **lesson-engine.ts ve product-visibility-2026.ts içerik bozulması:**
   Dosyalar önceki turda ham GitHub içeriği üzerinden alınırken ~2000
   karakterlik aralıklarla satır sonu enjeksiyonu oluşmuş; çift tırnaklı
   dize içinde kalan newline sözdizimi hatasına yol açıp sözleşme
   testlerini çökertiyordu. İkisi de main'in temiz tabanına diff hunk'ları
   uygulanarak onarıldı.
2. **sociology-weekly-content-2026.ts imza eksiği:**
   `getSociologyUnitWeekFocus`'un `unitCode: string` parametresi depodaki
   dosyada eksikti; eklendi.
3. **Import yolu hatası:** Yeni iki modül (sociology-weekly-content,
   phase-catalog-sociology) `../../src/...` ile import ediyordu;
   app/modules/lesson-studio altından doğrusu `../../../src/...`. Düzeltildi.
4. **Sahte DB UPDATE simülasyonu:** class-workspace-repository testinin
   fake veritabanı `UPDATE class_workspaces`'i uygulamıyordu; arşivden
   çıkarma iddiası bu yüzden düşüyordu. UPDATE dalı sahte DB'ye eklendi.
5. **Fail-closed test beklentileri:** Sosyoloji runtime'ı açılınca
   capability guard'a bağlı testler eski davranışı bekliyordu. Bilinçli
   güncellendi:
   - tests/lesson-studio-week-outcome.test.mjs — hafta sayısı, çıktı
     eşlemesi ve ürün görünürlüğü sosyoloji için artık açık davranışı
     doğruluyor (8 hafta, SOS.11.1.1 eşlemesi, rubrik bağlantısı).
   - tests/teacher-discipline-repository.test.mjs — sosyoloji branş ataması
     artık yapılabilir; tanımsız branş (history) için guard testi korundu.
   - tests/class-workspace-repository.test.mjs — sosyoloji sınıf çalışma
     alanı oluşturma ve arşivden yeniden etkinleştirme artık mümkün.
   - tests/sociology-domain-adapter.test.mjs (CI dışı) — capability
     kontratı "ready/enabled" olarak güncellendi.
   - tests/ad-03-persistence-capability.test.mjs (CI dışı) — sosyoloji
     kayıt/belge persistence'ı artık açık.

CI validate 1 Ekim 2026 22:01 UTC'de yeşile döndü (test:contracts,
lint, build ve evidence summary dahil). Teşhis sırasında geçici olarak
ci.yml'e eklenen hata-detayı ve kuyruk-dökümü adımları kaldırıldı;
ci.yml orijinal haline döndürüldü.

## Açık işler

- CI validate yeşil (1 Ekim 2026 22:01 UTC); PR #147 artık birleştirilebilir.
- Eski dallar repo UI'ından silinmeli: `docs/glm-durum-devir`,
  `docs/glm-durum-devir-tur2`.
- Birleşince canlıda Sosyoloji ders stüdyosu ve giriş/çıkış akışı bir kez
  denenmeli (return_to'lu bağlantılar dahil).
- #136/#120 kapıları runtime açıldıktan sonra otomatik geçer.

## Bilinen sınırlar / teknik borç

- İçerik karması yok; D6 revalidation contentHash ilk tam snapshot'ta
  üretilir, öğretmen talebiyle sonradan eklenebilir.
- 2024.1 paketi arşiv erişimi olarak kalır; kimlik katmanı değişmez.
