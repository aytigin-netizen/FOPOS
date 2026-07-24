import { getCurriculum, getLearningOutcome, getUnit } from "@/curriculum";
import type { LessonDraft, LessonPhase, LessonStudioSelection } from "@/modules/lesson-studio/types";

export const classProfiles = [
  { value: "balanced", label: "Dengeli sınıf" },
  { value: "support", label: "Desteğe ihtiyaç duyan sınıf" },
  { value: "advanced", label: "İleri düzey sınıf" },
] as const;

export const teachingMethods = [
  "Sokratik sorgulama",
  "Felsefi metin çözümleme",
  "Argümantasyon ve tartışma",
  "Örnek olay inceleme",
] as const;

export const evidenceOptions = [
  "Çıkış bileti",
  "Kısa felsefi metin",
  "Argüman haritası",
  "Öz ve akran değerlendirme",
] as const;

export function getStudioDefaults(): LessonStudioSelection {
  const curriculum = getCurriculum(10);
  const unit = curriculum.units[0];
  const outcome = unit.outcomes[0];

  return {
    grade: 10,
    unitCode: unit.code,
    outcomeCode: outcome.code,
    week: 1,
    classProfile: "balanced",
    method: teachingMethods[0],
    evidence: evidenceOptions[0],
  };
}

export function getUnitWeekCount(unitCode: string): number {
  const unit = getUnit(unitCode);
  return unit ? Math.ceil(unit.lessonHours / 2) : 0;
}

export function createLessonDraft(selection: LessonStudioSelection): LessonDraft {
  const unit = getUnit(selection.unitCode);
  const outcome = getLearningOutcome(selection.outcomeCode);

  if (!unit || !outcome || unit.grade !== selection.grade) {
    throw new Error("Ders tasarımı için geçerli bir müfredat seçimi gereklidir.");
  }

  if (!unit.outcomes.some((item) => item.code === outcome.code)) {
    throw new Error("Öğrenme çıktısı seçilen üniteye ait değildir.");
  }

  const maxWeek = getUnitWeekCount(unit.code);
  if (selection.week < 1 || selection.week > maxWeek) {
    throw new Error(`Hafta değeri 1-${maxWeek} aralığında olmalıdır.`);
  }

  const phases: readonly LessonPhase[] = [
    {
      order: 1,
      title: "Merak uyandırma",
      minutes: 5,
      teacherAction: `${unit.title} bağlamında düşündürücü bir soru veya uyaran sunar.`,
      studentAction: "İlk düşüncesini kısa ve gerekçeli biçimde ifade eder.",
    },
    {
      order: 2,
      title: "Ön bilgiyi yoklama",
      minutes: 5,
      teacherAction: "Ön öğrenmeleri ve olası kavram yanılgılarını görünür kılar.",
      studentAction: "Bildiği kavramları ve emin olmadığı noktaları paylaşır.",
    },
    {
      order: 3,
      title: "Felsefi problem",
      minutes: 10,
      teacherAction: `“${outcome.title}” çıktısını felsefi bir probleme dönüştürür.`,
      studentAction: "Problemi kendi yaşantısı ve örneklerle ilişkilendirir.",
    },
    {
      order: 4,
      title: "Kavramları kurma",
      minutes: 10,
      teacherAction: `Anahtar kavramları yapılandırır: ${unit.keyConcepts.slice(0, 4).join(", ")}.`,
      studentAction: "Kavramlar arasındaki ilişkileri örneklendirir.",
    },
    {
      order: 5,
      title: "Metin ve argüman inceleme",
      minutes: 15,
      teacherAction: "Görüş, gerekçe, öncül ve sonuçları bulduracak bir kaynak sunar.",
      studentAction: "Metindeki problem, kavram ve argümanları çözümler.",
    },
    {
      order: 6,
      title: "Felsefi tartışma",
      minutes: 10,
      teacherAction: `${selection.method} sürecini açık ölçütlerle yönetir.`,
      studentAction: "Görüşünü gerekçelendirir ve karşı görüşü değerlendirir.",
    },
    {
      order: 7,
      title: "Uygulama ve transfer",
      minutes: 10,
      teacherAction: "Öğrenmeyi güncel veya gündelik bir duruma taşır.",
      studentAction: "Felsefi muhakemesini yeni duruma uygular.",
    },
    {
      order: 8,
      title: "Öğrenme kanıtı",
      minutes: 10,
      teacherAction: `${selection.evidence} için başarı ölçütlerini açıklar.`,
      studentAction: "Seçilen öğrenme kanıtını bireysel veya iş birlikli üretir.",
    },
    {
      order: 9,
      title: "Yansıtma ve kapanış",
      minutes: 5,
      teacherAction: "Öğrenme çıktısına dönüş yaptırır ve sonraki adımı belirler.",
      studentAction: "Ne öğrendiğini, neyi sorguladığını ve neye ihtiyaç duyduğunu yazar.",
    },
  ];

  return {
    title: `${selection.grade}. Sınıf · ${unit.title} · ${selection.week}. Hafta`,
    totalMinutes: 80,
    selection,
    curriculum: {
      unitTitle: unit.title,
      outcomeTitle: outcome.title,
      processComponents: outcome.processComponents,
      contentFramework: unit.contentFramework,
      keyConcepts: unit.keyConcepts,
      fieldSkills: unit.components.fieldSkills,
      values: unit.components.values,
      literacies: unit.components.literacies,
    },
    phases,
  };
}
