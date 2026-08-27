import type { PhaseDefinition } from "./phase-catalog.ts";

type WeeklyContent = Readonly<{
  title: string;
  concepts: string;
  inquiry: string;
  discussion: string;
  application: string;
  evidence: string;
}>;

const epistemologyWeeks: readonly WeeklyContent[] = Object.freeze([
  {
    title: "Bilgi felsefesinin konusu; bilgi ve sanı ayrımı",
    concepts: "bilgi, inanç, sanı, doğruluk, gerçeklik, gerekçelendirme, özne ve nesne",
    inquiry: "Doğru bir inanç hangi ek koşullarda bilgi sayılabilir?",
    discussion: "Sanı doğru olduğunda bilgiye dönüşmüş olur mu?",
    application: "Platon'un mağara benzetmesi bağlamında görünüş, sanı, gerçeklik ve bilgi ilişkisini çözümler.",
    evidence: "Bilgi–sanı kavram ağı ve gerekçeli ayrım kartı",
  },
  {
    title: "Bilginin imkânı; kuşkuculuk ve dogmatik yaklaşım",
    concepts: "bilginin imkânı, kuşku, yargıyı askıya alma, dogmatizm ve kesinlik",
    inquiry: "İnsan kesin bilgiye ulaşabilir mi?",
    discussion: "Kuşku bilgiye engel midir, yoksa bilginin dayanaklarını sınama yolu mudur?",
    application: "Kuşkucu ve dogmatik iki bilgi iddiasını problem, iddia, gerekçe ve sonuç bakımından karşılaştırır.",
    evidence: "Bilginin imkânı görüş karşılaştırma matrisi",
  },
  {
    title: "Kuşkucu argümanlar; Gorgias ve Pyrrhoncu gelenek",
    concepts: "kuşkuculuk, görünüş, çelişen gerekçeler, yargıyı askıya alma ve aktarılabilirlik",
    inquiry: "Çatışan görünüş ve gerekçeler karşısında bilgi iddiası nasıl kurulabilir?",
    discussion: "Yargıyı askıya almak hiçbir şeyin bilinemeyeceğini savunmakla aynı mıdır?",
    application: "Gorgias ve Pyrrhoncu yaklaşımı kesin niyet veya söz atfetmeden argüman basamaklarıyla inceler.",
    evidence: "Kuşkucu argüman çözümleme formu",
  },
  {
    title: "Descartes'ta yöntemsel kuşku ve kesinlik arayışı",
    concepts: "yöntemsel kuşku, rüya argümanı, kesinlik, apaçıklık ve çıkarım",
    inquiry: "Kuşkuya açık bir inanç neden otomatik olarak yanlış sayılmaz?",
    discussion: "Descartes'ın kuşkusu Pyrrhoncu kuşkudan hangi amaç ve sonuç bakımından ayrılır?",
    application: "Rüya argümanını iddia, gerekçe, varsayım ve sonuç bakımından çözümler; bir itiraz geliştirir.",
    evidence: "Yöntemsel kuşku argüman şeması",
  },
  {
    title: "Bilginin kaynağı; rasyonalizm ve empirizm",
    concepts: "bilginin kaynağı, akıl, deney, a priori, a posteriori, rasyonalizm ve empirizm",
    inquiry: "Bilginin kaynağında akıl mı, deney mi daha belirleyicidir?",
    discussion: "Akıldan veya deneyden yalnız biri bilgi oluşumunu açıklamaya yeter mi?",
    application: "Descartes ve Locke bağlamlarındaki kaynak görüşlerini temel iddia, gerekçe, örnek ve sınırlarıyla karşılaştırır.",
    evidence: "Rasyonalizm–empirizm karşılaştırma tablosu",
  },
  {
    title: "Bilginin kaynağı; kritisizm ve entüisyonizm",
    concepts: "kritisizm, deney, aklın formları, sezgi, kavrayış ve bilginin sınırları",
    inquiry: "Bilgi, deney ile bilen öznenin zihinsel katkısının birlikte ürünü olabilir mi?",
    discussion: "Sezgi, akıl ve deneyden bağımsız bir bilgi kaynağı olarak savunulabilir mi?",
    application: "Kant ve Bergson bağlamlarındaki görüşleri kaynak, öznenin rolü, gerekçelendirme ve sınır boyutlarında karşılaştırır.",
    evidence: "Kritisizm–entüisyonizm görüş ve argüman matrisi",
  },
  {
    title: "Bilginin doğruluk ölçütleri",
    concepts: "uygunluk, tutarlılık, tümel uzlaşım, yarar, doğrulama ve kaynak güvenilirliği",
    inquiry: "Bir bilgi iddiasının doğru olduğunu hangi ölçütlerle belirleriz?",
    discussion: "Tek bir doğruluk ölçütü bütün bilgi alanlarında yeterli olabilir mi?",
    application: "Güncel bir bilgi iddiasını uygunluk, tutarlılık, tümel uzlaşım ve yarar ölçütleriyle ayrı ayrı sınar.",
    evidence: "Dört doğruluk ölçütlü bilgi iddiası değerlendirme formu",
  },
  {
    title: "Bilgi felsefesi metni inceleme ve performans görevi",
    concepts: "kavram, problem, iddia, gerekçe, sonuç, metin kanıtı, alıntı ve parafraz",
    inquiry: "Bir felsefi metindeki görüş hangi kanıtlarla adil ve güvenilir biçimde yeniden kurulabilir?",
    discussion: "Metnin ana iddiasını değerlendirmek için hangi karşı örnek veya itiraz daha güçlüdür?",
    application: "Kaynağı belirtilmiş bir bilgi felsefesi metnini altı ölçütlü formla inceler ve akran dönütüyle revize eder.",
    evidence: "Kaynaklı metin inceleme formu ve revize edilmiş performans ürünü",
  },
]);

