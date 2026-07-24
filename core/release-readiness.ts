import { moduleCatalog } from "@/modules/module-catalog";

export type ReleaseGateStatus = "passed" | "in-progress" | "blocked";

export interface ReleaseGate {
  id: string;
  title: string;
  status: ReleaseGateStatus;
  evidence: string;
  nextAction: string | null;
}

export const requiredModuleIds = [
  "lesson-studio",
  "daily-plan",
  "annual-plan",
  "department-minutes",
  "exam",
  "exam-analysis",
  "fopos-ai",
] as const;

export const releaseGates: readonly ReleaseGate[] = [
  {
    id: "modules",
    title: "Ana modüller",
    status: requiredModuleIds.every((id) => moduleCatalog.some((item) => item.id === id && item.status === "ready")) ? "passed" : "blocked",
    evidence: "Yedi ana modül bağımsız rota ve doğrulama sözleşmesiyle hazır.",
    nextAction: null,
  },
  {
    id: "quality",
    title: "Kod kalite kapıları",
    status: "passed",
    evidence: "TypeScript, ESLint, modül doğrulamaları ve Next.js üretim derlemesi CI içinde çalışıyor.",
    nextAction: null,
  },
  {
    id: "documents",
    title: "Belge dışa aktarma",
    status: "passed",
    evidence: "Ortak DOCX/PDF motoru günlük ve yıllık plan, zümre tutanağı, sınav paketi ve toplulaştırılmış sınav analizine bağlı.",
    nextAction: null,
  },
  {
    id: "integration",
    title: "Bütünleşik kullanıcı testi",
    status: "in-progress",
    evidence: "Modül testleri geçiyor; gerçek tarayıcıda uçtan uca öğretmen senaryoları henüz kaydedilmedi.",
    nextAction: "10. ve 11. sınıf için en az ikişer altın senaryoyu tarayıcıda doğrula.",
  },
  {
    id: "privacy",
    title: "Öğrenci verisi ve gizlilik",
    status: "in-progress",
    evidence: "AI yalnızca toplulaştırılmış veri alıyor; kalıcı veri ve saklama politikası henüz uygulanmadı.",
    nextAction: "Oturum yaşam döngüsü, veri silme ve güvenli saklama politikasını uygula.",
  },
  {
    id: "hosting",
    title: "Canlı yayın yapılandırması",
    status: "blocked",
    evidence: "Repository henüz bir hosting projesine bağlanmadı.",
    nextAction: "Hosting projesi oluştur, sürüm kaydet ve kullanıcı onayıyla üretime dağıt.",
  },
];

export const releaseSummary = {
  passed: releaseGates.filter((gate) => gate.status === "passed").length,
  total: releaseGates.length,
  publishable: releaseGates.every((gate) => gate.status === "passed"),
};
