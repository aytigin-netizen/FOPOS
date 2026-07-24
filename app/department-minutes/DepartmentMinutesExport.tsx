"use client";

import { useState } from "react";
import { DocumentFormatButtons } from "@/app/components/DocumentFormatButtons";
import type { DepartmentMinutes } from "@/modules/department-minutes/types";
import { buildDepartmentMinutesDocument } from "@/modules/document-engine/department-minutes";

export function DepartmentMinutesExport({ minutes }: { minutes: DepartmentMinutes }) {
  const [reviewed, setReviewed] = useState(false);
  const exportReady = minutes.validation.exportAllowed && reviewed;
  const spec = buildDepartmentMinutesDocument(minutes, reviewed);

  return (
    <section className="minutes-section approval" aria-label="Zümre tutanağı dışa aktarma">
      <h3>Belge dışa aktarma</h3>
      <label className="approval-check">
        <input
          checked={reviewed}
          disabled={!minutes.validation.exportAllowed}
          onChange={(event) => setReviewed(event.target.checked)}
          type="checkbox"
        />
        <span>Toplantı bilgilerini, tüm görüşmeleri, kararları ve üye listesini kontrol ettim.</span>
      </label>
      {!minutes.validation.exportAllowed
        ? <p>Eksik toplantı bilgileri veya gündem içerikleri tamamlanmalıdır.</p>
        : null}
      <DocumentFormatButtons disabled={!exportReady} spec={spec} />
    </section>
  );
}
