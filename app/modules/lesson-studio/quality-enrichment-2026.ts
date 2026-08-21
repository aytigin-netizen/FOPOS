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

export const philosophyQualityEnrichment2026 = deepFreeze({
  "FEL.10.1.1": fel101QualityEnrichment,
});
