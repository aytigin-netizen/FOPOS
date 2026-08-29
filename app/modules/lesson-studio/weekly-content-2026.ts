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
    title: "Bilgi felsefesinin konusu; bilgi–sanı ayrımı ve bilginin imkânı",
    concepts: "bilgi, inanç, sanı, doğruluk, gerçeklik, gerekçelendirme, özne, nesne, kuşku ve kesinlik",
    inquiry: "Doğru bir inanç hangi koşullarda bilgi sayılabilir ve insan kesin bilgiye ulaşabilir mi?",
    discussion: "Sanının doğru çıkması onu bilgiye dönüştürür mü; kuşku bilgiye engel midir?",
    application: "Platon'un mağara benzetmesi bağlamında görünüş, sanı, gerçeklik ve bilgi ilişkisini çözümler; kuşkucu ve dogmatik iki bilgi iddiasını problem, iddia, gerekçe ve sonuç bakımından karşılaştırır.",
    evidence: "Bilgi–sanı kavram ağı, gerekçeli ayrım kartı ve imkân görüşleri karşılaştırması",
  },
  {
    title: "Kuşkucu argümanlar ve yöntemsel kuşku; Gorgias, Pyrrhoncu gelenek ve Descartes",
    concepts: "kuşkuculuk, görünüş, yargıyı askıya alma, aktarılabilirlik, yöntemsel kuşku, rüya argümanı ve kesinlik",
    inquiry: "Kuşku bilginin imkânsızlığını mı gösterir, yoksa bilginin dayanaklarını sınama yolu olabilir mi?",
    discussion: "Pyrrhoncu kuşku ile Descartes'ın yöntemsel kuşkusu amaç ve sonuç bakımından nasıl ayrılır?",
    application: "Gorgias ve Pyrrhoncu yaklaşımı kesin niyet veya söz atfetmeden argüman basamaklarıyla inceler; Descartes'ın rüya argümanını iddia, gerekçe, varsayım ve sonuç bakımından çözüp iki kuşku biçimini karşılaştırır.",
    evidence: "Karşılaştırmalı kuşku argümanı çözümleme formu ve yöntemsel kuşku şeması",
  },
  {
    title: "Bilginin kaynağı; rasyonalizm, empirizm, kritisizm ve entüisyonizm",
    concepts: "akıl, deney, a priori, a posteriori, rasyonalizm, empirizm, kritisizm, sezgi ve entüisyonizm",
    inquiry: "Bilginin oluşumunu akıl, deney, zihnin katkısı ve sezgi yaklaşımları nasıl açıklar?",
    discussion: "Tek bir kaynak görüşü bilginin bütün türlerini açıklamaya yeter mi?",
    application: "Descartes, Locke, Kant ve Bergson bağlamlarındaki görüşleri kaynak, öznenin rolü, gerekçelendirme, örnek ve sınır boyutlarında; düşünür adını doğruluk kanıtı saymadan karşılaştırır.",
    evidence: "Dört kaynak görüşlü karşılaştırma ve argüman matrisi",
  },
  {
    title: "Doğruluk ölçütleri ve bilgi felsefesi metni inceleme performansı",
    concepts: "uygunluk, tutarlılık, tümel uzlaşım, yarar, doğrulama, kaynak, kavram, problem, tez, gerekçe ve metin kanıtı",
    inquiry: "Bir bilgi iddiası ve onu savunan felsefi metin hangi ölçütlerle adil biçimde değerlendirilebilir?",
    discussion: "Tek bir doğruluk ölçütü bütün bilgi alanlarında ve bütün felsefi metinlerde yeterli olabilir mi?",
    application: "Güncel bir bilgi iddiasını uygunluk, tutarlılık, tümel uzlaşım ve yarar ölçütleriyle sınar; kaynağı belirtilmiş, alıntı ile parafrazı ayrılmış bir bilgi felsefesi metninde kavram, problem, tez, gerekçe, sonuç ve metin kanıtını altı boyutlu formla inceler ve akran dönütüyle revize eder.",
    evidence: "Dört doğruluk ölçütlü değerlendirme, kaynaklı metin inceleme formu ve revize performans ürünü",
  },
]);

