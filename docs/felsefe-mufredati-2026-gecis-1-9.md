# Felsefe Müfredatı 2026 Geçişi 1.9

## Amaç

2026.1 kanonik müfredatının günlük plan belgesi ve sınav paketi üretim sözleşmeleriyle uyumunu, canlı çalışma zamanını etkinleştirmeden doğrulamak.

## Regresyon kapıları

1. **Belge kapsamı:** 10. sınıfın 10 ve 11. sınıfın 12 öğrenme çıktısının her biri için günlük plan belge fikstürü bulunur.
2. **Pedagojik bütünlük:** Her belge dokuz aşama, 80 dakika, süreç bileşenleri, içerik çerçevesi, anahtar kavramlar ve TYMM yetkinlik alanlarını taşır.
3. **Sınav kapsamı:** Her sınıf için standart ve BEP sınav paketleri kanonik ünite ve öğrenme çıktısı kümelerine bağlanır.
4. **Paket bütünlüğü:** Sınavlar 100 puan, geçerli süre ve açık BEP eğitimsel uyarlama anahtarı taşır.
5. **Üretim izi:** Günlük plan ve sınav üretimleri OPUS karar–inceleme–öğretmen onayı–üretim zincirinden geçer ve `philosophy-tr-2026` kaynak kimliğini korur.
6. **Mahremiyet:** Öğrenci listesi, puan, tanı ve sağlık bilgisi üretim izine dahil edilmez.
7. **Yalıtım:** Belge ve sınav fikstürleri dondurulur; `FEL.10.1.2` 2026 çıktılarında bulunmaz.
8. **Uyumluluk:** 2024 canlı veri kümesi ve paket yükleyici değiştirilmez; `runtimeEnabled=false` korunur.

## Uygulama

- `philosophy-2026-document-assessment-preview.ts`, belge ve sınav regresyon fikstürlerini çalışma zamanından yalıtılmış biçimde oluşturur.
- `philosophy-curriculum-2026-document-assessment.test.mjs`, 22 belge akışını, dört sınav varyantını, OPUS üretim izini, mahremiyet sınırını ve mutasyon yalıtımını doğrular.
- Yeni sözleşme genel `test:contracts` kapısına bağlanmıştır.
- Manifest durumu `document-assessment-regression-complete-runtime-disabled` olarak ilerletilmiştir.

## Etkinleştirme durumu

Teknik regresyon kapıları tamamlanmıştır. Çalışma zamanı etkinleştirmesi yalnız kullanıcının ayrıca vereceği açık onayla ele alınacaktır.

## Kapsam dışı

- 2026 çalışma zamanı etkinleştirmesi
- Geçmiş kayıtların veya denetim izlerinin yeniden yazılması
- Canlı dağıtım
