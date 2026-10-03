// Aynı metne bağlı ardışık sorularda metin yalnız bir kez basılır ("1–6. soruları aşağıdaki metne göre cevaplayınız").
// Her soruya aynı metni yeniden basmak kâğıdı şişirir ve soruların tekrar ettiği izlenimini verir.
export type PassageSlot = { show: boolean; label: string };

const normalize = (passage?: string) => (passage ?? "").replace(/\s+/g, " ").trim();

export function planSharedPassages(questions: ReadonlyArray<{ passage?: string }>): PassageSlot[] {
  const slots: PassageSlot[] = questions.map(() => ({ show: false, label: "" }));
  let groupStart = -1;
  const closeGroup = (end: number) => {
    if (groupStart >= 0 && end > groupStart) slots[groupStart].label = `${groupStart + 1}–${end + 1}. soruları aşağıdaki metne göre cevaplayınız.`;
  };
  questions.forEach((question, index) => {
    const current = normalize(question.passage);
    if (!current) { closeGroup(index - 1); groupStart = -1; return; }
    if (groupStart >= 0 && normalize(questions[groupStart].passage) === current) return;
    closeGroup(index - 1);
    groupStart = index;
    slots[index].show = true;
  });
  closeGroup(questions.length - 1);
  return slots;
}
