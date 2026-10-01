# FOPOS — Durum Raporu

**Tarih:** 1 Ekim 2026 (3. tur)
**Hazırlayan:** GLM (Vibe / Mistral) — MiniMax AI ile koordineli çalışma parçası
**Depo:** aytigin-netizen/FOPOS · dal: main · HEAD: f5bea9d (#143)

## Genel görünüm

FOPOS v47, OPUS pedagojik işletim sistemi çekirdeğinin felsefe öğretimine yönelik
ilk alan uygulamasıdır. Üretim veri seti 2026.1'dir; 2024.1 yalnızca arşiv
uyumluluk paketi olarak korunur. Kimlik katmanı "Sign in with ChatGPT" ile
çalışır; kalıcı veri Cloudflare D1 üzerinde Drizzle şemasıyla tutulur.

## Bu turda yapılan işler

- **PR #141 birleştirildi** (2. turda): ölü auth kodu kaldırıldı, açık
  yönlendirme koruması `app/core/auth-return-path.ts` modülünde test edildi.
- **PR #143 birleştirildi** (2. turda): durum.md / devir.md main'e taşındı.
- **Sosyoloji 2026 resmî kaynak doğrulaması (bu PR):** Öğretmen tarafından
  sağlanan resmî MEB PDF'i (48 sayfa, 2026625151446241-Sosyoloji döp.pdf)
  OCR ile tam çıkarıldı ve kanonik paketle karşılaştırıldı:
  - Ünite kodları, adları, sınıf düzeyleri, süreler (16/14/12/16/10 ve
    20/48) birebir doğrulandı.
  - 21 öğrenme çıktısı kodu ve açıklaması resmî metinle paritede.
  - **programRules eklendi:** weeklyHours=2, instructionHoursPerGrade=68,
    schoolBasedPlanningHoursPerGrade=4, annualTotalHoursPerGrade=72.
  - Sınıf özetleri (grades) eklendi: 11 → 5 ünite/18 çıktı; 12 → 2 ünite/3 çıktı.
  - **Yeni sözleşme testi:** tests/sociology-curriculum-2026-source-parity.test.mjs.
  - **Yeni geçiş belgesi:** docs/sosyoloji-mufredati-2026-gecis-1-1.md.
  - Manifest **UNVERIFIED** bırakıldı — VERIFIED'a geçiş snapshot + insan
    onaylı VERIFICATION_RECORD kanıtı gerektirir (MP-H01 D2–D7 zinciri).

## Açık işler

- Açık issue yok. Bu PR birleştirilene kadar tek açık PR sosyoloji veri seti PR'ı.
- Eski `docs/glm-durum-devir` ve `docs/glm-durum-devir-tur2` dalları
  silinmeli (GitHub aracı üzerinden dal silme yetkisi yok; UI'dan silinmeli).

## Bilinen sınırlar / teknik borç

- Sosyoloji: ürün çalışma zamanı bilinçli olarak kapalı (fail-closed).
  Parite ve program kuralları tamam; kalan adımlar: kaynak snapshot + içerik
  karması, insan onayı, VERIFICATION_RECORD, aşama kataloğu
  (phaseCatalogForDataset sociology/2026.1), hafta içerikleri, domain
  registry productRuntime açılışı.
- 2024.1 paketi yalnızca arşiv erişimi olarak package-loader'da duruyor.
- Kimlik: bağımsız alan adı/hesap sistemi eklenirse yeni doğrulanmış kimlik
  sağlayıcı adaptörü gerekir; istemci e-postası kimlik kanıtı sayılmaz.
- PR #141 sonrası dağıtımda giriş/çıkış akışı canlıda henüz denenmedi.
