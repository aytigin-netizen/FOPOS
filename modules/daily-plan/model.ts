import { createLessonDraft, getStudioDefaults } from "@/modules/lesson-studio/model";
import type { DailyPlan, DailyPlanInput, DailyPlanMetadata } from "@/modules/daily-plan/types";

export const defaultDailyPlanMetadata: DailyPlanMetadata = {
  schoolName: "",
  academicYear: "2026-2027",
  teacherName: "",
  principalName: "",
  date: "",
  specialDay: "",
  materials: "Ders kitabı, seçilmiş felsefi metin, tahta ve çalışma kâğıdı",
  differentiation: "Desteğe ihtiyaç duyan öğrenciler için kavram kartları ve cümle başlatıcılar kullanılır.",
  dailyLifeConnection: "Felsefi problem öğrencilerin gündelik kararları ve güncel olaylarla ilişkilendirilir.",
};

export function getDailyPlanDefaults(): DailyPlanInput {
  return {
    metadata: { ...defaultDailyPlanMetadata },
    lesson: getStudioDefaults(),
  };
}

export function createDailyPlan(input: DailyPlanInput): DailyPlan {
  const lesson = createLessonDraft(input.lesson);
  const planKey = [
    input.lesson.grade,
    input.lesson.unitCode,
    input.lesson.outcomeCode,
    input.lesson.week,
  ].join("-");

  return {
    id: `daily-plan-${planKey}`,
    courseName: "Felsefe",
    lessonHours: 2,
    metadata: input.metadata,
    lesson,
    assessment: {
      evidence: input.lesson.evidence,
      criteria: [
        "Felsefi problemi ve temel kavramları doğru belirler.",
        "Görüşünü açık gerekçelerle savunur.",
        "Karşı görüşü adil biçimde değerlendirir.",
        "Muhakemesini yeni veya gündelik bir duruma aktarır.",
      ],
    },
    approvalChecks: [
      "Sınıf, ünite, hafta ve öğrenme çıktısı birbiriyle uyumludur.",
      "Ders akışı toplam 80 dakikadır.",
      "Her aşama seçilen öğrenme çıktısına izlenebilir.",
      "Öğrenme kanıtı ve değerlendirme ölçütleri belirtilmiştir.",
    ],
  };
}
