import { philosophyPilotQualityContracts2026 } from "./pilot-quality-contract-2026.ts";

export type QualitySourceCard = Readonly<{
  id: string;
  title: string;
  context: string;
  thinker: string;
  pedagogicalFunction: string;
  inquiryQuestion: string;
  sourceNote: string;
  sourceType: "pedagogical-enrichment";
}>;

export type QualityCriterion = Readonly<{
  id: string;
  label: string;
  studentPrompt: string;
  required?: boolean;
}>;

export type QualityRubricCriterion = Readonly<{
  id: string;
  label: string;
  sufficient: string;
  developing: string;
  beginning: string;
}>;

export type QualityEnrichment = Readonly<{
  outcomeCode: "FEL.10.1.1";
  version: "1.0";
  sourceType: "pedagogical-enrichment";
  sourceCards: readonly QualitySourceCard[];
  philosophicalQuestionCriteria: readonly QualityCriterion[];
  fieldComparison: Readonly<{
    fields: readonly string[];
    dimensions: readonly string[];
    rules: readonly string[];
  }>;
  formativeAssessment: Readonly<{
    tasks: readonly Readonly<{ processStep: string; task: string }>[];
    rubric: readonly QualityRubricCriterion[];
    feedbackPattern: string;
  }>;
  differentiationByPhase: readonly Readonly<{
    phase: string;
    support: string;
    enrichment: string;
    unchangedEvidenceStandard: string;
  }>[];
  tymmEvidenceMappings: readonly Readonly<{
    component: string;
    phase: string;
    learnerAction: string;
    evidence: string;
  }>[];
}>;

function deepFreeze<T>(value: T): Readonly<T> {
  if (value !== null && typeof value === "object" && !Object.isFrozen(value)) {
    for (const nested of Object.values(value as Record<string, unknown>)) {
      deepFreeze(nested);
    }
    Object.freeze(value);
  }
  return value;
}

const fel101QualityEnrichment: QualityEnrichment = {
  outcomeCode: "FEL.10.1.1",
  version: "1.0",
  sourceType: "pedagogical-enrichment",
  sourceCards: [
    {
      id: "ionia-rational-inquiry",
      title: "Antik başlangıç ve doğa üzerine akılsal soruşturma",
      context: "MÖ 6. yüzyıl İyonya düşüncesinde doğa olaylarını ilke, neden ve düzen arayışıyla açıklama girişimleri.",
      thinker: "Thales",
      pedagogicalFunction: "Felsefenin bir anda doğduğu anlatısı yerine soru ve gerekçelendirme biçimindeki dönüşümü inceletir.",
      inquiryQuestion: "Bir açıklamayı felsefi yapan yalnız konusu mudur, yoksa sorgulama ve gerekçelendirme biçimi midir?",
      sourceNote: "Özel söz veya kesin alıntı kullanılmaz; tarihsel iddia öğretmen tarafından güvenilir felsefe tarihi kaynağıyla doğrulanır.",
      sourceType: "pedagogical-enrichment",
    },
    {
      id: "aristotle-wonder",
      title: "Hayret, bilme isteği ve felsefi etkinlik",
      context: "Aristoteles'in Metafizik I. kitapta hayret ile bilme arayışı arasında kurduğu ilişki.",
      thinker: "Aristoteles",
      pedagogicalFunction: "Felsefenin yalnız bilgi toplamı mı yoksa belirli bir sorgulama etkinliği mi olduğu problemini açar.",
      inquiryQuestion: "Hayret etmek felsefe yapmaya yeter mi; hayreti felsefi sorgulamaya dönüştüren ek koşullar nelerdir?",
      sourceNote: "Parafraz kullanılır; çeviri birincil metin künyesi öğretmen önizlemesinde gösterilir.",
      sourceType: "pedagogical-enrichment",
    },
  ],
  philosophicalQuestionCriteria: [
    { id: "conceptuality", label: "Kavramsallık", studentPrompt: "Sorum bir kavramın anlamını, sınırını veya ilişkisini araştırıyor mu?" },
    { id: "justification", label: "Temellendirme", studentPrompt: "Sorum kısa bilgi yerine gerekçe ve dayanak arıyor mu?", required: true },
    { id: "clarity", label: "Açıklık", studentPrompt: "Sorumun araştırdığı problem anlaşılır mı?" },
    { id: "discussability", label: "Tartışılabilirlik", studentPrompt: "Birden fazla gerekçeli yanıt karşılaştırılabilir mi?" },
  ],
  fieldComparison: {
    fields: ["Felsefe", "Bilim", "Din", "Sanat"],
    dimensions: ["soru veya problem niteliği", "gerekçelendirme veya ifade yolu", "amaç ve yönelim", "sonuçların niteliği", "kesişim ve etkileşim"],
    rules: [
      "Her alan için en az bir somut örnek kullanılır.",
      "Her öğrenci en az bir genellemesini karşı örnek veya sınır durumla sınar.",
      "Alanlar üstünlük sırasına konmaz; benzerlik, ayrım ve kesişimler gerekçelendirilir.",
    ],
  },
  formativeAssessment: {
    tasks: [
      { processStep: "a", task: "İki felsefe tanımının ortak ve ayrılan yönünü yaz; uzlaşma güçlüğünü gerekçelendir." },
      { processStep: "b", task: "Kaynak kartlarından hareketle gelişimde değişen soru veya gerekçelendirme biçimini açıkla." },
      { processStep: "c", task: "Güncel bir konuyu dört ölçüte uyan felsefi soruya dönüştür." },
      { processStep: "ç", task: "Alan matrisinden bir benzerlik ve bir ayrımı örnekle gerekçelendir." },
      { processStep: "d", task: "Felsefenin bir bireysel ve bir toplumsal işlevini aynı problem üzerinden göster." },
    ],
    rubric: [
      { id: "conceptual-accuracy", label: "Kavramsal doğruluk", sufficient: "Kavramlar doğru ve gerekli ayrımlarla kullanılır.", developing: "Temel kullanım doğru; bir belirsizlik vardır.", beginning: "Kavram yanlış, ilgisiz veya açıklanmamıştır." },
      { id: "justification", label: "Gerekçelendirme", sufficient: "İddia açık gerekçe ve uygun örnekle desteklenir.", developing: "Gerekçenin iddia bağı veya örneği zayıftır.", beginning: "Yalnız sonuç veya kanaat vardır." },
      { id: "outcome-alignment", label: "Çıktı bağlantısı", sufficient: "İlgili süreç eylemi açıkça görünür.", developing: "Süreç eylemi kısmen görünür.", beginning: "İstenen süreç eylemi görünür değildir." },
    ],
    feedbackPattern: "Güçlü kanıtın ...; geliştireceğin adım ...; yeniden denemede ... ölçütünü görünür kıl.",
  },
  differentiationByPhase: [
    { phase: "Sorgulama", support: "Soru cümlesi başlatıcıları ve iki örnek/bir karşı örnek.", enrichment: "Kaynak kartlarının tarihsel varsayımlarını karşılaştırma.", unchangedEvidenceStandard: "Dört ölçüte uygun felsefi soru." },
    { phase: "Kavram İnşası", support: "Kısmen doldurulmuş kavram ağı ve kavram–örnek kartları.", enrichment: "Refleksiyon için yeni örnek ve sınır durum üretme.", unchangedEvidenceStandard: "Doğru kavramsal ilişki ve gerekçe." },
    { phase: "Felsefi Tartışma", support: "Yazılı hazırlık, rol kartı ve alternatif yazılı katılım.", enrichment: "Matrise kesişim alanı ve karşı örnek ekleme.", unchangedEvidenceStandard: "Gerekçeli karşılaştırma ve adil karşı görüş." },
    { phase: "Biçimlendirici Değerlendirme", support: "Görevi parçalara ayırma, anahtar kavram listesi ve ek işlem süresi.", enrichment: "İki süreci tek argümanda birleştirme.", unchangedEvidenceStandard: "Aynı üç rubrik ölçütü." },
  ],
  tymmEvidenceMappings: [
    { component: "SBAB13. Felsefi Sorgulama", phase: "Sorgulama ve Uygulama", learnerAction: "Varsayımları sorgular ve felsefi soru kurar.", evidence: "Sorgulama zinciri ile soru ve işlev kartı." },
    { component: "E1.1. Merak", phase: "Hazırlık", learnerAction: "Merak ettiği soruyu yazar.", evidence: "İlk düşünce ve merak sorusu." },
    { component: "E3.8. Soru Sorma", phase: "Sorgulama", learnerAction: "Dört ölçütlü felsefi soru üretir.", evidence: "Felsefi soru kontrol listesi." },
    { component: "E3.9. Şüphe Duyma", phase: "Merak Uyandırma", learnerAction: "Ortak tanımın imkânını gerekçeyle sınar.", evidence: "Tanım gerilimi notu." },
    { component: "E3.5. Açık Fikirlilik", phase: "Felsefi Tartışma", learnerAction: "Karşı görüşü adil biçimde yeniden kurar.", evidence: "Argüman kaydı." },
    { component: "E3.10. Eleştirel Bakma", phase: "Felsefi Tartışma ve Uygulama", learnerAction: "Genellemeyi karşı örnekle sınar.", evidence: "Alan karşılaştırma matrisi." },
    { component: "SDB2.2. İş Birliği", phase: "Felsefi Tartışma ve Biçimlendirici Değerlendirme", learnerAction: "Rol paylaşır ve ölçütlü akran dönütü verir.", evidence: "Rol kaydı ve akran düzeltmesi." },
    { component: "D6. Dürüstlük", phase: "Felsefi Tartışma", learnerAction: "Karşı görüşü çarpıtmadan aktarır.", evidence: "Adil yeniden kurma bölümü." },
    { component: "D14. Saygı", phase: "Felsefi Tartışma", learnerAction: "İtirazı kişiye değil iddia ve gerekçeye yöneltir.", evidence: "Tartışma gözlem kaydı." },
    { component: "OB1. Bilgi Okuryazarlığı", phase: "Sorgulama", learnerAction: "Kaynak kartındaki iddia, bağlam ve dayanağı ayırır.", evidence: "Kaynak inceleme notu." },
    { component: "OB4. Görsel Okuryazarlık", phase: "Kavram İnşası", learnerAction: "Kavram ilişkilerini görsel ağda düzenler.", evidence: "Felsefi kavram ağı." },
    { component: "OB5. Kültür Okuryazarlığı", phase: "Sorgulama", learnerAction: "Tarihsel düşünme örneğini bağlamında yorumlar.", evidence: "Tarihsel karşılaştırma notu." },
  ],
};


