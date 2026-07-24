"use client";

import { useState } from "react";
import type { DailyPlan } from "@/modules/daily-plan/types";
import { buildDailyPlanDocument } from "@/modules/document-engine/daily-plan";

export function DocumentExport({ plan }: { plan: DailyPlan }) {
  const [approved, setApproved] = useState(false);
  const [error, setError] = useState("");

  async function download(format: "docx" | "pdf") {
    try {
      setError("");
      const spec = buildDailyPlanDocument(plan, approved);
      const blob = format === "docx"
        ? await import("@/modules/document-engine/docx").then(({ renderDocxBlob }) => renderDocxBlob(spec))
        : await import("@/modules/document-engine/pdf").then(({ renderPdfBlob }) => renderPdfBlob(spec));
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = format === "docx" ? spec.fileName : spec.fileName.replace(/\.docx$/, ".pdf");
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Belge oluşturulamadı.");
    }
  }

  return (
    <section className="plan-section approval" aria-label="Belge dışa aktarma">
      <h3>Belge dışa aktarma</h3>
      <label>
        <input checked={approved} onChange={(event) => setApproved(event.target.checked)} type="checkbox" />
        {" "}Belge içeriğini kontrol ettim; dışa aktarmayı onaylıyorum.
      </label>
      <p>
        <button className="primary-button" disabled={!approved} onClick={() => download("docx")} type="button">DOCX indir</button>
        {" "}
        <button className="secondary-button" disabled={!approved} onClick={() => download("pdf")} type="button">PDF indir</button>
      </p>
      {error ? <p role="alert">{error}</p> : null}
    </section>
  );
}
