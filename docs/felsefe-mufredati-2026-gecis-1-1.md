# Felsefe Müfredatı 2026 Geçişi 1.1

## Amaç

MEB 2026 Ortaöğretim Felsefe Dersi Öğretim Programı ile FOPOS'taki kanonik
`2024.1` veri seti arasındaki yapısal farkları kayda almak ve güvenli sürüm
geçişinin sınırlarını belirlemek.

Bu aşama yeni programı çalışma zamanında etkinleştirmez.

## Doğrulanan sabitler

- 10 ve 11. sınıflar korunuyor.
- Haftalık ders saati: 2.
- Her sınıf için yıllık toplam: 72 saat.
- Her sınıf için öğretim süresi: 68 saat.
- Her sınıf için okul temelli planlama: 4 saat.
- Toplam: 15 ünite ve 22 öğrenme çıktısı.

## Yapısal fark matrisi

| Alan | 2024.1 | 2026.1 | Etki |
|---|---:|---:|---|
| 10/1 çıktı sayısı | 2 | 1 | `FEL.10.1.2` emekli; kapsam `FEL.10.1.1` içinde birleşiyor |
| 10/2 çıktı sayısı | 1 | 2 | Yeni `FEL.10.2.2` ekleniyor |
| 10/2 süre | 8 saat / 4 hafta | 6 saat / 3 hafta | Yıllık plan dağılımı değişiyor |
| 10/3 süre | 8 saat / 4 hafta | 10 saat / 5 hafta | Yıllık plan dağılımı değişiyor |
| 10. sınıf toplam çıktı | 10 | 10 | Toplam korunuyor; üniteler arası dağılım değişiyor |
| 10. sınıf öğretim süresi | 68 | 68 | Toplam korunuyor |
| 11. sınıf ana yapı | 6 ünite / 12 çıktı | 6 ünite / 12 çıktı | Kod ve içerik paritesi ayrıca doğrulanacak |

## Pedagojik Motor etkisi

`phase-catalog.ts` içindeki `FEL.10.1.1` ve `FEL.10.1.2` akışları yeni
programa doğrudan taşınamaz:

1. Yeni `FEL.10.1.1` eski iki çıktının kapsamını tek çıktıda birleştirir.
2. `FEL.10.1.2` yeni programda bulunmaz.
3. Yeni `FEL.10.2.2` için henüz alan-özgü akış yoktur.

Bu nedenle katalog eşlemesi, 2026.1 çalışma zamanında etkinleştirilmeden önce
ayrı bir pedagojik içerik aşamasında yeniden kurulmalıdır.

## Arşiv ve uyumluluk kararı

- `2024.1` veri seti silinmez veya yerinde değiştirilmez.
- Eski kararlar, belgeler ve üretim izleri kendi müfredat kimliğiyle korunur.
- Arşivlenmiş `FEL.10.1.2` kayıtları yeniden yazılmaz.
- 2026.1 ancak tam veri çıkarımı, kaynak paritesi ve regresyon kapıları
  tamamlandıktan sonra seçilebilir hâle gelir.
- Geçiş kullanıcı onayı olmadan çalışma zamanına veya canlıya alınmaz.

## Sonraki kapı

Felsefe Müfredatı 2026 Geçişi 1.2:

- 76 sayfalık kaynaktan tam kanonik `2026.1` veri seti,
- 15 ünite/22 çıktı için süreç bileşenleri ve programlar arası bileşen paritesi,
- süre ve kod regresyonları,
- 2024.1/2026.1 sürüm çözümleme politikası.
