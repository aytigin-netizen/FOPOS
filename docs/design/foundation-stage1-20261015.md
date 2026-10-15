# FOPOS tasarım temeli — 15 Ekim 2026

İlk aşama: ortak renk değişkenleri, uygulamada barındırılan Newsreader / Source Sans 3, gruplu menü, 900px ve altında kapalı başlayan çekmece menü. Menü Escape ile kapanır; gizli mobil menü klavye odağı almaz. Dış uygulama bağlantısı menüde ve mevcut ana sayfa kartında aynı adla gösterilir: Ödev ve Değerlendirme. Her yüzeyde tek bağlantı bulunur.

Gizlilik Merkezi ve Kayıt Arşivi, Ayarlar üzerinden açılır; geri dönüş düğmesi ve etkin Ayarlar işareti vardır. Sürüm bilgisi Ayarlar > Hakkında bölümünde gösterilir. Hazır olmayan hızlı erişimler gizlenir.

Öğrenci Performansı korunmuştur: Öğrenci Listeleri ve Sınav Analizi bu modüle öğrenci listesi aktarır. Veri kaybı ve aktarım yollarının bozulmaması için kaldırılması ayrı bir geçiş gerektirir. Sınav Analizi mevcut sonuç / öğrenme çıktısı raporlama işlevleriyle uyumludur; adı korunmuştur.

Bugün paneli, program formu ve iki uygulama arasında öğrenci kimliği aktarımı bu aşamanın kapsamı dışındadır. Veri alanı ve veri tabanı geçişi eklenmemiştir; geriye dönük öğrenci eşleştirmesi yapılmamıştır.

Doğrulama: TypeScript, 832 sözleşme testi, üretim Worker derlemesi ve sunucu HTML testi başarılı. Görsel tarayıcı kabulü, desteklenen tarayıcı kontrol becerisi ortamda bulunmadığı için yapılamadı.
