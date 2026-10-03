import { generateSociologyExamContent, sociologyParallelOrdinal, validSociologyExamTrace } from "./sociology-exam-content-2026.ts";
import { sociology2026Package } from "../../../src/curriculum-packages/sociology-2026.ts";
import { generatePhilosophyExamContent, philosophyCoversOutcome, philosophyParallelOrdinal, validPhilosophyExamTrace } from "./philosophy-exam-content-2026.ts";

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
  // Üretici bu çıktı için doğrulanmış içerik taşıyor mu. Kısmen kapsanan derslerde (içerik yazımı sürerken)
  // yalnızca tamamen kapsanan seçimler üretici akışına girer; diğerleri şablon akışında kalır.
  covers(outcomeCode: string, datasetVersion: string): boolean;
};

const sociologyExamEngine: ExamContentEngine = Object.freeze({
  variantPool: 20,
  generate: generateSociologyExamContent,
  parallelOrdinal: sociologyParallelOrdinal,
  validTrace: (question: ExamTraceInput) =>
    validSociologyExamTrace(question.unitCode, question.outcomeCode, question.componentStep, question.componentDescription),
  covers: (outcomeCode: string, datasetVersion: string) =>
    datasetVersion === sociology2026Package.manifest.datasetVersion
    && sociology2026Package.units.some((unit) => unit.outcomes.some((outcome) => outcome.code === outcomeCode)),
});

const philosophyExamEngine: ExamContentEngine = Object.freeze({
  variantPool: 20,
  generate: generatePhilosophyExamContent,
  parallelOrdinal: philosophyParallelOrdinal,
  validTrace: (question: ExamTraceInput) =>
    validPhilosophyExamTrace(question.unitCode, question.outcomeCode, question.componentStep, question.componentDescription),
  covers: philosophyCoversOutcome,
});

const engines: Readonly<Record<string, ExamContentEngine>> = Object.freeze({
  sociology: sociologyExamEngine,
  philosophy: philosophyExamEngine,
});

export function resolveExamContentEngine(subjectCode: string): ExamContentEngine | null {
  return engines[subjectCode.trim().toLocaleLowerCase("en-US")] ?? null;
}

// Sınav akışında kullanılacak üretici: ders kaydı varsa VE seçimdeki her çıktı doğrulanmış içerikle kapsanıyorsa.
// Aksi hâlde null döner ve akış şablon üretimiyle çalışır. Bileşen ve testler aynı kuralı kullanır.
export function activeExamContentEngine(subjectCode: string, datasetVersion: string, outcomeCodes: readonly string[]): ExamContentEngine | null {
  const engine = resolveExamContentEngine(subjectCode);
  if (!engine || !outcomeCodes.length) return null;
  return outcomeCodes.every((code) => engine.covers(code, datasetVersion)) ? engine : null;
}
