"use client";

import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  ChevronDown,
  Download,
  FileQuestion,
  Plus,
  ShieldAlert,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { downloadBlob, safeFileName } from "../../core/file-download";
import { operationErrorMessage } from "../../core/operation-error";
import { createId } from "../../core/id.js";
import { examNames, type ExamName } from "../../core/exam-types";
import {
  createExamBlueprintTransfer,
  type ExamBlueprintTransfer,
} from "../../core/exam-blueprint-transfer";

type Grade = 10 | 11;
type Unit = {
  code: string;
  name: string;
  grade: Grade;
  keywords: string[];
  outcomes: { code: string; description: string; short: string }[];
  inquiry?: string;
  application?: string;
};
type PlanMeta = {
  school: string;
  academicYear: string;
  teacher: string;
  principal: string;
};
type ExamMode = "standard" | "bep";
type Level = "understand" | "apply" | "analyze" | "evaluate" | "create";
type Kind = "text" | "short" | "open" | "scenario";
type BlueprintKind = Kind | "mixed";
type Question = {
  id: string;
  booklet: "A" | "B";
  unitCode: string;
  outcomeCode: string;
  kind: Kind;
  level: Level;
  passage: string;
  text: string;
  answer: string;
  criterion: string;
  points: number;
};

const levelLabels: Record<Level, string> = {
  understand: "Anlama",
  apply: "Uygulama",
  analyze: "Çözümleme",
  evaluate: "Değerlendirme",
  create: "Oluşturma",
};
const kindLabels: Record<Kind, string> = {
  text: "Felsefi metin",
  short: "Kısa cevap",
  open: "Açık uçlu",
  scenario: "Senaryo/vaka",
};
const bepProfiles = {
  reading: {
    label: "Okuma güçlüğü",
    note: "Metin kısa paragraflara bölünür; anahtar ifadeler belirginleştirilir ve yönerge tek aşamalı verilir.",
  },
  writing: {
    label: "Yazma güçlüğü",
    note: "Maddeleme, cümle başlatıcıları ve sözlü cevap seçeneği sağlanır.",
  },
  attention: {
    label: "Dikkat/odaklanma",
    note: "Sorular bölümlenir, gereksiz uyaran azaltılır ve ek süre tanınır.",
  },
  cognitive: {
    label: "Bilişsel destek",
    note: "Kavram kutusu, örnek yönerge ve aşamalı görev kullanılır.",
  },
  visual: {
    label: "Görsel erişim",
    note: "Büyük punto, yüksek kontrast ve geniş satır aralığı kullanılır.",
  },
};
type BepKey = keyof typeof bepProfiles;

