"use client";

import { useState } from "react";
import type { AnnualPlan } from "@/modules/annual-plan/types";
import { buildAnnualPlanDocument } from "@/modules/document-engine/annual-plan";

export function AnnualPlanExport({ plan }: { plan: AnnualPlan }) {
  const [calendarReviewed, setCalendarReviewed] = useState(false);
  const [curriculumReviewed, setCurriculumReviewed] = useState(false);
  const [error, setError] = useState("");
  const approved = calendarReviewed && curriculumReviewed;

  async function download() {
    try {
      setError("");
      const spec = buildAnnualPlanDocument(plan, approved);
      const { renderDocxBlob } = await import("@/modules/document-engine/docx");
      const blob = await renderDocxBlob(spec);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = spec.fileName;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Belge oluşturulamadı.");
    }
  }

  return (
    <section className="plan-section approval" aria-label="Yıllık plan dışa aktarma">
      <h3>Yatay DOCX dışa aktarma</h3>
      <label className="approval-check">
        <input checked={calendarReviewed} onChange={(event) => setCalendarReviewed(event.target.checked)} type="checkbox" />
        <span>2026–2027 çalışma takvimini kontrol ettim.</span>
      </label>
      <label className="approval-check">
        <input checked={curriculumReviewed} onChange={(event) => setCurriculumReviewed(event.target.checked)} type="checkbox" />
        <span>36 haftalık müfredat dağılımını kontrol ettim.</span>
      </label>
      <p><button className="primary-button" disabled={!approved} onClick={download} type="button">Yatay DOCX indir</button></p>
      {error ? <p role="alert">{error}</p> : null}
    </section>
  );
}