const fel1021QualityEnrichment = {
  outcomeCode: "FEL.10.2.1",
  version: "1.0",
  sourceType: "pedagogical-enrichment",
  exampleCards: [
    {
      id: "same-thought-different-expression",
      title: "Aynı düşünce, farklı ifade",
      context: "Aynı temel düşüncenin sözcük seçimi ve cümle kuruluşu değiştirilerek iki farklı biçimde ifade edildiği öğretim amaçlı kurgu örnek.",
      pedagogicalFunction: "İfade biçiminin vurgu ve çağrışımı değiştirebildiğini, temel düşüncenin ise korunabileceğini inceletir.",
      inquiryQuestion: "İfade değiştiğinde düşüncenin hangi yönleri korunur, hangi yönleri değişebilir?",
      sourceNote: "Öğretim amaçlı kurgu örnektir; kişi, kurum veya doğrulanmamış bilimsel iddia içermez.",
      sourceType: "pedagogical-enrichment",
    },
    {
      id: "same-expression-different-context",
      title: "Aynı ifade, farklı bağlam",
      context: "Aynı kısa ifadenin iki ayrı konuşma bağlamında farklı anlam veya amaç kazanabildiği öğretim amaçlı kurgu örnek.",
      pedagogicalFunction: "Dilsel anlamın yalnız sözcüklerden değil bağlam ve kullanım ilişkisinden de etkilendiğini fark ettirir.",
      inquiryQuestion: "Bağlam, bir ifadeden anladığımız düşünceyi hangi yollarla biçimlendirir?",
      sourceNote: "Öğretim amaçlı kurgu örnektir; gözlem ile nedensel yorum birbirinden ayrılır.",
      sourceType: "pedagogical-enrichment",
    },
  ],
  causalRelationRules: [
    "Gözlenen birlikte değişim doğrudan nedensellik sayılmaz; öğrenci önerdiği etki yönünü gerekçelendirir.",
    "Dil düşünmeyi, düşünme de dili etkileyebilir; tek yönlü genelleme karşı örnekle sınanır.",
    "Her ilişki en az bir örnek ve olası bir sınır durumla açıklanır.",
  ],
  coherentModelCriteria: [
    "En az iki ilişki doğru yön ve kavramlarla gösterilir.",
    "İlişkiler arasında çelişki bulunmaz ve gerekçeler görünürdür.",
    "Parçalar düşünme–dil ilişkisini açıklayan uyumlu bir bütün oluşturur.",
  ],
  formativeAssessment: {
    tasks: [
      { processStep: "a", task: "İki örnekte düşünme ve dil arasındaki en az iki ilişkiyi belirle; etki yönünü örnekle gerekçelendir." },
      { processStep: "b", task: "Belirlediğin ilişkileri çelişkisiz bir şemada birleştir; bütünün neyi açıkladığını yaz." },
    ],
    rubric: [
      { id: "relation-accuracy", label: "İlişki doğruluğu", sufficient: "Düşünme, dil, anlam ve bağlam ilişkileri doğru yön ve ayrımlarla gösterilir.", developing: "Temel ilişki görünür; bir yön veya kavram belirsizdir.", beginning: "İlişki yanlış, tek yönlü genelleme veya açıklamasız eşleştirmedir." },
      { id: "causal-justification", label: "Nedensel gerekçelendirme", sufficient: "Önerilen etki örnek, gerekçe ve sınır durumla desteklenir.", developing: "Örnek vardır; nedensel bağ veya sınır durum eksiktir.", beginning: "Birlikte görülme doğrudan neden sayılmış veya gerekçe verilmemiştir." },
      { id: "model-coherence", label: "Model bütünlüğü", sufficient: "En az iki ilişki çelişkisiz ve açıklayıcı bir bütün oluşturur.", developing: "İlişkiler doğru; aralarındaki bütünlük kısmen görünürdür.", beginning: "Parçalar bağımsız, çelişkili veya çıktı eylemine bağlı değildir." },
    ],
    feedbackPattern: "Doğru kurduğun ilişki ...; gerekçesini güçlendireceğin nokta ...; model bütünlüğü için ekleyeceğin bağ ...",
  },
  differentiationByPhase: [
    { phase: "Sorgulama", support: "Yön okları ve cümle başlatıcılarıyla iki ilişki seçeneği.", enrichment: "Tek yönlü modeli karşı örnekle sınama.", unchangedEvidenceStandard: "En az iki doğru ilişki ve gerekçesi." },
    { phase: "Kavram İnşası", support: "Kısmen doldurulmuş dil–düşünme–anlam–bağlam ağı.", enrichment: "Aynı kavrama yeni bir bağlam ve sınır durum ekleme.", unchangedEvidenceStandard: "Doğru kavramsal ayrım ve ilişki." },
    { phase: "Felsefi Muhakeme", support: "Yazılı hazırlık, model kartı ve alternatif yazılı katılım.", enrichment: "Karşılıklı etki modelini rakip tek yönlü modelle karşılaştırma.", unchangedEvidenceStandard: "Gerekçeli model karşılaştırması." },
    { phase: "Biçimlendirici Değerlendirme", support: "Görevi ilişki belirleme ve bütün kurma olarak iki parçaya ayırma.", enrichment: "Modele yeni karşı örnek ekleyip sınırlarını açıklama.", unchangedEvidenceStandard: "Aynı üç rubrik ölçütü." },
  ],
  tymmEvidenceMappings: [
    { component: "SBAB14. Felsefi Muhakeme", phase: "Sorgulama ve Felsefi Muhakeme", learnerAction: "Düşünme ve dil arasındaki ilişkileri gerekçelendirerek karşılaştırır.", evidence: "İlişki notu ve model karşılaştırması." },
    { component: "KB2.13. Yapılandırma", phase: "Metin İncelemesi ve Uygulama", learnerAction: "Belirlediği ilişkileri uyumlu bir bütün hâline getirir.", evidence: "Nedensel ilişki şeması." },
    { component: "E3.10. Eleştirel Bakma", phase: "Felsefi Muhakeme", learnerAction: "Tek yönlü genellemeyi karşı örnekle sınar.", evidence: "Karşı örnekli model değerlendirmesi." },
    { component: "SDB2.2. İş Birliği", phase: "Felsefi Muhakeme", learnerAction: "Akran modelini ölçütlerle inceler ve düzeltici dönüt verir.", evidence: "Ölçütlü akran dönütü." },
    { component: "D6. Dürüstlük", phase: "Felsefi Muhakeme", learnerAction: "Karşı modeli çarpıtmadan yeniden kurar.", evidence: "Adil model özeti." },
    { component: "D16. Sorumluluk", phase: "Biçimlendirici Değerlendirme", learnerAction: "Modelindeki eksik bağı dönütle düzeltir.", evidence: "Revize edilmiş ilişki şeması." },
    { component: "OB1. Bilgi Okuryazarlığı", phase: "Sorgulama", learnerAction: "Örnek, gözlem ve nedensel yorumu birbirinden ayırır.", evidence: "Örnek–yorum ayrım notu." },
    { component: "OB5. Kültür Okuryazarlığı", phase: "Merak Uyandırma", learnerAction: "İfadenin bağlama göre değişen anlamını yorumlar.", evidence: "Bağlam karşılaştırma notu." },
  ],
};

