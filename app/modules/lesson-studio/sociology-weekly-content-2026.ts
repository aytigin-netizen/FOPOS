import { getLessonStudioWeekCountByProgramRule } from "./lesson-studio-week-count.ts";
import { sociology2026Package } from "../../../src/curriculum-packages/sociology-2026.ts";

export type SociologyWeeklyContent = Readonly<{
  title: string;
  concepts: string;
  inquiry: string;
  discussion: string;
  application: string;
  evidence: string;
}>;

const weeks = (
  items: readonly [string, string, string, string, string, string][],
): readonly SociologyWeeklyContent[] =>
  Object.freeze(
    items.map(([title, concepts, inquiry, discussion, application, evidence]) =>
      Object.freeze({ title, concepts, inquiry, discussion, application, evidence }),
    ),
  );

/**
 * SOS.11.1 Sosyolojinin Doğuşu — 16 ders saati / 8 hafta.
 * Resmî program s. 13–17: doğuş koşulları, kurucular, kuramlar,
 * sosyolojik düşünme biçimi ve yöntem karşılaştırması.
 */
const sociologyBirthWeeks = weeks([
  ["Sosyolojinin konusu, birey-toplum ilişkisi ve sosyolojiye neden ihtiyaç duyulduğu",
    "sosyoloji, toplum, birey, toplumsal olgu, sosyolojik sorun",
    "Görünüşte kişisel olan sorunların ardındaki toplumsal dinamikler nasıl görünür hâle gelir?",
    "Bilimsel bir disiplin olarak sosyolojiye neden 19. yüzyılda ihtiyaç duyuldu?",
    "İşsizlik, yoksulluk, göç gibi günlük örnekleri bireysel deneyimle değil sosyolojik bakış açısıyla ayırt eder ve sokratik diyalogla ilk görüşünü gerekçelendirir.",
    "İlk görüş-varsayım kaydı ve sosyolojik problem fark etme notu"],
  ["Sosyolojiyi hazırlayan düşünürler: Aristoteles, İbn Haldun, Vico ve Saint-Simon",
    "İbn Haldun, Mukaddime, toplumsal cohesion, asabiyet, tarihsel sosyoloji",
    "Toplumu sistematik olarak inceleyen ilk düşünürler sosyolojinin temellerine ne kattı?",
    "İbn Haldun'un temel kavramları toplumsal değişimi açıklamaya yeterli midir?",
    "Bilgi notundaki düşünürlerin toplum anlayışlarını inceleyerek sosyolojinin oluşumuna katkılarını metin inceleme tablosunda analiz eder.",
    "Düşünürler metin inceleme tablosu"],
  ["18-19. yüzyıl Avrupa'sında köklü değişimler: Sanayi Devrimi, Fransız İhtilali ve kentleşme",
    "Sanayi Devrimi, kapitalizm, Fransız İhtilali, milliyetçilik, kentleşme, sekülerleşme",
    "Ekonomik, siyasal ve kültürel-düşünsel gelişmeler sosyolojinin doğuşuna nasıl zemin hazırladı?",
    "Sosyoloji bir bilim olarak mı, yoksa bir kriz çözüm arayışı olarak mı doğdu?",
    "Çalışma kâğıdındaki bilgilerden yola çıkarak modernleşmenin bileşenlerinin sosyolojinin doğuşuna etkisini fark eder ve karşılaştırma tablosu ile değerlendirilir.",
    "Doğuş koşulları karşılaştırma tablosu"],
  ["Oryantalizm, sömürgecilik ve sosyoloji ilişkisi",
    "oryantalizm, sömürgecilik, self-oryantalizm, hegemonya, temsil",
    "Oryantalizm bilgisi ve iktidar ilişkileri sosyolojinin doğuşuna nasıl eklemlendi?",
    "Napolyon'un Mısır seferi ve ansiklopedi projesi bir bilgi Projesi mi, iktidar projesi miydi?",
    "Oryantalizm-sömürgecilik-sosyoloji ilişkisini saygı kuralları içinde tartışır; birbirinin sözünü kesmeden dinler.",
    "Tartışma kaydı ve öz/akran değerlendirme formu"],
  ["Kurucu isimler: Comte, Marx, Durkheim ve Weber'in problemleri ve kavramları",
    "Auguste Comte, Karl Marx, Emile Durkheim, Max Weber, pozitivizm, anomi, sınıf, anlam",
    "Kurucuların ele aldığı problemler sosyolojinin bilim olma iddiasını nasıl şekillendirdi?",
    "Hangi kurucunun toplum anlayışı günümüz toplumunu açıklamada daha güçlüdür?",
    "İş birlikli olarak kurucuların problemlerini, kavram ve argümanlarını belirleyip metin inceleme tablosunda gösterir.",
    "Kurucular metin inceleme tablosu (iş birliği)"],
  ["Sosyoloji kuramları: işlevselci, çatışmacı ve sembolik etkileşimci karşılaştırması",
    "işlevselcilik, çatışmacı kuram, sembolik etkileşimcilik, toplumsal düzen, birey-toplum ilişkisi",
    "Üç kuramın toplum ve birey-toplum ilişkisi anlayışları nerede ayrışır?",
    "Tek bir kuram bütün toplumsal olguları açıklamaya yeter mi?",
    "Kuramların toplum anlayışlarını ve birey-toplum ilişkisine yaklaşımlarını karşılaştırır; süreci açık uçlu sorularla değerlendirir.",
    "Kuram karşılaştırma matrisi"],
  ["Sosyolojik düşünme biçimi: Bauman ve Mills'den merak konusuna",
    "sosyolojik imgelem, sosyolojik tahayyül, merak, soru üretme, bilgi toplama, doğrulama",
    "Sosyolojik düşünme biçimi günlük bilgi ve bireysel deneyimden nasıl ayrışır?",
    "Küresel göç bir bireysel seçim mi, sosyolojik bir problem midir?",
    "Bauman ve Mills alıntılarından yola çıkarak merak ettiği konuyu tanımlar, sorular üretir, güvenilir kaynaklardan bilgi toplayıp doğruluğunu değerlendirir ve çıkarım yapar.",
    "Merak konusu soru kartı, doğrulanmış bilgi notu ve çıkarım kaydı"],
  ["Nicel ve nitel yöntemler; pozitivist ve yorumcu yaklaşım karşılaştırması ve performans görevi",
    "nicel araştırma, nitel araştırma, anket, görüşme, söylem analizi, pozitivizm, yorumculuk",
    "Nicel ve nitel yöntemler hangi sorunlarda hangisiyle daha anlamlı üretim yapar?",
    "Pozitivist ve yorumcu yaklaşımların dayandığı görüşler ne ölçüde uzlaşabilir?",
    "Verilen sosyolojik araştırma konularını pozitivist ve yorumcu görüşün nasıl ele alabileceğini iş birliğiyle sunuma dönüştürür; özellik belirleme, benzerlik-farklılık listeleme ve sunum ölçütleriyle dereceli puanlama anahtarı ile değerlendirilir.",
    "Yöntem karşılaştırma tablosu ve iş birlikli performans sunumu"],
]);

