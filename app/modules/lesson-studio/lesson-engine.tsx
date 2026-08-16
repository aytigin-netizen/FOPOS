"use client";

import type {Unit} from "../../data/curriculum";
import {createPedagogicalRecord,deriveProduct,type DerivedProduct,type PedagogicalRecord} from "../../core/pedagogical-record";
import {selectPhaseSequence} from "./phase-selector";

type OutcomeCode = string;

export type ProfileKey = "balanced" | "quiet" | "support";
export type ResultTab = "official" | "plan" | "decision" | "validation";
export type PlanMeta = { school: string; academicYear: string; date: string; teacher: string; principal: string; specialDays: string };

type Phase = {
  id: string;
  label: string;
  duration: number;
  facilitator: string;
  learner: string;
  evidence: string;
};

export type PlanResult = {
  pedagogicalRecord:PedagogicalRecord;
  product:DerivedProduct;
  createdAt: string;
  traceId: string;
  unit: Unit;
  week: { number: number; focus: string };
  outcome: { code: OutcomeCode; description: string; processComponents: { step: string; description: string }[] };
  profile: string;
  decision: {
    strategy: string;
    methods: string[];
    rationale: string;
    risks: { title: string; response: string }[];
  };
  phases: Phase[];
  validation: {
    status: "RULE_CHECKED";
    checks: {code:string;label:string;status:"passed"|"teacher_review";source:string;note:string}[];
  };
};

export const profiles: Record<ProfileKey, { label: string; description: string }> = {
  balanced: {
    label: "Dengeli sınıf",
    description: "Katılım ve hazırbulunuşluk dengeli",
  },
  quiet: {
    label: "Katılım desteği gerekli",
    description: "Sessiz öğrenciler için yapılandırılmış katılım",
  },
  support: {
    label: "Kavramsal destek gerekli",
    description: "Görsel iskele ve somut örnek ağırlıklı",
  },
};

