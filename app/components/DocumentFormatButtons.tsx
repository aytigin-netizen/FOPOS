"use client";

import { useState } from "react";
import type { DocumentSpec } from "@/modules/document-engine/types";

export function DocumentFormatButtons({
  spec,
  disabled = false,
  docxLabel = "DOCX indir",
  pdfLabel = "PDF indir",
}: {
  spec: DocumentSpec;
  disabled?: boolean;
  docxLabel?: string;
  pdfLabel?: string;
}) {
  const [activeFormat, setActiveFormat] = useState<"docx" | "pdf" | null>(null);
  const [error, setError] = useState("");

  async function download(format: "docx" | "pdf") {
    try {
      setActiveFormat(format);
      setError("");
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
    } finally {
      setActiveFormat(null);
    }
  }

  const unavailable = disabled || activeFormat !== null;

  return (
    <>
      <p>
        <button className="primary-button" disabled={unavailable} onClick={() => download("docx")} type="button">
          {activeFormat === "docx" ? "DOCX hazırlanıyor…" : docxLabel}
        </button>
        {" "}
        <button className="secondary-button" disabled={unavailable} onClick={() => download("pdf")} type="button">
          {activeFormat === "pdf" ? "PDF hazırlanıyor…" : pdfLabel}
        </button>
      </p>
      {error ? <p role="alert">{error}</p> : null}
    </>
  );
}
