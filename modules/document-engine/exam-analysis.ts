import type { ExamAnalysis } from "@/modules/exam-analysis/types";
import type { GeneratedExam } from "@/modules/exam-generator/types";
import type { DocumentSpec } from "@/modules/document-engine/types";

const priorityLabels = {
  critical: "Kritik",
  monitor: "İzlenmeli",
  sufficient: "Yeterli",
} as const;

export function buildExamAnalysisDocument(
  exam: GeneratedExam,
  analysis: ExamAnalysis,
): DocumentSpec {
  return {
    kind: "exam-analysis",
    title: `${exam.metadata.examName} – Sınav Analizi Raporu`,
    fileName: `fopos-${exam.grade}-sinif-sinav-analizi.docx`,
    approved: analysis.validation.exportAllowed,
    approvalStatement: analysis.validation.exportAllowed
      ? "Katılım durumları, soru puanları ve güvenli paylaşım koşulları öğretmen tarafından kontrol edilerek dışa aktarılmıştır."
      : "",
    sections: [
      {
        heading: "Sınav ve sınıf özeti",
        fields: [
          { label: "Sınav", value: exam.metadata.examName },
          { label: "Sınıf / şube", value: `${exam.grade}. sınıf / ${exam.metadata.classBranch || "—"}` },
          { label: "Ünite", value: exam.unitTitle },
          { label: "Sınıf mevcudu", value: String(analysis.classSize) },
          { label: "Katılımcı", value: String(analysis.participantCount) },
          { label: "Katılmadı", value: String(analysis.absentCount) },
          { label: "Sınıf ortalaması", value: analysis.classAverage?.toString() ?? "—" },
          { label: "Başarı oranı", value: analysis.passRate === null ? "—" : `%${analysis.passRate}` },
        ],
      },
      {
        heading: "Öğrenme çıktısı analizi ve müdahale öncelikleri",
        paragraphs: analysis.outcomeAnalysis.map((outcome) => [
          `${outcome.outcomeCode} · %${outcome.achievementRate} · ${priorityLabels[outcome.priority]}`,
          `Kanıt: ${outcome.evidence}`,
          `Önerilen müdahale: ${outcome.intervention}`,
        ].join("\n")),
      },
      {
        heading: "Soru analizi",
        paragraphs: analysis.questionAnalysis.map((item) => [
          `S${item.question.order} · ${item.question.outcomeCode} · ${item.question.points} puan`,
          `${item.participantCount} katılımcı · Ortalama ${item.averageScore} · %${item.achievementRate} başarı`,
        ].join("\n")),
      },
      {
        heading: "Genel değerlendirme",
        fields: [
          {
            label: "En güçlü öğrenme çıktısı",
            value: analysis.strongestOutcome
              ? `${analysis.strongestOutcome.outcomeCode} · %${analysis.strongestOutcome.achievementRate}`
              : "—",
          },
          {
            label: "Öncelikli öğrenme açığı",
            value: analysis.weakestOutcome
              ? `${analysis.weakestOutcome.outcomeCode} · %${analysis.weakestOutcome.achievementRate}`
              : "—",
          },
          {
            label: "Gizlilik",
            value: "Rapor yalnızca toplulaştırılmış sınıf verisi içerir; öğrenci adı ve okul numarası dışa aktarılmaz.",
          },
        ],
      },
    ],
  };
}
