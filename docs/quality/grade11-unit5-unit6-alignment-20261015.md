# 5–6. ünite içerik ve onay kapısı

Kaynak: `sources/curriculum-2026/philosophy-2026.pdf`, fiziksel PDF s. 70–71. FEL.11.6.2(a): “Hak ve özgürlüklerin hukuksal temellerini çözümler.” Resmî PDF metni doğrudan okunarak karşılaştırıldı; program metni değiştirilmedi.

## Değişiklik

Eski 40 görevin çoğu hukuk tartışmalarında öncül–sonuç çözümletiyordu. Yeni banka hakkın tanınması, yükümlü kurum, başvuru, inceleme ve giderim arasındaki bağı ölçer. Her görevde somut örnek anahtar ve göreve bağlı üç ölçüt bulunur. Beş düzeyde sekizer görev ve A/B kapasitesi korunur. Öğretmen zenginleştirmesi olan kurgusal metin, gerçek bir hukuk düzenlemesi gibi sunulmaz. Diğer dört bileşenin turnuva vakası korunur; pano göndermeleri düzeltilir.

Düzeltme yetkisi görev bankasına verilmiş öğretmen içerik onayı olarak kaydedilmez. FEL.11.5.1, FEL.11.5.2, FEL.11.6.1 ve FEL.11.6.2 inceleme üreticisinde erişilebilir; nihai üretim işlevi açık hata verir ve arayüzde bu kapsam için üretici etkinleşmez. 13 Ekim tarihli mevcut içerik onayı değiştirilmez.

## Doğrulama

- Sözleşmeler 825/825; derleme sonrası tam paket 937/937.
- Tür kontrolü ve Worker/hosting artifact doğrulaması başarılı.
- Lint sıfır hata; iki önceden mevcut kullanılmayan değişken uyarısı.
- 32 yerel DOCX: iki ünite × iki soru sayısı (5/8) × standart/BEP × A/B × öğrenci/öğretmen. Soru, metin, anahtar ve ölçüt OOXML eşleşmesi ile 100 puan toplamı ve öğrenci dosyasına anahtar sızmaması doğrulandı.
- 6. ünite standart A öğretmen dosyasının beş sayfası görsel incelendi. Kütüphane vakası ve hak güvencesi sorusu doğru bileşene bağlı; sayfalarda kesilme, taşma veya boş sayfa görülmedi.

## Sınırlar ve kalan kabul

Bu yerel inceleme, gerçek öğretmen hesabında canlı A/B kabulü değildir. 5–6. ünite görev bankalarının öğretmen içerik onayı henüz kaydedilmedi. İlgili içerikler nihai üretime açılmadan inceleme tamamlanmalıdır. Son doğrulanmış canlı sürüm 168; bu paketin dağıtım sonucu ayrıca kaydedilecektir.


## Canlı dağıtım ve onay kapısı kabulü

PR #210 başarılı CI (`38639155136`) ardından ana dala birleşti: `523f6b28212b7c5fb11ec2a36eb8c874939f8217`. Sites sürüm 169, dağıtım `appgdep_6acff1ffc4bc8191aa763399d8ce4878`, durum `succeeded`. Sites kaynak commit'i `17df2280eba1f265c1e433b1e41c47bfde11ece5`; GitHub ve Sites kaynak ağacı aynı: `eae0b75b6afcad8c6f83d2a49b219eb89b80c049`.

Gerçek öğretmen oturumunda 11. sınıf 6. ünite seçildi: içerik onayı uyarısı görünür, “Sınavı oluştur” kapalı. Ardından onaylı 4. ünite ile onay bekleyen 5. ünite birlikte seçildi: üretim yine kapalı, 5. ünite için içerik onayı uyarısı görünür. Bu testte soru üretimi/rezervasyonu ve öğretmen kaydı değiştirilmedi. 5–6. ünite A/B dosyaları canlıdan indirilmedi; görev bankası içerik onayı beklediği için bu kabul daha sonra yapılmalıdır.

Canlı kontrolde onay bekleyen çıktıların “hazır olmayan” listesinde boş görünmesi fark edildi. Takip düzeltmesi bu listeyi içerik onayı bekleyen çıktıları da gösterecek şekilde tamamlar; üretim kapısının davranışı değişmez. Sonraki dağıtım bu kayıt ve uyarı listesi düzeltmesini içerir.