const natureOfPhilosophyWeeks: readonly WeeklyContent[] = Object.freeze([
  {
    title: "Felsefenin anlamı; bilgelik sevgisi ve arayış",
    concepts: "felsefe, bilgelik, sevgi, arayış, düşünme, bilgi ve filozof",
    inquiry: "Felsefe, bilgelik sahibi olmak mı yoksa bilgeliği aramak mıdır?",
    discussion: "Her derin düşünme etkinliği felsefe sayılır mı?",
    application: "Felsefe, filozof ve bilgelik kavramlarını gündelik kullanımlarıyla karşılaştırır; aralarındaki ilişkiyi gerekçeli bir kavram ağıyla gösterir.",
    evidence: "Felsefe–bilgelik–filozof kavram ağı ve gerekçeli ilk tanım",
  },
  {
    title: "Felsefenin ortak tanımının imkânı",
    concepts: "tanım, öz, görüş, gerekçe, ortaklık, farklılık ve açık uçluluk",
    inquiry: "Felsefenin bütün dönem ve gelenekleri kapsayan tek bir tanımı yapılabilir mi?",
    discussion: "Felsefenin farklı tanımlara sahip olması onun belirsiz olduğunu mu gösterir?",
    application: "Farklı filozoflara ait, kaynağı ve bağlamı belirtilmiş felsefe tanımlarını ortak ölçütler, ayrımlar ve sınırlar bakımından karşılaştırır.",
    evidence: "Felsefe tanımları karşılaştırma matrisi ve gerekçeli tanım önerisi",
  },
  {
    title: "Felsefi düşüncenin temel özellikleri",
    concepts: "hayret, merak, kuşku, sorgulama, rasyonellik, tutarlılık, eleştirellik, sistemlilik, evrensellik ve refleksiyon",
    inquiry: "Bir düşünceyi felsefi yapan ayırt edici özellikler nelerdir?",
    discussion: "Kuşku ve eleştiri olmadan felsefi düşünce kurulabilir mi?",
    application: "Gündelik üç düşünme örneğini felsefi düşüncenin özellikleriyle sınar; eksik ölçütleri ve sınır durumları belirler.",
    evidence: "Felsefi düşünce özellikleri ölçüt tablosu ve sınır durum açıklaması",
  },
  {
    title: "Felsefi düşüncenin ortaya çıkışı; mitostan logosa geçiş",
    concepts: "mitos, logos, doğa, neden, açıklama, eleştiri, merak ve sorgulama",
    inquiry: "Felsefi düşüncenin ortaya çıkışını hangi düşünsel ve toplumsal koşullar mümkün kılmıştır?",
    discussion: "Mitos ile logos arasındaki geçiş kesin bir kopuş olarak görülebilir mi?",
    application: "Felsefi düşüncenin ortaya çıkışına ilişkin tarihsel koşulları neden–sonuç ilişkileriyle zaman şeridine yerleştirir; tek nedenli açıklamaları eleştirir.",
    evidence: "Kanıta dayalı ortaya çıkış zaman şeridi ve neden–sonuç açıklaması",
  },
  {
    title: "Felsefi düşüncenin tarihsel gelişimi ve dönemleri",
    concepts: "Antik Çağ, Orta Çağ, Rönesans, modern felsefe, çağdaş felsefe, süreklilik ve dönüşüm",
    inquiry: "Felsefi problemler tarihsel koşullarla birlikte nasıl değişir?",
    discussion: "Felsefe tarihi doğrusal bir ilerleme olarak okunabilir mi?",
    application: "Başlıca felsefe dönemlerini öne çıkan problem, kavram ve tarihsel koşullarla eşleştirir; iki dönem arasındaki süreklilik ve dönüşümü açıklar.",
    evidence: "Dönem–problem–koşul eşleştirme tablosu ve karşılaştırmalı çıkarım",
  },
  {
    title: "Dünya felsefe gelenekleri",
    concepts: "gelenek, kültür, bilgelik, insan, doğa, toplum, benzerlik ve farklılık",
    inquiry: "Farklı kültürlerde gelişen düşünce geleneklerini felsefe olarak ilişkilendiren ortak yönler nelerdir?",
    discussion: "Felsefenin başlangıcını yalnızca tek bir coğrafyayla açıklamak yeterli midir?",
    application: "Hint, Çin, Antik Yunan, Türk–İslam ve modern Batı felsefe geleneklerinden seçilmiş güvenilir örnekleri problem, yöntem ve kavram bakımından karşılaştırır.",
    evidence: "Dünya felsefe gelenekleri karşılaştırma haritası ve kaynaklı çıkarım",
  },
  {
    title: "Felsefi sorunun temel özellikleri",
    concepts: "felsefi soru, kavramsallık, temellendirme, açıklık, tartışılabilirlik, evrensellik ve refleksiyon",
    inquiry: "Bir soruyu bilgi istemekten çıkarıp felsefi soru hâline getiren nedir?",
    discussion: "Cevabı kesin olarak verilemeyen her soru felsefi midir?",
    application: "Gündelik ve olgusal soruları felsefi soru ölçütleriyle sınıflandırır; yakın çevresindeki bir sorunu açık, kavramsal ve tartışılabilir bir felsefi soruya dönüştürür.",
    evidence: "Dört ölçütlü felsefi soru kontrol listesi ve özgün soru",
  },
  {
    title: "Felsefenin bilim, din ve sanatla ilişkisi",
    concepts: "felsefe, bilim, din, sanat, amaç, yöntem, doğrulama, inanç, yorum ve yaratıcılık",
    inquiry: "Felsefe bilim, din ve sanatla hangi noktalarda kesişir ve ayrılır?",
    discussion: "Felsefe diğer bilgi ve ifade alanları arasında bir üst değerlendirme alanı mıdır?",
    application: "Felsefe, bilim, din ve sanatı amaç, soru türü, yöntem, doğrulama ve ürün boyutlarında karşılaştırır; aşırı genellemeleri karşı örnekle sınar.",
    evidence: "Beş boyutlu alan karşılaştırma matrisi ve karşı örnek kaydı",
  },
  {
    title: "Felsefenin bireysel ve toplumsal işlevleri",
    concepts: "öz-farkındalık, eleştirel düşünme, özgürlük, sorumluluk, hoşgörü, demokrasi, toplumsal eleştiri ve dönüşüm",
    inquiry: "Felsefe bireyin ve toplumun yaşamında hangi somut değişimleri mümkün kılar?",
    discussion: "Felsefenin değeri pratik bir yarar üretmesine mi bağlıdır?",
    application: "Güncel bir bireysel veya toplumsal sorunu felsefenin işlevleri açısından inceler; olası katkı ve sınırları gerekçeli bir öneriye dönüştürür.",
    evidence: "Bireysel–toplumsal işlev çözümleme tablosu ve gerekçeli öneri",
  },
  {
    title: "Felsefenin doğası; röportaj ve performans görevi",
    concepts: "felsefe, filozof, felsefi soru, işlev, görüş, gerekçe, görüşme etiği, kaynak ve sentez",
    inquiry: "Felsefenin ne olduğu ve ne işe yaradığına ilişkin farklı görüşler nasıl adil biçimde çözümlenebilir?",
    discussion: "Toplumdaki felsefe algısı ile ders boyunca geliştirilen felsefe anlayışı neden farklılaşabilir?",
    application: "Farklı yaş ve meslek gruplarıyla yapılan felsefe röportajlarını etik, kaynak ve izin kurallarına göre düzenler; yanıtları ders ölçütleriyle çözümler ve ürünü akran dönütüyle geliştirir.",
    evidence: "Kaynak ve izin kaydı taşıyan röportaj ürünü, çözümleme raporu ve öz değerlendirme",
  },
]);