/**
 * SOS.11.2 Türkiye'de Modernleşme ve Sosyoloji — 14 ders saati / 7 hafta.
 * Resmî program s. 18–22.
 */
const modernizationWeeks = weeks([
  ["Modern, modernite ve modernleşme kavramları; modernleşmenin nedenleri",
    "modern, modernite, modernleşme, kapitalizm, faydacı felsefe, sömürgecilik",
    "Batı Avrupa'nın yükselişinde bilimsel-teknolojik gelişmelerin arka planındaki güçler nelerdir?",
    "Modernleşme her toplum için aynı anlamı taşır mı?",
    "Modernleşme kavramını Frayer diyagramı ile yapılandırır; nedenlerini güvenilir kaynaklardan iş birlikli araştırıp sunar.",
    "Frayer diyagramı ve neden araştırması sunumu"],
  ["Modernleşmenin sosyal, siyasal, ekonomik ve kültürel sonuçları",
    "reform, gelenek, gerilim, özgünlük, Meşrutiyet, Cumhuriyet",
    "Osmanlı reformlarından Cumhuriyet'e değişmenin sınırları nasıl belirlendi?",
    "Gelenek ile modernleşme arasındaki gerilim kaçınılmaz mıdır?",
    "Modernleşmenin sonuçlarını tarihsel bağlamda sorgular; süreç açık uçlu sorularla değerlendirilir.",
    "Sonuç sorgulama yanıt kağıdı"],
  ["Modernleşme tartışmaları: Said Halim Paşa, Niyazi Berkes, Nurettin Topçu ve Şerif Mardin",
    "muhafazakârlık, Batıcılık, yerlilik, entelektüel tarih, toplumsal değişme",
    "Düşünürlerin modernleşme yaklaşımlarındaki temel kavram ve problemler nelerdir?",
    "Farklı modernleşme anlayışları aynı toplumsal gerçeği nasıl farklı yorumlar?",
    "Yapılandırılmış metinlerdeki temel kavram, problem ve görüşleri tespit edip metin inceleme tablosunda gösterir.",
    "Metin inceleme tablosu"],
  ["Rusya, İran ve Japonya modernleşmesiyle karşılaştırmalı Türk modernleşmesi",
    "karşılaştırmalı modernleşme, panel, ekonomik-siyasal-sosyal-kültürel boyut",
    "Türk modernleşmesi diğer toplumların deneyimlerinden hangi yönlerle ayrışır?",
    "Karşılaştırma tek nedenli açıklamaya dönüştürülebilir mi?",
    "İş birlikli araştırma sonrası karşılaştırma sonuçlarını okul panelinde sunar; süreç öz değerlendirme formu ile değerlendirilir.",
    "Karşılaştırma panel sunumu ve öz değerlendirme formu"],
  ["Türkiye'de sosyolojinin doğuşu: olay, olgu ve düşünsel yönelimler; Ziya Gökalp ve Sabahattin Bey",
    "pozitivizm, Batıcılık, muhafazakârlık, merkezileşme, sanayileşme, milliyetçilik",
    "Türkiye'de sosyoloji modern bir toplum oluşturma amacına nasıl hizmet etti?",
    "Gökalp ile Sabahattin Bey'in tespit ve çözüm önerileri hangi gerekçelerle ayrışır?",
    "Olay-olgu-düşünsel yönelim arasındaki nedensel ilişkileri ortaya koyar; iki sosyologun biyografi, problem, kavram ve argümanlarını analiz eder.",
    "Nedensel ilişki şeması ve sosyolog analizi"],
  ["Kronolojik diyagram performans görevi: Türkiye'de sosyolojinin gelişimi",
    "olay-olgu-düşünce ilişkisi, kronoloji, tarihsel kurgu, sunum",
    "Türkiye'de sosyolojinin doğuşu hangi tarihsel bağlantılarla açıklanabilir?",
    "Tarihsel bir kurgu nesnellik ile yorumu nasıl dengeler?",
    "Türkiye'de sosyolojinin doğuş ve gelişimini olay-olgu-düşünce ilişkisiyle kronolojik diyagram hâline getirip sınıfta sunar; nedensel ilişki, bütünlük ve sunum ölçütleriyle dereceli puanlama anahtarı ile değerlendirilir.",
    "Kronolojik diyagram performans ürünü"],
  ["Sosyoloji-edebiyat ilişkisi: modernleşmenin edebiyata yansıması",
    "edebiyat, hars, medeniyet, toplumsal tema, Sadullah Paşa, Tanpınar, Akif, Cemil Meriç",
    "Edebî eserler toplumsal gerçekliği nasıl yansıtır, anlamlandırır ve eleştirir?",
    "Edebiyatın sosyolojik analizi eserin estetik değerini yok sayar mı?",
    "Seçilen edebî alıntıları sosyolojik açıdan inceleyip kavram, problem ve çözüm önerilerini belirler; toplumsal temaları sosyolojinin kavramlarıyla ifade eden bir değerlendirme yazısı yazar.",
    "Eser inceleme çalışma kâğıdı ve sosyolojik değerlendirme yazısı"],
]);

/**
 * SOS.11.3 Kültür ve Toplumsal Yapı — 12 ders saati / 6 hafta.
 * Resmî program s. 23–27.
 */
