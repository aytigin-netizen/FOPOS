# Sınav kapanış kabulü — 6 Ekim 2026

## Yayın kanıtı

#182 ve #183 birleşmiş durumdadır. GitHub main: a035c28a7e8145b86c1c2bae755e687467a0a3ba.
Canlı sürüm 157; kaynak commit 753cb18c535ccb5c1ae5ee274962ec0ba576e959.
İki kaynak deposunun HEAD ağaçları birebir aynıdır: 405a0b26e108031da7a4f963b6dd455c74be8be9.
Dağıtım appgdep_6ac49ae920e88191b2b330af7ec78bf1 için succeeded; zaman 6 Ekim 2026 09:54:31 Türkiye.
Bu doğrulama nedeniyle aynı uygulama kaynağı tekrar yayımlanmadı.

## Canlı tarayıcı kabulü: BLOKE, tamamlanmadı

Misafir oturumunda 10. sınıf 1–2. üniteler, 8 soru, 40 dakika, otomatik bilişsel düzey dağılımı ile gerçek sınav üretildi. Ekran 100 puan, A/B seçimi, soru/anahtar/ölçüt metinlerini gösterdi.
Öğretmen onayı sırasında “Oturum gerekli” uyarısı oluştu; öğrenci ve öğretmen indirme düğmeleri kapalı kaldı. İndirme tamamlanmadı, indirilen gerçek DOCX yoktur.
Güvenli giriş akışında kullanıcı kontrolünden sonra tarayıcı güvenlik politikası gözlemi engelledi; FOPOS kökenine dönüş de otomatik onay denetimince reddedildi. Bu yol yeniden denenmedi.
Canlıdan A/B öğrenci ve öğretmen toplam dört DOCX indirip sayfalarını görsel olarak incelemek hâlâ kapanış koşuludur. XML kabulü veya yerel üretim bu koşulun yerine geçmez.

## Altı başarısızlığın sınıflandırılması

Başlangıç: `node --experimental-strip-types --test tests/*.test.mjs`, derlemesiz temiz checkout: 858/864; 6 başarısız.

| Test | Sınıf | Kanıt / işlem |
|---|---|---|
| lazy-module-bundle.test.mjs dosyası | Derleme bağımlılığı | dist/client/.vite/manifest.json yok. Derleme sonrasında dosyanın üç testi geçti. |
| rendered-html: development preview metadata | Derleme bağımlılığı | dist/server/index.js yok. Derleme sonrasında geçti. |
| resource-center: doğrulanmış tam ifadeler | Eskimiş test | Eski enrichmentOutcome fallback'ini curriculum.ts içinde arıyordu. Güncel 2026 runtime, resmî JSON ifadelerini doğrudan taşır. Tüm 10–11. sınıf çıktıları ve bileşenleri runtime/veri eşitliğiyle kontrol edilir. |
| resource-center: örnek belge bağlantıları | Eskimiş test | ClientApp'te kaldırılmış setResult(null) çağrısını arıyordu. Güncel Kaynak Merkezi onOpen/setView bağlantısı kontrol edilir. |
| trust-chain: adım sırası | Eskimiş test | #133/e40ec58 ile bilerek kaldırılmış özet başlıklarını arıyordu. Mevcut dosya seçme, sonuç kontrolü ve makbuz adımlarının sırası kontrol edilir. |
| trust-chain: sürüm/boyut/sınırlar | Eskimiş test | Aynı kaldırılmış özetin metnini bekliyordu. Güncel şema ve 256 KiB sabitleri, yazmama sınırı ve makbuzun kaynak kanıtı olmadığı açıklaması kontrol edilir. |

Bu altı bulguda doğrulanmış gerçek uygulama hatası: 0. Derleme bağımlılığı: 2; eskimiş test: 4.
Güncel geniş tarama: 866/866 başarılı. 864→866 farkı, derlemesiz başarısız dosya düğümü yerine bundle dosyasının üç testinin çalışmasından gelir.
`npm run test:all` derlemeyi taramadan önce çalıştırır; test atlanmaz veya karantinaya alınmaz.

## Kayıt temizliği

#181 eski başlangıç envanterini taşıyordu; #182 sonrasındaki içerik için güncel kapanış raporu değildir. Birleştirilmeden kapatıldı; dal içeriği korunur.
durum.md ve devir.md güncel yayın, test kanıtı ve açık görsel kabul koşulunu öne çıkarır.

## Sonraki içerik kapsamı: 11. sınıf

Kullanıcının sırası: canlı DOCX görsel kabulü → test/kayıt kapanışı → 11. sınıf.
Resmî kaynak PDF'sinin 51, 55, 59, 62, 66 ve 70. sayfaları okunmuştur.
Altı ünitede 12 çıktı vardır: FEL.11.1.1–FEL.11.6.2. Her ünitede `.1` çıktısı a–b, `.2` çıktısı a–b–c taşır; toplam 30 süreç bileşeni. İkinci çıktıların c (felsefi metin yazma) bileşeni düşürülemez.
İlk geliştirme kapsamı 11. sınıf 1. ünite: FEL.11.1.1 a–b ve FEL.11.1.2 a–b–c için bileşene özgü paralel A/B soru, anahtar, ürün ölçütü ve puanlama. Yeni içerik henüz üretilmedi; görsel kabul engeli kaldırılmadan içerik geliştirmesi başlamaz.
