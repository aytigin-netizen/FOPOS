/**
 * 2026-2027 resmî konu-soru dağılım senaryoları.
 *
 * Kaynaklar:
 * - SENARYOLAR.pdf: Felsefe 10 ve 11. sınıf, 1. dönem ortak yazılılar.
 * - SEÇMELİ FELSEFE GRUBU SENARYO.xlsx: 11. sınıf Psikoloji, Sosyoloji ve Mantık
 *   sayfaları "maarif" başlıklı sekmeler; 1. dönem 1. ve 2. ortak yazılılar.
 *
 * Boş hücreler 0 olarak saklanır. Kaynaktaki toplam satırı ayrıca tutulur;
 * dağılım toplamıyla uyuşmazsa senaryo üretime kapatılır, kaynak sessizce düzeltilmez.
 */
export type ExamScenarioSubject = 'philosophy' | 'psychology' | 'sociology' | 'logic';
export type ExamScenarioExam = 'term1_exam1' | 'term1_exam2';

export type ExamScenarioOutcome = {
  outcomeCode: string;
  questionCount: number;
};

export type ExamScenario = {
  id: string;
  subject: ExamScenarioSubject;
  grade: 10 | 11;
  academicYear: '2026-2027';
  curriculum: 'tymm-2026';
  exam: ExamScenarioExam;
  scenarioNumber: number;
  source: string;
  sourceSheet?: string;
  outcomes: readonly ExamScenarioOutcome[];
  declaredTotal: number;
};

const p = (
  id: string,
  grade: 10 | 11,
  exam: ExamScenarioExam,
  scenarioNumber: number,
  declaredTotal: number,
  outcomes: readonly ExamScenarioOutcome[],
): ExamScenario => ({
  id, subject: 'philosophy', grade, academicYear: '2026-2027',
  curriculum: 'tymm-2026', exam, scenarioNumber,
  source: 'SENARYOLAR.pdf', outcomes, declaredTotal,
});

const e = (
  id: string,
  subject: Exclude<ExamScenarioSubject, 'philosophy'>,
  exam: ExamScenarioExam,
  scenarioNumber: number,
  declaredTotal: number,
  outcomes: readonly ExamScenarioOutcome[],
  sourceSheet: string,
): ExamScenario => ({
  id, subject, grade: 11, academicYear: '2026-2027',
  curriculum: 'tymm-2026', exam, scenarioNumber,
  source: 'SEÇMELİ FELSEFE GRUBU SENARYO.xlsx',
  sourceSheet, outcomes, declaredTotal,
});

const o = (outcomeCode: string, counts: readonly number[]): ExamScenarioOutcome[] =>
  counts.map(questionCount => ({ outcomeCode, questionCount }));

