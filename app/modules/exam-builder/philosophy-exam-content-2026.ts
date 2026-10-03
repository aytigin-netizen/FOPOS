import canonicalCurriculum from '../../data/felsefe_curriculum_2026.json' with { type: 'json' };
import { applyExamBepPresentation } from './exam-bep-presentation.ts';
import { nextParallelOrdinal } from './exam-variant-math.ts';
import { case1031 } from './philosophy-cases-10-3.ts';
import { case1041 } from './philosophy-cases-10-4.ts';
import type { Level, PhilosophyCase, Role } from './philosophy-exam-case.ts';

// Öğretmen incelemesine sunulan özgün örneklerdir; resmî soru bankası değildir.
// Metinler alıntı değil özgün vaka ve parafrazdır. Felsefi görüşler ders kitabı düzeyindeki yerleşik ayrımlarla sınırlıdır.
//
// Tasarım ilkeleri:
// 1) Öğrenci kitapçığında kazanım/bileşen cümlesi görünmez; yalnızca öğretmen cevap anahtarında ve ölçütte yer alır.
// 2) Soru kökü, anahtarın dayandığı her malzemeyi (iddia, itiraz, tanım, örnek) kendi içinde taşır; öğrenci
//    yalnızca anahtarda yazılı bir şeyi tahmin etmek zorunda kalmaz.
// 3) Görevler süreç bileşeninin rolüne göre yazılır (kavram / problem / değerlendirme / inceleme); her görev tek,
//    tutarlı bir iştir. Aynı soruda iki ayrı görev üst üste bindirilmez.
// 4) Her rolün 10 görevi vardır: 5 bilişsel düzey × 2. Talep edilen düzeye uyan görevler önce gelir.
// 5) Görev bankası ünite bilmez: tüm görev kökleri ve anahtarlar vaka alanlarından (philosophy-exam-case.ts) beslenir.
//    Yeni ünite = yeni vaka dosyası; bu dosyada ünite-özgü cümle bulunmaz (bir test bunu kilitler).
const DATASET_VERSION = '2026.1';
export const PHILOSOPHY_VARIANT_POOL = 10;

const cases: Record<string, PhilosophyCase> = {
  'FEL.10.3.1': case1031,
  'FEL.10.4.1': case1041,
};

type Entry = { level: Level; stem: (c: PhilosophyCase) => string; key: (c: PhilosophyCase) => string };

const cap = (value: string) => value.charAt(0).toLocaleUpperCase('tr-TR') + value.slice(1);
const lower = (value: string) => value.charAt(0).toLocaleLowerCase('tr-TR') + value.slice(1);
const d = (c: PhilosophyCase, index: number) => {
  const found = c.conceptDefs[index];
  if (!found) throw new Error(`Kavram tanımı eksik: ${index}`);
  return found;
};

