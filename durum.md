# FOPOS — Durum Raporu

**Tarih:** 1 Ekim 2026 (2. tur)
**Hazırlayan:** GLM (Vibe / Mistral) — MiniMax AI ile koordineli çalışma parçası
**Depo:** aytigin-netizen/FOPOS · dal: main · HEAD: 8397afe (PR #141 squash)

## Genel görünüm

FOPOS v47, OPUS pedagojik işletim sistemi çekirdeğinin felsefe öğretimine yönelik
ilk alan uygulamasıdır. Üretim veri seti 2026.1'dir; 2024.1 yalnızca arşiv
uyumluluk paketi olarak korunur. Kimlik katmanı "Sign in with ChatGPT" ile
çalışır; kalıcı veri Cloudflare D1 üzerinde Drizzle şemasıyla tutulur.

## Bu turda yapılan işler

- **1. tur (docs/glm-durum-devir dalı):** Proje incelendi; durum.md ve devir.md
  handoff dosyaları yazıldı; sıradaki adım olarak PR #141 belirlendi.
- **PR #141 incelendi ve birleştirildi** (squash: 8397afe):
  - Ölü kod `requireChatGPTUser` / `chatGPTSignInPath` kaldırıldı.
  - `safeRelativeReturnPath` açık yönlendirme koruması
    `app/core/auth-return-path.ts` saf modülüne taşındı (sunucu bağımlılığı yok).
  - `chatGPTSignOutPath` yeniden dışa aktarıldı; app/api/account-closure/route.ts
    içe aktarımı bozulmadı.
  - Yeni testler: harici adres, protokol-göreli adres, `/\\evil.example`,
    kimlik yolu döngü koruması, meşru dönüş yolu ve `/../../../` normalizasyonu.
  - İnceleme kaydı PR'a yorum olarak eklendi (yazar-onayı kuralı nedeniyle
    APPROVE yerine COMMENT).

## Açık işler

- Açık issue yok; açık PR: bu handoff dosyalarının PR'ı.
- **Not:** 1. turun docs/glm-durum-devir dalı hâlâ depoda duruyor; bu PR main'e
  girdiğinde artık gereksizdir, silinebilir.

## Bilinen sınırlar / teknik borç

- Sosyoloji: ürün çalışma zamanı bilinçli olarak kapalı (fail-closed). Aşama
  kataloğu yalnızca felsefe/2026.1 için tanımlı. Eksik olan kod değil,
  doğrulanmış 2026 sosyoloji veri seti ve program kuralı (weekly_hours).
- 2024.1 paketi yalnızca arşiv erişimi olarak package-loader'da duruyor.
- Kimlik: bağımsız alan adı/hesap sistemi eklenirse yeni doğrulanmış kimlik
  sağlayıcı adaptörü gerekir; istemci e-postası kimlik kanıtı sayılmaz.
- PR #141 sonrası dağıtımda giriş/çıkış akışı canlıda bir kez denenmeli.