const fel1022QualityEnrichment = {
  outcomeCode: "FEL.10.2.2",
  version: "1.0",
  sourceType: "pedagogical-enrichment",
  argumentCards: [
    {
      id: "daily-argument",
      title: "Gündelik karar argümanı",
      context: "Bir okul etkinliğine ilişkin kararın açık öncüller ve sonuçla kurulduğu öğretim amaçlı kurgu argüman.",
      pedagogicalFunction: "İddia, öncül, sonuç ve çıkarım bağını gündelik bağlam korunarak ayırt ettirir.",
      sourceNote: "Öğretim amaçlı kurgu örnektir; gerçek kişi veya kurum iddiası içermez.",
      sourceType: "pedagogical-enrichment",
    },
    {
      id: "philosophical-argument",
      title: "Kısa felsefi muhakeme",
      context: "Bilgi iddiasının gerekçeye ihtiyaç duyduğunu savunan, doğrudan alıntı içermeyen kısa öğretim parafrazı.",
      pedagogicalFunction: "Felsefi bağlamdaki ifadeyi anlamını değiştirmeden öncül ve sonuç yapısına dönüştürmeyi sağlar.",
      sourceNote: "Belirli filozofa atfedilmez; öğretim amaçlı felsefi parafraz olarak etiketlenir.",
      sourceType: "pedagogical-enrichment",
    },
  ],
  conceptSafety: [
    { concept: "Tutarlılık", rule: "İfadelerin birlikte çelişkisiz olmasıdır; tek başına geçerlilik veya doğruluk garantisi değildir." },
    { concept: "Geçerlilik", rule: "Tümdengelimsel argümanda sonuç öncüllerden zorunlu olarak çıkıyorsa kullanılır." },
    { concept: "Sağlamlık", rule: "Geçerli tümdengelimsel argümanın öncülleri de doğruysa kullanılır." },
    { concept: "Güçlülük", rule: "Türden bağımsız genel etiket yapılmaz; argüman türü ve değerlendirme ölçütü açıklanır." },
    { concept: "İkna edicilik", rule: "Psikolojik veya retorik etki olabilir; mantıksal doğruluğun eş anlamlısı değildir." },
  ],
  fallacyCounterexample: {
    label: "Sonucu doğrulama örneği",
    fallaciousPattern: "Eğer P ise Q; Q; öyleyse P.",
    counterexample: "Yağmur yağarsa yol ıslanır; yol ıslak; öyleyse yağmur yağdı. Yol başka bir nedenle de ıslanmış olabilir.",
    rule: "Safsata hatalı çıkarım örüntüsüdür; yalnızca yanlış bir öncül kullanmakla eşitlenmez.",
  },
  objectiveRestatementChecklist: [
    "Özgün iddia ve bağlam korunur.",
    "Değerlendirici veya küçümseyici yeni sözcük eklenmez.",
    "Öncül ve sonuçların anlamı değiştirilmez.",
  ],
  formativeAssessment: {
    tasks: [
      { processStep: "a", task: "Mantık, argüman, öncül, sonuç ve tutarlılık kavramlarını örnek üzerinde doğru işlevleriyle ayır." },
      { processStep: "b", task: "Bağlamı korunan ifadeyi öncül ve sonuç bileşenlerine ayır; çıkarım bağını açıkla." },
      { processStep: "c", task: "Argümanı anlamını değiştirmeden nesnel biçimde yeniden ifade et ve kontrol listesiyle doğrula." },
    ],
    rubric: [
      { id: "conceptual-accuracy", label: "Kavram doğruluğu", sufficient: "Mantıksal kavramlar doğru ayrım ve işlevlerle kullanılır.", developing: "Temel kullanım doğru; bir kavram sınırı belirsizdir.", beginning: "Kavramlar karıştırılmış veya açıklanmamıştır." },
      { id: "premise-conclusion", label: "Öncül–sonuç ayrımı", sufficient: "Tüm ilgili ifadeler doğru bileşenlere ayrılmıştır.", developing: "Ana yapı doğru; bir ifade yanlış veya eksik yerleştirilmiştir.", beginning: "İddia ile destek ifadeleri ayırt edilmemiştir." },
      { id: "inference-link", label: "Çıkarım bağı", sufficient: "Sonucun öncüllerle ilişkisi uygun ölçüt ve gerekçeyle açıklanır.", developing: "İlişki belirtilmiş; ölçüt veya gerekçe eksiktir.", beginning: "Sonuç yalnız tekrar edilmiş veya ilişki yanlış kurulmuştur." },
      { id: "objective-restatement", label: "Nesnel yeniden ifade", sufficient: "Bağlam ve anlam korunarak tarafsız biçimde yeniden kurulmuştur.", developing: "Ana anlam korunmuş; küçük bir vurgu veya bağlam kayması vardır.", beginning: "Anlam değiştirilmiş, çarpıtılmış veya yeni yargı eklenmiştir." },
    ],
    feedbackPattern: "Doğru ayırdığın bileşen ...; güçlendireceğin çıkarım ölçütü ...; anlamı korumak için düzelteceğin ifade ...",
  },
  differentiationByPhase: [
    { phase: "Sorgulama", support: "Kavram kartları ve örnek/örnek olmayan çiftleri.", enrichment: "Aynı argümanı iki değerlendirme ölçütüyle karşılaştırma.", unchangedEvidenceStandard: "Doğru kavram ayrımları." },
    { phase: "Kavram İnşası", support: "Renk kodlu öncül–sonuç şeması ve kısmen doldurulmuş örnek.", enrichment: "Örtük öncülü belirleyip gerekçelendirme.", unchangedEvidenceStandard: "Doğru öncül–sonuç ayrımı." },
    { phase: "Felsefi Muhakeme", support: "Metni kısa parçalara ayırma ve çıkarım bağı cümle başlatıcıları.", enrichment: "Safsata örneğine yeni karşı örnek üretme.", unchangedEvidenceStandard: "Bağlamı koruyan gerekçeli çözümleme." },
    { phase: "Biçimlendirici Değerlendirme", support: "Sözlü veya yazılı yanıt seçeneği ve ek işlem süresi.", enrichment: "Argümanı en güçlü biçimiyle yeniden kurup değerlendirme.", unchangedEvidenceStandard: "Aynı dört rubrik ölçütü." },
  ],
  tymmEvidenceMappings: [
    { component: "SBAB14. Felsefi Muhakeme", phase: "Felsefi Muhakeme ve Uygulama", learnerAction: "Argümanı öncül, sonuç ve çıkarım bağı bakımından çözümler.", evidence: "Öncül–sonuç çizelgesi ve argüman şeması." },
    { component: "E1.6. Seçicilik", phase: "Kavram İnşası", learnerAction: "İfadeleri mantıksal işlevlerine göre seçer ve sınıflandırır.", evidence: "Kavram haritası." },
    { component: "E3.10. Eleştirel Bakma", phase: "Felsefi Muhakeme", learnerAction: "Çıkarım örüntüsünü karşı örnekle sınar.", evidence: "Safsata–karşı örnek kaydı." },
    { component: "SDB2.2. İş Birliği", phase: "Biçimlendirici Değerlendirme", learnerAction: "Akran çözümlemesine rubrikle dönüt verir.", evidence: "Rubrikli akran düzeltmesi." },
    { component: "D6. Dürüstlük", phase: "Uygulama", learnerAction: "Karşı iddiayı anlamını değiştirmeden yeniden ifade eder.", evidence: "Nesnel yeniden ifade kontrol listesi." },
    { component: "D16. Sorumluluk", phase: "Yansıtma", learnerAction: "Kullandığı ölçütteki hatayı belirleyip düzeltir.", evidence: "Muhakeme öz-yansıtması." },
    { component: "OB1. Bilgi Okuryazarlığı", phase: "Sorgulama", learnerAction: "İddia, destek ve bağlam bilgilerini ayırır.", evidence: "Mantıksal sorgulama notu." },
    { component: "OB5. Kültür Okuryazarlığı", phase: "Uygulama", learnerAction: "İfadeyi kullanıldığı bağlamı koruyarak yorumlar.", evidence: "Bağlamlı argüman şeması." },
  ],
};

