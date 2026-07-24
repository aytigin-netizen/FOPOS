import { philosophyCurricula } from "../curriculum";
import { createExam, getExamDefaults, iepProfiles } from "../modules/exam-generator/model";

const errors: string[] = [];
let generated = 0;

for (const curriculum of Object.values(philosophyCurricula)) {
  for (const unit of curriculum.units) {
    for (const count of [5, 8, 10] as const) {
      const defaults = getExamDefaults();
      const exam = createExam({
        ...defaults,
        grade: curriculum.grade,
        unitCode: unit.code,
        outcomeCodes: unit.outcomes.map((outcome) => outcome.code),
        questionCount: count,
        teacherApproved: true,
      });
      if (exam.totalPoints !== 100 || !exam.validation.scoreBalance) errors.push(`${unit.code}: puan toplamı hatalı.`);
      if (!exam.validation.bookletEquivalence) errors.push(`${unit.code}: A-B kitapçıkları eşdeğer değil.`);
      if (!exam.validation.exportAllowed) errors.push(`${unit.code}: geçerli sınav dışa aktarılamıyor.`);
      if (exam.blueprint.reduce((sum, row) => sum + row.questionCount, 0) !== count) errors.push(`${unit.code}: belirtke tablosu hatalı.`);
      generated += 1;
    }
  }
}

const draft = createExam(getExamDefaults());
if (draft.validation.exportAllowed) errors.push("Öğretmen onaysız taslak dışa aktarılabiliyor.");
if (Object.keys(iepProfiles).length !== 5) errors.push("BEP profilleri eksik.");

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Sınav oluşturucu doğrulaması başarılı: ${generated} sınav senaryosu üretildi.`);
