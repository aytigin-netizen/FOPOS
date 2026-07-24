const TURKISH_ASCII: Record<string, string> = {
  ç: "c",
  Ç: "C",
  ğ: "g",
  Ğ: "G",
  ı: "i",
  İ: "I",
  ö: "o",
  Ö: "O",
  ş: "s",
  Ş: "S",
  ü: "u",
  Ü: "U",
};

export function safeFileSegment(value: string | number) {
  const ascii = String(value)
    .replace(/[çÇğĞıİöÖşŞüÜ]/g, (character) => TURKISH_ASCII[character])
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "");

  return (
    ascii
      .replace(/[^A-Za-z0-9_-]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 80) || "Belge"
  );
}

export function safeFileName(
  segments: Array<string | number>,
  extension: string,
) {
  const safeExtension = extension.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (!safeExtension) throw new Error("Geçerli bir dosya uzantısı gereklidir.");
  return `${segments.map(safeFileSegment).join("_")}.${safeExtension}`;
}

export function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}
