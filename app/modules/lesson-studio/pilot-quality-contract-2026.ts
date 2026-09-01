export const PILOT_QUALITY_OUTCOME_CODES = [
  "FEL.10.8.1",
  "FEL.11.2.1",
  "FEL.11.2.2",
  "FEL.11.3.1",
  "FEL.11.3.2",
  "FEL.11.5.1",
  "FEL.11.5.2",
] as const;

export type PilotQualityOutcomeCode = typeof PILOT_QUALITY_OUTCOME_CODES[number];
export type OutcomeRole = "primary" | "secondary";

export type PilotQualityContract = Readonly<{
  outcomeCode: PilotQualityOutcomeCode;
  unitCode: "F10_U8" | "F11_U2" | "F11_U3" | "F11_U5";
  version: "2026.3-1A";
  sourceType: "pedagogical-enrichment";
  sourceGuidance: string;
  conceptSafety: readonly string[];
  taskStandard: string;
  assessmentCriteria: readonly string[];
  feedbackPattern: string;
  revisionExpectation: string;
  differentiation: Readonly<{
    support: string;
    enrichment: string;
    unchangedEvidenceStandard: string;
  }>;
  sensitiveTopicSafety: Readonly<{
    teacherNotice: string;
    voluntaryDisclosureRule: string;
    alternativeParticipation: string;
  }>;
  weeklyOutcomeRoles: readonly Readonly<{
    week: number;
    role: OutcomeRole;
    rationale: string;
  }>[];
}>;

function roles(
  count: number,
  primaryWeeks: readonly number[],
  primaryRationale: string,
  secondaryRationale: string,
) {
  return Array.from({ length: count }, (_, index) => {
    const week = index + 1;
    const primary = primaryWeeks.includes(week);
    return {
      week,
      role: primary ? "primary" : "secondary",
      rationale: primary ? primaryRationale : secondaryRationale,
    } as const;
  });
}

const shared = {
  version: "2026.3-1A",
  sourceType: "pedagogical-enrichment",
  feedbackPattern: "Güçlü kanıtın …; geliştireceğin ölçüt …; revizyonda görünür kılacağın değişiklik …",
} as const;

