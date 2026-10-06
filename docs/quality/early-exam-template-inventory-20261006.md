# 10. sınıf ilk iki ünite — Kesin görev yuvası envanteri

Tarih: 6 Ekim 2026
Kaynak commit: 50e567dfa2830fcd4ff909210d3d017aadab71de
Kaynak: `app/modules/exam-builder/philosophy-early-units-2026.ts`
Kaynak SHA-256: `151df9e45f40c98f8b16408f202ceb55d4e1190fd63eab6eb7cf8230c27967e6`

## Sonuç ve sayım ölçütü

Toplam **100 görev yuvasının 52'si genel soru kökünü aynen kullanıyor; 48'i bileşene özgü köke sahip.** #179'daki yaklaşık 47 kesin sayı değildir. Kapsam 10 süreç bileşeni × 5 bilişsel düzey × 2 görevdir. Bu sayı tek sınavdaki soru sayısı, kitapçık sayısı veya tüm FOPOS havuzunun toplamı değildir.

Başlangıçtaki 10 genel görev, bileşene özgü güncellemelerden önce yakalandı. Her son kök kendi başlangıç yuvasıyla tam eşleşme üzerinden karşılaştırıldı; yalnız ilk harfin Türkçe büyük harfe çevrilmesi normalleştirildi. Bileşen adını taşımayan ama sonucu hazır veren genel değerlendirme kökleri de sayıldı. Bu nedenle yalnız bileşen ifadesini aramak eksik sayar.

- Genel kök ve bileşen ifadesi taşıyan: 46.
- Bileşen ifadesi yerine hazır değerlendirme yargısı taşıyan genel kök: 6.
- Genel uygulama kökünde hazır örnek verilen: 6 (genel kök toplamının alt kümesi).
- Başlangıç anahtarını aynen kullanan yuva: 67.
- Başlangıç ölçüt etiketlerini aynen kullanan yuva: 60.

Anahtar/ölçüt sayıları genel kök sayısına eklenmez. Ortak etiket veya anahtar kullanımı tek başına içerik hatası kanıtı değildir. Bu çalışma şablon kökenini saptar; 52 yuvanın tamamını pedagojik olarak yanlış ilan etmez. Ayrıntılı anahtar ve ölçütler eşlik eden JSON'da tüm 100 yuva için kayıtlıdır. Bütün 100 yuva gerçek üreticide kendi düzeyinde üretildi; kök, bileşen ve düzey eşleşmesi ile 13 puanlık ölçüt toplamı doğrulandı. Kalan 52 yuva 26 tam düzey çifti oluşturuyor. Müfredat veya soru içeriği değiştirilmedi. Bileşen kodları mevcut 2026 runtime verisinden okundu; bu tur bağımsız PDF parite denetimi değildir.

## Bileşen ve düzey dağılımı

| Öğrenme çıktısı / bileşen | Odak | Anlama | Uygulama | Çözümleme | Değerlendirme | Oluşturma | Kalan |
|---|---|---:|---:|---:|---:|---:|---:|
| FEL.10.1.1 / a | felsefenin anlamı ve ortak tanımın imkânı | 0 | 0 | 0 | 0 | 0 | 0 |
| FEL.10.1.1 / b | felsefi düşüncenin özellikleri ve tarihsel gelişimi | 2 | 0 | 0 | 0 | 0 | 2 |
| FEL.10.1.1 / c | felsefi sorunun özellikleri ve felsefi soru sorma | 2 | 0 | 0 | 0 | 0 | 2 |
| FEL.10.1.1 / ç | felsefenin bilim, din ve sanatla ilişkisi | 2 | 2 | 0 | 2 | 2 | 8 |
| FEL.10.1.1 / d | felsefenin bireysel ve toplumsal işlevleri | 2 | 2 | 0 | 2 | 2 | 8 |
| FEL.10.2.1 / a | düşünme ve dil arasındaki nedensel ilişkiler | 2 | 2 | 0 | 0 | 2 | 6 |
| FEL.10.2.1 / b | düşünme ve dil ilişkisine yönelik uyumlu bir bütün oluşturma | 2 | 2 | 0 | 2 | 0 | 6 |
| FEL.10.2.2 / a | mantık ve argümantasyonun temel kavramları | 0 | 2 | 0 | 2 | 2 | 6 |
| FEL.10.2.2 / b | ifadeleri bağlamını koruyarak öncül ve sonuca ayırma | 2 | 0 | 0 | 2 | 2 | 6 |
| FEL.10.2.2 / c | ifadeleri anlamını değiştirmeden nesnel biçimde yeniden ifade etme | 2 | 2 | 0 | 2 | 2 | 8 |
| **Toplam** | | 16 | 12 | 0 | 12 | 12 | **52** |

