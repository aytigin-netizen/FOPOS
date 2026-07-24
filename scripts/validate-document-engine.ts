import { createDailyPlan, getDailyPlanDefaults } from "../modules/daily-plan/model";
import { buildDailyPlanDocument } from "../modules/document-engine/daily-plan";
import { renderDocxBuffer } from "../modules/document-engine/docx";
import { validateDocument } from "../modules/document-engine/model";

async function main() {
  const defaults = getDailyPlanDefaults();
  const plan = createDailyPlan({
    ...defaults,
    metadata: {
      ...defaults.metadata,
      schoolName: "Örnek Anadolu Lisesi",
      teacherName: "Örnek Öğretmen",
      date: "2026-09-14",
    },
  });

  const blocked = buildDailyPlanDocument(plan, false);
  if (validateDocument(blocked).valid) throw new Error("Onaysız belge dışa aktarmaya açıldı.");

  const approved = buildDailyPlanDocument(plan, true);
  const validation = validateDocument(approved);
  if (!validation.valid) throw new Error(validation.errors.join("\n"));
  if (approved.approvalStatement.toLocaleLowerCase("tr-TR").includes("uygundur")) {
    throw new Error("Belge otomatik kurumsal onay ifadesi içeriyor.");
  }

  const buffer = await renderDocxBuffer(approved);
  if (buffer.length < 1_000 || buffer.subarray(0, 2).toString() !== "PK") {
    throw new Error("Geçerli bir DOCX paketi üretilemedi.");
  }

  console.log(`Document Engine doğrulaması başarılı: ${buffer.length} baytlık DOCX üretildi.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
