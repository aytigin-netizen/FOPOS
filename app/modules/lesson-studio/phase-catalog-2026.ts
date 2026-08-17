import {
  validatePhaseCatalog,
  type PhaseCatalog,
  type PhaseDefinition,
} from "./phase-catalog.ts";

function freezePhaseCatalog(catalog: Record<string, PhaseDefinition[]>): PhaseCatalog {
  for (const phases of Object.values(catalog)) {
    for (const phase of phases) Object.freeze(phase);
    Object.freeze(phases);
  }
  return Object.freeze(catalog);
}


type DomainFlow = Readonly<{
  opening: string;
  concepts: string;
  problems: string;
  discussion: string;
  application: string;
  textFocus: string;
  evidence: string;
}>;

function makeDomainPhases(flow: DomainFlow): PhaseDefinition[] {
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
      facilitator: `${flow.problems} bağlamında birbiriyle gerilim taşıyan iki kısa örnek sunar.`,
      learner: "Örneklerdeki felsefi gerilimi belirler ve araştırmaya değer bir soru üretir.",
      evidence: "Problem fark etme notu",
    },
    {
      label: "Sorgulama",
      duration: 12,
      facilitator: `${flow.problems} problemlerini açığa çıkaran soru zincirini yönetir.`,
      learner: "Problemlerin temel varsayımlarını, olası yanıtlarını ve sonuçlarını sorgular.",
      evidence: "Felsefi problem çözümlemesi",
    },
    {
      label: "Kavram İnşası",
      duration: 14,
      facilitator: `${flow.concepts} kavramlarını örnek, karşı örnek ve ayrımlar üzerinden yapılandırır.`,
      learner: "Kavramları tanımlar, aralarındaki ilişkileri kurar ve kavram ağına dönüştürür.",
      evidence: "Alan kavram ağı",
    },
    {
      label: "Felsefi Muhakeme",
      duration: 17,
      facilitator: `“${flow.discussion}” tartışmasını iddia, gerekçe, itiraz ve yanıt kurallarıyla yönetir.`,
      learner: "Bir görüşü gerekçelendirir, karşı görüşü adil biçimde yeniden kurar ve argümanları değerlendirir.",
      evidence: "İddia–gerekçe–itiraz kaydı",
    },
    {
      label: "Metin İncelemesi ve Uygulama",
      duration: 10,
      facilitator: `${flow.textFocus} odağındaki kısa metni ve “${flow.application}” görevini sunar.`,
      learner: "Metindeki kavram, problem ve argümanları belirleyerek yeni duruma aktarır.",
      evidence: flow.evidence,
    },
    {
      label: "Biçimlendirici Değerlendirme",
      duration: 8,
      facilitator: "Kavram, problem, argüman ve metin çözümleme boyutlarını ölçen kısa görev uygular.",
      learner: "Yanıtını bir kavram, metinden bir kanıt ve bir gerekçeyle destekleyip dönütle düzeltir.",
      evidence: "Gerekçeli muhakeme yanıtı",
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
      facilitator: "Ünitenin kavram, problem ve argümanlarını bağlayan sınıf sentezini tamamlar.",
      learner: "Bir sonuç cümlesi ve araştırmaya değer açık bir soru teslim eder.",
      evidence: "Sonuç ve çıkış sorusu",
    },
  ];
}