const banks: Record<Role, Entry[]> = {
  concept: [
    { level: 'understand', stem: (c) => `“${d(c, c.slots.pair[0]).term}” ve “${d(c, c.slots.pair[1]).term}” kavramlarını kendi cümlelerinizle açıklayınız; her birini metinden bir ifadeyle ilişkilendiriniz.`, key: (c) => `${cap(d(c, c.slots.pair[0]).term)}: ${d(c, c.slots.pair[0]).meaning}. ${cap(d(c, c.slots.pair[1]).term)}: ${d(c, c.slots.pair[1]).meaning}. Metinle ilişki: ${d(c, c.slots.pair[0]).inText}; ${d(c, c.slots.pair[1]).inText}.` },
    { level: 'understand', stem: (c) => `${c.field.genitive} neyi sorguladığını, metindeki durumdan bir örnek vererek açıklayınız.`, key: (c) => `${c.answer} Metinden örnek: ${c.facts[0]}.` },
    { level: 'apply', stem: (c) => `“${d(c, c.slots.applyPair[0]).term}” ve “${d(c, c.slots.applyPair[1]).term}” kavramlarını metindeki duruma uygulayınız.`, key: (c) => `${cap(d(c, c.slots.applyPair[0]).term)}: ${d(c, c.slots.applyPair[0]).meaning}; ${d(c, c.slots.applyPair[0]).inText}. ${cap(d(c, c.slots.applyPair[1]).term)}: ${d(c, c.slots.applyPair[1]).meaning}; ${d(c, c.slots.applyPair[1]).inText}.` },
    { level: 'apply', stem: (c) => `“${d(c, c.slots.single).term}” kavramını metindeki durumdan ve gündelik hayattan birer örnekle açıklayınız.`, key: (c) => `${cap(d(c, c.slots.single).term)}: ${d(c, c.slots.single).meaning}. Metinden örnek: ${d(c, c.slots.single).inText}. ${c.singleApplyNote}` },
    { level: 'analyze', stem: (c) => `“${d(c, c.slots.pair[1]).term}” ile “${d(c, c.slots.pair[0]).term}” kavramları arasındaki ilişkiyi çözümleyiniz: Hangi soruda karşılaşırlar, hangi bakımdan ayrılırlar?`, key: (c) => c.contrastKey },
    { level: 'analyze', stem: (c) => c.twoExplanations.prompt, key: (c) => `Açıklama 1 ${c.twoExplanations.labels[0]}: ${c.twoExplanations.texts[0]} Açıklama 2 ${c.twoExplanations.labels[1]}: ${c.twoExplanations.texts[1]}` },
    { level: 'evaluate', stem: (c) => `“${c.definition.claim}” tanımını kapsayıcılığı açısından değerlendiriniz.`, key: (c) => `Tanım sınaması: ${c.definition.flaw}` },
    { level: 'evaluate', stem: (c) => `Metindeki ${c.choiceTopic} açıklamak için “${d(c, c.slots.choicePair[0]).term}” ile “${d(c, c.slots.choicePair[1]).term}” kavramlarından hangisinin daha uygun olduğunu gerekçelendiriniz.`, key: (c) => `Her iki tercih de gerekçeliyse kabul edilir. Ölçüt: kavramların doğru kullanımı (${d(c, c.slots.choicePair[0]).term}: ${d(c, c.slots.choicePair[0]).meaning}; ${d(c, c.slots.choicePair[1]).term}: ${d(c, c.slots.choicePair[1]).meaning}) ve gerekçenin metindeki duruma bağlanması.` },
    { level: 'create', stem: (c) => `Metindeki kavramlardan en az üçünü kullanarak ${c.field.dative} ilişkin bir soru ve bu soruya iki cümlelik bir yanıt yazınız.`, key: (c) => `Örnek soru: ${c.question} Örnek yanıt: ${c.questionAnswers[0]} Kabul ölçütü: soru ${c.field.lower} alanındadır ve en az üç kavram doğru kullanılmıştır.` },
    { level: 'create', stem: (c) => `Merkezinde “${c.field.center}” olan bir kavram haritasını yazıyla anlatınız: en az dört kavramı ve aralarındaki üç ilişkiyi belirtiniz.`, key: (c) => `${c.conceptMap} Kabul ölçütü: en az dört kavram, üç ilişki ve ilişkilerin kısa gerekçesi.` },
  ],
  problem: [
    { level: 'understand', stem: (c) => `Metinde geçen iki problemi (${c.problems.pairLabel}) birbirinden ayırarak açıklayınız.`, key: (c) => `“${c.problems.a.label}” problemi: ${c.problems.a.text}. “${c.problems.b.label}” problemi: ${c.problems.b.text}.` },
    { level: 'understand', stem: (c) => `Metindeki “${c.problem}” problemini kendi cümlelerinizle anlatınız.`, key: (c) => c.problemKey },
    { level: 'apply', stem: (c) => `${cap(c.problems.a.text)} sorusu hangi problem türüne girer? Gerekçelendiriniz.`, key: (c) => c.problems.typeKey },
    { level: 'apply', stem: (c) => c.everyday.prompt, key: (c) => c.everyday.key },
    { level: 'analyze', stem: (c) => `${cap(c.claimant)} sözündeki gizli öncülü belirtip sınayınız.`, key: (c) => `${c.hiddenPremise} Sınama: ${c.check}` },
    { level: 'analyze', stem: (c) => `${cap(c.opponent)} itirazının, ${c.claimant} sözündeki hangi öncüle yöneldiğini çözümleyiniz.`, key: (c) => `İtiraz şu öncüle yöneliktir: “${c.argument.premises[1]}” ${c.objectionTarget}` },
    { level: 'evaluate', stem: (c) => `${cap(c.claimant)} sonucunun (“${c.conclusionQuote}”), verdiği gerekçeyle ne ölçüde desteklendiğini değerlendiriniz.`, key: (c) => `Gerekçe sonucu kesin kılmaz: ${c.hiddenPremise} Ancak gerekçe boş değildir: ${c.causal} Değerlendirme ölçütü: ${c.check}` },
    { level: 'evaluate', stem: (c) => c.problems.priorityStem, key: (c) => c.problems.priorityKey },
    { level: 'create', stem: (c) => c.thoughtExperimentPrompt, key: (c) => c.thoughtExperiment },
    { level: 'create', stem: () => 'Metindeki problemden hareketle yeni bir felsefi soru yazınız ve bu soruya iki olası yanıt veriniz.', key: (c) => `Örnek soru: ${c.question} Yanıt 1: ${c.questionAnswers[0]} Yanıt 2: ${c.questionAnswers[1]}` },
  ],
  evaluate: [
    { level: 'understand', stem: (c) => `${cap(c.claimant)} görüşünü ve ${c.opponent} itirazını kendi cümlelerinizle özetleyiniz.`, key: (c) => `Görüş: ${c.claim} İtiraz: ${c.objection}` },
    { level: 'understand', stem: () => 'Metindeki iki görüşün hangi soruda ayrıştığını belirtiniz.', key: (c) => c.dispute },
    { level: 'apply', stem: (c) => `${cap(c.claimant)} görüşünü şu duruma uygulayınız: ${c.otherContextPrompt}. Görüşe göre sonuç ne olur?`, key: (c) => c.otherContext },
    { level: 'apply', stem: () => 'Tutarlılık ölçütünü metindeki iki görüşe de uygulayınız: hangi görüş hangi noktada açıklama borcu taşır?', key: (c) => c.consistencyCheck },
    { level: 'analyze', stem: () => 'Metindeki iki görüşün dayandığı gerekçeleri ve varsayımları ayrı ayrı çözümleyiniz.', key: (c) => `${cap(c.claimantShort)} görüşü: gerekçe ${c.facts[1]}; varsayım: ${c.hiddenPremise} ${c.opposing}` },
    { level: 'analyze', stem: (c) => `${cap(c.claimant)} görüşüne yöneltilebilecek bir karşı örnek veriniz ve karşı örneğin hangi varsayımı zorladığını belirtiniz.`, key: (c) => `Karşı örnek: ${c.counter} Zorlanan varsayım: ${c.strainedAssumption}` },
    { level: 'evaluate', stem: () => 'Metindeki iki görüşten hangisinin durumu daha iyi açıkladığını açıklama gücü ve sadelik ölçütleriyle gerekçelendiriniz.', key: (c) => c.comparison },
    { level: 'evaluate', stem: (c) => `${cap(c.opponent)} “${c.objection}” itirazını değerlendiriniz: güçlü ve zayıf yönleri nelerdir?`, key: (c) => c.objectionAssessment },
    { level: 'create', stem: () => 'Metindeki iki görüşü uzlaştıran ya da ikisinin dışında kalan üçüncü bir görüş geliştiriniz; bu görüşü sınayacak bir ölçüt belirtiniz.', key: (c) => `Örnek: ${c.alternative} Ölçüt: ${c.check}` },
    { level: 'create', stem: (c) => `${cap(c.claimant)} görüşünü destekleyecek yeni bir gerekçe (başka bir örnek) üretiniz ve bu gerekçenin sınırını belirtiniz.`, key: (c) => `Örnek gerekçe: ${c.newReasonExample} Sınır: ${c.counter}` },
  ],
  inspect: [
    { level: 'understand', stem: () => 'Metinde geçen felsefi kavramları belirleyiniz ve her birini bir cümleyle tanımlayınız.', key: (c) => `Kavramlar: ${c.slots.inspect.map((i) => `${d(c, i).term} (${d(c, i).meaning})`).join('; ')}.` },
    { level: 'understand', stem: () => 'Metindeki problemi ve metinde karşılaşan iki görüşü belirleyiniz.', key: (c) => `Problem: ${c.problem}. Görüş 1: ${c.claim} Görüş 2: ${c.objection}` },
    { level: 'apply', stem: (c) => `${cap(c.claimant)} sözünü öncül ve sonuç olarak yeniden yazınız.`, key: (c) => `Öncül 1: ${c.argument.premises[0]} Öncül 2: ${c.argument.premises[1]} Sonuç: ${c.argument.conclusion}` },
    { level: 'apply', stem: () => 'Metindeki gözlem bilgisi ile felsefi iddiayı ayırarak yazınız.', key: (c) => `Gözlem bilgisi: ${c.facts[0]}. Felsefi iddia: ${c.causal} Gözlem bir olgudur; iddia ise olgunun nasıl açıklanacağına ilişkin sınanması gereken bir yorumdur.` },
    { level: 'analyze', stem: (c) => `${cap(c.claimant)} akıl yürütmesinin hangi öncüle en çok bağlı olduğunu belirleyiniz; bu öncül yanlışsa sonucun ne olacağını yazınız.`, key: (c) => `En çok bağlı olduğu öncül: “${c.argument.premises[1]}” Bu öncül yanlışsa sonuç desteksiz kalır.` },
    { level: 'analyze', stem: () => 'Metindeki kavram, problem ve argümanı ayrı ayrı gösteriniz.', key: (c) => `Kavramlar: ${c.concepts}. Problem: ${c.problem}. Argüman: ${c.argument.premises.join(' ')} Sonuç: ${c.argument.conclusion}` },
    { level: 'evaluate', stem: (c) => `${cap(c.claimant)} akıl yürütmesinin sonucunu kesinleştirmek için hangi ek öncüle ihtiyaç olduğunu belirtiniz ve bu öncülü değerlendiriniz.`, key: (c) => `${c.hiddenPremise} Değerlendirme: ${c.check}` },
    { level: 'evaluate', stem: () => 'Metindeki iki görüşün gerekçelerinden hangisinin metinde daha açık gösterildiğini belirtiniz; açık gösterilmenin doğru olmayı gerektirip gerektirmediğini tartışınız.', key: (c) => `${cap(c.claimantShort)} gerekçesi metinde açıkça gösterilir (${c.facts[1]}); arkadaşın itirazı ise bir iddia olarak kalır, kanıtı gösterilmemiştir. Ancak açık gösterilmek doğru olmak demek değildir: ${lower(c.claimantShort)} gerekçesi de kanıtlanmamış bir öncüle dayanır. ${c.hiddenPremise}` },
    { level: 'create', stem: () => 'Metne uygun, tek bir iddia ve iki gerekçeden oluşan yeni bir kısa argüman yazınız.', key: (c) => `Örnek: İddia: ${c.alternative} Gerekçe 1: ${c.createArgument.reason1} Gerekçe 2: ${c.createArgument.reason2}` },
    { level: 'create', stem: () => 'Metne yönelik bir okuma sorusu (ana düşünce ya da çıkarım) yazınız ve cevap anahtarını hazırlayınız.', key: (c) => `Örnek soru: Metindeki iki görüş hangi soruda ayrışır? Örnek anahtar: ${c.dispute}` },
  ],
};