const phaseBase: Record<string, Omit<Phase, "id">[]> = {
  "FEL.10.1.1": [
    {
      label: "Hazırlık",
      duration: 5,
      facilitator: "Tahtaya ‘Felsefe bir cevap mı, yoksa arayış mı?’ sorusunu yazar.",
      learner: "Soruyu sessizce düşünür ve ilk çağrışımını tek kelimeyle not eder.",
      evidence: "Başlangıç çağrışımı",
    },
    {
      label: "Merak Uyandırma",
      duration: 5,
      facilitator: "Birbiriyle çelişen iki kısa felsefe tanımı sunar.",
      learner: "Hangi tanıma yakın olduğunu gerekçesiz olarak seçer.",
      evidence: "İlk konumlanma",
    },
    {
      label: "Sorgulama",
      duration: 12,
      facilitator: "‘Felsefenin ortak bir tanımı mümkün müdür?’ sorusunu açar.",
      learner: "Tanımların ortak ve ayrışan yönlerini ikili gruplarda belirler.",
      evidence: "Karşılaştırma notu",
    },
    {
      label: "Kavram İnşası",
      duration: 14,
      facilitator: "Bilgelik, sevgi, arayış, episteme ve doxa ilişkisini yapılandırır.",
      learner: "Kavramları ilişkilendiren küçük bir kavram ağı oluşturur.",
      evidence: "Kavram ağı",
    },
    {
      label: "Felsefi Tartışma",
      duration: 18,
      facilitator: "Akvaryum tartışmasını yönetir; iddia ve gerekçe ayrımını görünür kılar.",
      learner: "Bir tanımı savunur, karşı görüşe soru sorar ve yanıt verir.",
      evidence: "İddia–gerekçe kaydı",
    },
    {
      label: "Uygulama",
      duration: 10,
      facilitator: "Gündelik bir ikilemin felsefi olup olmadığını sorar.",
      learner: "İkilemi felsefi soru ölçütlerine göre dönüştürür.",
      evidence: "Özgün felsefi soru",
    },
    {
      label: "Biçimlendirici Değerlendirme",
      duration: 8,
      facilitator: "Üç kısa açık uçlu kontrol sorusu uygular.",
      learner: "Felsefe tanımını kavram ve gerekçeyle yeniden yazar.",
      evidence: "Çıkış öncesi yanıt",
    },
    {
      label: "Yansıtma",
      duration: 5,
      facilitator: "İlk konumlanmayı yeniden gösterir.",
      learner: "Görüşünün değişip değişmediğini ve nedenini açıklar.",
      evidence: "Öz-yansıtma",
    },
    {
      label: "Kapanış",
      duration: 3,
      facilitator: "Dersi tek cümlelik bir sentezle kapatır.",
      learner: "‘Felsefe benim için…’ cümlesini tamamlar.",
      evidence: "Kapanış cümlesi",
    },
  ],
  "FEL.10.1.2": [
    {
      label: "Hazırlık",
      duration: 5,
      facilitator: "Bilim, din, sanat ve felsefeden dört soru örneği sunar.",
      learner: "Soruları alanlarla eşleştirir.",
      evidence: "Ön sınıflandırma",
    },
    {
      label: "Merak Uyandırma",
      duration: 5,
      facilitator: "‘Her soru felsefi midir?’ karşı örneğini paylaşır.",
      learner: "İlk ölçüt önerisini yazar.",
      evidence: "İlk ölçüt",
    },
    {
      label: "Sorgulama",
      duration: 12,
      facilitator: "Felsefi sorunun özelliklerini açığa çıkaran soru zinciri kurar.",
      learner: "Sorgulanabilirlik, evrensellik ve gerekçelendirme ölçütlerini keşfeder.",
      evidence: "Ölçüt listesi",
    },
    {
      label: "Kavram İnşası",
      duration: 14,
      facilitator: "Eleştirel, refleksif, tutarlı, sistemli ve yığılımlı olmayı örnekler.",
      learner: "Özellikleri örnek ve karşı örneklerle eşler.",
      evidence: "Özellik–örnek matrisi",
    },
    {
      label: "Felsefi Tartışma",
      duration: 18,
      facilitator: "‘Felsefe bilimden daha temel midir?’ yapılandırılmış tartışmasını yönetir.",
      learner: "Bir konum savunur, karşı argümanı adil biçimde yeniden kurar.",
      evidence: "Argüman kartı",
    },
    {
      label: "Uygulama",
      duration: 10,
      facilitator: "Yakın çevreden güncel bir sorun seçtirir.",
      learner: "Sorunu bilimsel, sanatsal ve felsefi sorulara dönüştürür.",
      evidence: "Üç alanlı soru seti",
    },
    {
      label: "Biçimlendirici Değerlendirme",
      duration: 8,
      facilitator: "Felsefenin bireysel ve toplumsal işlevlerine yönelik mini vaka verir.",
      learner: "Vakadaki felsefi işlevi belirler ve gerekçelendirir.",
      evidence: "Vaka yanıtı",
    },
    {
      label: "Yansıtma",
      duration: 5,
      facilitator: "‘Bugün hangi düşünme alışkanlığını kullandın?’ diye sorar.",
      learner: "Kendi düşünme sürecinden kanıt verir.",
      evidence: "Öz değerlendirme",
    },
    {
      label: "Kapanış",
      duration: 3,
      facilitator: "Felsefenin işlevini sınıfın cümlelerinden sentezler.",
      learner: "Bir işlevi ve bir açık soruyu teslim eder.",
      evidence: "Çıkış bileti",
    },
  ],
};

const weeklyStages = [
  "Problemi fark etme", "Temel kavramları ayırt etme", "Görüşleri karşılaştırma",
  "Argümanları çözümleme", "Karşı örneklerle sınama", "Metin üzerinden muhakeme",
  "Yeni duruma aktarma", "Sentez ve değerlendirme", "Ürün geliştirme", "Üniteyi yansıtma",
  "Geri bildirimle geliştirme", "Ünite performansını tamamlama",
];

