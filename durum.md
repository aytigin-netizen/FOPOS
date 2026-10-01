# FOPOS — Durum Raporu

**Tarih:** 1 Ekim 2026 (5. tur)
**Hazırlayan:** GLM (Vibe / Mistral) — MiniMax AI ile koordineli çalışma parçası
**Depo:** aytigin-netizen/FOPOS · dal: main · HEAD: e083572 (PR #145 sonrası)

## Genel görünüm

FOPOS v47, OPUS pedagojik işletim sistemi çekirdeğinin ilk alan uygulamaları
felsefe (aktif) ve sosyoloji (VERIFIED) ile main'de. Bu turda sosyoloji 2026.1
**runtime aktivasyonu** tamamlandı: haftalık dağılım (68 hafta), 21 çıktının
resmî süreç bileşenleri ve dokuz aşamalı/80 dk aşama kataloğu eklendi.

## Bu turda yapılan işler

- **Haftalık dağılım (68 hafta):** `app/modules/lesson-studio/sociology-weekly-content-2026.ts`
  — ünite bazlı hafta içerikleri; SOS.11.1: 8, SOS.11.2: 7, SOS.11.3: 6,
  SOS.11.4: 8, SOS.11.5: 5, SOS.12.1: 10, SOS.12.2: 24 hafta (altı içerik
  alanına bölündü). Import sırasında çalışan validate fonksiyonu içerir.
- **Süreç bileşenleri:** `src/curriculum-packages/sociology-2026.ts` içindeki
  21 çıktıya resmî MEB PDF'inden (s. 12–48) a/b/c/ç/d süreç bileşenleri,
  keywords, contentFramework, competencyFramework, learningTeachingExperiences,
  differentiation, canonicalLearningEvidence alanları eklendi. Kod/saat/çıktı
  adedi/manifest değerleri korunarak yalnızca alan eklendi (parite testi
  etkilenmez).
- **Aşama kataloğu:** `app/modules/lesson-studio/phase-catalog-sociology-2026.ts`
  (21 çıktı × dokuz aşama/80 dk; 5+6+12+14+17+10+8+5+3) +
  phase-catalog-runtime.ts'e sociology/2026.1 girişi.
- **Runtime açılışı:** lesson-studio-week-count.ts'e `sociology: 2`;
  sociology-adapter.ts readiness: pedagogicalMapping "official_verified",
  productActivation "enabled"; curriculum-runtime.ts artık paketin zengin
  alanlarını kullanıyor; lesson-engine.ts getWeekFocus önce sosyoloji hafta
  odağını sorguluyor; product-visibility-2026.ts sociology dalı +
  sociologyCriteria (100 puan rubrik).
- **Test:** tests/sociology-lesson-studio-regression.test.mjs fail-closed
  beklentileri bilinçli güncellendi (artık enabled/ready, dokuz aşama/80 dk,
  süreç bileşeni ≥2, hafta odağı kapsamı). Felsefe testleri korundu.

## Açık işler

- Bu PR'ın CI validate kontrolü doğrulanıp birleştirilmeli (bu ortamda
  Node.js yok; CI tek doğrulama kapısı).
- Eski dallar repo UI'ından silinmeli: `docs/glm-durum-devir`,
  `docs/glm-durum-devir-tur2`.
- Birleşince canlıda giriş/çıkış ve hesap kapatma akışı bir kez denenmeli
  (return_to'lu bağlantılar dahil); Sosyoloji ders stüdyosu canlı akışı
  kontrol edilmeli.
- #136/#120 kapıları runtime açıldıktan sonra otomatik geçer.

## Bilinen sınırlar / teknik borç

- İçerik karması yok; D6 revalidation contentHash ilk tam snapshot'ta
  üretilir, öğretmen talebiyle sonradan eklenebilir.
- 2024.1 paketi arşiv erişimi olarak kalır; kimlik katmanı değişmez.