const cultureStructureWeeks = weeks([
  ["Kültürün anlamı, özellikleri ve işlevleri",
    "kültür, dil, din, değer, norm, sembol, sosyalizasyon, kimlik, ulusal birlik",
    "Kültür bireyin anlam dünyasını ve toplumun bir arada yaşamasını nasıl mümkün kılar?",
    "Kültürel unsurların işlevleri toplumdan topluma değişir mi?",
    "Kendi çevresinden kültürel unsurların işlevlerine örnekler verir; kültürün toplumla ilişkisini tutarlı bir bütün olarak yapılandırır.",
    "Kültür işlevleri çalışma kâğıdı ve örnek kartları"],
  ["Kültürel gecikme, etnosentrizm, kültürel görelilik, hegemonya ve kültür endüstrisi",
    "kültürel gecikme, etnosentrizm, kültürel görelilik, hegemonya, kültür endüstrisi, dijital kültür",
    "Kültürel görelilik etnosentrizme karşı hangi ölçüde bir çözümdür?",
    "Dijital dünyada kültür endüstrisi kültürel çeşitliliği zenginleştirir mi, tekdüzeleştirir mi?",
    "Kavramları bilgi notundan çözümleyerek sorun örnekleri verir; dijital dünyada kültürün bütünleştirme işlevini sorgulayan tutarlı bir metin yazar.",
    "Kavram çözümleme notu ve sorgulayıcı metin"],
  ["Morgan'ın evrim şeması, Avrupamerkezcilik ve performans araştırması",
    "Avrupamerkezcilik, etnosentrizm, oryantalizm, ilerlemeci tarih anlayışı, hiyerarşi",
    "Avrupamerkezci sınıflandırmalar sömürgeci hâkimiyeti nasıl meşrulaştırdı?",
    "Bir toplum sınıflandırması tarafsız olabilir mi?",
    "Morgan'ın şemasını kültürel görelilik kavramına dayanarak eleştirel yaklaşımla değerlendirdiği bir yansıtma yazısı yazar; düğün, cenaze, yemek gibi konulardaki değişmeye ilişkin iş birlikli saha araştırmasını sunar.",
    "Yansıtma yazısı ve kültürel değişim araştırma sunumu"],
  ["Toplumsal yapının unsurları: rol, statü, norm, grup, kategori, kontrol ve sapma",
    "toplumsal yapı, rol, statü, toplumsal grup, toplumsal kategori, toplumsal kontrol, toplumsal sapma",
    "Çok sayıda insanın bir araya toplanması bir toplum oluşturmaya neden yeterli değildir?",
    "İnsan davranışlarında birey mi toplum mu belirleyicidir?",
    "Toplumsal yapıyı tanımlar; iki kurgusal toplum örneği üzerinden rol içselleştirmesi ile yaptırım temelli işleyişi karşılaştırıp çıkarımda bulunur.",
    "Toplumsal yapı kavram ağı ve karşılaştırma çıkarımı"],
  ["Toplumsal tabakalaşma ve hareketlilik: işlevselci ve çatışmacı kuramlar",
    "toplumsal tabakalaşma, toplumsal hareketlilik, statü farklılığı, işlevselcilik, çatışmacı kuram, küresel tabakalaşma",
    "Toplumsal tabakalaşma gerekli midir; adil, eşitlikçi bir düzene engel midir?",
    "Tabakalaşma ve hareketlilik ilişkisi nasıl açıklanmalıdır?",
    "Yapılandırılmış metin, görsel ve sorular üzerinden tabakalaşma ile hareketliliğin neden ve sonuçlarını çözümler; türlerini eşleştirerek sınıflandırır.",
    "Tabakalaşma çözümleme tablosu ve tür sınıflandırma kartları"],
  ["Dijital platform ekonomisi, prekarya ve tabakalaşmanın dönüşümü",
    "prekarya, dijital platform ekonomisi, dikey hareketlilik, eğitim, dönüşüm",
    "Günümüzde toplumsal tabakalaşma ve hareketlilik hangi dönüşümü yaşıyor?",
    "Eğitimin dikey hareketliliğe etkisi Türkiye'de güçlenmekte midir?",
    "Dijital platform ekonomisi ve prekarya bilgisi notundan hareketle dönüşümü çözümler; Türkiye'de eğitimin dikey hareketliliğe etkilerini konuşma halkasında tartışıp etkileri yorumladığı kısa bir metin yazar.",
    "Dönüşüm çözümleme notu ve yorum metni (öz değerlendirme formu)"],
]);

/**
 * SOS.11.4 Toplumsal Kurumlar — 16 ders saati / 8 hafta.
 * Resmî program s. 28–33.
 */
