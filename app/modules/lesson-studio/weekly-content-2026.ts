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
    title: "Bilgi felsefesinin konusu; bilgi ve sanı ayrımı",
    concepts: "bilgi, inanç, sanı, doğruluk, gerçeklik, gerekçelendirme, özne ve nesne",
    inquiry: "Doğru bir inanç hangi ek koşullarda bilgi sayılabilir?",
    discussion: "Sanı doğru olduğunda bilgiye dönüşmüş olur mu?",
    application: "Platon'un mağara benzetmesi bağlamında görünüş, sanı, gerçeklik ve bilgi ilişkisini çözümler.",
    evidence: "Bilgi–sanı kavram ağı ve gerekçeli ayrım kartı",
  },
  {
    title: "Bilginin imkânı; kuşkuculuk ve dogmatik yaklaşım",
    concepts: "bilginin imkânı, kuşku, yargıyı askıya alma, dogmatizm ve kesinlik",
    inquiry: "İnsan kesin bilgiye ulaşabilir mi?",
    discussion: "Kuşku bilgiye engel midir, yoksa bilginin dayanaklarını sınama yolu mudur?",
    application: "Kuşkucu ve dogmatik iki bilgi iddiasını problem, iddia, gerekçe ve sonuç bakımından karşılaştırır.",
    evidence: "Bilginin imkânı görüş karşılaştırma matrisi",
  },
  {
    title: "Kuşkucu argümanlar; Gorgias ve Pyrrhoncu gelenek",
    concepts: "kuşkuculuk, görünüş, çelişen gerekçeler, yargıyı askıya alma ve aktarılabilirlik",
    inquiry: "Çatışan görünüş ve gerekçeler karşısında bilgi iddiası nasıl kurulabilir?",
    discussion: "Yargıyı askıya almak hiçbir şeyin bilinemeyeceğini savunmakla aynı mıdır?",
    application: "Gorgias ve Pyrrhoncu yaklaşımı kesin niyet veya söz atfetmeden argüman basamaklarıyla inceler.",
    evidence: "Kuşkucu argüman çözümleme formu",
  },
  {
    title: "Descartes'ta yöntemsel kuşku ve kesinlik arayışı",
    concepts: "yöntemsel kuşku, rüya argümanı, kesinlik, apaçıklık ve çıkarım",
    inquiry: "Kuşkuya açık bir inanç neden otomatik olarak yanlış sayılmaz?",
    discussion: "Descartes'ın kuşkusu Pyrrhoncu kuşkudan hangi amaç ve sonuç bakımından ayrılır?",
    application: "Rüya argümanını iddia, gerekçe, varsayım ve sonuç bakımından çözümler; bir itiraz geliştirir.",
    evidence: "Yöntemsel kuşku argüman şeması",
  },
  {
    title: "Bilginin kaynağı; rasyonalizm ve empirizm",
    concepts: "bilginin kaynağı, akıl, deney, a priori, a posteriori, rasyonalizm ve empirizm",
    inquiry: "Bilginin kaynağında akıl mı, deney mi daha belirleyicidir?",
    discussion: "Akıldan veya deneyden yalnız biri bilgi oluşumunu açıklamaya yeter mi?",
    application: "Descartes ve Locke bağlamlarındaki kaynak görüşlerini temel iddia, gerekçe, örnek ve sınırlarıyla karşılaştırır.",
    evidence: "Rasyonalizm–empirizm karşılaştırma tablosu",
  },
  {
    title: "Bilginin kaynağı; kritisizm ve entüisyonizm",
    concepts: "kritisizm, deney, aklın formları, sezgi, kavrayış ve bilginin sınırları",
    inquiry: "Bilgi, deney ile bilen öznenin zihinsel katkısının birlikte ürünü olabilir mi?",
    discussion: "Sezgi, akıl ve deneyden bağımsız bir bilgi kaynağı olarak savunulabilir mi?",
    application: "Kant ve Bergson bağlamlarındaki görüşleri kaynak, öznenin rolü, gerekçelendirme ve sınır boyutlarında karşılaştırır.",
    evidence: "Kritisizm–entüisyonizm görüş ve argüman matrisi",
  },
  {
    title: "Bilginin doğruluk ölçütleri",
    concepts: "uygunluk, tutarlılık, tümel uzlaşım, yarar, doğrulama ve kaynak güvenilirliği",
    inquiry: "Bir bilgi iddiasının doğru olduğunu hangi ölçütlerle belirleriz?",
    discussion: "Tek bir doğruluk ölçütü bütün bilgi alanlarında yeterli olabilir mi?",
    application: "Güncel bir bilgi iddiasını uygunluk, tutarlılık, tümel uzlaşım ve yarar ölçütleriyle ayrı ayrı sınar.",
    evidence: "Dört doğruluk ölçütlü bilgi iddiası değerlendirme formu",
  },
  {
    title: "Bilgi felsefesi metni inceleme ve performans görevi",
    concepts: "kavram, problem, iddia, gerekçe, sonuç, metin kanıtı, alıntı ve parafraz",
    inquiry: "Bir felsefi metindeki görüş hangi kanıtlarla adil ve güvenilir biçimde yeniden kurulabilir?",
    discussion: "Metnin ana iddiasını değerlendirmek için hangi karşı örnek veya itiraz daha güçlüdür?",
    application: "Kaynağı belirtilmiş bir bilgi felsefesi metnini altı ölçütlü formla inceler ve akran dönütüyle revize eder.",
    evidence: "Kaynaklı metin inceleme formu ve revize edilmiş performans ürünü",
  },
]);

