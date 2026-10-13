import { isPlaceholderExamAnswer } from "./exam-answer-validation.ts";
import { planSharedPassages } from "./exam-passage-groups.ts";
import { examAnswerSpace } from './exam-answer-space.ts';
import {
  BorderStyle, Document, HeadingLevel, Packer, Paragraph, ShadingType, Table, TableCell, TableRow, TextRun, WidthType,
} from "docx";
import { safeFileName } from "../../core/file-download.ts";

export type ExamArtifactQuestion = {
  outcomeCode: string; unitCode: string; kindLabel: string; levelLabel: string;
  componentStep?: string; componentDescription?: string; fontSize?: number;
  responseFormat?: 'extended';
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
  const passageParagraphs = (question: ExamArtifactQuestion, index: number) => {
    if (!question.passage || !passageSlots[index].show) return [];
    const parts = input.mode === 'bep'
      ? question.passage.split(/\n+/u).filter(part => part.trim())
      : [question.passage];
    return parts.map((part, partIndex) => new Paragraph({
      // Uzun BEP metni tek bir "sonrakiyle tut" zinciriyle boş sayfaya itilmez.
      // Başlık ilk okuma bölümüyle, son bölüm ilk soruyla birlikte kalır.
      keepNext: partIndex === parts.length - 1,
      keepLines: input.mode === 'bep',
      spacing: input.mode === 'bep' ? { line: question.fontSize === 32 ? 360 : undefined, after: 120 }
        : question.fontSize === 32 ? { line: 360, after: 240 } : undefined,
      shading: { type: ShadingType.CLEAR, fill: question.fontSize === 32 ? 'FFFFFF' : 'EEF3F8' },
      children: [
        ...(partIndex === 0 ? [new TextRun({ text: `${input.subjectName} metni${passageSlots[index].label ? ` — ${passageSlots[index].label}` : ''}\n`, bold: true, size: question.fontSize })] : []),
        ...lines(part, question.fontSize, false, question.fontSize !== 32),
      ],
    }));
  };
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
      ...passageParagraphs(question, index),
      new Paragraph({ keepNext: true, spacing: question.fontSize === 32 ? { line: 360, after: 240 } : undefined, children: lines(`${index + 1}. ${question.text} (${question.points} puan)`, question.fontSize, true) }),
      ...Array.from({ length: examAnswerSpace(question).lineCount }, (_, lineIndex) => new Paragraph({
        // Paragraf sınırları sayfanın yazılabilir genişliğini kullanır; nokta dizisi yarım satır bırakmaz.
        style: 'ExamAnswerLine',
        keepNext: lineIndex < examAnswerSpace(question).lineCount - 1,
        spacing: { line: examAnswerSpace(question).lineHeight, after: lineIndex === examAnswerSpace(question).lineCount - 1 ? 140 : 0 },
        border: {
          bottom: { style: BorderStyle.DOTTED, size: 2, color: '94A3B8', space: 0 },
          between: { style: BorderStyle.DOTTED, size: 2, color: '94A3B8', space: 0 },
        },
        children: [new TextRun({ text: ' ', size: question.fontSize ?? 22 })],
      })),
    ]),
    ...(audience === "teacher" ? [
      new Paragraph({ text: "CEVAP ANAHTARI VE DERECELİ PUANLAMA ANAHTARI", heading: HeadingLevel.HEADING_1 }),
      ...input.questions.flatMap((question, index) => [new Paragraph({ keepNext: true, spacing: { before: 180 }, children: [new TextRun({ text: `${index + 1}. soru — ${question.points} puan`, bold: true })] }), ...(question.componentStep ? [new Paragraph({ keepNext: true, text: `${question.outcomeCode} / ${question.componentStep}) ${question.componentDescription}` })] : []), new Paragraph({ keepNext: true, keepLines: true, children: lines(question.answer) }), new Paragraph({ keepLines: true, children: lines(question.criterion) })]),
      new Paragraph({ text: "SINAV ANALİZ FORMU", heading: HeadingLevel.HEADING_1, pageBreakBefore: true, keepNext: true }),
      new Paragraph({ text: "Sınav uygulandıktan sonra doldurulur. Boş alanlar henüz hesaplanmamış sonuçları gösterir." }),
      new Paragraph({ text: "Sınıf / Şube: ....................    Sınav tarihi: ...................." }),
      new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [
        new TableRow({ tableHeader: true, children: [cell("Katılan öğrenci sayısı", 33, true), cell("Sınıf ortalaması (100 üzerinden)", 34, true), cell("Genel değerlendirme", 33, true)] }),
        new TableRow({ children: [cell("....................", 33), cell("....................", 34), cell("................................", 33)] }),
      ] }),
      new Paragraph({ text: "SORULARA GÖRE ANALİZ", keepNext: true, spacing: { before: 160 } }),
      new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [
        new TableRow({ tableHeader: true, children: [cell("Soru", 9, true), cell("Öğrenme çıktısı / Bileşen", 28, true), cell("Tam puan", 12, true), cell("Soru ortalaması", 16, true), cell("Başarı (%)", 13, true), cell("Gözlenen öğrenme güçlüğü", 22, true)] }),
        ...input.questions.map((question, index) => new TableRow({ cantSplit: true, children: [
          cell(String(index + 1), 9), cell(`${question.outcomeCode}${question.componentStep ? ` / ${question.componentStep}` : ""}`, 28),
          cell(String(question.points), 12), cell("............", 16), cell("............", 13), cell("........................", 22),
        ] })),
      ] }),
      new Paragraph({ text: "Soru ortalaması = ilgili sorudan alınan toplam puan / sınava katılan öğrenci sayısı. Soru başarısı (%) = soru ortalaması / sorunun tam puanı × 100. Katılan öğrenci yoksa oran hesaplanmaz." }),
      new Paragraph({ text: "GERİ BİLDİRİM VE DESTEK PLANI", keepNext: true, spacing: { before: 160 } }),
      new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [
        new TableRow({ tableHeader: true, children: [cell("Öncelikli öğrenme ihtiyacı", 34, true), cell("Geri bildirim / Destek etkinliği", 33, true), cell("İzleme zamanı / Öğrenme kanıtı", 33, true)] }),
        ...Array.from({ length: 3 }, () => new TableRow({ cantSplit: true, children: [cell("........................", 34), cell("........................", 33), cell("........................", 33)] })),
      ] }),
      new Paragraph({ text: `${input.teacher ?? "................................"} — Ders Öğretmeni                    ${input.principal ?? "................................"} — Okul Müdürü` }),
    ] : []),
  ];
  return {
    blob: await Packer.toBlob(new Document({ creator: "FOPOS v47", styles: {
      default: { heading1: { run: { color: "000000", size: 24 } } },
      paragraphStyles: [{ id: 'ExamAnswerLine', name: 'Sınav cevap satırı', basedOn: 'Normal', paragraph: { spacing: { before: 0, after: 0 } } }],
    }, sections: [{ children }] })),
    fileName: safeFileName(["FOPOS", input.grade, "Sinif", input.booklet, audience === "student" ? "Ogrenci_Kitapcigi" : "Ogretmen_Paketi"], "docx"),
  };
}
