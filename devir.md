# FOPOS — Güncel Devir Kaydı

Tarih: 13 Ekim 2026

## Güncel kaynak

PR #202 ana dalda: 2ba75bf. Canlı uygulama sürümü: 167; Sites kaynak commit’i: 3897485. Kaynak ağacı: 6f35ea9cdaf8f5b270e896e6b54c69cf83d4246f.
#195/#196 içerik dalları ve #197 test dalı bu pakette değiştirilmedi.

## Sınav geçmişi düzeltmesi

4. ünite için temiz geçmişle 5 soru seçimi canlıda açıldı. Kullanıcının cihazındaki bozuk/tükenmiş kayıt doğrudan okunmadı; kesin cihaz nedeni iddia edilmez.
Otomatik 3+2 dağılım, 2+3 süreç bileşeninde iki bant tüketiyordu; yeni dağıtım ilk bileşen bandını doldurur.
Geçmiş artık soru sayısı/tür/düzeyden bağımsız çıktı bazında A/B bant tüketimini tutar. Kapsam daraltılması veya genişletilmesi geçmişi açmaz. Eski v1 kayıtları korunur ve bant sayısına çevrilerek okunur.
Sıfırlama seçili çıktılara uygulanır; açık tekrar uyarısı ve kullanıcı onayı gerektirir. Sıfırlanan çıktı eski kayıttan tekrar engellenmez; diğer çıktı geçmişi korunur.
Varyant kaydı olmayan eski sorunun tür/düzey düzenlemesi anlaşılır mesajla durur; soru korunur.

## Doğrulama

811/811 sözleşme, 923/923 tam test; tür kontrolü, build ve Worker doğrulaması başarılı. Lint: 0 hata, önceki iki test uyarısı.
Canlı kabul tamamlandı: 5 ve 8 soruluk 11.4 A/B üretimi, her kitapçıkta 100 puan. Dört 5 soruluk gerçek DOCX, toplam 13 sayfa, görsel olarak incelendi; öğrenci–öğretmen soru eşleşmesi ve ölçüt puanları doğrulandı. Sıfırlama onay penceresi ve iptali canlıda, bozuk kayıt kurtarması yerel testte doğrulandı. Sıfırlama onayının canlıda kabul edilmesi denenmedi. Ayrıntılar: docs/quality/exam-history-live-acceptance-20261013.md.
İki sekmede eşzamanlı localStorage yazımı için atomik kilitleme bu paketin dışında kalır.

## Tarihsel kayıt

6 Ekim devir kaydı: docs/quality/exam-closure-20261006.md. Müfredat yetkisi: AGENTS.md ve sources/curriculum-2026/manifest.json.
