import { AlignmentType, BorderStyle, Document, HeadingLevel, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType } from "docx";
import { safeFileName } from "../../core/file-download.ts";

export type DepartmentMeetingArtifactInput = {
  year: string; school: string; field: string; meetingNo: string; periodLabel: string; date: string; time: string;
  place: string; chair: string; principal: string; members: readonly string[];
  items: readonly { title: string; discussion: string; decision: string; status: string }[];
};

export async function buildDepartmentMeetingArtifact(input: DepartmentMeetingArtifactInput) {
  const border = { style: BorderStyle.SINGLE, size: 1, color: "94A3B8" };
  const cell = (text: string, width: number, bold = false) => new TableCell({
    width: { size: width, type: WidthType.PERCENTAGE }, borders: { top: border, bottom: border, left: border, right: border },
    children: [new Paragraph({ children: [new TextRun({ text, bold, size: 19 })] })],
  });
  const children = [
    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `T.C.\n${input.school.toLocaleUpperCase("tr-TR")}\n${input.year} EĞİTİM-ÖĞRETİM YILI\n${input.field.toLocaleUpperCase("tr-TR")} ${input.periodLabel.toLocaleUpperCase("tr-TR")} ZÜMRE TOPLANTI TUTANAĞI`, bold: true, size: 24 })] }),
    new Paragraph({ text: "Belge durumu: Toplantının gerçekleşmesi ve gerçek içeriği öğretmen tarafından OPUS akışında onaylandı. Bu onay müdür imzası veya elektronik imza değildir; yetkili imzalar olmadan belge yürürlüğe girmez." }),
    new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [
      ["Toplantı no", input.meetingNo, "Toplantı türü", input.periodLabel], ["Toplantı tarihi", input.date, "Toplantı saati", input.time],
      ["Toplantı yeri", input.place, "Zümre başkanı", input.chair], ["Katılan üyeler", input.members.join(", "), "Okul müdürü", input.principal],
    ].map((row) => new TableRow({ children: [cell(row[0], 18, true), cell(row[1], 32), cell(row[2], 18, true), cell(row[3], 32)] })) }),
    new Paragraph({ text: "GÜNDEM MADDELERİ", heading: HeadingLevel.HEADING_1 }),
    ...input.items.map((item, index) => new Paragraph({ text: `${index + 1}. ${item.title}` })),
    new Paragraph({ text: "GÜNDEM MADDELERİNİN GÖRÜŞÜLMESİ", heading: HeadingLevel.HEADING_1 }),
    ...input.items.flatMap((item, index) => [new Paragraph({ text: `${index + 1}. ${item.title}` }), new Paragraph({ text: `Durum: ${item.status}` }), new Paragraph({ text: `Görüşme kaydı: ${item.discussion}` })]),
    new Paragraph({ text: "ALINAN KARARLAR", heading: HeadingLevel.HEADING_1 }),
    ...input.items.map((item, index) => new Paragraph({ text: `${index + 1}. ${item.decision || "Karar alınmadı."}` })),
    new Paragraph({ text: "İMZA ÇİZELGESİ", heading: HeadingLevel.HEADING_1 }),
    new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: input.members.map((name, index) => new TableRow({ children: [cell(String(index + 1), 8), cell(name, 37), cell(index === 0 ? "Zümre Başkanı" : "Üye", 25), cell("İmza: ....................", 30)] })) }),
    new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${input.principal}\nOkul Müdürü\nOnay tarihi / İmza:`, bold: true })] }),
  ];
  return {
    blob: await Packer.toBlob(new Document({ creator: "FOPOS", title: `${input.field} Zümre Toplantı Tutanağı`, sections: [{ children }] })),
    fileName: safeFileName(["FOPOS", input.year, input.field, "Zumre_Tutanagi"], "docx"),
  };
}