const logicAndArgumentationWeeks: readonly WeeklyContent[] = Object.freeze([
  {
    title: "Düşünme, dil, anlam ve kavram ilişkisi",
    concepts: "düşünme, dil, anlam, kavram, ifade, gösterge ve bağlam",
    inquiry: "Düşüncelerimiz kullandığımız dilden bağımsız olarak oluşabilir mi?",
    discussion: "Dil yalnızca hazır düşünceleri aktaran bir araç mıdır?",
    application: "Aynı düşüncenin farklı ifadelerini temel anlam, vurgu ve çağrışım bakımından karşılaştırır; düşünme ile dil arasındaki ilişki yönlerini şemada gösterir.",
    evidence: "Düşünme–dil–anlam kavram ağı ve ilk ilişki modeli",
  },
  {
    title: "Bağlamın anlam üzerindeki etkisi; ilişki ve nedensellik ayrımı",
    concepts: "bağlam, kullanım, anlam değişimi, birlikte değişim, nedensellik, etki yönü ve sınır durum",
    inquiry: "Bir ifadenin anlamını sözcükler mi, kullanıldığı bağlam mı belirler?",
    discussion: "Dil ve düşüncenin birlikte değişmesi, birinin diğerinin nedeni olduğunu göstermeye yeter mi?",
    application: "Aynı ifadenin farklı bağlamlarda kazandığı anlamları inceler; gözlem, birlikte değişim ve nedensel yorumları birbirinden ayırarak etki yönünü gerekçelendirir.",
    evidence: "Bağlam karşılaştırma tablosu ve gerekçeli nedensellik notu",
  },
  {
    title: "Düşünme–dil ilişkisini uyumlu bir model hâline getirme",
    concepts: "karşılıklı etki, tek yönlü ilişki, model, bütünlük, çelişmezlik, gerekçe ve karşı örnek",
    inquiry: "Düşünme ile dil arasındaki çok yönlü ilişkiler çelişkisiz bir modelde nasıl birleştirilebilir?",
    discussion: "Dil düşünmeyi mi biçimlendirir, düşünme dili mi; yoksa ilişki karşılıklı mıdır?",
    application: "Örneklerden çıkardığı en az iki ilişkiyi doğru yön, gerekçe ve sınır durumla birleştirir; rakip tek yönlü modeli karşı örnekle sınar.",
    evidence: "Çelişkisiz nedensel ilişki şeması, karşı örnek ve model açıklaması",
  },
  {
    title: "Mantık ve argümantasyonun temel kavramları",
    concepts: "mantık, akıl yürütme, argüman, iddia, öncül, sonuç, tutarlılık, geçerlilik, sağlamlık ve ikna edicilik",
    inquiry: "Bir ifadeler dizisini argüman yapan temel koşullar nelerdir?",
    discussion: "İkna edici bir argüman mantıksal olarak iyi olmak zorunda mıdır?",
    application: "Gündelik örneklerde iddia, destek ve sonuç işlevlerini sınıflandırır; tutarlılık, geçerlilik, sağlamlık ve ikna edicilik ölçütlerini örnek ve karşı örnekle ayırır.",
    evidence: "Mantık kavramları güvenlik tablosu ve sınıflandırılmış örnekler",
  },
  {
    title: "Argümanın yapısı; öncül, sonuç ve çıkarım bağı",
    concepts: "öncül, sonuç, çıkarım, gerekçe, örtük öncül, argüman şeması ve değerlendirme ölçütü",
    inquiry: "Bir sonucun öncüllerden nasıl çıkarıldığını hangi yapısal işaretlerle belirleyebiliriz?",
    discussion: "Öncülleri doğru olan her argümanın sonucu zorunlu olarak doğru mudur?",
    application: "Bağlamı korunmuş bir gündelik ve bir felsefi argümanı öncül–sonuç bileşenlerine ayırır; çıkarım bağını açıklar ve varsa örtük öncülü gerekçelendirir.",
    evidence: "Bağlamlı öncül–sonuç çizelgesi ve çıkarım bağı açıklaması",
  },
  {
    title: "Argümanı yeniden ifade etme, değerlendirme ve safsata çözümleme",
    concepts: "nesnel yeniden ifade, bağlam, anlamı koruma, safsata, karşı örnek, çıkarım hatası ve revizyon",
    inquiry: "Bir argümanı çarpıtmadan yeniden kurmak ve mantıksal açıdan değerlendirmek nasıl mümkündür?",
    discussion: "Bir argümanın sonucuna katılmamak, argümanın hatalı olduğunu göstermeye yeter mi?",
    application: "Bir argümanı bağlam ve anlamını koruyarak kendi cümleleriyle yeniden ifade eder; öncül–sonuç yapısını uygun ölçütle değerlendirir ve seçilen safsata örüntüsünü karşı örnekle açıklar.",
    evidence: "Nesnel yeniden ifade kontrol listesi, argüman değerlendirme formu ve safsata karşı örneği",
  },
]);

const ontologyWeeks: readonly WeeklyContent[] = Object.freeze([
  {
    title: "Varlık felsefesinin konusu ve temel kavramları",
    concepts: "varlık, var olan, ontoloji, metafizik, gerçeklik, bilim ve felsefe",
    inquiry: "Bir şey hakkında ‘vardır’ demek neyi ileri sürmektir?",
    discussion: "Ontoloji ile metafizik hangi bağlamlarda ilişkilidir ve neden her bağlamda eş anlamlı değildir?",
    application: "Gündelik varlık ifadelerini felsefi sorulara dönüştürür; bilim ile felsefenin varlığı ele alışını karşılaştırır ve ontoloji–metafizik ilişkisini bağlama göre açıklar.",
    evidence: "Ontolojik kavram ağı, bilim–felsefe karşılaştırması ve gerekçeli varlık sorusu",
  },
  {
    title: "Varlığın var olup olmadığı; Parmenides ve Gorgias",
    concepts: "varlık, yokluk, düşünme, bilinebilirlik, aktarılabilirlik, iddia ve gerekçe",
    inquiry: "Varlığın varlığı hangi gerekçelerle savunulabilir veya sorgulanabilir?",
    discussion: "Bir şeyin varlığı, bilinebilirliği ve başkasına aktarılabilirliği aynı iddia mıdır?",
    application: "Parmenides ve Gorgias bağlamındaki iddiaları doğrulanmamış söz veya niyet atfetmeden varlık, bilinebilirlik ve aktarılabilirlik basamaklarında çözümler.",
    evidence: "Üç basamaklı varlık–bilme–aktarma iddia ve gerekçe tablosu",
  },
  {
    title: "Varlığın ne olduğu; temel açıklama modelleri",
    concepts: "madde, idea, töz, öz, realizm, idealizm, materyalizm ve düalizm",
    inquiry: "Varlığın temelini açıklamak için madde, düşünce veya birden çok ilke yeterli midir?",
    discussion: "Varlığın ne olduğuna ilişkin bir açıklamayı güçlü kılan ölçütler nelerdir?",
    application: "Realizm, idealizm, materyalizm ve düalizmi resmî üst başlıklar gibi değil, varlığın ne olduğu problemine verilen yanıtlar olarak karşılaştırır; monizm–düalizm–plüralizmi yardımcı sınıflandırma olarak sınar.",
    evidence: "Problem–görüş–argüman karşılaştırma matrisi ve sınıflandırma karşı örneği",
  },
  {
    title: "Değişme, görünüş ve insanın varoluşu",
    concepts: "oluş, değişme, fenomen, görünüş, gerçeklik, varlık ve varoluş",
    inquiry: "Değişen, görünen ve yaşanan varlık hangi ölçütlerle gerçek sayılır?",
    discussion: "Bir şeyin görünme biçimi, ne olduğunu veya var olup olmadığını tek başına belirler mi?",
    application: "Herakleitos bağlamındaki oluş argümanını, fenomeni yanılsamayla eşitlemeden görünüş–gerçeklik ilişkisini ve varlık–varoluş ayrımını örnek, karşı örnek ve itirazlarla inceler.",
    evidence: "Kavramsal sınır tablosu, oluş argümanı haritası ve karşı örnek",
  },
  {
    title: "Varlık felsefesi metni inceleme ve performans görevi",
    concepts: "kavram, problem, tez, öncül, sonuç, itiraz, metin kanıtı, alıntı ve parafraz",
    inquiry: "Bir ontolojik görüş metinden hangi kanıtlarla adil biçimde yeniden kurulup değerlendirilebilir?",
    discussion: "Bir metindeki ontolojik argümana yöneltilecek hangi itiraz veya karşı örnek daha güçlüdür?",
    application: "Kaynağı, eser bilgisi ve alıntı/parafraz durumu doğrulanmış; 10. sınıf düzeyine anlamı korunarak uyarlanmış bir metinde kavram, problem, tez, öncül ve sonucu belirler; görüşü metin kanıtıyla değerlendirip akran dönütüyle revize eder.",
    evidence: "Dört süreç bileşenini gösteren kaynaklı metin inceleme formu ve revize performans ürünü",
  },
]);

