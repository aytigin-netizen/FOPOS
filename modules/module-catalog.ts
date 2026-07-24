export type ModuleStatus = "ready" | "planned";

export interface FoposModule {
  id: string;
  order: number;
  name: string;
  description: string;
  status: ModuleStatus;
}

export const moduleCatalog: FoposModule[] = [
  {
    id: "lesson-studio",
    order: 1,
    name: "Ders Tasarım Stüdyosu",
    description: "Öğrenme çıktılarından hareketle ders akışı ve öğrenme kanıtları tasarlar.",
    status: "ready",
  },
  {
    id: "daily-plan",
    order: 2,
    name: "Günlük Plan",
    description: "Seçilen hafta ve öğrenme çıktısı için uygulamaya hazır plan üretir.",
    status: "ready",
  },
  {
    id: "annual-plan",
    order: 3,
    name: "Yıllık Plan",
    description: "Üniteleri akademik takvime ve haftalık ders saatine dağıtır.",
    status: "planned",
  },
  {
    id: "department-minutes",
    order: 4,
    name: "Zümre Tutanağı",
    description: "Dinamik gündem, görüşme, karar ve imza süreçlerini yönetir.",
    status: "planned",
  },
  {
    id: "exam",
    order: 5,
    name: "Sınav Oluşturucu",
    description: "Standart ve BEP uyarlamalı ölçme paketleri hazırlar.",
    status: "planned",
  },
  {
    id: "exam-analysis",
    order: 6,
    name: "Sınav Analizi",
    description: "Başarı verilerini öğrenme çıktıları düzeyinde yorumlar.",
    status: "planned",
  },
  {
    id: "fopos-ai",
    order: 7,
    name: "FOPOS AI",
    description: "Öğretmene gerekçeli pedagojik karar desteği sunar.",
    status: "planned",
  },
];