const fel1031QualityEnrichment = {
  outcomeCode: "FEL.10.3.1",
  version: "1.0",
  sourceType: "pedagogical-enrichment",
  sourceCards: [
    {
      id: "parmenides-being",
      title: "Parmenides: varlık, birlik ve değişmezlik problemi",
      context: "Parmenides'in şiirinden günümüze ulaşan parçalar üzerinden var olanın meydana gelme, yok olma ve değişme ile ilişkisinin sorgulanması.",
      thinker: "Parmenides",
      pedagogicalFunction: "Varlığın var olup olmadığı ile değişme problemlerini iddia, gerekçe ve sonuç ilişkisi içinde inceletir.",
      inquiryQuestion: "Değişme, bir şeyin olmayan hâle gelmesini gerektiriyorsa değişmenin gerçek olduğunu nasıl savunabiliriz?",
      sourceNote: "Doğrudan söz atfedilmez; öğretmen, fragman numarasını ve kullanılan çeviriyi kaynak künyesiyle gösterir.",
      sourceType: "pedagogical-enrichment",
    },
    {
      id: "gorgias-non-being",
      title: "Gorgias: yokluk, bilme ve aktarma itirazı",
      context: "Gorgias'a atfedilen Yokluk Üzerine metninin varlık, bilinebilirlik ve aktarılabilirlik üzerine üç aşamalı meydan okuması.",
      thinker: "Gorgias",
      pedagogicalFunction: "Bir görüşün sonucu ile o sonuca götüren argüman basamaklarını ayırmayı ve Parmenides'e yöneltilen itirazı değerlendirmeyi sağlar.",
      inquiryQuestion: "Bir şeyin düşünülebilmesi onun var olduğunu göstermeye yeter mi?",
      sourceNote: "Metnin ciddi tez veya Eleatik savların eleştirisi olarak yorumlanabildiği belirtilir; kesin niyet atfı ve doğrudan alıntı kullanılmaz.",
      sourceType: "pedagogical-enrichment",
    },
    {
      id: "substance-becoming",
      title: "Töz ve oluş: süreklilik–değişme gerilimi",
      context: "Değişme boyunca aynı kalan bir dayanak bulunduğunu savunan yaklaşımlar ile gerçekliği oluş süreci olarak açıklayan yaklaşımların öğretim amaçlı karşılaştırması.",
      thinker: "Aristoteles ve Herakleitos bağlamları",
      pedagogicalFunction: "Töz, öz, madde ve oluş kavramlarının birbirinin eş anlamlısı olmadığını örnek ve karşı örneklerle sınatır.",
      inquiryQuestion: "Bir varlığın değişirken aynı varlık olarak kalmasını ne açıklar?",
      sourceNote: "Görüşler tek cümlelik sloganlara indirgenmez; seçilen metin ve çeviri öğretmen önizlemesinde kaynaklandırılır.",
      sourceType: "pedagogical-enrichment",
    },
  ],
  conceptSafety: [
    { concept: "Ontoloji–metafizik", rule: "Ontoloji varlık olarak varlığı inceleyen alan olarak açıklanır; metafizikle ilişkili fakat her bağlamda bütünüyle eş anlamlı sayılmaz." },
    { concept: "Varlık–varoluş", rule: "Varlık en genel inceleme alanını, varoluş ise bir şeyin var olması veya var olma tarzını gösterebilir; bağlam verilmeden özdeşleştirilmez." },
    { concept: "Öz–töz", rule: "Öz bir şeyin ne olduğuna, töz ise kendi başına var olduğu veya özelliklere dayanak olduğu kabul edilen şeye ilişkin farklı soruları karşılar." },
    { concept: "Madde–idea", rule: "Madde ve idea rakip ontolojik açıklamalarda farklı işlevler taşır; yalnız somut–soyut sözcükleriyle tanımlanmaz." },
    { concept: "Oluş", rule: "Oluş değişme ve meydana gelme sürecini vurgular; varlığın basit karşıtı olarak sunulmaz." },
    { concept: "Fenomen", rule: "Fenomen görünüş veya deneyimde beliren şey bağlamında açıklanır; yanılsama ile otomatik olarak eşitlenmez." },
  ],
  viewComparison: {
    dimensions: ["temel problem", "ana iddia", "gerekçe", "varlık anlayışı", "değişmeye yaklaşım", "itiraz veya sınır"],
    rules: [
      "Her görüş, temsilci adı ezberletilmeden önce problem ve argümanla ilişkilendirilir.",
      "Parmenides ve Gorgias karşılaştırmasında iddia, bilinebilirlik ve aktarılabilirlik basamakları birbirinden ayrılır.",
      "Öğrenci en az bir görüşü karşı örnek veya itirazla sınar ve karşı görüşü çarpıtmadan yeniden kurar.",
    ],
  },
  textAnalysisChecklist: [
    "Metindeki temel ontolojik kavramları bağlam içindeki anlamlarıyla belirle.",
    "Ele alınan varlık problemini açık bir soru biçiminde yaz.",
    "Ana iddia ile onu destekleyen gerekçeleri ayır.",
    "Öncül–sonuç veya gerekçe–iddia bağını göster.",
    "Görüşü bir itiraz ya da karşı örnekle değerlendir.",
    "Parafrazı metindeki kanıttan ayır ve kullanılan kaynağı göster.",
  ],
  formativeAssessment: {
    tasks: [
      { processStep: "a", task: "Ontoloji–metafizik, varlık–varoluş ve öz–töz ayrımlarından ikisini örnek ve karşı örnekle açıkla." },
      { processStep: "b", task: "Varlığın var olup olmadığı ile varlığın ne olduğu problemlerini birbirinden ayır ve her biri için araştırılabilir bir soru yaz." },
      { processStep: "c", task: "Parmenides ve Gorgias kartlarındaki ana iddia, gerekçe ve sonucu karşılaştır; bir argümana gerekçeli itiraz geliştir." },
      { processStep: "ç", task: "Seçilen kısa metindeki kavram, problem, iddia ve gerekçeleri işaretle; görüşü metin kanıtıyla değerlendir." },
    ],
    rubric: [
      { id: "conceptual-accuracy", label: "Ontolojik kavram doğruluğu", sufficient: "Kavramlar gerekli ayrımlar ve uygun örneklerle doğru kullanılır.", developing: "Temel kullanım doğru; bir ayrım veya örnek belirsizdir.", beginning: "Kavramlar eş anlamlılaştırılmış, karıştırılmış veya açıklanmamıştır." },
      { id: "problem-distinction", label: "Problem ayrımı", sufficient: "Varlığın varlığı ve ne olduğu problemleri açıkça ayrılır ve uygun sorularla gösterilir.", developing: "İki problem görünür; sınırları kısmen karışır.", beginning: "Problemler tek soruya indirgenmiş veya ilgisizdir." },
      { id: "argument-evaluation", label: "Argüman değerlendirme", sufficient: "İddia, gerekçe ve sonuç doğru ayrılır; değerlendirme itiraz veya karşı örnekle temellendirilir.", developing: "Argüman yapısı büyük ölçüde doğru; değerlendirme dayanağı zayıftır.", beginning: "Görüş yalnız adlandırılmış veya gerekçesiz kabul/reddedilmiştir." },
      { id: "textual-evidence", label: "Metin kanıtı", sufficient: "Yorum metindeki kavram ve gerekçelere açıkça dayanır; kaynak ve parafraz ayrımı korunur.", developing: "Metne gönderme vardır; kanıt–yorum bağı kısmen görünürdür.", beginning: "Metin kullanılmamış, kanıt gösterilmemiş veya doğrulanmamış söz atfedilmiştir." },
    ],
    feedbackPattern: "Doğru kurduğun ontolojik ayrım ...; argümanda güçlendireceğin bağ ...; metin kanıtıyla yeniden göstereceğin nokta ...",
  },
  differentiationByPhase: [
    { phase: "Sorgulama", support: "İki problem için soru başlatıcıları ve örnek/örnek olmayan problem kartları.", enrichment: "Varlık sorusunun bilinebilirlik ve dil ile ilişkisini ayrıca sınama.", unchangedEvidenceStandard: "İki temel problemi doğru ayıran gerekçeli sorular." },
    { phase: "Kavram İnşası", support: "Kısmen doldurulmuş kavram ağı, görsel kavram kartları ve sözlü/yazılı yanıt seçeneği.", enrichment: "Aynı kavramın iki yaklaşımda değişen anlamını karşılaştırma.", unchangedEvidenceStandard: "Doğru kavram ayrımı, ilişki ve örnek." },
    { phase: "Felsefi Muhakeme", support: "İddia–gerekçe–itiraz cümle başlatıcıları, yazılı hazırlık ve rol kartı.", enrichment: "Parmenides–Gorgias karşılaştırmasına yeni bir karşı örnek ekleme.", unchangedEvidenceStandard: "Adil yeniden kurulan görüş ve gerekçeli değerlendirme." },
    { phase: "Metin İncelemesi ve Uygulama", support: "Kısa parçalara ayrılmış metin, anahtar kavram listesi ve işaretleme şablonu.", enrichment: "Metnin ontolojik varsayımlarını alternatif bir görüşle karşılaştırma.", unchangedEvidenceStandard: "Kavram, problem, argüman ve metin kanıtının görünür olması." },
    { phase: "Biçimlendirici Değerlendirme", support: "Dört görevi adımlara ayırma, ek işlem süresi ve sözlü/yazılı ürün seçeneği.", enrichment: "İki argümanı ortak rubrikle karşılaştırıp güçlü yanlarını bir sentezde kullanma.", unchangedEvidenceStandard: "Aynı dört rubrik ölçütü." },
  ],
  tymmEvidenceMappings: [
    { component: "SBAB14. Felsefi Muhakeme", phase: "Felsefi Muhakeme", learnerAction: "Ontolojik argümanları iddia, gerekçe, itiraz ve sonuç bakımından değerlendirir.", evidence: "Ontolojik görüş karşılaştırma matrisi." },
    { component: "KB2.4. Çözümleme", phase: "Metin İncelemesi ve Uygulama", learnerAction: "Metindeki kavram, problem ve argüman bileşenlerini ayırır.", evidence: "Altı ölçütlü metin inceleme formu." },
    { component: "KB2.7. Karşılaştırma", phase: "Felsefi Muhakeme", learnerAction: "Parmenides ve Gorgias'ın iddia ve gerekçelerini ortak boyutlarda karşılaştırır.", evidence: "Altı boyutlu görüş matrisi." },
    { component: "KB2.18. Tartışma", phase: "Felsefi Muhakeme", learnerAction: "Bir görüşü gerekçelendirir ve karşı görüşe adil bir itiraz yöneltir.", evidence: "İddia–gerekçe–itiraz kaydı." },
    { component: "KB3.3. Eleştirel Düşünme", phase: "Biçimlendirici Değerlendirme", learnerAction: "Argümanı karşı örnek veya itirazla sınar ve dönütle düzeltir.", evidence: "Rubrikli argüman revizyonu." },
    { component: "E1.1. Merak", phase: "Hazırlık", learnerAction: "Var olmakla ilgili araştırmaya değer bir soru üretir.", evidence: "İlk görüş, varsayım ve merak sorusu." },
    { component: "E3.5. Açık Fikirlilik", phase: "Felsefi Muhakeme", learnerAction: "Karşı görüşü eleştirmeden önce çarpıtmadan yeniden kurar.", evidence: "Adil karşı görüş özeti." },
    { component: "E3.7. Sistematiklik", phase: "Metin İncelemesi ve Uygulama", learnerAction: "Metin inceleme ölçütlerini sıralı ve eksiksiz uygular.", evidence: "Tamamlanmış inceleme kontrol listesi." },
    { component: "SDB2.1. İletişim", phase: "Felsefi Muhakeme", learnerAction: "İtirazını kişiye değil iddia ve gerekçeye yöneltir.", evidence: "Tartışma gözlem kaydı." },
    { component: "SDB2.2. İş Birliği", phase: "Biçimlendirici Değerlendirme", learnerAction: "Akran ürününe rubrik ölçütleriyle düzeltici dönüt verir.", evidence: "Ölçütlü akran dönütü." },
    { component: "D14. Saygı", phase: "Felsefi Muhakeme", learnerAction: "Farklı ontolojik görüşleri saygılı ve adil biçimde temsil eder.", evidence: "Adil yeniden kurma bölümü." },
    { component: "D16. Sorumluluk", phase: "Yansıtma", learnerAction: "Kavramsal veya argümantatif hatasını dönüte dayanarak düzeltir.", evidence: "Revize edilmiş öz-yansıtma." },
    { component: "OB1. Bilgi Okuryazarlığı", phase: "Sorgulama ve Metin İncelemesi", learnerAction: "Kaynak, parafraz, iddia ve yorum ayrımını korur.", evidence: "Kaynaklı metin inceleme notu." },
  ],
};