const institutionsWeeks = weeks([
  ["Toplumsal kurum kavramı; aile kurumunun işlevleri ve aile tipleri",
    "toplumsal kurum, aile, biyolojik-toplumsal-ekonomik-psikolojik işlev, geniş aile, çekirdek aile",
    "Aile kurumu hangi ihtiyaçları karşılayarak toplumsal yapıyı ayakta tutar?",
    "Modernleşme ve üretim biçimi dönüşümü aile tipini nasıl değiştirdi?",
    "Yapılandırılmış metinlerle aile tiplerini kendi belirlediği ölçütlere göre sınıflar; işlevlere günlük hayattan örnekler verir.",
    "Aile tipleri sınıflandırma tablosu ve işlev örnek kartları"],
  ["Evlilik türleri ve günümüz aile yapısı üzerine akıl yürütme",
    "monogami, poligami, endogami, egzogami, poliantri, polijini, matrilokal, patrilokal, neolokal, bilokal",
    "Evlilik türleri toplumsal yapı ve kültür tarafından nasıl belirlenir?",
    "Boşanma, çocuk sayısı ve akrabalık değişimleri ailenin işlevsizleşmesi mi, dönüşmesi müdür?",
    "Evlilik türlerine gözlem, film ve romanlardan örnekler verir; günümüz aile yapısına ilişkin akıl yürütmesini öğrenme günlüğünde yansıtır.",
    "Evlilik türleri örnek listesi ve öğrenme günlüğü"],
  ["Eğitim kurumunun işlevleri ve toplumsal yaşamdaki önemi",
    "eğitim kurumu, toplumsallaşma, mesleki eğitim, toplumsal bütünleşme, zorunlu eğitim",
    "Eğitim kurumu bireyi ve toplumu hangi yollarla dönüştürür?",
    "Toplumlar kaliteli eğitim sistemi olduğu için mi gelişir, geliştiği için mi kaliteli eğitim sistemine sahiptir?",
    "Eğitimin toplumsal, bireysel, ekonomik ve siyasal işlevlerine örnekler sunar; sosyalleşmedeki rolü üzerine sloganlar oluşturup paylaşır.",
    "İşlev çözümleme şeması ve slogan ürünleri"],
  ["Gökalp ve Sabahattin Bey'de eğitim; dezavantajlı çocuklar ve sosyal entegrasyon",
    "Ziya Gökalp, Sabahattin Bey, eğitim ve toplumsal değişme, dezavantajlı gruplar, sosyal entegrasyon",
    "Türkiye'de eğitim-toplumsal değişme ilişkisi kurucu sosyologlarda nasıl kuruldu?",
    "Dezavantajlı çocukların sosyal entegrasyonunda eğitimin işlevi hangi uygulamalarla güçlenir?",
    "İki düşünürün eğitim fikirlerini tabloda karşılaştırır; dezavantajlı çocukların sosyal entegrasyonunda eğitimin işlevini iş birlikli araştırıp raporlaştırır.",
    "Karşılaştırma tablosu ve araştırma raporu"],
  ["Din kurumunun işlevleri ve toplumsal bütünleşme; Berger incelemesi",
    "din kurumu, sosyalleşme, anlam, toplumsal düzen, dayanışma, kaynaşma, bütünleşme, saygı",
    "Din kurumu toplumsal düzen, dayanışma ve bütünleşmeyi nasıl sağlar?",
    "Farklı inançlara saygı toplumsal bütünleşmeyi nasıl güçlendirir?",
    "Çalışma kâğıdı ile din kurumunun işlevlerini inceler; Ziya Gökalp ve Şerif Mardin alıntılarıyla dayanışma ve bütünleşmedeki rolü tartışır; Berger özetinden yola çıkarak tutarlı bir metin yazar.",
    "İşlev analiz notu ve Berger temelli yapılandırma metni"],
  ["Ekonomi kurumu: temel kavramlar, sistemlerin karşılaştırılması ve devletin rolü",
    "arz, talep, üretim, tüketim, bölüşüm, kapitalizm, sosyalizm, karma ekonomi, üretim biçimi",
    "Ekonomi kurumu toplumsal yaşamın hangi yapısal unsurlarıyla örülmüştür?",
    "Devletin ekonomiye müdahalesi hangi ölçütlerle değerlendirilmelidir?",
    "Ekonomik sistemleri üretim-tüketim-bölüşüm unsurları açısından karşılaştırır; devletin ekonomiye müdahalesine ilişkin önermelerini kâr-zarar, kamu yararı ve sürdürülebilirlik ölçütleriyle konuşma halkasında değerlendirir.",
    "Ekonomi ilişki diyagramı ve önerme değerlendirme kaydı"],
  ["Siyaset kurumu: güç, otorite, meşruiyet ve adalet",
    "güç, otorite, iktidar, meşruiyet, sivil toplum, oligarşi, hegemonya, adalet, Weber, Michels, Gramsci",
    "Bir siyasal otorite hangi şartlarda meşruiyetini kaybeder?",
    "Otorite-güç ilişkisinde adaletin belirleyici rolü nedir?",
    "Weber, Michels, Gramsci ve Gökalp yaklaşımlarıyla kavram ilişkilerini kavram haritasında gösterir; Türk-İslam dünyasında siyasette adalet düşüncelerini inceleyerek akıl yürütür.",
    "Kavram haritası ve akıl yürütme sunumu"],
  ["Toplumsal kurumların ilişkileri ve Ahi teşkilatı performans görevi",
    "kurumlar arası ilişki, toplumsal işleyiş, Ahi teşkilatı, sistem, ihtiyaç",
    "Kurumların karşılıklı ilişkileri toplumun sistemli işleyişini nasıl üretir?",
    "Bütün toplumlarda aynı kurumlar var mıdır?",
    "Kurumların karşılıklı ilişkilerini diyagramla gösterir; Ahi teşkilatını araştırarak günümüze uyarlanma ve katkı önerilerini içeren metni dereceli puanlama anahtarıyla sunar.",
    "Kurum ilişki diyagramı ve Ahi teşkilatı performans metni"],
]);

/**
 * SOS.11.5 Güncel Sosyolojik Meseleler — 10 ders saati / 5 hafta.
 * Resmî program s. 34–37.
 */
const currentIssuesWeeks = weeks([
  ["İslam karşıtlığı problemi: ayrımcılık, ön yargı, stereotip ve öteki",
    "İslam karşıtlığı, ayrımcılık, ön yargı, stereotip, öteki, nefret söylemi",
    "İslam karşıtlığı problemi hangi kavramlarla sorgulanabilir?",
    "Ön yargı ve stereotipler gündelik hayatta hangi sonuçlara yol açar?",
    "Bilgi notu ve yönlendirici sorularla problemi kavramlarıyla ilişkisi içinde tartışarak sorgular.",
    "Kavram ilişkilendirme notu ve sorgulama kaydı"],
  ["İslam karşıtlığının tarihsel arka planı, hegemonya çalışması ve kamu spotu görevi",
    "hegemonya, medya temsili, siyasal söylem, ötekileştirme, kamu spotu",
    "İslam karşıtlığı doğal bir olgu mu, üretilmiş bir hegemonya çalışması mıdır?",
    "Tarihsel kökler ve medya temsilleri sorunun yayılmasında hangi rolleri oynadı?",
    "Bilimsel çalışmalar ve Alev Alatlı metninden hareketle tarihsel arka plan, nedenler ve paydaşlar üzerine akıl yürütür; grup çalışmasıyla İslam karşıtlığı ile baş etmeyi amaçlayan kamu spotu sunumu hazırlar.",
    "Akıl yürütme kaydı ve kamu spotu performans sunumu"],
  ["Küreselleşmenin unsurları ve toplumsal etkileri",
    "küreselleşme, neoliberalizm, iletişim, ulaşım, kapitalizm, göç, tüketim alışkanlıkları",
    "Küreselleşmeyi meydana getiren unsurlar birbirleriyle nasıl ilişkilenir?",
    "Küreselleşme Türkiye için bir fırsat mı, tehdit midir?",
    "Gözlemlerini paylaşır; yönlendirici sorularla anket tasarlayıp web araçlarıyla uygular ve sonuçları sayısal ve yorumsal olarak sunar.",
    "Anket tasarımı ve sonuç sunumu"],
  ["Küreselleşmenin sorunlarına analiz metni ve sunum",
    "göç, işsizlik, gelir dağılımı adaletsizliği, tekdüzeleşme, sınıf, egemenlik, kültürel tekdüzeleşme",
    "Küreselleşme bazı ülkelere avantaj sağlarken bazılarında hangi olumsuzlukları üretir?",
    "Küresel şirketler yerli üretim ve ekonomik bağımsızlık açısından hangi sorunlar yaratır?",
    "Küreselleşmenin farklı ülkelerdeki sorunlarına ilişkin kısa analiz metnini kavramlarla (yapı, sınıf, eşitsizlik, hegemonya) yazar ve sınıfta sunar.",
    "Analiz metni ve sunum (öz değerlendirme formu)"],
  ["Yapay zekâ kaynaklı toplumsal sorunlar; münazara ve değerlendirme",
    "yapay zekâ, algoritmik ayrımcılık, mahremiyet, işsizlik, dikkat ekonomisi, meslek dönüşümü",
    "Yapay zekâ ulusal ve uluslararası eşitsizlikleri azaltır mı, pekiştirir mi?",
    "Yapay zekânın olumlu ve olumsuz etkileri hangi gerekçelerle değerlendirilmelidir?",
    "Kullanım alanlarını sektör örnekleriyle analiz eder; münazara etkinliğinde eşitsizlik sorusunu dürüstlük kuralları içinde tartışır; olumlu ve olumsuz etkilere dair gerekçeli görüşlerini giriş-çıkış kartlarıyla yansıtır.",
    "Münazara kaydı ve giriş-çıkış kartları"],
]);

