import {
  validatePortableAuditVerificationReceipt,
  type PortableAuditVerificationReceiptValidation,
} from "./portable-audit-verification-receipt.ts";

export const INDEPENDENT_RECEIPT_MAX_FILE_SIZE_BYTES = 256 * 1024;

export type IndependentReceiptDocumentValidation =
  PortableAuditVerificationReceiptValidation;

const rejected = (errors: readonly string[]): IndependentReceiptDocumentValidation =>
  Object.freeze({
    status: "rejected" as const,
    schemaVersion: null,
    computedDigest: null,
    errors: Object.freeze([...errors]),
  });

export async function validateIndependentReceiptJsonDocument(
  text: string,
): Promise<IndependentReceiptDocumentValidation> {
  if (
    new TextEncoder().encode(text).byteLength >
    INDEPENDENT_RECEIPT_MAX_FILE_SIZE_BYTES
  ) {
    return rejected([
      "Doğrulama makbuzu dosyası 256 KiB sınırını aşıyor.",
    ]);
  }

  let payload: unknown;
  try {
    payload = JSON.parse(text);
  } catch {
    return rejected(["Dosya geçerli JSON içermiyor."]);
  }

  return validatePortableAuditVerificationReceipt(payload);
}
