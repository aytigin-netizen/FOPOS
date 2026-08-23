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

const natureOfPhilosophyWeeks: readonly WeeklyContent[] = Object.freeze([
  {
    title: "Felsefenin anlamı; bilgelik sevgisi ve arayış",
    concepts: "felsefe, bilgelik, sevgi, arayış, düşünme, bilgi ve filozof",
    inquiry: "Felsefe, bilgelik sahibi olmak mı yoksa bilgeliği aramak mıdır?",
    discussion: "Her derin düşünme etkinliği felsefe sayılır mı?",
    application: "Felsefe, filozof ve bilgelik kavramlarını gündelik kullanımlarıyla karşılaştırır; aralarındaki ilişkiyi gerekçeli bir kavram ağıyla gösterir.",
    evidence: "Felsefe–bilgelik–filozof kavram ağı ve gerekçeli ilk tanım",
  },
  {
    title: "Felsefenin ortak tanımının imkânı",
    concepts: "tanım, öz, görüş, gerekçe, ortaklık, farklılık ve açık uçluluk",
    inquiry: "Felsefenin bütün dönem ve gelenekleri kapsayan tek bir tanımı yapılabilir mi?",
    discussion: "Felsefenin farklı tanımlara sahip olması onun belirsiz olduğunu mu gösterir?",
    application: "Farklı filozoflara ait, kaynağı ve bağlamı belirtilmiş felsefe tanımlarını ortak ölçütler, ayrımlar ve sınırlar bakımından karşılaştırır.",
    evidence: "Felsefe tanımları karşılaştırma matrisi ve gerekçeli tanım önerisi",
  },
  {
    title: "Felsefi düşüncenin temel özellikleri",
    concepts: "hayret, merak, kuşku, sorgulama, rasyonellik, tutarlılık, eleştirellik, sistemlilik, evrensellik ve refleksiyon",
    inquiry: "Bir düşünceyi felsefi yapan ayırt edici özellikler nelerdir?",
    discussion: "Kuşku ve eleştiri olmadan felsefi düşünce kurulabilir mi?",
    application: "Gündelik üç düşünme örneğini felsefi düşüncenin özellikleriyle sınar; eksik ölçütleri ve sınır durumları belirler.",
    evidence: "Felsefi düşünce özellikleri ölçüt tablosu ve sınır durum açıklaması",
  },
  {
    title: "Felsefi düşüncenin ortaya çıkışı; mitostan logosa geçiş",
    concepts: "mitos, logos, doğa, neden, açıklama, eleştiri, merak ve sorgulama",
    inquiry: "Felsefi düşüncenin ortaya çıkışını hangi düşünsel ve toplumsal koşullar mümkün kılmıştır?",
    discussion: "Mitos ile logos arasındaki geçiş kesin bir kopuş olarak görülebilir mi?",
    application: "Felsefi düşüncenin ortaya çıkışına ilişkin tarihsel koşulları neden–sonuç ilişkileriyle zaman şeridine yerleştirir; tek nedenli açıklamaları eleştirir.",
    evidence: "Kanıta dayalı ortaya çıkış zaman şeridi ve neden–sonuç açıklaması",
  },
  {
    title: "Felsefi düşüncenin tarihsel gelişimi ve dönemleri",
    concepts: "Antik Çağ, Orta Çağ, Rönesans, modern felsefe, çağdaş felsefe, süreklilik ve dönüşüm",
    inquiry: "Felsefi problemler tarihsel koşullarla birlikte nasıl değişir?",
    discussion: "Felsefe tarihi doğrusal bir ilerleme olarak okunabilir mi?",
    application: "Başlıca felsefe dönemlerini öne çıkan problem, kavram ve tarihsel koşullarla eşleştirir; iki dönem arasındaki süreklilik ve dönüşümü açıklar.",
    evidence: "Dönem–problem–koşul eşleştirme tablosu ve karşılaştırmalı çıkarım",
  },
  {
    title: "Dünya felsefe gelenekleri",
    concepts: "gelenek, kültür, bilgelik, insan, doğa, toplum, benzerlik ve farklılık",
    inquiry: "Farklı kültürlerde gelişen düşünce geleneklerini felsefe olarak ilişkilendiren ortak yönler nelerdir?",
    discussion: "Felsefenin başlangıcını yalnızca tek bir coğrafyayla açıklamak yeterli midir?",
    application: "Hint, Çin, Antik Yunan, Türk–İslam ve modern Batı felsefe geleneklerinden seçilmiş güvenilir örnekleri problem, yöntem ve kavram bakımından karşılaştırır.",
    evidence: "Dünya felsefe gelenekleri karşılaştırma haritası ve kaynaklı çıkarım",
  },
  {
    title: "Felsefi sorunun temel özellikleri",
    concepts: "felsefi soru, kavramsallık, temellendirme, açıklık, tartışılabilirlik, evrensellik ve refleksiyon",
    inquiry: "Bir soruyu bilgi istemekten çıkarıp felsefi soru hâline getiren nedir?",
    discussion: "Cevabı kesin olarak verilemeyen her soru felsefi midir?",
    application: "Gündelik ve olgusal soruları felsefi soru ölçütleriyle sınıflandırır; yakın çevresindeki bir sorunu açık, kavramsal ve tartışılabilir bir felsefi soruya dönüştürür.",
    evidence: "Dört ölçütlü felsefi soru kontrol listesi ve özgün soru",
  },
  {
    title: "Felsefenin bilim, din ve sanatla ilişkisi",
    concepts: "felsefe, bilim, din, sanat, amaç, yöntem, doğrulama, inanç, yorum ve yaratıcılık",
    inquiry: "Felsefe bilim, din ve sanatla hangi noktalarda kesişir ve ayrılır?",
    discussion: "Felsefe diğer bilgi ve ifade alanları arasında bir üst değerlendirme alanı mıdır?",
    application: "Felsefe, bilim, din ve sanatı amaç, soru türü, yöntem, doğrulama ve ürün boyutlarında karşılaştırır; aşırı genellemeleri karşı örnekle sınar.",
    evidence: "Beş boyutlu alan karşılaştırma matrisi ve karşı örnek kaydı",
  },
  {
    title: "Felsefenin bireysel ve toplumsal işlevleri",
    concepts: "öz-farkındalık, eleştirel düşünme, özgürlük, sorumluluk, hoşgörü, demokrasi, toplumsal eleştiri ve dönüşüm",
    inquiry: "Felsefe bireyin ve toplumun yaşamında hangi somut değişimleri mümkün kılar?",
    discussion: "Felsefenin değeri pratik bir yarar üretmesine mi bağlıdır?",
    application: "Güncel bir bireysel veya toplumsal sorunu felsefenin işlevleri açısından inceler; olası katkı ve sınırları gerekçeli bir öneriye dönüştürür.",
    evidence: "Bireysel–toplumsal işlev çözümleme tablosu ve gerekçeli öneri",
  },
  {
    title: "Felsefenin doğası; röportaj ve performans görevi",
    concepts: "felsefe, filozof, felsefi soru, işlev, görüş, gerekçe, görüşme etiği, kaynak ve sentez",
    inquiry: "Felsefenin ne olduğu ve ne işe yaradığına ilişkin farklı görüşler nasıl adil biçimde çözümlenebilir?",
    discussion: "Toplumdaki felsefe algısı ile ders boyunca geliştirilen felsefe anlayışı neden farklılaşabilir?",
    application: "Farklı yaş ve meslek gruplarıyla yapılan felsefe röportajlarını etik, kaynak ve izin kurallarına göre düzenler; yanıtları ders ölçütleriyle çözümler ve ürünü akran dönütüyle geliştirir.",
    evidence: "Kaynak ve izin kaydı taşıyan röportaj ürünü, çözümleme raporu ve öz değerlendirme",
  },
]);