/**
 * SOS.12.1 Bilim Sosyolojisi — 20 ders saati / 10 hafta.
 * Resmî program s. 38–41.
 */
const scienceSociologyWeeks = weeks([
  ["Bilim sosyolojisine giriş: Merton, Kuhn ve Latour; bilim toplumsal bir etkinliktir",
    "bilim sosyolojisi, Merton, Kuhn, paradigma, Latour, bilimsel topluluk, pozitivizm",
    "Bilimi anlamak için yalnızca kendi iç mantığını incelemek neden yetersiz kalır?",
    "Bilim insanı tek başına bilimsel bir keşif ya da buluş yapabilir mi?",
    "Bilgi notundan hareketle bilimin sosyal bir etkinlik olduğuna dair çıkarımda bulunur; Türkiye'de bilimin gelişmesi için toplumsal potansiyelin etkili kullanımını tartışır.",
    "Çıkarım kaydı ve tartışma notu"],
  ["Bilimi etkileyen toplumsal unsurlar: teknoloji, ekonomi, siyaset, kültür, eğitim, ideoloji, sağlık",
    "toplumsal unsur, uzay yarışı, makineleşme, COVID-19 aşısı, kart eşleştirme",
    "Hangi toplumsal unsurlar bilimsel gelişmeyi yönlendirir?",
    "Bilimin gelişimi için bireysel merak yeterli midir?",
    "Tarihsel örnek kartlarını eşleştirerek bilimi etkileyen unsurları belirler; iş birlikli olarak neden-sonuç tartışması yapar.",
    "Kart eşleştirme ürünü ve tartışma kaydı"],
  ["Bilim-toplum etkileşiminin gerçekleşme yolları",
    "etkileşim, neden-sonuç, ideolojik yaklaşımlar, ekonomik faaliyetler",
    "Bilim toplumdan nasıl etkilenir, toplumu nasıl dönüştürür?",
    "Bilim kapitalizm için bir araç mıdır?",
    "Tartışma sonunda bilim-toplum etkileşiminin neden ve sonuçları hakkında görüş oluşturur; etkileşim yollarını anlatan kısa bir metin yazar.",
    "Etkileşim görüş notu ve kısa metin"],
  ["Bilim ve güç ilişkisi: 'Bilgi güçtür'; Bacon, Sayılı, Mayor ve Forti",
    "bilgi, güç, faydacı felsefe, iktidar, çıkar ilişkileri, Bilim ve İktidar",
    "Bilimsel bilgi güç ve çıkar ilişkilerinden bağımsız olabilir mi?",
    "Bilgi güçtür önermesi bilimin tarafsızlığını nasıl yeniden düşünmeye zorlar?",
    "Çalışma kâğıdında Bacon, Sayılı ve Mayor-Forti metinlerini bilim-güç ilişkisi açısından inceler; nükleer enerji, ilaç, yapay zekâ örnek durumlarını sorgular.",
    "Çalışma kâğıdı yanıtları ve sorgulama notu"],
  ["Bilim tarihsel iktidar yapılarında: özgürleşme aracı mı, baskı aracı mı?",
    "Biruni, antropoloji, sömürgecilik, Soğuk Savaş, meşruiyet, özgürleşme",
    "Bilim hangi koşullarda özgürleşme, hangi koşullarda baskı aracına dönüşür?",
    "Bilim gerçekten çıkarlardan bağımsız ve tarafsız olabilir mi?",
    "Tarihsel örneklerden hareketle bilimin kullanım koşullarını tartışır; sosyoloji bilgisiyle akıl yürütür.",
    "Tartışma kaydı ve akıl yürütme notu"],
  ["Bilim ağları: mRNA aşıları, yapay zekâ ve nükleer araştırmaların aktörleri",
    "araştırmacı, kurum, fon kaynağı, araç, yöntem, bilim ağı",
    "Bir bilimsel gelişmenin arka planındaki aktör, kurum ve fon ilişkileri nasıl görünür kılınır?",
    "Bilimsel gelişmeler toplumsal ihtiyaçlardan mı, rekabet ve prestij kaygılarından mı beslenir?",
    "İş birlikli olarak seçilen bir bilimsel gelişmenin araştırmacı, kurum, fon, araç ve yöntemlerini gösteren bir bilim ağı çizer.",
    "Bilim ağı şeması (iş birliği)"],
  ["Finansman ve araştırma yönelimi: ilaç endüstrisi ve yapay zekâ örnekleri",
    "finansman, kâr güdüsü, klinik araştırma, ticari şirket, güvenlik kurumu, veri",
    "Ekonomik çıkarlar bilimsel yönelimleri nasıl belirler?",
    "Yapay zekâ araştırmalarının fon kaynakları kullanım alanlarını nasıl şekillendirir?",
    "Veri ve örnekler üzerinden fon kaynağı-araştırma yönelimi-toplumsal etki bağlantılarını neden-sonuç ilişkileriyle ortaya koyar.",
    "Neden-sonuç bağlantı analizi"],
  ["Nükleer teknoloji, enerji ve savunma sanayii: güç politikaları",
    "nükleer enerji, savunma sanayii, güç politikası, beyin göçü, etik ilkeler",
    "Nükleer teknolojinin enerji ve savunma kullanımı devletlerin güç politikalarıyla nasıl ilişkilendi?",
    "Bilimsel bilgi üretiminde etik ilkeler mi, ekonomik-politik çıkarlar mı daha belirleyicidir?",
    "Nükleer teknoloji örneğini enerji ve savunma bağlamında iş birlikli inceler; yöneltilen soruları yanıtlar ve sunumunu paylaşır.",
    "Nükleer teknoloji inceleme sunumu"],
  ["Poster görevi: bilimsel gelişme ve arkasındaki güç ilişkileri",
    "gen düzenleme, poster, şema, yorum metni, güç ilişkileri",
    "Bir bilimsel gelişme ile arkasındaki güç ilişkileri tek bir şemada nasıl gösterilebilir?",
    "Bilimsel gelişmelerin toplumsal ilişkileri sosyolojiyi neden gerekli kılar?",
    "Akıl yürütme çıkarımlarını yansıtan, bilimsel bir gelişme ile güç ilişkilerini gösteren şema ve kısa yorum metni içeren bir poster hazırlar.",
    "Poster ürünü (grup/öz değerlendirme formu)"],
  ["Dijital sunum performans görevi; merkez-çevre ve beyin göçü",
    "Shils, merkez-çevre kuramı, beyin göçü, dijital sunum, pazarlama psikolojisi",
    "Bilimsel bilginin güç yapılarıyla ilişkisi eleştirel bir bakışla nasıl sorgulanır?",
    "Çevre ülkelerden merkez ülkelere beyin göçü bilim-güç ilişkilerini nasıl dengesizleştirir?",
    "Bilimsel bilginin güç yapılarıyla ilişkisini sorguladığı dijital sunumu hazırlayıp sınıfta sunar; merkez-çevre ve beyin göçü çözümlemesini raporlaştırır.",
    "Dijital sunum performans ürünü ve beyin göçü raporu"],
]);