export const examScenarios2026: readonly ExamScenario[] = [
  // 10. sınıf Felsefe — 1. dönem 1. ortak yazılı (4 senaryo)
  ...[
    [6, [2, 2, 2, 0, 0]],
    [5, [3, 1, 1, 0, 0]],
    [6, [3, 1, 2, 0, 0]],
    [7, [3, 2, 2, 0, 0]],
  ].map(([total, counts], index) => p(
    `philosophy-10-term1-exam1-scenario-${index + 1}`, 10, 'term1_exam1', index + 1,
    total as number,
    ['FEL.10.1.1', 'FEL.10.2.1', 'FEL.10.2.2', 'FEL.10.3.1', 'FEL.10.4.1']
      .flatMap((code, i) => (counts as number[])[i] ? [{ outcomeCode: code, questionCount: (counts as number[])[i] }] : []),
  )),
  // 10. sınıf Felsefe — 1. dönem 2. ortak yazılı (5 senaryo)
  ...[
    [7, [1, 1, 1, 3, 1]],
    [7, [1, 1, 2, 2, 1]],
    [6, [1, 1, 2, 2, 1]],
    [7, [1, 2, 2, 2, 2]],
    [8, [1, 2, 2, 3, 2]],
  ].map(([total, counts], index) => p(
    `philosophy-10-term1-exam2-scenario-${index + 1}`, 10, 'term1_exam2', index + 1,
    total as number,
    ['FEL.10.1.1', 'FEL.10.2.1', 'FEL.10.2.2', 'FEL.10.3.1', 'FEL.10.4.1']
      .flatMap((code, i) => (counts as number[])[i] ? [{ outcomeCode: code, questionCount: (counts as number[])[i] }] : []),
  )),
  // 11. sınıf Felsefe — 1. dönem 1. ortak yazılı (5 senaryo)
  ...[
    [6, [2, 2, 2]],
    [6, [2, 3, 1]],
    [6, [3, 3, 0]],
    [6, [3, 2, 1]],
    [8, [3, 3, 2]],
  ].map(([total, counts], index) => p(
    `philosophy-11-term1-exam1-scenario-${index + 1}`, 11, 'term1_exam1', index + 1,
    total as number,
    ['FEL.11.1.1', 'FEL.11.1.2', 'FEL.11.2.1']
      .flatMap((code, i) => (counts as number[])[i] ? [{ outcomeCode: code, questionCount: (counts as number[])[i] }] : []),
  )),
  // 11. sınıf Felsefe — 1. dönem 2. ortak yazılı (6 senaryo).
  // Kaynak PDF'nin toplam satırı ile öğrenme çıktısı satırları senaryo 2 ve 5'te uyuşmuyor.
  ...[
    [6, [0, 1, 1, 2, 1, 1]],
    [5, [1, 0, 1, 1, 2, 1]],
    [6, [0, 0, 2, 2, 1, 1]],
    [7, [0, 1, 1, 1, 2, 2]],
    [7, [1, 1, 1, 2, 2, 1]],
    [8, [0, 1, 1, 3, 3, 0]],
  ].map(([total, counts], index) => p(
    `philosophy-11-term1-exam2-scenario-${index + 1}`, 11, 'term1_exam2', index + 1,
    total as number,
    ['FEL.11.1.1', 'FEL.11.1.2', 'FEL.11.2.1', 'FEL.11.2.2', 'FEL.11.3.1', 'FEL.11.3.2']
      .flatMap((code, i) => (counts as number[])[i] ? [{ outcomeCode: code, questionCount: (counts as number[])[i] }] : []),
  )),
  // 11. sınıf seçmeli dersler — Excel'deki Maarif Modeli sekmeleri.
  e('psychology-11-term1-exam1-scenario-1', 'psychology', 'term1_exam1', 1, 10,
    [...o('PSK.1.1', [5]), ...o('PSK.2.1', [3]), ...o('PSK.2.2', [2])],
    '11.PSİKOLOJİ maarif'),
  e('psychology-11-term1-exam1-scenario-2', 'psychology', 'term1_exam1', 2, 7,
    [...o('PSK.1.1', [4]), ...o('PSK.2.1', [2]), ...o('PSK.2.2', [1])],
    '11.PSİKOLOJİ maarif'),
  e('psychology-11-term1-exam2-scenario-1', 'psychology', 'term1_exam2', 1, 9,
    [...o('PSK.1.1', [2]), ...o('PSK.2.1', [1]), ...o('PSK.2.2', [1]), ...o('PSK.2.3', [2]), ...o('PSK.2.4', [3])],
    '11.PSİKOLOJİ maarif'),
  e('psychology-11-term1-exam2-scenario-2', 'psychology', 'term1_exam2', 2, 11,
    [...o('PSK.1.1', [2]), ...o('PSK.2.1', [2]), ...o('PSK.2.2', [2]), ...o('PSK.2.3', [3]), ...o('PSK.2.4', [2])],
    '11.PSİKOLOJİ maarif'),
  e('sociology-11-term1-exam1-scenario-1', 'sociology', 'term1_exam1', 1, 5,
    [...o('SOS.1.1', [1]), ...o('SOS.1.2', [2]), ...o('SOS.1.3', [2])],
    '11.SOSYOLOJİ maarif'),
  e('sociology-11-term1-exam1-scenario-2', 'sociology', 'term1_exam1', 2, 7,
    [...o('SOS.1.1', [2]), ...o('SOS.1.2', [3]), ...o('SOS.1.3', [2])],
    '11.SOSYOLOJİ maarif'),
  e('sociology-11-term1-exam2-scenario-1', 'sociology', 'term1_exam2', 1, 7,
    [...o('SOS.1.1', [1]), ...o('SOS.1.2', [2]), ...o('SOS.1.3', [2]), ...o('SOS.2.1', [1]), ...o('SOS.2.2', [1])],
    '11.SOSYOLOJİ maarif'),
  e('sociology-11-term1-exam2-scenario-2', 'sociology', 'term1_exam2', 2, 6,
    [...o('SOS.1.2', [1]), ...o('SOS.1.3', [2]), ...o('SOS.2.1', [2]), ...o('SOS.2.2', [1])],
    '11.SOSYOLOJİ maarif'),
  e('logic-11-term1-exam1-scenario-1', 'logic', 'term1_exam1', 1, 5,
    [...o('MAN.1.1', [1]), ...o('MAN.2.1', [2]), ...o('MAN.2.2', [2])],
    '11.MANTIK maarif'),
  e('logic-11-term1-exam1-scenario-2', 'logic', 'term1_exam1', 2, 7,
    [...o('MAN.1.1', [1]), ...o('MAN.1.2', [1]), ...o('MAN.1.3', [1]), ...o('MAN.2.1', [1]), ...o('MAN.2.2', [3])],
    '11.MANTIK maarif'),
  e('logic-11-term1-exam2-scenario-1', 'logic', 'term1_exam2', 1, 6,
    [...o('MAN.1.3', [1]), ...o('MAN.2.2', [1]), ...o('MAN.2.3', [2]), ...o('MAN.3.2', [1]), ...o('MAN.3.3', [1])],
    '11.MANTIK maarif'),
  e('logic-11-term1-exam2-scenario-2', 'logic', 'term1_exam2', 2, 10,
    [...o('MAN.1.2', [1]), ...o('MAN.2.1', [1]), ...o('MAN.2.2', [2]), ...o('MAN.2.3', [2]), ...o('MAN.3.1', [1]), ...o('MAN.3.2', [2]), ...o('MAN.3.3', [1])],
    '11.MANTIK maarif'),
];

export function examScenarioComputedTotal(scenario: ExamScenario): number {
  return scenario.outcomes.reduce((sum, outcome) => sum + outcome.questionCount, 0);
}

export function examScenarioIsConsistent(scenario: ExamScenario): boolean {
  return examScenarioComputedTotal(scenario) === scenario.declaredTotal;
}

export function getExamScenarios(input: {
  subject: ExamScenarioSubject;
  grade: 10 | 11;
  exam: ExamScenarioExam;
}): readonly ExamScenario[] {
  return examScenarios2026.filter(scenario =>
    scenario.subject === input.subject &&
    scenario.grade === input.grade &&
    scenario.exam === input.exam
  );
}
