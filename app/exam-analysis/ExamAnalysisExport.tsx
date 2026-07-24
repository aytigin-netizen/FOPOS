"use client";

import { useState } from "react";
import type { ExamAnalysis } from "@/modules/exam-analysis/types";
import type { GeneratedExam } from "@/modules/exam-generator/types";
import { buildExamAnalysisDocument } from "@/modules/document-engine/exam-analysis";

export function ExamAnalysisExport({ exam, analysis }: { exam: GeneratedExam; analysis: ExamAnalysis }) {
  const [error, setError] = useState("");

  async function download() {
    try {
      setError("");
      const spec = buildExamAnalysisDocument(exam, analysis);
      const { renderDocxBlob } = await import("@/modules/document-engine/docx");
      const blob = await renderDocxBlob(spec);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = spec.fileName;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Analiz raporu oluşturulamadı.");
    }
  }

  return (
    <section className="analysis-card approval" aria-label="Sınav analizi dışa aktarma">
      <h3>DOCX analiz raporu</h3>
      <p>Rapor yalnızca toplulaştırılmış sonuçları içerir; öğrenci adı ve okul numarası dışa aktarılmaz.</p>
      <button className="primary-button" disabled={!analysis.validation.exportAllowed} onClick={download} type="button">Analiz raporunu indir</button>
      {error ? <p role="alert">{error}</p> : null}
    </section>
  );
}
