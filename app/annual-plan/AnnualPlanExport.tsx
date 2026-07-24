"use client";

import { useState } from "react";
import { DocumentFormatButtons } from "@/app/components/DocumentFormatButtons";
import type { AnnualPlan } from "@/modules/annual-plan/types";
import { buildAnnualPlanDocument } from "@/modules/document-engine/annual-plan";

export function AnnualPlanExport({ plan }: { plan: AnnualPlan }) {
  const [calendarReviewed, setCalendarReviewed] = useState(false);
  const [curriculumReviewed, setCurriculumReviewed] = useState(false);
  const approved = calendarReviewed && curriculumReviewed;
  const spec = buildAnnualPlanDocument(plan, approved);

  return (
    <section className="plan-section approval" aria-label="Yıllık plan dışa aktarma">
      <h3>Yatay belge dışa aktarma</h3>
      <label className="approval-check">
        <input checked={calendarReviewed} onChange={(event) => setCalendarReviewed(event.target.checked)} type="checkbox" />
        <span>2026–2027 çalışma takvimini kontrol ettim.</span>
      </label>
      <label className="approval-check">
        <input checked={curriculumReviewed} onChange={(event) => setCurriculumReviewed(event.target.checked)} type="checkbox" />
        <span>36 haftalık müfredat dağılımını kontrol ettim.</span>
      </label>
      <DocumentFormatButtons disabled={!approved} docxLabel="Yatay DOCX indir" pdfLabel="Yatay PDF indir" spec={spec} />
    </section>
  );
}
