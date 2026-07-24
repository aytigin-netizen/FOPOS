export const examNames = [
  "1. Dönem 1. Yazılı Sınavı",
  "1. Dönem 2. Yazılı Sınavı",
  "2. Dönem 1. Yazılı Sınavı",
  "2. Dönem 2. Yazılı Sınavı",
  "Sorumluluk Sınavı",
] as const;

export type ExamName = (typeof examNames)[number];
