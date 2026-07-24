import { createDailyPlan, getDailyPlanDefaults } from "../modules/daily-plan/model";
import { createAnnualPlan, getAnnualPlanDefaults } from "../modules/annual-plan/model";
import { buildAnnualPlanDocument } from "../modules/document-engine/annual-plan";
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

  for (const grade of [10, 11] as const) {
    const annualPlan = createAnnualPlan({ ...getAnnualPlanDefaults(), grade });
    const blockedAnnual = buildAnnualPlanDocument(annualPlan, false);
    if (validateDocument(blockedAnnual).valid) throw new Error(`${grade}. sınıf onaysız yıllık plan dışa aktarıldı.`);

    const approvedAnnual = buildAnnualPlanDocument(annualPlan, true);
    if (approvedAnnual.layout !== "landscape" || approvedAnnual.sections[1]?.paragraphs?.length !== 36) {
      throw new Error(`${grade}. sınıf yıllık plan belge yapısı eksik.`);
    }
    const annualBuffer = await renderDocxBuffer(approvedAnnual);
    if (annualBuffer.length < 10_000 || annualBuffer.subarray(0, 2).toString() !== "PK") {
      throw new Error(`${grade}. sınıf için geçerli yıllık plan DOCX paketi üretilemedi.`);
    }
  }

  console.log(`Document Engine doğrulaması başarılı: Günlük Plan ile 10. ve 11. sınıf Yıllık Plan DOCX paketleri üretildi.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