const ethicsWeeks: readonly WeeklyContent[] = Object.freeze([
  {
    title: "Ahlak felsefesinin konusu ve temel kavramları",
    concepts: "ahlak, etik, iyi, kötü, erdem, vicdan, değer, eylem ve gerekçe",
    inquiry: "Bir eylemi ahlaki değerlendirmeye konu yapan nedir?",
    discussion: "İyi niyet, bir eylemi ahlaken iyi saymak için tek başına yeterli midir?",
    application: "Ahlak ile etiği, iyi–kötü yargılarını ve erdem–vicdan ilişkisini gündelik fakat mahrem olmayan kurgusal örneklerle ayırır; kişileri değil eylem, gerekçe ve ilkeleri değerlendirir.",
    evidence: "Ahlak–etik kavram ayrım kartı ve gerekçeli eylem değerlendirmesi",
  },
  {
    title: "Evrensel ahlak yasasının imkânı",
    concepts: "evrensellik, görelilik, ahlak yasası, ilke, tutarlılık, istisna, karşı örnek ve gerekçelendirme",
    inquiry: "Bütün insanlar için geçerli bir ahlak yasası mümkün müdür?",
    discussion: "Ahlaki görüşlerin kültürlere göre değişmesi evrensel hiçbir ilke bulunmadığını gösterir mi?",
    application: "Evrensel ve göreli ahlak iddialarını tanımlayıcı kültür gözlemleriyle normatif sonuçları karıştırmadan iddia, gerekçe, istisna ve karşı örnek bakımından karşılaştırır.",
    evidence: "Evrensellik–görelilik argüman ve karşı örnek tablosu",
  },
  {
    title: "Özgürlük ve ahlaki sorumluluk",
    concepts: "özgürlük, belirlenim, seçim, niyet, baskı, bilgi, eylem kapasitesi, sorumluluk ve derece",
    inquiry: "Bir kişinin eyleminden ahlaken sorumlu tutulabilmesi için ne ölçüde özgür olması gerekir?",
    discussion: "Koşullar tarafından etkilenmek, özgürlüğü ve sorumluluğu bütünüyle ortadan kaldırır mı?",
    application: "Yaşa uygun kurgusal durumlarda baskı, bilgi eksikliği, niyet, seçenek ve eylem kapasitesini ayrı ayrı inceler; sorumluluğu otomatik suçlama yerine gerekçeli ve dereceli biçimde değerlendirir.",
    evidence: "Özgürlük–sorumluluk koşulları çözümleme formu",
  },
  {
    title: "Ahlak felsefesi metni, etik ikilem ve performans görevi",
    concepts: "etik ikilem, sonuç, niyet, ilke, erdem, kavram, problem, argüman, itiraz ve metin kanıtı",
    inquiry: "Bir etik ikilemde farklı ahlaki ölçütler gerekçeli bir karara nasıl dönüştürülebilir?",
    discussion: "Sonuç, niyet, ilke ve erdem ölçütleri çatıştığında hangisine neden öncelik verilmelidir?",
    application: "Kişisel itiraf gerektirmeyen kurgusal bir etik ikilemi sonuç, niyet, ilke ve erdem açısından karşılaştırır; hukuki, toplumsal ve ahlaki yargıları ayırarak kaynaklı bir metindeki argümanı adil biçimde yeniden kurar.",
    evidence: "Kaynaklı metin inceleme formu ve gerekçeli etik karar metni",
  },
]);

const aestheticsWeeks: readonly WeeklyContent[] = Object.freeze([
  {
    title: "Estetik ve sanat felsefesinin konusu ve temel kavramları",
    concepts: "estetik, sanat, sanat eseri, güzellik, estetik haz, estetik yargı, beğeni ve gerekçe",
    inquiry: "Bir şeyi sanat eseri yapan nedir?",
    discussion: "Güzel bulmadığımız bir şey sanat eseri olabilir mi?",
    application: "Yaşa uygun, sanatçısı ve kaynağı belirtilmiş farklı sanat örneklerini kişisel beğeni, gerekçeli estetik yargı ve sanat eseri ölçütleri bakımından karşılaştırır; güzel ile sanat eserini özdeşleştirmez.",
    evidence: "Estetik kavram ağı ve gerekçeli sanat eseri ölçüt kartı",
  },
  {
    title: "Sanatın ne olduğu; taklit, yaratım ve oyun olarak sanat",
    concepts: "sanat, taklit, yaratım, oyun, temsil, özgünlük, sanatçı, eser, izleyici ve bağlam",
    inquiry: "Sanat yalnızca gerçekliği taklit eder mi?",
    discussion: "Bir nesneyi sanat eseri yapan sanatçı, eser, izleyici veya bağlam mıdır?",
    application: "Aynı objenin gözleme dayalı ve hayalî iki temsilini sanatsal yeteneği puanlamadan karşılaştırır; taklit, yaratım ve oyun kuramlarını kesin ve birbirini bütünüyle dışlayan tanımlar gibi sunmadan ilgili iddia ve gerekçelerle ilişkilendirir.",
    evidence: "Üç sanat kuramı karşılaştırma matrisi ve gerekçeli eser incelemesi",
  },
  {
    title: "Güzellik, ortak estetik yargılar ve kaynaklı metin inceleme",
    concepts: "güzellik, öznel yargı, nesnel ölçüt, ortak estetik yargı, hakikat, iyilik, yüce, kavram, argüman ve metin kanıtı",
    inquiry: "Ortak estetik yargılar hangi ölçütlerle mümkün olabilir?",
    discussion: "Güzellik bütünüyle öznel midir?",
    application: "Eseri ve alıntı/parafraz durumu belirtilmiş, anlamı korunarak yaş düzeyine uyarlanmış kısa bir estetik metninde kavram, problem, iddia, gerekçe ve sonucu inceler; kültürel beğenileri tek ölçüte indirgemeden bir esere ilişkin estetik yargısını ölçüt ve metin kanıtıyla savunup akran dönütüyle düzeltir.",
    evidence: "Kaynaklı metin inceleme formu, estetik değerlendirme kartı ve revize performans ürünü",
  },
]);

