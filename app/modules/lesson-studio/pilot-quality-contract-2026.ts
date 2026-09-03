export const PILOT_QUALITY_OUTCOME_CODES = [
  "FEL.10.5.1",
  "FEL.10.6.1",
  "FEL.10.7.1",
  "FEL.10.8.1",
  "FEL.10.9.1",
  "FEL.11.1.1",
  "FEL.11.1.2",
  "FEL.11.2.1",
  "FEL.11.2.2",
  "FEL.11.3.1",
  "FEL.11.3.2",
  "FEL.11.4.1",
  "FEL.11.4.2",
  "FEL.11.5.1",
  "FEL.11.5.2",
  "FEL.11.6.1",
  "FEL.11.6.2",
] as const;

export type PilotQualityOutcomeCode = typeof PILOT_QUALITY_OUTCOME_CODES[number];
export type OutcomeRole = "primary" | "secondary";

export type PilotQualityContract = Readonly<{
  outcomeCode: PilotQualityOutcomeCode;
  unitCode: "F10_U5" | "F10_U6" | "F10_U7" | "F10_U8" | "F10_U9" | "F11_U1" | "F11_U2" | "F11_U3" | "F11_U4" | "F11_U5" | "F11_U6";
  version: "2026.3-1A" | "2026.3-1B";
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

const shared1B = {
  version: "2026.3-1B",
  sourceType: "pedagogical-enrichment",
  feedbackPattern: "M1–M4 ölçütlerinden güçlü kanıtın …; geliştireceğin ölçüt …; revizyonda görünür kılacağın değişiklik …",
} as const;

const contracts: Record<PilotQualityOutcomeCode, PilotQualityContract> = {
  "FEL.10.5.1": {
    ...shared1B,
    outcomeCode: "FEL.10.5.1",
    unitCode: "F10_U5",
    sourceGuidance: "Ahlak felsefesi metinlerinde yazar, eser ve bağlam belirtilir; doğrudan alıntı, parafraz, sadeleştirme ve öğretmen uyarlaması ayrılır; betimleyici kültür gözleminden doğrudan normatif sonuç çıkarılmaz.",
    conceptSafety: [
      "Ahlak, etik, hukuk ve toplumsal kabul eş anlamlılaştırılmaz.",
      "Niyet, sonuç, ilke ve erdem birbirinin yerine kullanılmaz.",
      "Kişi veya kimlik değil eylem, gerekçe ve ilke felsefi ölçütlerle değerlendirilir.",
    ],
    taskStandard: "Öğrenci açık bir etik iddia, ilgili gerekçe, uygun örnek veya metin kanıtı, adil karşı görüş ve yanıt içeren gerekçeli değerlendirme üretir.",
    assessmentCriteria: ["M1 Kavramsal doğruluk", "M2 Felsefi gerekçelendirme", "M3 Karşı görüş ve değerlendirme", "M4 Kaynak ve ürün bütünlüğü"],
    revisionExpectation: "Öğrenci dönüt sonrasında kavram ayrımı, etik gerekçe, karşı görüş veya kaynak kullanımından en az birini görünür biçimde düzeltir ve değişiklik gerekçesini belirtir.",
    differentiation: {
      support: "Kavram kartı, kurmaca vaka, tez–gerekçe–kanıt cümle başlatıcıları, yazılı hazırlık ve gözlemci–özetleyici rolü sunulur.",
      enrichment: "Aynı etik ikilemi sonuç, niyet, ilke ve erdem ölçütleriyle karşılaştırıp ölçütlerin sınırlarını karşı örnekle sınama görevi verilir.",
      unchangedEvidenceStandard: "Aynı M1–M4 ölçütlerinde doğru kavram ayrımı, gerekçeli etik iddia, adil karşı görüş, kaynak ve görünür revizyon aranır.",
    },
    sensitiveTopicSafety: {
      teacherNotice: "Ders kişisel itiraf, aile değeri, suçluluk veya travmatik deneyim açıklatmadan yürütülür; öğrenci kanaatine göre puanlanmaz.",
      voluntaryDisclosureRule: "Öğrenci kendi davranışını, ailesinin değerlerini veya özel bir ahlaki yaşantısını açıklamak zorunda değildir.",
      alternativeParticipation: "Kişisel konuşma yerine kurmaca ya da üçüncü kişi vakası, yazılı gerekçe, anonim kart veya gözlemci–özetleyici rolü seçilebilir.",
    },
    weeklyOutcomeRoles: roles(4, [1, 2, 3, 4], "Ünitenin tek öğrenme çıktısı haftanın birincil hedefidir.", "Uygulanmaz."),
  },
  "FEL.10.6.1": {
    ...shared1B,
    outcomeCode: "FEL.10.6.1",
    unitCode: "F10_U6",
    sourceGuidance: "İncelenen eserin sanatçısı, kaynağı ve bağlamı belirtilir; metinlerde alıntı, parafraz ve uyarlama ayrılır; kişisel beğeni felsefi gerekçenin yerine kullanılmaz.",
    conceptSafety: [
      "Güzel, sanat eseri, estetik haz, estetik yargı ve kişisel beğeni eş anlamlılaştırılmaz.",
      "Taklit, yaratım ve oyun kuramları kesin ve birbirini bütünüyle dışlayan tanımlar gibi sunulmaz.",
      "Sanatsal yetenek veya teknik beceri felsefi kanıt ve gerekçelendirme yerine puanlanmaz.",
    ],
    taskStandard: "Öğrenci bir eser veya estetik iddiayı kavram, ölçüt, gerekçe, metin ya da eser kanıtı ve adil karşı görüşle değerlendirir.",
    assessmentCriteria: ["M1 Kavramsal doğruluk", "M2 Felsefi gerekçelendirme", "M3 Karşı görüş ve değerlendirme", "M4 Kaynak ve ürün bütünlüğü"],
    revisionExpectation: "Öğrenci dönüt sonrasında beğeni ile gerekçeli estetik yargı ayrımını, kullandığı ölçütü, karşı görüşü veya kaynak kaydını görünür biçimde güçlendirir.",
    differentiation: {
      support: "Kaynaklı eser kartı, kısmen doldurulmuş karşılaştırma matrisi, ölçüt cümle başlatıcıları ve yazılı ya da anonim katılım sunulur.",
      enrichment: "Aynı eseri iki estetik yaklaşımın ölçütleriyle değerlendirip her yaklaşım için bir sınır durum geliştirme görevi verilir.",
      unchangedEvidenceStandard: "Aynı M1–M4 ölçütlerinde eser–kavram–ölçüt bağlantısı, gerekçe, adil karşı görüş, kaynak ve görünür revizyon aranır.",
    },
    sensitiveTopicSafety: {
      teacherNotice: "Öğrencinin sanatsal yeteneği, beden görünümü, kültürel kimliği veya beğenisi değerlendirme konusu yapılmaz; felsefi ürün ölçütlerle incelenir.",
      voluntaryDisclosureRule: "Öğrenci kişisel beğenisini, sanatsal üretimini, kültürel aidiyetini veya özel estetik deneyimini açıklamak zorunda değildir.",
      alternativeParticipation: "Kişisel beğeni açıklaması yerine kaynaklı eser kartı üzerinden yazılı inceleme, anonim ölçüt kartı veya gözlemci rolü seçilebilir.",
    },
    weeklyOutcomeRoles: roles(3, [1, 2, 3], "Ünitenin tek öğrenme çıktısı haftanın birincil hedefidir.", "Uygulanmaz."),
  },
  "FEL.10.7.1": {
    ...shared1B,
    outcomeCode: "FEL.10.7.1",
    unitCode: "F10_U7",
    sourceGuidance: "Siyaset felsefesi görüşlerinde yazar, eser ve tarihsel bağlam belirtilir; güncel kişi veya parti hedef gösterilmez; düşünür adı doğruluk kanıtı ve güncel kimlik etiketi sayılmaz.",
    conceptSafety: [
      "Güç, otorite, iktidar, egemenlik ve meşruiyet eş anlamlılaştırılmaz.",
      "Adalet, özgürlük, eşitlik ve hak tek bir güncel siyasi görüşle özdeşleştirilmez.",
      "Tarihsel felsefi metin güncel kişi, parti veya yönetimin doğrudan karşılığı gibi sunulmaz.",
    ],
    taskStandard: "Öğrenci siyasal bir kavram veya düzen iddiasını açık tez, gerekçe, tarihsel ya da kurmaca kanıt, adil karşı görüş ve yanıtla değerlendirir.",
    assessmentCriteria: ["M1 Kavramsal doğruluk", "M2 Felsefi gerekçelendirme", "M3 Karşı görüş ve değerlendirme", "M4 Kaynak ve ürün bütünlüğü"],
    revisionExpectation: "Öğrenci dönüt sonrasında bir kavram karışıklığını, siyasal gerekçesini, karşı görüş temsilini veya tarihsel kaynak kullanımını görünür biçimde düzeltir.",
    differentiation: {
      support: "Kurmaca toplum vakası, kavram kartı, tez–gerekçe–karşı görüş iskelesi, anonim yazılı çalışma ve gözlemci rolü sunulur.",
      enrichment: "Bir düzen önerisini adalet, özgürlük, eşitlik, güvenlik, refah ve kaynak dağılımı ölçütleri arasındaki çatışmalarla sınama görevi verilir.",
      unchangedEvidenceStandard: "Aynı M1–M4 ölçütlerinde tarafsız kavram kullanımı, gerekçeli tez, adil karşı görüş, bağlamlı kaynak ve görünür revizyon aranır.",
    },
    sensitiveTopicSafety: {
      teacherNotice: "Ders güncel parti, kişi veya öğrenci kimliği üzerinden kutuplaştırılmaz; millî bilinç ve vatanseverlik tek bir güncel siyasi görüşle özdeşleştirilmez.",
      voluntaryDisclosureRule: "Öğrenci parti tercihini, oy davranışını, politik kimliğini veya ailesinin siyasi görüşünü açıklamak zorunda değildir.",
      alternativeParticipation: "Kurmaca toplum, tarihsel vaka, anonim görüş kartı, bireysel yazılı çalışma veya gözlemci–özetleyici rolü seçilebilir.",
    },
    weeklyOutcomeRoles: roles(4, [1, 2, 3, 4], "Ünitenin tek öğrenme çıktısı haftanın birincil hedefidir.", "Uygulanmaz."),
  },
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
  "FEL.10.9.1": {
    ...shared1B,
    outcomeCode: "FEL.10.9.1",
    unitCode: "F10_U9",
    sourceGuidance: "Bilimsel bulgu, bilim insanının kişisel görüşü ve bilim felsefesi argümanı ayrılır; kaynak türü, tarih, bağlam ve sınırlılık belirtilir; tek çalışma bilimsel uzlaşma gibi sunulmaz.",
    conceptSafety: [
      "Olgu, veri, gözlem, deney, hipotez, model, kuram, yasa, kanıt ve felsefi yorum eş anlamlılaştırılmaz.",
      "Doğrulama, yanlışlanabilirlik ve paradigma aynı sınır çizme ölçütü gibi kullanılmaz.",
      "Bilim olmayan her iddia otomatik olarak değersiz, anlamsız veya yanlış sayılmaz.",
    ],
    taskStandard: "Öğrenci bilim felsefesi iddiasını kavram, sınır çizme ölçütü, kaynaklı gerekçe, karşı örnek veya itiraz ve yöntemsel sınır bakımından değerlendirir.",
    assessmentCriteria: ["M1 Kavramsal doğruluk", "M2 Felsefi gerekçelendirme", "M3 Karşı görüş ve değerlendirme", "M4 Kaynak ve ürün bütünlüğü"],
    revisionExpectation: "Öğrenci dönüt sonrasında bilimsel kavram ayrımını, sınır çizme gerekçesini, karşı örneğini veya kaynak/bağlam kaydını görünür biçimde düzeltir.",
    differentiation: {
      support: "Bilimsel kavram kartı, ilişki şeması, kurmaca iddia, kısa kaynak özeti ve yazılı ya da gözlemci katılım seçeneği sunulur.",
      enrichment: "Aynı iddiayı doğrulama, yanlışlanabilirlik ve paradigma yaklaşımlarıyla sınayıp her ölçütün güçlü yön ve sınırını karşılaştırma görevi verilir.",
      unchangedEvidenceStandard: "Aynı M1–M4 ölçütlerinde doğru kavram ayrımı, kaynaklı felsefi gerekçe, adil itiraz, bağlam ve görünür revizyon aranır.",
    },
    sensitiveTopicSafety: {
      teacherNotice: "Sağlık örnekleri tıbbi tavsiyeye dönüştürülmez; aldatma, baskı veya itaat deneyi canlandırılmaz; öğrenci kanaatine göre puanlanmaz.",
      voluntaryDisclosureRule: "Öğrenci sağlık durumunu, inancını, siyasi görüşünü veya kişisel bilim anlayışını açıklamak zorunda değildir.",
      alternativeParticipation: "Kişisel açıklama yerine kurmaca iddia kartı, tarihsel bilim vakası, anonim soru veya gözlemci–özetleyici rolü seçilebilir.",
    },
    weeklyOutcomeRoles: roles(3, [1, 2, 3], "Ünitenin tek öğrenme çıktısı haftanın birincil hedefidir.", "Uygulanmaz."),
  },
  "FEL.11.1.1": {
    ...shared1B,
    outcomeCode: "FEL.11.1.1",
    unitCode: "F11_U1",
    sourceGuidance: "Çevre sorunlarına ilişkin bilimsel veri, kurum raporu ve tarih bilgisi kaynaklandırılır; olgusal neden ile çevre etiğine ilişkin normatif değerlendirme ve bireysel ile sistemik düzey açıkça ayrılır.",
    conceptSafety: ["Çevre sorunu, çevre etiği problemi ve kişisel tüketim tercihi eş anlamlılaştırılmaz.", "Olgusal nedenlerden tek başına normatif sorumluluk sonucu çıkarılmaz.", "Bireysel davranış tek neden veya tek çözüm sayılmadan kurum, üretim ve politika düzeyleriyle birlikte incelenir."],
    taskStandard: "Öğrenci çevreyle ilgili felsefi soru ve problemi kavram, kaynaklı veri, paydaş düzeyleri, etik gerekçe ve adil karşı görüşle çözümler.",
    assessmentCriteria: ["M1 Kavramsal doğruluk", "M2 Felsefi gerekçelendirme", "M3 Karşı görüş ve değerlendirme", "M4 Kaynak ve ürün bütünlüğü"],
    revisionExpectation: "Öğrenci dönüt sonrasında olgu–norm ayrımını, sorumluluk düzeylerini, karşı görüşü veya kaynak kullanımını görünür biçimde düzeltir.",
    differentiation: { support: "Kaynaklı veri kartı, neden–sonuç şeması, kurmaca paydaş vakası, cümle başlatıcıları ve yazılı ya da gözlemci katılımı sunulur.", enrichment: "Aynı çevre sorununu insan, canlı ve çevre merkezci yaklaşımlarla ve bireysel–sistemik sorumluluk düzeylerinde karşılaştırma görevi verilir.", unchangedEvidenceStandard: "Aynı M1–M4 ölçütlerinde doğru kavram, kaynaklı veri, felsefi gerekçe, adil karşı görüş ve görünür revizyon aranır." },
    sensitiveTopicSafety: { teacherNotice: "Ders öğrenciyi veya ailesini tüketim tercihleri üzerinden suçlandırmaz; kişisel davranış taahhüdünü öğrenme kanıtı ya da puanlama koşulu yapmaz.", voluntaryDisclosureRule: "Öğrenci kendi ya da ailesinin tüketim, ulaşım, enerji kullanımı veya çevre davranışını açıklamak zorunda değildir.", alternativeParticipation: "Kişisel açıklama yerine sistemik veya kurmaca vaka, paydaş rolü, anonim soru, veri temelli yazılı çözümleme ya da gözlemci rolü seçilebilir." },
    weeklyOutcomeRoles: roles(6, [1, 2, 3], "Çevreyle ilgili felsefi soru ve problemi anlama bu haftanın birincil hedefidir.", "Problem çözümleme ve görüş üretme birincil; problem anlama doğrulayıcı ikincil hedeftir."),
  },
  "FEL.11.1.2": {
    ...shared1B,
    outcomeCode: "FEL.11.1.2",
    unitCode: "F11_U1",
    sourceGuidance: "Çevre verilerinin kurum, tarih, kapsam ve sınırlılığı belirtilir; alıntı, parafraz ve öğretmen uyarlaması ayrılır; veriden normatif sonuca geçiş ayrıca gerekçelendirilir.",
    conceptSafety: ["Sürdürülebilirlik, koruma, sorumluluk ve adalet tek bir slogan olarak kullanılmaz.", "Bilimsel veri felsefi görüşün yerine geçmez; normatif sonuç açık etik gerekçe ister.", "Bireysel, kurumsal ve sistemik sorumluluk düzeyleri birbirine indirgenmez."],
    taskStandard: "Öğrenci kaynaklı çevre verisini çözümleyerek açık tez, iki felsefi gerekçe, adil karşı görüş, yanıt ve uygulanabilir sistemik öneri içeren ürün oluşturur.",
    assessmentCriteria: ["M1 Kavramsal doğruluk", "M2 Felsefi gerekçelendirme", "M3 Karşı görüş ve değerlendirme", "M4 Kaynak ve ürün bütünlüğü"],
    revisionExpectation: "Öğrenci dönüt sonrasında veri yorumunu, normatif gerekçesini, karşı görüşe yanıtını veya kaynak kaydını görünür biçimde güçlendirir.",
    differentiation: { support: "Veri okuma soruları, tez–gerekçe–karşı görüş iskelesi, kurmaca paydaş seçimi ve sözlü olmayan katılım yolu sunulur.", enrichment: "Önerinin farklı paydaşlara ve gelecek kuşaklara etkisini karşılaştırıp olası ödünleşimleri gerekçelendirme görevi verilir.", unchangedEvidenceStandard: "Aynı M1–M4 ölçütlerinde kaynaklı çözümleme, tutarlı normatif gerekçe, adil karşı görüş ve görünür revizyon aranır." },
    sensitiveTopicSafety: { teacherNotice: "Öğrenciden suçluluk beyanı, kişisel tüketim itirafı veya belirli bir çevre eylemine katılma taahhüdü istenmez; yönlendirilmiş aktivizm yapılmaz.", voluntaryDisclosureRule: "Öğrenci kendi çevre davranışını, ailesinin tercihlerini veya siyasi tutumunu açıklamak zorunda değildir.", alternativeParticipation: "Kimliksizleştirilmiş veri, kurmaca paydaş, anonim görüş kartı, yazılı felsefi metin veya gözlemci–özetleyici rolü seçilebilir." },
    weeklyOutcomeRoles: roles(6, [4, 5, 6], "Çevre problemini çözümleme ve gerekçeli görüş oluşturma bu haftanın birincil hedefidir.", "Problem anlama birincil; çözümleme ve görüş üretme hazırlayıcı ikincil hedeftir."),
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
  "FEL.11.4.1": {
    ...shared1B,
    outcomeCode: "FEL.11.4.1",
    unitCode: "F11_U4",
    sourceGuidance: "Edebî parçanın yazarı, eseri ve bağlamı belirtilir; doğrudan alıntı, parafraz, sadeleştirme ve öğretmen uyarlaması etiketlenir; anlatıcı, karakter ve yazar görüşü ayrılır.",
    conceptSafety: ["Edebî ifade, felsefi tez ve felsefi argüman eş anlamlılaştırılmaz.", "Anlatıcı, karakter ve yazarın görüşü doğrudan özdeşleştirilmez.", "Edebî beğeni veya yaratıcı yazarlık felsefi çözümleme kanıtının yerine geçmez."],
    taskStandard: "Öğrenci kaynaklı bir edebî parçada felsefi kavram, problem, tez ve gerekçeyi metin kanıtıyla belirler; alternatif yorumu adil biçimde değerlendirir.",
    assessmentCriteria: ["M1 Kavramsal doğruluk", "M2 Felsefi gerekçelendirme", "M3 Karşı görüş ve değerlendirme", "M4 Kaynak ve ürün bütünlüğü"],
    revisionExpectation: "Öğrenci dönüt sonrasında anlatıcı–karakter–yazar ayrımını, felsefi problem bağlantısını, metin kanıtını veya alternatif yorumu görünür biçimde düzeltir.",
    differentiation: { support: "Kısa kaynak parçası, anlatıcı–karakter–yazar tablosu, kavram işaretleme şablonu ve yazılı ya da gözlemci katılımı sunulur.", enrichment: "Aynı edebî parçayı iki felsefi yaklaşım açısından yorumlayıp her yorumun metinsel sınırını gösterme görevi verilir.", unchangedEvidenceStandard: "Aynı M1–M4 ölçütlerinde doğru kavram, felsefi problem, metin kanıtı, adil alternatif yorum ve görünür revizyon aranır." },
    sensitiveTopicSafety: { teacherNotice: "Öğrencinin edebî zevki, yaratıcı yazma yeteneği veya kişisel yaşam deneyimi değerlendirilmez; ürün felsefi kanıt ölçütleriyle incelenir.", voluntaryDisclosureRule: "Öğrenci kişisel okuma zevkini, yaşam öyküsünü veya varoluşsal deneyimini açıklamak zorunda değildir.", alternativeParticipation: "Kurmaca karakter veya üçüncü kişi, kısa kaynak parçası, yazılı çözümleme, anonim yorum kartı ya da gözlemci rolü seçilebilir." },
    weeklyOutcomeRoles: roles(6, [1, 2], "Edebî unsurlardaki felsefi problem ve görüşü anlama bu haftanın birincil hedefidir.", "Felsefi görüş üretme birincil; metin çözümleme doğrulayıcı ikincil hedeftir."),
  },
  "FEL.11.4.2": {
    ...shared1B,
    outcomeCode: "FEL.11.4.2",
    unitCode: "F11_U4",
    sourceGuidance: "Felsefi görüş oluştururken eserin künyesi ve kullanılan parçanın bağlamı korunur; alıntı, parafraz, sadeleştirme ve öğrencinin özgün ifadesi açıkça ayrılır.",
    conceptSafety: ["İmge, tema, felsefi kavram, tez ve argüman birbirinin yerine kullanılmaz.", "Edebî etki veya özgünlük tek başına felsefi doğruluk ve gerekçelendirme sayılmaz.", "Kurmaca karakterin görüşü öğrenciye, yazara veya gerçek kişiye atfedilmez."],
    taskStandard: "Öğrenci edebî biçimden hareketle açık felsefi tez, iki gerekçe, metin kanıtı, adil karşı görüş ve yanıt içeren gerekçeli görüş oluşturur.",
    assessmentCriteria: ["M1 Kavramsal doğruluk", "M2 Felsefi gerekçelendirme", "M3 Karşı görüş ve değerlendirme", "M4 Kaynak ve ürün bütünlüğü"],
    revisionExpectation: "Öğrenci dönüt sonrasında tezini, edebî kanıt ile felsefi gerekçe bağını, karşı görüşü veya kaynak etiketini görünür biçimde güçlendirir.",
    differentiation: { support: "Kurmaca karakter seçeneği, tez–gerekçe–kanıt şablonu, kısa kaynak parçası ve yaratıcı yazı gerektirmeyen analitik ürün sunulur.", enrichment: "Aynı tezi edebî ve kavramsal iki biçimde kurup her biçimin felsefi açıklık ve etki bakımından sınırlarını karşılaştırma görevi verilir.", unchangedEvidenceStandard: "Aynı M1–M4 ölçütlerinde açık tez, kaynaklı gerekçe, adil karşı görüş, ürün bütünlüğü ve görünür revizyon aranır." },
    sensitiveTopicSafety: { teacherNotice: "Görev kişisel itiraf veya edebî yetenek gösterisine dönüştürülmez; yaratıcı ürün seçmeyen öğrenci aynı felsefi standardı analitik metinle gösterebilir.", voluntaryDisclosureRule: "Öğrenci kişisel yaşamını, duygularını, okuma geçmişini veya varoluşsal deneyimini açıklamak zorunda değildir.", alternativeParticipation: "Kurmaca karakter, üçüncü kişi, analitik kısa metin, anonim yazılı çözümleme veya gözlemci–özetleyici rolü seçilebilir." },
    weeklyOutcomeRoles: roles(6, [3, 4, 5, 6], "Edebî unsurlardan hareketle gerekçeli felsefi görüş oluşturma bu haftanın birincil hedefidir.", "Metin çözümleme birincil; görüş üretme hazırlayıcı ikincil hedeftir."),
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
  "FEL.11.6.1": {
    ...shared1B,
    outcomeCode: "FEL.11.6.1",
    unitCode: "F11_U6",
    sourceGuidance: "Hukuk felsefesi metinlerinde yazar, eser, hukuk düzeni ve tarihsel bağlam belirtilir; kurmaca veya kimliksizleştirilmiş vaka gerçek hukuki danışmanlık ve güncel dava yorumu gibi sunulmaz.",
    conceptSafety: ["Kural, yasa, hak, özgürlük, yasallık, meşruiyet ve adalet eş anlamlılaştırılmaz.", "Yasal olanın zorunlu olarak adil veya meşru olduğu varsayılmaz.", "Felsefi vaka çözümlemesi bireysel hukuki tavsiye, dava stratejisi veya suç isnadı değildir."],
    taskStandard: "Öğrenci hukukla ilgili felsefi problem ve yaklaşımları kavram, ilke, kaynaklı gerekçe, kurmaca vaka ve adil karşı görüşle çözümler.",
    assessmentCriteria: ["M1 Kavramsal doğruluk", "M2 Felsefi gerekçelendirme", "M3 Karşı görüş ve değerlendirme", "M4 Kaynak ve ürün bütünlüğü"],
    revisionExpectation: "Öğrenci dönüt sonrasında yasallık–meşruiyet–adalet ayrımını, ilke gerekçesini, karşı görüşü veya kaynak bağlamını görünür biçimde düzeltir.",
    differentiation: { support: "Kavram kartı, kimliksizleştirilmiş kurmaca vaka, ilke–gerekçe tablosu, yazılı görev ve gözlemci–özetleyici rolü sunulur.", enrichment: "Aynı hukuk vakasını doğal hukuk, hukuki pozitivizm ve adalet yaklaşımlarıyla değerlendirip ilke çatışmalarını sınama görevi verilir.", unchangedEvidenceStandard: "Aynı M1–M4 ölçütlerinde doğru hukuk felsefesi ayrımları, gerekçeli ilke, adil karşı görüş, kaynak ve görünür revizyon aranır." },
    sensitiveTopicSafety: { teacherNotice: "Gerçek suç, mağduriyet, aile davası veya siyasi tercih açıklatılmaz; ders hukuki danışmanlık ya da dava stratejisi üretme etkinliğine dönüştürülmez.", voluntaryDisclosureRule: "Öğrenci kendisinin veya ailesinin hukuki uyuşmazlığını, mağduriyetini, suç isnadını ya da siyasi tercihini açıklamak zorunda değildir.", alternativeParticipation: "Kimliksizleştirilmiş veya kurmaca vaka, anonim soru, yazılı görev ya da gözlemci–özetleyici rolü seçilebilir." },
    weeklyOutcomeRoles: roles(5, [1, 2], "Hukukla ilgili felsefi soru, problem ve yaklaşımları anlama bu haftanın birincil hedefidir.", "Görüş ve argüman oluşturma birincil; problem anlama doğrulayıcı ikincil hedeftir."),
  },
  "FEL.11.6.2": {
    ...shared1B,
    outcomeCode: "FEL.11.6.2",
    unitCode: "F11_U6",
    sourceGuidance: "Görüş oluşturma görevi güvenilir hukuk felsefesi kaynaklarına ve kurmaca vakaya dayanır; yürürlükteki hukuk hakkında güncellik gerektiren bilgi doğrulanmadan kesin hüküm veya tavsiye üretilmez.",
    conceptSafety: ["Felsefi görüş, hukuki görüş ve bireysel hukuki tavsiye birbirinden ayrılır.", "Hak, özgürlük, sorumluluk ve adalet arasındaki çatışmalar tek ilkeye indirgenmez.", "Karşı görüş gerçek kişi, mağdur, sanık, kurum veya siyasi kimlik üzerinden değersizleştirilmez."],
    taskStandard: "Öğrenci kurmaca hukuk problemi için açık tez, iki felsefi gerekçe, ilke çatışması, adil karşı görüş, yanıt ve kaynaklı örnek içeren görüş oluşturur.",
    assessmentCriteria: ["M1 Kavramsal doğruluk", "M2 Felsefi gerekçelendirme", "M3 Karşı görüş ve değerlendirme", "M4 Kaynak ve ürün bütünlüğü"],
    revisionExpectation: "Öğrenci dönüt sonrasında tezini, ilke çatışmasına ilişkin gerekçesini, karşı görüşe yanıtını veya kaynak ve kapsam kaydını görünür biçimde güçlendirir.",
    differentiation: { support: "Tez–ilke–gerekçe–itiraz iskelesi, kurmaca vaka, kavram listesi, ek işlem süresi ve sözlü olmayan katılım sunulur.", enrichment: "Görüşü hak, özgürlük, kamu yararı ve adalet arasındaki iki farklı öncelik düzeninde sınayıp sonuçlarını karşılaştırma görevi verilir.", unchangedEvidenceStandard: "Aynı M1–M4 ölçütlerinde açık tez, felsefi gerekçe, adil karşı görüş, kaynaklı ürün ve görünür revizyon aranır." },
    sensitiveTopicSafety: { teacherNotice: "Ürün bireysel hukuki danışmanlık, gerçek dava çözümü veya suç değerlendirmesi olarak kullanılmaz; öğretmen güncel hukuki sonuç vaat etmez.", voluntaryDisclosureRule: "Öğrenci gerçek suç, mağduriyet, aile davası, hukuki sorun veya siyasi tercihini açıklamak zorunda değildir.", alternativeParticipation: "Kurmaca ya da kimliksizleştirilmiş vaka, anonim soru, yazılı argüman, gözlemci veya özetleyici rolü seçilebilir." },
    weeklyOutcomeRoles: roles(5, [3, 4, 5], "Hukuk problemine ilişkin gerekçeli felsefi görüş oluşturma bu haftanın birincil hedefidir.", "Problem anlama birincil; görüş üretme hazırlayıcı ikincil hedeftir."),
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
