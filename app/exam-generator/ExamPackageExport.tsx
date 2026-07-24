"use client";

import { useState } from "react";
import type { GeneratedExam } from "@/modules/exam-generator/types";
import { buildExamPackageDocument } from "@/modules/document-engine/exam-package";

export function ExamPackageExport({ exam }: { exam: GeneratedExam }) {
  const [error, setError] = useState("");

  async function download() {
    try {
      setError("");
      const spec = buildExamPackageDocument(exam);
      const { renderDocxBlob } = await import("@/modules/document-engine/docx");
      const blob = await renderDocxBlob(spec);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = spec.fileName;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Sınav paketi oluşturulamadı.");
    }
  }

  return (
    <section className="plan-section approval" aria-label="Sınav paketi dışa aktarma">
      <h3>DOCX sınav paketi</h3>
      <p>A–B öğrenci kitapçıkları, cevap anahtarları, puanlama ölçütleri ve belirtke tablosu tek pakette oluşturulur.</p>
      <button className="primary-button" disabled={!exam.validation.exportAllowed} onClick={download} type="button">Sınav paketini indir</button>
      {error ? <p role="alert">{error}</p> : null}
    </section>
  );
}
