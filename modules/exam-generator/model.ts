import { getCurriculum } from "@/curriculum";
import type {
  CognitiveLevel,
  ExamInput,
  ExamMetadata,
  ExamName,
  ExamQuestion,
  GeneratedExam,
  IepAdaptation,
  IepProfile,
} from "@/modules/exam-generator/types";

export const examNames: readonly ExamName[] = [
  "1. Dönem 1. Yazılı",
  "1. Dönem 2. Yazılı",
  "2. Dönem 1. Yazılı",
  "2. Dönem 2. Yazılı",
  "Sorumluluk Sınavı",
];
export const questionCounts = [5, 8, 10] as const;
export const durations = [40, 50, 60, 80] as const;
export const textRatios = [50, 75, 100] as const;

export const defaultExamMetadata: ExamMetadata = {
  schoolName: "",
  academicYear: "2026-2027",
  teacherName: "",
  classBranch: "",
  date: "",
  duration: 40,
  examName: "1. Dönem 1. Yazılı",
};

export const iepProfiles: Record<IepProfile, IepAdaptation> = {
  reading: {
    profile: "reading",
    label: "Okuma güçlüğü",
    adjustments: ["Kısa ve doğrudan yönerge", "Parçalanmış metin blokları", "Ek süre"],
    preservesTarget: true,
  },
  writing: {
    profile: "writing",
    label: "Yazma güçlüğü",
    adjustments: ["Cümle başlatıcılar", "Maddeleyerek cevap seçeneği", "Sözlü cevap imkânı"],
    preservesTarget: true,
  },
  attention: {
    profile: "attention",
    label: "Dikkat / odaklanma",
    adjustments: ["Tek görevli yönergeler", "Azaltılmış görsel yoğunluk", "Sessiz ortam ve ek süre"],
    preservesTarget: true,
  },
  cognitive: {
    profile: "cognitive",
    label: "Bilişsel destek",
    adjustments: ["Kavram kutusu", "Basamaklandırılmış yönerge", "Somut örnek desteği"],
    preservesTarget: true,
  },
  visual: {
    profile: "visual",
    label: "Görme / görsel erişim",
    adjustments: ["Büyük punto", "Yüksek kontrast", "Artırılmış satır aralığı"],
    preservesTarget: true,
  },
};

export function getExamDefaults(): ExamInput {
  const unit = getCurriculum(10).units[0];
  return {
    grade: 10,
    unitCode: unit.code,
    outcomeCodes: unit.outcomes.map((outcome) => outcome.code),
    questionCount: 5,
    textQuestionRatio: 75,
    mode: "standard",
    iepProfile: null,
    iepDecision: "",
    teacherApproved: false,
    metadata: { ...defaultExamMetadata },
  };
}

