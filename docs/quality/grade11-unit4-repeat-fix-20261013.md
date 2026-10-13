# 11. sınıf 4. ünite soru tekrarı düzeltmesi

13 Ekim 2026 tarihinde canlı sürüm 165'ten indirilen A öğrenci kitapçığında öğretmen önceki soruların tekrarlandığını bildirdi. Bankada her süreç bileşeni ve bilişsel düzey için iki görev vardı; A/B çifti bunları tüketiyordu. Tur sayacı sayfa yeniden açıldığında sıfırlanıyordu. Ayrıca ikinci tur eklendiğinde B araması önceki turun görevine dönebiliyordu.

## Değişiklik

- FEL.11.4.1'in iki, FEL.11.4.2'nin üç bileşeninde, beş düzeyin her birine iki ek görev yazıldı: 50 yeni görev, her görev için ayrı örnek yanıt ve üç puanlama kanıtı. Banka toplamı 100 görevdir. İlk çift yeni görevlerden, ikinci çift önceki onaylı görevlerden oluşur. Yeni görevler öğretmen uyarlamasıdır; resmî metin veya düşünür alıntısı değildir. Yeni içeriklere ayrıca öğretmen onayı verilmiş gibi kayıt oluşturulmadı.
- Kaynak: `sources/curriculum-2026/philosophy-2026.pdf`, 62–63. sayfalar bu çalışmada doğrudan PDF'den okundu. Soru/problem açıklama, hayatla ilişki, argüman çözümleme, argüman oluşturma ve felsefi metin yazma ayrımları korunur. Bu ek banka programdaki bütün öğrenme-öğretme etkinliklerinin tamamlandığı iddiası değildir.
- Yalnız 4. ünite çıktılarının seçildiği kapsamda aynı düzey kapasitesi dört göreve çıkar. Başka bir çıktı içeren karma kapsamda en dar bankanın iki görev sınırı korunur. Beş bileşene birer soru verilen 5 soruluk belirtkede iki farklı A/B üretimi mümkündür. Daha yüksek soru sayısında tur bütçesi azalabilir.
- Felsefe B araması A'nın bulunduğu bandın sonrasından başlar; ikinci turun B'si ilk çiftin görevine dönmez.
- Üretim geçmişi tarayıcıda ders, veri sürümü, çıktı, soru sayısı, tür ve bilişsel düzeyden oluşan kapsam anahtarıyla tutulur. Okul, öğretmen, öğrenci ve cevap bilgisi saklanmaz. Sayfa yenileme ve modüle yeniden giriş aynı kapsamı başa döndürmez. Standart/BEP biçim değiştirme aynı bankayı yeniden tüketmez. Bozuk, okunamayan veya yazılamayan geçmişte üretim durur.

## Doğrulama

- Sözleşme testleri: 807/807. Tüm testler: 919/919.
- Tür kontrolü ve build başarılı; Worker hosting paketi doğrulandı. Lint: sıfır hata, önceki iki kullanılmayan değişken uyarısı.
- Gerçek UI üretim fonksiyonunu kullanan test aynı depolama kaydıyla sayfayı yeniden açar: iki A/B turunda 20 farklı soru, her kitapçıkta 100 puan, üçüncü turda kapasite hatası.
- Beş süreç bileşeni × beş düzey × dört varyantta soru ve anahtar farkı, gerçek düzey, bileşen izi ve puan toplamı doğrulandı.
- İki tur için 16 standart/BEP okuma destekli A/B öğrenci–öğretmen DOCX üretildi. Metin, soru, anahtar, ölçüt eşliği ve öğrenci dosyasına anahtar sızmaması doğrulandı.
- Yeni çiftin sekiz DOCX dosyası LibreOffice ile 27 sayfa olarak render edilip tüm sayfaları görsel olarak incelendi. Standart öğrenci A/B ikişer, öğretmen A/B dörder; BEP öğrenci A iki/B üç, öğretmen A/B beşer sayfadır. Boş ilk sayfa, taşma veya kesilme görülmedi. B BEP yazma sorusu ve 12 satırlık yanıt alanı üçüncü sayfada birlikte yer alır.

## Sınırlar ve teslim durumu

Tekrar koruması aynı tarayıcı ve aynı kapsam içindir. Tarayıcı verisini silmek veya başka cihaz kullanmak geçmişi taşımaz. Başka soru sayısı/tür/düzey seçimi ayrı kapsamdır; bu kapsamlar arasında bazı görevler ortak olabilir. Sınırsız yeni soru üretildiği iddiası yoktur. 3. üniteye ek görev yazılmadı; geçmiş koruması ortak üretim akışına uygulanır.

Yerel UI fonksiyon testi gerçek tarayıcı testi değildir. Bu çalışma sırasında canlıdan yeni DOCX indirilmedi; Microsoft Word yerel kabulü yapılmadı. Ek görevlerin öğretmen inceleme dosyaları hazırdır. Push, PR, birleştirme veya dağıtım bu raporla yapılmış sayılmaz; canlı sürüm 165 korunur. Açık #195/#196/#197 dalları değiştirilmedi.
