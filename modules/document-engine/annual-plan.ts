import type { AnnualPlan } from "@/modules/annual-plan/types";
import type { DocumentSpec } from "@/modules/document-engine/types";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export function buildAnnualPlanDocument(plan: AnnualPlan, approved: boolean): DocumentSpec {
  const metadata = plan.metadata;

  return {
    kind: "annual-plan",
    layout: "landscape",
    title: plan.title,
    fileName: `fopos-${plan.grade}-sinif-${metadata.academicYear}-yillik-plan.docx`,
    approved,
    approvalStatement: approved
      ? "Çalışma takvimi ve müfredat dağılımı kullanıcı tarafından kontrol edilerek dışa aktarılmıştır."
      : "",
    sections: [
      {
        heading: "Plan bilgileri",
        fields: [
          { label: "İl / ilçe", value: `${metadata.province || "—"} / ${metadata.district || "—"}` },
          { label: "Okul", value: metadata.schoolName },
          { label: "Öğretim yılı", value: metadata.academicYear },
          { label: "Sınıf / şubeler", value: `${plan.grade}. sınıf / ${metadata.branches || "—"}` },
          { label: "Haftalık ders saati", value: String(plan.weeklyLessonHours) },
          { label: "Toplam ders saati", value: String(plan.totalLessonHours) },
        ],
      },
      {
        heading: "Haftalık dağılım",
        paragraphs: plan.weeks.map((week) => [
          `${week.sequence}. hafta · ${formatDate(week.startDate)}–${formatDate(week.endDate)} · ${week.semester}. dönem`,
          `${week.unitTitle} · ${week.topic}`,
          `${week.outcomeCode ?? "OTP"} · ${week.outcomeTitle}`,
          `Süreç: ${week.processComponents.join("; ")}`,
          `Değer / okuryazarlık: ${[...week.values, ...week.literacies].join(", ") || "Zümre kararı"}`,
          `Belirli günler: ${week.specialDays.join(", ") || "—"}`,
        ].join("\n")),
      },
      {
        heading: "İmza ve onay alanları",
        fields: [
          { label: "Felsefe öğretmeni", value: metadata.teacherName },
          { label: "Zümre başkanı", value: metadata.departmentHead },
          { label: "Okul müdürü onay alanı", value: metadata.principalName },
        ],
      },
    ],
  };
}