const environmentalPhilosophyWeeks: readonly WeeklyContent[] = Object.freeze([
  {
    title: "Çevre–insan ilişkisi ve temel kavramlar",
    concepts: "çevre, doğa, insan, değer, ilişki, ihtiyaç, etki ve sorumluluk",
    inquiry: "İnsan doğanın dışında mı, yoksa onun ilişkisel bir parçası mıdır?",
    discussion: "Doğanın değeri yalnızca insana sağladığı yararla açıklanabilir mi?",
    application: "Kişisel tüketim alışkanlıklarını veya aile davranışlarını açıklamayı gerektirmeyen kurgusal bir çevre örneğinde insan, doğa, değer ve sorumluluk ilişkilerini ayırır; çevre bilimiyle çevre etiğinin soru türlerini birbirine karıştırmaz.",
    evidence: "Çevre–insan ilişkisi kavram ağı ve gerekçeli ayrım kartı",
  },
  {
    title: "Çevreyle ilgili felsefi sorular ve problemler",
    concepts: "felsefi soru, olgusal soru, çevre sorunu, değer, gerekçe, sorumluluk ve adalet",
    inquiry: "Bir çevre sorununu felsefi problem hâline getiren nedir?",
    discussion: "Bir çevre sorununa ilişkin bilimsel açıklama, nasıl davranmamız gerektiğini tek başına belirler mi?",
    application: "Kaynağı belirtilmiş, yaşa uygun bir çevre vakasındaki olgusal, bilimsel ve felsefi soruları ayırır; doğrulanmamış oran veya felaket iddiası üretmeden sorunu hayatla ilişkilendirir ve tartışılabilir bir felsefi soruya dönüştürür.",
    evidence: "Felsefi–olgusal soru sınıflandırma tablosu ve özgün çevre sorusu",
  },
  {
    title: "İnsan, canlı ve çevre merkezci etik yaklaşımlar",
    concepts: "insan merkezcilik, canlı merkezcilik, çevre merkezcilik, içsel değer, araçsal değer ve etik ölçüt",
    inquiry: "Ahlaki önem yalnızca insana mı, canlılara mı, yoksa ekosistemin bütününe mi verilmelidir?",
    discussion: "İnsan, canlı ve çevre merkezci yaklaşımlar her durumda birbirini dışlar mı?",
    application: "Üç çevre etiği yaklaşımını tek doğru görüşe indirgemeden; ahlaki özne, değer ölçütü, sorumluluk alanı, güçlü yön ve sınır bakımından karşılaştırır ve her yaklaşım için adil bir örnek kurar.",
    evidence: "Üç yaklaşım karşılaştırma matrisi ve gerekçeli sınır örnekleri",
  },
  {
    title: "Çevre sorunlarına ilişkin felsefi argümanları çözümleme",
    concepts: "iddia, öncül, sonuç, varsayım, gerekçe, itiraz, karşı örnek ve kaynak",
    inquiry: "Bir çevre argümanının felsefi bakımdan güçlü olduğunu nasıl belirleriz?",
    discussion: "Acil bir çevre sorunu, zayıf veya doğrulanmamış bir gerekçeyi kabul edilebilir kılar mı?",
    application: "Kaynaklı ve kurgusal bir çevre tartışmasındaki argümanı öncül, sonuç, değer varsayımı ve olgusal dayanaklarına ayırır; bilimsel veriyle normatif sonucu karıştırmadan adil bir itiraz geliştirir.",
    evidence: "Çevre argümanı haritası, kaynak denetimi ve gerekçeli itiraz",
  },
  {
    title: "Çevre sorunları hakkında görüş ve argüman oluşturma",
    concepts: "tez, gerekçe, kanıt, değer, sorumluluk, birey, kurum, sistem, itiraz ve yanıt",
    inquiry: "Çevre sorunlarında sorumluluk bireyler, kurumlar ve sistemler arasında nasıl paylaştırılmalıdır?",
    discussion: "Bireysel davranış değişikliği çevre sorunlarının çözümü için yeterli midir?",
    application: "Kişisel suçluluk veya siyasi yönlendirme üretmeden, kurgusal bir çevre sorunu için birey, kurum ve sistem düzeylerini ayıran; bir etik yaklaşıma dayalı tez, gerekçe, kanıt, itiraz ve yanıt içeren argüman oluşturur.",
    evidence: "Çok düzeyli sorumluluk şeması ve revize çevre etiği argümanı",
  },
  {
    title: "Çevre sorunları üzerine felsefi metin ve performans görevi",
    concepts: "felsefi metin, tez, kavram, argüman, karşı görüş, kaynak, alıntı, parafraz ve öz değerlendirme",
    inquiry: "Çevreyle ilgili özgün bir felsefi görüş tutarlı, kaynaklı ve çoğulcu bir metne nasıl dönüştürülür?",
    discussion: "Bir çevre görüşünü savunmak, karşı görüşün güçlü yanlarını kabul etmeye engel midir?",
    application: "Gönüllü ve mahremiyet koruyan bir örnek üzerinden, kültürel yaklaşımları tek ölçüte indirgemeden ve yönlendirilmiş aktivizm istemeden tez, argüman, karşı görüş ve yanıt içeren kaynaklı kısa bir felsefi metin yazar; alıntı ile parafrazı ayırıp rubrik ve akran dönütüyle düzeltir.",
    evidence: "Kaynaklı felsefi metin, analitik rubrik, akran dönütü ve öz değerlendirme",
  },
]);

