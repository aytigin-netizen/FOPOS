import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  TextRun,
} from "docx";
import { assertDocumentExportable } from "@/modules/document-engine/model";
import type { DocumentSpec } from "@/modules/document-engine/types";

function createDocument(spec: DocumentSpec) {
  assertDocumentExportable(spec);

  const children = [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      heading: HeadingLevel.TITLE,
      children: [new TextRun({ text: spec.title, bold: true })],
    }),
    ...spec.sections.flatMap((section) => [
      new Paragraph({ text: section.heading, heading: HeadingLevel.HEADING_1 }),
      ...(section.fields ?? []).map((field) => new Paragraph({
        children: [
          new TextRun({ text: `${field.label}: `, bold: true }),
          new TextRun(field.value || "—"),
        ],
      })),
      ...(section.paragraphs ?? []).map((text) => new Paragraph(text)),
      ...(section.bullets ?? []).map((text) => new Paragraph({ text, bullet: { level: 0 } })),
    ]),
    new Paragraph({
      spacing: { before: 480 },
      children: [
        new TextRun({ text: "Kullanıcı dışa aktarma onayı: ", bold: true }),
        new TextRun(spec.approvalStatement),
      ],
    }),
  ];

  return new Document({
    creator: "FOPOS",
    title: spec.title,
    description: "Kullanıcı onayıyla oluşturulan FOPOS belgesi",
    sections: [{ properties: {}, children }],
  });
}

export function renderDocxBuffer(spec: DocumentSpec) {
  return Packer.toBuffer(createDocument(spec));
}

export function renderDocxBlob(spec: DocumentSpec) {
  return Packer.toBlob(createDocument(spec));
}
