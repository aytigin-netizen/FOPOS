# Felsefe Müfredatı 2026 Geçişi 1.4

## Amaç

2026.1 kanonik veri kümesinde yeniden yazılması gereken `FEL.10.1.1` ile yeni eklenen `FEL.10.2.2` öğrenme çıktıları için alan-özgü dokuz aşamalı pedagojik akışlar oluşturmak.

## Uygulanan değişiklikler

- `phase-catalog-2026.ts` içinde sürümlü ve çalışma zamanından yalıtılmış bir önizleme kataloğu eklendi.
- Her iki öğrenme çıktısı için dokuz aşamalı, toplam 80 dakikalık akış hazırlandı.
- Akışlar 2026 öğrenme çıktıları, süreç bileşenleri ve program bileşenleriyle hizalandı.
- Katalog, diziler ve aşama nesneleri dış mutasyona karşı donduruldu.
- Geçiş manifesti `phase-flows-present-runtime-disabled` durumuna ilerletildi.
- Yeni sözleşme testi genel `test:contracts` kapısına bağlandı.

## Uyumluluk sınırları

- Canlı `specialPhaseCatalog` değiştirilmedi.
- `lesson-engine.tsx` ve 2024.1 çalışma zamanı seçimi değiştirilmedi.
- `FEL.10.1.2` yalnız 2024 kataloğunda korunur; 2026 kataloğunda bulunmaz.
- Geçmiş kayıtlar ve denetim izleri yeniden yazılmaz.
- `runtimeEnabled` değeri `false` olarak korunur.
- Bu aşamada canlı dağıtım yapılmaz.

## Doğrulama

`tests/philosophy-curriculum-2026-phase-catalog.test.mjs` aşağıdaki sözleşmeleri doğrular:

- iki hedef kodun 2026 kanonik veri kümesinde bulunması,
- her akışta tam dokuz aşama ve toplam 80 dakika,
- zorunlu metin alanları ve pozitif süreler,
- `FEL.10.1.2` kodunun 2026 kataloğunda bulunmaması,
- 2024 canlı katalog davranışının korunması,
- katalogların mutasyondan yalıtılması,
- geçiş manifestinin 1.4 kapısını kaydetmesi.
