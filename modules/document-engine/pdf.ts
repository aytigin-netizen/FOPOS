import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, type PDFFont, rgb } from "pdf-lib";
import { assertDocumentExportable } from "@/modules/document-engine/model";
import type { DocumentSpec } from "@/modules/document-engine/types";

const A4 = { width: 595.28, height: 841.89 };
const margin = 48;

export async function renderPdfBytes(spec: DocumentSpec, fontBytes: Uint8Array | ArrayBuffer) {
  assertDocumentExportable(spec);
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  const font = await pdf.embedFont(fontBytes, { subset: true });
  const pageSize = spec.layout === "landscape"
    ? { width: A4.height, height: A4.width }
    : A4;
  let page = pdf.addPage([pageSize.width, pageSize.height]);
  let y = pageSize.height - margin;

  function ensureSpace(required: number) {
    if (y - required < margin) {
      page = pdf.addPage([pageSize.width, pageSize.height]);
      y = pageSize.height - margin;
    }
  }

  function write(text: string, size = 10, gap = 4, color = rgb(0.12, 0.14, 0.16)) {
    const lines = wrapText(text || "—", font, size, pageSize.width - margin * 2);
    ensureSpace(lines.length * (size + gap) + gap);
    for (const line of lines) {
      page.drawText(line, { x: margin, y, size, font, color });
      y -= size + gap;
    }
    y -= gap;
  }

  write(spec.title, 18, 6, rgb(0.08, 0.25, 0.32));
  for (const section of spec.sections) {
    ensureSpace(36);
    write(section.heading, 13, 5, rgb(0.08, 0.25, 0.32));
    for (const field of section.fields ?? []) write(`${field.label}: ${field.value || "—"}`);
    for (const paragraph of section.paragraphs ?? []) write(paragraph);
    for (const bullet of section.bullets ?? []) write(`• ${bullet}`);
    y -= 5;
  }
  write(`Kullanıcı dışa aktarma onayı: ${spec.approvalStatement}`, 9, 4, rgb(0.3, 0.32, 0.34));

  pdf.setTitle(spec.title);
  pdf.setAuthor("FOPOS");
  pdf.setSubject("Kullanıcı onayıyla oluşturulan FOPOS PDF belgesi");
  return pdf.save();
}

export async function renderPdfBlob(spec: DocumentSpec) {
  const response = await fetch("/fonts/DejaVuSans.ttf");
  if (!response.ok) throw new Error("Türkçe PDF yazı tipi yüklenemedi.");
  const bytes = await renderPdfBytes(spec, await response.arrayBuffer());
  const browserBytes = Uint8Array.from(bytes);
  return new Blob([browserBytes.buffer], { type: "application/pdf" });
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number) {
  const lines: string[] = [];
  for (const sourceLine of text.split("\n")) {
    const words = sourceLine.split(/\s+/).filter(Boolean);
    if (!words.length) {
      lines.push("");
      continue;
    }
    let line = "";
    for (const word of words) {
      const candidate = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(candidate, size) <= maxWidth || !line) {
        line = candidate;
      } else {
        lines.push(line);
        line = word;
      }
    }
    if (line) lines.push(line);
  }
  return lines;
}
