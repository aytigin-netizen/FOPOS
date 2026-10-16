# FOPOS — Güncel düzeltme durumu

## 16 Ekim 2026 — havuz tükenince açık yeniden kullanım

Aytekin, Hukuk ve Felsefe sınavında soru havuzu bitince de üretim yapabilmeyi istedi. Kullanılmamış bant yoksa “Önceki sorularla sınav oluştur” eylemi açılır. Eski tekrarsız geçmiş silinmez; yeniden kullanım ayrı atomik sayaçla kaydedilir. A/B iç farklılığı, puanlar, onay ve kapsam doğrulaması korunur. Öğrenci/program tabloları değişmez. Ayrıntı: `docs/quality/exam-exhausted-reuse-20261016.md`.

## 16 Ekim 2026 — FEL.10.2.1 öğretmen içerik onayı

#231, #232 sonrası main üzerine ayrı dalda incelendi. Karşılıklı etki yönleri, söze dökmeme/dilsel bağımsızlık, belirli ifade/tüm dil ayrımı, renk görevi ve 60 yeni sorunun göreve özgü ölçütleri düzeltildi. Aytekin YILMAZ, #233 düzeltmelerini 16 Ekim 2026 saat 10.10 (Türkiye) tarihinde açıkça onayladı. Birleştirme ve canlı dağıtım aşamasına geçilir; sonuç PR kapanışında ayrıca doğrulanacaktır. Ayrıntı ve öğretmen örnekleri: `docs/quality/grade10-unit2-1-pool-20261016.md`. Öğrenci/program verisi ve üretim geçmişi korunur.

## 16 Ekim 2026 — Sosyoloji, Psikoloji ve Mantık yıllık planları

Yıllık plan ekranında dört ders seçilebilir. Psikoloji (4 ünite, 13 çıktı, 38 süreç bileşeni) ve Mantık (4 ünite, 17 çıktı, 53 süreç bileşeni) 2026 PDF'lerinden yıllık plana özgü kapsam kazanır. Her biri 68+4 saattir; kariyer rehberliği odağı korunur. Sosyoloji okul türü kısıtları doğrulandı. Bugün paneli ortak yıllık plan kaynağından konu okur; ders kartı sınıf/okul türünü yıllık plana taşır. Program ve öğrenci kayıtları değiştirilmez. Psikoloji/Mantık günlük plan ve sınav üretimi henüz etkin değildir. Haftalık dağılım öğretmen kontrolüne açık taslaktır. Kaynak, izin ve doğrulama ayrıntıları: `docs/design/annual-plans-four-subjects-20261016.md`.

Aşağıdaki kayıtlar kendi tarihlerindeki durumu yansıtır.

## 15 Ekim 2026 — ortak metin ve kitapçık yerleşimi

Ana dal `3b09f4e` üzerinden hazırlanan düzeltme, aynı metne bağlı fakat ayrı sıralarda duran soruları ilk görünme sırasını koruyarak birlikte gösterir. Ekran, öğrenci/öğretmen DOCX, anahtar ve analiz tablosu aynı sıra üzerinden numaralanır. Soru kimlikleri, puanlar, A/B kaynak bağı ve üretim geçmişi korunur. Farklı ünite veya puntoya ait metinler birleştirilmez.

Gönderilen 8 soruluk 11. sınıf 6. ünite öğrenci/öğretmen dosyalarında 8/8 soru ve puan eşleşti, toplam 100. Aynı soru setinin yerel yeniden üretiminde öğrenci kitapçığı 3 sayfadan 2 sayfaya indi; font ve cevap alanları azaltılmadı. Öğretmen paketinde 6 sayfa görsel incelendi. 4. sorunun puanlamasında yönergede istenmeyen örnek zorunluluğu kaldırıldı. Sözleşmeler 828/828, derleme sonrası tam paket 940/940; typecheck ve Worker build başarılı, lint sıfır hata ve iki mevcut uyarı. Canlı dağıtım sonucu ayrıca doğrulanacaktır. Ayrıntı: `docs/quality/exam-shared-passage-layout-20261015.md`.


## 15 Ekim 2026 — 5–6. ünite görev bankası öğretmen onayı

Aytekin YILMAZ, “Şu anda sınav oluşturma kapalı. İçerikleri onaylıyorum.” talimatıyla FEL.11.5.1, FEL.11.5.2, FEL.11.6.1 ve FEL.11.6.2 görev bankalarını açıkça onayladı. Yeni onay ayrı tarihli kayıt olarak eklendi; 13 Ekim onayı korunur. Bekleyen içerik listesi boşaltıldı; nihai sınav üretimi ve onaylı ünitelerle karışık kapsam yeniden açılır. Soru, cevap anahtarı, ölçüt ve hesap üretim geçmişi değiştirilmedi. Aşağıdaki onay bekleme kayıtları tarihseldir.


