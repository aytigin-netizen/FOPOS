# FOPOS — Sınav Kapanışı ve 11. Sınıfa Geçiş Durumu

Tarih: 6 Ekim 2026
Hazırlayan: Codex
Depo: aytigin-netizen/FOPOS

## Güncel uygulama ve canlı yayın

- GitHub uygulama kaynağı: a035c28a7e8145b86c1c2bae755e687467a0a3ba (#183); #182 de içerilir.
- Canlı sürüm: 157; Sites kaynak commit'i: 753cb18c535ccb5c1ae5ee274962ec0ba576e959.
- Kaynak ağaçları birebir aynı: 405a0b26e108031da7a4f963b6dd455c74be8be9.
- Dağıtım: succeeded, 6 Ekim 2026 09:54:31 (Türkiye).
- Canlı: https://fopos-ders-studyosu.aytigin.chatgpt.site

## Tamamlanan kapsam

#182 ile 26 çift/52 görev yuvasının soru–anahtar–puanlama uyumu tamamlandı; diğer 48 görev korundu. #183 ile öğretmen DOCX Sınav Analiz Formu'na genel sonuçlar, soru analizi ve destek planı tabloları eklendi. İki paket canlı kaynağın içindedir.
#181 eski envanter PR'ı birleştirilmeden kapatıldı.

## Test kapanışı

Altı geniş tarama başarısızlığı: 2 derleme bağımlılığı, 4 eskimiş test, bu bulgularda doğrulanmış gerçek uygulama hatası 0. Dört test güncel runtime ve güven sınırlarını kontrol edecek biçimde yenilendi. Derleme sonrası geniş tarama 866/866 başarılı. `npm run test:all` önce derler, sonra tüm test dosyalarını çalıştırır.

## Açık kabul koşulu

Canlı tarayıcıda 8 soruluk/100 puanlık A/B sınavı üretildi. Öğretmen onayında “Oturum gerekli” uyarısı çıktı. Giriş sonrasında tarayıcı güvenlik denetimi erişimi engelledi. Gerçek A/B öğrenci–öğretmen DOCX indirme ve görsel sayfa incelemesi tamamlanmadı. Kapanış bu nedenle koşulludur; önceki XML testleri görsel kabul sayılmaz.
Eski önermeler listesi bulgusu bu kabul girişiminde ayrıca doğrulanmadı.

## Sıradaki içerik

Görsel kabul tamamlandıktan sonra 11. sınıf 1. ünite: FEL.11.1.1 a–b ve FEL.11.1.2 a–b–c. Resmî PDF'de bütün 11. sınıf çıktıları iki bileşenli değildir: 12 çıktı ve 30 bileşen vardır. Yeni içerik üretimi henüz başlamadı. 10. sınıf 1–2. ünitelerini gerekçesiz yeniden cilalama.

Ayrıntılı kanıt ve altı test tablosu: docs/quality/exam-closure-20261006.md.
Tek resmî kaynak: dört dersin 2026 öğretim programları; yetki ve kaynak kimlikleri AGENTS.md / sources/curriculum-2026/manifest.json.
