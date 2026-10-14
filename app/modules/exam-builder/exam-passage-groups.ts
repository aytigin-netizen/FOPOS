// Aynı metne bağlı ardışık sorularda metin yalnız bir kez basılır ("1–6. soruları aşağıdaki metne göre cevaplayınız").
// Her soruya aynı metni yeniden basmak kâğıdı şişirir ve soruların tekrar ettiği izlenimini verir.
export type PassageSlot = { show: boolean; label: string };

type PassageQuestion = { passage?: string; unitCode?: string; fontSize?: number };

const normalize = (passage?: string) => (passage ?? "").replace(/\s+/g, " ").trim();

const passageKey = (question: PassageQuestion) => JSON.stringify([question.unitCode ?? '', question.fontSize ?? 22, normalize(question.passage)]);

export function planSharedPassages(questions: ReadonlyArray<PassageQuestion>): PassageSlot[] {
  const slots: PassageSlot[] = questions.map(() => ({ show: false, label: "" }));
  let groupStart = -1;
  const closeGroup = (end: number) => {
    if (groupStart >= 0 && end > groupStart) slots[groupStart].label = `${groupStart + 1}–${end + 1}. soruları aşağıdaki metne göre cevaplayınız.`;
  };
  questions.forEach((question, index) => {
    const current = normalize(question.passage);
    if (!current) { closeGroup(index - 1); groupStart = -1; return; }
    if (groupStart >= 0 && passageKey(questions[groupStart]) === passageKey(question)) return;
    closeGroup(index - 1);
    groupStart = index;
    slots[index].show = true;
  });
  closeGroup(questions.length - 1);
  return slots;
}


// Gruplar ilk görünme sırasını, grup içindeki sorular kendi sırasını korur.
// Metinsiz sorular tekil kalır; farklı ünite ve sunum boyutları birleştirilmez.
// Soru nesneleri değişmez: kimlik, puan ve A/B eşleştirmesi korunur.
export function groupQuestionsByPassage<T extends { passage?: string; unitCode?: string; fontSize?: number }>(questions: readonly T[]): T[] {
  const groups: T[][] = [];
  const byPassage = new Map<string, T[]>();
  for (const question of questions) {
    const passage = normalize(question.passage);
    if (!passage) { groups.push([question]); continue; }
    const key = passageKey(question);
    let group = byPassage.get(key);
    if (!group) { group = []; byPassage.set(key, group); groups.push(group); }
    group.push(question);
  }
  return groups.flat();
}