const weeklyContentByOutcome: Readonly<Record<string, readonly WeeklyContent[]>> = Object.freeze({
  "FEL.10.1.1": natureOfPhilosophyWeeks,
  "FEL.10.4.1": epistemologyWeeks,
});

export function getWeeklyContent(outcomeCode: string, week: number): WeeklyContent | null {
  return weeklyContentByOutcome[outcomeCode]?.[week - 1] ?? null;
}

export function getUnitWeekFocus(unitCode: string, week: number): string | null {
  if (unitCode === "F10_U1") return natureOfPhilosophyWeeks[week - 1]?.title ?? null;
  if (unitCode === "F10_U4") return epistemologyWeeks[week - 1]?.title ?? null;
  return null;
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
    { ...phases[1], facilitator: `“${focus.inquiry}” sorusunu açan birbiriyle gerilimli iki örnek sunar.`, learner: "Örneklerdeki felsefi gerilimi belirler ve araştırılabilir bir soru üretir.", evidence: `${focus.title} problem fark etme notu` },
    { ...phases[2], facilitator: `${focus.inquiry} Soru zincirini bu haftanın kavram ve problem sınırında yönetir.`, learner: "Temel varsayımları, olası yanıtları ve sonuçları problem–iddia–gerekçe düzeninde sorgular.", evidence: `${focus.title} sorgulama zinciri` },
    { ...phases[3], facilitator: `${focus.concepts} kavramlarını örnek, karşı örnek ve gerekli ayrımlarla yapılandırır.`, learner: "Haftanın kavramlarını doğru ilişkilerle kavram ağına dönüştürür ve bir sınır durum ekler.", evidence: `${focus.title} kavram ağı` },
    { ...phases[4], facilitator: `“${focus.discussion}” tartışmasını iddia, gerekçe, itiraz ve yanıt ölçütleriyle yönetir.`, learner: "Bir görüşü problem ve argümanla ilişkilendirir; karşı görüşü adil biçimde yeniden kurup gerekçeli olarak değerlendirir.", evidence: `${focus.title} görüş ve argüman kaydı` },
    { ...phases[5], facilitator: `Haftaya özgü uygulamayı kaynak, bağlam ve kanıt kurallarıyla sunar: ${focus.application}`, learner: focus.application, evidence: focus.evidence },
    { ...phases[6], facilitator: "Haftanın kavram doğruluğu, problem bağlantısı, argüman değerlendirme ve metin kanıtını ölçen kısa görev uygular.", learner: "Yanıtını haftanın kavramı, uygun problem bağlantısı ve kanıtla destekler; rubrik dönütüyle düzeltir.", evidence: `${focus.title} mini rubriği ve revize yanıt` },
    { ...phases[7], facilitator: "Başlangıç görüşünü yeniden gösterir; değişimi bu haftanın kanıtı ve bir rubrik ölçütüyle açıklatır.", learner: "Görüşündeki değişimi veya sürekliliği haftanın kavram, argüman ya da metin kanıtına dayanarak açıklar.", evidence: `${focus.title} öz-yansıtma kaydı` },
    { ...phases[8], facilitator: `“${focus.title}” odağındaki kavram–problem–görüş–kanıt zincirini sınıf senteziyle tamamlar.`, learner: "Haftanın konusuna özgü bir sonuç cümlesi ve araştırmaya değer açık bir soru teslim eder.", evidence: `${focus.title} sonuç ve çıkış sorusu` },
  ];
}