const natureOfPhilosophyWeeks: readonly WeeklyContent[] = Object.freeze([
  {
    title: "Felsefenin anlamı, bilgelik sevgisi ve ortak tanımının imkânı",
    concepts: "felsefe, bilgelik, sevgi, arayış, filozof, tanım, görüş, gerekçe ve açık uçluluk",
    inquiry: "Felsefe bilgeliğe sahip olmak mı, bilgeliği aramak mı; bütün gelenekleri kapsayan ortak bir tanımı yapılabilir mi?",
    discussion: "Felsefenin farklı tanımlara sahip olması onun belirsiz olduğunu mu gösterir?",
    application: "Felsefe, filozof ve bilgelik kavramlarını gündelik kullanımlarıyla karşılaştırır; farklı filozoflara ait kaynağı ve bağlamı belirtilmiş tanımları ortak ölçüt, ayrım ve sınırlar bakımından inceleyerek gerekçeli bir tanım önerir.",
    evidence: "Felsefe–bilgelik kavram ağı, tanım karşılaştırma matrisi ve gerekçeli tanım önerisi",
  },
  {
    title: "Felsefi düşüncenin özellikleri ve ortaya çıkışı; mitostan logosa geçiş",
    concepts: "hayret, merak, kuşku, sorgulama, rasyonellik, tutarlılık, eleştirellik, refleksiyon, mitos ve logos",
    inquiry: "Bir düşünceyi felsefi yapan özellikler ve bu düşünme biçimini mümkün kılan koşullar nelerdir?",
    discussion: "Mitos ile logos arasındaki geçiş kesin bir kopuş mudur; kuşku ve eleştiri olmadan felsefi düşünce kurulabilir mi?",
    application: "Gündelik düşünme örneklerini felsefi düşüncenin özellikleriyle sınar; felsefi düşüncenin ortaya çıkış koşullarını neden–sonuç ilişkileriyle zaman şeridine yerleştirip tek nedenli açıklamaları eleştirir.",
    evidence: "Felsefi düşünce ölçüt tablosu, sınır durum açıklaması ve kanıta dayalı ortaya çıkış şeridi",
  },
  {
    title: "Felsefi düşüncenin tarihsel gelişimi, dönemleri ve dünya felsefe gelenekleri",
    concepts: "Antik Çağ, Orta Çağ, Rönesans, modern ve çağdaş felsefe, gelenek, kültür, süreklilik ve dönüşüm",
    inquiry: "Felsefi problemler tarihsel ve kültürel koşullarla birlikte nasıl değişir ve farklı geleneklerde nasıl biçimlenir?",
    discussion: "Felsefe tarihi doğrusal, tek nedenli veya tek coğrafyalı bir ilerleme olarak okunabilir mi?",
    application: "Başlıca dönemleri öne çıkan problem, kavram ve koşullarla eşleştirir; Hint, Çin, Antik Yunan, Türk–İslam ve modern Batı geleneklerinden güvenilir örnekleri problem ve yöntem bakımından karşılaştırarak süreklilik ve dönüşümü açıklar.",
    evidence: "Dönem–problem–koşul tablosu, dünya gelenekleri karşılaştırma haritası ve kaynaklı çıkarım",
  },
  {
    title: "Felsefi sorunun özellikleri ve felsefenin bilim, din ve sanatla ilişkisi",
    concepts: "felsefi soru, kavramsallık, temellendirme, tartışılabilirlik, felsefe, bilim, din, sanat, amaç ve yöntem",
    inquiry: "Bir soruyu felsefi yapan nedir ve felsefenin soruları bilim, din ve sanatın sorularından nasıl ayrılır?",
    discussion: "Cevabı kesin olmayan her soru felsefi midir; felsefe diğer alanların üstünde bir değerlendirme alanı mıdır?",
    application: "Gündelik ve olgusal soruları felsefi soru ölçütleriyle sınıflandırıp özgün bir felsefi soru kurar; felsefe, bilim, din ve sanatı amaç, soru türü, yöntem, doğrulama ve ürün boyutlarında karşılaştırarak aşırı genellemeleri karşı örnekle sınar.",
    evidence: "Felsefi soru kontrol listesi, özgün soru ve beş boyutlu alan karşılaştırma matrisi",
  },
  {
    title: "Felsefenin bireysel–toplumsal işlevleri; röportaj ve performans görevi",
    concepts: "öz-farkındalık, eleştirel düşünme, özgürlük, sorumluluk, toplumsal eleştiri, işlev, görüşme etiği, kaynak ve sentez",
    inquiry: "Felsefenin ne olduğu ve birey ile toplum için ne işe yaradığına ilişkin görüşler nasıl adil biçimde çözümlenebilir?",
    discussion: "Felsefenin değeri pratik yararına mı bağlıdır; toplumdaki felsefe algısı ders boyunca geliştirilen anlayıştan neden farklılaşabilir?",
    application: "Güncel bir bireysel veya toplumsal sorunu felsefenin işlevleri açısından inceler; farklı yaş ve meslek gruplarıyla izin ve görüşme etiği kurallarına uygun yürütülen röportaj yanıtlarını ders ölçütleriyle çözümler, kaynaklandırır ve akran dönütüyle geliştirir.",
    evidence: "Bireysel–toplumsal işlev çözümlemesi, kaynak ve izin kayıtlı röportaj ürünü, öz değerlendirme",
  },
]);

