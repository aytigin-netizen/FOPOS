# E-Okul sınıf listesi — ayrı ad ve soyad desteği

## Düzeltme

E-Okul Crystal Reports XLS biçiminde başlık üstünde tanıtım satırları, birleştirilmiş hücrelerin bıraktığı boş sütunlar, ayrı Adı / Soyadı sütunları, aralarda boş satırlar ve sonda özetler bulunabilir. İlk tam başlık algılanır; tekrar eden sayfa başlıkları önceki öğrencileri dışlamaz. Öğrenci No, Adı ve Soyadı eşlemesi otomatik yapılır. Ad ve soyad birleştirilirken birden fazla ad ve Türkçe karakterler korunur.

Önizlemede birleşik veya ayrı ad-soyad düzeni seçilebilir; numara, ad ve soyad sütunları ile başlık satırı elle değiştirilebilir. Aynı sütunu farklı alanlara bağlamak ve eksik soyad sessizce kabul edilmez. Öğrenci Listeleri ve Sınav Analizi aynı eşleme işlevini kullanır. E-Okul Y1 toplamı analizde ayrı kontrol alanı olmaya devam eder; soru puanlarına dağıtılmaz. Liste oluşturma ekranı toplam puan seçimini göstermez.

Boş satırlar ve son sayısal öğrenci numarasından sonraki rapor özetleri dışlanır. Cinsiyet / pansiyon alanları öğrenci kaydına aktarılmaz. Mevcut dosya boyutu, kaynak sınırları, formül ve dış bağlantı kontrolleri korunmuştur. Dosya tarayıcıda okunur; mevcut oturum ve sınıf bağlamı politikası değişmemiştir.

## Doğrulama

Kullanıcının sağladığı gerçek XLS dosyasıyla salt okuma doğrulaması yapıldı: başlık 11. satır; numara 2., ad 5., soyad 9. sütunda. 15 öğrenci ve 15 tekil öğrenci numarası; tüm ad-soyadlar eksiksiz birleştirildi. Gerçek dosya ve kişisel kayıtlar depoya veya test fikstürlerine eklenmedi.

Kurgusal BIFF8 XLS fikstürü aynı başlık/sütun/boş satır/özet yapısını sınar. Elle eşleme, çoklu ad, Türkçe karakter, birleşik sütun desteği, tekrar eden başlık, eksik soyad/numara ve çakışan sütunlar ayrıca test edilir. Desteklenen tarayıcı kontrol becerisi bulunmadığından görsel tarayıcı kabulü yapılamadı.