const fel1041QualityEnrichment = {
  outcomeCode: "FEL.10.4.1",
  version: "1.0",
  sourceType: "pedagogical-enrichment",
  sourceCards: [
    {
      id: "plato-knowledge-opinion",
      title: "Platon: bilgi, sanı ve gerekçelendirme problemi",
      context: "Platon'un Theaitetos diyaloğundaki bilgi tanımı arayışı ile mağara benzetmesindeki görünüş–gerçeklik geriliminin öğretim amaçlı birlikte ele alınması.",
      thinker: "Platon",
      pedagogicalFunction: "Bilgi ile sanıyı yalnız doğruluk bakımından değil, gerekçe ve gerçeklikle ilişki bakımından da ayırt ettirir.",
      inquiryQuestion: "Doğru bir inanç, neden her durumda bilgi sayılmayabilir?",
      sourceNote: "İki metin tek bir doğrudan alıntı gibi birleştirilmez; kullanılan çeviri ve bölüm öğretmen önizlemesinde gösterilir.",
      sourceType: "pedagogical-enrichment",
    },
    {
      id: "pyrrhonian-suspension",
      title: "Pyrrhoncu kuşkuculuk: yargıyı askıya alma",
      context: "Sextus Empiricus'un aktardığı Pyrrhoncu gelenekte çatışan görünüş ve gerekçeler karşısında kesin hüküm vermeme yaklaşımı.",
      thinker: "Pyrrhoncu gelenek ve Sextus Empiricus",
      pedagogicalFunction: "Şüpheciliği tek biçimli bir 'hiçbir şey bilinemez' sloganına indirgemeden bilginin imkânı probleminde inceletir.",
      inquiryQuestion: "Eşit güçte görünen gerekçeler karşısında yargıyı askıya almak bilgi iddiasını nasıl etkiler?",
      sourceNote: "Pyrrhon'a doğrudan söz atfedilmez; görüş Sextus Empiricus aktarımı ve seçilen çeviri üzerinden kaynaklandırılır.",
      sourceType: "pedagogical-enrichment",
    },
    {
      id: "descartes-methodic-doubt",
      title: "Descartes: yöntemsel kuşku ve kesinlik arayışı",
      context: "Descartes'ın rüya argümanı ve yöntemsel kuşkuyu kuşkuda kalmak için değil, sarsılmaz bir başlangıç aramak için kullanması.",
      thinker: "René Descartes",
      pedagogicalFunction: "Yöntemsel kuşku ile kuşkucu sonuca bağlanma arasındaki farkı ve rasyonalizmin gerekçelendirme biçimini görünür kılar.",
      inquiryQuestion: "Bir inancın kuşkuya açık olması, onun yanlış olduğunu göstermeye yeter mi?",
      sourceNote: "Doğrudan veya doğrulanmamış söz kullanılmaz; Rüya Argümanı seçilen birincil metin bölümüyle parafraz edilir.",
      sourceType: "pedagogical-enrichment",
    },
    {
      id: "source-views",
      title: "Bilginin kaynağı: akıl, deney, eleştiri ve sezgi",
      context: "Rasyonalizm, empirizm, kritisizm ve entüisyonizmin bilginin oluşumunda akıl, deney ve sezgiye verdiği rollerin karşılaştırılması.",
      thinker: "Descartes, Locke, Kant ve Bergson bağlamları",
      pedagogicalFunction: "Görüşleri filozof adı ezberine indirgemeden temel iddia, gerekçe, kaynak anlayışı ve sınırlarıyla karşılaştırır.",
      inquiryQuestion: "Akıl ve deneyden yalnız birini seçmek bilginin kaynağını açıklamaya yeter mi?",
      sourceNote: "Her görüş seçilen birincil veya güvenilir ikincil kaynakla bağlamlandırılır; temsilciler bütün görüşleri tek başına tüketen etiketler olarak sunulmaz.",
      sourceType: "pedagogical-enrichment",
    },
  ],
  conceptSafety: [
    { concept: "Bilgi–inanç", rule: "Bilgi bir önermeyi kabul etmekten ibaret sayılmaz; inanç, doğruluk ve gerekçelendirme ilişkisi örnek ve karşı örneklerle incelenir." },
    { concept: "Doğruluk–gerçeklik", rule: "Doğruluk bilgi iddiasının veya önermenin niteliğine, gerçeklik ise iddianın yöneldiği var olan veya durum alanına ilişkindir; eş anlamlılaştırılmaz." },
    { concept: "Gerekçelendirme–kanıt", rule: "Gerekçelendirme bir inancı destekleyen nedenlerin düzenini, kanıt ise bu desteğin belirli dayanaklarını gösterebilir; bağlam verilmeden özdeşleştirilmez." },
    { concept: "Özne–nesne", rule: "Özne bilen, nesne bilmeye yönelinen olarak açıklanır; aralarındaki ilişki tek yönlü ve sorunsuz bir kopyalama olarak varsayılmaz." },
    { concept: "Bilgi–sanı", rule: "Sanı otomatik olarak yanlış sayılmaz; doğru olsa bile gerekçesi veya bilgi statüsü ayrıca incelenir." },
    { concept: "Kuşku–inkâr", rule: "Kuşku bir iddianın dayanaklarını askıya alma veya sınama tutumudur; her durumda inkâr ya da hiçbir şey bilinemez iddiası değildir." },
  ],
  problemMap: {
    dimensions: ["problem", "temel soru", "görüş", "ana iddia", "gerekçe", "itiraz veya sınır"],
    rules: [
      "Bilginin imkânı, kaynağı ve doğruluk ölçütleri üç ayrı problem olarak sınıflandırılır.",
      "Şüphecilik ile dogmatik yaklaşımlar bilginin imkânı; rasyonalizm, empirizm, kritisizm ve entüisyonizm bilginin kaynağı bağlamında incelenir.",
      "Uygunluk, tutarlılık, tümel uzlaşım ve yarar doğruluk ölçütleri olarak ele alınır; bilginin kaynağı görüşleriyle karıştırılmaz.",
      "Her görüş, isim–akım eşleştirmesinden önce problem, iddia, gerekçe ve olası itirazla ilişkilendirilir.",
    ],
  },
  textAnalysisChecklist: [
    "Metnin kaynağını, bağlamını ve alıntı ya da parafraz durumunu göster.",
    "Temel epistemolojik kavramları bağlam içindeki anlamlarıyla belirle.",
    "Ele alınan problemi imkân, kaynak veya doğruluk ölçütü olarak sınıflandır.",
    "Ana iddia ile onu destekleyen gerekçeleri ayır.",
    "Argümanın sonucunu ve gerekçe–sonuç bağını göster.",
    "Görüşü bir itiraz, karşı örnek veya sınır durumla değerlendir.",
  ],
  formativeAssessment: {
    tasks: [
      { processStep: "a", task: "Bilgi–inanç, doğruluk–gerçeklik ve özne–nesne ayrımlarından ikisini örnek ve karşı örnekle açıkla." },
      { processStep: "b", task: "Verilen soruları bilginin imkânı, kaynağı ve doğruluk ölçütleri problemlerine ayır; her sınıflandırmayı gerekçelendir." },
      { processStep: "c", task: "Seçilen iki görüşü problem, iddia, gerekçe ve itiraz boyutlarında karşılaştır; bir argümanı gerekçeli olarak değerlendir." },
      { processStep: "ç", task: "Seçilen kısa metindeki kavram, problem, iddia, gerekçe ve sonucu belirle; yorumunu metin kanıtıyla destekle." },
    ],
    rubric: [
      { id: "epistemic-concept-accuracy", label: "Epistemolojik kavram doğruluğu", sufficient: "Bilgi, inanç, doğruluk, gerçeklik, gerekçelendirme, özne ve nesne gerekli ayrımlarla doğru kullanılır.", developing: "Temel kullanım doğru; bir kavram ayrımı belirsizdir.", beginning: "Kavramlar eş anlamlılaştırılmış, karıştırılmış veya açıklanmamıştır." },
      { id: "problem-distinction", label: "Problem ayrımı", sufficient: "İmkân, kaynak ve doğruluk ölçütleri problemleri doğru sınıflandırılır ve gerekçelendirilir.", developing: "Üç problem görünür; bir sınıflandırmanın gerekçesi zayıftır.", beginning: "Problemler tek başlıkta toplanmış veya birbirine karıştırılmıştır." },
      { id: "argument-evaluation", label: "Görüş ve argüman değerlendirme", sufficient: "Görüş problem, iddia ve gerekçeyle kurulur; itiraz veya karşı örnekle değerlendirilir.", developing: "Görüş ve gerekçe görünür; değerlendirme dayanağı zayıftır.", beginning: "Yalnız filozof veya akım adı verilmiş ya da gerekçesiz kabul/ret vardır." },
      { id: "textual-evidence", label: "Metin kanıtı", sufficient: "Yorum metindeki kavram ve gerekçelere dayanır; kaynak ile alıntı/parafraz ayrımı korunur.", developing: "Metne gönderme vardır; kanıt–yorum bağı kısmen görünürdür.", beginning: "Metin kullanılmamış, kanıt gösterilmemiş veya doğrulanmamış söz atfedilmiştir." },
    ],
    feedbackPattern: "Doğru kurduğun epistemolojik ayrım ...; problem veya argümanda güçlendireceğin bağ ...; metin kanıtıyla yeniden göstereceğin nokta ...",
  },
  differentiationByPhase: [
    { phase: "Sorgulama", support: "Üç problem için renk kodlu soru kartları ve sınıflandırma cümlesi başlatıcıları.", enrichment: "Aynı sorunun neden iki problem alanına yakın görünebildiğini sınır durumla tartışma.", unchangedEvidenceStandard: "Üç problemi doğru ayıran gerekçeli sınıflandırma." },
    { phase: "Kavram İnşası", support: "Kısmen doldurulmuş kavram ağı, örnek/örnek olmayan kartları ve sözlü/yazılı yanıt seçeneği.", enrichment: "Doğru fakat gerekçesiz inanç için yeni karşı örnek üretme.", unchangedEvidenceStandard: "Doğru kavram ayrımı, ilişki ve örnek." },
    { phase: "Felsefi Muhakeme", support: "Problem–iddia–gerekçe–itiraz şablonu, yazılı hazırlık ve rol kartı.", enrichment: "İki kaynak görüşünü bir itiraz üzerinden karşılaştırıp sentezleme.", unchangedEvidenceStandard: "Adil yeniden kurulan görüş ve gerekçeli argüman değerlendirmesi." },
    { phase: "Metin İncelemesi ve Uygulama", support: "Kısa parçalara ayrılmış kaynaklı metin, anahtar kavram listesi ve işaretleme şablonu.", enrichment: "Metindeki ölçütü güncel bir bilgi iddiasına uygulayıp sınırını gösterme.", unchangedEvidenceStandard: "Kavram, problem, argüman ve metin kanıtının görünür olması." },
    { phase: "Biçimlendirici Değerlendirme", support: "Dört görevi adımlara ayırma, ek işlem süresi ve sözlü/yazılı ürün seçeneği.", enrichment: "İki görüşü aynı rubrikle değerlendirip daha güçlü gerekçeyi savunma.", unchangedEvidenceStandard: "Aynı dört rubrik ölçütü." },
  ],
  tymmEvidenceMappings: [
    { component: "SBAB14. Felsefi Muhakeme", phase: "Felsefi Muhakeme", learnerAction: "Epistemolojik görüşleri problem, iddia, gerekçe, itiraz ve sonuç bakımından değerlendirir.", evidence: "Altı boyutlu görüş–argüman matrisi." },
    { component: "KB2.4. Çözümleme", phase: "Metin İncelemesi ve Uygulama", learnerAction: "Metindeki kavram, problem ve argüman bileşenlerini ayırır.", evidence: "Altı ölçütlü metin inceleme formu." },
    { component: "KB2.5. Sınıflandırma", phase: "Sorgulama", learnerAction: "Soruları imkân, kaynak ve doğruluk ölçütleri problemlerine ayırır.", evidence: "Üç problemli sınıflandırma tablosu." },
    { component: "KB2.7. Karşılaştırma", phase: "Felsefi Muhakeme", learnerAction: "Görüşleri ortak problem ve argüman boyutlarında karşılaştırır.", evidence: "Altı boyutlu görüş matrisi." },
    { component: "KB2.10. Çıkarım Yapma", phase: "Sorgulama", learnerAction: "Bir görüşün gerekçelerinden doğan sonucu açıklar.", evidence: "Gerekçe–sonuç zinciri." },
    { component: "KB2.18. Tartışma", phase: "Felsefi Muhakeme", learnerAction: "Bir bilgi iddiasına gerekçeli itiraz yöneltir ve yanıt verir.", evidence: "İddia–gerekçe–itiraz kaydı." },
    { component: "KB3.3. Eleştirel Düşünme", phase: "Biçimlendirici Değerlendirme", learnerAction: "Argümanı karşı örnek veya sınır durumla sınayıp dönütle düzeltir.", evidence: "Rubrikli argüman revizyonu." },
    { component: "E3.6. Analitiklik", phase: "Kavram İnşası", learnerAction: "Bilgi, doğruluk, gerçeklik ve gerekçelendirme ayrımlarını çözümler.", evidence: "Epistemolojik kavram ağı." },
    { component: "E3.7. Sistematiklik", phase: "Metin İncelemesi ve Uygulama", learnerAction: "Metin inceleme ölçütlerini sıralı ve eksiksiz uygular.", evidence: "Tamamlanmış inceleme kontrol listesi." },
    { component: "E3.10. Eleştirel Bakma", phase: "Felsefi Muhakeme", learnerAction: "Bir görüşün gerekçesini itiraz veya karşı örnekle sınar.", evidence: "Argüman değerlendirme kaydı." },
    { component: "SDB2.2. İş Birliği", phase: "Biçimlendirici Değerlendirme", learnerAction: "Akran ürününe rubrik ölçütleriyle düzeltici dönüt verir.", evidence: "Ölçütlü akran dönütü." },
    { component: "D14. Saygı", phase: "Felsefi Muhakeme", learnerAction: "Karşı görüşü eleştirmeden önce çarpıtmadan yeniden kurar.", evidence: "Adil karşı görüş özeti." },
    { component: "D16. Sorumluluk", phase: "Yansıtma", learnerAction: "Kavramsal veya argümantatif hatasını dönüte dayanarak düzeltir.", evidence: "Revize edilmiş epistemolojik öz-yansıtma." },
    { component: "OB1. Bilgi Okuryazarlığı", phase: "Sorgulama ve Metin İncelemesi", learnerAction: "Kaynak, iddia, kanıt, parafraz ve yorum ayrımını korur.", evidence: "Kaynaklı bilgi iddiası inceleme notu." },
    { component: "OB2. Dijital Okuryazarlık", phase: "Metin İncelemesi ve Uygulama", learnerAction: "Güncel dijital bilgi iddiasının kaynağını ve doğrulama ölçütünü denetler.", evidence: "Kaynak ve doğruluk ölçütü kayıtlı değerlendirme formu." },
  ],
};

export const philosophyQualityEnrichment2026 = deepFreeze({
  "FEL.10.1.1": fel101QualityEnrichment,
  "FEL.10.2.1": fel1021QualityEnrichment,
  "FEL.10.2.2": fel1022QualityEnrichment,
  "FEL.10.3.1": fel1031QualityEnrichment,
  "FEL.10.4.1": fel1041QualityEnrichment,
  ...philosophyPilotQualityContracts2026,
});
