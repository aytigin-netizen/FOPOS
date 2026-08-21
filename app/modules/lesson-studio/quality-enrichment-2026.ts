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

export const philosophyQualityEnrichment2026 = deepFreeze({
  "FEL.10.1.1": fel101QualityEnrichment,
  "FEL.10.2.1": fel1021QualityEnrichment,
  "FEL.10.2.2": fel1022QualityEnrichment,
});