const logicAndArgumentationWeeks: readonly WeeklyContent[] = Object.freeze([
  {
    title: "Düşünme–dil–anlam ilişkisi; bağlam ve uyumlu ilişki modeli",
    concepts: "düşünme, dil, anlam, kavram, ifade, gösterge, bağlam, nedensellik, karşılıklı etki ve model",
    inquiry: "Düşünme ile dil arasındaki çok yönlü ilişkiler bağlamı gözeten çelişkisiz bir modelde nasıl açıklanabilir?",
    discussion: "Dil düşünmeyi mi biçimlendirir, düşünme dili mi; birlikte değişim nedensellik göstermeye yeter mi?",
    application: "Aynı düşüncenin farklı ifadelerini ve aynı ifadenin farklı bağlamlarını karşılaştırır; gözlem, birlikte değişim ve nedensel yorumu ayırarak düşünme–dil ilişkisini doğru yön, gerekçe, karşı örnek ve sınır durum içeren bir modelde birleştirir.",
    evidence: "Düşünme–dil–anlam kavram ağı, bağlam karşılaştırması ve çelişkisiz ilişki modeli",
  },
  {
    title: "Mantık ve argümantasyonun temel kavramları; argümanın yapısı",
    concepts: "mantık, akıl yürütme, argüman, iddia, öncül, sonuç, çıkarım, örtük öncül, tutarlılık, geçerlilik ve sağlamlık",
    inquiry: "Bir ifadeler dizisini argüman yapan nedir ve sonuç öncüllere hangi çıkarım bağıyla bağlanır?",
    discussion: "Öncülleri doğru veya ikna edici olan her argüman mantıksal olarak geçerli midir?",
    application: "Gündelik ve felsefi örneklerde iddia, öncül ve sonucu sınıflandırır; çıkarım bağını ve örtük öncülü gerekçelendirir; tutarlılık, geçerlilik, sağlamlık ve ikna ediciliği örnek ve karşı örnekle ayırır.",
    evidence: "Mantık kavramları güvenlik tablosu, öncül–sonuç çizelgesi ve çıkarım bağı açıklaması",
  },
  {
    title: "Argümanı yeniden ifade etme, değerlendirme, safsata çözümleme ve revizyon",
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

const meaningOfLifeWeeks: readonly WeeklyContent[] = Object.freeze([
  {
    title: "Hayatın anlamı, amacı ve değeri üzerine felsefi sorular",
    concepts: "anlam, amaç, değer, iyi hayat, mutluluk ve felsefi soru",
    inquiry: "Hayatı anlamlı kılan şey, onu değerli kılan şeyle aynı mıdır?",
    discussion: "Hayatın amacı ile hayatın anlamı aynı felsefi problemi mi ifade eder?",
    application: "Kişisel hayat hikâyesi veya hassas yaşantı açıklaması istemeden, kurmaca yaşam kesitlerindeki olgusal, psikolojik ve felsefi soruları ayırır; en az iki felsefi soru oluşturur ve sınıflandırmasını gerekçelendirir. Yazılı çözümleme, gözlemci–özetleyici rolü veya anonim soru kartından birini seçebilir.",
    evidence: "Soru sınıflandırma tablosu ve güvenli katılım çıkış bileti",
  },
  {
    title: "Mutluluk–hayat ve varoluş–kendi olma problemleri",
    concepts: "mutluluk, iyi hayat, varoluş, kendi olma, özgürlük ve sorumluluk",
    inquiry: "Mutlu olmak iyi ve anlamlı bir hayat için yeterli midir?",
    discussion: "Kendi olmak, yalnızca kişisel tercihleri izlemek anlamına gelir mi?",
    application: "Kurmaca karakterler üzerinden mutluluk–hayat ile varoluş–kendi olma problemlerini kavram, soru ve hayat durumu bakımından ayırır; duygu ifadesiyle felsefi gerekçeyi ve görüşle argümanı karıştırmadan problem haritası oluşturur.",
    evidence: "Problem–kavram–hayat ilişkisi çalışma kâğıdı ve öz/akran değerlendirme",
  },
  {
    title: "Mutluluk ve hayat ilişkisine yönelik filozof argümanları",
    concepts: "erdem, haz, akıl, irade, güç, acı, mutluluk, öncül, sonuç ve itiraz",
    inquiry: "Mutluluk insanın kontrolünde midir?",
    discussion: "Mutluluğu erdem, haz veya acının azaltılmasıyla açıklayan yaklaşımlardan biri tek başına yeterli midir?",
    application: "Kung-Fu-Tzu, Sokrates, Epiktetos, Augustinus, Farabi, İbn Miskeveyh, Yûsuf Has Hâcib ve Schopenhauer havuzundan kaynağı, eseri ve tarihsel bağlamı belirtilmiş; alıntı, parafraz veya öğretmen uyarlaması olduğu açıkça etiketlenmiş ve her biri en fazla 100 kelimelik kısa görüşleri öncül–sonuç–kavram–itiraz düzeninde çözümler; düşünür adını otorite kanıtı saymaz.",
    evidence: "Öncül–sonuç–kavram–itiraz matrisi",
  },
  {
    title: "Varoluşçuluğun ortaya çıkışı, özellikleri ve kendi olma problemi",
    concepts: "varoluş, öz, özgürlük, sorumluluk, kaygı, yabancılaşma ve tarihsel bağlam",
    inquiry: "İnsan kendisi olmayı seçebilir mi?",
    discussion: "Varoluşçuluğu yalnızca karamsarlıkla açıklamak hangi felsefi ve tarihsel ayrımları görünmez kılar?",
    application: "Varoluşçuluğa kaynaklık eden felsefi, toplumsal, bilimsel-teknolojik ve politik gelişmeleri tek nedenli, tek coğrafyalı veya tek tip okul anlatısına indirgemeden bağlam haritasına yerleştirir; felsefi kaygı ve yabancılaşma kavramlarını klinik tanı gibi kullanmaz.",
    evidence: "Bağlam–kavram–problem zaman ve ilişki şeması",
  },
  {
    title: "Varoluş, kendi olma ve saçma üzerine karşılaştırmalı argümanlar",
    concepts: "umutsuzluk, kaygı, ölüm, yabancılaşma, yalnızlık, saçma, başkası, tez ve karşı görüş",
    inquiry: "Sonlu ve belirsiz bir yaşamda anlam nasıl kurulabilir?",
    discussion: "Hayatın hazır bir anlamının bulunmaması, anlamlı bir hayatın imkânsız olduğunu gösterir mi?",
    application: "Kierkegaard, Nietzsche, Heidegger, Camus ve Sartre'ın kaynağı ve bağlamı doğrulanmış görüşlerini kavram, iddia, gerekçe, güç ve sınır bakımından karşılaştırır. Ölüm, umutsuzluk, yalnızlık, travma, ruh sağlığı, kendine zarar verme veya aile yaşantısı hakkında kişisel açıklama istemeden kurmaca karakter ya da üçüncü kişi üzerinden tez ve karşı görüş geliştirir; kavramları klinik belirtiye dönüştürmez veya risk davranışını romantikleştirmez.",
    evidence: "Karşılaştırmalı argüman formu ve tez–karşı görüş kartı",
  },
  {
    title: "Hayatın anlamı üzerine felsefi metin performansı",
    concepts: "problem, metafor, tez, gerekçe, kaynak, metin kanıtı, karşı görüş, yanıt ve sonuç",
    inquiry: "Hayatın anlamı bulunur mu, kurulur mu?",
    discussion: "Bir hayat görüşünün felsefi değeri sonucundan mı, gerekçelendirilme biçiminden mi doğar?",
    application: "Kurmaca örnek olay veya metafordan ve önceki haftalarda doğrulanmış kaynaklardan hareketle açık problem, savunulabilir tez, en az iki gerekçe, metin kanıtı, adil karşı görüş, yanıt ve sonuç içeren bireysel felsefi metin yazar. Alıntı, parafraz, sadeleştirme ve öğretmen uyarlamasını ayırır; her alıntıyı en fazla 100 kelimeyle sınırlar. Kişisel hayat öyküsü, inanç veya ruh sağlığı açıklaması yerine felsefi rubrikle akran dönütü alıp metnini düzeltir.",
    evidence: "Kaynaklı felsefi metin, analitik rubrik, akran dönütü ve öz değerlendirme",
  },
]);


const lawAndPhilosophyWeeks: readonly WeeklyContent[] = Object.freeze([
  {
    title: "Hukukun gereği ve önemi; kural, yasa ve özgürlük ilişkisi",
    concepts: "hukuk, kural, yasa, hak, özgürlük, düzen, güvenlik ve meşruiyet",
    inquiry: "Kurallar ve yasalar özgürlüğü yalnızca sınırlar mı, aynı zamanda mümkün de kılar mı?",
    discussion: "Hukukun olmadığı bir toplumda kişisel özgürlük ve güvenlik birlikte korunabilir mi?",
    application: "Kişisel veya ailevi hukuk yaşantısı açıklaması istemeden kurmaca okul ve toplum senaryolarında kural, yasa, hak ve özgürlük kavramlarını ayırır; hukukun gereğini özgürlük, güvenlik ve toplumsal düzen ölçütleriyle gerekçelendirir. Yazılı çalışma, gözlemci–özetleyici rolü veya anonim soru kartından birini seçebilir.",
    evidence: "Kural–yasa–hak–özgürlük kavram matrisi ve gerekçeli çıkış bileti",
  },
  {
    title: "Hukukun kaynağı; doğal hukuk, pozitif hukuk ve suç–ceza adaleti",
    concepts: "doğal hukuk, pozitif hukuk, yasallık, adalet, suç, ceza, orantılılık, caydırıcılık ve hakkaniyet",
    inquiry: "Bir yasa yürürlükte olduğu için mi adildir, adil olduğu için mi hukuk sayılmalıdır?",
    discussion: "Adil bir cezanın ölçütü suçla orantı, caydırıcılık veya hakkaniyetten hangisidir?",
    application: "Gerçek öğrenci suçu, mağduriyeti, aile davası veya devam eden süreç bilgisi istemeden kimliksizleştirilmiş ya da kurmaca olayları doğal hukuk ve pozitif hukuk bakımından karşılaştırır; suç ve cezayı yasallık, orantılılık, caydırıcılık ve hakkaniyet ölçütleriyle değerlendirir. Kaynağı, eseri ve tarihsel bağlamı belirtilmiş; alıntı, parafraz, sadeleştirme veya öğretmen uyarlaması olarak etiketlenmiş ve her biri en fazla 100 kelimelik kısa kaynak parçalarını kullanır.",
    evidence: "Doğal hukuk–pozitif hukuk karşılaştırma matrisi ve panel gözlem formu",
  },
  {
    title: "Hak ve özgürlüklerin hukuksal temelleri",
    concepts: "insan onuru, doğal hak, temel hak, özgürlük, eşitlik, evrensellik, ayrımcılık ve hukuksal güvence",
    inquiry: "Temel haklar devletin tanıdığı haklar mıdır, insan olmaktan doğan haklar mıdır?",
    discussion: "Hakların evrenselliği, farklı toplumlarda aynı biçimde uygulanmalarını zorunlu kılar mı?",
    application: "İnsan haklarının tarihsel gelişimini ve seçilmiş normatif belgeleri kişi onuru, hak, yükümlülük ve hukuksal güvence ilişkisiyle çözümler; normatif belgeyi felsefi argümanla özdeşleştirmeden ayrımcılık ve ırkçılık sorunlarını kurmaca üçüncü kişi vakaları üzerinden hak temelli ölçütlerle değerlendirir. Kişisel kimlik, mağduriyet veya siyasi tercih açıklaması istemez.",
    evidence: "Hak–temel–güvence çözümleme matrisi ve gerekçeli çözüm önerisi",
  },
  {
    title: "Ahlak–hukuk ilişkisi; yasallık, meşruiyet ve adalet",
    concepts: "ahlak, hukuk, yasallık, meşruiyet, adalet, yaptırım, vicdan, hak ve sorumluluk",
    inquiry: "Yasal olan her şey ahlaken doğru mudur; ahlaken yanlış olan her şey yasaklanmalı mıdır?",
    discussion: "Toplumda adaletin kurulmasında hukuk ile ahlak birbirinin yerini alabilir mi?",
    application: "Kurmaca ikilemlerde hukuk ve ahlak kurallarını kaynak, amaç, kapsam ve yaptırım bakımından karşılaştırır; görüşü nedeniyle öğrenciyi puanlamadan açık tez, gerekçe, adil karşı görüş ve yanıt geliştirir. Ayrımcı, insan onurunu zedeleyen veya şiddeti meşrulaştıran ifadeleri normalleştirmeden iddiaları hak, adalet ve zarar ölçütleriyle sınar.",
    evidence: "Hukuk–ahlak Venn şeması ve tez–gerekçe–itiraz–yanıt kartı",
  },
  {
    title: "Güncel hukuk sorunu üzerine kaynaklı felsefi metin performansı",
    concepts: "felsefi problem, tez, gerekçe, kaynak, kanıt, karşı görüş, yanıt, yasallık, meşruiyet ve adalet",
    inquiry: "Teknolojik ve toplumsal değişim karşısında adil bir hukuk hangi ölçütlere dayanmalıdır?",
    discussion: "Bir hukuk sorununun çözümünde yürürlükteki yasa mı, hak ve adalet ilkeleri mi önceliklidir?",
    application: "Özel hayatın gizliliği, yapay zekâ ve sorumluluk, fikir ve eser hakları, ifade özgürlüğü, cezada orantılılık veya dijital ayrımcılık gibi onaylı bir kurmaca problemden hareketle en az 250 kelimelik; açık problem, savunulabilir tez, en az iki gerekçe, en az iki güvenilir kaynak, adil karşı görüş, yanıt ve sonuç içeren felsefi metin yazar. Alıntı, parafraz, sadeleştirme ve öğretmen uyarlamasını ayırır; her kaynak parçasını en fazla 100 kelimeyle sınırlar. Gerçek kişi verisi, dava stratejisi veya bireysel hukuki danışmanlık üretmeden felsefi rubrikle akran dönütü alıp metnini düzeltir.",
    evidence: "Kaynaklı en az 250 kelimelik felsefi metin, analitik rubrik, akran dönütü ve öz değerlendirme",
  },
]);


const politicalPhilosophyWeeks: readonly WeeklyContent[] = Object.freeze([
  {
    title: "Siyaset felsefesinin konusu; adalet, özgürlük, eşitlik ve hak ilişkisi",
    concepts: "siyaset felsefesi, siyaset, adalet, özgürlük, eşitlik, hak, birey, toplum ve devlet",
    inquiry: "Adalet, özgürlük ve eşitlik aynı anda ve aynı ölçüde gerçekleştirilebilir mi?",
    discussion: "Bir toplumsal düzeni adil yapan, herkese aynı davranması mı yoksa farklı ihtiyaçları gözetmesi midir?",
    application: "Parti tercihi, oy davranışı, politik kimlik veya aile görüşü açıklaması istemeden kurmaca toplumsal durumlarda adalet, özgürlük, eşitlik ve hak kavramlarını ayırır; kavramların birey, toplum ve devletle ilişkisini gerekçeli bir kavram haritasında gösterir. Yazılı çalışma, gözlemci–özetleyici rolü veya anonim görüş kartından birini seçebilir.",
    evidence: "Siyaset felsefesi kavram haritası, gerekçeli yansıtma ve güvenli katılım çıkış bileti",
  },
  {
    title: "Devletin kökeni; iktidarın kaynağı ve meşruiyeti",
    concepts: "devlet, toplum, iktidar, otorite, güç, rıza, hukuk, meşruiyet ve egemenlik",
    inquiry: "Bir iktidarı meşru yapan güç, rıza, hukuk, gelenek veya adalet midir?",
    discussion: "Güçlü ve etkili bir iktidar aynı zamanda meşru sayılabilir mi?",
    application: "Devletin kökeni, iktidarın kaynağı ve meşruiyetine ilişkin bağlamı ve kaynağı belirtilmiş görüşleri problem, iddia, gerekçe ve sonuç bakımından karşılaştırır; güç, otorite ve meşruiyeti özdeşleştirmeden kurmaca yönetim örneklerini ortak ölçütlerle değerlendirir. Güncel kişi, parti veya yönetimi hedef göstermeden tarihsel ve felsefi düzlemde kalır.",
    evidence: "Devlet–iktidar–meşruiyet görüş ve argüman karşılaştırma matrisi",
  },
  {
    title: "İdeal düzenin imkânı; kaynak dağılımı, özgürlük–otorite dengesi ve ütopyalar",
    concepts: "ideal düzen, ütopya, distopya, adalet, eşitlik, özgürlük, güvenlik, refah, kaynak dağılımı ve otorite",
    inquiry: "Adil bir toplum için özgürlük, eşitlik, güvenlik ve refahtan hangisi öncelikli olmalıdır?",
    discussion: "İdeal bir düzen tasarımı farklı değerler arasındaki çatışmayı tamamen ortadan kaldırabilir mi?",
    application: "Kişisel siyasi görüş veya güncel parti tercihi açıklatmadan kurmaca toplum tasarımlarını adalet, eşitlik, özgürlük, güvenlik, refah ve kaynak dağılımı ölçütleriyle değerlendirir; istenen ütopya ile istenmeyen ütopyayı ayırır ve bir tez–adil karşı görüş–yanıt geliştirir. Millî bilinç ve vatanseverliği tek bir güncel siyasi görüşle özdeşleştirmez.",
    evidence: "Ütopya–distopya ölçüt tablosu, tez–karşı görüş kartı ve öz/akran değerlendirme",
  },
  {
    title: "Siyaset felsefesi metni inceleme performansı",
    concepts: "tarihsel bağlam, kavram, felsefi problem, tez, öncül, gerekçe, sonuç, metin kanıtı, itiraz ve karşı soru",
    inquiry: "Bir siyaset felsefesi metninin savunduğu düzeni hangi kavram, problem ve argümanlarla yeniden kurabiliriz?",
    discussion: "Bir siyasal düşüncenin tarihsel bağlamını bilmek, argümanının doğruluğunu değerlendirmek için yeterli midir?",
    application: "Platon'un Devlet, Aristoteles'in Politika, Orhon Yazıtları, Farabi'nin El-Medinetü’l-Fâzıla, Yûsuf Has Hâcib'in Kutadgu Bilig, İbn Haldun'un Mukaddime ve Hobbes'un Leviathan havuzundan dengeli dağıtılmış; yazar/eser ve tarihsel bağlamı belirtilmiş; alıntı, parafraz, sadeleştirme veya öğretmen uyarlaması olarak etiketlenmiş ve en fazla 100 kelimelik bir metni inceler. Kavram, problem, tez, gerekçe ve sonucu çarpıtmadan yeniden kurar; metin kanıtıyla güç ve sınırları değerlendirip adil itiraz geliştirir. Düşünür adını doğruluk kanıtı saymaz, metni güncel kişi veya partiyle özdeşleştirmez ve siyasi kanaate göre değil felsefi rubrikle dönüt alır.",
    evidence: "Kaynaklı altı boyutlu metin inceleme formu, analitik rubrik, akran dönütü ve revize ürün",
  },
]);

const philosophyOfReligionWeeks: readonly WeeklyContent[] = Object.freeze([
  {
    title: "Din felsefesinin konusu; teolojiyle ilişkisi, temel kavramları ve problem haritası",
    concepts: "din felsefesi, teoloji, din, ibadet, iman, inanç, kutsal, mucize, Tanrı ve vahiy",
    inquiry: "Din hakkında felsefi düşünmek ile teolojik düşünmek hangi yönlerden ayrılır?",
    discussion: "Din felsefesi ile teolojinin ortak sorular sorması, aynı yöntemi kullandıkları anlamına gelir mi?",
    application: "Dinî inanç, inançsızlık, mezhep, ibadet, aile inancı veya kişisel dinî yaşantı açıklaması istemeden yapılandırılmış bir metin üzerinden din felsefesi ile teolojiyi konu, amaç, yöntem ve gerekçelendirme bakımından karşılaştırır. Tanrı, ibadet, iman, inanç ve vahiy kavramlarını kendi cümleleriyle açıklar; Tanrı'nın varlığı, evrenin sonluluğu ve sonsuzluğu ile ruhun ölümsüzlüğü problemlerini bir problem haritasında sınıflandırır. Yazılı çalışma, gözlemci–özetleyici rolü veya anonim görüş kartından birini seçebilir; açıklama ve çıkarımlarını güvenilir kaynaklardan doğrular.",
    evidence: "Din felsefesi–teoloji karşılaştırma tablosu, kavram ve problem haritası, güvenli katılım çıkış bileti",
  },
  {
    title: "Tanrı'nın varlığına ilişkin görüş ve argümanlar; evrenin sonluluğu ve ruhun ölümsüzlüğü",
    concepts: "teizm, deizm, panteizm, panenteizm, ateizm, teleolojik argüman, kozmolojik argüman, ontolojik argüman, kötülük argümanı, evren ve ruh",
    inquiry: "Bir din felsefesi argümanı hangi ölçütlerle değerlendirilebilir?",
    discussion: "Bir argümanın felsefi gücü, vardığı sonuçtan mı yoksa öncül ve çıkarımlarının niteliğinden mi doğar?",
    application: "Teizm, deizm, panteizm, panenteizm ve ateizmi kişi veya toplulukların değeri hakkında hüküm vermeden temel iddia ve Tanrı–evren ilişkisi bakımından karşılaştırır. Teleolojik, kozmolojik, ontolojik ve kötülük argümanlarını görüşlerle özdeşleştirmeden öncül, sonuç, varsayım, güç ve sınır bakımından çözümler; evrenin sonluluğu ve sonsuzluğu ile ruhun ölümsüzlüğü problemlerine ilişkin düşünceleri aynı felsefi ölçütlerle değerlendirir. Hiçbir inanç veya inançsızlık biçimini varsayılan doğru cevap olarak sunmaz ve öğrenciyi kanaatine göre puanlamaz.",
    evidence: "Görüş–argüman karşılaştırma matrisi, argüman çözümleme formu ve gerekçeli yansıtma yazısı",
  },
  {
    title: "Din felsefesi metni inceleme performansı",
    concepts: "tarihsel bağlam, kavram, felsefi problem, tez, öncül, gerekçe, sonuç, metin kanıtı, itiraz, kaynak, alıntı ve parafraz",
    inquiry: "Bir metindeki din felsefesi problemi ve argümanı, kişisel inançtan bağımsız olarak nasıl incelenebilir?",
    discussion: "Bir din felsefesi metnini adil değerlendirmek için metnin vardığı sonucu benimsemek gerekir mi?",
    application: "Augustinus'un İtiraflar, Gazâlî'nin İhyâ-u Ulûmi’d-Din, İbn Rüşd'ün Tutarsızlığın Tutarsızlığı, David Hume'un din üzerine yazıları, G. W. F. Hegel'in Din Felsefesi Üzerine Dersler ve Alvin Plantinga'nın Tanrı, Özgürlük ve Kötülük eserleri havuzundan dengeli dağıtılmış; yazar, eser ve tarihsel-felsefi bağlamı belirtilmiş; alıntı, parafraz, sadeleştirme veya öğretmen uyarlaması olarak etiketlenmiş ve en fazla 100 kelimelik bir metni inceler. Kavram, problem, tez, gerekçe, sonuç ve metin kanıtını çarpıtmadan yeniden kurar; güçlü yön, sınır ve adil itiraz geliştirir. Düşünür adını doğruluk kanıtı saymaz, tek bir görüşü ait olduğu inanç geleneğinin tamamıyla özdeşleştirmez ve dinî kanaate göre değil felsefi rubrikle dönüt alır.",
    evidence: "Kaynaklı altı boyutlu metin inceleme formu, analitik rubrik, akran dönütü, öz değerlendirme ve revize ürün",
  },
]);

const philosophyOfScienceWeeks: readonly WeeklyContent[] = Object.freeze([
  {
    title: "Bilim felsefesinin konusu; bilimsel bilginin yapısı ve temel kavramlar",
    concepts: "bilim felsefesi, bilim, bilimsel yöntem, gözlem, deney, hipotez, kuram, yasa ve kanıt",
    inquiry: "Bir bilgi iddiasını bilimsel yapan özellikler nelerdir?",
    discussion: "Bilimsel kuramlar kanıtlanmamış tahminler, bilimsel yasalar da değişmez doğrular mıdır?",
    application: "İbnülheysem'in karanlık oda çalışması, Takiyüddin'in optik ve matematik çalışmaları veya Michelson–Morley deneyinden tarihsel bağlamı ve güvenilir kaynağı belirtilmiş bir örnek üzerinden bilimin konusunu, amacını ve yöntemini tartışır. Gözlem, deney, hipotez, kuram, yasa ve kanıtı birbirinin yerine kullanmadan ilişkilendirir; tarihsel çalışmayı güncel bilimsel iddia gibi sunmaz. Sağlık durumu, inanç, siyasi görüş veya başka hassas kişisel bilgi açıklaması istemeden yazılı çalışma, gözlemci–özetleyici rolü veya anonim soru kartından birini seçebilir.",
    evidence: "Bilimsel kavram ağı, deney–gözlem–hipotez–kuram–yasa ilişki şeması ve güvenli katılım çıkış bileti",
  },
  {
    title: "Bilimin ne olduğu, yapısı ve yöntemi; bilim ile bilim olmayanı ayırma problemi",
    concepts: "klasik bilim anlayışı, çağdaş bilim anlayışı, doğrulama, yanlışlanabilirlik, paradigma, bilimsel yöntem ve sınır çizme",
    inquiry: "Bilim ile bilim olmayanı ayırmak için tek ve kesin bir ölçüt bulunabilir mi?",
    discussion: "Bilim tek bir yöntemle mi ilerler; bilim olmayan her iddia değersiz, anlamsız veya yanlış mıdır?",
    application: "Rudolf Carnap, Karl Popper ve Thomas S. Kuhn'un kaynağı ve bağlamı belirtilmiş görüşlerini problem, temel iddia, ölçüt, gerekçe, güçlü yön ve sınır bakımından karşılaştırır; doğrulama, yanlışlanabilirlik ve paradigma kavramlarını özdeşleştirmez. Bilimsel bulgu, bilim insanının kişisel görüşü ve bilim felsefesi argümanını ayırır. Bilim olmayanı otomatik olarak değersiz, anlamsız veya yanlış saymaz; kişilerin inançlarını ya da kimliklerini hedef almayan kurmaca iddialarla sınır çizme ölçütlerini sınar. Milgram deneyi kullanılırsa yalnız tarihsel ve etik vaka olarak inceler; itaat deneyini canlandırmaz, öğrenciye baskı uygulamaz veya öğrenciyi aldatmaz. Öğrenciyi bilim hakkındaki kanaatine göre değil kavram, argüman ve kanıt ölçütleriyle değerlendirir.",
    evidence: "Carnap–Popper–Kuhn karşılaştırma matrisi, sınır çizme vaka formu ve gerekçeli değerlendirme",
  },
  {
    title: "Bilim felsefesi metni inceleme performansı",
    concepts: "tarihsel bağlam, kavram, felsefi problem, tez, öncül, gerekçe, sonuç, bilimsel bulgu, metin kanıtı, itiraz, kaynak, alıntı ve parafraz",
    inquiry: "Bir bilim felsefesi metnindeki problem ve argüman, bilimsel bulgudan nasıl ayrılarak incelenebilir?",
    discussion: "Bir bilim felsefesi görüşünün değeri düşünürün otoritesinden mi, argümanının gerekçelendirilme biçiminden mi doğar?",
    application: "Hans Reichenbach'ın Bilimsel Felsefenin Doğuşu, Karl R. Popper'ın Bilimsel Araştırmanın Mantığı, Aydın Sayılı'nın Hayatta En Hakiki Mürşit İlimdir, Thomas S. Kuhn'un Bilimsel Devrimlerin Yapısı ve Fuat Sezgin'in Bilim Tarihi Sohbetleri eserleri havuzundan dengeli dağıtılmış; yazar, eser ve tarihsel-felsefi bağlamı belirtilmiş; alıntı, parafraz, sadeleştirme veya öğretmen uyarlaması olarak etiketlenmiş ve en fazla 100 kelimelik bir metni inceler. Kavram, problem, tez, gerekçe, sonuç ve metin kanıtını çarpıtmadan yeniden kurar; bilimsel bulgu, bilim insanının kişisel görüşü ve bilim felsefesi argümanını ayırarak güçlü yön, sınır ve adil itiraz geliştirir. Düşünür adını doğruluk kanıtı saymaz; tek çalışmayı bilimsel uzlaşma gibi sunmaz; olgu, veri, gözlem, hipotez, model, kuram, yasa ve felsefi yorumu ayırır. Sağlık örneğini tıbbi tavsiyeye dönüştürmez ve öğrenciyi kanaatine göre değil altı boyutlu felsefi rubrikle değerlendirir.",
    evidence: "Kaynaklı altı boyutlu metin inceleme formu, analitik rubrik, akran dönütü, öz değerlendirme ve revize ürün",
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
  "FEL.10.7.1": politicalPhilosophyWeeks,
  "FEL.10.8.1": philosophyOfReligionWeeks,
  "FEL.10.9.1": philosophyOfScienceWeeks,
  "FEL.11.1.1": environmentalPhilosophyWeeks,
  "FEL.11.1.2": environmentalPhilosophyWeeks,
  "FEL.11.2.1": technologyAndLifeWeeks,
  "FEL.11.2.2": technologyAndLifeWeeks,
  "FEL.11.3.1": reasonAndFaithWeeks,
  "FEL.11.3.2": reasonAndFaithWeeks,
  "FEL.11.4.1": literatureAndPhilosophyWeeks,
  "FEL.11.4.2": literatureAndPhilosophyWeeks,
  "FEL.11.5.1": meaningOfLifeWeeks,
  "FEL.11.5.2": meaningOfLifeWeeks,
  "FEL.11.6.1": lawAndPhilosophyWeeks,
  "FEL.11.6.2": lawAndPhilosophyWeeks,
});

export function getLessonStudioWeekCount(unitCode: string, durationHours: number): number {
  if (unitCode === "F10_U1" || unitCode === "F10_U2" || unitCode === "F10_U3" || unitCode === "F10_U4" || unitCode === "F10_U5" || unitCode === "F10_U6" || unitCode === "F10_U7" || unitCode === "F10_U8" || unitCode === "F10_U9" || unitCode === "F11_U1" || unitCode === "F11_U2" || unitCode === "F11_U3" || unitCode === "F11_U4" || unitCode === "F11_U5" || unitCode === "F11_U6") return durationHours / 2;
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
  if (unitCode === "F10_U7") return politicalPhilosophyWeeks[week - 1]?.title ?? null;
  if (unitCode === "F10_U8") return philosophyOfReligionWeeks[week - 1]?.title ?? null;
  if (unitCode === "F10_U9") return philosophyOfScienceWeeks[week - 1]?.title ?? null;
  if (unitCode === "F11_U1") return environmentalPhilosophyWeeks[week - 1]?.title ?? null;
  if (unitCode === "F11_U2") return technologyAndLifeWeeks[week - 1]?.title ?? null;
  if (unitCode === "F11_U3") return reasonAndFaithWeeks[week - 1]?.title ?? null;
  if (unitCode === "F11_U4") return literatureAndPhilosophyWeeks[week - 1]?.title ?? null;
  if (unitCode === "F11_U5") return meaningOfLifeWeeks[week - 1]?.title ?? null;
  if (unitCode === "F11_U6") return lawAndPhilosophyWeeks[week - 1]?.title ?? null;
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