const weeklyContentByOutcome: Readonly<Record<string, readonly WeeklyContent[]>> = Object.freeze({
  "FEL.10.4.1": epistemologyWeeks,
});

export function getWeeklyContent(outcomeCode: string, week: number): WeeklyContent | null {
  return weeklyContentByOutcome[outcomeCode]?.[week - 1] ?? null;
}

export function getUnitWeekFocus(unitCode: string, week: number): string | null {
  if (unitCode !== "F10_U4") return null;
  return epistemologyWeeks[week - 1]?.title ?? null;
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
    { ...phases[1], facilitator: `“${focus.inquiry}” sorusunu açan birbiriyle gerilimli iki örnek sunar.`, learner: "Örneklerdeki epistemolojik gerilimi belirler ve araştırılabilir bir soru üretir.", evidence: `${focus.title} problem fark etme notu` },
    { ...phases[2], facilitator: `${focus.inquiry} Soru zincirini bu haftanın kavram ve problem sınırında yönetir.`, learner: "Temel varsayımları, olası yanıtları ve sonuçları problem–iddia–gerekçe düzeninde sorgular.", evidence: `${focus.title} sorgulama zinciri` },
    { ...phases[3], facilitator: `${focus.concepts} kavramlarını örnek, karşı örnek ve gerekli ayrımlarla yapılandırır.`, learner: "Haftanın kavramlarını doğru ilişkilerle kavram ağına dönüştürür ve bir sınır durum ekler.", evidence: `${focus.title} kavram ağı` },
    { ...phases[4], facilitator: `“${focus.discussion}” tartışmasını iddia, gerekçe, itiraz ve yanıt ölçütleriyle yönetir.`, learner: "Bir görüşü problem ve argümanla ilişkilendirir; karşı görüşü adil biçimde yeniden kurup gerekçeli olarak değerlendirir.", evidence: `${focus.title} görüş ve argüman kaydı` },
    { ...phases[5], facilitator: `Haftaya özgü uygulamayı kaynak, bağlam ve kanıt kurallarıyla sunar: ${focus.application}`, learner: focus.application, evidence: focus.evidence },
    { ...phases[6], facilitator: "Haftanın kavram doğruluğu, problem bağlantısı, argüman değerlendirme ve metin kanıtını ölçen kısa görev uygular.", learner: "Yanıtını haftanın kavramı, uygun problem bağlantısı ve kanıtla destekler; rubrik dönütüyle düzeltir.", evidence: `${focus.title} mini rubriği ve revize yanıt` },
    { ...phases[7], facilitator: "Başlangıç görüşünü yeniden gösterir; değişimi bu haftanın kanıtı ve bir rubrik ölçütüyle açıklatır.", learner: "Görüşündeki değişimi veya sürekliliği haftanın kavram, argüman ya da metin kanıtına dayanarak açıklar.", evidence: `${focus.title} öz-yansıtma kaydı` },
    { ...phases[8], facilitator: `“${focus.title}” odağındaki kavram–problem–görüş–kanıt zincirini sınıf senteziyle tamamlar.`, learner: "Haftanın konusuna özgü bir sonuç cümlesi ve araştırmaya değer açık bir soru teslim eder.", evidence: `${focus.title} sonuç ve çıkış sorusu` },
  ];
}

