import type { ExamQuestion, GeneratedExam } from "@/modules/exam-generator/types";
import type { DocumentSection, DocumentSpec } from "@/modules/document-engine/types";

function questionText(question: ExamQuestion) {
  return [
    `${question.order}. Soru · ${question.points} puan`,
    question.stimulus ? `Metin: ${question.stimulus}` : null,
    question.prompt,
    "Cevap: \n\n\n",
  ].filter(Boolean).join("\n");
}

function answerText(question: ExamQuestion) {
  return [
    `${question.order}. Soru · ${question.outcomeCode} · ${question.cognitiveLevel} · ${question.points} puan`,
    `Cevap anahtarı: ${question.answerKey}`,
    `Puanlama ölçütleri: ${question.rubric.join("; ")}`,
  ].join("\n");
}

export function buildExamPackageDocument(exam: GeneratedExam): DocumentSpec {
  const metadata = exam.metadata;
  const sections: DocumentSection[] = [
    {
      heading: "Sınav bilgileri",
      fields: [
        { label: "Okul", value: metadata.schoolName },
        { label: "Öğretim yılı", value: metadata.academicYear },
        { label: "Sınav", value: metadata.examName },
        { label: "Sınıf / şube", value: `${exam.grade}. sınıf / ${metadata.classBranch || "—"}` },
        { label: "Ünite", value: exam.unitTitle },
        { label: "Tarih / süre", value: `${metadata.date || "—"} / ${metadata.duration} dakika` },
        { label: "Toplam puan", value: String(exam.totalPoints) },
      ],
    },
    {
      heading: "A Kitapçığı – öğrenci nüshası",
      paragraphs: exam.bookletA.map(questionText),
    },
    {
      heading: "B Kitapçığı – öğrenci nüshası",
      paragraphs: exam.bookletB.map(questionText),
    },
    {
      heading: "A Kitapçığı – cevap anahtarı ve puanlama",
      paragraphs: exam.bookletA.map(answerText),
    },
    {
      heading: "B Kitapçığı – cevap anahtarı ve puanlama",
      paragraphs: exam.bookletB.map(answerText),
    },
    {
      heading: "Belirtke tablosu",
      paragraphs: exam.blueprint.map((row) => [
        `${row.outcomeCode} · ${row.outcomeTitle}`,
        `${row.questionCount} soru · ${row.totalPoints} puan · ${row.cognitiveLevels.join(", ")}`,
      ].join("\n")),
    },
  ];

  if (exam.iepAdaptation) {
    sections.push({
      heading: "BEP uyarlama kaydı – öğretmen nüshası",
      fields: [
        { label: "Uyarlama profili", value: exam.iepAdaptation.label },
        { label: "BEP birimi / kurul kararı", value: exam.iepDecision ?? "—" },
        { label: "Öğrenme hedefi", value: "Korunmuştur; yalnızca erişim ve cevaplama biçimi uyarlanmıştır." },
      ],
      bullets: exam.iepAdaptation.adjustments,
    });
  }

  return {
    kind: "exam-package",
    title: `${metadata.examName} – Sınav Paketi`,
    fileName: `fopos-${exam.grade}-sinif-${metadata.examName.toLocaleLowerCase("tr-TR").replaceAll(" ", "-")}.docx`,
    approved: exam.validation.exportAllowed,
    approvalStatement: exam.validation.exportAllowed
      ? "Sorular, puanlar, cevap anahtarı, belirtke tablosu ve A–B eşdeğerliği öğretmen tarafından kontrol edilerek dışa aktarılmıştır."
      : "",
    sections,
  };
}
