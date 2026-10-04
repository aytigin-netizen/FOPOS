import { getCurriculumContext } from "../../data/curriculum-runtime.ts";

// Eski üreticinin bilinen cevapları: yalnız cümlenin tamamı eşleşirse yer tutucudur.
const placeholderAnswers = new Set([
  "Beklenen cevabı buraya yazınız.",
  "Yanıt, soruda istenen okuma becerisini göstermeli.",
  ...["philosophy", "sociology"].flatMap(subject =>
    getCurriculumContext(subject).units.flatMap(unit => [
      `Yanıt ${unit.name} bağlamındaki kavramı doğru açıklamalı ve görüşünü gerekçelendirmelidir.`,
      `Yanıt, soruda istenen okuma becerisini göstermeli; ${unit.keywords.slice(0, 3).join(", ")} kavramlarından uygun olanları doğru kullanmalı ve çıkarımını metinden kanıtla desteklemelidir.`,
    ])),
]);

export function isPlaceholderExamAnswer(answer: string): boolean {
  return placeholderAnswers.has(answer.trim());
}
