import { philosophyCurricula } from "../curriculum";
import { createLessonDraft, getUnitWeekCount } from "../modules/lesson-studio/model";

const errors: string[] = [];
let draftCount = 0;

for (const curriculum of Object.values(philosophyCurricula)) {
  for (const unit of curriculum.units) {
    const weekCount = getUnitWeekCount(unit.code);
    const expectedWeeks = Math.ceil(unit.lessonHours / curriculum.weeklyLessonHours);

    if (weekCount !== expectedWeeks) {
      errors.push(`${unit.code}: hafta sayısı ${weekCount}; beklenen ${expectedWeeks}.`);
    }

    for (const outcome of unit.outcomes) {
      const draft = createLessonDraft({
        grade: curriculum.grade,
        unitCode: unit.code,
        outcomeCode: outcome.code,
        week: 1,
        classProfile: "balanced",
        method: "Sokratik sorgulama",
        evidence: "Çıkış bileti",
      });
      const duration = draft.phases.reduce((total, phase) => total + phase.minutes, 0);

      if (duration !== draft.totalMinutes) {
        errors.push(`${outcome.code}: aşama süresi ${duration}; beklenen ${draft.totalMinutes}.`);
      }
      draftCount += 1;
    }
  }
}

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Ders Tasarım Stüdyosu doğrulaması başarılı: ${draftCount} öğrenme çıktısı seçilebilir.`);
