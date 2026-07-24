import { philosophyCurricula } from "../curriculum";
import { validateCurriculum } from "../curriculum/validation";

const results = Object.values(philosophyCurricula).map((curriculum) => ({
  grade: curriculum.grade,
  result: validateCurriculum(curriculum),
}));

const errors = results.flatMap(({ grade, result }) =>
  result.errors.map((error) => `${grade}. sınıf: ${error}`),
);

if (errors.length > 0) {
  console.error(errors.join("\n"));
  process.exit(1);
}

const summary = results
  .map(({ grade }) => {
    const curriculum = philosophyCurricula[grade];
    const outcomeCount = curriculum.units.reduce(
      (total, unit) => total + unit.outcomes.length,
      0,
    );

    return `${grade}. sınıf: ${curriculum.units.length} ünite, ${outcomeCount} öğrenme çıktısı`;
  })
  .join("\n");

console.log(`Müfredat doğrulaması başarılı.\n${summary}`);
