# FEL.10.3.1 görev havuzu genişletmesi

## Kapsam ve kaynak

2026 Felsefe Öğretim Programı, Varlık Felsefesi ünitesinin FEL.10.3.1 çıktısı ve mevcut vaka (buz küpü–su örneği, töz ve oluş görüşleri) esas alındı. Yeni senaryolar öğretmen zenginleştirmesidir; resmî program metni, düşünür alıntısı ya da bilimsel bulgu değildir. Kavramlar vakadaki listeyle sınırlıdır (varlık, oluş, töz, fenomen, madde, öz); düşünür adı kullanılmadı.

## Değişiklik

- Dört bileşenin her birine 30 görev eklendi (düzey başına 6): toplam 120 yeni görev. Bileşen sırası vaka rolleriyle eşlenir: kavram, problem, değerlendirme, inceleme. Her bileşende düzey başına görev sayısı 8 oldu (şablondan 2 + havuzdan 6), bileşen başına toplam 40.
- Mevcut 10 şablon görev ve içerikleri değişmedi.
- Yeni dosya: `philosophy-grade10-unit3-pool-2026.ts`. Vaka dosyası (`philosophy-cases-10-3.ts`) havuzu `pool` alanıyla bağlar.

## Motor değişikliği (içerik dışı)

10.3–10.9 çıktıları vaka+şablon yolundan üretilir; havuz için küçük bir motor genişletmesi gerekti:

- `PhilosophyCase` türüne isteğe bağlı `pool` alanı eklendi. `orderedBank`, aynı düzeyin görevlerini ardışık tutmak için havuz görevlerini aynı düzeydeki şablon görevlerden hemen sonra yerleştirir. A/B ve geçmiş denetimi ardışık sıraya dayandığı için bu zorunludur.
- `philosophyCaseCapacity` eklendi; `variantPoolFor` vaka çıktıları için kapasiteyi gerçek görev sayısından türetir (10.3.1: 8). Havuzu olmayan vaka çıktıları (10.3.2–10.9.x) 2 kalır; davranışları değişmez.

## Test değişiklikleri ve kilidin anlamı

Eski F6 altın özet testi, 10.3.1 çıktısının 40 varyantının tamamını bayt düzeyinde kilitliyordu. Havuz, aynı düzeyin görevlerini ardışık yerleştirdiği için ordinal 8 ve sonrası artık başka görev üretir; bu kilit olduğu gibi korunamazdı. Kilit şu iki daha dar ama eşdeğer koruma ile değiştirildi:

1. Altın özetteki ilk 8 sıra (aynı düzeyin ilk iki görevi × dört bileşen) bayt düzeyinde aynıdır (60 birleşim).
2. Özgün 40 çıktının tamamı (ordinal hariç), eski koddan üretilen `philosophy-fel1031-golden-bare.json` ile karşılaştırıldığında genişletilmiş havuzda hâlâ üretilir (60 birleşim × 40).

F2 ve F2b testleri 10 yerine 40 görev (ve 160 ordinal kapasitesi) bekleyecek biçimde güncellendi. Yeni sözleşme testi: `tests/philosophy-grade10-unit3-pool.test.mjs` (sayım, benzersizlik, yasak içerik denetimi, düzey eşleşmesi, B kapasitesinin 8’de bitmesi, kapasite değerleri).

Yerel doğrulama: sözleşme paketi 875/875; `tsc --noEmit` temiz; değişen dosyalarda eslint hatası yok (mevcut test uyarıları dışında). Bu kayıt öğretmen içerik onayı, birleştirme ya da canlı dağıtım kaydı değildir.

## Sınırlar

Ölçütler vaka yolunda ortak biçimdedir (görevin eksiksiz yapılması %40, kavram ve metin kanıtı %40, dil ve bütünlük %20); göreve özgü ölçüt ayrı paketin konusudur. 10.3.2–10.9.x çıktıları aynı yöntemle sonraki paketlerde genişletilecektir.
