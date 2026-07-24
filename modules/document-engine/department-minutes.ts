import type { DepartmentMinutes } from "@/modules/department-minutes/types";
import type { DocumentSpec } from "@/modules/document-engine/types";

export function buildDepartmentMinutesDocument(
  minutes: DepartmentMinutes,
  approved: boolean,
): DocumentSpec {
  const metadata = minutes.metadata;

  return {
    kind: "department-minutes",
    title: minutes.title,
    fileName: `fopos-zumre-tutanagi-${metadata.academicYear}-${metadata.meetingNumber || "taslak"}.docx`,
    approved: approved && minutes.validation.exportAllowed,
    approvalStatement: approved && minutes.validation.exportAllowed
      ? "Toplantı bilgileri, gündem görüşmeleri ve kararlar kullanıcı tarafından kontrol edilerek dışa aktarılmıştır."
      : "",
    sections: [
      {
        heading: "Toplantı bilgileri",
        fields: [
          { label: "Okul", value: metadata.schoolName },
          { label: "Öğretim yılı", value: metadata.academicYear },
          { label: "Toplantı no", value: metadata.meetingNumber },
          { label: "Tarih / saat", value: `${metadata.date || "—"} / ${metadata.time || "—"}` },
          { label: "Yer", value: metadata.place },
          { label: "Zümre başkanı", value: metadata.chairName },
        ],
      },
      {
        heading: "Yasal dayanak",
        paragraphs: [minutes.legalBasis],
      },
      {
        heading: "Hazır bulunanlar",
        bullets: metadata.members.filter((member) => member.trim()),
      },
      {
        heading: "Gündem, görüşmeler ve kararlar",
        paragraphs: minutes.agenda.map((item, index) => [
          `${index + 1}. ${item.title}`,
          `Görüşme: ${item.discussion}`,
          `Karar: ${item.decision}`,
        ].join("\n")),
      },
      {
        heading: "Karar özeti",
        bullets: minutes.decisions.map((decision) => `${decision.number}. ${decision.text}`),
      },
      {
        heading: "İmza ve onay alanları",
        fields: [
          { label: "Zümre başkanı", value: metadata.chairName },
          ...metadata.members
            .filter((member) => member.trim())
            .map((member, index) => ({ label: `${index + 1}. zümre üyesi`, value: member })),
          { label: "Okul müdürü onay alanı", value: metadata.principalName },
        ],
      },
    ],
  };
}
