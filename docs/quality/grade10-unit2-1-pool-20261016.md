# FEL.10.2.1 görev havuzu genişletmesi

## Kapsam ve kaynak

2026 Felsefe Öğretim Programı, Düşünme ve Dil ünitesinin FEL.10.2.1 çıktısı esas alındı: a (düşünme ve dil ilişkisini inceleyerek nedensel ilişkiler ortaya koyar) ve b (tespit ettiği ilişkilerden hareketle uyumlu bir bütün oluşturur). Yeni senaryolar öğretmen zenginleştirmesidir; resmî program metni, düşünür alıntısı ya da bilimsel bulgu değildir. Düşünür adı ve araştırma iddiası kullanılmadı.

## Değişiklik

- Her bileşenin mevcut 10 görevine 30 görev eklendi: toplam 80 görev, her bileşende beş bilişsel düzeyin her birinde sekiz görev. Mevcut 10 görev ve sırası değişmedi; yeni görevler sona eklendi.
- a bileşeni: sözcük öğrenmenin ayrıntılandırmaya katkısı, sözcüksüz yürütülen işlemler, düşünceden dile ve dilden düşünceye etki yönleri, birlikte görülme ile neden olma ayrımı, tek örnekten genelleme sınırı, bir gözlem planı kurma.
- b bileşeni: dile dökmenin düşünceyi değiştirmesi, kavram ayrımının görüşleri açıklaştırması, “düşünce önce gelir, dil yalnız taşır” ve “dil tamamen belirler” yargılarının tek yönlülüğü, “karşılıklı ilişki” ile “aynı şey olmak” ayrımı, karşılıklı ilişki yargısının sınırlanması.
- Ölçütler düzey türüne göre ortaktır; her etiketin açıklaması sabittir (göreve özgü ölçüt ayrı paket olarak bekliyor).
- Yeni dosya: `philosophy-grade10-unit2-pool-2026.ts`; bağlama `philosophy-early-units-2026.ts` içinde yapılır.

## İçerik ilkeleri

Dil, düşüncenin tek belirleyicisi ya da yalnız aracı olarak sunulmaz. Tek örnekten bütün düşünme için kesin sonuç çıkarılmaz; “düşünme”nin nasıl tanımlandığına bağlı tartışmalar açık bırakılır ve gerekçeli alternatif yanıtlar kabul edilir. Soru kökleri anahtarın dayandığı malzemeyi kendi içinde taşır; kökte cevap ya da sınır verilmez.

## Doğrulama ve durum

Yeni sözleşme testi `tests/philosophy-grade10-unit2-pool.test.mjs`: düzey başına 8 görev, ilk 10 görevin düzey sırası, kök/anahtar benzersizliği, düşünür adı ve program cümlesi denetimi, ölçüt puan toplamı, 8 varyantın üretimi ve B kapasitesinin 8’de bitmesi, A/B kapasitesi. `philosophy-early-exam-content.test.mjs` içindeki “B kalmadı” denetimi sabit sayı yerine bileşenin o düzeydeki gerçek görev sayısına bağlandı.

Yerel doğrulama: sözleşme paketi 875/875 geçti; tür denetimi temiz; değişen dosyalarda eslint temiz. Bu kayıt öğretmen içerik onayı, birleştirme ya da canlı dağıtım kaydı değildir.

## Sınırlar

A/B kapasitesi yalnız FEL.10.2.1 seçildiğinde 8’dir; 10.2.2 ile birlikte seçildiğinde en dar çıktı (2) belirler. 10.2.2 ve 10.1.1 havuzları ayrı paketlerde genişletilecektir.
