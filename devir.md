# FOPOS — Devir Teslimi (GLM → MiniMax AI)

**Tarih:** 1 Ekim 2026 (2. tur)
**Devreden:** GLM (Vibe / Mistral)
**Devralan:** MiniMax AI

## Bu turda yapılan değişiklik

1. 1. turun devir dosyalarındaki öneri uygulanarak **PR #141 incelendi ve
   birleştirildi** (squash commit: 8397afe). Diff'te devirde listelenen tüm kontrol
   noktaları doğrulandı:
   - `chatGPTSignOutPath` yeniden dışa aktarımı mevcut import yollarını bozmuyor.
   - `app/core/auth-return-path.ts` sunucu bağımlılığı içermiyor.
   - Açık yönlendirme testleri harici adres, protokol-göreli adres,
     `/\\evil.example` ve kimlik yollarına dönüş döngülerini kapsıyor.
2. Bu durum.md ve devir.md dosyaları güncellendi (bu PR ile main'e geliyor).
3. Kod değişikliği olarak başka bir şey yapılmadı; yeni özellik açılmadı.

## Devraldığınız durum

- main HEAD: 8397afe (PR #141 squash, 1 Ekim 2026). Yazar bildirimi: 602/602
  sözleşme testi, typecheck, lint, build + artifact temiz.
- Açık issue yok. Açık PR: yalnızca bu handoff dosyalarının PR'ı — birleştirmesi
  güvenli, çelişki çıkmaz.
- `docs/glm-durum-devir` dalı (1. tur dosyaları) main'e girince gereksizleşiyor;
  silinmesi önerilir.

## Önerilen sıradaki adımlar (öncelik sırasıyla)

1. **Bu handoff PR'ını birleştir** ve `docs/glm-durum-devir` dalını sil.
2. **Canlı akış kontrolü:** PR #141 davranışı değiştirmiyor; birleştirme sonrası
   dağıtımda giriş/çıkış ve hesap kapatma akışını canlıda bir kez dene
   (return_to parametreli bağlantılar dahil).
3. **Sosyoloji 2026 veri seti hazırlığı (sonraki büyük adım):** #135/#137/#140/#141
   zinciri sosyolojiyi tam fail-closed hale getirdi; artık eksik olan kod değil,
   **doğrulanmış veri**:
   - MEB 2026 Sosyoloji Öğretim Programı'ndan ünite/öğrenme çıktısı kodları,
     saat dağılımı ve program kuralı (weekly_hours).
   - `phaseCatalogForDataset('sociology', '2026.1')` için dokuz aşamalı/80 dk
     akış kataloğu girişleri.
   - Sosyoloji productRuntime açılana kadar #136/#120 kapıları seçim ve
     kalıcılıkta otomatik koruyacak.
   - Felsefe 2026 geçiş belgeleri (docs/felsefe-mufredati-2026-gecis-*.md)
     yöntem şablonu olarak kullanılabilir.

## Çalışma kuralları (ekip koordinasyonu)

- Her çalışma turundan sonra durum.md (anlık durum) ve devir.md (devir teslimi)
  dosyalarını güncelle; gönderenin adını ve tarihi yaz.
- MiniMax AI ile GLM aynı depoda sırayla çalışır; başlamadan önce bu iki dosyayı
  ve son commit'leri oku.
- Değişiklikleri PR üzerinden geçir; main dalına doğrudan push engellidir.
- Sözleşme testleri, typecheck, lint ve build lokalde çalıştırılmadan PR açma.
- Öğrenci kişisel verisi harici yapay zekâya gönderilmez; gerçek öğrenci verisi
  test fixture'ı yapılmaz; geçmiş kayıtlar ve denetim izleri asla yeniden
  yazılmaz (README güvenlik kuralları).

## Hızlı bağlamlar

- Canlı: https://fopos-ders-studyosu.aytigin.chatgpt.site
- Doğrulama: `npm run test:contracts` · `npm run lint` · `npm run build` ·
  şema sonrası `npm run db:generate`
- Mimari özet: README.md "Güncel mimari gerçekler" bölümü.
