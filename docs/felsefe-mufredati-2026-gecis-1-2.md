# Felsefe Müfredatı 2026 Geçişi 1.2

Bu aşamada MEB 2026 Ortaöğretim Felsefe Dersi Öğretim Programı'nın
kanonik çekirdeği `app/data/felsefe_curriculum_2026.json` dosyasına
aktarılmıştır.

## Kapsama alınan resmî alanlar

- kaynak ve sürüm kimliği,
- sınıf ve ünite kapsamı,
- ders saatleri,
- öğrenme çıktısı kodları ve açıklamaları,
- bütün süreç bileşenleri,
- içerik çerçeveleri,
- anahtar kavramlar,
- okul temelli planlama süresi ve kariyer rehberliği odağı.

## Parite sonucu

| Sınıf | Ünite | Çıktı | Öğretim | Okul temelli | Toplam |
|---|---:|---:|---:|---:|---:|
| 10 | 9 | 10 | 68 saat | 4 saat | 72 saat |
| 11 | 6 | 12 | 68 saat | 4 saat | 72 saat |
| Toplam | 15 | 22 | 136 saat | 8 saat | 144 saat |

## Güvenlik sınırı

Veri seti `canonical-core-runtime-disabled` durumundadır. Paket yükleyici,
Ders Tasarım Stüdyosu, yıllık plan, sınav ve belge üretimi hâlen `2024.1`
verisini kullanır. Bu PR canlı davranış oluşturmaz.

## Sonraki aşama

Geçiş 1.3'te:

1. 2026 programındaki yetkinlik çerçevesi ve programlar arası bileşenler
   kanonik çekirdeğe eklenir.
2. Pedagojik zenginleştirme yeni kod ve sürelere göre yeniden eşlenir.
3. `FEL.10.1.2` özel akışı arşiv uyumluluğu korunarak çalışma zamanı
   kataloğundan ayrılır.
4. Yeni `FEL.10.2.2` için pedagojik akış kararı hazırlanır.
5. Çalışma zamanı etkinleştirmesi ayrı kullanıcı onayına bırakılır.
