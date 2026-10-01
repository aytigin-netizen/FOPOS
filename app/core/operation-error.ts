import { CurriculumFeatureUnavailableError } from "./curriculum-feature-unavailable.ts";

/**
 * Bir özelliğin henüz yayınlanmamış olması, öğretmenin karşılaştığı bir hata
 * değil; bilinçli bir ürün kararının sonucudur. Bu yüzden ham hata metni
 * gösterilmez: branş/öğretim yılı kodu yerine ne olup bittiği, içerik ne zaman
 * hazır olacağı ve şimdilik ne yapılabileceği söylenir.
 */
function curriculumUnavailableMessage(error: CurriculumFeatureUnavailableError): string {
  const branchLabel = branchDisplayName(error.subjectCode);
  const opening = `${branchLabel} dersi için ${error.feature} henüz yayınlanmadı, bu yüzden bu bölüm kullanılamıyor. `;

  if (error.subjectCode === "philosophy")
    return (
      opening +
      "Bu, henüz tamamlanmamış bir müfredat sürümüyle ilgili; " +
      "Felsefe müfredatı güncellendiğinde bölüm otomatik olarak açılacak."
    );

  return (
    opening +
    `Çalışma sırası felsefe dersinden başlıyor; ${branchLabel} müfredatı tamamlandığında bu bölüm açılacak. ` +
    "Şimdilik felsefe dersinden devam edebilirsin."
  );
}

function branchDisplayName(subjectCode: string): string {
  const known: Record<string, string> = { philosophy: "Felsefe", sociology: "Sosyoloji" };
  return known[subjectCode] ?? subjectCode;
}

export function operationErrorMessage(error: unknown, fallback: string) {
  if (error instanceof CurriculumFeatureUnavailableError)
    return curriculumUnavailableMessage(error);
  if (error instanceof Error && error.message.trim())
    return error.message.trim();
  return fallback;
}
