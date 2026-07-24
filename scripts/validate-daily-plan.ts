import { philosophyCurricula } from "../curriculum";
import { createDailyPlan, defaultDailyPlanMetadata } from "../modules/daily-plan/model";

const errors: string[] = [];
let planCount = 0;

for (const curriculum of Object.values(philosophyCurricula)) {
  for (const unit of curriculum.units) {
    for (const outcome of unit.outcomes) {
      const plan = createDailyPlan({
        metadata: defaultDailyPlanMetadata,
        lesson: {
          grade: curriculum.grade,
          unitCode: unit.code,
          outcomeCode: outcome.code,
          week: 1,
          classProfile: "balanced",
          method: "Sokratik sorgulama",
          evidence: "Çıkış bileti",
        },
      });
      const duration = plan.lesson.phases.reduce((total, phase) => total + phase.minutes, 0);
      if (duration !== 80) errors.push(`${outcome.code}: plan ${duration} dakika.`);
      if (plan.approvalChecks.length < 4) errors.push(`${outcome.code}: kalite kontrolü eksik.`);
      planCount += 1;
    }
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Günlük plan doğrulaması başarılı: ${planCount} öğrenme çıktısı planlanabilir.`);