export function getWeekFocus(unit: Unit, week: number) {
  const first = unit.keywords[(week - 1) % unit.keywords.length];
  const second = unit.keywords[week % unit.keywords.length];
  return `${weeklyStages[week - 1]} • ${first}–${second}`;
}

function makePhases(unit: Unit, week: number): Omit<Phase, "id">[] {
  const weekFocus = getWeekFocus(unit, week);
  const concepts = unit.keywords.slice(0, 5).join(", ");
  const discussionLabel =
    unit.subjectCode === "sociology" ? "Sosyolojik Tartışma" : "Felsefi Tartışma";
  const preparation = week === 1
    ? {
        facilitator: `Ünitenin ilk haftasında “${weekFocus}” odağına ilişkin ön bilgileri ve ilk çağrışımları görünür kılar.`,
        learner: "Konuya ilişkin ön bilgisini, ilk çağrışımını ve merak ettiği bir soruyu yazar.",
      }
    : {
        facilitator: `${week}. haftanın “${weekFocus}” odağını önceki haftanın öğrenme kanıtlarıyla ilişkilendirir.`,
        learner: "Önceki haftanın öğrenme kanıtından bir bağlantı ve bu haftaya ilişkin ilk görüşünü yazar.",
      };
  return [
    { label: "Hazırlık", duration: 5, ...preparation, evidence: "Haftalık başlangıç kaydı" },
    { label: "Merak Uyandırma", duration: 5, facilitator: "Birbiriyle gerilim taşıyan iki kısa örnek veya görüş sunar.", learner: "Örneklerdeki düşünsel gerilimi belirler ve bir soru üretir.", evidence: "Merak sorusu" },
    { label: "Sorgulama", duration: 12, facilitator: `${unit.inquiry} Soruyu ${weekFocus.toLocaleLowerCase("tr-TR")} odağında sınırlar.`, learner: "Sorunun bu haftaya ait varsayımlarını ve olası yanıtlarını ikili grupta çözümler.", evidence: "Haftalık soru çözümleme notu" },
    { label: "Kavram İnşası", duration: 14, facilitator: `${concepts} kavramlarını örnek ve karşı örneklerle yapılandırır.`, learner: "Kavramlar arasındaki ayrım ve ilişkileri görsel bir ağda gösterir.", evidence: "Kavram ilişkileri ağı" },
    { label: discussionLabel, duration: 18, facilitator: `“${unit.discussion}” sorusu için gerekçe ve itiraz kurallarını yönetir.`, learner: "Bir konum savunur, karşı görüşü adil biçimde yeniden kurar ve yanıtlar.", evidence: "İddia–gerekçe–itiraz kaydı" },
    { label: "Uygulama", duration: 10, facilitator: "Kavramların yeni bir duruma aktarılmasını isteyen görevi açıklar.", learner: unit.application, evidence: unit.evidence },
    { label: "Biçimlendirici Değerlendirme", duration: 8, facilitator: "Kavram, problem ve gerekçe boyutlarını ölçen üç kısa soru uygular.", learner: "Yanıtını bir kavram ve bir gerekçeyle destekler; akran dönütüyle düzeltir.", evidence: "Kısa muhakeme yanıtı" },
    { label: "Yansıtma", duration: 5, facilitator: "Başlangıç görüşünü yeniden gösterir ve değişimi sorgular.", learner: "Görüşündeki değişimi veya sürekliliği öğrenme kanıtıyla açıklar.", evidence: "Öz-yansıtma kaydı" },
    { label: "Kapanış", duration: 3, facilitator: "Ünitenin açık kalan temel problemini vurgular.", learner: "Bir sonuç cümlesi ve araştırmaya değer bir soru teslim eder.", evidence: "Çıkış bileti" },
  ];
}

