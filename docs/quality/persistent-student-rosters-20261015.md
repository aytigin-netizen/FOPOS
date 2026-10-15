# Hesaba bağlı öğrenci listeleri — 15 Ekim 2026

Kullanıcı kalıcı öğrenci kaydını onayladı. Öğrenci Listeleri modülü artık her öğretmen hesabının etkin öğretim yılı ve sınıf çalışma alanı için bir listeyi sunucudaki D1 veri alanına kaydeder. Ders/şube/yıl ayrımı çalışma alanının değişmeyen kimliğinden gelir. Liste başka cihazdan ve yeni oturumdan yeniden okunabilir. Tarayıcı deposuna öğrenci verisi yazılmaz; genel öğretmen JSON dışa aktarımı öğrenci listelerini dışlamaya devam eder.

## Kullanım

Excel dosyasını seçin, sütun önizlemesini onaylayın, en alttaki **Öğrenci listesini kaydet** düğmesine basın. Önizleme ve alan düzenlemeleri bu düğmeden önce kalıcı değildir. Mevcut oturumdaki kaydedilmemiş liste önce taslak olarak korunur. Önceki sürümde açık sayfada kalmış listeler için yeni sürüm açılışında dosyanın bir kez yeniden yüklenip kaydedilmesi gerekir.

Numara/ad düzeltme, öğrenci ekleme ve listeden çıkarma aynı kaydetme düğmesiyle uygulanır. Tüm listeyi silmek ayrı onay ister ve sunucudaki ad/numara verilerini boşaltır. Analiz veya performans modülüne daha önce gönderilmiş oturum kopyaları ayrıca temizlenir; sınav puanları, sağlık ve BEP bilgileri kalıcı listeye eklenmez. Kaydedilen liste sayfa kapatıldığında korunur; kaydedilmemiş değişiklikler için ayrılış uyarısı sürer.

## Veri modeli ve korumalar

0014 şema geçişi `saved_student_rosters` tablosunu ekler: sınıf kimliği, hesap kimliği, liste adı, öğrencilerin izin verilen alanları, artan revizyon ve zaman damgaları. Her öğrencinin sunucuda üretilen kalıcı kimliği, numarası ve adı saklanır. Ad/numara düzeltmelerinde kimlik korunur; dosyadan yeniden içe aktarmada mevcut öğrenci numarasıyla kimlik eşlenir. İlerideki iki uygulama arası veri aktarımı bu paketin kapsamında değildir.

API doğrulanmış oturumdan hesap kimliğini alır; istemci hesap seçemez. Yazmalar aynı origin, sınıf sahipliği, etkin öğretim yılı ve arşiv kilidiyle sınırlıdır. Yazma sorgusu aynı SQL ifadesinde revizyon ve etkin sınıf koşulunu denetler. Eski ekran 409 alır ve taslağı korunur; güncel kaydı açmak açık taslak bırakma onayı ister. Silme, kişisel alanları boşaltan bir sürüm izi bırakır; böylece silme/yeniden ekleme sonrasında eski ekran aynı sürüme denk gelip kaydı ezemez. Sınıfın arşivlenmesi listeyi silmez. Hesap silme listeyi de kaldırır. Rapor, log veya Git deposuna gerçek öğrenci verisi eklenmez.

## Doğrulama

TypeScript, 854 sözleşme testi ve 966 testlik tam paket başarılı. Gerçek SQLite testleri yeni okuma, hesap/sınıf/yıl ayrımı, kimlik koruma, revizyon çakışması, silme sonrası eski ekran, yazma anında arşiv/yıl değişimi ve hesap silme kaskadını doğrular. Üretim Worker derlemesi başarılı. Desteklenen tarayıcı kontrol becerisi bulunmadığından oturum açılmış canlı UI ve farklı cihaz kabulü yapılamadı. Gerçek öğrenci listesi otomatik olarak sunucuya yüklenmedi; ilk kaydı öğretmen yeni Kaydet düğmesiyle yapar.