## Kalan her yuvanın soru kökü

T0–T9, earlyUnitTasks dizisinin sıfır tabanlı yuva kimliğidir; kitapçık soru numarası değildir. Aynı düzeydeki (T0/T1, T2/T3, T4/T5, T6/T7, T8/T9) görevler potansiyel A/B çiftleridir. Gerçek ordinal, istenen düzeye göre yeniden sıralandığı için T numarasıyla eşit kabul edilmemelidir.

| Kimlik | Düzey | Görev / risk odağı | Soru kökü |
|---|---|---|---|
| FEL.10.1.1/b/T0 | Anlama | Genel bilgi/özet yönergesi | Metinde felsefi düşüncenin özellikleri ve tarihsel gelişimi hakkında verilen iki temel bilgiyi kendi cümlelerinizle açıklayınız. |
| FEL.10.1.1/b/T1 | Anlama | Genel bilgi/özet yönergesi | Metindeki felsefi düşüncenin özellikleri ve tarihsel gelişimi konusunu bir cümlede özetleyiniz; özeti destekleyen bir ifadeyi belirtiniz. |
| FEL.10.1.1/c/T0 | Anlama | Genel bilgi/özet yönergesi | Metinde felsefi sorunun özellikleri ve felsefi soru sorma hakkında verilen iki temel bilgiyi kendi cümlelerinizle açıklayınız. |
| FEL.10.1.1/c/T1 | Anlama | Genel bilgi/özet yönergesi | Metindeki felsefi sorunun özellikleri ve felsefi soru sorma konusunu bir cümlede özetleyiniz; özeti destekleyen bir ifadeyi belirtiniz. |
| FEL.10.1.1/ç/T0 | Anlama | Genel bilgi/özet yönergesi | Metinde felsefenin bilim, din ve sanatla ilişkisi hakkında verilen iki temel bilgiyi kendi cümlelerinizle açıklayınız. |
| FEL.10.1.1/ç/T1 | Anlama | Genel bilgi/özet yönergesi | Metindeki felsefenin bilim, din ve sanatla ilişkisi konusunu bir cümlede özetleyiniz; özeti destekleyen bir ifadeyi belirtiniz. |
| FEL.10.1.1/ç/T2 | Uygulama | Hazır örneği uygulama | Felsefenin bilim, din ve sanatla ilişkisi konusunu şu örneğe uygulayarak metinle bağlantısını açıklayınız: Bir eserin güzel sayılmasının dayanaklarını sormak sanatla ilişkili felsefi bir sorudur; resmi yapmakla aynı etkinlik değildir. |
| FEL.10.1.1/ç/T3 | Uygulama | Genel örnek yönergesi | Metindeki felsefenin bilim, din ve sanatla ilişkisi konusunu açıklayan farklı bir günlük yaşam örneği veriniz ve bağlantıyı belirtiniz. |
| FEL.10.1.1/ç/T6 | Değerlendirme | Hazır değerlendirme yargısı | “Felsefe bu alanların yerini almaz; onların dayanak, yöntem ve anlam iddialarını eleştirel olarak sorgular.” yargısını metindeki dayanakları ve sınırları açısından değerlendiriniz. |
| FEL.10.1.1/ç/T7 | Değerlendirme | Genel sonuç/genelleme yönergesi | Felsefenin bilim, din ve sanatla ilişkisi hakkında metnin izin verdiği sonuçla aşırı genellemeyi ayırarak gerekçeli bir değerlendirme yapınız. |
| FEL.10.1.1/ç/T8 | Oluşturma | Genel yeni ürün yönergesi | Felsefenin bilim, din ve sanatla ilişkisi konusunda yeni bir soru ve bu soruya gerekçeli bir yanıt oluşturunuz. |
| FEL.10.1.1/ç/T9 | Oluşturma | Genel yeni ürün yönergesi | Felsefenin bilim, din ve sanatla ilişkisi konusunu gösteren yeni bir kısa durum yazınız; durumun hangi ilişkiyi gösterdiğini açıklayınız. |
| FEL.10.1.1/d/T0 | Anlama | Genel bilgi/özet yönergesi | Metinde felsefenin bireysel ve toplumsal işlevleri hakkında verilen iki temel bilgiyi kendi cümlelerinizle açıklayınız. |
| FEL.10.1.1/d/T1 | Anlama | Genel bilgi/özet yönergesi | Metindeki felsefenin bireysel ve toplumsal işlevleri konusunu bir cümlede özetleyiniz; özeti destekleyen bir ifadeyi belirtiniz. |
| FEL.10.1.1/d/T2 | Uygulama | Hazır örneği uygulama | Felsefenin bireysel ve toplumsal işlevleri konusunu şu örneğe uygulayarak metinle bağlantısını açıklayınız: Sınıf kurallarının adil olup olmadığını gerekçeleriyle tartışmak hem bireysel yargıyı hem ortak yaşam kararını geliştirebilir. |
| FEL.10.1.1/d/T3 | Uygulama | Genel örnek yönergesi | Metindeki felsefenin bireysel ve toplumsal işlevleri konusunu açıklayan farklı bir günlük yaşam örneği veriniz ve bağlantıyı belirtiniz. |
| FEL.10.1.1/d/T6 | Değerlendirme | Hazır değerlendirme yargısı | “Felsefi sorgulama bireysel yargıyı ve toplumsal diyaloğu geliştirebilir; yararı hızlı uzlaşmayla ölçülmemelidir.” yargısını metindeki dayanakları ve sınırları açısından değerlendiriniz. |
| FEL.10.1.1/d/T7 | Değerlendirme | Genel sonuç/genelleme yönergesi | Felsefenin bireysel ve toplumsal işlevleri hakkında metnin izin verdiği sonuçla aşırı genellemeyi ayırarak gerekçeli bir değerlendirme yapınız. |
| FEL.10.1.1/d/T8 | Oluşturma | Genel yeni ürün yönergesi | Felsefenin bireysel ve toplumsal işlevleri konusunda yeni bir soru ve bu soruya gerekçeli bir yanıt oluşturunuz. |
| FEL.10.1.1/d/T9 | Oluşturma | Genel yeni ürün yönergesi | Felsefenin bireysel ve toplumsal işlevleri konusunu gösteren yeni bir kısa durum yazınız; durumun hangi ilişkiyi gösterdiğini açıklayınız. |
| FEL.10.2.1/a/T0 | Anlama | Genel bilgi/özet yönergesi | Metinde düşünme ve dil arasındaki nedensel ilişkiler hakkında verilen iki temel bilgiyi kendi cümlelerinizle açıklayınız. |
| FEL.10.2.1/a/T1 | Anlama | Genel bilgi/özet yönergesi | Metindeki düşünme ve dil arasındaki nedensel ilişkiler konusunu bir cümlede özetleyiniz; özeti destekleyen bir ifadeyi belirtiniz. |
| FEL.10.2.1/a/T2 | Uygulama | Hazır örneği uygulama | Düşünme ve dil arasındaki nedensel ilişkiler konusunu şu örneğe uygulayarak metinle bağlantısını açıklayınız: Adil ile eşit sözcüklerinin ayrımını öğrenen bir öğrenci, herkese aynı davranmanın her durumda adil olmayabileceğini daha açık ifade edebilir. |
| FEL.10.2.1/a/T3 | Uygulama | Genel örnek yönergesi | Metindeki düşünme ve dil arasındaki nedensel ilişkiler konusunu açıklayan farklı bir günlük yaşam örneği veriniz ve bağlantıyı belirtiniz. |
| FEL.10.2.1/a/T8 | Oluşturma | Genel yeni ürün yönergesi | Düşünme ve dil arasındaki nedensel ilişkiler konusunda yeni bir soru ve bu soruya gerekçeli bir yanıt oluşturunuz. |
| FEL.10.2.1/a/T9 | Oluşturma | Genel yeni ürün yönergesi | Düşünme ve dil arasındaki nedensel ilişkiler konusunu gösteren yeni bir kısa durum yazınız; durumun hangi ilişkiyi gösterdiğini açıklayınız. |
| FEL.10.2.1/b/T0 | Anlama | Genel bilgi/özet yönergesi | Metinde düşünme ve dil ilişkisine yönelik uyumlu bir bütün oluşturma hakkında verilen iki temel bilgiyi kendi cümlelerinizle açıklayınız. |
| FEL.10.2.1/b/T1 | Anlama | Genel bilgi/özet yönergesi | Metindeki düşünme ve dil ilişkisine yönelik uyumlu bir bütün oluşturma konusunu bir cümlede özetleyiniz; özeti destekleyen bir ifadeyi belirtiniz. |
| FEL.10.2.1/b/T2 | Uygulama | Hazır örneği uygulama | Düşünme ve dil ilişkisine yönelik uyumlu bir bütün oluşturma konusunu şu örneğe uygulayarak metinle bağlantısını açıklayınız: Bir öğrenci problemi önce çizimle tasarlar, sonra sözcüklerle açıklar ve arkadaşının sorusuyla çizimini düzeltir; ilişki tek yönlü değildir. |
| FEL.10.2.1/b/T3 | Uygulama | Genel örnek yönergesi | Metindeki düşünme ve dil ilişkisine yönelik uyumlu bir bütün oluşturma konusunu açıklayan farklı bir günlük yaşam örneği veriniz ve bağlantıyı belirtiniz. |
| FEL.10.2.1/b/T6 | Değerlendirme | Hazır değerlendirme yargısı | “Düşünme ve dil karşılıklı ilişkilidir: dil düşünceyi düzenleyip paylaşırken ifade etme çabası düşünceyi de değiştirebilir.” yargısını metindeki dayanakları ve sınırları açısından değerlendiriniz. |
| FEL.10.2.1/b/T7 | Değerlendirme | Genel sonuç/genelleme yönergesi | Düşünme ve dil ilişkisine yönelik uyumlu bir bütün oluşturma hakkında metnin izin verdiği sonuçla aşırı genellemeyi ayırarak gerekçeli bir değerlendirme yapınız. |
| FEL.10.2.2/a/T2 | Uygulama | Hazır örneği uygulama | Mantık ve argümantasyonun temel kavramları konusunu şu örneğe uygulayarak metinle bağlantısını açıklayınız: Bütün memeliler omurgalıdır; yunus memelidir; öyleyse yunus omurgalıdır. İlk iki yargı öncül, son yargı sonuçtur. |
| FEL.10.2.2/a/T3 | Uygulama | Genel örnek yönergesi | Metindeki mantık ve argümantasyonun temel kavramları konusunu açıklayan farklı bir günlük yaşam örneği veriniz ve bağlantıyı belirtiniz. |
| FEL.10.2.2/a/T6 | Değerlendirme | Hazır değerlendirme yargısı | “Argümanın değerlendirilmesinde öncül, sonuç, çıkarım ilişkisi ve tutarlılık ayrı ayrı incelenmelidir.” yargısını metindeki dayanakları ve sınırları açısından değerlendiriniz. |
| FEL.10.2.2/a/T7 | Değerlendirme | Genel sonuç/genelleme yönergesi | Mantık ve argümantasyonun temel kavramları hakkında metnin izin verdiği sonuçla aşırı genellemeyi ayırarak gerekçeli bir değerlendirme yapınız. |
| FEL.10.2.2/a/T8 | Oluşturma | Genel yeni ürün yönergesi | Mantık ve argümantasyonun temel kavramları konusunda yeni bir soru ve bu soruya gerekçeli bir yanıt oluşturunuz. |
| FEL.10.2.2/a/T9 | Oluşturma | Genel yeni ürün yönergesi | Mantık ve argümantasyonun temel kavramları konusunu gösteren yeni bir kısa durum yazınız; durumun hangi ilişkiyi gösterdiğini açıklayınız. |
| FEL.10.2.2/b/T0 | Anlama | Genel bilgi/özet yönergesi | Metinde ifadeleri bağlamını koruyarak öncül ve sonuca ayırma hakkında verilen iki temel bilgiyi kendi cümlelerinizle açıklayınız. |
| FEL.10.2.2/b/T1 | Anlama | Genel bilgi/özet yönergesi | Metindeki ifadeleri bağlamını koruyarak öncül ve sonuca ayırma konusunu bir cümlede özetleyiniz; özeti destekleyen bir ifadeyi belirtiniz. |
| FEL.10.2.2/b/T6 | Değerlendirme | Hazır değerlendirme yargısı | “Sonuç iki öncülden çıkar; zaman sınırlaması öncül ve sonuçta korunmalıdır.” yargısını metindeki dayanakları ve sınırları açısından değerlendiriniz. |
| FEL.10.2.2/b/T7 | Değerlendirme | Genel sonuç/genelleme yönergesi | İfadeleri bağlamını koruyarak öncül ve sonuca ayırma hakkında metnin izin verdiği sonuçla aşırı genellemeyi ayırarak gerekçeli bir değerlendirme yapınız. |
| FEL.10.2.2/b/T8 | Oluşturma | Genel yeni ürün yönergesi | İfadeleri bağlamını koruyarak öncül ve sonuca ayırma konusunda yeni bir soru ve bu soruya gerekçeli bir yanıt oluşturunuz. |
| FEL.10.2.2/b/T9 | Oluşturma | Genel yeni ürün yönergesi | İfadeleri bağlamını koruyarak öncül ve sonuca ayırma konusunu gösteren yeni bir kısa durum yazınız; durumun hangi ilişkiyi gösterdiğini açıklayınız. |
| FEL.10.2.2/c/T0 | Anlama | Genel bilgi/özet yönergesi | Metinde ifadeleri anlamını değiştirmeden nesnel biçimde yeniden ifade etme hakkında verilen iki temel bilgiyi kendi cümlelerinizle açıklayınız. |
| FEL.10.2.2/c/T1 | Anlama | Genel bilgi/özet yönergesi | Metindeki ifadeleri anlamını değiştirmeden nesnel biçimde yeniden ifade etme konusunu bir cümlede özetleyiniz; özeti destekleyen bir ifadeyi belirtiniz. |
| FEL.10.2.2/c/T2 | Uygulama | Hazır örneği uygulama | İfadeleri anlamını değiştirmeden nesnel biçimde yeniden ifade etme konusunu şu örneğe uygulayarak metinle bağlantısını açıklayınız: Cuma günkü etkinlik, yağışlı havada salonda, yağışsız havada bahçede gerçekleştirilecektir. |
| FEL.10.2.2/c/T3 | Uygulama | Genel örnek yönergesi | Metindeki ifadeleri anlamını değiştirmeden nesnel biçimde yeniden ifade etme konusunu açıklayan farklı bir günlük yaşam örneği veriniz ve bağlantıyı belirtiniz. |
| FEL.10.2.2/c/T6 | Değerlendirme | Hazır değerlendirme yargısı | “Yeniden ifade, koşulu, zamanı ve kapsamı korumalı; yorum veya yeni iddia eklememelidir.” yargısını metindeki dayanakları ve sınırları açısından değerlendiriniz. |
| FEL.10.2.2/c/T7 | Değerlendirme | Genel sonuç/genelleme yönergesi | İfadeleri anlamını değiştirmeden nesnel biçimde yeniden ifade etme hakkında metnin izin verdiği sonuçla aşırı genellemeyi ayırarak gerekçeli bir değerlendirme yapınız. |
| FEL.10.2.2/c/T8 | Oluşturma | Genel yeni ürün yönergesi | İfadeleri anlamını değiştirmeden nesnel biçimde yeniden ifade etme konusunda yeni bir soru ve bu soruya gerekçeli bir yanıt oluşturunuz. |
| FEL.10.2.2/c/T9 | Oluşturma | Genel yeni ürün yönergesi | İfadeleri anlamını değiştirmeden nesnel biçimde yeniden ifade etme konusunu gösteren yeni bir kısa durum yazınız; durumun hangi ilişkiyi gösterdiğini açıklayınız. |

## Sonraki paketin kapsamı

Öncelikle bilim–din–sanat ilişkisi, bireysel/toplumsal işlevler ve nesnel yeniden ifade bileşenlerinde sekizer; kalan altı bileşende toplam 28 genel yuva vardır. Toplam 26 potansiyel düzey çifti için yönerge–bilişsel işlem–anahtar–ölçüt birlikte incelenmelidir. Uygulamada verilen örneğin ilişkiyi önceden açıklayıp açıklamadığı ve değerlendirmede sonuç yargısının öğrenciye hazır verilip verilmediği öncelikli kontrol noktalarıdır. Anlama yönergelerinin açıklığı ve oluşturma görevlerinin ürününe özgü ölçütler ayrıca değerlendirilmelidir.

Tamamı bileşene özgü 48 kök bu şablon temizliği envanterinin dışındadır; bu sınıflandırma onların pedagojik kusursuzluğunu kanıtlamaz. Sınav Analiz Formu ve eski önermeler listesi bulguları ayrı kapsamda kalır. Bu envanter tek başına içerik geliştirmesi veya canlı dağıtım gerektirmez.
