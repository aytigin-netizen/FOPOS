import { getWeeklyContent } from "./weekly-content-2026.ts";

export type RubricLevel = Readonly<{ score: 4 | 3 | 2 | 1; description: string }>;
export type RubricCriterion = Readonly<{
  label: string;
  weight: number;
  levels: readonly RubricLevel[];
}>;

export type WeeklyProductVisibility = Readonly<{
  textStudy: Readonly<{ context: string; usageType: string; sourceRule: string }>;
  performanceProduct: Readonly<{ purpose: string; delivery: string; evidence: string }>;
  sourceRecord: Readonly<{ required: boolean; fields: readonly string[]; verification: string }>;
  rubric: Readonly<{ title: string; totalPoints: 100; criteria: readonly RubricCriterion[] }>;
}>;

const levels = (label: string): readonly RubricLevel[] => Object.freeze([
  Object.freeze({ score: 4, description: `${label} eksiksiz, doğru ve kanıtla temellendirilmiştir.` }),
  Object.freeze({ score: 3, description: `${label} büyük ölçüde doğru; küçük bir geliştirme gerektirir.` }),
  Object.freeze({ score: 2, description: `${label} kısmen görünür; önemli bağlantılar eksiktir.` }),
  Object.freeze({ score: 1, description: `${label} henüz gözlenebilir ve doğrulanabilir değildir.` }),
]);

const criteria = (items: readonly [string, number][]): readonly RubricCriterion[] =>
  Object.freeze(items.map(([label, weight]) => Object.freeze({ label, weight, levels: levels(label) })));

const defaultCriteria = criteria([
  ["Kavram doğruluğu", 20], ["Felsefi problem bağlantısı", 20], ["Tez ve gerekçelendirme", 20],
  ["Kanıt ve kaynak kullanımı", 15], ["Karşı görüşe adil yanıt", 15], ["Dil, düzen ve revizyon", 10],
]);

const scienceCriteria = criteria([
  ["Bilimsel ve felsefi kavram ayrımları", 15], ["Problemin açık kurulması", 15],
  ["Tez, gerekçe ve çıkarım tutarlılığı", 20], ["Metin kanıtı ve kaynak doğruluğu", 20],
  ["İtiraz veya karşı örnek geliştirme", 15], ["Atıf, dil ve revizyon bütünlüğü", 15],
]);

const lawCriteria = criteria([
  ["Hukuk ve felsefe kavram doğruluğu", 15], ["Yasallık, meşruiyet ve adalet ayrımı", 15],
  ["Tez ve en az iki gerekçenin gücü", 20], ["İki güvenilir kaynağın kanıt olarak kullanımı", 20],
  ["Adil karşı görüş ve yanıt", 15], ["Mahremiyet, dil ve revizyon bütünlüğü", 15],
]);

export function buildWeeklyProductVisibility(outcomeCode: string, week: number): WeeklyProductVisibility {
  const content = getWeeklyContent(outcomeCode, week);
  if (!content) throw new Error(`${outcomeCode} ${week}. hafta için yapılandırılmış ürün görünürlüğü bulunamadı.`);
  const isSciencePerformance = outcomeCode === "FEL.10.9.1" && week === 3;
  const isLawPerformance = outcomeCode === "FEL.11.6.2" && week === 5;
  const requiresSource = /kaynak|metin|alıntı|parafraz|filozof|eser/iu.test(`${content.application} ${content.evidence}`);
  return Object.freeze({
    textStudy: Object.freeze({
      context: content.title,
      usageType: requiresSource ? "Kaynaklı metin inceleme ve gerekçeli kullanım" : "Haftalık felsefi problem ve kavram incelemesi",
      sourceRule: "Alıntı, parafraz, sadeleştirme ve öğretmen uyarlaması açıkça ayrılır; anlam ve bağlam korunur.",
    }),
    performanceProduct: Object.freeze({
      purpose: content.inquiry,
      delivery: content.application,
      evidence: content.evidence,
    }),
    sourceRecord: Object.freeze({
      required: requiresSource,
      fields: Object.freeze(["Yazar/düşünür", "Eser veya belge", "Yayın/erişim bilgisi", "Kullanım türü", "Doğrulama tarihi"]),
      verification: requiresSource ? "Kaynak ve bağlam öğretmen tarafından üretim öncesinde doğrulanır." : "Kaynak kullanılırsa aynı kayıt alanları zorunludur.",
    }),
    rubric: Object.freeze({
      title: isSciencePerformance ? "Bilim felsefesi kaynaklı metin analitik rubriği" : isLawPerformance ? "Hukuk felsefesi kaynaklı performans analitik rubriği" : `${content.title} analitik rubriği`,
      totalPoints: 100,
      criteria: isSciencePerformance ? scienceCriteria : isLawPerformance ? lawCriteria : defaultCriteria,
    }),
  });
}
