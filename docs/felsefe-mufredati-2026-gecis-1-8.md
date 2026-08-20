# Felsefe Müfredatı 2026 Geçişi 1.8

## Amaç

2026.1 kanonik müfredatının süre, hafta, öğrenme çıktısı ve okul temelli planlama yapısını, 2026 çalışma zamanını etkinleştirmeden yıllık plan motorunun iki saatlik hafta dağılımı üzerinden doğrulamak.

## Regresyon kapıları

1. **Saat bütünlüğü:** Her sınıfta 68 öğretim saati ve 4 okul temelli planlama saati ayrı tutulur; genel toplam 72 saattir.
2. **Hafta bütünlüğü:** Haftalık ders saati 2; öğretim 34 hafta, okul temelli planlama 2 haftadır.
3. **Ünite süreleri:** Ünite sırası ve süreleri kanonik 2026.1 veri kümesiyle bire bir eşleşir. `F10_U2` 3 hafta/6 saat, `F10_U3` 5 hafta/10 saattir.
4. **Çıktı kapsamı:** 10. sınıfta 10, 11. sınıfta 12 kanonik öğrenme çıktısı yıllık plana taşınır; `FEL.10.1.2` 2026 planında bulunmaz.
5. **Okul temelli planlama:** Dört saatlik kayıtlar meslek seçimi, kariyer planlaması, mesleki rehberlik ve kariyer danışmanlığı odağını açıkça taşır.
6. **Yalıtım:** Regresyon fikstürleri ve satırları dondurulur; 2026 veri kümesi yalnız sürümlü önizleme/test sınırında kullanılır.
7. **Uyumluluk:** 2024 yıllık plan motoru ve canlı paket yükleyici değiştirilmez; `runtimeEnabled=false` korunur.

## Uygulama

- `annual-plan-2026-preview.ts`, canlı yıllık plan motorunun iki saatlik dağıtım kuralını 2026.1 için çalışma zamanından yalıtılmış biçimde uygular.
- `philosophy-curriculum-2026-annual-plan.test.mjs`, saat, hafta, ünite, çıktı, kariyer odağı ve mutasyon yalıtımı sözleşmelerini doğrular.
- Yeni sözleşme genel `test:contracts` kapısına bağlanmıştır.
- Manifest durumu `annual-plan-regression-complete-runtime-disabled` olarak ilerletilmiştir.

## Kapsam dışı

- Belge ve sınav regresyonu
- 2026 çalışma zamanı etkinleştirmesi
- Geçmiş kayıtların veya denetim izlerinin yeniden yazılması
- Canlı dağıtım