const levels: Level[] = ['understand', 'apply', 'analyze', 'evaluate', 'create'];

// İstenen düzeye uyan görevler önce gelir; geri kalanı sabit sırayla izler. Bu sıralama, aynı düzeyde
// ardışık varyantların farklı görev vermesini sağlayan birebir bir eşlemedir (permütasyon).
function orderedBank(role: Role, level: Level): Entry[] {
  const bank = banks[role];
  return [...bank.filter((entry) => entry.level === level), ...bank.filter((entry) => entry.level !== level)];
}

type Input = { unitCode: string; outcomeCode: string; ordinal: number; kind: string; level: string; points: number; datasetVersion: string; mode: string; profile: string };

function findOutcome(unitCode: string, outcomeCode: string) {
  const units = [...canonicalCurriculum.grades['10'].units, ...canonicalCurriculum.grades['11'].units];
  return units.find((u) => u.unit_code === unitCode)?.learning_outcomes.find((o) => o.outcome_code === outcomeCode);
}

export function philosophyCoversOutcome(outcomeCode: string, datasetVersion: string) {
  return datasetVersion === DATASET_VERSION && Object.hasOwn(cases, outcomeCode);
}

export function generatePhilosophyExamContent(input: Input) {
  if (input.datasetVersion !== DATASET_VERSION) throw new Error('Felsefe sınavı için doğrulanmış 2026.1 gerekir.');
  if (!['text', 'short', 'open', 'scenario'].includes(input.kind) || !['standard', 'bep'].includes(input.mode)) throw new Error('Geçersiz soru türü veya sınav modu.');
  const outcome = findOutcome(input.unitCode, input.outcomeCode);
  const components = outcome?.process_components;
  const c = cases[input.outcomeCode];
  if (!components?.length || !c || !Number.isInteger(input.ordinal) || input.ordinal < 0) throw new Error('Geçersiz Felsefe ünite/çıktı/bileşen eşleşmesi.');
  if (c.components.length !== components.length || c.roles.length !== components.length) throw new Error('Felsefe bileşenine ait değerlendirme kanıtı eksik.');
  if (!(levels as string[]).includes(input.level)) throw new Error('Geçersiz bilişsel düzey.');
  const componentIndex = input.ordinal % components.length;
  const component = components[componentIndex];
  const variationIndex = Math.floor(input.ordinal / components.length);
  const entry = orderedBank(c.roles[componentIndex], input.level as Level)[variationIndex];
  if (!entry) throw new Error('Bu çıktı için tekrarsız soru kapasitesi aşıldı. Soru kapsamını genişletiniz.');
  const stem = entry.stem(c);
  // Öğrenci kitapçığında yalnızca metin ve görev bulunur; kazanım/bileşen cümlesi öğretmen anahtarında ve ölçütte yer alır.
  let passage = input.kind === 'text' ? c.context : '';
  let text = `${input.kind === 'text' ? '' : `${c.context}\n`}${stem}${input.kind === 'short' ? ' Kısa ve öz yanıt veriniz.' : ''}`;
  let fontSize = 22;
  ({ passage, text, fontSize } = applyExamBepPresentation(input.mode, input.profile, { passage, text, fontSize }, c.concepts));
  return {
    passage,
    text,
    answer: `Beklenen yanıt: ${entry.key(c)}\nBileşen çerçevesi (${component.step}): ${c.components[componentIndex]}`,
    criterion: `${component.step}) ${component.description} • Görevin eksiksiz ve gerekçeli yapılması: %40 • Kavram ve metin kanıtı: %40 • Dil ve bütünlük: %20. Eşdeğer gerekçeli yanıtlar kabul edilir; sunum biçimi ayrıca puan kaybettirmez.`,
    contentOrdinal: input.ordinal,
    componentStep: component.step,
    componentDescription: component.description,
    fontSize,
  };
}

export function validPhilosophyExamTrace(unitCode: string, outcomeCode: string, step?: string, description?: string) {
  return findOutcome(unitCode, outcomeCode)?.process_components?.some((comp) => comp.step === step && comp.description === description) ?? false;
}

// B kitapçığı için A sorusunun karşılığı: aynı çıktı ve süreç bileşeni, A'da ve B'de daha önce kullanılmamış sonraki varyant.
export function philosophyParallelOrdinal(unitCode: string, outcomeCode: string, ordinal: number, usedOrdinals: Iterable<number>) {
  const components = findOutcome(unitCode, outcomeCode)?.process_components;
  return nextParallelOrdinal(components?.length ?? 0, ordinal, usedOrdinals);
}
