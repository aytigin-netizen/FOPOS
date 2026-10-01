import {
  validatePhaseCatalog,
  type PhaseCatalog,
  type PhaseDefinition,
} from "./phase-catalog.ts";
import { sociology2026Package } from "../../src/curriculum-packages/sociology-2026.ts";

type SociologyFlow = Readonly<{
  opening: string;
  problems: string;
  concepts: string;
  discussion: string;
  application: string;
  caseFocus: string;
  evidence: string;
}>;

function makeSociologyPhases(flow: SociologyFlow): PhaseDefinition[] {
  return [
    {
      label: "Hazırlık",
      duration: 5,
      facilitator: `“${flow.opening}” sorusunu görünür kılar ve ilk düşünceleri toplar.`,
      learner: "Soruyla ilgili ilk görüşünü ve dayandığı bir varsayımı yazar.",
      evidence: "İlk görüş ve varsayım",
    },
    {
      label: "Merak Uyandırma",
      duration: 6,
      facilitator: `${flow.problems} bağlamında birbiriyle gerilim taşıyan iki kısa toplumsal örnek sunar.`,
      learner: "Örneklerdeki toplumsal gerilimi belirler ve araştırmaya değer bir soru üretir.",
      evidence: "Problem fark etme notu",
    },
    {
      label: "Sorgulama",
      duration: 12,
      facilitator: `${flow.problems} problemlerini açığa çıkaran soru zincirini yönetir.`,
      learner: "Problemlerin temel varsayımlarını, olası yanıtlarını ve toplumsal sonuçlarını sorgular.",
      evidence: "Sosyolojik problem çözümlemesi",
    },
    {
      label: "Kavram İnşası",
      duration: 14,
      facilitator: `${flow.concepts} kavramlarını örnek, karşı örnek ve ayrımlar üzerinden yapılandırır.`,
      learner: "Kavramları tanımlar, aralarındaki ilişkileri kurar ve kavram ağına dönüştürür.",
      evidence: "Sosyolojik kavram ağı",
    },
    {
      label: "Sosyolojik Muhakeme",
      duration: 17,
      facilitator: `“${flow.discussion}” tartışmasını iddia, gerekçe, itiraz ve yanıt kurallarıyla yönetir.`,
      learner: "Bir görüşü sosyolojik kanıtlarla gerekçelendirir, karşı görüşü adil biçimde yeniden kurar ve argümanları değerlendirir.",
      evidence: "İddia–gerekçe–itiraz kaydı",
    },
    {
      label: "Vaka İncelemesi ve Uygulama",
      duration: 10,
      facilitator: `${flow.caseFocus} odağındaki yapılandırılmış vaka/metin ve “${flow.application}” görevini sunar.`,
      learner: "Vakadaki kavram, olgu ve ilişkileri belirleyerek yeni duruma aktarır.",
      evidence: flow.evidence,
    },
    {
      label: "Biçimlendirici Değerlendirme",
      duration: 8,
      facilitator: "Kavram, olgu, kuram ve çözümleme boyutlarını ölçen kısa görev uygular.",
      learner: "Yanıtını bir kavram, bir kanıt ve bir gerekçeyle destekleyip dönütle düzeltir.",
      evidence: "Gerekçeli sosyolojik yanıt",
    },
    {
      label: "Yansıtma",
      duration: 5,
      facilitator: "Başlangıç görüşünü yeniden göstererek düşüncedeki değişimin kanıtını sorar.",
      learner: "Görüşündeki değişimi veya sürekliliği öğrenme kanıtına dayanarak açıklar.",
      evidence: "Öz-yansıtma kaydı",
    },
    {
      label: "Kapanış",
      duration: 3,
      facilitator: "Ünitenin kavram, olgu ve kuramlarını bağlayan sınıf sentezini tamamlar.",
      learner: "Bir sonuç cümlesi ve araştırmaya değer açık bir soru teslim eder.",
      evidence: "Sonuç ve çıkış sorusu",
    },
  ];
}