/**
 * SOS.12.2 Örnek Sosyolojik Uygulamalar — 48 ders saati / 24 hafta.
 * Resmî program s. 42–46: altı güncel sorun alanı (a-f).
 */
const appliedSociologyWeeks = weeks([
  ["Aile, sosyalizasyon ve suç: Durkheim'in anomi ve Parsons'un aile işlevleri",
    "aile, sosyalizasyon, anomi, aile işlevleri, kültürel yozlaşma",
    "Aile bağlarının zayıflaması sosyalizasyonu hangi sorunlara yol açar?",
    "Aile bütünlüğü sosyalizasyon sorunlarının çözümünde neden önemlidir?",
    "Durkheim ve Parsons bilgilerini özetler; aile bağlarının zayıflaması ile çocuk suçluluğu arasındaki ilişkiyi örnek olaylarla açıklar.",
    "Özet çalışma ve örnek olay açıklamaları"],
  ["Aile bağlarının zayıflaması, sosyalizasyon sorunları ve örnek olaylar",
    "aile bağları, kültürel yozlaşma, çocuk suçlu sayısı, örnek olay, sosyalizasyon sorunu",
    "Örnek olaylar aile-sosyalizasyon-suç ilişkisini nasıl gösterir?",
    "Aile, devlet, okul ve sivil toplum suça sürüklenmeyi önlemede hangi sorumlulukları üstlenmelidir?",
    "Bilgiler ve örnek olaylar üzerinden aile bağlarının zayıflaması ile sosyalizasyon sorunları ve kültürel yozlaşma arasındaki ilişkiyi fark eder; soru-cevap tekniğiyle örnek olayları açıklar.",
    "Örnek olay açıklama kaydı"],
  ["Çocuk suçluluğunda toplumsal faktörler ve çözüm önerileri",
    "yoksulluk, göç, sosyal medya, akran grubu, okul başarısızlığı, toplumsal eşitsizlik",
    "Çocukların suça sürüklenmesinde aile dışı hangi toplumsal faktörler rol oynar?",
    "Suç işlemiş çocukların topluma kazandırılması mümkün müdür?",
    "Soru çerçevesinde toplumsal faktörleri tartışır; bilimsel yayın, medya vakaları ve istatistikleri araştırıp sosyolojik kavramlarla ilişkilendiren kısa bir rapor yazar.",
    "Araştırma raporu (kontrol listesi ile)"],
  ["Aile-sosyalizasyon-suç raporunun sunumu ve yansıması",
    "rapor, tablo, grafik, sunum, çıkarım",
    "Ulaşılan çıkarımlar hangi verilerle desteklenmelidir?",
    "Bulgular tablo ve grafiklerle sunulmadan rapor bilimsel olabilir mi?",
    "Araştırma sonuçlarını metin, tablo ve grafiklerle raporlaştırıp sınıfta sunar ve çıkarımlarını yansıtır.",
    "Rapor sunumu ve yansıtma kaydı"],
  ["Okul kültürü: misyon, vizyon, ilişkiler, gelenek, değer ve normlar",
    "okul kültürü, misyon, vizyon, gelenek, değer, norm, aidiyet",
    "Okul kültürü sosyal-duygusal ve akademik becerilerin gelişimini nasıl etkiler?",
    "Kendi okulunuzun kültürüne dair gözlemleriniz aidiyeti nasıl şekillendiriyor?",
    "Okulun misyon, vizyon, ilişki, gelenek, değer ve normlarını sorgular; kendi okullarının kültürüne dair gözlem ve izlenimlerini ifade eder.",
    "Okul kültürü sorgulama notu"],
  ["Okul araştırması: tarih, dönüşümler, çevre ve mezun profili",
    "okul tarihi, sosyo-ekonomik yapı, mezun profili, araştırma",
    "Okulun tarihsel dönüşümü çevresiyle nasıl bir ilişki içinde gelişti?",
    "Okul kültürü araştırılırken hangi veriler neden gereklidir?",
    "İş birlikli olarak okulun tarihi, geçmiş dönüşümleri, çevresinin sosyo-ekonomik yapısı ve mezun profili hakkında araştırma yapar.",
    "Okul araştırma kayıtları"],
  ["Paydaş röportajları ve aidiyet anketi",
    "röportaj, paydaş, idareci, öğretmen, veli, mezun, anket, mahremiyet, etik",
    "Okul paydaşlarının görüşleri okul kültürünü nasıl görünür kılar?",
    "Röportaj yapılan kişilerin kişisel bilgileri hangi etik kurallar çerçevesinde korunur?",
    "Yapılandırılmış sorularla okul paydaşlarıyla röportaj yapar; kişisel bilgileri korur, aidiyet ve kulüp algılarını ölçen anket uygular.",
    "Röportaj formları ve anket verileri"],
  ["Okul kültürü raporu ve sunumu",
    "rapor, güçlü-zayıf yönler, kurumsal kimlik, sınıflandırma, sunum",
    "Araştırma, röportaj ve anket verileri birlikte nasıl değerlendirilir?",
    "Okulun kurumsal kimliği içsel ve çevresel potansiyeliyle nasıl güçlendirilir?",
    "Verileri birlikte değerlendirerek okulun güçlü-zayıf yönlerini vurgulayan bir rapor hazırlar ve bulguları sınıfta sunar.",
    "Okul kültürü raporu ve sunum"],
  ["Olumlu okul kültürü için öneriler, geliştirme planı ve kampanya",
    "öneri, uygulanabilirlik, sürdürülebilirlik, beyin fırtınası, geliştirme planı, kampanya",
    "Önerilerin uygulanabilirliği ve sürdürülebilirliği hangi ölçütlerle değerlendirilir?",
    "Okul kültürünü geliştirme planı ile sosyal medya kampanyası hangi engeller ve fırsatlarla karşılaşır?",
    "Beyin fırtınasıyla engeller ve fırsatları belirler; görüşlerini okul kültürünü geliştirme planı veya sosyal medya kampanyası ürününe dönüştürür.",
    "Geliştirme planı/kampanya taslağı"],
  ["Akran nezaketine aykırı davranışlar: olay örnekleri ve istatistikler",
    "akran nezaketi, akran zorbalığı, istatistik, medya içeriği, saygı",
    "Akran nezaketine aykırı davranışlar okul ve sınıf iklimini nasıl etkiler?",
    "Sosyal medya ve medya içerikleri bu davranışları nasıl görünür kılıyor?",
    "Yazılı-görsel olay örnekleri ve istatistikleri yönlendirici sorularla tartışır; sosyolojik yorumlarını saygı kuralları içinde sunar.",
    "Örnek olay yorum notları"],
  ["Akran nezaketine aykırı davranışlar üzerine sosyolojik çıkarımlar",
    "çıkarım, sosyolojik düşünme, iş birliği, davranış örüntüsü",
    "Bu davranışlar bireysel mi, toplumsal bir örüntü müdür?",
    "Hangi toplumsal mekanizmalar akran ilişkilerini bozar?",
    "İş birlikli olarak sosyolojik düşünme biçimine uygun çıkarımlar yapar ve çıkarımlarını gerekçelendirir.",
    "Çıkarım kaydı (iş birliği)"],
  ["Disiplinler arası bakış: psikolog, tarihçi, felsefeci ve hukukçu",
    "psikoloji, tarih, felsefe, hukuk, disiplinler arası yaklaşım, tahmin",
    "Aynı sorun farklı disiplinlerde nasıl farklı görünür?",
    "Sosyolojinin katkısı diğer disiplinlerden hangi yönlerle ayrışır?",
    "Bir psikolog, tarihçi, felsefeci ve hukukçunun soruna yaklaşımı hakkında tahminlerde bulunur; sosyolojik bakışın farkını açık uçlu sorularla değerlendirir.",
    "Disiplinler arası tahmin ve değerlendirme yanıtı"],
  ["Akran nezaketi için okul içi önlem önerileri ve farkındalık ürünü",
    "okul iklimi, önlem önerisi, farkındalık, nezaket normu, sınıf içi ilişkiler",
    "Akran nezaketini güçlendirecek okul içi önlemler hangi toplumsal mekanizmaları kullanır?",
    "Farkındalık çalışmaları akran ilişkilerinde kalıcı norm üretebilir mi?",
    "Tartışma çıkarımlarını okul içi önlem önerilerine dönüştürür; farkındalık için kısa bir kampanya ya da afiş taslağı hazırlar.",
    "Önlem öneri listesi ve farkındalık taslağı"],
  ["Dezavantajlı gruplar: sorunların sorgulanması ve empati haritası",
    "dezavantajlı grup, göçmen, yaşlı, engelli birey, yoksulluk, empati haritası",
    "Dezavantajlı gruplar toplumsal yaşamda hangi sorunlarla karşılaşır?",
    "Empati kurgusu sosyolojik çözümlemeyi nasıl besler?",
    "Yazılı-görsel materyallerdeki sorunları sorgular; empati haritasıyla etkilenen insanların duygu ve düşüncelerini anlamayı içselleştirir.",
    "Empati haritası ve sorgulama notu"],
  ["Engelli bireyler için saha çalışması ve görüşme",
    "saha çalışması, dernek, kamusal alan, görüşme formu, izin, mahremiyet",
    "Engelli bireylerin kamusal alanda yaşadığı zorluklar nasıl belgelenir?",
    "Görüşmede izin ve mahremiyet hangi kuralları zorunlu kılar?",
    "İlgili derneklerde görüşme yapar; izin alarak hikâyeleri not eder, sorunun yaşanma sıklığı, tepkiler ve etkilenme düzeylerini tablo hâlinde özetler.",
    "Görüşme formu ve özet tablo"],
  ["Dezavantajlı gruplar için çözüm önerileri ve rapor",
    "çözüm önerisi, akıl yürütme, yargı, rapor, dijital paylaşım",
    "Ulaşılan çıkarımlar çözüm önerilerini nasıl temellendirir?",
    "Sosyal farkındalık hangi kanıtlarla gösterilebilir?",
    "Sorunlar üzerinde akıl yürüterek çözüm önerileri oluşturur; araştırma sorusu, görüşme özellikleri, tablo verileri ve önerileri içeren raporu dijital olarak paylaşır.",
    "Saha çalışması raporu (dereceli puanlama anahtarı)"],
  ["Afetler ve toplum: olağandışı durumlarda toplumsal düzen",
    "afet, toplumsal düzen, kurum işlevleri, yardımlaşma, dayanışma",
    "Afet gibi olağandışı durumlarda toplumsal düzen nasıl kesintiye uğrar?",
    "Afet sırasında hangi sosyal roller ve statüler öne çıkar?",
    "Bilgi görseli üzerinden kurumların işlev aksamasını ve yardımlaşma gerekliliğini örnekleriyle analiz eder; dayanışmanın sembol, norm, değer ve kültürel kodlarını sorgular.",
    "Kurum işlev analizi ve sorgulama notu"],
  ["Dayanışma ağlarının güçlü ve zayıf yönleri; neden-sonuç diyagramı",
    "dayanışma ağı, koordinasyon, güven, tedarik zinciri, bilgi akışı, neden-sonuç diyagramı",
    "Yardımın dengeli, adaletli ve sürdürülebilir dağıtımını hangi yapısal faktörler engeller?",
    "Hangi sosyal, kültürel ve kurumsal unsurlar yardımlaşmayı etkili kılar?",
    "Dayanışma sisteminin olası sorunlarını belirler; neden-sonuç diyagramıyla engelleri ve fırsatları çözümler.",
    "Neden-sonuç diyagramı"],
  ["Afet dayanışma ve sosyal organizasyon modeli tasarımı",
    "model tasarımı, aktör-rol eşlemesi, sembol, ritüel, güven inşası, yapılandırma",
    "Sosyal kurumların işlevsizleştiği afette boşluk sosyoloji bilgisiyle nasıl doldurulur?",
    "Modelde aktör, sembol, ritüel ve güven ilişkileri nasıl belirlenmelidir?",
    "Afet dayanışma ve sosyal organizasyon modelini; aktör-rol, sembol-ritüel ve güven mekanizmaları ayrıntılarıyla yapılandırır.",
    "Dayanışma modeli taslağı"],
  ["Afet modeli sunumu ve yansıtma",
    "sunum, kontrol listesi, öz değerlendirme, olağan yaşam, sürdürülebilirlik",
    "Tasarlanan model olağan yaşamın yeniden örgütlenmesini nasıl mümkün kılar?",
    "Modelin toplumsal işleyişe katkısı hangi ölçütlerle izlenir?",
    "Modeli tanıtan sunumu hazırlayıp sunar; süreç kontrol listesi veya öz değerlendirme formu ile yansıtır.",
    "Model sunumu ve öz değerlendirme"],
  ["Dikkat ekonomisi: kavram, H. Simon ve platformların dikkat çekme yöntemleri",
    "dikkat ekonomisi, enformasyon bolluğu, dikkat kıtlığı, bildirim, algoritma, kişiselleştirilmiş içerik",
    "Enformasyon bolluğu neden dikkat kıtlığı yaratır?",
    "Sosyal medya platformları dikkati hangi yöntemlerle sürekli çekmeye çalışır?",
    "Bilgi notundan hareketle dikkat ekonomisi kavramını çözümler; platformların dikkat çekme yöntemlerini kendi deneyimlerinden örneklendirir.",
    "Kavram çözümleme notu ve deneyim örnekleri"],
  ["Dikkat yoksullaşmasının hayat alanlarına etkileri",
    "odaklanma, aile içi ilişkiler, uyku düzeni, zaman yönetimi, zihinsel yorgunluk, bilgi kirliliği",
    "Sürekli dikkat çalınması hayatın hangi alanlarında sorun üretir?",
    "Dikkat dağınıklığı sosyal ilişkilerde yüzeyselliğe yol açar mı?",
    "Dikkat ekonomisi sorununun nedenlerini sorgular; odaklanma, ilişki, uyku ve zaman yönetimi üzerindeki etkilerine ilişkin akıl yürütür.",
    "Akıl yürütme kaydı (sor-cevap tekniği)"],
  ["Dikkat ekonomisi için anket, gözlem ve görüşme tasarımı",
    "anket tasarımı, gözlem, görüşme, iş birliği, bulgu, kuramsal tartışma",
    "Dikkat dağınıklığı ve bilgi kirliliği okul ve çevrede nasıl ölçülür?",
    "Anket ve gözlem bulguları kuramsal tartışmalarla nasıl birleştirilir?",
    "İş birlikli olarak sosyal medya kullanımına yönelik anket, gözlem ve görüşmeler tasarlar.",
    "Araştırma tasarımı dokümanları"],
  ["Dikkat ekonomisi bulgularının sunumu ve performans görevi",
    "bulgu sunumu, değerlendirme, farkındalık afişi, belgesel senaryosu, sosyal medya kampanyası",
    "Dikkat ekonomisinin insan hayatına etkileri bulgularla nasıl anlatılır?",
    "Yargılar hangi akıl yürütme kanıtlarıyla desteklenmelidir?",
    "Bulguları kuramsal tartışmalarla birleştirip sınıfta sunar; akıl yürütme ve yargılarını kısa belgesel senaryosu, farkındalık afişi veya sosyal medya kampanyası taslağına dönüştürür.",
    "Sunum ve performans ürünü (dereceli puanlama anahtarı)"],
]);

