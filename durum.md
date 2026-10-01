# FOPOS — Durum Raporu

**Tarih:** 1 Ekim 2026
**Hazırlayan:** GLM (Vibe / Mistral) — MiniMax AI ile koordineli çalışma parçası
**Depo:** aytigin-netizen/FOPOS · dal: main · HEAD: d5b1881 (#140)

## Genel görünüm

FOPOS v47, OPUS pedagojik işletim sistemi çekirdeğinin felsefe öğretimine yönelik
ilk alan uygulamasıdır. Üretim veri seti 2026.1'dir; 2024.1 yalnızca geçmiş
belge ve üretim izleri için arşiv uyumluluk paketi olarak korunur. Kimlik katmanı
"Sign in with ChatGPT" ile çalışır; kalıcı veri Cloudflare D1 üzerinde Drizzle
şemasıyla tutulur. Sözleşme testleri 602/602 geçiyor.

## Son tamamlanan işler

- **MP-H01 D2–D7 (#126–#132):** Kaynak yeniden doğrulama (revalidation) zinciri —
  kanıt kayıt/yeniden oynatma engeli, gözlem sırası, manifest soy kütüğü,
  doğrulanmış çalışma zamanı sözleşmesi.
- **#136 / #120:** Yetenek kapısı, branş seçimi ve kalıcılık sınırlarında
  zorunlu kılındı (sosyoloji productRuntime devre dışı).
- **#137:** Ders Tasarım Stüdyosu, belgelenmemiş branşlarda fail-closed hale geldi
  (SOS.11.1'in 16 saatinin 16 hafta sayılması hatası düzeltildi).
- **#134:** Yıllık plan üretimi resmî 2026-2027 çerçeve planına bağlandı;
  subjectCode + datasetVersion sınırında fail-closed çözümleme.
- **#138:** CI pipefail ile maskelenen test başarısızlıkları görünür kılındı.
- **#133:** Denetim güven sınırları netleştirildi.
- **#135 (kapandı):** Sosyoloji ürün runtime maruziyeti P1 — aşama kataloğu
  subjectCode + datasetVersion ikilisine bağlandı, kapalı branşlar öğretmene
  okunabilir biçimde açıklanıyor, mükerrer hafta sayısı çözücüsü kaldırıldı.
- **#140:** app/data/curriculum.ts içindeki ölü 2024.1 kanonik kopyası kaldırıldı
  (210 → 26 satır); philosophyUnitsFromPackage tanımsız pakette
  CurriculumFeatureUnavailableError ile duruyor.

## Açık işler

- **PR #141 (açık, mergeable_state: clean):** Kullanılmayan requireChatGPTUser /
  chatGPTSignInPath ölü kodu kaldırılıyor; safeRelativeReturnPath açık
  yönlendirme koruması testleri ekleniyor (auth-return-path.ts dosyasına
  taşındı). Yazar doğrulaması: 602/602, typecheck, lint, build + artifact temiz.
- Açık issue yok; tek issue #135 kapatıldı.

## Bilinen sınırlar / teknik borç

- Sosyoloji: ürün çalışma zamanı bilinçli olarak kapalı (fail-closed). Aşama
  kataloğu yalnızca felsefe/2026.1 için tanımlı. Sosyoloji için doğrulanmış
  2026 veri seti ve program kuralı (weekly_hours) henüz yok.
- 2024.1 paketi yalnızca arşiv erişimi olarak package-loader'da duruyor.
- Kimlik: bağımsız alan adı/hesap sistemi eklenirse yeni doğrulanmış kimlik
  sağlayıcı adaptörü gerekir; istemci e-postası kimlik kanıtı sayılmaz.