export function createExam(input: ExamInput): GeneratedExam {
  const curriculum = getCurriculum(input.grade);
  const unit = curriculum.units.find((item) => item.code === input.unitCode);
  if (!unit) throw new Error("Seçilen ünite sınıf müfredatında bulunamadı.");
  const outcomes = unit.outcomes.filter((outcome) => input.outcomeCodes.includes(outcome.code));
  if (!outcomes.length) throw new Error("En az bir geçerli öğrenme çıktısı seçilmelidir.");
  if (input.mode === "iep" && (!input.iepProfile || !input.iepDecision.trim())) {
    throw new Error("BEP modu için profil ve kurul/birim kararı belirtilmelidir.");
  }

  const points = distributePoints(input.questionCount);
  const textQuestionCount = Math.round(input.questionCount * input.textQuestionRatio / 100);
  const levels: readonly CognitiveLevel[] = ["anlama", "çıkarım", "analiz", "gerekçelendirme"];
  const perspectives = ["tanım", "örnek", "sonuç", "eleştiri", "karşılaştırma", "uygulama", "varsayım", "karşı görüş", "gündelik yaşam", "değerlendirme"] as const;
  const bookletA: ExamQuestion[] = Array.from({ length: input.questionCount }, (_, index) => {
    const outcome = outcomes[index % outcomes.length];
    const cognitiveLevel = levels[index % levels.length];
    const hasText = index < textQuestionCount;
    const concept = unit.keyConcepts[index % unit.keyConcepts.length];
    const focus = unit.contentFramework[index % unit.contentFramework.length];
    return {
      id: `q-${index + 1}`,
      order: index + 1,
      type: index % 4 === 3 ? "short-answer" : "open-ended",
      cognitiveLevel,
      outcomeCode: outcome.code,
      unitTitle: unit.title,
      stimulus: hasText
        ? `"${concept}" kavramının, insanın kendisini ve dünyayı anlamlandırma çabasında farklı görüşlere açık bir sorgulama alanı oluşturduğu düşünülebilir.`
        : null,
      prompt: questionPrompt(cognitiveLevel, concept, focus, perspectives[index], hasText),
      points: points[index],
      answerKey: `${concept} kavramını doğru kullanmalı; görüşünü felsefi bir gerekçe ve uygun örnekle desteklemelidir.`,
      rubric: rubricFor(cognitiveLevel, points[index]),
    };
  });
  const bookletB = [...bookletA].reverse().map((question, index) => ({
    ...question,
    id: `b-${question.id}`,
    order: index + 1,
  }));
  const blueprint = outcomes.map((outcome) => {
    const questions = bookletA.filter((question) => question.outcomeCode === outcome.code);
    return {
      outcomeCode: outcome.code,
      outcomeTitle: outcome.title,
      questionCount: questions.length,
      totalPoints: questions.reduce((sum, question) => sum + question.points, 0),
      cognitiveLevels: [...new Set(questions.map((question) => question.cognitiveLevel))],
    };
  });
  const outcomeAlignment = bookletA.every((question) => outcomes.some((outcome) => outcome.code === question.outcomeCode));
  const scoreBalance = bookletA.reduce((sum, question) => sum + question.points, 0) === 100;
  const uniqueQuestions = new Set(bookletA.map((question) => question.prompt)).size === bookletA.length;
  const bookletEquivalence = equivalentBooklets(bookletA, bookletB);
  const answerPackageComplete = bookletA.every((question) => question.answerKey && question.rubric.length);
  const iepAdaptation = input.mode === "iep" && input.iepProfile ? iepProfiles[input.iepProfile] : null;
  const exportAllowed = outcomeAlignment && scoreBalance && uniqueQuestions && bookletEquivalence
    && answerPackageComplete && input.teacherApproved;

  return {
    status: "draft",
    metadata: input.metadata,
    grade: input.grade,
    unitTitle: unit.title,
    bookletA,
    bookletB,
    blueprint,
    iepAdaptation,
    totalPoints: 100,
    validation: {
      outcomeAlignment,
      scoreBalance,
      uniqueQuestions,
      bookletEquivalence,
      answerPackageComplete,
      teacherApproved: input.teacherApproved,
      exportAllowed,
    },
  };
}

function distributePoints(count: number): number[] {
  const base = Math.floor(100 / count);
  const remainder = 100 - base * count;
  return Array.from({ length: count }, (_, index) => base + (index < remainder ? 1 : 0));
}

function questionPrompt(level: CognitiveLevel, concept: string, focus: string, perspective: string, hasText: boolean): string {
  const prefix = hasText ? "Metinden hareketle" : "Felsefi bilginizi kullanarak";
  const prompts: Record<CognitiveLevel, string> = {
    anlama: `${prefix} “${focus}” bağlamında ${concept} kavramını ${perspective} odağıyla açıklayınız.`,
    çıkarım: `${prefix} “${focus}” bağlamında ${concept} hakkında ${perspective} odağında ulaşılabilecek bir sonucu gerekçesiyle yazınız.`,
    analiz: `${prefix} “${focus}” bağlamında ${concept} ile ilgili görüşü ${perspective} odağıyla analiz ediniz.`,
    gerekçelendirme: `${prefix} “${focus}” bağlamında ${concept} hakkındaki görüşünüzü ${perspective} odağıyla savununuz.`,
  };
  return prompts[level];
}

function rubricFor(level: CognitiveLevel, points: number): readonly string[] {
  return [
    `Kavram ve problem doğruluğu (${Math.ceil(points * 0.3)} puan)`,
    `Muhakeme ve ${level} düzeyi (${Math.ceil(points * 0.4)} puan)`,
    `Gerekçe, örnek ve anlatım bütünlüğü (${points - Math.ceil(points * 0.3) - Math.ceil(points * 0.4)} puan)`,
  ];
}

function equivalentBooklets(a: readonly ExamQuestion[], b: readonly ExamQuestion[]): boolean {
  const signature = (questions: readonly ExamQuestion[]) => questions
    .map((question) => `${question.outcomeCode}:${question.cognitiveLevel}:${question.points}`)
    .sort()
    .join("|");
  return signature(a) === signature(b);
}