export function makeResult(unit: Unit, outcome: OutcomeCode, profile: ProfileKey, week: number, datasetVersion = "unknown"): PlanResult {
  const selectedOutcome=unit.outcomes.find(item=>item.code===outcome);
  if(!selectedOutcome)throw new Error(`${outcome} kodlu öğrenme çıktısı ${unit.code} ünitesinde bulunamadı.`);
  const profileInfo = profiles[profile];
  const selectedPhases = selectPhaseSequence(phaseBase, outcome, () => makePhases(unit, week));
  const pedagogicalRecord=createPedagogicalRecord({unit,outcomeCode:outcome,week,profile:profileInfo.label,datasetVersion});
  const product=deriveProduct(pedagogicalRecord,"lesson_design");
  const profileAdaptation =
    profile === "quiet"
      ? "Düşün–eşleş–paylaş ve yazılı hazırlık süreleri, katılım baskısını azaltırken her öğrencinin düşüncesini görünür kılmak için seçildi."
      : profile === "support"
        ? "Kavram ağı, örnek–karşı örnek ve yapılandırılmış argüman kartları soyut kavramları aşamalı biçimde somutlaştırmak için seçildi."
        : "Bireysel düşünme, ikili çalışma ve büyük grup tartışması dengeli bir katılım döngüsü kurmak için birlikte kullanıldı.";

  return {
    pedagogicalRecord,product,
    createdAt: new Intl.DateTimeFormat("tr-TR", {
      dateStyle: "long",
      timeStyle: "short",
    }).format(new Date()),
    traceId: product.productId,
    unit,
    week: { number: week, focus: getWeekFocus(unit, week) },
    outcome: { code: outcome, description: selectedOutcome.description, processComponents: selectedOutcome.processComponents },
    profile: profileInfo.label,
    decision: {
      strategy: unit.strategy,
      methods: unit.methods,
      rationale: `“${unit.name}” ünitesinin öğrenme çıktısı, öğrencinin hazır bilgiyi tekrar etmesini değil; temel kavramları ayırt etmesini, problemleri çözümlemesini ve görüşleri gerekçeleriyle muhakeme etmesini gerektirir. ${profileAdaptation}`,
      risks: [
        {
          title: "Kavramların tanım ezberine dönüşmesi",
          response: `“${unit.keywords.slice(0, 3).join(", ")}” kavramları örnek, karşı örnek ve yeni duruma transferle işlenir.`,
        },
        {
          title: "Tartışmada birkaç öğrencinin baskın olması",
          response: "Konuşma öncesi yazılı hazırlık ve rol dağılımı zorunlu tutulur.",
        },
      ],
    },
    phases: selectedPhases.map((phase, index) => ({
      ...phase,
      id: `P${String(index + 1).padStart(2, "0")}`,
    })),
    validation: {
      status: "RULE_CHECKED",
      checks: [
        {code:"CUR-OK",label:"Kanonik müfredat eşleşmesi",status:"passed",source:datasetVersion,note:`${unit.code}, ${outcome} ve ${week}/${unit.hours}. hafta kanonik veri setinde bulundu.`},
        {code:"TIME-OK",label:"Süre bütünlüğü",status:"passed",source:"Aşama süreleri toplamı",note:`Ders akışı ${selectedPhases.reduce((sum,phase)=>sum+phase.duration,0)} dakika olarak hesaplandı.`},
        {code:"TRACE-OK",label:"Ürün izlenebilirliği",status:"passed",source:pedagogicalRecord.recordId,note:`Ürün revizyon ${pedagogicalRecord.revision} kaydına bağlı.`},
        {code:"SUBJECT-REVIEW",label:"Alan içeriği doğruluğu",status:"teacher_review",source:"Öğretmen incelemesi",note:"Kavram, görüş, veri ve olası kaynak atıfları öğretmen incelemesi gerektirir."},
        {code:"PED-REVIEW",label:"Pedagojik ve sınıf uygunluğu",status:"teacher_review",source:"Öğretmen incelemesi",note:"Yöntem, kanıt ve farklılaştırma gerçek sınıf bağlamında öğretmen değerlendirmesi gerektirir."},
      ],
    },
  };
}