const technologyAndLifeWeeks: readonly WeeklyContent[] = Object.freeze([
  {
    title: "Teknoloji ve insan hayatı; tekhne, araç ve amaç",
    concepts: "tekhne, teknoloji, araç, amaç, tarafsızlık, teknoloji taraftarlığı ve teknoloji karşıtlığı",
    inquiry: "Teknoloji yalnızca amaçlarımıza hizmet eden tarafsız bir araç mıdır?",
    discussion: "Bir teknolojinin değeri yalnızca onu kullanan kişinin amacına göre belirlenebilir mi?",
    application: "Marka veya ürün yönlendirmesi yapmadan, farklı dönemlerden yaşa uygun araç ve teknoloji örneklerini araç, amaç, değer ve olası etki bakımından sınıflandırır; teknoloji taraftarlığı ile karşıtlığını toptan iyi–kötü yargılarına indirgemez.",
    evidence: "Araç–amaç–değer sınıflandırması ve gerekçeli ön kabul kartı",
  },
  {
    title: "Teknolojinin hayatı dönüştürmesi; zaman, mekân, konfor ve risk",
    concepts: "zaman, mekân, konfor, bağımlılık, güvenlik, mahremiyet, yarar, risk ve felsefi soru",
    inquiry: "Teknolojinin tutsağı olmadan teknolojik bir hayat mümkün müdür?",
    discussion: "Teknolojinin sağladığı konfor, yol açabileceği riskleri kabul etmek için yeterli bir gerekçe midir?",
    application: "Kişisel ekran süresi, hesap bilgisi, aile davranışı veya sosyal medya deneyimi açıklatmadan, açıkça kurmaca bir günlük yaşam vakasında yararları, riskleri, olgusal soruları ve felsefi problemleri ayırır; teknoloji bağımlılığına ilişkin klinik tanı koymaz.",
    evidence: "Felsefi soru listesi, yarar–risk matrisi ve mahremiyet kontrolü",
  },
  {
    title: "Teknoloji bağlamında ontolojik anlam kaybı ve yabancılaşma",
    concepts: "ontolojik anlam, yabancılaşma, varlık, araçsallaştırma, insan, teknoloji, iddia ve gerekçe",
    inquiry: "Teknoloji, insanı ve varlıkları başlangıçta oldukları şeyden uzaklaştırabilir mi?",
    discussion: "Teknoloji insanı yalnızca çevresinden mi, yoksa kendisinden de uzaklaştırabilir mi?",
    application: "Kaynağı ve bağlamı belirtilmiş, yaş düzeyine uyarlanmış Heidegger ve Marcel görüşlerini kesin söz veya niyet atfetmeden kavram, problem, iddia ve gerekçe bakımından çözümler; ontolojik problemi psikolojik tanıyla karıştırmaz.",
    evidence: "Ontolojik problem argüman ağacı ve filozof görüşü çözümleme formu",
  },
  {
    title: "Gerçeklik, simülasyon, yapay zekâ ve anlama problemi",
    concepts: "gerçeklik, temsil, simülasyon, sanal evren, yapay zekâ, zihin, anlama, bilinç ve kaynak",
    inquiry: "Bir makinenin doğru cevap vermesi, onun anladığını veya düşündüğünü gösterir mi?",
    discussion: "Dijital bir temsil, deneyimlediğimiz gerçekliğin yerini alabilir mi?",
    application: "Açıkça yapay veya kurmaca olduğu belirtilen ve hiçbir gerçek kişiyi taklit etmeyen içerikleri kaynak, temsil ve gerçeklik ölçütleriyle inceler; Baudrillard ile Searle veya Cahit Arf bağlamlarındaki görüşleri karşılaştırır ve yapay zekâ çıktısını kanıt ya da otorite saymaz.",
    evidence: "Gerçeklik–temsil karşılaştırması, kaynak denetimi ve yapay zekâ argüman haritası",
  },
  {
    title: "Teknoloji bağlamında aksiyolojik problemler ve ahlaki sorumluluk",
    concepts: "mahremiyet, güvenlik, değer, dijital eşitsizlik, algoritma, sorumluluk, ahlaki eylem ve adalet",
    inquiry: "Bir algoritmanın kararı ahlaki bir eylem sayılabilir mi; sonuçlarından kim sorumludur?",
    discussion: "Güvenlik için mahremiyetin sınırlandırılması hangi koşullarda savunulabilir?",
    application: "Kişisel veri ve gerçek hesap gerektirmeyen kurmaca bir yapay zekâ veya sosyal medya ikileminde paydaş, değer, erişim eşitsizliği ve sorumluluk ilişkilerini çözümler; Bauman ve Cezeri bağlamını kullanarak teknik saldırı talimatı vermeden görüş, karşı görüş ve güvenli tasarım ilkeleri oluşturur.",
    evidence: "Paydaş–değer–sorumluluk matrisi ve gerekçeli teknoloji etiği görüşü",
  },
  {
    title: "Teknoloji ve hayat üzerine felsefi metin ve performans görevi",
    concepts: "tez, argüman, karşı görüş, tutarlılık, kaynak, alıntı, parafraz, özgürlük, değer ve sorumluluk",
    inquiry: "Teknoloji insan özgürlüğünü genişletir mi, sınırlar mı?",
    discussion: "Teknolojik ilerleme her zaman insani ilerleme anlamına gelir mi?",
    application: "Doğrulanmış ve erişim tarihi belirtilmiş kaynaklardan hareketle tez, gerekçe, karşı görüş, yanıt ve sonuç içeren kısa bir felsefi metin yazar; alıntı ile parafrazı ayırır, marka tavsiyesi vermeden ve yapay zekâ üretimini kendi özgün kanıtı gibi sunmadan rubrik ve akran dönütüyle metnini düzeltir.",
    evidence: "Kaynaklı felsefi metin, analitik rubrik, akran dönütü ve öz değerlendirme",
  },
]);

const reasonAndFaithWeeks: readonly WeeklyContent[] = Object.freeze([
  {
    title: "Bilgi, inanç ve güven ayrımı",
    concepts: "akıl, bilgi, inanç, güven, gerekçelendirme, doğruluk ve kanaat",
    inquiry: "Bir düşünceyi bilgi, inanç veya güven olarak nitelemek için hangi ölçütler gerekir?",
    discussion: "Aynı önerme farklı kişiler için bilgi veya inanç olabilir mi?",
    application: "Öğrenciden kendi dinî inancını, inançsızlığını veya aile inancını açıklamasını istemeden, açıkça kurmaca durumları bilgi–inanç–güven ayrımıyla sınıflandırır; her sınıflandırmayı gerekçe ve karşı örnekle sınar.",
    evidence: "Tanım–örnek–karşı örnek çalışma kâğıdı ve çıkış bileti",
  },
  {
    title: "İnancın akılla temellendirilmesinin imkânı",
    concepts: "akıl, inanç, temellendirme, akla uygunluk, akıl üstü, akla aykırı ve anlama",
    inquiry: "İnancın akılla temellendirilmesi mümkün ve gerekli midir?",
    discussion: "Akıl üstü olmak ile akla aykırı olmak aynı şey midir?",
    application: "Kaynağı, eseri ve tarihsel bağlamı belirtilmiş; her biri en fazla 100 kelimelik Tertullianus ve Augustinus metinlerini kesin söz veya niyet atfetmeden çözümler. Kişisel görüş bildirmeye zorlamadan kurmaca bir kişinin görüşünü adil biçimde yeniden kurup değerlendirir.",
    evidence: "Felsefi soru haritası, kısa problem değerlendirme metni ve öz/akran değerlendirme",
  },
  {
    title: "Akıl ile inancı uzlaştırma girişimleri",
    concepts: "akıl, inanç, vahiy, hakikat, yorum, temellendirme, iddia, gerekçe ve sonuç",
    inquiry: "Akıl ve inanç arasında zorunlu bir çatışma var mıdır?",
    discussion: "Aynı hakikat iddiası farklı gerekçelendirme yollarıyla savunulabilir mi?",
    application: "Kaynağı ve bağlamı belirtilmiş, en fazla 100 kelimelik Farabi, Gazali ve İbn Rüşd metinlerinde iddia, gerekçe, varsayım ve sonucu çözümler; İslam felsefesini tek görüşe ve Gazali–Meşşai tartışmasını basit bir akıl–inanç karşıtlığına indirgemez.",
    evidence: "Argüman anatomisi, karşılaştırma matrisi ve açık uçlu değerlendirme",
  },
  {
    title: "Akıl–gönül–inanç ilişkisi",
    concepts: "akıl, gönül, inanç, hikmet, sevgi, deneyim, anlam, sembol ve yorum",
    inquiry: "Gönül kavramı akıl–inanç ilişkisine hangi yeni boyutu ekler?",
    discussion: "Şiirsel veya sembolik anlatım felsefi bir düşünce taşıyabilir mi?",
    application: "Yûsuf Has Hâcib, Hacı Bektaş Veli, Yunus Emre, Mevlana ve Âşık Paşa'dan kaynağı belirtilmiş, yaş düzeyine uyarlanmış ve her biri en fazla 100 kelimelik tematik parçaları kavram ve düşünce bakımından karşılaştırır; düşünürleri yalnız edebî şahsiyet veya tek tip bir gelenek olarak sunmaz.",
    evidence: "Akıl–gönül–inanç kavram ağı, karşılaştırmalı paragraf ve akran geribildirimi",
  },
  {
    title: "Aklın sınırları, varoluşsal seçim ve felsefi metin performans görevi",
    concepts: "aklın sınırları, inanç, varoluşsal seçim, sorumluluk, tez, argüman, karşı görüş, kaynak, alıntı ve parafraz",
    inquiry: "Aklın sınırını kabul etmek inancı temellendirir mi?",
    discussion: "Bir görüşün felsefi olması için hangi nitelikleri taşıması gerekir?",
    application: "Kierkegaard'ın Korku ve Titreme eserinden kaynağı ve bağlamı doğrulanmış, en fazla 100 kelimelik bir parça veya açıkça belirtilmiş öğretmen uyarlaması üzerinde çalışır; kişisel inanç beyanı yerine kurmaca ya da üçüncü kişi görüşünü seçebilir. Tez, gerekçe, karşı görüş, yanıt ve sonuç içeren felsefi metninde alıntı ile parafrazı ayırır ve görüşü dinî kanaate göre değil felsefi ölçütlerle değerlendirir.",
    evidence: "Kaynaklı felsefi metin, dereceli puanlama anahtarı, akran dönütü ve öz değerlendirme",
  },
]);


