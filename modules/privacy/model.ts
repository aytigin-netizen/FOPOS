export const privacyPolicy = {
  version: "1.0",
  storage: "memory-only",
  retention: "until-reset-refresh-or-tab-close",
  externalTransfer: "aggregated-only",
  exportRule: "explicit-teacher-action",
} as const;

export const privacyDataMap = [
  {
    category: "Öğrenci kimliği",
    examples: "Ad-soyad ve okul numarası",
    location: "Yalnızca açık sınav analizi ekranının belleği",
    lifecycle: "Sil düğmesi, sayfa yenileme veya sekme kapanışı",
  },
  {
    category: "Soru puanları",
    examples: "Soru bazlı puan ve katılım durumu",
    location: "Yalnızca açık sınav analizi ekranının belleği",
    lifecycle: "Sil düğmesi, sayfa yenileme veya sekme kapanışı",
  },
  {
    category: "FOPOS AI kanıtı",
    examples: "Toplulaştırılmış oranlar ve öğrenme çıktıları",
    location: "Kimliksiz karar desteği girdisi",
    lifecycle: "Ekran oturumu sona erdiğinde",
  },
  {
    category: "Belge çıktıları",
    examples: "Öğretmenin onayladığı DOCX/PDF",
    location: "Öğretmenin seçtiği cihaz konumu",
    lifecycle: "Cihaz ve kurum saklama politikasına göre",
  },
] as const;

export function clearFoposBrowserStorage(storage: Storage): number {
  const keys = Array.from({ length: storage.length }, (_, index) => storage.key(index))
    .filter((key): key is string => Boolean(key?.startsWith("fopos.")));
  keys.forEach((key) => storage.removeItem(key));
  return keys.length;
}

