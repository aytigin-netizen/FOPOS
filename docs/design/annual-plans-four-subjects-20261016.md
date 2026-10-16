# Dört ders için yıllık plan — 16 Ekim 2026

## Kapsam

Yıllık plan ekranında Felsefe, Sosyoloji, Psikoloji ve Mantık ayrı ders seçimiyle açılır. Bu seçim, ders tasarım stüdyosunun etkin branşını değiştirmez. Bugün panelinin konu metni ve yıllık plan belgesi aynı `annualRows` üreticisinden gelir. Ders kartından açılan yıllık plan, dersin sınıfını ve okul türünü taşır. Öğrenci listeleri, program satırları ve mevcut plan bağlantıları değiştirilmez; veri tabanı geçişi yoktur.

## Kaynak ve dağılım

Sosyoloji mevcut kanonik 2026 paketini kullanır. Sosyoloji 1 (11) genel ortaöğretim ve sosyal bilimler lisesi; Sosyoloji 2 (12) yalnız sosyal bilimler lisesi kapsamındadır. Kaynak PDF s. 4'te ikinci dersin okul türü kısıtı, s. 10'da 68+4 saat dağılımı yer alır.

Psikoloji ve Mantık yalnız yıllık plan için kaynak kapsamı kazanır; ders/sınav/AI üretim adaptörü etkinleştirilmez. `sources/curriculum-2026/manifest.json` içindeki özgün PDF ve SHA-256 değerleri esas alınmıştır. Yeni JSON'lar kaynak PDF yolu, özeti ve ünite sayfalarını taşır. Kaynak manifestindeki `runtimePackageAvailable:false` değiştirilmemiştir.

| Ders | Ünite saatleri | Çıktı | Süreç bileşeni |
| --- | --- | --- | --- |
| Psikoloji | 10, 18, 20, 20 | 13 | 38 |
| Mantık | 10, 16, 16, 26 | 17 | 53 |

Her ders 34 ünite haftası / 68 saat ve 4 saat okul temelli planlamadır. Psikoloji s. 10 ve Mantık s. 9'daki okul temelli planlamanın meslek seçimi ve kariyer rehberliği odağı web, takvim ve DOCX'te korunur. Programlar sınıfa özgü kod içermediğinden 10–12. sınıf seçimi öğretmenin okul programındaki yerleşimidir; farklı resmî program sürümü veya sınıf kodu üretilmez. Bu durum ekran açıklamasında belirtilir.

Sosyoloji/Psikoloji/Mantık haftalık dağılımları resmî haftalık çerçeve olarak sunulmaz. Ünite süreleri ve kanonik çıktı sırası üzerinden öğretmen kontrolüne açık taslak dağılımdır. Taslak notu ekranda ve DOCX'te yer alır. Felsefenin mevcut haftalık çerçevesi değişmez. Ara tatil, yarıyıl tatili, planlama ve sosyal etkinlik haftaları ortak takvimden gelir.

Sosyal bilimler lisesinde Psikoloji/Mantık programlarındaki yıldızlı zorunlu zenginleştirme etkinlikleri, ünitelerin ilk haftasına öğretmen tarafından takvimi gözden geçirilecek görevler olarak eklenir. Sosyolojide her ünite için en az bir zenginleştirme seçme yükümlülüğü ve öneri kapsamı yer alır. Genel ortaöğretim planında bu etkinlikler zorunlu diye gösterilmez.

## Kayıt ve üretim sınırı

Psikoloji/Mantık için sunucu yalnız veri seti, sınıf, yıllık plan kimliği, yıl, toplam süre ve tüm çıktı kodları kaynakla eşleşen `ANNUAL_PLAN` kayıtlarını kabul eder. Kayıt etkin öğretim yılına bağlıdır. Belge izi yalnız `annual-plan` türünde kabul edilir; günlük plan, sınav ve zümre bu izinle açılamaz. Öğretmen takvim/içerik kontrolü, onay revizyonları ve hesap ayrımı korunur.

## Doğrulama

Yeni testler PDF kimliğini ve bütün çıktı/süreç/konu/TYMM metinlerini kaynakla karşılaştırır; iki okul türünde 10–12. sınıf için 68+4 saati, tüm çıktı ve bileşenlerin kapsanmasını, Bugün tarih eşleştirmesini ve tatilleri doğrular. İki dersin DOCX XML'inde aynı konu/çıktı/bileşen satırları, yatay sayfa, taslak notu ve kariyer odağı kontrol edilir. Yıllık plan dışına çıkan kayıt ve belge türleri reddedilir. Sosyoloji okul türü regresyonları korunur.

TypeScript tür kontrolü, üretim Worker derlemesi ve derleme sonrası 1003/1003 test başarılıdır.

Tarayıcı kontrol becerisi bulunmadığından canlı öğretmen oturumunda görsel kabul ve gerçek hesapla DOCX indirme bu oturumda yapılmadı.
