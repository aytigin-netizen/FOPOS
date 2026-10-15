# Bugün paneli — 15 Ekim 2026

Ana sayfadaki hero, modül ızgarası, hızlı erişimler ve sürüm notları yerine Bugün paneli kuruldu. İstanbul saatine göre tarih ve selamlama, bugünkü dersler, gerçek ders hazırlıklarından üretilen dikkat kartları, ders tasarım bandı ve dört sade araç bağlantısı bulunur. Bildirim rozeti bekleyen bugünkü ders sayısından gelir; örnek bildirim yoktur.

## Program ve veri sınırı

Haftalık program eklenebilir, düzenlenebilir, silinebilir; tek güne ders eklenebilir. Form alanları: gün, saat, sınıf, şube, ders, okul türü; isteğe bağlı ünite ve ünite haftası. Aynı saat çakışması haftalık ve tek günlük satırlar arasında da engellenir. Ünite/hafta otomatik yıllık plan tahmini değildir; öğretmen seçimidir.

Program, tarayıcıda `fopos:timetable:v1:<hesap>:<öğretim-yılı>` anahtarıyla saklanır. Diğer cihazlara eşitlenmez. Misafir programı ayrı anahtar kullanır. Öğrenci listesi, BEP, puan ve serbest not bu yapıya eklenmez. Bozuk kayıt otomatik üzerine yazılmaz; depolama hataları görünürdür. Veritabanı veya arka uç eklenmedi.

## Ders ve plan eşleştirmesi

Programdan Tasarla ile açılan ders, plan kaydedilince ders kimliği + tarih + kayıt kimliği + revizyon ile bağlanır. Aynı üniteye ait bir planın varlığı tek başına Hazır sayılmaz. Yalnız öğretmen onaylı, aynı branş/sınıf ve güncel veri setine ait bağlı revizyon Hazır gösterilir. Hesap kayıtları mevcut kimlik doğrulamalı API'den okunur. API yalnız son 200 revizyonu döndürür; bu aralık dışındaki bağlantılar doğrulanamadı olarak kalır. Eski kayıtlar silinmez.

Mevcut plan kaydı tam çalışma ekranını değil, pedagojik seçimleri saklar. Bu nedenle yeniden açılan eski kayıtta seçimler forma yüklenir ve yeniden üretim gerektiği açıkça bildirilir. Oturumda mevcut tam çalışma varsa korunur. Yeniden üretim eski onaylı kaydı değiştirmez.

Ödev uygulamasıyla teslim tarihi/veri entegrasyonu ve kalıcı sınav analizi/zümre takvimi bu aşamada bulunmadığından bu uyarılar uydurulmaz. Dikkat kartları bugünkü gerçek ders hazırlıklarını gösterir.

## Doğrulama

TypeScript, 840 sözleşme testi, 952 testlik tam paket ve üretim Worker derlemesi başarılı. Yeni testler gün sınırı, hesap/yıl ayrımı, ders çakışması, program doğrulaması, alan izin listesi ve açık kayıt eşleştirmesini kapsar. Desteklenen tarayıcı kontrol becerisi bulunmadığı için görsel tarayıcı kabulü yapılamadı.
