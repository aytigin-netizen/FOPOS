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
    status: "passed",
    evidence: "Chromium üzerinde ana rota, 10–11. sınıf planları, sınav onayı ve analiz gizliliğini kapsayan beş Playwright senaryosu GitHub Actions'ta geçti.",
    nextAction: null,
  },
  {
    id: "privacy",
    title: "Öğrenci verisi ve gizlilik",
    status: "passed",
    evidence: "Kimlikli veri yalnızca ekran belleğinde işleniyor; kimliksiz AI sınırı, açık silme kontrolü ve veri yaşam döngüsü Gizlilik Merkezi'nde belgeleniyor.",
    nextAction: null,
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
