// Felsefe sınav üreticisinin vaka sözleşmesi. Görev bankası (philosophy-exam-content-2026.ts) ünite bilmez;
// görev kökleri ve cevap anahtarları yalnızca bu alanlardan beslenir. Yeni bir ünite eklemek = yeni bir vaka yazmak.
//
// Yazım ilkeleri (her vaka için geçerli):
// 1) Vaka özgündür: alıntı ve düşünür adı yoktur; yalnızca ders kitabı düzeyinde yerleşik ayrımlar kullanılır.
// 2) Metin (context) açık bir görüş ve açık bir itiraz içerir; claim/objection metinde aynen geçer.
// 3) Her görev kökü, cevap anahtarının dayandığı malzemeyi (tanım, durum, iddia) kendi içinde taşır.
// 4) Kazanım/bileşen cümlesi öğrenci metnine girmez; yalnızca `components` (öğretmen çerçevesi) ve ölçütte yer alır.

export type Level = 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';
export type Role = 'concept' | 'problem' | 'evaluate' | 'inspect';
export type ConceptDef = { term: string; meaning: string; inText: string };

export type PhilosophyCase = {
  context: string;
  concepts: string; // virgülle ayrılmış kavram listesi (BEP sunumu ve “kavram, problem, argüman” görevi için)
  roles: Role[]; // süreç bileşenleriyle aynı sırada
  components: string[]; // öğretmen için bileşen çerçevesi (bileşen başına bir cümle öbeği)
  field: { name: string; lower: string; genitive: string; dative: string; center: string }; // “Varlık felsefesi / varlık felsefesinin / varlık felsefesine / varlık”
  claimant: string; // “… sözündeki” biçiminde tamlayan (küçük harfle)
  claimantShort: string; // cümle başında “… görüşü” biçiminde kullanılan kısa tamlayan
  opponent: string;
  claim: string;
  objection: string;
  conceptDefs: ConceptDef[];
  slots: {
    pair: [number, number]; // “A ve B kavramlarını açıkla” + “B ile A arasındaki ilişkiyi çözümle”
    applyPair: [number, number]; // “… kavramlarını metindeki duruma uygula”
    single: number; // tek kavramı metinden ve gündelik hayattan örnekle
    choicePair: [number, number]; // “hangisi daha uygun” karşılaştırması
    inspect: number[]; // metin incelemede tanımı istenen kavramlar
  };
  choiceTopic: string; // “Metindeki … açıklamak için” biçiminde, -i hâlinde
  contrastKey: string;
  singleApplyNote: string;
  problems: {
    a: { label: string; text: string };
    b: { label: string; text: string };
    pairLabel: string; // “var mı?” ve “nedir?” biçimi, soru kökünde
    priorityStem: string;
    typeKey: string;
    priorityKey: string;
  };
  problem: string;
  problemKey: string;
  dispute: string;
  facts: [string, string];
  causal: string;
  counter: string;
  strainedAssumption: string;
  alternative: string;
  check: string;
  hiddenPremise: string;
  thoughtExperimentPrompt: string;
  thoughtExperiment: string;
  twoExplanations: { prompt: string; labels: [string, string]; texts: [string, string] };
  everyday: { prompt: string; key: string };
  conclusionQuote: string;
  objectionTarget: string;
  argument: { premises: [string, string]; conclusion: string };
  argumentNote?: string; // “yeniden yazınız” anahtarına eklenen not (örn. hangi öncülün metinde örtük kaldığı)
  // Metinde görüş ve itirazdan ayrı üçüncü bir ses varsa onun argümanı; ayrı bir çözümleme görevi alır.
  thirdVoice?: { claim: string; argument: { premises: [string, string]; conclusion: string }; implicitNote: string };
  definition: { claim: string; flaw: string };
  otherContextPrompt: string;
  otherContext: string;
  newReasonExample: string;
  opposing: string;
  createArgument: { reason1: string; reason2: string };
  comparison: string;
  consistencyCheck: string;
  objectionAssessment: string;
  conceptMap: string;
  answer: string;
  question: string;
  questionAnswers: [string, string];
};
