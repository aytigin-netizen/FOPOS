# Sınav geçmişi canlı kabul kaydı

Tarih: 13 Ekim 2026

## Kaynak ve dağıtım

PR #202, GitHub ana dalı 2ba75bfad02ef073acffdaceeecd77bbcd495d86. GitHub CI 38378638518 başarılı.
Canlı sürüm 167; Sites kaynağı 3897485dd4f0466299442b8940759f5471c2763a.
Kaynak ağacı iki depoda aynı: 6f35ea9cdaf8f5b270e896e6b54c69cf83d4246f.
Dağıtım appgdep_6acdfeae69a08191baa31d7b0a3ea0e9, succeeded, 13 Ekim 2026 12:49:56 Türkiye.

## Gerçek tarayıcı akışı

11. sınıf 4. ünite, standart sınav, otomatik bilişsel düzey dağılımı.
5 soru: otomatik 2+3 dağılım; A ve B beşer soru, 100’er puan, tekrar yok. İlk üretimden sonra kalan üretim 1.
OPUS öğretmen onayı kaydedildi; gerçek A/B öğrenci ve öğretmen dört DOCX indirildi.
5→8 geçişinde kalan bant kapasitesi yetersiz olduğu için üretim kapanır; 5’e dönüşte kalan üretim yine 1. Ayar değişimi geçmişi sıfırlamaz.
Sıfırlama onay penceresi açıldı ve iptal edildi; geçmiş korundu. Sıfırlama kabul edilmedi, tarayıcı geçmişi silinmedi.
Sonraki temiz tarayıcı oturumunda 8 soru: A’da 8, B’de 8, birleşik 16 farklı soru; her kitapçık 100 puan. Üretim sonrası 5’e geçiş tüketilmiş geçmişi açmadı.

## Gerçek DOCX kabulü

| Dosya | Bayt | Sayfa | SHA-256 |
| --- | ---: | ---: | --- |
| A öğrenci | 10916 | 2 | c8302d7c7525702e1a94fc33cef78c2ecb252912446c13414004efa1e7d33c00 |
| A öğretmen | 13792 | 4 | 045aac0fcadd9001309dc3489d61721aee09f9142e3689a0c66184ce34b6817f |
| B öğrenci | 10940 | 2 | ea526eeb7a0f145d41fbeb63090959731e9c96a96942d9a0c08a0a353e8e8f1b |
| B öğretmen | 13776 | 5 | e4b789a72baff14d49159d2623d785e115f306cd0cbed27a68c1f58f245f1b59 |

İndirilen dosyalar LibreOffice ile render edildi; 13 sayfanın tamamı PNG üzerinden gözle incelendi. Kesilme, taşma, bozuk karakter veya eksik tablo görülmedi. Uzun yanıt alanları mevcut. B öğretmen paketinde uzun yazma sorusu ilk sırada olduğundan başlık/belirtke sayfasından sonra metin ve sorular yeni sayfaya taşınır; bu nedenle A’dan bir sayfa uzundur.
Her kitapçıkta beş soru öğrenci–öğretmen dosyalarında birebir aynıdır. Soru puanları 100; beş cevap ve 15 ölçütün tam puanları toplamı 100. Öğrenci dosyasında cevap anahtarı yok. Öğretmen dosyasında cevaplar, belirtke ve soru-bileşen bağlı analiz tabloları tamdır.

## Doğrulama sınırları ve kalan işler

811/811 sözleşme, 923/923 tam test; tür kontrolü, build/Worker başarılı. Lint 0 hata, iki mevcut test uyarısı.
Bu kabul 5 soruluk standart DOCX dosyalarını kapsar; yeni 8 soruluk DOCX veya BEP dosyası görsel incelemesi olarak sunulmaz.
Bozuk geçmiş kurtarması yerel testte doğrulandı; canlıda bozuk kayıt enjekte edilmedi, sıfırlama kabulü denenmedi.
Banka sonludur: 11.4 için aynı düzeyde iki 5 soruluk A/B turu veya bir 8 soruluk A/B turu. Daha fazla farklı görev için içerik bankası gerekir; geçmiş sıfırlama önceki soruları tekrar açar.
İki sekmede atomik yazım ayrı düşük öncelikli iş olarak kalır. #195/#196 içerik dalları ve #197 bu paket kapsamında değiştirilmedi.
