"use client";

import { useState } from "react";
import type { DepartmentMinutes } from "@/modules/department-minutes/types";
import { buildDepartmentMinutesDocument } from "@/modules/document-engine/department-minutes";

export function DepartmentMinutesExport({ minutes }: { minutes: DepartmentMinutes }) {
  const [reviewed, setReviewed] = useState(false);
  const [error, setError] = useState("");
  const exportReady = minutes.validation.exportAllowed && reviewed;

  async function download() {
    try {
      setError("");
      const spec = buildDepartmentMinutesDocument(minutes, reviewed);
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
    <section className="minutes-section approval" aria-label="Zümre tutanağı dışa aktarma">
      <h3>DOCX dışa aktarma</h3>
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
      <p><button className="primary-button" disabled={!exportReady} onClick={download} type="button">DOCX indir</button></p>
      {error ? <p role="alert">{error}</p> : null}
    </section>
  );
}