const passages: Record<string, string[]> = {
  F10_U1: [
    "İnsan, yalnızca çevresinde olup bitenleri bilmekle yetinmez; bildiklerinin anlamını ve dayanaklarını da sorgular. Bir cevap bulduğunda araştırması sona ermez, çünkü her cevap yeni bir sorunun kapısını açar. Felsefi düşünce bu nedenle merak, hayret, kuşku ve gerekçelendirme ile ilerleyen; insanın kendisiyle ve dünyayla ilişkisini yeniden değerlendirmesini sağlayan kesintisiz bir arayıştır.",
  ],
  F10_U2: [
    "Bir düşüncenin etkileyici biçimde söylenmesi, onun doğru ya da geçerli olduğunu tek başına göstermez. Bir iddiayı değerlendirebilmek için hangi gerekçelere dayandığını, bu gerekçelerin sonucu gerçekten destekleyip desteklemediğini ve karşı örneklerin bulunup bulunmadığını incelemek gerekir. Argümantasyon, düşünceleri yalnız savunma değil; gerektiğinde düzeltme ve daha tutarlı hâle getirme etkinliğidir.",
  ],
  F10_U3: [
    "Bir ağaç yıllar içinde büyür, dalları kırılır ve yaprakları sürekli değişir; yine de ona aynı ağaç demeye devam ederiz. Bu durum, değişen özelliklerin ardında kalıcı bir şey bulunup bulunmadığı sorusunu doğurur. Varlık felsefesi, gerçekliğin temelinin madde, düşünce, oluş ya da başka bir ilke olup olmadığını araştırırken gündelik kabullerimizi de sorgular.",
  ],
  F10_U4: [
    "Bir kişi sosyal medyada çok kez paylaşılan bir iddiayı doğru kabul edebilir. Oysa yaygın inanış, güvenilir bilgiyle aynı şey değildir. Bilgi iddiası; doğruluk, gerekçe ve kanıt bakımından sınanmalıdır. Bununla birlikte kanıtların nasıl yorumlandığı ve hangi kaynağın güvenilir sayıldığı da ayrıca sorgulanmalıdır. Bilgi felsefesi, bildiğimizi sandığımız şeylerin sınırlarını görünür kılar.",
  ],
  F10_U5: [
    "Bir eylemin ahlaki değerini belirlemek her zaman kolay değildir. İyi niyetle yapılan bir davranış kötü sonuçlara yol açabilir; yararlı görünen bir sonuç ise adil olmayan bir ilkeye dayanabilir. Bu yüzden ahlaki karar verirken niyet, sonuç, ödev, erdem, özgürlük ve sorumluluk arasındaki ilişkileri birlikte düşünmek gerekir.",
  ],
  F10_U6: [
    "Bir sanat eseri bazı izleyicilerde hayranlık, bazılarında rahatsızlık uyandırabilir. Bu farklılık estetik yargıların bütünüyle kişisel olduğu anlamına mı gelir? Sanatçı niyeti, eserin biçimi, kültürel bağlamı ve izleyicinin yorumu bir eserin değerinde farklı ölçülerde rol oynar. Estetik düşünme, beğeniyi gerekçeli bir yargıya dönüştürmeye çalışır.",
  ],
  F10_U7: [
    "Bir toplum herkese aynı kuralları uyguladığında eşitlik sağladığını düşünebilir. Ancak insanların başlangıç koşulları ve ihtiyaçları birbirinden farklıysa aynı uygulama adaletsiz sonuçlar üretebilir. Siyaset felsefesi; özgürlük, eşitlik, adalet, iktidar ve devlet arasındaki gerilimi inceler ve ortak yaşamın hangi ilkelere dayanması gerektiğini sorgular.",
  ],
  F10_U8: [
    "İnanç, insanın yaşamına anlam ve yön verebilir; fakat bir inancın akılla temellendirilip temellendirilemeyeceği ayrı bir felsefi problemdir. Din felsefesi belirli bir inancı benimsetmek yerine Tanrı, vahiy, iman, kötülük ve özgür irade gibi kavramlara ilişkin iddiaların anlamını, gerekçelerini ve sınırlarını sorgular.",
  ],
  F10_U9: [
    "Bilimsel bir iddia yalnızca gözlemlerle uyumlu olduğu için kesinleşmiş sayılmaz. İddianın sınanabilir olması, hangi durumda yanlış kabul edileceğinin gösterilmesi ve sonuçların başkalarınca denetlenebilmesi gerekir. Bilim felsefesi, bilimsel bilginin yöntemini ve sınırlarını incelerken bilimsel değişimin birikimle mi yoksa köklü paradigma dönüşümleriyle mi gerçekleştiğini de tartışır.",
  ],
  F11_U1: [
    "Bir ormanın yalnız insanlara sağladığı yarar nedeniyle mi, yoksa insanlardan bağımsız olarak mı değerli olduğu çevre etiğinin temel sorularındandır. İnsan merkezci yaklaşım doğayı insan ihtiyaçları açısından değerlendirirken canlı ve çevre merkezci yaklaşımlar ahlaki değerin kapsamını genişletir. Bu ayrım, çevre sorunlarında sorumluluğun nasıl dağıtılacağını da değiştirir.",
  ],
  F11_U2: [
    "Teknoloji yalnızca amaçlarımızı gerçekleştiren tarafsız bir araç değildir; neyi mümkün, gerekli ve değerli gördüğümüzü de biçimlendirebilir. Dijital araçlar zaman ve mekân deneyimimizi dönüştürürken dikkatimizi, ilişkilerimizi ve kararlarımızı etkiler. Bu nedenle teknolojiyi değerlendirmek, yararlarını saymanın yanında insan yaşamını hangi yönde değiştirdiğini sorgulamayı gerektirir.",
  ],
  F11_U3: [
    "Akıl ile inanç bazen birbirine rakip iki kaynak gibi düşünülür. Oysa bazı yaklaşımlar aklın inancı temellendirdiğini, bazıları inancın aklın sınırlarını aştığını, bazılarıysa ikisinin farklı sorulara cevap verdiğini savunur. Felsefi inceleme, bu görüşlerden birini peşinen kabul etmek yerine kavramların anlamını ve ileri sürülen gerekçeleri karşılaştırır.",
  ],
  F11_U4: [
    "Bir roman, kahramanların yaşadığı çatışmaları göstererek özgürlük, sorumluluk ve kimlik üzerine düşündürebilir. Edebî metin çoğu zaman kavramları doğrudan tanımlamaz; onları olay, karakter, metafor ve anlatıcı aracılığıyla deneyimletir. Bu yönüyle edebiyat felsefi düşünceyi somutlaştırabilir, fakat örtük görüşlerin yorumlanmasını da gerekli kılar.",
  ],
  F11_U5: [
    "İnsan hayatın anlamını hazır bir cevap olarak bulamayabilir. Kimi düşünürler anlamın evrensel bir amaçtan geldiğini, kimileri insanın seçimleri ve sorumluluklarıyla kurulduğunu savunur. Ölüm, kaygı, yabancılaşma ve saçma deneyimleri bu arayışı zorlaştırsa da kişinin kendi yaşamını sorgulamasına ve nasıl yaşamak istediğine karar vermesine imkân verir.",
  ],
  F11_U6: [
    "Bir karar yasalara uygun olduğu hâlde adaletsiz bulunabilir. Çünkü hukuk, yürürlükteki kurallardan ibaret görülse bile bu kuralların meşruiyeti, ahlakla ilişkisi ve insan haklarına uygunluğu ayrıca tartışılır. Hakkaniyet, soyut kuralın somut olayın özellikleri dikkate alınarak yorumlanmasını gerektirir ve yasa ile adalet arasındaki gerilimi görünür kılar.",
  ],
};

function allocate(total: number, count: number) {
  if (!count) return [];
  const base = Math.floor(total / count);
  return Array.from(
    { length: count },
    (_, i) => base + (i < total - base * count ? 1 : 0),
  );
}
const textSkills: { level: Level; prompt: (unit: Unit) => string }[] = [
  {
    level: "understand",
    prompt: () =>
      "Metnin ana düşüncesini, metindeki iki temel kavramı kullanarak açıklayınız.",
  },
  {
    level: "analyze",
    prompt: () =>
      "Metindeki temel iddiayı ve bu iddiayı destekleyen iki gerekçeyi ayrı ayrı yazınız.",
  },
  {
    level: "analyze",
    prompt: (unit) =>
      `Metinde ${unit.name} ile ilgili kurulan kavramsal ilişkiyi çözümleyiniz.`,
  },
  {
    level: "apply",
    prompt: () =>
      "Metindeki görüşü günlük yaşamdan özgün bir örneğe uygulayınız; örneğinizle görüş arasındaki bağlantıyı belirtiniz.",
  },
  {
    level: "evaluate",
    prompt: () =>
      "Metindeki görüşün güçlü ve sınırlı yönlerini değerlendirerek kendi yargınızı gerekçelendirin.",
  },
  {
    level: "create",
    prompt: () =>
      "Metindeki problemden hareketle özgün bir felsefi soru oluşturup bu soruya gerekçeli bir cevap veriniz.",
  },
  {
    level: "analyze",
    prompt: () =>
      "Metinden açıkça söylenmeyen fakat gerekçeli olarak çıkarılabilecek bir sonucu yazınız ve dayanağını gösteriniz.",
  },
  {
    level: "evaluate",
    prompt: () =>
      "Metindeki görüşe yöneltilebilecek bir karşı görüş oluşturunuz ve hangi gerekçeyle savunulabileceğini açıklayınız.",
  },
];
function passageVariant(unit: Unit, index: number) {
  const base =
    passages[unit.code]?.[index % (passages[unit.code]?.length || 1)] || "";
  const concept =
    unit.keywords[index % Math.max(unit.keywords.length, 1)] || unit.name;
  const frames = [
    `Aşağıdaki değerlendirmede özellikle “${concept}” kavramının nasıl kullanıldığına dikkat ediniz.`,
    `Bu metin, ${unit.name} alanındaki bir problemi farklı gerekçelerle tartışmaya açmaktadır.`,
    `Metni okurken yazarın vardığı sonuç ile bu sonucu destekleyen düşünceleri birbirinden ayırınız.`,
    `Metinde savunulan görüşün gündelik yaşamdaki sonuçlarını düşünerek okuyunuz.`,
    `Metnin kabul ettiği varsayımları ve bu varsayımlara yöneltilebilecek itirazları göz önünde bulundurunuz.`,
    `Bu metindeki görüşün karşıtı savunulsaydı hangi gerekçelerin kullanılabileceğini düşününüz.`,
    `Metinde doğrudan belirtilmeyen sonuçları, kullanılan kavramlardan hareketle çıkarmaya çalışınız.`,
    `Okuma sırasında “${concept}” kavramının metnin bütünündeki işlevini belirleyiniz.`,
  ];
  return `${frames[index % frames.length]}\n\n${base}`;
}
function textQuestion(unit: Unit, index: number) {
  return textSkills[index % textSkills.length].prompt(unit);
}
function ordinaryQuestion(unit: Unit, index: number, kind: Kind, level: Level) {
  const concept = unit.keywords[index % unit.keywords.length] || unit.name;
  if (kind === "scenario")
    return `${concept} kavramıyla ilişkili gündelik bir durumu ${levelLabels[level].toLocaleLowerCase("tr-TR")} düzeyinde inceleyip gerekçeli bir sonuca ulaşınız.`;
  if (kind === "short")
    return `${concept} kavramını ${unit.name} bağlamında tanımlayınız ve kısa bir örnek veriniz.`;
  return `${unit.name} alanındaki “${concept}” problemini açıklayınız; bir görüş geliştirip en az iki gerekçeyle savununuz.`;
}