const sociologyWeeklyContentByUnit: Readonly<
  Record<string, readonly SociologyWeeklyContent[]>
> = Object.freeze({
  "SOS.11.1": sociologyBirthWeeks,
  "SOS.11.2": modernizationWeeks,
  "SOS.11.3": cultureStructureWeeks,
  "SOS.11.4": institutionsWeeks,
  "SOS.11.5": currentIssuesWeeks,
  "SOS.12.1": scienceSociologyWeeks,
  "SOS.12.2": appliedSociologyWeeks,
});

const unitByOutcomeCode = new Map<string, string>();
for (const unit of sociology2026Package.units) {
  for (const outcome of unit.outcomes) {
    unitByOutcomeCode.set(outcome.code, unit.code);
  }
}

export function getSociologyUnitWeekFocus(
  unitCode: string,
  week: number,
): string | null {
  const unitWeeks = sociologyWeeklyContentByUnit[unitCode];
  return unitWeeks?.[week - 1]?.title ?? null;
}

export function getSociologyWeeklyContent(
  outcomeCode: string,
  week: number,
): SociologyWeeklyContent | null {
  const unitCode = unitByOutcomeCode.get(outcomeCode);
  if (!unitCode) return null;
  const unitWeeks = sociologyWeeklyContentByUnit[unitCode];
  return unitWeeks?.[week - 1] ?? null;
}

/**
 * Program kuralından (haftalık 2 ders saati) türetilen hafta sayısı kadar
 * haftalık içerik bulunması gerekir; eksik veya fazla hafta fail-closed doğrulanır.
 */
export function validateSociologyWeeklyContent(): void {
  for (const unit of sociology2026Package.units) {
    const expectedWeeks = getLessonStudioWeekCountByProgramRule(
      unit.durationHours,
      "sociology",
    );
    const actual = sociologyWeeklyContentByUnit[unit.code]?.length ?? 0;
    if (actual !== expectedWeeks) {
      throw new Error(
        `${unit.code} için ${expectedWeeks} haftalık içerik bekleniyordu; ${actual} bulundu.`,
      );
    }
    for (const [index, content] of (
      sociologyWeeklyContentByUnit[unit.code] ?? []
    ).entries()) {
      for (const field of ["title", "concepts", "inquiry", "discussion", "application", "evidence"] as const) {
        if (!content[field] || content[field].trim().length === 0) {
          throw new Error(`${unit.code} ${index + 1}. haftanın ${field} alanı zorunludur.`);
        }
      }
    }
  }
}

validateSociologyWeeklyContent();

