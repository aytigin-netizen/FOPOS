import { isPlaceholderExamAnswer } from "./exam-answer-validation.ts";
import { planSharedPassages } from "./exam-passage-groups.ts";
import {
  BorderStyle, Document, HeadingLevel, Packer, Paragraph, ShadingType, Table, TableCell, TableRow, TextRun, WidthType,
} from "docx";
import { safeFileName } from "../../core/file-download.ts";

export type ExamArtifactQuestion = {
  outcomeCode: string; unitCode: string; kindLabel: string; levelLabel: string;
  componentStep?: string; componentDescription?: string; fontSize?: number;
  passage?: string; text: string; points: number; answer: string; criterion: string;
};
export type ExamArtifactInput = {
  school: string; academicYear: string; grade: 10 | 11 | 12; subjectName: string; examName: string;
  booklet: "A" | "B"; durationMinutes: number; mode: "standard" | "bep"; bepLabel?: string;
  bepNote?: string; bepGoals?: string; teacher?: string; principal?: string; questions: readonly ExamArtifactQuestion[];
};

export async function buildExamPackageArtifact(input: ExamArtifactInput, audience: "student" | "teacher") {
  const lines = (text: string, size?: number, bold = false, italics = false) => text.split("\n").map((line, index) => new TextRun({ text: line, break: index ? 1 : undefined, size, bold, italics, color: size === 32 ? "000000" : undefined }));
  const border = { style: BorderStyle.SINGLE, size: 2, color: "94A3B8" };
  const cell = (text: string, width: number, bold = false) => new TableCell({
    width: { size: width, type: WidthType.PERCENTAGE },
    borders: { top: border, bottom: border, left: border, right: border },
    children: [new Paragraph({ spacing: { before: 80, after: 160 }, children: [new TextRun({ text, bold, size: 18 })] })],
  });
  const total = input.questions.reduce((sum, question) => sum + question.points, 0);
  if (total !== 100) throw new Error("Sınav paketi toplam 100 puan olmalıdır.");
  if (input.questions.some(q => !Number.isInteger(q.points) || q.points <= 0 || !q.answer.trim() || !q.criterion.trim()
    || isPlaceholderExamAnswer(q.answer))) {
    throw new Error("Soruya özgü cevap ve puanlama tamamlanmadan sınav dışa aktarılamaz.");
  }
  const distributionCodes = [...new Set(input.questions.map((question) => question.outcomeCode))];
  const blueprint = new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [
    new TableRow({ children: [cell("Öğrenme çıktısı", 22, true), cell("Ünite", 14, true), cell("Soru türü", 23, true), cell("Bilişsel düzey", 23, true), cell("Soru / Puan", 18, true)] }),
    ...distributionCodes.map((code) => {
      const questions = input.questions.filter((question) => question.outcomeCode === code);
      return new TableRow({ children: [
        cell(code, 22, true), cell(questions[0]?.unitCode ?? "—", 14),
        cell([...new Set(questions.map((question) => question.kindLabel))].join(", "), 23),
        cell([...new Set(questions.map((question) => question.levelLabel))].join(", "), 23),
        cell(`${questions.length} / ${questions.reduce((sum, question) => sum + question.points, 0)}`, 18),
      ] });
    }),
  ] });
  const passageSlots = planSharedPassages(input.questions);
  const children = [
    ...[
      input.school,
      `${input.academicYear} EĞİTİM-ÖĞRETİM YILI`,
      `${input.grade}. SINIF ${input.subjectName.toLocaleUpperCase("tr-TR")} ${input.examName} — ${input.booklet} KİTAPÇIĞI`,
    ].map(text => new Paragraph({ alignment: "center", keepNext: true, spacing: { after: 80 }, children: [new TextRun({ text, bold: true, size: 24, color: "000000" })] })),
    new Paragraph({ text: `Süre: ${input.durationMinutes} dakika • Toplam: ${total} puan` }),
    ...(audience === "student" ? [new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [new TableRow({ children: [cell("Adı Soyadı:", 50, true), cell("Okul No:", 25, true), cell("Aldığı Puan:", 25, true)] })] })] : []),
    ...(audience === "teacher" ? [new Paragraph({ text: "BELİRTKE TABLOSU", heading: HeadingLevel.HEADING_1 }), blueprint] : []),
    ...(audience === "teacher" && input.mode === "bep" ? [
      new Paragraph({ text: `BEP uyarlaması: ${input.bepLabel ?? "Eğitimsel uyarlama"} — ${input.bepNote ?? "Öğrencinin onaylı BEP'iyle eşleştirilmelidir."}` }),
      new Paragraph({ text: `BEP hedefleri/notu: ${input.bepGoals ?? "Öğrencinin onaylı BEP'iyle eşleştirilmelidir."}` }),
    ] : []),
    ...input.questions.flatMap((question, index) => [
      ...(question.passage && passageSlots[index].show ? [new Paragraph({ keepNext: true, spacing: question.fontSize === 32 ? { line: 360, after: 240 } : undefined, shading: { type: ShadingType.CLEAR, fill: question.fontSize === 32 ? "FFFFFF" : "EEF3F8" }, children: [new TextRun({ text: `${input.subjectName} metni${passageSlots[index].label ? ` — ${passageSlots[index].label}` : ""}\n`, bold: true, size: question.fontSize }), ...lines(question.passage, question.fontSize, false, question.fontSize !== 32)] })] : []),
      new Paragraph({ keepNext: true, spacing: question.fontSize === 32 ? { line: 360, after: 240 } : undefined, children: lines(`${index + 1}. ${question.text} (${question.points} puan)`, question.fontSize, true) }),
      new Paragraph({ spacing: { after: 140 }, children: lines(Array.from({ length: ["Değerlendirme", "Oluşturma"].includes(question.levelLabel) ? 5 : 3 }, () => "................................................................................").join("\n")) }),
    ]),
    ...(audience === "teacher" ? [
      new Paragraph({ text: "CEVAP ANAHTARI VE DERECELİ PUANLAMA ANAHTARI", heading: HeadingLevel.HEADING_1 }),
      ...input.questions.flatMap((question, index) => [new Paragraph({ keepNext: true, spacing: { before: 180 }, children: [new TextRun({ text: `${index + 1}. soru — ${question.points} puan`, bold: true })] }), ...(question.componentStep ? [new Paragraph({ keepNext: true, text: `${question.outcomeCode} / ${question.componentStep}) ${question.componentDescription}` })] : []), new Paragraph({ keepNext: true, keepLines: true, children: lines(question.answer) }), new Paragraph({ keepLines: true, children: lines(question.criterion) })]),
      new Paragraph({ text: "SINAV ANALİZ FORMU", heading: HeadingLevel.HEADING_1 }),
      new Paragraph({ text: `${input.teacher ?? "................................"} — Ders Öğretmeni                    ${input.principal ?? "................................"} — Okul Müdürü` }),
    ] : []),
  ];
  return {
    blob: await Packer.toBlob(new Document({ creator: "FOPOS v47", styles: { default: { heading1: { run: { color: "000000", size: 24 } } } }, sections: [{ children }] })),
    fileName: safeFileName(["FOPOS", input.grade, "Sinif", input.booklet, audience === "student" ? "Ogrenci_Kitapcigi" : "Ogretmen_Paketi"], "docx"),
  };
}
