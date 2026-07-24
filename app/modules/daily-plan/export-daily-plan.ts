import { downloadBlob, safeFileName } from "../../core/file-download.ts";
import { cleanCurriculumText, formatCurriculumList } from "../../core/curriculum-text.ts";
import type { PlanMeta, PlanResult } from "../lesson-studio/lesson-engine";

const QUIET_PROFILE = "Katılım desteği gerekli";
const SUPPORT_PROFILE = "Kavramsal destek gerekli";

export async function exportDailyPlan(result: PlanResult, meta: PlanMeta) {
  if (result.pedagogicalRecord.status !== "approved")
    throw new Error("Günlük plan öğretmen onayı olmadan dışa aktarılamaz.");
  const {
    AlignmentType,
    BorderStyle,
    Document,
    HeadingLevel,
    Packer,
    Paragraph,
    ShadingType,
    Table,
    TableCell,
    TableRow,
    TextRun,
    WidthType,
  } = await import("docx");

  const border = { style: BorderStyle.SINGLE, size: 1, color: "CBD5E1" };
  const headerCell = (text: string, width: number) =>
    new TableCell({
      width: { size: width, type: WidthType.PERCENTAGE },
      shading: { type: ShadingType.CLEAR, fill: "E8EEF5" },
      borders: { top: border, bottom: border, left: border, right: border },
      children: [
        new Paragraph({
          children: [new TextRun({ text, bold: true, color: "0B2545" })],
        }),
      ],
    });
  const bodyCell = (text: string, width: number) =>
    new TableCell({
      width: { size: width, type: WidthType.PERCENTAGE },
      borders: { top: border, bottom: border, left: border, right: border },
      children: [
        new Paragraph({ children: [new TextRun({ text, size: 19 })] }),
      ],
    });

  const timelineRows = [
    new TableRow({
      tableHeader: true,
      children: [
        headerCell("Aşama", 15),
        headerCell("Süre", 9),
        headerCell("Öğretmen eylemi", 28),
        headerCell("Öğrenci eylemi", 28),
        headerCell("Öğrenme kanıtı", 20),
      ],
    }),
    ...result.phases.map(
      (phase) =>
        new TableRow({
          cantSplit: true,
          children: [
            bodyCell(phase.label, 15),
            bodyCell(`${phase.duration} dk`, 9),
            bodyCell(phase.facilitator, 28),
            bodyCell(phase.learner, 28),
            bodyCell(phase.evidence, 20),
          ],
        }),
    ),
  ];

  const formalRows = [
    ["Dersin Adı", "Felsefe"],
    ["Sınıf", `${result.unit.grade}`],
    ["Ders Tarihi", meta.date || ".... / .... / ........"],
    ["Ders Saati", "2 ders saati (80 dakika)"],
    ["Ünite", result.unit.name],
    ["Konu", result.week.focus],
    [
      "Öğrenme Çıktısı",
      `${result.outcome.code} — ${result.outcome.description}`,
    ],
    [
      "Süreç Bileşenleri",
      result.outcome.processComponents.map(component => `${component.step}) ${component.description}`).join(" "),
    ],
    [
      "Öğrenme Çıktısı Açıklaması",
      `Öğrencinin ${result.week.focus.toLocaleLowerCase("tr-TR")} odağında kavramları ayırt etmesi, görüşleri gerekçeleriyle değerlendirmesi ve felsefi bir ürün ortaya koyması sağlanır.`,
    ],
    ["Yöntem ve Teknikler", result.decision.methods.join(", ")],
    [
      "Araç ve Gereçler",
      "Ders kitabı, felsefi metin, akıllı tahta, kavram/argüman kartları, öğrenci çalışma kâğıdı",
    ],
    [
      "Ölçme ve Değerlendirme",
      `Süreç gözlemi, akran geri bildirimi, ${result.phases
        .map((p) => p.evidence)
        .slice(-3)
        .join(", ")}`,
    ],
    ["Belirli Gün ve Haftalar", meta.specialDays || "—"],
    ["Alan Becerileri", formatCurriculumList(result.unit.competencyFramework.fieldSkills)],
    ["Kavramsal Beceriler", formatCurriculumList(result.unit.competencyFramework.conceptualSkills)],
    ["Eğilimler", formatCurriculumList(result.unit.competencyFramework.tendencies)],
    ["Sosyal-Duygusal Öğrenme Becerileri", formatCurriculumList(result.unit.competencyFramework.socialEmotionalLearning)],
    ["Değerler", formatCurriculumList(result.unit.competencyFramework.values)],
    ["Okuryazarlık Becerileri", formatCurriculumList(result.unit.competencyFramework.literacy)],
    ["Disiplinler Arası İlişkiler", formatCurriculumList(result.unit.competencyFramework.interdisciplinaryRelations)],
    ["Beceriler Arası İlişkiler", formatCurriculumList(result.unit.competencyFramework.interSkillRelations)],
    ["İçerik Çerçevesi", formatCurriculumList(result.unit.contentFramework)],
    ["Anahtar Kavramlar", formatCurriculumList(result.unit.keywords)],
  ];

  const doc = new Document({
    creator: "FOPOS v5.0 Professional Edition",
    title: `${result.unit.name} — ${result.week.number}. Hafta Ders Planı`,
    description: "TYMM 2024 uyumlu FOPOS ders planı",
    sections: [
      {
        properties: {
          page: { margin: { top: 900, right: 900, bottom: 900, left: 900 } },
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `${meta.academicYear} EĞİTİM-ÖĞRETİM YILI${meta.school.trim() ? ` • ${meta.school.trim().toLocaleUpperCase("tr-TR")}` : ""}`,
                bold: true,
                color: "0B2545",
                size: 20,
              }),
            ],
            spacing: { after: 180 },
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `${result.unit.grade}. SINIF FELSEFE DERSİ GÜNLÜK PLANI`,
                bold: true,
                color: "0B2545",
                size: 30,
              }),
            ],
            spacing: { after: 80 },
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `${result.unit.grade}. Sınıf • 80 Dakika • TYMM 2024`,
                color: "64748B",
                size: 22,
              }),
            ],
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: "Plan Bilgileri",
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            text: `Pedagojik kayıt: ${result.pedagogicalRecord.recordId} • Revizyon ${result.pedagogicalRecord.revision} • Veri seti ${result.pedagogicalRecord.curriculum.datasetVersion}`,
          }),
          new Paragraph({
            text: `Ürün: ${result.product.productId} • Oluşturulma: ${result.createdAt}`,
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: formalRows.map(
              ([label, value]) =>
                new TableRow({
                  children: [headerCell(label, 25), bodyCell(value, 75)],
                }),
            ),
          }),
          new Paragraph({
            text: "Pedagojik Karar",
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Makro strateji: ", bold: true }),
              new TextRun(result.decision.strategy),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Yöntemler: ", bold: true }),
              new TextRun(result.decision.methods.join(" • ")),
            ],
          }),
          new Paragraph({
            text: result.decision.rationale,
            spacing: { after: 180 },
          }),
          new Paragraph({
            text: "Pedagojik Riskler ve Önlemler",
            heading: HeadingLevel.HEADING_2,
          }),
          ...result.decision.risks.map(risk => new Paragraph({
            bullet: { level: 0 },
            children: [
              new TextRun({ text: `${risk.title}: `, bold: true }),
              new TextRun(risk.response),
            ],
          })),
          new Paragraph({
            text: "Öğrenmeye Hazırlık",
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Temel kabuller: ", bold: true }),
              new TextRun(cleanCurriculumText(result.unit.learningTeachingExperiences.basicAssumptions)),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Ön değerlendirme süreci: ", bold: true }),
              new TextRun(cleanCurriculumText(result.unit.learningTeachingExperiences.preAssessment)),
            ],
          }),
          new Paragraph({
            spacing: { after: 180 },
            children: [
              new TextRun({ text: "Köprü kurma: ", bold: true }),
              new TextRun(cleanCurriculumText(result.unit.learningTeachingExperiences.bridging)),
            ],
          }),
          new Paragraph({
            text: "Ünite Düzeyinde Öğrenme Kanıtları",
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            text: cleanCurriculumText(result.unit.learningEvidence),
            spacing: { after: 180 },
          }),
          new Paragraph({
            text: "80 Dakikalık Ders Akışı",
            heading: HeadingLevel.HEADING_1,
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: timelineRows,
          }),
          new Paragraph({
            text: "Kontrol ve Öğretmen Onayı Kaydı",
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "KURAL KONTROLLERİ TAMAMLANDI",
                bold: true,
                color: "167B59",
              }),
              new TextRun({
                text: " • Felsefi içerik ile sınıf uygunluğu öğretmen tarafından incelenerek plan onaylanmıştır.",
              }),
            ],
          }),
          ...result.validation.checks.map(
            (check) =>
              new Paragraph({
                bullet: { level: 0 },
                children: [
                  new TextRun({
                    text: `${check.code} — ${check.label} [${check.status === "passed" ? "Kural doğrulandı" : "Öğretmen incelemesi — onaylandı"}]: `,
                    bold: true,
                  }),
                  new TextRun(`${check.note} Kaynak: ${check.source}`),
                ],
              }),
          ),
          new Paragraph({
            text: "Farklılaştırma ve Günlük Hayatla Bağlantı",
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Ders içi uyarlama: ", bold: true }),
              new TextRun(
                result.profile === QUIET_PROFILE
                  ? "Düşün-eşleş-paylaş, yazılı katılım ve sıra ile söz alma kullanılır."
                  : result.profile === SUPPORT_PROFILE
                    ? "Kavram kartları, görsel şemalar, somut örnekler ve cümle başlatıcıları kullanılır."
                    : "Görsel, işitsel ve uygulamalı görevler dengeli biçimde kullanılır.",
              ),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Zenginleştirme: ", bold: true }),
              new TextRun(cleanCurriculumText(result.unit.differentiation.enrichment)),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Destekleme: ", bold: true }),
              new TextRun(cleanCurriculumText(result.unit.differentiation.support)),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Günlük hayatla bağlantı: ", bold: true }),
              new TextRun(result.unit.application),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 500 },
            children: [
              new TextRun({
                text: "Yetkili onay tarihi / İmza: .... / .... / ........",
                bold: true,
              }),
            ],
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  bodyCell(
                    `${meta.teacher}\nDers Öğretmeni\nTarih / İmza:`,
                    50,
                  ),
                  bodyCell(
                    `${meta.principal}\nOkul Müdürü\nOnay tarihi / İmza:`,
                    50,
                  ),
                ],
              }),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  downloadBlob(
    blob,
    safeFileName(
      [
        "FOPOS",
        result.unit.grade,
        "Sinif",
        result.unit.code,
        "Hafta",
        result.week.number,
        "Gunluk_Plani",
      ],
      "docx",
    ),
  );
}