const literatureAndPhilosophyWeeks: readonly WeeklyContent[] = Object.freeze([
  {
    title: "Edebiyat ve felsefenin biçim, amaç ve dil bakımından ilişkisi",
    concepts: "edebiyat, felsefe, biçim, içerik, imge, kavram, anlatım ve anlam",
    inquiry: "Edebiyat ve felsefe aynı soruları farklı yollarla mı ele alır?",
    discussion: "Edebî bir metin argüman, felsefi bir metin estetik kaygı taşıyabilir mi?",
    application: "İki edebî ve iki felsefi kısa metni biçim, içerik, dil, amaç ve gerekçelendirme ölçütleriyle karşılaştırır; edebî olanı yalnız duyguyla, felsefi olanı yalnız soyut kavramla özdeşleştirmez.",
    evidence: "Edebî–felsefi metin karşılaştırma tablosu ve açık uçlu çıkış bileti",
  },
  {
    title: "Edebiyat–felsefe ilişkisinin temel problemleri ve hayatla bağlantısı",
    concepts: "felsefi problem, estetik kaygı, anlam, gerçeklik, yorum, felsefi roman ve felsefi şiir",
    inquiry: "Edebî bir eser hangi koşullarda felsefi değer taşır?",
    discussion: "Edebî unsurlara felsefi bakış ile edebî unsurlarla felsefe yapmak aynı etkinlik midir?",
    application: "Kişisel okuma geçmişi veya sanatsal yetenek açıklatmadan, kurmaca kültürel karşılaşmalar üzerinden iki temel problemi ayırır; her problem için hayatla ilişkili felsefi bir soru ve gerekçeli problem haritası oluşturur.",
    evidence: "Problem–hayat ilişkisi çalışma kâğıdı, problem haritası ve süreç kontrol listesi",
  },
  {
    title: "Edebî unsurlara felsefi bakış; filozof argümanlarını çözümleme",
    concepts: "argüman, öncül, sonuç, karşı görüş, estetik değer, yorum ve metin kanıtı",
    inquiry: "Bir edebî eserin felsefi değeri biçiminden mi, içeriğinden mi doğar?",
    discussion: "Bir düşünürün edebiyat hakkındaki görüşü, bütün edebî eserler için geçerli olabilir mi?",
    application: "Voltaire, N. Hartmann, Iris Murdoch ve Jacques Derrida'nın kaynağı, eseri ve tarihsel bağlamı belirtilmiş; her biri en fazla 100 kelimelik alıntı, parafraz veya açıkça etiketlenmiş öğretmen uyarlamalarında iddia, gerekçe, varsayım ve sonucu çözümler; düşünür adını argümanın doğruluk kanıtı saymaz.",
    evidence: "Filozof argümanları öncül–sonuç–itiraz şeması ve gerekçeli kısa yanıt",
  },
  {
    title: "Türk edebiyatının farklı türlerinde felsefi kavram ve problemler",
    concepts: "kültürel bağlam, destan, atasözü, söylev, fıkra, hikâye, şiir, roman, anlatıcı, karakter ve yorum",
    inquiry: "Farklı edebî türler aynı felsefi problemi nasıl dönüştürür?",
    discussion: "Etkileyici veya geleneksel bir söz, hangi koşullarda felsefi argüman sayılabilir?",
    application: "Türk edebiyatından destan, atasözü, söylev, fıkra, hikâye, şiir ve roman türlerindeki kaynağı belirtilmiş, her biri en fazla 100 kelimelik örnekleri istasyon tekniğiyle inceler; açık ifadeyi yorumdan ayırır ve anlatıcı, karakter ile yazar görüşünü özdeşleştirmeden kavram–soru–argüman matrisi oluşturur.",
    evidence: "Türler arası kavram–soru–argüman matrisi ve metin kanıtı kaydı",
  },
  {
    title: "Edebî unsurlarla felsefe yapma ve varoluşsal temalar",
    concepts: "felsefi roman, felsefi şiir, varoluş, sorumluluk, umut, yorum, tez ve karşı görüş",
    inquiry: "Edebî dil felsefi düşünceyi güçlendirir mi, belirsizleştirir mi?",
    discussion: "Edebî dilin felsefi düşünceyi iletmedeki en güçlü ve en zayıf yönleri nelerdir?",
    application: "Parmenides, Platon; Yûsuf Has Hâcib, Edip Ahmet Yükneki, Yunus Emre, Âşık Paşa; Dostoyevski, Hölderlin, Unamuno; Tanpınar, Kafka, Sartre ve Camus havuzundan en az üç tarihsel-kültürel kümeye yayılan, kaynağı belirtilmiş ve en fazla 100 kelimelik kısa metinleri karşılaştırır. Yalnızlık, acı, umutsuzluk veya aile yaşantısını açıklamadan kurmaca karakter ya da üçüncü kişi üzerinden tez, gerekçe ve karşı görüş geliştirir.",
    evidence: "Tez–gerekçe–karşı görüş kartı, karşılaştırma notu ve taslak felsefi paragraf",
  },
  {
    title: "Edebiyat–felsefe ilişkisi; felsefi metin performans görevi",
    concepts: "felsefi problem, tez, gerekçe, metin kanıtı, karşı görüş, yanıt, sonuç, kaynak, alıntı ve parafraz",
    inquiry: "Edebiyat, felsefi düşünce üretmenin meşru bir yolu mudur?",
    discussion: "Bir felsefi metnin değeri savunduğu görüşten mi, görüşü gerekçelendirme biçiminden mi doğar?",
    application: "Doğrulanmış kaynaklardan hareketle açık problem, savunulabilir tez, en az iki gerekçe, metin kanıtı, adil karşı görüş, yanıt ve sonuç içeren bireysel bir felsefi metin yazar. Her alıntıyı en fazla 100 kelimeyle sınırlar; alıntı, parafraz, sadeleştirme ve öğretmen uyarlamasını ayırır. Edebî zevki, yaratıcı yazarlığı veya kişisel yaşantısı yerine felsefi rubrik ölçütleriyle akran dönütü alıp metnini düzeltir.",
    evidence: "Kaynaklı felsefi metin, analitik rubrik, akran dönütü ve öz değerlendirme",
  },
]);

