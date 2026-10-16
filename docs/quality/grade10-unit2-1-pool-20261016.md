# FEL.10.2.1 — soru havuzu içerik incelemesi

## Durum ve kaynak

16 Ekim 2026. #231 taslağı, #232 sonrasındaki `main` (b9af1e3) üzerine ayrı inceleme dalına alındı; başka yazarın açık dalı değiştirilmedi. İnceleme sonunda #233 açıldı. Aytekin YILMAZ, 16 Ekim 2026 saat 10.10 (Türkiye) tarihinde, düzeltilmiş 60 yeni soru ve 180 ölçüt için sorulan içerik onayına “Onaylıyorum” yanıtını verdi. Öğretmen içerik onayı bu açık yanıta dayanır. Birleştirme ve canlı dağıtım yetkilidir; dağıtım sonucu PR kapanışına ayrıca kaydedilecektir.

Tek resmî kaynak: `sources/curriculum-2026/philosophy-2026.pdf`, SHA-256 `fb2e941aba266f5b6ae6f479e1ad5d299cc6108ddf0ee78b39d055275eba2199`, s. 18–21. Ünitenin resmî adı **Felsefe, Mantık ve Argümantasyon**; Düşünme ve Dil İlişkisi, içerik çerçevesidir. FEL.10.2.1: “Düşünme ve dil ilişkisini yapılandırabilme”; a: nedensel ilişkiler ortaya koyma, b: ilişkilerden uyumlu bütün oluşturma. Program tanımların tartışılmasını, nedensel ilişkilere ilişkin tahminleri ve yargıların değerlendirilmesini ister; belirli bir dil–düşünce öğretisini tek doğru ilan etmez.

Senaryolar kurgusal öğretmen zenginleştirmesidir. Bilimsel araştırma, düşünür alıntısı veya resmî program cümlesi olarak sunulmaz.

## İnceleme bulguları ve düzeltmeler

| Bulgu | Düzeltme |
| --- | --- |
| Sözcük ayrımı ve şemayı yazma, ikisi de dilden düşünceye etkiyken karşılıklılık kanıtı sayılıyordu. | Ortak şema metninde düşüncede fark edilen ayrımın cümle seçimini yönlendirmesi açıkça verildi; cümle kurmanın şemayı değiştirmesiyle ters yön ayrı gösterildi. İki yön gösterilmeyen sorularda karşılıklılık sonucu çıkarılmıyor. |
| Söze dökmeme, bütünüyle dilden bağımsızlık diye okunuyordu. | Dışarıya söylememe, içinden dil kullanmama ve dilin bütününden bağımsızlık ayrıldı; düşünme tanımına ilişkin gerekçeli itirazlar korundu. |
| Şemanın belirli cümlelerden önce bulunması, düşüncenin tüm dilden önce varlığı sayılıyordu. | Belirli ifade öncesi ile bütün dilsel süreçlerden bağımsızlık ayrıldı. |
| Turuncu sözcüğünü bilmemenin etkisi portakal–elma ayrımıyla sınanıyordu. | Aynı biçim ve büyüklükte kırmızı–turuncu kartları ayırma durumu tasarlandı; renk ile nesne türü ayrımı karıştırılmıyor. |
| Düzey başına ortak ölçütler, görüşü açıklatan soruda bile sınırlı yargı veya tek belirleyiciyi reddetme istiyordu. | 60 yeni görev için 180 göreve özgü ölçüt yazıldı. Görüşü açıklatma, eleştirme ve ürün oluşturma görevleri kendi yönergelerine göre puanlanır. |
| Yazarken değişimden doğrudan dilsel nedensellik, sözcüksüz işlemden düşünceden dile etki çıkarılıyordu. | Birlikte görülme–neden olma ve etki yönü ayrımları düzeltildi. Gerekçeli alternatif değerlendirmeler kabul ediliyor. |
| İki yönü istenen ürünlerin anahtarında aynı yönde iki örnek vardı. | Bir örnek dilsel ayrımın düşünceyi düzenlemesini, diğeri yeni düşüncenin ifade seçimini yönlendirmesini gösteriyor. |

İlk 10 görevin her bileşendeki düzeyleri ve konumları korunur; bunların dayandığı ortak metin ve ondan türeyen bazı yanıtlar iki yönü açıklaştırmak için güncellenmiştir. “Eski metinlerin tümü birebir aynı” iddiası yapılmaz. Çıktı, bileşen, ordinal ve geçmiş veri şeması değiştirilmez.

## Öğretmen incelemesi için örnekler

1. **Karşılıklı etki:** Şemada düşünülen ayrım cümle seçimini yönlendirir; cümle kurarken fark edilen eksik şemayı değiştirir. İki etki yönü ayrı gerekçelendirilir.
2. **Özdeşlik:** Etkileşim, dil ile düşüncenin özdeş olduğunu kanıtlamaz; özdeş olmadıklarını da tek başına kanıtlamaz. Her iki görüş ek kavramsal gerekçe ister.
3. **Dil olmadan düşünme:** Sözcüksüz zihinde döndürme bir kurgusal karşı örnek olabilir; düşünmenin tanımı ve olayda varsayılan sözcüksüzlük belirtilmelidir. Kurgusal örnek deneysel kanıt sayılmaz.
4. **Puanlama:** “Düşünce önce gelir, dil yalnız onu taşır” görüşünü açıklatan soruda görüşün kabulü, gündelik örnek ve örnek–görüş bağı puanlanır; öğrenci yalnız bu görüşü açıkladığı için “tek belirleyiciyi reddetmedi” diye puan kaybetmez.
5. **Genelleme:** Sözcük bilgisiyle yüksek notun birlikte görülmesi, sözcük öğretmenin notu mutlaka yükselteceğini göstermez. Katkı ayrıca sınanacak olasılıktır.

60 sorunun tamamı, yanıtları ve puanlama ölçütleri `app/modules/exam-builder/philosophy-grade10-unit2-pool-2026.ts` dosyasında sırayla yer alır.

## Kapasite ve kapsam

Her bileşende 40 görev; beş düzeyin her birinde 8 görev bulunur (mevcut 2 + yeni 6). İki bileşende toplam 80 görev. Üreticinin döndürdüğü 8, varyant bant bütçesidir; aynı bileşen/düzeyde 8 ayrı A/B çifti anlamına gelmez: her A/B iki farklı görev tüketir, bu kapsamda 4 ayrık eşleşme vardır. Gerçek sınav sayısı seçilen kapsam ve dağılıma bağlıdır. FEL.10.2.2 ile karışık seçimde en dar çıktı bütçeyi 2 ile sınırlar. FEL.10.2.2 ve FEL.10.1.1 havuz genişletmeleri bu pakette yoktur.

Hesap üretim geçmişi ve önceki A/B tüketimi korunur; sıfırlama eklenmez. Mevcut öğrenci veya ders programı tablolarına geçiş/yazma yapılmaz.

## Doğrulama

İlk hedefli kontrol: tür denetimi ve 33 test başarılı. Ardından yönerge dışı puanlama, iki etki yönünün dayanakları, belirli ifade/tüm dil ayrımı ve renk görevi için üç davranış regresyonu eklendi. Düzey başına görev sayısı, benzersizlik, 8 varyantın üretimi, A/B dışlama/tükenme ve puan toplamı mevcut kapasite testleriyle sınanır. Tür denetimi temiz; üretim Worker derlemesi ve tam paket 1012/1012 başarılı.

Canlı öğretmen hesabından yeni A/B DOCX indirme ve görsel kabul bu inceleme değildir; içerik onayı ve dağıtım sonrasında yapılır.
