import { DocumentFormatButtons } from "@/app/components/DocumentFormatButtons";
import type { ExamAnalysis } from "@/modules/exam-analysis/types";
import type { GeneratedExam } from "@/modules/exam-generator/types";
import { buildExamAnalysisDocument } from "@/modules/document-engine/exam-analysis";

export function ExamAnalysisExport({ exam, analysis }: { exam: GeneratedExam; analysis: ExamAnalysis }) {
  const spec = buildExamAnalysisDocument(exam, analysis);

  return (
    <section className="analysis-card approval" aria-label="Sınav analizi dışa aktarma">
      <h3>Analiz raporu dışa aktarma</h3>
      <p>Rapor yalnızca toplulaştırılmış sonuçları içerir; öğrenci adı ve okul numarası dışa aktarılmaz.</p>
      <DocumentFormatButtons
        disabled={!analysis.validation.exportAllowed}
        docxLabel="DOCX analiz raporunu indir"
        pdfLabel="PDF analiz raporunu indir"
        spec={spec}
      />
    </section>
  );
}
