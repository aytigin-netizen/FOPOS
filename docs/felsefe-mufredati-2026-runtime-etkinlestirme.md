# Felsefe Müfredatı 2026.1 Çalışma Zamanı Etkinleştirmesi

## Karar

Kullanıcının açık onayıyla FOPOS felsefe çalışma zamanı `2024.1` paketinden `2026.1` paketine geçirilmiştir. Bu değişiklik kod düzeyinde etkinleştirilmiş, canlı dağıtım yapılmamıştır.

## Etkin davranış

- Varsayılan felsefe paketi 2026 tarihli kanonik kaynağı yükler.
- 10. sınıf 9 ünite/10 çıktı, 11. sınıf 6 ünite/12 çıktı taşır.
- Her sınıfta 68 öğretim saati ve 4 okul temelli planlama saati korunur.
- `F10_U2` 6 saat, `F10_U3` 10 saattir.
- `FEL.10.1.2` etkin kapsamda bulunmaz; `FEL.10.2.2` etkin kapsamdadır.
- Ders motoru 22 çıktının her biri için 2026 alan-özgü dokuz aşamalı/80 dakikalık akışı seçer.
- Yıllık plan, günlük plan belgesi, standart sınav ve BEP sınav regresyon kapıları korunur.

## Geriye dönük uyumluluk

- `felsefe_curriculum_2024.json` silinmemiş veya değiştirilmemiştir.
- 2024 özel akış kataloğundaki `FEL.10.1.1` ve `FEL.10.1.2` kayıtları eski belgeler ve üretim izleri için korunur.
- Geçmiş pedagojik kayıtlar, belgeler, ürünler ve denetim izleri yeniden yazılmaz.

## Dağıtım kapısı

Manifest durumu `runtime-enabled-deployment-pending` değerindedir. GitHub CI başarıyla tamamlandıktan sonra canlı dağıtım için ayrıca kullanıcı onayı alınacaktır.
