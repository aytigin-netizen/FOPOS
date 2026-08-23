"use client";

import type {Unit} from "../../data/curriculum.ts";
import {createPedagogicalRecord,deriveProduct,type DerivedProduct,type PedagogicalRecord} from "../../core/pedagogical-record.ts";
import {type PhaseDefinition} from "./phase-catalog.ts";
import { phaseCatalogForDataset } from "./phase-catalog-runtime.ts";
import {selectPhaseSequence} from "./phase-selector.ts";
import {getLessonStudioWeekCount, getUnitWeekFocus, specializePhasesForWeek} from "./weekly-content-2026.ts";

type OutcomeCode = string;

export type ProfileKey = "balanced" | "quiet" | "support";
export type ResultTab = "official" | "plan" | "decision" | "validation";
export type PlanMeta = { school: string; academicYear: string; date: string; teacher: string; principal: string; specialDays: string };

type Phase = PhaseDefinition & { id: string };

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

const weeklyStages = [
  "Problemi fark etme", "Temel kavramları ayırt etme", "Görüşleri karşılaştırma",
  "Argümanları çözümleme", "Karşı örneklerle sınama", "Metin üzerinden muhakeme",
  "Yeni duruma aktarma", "Sentez ve değerlendirme", "Ürün geliştirme", "Üniteyi yansıtma",
  "Geri bildirimle geliştirme", "Ünite performansını tamamlama",
];

export function getWeekFocus(unit: Unit, week: number) {
  const curriculumFocus = getUnitWeekFocus(unit.code, week);
  if (curriculumFocus) return curriculumFocus;
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
  const lessonStudioWeekCount = getLessonStudioWeekCount(unit.code, unit.hours);
  if (!Number.isInteger(week) || week < 1 || week > lessonStudioWeekCount) {
    throw new Error(`${week}. hafta ${unit.code} ünitesinin 1-${lessonStudioWeekCount} haftalık ders tasarımı kapsamı dışında.`);
  }
  const selectedOutcome=unit.outcomes.find(item=>item.code===outcome);
  if(!selectedOutcome)throw new Error(`${outcome} kodlu öğrenme çıktısı ${unit.code} ünitesinde bulunamadı.`);
  const profileInfo = profiles[profile];
  const phaseCatalog = phaseCatalogForDataset(datasetVersion);
  const basePhases = selectPhaseSequence(phaseCatalog, outcome, () => makePhases(unit, week));
  const selectedPhases = specializePhasesForWeek(outcome, week, basePhases);
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
        {code:"CUR-OK",label:"Kanonik müfredat eşleşmesi",status:"passed",source:datasetVersion,note:`${unit.code}, ${outcome} ve ${week}/${lessonStudioWeekCount}. hafta kanonik veri setinde bulundu.`},
        {code:"TIME-OK",label:"Süre bütünlüğü",status:"passed",source:"Aşama süreleri toplamı",note:`Ders akışı ${selectedPhases.reduce((sum,phase)=>sum+phase.duration,0)} dakika olarak hesaplandı.`},
        {code:"TRACE-OK",label:"Ürün izlenebilirliği",status:"passed",source:pedagogicalRecord.recordId,note:`Ürün revizyon ${pedagogicalRecord.revision} kaydına bağlı.`},
        {code:"SUBJECT-REVIEW",label:"Alan içeriği doğruluğu",status:"teacher_review",source:"Öğretmen incelemesi",note:"Kavram, görüş, veri ve olası kaynak atıfları öğretmen incelemesi gerektirir."},
        {code:"PED-REVIEW",label:"Pedagojik ve sınıf uygunluğu",status:"teacher_review",source:"Öğretmen incelemesi",note:"Yöntem, kanıt ve farklılaştırma gerçek sınıf bağlamında öğretmen değerlendirmesi gerektirir."},
      ],
    },
  };
}
