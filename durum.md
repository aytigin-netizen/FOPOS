# FOPOS — Güncel Durum

Tarih: 6 Ekim 2026
Hazırlayan: Codex
Depo: aytigin-netizen/FOPOS
Onaylanan uygulama kaynağı: f5dbc1e988aaee0df05452e157baf78c99bb3350
Kaynak ağacı: 9fdce01e9c18bf72981c74fc3a03f7baa9c6b83b

## Tamamlanan kapsam

5 Ekim soru–cevap–puanlama paketi #176 ile tamamlandı. Sonrasında #177, #178 ve #179 ana dala birleşti. Bu paketler 10. sınıf 1–2. ünitelerde genel şablon köklerinin bir bölümünü paralel A/B görevlerine dönüştürdü; soru ürününe özgü ölçütleri ve gerekçeli alternatif cevapların kabulünü geliştirdi.

## Doğrulama

- test:contracts: 751/751 başarılı.
- TypeScript tür kontrolü başarılı.
- Lint: 0 hata, iki mevcut kullanılmayan değişken uyarısı.
- Üretim derlemesi ve ESM Worker/artifact doğrulaması başarılı.
- Gerçek sınav motoru ve Word dışa aktarıcısıyla A/B için 8 soruluk, 100 puanlık örnekler üretildi. Dört DOCX'in word/document.xml içeriği kontrol edildi.
- Her kitapçıkta öğrenci ve öğretmen soru/metin eşleşmesi 8/8; A/B bilişsel düzey ve süreç bileşeni eşleşmesi 8/8.
- Öğretmen dosyalarında cevap anahtarları ve her puanlama ölçütü korundu. Öğrenci dosyalarında cevap anahtarı bulunmuyor.
- Her sorunun ölçüt puanları soru puanını; her kitapçığın soru puanları 100'ü veriyor.
- Bu kabul, yayınlanan kaynağın üretici/DOCX kontrolüdür; tarayıcı üzerinden yeniden dosya indirme veya kapsamlı görsel inceleme yapılmadı.

## Canlı yayın

Sürüm: 155
Sites kaynak commit'i: 30a288403627c239358eab1de93b14bf988f0b17
Sites kaynak ağacı, GitHub f5dbc1e ağacıyla birebir aynı; farklı commit kimliği iki ayrı depo geçmişinden kaynaklanır.
Canlı adres: https://fopos-ders-studyosu.aytigin.chatgpt.site

## Kalan işler

1. #179 açıklamasında yaklaşık 47 genel şablon görev yuvasının kaldığı belirtiliyor. Bu sayı bu turda yeniden sayılmadı. Sonraki geliştirme öncesinde bileşen/düzey bazında kesin envanter çıkarılmalı; soru–anahtar–ölçüt ve A/B paritesi tek paket halinde ele alınmalı.
2. Önceki kayıtlardaki Sınav Analiz Formu'nun yalnız başlık/imza üretmesi ayrı bir açık kabul bulgusudur. Bu paket onu sınamadı veya kapatmadı.
3. Önermeler listesiyle ilgili eski kabul bulgusunun tüm üretim yollarındaki durumu bu dar paketle kapatılmadı.
4. #178 açıklamasında genel node --test taramasında main'de de bulunan dört başarısız test bildiriliyor. Bu turda zorunlu test:contracts paketi başarıyla çalıştı; geniş tarama yeniden yapılmadı.

## Çalışma sınırı

Dört ders için tek resmî müfredat kaynağı 2026 programlarıdır. Psikoloji ve Mantık kaynak kayıtları, tamamlanmış ve etkin üretim modülü anlamına gelmez. Bu turda uygulama içeriğine yeni değişiklik yapılmadı.

Dağıtım sonucu: succeeded; 6 Ekim 2026 07:57 (Türkiye).


## 6 Ekim 2026 kesin şablon envanteri

Yaklaşık 47 tahmini yerine kesin sayı: 100 görev yuvasının 52'si genel soru kökünü kullanıyor, 48'i bileşene özgü köke sahip. 52 kökün 46'sı bileşen ifadesi, 6'sı hazır değerlendirme yargısı taşıyor. Dağılım: Anlama 16, Uygulama 12, Çözümleme 0, Değerlendirme 12, Oluşturma 12. Toplam 26 potansiyel A/B düzey çifti. Bütün 100 yuvanın gerçek üretici erişimi, kök/düzey/bileşen eşleşmesi ve ölçüt puan toplamı doğrulandı; ilgili 23/23 mevcut test başarılı, envanter betiği lint/sözdizimi kontrolünden geçti.

Ayrıntılar: docs/quality/early-exam-template-inventory-20261006.md ve JSON. Tekrar üretim: node --experimental-strip-types scripts/inventory-early-exam-templates.mjs. Kaynak commit 50e567d; uygulama dosyası f5dbc1e ile aynı. Bu tur soru içeriği değiştirilmedi ve canlı yayın yapılmadı. Sıradaki geliştirme, 26 çiftin soru–anahtar–ölçüt bakımından birlikte incelenmesidir; genel şablon olması tek başına yanlışlık kanıtı değildir.
