# FOPOS — Güncel Devir Kaydı

Tarih: 13 Ekim 2026

## Güncel kaynak

Başlangıç ana dalı: 1664009 (#201). Mevcut canlı sürüm kontrolü: 166.
#195/#196 içerik dalları ve #197 test dalı bu pakette değiştirilmedi.

## Sınav geçmişi düzeltmesi

4. ünite için temiz geçmişle 5 soru seçimi canlıda açıldı. Kullanıcının cihazındaki bozuk/tükenmiş kayıt doğrudan okunmadı; kesin cihaz nedeni iddia edilmez.
Otomatik 3+2 dağılım, 2+3 süreç bileşeninde iki bant tüketiyordu; yeni dağıtım ilk bileşen bandını doldurur.
Geçmiş artık soru sayısı/tür/düzeyden bağımsız çıktı bazında A/B bant tüketimini tutar. Kapsam daraltılması veya genişletilmesi geçmişi açmaz. Eski v1 kayıtları korunur ve bant sayısına çevrilerek okunur.
Sıfırlama seçili çıktılara uygulanır; açık tekrar uyarısı ve kullanıcı onayı gerektirir. Sıfırlanan çıktı eski kayıttan tekrar engellenmez; diğer çıktı geçmişi korunur.
Varyant kaydı olmayan eski sorunun tür/düzey düzenlemesi anlaşılır mesajla durur; soru korunur.

## Doğrulama

811/811 sözleşme, 923/923 tam test; tür kontrolü, build ve Worker doğrulaması başarılı. Lint: 0 hata, önceki iki test uyarısı.
Canlı düzeltme sonrası 5/8 soru üretimi ve gerçek A/B öğrenci–öğretmen DOCX görsel kabulü henüz yapılmadı; kabul bitmeden kapanış sayılmaz.
İki sekmede eşzamanlı localStorage yazımı için atomik kilitleme bu paketin dışında kalır.

## Tarihsel kayıt

6 Ekim devir kaydı: docs/quality/exam-closure-20261006.md. Müfredat yetkisi: AGENTS.md ve sources/curriculum-2026/manifest.json.
