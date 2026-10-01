# FOPOS — Devir Teslimi (GLM → MiniMax AI)

**Tarih:** 1 Ekim 2026
**Devreden:** GLM (Vibe / Mistral)
**Devralan:** MiniMax AI

## Bu devirde yapılan değişiklik

Bu tur yalnızca **inceleme ve durum belirleme** turudur. main dalına kod
değişikliği yapılmadı; yalnızca durum.md ve devir.md handoff dosyaları
eklendi.

## Devraldığınız durum

- main HEAD: d5b1881 (#140, 1 Ekim 2026 16:25 UTC). Sözleşme testleri 600/600,
  typecheck, lint, build temiz (yazarın bildirimi).
- Açık issue yok; #135 kapandı.
- **Bekleyen tek iş: PR #141** — "Kullanılmayan giriş yönlendirmesini kaldır,
  return_to korumasını test et" (dal: refactor/drop-unused-auth-redirect,
  +75/−46, 3 dosya, 1 commit, mergeable_state: clean, draft değil).

## Önerilen sıradaki adımlar (öncelik sırasıyla)

1. **PR #141'i incele ve birleştir.** Küçük, izole, güvenlik testi ekleyen bir
   refaktör. Dikkat noktaları:
   - chatGPTSignOutPath yeniden dışa aktarımının mevcut import yollarını
     bozmadığını doğrula (app/api/account-closure/route.ts canlı kullanım).
   - app/core/auth-return-path.ts sunucu bağımlılığı içermemeli.
   - Açık yönlendirme testleri: harici adres, protokol-göreli adres,
     /\\evil.example, kimlik yollarına dönüş (döngü koruması).
   - Birleştirmeden önce kendi ortamında test:contracts, typecheck, lint,
     build çalıştır.
2. **Sosyoloji 2026 veri seti hazırlığı (sonraki büyük adım).** #135/#137/#140
   zinciri sosyolojiyi tam fail-closed hale getirdi; artık eksik olan şey
   kod değil, **doğrulanmış veri**:
   - MEB 2026 Sosyoloji Öğretim Programı'ndan ünite/öğrenme çıktısı kodları,
     saat dağılımı ve program kuralı (weekly_hours).
   - phaseCatalogForDataset('sociology', '2026.1') için dokuz aşamalı/80 dk
     akış kataloğu girişleri.
   - Sosyoloji productRuntime açılana kadar #136/#120 kapılarının seçim ve
     kalıcılıkta otomatik koruyacağını unutma.
   - Felsefe 2026 geçiş belgeleri (docs/felsefe-mufredati-2026-gecis-*.md)
     yöntem şablonu olarak kullanılabilir.
3. **Canlı dağıtım uyumu.** PR #141 canlı davranışı değiştirmiyor; birleştirme
   sonrası dağıtımda giriş/çıkış akışını canlıda bir kez dene.

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
- Doğrulama: npm run test:contracts · npm run lint · npm run build ·
  şema sonrası npm run db:generate
- Mimari özet: README.md "Güncel mimari gerçekler" bölümü.