const catalog2026Source: Record<string, PhaseDefinition[]> = {
  "FEL.10.1.1": [
    {
      label: "Hazırlık",
      duration: 5,
      facilitator: "Bilgelik, felsefe ve filozof sözcüklerini görünür kılar; öğrencilerden felsefeye ilişkin ilk çağrışımlarını ister.",
      learner: "Felsefenin ne olduğuna dair ilk düşüncesini ve merak ettiği bir soruyu yazar.",
      evidence: "İlk düşünce ve merak sorusu",
    },
    {
      label: "Merak Uyandırma",
      duration: 6,
      facilitator: "Felsefenin ortak bir tanımının mümkün olup olmadığına ilişkin birbirinden farklı kısa tanımlar sunar.",
      learner: "Tanımlar arasındaki gerilimi belirler ve neden tek bir tanımda uzlaşılmasının güç olabileceğini açıklar.",
      evidence: "Tanım gerilimi notu",
    },
    {
      label: "Sorgulama",
      duration: 12,
      facilitator: "Felsefenin anlamı, ortaya çıkışı ve tarihsel gelişimi arasında bağ kuran soru zincirini yönetir.",
      learner: "Felsefenin ortaya çıkış koşullarına ilişkin varsayımları sorgular ve felsefi bir soru üretir.",
      evidence: "Sorgulama zinciri ve felsefi soru",
    },
    {
      label: "Kavram İnşası",
      duration: 14,
      facilitator: "Bilgelik, felsefe, filozof, refleksiyon ve sorgulama kavramlarını örnek ve karşı örneklerle yapılandırır.",
      learner: "Kavramları, felsefi düşüncenin özellikleri ve gelişimiyle ilişkilendiren bir kavram ağı kurar.",
      evidence: "Felsefi kavram ağı",
    },
    {
      label: "Felsefi Tartışma",
      duration: 17,
      facilitator: "Felsefenin bilim, din ve sanatla ilişkisini karşılaştıran, açık fikirlilik ve gerekçelendirme kurallarına dayalı tartışmayı yönetir.",
      learner: "Alanların soru, yöntem ve amaçlarını karşılaştırır; bir iddiayı gerekçelendirip karşı görüşü adil biçimde yeniden kurar.",
      evidence: "Alan karşılaştırma ve argüman kaydı",
    },
    {
      label: "Uygulama",
      duration: 10,
      facilitator: "Güncel bir bireysel veya toplumsal sorunu felsefi incelemeye dönüştürme görevini açıklar.",
      learner: "Sorunu felsefi soru ölçütleriyle yeniden kurar ve felsefenin olası bireysel ya da toplumsal işlevini gösterir.",
      evidence: "Felsefi soru ve işlev kartı",
    },
    {
      label: "Biçimlendirici Değerlendirme",
      duration: 8,
      facilitator: "Anlam, gelişim, felsefi soru, alan ilişkileri ve işlev boyutlarını kapsayan kısa kontrol uygular.",
      learner: "Yanıtlarını bir kavram, bir örnek ve bir gerekçeyle destekler; akran dönütüyle düzeltir.",
      evidence: "Gerekçeli kısa yanıtlar",
    },
    {
      label: "Yansıtma",
      duration: 5,
      facilitator: "Başlangıç düşüncesini yeniden göstererek öğrencinin düşünme sürecindeki değişimi sorgular.",
      learner: "İlk düşüncesindeki değişimi veya sürekliliği bir öğrenme kanıtına dayanarak açıklar.",
      evidence: "Öz-yansıtma kaydı",
    },
    {
      label: "Kapanış",
      duration: 3,
      facilitator: "Felsefenin anlamı, gelişimi ve işlevini birbirine bağlayan sınıf sentezini tamamlar.",
      learner: "Felsefenin işlevine ilişkin bir sonuç ve araştırmaya değer yeni bir soru teslim eder.",
      evidence: "Sonuç ve çıkış sorusu",
    },
  ],
  "FEL.10.2.2": [
    {
      label: "Hazırlık",
      duration: 5,
      facilitator: "Gündelik yaşamdan kısa bir iddia ve gerekçe örneği sunarak argümanın parçalarını fark ettirir.",
      learner: "İddia ile onu destekleyen ifadeleri ilk tahminine göre işaretler.",
      evidence: "İlk argüman işaretlemesi",
    },
    {
      label: "Merak Uyandırma",
      duration: 6,
      facilitator: "Aynı sonuca ulaşıyor görünen fakat mantıksal yapıları farklı iki örnek sunar.",
      learner: "Örneklerden hangisinin daha güçlü olduğunu seçer ve seçim ölçütünü yazar.",
      evidence: "İlk güçlülük ölçütü",
    },
    {
      label: "Sorgulama",
      duration: 12,
      facilitator: "Bir ifadeyi argüman yapan şeyin ne olduğuna ve tutarlılığın nasıl sınanacağına ilişkin soru zincirini yönetir.",
      learner: "Mantık, akıl yürütme, argüman, öncül, sonuç ve tutarlılık kavramlarına yönelik sorular üretir.",
      evidence: "Mantıksal sorgulama notu",
    },
    {
      label: "Kavram İnşası",
      duration: 14,
      facilitator: "Mantık ve argümantasyonun temel kavramlarını örnek, karşı örnek ve sınıflandırma yoluyla yapılandırır.",
      learner: "İfadeleri kavramsal özelliklerine göre sınıflandırır ve kavramlar arasındaki ilişkileri gösterir.",
      evidence: "Mantık ve argümantasyon kavram haritası",
    },
    {
      label: "Felsefi Muhakeme",
      duration: 17,
      facilitator: "Bağlamı korunmuş bir metindeki argümanı öncül ve sonuç bileşenlerine ayırma çalışmasını yönetir.",
      learner: "İfadeleri öncül ve sonuç olarak çözümler, çıkarım bağını açıklar ve olası tutarsızlıkları belirler.",
      evidence: "Öncül–sonuç çözümleme çizelgesi",
    },
    {
      label: "Uygulama",
      duration: 10,
      facilitator: "Güncel bir iddiayı anlamını değiştirmeden yeniden ifade etme ve argüman şemasına dönüştürme görevi verir.",
      learner: "İddiayı nesnel biçimde kendi cümleleriyle yeniden ifade eder; öncül ve sonuçlardan oluşan şemayı kurar.",
      evidence: "Yeniden ifade ve argüman şeması",
    },
    {
      label: "Biçimlendirici Değerlendirme",
      duration: 8,
      facilitator: "Kavram tanıma, öncül–sonuç ayrımı, tutarlılık ve nesnel yeniden ifade boyutlarını ölçen kısa görev uygular.",
      learner: "Bir argümanı çözümler, yanıtını mantıksal yapıya dayanarak gerekçelendirir ve dönütle düzeltir.",
      evidence: "Gerekçeli argüman çözümlemesi",
    },
    {
      label: "Yansıtma",
      duration: 5,
      facilitator: "İlk güçlülük ölçütünü yeniden göstererek öğrencinin kararındaki değişimi sorgular.",
      learner: "Bir argümanı değerlendirirken artık kullandığı ölçütleri ve değişen düşüncesini açıklar.",
      evidence: "Muhakeme öz-yansıtması",
    },
    {
      label: "Kapanış",
      duration: 3,
      facilitator: "Mantıklı düşünme ile dürüst ve sorumlu iletişim arasındaki bağı vurgular.",
      learner: "İyi bir argümanın iki özelliğini ve açık kalan bir sorusunu teslim eder.",
      evidence: "Argüman ölçütleri çıkış bileti",
    },
  ],
  "FEL.10.2.1": makeDomainPhases({
    opening: "Düşünce mi dili biçimlendirir, dil mi düşünceyi",
    concepts: "dil, düşünme, anlam ve kavram",
    problems: "düşünme ile dil arasındaki karşılıklı ve nedensel ilişkiler",
    discussion: "Dil olmadan düşünmek mümkün müdür?",
    application: "aynı düşüncenin farklı ifadelerle nasıl değişebildiğini yapılandır",
    textFocus: "düşünme–dil ilişkisi",
    evidence: "Nedensel ilişki şeması",
  }),
  "FEL.10.3.1": makeDomainPhases({
    opening: "Var olmak ne demektir",
    concepts: "varlık, varoluş, töz, öz, madde, idea, oluş ve fenomen",
    problems: "varlığın var olup olmadığı ve varlığın ne olduğu",
    discussion: "Gerçekliğin temeli değişmeyen bir töz müdür, oluş mudur?",
    application: "gündelik bir varlığı iki ontolojik yaklaşım açısından yorumla",
    textFocus: "varlık görüşleri ve ontolojik argümanlar",
    evidence: "Ontolojik görüş karşılaştırma matrisi",
  }),
  "FEL.10.4.1": makeDomainPhases({
    opening: "Bildiğimizi nasıl biliriz",
    concepts: "bilgi, doğruluk, gerçeklik, özne, nesne ve gerekçelendirme",
    problems: "bilginin imkânı, kaynağı ve doğruluk ölçütleri",
    discussion: "Kesin bilgi mümkün müdür?",
    application: "güncel bir bilgi iddiasını kaynak ve doğruluk ölçütleriyle değerlendir",
    textFocus: "bilginin kaynağı ve doğruluk görüşleri",
    evidence: "Bilgi iddiası değerlendirme formu",
  }),
  "FEL.10.5.1": makeDomainPhases({
    opening: "Bir eylemi ahlaken doğru yapan nedir",
    concepts: "ahlak, etik, iyi, kötü, erdem, özgürlük, sorumluluk ve vicdan",
    problems: "evrensel ahlak yasasının imkânı ve insanın özgürlüğü",
    discussion: "Ahlaki kurallar evrensel olabilir mi?",
    application: "bir ahlaki ikilemi özgürlük ve sorumluluk açısından çözümle",
    textFocus: "ahlaki ölçütler ve özgürlük argümanları",
    evidence: "Ahlaki ikilem muhakeme kartı",
  }),
  "FEL.10.6.1": makeDomainPhases({
    opening: "Bir şeyi sanat eseri yapan nedir",
    concepts: "estetik, güzellik, sanat, sanat eseri, sanatçı ve estetik yargı",
    problems: "sanatın ne olduğu, güzellik ve ortak estetik yargıların imkânı",
    discussion: "Güzellik bütünüyle öznel midir?",
    application: "seçilen bir eseri iki estetik yaklaşım açısından yorumla",
    textFocus: "sanat tanımları ve estetik yargı argümanları",
    evidence: "Görsel eser felsefi inceleme formu",
  }),
  "FEL.10.7.1": makeDomainPhases({
    opening: "Siyasal iktidarı meşru yapan nedir",
    concepts: "adalet, birey, devlet, eşitlik, iktidar, özgürlük, toplum ve ütopya",
    problems: "devletin kökeni, iktidarın kaynağı ve meşruiyeti, ideal düzen ve ütopyalar",
    discussion: "Özgürlük ile toplumsal düzen arasında nasıl denge kurulmalıdır?",
    application: "adil bir toplumsal düzen için gerekçeli ilke önerileri oluştur",
    textFocus: "devlet, meşruiyet ve ideal düzen görüşleri",
    evidence: "Adil düzen ilkeleri ve gerekçe tablosu",
  }),
  "FEL.10.8.1": makeDomainPhases({
    opening: "İnanç ile akıl arasında nasıl bir ilişki vardır",
    concepts: "din, iman, inanç, kutsal, Tanrı, vahiy, mucize ve ibadet",
    problems: "Tanrı'nın varlığı, evrenin sonluluğu ve ruhun ölümsüzlüğü",
    discussion: "Tanrı'nın varlığı akılla temellendirilebilir mi?",
    application: "bir din felsefesi argümanını öncül, sonuç ve itirazlarıyla değerlendir",
    textFocus: "Tanrı'nın varlığına ilişkin görüş ve argümanlar",
    evidence: "Din felsefesi argüman çözümleme formu",
  }),
  "FEL.10.9.1": makeDomainPhases({
    opening: "Bilimsel bilgiyi diğer bilgi türlerinden ayıran nedir",
    concepts: "bilim, bilimsel yöntem, gözlem, hipotez, kuram, yasa ve paradigma",
    problems: "bilimin ne olduğu ve bilimi oluşturan temel unsurlar",
    discussion: "Bilim yalnızca tek bir yöntemle mi ilerler?",
    application: "bir bilimsel iddiayı gözlem, hipotez, kuram ve kanıt ilişkisiyle çözümle",
    textFocus: "bilimin yapısı, yöntemi ve değişimi",
    evidence: "Bilimsel iddia ve yöntem çözümleme şeması",
  }),

};

validatePhaseCatalog(catalog2026Source);

export const philosophyPhaseCatalog2026 = freezePhaseCatalog(catalog2026Source);