const flows: Record<string, SociologyFlow> = {
  "SOS.11.1.1": {
    opening: "Sosyoloji neden 19. yüzyılda bilimsel bir disiplin hâline geldi?",
    problems: "Sanayi Devrimi, Fransız İhtilali ve kentleşmenin toplumsal sonuçları",
    concepts: "anomi, ilerleme, kentleşme, modernite, toplumsal düzen",
    discussion: "Sosyoloji bir kriz çözüm arayışı mı, bilimsel merak ürünü müdür?",
    application: "doğuş koşullarını tarihsel bağlamda karşılaştırarak anlamlandırır",
    caseFocus: "Comte, Marx, Durkheim ve Weber",
    evidence: "Doğuş koşulları karşılaştırma tablosu ve kurucular inceleme notu",
  },
  "SOS.11.1.2": {
    opening: "Sosyolojik düşünme biçimi günlük bilgilenmeden nasıl ayrışır?",
    problems: "bireysel deneyim, gündelik bilgi ve sosyolojik imgelem arasındaki gerilim",
    concepts: "sosyolojik imgelem, soru üretme, bilgi toplama, doğrulama, çıkarım",
    discussion: "Küresel göç bireysel bir seçim mi, sosyolojik bir problem midir?",
    application: "merak ettiği konuyu tanımlayıp güvenilir bilgiyle doğrulanmış çıkarım üretir",
    caseFocus: "Bauman ve Mills alıntıları",
    evidence: "Merak konusu soru kartı ve doğrulanmış çıkarım kaydı",
  },
  "SOS.11.1.3": {
    opening: "Aynı toplumsal sorunu nicel ve nitel yöntemler nasıl farklı ele alır?",
    problems: "pozitivist ve yorumcu yaklaşımların yöntem tercihleri",
    concepts: "nicel araştırma, nitel araştırma, anket, görüşme, söylem analizi",
    discussion: "Tek bir yöntem bütün sosyolojik soruları yanıtlamaya yeter mi?",
    application: "verilen araştırma konusunu iki yöntemle karşılaştırılabilir biçimde tasarlar",
    caseFocus: "örnek sosyolojik yargılar ve kart eşleştirme",
    evidence: "Yöntem karşılaştırma tablosu ve performans sunumu",
  },
  "SOS.11.2.1": {
    opening: "Türk modernleşmesi neden Osmanlı'da başladı?",
    problems: "modernleşmenin nedenleri, sonuçları ve gelenekle gerilimi",
    concepts: "modernleşme, medeniyet, hars, gelenek, reform",
    discussion: "Gelenek ile modernleşme arasındaki gerilim kaçınılmaz mıdır?",
    application: "modernleşmenin neden ve sonuçlarını tarihsel bağlamda yeniden ifade eder",
    caseFocus: "Said Halim Paşa, Niyazi Berkes, Nurettin Topçu ve Şerif Mardin metinleri",
    evidence: "Frayer diyagramı ve sonuç sorgulama yanıtı",
  },
  "SOS.11.2.2": {
    opening: "Türkiye'de sosyoloji neden modern bir toplum kurma arayışına hizmet etti?",
    problems: "sosyolojinin doğuşuna etki eden olay, olgu ve düşünsel yönelimler",
    concepts: "pozitivizm, Batıcılık, muhafazakârlık, merkezileşme, milliyetçilik",
    discussion: "Gökalp ile Sabahattin Bey'in tespitleri hangi gerekçelerle ayrışır?",
    application: "olay-olgu-düşünce ilişkilerini tarihsel bir kurguda bütünleştirir",
    caseFocus: "Ziya Gökalp ve Sabahattin Bey biyografileri",
    evidence: "Nedensel ilişki şeması ve kronolojik diyagram",
  },
  "SOS.11.2.3": {
    opening: "Edebî eserler modernleşmenin toplumsal izlerini nasıl taşır?",
    problems: "sosyoloji-edebiyat ilişkisi ve toplumsal temaların edebî temsili",
    concepts: "edebiyat, hars, medeniyet, toplumsal tema, yansıtma, eleştiri",
    discussion: "Edebiyatın sosyolojik analizi eserin estetik değerini yok sayar mı?",
    application: "eserlerdeki düşünceleri bağlamdan kopmadan sosyolojik kavramlarla ifade eder",
    caseFocus: "Sadullah Paşa, Tanpınar, Akif, Fikret, Kemal Tahir ve Cemil Meriç alıntıları",
    evidence: "Eser inceleme çalışma kâğıdı ve değerlendirme yazısı",
  },
  "SOS.11.3.1": {
    opening: "Kültür olmaksızın bir arada yaşamak mümkün müdür?",
    problems: "kültürün işlevleri, etnosentrizm ve kültürel görelilik gerilimi",
    concepts: "değer, norm, sembol, sosyalizasyon, kültürel görelilik, hegemonya",
    discussion: "Avrupamerkezci sınıflandırmalar tarafsız olabilir mi?",
    application: "kültürün işlevlerini toplumla ilişkisi içinde tutarlı bir bütün olarak yapılandırır",
    caseFocus: "Morgan'ın evrim şeması ve kültürel değişim örnekleri",
    evidence: "Kültür işlevleri yapısı ve yansıtma yazısı",
  },
  "SOS.11.3.2": {
    opening: "Çok sayıda insanın bir arada bulunması bir toplum oluşturmaya neden yeterli değildir?",
    problems: "toplumsal yapının unsurları, rol-statü ilişkisi ve toplumsal kontrol",
    concepts: "rol, statü, toplumsal norm, toplumsal grup, toplumsal kontrol, toplumsal sapma",
    discussion: "İnsan davranışlarında birey mi toplum mu belirleyicidir?",
    application: "yapı unsurları arasındaki ilişkileri iki toplum karşılaştırmasıyla çözümler",
    caseFocus: "rol içselleştirmesi ile yaptırım temelli iki kurgusal toplum",
    evidence: "Toplumsal yapı kavram ağı ve karşılaştırma çıkarımı",
  },
  "SOS.11.3.3": {
    opening: "Toplumsal tabakalaşma adil ve eşitlikçi bir düzenin önünde bir engel midir?",
    problems: "tabakalaşma türleri, hareketlilik ve dijital platform ekonomisi",
    concepts: "toplumsal tabakalaşma, toplumsal hareketlilik, prekarya, statü, dikey hareketlilik",
    discussion: "Eğitim Türkiye'de dikey hareketliliği güçlendiriyor mu?",
    application: "tabakalaşma ve hareketliliğin etkilerini çözümleyip türlerini sınıflandırır",
    caseFocus: "işlevselci ve çatışmacı kuram metni ve görselleri",
    evidence: "Tabakalaşma çözümleme tablosu ve yorum metni",
  },
  "SOS.11.4.1": {
    opening: "Aile kurumu hangi toplumsal ihtiyaçları karşılayarak varlığını sürdürür?",
    problems: "aile tipleri, evlilik türleri ve günümüz aile yapısındaki dönüşüm",
    concepts: "aile işlevleri, geniş aile, çekirdek aile, evlilik türleri, üretim biçimi",
    discussion: "Boşanma ve akrabalık değişimleri ailenin dönüşmesi mi, işlevsizleşmesi midir?",
    application: "aile kurumunu sorgulayıp akıl yürütmesinin çıkarımını yansıtır",
    caseFocus: "yapılandırılmış aile tipleri metinleri ve istatistik örnekleri",
    evidence: "Aile tipleri sınıflandırma tablosu ve öğrenme günlüğü",
  },
  "SOS.11.4.2": {
    opening: "Eğitim kurumu olmadan bir toplum işleyebilir mi?",
    problems: "eğitimin toplumsal, bireysel, ekonomik ve siyasal işlevleri",
    concepts: "sosyalizasyon, müfredat, mesleki eğitim, toplumsal bütünleşme, zorunlu eğitim",
    discussion: "Toplumlar kaliteli eğitim yüzünden mi gelişir, geliştiği için mi eğitim güçlenir?",
    application: "eğitim kurumunun önem ve değerini sorgulayıp çıkarımını yansıtır",
    caseFocus: "Gökalp ve Sabahattin Bey'in eğitim fikirleri",
    evidence: "İşlev çözümleme şeması ve karşılaştırma raporu",
  },
  "SOS.11.4.3": {
    opening: "Din kurumu toplumsal düzen ve dayanışmayı nasıl üretir?",
    problems: "sosyalleşme, anlam, düzen ve toplumsal bütünleşmede dinin rolü",
    concepts: "sosyalizasyon, anlam, toplumsal düzen, dayanışma, kaynaşma, sosyal kontrol",
    discussion: "Toplumsal dayanışma ve bütünleşmede dinin rolü nedir?",
    application: "din kurumunun işlevlerini mantıksal ilişkilerle yapılandırır",
    caseFocus: "Ziya Gökalp ve Şerif Mardin alıntıları ile P. Berger özeti",
    evidence: "İşlev analiz notu ve yapılandırma metni",
  },
  "SOS.11.4.4": {
    opening: "Ekonomi kurumu toplumsal yaşamı hangi yollarla düzenler?",
    problems: "üretim, tüketim, bölüşüm ve ekonomik sistemler",
    concepts: "arz, talep, üretim biçimi, bölüşüm, kapitalizm, sosyalizm, karma ekonomi",
    discussion: "Devletin ekonomiye müdahalesi hangi ölçütlerle değerlendirilmelidir?",
    application: "ekonomik sistemleri karşılaştırıp müdahale önermelerini değerlendirir",
    caseFocus: "ekonomik sistemler bilgi notu ve önerme kartları",
    evidence: "Ekonomi ilişki diyagramı ve önerme değerlendirme kaydı",
  },
  "SOS.11.4.5": {
    opening: "Bir siyasal otorite hangi koşullarda meşruiyetini kaybeder?",
    problems: "güç, otorite, iktidar, meşruiyet ve adalet ilişkisi",
    concepts: "otorite, güç, meşruiyet, hegemonya, oligarşi, adalet, sivil toplum",
    discussion: "Otorite-güç ilişkisinde adaletin belirleyici rolü nedir?",
    application: "siyaset kurumunun işlev ve önemini sorgulayıp çıkarımını yansıtır",
    caseFocus: "Weber, Michels, Gramsci, Gökalp ve Türk-İslam adalet düşünürleri",
    evidence: "Kavram haritası ve akıl yürütme sunumu",
  },
  "SOS.11.4.6": {
    opening: "Toplumsal kurumların ilişkileri toplumun işleyişini nasıl üretir?",
    problems: "kurumların karşılıklı bağımlılığı ve toplumsal sistem",
    concepts: "toplumsal kurum, sistem, ihtiyaç, kurumlar arası ilişki, toplumsal işleyiş",
    discussion: "Bütün toplumlarda aynı kurumlar var mıdır?",
    application: "kurumların işlevlerini ilişkileri içinde inceleyip bütün olarak yapılandırır",
    caseFocus: "Ahi teşkilatı ve kurum ilişki diyagramı",
    evidence: "Kurum ilişki diyagramı ve performans metni",
  },
  "SOS.11.5.1": {
    opening: "İslam karşıtlığı doğal bir olgu mu, üretilmiş bir problem mi?",
    problems: "ayrımcılık, ön yargı, stereotip ve ötekileştirmenin toplumsal işleyişi",
    concepts: "İslam karşıtlığı, ayrımcılık, stereotip, öteki, hegemonya, nefret söylemi",
    discussion: "Ön yargı ve stereotipler gündelik hayatta hangi sonuçları üretir?",
    application: "problemi sorgulayıp çıkarımlarını kamu spotu göreviyle yansıtır",
    caseFocus: "bilimsel çalışmalar ve Alev Alatlı yapılandırılmış metni",
    evidence: "Sorgulama kaydı ve kamu spotu sunumu",
  },
  "SOS.11.5.2": {
    opening: "Küreselleşme Türkiye için bir fırsat mı, bir tehdit midir?",
    problems: "küreselleşmenin unsurları ve toplumsal etkileri",
    concepts: "küreselleşme, neoliberalizm, göç, eşitsizlik, egemenlik, kültürel tekdüzeleşme",
    discussion: "Küresel şirketler yerli üretim ve ekonomik bağımsızlık açısından hangi sorunları yaratır?",
    application: "unsurları ve ilişkilerini anket tasarlayarak çözümler",
    caseFocus: "ithal ürünler, beyin göçü, sosyal medya ve tüketim gözlemleri",
    evidence: "Anket tasarımı ve analiz metni sunumu",
  },
  "SOS.11.5.3": {
    opening: "Yapay zekâ toplumsal eşitsizlikleri azaltır mı, pekiştirir mi?",
    problems: "yapay zekâ kaynaklı toplumsal sorunlar",
    concepts: "yapay zekâ, algoritma, algoritmik ayrımcılık, mahremiyet, işsizlik, meslek dönüşümü",
    discussion: "Yapay zekânın olumlu ve olumsuz etkileri hangi gerekçelerle değerlendirilmelidir?",
    application: "sorunları sorgulayıp münazara ile çıkarımını yansıtır",
    caseFocus: "sektör örnekleri ve münazara sorusu",
    evidence: "Münazara kaydı ve giriş-çıkış kartları",
  },
  "SOS.12.1.1": {
    opening: "Bilim insanı toplumsal koşullardan bağımsız çalışabilir mi?",
    problems: "bilim-toplum etkileşiminin unsurları",
    concepts: "bilimsel topluluk, paradigma, pozitivizm, teknoloji, ideoloji, sağlık",
    discussion: "Bilimin gelişimi için bireysel merak yeterli midir?",
    application: "bilim-toplum ilişkisini oluşturan unsurları ve ilişkilerini çözümler",
    caseFocus: "Merton, Kuhn ve Latour bilgi notu; uzay yarışı ve COVID-19 örneği",
    evidence: "Kart eşleştirme ürünü ve etkileşim metni",
  },
  "SOS.12.1.2": {
    opening: "Bilgi güçtür; peki bilim güçten bağımsız olabilir mi?",
    problems: "bilim ve güç ilişkisi, finansman ve araştırma yönelimleri",
    concepts: "güç, iktidar, çıkar, finansman, meşruiyet, etik",
    discussion: "Bilimsel bilgi üretiminde etik ilkeler mi, ekonomik-politik çıkarlar mı belirleyicidir?",
    application: "bilim-güç ilişkisini sorgulayıp çıkarımlarını poster ve sunumla yansıtır",
    caseFocus: "Bacon, Sayılı, Mayor-Forti, nükleer araştırmalar ve ilaç endüstrisi",
    evidence: "Bilim ağı şeması, poster ve dijital sunum",
  },
  "SOS.12.2.1": {
    opening: "Çevrenizde gözlemlediğiniz toplumsal sorunlara sosyoloji nasıl katkı sağlar?",
    problems: "güncel toplumsal meseleler: aile-sosyalizasyon-suç, okul kültürü, akran nezaketi, dezavantajlı gruplar, afetler ve dikkat ekonomisi",
    concepts: "sosyalizasyon, okul kültürü, suç, dezavantajlı grup, dayanışma, dikkat ekonomisi",
    discussion: "Güncel meseleler hangi sosyolojik kavramlarla sorgulanmalıdır?",
    application: "meseleleri sorgulayıp akıl yürütme çıkarımlarını performans ürününe dönüştürür",
    caseFocus: "Durkheim, Parsons ve saha çalışması örnekleri",
    evidence: "Araştırma raporu ve performans ürünü",
  },
};

function freezePhaseCatalog(
  catalog: Record<string, PhaseDefinition[]>,
): PhaseCatalog {
  for (const phases of Object.values(catalog)) {
    for (const phase of phases) Object.freeze(phase);
    Object.freeze(phases);
  }
  return Object.freeze(catalog);
}

const catalogSource: Record<string, PhaseDefinition[]> = {};
for (const unit of sociology2026Package.units) {
  for (const outcome of unit.outcomes) {
    const flow = flows[outcome.code];
    if (!flow) {
      throw new Error(`${outcome.code} için sosyolojik akış tanımı bulunamadı.`);
    }
    catalogSource[outcome.code] = makeSociologyPhases(flow);
  }
}

validatePhaseCatalog(catalogSource);

export const sociologyPhaseCatalog2026: PhaseCatalog =
  freezePhaseCatalog(catalogSource);