const contracts: Record<PilotQualityOutcomeCode, PilotQualityContract> = {
  "FEL.10.8.1": {
    ...shared,
    outcomeCode: "FEL.10.8.1",
    unitCode: "F10_U8",
    sourceGuidance: "Din felsefesi ile teoloji ayrımını koruyan; görüş ve argümanları güvenilir felsefe kaynaklarına dayandıran; doğrudan alıntı, parafraz ve öğretmen açıklamasını ayıran kaynak kartı kullanılır.",
    conceptSafety: [
      "İman, inanç, bilgi ve kanıt eş anlamlılaştırılmaz.",
      "Bir dinî görüş, inanan kişinin kimliği veya değeri hakkında yargıya dönüştürülmez.",
      "Tanrı'nın varlığına ilişkin argümanlarda görüş, gerekçe, itiraz ve sınır ayrı gösterilir.",
    ],
    taskStandard: "Öğrenci en az iki görüşü çarpıtmadan yeniden kurar; bir argümanı kavram, gerekçe, itiraz ve sınır bakımından değerlendirir.",
    assessmentCriteria: ["Kavramsal doğruluk", "Adil görüş temsili", "Gerekçelendirme", "Kaynak ve bağlam kullanımı"],
    revisionExpectation: "Öğrenci dönüt sonrasında bir kavram kullanımını veya argüman değerlendirmesini gerekçesiyle düzeltir.",
    differentiation: {
      support: "Kavram kartı, görüş–gerekçe şablonu, yazılı hazırlık ve konuşmadan katılma seçeneği sunulur.",
      enrichment: "Aynı argümanı iki farklı itirazla sınama ve itirazların dayandığı varsayımları karşılaştırma görevi verilir.",
      unchangedEvidenceStandard: "Aynı dört ölçütte adil görüş temsili ve gerekçeli felsefi değerlendirme aranır.",
    },
    sensitiveTopicSafety: {
      teacherNotice: "Ders kişisel inancı açıklatma, doğrulatma veya tartışma konusu yapma biçiminde yürütülmez; felsefi problem ve argümanlar incelenir.",
      voluntaryDisclosureRule: "Öğrenci kişisel inancını, inançsızlığını veya ailesinin yaklaşımını açıklamak zorunda değildir.",
      alternativeParticipation: "Kişisel konuşma yerine anonim görüş kartı, kurgu örnek veya yazılı argüman çözümlemesi seçilebilir.",
    },
    weeklyOutcomeRoles: roles(3, [1, 2, 3], "Ünitenin tek öğrenme çıktısı haftanın birincil hedefidir.", "Uygulanmaz."),
  },
  "FEL.11.2.1": {
    ...shared,
    outcomeCode: "FEL.11.2.1",
    unitCode: "F11_U2",
    sourceGuidance: "Teknoloji, simülasyon ve yapay zekâ örneklerinde güncel olgusal iddia ile felsefi yorum ayrılır; tarih, kaynak türü ve doğrulama sınırı öğretmen önizlemesinde belirtilir.",
    conceptSafety: ["Teknoloji araç, teknik sistem ve yaşama biçimi anlamlarında ayrılır.", "Simülasyon gerçekliğin yokluğu ile eşitlenmez.", "Yapay zekâ çıktısı kaynak veya doğruluk kanıtı sayılmaz."],
    taskStandard: "Öğrenci teknolojiyle ilgili felsefi problemi kavram, bağlam, paydaş ve sonuç boyutlarında çözümler.",
    assessmentCriteria: ["Problem ayrımı", "Kavram doğruluğu", "Kaynak güncelliği", "Gerekçeli çözümleme"],
    revisionExpectation: "Öğrenci olgusal iddia ile felsefi yorum arasındaki en az bir karışıklığı dönütle düzeltir.",
    differentiation: {
      support: "Problem–olgu–yorum tablosu, kısa kaynak özeti ve yazılı/sözlü yanıt seçeneği sunulur.",
      enrichment: "Bir teknolojinin ontolojik ve aksiyolojik etkilerini karşıt gelecek senaryolarında sınama görevi verilir.",
      unchangedEvidenceStandard: "Aynı dört ölçütte felsefi problemi doğru ayıran kaynaklı çözümleme aranır.",
    },
    sensitiveTopicSafety: {
      teacherNotice: "Öğrencilerin kişisel dijital izleri, özel yazışmaları veya hesapları örnek olarak istenmez.",
      voluntaryDisclosureRule: "Öğrenci kendi teknoloji kullanımını veya yaşadığı çevrim içi olayı açıklamak zorunda değildir.",
      alternativeParticipation: "Kişisel deneyim yerine kurgu vaka veya kamusal ve kimliksizleştirilmiş örnek kullanılabilir.",
    },
    weeklyOutcomeRoles: roles(6, [1, 2, 3, 4], "Felsefi soru ve problemi anlama bu haftanın birincil hedefidir.", "Görüş üretme çıktısı birincil; problem anlama doğrulayıcı ikincil hedeftir."),
  },
  "FEL.11.2.2": {
    ...shared,
    outcomeCode: "FEL.11.2.2",
    unitCode: "F11_U2",
    sourceGuidance: "Görüş oluşturma görevinde kullanılan teknoloji örneğinin kaynağı, tarihi ve belirsizlikleri belirtilir; AI üretimi içerik doğrulanmadan kanıt olarak kullanılmaz.",
    conceptSafety: ["Görüş, kişisel tercih değil gerekçeli felsefi konum olarak kurulur.", "Yarar ve ilerleme değer bakımından tarafsız kabul edilmez.", "Sorumluluk yalnız bireye yüklenmeden tasarımcı, kurum ve toplum düzeyleri ayrılır."],
    taskStandard: "Öğrenci açık tez, en az iki gerekçe, adil karşı görüş, yanıt ve kaynaklı örnek içeren felsefi görüş oluşturur.",
    assessmentCriteria: ["Tez açıklığı", "Gerekçe ve kaynak", "Adil karşı görüş", "İtiraza yanıt ve revizyon"],
    revisionExpectation: "Öğrenci akran/öğretmen dönütüyle tez, gerekçe veya itiraza yanıtından en az birini güçlendirir.",
    differentiation: {
      support: "Tez–gerekçe–karşı görüş–yanıt iskelesi ve örnek kaynak paketi sunulur.",
      enrichment: "Görüşün farklı paydaşlar ve gelecek senaryolarındaki sonuçlarını karşılaştırma görevi verilir.",
      unchangedEvidenceStandard: "Aynı dört ölçütte kaynaklı, tutarlı ve revize edilmiş felsefi görüş aranır.",
    },
    sensitiveTopicSafety: {
      teacherNotice: "Görev, öğrencinin özel dijital yaşamını ifşa etmesini gerektirmez; kamusal teknoloji vakaları kullanılır.",
      voluntaryDisclosureRule: "Kişisel hesap, yazışma, görüntü veya kullanım süresi paylaşımı istenmez.",
      alternativeParticipation: "Kurgu paydaş rolü veya anonim vaka üzerinden yazılı görüş sunulabilir.",
    },
    weeklyOutcomeRoles: roles(6, [5, 6], "Görüş ve argüman oluşturma bu haftanın birincil hedefidir.", "Problem anlama birincil; görüş oluşturma hazırlayıcı ikincil hedeftir."),
  },
  "FEL.11.3.1": {
    ...shared,
    outcomeCode: "FEL.11.3.1",
    unitCode: "F11_U3",
    sourceGuidance: "Akıl–inanç tartışmasında görüşler dönem ve metin bağlamıyla, doğrulanabilir kaynak künyesiyle ve tek cümlelik sloganlara indirgenmeden sunulur.",
    conceptSafety: ["Bilgi, inanç, iman, güven ve kanaat ayrımları korunur.", "Akıl ve inanç zorunlu olarak çatışan tek tip alanlar sayılmaz.", "Gönül kavramı yalnız duygu veya akıl dışılık olarak tanımlanmaz."],
    taskStandard: "Öğrenci akıl–inanç ilişkisine ait problemi ve en az iki yaklaşımı kavram, gerekçe ve sınırlarıyla açıklar.",
    assessmentCriteria: ["Problem kavrayışı", "Kavram ayrımları", "Adil yaklaşım temsili", "Metin/bağlam kanıtı"],
    revisionExpectation: "Öğrenci bir yaklaşımı aşırı genelleyen ifadesini kaynak veya karşı örnek ışığında düzeltir.",
    differentiation: {
      support: "Karşılaştırma tablosu, kavram kartı, kısa metin parçaları ve alternatif yazılı katılım sunulur.",
      enrichment: "Aynı probleme üçüncü bir yaklaşım ekleyip varsayımları karşılaştırma görevi verilir.",
      unchangedEvidenceStandard: "Aynı dört ölçütte problem ve yaklaşımların adil, bağlamlı açıklaması aranır.",
    },
    sensitiveTopicSafety: {
      teacherNotice: "Öğretmen sınıftaki inanç konumlarını sınıflandırmaz; kişilere değil görüş ve gerekçelere odaklanır.",
      voluntaryDisclosureRule: "Öğrenci kendi veya ailesinin inanç yaklaşımını açıklamak zorunda değildir.",
      alternativeParticipation: "Kaynak metindeki görüşü temsil etme, anonim kart veya yazılı karşılaştırma seçilebilir.",
    },
    weeklyOutcomeRoles: roles(5, [1, 2, 3], "Felsefi soru ve problemi anlama bu haftanın birincil hedefidir.", "Görüş üretme birincil; problem anlama doğrulayıcı ikincil hedeftir."),
  },
  "FEL.11.3.2": {
    ...shared,
    outcomeCode: "FEL.11.3.2",
    unitCode: "F11_U3",
    sourceGuidance: "Öğrenci görüşü, kaynak metinlerdeki yaklaşımları doğru temsil ederek ve alıntı/parafraz ayrımını koruyarak oluşturulur.",
    conceptSafety: ["Kişisel inanç beyanı felsefi gerekçenin yerine geçmez.", "Karşı görüş zayıflatılarak veya kimlik üzerinden eleştirilmez.", "Akıl, gönül ve inanç ilişkisi tek nedenli açıklanmaz."],
    taskStandard: "Öğrenci açık konum, iki gerekçe, adil karşı görüş, yanıt ve metin kanıtı içeren felsefi görüş oluşturur.",
    assessmentCriteria: ["Konum açıklığı", "Gerekçelendirme", "Adil karşı görüş", "Metin kanıtı ve revizyon"],
    revisionExpectation: "Öğrenci dönütle en az bir gerekçeyi veya karşı görüşe yanıtı yeniden yazar.",
    differentiation: {
      support: "Konum–gerekçe–kanıt–karşı görüş–yanıt şablonu ve sözlü olmayan katılım seçeneği sunulur.",
      enrichment: "Görüşün epistemolojik ve varoluşsal sonuçlarını ayrı ayrı savunma görevi verilir.",
      unchangedEvidenceStandard: "Aynı dört ölçütte tutarlı, adil ve kaynaklı felsefi görüş aranır.",
    },
    sensitiveTopicSafety: {
      teacherNotice: "Değerlendirme öğrencinin inanç konumuna değil felsefi gerekçelendirme kalitesine dayanır.",
      voluntaryDisclosureRule: "Öğrenci kişisel inancını veya inançsızlığını açıklamak zorunda değildir.",
      alternativeParticipation: "Öğrenci kendi adına değil seçtiği felsefi yaklaşım adına gerekçeli metin yazabilir.",
    },
    weeklyOutcomeRoles: roles(5, [4, 5], "Görüş ve argüman oluşturma bu haftanın birincil hedefidir.", "Problem anlama birincil; görüş oluşturma hazırlayıcı ikincil hedeftir."),
  },
  "FEL.11.5.1": {
    ...shared,
    outcomeCode: "FEL.11.5.1",
    unitCode: "F11_U5",
    sourceGuidance: "Hayatın anlamı, mutluluk, ölüm, kaygı, umutsuzluk ve saçma kavramları bağlamlı felsefe metinleriyle; klinik veya kişisel tanı iddiasına dönüştürülmeden ele alınır.",
    conceptSafety: ["Felsefi kaygı ve umutsuzluk kavramları klinik tanı olarak kullanılmaz.", "Hayatın anlamı tek, zorunlu veya öğretmen tarafından onaylanan bir cevapla sınırlandırılmaz.", "Ölüm ve saçma kavramları romantikleştirilmez veya zarar verici davranışla ilişkilendirilmez."],
    taskStandard: "Öğrenci hayatın anlamına ilişkin felsefi problemi kavram, yaklaşım, gerekçe ve sonuçlarıyla açıklar.",
    assessmentCriteria: ["Problem ayrımı", "Kavramsal güvenlik", "Yaklaşım karşılaştırması", "Metin ve gerekçe kullanımı"],
    revisionExpectation: "Öğrenci kavramsal genellemesini bir metin kanıtı veya karşı örnekle düzeltir.",
    differentiation: {
      support: "Kurgu vaka, kavram kartı, kısa metin parçaları ve kişisel olmayan yazılı katılım sunulur.",
      enrichment: "İki yaklaşımın mutluluk, özgürlük, sorumluluk ve kendi olma sonuçlarını karşılaştırma görevi verilir.",
      unchangedEvidenceStandard: "Aynı dört ölçütte güvenli, kavramsal olarak doğru ve gerekçeli problem çözümlemesi aranır.",
    },
    sensitiveTopicSafety: {
      teacherNotice: "Öğretmen kişisel travma veya ruh sağlığı açıklaması istemez; belirgin güvenlik kaygısında okulun koruyucu yönlendirme sürecini izler.",
      voluntaryDisclosureRule: "Öğrenci ölüm, kayıp, umutsuzluk veya kişisel yaşam anlamı deneyimini paylaşmak zorunda değildir.",
      alternativeParticipation: "Kurgu karakter, kaynak metin veya üçüncü kişi vakası üzerinden analiz yapılabilir.",
    },
    weeklyOutcomeRoles: roles(6, [1, 2, 3, 4], "Felsefi soru ve problemi anlama bu haftanın birincil hedefidir.", "Görüş üretme birincil; problem anlama doğrulayıcı ikincil hedeftir."),
  },
  "FEL.11.5.2": {
    ...shared,
    outcomeCode: "FEL.11.5.2",
    unitCode: "F11_U5",
    sourceGuidance: "Görüş metni, doğrulanabilir felsefe kaynaklarıyla desteklenir; öğrencinin kişisel yaşam öyküsü kanıt veya zorunlu içerik olarak istenmez.",
    conceptSafety: ["Kişisel açıklama felsefi gerekçenin yerine geçmez.", "Karşı yaklaşım değersiz, hastalıklı veya anlamsız diye etiketlenmez.", "Felsefi görüş, zarar verici davranışı öneren veya romantikleştiren ifadeler içermez."],
    taskStandard: "Öğrenci açık tez, iki felsefi gerekçe, kaynaklı yaklaşım, adil karşı görüş, yanıt ve revizyon içeren metin oluşturur.",
    assessmentCriteria: ["Tez ve kavram doğruluğu", "Felsefi gerekçe", "Adil karşı görüş", "Kaynak, güvenlik ve revizyon"],
    revisionExpectation: "Öğrenci rubrik ve akran dönütünden sonra tez, gerekçe veya karşı görüşe yanıtından en az birini güçlendirir.",
    differentiation: {
      support: "Kişisel olmayan konu seçimi, paragraf iskelesi, kavram listesi ve ek işlem süresi sunulur.",
      enrichment: "Görüşü rakip iki yaklaşımın en güçlü itirazlarına karşı savunma görevi verilir.",
      unchangedEvidenceStandard: "Aynı dört ölçütte kaynaklı, güvenli, tutarlı ve revize edilmiş felsefi metin aranır.",
    },
    sensitiveTopicSafety: {
      teacherNotice: "Ürün felsefi niteliğine göre değerlendirilir; kişisel itiraf, iyilik hâli beyanı veya yaşam öyküsü istenmez.",
      voluntaryDisclosureRule: "Öğrenci kişisel duygu, kayıp, kaygı veya umutsuzluk deneyimini açıklamak zorunda değildir.",
      alternativeParticipation: "Seçili felsefi yaklaşım, edebî kurgu veya anonim vaka üzerinden görüş metni yazılabilir.",
    },
    weeklyOutcomeRoles: roles(6, [5, 6], "Görüş ve argüman oluşturma bu haftanın birincil hedefidir.", "Problem anlama birincil; görüş oluşturma hazırlayıcı ikincil hedeftir."),
  },
};

function deepFreeze<T>(value: T): Readonly<T> {
  if (value !== null && typeof value === "object" && !Object.isFrozen(value)) {
    for (const nested of Object.values(value as Record<string, unknown>)) deepFreeze(nested);
    Object.freeze(value);
  }
  return value;
}

export const philosophyPilotQualityContracts2026 = deepFreeze(contracts);

export function getPilotQualityContract(outcomeCode: string): PilotQualityContract | null {
  return philosophyPilotQualityContracts2026[outcomeCode as PilotQualityOutcomeCode] ?? null;
}

export function getWeeklyOutcomeRole(outcomeCode: string, week: number) {
  return getPilotQualityContract(outcomeCode)?.weeklyOutcomeRoles[week - 1] ?? null;
}
