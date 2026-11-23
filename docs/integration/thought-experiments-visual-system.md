# Düşünce Deneyleri Laboratuvarı — Görsel Tasarım Eşleştirmesi

**Durum:** Öğretmen tarafından onaylandı  
**Kapsam:** Pilot katalogdaki sekiz deney için özgün görsel/şema sistemi  
**İlgili modül:** `app/modules/thought-experiments/`  
**Geliştirme dalı:** `feature/thought-experiments-visuals`

## Tasarım ilkesi

Görsel, dekorasyon olarak değil, felsefi problemi anlaşılır kılan pedagojik bir araç olarak kullanılacaktır. Sekiz deney tek tip görsel şablona zorlanmayacak; görsel biçimi problemin düşünsel yapısına göre seçilecektir. Görseller cevabı veya tek doğru yorumu önceden vermeyecek, öğrencinin soru sormasını ve gerekçe kurmasını destekleyecektir.

## Sekiz deneyin görsel eşleştirmesi

| Deney | Görsel türü | Görselin içeriği | Pedagojik odak |
|---|---|---|---|
| Wittgenstein'ın Kutu İçindeki Böceği | Kavramsal illüstrasyon | Birbirine benzeyen kapalı kutular; içeriklerin dışarıdan karşılaştırılamaması | Özel yaşantı, dil ve ortak anlam |
| Theseus'un Gemisi | Süreç şeması | Başlangıç gemisi → parçaların aşamalı değişimi → yenilenmiş gemi; eski parçalarla kurulan ikinci gemi | Özdeşlik, süreklilik ve değişim |
| Platon'un Mağara Alegorisi | Mekânsal kavram şeması | Mahkûmlar, gölgeler, ateş, mağara çıkışı ve güneş | Görünüş, gerçeklik ve bilgi |
| Tramvay İkilemi | Karar ağacı | Müdahale etme / etmeme seçenekleri ve her seçeneğin sonuçları | Sonuç, ödev ve sorumluluk |
| Routley'in Son İnsan Deneyi | Çevresel etik illüstrasyonu | Son insan ile insan dışı canlı yaşamı ve ekosistem | Doğanın insanlardan bağımsız değeri |
| Searle'ün Çin Odası | İşleyiş şeması | Sembol girdisi → kural kitabı/işlem → sembol çıktısı | Sözdizimi ile anlam arasındaki ayrım |
| Pascal'ın Bahsi | Olası sonuç matrisi / karar ağacı | İnanma ve inanmama seçenekleri ile varsayılan sonuçların ayrıştırılması | İnanç, pratik gerekçelendirme ve belirsizlik |
| Antigone: Yasa, Vicdan ve Adalet | Sahne illüstrasyonu | Antigone, Kreon ve defin buyruğu çevresindeki çatışma | Devlet buyruğu, vicdan ve yazılı olmayan normlar |

## Görsel içerik ve doğruluk sınırları

- Tramvay görseli, Foot'un 1967 tarihli tartışması ile Thomson'ın 1976'da geliştirdiği klasik tramvay problemi formülasyonunu tek bir tarihsel kaynakmış gibi göstermeyecektir.
- Mağara görseli, kaydın alegori niteliğini koruyacaktır; onu dar anlamda etik ikilem veya standart düşünce deneyi gibi etiketlemeyecektir.
- Theseus görselinde Plutarkhos'un aktardığı tahta yenileme anlatısı ile modern paradoksun eski parçalardan ikinci gemi kurma varyantı görsel akışta ayırt edilecektir.
- Son İnsan görseli yalnız ağaç kesmeye indirgenmeyecek; Routley'in örneğindeki insan dışı canlı yaşamını kapsayacaktır.
- Çin Odası görseli, sembollerin kurallara göre işlenmesini gösterecek; odadaki kişinin Çinceyi anladığı izlenimini vermeyecektir.
- Pascal matrisi Tanrı'nın varlığına ilişkin kanıt veya kesin olasılık hesabı olarak sunulmayacaktır; bahis argümanının pratik karar yapısını gösterecektir.
- Antigone görseli, modern doğal hukuk öğretisinin eksiksiz bir şeması gibi değil, tragedyadaki defin yükümlülüğü ile hükümdar buyruğu arasındaki çatışma olarak kurulacaktır.
- Kutu İçindeki Böcek görseli, Wittgenstein'ın örneğini somutlaştıracak; özel deneyimin önemsiz olduğu sonucunu resmetmeyecektir.

## Görsel sistem standartları

- Her deney için ayrı kompozisyon ve görsel metafor kullanılacaktır.
- Ana görsellerde öncelik 16:9 yatay kompozisyondur; süreç ve karar şemalarında içerik gerektirirse farklı oran kullanılabilir.
- FOPOS'un mevcut renk ve tipografi sistemiyle uyumlu, sade ve akademik bir görsel dil izlenecektir.
- Metin yoğunluğu görselin içinde düşük tutulacak; açıklama ve soru arayüzün HTML metni olarak sunulacaktır.
- Her görsel için Türkçe erişilebilir alt metin ve görselin anlattığını açıklayan kısa metinsel karşılık bulunacaktır.
- Görseller uygulama paketinde yerel statik varlık olarak sunulacak; çalışma anında harici görsel servisine bağımlılık oluşturulmayacaktır.
- Görseller yüklenemediğinde deney metni ve mevcut etkileşimler çalışmaya devam edecektir.
- Görseller özgün üretilecek veya açıkça yeniden kullanım hakkı bulunan kaynaklardan alınacaktır. Kaynak/lisans bilgisi varlık envanterinde tutulacaktır.

## Teknik entegrasyon yaklaşımı

- Mevcut sekiz deneyin metinleri, sınıf düzeyleri, müfredat bağlantıları ve etkileşim davranışları değiştirilmez.
- `ThoughtExperiment` tipine geriye dönük uyumlu, isteğe bağlı görsel tanımı eklenir.
- Görsel sunumu ayrı, yeniden kullanılabilir bir bileşende tutulur.
- Katalog kartı, deney ayrıntısı ve sunum görünümünde görselin boyutu/yerleşimi bağlama göre uyarlanır.
- Görsel bileşeni erişilebilir alt metin, boyut kısıtları ve yükleme hatası geri dönüşünü destekler.
- Testler sekiz kaydın görsel tanımını, doğru deneyle eşleşmesini, alt metin varlığını, bozuk/eksik görsel geri dönüşünü ve mevcut içerik sözleşmelerinin korunmasını doğrular.

## Kabul ölçütleri

1. Sekiz deneyin her biri onaylı görsel türüyle eşleşir.
2. Görseller felsefi içeriği çarpıtmaz ve tarihsel kaynakları yanlış atfetmez.
3. Görseller mobil, masaüstü ve projeksiyon görünümünde kullanılabilir.
4. Klavye ve ekran okuyucu kullanıcıları görselin pedagojik içeriğine erişebilir.
5. Görsel yükleme hatası modülün çalışmasını engellemez.
6. Öğrenci yanıtları veya kişisel veriler görsel servisine gönderilmez.
7. Mevcut katalog, müfredat doğrulama, geçici etkileşim ve sunum davranışları korunur.
8. CI kalite kapıları geçmeden PR incelemeye hazır kabul edilmez.
