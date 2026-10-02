import { generateSociologyExamContent, sociologyParallelOrdinal, validSociologyExamTrace } from "./sociology-exam-content-2026.ts";

// Sınav Oluşturucu ders-bağımsızdır: derse özgü her şey bu sözleşmenin arkasındadır.
// Bir ders içerik üreticisi (engine) kaydettiğinde sınav akışı ek kod gerektirmeden
// şunları kazanır: her "Sınavı oluştur" basışında yeni varyant, A'dan farklı paralel B kitapçığı,
// tür/düzey değişiminde içeriğin yeniden üretimi, varyant bütçesi ve süreç bileşeni izi doğrulaması.
// Üretici kaydı olmayan derslerde akış şablon tabanlı üretimle çalışmaya devam eder.
export type ExamContentInput = {
  unitCode: string;
  outcomeCode: string;
  ordinal: number;
  kind: string;
  level: string;
  points: number;
  datasetVersion: string;
  mode: string;
  profile: string;
};

export type ExamContentOutput = {
  passage: string;
  text: string;
  answer: string;
  criterion: string;
  contentOrdinal: number;
  componentStep: string;
  componentDescription: string;
  fontSize: number;
};

export type ExamTraceInput = {
  unitCode: string;
  outcomeCode: string;
  componentStep?: string;
  componentDescription?: string;
};

export type ExamContentEngine = {
  // Bir çıktının (çıktı × süreç bileşeni) için ayırabileceği toplam varyant sayısı.
  variantPool: number;
  generate(input: ExamContentInput): ExamContentOutput;
  // A'daki bir sorunun paralel B karşılığı: aynı çıktı/bileşen, kullanılmamış başka varyant.
  parallelOrdinal(unitCode: string, outcomeCode: string, ordinal: number, usedOrdinals: Iterable<number>): number;
  // Sorunun izlediği çıktı/süreç bileşeni müfredatta gerçekten var mı.
  validTrace(question: ExamTraceInput): boolean;
};

const sociologyExamEngine: ExamContentEngine = Object.freeze({
  variantPool: 20,
  generate: generateSociologyExamContent,
  parallelOrdinal: sociologyParallelOrdinal,
  validTrace: (question: ExamTraceInput) =>
    validSociologyExamTrace(question.unitCode, question.outcomeCode, question.componentStep, question.componentDescription),
});

const engines: Readonly<Record<string, ExamContentEngine>> = Object.freeze({
  sociology: sociologyExamEngine,
});

export function resolveExamContentEngine(subjectCode: string): ExamContentEngine | null {
  return engines[subjectCode.trim().toLocaleLowerCase("en-US")] ?? null;
}
