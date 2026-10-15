# Ders programı kalıcı kayıt — 15 Ekim 2026

Başlangıç tasarımının A1/A4 menü ve görsel temeli, A2/A3 Bugün paneli, e-Okul liste aktarımı ve hesapta öğrenci kaydı tamamlandı. Bu aşama kullanıcının yeni kararıyla A3'teki tarayıcı depolamasını öğretmen hesabına bağlı kalıcı programa genişletir.

Program D1 teaching_timetables tablosunda kullanıcı + öğretim yılı anahtarıyla saklanır. Haftalık dersler, tek günlük dersler ve pedagojik kayıt/revizyon bağlantıları birlikte korunur. Öğrenci listesi tabloları değiştirilmez. Yeni şema geçişi yalnız yeni tablo ekler; mevcut tablolarda veri silmez veya dönüştürmez. Hesap dışa aktarımına program dahil edilir; hesap kapanışında silinir.

İlk hesap kaydı yoksa bu hesabın/yılın mevcut tarayıcı programı otomatik aktarılır. Misafir anahtarı başka hesaba taşınmaz. Hesapta kayıt varsa o açılır; cihazdaki farklı kopya korunur. Boşaltılmış programın revizyonu sıfıra dönmez, eski cihaz boşaltılan dersleri otomatik geri getiremez. Eşzamanlı yazma atomik revizyon koşuluyla 409 verir. Kaydetme ancak sunucu onayından sonra başarılı gösterilir. Başarısız değişikliğin cihaz kopyası pending alanında korunur. Cihaz yedeğini indir eylemi mevcut/yedek/bekleyen program kopyalarını JSON olarak verir; otomatik birleştirme yapılmaz.

Mevcut programın hesaba ilk aktarımı için öğretmen, programı girdiği tarayıcıda oturumunu açmalıdır. Bu çalışma öğretmenin tarayıcısındaki gerçek programa erişmez ve ilk aktarımın gerçekleştiğini iddia etmez.

Dört yeni davranış testi gerçek SQLite ile hesap/yıl ayrımı, ilk aktarım çakışması, iki cihaz yarışı, boş programın sürümü ve geçersiz veri reddini doğrular. TypeScript ve 862 sözleşme testi geçti. Görsel tarayıcı kabulü desteklenen kontrol becerisi bulunmadığından yapılamadı.

Sıradaki tasarım aşaması: Öğrenci Performansı modülündeki liste/analiz bağımlılıklarını ayırarak başlangıç A1 kararını tamamlamak; ardından B2'de iki uygulama arasında değişmeyen öğrenci kimliği ve güvenli CSV/JSON aktarımı. Ödev teslim bildirimi ve zümre/sınav analizi uyarıları, kalıcı kaynak verileri sağlandığında bağlanmalı; örnek uyarı üretilmemeli.
