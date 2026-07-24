import type { DailyPlan } from "@/modules/daily-plan/types";
import type { DocumentSpec } from "@/modules/document-engine/types";

export function buildDailyPlanDocument(plan: DailyPlan, approved: boolean): DocumentSpec {
  const metadata = plan.metadata;

  return {
    kind: "daily-plan",
    title: `${plan.courseName} Günlük Ders Planı`,
    fileName: `${plan.id}.docx`,
    approved,
    approvalStatement: approved
      ? "Belge içeriği kullanıcı tarafından kontrol edilerek dışa aktarılmıştır."
      : "",
    sections: [
      {
        heading: "Plan bilgileri",
        fields: [
          { label: "Okul", value: metadata.schoolName },
          { label: "Öğretim yılı", value: metadata.academicYear },
          { label: "Öğretmen", value: metadata.teacherName },
          { label: "Tarih", value: metadata.date },
          { label: "Sınıf", value: `${plan.lesson.selection.grade}. sınıf` },
          { label: "Ünite", value: plan.lesson.curriculum.unitTitle },
          { label: "Öğrenme çıktısı", value: `${plan.lesson.selection.outcomeCode} · ${plan.lesson.curriculum.outcomeTitle}` },
        ],
      },
      {
        heading: "Öğrenme-öğretme yaşantıları",
        paragraphs: plan.lesson.phases.map((phase) =>
          `${phase.order}. ${phase.title} (${phase.minutes} dk.)\nÖğretmen: ${phase.teacherAction}\nÖğrenci: ${phase.studentAction}`,
        ),
      },
      {
        heading: "Ölçme ve değerlendirme",
        paragraphs: [plan.assessment.evidence],
        bullets: plan.assessment.criteria,
      },
      {
        heading: "Farklılaştırma ve transfer",
        paragraphs: [metadata.differentiation, metadata.dailyLifeConnection],
      },
      {
        heading: "İmza alanları",
        fields: [
          { label: "Hazırlayan öğretmen", value: metadata.teacherName },
          { label: "Okul müdürü onay alanı", value: metadata.principalName },
        ],
      },
    ],
  };
}
