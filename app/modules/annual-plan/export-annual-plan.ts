import {
  AlignmentType,
  BorderStyle,
  Document,
  Packer,
  PageOrientation,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";
import { safeFileName } from "../../core/file-download.ts";

export type AnnualPlanArtifactRow = {
  week: number;
  month: string;
  dates: string;
  hours: number;
  unit: string;
  topic: string;
  outcome: string;
  components: string;
  socialEmotional: string;
  values: string;
  literacy: string;
  special: string;
};

export type AnnualPlanArtifactInput = {
  academicYear: string;
  school: string;
  teacher: string;
  principal: string;
  grade: 10 | 11 | 12;
  subjectName: string;
  sourceTitle: string;
  sourceYear: number | string;
  rows: readonly AnnualPlanArtifactRow[];
};

export async function buildAnnualPlanArtifact(input: AnnualPlanArtifactInput) {
  const border = { style: BorderStyle.SINGLE, size: 1, color: "94A3B8" };
  const cell = (text: string, width: number, header = false) =>
    new TableCell({
      width: { size: width, type: WidthType.PERCENTAGE },
      shading: header ? { type: ShadingType.CLEAR, fill: "DCE6F1" } : undefined,
      borders: { top: border, bottom: border, left: border, right: border },
      children: [new Paragraph({ children: [new TextRun({ text, bold: header, size: header ? 14 : 12 })] })],
    });
  const doc = new Document({
    creator: "FOPOS v47 Professional Edition",
    title: `${input.grade}. Sınıf ${input.subjectName} Ünitelendirilmiş Yıllık Planı`,
    sections: [{
      properties: { page: { size: { orientation: PageOrientation.LANDSCAPE }, margin: { top: 420, right: 420, bottom: 420, left: 420 } } },
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 },
          children: [new TextRun({
            text: `${input.academicYear} EĞİTİM-ÖĞRETİM YILI ${input.school.toLocaleUpperCase("tr-TR")}\n${input.grade}. SINIF ${input.subjectName.toLocaleUpperCase("tr-TR")} DERSİ ÜNİTELENDİRİLMİŞ YILLIK PLAN TASLAĞI`,
            bold: true,
            size: 20,
          })],
        }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({ tableHeader: true, children: [
              ["Ay / Hafta", 6], ["Tarih / Saat", 7], ["Ünite", 10], ["Konu (İçerik Çerçevesi)", 12],
              ["Öğrenme Çıktısı", 15], ["Süreç Bileşenleri", 18], ["Sosyal-Duygusal Öğrenme", 8],
              ["Değerler", 8], ["Okuryazarlık Becerileri", 8], ["Belirli Gün ve Haftalar", 8],
            ].map(([text, width]) => cell(String(text), Number(width), true)) }),
            ...input.rows.map((row) => new TableRow({ children: [
              cell(`${row.month}\n${row.week}. Hafta`, 6), cell(`${row.dates}\n${row.hours} saat`, 7),
              cell(row.unit, 10), cell(row.topic, 12), cell(row.outcome, 15), cell(row.components, 18),
              cell(row.socialEmotional, 8), cell(row.values, 8), cell(row.literacy, 8), cell(row.special, 8),
            ] })),
          ],
        }),
        ...[
          ["ÖLÇME VE DEĞERLENDİRME", "Öğrenme kanıtlarında açık uçlu sorular, çalışma kâğıtları, kavram haritaları, öz ve akran değerlendirme formları, kontrol listeleri, dereceleme ölçekleri, dereceli puanlama anahtarları ve performans görevleri; öğrenme çıktısına ve sınıf bağlamına uygun biçimde kullanılır."],
          ["FARKLILAŞTIRMA", "Zenginleştirme ve destekleme uygulamaları öğrencilerin ilgi, ihtiyaç, öğrenme profili, öğrenme hızı ve hazır bulunuşlukları gözetilerek öğretmen tarafından planlanır."],
          ["OKUL TEMELLİ PLANLAMA", "Öğretim programındaki 4 ders saati; okulun, çevrenin ve öğrencilerin ihtiyaçları doğrultusunda sınav, geri bildirim, proje, sosyal etkinlik veya tamamlayıcı öğrenme çalışmaları için öğretmen ve zümre kararıyla planlanır."],
          ["DAYANAK", `Plan; MEB Eğitim Öğretim Çalışmalarının Planlı Yürütülmesine İlişkin Yönerge, ${input.sourceTitle} (${input.sourceYear}), TYMM Ortak Metni ve ${input.academicYear} MEB çalışma takvimi esas alınarak hazırlanmıştır.`],
        ].flatMap(([heading, body]) => [
          new Paragraph({ spacing: { before: 120, after: 40 }, children: [new TextRun({ text: heading, bold: true, size: 14 })] }),
          new Paragraph({ spacing: { after: 70 }, children: [new TextRun({ text: body, size: 12 })] }),
        ]),
        new Paragraph({ spacing: { before: 180 }, children: [
          new TextRun({ text: "Kontrol notu: ", bold: true }),
          new TextRun("Müfredat dağılımı kanonik veri setinden üretilmiştir. Öğretmen takvim ve içerik kontrolünü tamamlamıştır; belge yetkili imzaları olmadan yürürlüğe girmez."),
        ] }),
        new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [new TableRow({ children: [
          cell(`${input.teacher}\nDers Öğretmeni\nTarih / İmza:`, 50),
          cell(`${input.principal}\nOkul Müdürü\nOnay tarihi / İmza:`, 50),
        ] })] }),
      ],
    }],
  });
  return {
    blob: await Packer.toBlob(doc),
    fileName: safeFileName(["FOPOS", input.academicYear, input.grade, `Sinif_${input.subjectName}_Yillik_Plani`], "docx"),
  };
}
