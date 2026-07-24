import { DocumentFormatButtons } from "@/app/components/DocumentFormatButtons";
import type { GeneratedExam } from "@/modules/exam-generator/types";
import { buildExamPackageDocument } from "@/modules/document-engine/exam-package";

export function ExamPackageExport({ exam }: { exam: GeneratedExam }) {
  const spec = buildExamPackageDocument(exam);

  return (
    <section className="plan-section approval" aria-label="Sınav paketi dışa aktarma">
      <h3>Sınav paketi dışa aktarma</h3>
      <p>A–B öğrenci kitapçıkları, cevap anahtarları, puanlama ölçütleri ve belirtke tablosu tek pakette oluşturulur.</p>
      <DocumentFormatButtons
        disabled={!exam.validation.exportAllowed}
        docxLabel="DOCX sınav paketini indir"
        pdfLabel="PDF sınav paketini indir"
        spec={spec}
      />
    </section>
  );
}
