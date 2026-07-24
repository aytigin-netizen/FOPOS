export function formatCurriculumList(items: string[]) {
  return items.length ? items.join(", ") : "—";
}

export function cleanCurriculumText(text: string) {
  return text
    .replace(/\s*\(Ölçme ve\s*/g, " ")
    .replace(/\s*Değerlendirme\)\s*/g, " ")
    .replace(/([A-Za-zÇĞİÖŞÜçğıöşü])-\s+([A-Za-zÇĞİÖŞÜçğıöşü])/g, "$1$2")
    .replace(/\s+/g, " ")
    .replace(/\s+([.,;:])/g, "$1")
    .trim();
}