const weeklyContentByOutcome: Readonly<Record<string, readonly WeeklyContent[]>> = Object.freeze({
  "FEL.10.1.1": natureOfPhilosophyWeeks,
  "FEL.10.2.1": logicAndArgumentationWeeks,
  "FEL.10.2.2": logicAndArgumentationWeeks,
  "FEL.10.3.1": ontologyWeeks,
  "FEL.10.4.1": epistemologyWeeks,
  "FEL.10.5.1": ethicsWeeks,
  "FEL.10.6.1": aestheticsWeeks,
  "FEL.11.1.1": environmentalPhilosophyWeeks,
  "FEL.11.1.2": environmentalPhilosophyWeeks,
  "FEL.11.2.1": technologyAndLifeWeeks,
  "FEL.11.2.2": technologyAndLifeWeeks,
  "FEL.11.3.1": reasonAndFaithWeeks,
  "FEL.11.3.2": reasonAndFaithWeeks,
  "FEL.11.4.1": literatureAndPhilosophyWeeks,
  "FEL.11.4.2": literatureAndPhilosophyWeeks,
});

export function getLessonStudioWeekCount(unitCode: string, durationHours: number): number {
  if (unitCode === "F10_U3" || unitCode === "F10_U5" || unitCode === "F10_U6" || unitCode === "F11_U1" || unitCode === "F11_U2" || unitCode === "F11_U3" || unitCode === "F11_U4") return durationHours / 2;
  return durationHours;
}

export function getWeeklyContent(outcomeCode: string, week: number): WeeklyContent | null {
  return weeklyContentByOutcome[outcomeCode]?.[week - 1] ?? null;
}

export function getUnitWeekFocus(unitCode: string, week: number): string | null {
  if (unitCode === "F10_U1") return natureOfPhilosophyWeeks[week - 1]?.title ?? null;
  if (unitCode === "F10_U2") return logicAndArgumentationWeeks[week - 1]?.title ?? null;
  if (unitCode === "F10_U3") return ontologyWeeks[week - 1]?.title ?? null;
  if (unitCode === "F10_U4") return epistemologyWeeks[week - 1]?.title ?? null;
  if (unitCode === "F10_U5") return ethicsWeeks[week - 1]?.title ?? null;
  if (unitCode === "F10_U6") return aestheticsWeeks[week - 1]?.title ?? null;
  if (unitCode === "F11_U1") return environmentalPhilosophyWeeks[week - 1]?.title ?? null;
  if (unitCode === "F11_U2") return technologyAndLifeWeeks[week - 1]?.title ?? null;
  if (unitCode === "F11_U3") return reasonAndFaithWeeks[week - 1]?.title ?? null;
  if (unitCode === "F11_U4") return literatureAndPhilosophyWeeks[week - 1]?.title ?? null;
  return null;
}

export function specializePhasesForWeek(
  outcomeCode: string,
  week: number,
  phases: readonly PhaseDefinition[],
): PhaseDefinition[] {
  const focus = getWeeklyContent(outcomeCode, week);
  if (!focus) return structuredClone(phases) as PhaseDefinition[];

  const preparation = week === 1
    ? `“${focus.title}” odağında ön bilgileri ve ilk kavramsal ayrımları görünür kılar.`
    : `Önceki haftanın öğrenme kanıtını “${focus.title}” odağına bağlayan kısa geçiş sorusu sunar.`;

  return [
    { ...phases[0], facilitator: preparation, learner: "Haftanın odağına ilişkin ilk görüşünü, dayandığı varsayımı ve merak sorusunu yazar.", evidence: `${focus.title} başlangıç kaydı` },
    { ...phases[1], facilitator: `“${focus.inquiry}” sorusunu açan birbiriyle gerilimli iki örnek sunar.`, learner: "Örneklerdeki felsefi gerilimi belirler ve araştırılabilir bir soru üretir.", evidence: `${focus.title} problem fark etme notu` },
    { ...phases[2], facilitator: `${focus.inquiry} Soru zincirini bu haftanın kavram ve problem sınırında yönetir.`, learner: "Temel varsayımları, olası yanıtları ve sonuçları problem–iddia–gerekçe düzeninde sorgular.", evidence: `${focus.title} sorgulama zinciri` },
    { ...phases[3], facilitator: `${focus.concepts} kavramlarını örnek, karşı örnek ve gerekli ayrımlarla yapılandırır.`, learner: "Haftanın kavramlarını doğru ilişkilerle kavram ağına dönüştürür ve bir sınır durum ekler.", evidence: `${focus.title} kavram ağı` },
    { ...phases[4], facilitator: `“${focus.discussion}” tartışmasını iddia, gerekçe, itiraz ve yanıt ölçütleriyle yönetir.`, learner: "Bir görüşü problem ve argümanla ilişkilendirir; karşı görüşü adil biçimde yeniden kurup gerekçeli olarak değerlendirir.", evidence: `${focus.title} görüş ve argüman kaydı` },
    { ...phases[5], facilitator: "Haftaya özgü uygulamayı kaynak, bağlam ve kanıt kurallarıyla sunar.", learner: focus.application, evidence: focus.evidence },
    { ...phases[6], facilitator: "Haftanın kavram doğruluğu, problem bağlantısı, argüman değerlendirme ve metin kanıtını ölçen kısa görev uygular.", learner: "Yanıtını haftanın kavramı, uygun problem bağlantısı ve kanıtla destekler; rubrik dönütüyle düzeltir.", evidence: `${focus.title} mini rubriği ve revize yanıt` },
    { ...phases[7], facilitator: "Başlangıç görüşünü yeniden gösterir; değişimi bu haftanın kanıtı ve bir rubrik ölçütüyle açıklatır.", learner: "Görüşündeki değişimi veya sürekliliği haftanın kavram, argüman ya da metin kanıtına dayanarak açıklar.", evidence: `${focus.title} öz-yansıtma kaydı` },
    { ...phases[8], facilitator: `“${focus.title}” odağındaki kavram–problem–görüş–kanıt zincirini sınıf senteziyle tamamlar.`, learner: "Haftanın konusuna özgü bir sonuç cümlesi ve araştırmaya değer açık bir soru teslim eder.", evidence: `${focus.title} sonuç ve çıkış sorusu` },
  ];
}