## 15 Ekim 2026 — 5–6. ünite içerik ve onay kapısı düzeltmesi

Ana dal `b812815` (#209) üzerinden ayrı düzeltme dalında hazırlandı. FEL.11.6.2(a) için genel argüman çözümleme bankası yerine hak ve özgürlüklerin hukuksal güvencelerini ölçen 40 özgün soru–anahtar–puanlama üçlüsü eklendi. Her düzeyde sekiz görev korunur. Ayrı kurgusal kütüphane metni hakkın tanınmasını, kurumun sorumluluğunu, erişilebilir başvuruyu, tarafsız incelemeyi ve uygulanabilir giderimi birlikte sunar. Materyal resmî metin veya yürürlükteki hukuk düzenlemesi olarak sunulmaz. 6. ünite havuzundaki pano göndermeleri öğrenci meclisi bağlamıyla düzeltildi.

5–6. ünite görev bankaları için açık öğretmen içerik onayı kaydı yoktur; düzeltme izni içerik onayı diye kaydedilmedi. Dört çıktı inceleme üreticisinde erişilebilir, nihai üretimde kapalıdır. Karışık kapsam seçimi de onay kapısını aşamaz. Önceki 13 Ekim onay kaydı korunur.

825/825 sözleşme ve derleme sonrası 937/937 test başarılı; tür kontrolü ve Worker derlemesi başarılı. Lint: sıfır hata, iki mevcut uyarı. 5 ve 8 soruluk standart/BEP A/B için toplam 32 yerel inceleme DOCX dosyasında soru–anahtar–ölçüt eşleşmesi, öğrenci dosyasına anahtar sızmaması ve 100 puan toplamı doğrulandı. Bunlar canlıdan indirilmiş dosya değildir. PR #210 başarılı CI sonrası ana dala birleşti; sürüm 169 canlıda. Gerçek öğretmen oturumunda 6. ünite ve 4+5 karışık kapsam için içerik onayı uyarısı ve kapalı üretim düğmesi doğrulandı. 5–6. ünite canlı A/B indirme kabulü içerik onayı sonrasında yapılacak. Takip düzeltmesi onay bekleyen çıktıların uyarı listesinde de görünmesini sağlar. Ayrıntılar: `docs/quality/grade11-unit5-unit6-alignment-20261015.md`.

Aşağıdaki kayıtlar tarihseldir; eski “sıradaki iş” ve kabul koşulları kendi tarihlerindeki durumu anlatır.

## 13 Ekim 2026 — hesap geçmişi ve yeni soru çiftleri (canlı kabul tamamlandı)

Önceki canlı kabul yalnız tek üretimdeki A/B farkını kanıtlamıştı. Kullanıcının yeni 8 soruluk DOCX dosyasında önceki 5 soruluk A/B dosyalarıyla aynı üç soru yeniden görüldü. #202 / sürüm 167 bu geçmiş tekrarı için kapanış sayılmaz.

PR #204 ana dala birleştirildi (d82ebe4); CI başarılı, Sites sürüm 168 dağıtıldı. Paket öğretmen hesabına bağlı, çıktı bazında atomik A/B bant geçmişi ve 11.4 için dört özgün anlatıya bağlı 100 yeni metin–soru–anahtar görevi ekler; eski Eşik/kulüp görevleri yeni 11.4 seçim havuzunda kullanılmaz. Sayı/tür/düzey değişimi ve farklı tarayıcı hesabın geçmişini sıfırlamaz. Yeni içerik bittiğinde üretim açıkça durur; sıfırlama düğmesi kaldırılmıştır. Canlıda 8 soruluk A/B öğrenci ve öğretmen DOCX'leri indirildi; 15 sayfa görsel incelendi. Toplam 16 yeni sorunun önceki 5 soruluk A/B ve bildirilen 8 soruluk kitapçıkla tam eşleşmesi yoktur. Kabul kanıtı: `docs/quality/exam-account-history-live-acceptance-20261013.md`.

## Tarihsel düzeltme kayıtları

## 13 Ekim 2026 soru sayısı ve geçmiş kurtarma paketi

Ana dal 1664009 (#201) üzerinden ayrı düzeltme dalı hazırlandı. Otomatik dağıtım bileşen bantlarına göre düzeltilir; ayar ve kapsam değişimi çıktı geçmişini korur. Eski kayıtlar okunur, bozuk/tükenmiş geçmiş açık tekrar uyarısıyla seçili kapsamda sıfırlanabilir. Eski soruda eksik varyant kimliği güvenli biçimde ele alınır. 811/811 sözleşme ve 923/923 tam test, tür kontrolü, build/Worker başarılı; lint 0 hata ve 2 mevcut test uyarısı. PR #202 birleşti (2ba75bf), sürüm 167 canlıda. 5 ve 8 soruluk gerçek A/B üretimi doğrulandı. Canlıdan indirilen dört 5 soruluk DOCX’in 13 sayfası görsel incelendi; soru–anahtar–puan paritesi başarılı. Kabul kaydı: docs/quality/exam-history-live-acceptance-20261013.md.

## 13 Ekim 2026 soru tekrarı düzeltmesi

#200 birleştirildi (29b971e), öğretmen onaylı içerikler canlı sürüm 165’te etkin. İndirilen 4. ünite kitapçığındaki tekrar bildirimi üzerine 50 ek görev ve kalıcı üretim geçmişi düzeltmesi ayrı dalda hazırlandı. 919/919 test, 807/807 sözleşme başarılı; yeni çiftin 8 DOCX dosyası ve 27 sayfası görsel olarak incelendi. Ek içerikler öğretmen incelemesi bekler; #201 ana dala birleşti (1664009); canlı sürüm 166. Ayrıntılar: `docs/quality/grade11-unit4-repeat-fix-20261013.md`.

## 13 Ekim 2026 öğretmen içerik onayı

11. sınıf 3–4. ünitelerin #192/#194 müfredat ve içerik onayı bulguları için düzeltmeler hazırlandı. Uzun yanıt alanı ve BEP boş ilk sayfa sorunu giderildi; 16 A/B öğrenci–öğretmen DOCX ve 55 sayfalık yerel görsel kabul tamamlandı. Bütün testler 916/916, sözleşmeler 804/804; tür kontrolü ve build başarılı.

#199 ana dala birleştirildi (c70d423) ve canlı sürüm 164 yayınlandı. Aytekin YILMAZ, 13 Ekim 2026 tarihinde FEL.11.3.2, FEL.11.4.1 ve FEL.11.4.2 yeni içeriklerine açık öğretmen onayı verdi. Onayı üretim kaydına taşıyan #200 birleşti; #201 de ana dalda. #195/#196 açık dalları korunur. Ayrıntılar: `docs/quality/grade11-unit3-unit4-review-20261013.md`.

## 6 Ekim 2026 tarihsel kapanış kaydı

Tarih: 6 Ekim 2026
Hazırlayan: Codex
Depo: aytigin-netizen/FOPOS

## Güncel uygulama ve canlı yayın

- GitHub uygulama kaynağı: a035c28a7e8145b86c1c2bae755e687467a0a3ba (#183); #182 de içerilir.
- Canlı sürüm: 157; Sites kaynak commit'i: 753cb18c535ccb5c1ae5ee274962ec0ba576e959.
- Kaynak ağaçları birebir aynı: 405a0b26e108031da7a4f963b6dd455c74be8be9.
- Dağıtım: succeeded, 6 Ekim 2026 09:54:31 (Türkiye).
- Canlı: https://fopos-ders-studyosu.aytigin.chatgpt.site

## Tamamlanan kapsam

#182 ile 26 çift/52 görev yuvasının soru–anahtar–puanlama uyumu tamamlandı; diğer 48 görev korundu. #183 ile öğretmen DOCX Sınav Analiz Formu'na genel sonuçlar, soru analizi ve destek planı tabloları eklendi. İki paket canlı kaynağın içindedir.
#181 eski envanter PR'ı birleştirilmeden kapatıldı.

## Test kapanışı

Altı geniş tarama başarısızlığı: 2 derleme bağımlılığı, 4 eskimiş test, bu bulgularda doğrulanmış gerçek uygulama hatası 0. Dört test güncel runtime ve güven sınırlarını kontrol edecek biçimde yenilendi. Derleme sonrası geniş tarama 866/866 başarılı. `npm run test:all` önce derler, sonra tüm test dosyalarını çalıştırır.

## Açık kabul koşulu

Canlı tarayıcıda 8 soruluk/100 puanlık A/B sınavı üretildi. Öğretmen onayında “Oturum gerekli” uyarısı çıktı. Giriş sonrasında tarayıcı güvenlik denetimi erişimi engelledi. Gerçek A/B öğrenci–öğretmen DOCX indirme ve görsel sayfa incelemesi tamamlanmadı. Kapanış bu nedenle koşulludur; önceki XML testleri görsel kabul sayılmaz.
Eski önermeler listesi bulgusu bu kabul girişiminde ayrıca doğrulanmadı.

## Sıradaki içerik

Görsel kabul tamamlandıktan sonra 11. sınıf 1. ünite: FEL.11.1.1 a–b ve FEL.11.1.2 a–b–c. Resmî PDF'de bütün 11. sınıf çıktıları iki bileşenli değildir: 12 çıktı ve 30 bileşen vardır. Yeni içerik üretimi henüz başlamadı. 10. sınıf 1–2. ünitelerini gerekçesiz yeniden cilalama.

Ayrıntılı kanıt ve altı test tablosu: docs/quality/exam-closure-20261006.md.
Tek resmî kaynak: dört dersin 2026 öğretim programları; yetki ve kaynak kimlikleri AGENTS.md / sources/curriculum-2026/manifest.json.
