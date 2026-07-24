import type { DocumentSpec, DocumentValidation } from "@/modules/document-engine/types";

const forbiddenApprovalStatements = ["uygundur", "onaylanmıştır", "tasdik edilmiştir"];

export function validateDocument(spec: DocumentSpec): DocumentValidation {
  const errors: string[] = [];

  if (!spec.title.trim()) errors.push("Belge başlığı boş bırakılamaz.");
  if (!spec.fileName.endsWith(".docx")) errors.push("DOCX dosya adı .docx uzantılı olmalıdır.");
  if (!spec.sections.length) errors.push("Belgede en az bir bölüm bulunmalıdır.");
  if (!spec.approved) errors.push("Dışa aktarma için kullanıcı onayı gerekir.");
  if (forbiddenApprovalStatements.some((statement) => spec.approvalStatement.toLocaleLowerCase("tr-TR").includes(statement))) {
    errors.push("Sistem kurumsal onay beyanını otomatik üretemez.");
  }

  return { valid: errors.length === 0, errors };
}

export function assertDocumentExportable(spec: DocumentSpec) {
  const validation = validateDocument(spec);
  if (!validation.valid) throw new Error(validation.errors.join(" "));
}
