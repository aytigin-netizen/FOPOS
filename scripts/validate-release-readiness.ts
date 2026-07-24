import { existsSync } from "node:fs";
import { releaseGates, requiredModuleIds } from "../core/release-readiness";
import { moduleCatalog } from "../modules/module-catalog";

const errors: string[] = [];
const routes: Record<(typeof requiredModuleIds)[number], string> = {
  "lesson-studio": "app/studio/page.tsx",
  "daily-plan": "app/daily-plan/page.tsx",
  "annual-plan": "app/annual-plan/page.tsx",
  "department-minutes": "app/department-minutes/page.tsx",
  exam: "app/exam-generator/page.tsx",
  "exam-analysis": "app/exam-analysis/page.tsx",
  "fopos-ai": "app/fopos-ai/page.tsx",
};
for (const id of requiredModuleIds) {
  if (!moduleCatalog.some((item) => item.id === id && item.status === "ready")) errors.push(`${id}: katalogda hazır değil.`);
  if (!existsSync(routes[id])) errors.push(`${id}: rota bulunamadı.`);
}
if (releaseGates.length !== 6) errors.push("Yayın kapıları eksik.");
if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
console.log("Yayın hazırlık doğrulaması başarılı: 7/7 modül ve 6 yayın kapısı izleniyor.");