export default function ExamBuilder({
  baseMeta,
  units,
  onTransferToAnalysis,
}: {
  baseMeta: PlanMeta;
  units: Unit[];
  onTransferToAnalysis: (transfer: ExamBlueprintTransfer) => void;
}) {
  const [grade, setGrade] = useState<Grade>(10);
  const gradeUnits = useMemo(
    () => units.filter((u) => u.grade === grade),
    [grade, units],
  );
  const [selectedUnits, setSelectedUnits] = useState<string[]>(() => {
    const first = units.find((unit) => unit.grade === 10);
    if (!first) throw new Error("10. sınıf için doğrulanmış ünite bulunamadı.");
    return [first.code];
  });
  const availableOutcomes = useMemo(
    () =>
      gradeUnits
        .filter((u) => selectedUnits.includes(u.code))
        .flatMap((u) => u.outcomes.map((o) => ({ ...o, unitCode: u.code }))),
    [gradeUnits, selectedUnits],
  );
  const [selectedOutcomes, setSelectedOutcomes] = useState<string[]>([]);
  const [blueprintCounts, setBlueprintCounts] = useState<
    Record<string, number>
  >({});
  const [blueprintKinds, setBlueprintKinds] = useState<
    Record<string, BlueprintKind>
  >({});
  const [blueprintLevels, setBlueprintLevels] = useState<
    Record<string, Level>
  >({});
  const [mode, setMode] = useState<ExamMode>("standard");
  const [bep, setBep] = useState<BepKey>("reading");
  const [bepGoals, setBepGoals] = useState("");
  const [count, setCount] = useState(8);
  const [duration, setDuration] = useState(40);
  const [kind, setKind] = useState<Kind>("text");
  const [level, setLevel] = useState<Level>("analyze");
  const [textRatio, setTextRatio] = useState(75);
  const [examName, setExamName] = useState<ExamName>(examNames[0]);
  const [school, setSchool] = useState(baseMeta.school);
  const [year, setYear] = useState(baseMeta.academicYear);
  const [teacher, setTeacher] = useState(baseMeta.teacher);
  const [principal, setPrincipal] = useState(baseMeta.principal);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [booklet, setBooklet] = useState<"A" | "B">("A");
  const [teacherReviewConfirmed, setTeacherReviewConfirmed] = useState(false);
  const [bepPlanConfirmed, setBepPlanConfirmed] = useState(false);
  const [exportingAudience, setExportingAudience] = useState<
    "student" | "teacher" | null
  >(null);
  const [operationMessage, setOperationMessage] = useState("");
  const resultsRef = useRef<HTMLElement>(null);
  const scope = selectedOutcomes.length
    ? availableOutcomes.filter((o) => selectedOutcomes.includes(o.code))
    : availableOutcomes;
  const suggestedBlueprint = allocate(count, scope.length);
  const blueprintRows = scope.map((outcome, index) => ({
    ...outcome,
    questionCount:
      blueprintCounts[outcome.code] ?? suggestedBlueprint[index] ?? 0,
    questionKind: blueprintKinds[outcome.code] ?? "mixed",
    cognitiveLevel: blueprintLevels[outcome.code] ?? level,
  }));
  const blueprintTotal = blueprintRows.reduce(
    (sum, row) => sum + row.questionCount,
    0,
  );
  const blueprintValid = blueprintTotal === count && count > 0;
  const shown = questions.filter((q) => q.booklet === booklet);
  const total = shown.reduce((s, q) => s + q.points, 0);
  const invalidateApproval = () => setTeacherReviewConfirmed(false);
  function changeGrade(g: Grade) {
    const first = units.find((u) => u.grade === g);
    if (!first)
      throw new Error(`${g}. sınıf için doğrulanmış ünite bulunamadı.`);
    setGrade(g);
    setSelectedUnits([first.code]);
    setSelectedOutcomes([]);
    setBlueprintCounts({});
    setBlueprintKinds({});
    setBlueprintLevels({});
    setQuestions([]);
    invalidateApproval();
  }
  function generate() {
    if (!scope.length)
      throw new Error("Seçime uygun doğrulanmış öğrenme çıktısı bulunamadı.");
    if (!blueprintValid)
      throw new Error(
        `Belirtke tablosundaki soru toplamı ${count} olmalıdır. Mevcut toplam: ${blueprintTotal}.`,
      );
    const chosen = blueprintRows.flatMap((outcome) =>
      Array.from({ length: outcome.questionCount }, () => ({
        ...outcome,
        plannedKind: outcome.questionKind,
        plannedLevel: outcome.cognitiveLevel,
      })),
    );
    const pts = allocate(100, count),
      textCount = Math.round((count * textRatio) / 100),
      used = new Set<string>();
    const created = Array.from({ length: count }, (_, i) => {
      const o = chosen[i % chosen.length];
      const u = gradeUnits.find((x) => x.code === o.unitCode);
      if (!u)
        throw new Error(`“${o.unitCode}” kodlu doğrulanmış ünite bulunamadı.`);
      const isText =
          o.plannedKind === "text" ||
          (o.plannedKind === "mixed" && i < textCount),
        k: Kind =
          o.plannedKind === "mixed"
            ? isText
              ? "text"
              : kind
            : o.plannedKind,
        plannedLevel = o.plannedLevel,
        skill = textSkills[i % textSkills.length],
        passage = isText ? passageVariant(u, i) : "";
      let text = isText
        ? textQuestion(u, i)
        : ordinaryQuestion(u, i, k, plannedLevel);
      let key = `${passage}|${text}`.toLocaleLowerCase("tr-TR");
      if (used.has(key)) {
        text += ` Cevabınızda “${u.keywords[(i + 1) % Math.max(u.keywords.length, 1)] || u.name}” kavramına da yer veriniz.`;
        key = `${passage}|${text}`.toLocaleLowerCase("tr-TR");
      }
      used.add(key);
      return {
        id: createId(),
        booklet: "A" as const,
        unitCode: u.code,
        outcomeCode: o.code,
        kind: k,
        level: isText && o.plannedKind === "mixed" ? skill.level : plannedLevel,
        passage,
        text,
        answer: isText
          ? `Yanıt, soruda istenen okuma becerisini göstermeli; ${u.keywords.slice(0, 3).join(", ")} kavramlarından uygun olanları doğru kullanmalı ve çıkarımını metinden kanıtla desteklemelidir.`
          : `Yanıt ${u.name} bağlamındaki kavramı doğru açıklamalı ve görüşünü gerekçelendirmelidir.`,
        criterion:
          "Metni/kavramı anlama %30 • Çıkarım ve çözümleme %30 • Felsefi gerekçelendirme %30 • Dil ve bütünlük %10",
        points: pts[i],
      };
    });
    setQuestions(created);
    invalidateApproval();
    window.setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth" });
      resultsRef.current?.focus();
    }, 60);
  }
  function update(id: string, patch: Partial<Question>) {
    setQuestions((qs) => qs.map((q) => (q.id === id ? { ...q, ...patch } : q)));
    invalidateApproval();
  }
  function remove(id: string) {
    setQuestions((qs) => qs.filter((q) => q.id !== id));
    invalidateApproval();
  }
  function move(id: string, delta: number) {
    setQuestions((qs) => {
      const same = qs.filter((q) => q.booklet === booklet),
        i = same.findIndex((q) => q.id === id),
        target = same[i + delta];
      if (i < 0 || !target) return qs;
      const a = [...qs],
        x = a.findIndex((q) => q.id === id),
        y = a.findIndex((q) => q.id === target.id);
      [a[x], a[y]] = [a[y], a[x]];
      return a;
    });
    invalidateApproval();
  }
  function add() {
    const o = scope.at(0);
    if (!o)
      throw new Error("Seçime uygun doğrulanmış öğrenme çıktısı bulunamadı.");
    const u = gradeUnits.find((x) => x.code === o.unitCode);
    if (!u)
      throw new Error(`“${o.unitCode}” kodlu doğrulanmış ünite bulunamadı.`);
    const i = shown.length,
      skill = textSkills[i % textSkills.length];
    setQuestions((qs) => [
      ...qs,
      {
        id: createId(),
        booklet,
        unitCode: u.code,
        outcomeCode: o.code,
        kind: "text",
        level: skill.level,
        passage: passageVariant(u, i),
        text: textQuestion(u, i),
        answer: "Beklenen cevabı buraya yazınız.",
        criterion:
          "Metni anlama, çıkarım ve felsefi gerekçelendirme birlikte değerlendirilir.",
        points: 0,
      },
    ]);
    invalidateApproval();
  }
  function balance() {
    const pts = allocate(100, shown.length);
    let i = 0;
    setQuestions((qs) =>
      qs.map((q) => (q.booklet === booklet ? { ...q, points: pts[i++] } : q)),
    );
    invalidateApproval();
  }
  function makeB() {
    const a = questions.filter((q) => q.booklet === "A").reverse();
    setQuestions((qs) => [
      ...qs.filter((q) => q.booklet !== "B"),
      ...a.map((q) => ({
        ...q,
        id: createId(),
        booklet: "B" as const,
      })),
    ]);
    setBooklet("B");
    invalidateApproval();
  }
  async function docx(audience: "student" | "teacher") {
    if (!exportReady)
      throw new Error(
        "Sınav öğretmen tarafından kontrol edilmeden dışa aktarılamaz.",
      );
    const {
      Document,
      Packer,
      Paragraph,
      TextRun,
      HeadingLevel,
      ShadingType,
      BorderStyle,
      Table,
      TableCell,
      TableRow,
      WidthType,
    } = await import("docx");
    const examInfoBorder = {
      style: BorderStyle.SINGLE,
      size: 2,
      color: "94A3B8",
    };
    const studentInfoCell = (label: string, width: number) =>
      new TableCell({
        width: { size: width, type: WidthType.PERCENTAGE },
        borders: {
          top: examInfoBorder,
          bottom: examInfoBorder,
          left: examInfoBorder,
          right: examInfoBorder,
        },
        children: [
          new Paragraph({
            spacing: { before: 90, after: 300 },
            children: [new TextRun({ text: label, bold: true })],
          }),
        ],
      });
    const blueprintCell = (text: string, width: number, bold = false) =>
      new TableCell({
        width: { size: width, type: WidthType.PERCENTAGE },
        borders: {
          top: examInfoBorder,
          bottom: examInfoBorder,
          left: examInfoBorder,
          right: examInfoBorder,
        },
        children: [
          new Paragraph({
            children: [new TextRun({ text, bold, size: 18 })],
          }),
        ],
      });
    const distributionCodes = Array.from(
      new Set(shown.map((question) => question.outcomeCode)),
    );
    const teacherBlueprintTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          cantSplit: true,
          children: [
            blueprintCell("Öğrenme çıktısı", 22, true),
            blueprintCell("Ünite", 14, true),
            blueprintCell("Soru türü", 23, true),
            blueprintCell("Bilişsel düzey", 23, true),
            blueprintCell("Soru / Puan", 18, true),
          ],
        }),
        ...distributionCodes.map((code) => {
          const matching = shown.filter(
            (question) => question.outcomeCode === code,
          );
          const kinds = Array.from(
            new Set(matching.map((question) => kindLabels[question.kind])),
          ).join(", ");
          const levels = Array.from(
            new Set(matching.map((question) => levelLabels[question.level])),
          ).join(", ");
          return new TableRow({
            cantSplit: true,
            children: [
              blueprintCell(code, 22, true),
              blueprintCell(matching[0]?.unitCode || "—", 14),
              blueprintCell(kinds, 23),
              blueprintCell(levels, 23),
              blueprintCell(
                `${matching.length} / ${matching.reduce((sum, question) => sum + question.points, 0)}`,
                18,
              ),
            ],
          });
        }),
      ],
    });
    const children = [
      new Paragraph({
        text: `${school}\n${year} EĞİTİM-ÖĞRETİM YILI\n${grade}. SINIF FELSEFE ${examName} — ${booklet} KİTAPÇIĞI`,
        heading: HeadingLevel.TITLE,
      }),
      new Paragraph({
        text: `Süre: ${duration} dakika • Toplam: ${total} puan`,
      }),
      ...(audience === "student"
        ? [
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  cantSplit: true,
                  children: [
                    studentInfoCell("Adı Soyadı:", 50),
                    studentInfoCell("Okul No:", 25),
                    studentInfoCell("Aldığı Puan:", 25),
                  ],
                }),
              ],
            }),
          ]
        : []),
      ...(audience === "teacher"
        ? [
            new Paragraph({
              text: "BELİRTKE TABLOSU",
              heading: HeadingLevel.HEADING_1,
            }),
            teacherBlueprintTable,
            new Paragraph({
              text: "Tablodaki dağılım, öğretmenin onayladığı sınav kitapçığındaki soru ve puanlardan oluşturulmuştur.",
            }),
          ]
        : []),
      ...(audience === "teacher" && mode === "bep"
        ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: `BEP uyarlaması: ${bepProfiles[bep].label} — `,
                  bold: true,
                }),
                new TextRun(bepProfiles[bep].note),
              ],
            }),
            new Paragraph({
              text: `BEP hedefleri/notu: ${bepGoals || "Öğrencinin onaylı BEP'iyle eşleştirilmelidir."}`,
            }),
          ]
        : []),
      ...shown.flatMap((q, i) => [
        ...(q.passage
          ? [
              new Paragraph({
                shading: { type: ShadingType.CLEAR, fill: "EEF3F8" },
                border: {
                  top: { style: BorderStyle.SINGLE, size: 4, color: "94A3B8" },
                  bottom: {
                    style: BorderStyle.SINGLE,
                    size: 4,
                    color: "94A3B8",
                  },
                  left: { style: BorderStyle.SINGLE, size: 4, color: "94A3B8" },
                  right: {
                    style: BorderStyle.SINGLE,
                    size: 4,
                    color: "94A3B8",
                  },
                },
                spacing: { before: 180, after: 100 },
                children: [
                  new TextRun({
                    text: "Felsefi metin\n",
                    bold: true,
                    color: "0B5C8E",
                  }),
                  new TextRun({ text: q.passage, italics: true }),
                ],
              }),
            ]
          : []),
        new Paragraph({
          children: [
            new TextRun({
              text: `${i + 1}. ${q.text} (${q.points} puan)`,
              bold: true,
            }),
          ],
        }),
        new Paragraph({
          text: "........................................................................................................\n........................................................................................................\n........................................................................................................",
        }),
      ]),
      ...(audience === "teacher"
        ? [
            new Paragraph({
              text: "CEVAP ANAHTARI VE DERECELİ PUANLAMA ANAHTARI",
              heading: HeadingLevel.HEADING_1,
            }),
            ...shown.flatMap((q, i) => [
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${i + 1}. soru — ${q.points} puan`,
                    bold: true,
                  }),
                ],
              }),
              new Paragraph({ text: q.answer }),
              new Paragraph({ text: q.criterion }),
            ]),
            new Paragraph({
              text: "SINAV ANALİZ FORMU",
              heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
              text: "Sınıf ortalaması: ........  En yüksek: ........  En düşük: ........  Başarı oranı: ........",
            }),
            new Paragraph({
              text: "Metni anlama/yorumlama güçlüğü görülen sorular: ........................................................",
            }),
            new Paragraph({
              text: "Eksik öğrenmeler ve iyileştirme kararı: ................................................................................",
            }),
            new Paragraph({
              text: `\n${teacher || "................................"} — Ders Öğretmeni                    ${principal || "................................"} — Okul Müdürü`,
            }),
          ]
        : []),
    ];
    const blob = await Packer.toBlob(
      new Document({ creator: "FOPOS v5.3", sections: [{ children }] }),
    );
    downloadBlob(
      blob,
      safeFileName(
        [
          "FOPOS",
          grade,
          "Sinif",
          booklet,
          audience === "student" ? "Ogrenci_Kitapcigi" : "Ogretmen_Paketi",
        ],
        "docx",
      ),
    );
  }
  async function downloadExam(audience: "student" | "teacher") {
    setExportingAudience(audience);
    setOperationMessage(
      audience === "student"
        ? "Öğrenci kitapçığı hazırlanıyor…"
        : "Öğretmen paketi hazırlanıyor…",
    );
    try {
      await docx(audience);
      setOperationMessage(
        audience === "student"
          ? "Öğrenci kitapçığı indirildi."
          : "Öğretmen paketi indirildi.",
      );
    } catch (error) {
      setOperationMessage(
        operationErrorMessage(error, "Sınav dosyası indirilemedi."),
      );
    } finally {
      setExportingAudience(null);
    }
  }
  const duplicateCount =
    shown.length -
    new Set(
      shown.map((q) =>
        `${q.passage}|${q.text}`.trim().toLocaleLowerCase("tr-TR"),
      ),
    ).size;
  const validOutcomeCodes = new Set(
    availableOutcomes.map((outcome) => outcome.code),
  );
  const outcomeTraceValid =
    shown.length > 0 &&
    shown.every((question) => validOutcomeCodes.has(question.outcomeCode));
  const answersComplete = shown.every(
    (question) => question.answer.trim() && question.criterion.trim(),
  );
  const aQuestions = questions.filter((question) => question.booklet === "A");
  const bQuestions = questions.filter((question) => question.booklet === "B");
  const signature = (question: Question) =>
    `${question.outcomeCode}|${question.level}|${question.points}`;
  const bookletEquivalent =
    bQuestions.length === 0 ||
    (aQuestions.length === bQuestions.length &&
      aQuestions
        .map(signature)
        .sort()
        .every(
          (value, index) => value === bQuestions.map(signature).sort()[index],
        ));
  const bepReady =
    mode !== "bep" || (bepGoals.trim().length > 0 && bepPlanConfirmed);
  const structuralReady =
    total === 100 &&
    duplicateCount === 0 &&
    outcomeTraceValid &&
    answersComplete &&
    bookletEquivalent &&
    bepReady;
  const exportReady = structuralReady && teacherReviewConfirmed;
  function transferToAnalysis() {
    if (!exportReady)
      throw new Error(
        "Sınav öğretmen tarafından kontrol edilmeden analize aktarılamaz.",
      );
    onTransferToAnalysis(
      createExamBlueprintTransfer({
        grade,
        examName,
        questions: shown.map((question) => ({
          outcomeCode: question.outcomeCode,
          unitCode: question.unitCode,
          maxPoints: question.points,
        })),
      }),
    );
  }
  return (
    <section className="exam-module" id="top">
      {operationMessage && (
        <div className="calendar-note" role="status" aria-live="polite">
          <ShieldAlert size={18} /> <span>{operationMessage}</span>
        </div>
      )}
      <section className="annual-hero exam-hero">
        <div>
          <span className="eyebrow">
            <FileQuestion size={15} /> FOPOS v5.3 • Tekrarsız Metin Temelli
            Sınav
          </span>
          <h1>
            Metni anlayan,
            <br />
            <em>yorumlayan öğrenciyi</em> ölçün.
          </h1>
          <p>
            Felsefi metinlerden hareketle ana düşünce, kavram, çıkarım,
            çözümleme ve gerekçeli değerlendirme becerilerini ölçen sorular
            hazırlayın.
          </p>
        </div>
        <div className="builder-card">
          <div className="mode-switch">
            <button
              className={mode === "standard" ? "active" : ""}
              onClick={() => {
                setMode("standard");
                setBepPlanConfirmed(false);
                invalidateApproval();
              }}
            >
              Standart
            </button>
            <button
              className={mode === "bep" ? "active" : ""}
              onClick={() => {
                setMode("bep");
                invalidateApproval();
              }}
            >
              BEP uyarlamalı
            </button>
          </div>
          <div className="field-grid compact-grid">
            <label className="field">
              <span>Sınıf</span>
              <select
                value={grade}
                onChange={(e) => changeGrade(+e.target.value as Grade)}
              >
                <option value="10">10. Sınıf</option>
                <option value="11">11. Sınıf</option>
              </select>
            </label>
            <label className="field">
              <span>Süre</span>
              <select
                value={duration}
                onChange={(e) => setDuration(+e.target.value)}
              >
                <option>40</option>
                <option>50</option>
                <option>60</option>
                <option>80</option>
              </select>
            </label>
          </div>
          <label className="field">
            <span>Üniteler (çoklu seçim)</span>
            <select
              multiple
              value={selectedUnits}
              onChange={(e) => {
                setSelectedUnits(
                  Array.from(e.target.selectedOptions, (o) => o.value),
                );
                setSelectedOutcomes([]);
                setBlueprintCounts({});
                setBlueprintKinds({});
                setBlueprintLevels({});
                setQuestions([]);
                invalidateApproval();
              }}
            >
              {gradeUnits.map((u) => (
                <option key={u.code} value={u.code}>
                  {u.code} • {u.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Öğrenme çıktıları (seçilmezse tümü)</span>
            <select
              multiple
              value={selectedOutcomes}
              onChange={(e) => {
                setSelectedOutcomes(
                  Array.from(e.target.selectedOptions, (o) => o.value),
                );
                setBlueprintCounts({});
                setBlueprintKinds({});
                setBlueprintLevels({});
                setQuestions([]);
                invalidateApproval();
              }}
            >
              {availableOutcomes.map((o) => (
                <option key={o.unitCode + o.code} value={o.code}>
                  {o.code} • {o.short}
                </option>
              ))}
            </select>
          </label>
          <div className="field-grid compact-grid">
            <label className="field">
              <span>Soru sayısı</span>
              <input
                type="number"
                min="1"
                max="20"
                value={count}
                onChange={(e) => {
                  setCount(+e.target.value);
                  setBlueprintCounts({});
                  invalidateApproval();
                }}
              />
            </label>
            <label className="field">
              <span>Metin temelli soru oranı</span>
              <select
                value={textRatio}
                onChange={(e) => setTextRatio(+e.target.value)}
              >
                <option value="50">%50</option>
                <option value="75">%75 (Önerilen)</option>
                <option value="100">%100</option>
              </select>
            </label>
            <label className="field">
              <span>Diğer soru türü</span>
              <select
                value={kind}
                onChange={(e) => setKind(e.target.value as Kind)}
              >
                {Object.entries(kindLabels)
                  .filter(([k]) => k !== "text")
                  .map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
              </select>
            </label>
            <label className="field">
              <span>Bilişsel düzey</span>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as Level)}
              >
                {Object.entries(levelLabels).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <section className="exam-blueprint" aria-labelledby="blueprint-title">
            <div className="exam-blueprint-heading">
              <div>
                <strong id="blueprint-title">Belirtke tablosu</strong>
                <span>
                  Her öğrenme çıktısına ayrılacak soru sayısını sınavdan önce
                  belirleyin.
                </span>
              </div>
              <button
                type="button"
                className="secondary-button"
                onClick={() => {
                  setBlueprintCounts({});
                  setBlueprintKinds({});
                  setBlueprintLevels({});
                  invalidateApproval();
                }}
              >
                Eşit dağıt
              </button>
            </div>
            <div className="exam-blueprint-table" role="table">
              <div className="exam-blueprint-row exam-blueprint-header" role="row">
                <span role="columnheader">Öğrenme çıktısı</span>
                <span role="columnheader">Ünite</span>
                <span role="columnheader">Soru</span>
                <span role="columnheader">Soru türü</span>
                <span role="columnheader">Bilişsel düzey</span>
                <span role="columnheader">Yaklaşık puan</span>
              </div>
              {blueprintRows.map((row) => (
                <div className="exam-blueprint-row" role="row" key={`${row.unitCode}-${row.code}`}>
                  <span role="cell">
                    <b>{row.code}</b>
                    <small>{row.short}</small>
                  </span>
                  <span role="cell">{row.unitCode}</span>
                  <label role="cell">
                    <span className="sr-only">{row.code} soru sayısı</span>
                    <input
                      aria-label={`${row.code} soru sayısı`}
                      type="number"
                      min="0"
                      max={count}
                      value={row.questionCount}
                      onChange={(event) => {
                        setBlueprintCounts((current) => ({
                          ...Object.fromEntries(
                            blueprintRows.map((item) => [
                              item.code,
                              item.questionCount,
                            ]),
                          ),
                          ...current,
                          [row.code]: Math.max(0, +event.target.value || 0),
                        }));
                        invalidateApproval();
                      }}
                    />
                  </label>
                  <label role="cell">
                    <span className="sr-only">{row.code} soru türü</span>
                    <select
                      aria-label={`${row.code} soru türü`}
                      value={row.questionKind}
                      onChange={(event) => {
                        setBlueprintKinds((current) => ({
                          ...current,
                          [row.code]: event.target.value as BlueprintKind,
                        }));
                        invalidateApproval();
                      }}
                    >
                      <option value="mixed">Otomatik karışım</option>
                      {Object.entries(kindLabels).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </label>
                  <label role="cell">
                    <span className="sr-only">{row.code} bilişsel düzeyi</span>
                    <select
                      aria-label={`${row.code} bilişsel düzeyi`}
                      value={row.cognitiveLevel}
                      onChange={(event) => {
                        setBlueprintLevels((current) => ({
                          ...current,
                          [row.code]: event.target.value as Level,
                        }));
                        invalidateApproval();
                      }}
                    >
                      {Object.entries(levelLabels).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                  </label>
                  <span role="cell">
                    {count > 0
                      ? Math.round((row.questionCount / count) * 100)
                      : 0} puan
                  </span>
                </div>
              ))}
            </div>
            <div
              className={`blueprint-total ${blueprintValid ? "valid" : "invalid"}`}
              role="status"
            >
              Planlanan: {blueprintTotal} / {count} soru • Toplam puan üretimde
              100’e dengelenir.
            </div>
          </section>
          <label className="field">
            <span>Sınav adı</span>
            <select
              value={examName}
              onChange={(e) => setExamName(e.target.value as ExamName)}
            >
              {examNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>
          {mode === "bep" && (
            <>
              <label className="field">
                <span>BEP profili</span>
                <select
                  value={bep}
                  onChange={(e) => setBep(e.target.value as BepKey)}
                >
                  {Object.entries(bepProfiles).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Öğrencinin BEP hedefleri / birim kararı</span>
                <textarea
                  value={bepGoals}
                  onChange={(e) => {
                    setBepGoals(e.target.value);
                    setBepPlanConfirmed(false);
                    invalidateApproval();
                  }}
                />
              </label>
              <label className="teacher-check">
                <input
                  type="checkbox"
                  checked={bepPlanConfirmed}
                  onChange={(event) => {
                    setBepPlanConfirmed(event.target.checked);
                    invalidateApproval();
                  }}
                />{" "}
                Uyarlamaları öğrencinin onaylı BEP hedefleri ve birim kararıyla
                karşılaştırdım
              </label>
              <div className="calendar-note meeting-warning">
                <ShieldAlert size={18} />
                <div>
                  <strong>Mahremiyet uyarısı</strong>
                  <span>
                    Öğrenci adı, tanı, sağlık bilgisi veya bireysel BEP belgesi
                    bu alana yazılmamalıdır.
                  </span>
                </div>
              </div>
            </>
          )}
          <details className="official-fields">
            <summary>
              Resmî bilgiler <ChevronDown size={16} />
            </summary>
            <label className="field">
              <span>Okul</span>
              <input
                value={school}
                onChange={(e) => setSchool(e.target.value)}
              />
            </label>
            <label className="field">
              <span>Öğretim yılı</span>
              <input value={year} onChange={(e) => setYear(e.target.value)} />
            </label>
            <label className="field">
              <span>Ders öğretmeni</span>
              <input
                value={teacher}
                onChange={(e) => setTeacher(e.target.value)}
                placeholder="Sonradan eklenebilir"
              />
            </label>
            <label className="field">
              <span>Okul müdürü</span>
              <input
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                placeholder="Sonradan eklenebilir"
              />
            </label>
          </details>
          <button
            className="primary-button"
            onClick={generate}
            disabled={!blueprintValid}
          >
            <Sparkles size={18} /> Sınavı oluştur
          </button>
        </div>
      </section>
      {questions.length > 0 && (
        <section
          className="results-section exam-results"
          ref={resultsRef}
          tabIndex={-1}
        >
          <div className="results-header">
            <div>
              <span className="approved-pill">
                <CheckCircle2 size={15} />{" "}
                {structuralReady ? "DOĞRULANDI" : "DÜZENLEME GEREKİYOR"}
              </span>
              <h2>{examName}</h2>
              <p>
                {shown.filter((q) => q.passage).length} metin temelli soru •{" "}
                {shown.length} toplam soru • {total} puan •{" "}
                {duplicateCount === 0
                  ? "Tekrar yok"
                  : `${duplicateCount} tekrar var`}
              </p>
            </div>
            <div className="result-actions">
              <button className="secondary-button" onClick={balance}>
                100 puana dengele
              </button>
              <button className="secondary-button" onClick={makeB}>
                B kitapçığı
              </button>
              <button
                className="download-button"
                disabled={!exportReady || exportingAudience !== null}
                onClick={() => void downloadExam("student")}
              >
                <Download size={16} /> Öğrenci kitapçığı
              </button>
              <button
                className="download-button"
                disabled={!exportReady || exportingAudience !== null}
                onClick={() => void downloadExam("teacher")}
              >
                <Download size={16} /> Öğretmen paketi
              </button>
              <button
                type="button"
                className="secondary-button"
                disabled={!exportReady}
                onClick={transferToAnalysis}
              >
                Sınav analizine aktar
              </button>
            </div>
          </div>
          <div
            className="record-approval-bar"
            role="region"
            aria-label="Sınav öğretmen onayı"
          >
            <div>
              <strong>
                {structuralReady
                  ? "Yapısal kontroller tamamlandı"
                  : "Düzeltme gerekiyor"}
              </strong>
              <span>
                Öğrenci kitapçığında cevap anahtarı ve BEP profili bulunmaz.
                Nihai soru ve puanlama kararı öğretmene aittir.
              </span>
            </div>
            <label>
              <input
                type="checkbox"
                disabled={!structuralReady}
                checked={teacherReviewConfirmed}
                onChange={(event) =>
                  setTeacherReviewConfirmed(event.target.checked)
                }
              />{" "}
              Soruları, cevapları, puanları ve müfredat bağlantılarını kontrol
              ettim
            </label>
          </div>
          <div className="mode-switch booklet-switch">
            <button
              className={booklet === "A" ? "active" : ""}
              onClick={() => setBooklet("A")}
            >
              A Kitapçığı
            </button>
            <button
              className={booklet === "B" ? "active" : ""}
              onClick={() => setBooklet("B")}
            >
              B Kitapçığı
            </button>
          </div>
          <div className="distribution-table">
            <b>Konu–soru dağılımı</b>
            {Array.from(new Set(shown.map((q) => q.outcomeCode))).map(
              (code) => (
                <span key={code}>
                  {code}: {shown.filter((q) => q.outcomeCode === code).length}{" "}
                  soru /{" "}
                  {shown
                    .filter((q) => q.outcomeCode === code)
                    .reduce((s, q) => s + q.points, 0)}{" "}
                  puan •{" "}
                  {Array.from(
                    new Set(
                      shown
                        .filter((q) => q.outcomeCode === code)
                        .map((q) => levelLabels[q.level]),
                    ),
                  ).join(", ")} •{" "}
                  {Array.from(
                    new Set(
                      shown
                        .filter((q) => q.outcomeCode === code)
                        .map((q) => kindLabels[q.kind]),
                    ),
                  ).join(", ")}
                </span>
              ),
            )}
          </div>
          <div className="question-editor-list">
            {shown.map((q, i) => (
              <article className="question-editor" key={q.id}>
                <div className="question-toolbar">
                  <b>{i + 1}. soru</b>
                  <select
                    aria-label={`Soru ${i + 1} türü`}
                    value={q.kind}
                    onChange={(e) =>
                      update(q.id, {
                        kind: e.target.value as Kind,
                        passage:
                          e.target.value === "text"
                            ? q.passage || passages[q.unitCode]?.[0] || ""
                            : "",
                      })
                    }
                  >
                    {Object.entries(kindLabels).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                  <select
                    aria-label={`Soru ${i + 1} bilişsel düzeyi`}
                    value={q.level}
                    onChange={(e) =>
                      update(q.id, { level: e.target.value as Level })
                    }
                  >
                    {Object.entries(levelLabels).map(([k, v]) => (
                      <option key={k} value={k}>
                        {v}
                      </option>
                    ))}
                  </select>
                  <input
                    aria-label={`Soru ${i + 1} puanı`}
                    className="points-input"
                    type="number"
                    min="0"
                    value={q.points}
                    onChange={(e) => update(q.id, { points: +e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => move(q.id, -1)}
                    aria-label={`Soru ${i + 1} yukarı taşı`}
                  >
                    <ArrowUp size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(q.id, 1)}
                    aria-label={`Soru ${i + 1} aşağı taşı`}
                  >
                    <ArrowDown size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(q.id)}
                    aria-label={`Soru ${i + 1} sil`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
                {q.kind === "text" && (
                  <label className="field passage-field">
                    <span>Felsefi metin</span>
                    <textarea
                      value={q.passage}
                      onChange={(e) =>
                        update(q.id, { passage: e.target.value })
                      }
                    />
                  </label>
                )}
                <label className="field">
                  <span>Soru</span>
                  <textarea
                    value={q.text}
                    onChange={(e) => update(q.id, { text: e.target.value })}
                  />
                </label>
                <label className="field">
                  <span>Beklenen cevap</span>
                  <textarea
                    value={q.answer}
                    onChange={(e) => update(q.id, { answer: e.target.value })}
                  />
                </label>
                <label className="field">
                  <span>Dereceli puanlama ölçütü</span>
                  <textarea
                    value={q.criterion}
                    onChange={(e) =>
                      update(q.id, { criterion: e.target.value })
                    }
                  />
                </label>
              </article>
            ))}
          </div>
          <button className="secondary-button add-question" onClick={add}>
            <Plus size={16} /> Metin temelli soru ekle
          </button>
          {mode === "bep" && (
            <div className="calendar-note">
              <CheckCircle2 size={18} />
              <div>
                <strong>
                  Hedef eşdeğerliği:{" "}
                  {bepReady && outcomeTraceValid
                    ? "Öğretmen kontrolü kaydedildi"
                    : "Kontrol gerekli"}
                </strong>
                <span>
                  Öğrenme çıktısı korunur; metnin sunumu, süre, ortam ve cevap
                  biçimi uyarlanır.
                </span>
              </div>
            </div>
          )}
        </section>
      )}
    </section>
  );
}
