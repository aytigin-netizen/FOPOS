# 11. sınıf 3 ve 4. ünite düzeltme ve belge kabulü

13 Ekim 2026. Dal: `fix/grade11-unit3-unit4-curriculum-alignment`.

## Tamamlanan düzeltmeler

- #192: FEL.11.3.2 için gündelik vakadan ayrı tarihsel okuma ve 30 görev hazırlandı. Augustinus, Gazali ve Kierkegaard'ın anlatıcısı; dönem, gelenek, akıl–inanç–gönül ayrımlarıyla karşılaştırılır. FEL.11.3.1'in önceki onaylı gündelik vakası korunur.
- #194: Edebî unsurlara felsefi bakış ile edebî dille felsefe yapma ayrı ölçülür. Özgün Eşik hikâyesi üzerine kavram, soru ve argüman çözümlemesi beş süreç bileşenine ve beş bilişsel düzeye bağlandı. Karakter, okur ve yazar birbirine eşitlenmez.
- Geçmişteki dayanaksız “Aytekin tarafından onaylandı” notu düzeltildi. Yeni FEL.11.3.2, FEL.11.4.1 ve FEL.11.4.2 kayıtları üretim kaydında bulunmaz; ayrı inceleme üreticisiyle doğrulanır. Doğrudan üretim çağrısı da onay bekleyen kayıtları reddeder. FEL.11.3.1 üretimde kalır.
- Uzun yanıt biçimi üreticiden dışa aktarıma taşınır. En az 8 cümle isteyen görevler 12 tam genişlikte satır kullanır; daha yüksek cümle sayısı alanı genişletir. Eski kayıtta biçim alanı yoksa açık yönerge de dikkate alınır. Görsel BEP profilinde satır yüksekliği artırılır.
- Uzun BEP okuma metni tek paragraf/sonrakiyle tut zinciriyle ikinci sayfaya itilmez. Metin paragraflar hâlinde akabilir; son bölüm ilk soruyla birlikte kalır. Başlık ve öğrenci bilgileriyle kalan boş ilk sayfa giderildi.
- Okuma uyarlaması `S. Kierkegaard`, `19. yüzyıl` ve `11–12. yüzyıl` ifadelerini cümle sınırı saymaz; içerik korunur.

## Kaynak ve kapsam

Tek resmî müfredat: `sources/curriculum-2026/philosophy-2026.pdf`. 59–60. sayfalar akıl–inanç ilişkisi; 62–63. sayfalar edebiyat–felsefe ilişkisi. PDF'nin ilgili sayfaları metin ve görüntü üzerinden okundu.

Üç tarihsel kısa alıntı İngilizce birincil eser çevirilerinden Türkçeye çevrildi; eşlik eden bilgi notları öğretmen uyarlamasıdır. Programın bütün düşünürlerini öğreten bir materyal veya MEB soru bankası iddiası yoktur. Sınav örnekleri programdaki karşılaştırma ve argüman işlemlerini seçilmiş metinlerle ölçer.

| Düşünür | Eser ve bölüm | Birincil eser çevirisi |
|---|---|---|
| Augustinus | Vaaz 89, bölüm 1 | https://www.newadvent.org/fathers/160389.htm |
| Gazali | el-Munkız mine'd-Dalâl, şüpheden kurtuluş | https://www.ghazali.org/books/md/IIA-02main.htm |
| S. Kierkegaard | Korku ve Titreme, birinci problem; Johannes de silentio anlatıcısı | https://www.religion-online.org/book-chapter/chapter-3-problem-one-is-there-such-a-thing-as-a-teleological-suspension-of-the-ethical/ |

Eşik hikâyesi özgün öğretmen örneğidir; bir edebî eserden veya ders kitabından alıntı olarak etiketlenmez.

## Doğrulama

- Tür kontrolü başarılı; lint sıfır hata, iki mevcut uyarı.
- Build ve Worker/hosting artifact doğrulaması başarılı.
- Sözleşme testleri 804/804; derleme sonrası bütün testler 916/916.
- Onay bekleyen üç çıktı için normal üretim ve karışık kapsam kapalıdır; inceleme A/B çiftleri her süreç bileşeni ve beş düzey için ayrı doğrulanır.
- `scripts/render-grade11-content-review.mjs`, iki ünite × standart/BEP okuma × A/B × öğrenci/öğretmen = 16 gerçek DOCX üretir. Beş soru × 20 puan = 100 puan; metin, soru, cevap ve ölçüt eşleşmesi XML'de doğrulanır. Öğrenci dosyasına anahtar veya öğretmen süreç bileşeni sızmaz.
- Standart dosyaların 27 sayfası ve düzeltilen BEP dosyalarının 28 sayfası görüntü olarak incelendi. Başlık, okuma metni, soru–cevap alanı, anahtar ve analiz tabloları görünür; taşma veya kırpılma görülmedi. BEP dosyalarında başlıkla kalan boş ilk sayfa yoktur.

| Ünite ve mod | A öğrenci | B öğrenci | A öğretmen | B öğretmen |
|---|---:|---:|---:|---:|
| 3 standart | 2 | 2 | 5 | 5 |
| 4 standart | 2 | 2 | 5 | 4 |
| 3 BEP okuma | 2 | 2 | 5 | 5 |
| 4 BEP okuma | 2 | 2 | 5 | 5 |

Görsel kabul, yerelde gerçek uygulama üreticisinden alınan DOCX'in LibreOffice ile render edilmesidir. Canlı tarayıcıdan indirme veya Microsoft Word cihaz kabulü olarak sunulmaz. BEP görsel kabul matrisi okuma profilidir; diğer profillerin XML/üretim regresyonları testlerde bulunur.

## Açık kapılar

Yeni tarihsel okuma ve Eşik görevlerinin öğretmen içerik onayı, ana dala birleştirme ve canlı dağıtım ayrı durumlardır. Bu kayıt öğretmen onayı veya dağıtım yapılmış gibi yorumlanamaz. #195, #196 ve #197'nin açık dalları değiştirilmedi; #198 kontrast bulgusu bu paketin kapsamı dışındadır.
