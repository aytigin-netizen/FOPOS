# Sosyoloji Müfredatı 2026 Geçiş Belgesi 1-1 — Resmî Kaynak Doğrulama Temeli

**Tarih:** 1 Ekim 2026
**Hazırlayan:** GLM (Vibe / Mistral)
**Kaynak:** T.C. Millî Eğitim Bakanlığı, Ortaöğretim Sosyoloji Dersi Öğretim Programı (2026), 48 sayfa — meb:sociology:2026

Bu belge, sosyoloji 2026.1 veri setinin resmî programla doğrulanmış temel
gerçeklerini kaydeder ve runtime aktivasyonundan önce tamamlanacak kanıt
zincirini tanımlar. Felsefe 2026 geçiş belgeleri (gecis-1-1 … 1-9) yöntem
şablonu olarak alınmıştır.

## Resmî program kuralları (programRules)

- **Haftalık ders saati: 2** — "Sosyoloji Dersi Öğretim Programı; Sosyoloji
  Dersi 1 ve Sosyoloji Dersi 2 haftada ikişer ders saati uygulanmak üzere
  hazırlanmıştır." (s. 6)
- **Yıllık toplam: her düzey 72 ders saati** (s. 11)
- **Okul temelli planlama: her düzey 4 ders saati** (s. 10 tablosu)
- **Alan becerileri:** Eleştirel Sosyolojik Düşünme (Çözümleme, Sorgulama),
  Tarihsel Empati (Tarihsel Bağımsallaştırma); kavramsal beceriler:
  Karşılaştırma, Yapılandırma, Yorumlama, Çıkarım Yapma (s. 5, s. 11)

## Ünite, çıktı ve süre tablosu (s. 10)

### Sosyoloji Dersi 1 (11. sınıf)

| Ünite | Çıktı | Ders Saati |
| --- | --- | --- |
| SOS.11.1 Sosyolojinin Doğuşu | 3 | 16 |
| SOS.11.2 Türkiye'de Modernleşme ve Sosyoloji | 3 | 14 |
| SOS.11.3 Kültür ve Toplumsal Yapı | 3 | 12 |
| SOS.11.4 Toplumsal Kurumlar | 6 | 16 |
| SOS.11.5 Güncel Sosyolojik Meseleler | 3 | 10 |
| Okul temelli planlama | – | 4 |
| **Toplam** | **18** | **72** |

### Sosyoloji Dersi 2 (12. sınıf)

| Ünite | Çıktı | Ders Saati |
| --- | --- | --- |
| SOS.12.1 Bilim Sosyolojisi | 2 | 20 |
| SOS.12.2 Örnek Sosyolojik Uygulamalar | 1 | 48 |
| Okul temelli planlama | – | 4 |
| **Toplam** | **3** | **72** |

Kanonik paket (src/curriculum-packages/sociology-2026.ts) bu tablolarla
birebir paritedir; sözleşme testi
tests/sociology-curriculum-2026-source-parity.test.mjs pariteyi sabitler.

## Doğrulama zinciri durumu

- Paket manifest durumu **UNVERIFIED** kalır: VERIFIED'a geçiş, felsefede
  izlenen MP-H01 D2–D7 zinciri gibi snapshot (içerik karması) + insan
  onaylı VERIFICATION_RECORD kanıtı gerektirir.
- Bu PR ile tamamlanan: resmî kaynak kimliği (48 sayfa, resmî PDF URL),
  program kuralları (weeklyHours=2, 68+4=72), sınıf özetleri ve parite
  sözleşme testi.
- Eksik (sıradaki adımlar): kaynak snapshot'i ve içerik karması; insan
  onayı; VERIFICATION_RECORD evidence kaydı; ardından runtime aktivasyon
  (aşama kataloğu sociology/2026.1, hafta içerikleri, domain registry
  productRuntime açılışı) — hepsi ayrı PR'larla ve sözleşme testleriyle.

## Çıkarımlar ve uyarılar

- SOS.11.3.2 resmî PDF'te "çözümlenebilme" biçiminde dizgi tutarsızlığı
  görünür; kanonik paket tutarlı "çözümleyebilme" biçimini korur.
- Sosyoloji Dersi 1 ve 2 ayrı kitaplardır (12-14 ve 8-10 forma); her ikisi
  de 11–12. sınıf düzeylerinde haftada ikişer saattir.
- Sosyoloji ürün runtime'ı, bu zincir tamamlanana kadar fail-closed kalır;
  #136/#120 kapıları seçim ve kalıcılıkta otomatik koruma sağlar.
