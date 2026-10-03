import canonicalCurriculum from '../../data/felsefe_curriculum_2026.json' with { type: 'json' };
import { applyExamBepPresentation } from './exam-bep-presentation.ts';
import { nextParallelOrdinal } from './exam-variant-math.ts';

// Öğretmen incelemesine sunulan özgün örneklerdir; resmî soru bankası değildir.
// Metinler alıntı değil özgün vaka ve parafrazdır. Felsefi görüşler ders kitabı düzeyindeki yerleşik ayrımlarla sınırlıdır.
// Her çıktı için içerik, resmî süreç bileşenleriyle (a, b, c, ç ...) aynı sırada ve sayıda olmak zorundadır.
const DATASET_VERSION = '2026.1';

type PhilosophyCase = {
  context: string;
  concepts: string;
  answer: string;
  components: string[];
  problem: string;
  solution: string;
  facts: [string, string];
  causal: string;
  counter: string;
  alternative: string;
  check: string;
  hiddenPremise: string;
  thoughtExperiment: string;
  argument: { premises: [string, string]; conclusion: string };
  definition: { claim: string; flaw: string };
  otherContext: string;
  opposing: string;
  everyday: string;
  consequences: string;
  inconsistency: string;
  comparison: string;
  question: string;
};

const cases: Record<string, PhilosophyCase> = {
  'FEL.10.3.1': {
    context: 'Bir öğrenci, buz küpünün eriyip suya, sonra buhara dönüştüğünü izler. Biçim sürekli değişirken ona yine “su” demeyi sürdürür ve değişmeyen bir şey olup olmadığını merak eder. Sınıf arkadaşı rüyasında gördüğü bir sahnenin “var” sayılıp sayılamayacağını sorar. Öğretmen, bir şeyin var olup olmadığı sorusu ile var olan şeyin ne olduğu sorusunun ayrı felsefi problemler olduğunu söyler.',
    concepts: 'varlık, oluş, töz, fenomen, madde, öz',
    answer: 'Varlık felsefesi var olanı ve var olmanın ne demek olduğunu sorgular; temel kavramları varlık, varoluş, madde, idea, fenomen, oluş, öz ve tözdür. Ortak soruları görünüş ile asıl gerçeklik, değişim ile kalıcılık arasındaki ilişkidir.',
    components: [
      'Varlık felsefesi var olanı ve var olmanın anlamını sorgular. Metinde su bir madde örneğidir; buzdan buhara değişen biçimler oluşu, değişse de “su” denmesini sağlayan dayanak ise öz veya töz kavramını gündeme getirir.',
      'İki problem ayrılır: rüya sahnesinin var sayılıp sayılamayacağı varlığın var olup olmadığına; suyun değişen biçimlerinin ardında gerçekte ne olduğu varlığın ne olduğuna ilişkindir.',
      'Değişimin altında kalıcı bir dayanak (töz) bulunduğunu savunan görüş kimliğin korunmasını açıklar; yalnız oluşu esas alan görüş değişimi öne çıkarır. Değerlendirme, görüşlerin tutarlılığına ve metindeki durumu açıklama gücüne bakar.',
      'Metinde kavramlar madde, oluş ve öz/töz; problemler değişim içinde kimliğin korunması ve rüya sahnesinin varlığı; argüman ise “biçim değişse de ona su denmesi ortak bir dayanak olduğunu düşündürür” iddiasıdır. Bu iddia henüz kanıtlanmış değildir; dayandığı öncüller sınanmalıdır.',
    ],
    problem: 'değişim içinde kimliğin korunması',
    solution: 'Varlık sorusu “var mı?” ve “nedir?” diye ayrı ayrı ele alınabilir; görüşler tutarlılık ve açıklama gücüyle karşılaştırılır, hiçbiri kesin doğru sayılmaz.',
    facts: ['buz küpünün eriyip suya ve buhara dönüşmesi', 'biçim değişirken “su” adının korunması'],
    causal: 'Biçimler değişirken aynı adla anılma, değişimin altında kalıcı bir dayanak (töz) bulunabileceğini düşündürür; bu dayanak kimliğin korunmasını açıklar.',
    counter: 'Her şeyin sürekli oluş olduğunu savunan bir görüş, “aynı su” ifadesinin yalnız dilsel bir alışkanlık olduğunu söyleyebilir; bu durumda kalıcı dayanak varsayımı zorunlu değildir.',
    alternative: 'Kimliği, kalıcı bir töz yerine biçimler arasındaki süreklilik ve ilişkiler açıklıyor olabilir.',
    check: 'Görüş tutarlılık ve açıklama gücü ölçütleriyle sınanır: değişimi ve kimliği çelişkiye düşmeden açıklıyor mu, başka örneklerde de geçerli mi?',
    hiddenPremise: 'Gizli öncül: Adın korunması, adın gösterdiği şeyin gerçekten aynı kaldığını gösterir. Bu öncül kanıtlanmadan kabul edilirse sonuç öncülün içine yerleştirilmiş olur.',
    thoughtExperiment: 'Düşünce deneyi: Bir nesnenin parçaları tek tek değiştirilip sonunda ilk parçalarından hiçbiri kalmasa, nesne yine aynı nesne midir? “Evet” yanıtı kimliğin parçalardan bağımsız bir dayanağa (veya parçalar arası sürekliliğe), “hayır” yanıtı kimliğin parçalara bağlı olduğuna işaret edebilir.',
    argument: { premises: ['Biçim değişse de ona aynı adla “su” denir.', 'Aynı adla anılan şey, değişimin altında aynı kalan bir dayanağa sahiptir.'], conclusion: 'Değişimin altında kalıcı bir dayanak (töz) vardır.' },
    definition: { claim: 'Varlık, yalnızca duyularla algılanabilen şeydir.', flaw: 'Bu tanım çok dardır: su buharı çoğu zaman gözle görülmese de bir madde olarak var kabul edilir; ayrıca düşünce ve rüya gibi duyusal olmayan durumların varlık statüsü tanım tarafından tartışılmadan dışarıda bırakılır.' },
    otherContext: 'Başka bir bağlamda, parçaları zamanla yenilenen bir yapı düşünülebilir: parçalar değişse de yapıya aynı ad verilir. Bu durum kalıcı bir töz kabulünün her bağlamda gerekli olmadığını, adın korunmasının düzen ve süreklilikle de açıklanabileceğini gösterir.',
    opposing: 'Karşıt görüş (oluşu esas alan görüş): Gerçeklik sürekli değişimdir; “aynı su” ifadesi akışın bir anını sabit gösteren pratik bir adlandırmadır. Gerekçesi: metinde değişmeden kalan bir nitelik gösterilmemiştir.',
    everyday: 'Gündelik deneyimde buz, su ve buhar farklı şeyler gibi algılanır; felsefi açıklama ise bu görünümlerin (fenomen) ardında ortak bir dayanak (öz veya töz) bulunup bulunmadığını sorar. Gündelik dil bu soruyu yanıtlamaz, yalnız ortaya çıkarır.',
    consequences: 'Kalıcı bir töz kabul edilirse: (1) değişim ve kimlik birlikte açıklanır, bu görüşün açıklama gücüdür; (2) gözlenemeyen bir dayanak varsayılır, bu görüşün kanıt yükü ve maliyetidir. İki sonuç ayrı değerlendirilir.',
    inconsistency: 'Töz değişmeden kalıyorsa, ona ilişkin bilgiye nasıl ulaşıldığı açıklanmalıdır. Açıklanamıyorsa görüş bir çelişkiye değil, bilinemeyen bir dayanak varsaymanın açıklama yüküne yol açar.',
    comparison: 'Töz görüşü kimliği iyi açıklar ama gözlenemeyen bir dayanak varsayar; oluş görüşü değişimi iyi açıklar ama kimliğin nasıl korunduğunu açıklamakta güçlük çeker. Üstünlük, tutarlılık, açıklama gücü ve sadelik ölçütlerine göre belirlenir.',
    question: 'Değişen bir şeyin aynı şey olarak kalmasını sağlayan nedir?',
  },
};

const tasks: Record<string, string> = {
  understand: 'İlgili felsefi kavramları açıklayınız.',
  apply: 'Kavramları bu metne uygulayınız.',
  analyze: 'Metindeki görüşü ve dayanaklarını çözümleyiniz.',
  evaluate: 'Görüşün gerekçelerini ve karşı görüşü değerlendiriniz.',
  create: 'Metindeki problemden hareketle felsefi bir soru ve bu soruyu sınayacak bir düşünce deneyi oluşturunuz.',
};

const variations = [
  'Metinden iki dayanak seçiniz.',
  'Olası bir karşı örnekle görüşün sınırını belirtiniz.',
  'Bir alternatif görüş ve onu sınayacak ölçüt belirtiniz.',
  'Bir gerekçe ile bir sonucu ayırarak açıklayınız.',
  'Görüşün başka bir bağlamda geçerli olup olmadığını tartışınız.',
  'Bir gözlem bilgisi ile felsefi iddiayı ayırınız.',
  'Metindeki gizli öncülü belirtip sınayınız.',
  'Görüşün hangi koşullarda değişeceğini tartışınız.',
  'İki kavram arasındaki ilişkiyi bir örnekle açıklayınız.',
  'Bir düşünce deneyi kurarak görüşü sınayınız.',
  'Karşıt görüşün bakış açısını gerekçelendiriniz.',
  'Metindeki iddiayı öncül ve sonuç olarak yeniden yazınız.',
  'Gündelik deneyim ile felsefi açıklamayı karşılaştırınız.',
  'Görüşün bir tutarsızlığa yol açıp açmadığını tartışınız.',
  'Görüşü destekleyen ve sınırlayan birer bilgi seçiniz.',
  'Görüşün kabul edilmesinin sonuçlarını ayırt ediniz.',
  'Bir tanımı kapsayıcılığı açısından sınayınız.',
  'Görüşü bir yaklaşım olarak değerlendiriniz.',
  'Metinden hareketle felsefi bir soru oluşturup yanıtlama yolunu açıklayınız.',
  'İki farklı görüşü tutarlılık ve açıklama gücü açısından karşılaştırınız.',
];

function expectedVariation(index: number, c: PhilosophyCase) {
  const [first, second] = c.facts;
  const [conceptA, conceptB] = c.concepts.split(', ');
  const responses = [
    `İki dayanak: (1) ${first}; (2) ${second}. Bu bilgiler şu açıklamayı destekler: ${c.causal}`,
    `Karşı örnek: ${c.counter} Bu nedenle görüş bütün durumlara koşulsuz genellenemez.`,
    `Alternatif görüş: ${c.alternative} Sınama: ${c.check}`,
    `Gerekçe: ${first}; ${second}. Sonuç: ${c.argument.conclusion} Gerekçeler sonucu kendiliğinden kanıtlamaz; öncüllerin kabulü ayrıca sınanmalıdır.`,
    `${c.otherContext} Bu karşılaştırma, ${first} bilgisinden çıkarılan sonucun başka bağlamlarda ayrıca sınanması gerektiğini gösterir.`,
    `Gözlem bilgisi: ${first}. Felsefi iddia: ${c.causal} Gözlem bilgisi bir olgudur; iddia ise bu olgunun nasıl açıklanacağına ilişkin sınanması gereken bir yorumdur: ${c.check}`,
    `${c.hiddenPremise} Sınama: ${c.check}`,
    `Görüşün değişeceği koşul: ${c.counter} Bu koşulda ilk açıklama daraltılır; ${c.alternative} ayrıca incelenir.`,
    `Kavram ilişkisi (${conceptA} – ${conceptB}): ${c.answer} Somut örnek: ${first}; ${second}.`,
    `${c.thoughtExperiment} Deneyin sonucu kesin kanıt değil, görüşün sezgilerimizle ve diğer kabullerimizle ne ölçüde uyuştuğunun göstergesidir; ölçüt: ${c.check}`,
    `${c.opposing}`,
    `Öncül 1: ${c.argument.premises[0]} Öncül 2: ${c.argument.premises[1]} Sonuç: ${c.argument.conclusion} Argümanın değeri öncüllerin kabulüne bağlıdır; öncüllerden birinin yanlış olması sonucu desteksiz bırakır.`,
    `${c.everyday}`,
    `${c.inconsistency}`,
    `Destekleyen bilgi: ${first}. Sınırlayan karşı örnek: ${c.counter} Destek belirli bir durumu açıklarken karşı örnek koşulsuz genellemeyi sınırlar.`,
    `${c.consequences}`,
    `Tanım sınaması: “${c.definition.claim}” ${c.definition.flaw} Daha iyi bir tanım bu karşı durumları keyfî biçimde dışarıda bırakmamalıdır.`,
    `Yaklaşım: ${c.solution} Sınırı: ${c.counter} Sınama yolu: ${c.check}`,
    `Felsefi soru: ${c.question} Yanıtlama yolu: ${c.check} Olası yanıtlardan biri: ${c.alternative}`,
    `${c.comparison}`,
  ];
  const response = responses[index];
  if (!response) throw new Error('Soru varyantına ait cevap anahtarı bulunamadı.');
  return response;
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
  if (c.components.length !== components.length) throw new Error('Felsefe bileşenine ait değerlendirme kanıtı eksik.');
  const componentIndex = input.ordinal % components.length;
  const component = components[componentIndex];
  const expectedComponent = c.components[componentIndex];
  if (!tasks[input.level]) throw new Error('Geçersiz bilişsel düzey.');
  const variationIndex = Math.floor(input.ordinal / components.length);
  const variation = variations[variationIndex];
  if (!variation) throw new Error('Bu çıktı için tekrarsız soru kapasitesi aşıldı. Soru kapsamını genişletiniz.');
  const expectedTask = expectedVariation(variationIndex, c);
  const [conceptA, conceptB] = c.concepts.split(', ');
  const levelEvidence: Record<string, string> = {
    understand: `Kavram açıklaması: ${c.answer}`,
    apply: `Metne uygulama: ${expectedComponent}`,
    analyze: `Çözümleme: ${c.causal} Dayanaklar: ${c.facts.join('; ')}.`,
    evaluate: `Değerlendirme: ${c.facts.join('; ')} görüşü destekler. Sınır: ${c.counter} Alternatif: ${c.alternative}`,
    create: `Felsefi soru örneği: ${c.question} (${conceptA} ile ${conceptB} ilişkisi.) ${c.thoughtExperiment}`,
  };
  const scenarioTasks: Record<string, string> = {
    understand: `Metindeki “${c.problem}” sorununu açıklayınız ve metinden bir dayanak seçiniz. Yaklaşım: “${c.solution}” Bu yaklaşımın hangi soruyu ele aldığını belirtiniz.`,
    apply: `Metindeki “${c.problem}” sorununa uygun kavramı uygulayınız; somut bir dayanakla bir görüşü savununuz.`,
    analyze: `Metindeki “${c.problem}” sorununu öncül ve sonuçlarıyla çözümleyiniz; bir görüşün hangi öncüle dayandığını gösteriniz.`,
    evaluate: `Şu yaklaşımı inceleyiniz: “${c.solution}” Güçlü yönünü, sınırını ve değerlendirmek için gereken bilgiyi belirtiniz.`,
    create: `“${c.problem}” sorunu için özgün bir düşünce deneyi geliştiriniz; hangi görüşü sınadığını ve olası sonuçlarını açıklayınız.`,
  };
  const scenarioTask = input.kind === 'scenario' ? `Vaka görevi: ${scenarioTasks[input.level]}` : '';
  const scenarioAnswer = input.kind === 'scenario'
    ? `\nVaka değerlendirmesi: ${expectedComponent} Dayanaklar: ${c.facts.join('; ')}. İlişki: ${c.causal}\nYaklaşım ve olası sonuçları: ${c.solution} Değerlendirmenin sınırı: ${c.counter} Sınama yolu: ${c.check}`
    : '';
  const focus = `İnceleme odağı: ${component.description}`;
  let passage = input.kind === 'text' ? c.context : '';
  let text = `${input.kind === 'text' ? '' : `${c.context}\n`}${focus}\n${tasks[input.level]} Yanıtınızı metindeki bilgilerle gerekçelendiriniz. ${variation}${input.kind === 'short' ? ' Kısa ve öz yanıt veriniz.' : ''}`;
  if (scenarioTask) text += `\n${scenarioTask}`;
  let fontSize = 22;
  ({ passage, text, fontSize } = applyExamBepPresentation(input.mode, input.profile, { passage, text, fontSize }, c.concepts));
  return {
    passage,
    text,
    answer: `Bileşen ${component.step} için örnek yanıt: ${expectedComponent}\n${levelEvidence[input.level]}\nVaryant görevi için beklenen yanıt: ${expectedTask}${scenarioAnswer}`,
    criterion: `${focus} • Kavram ve metin kanıtı: %40 • Bileşene ve bilişsel göreve ilişkin gerekçeli açıklama${scenarioTask ? `; ${scenarioTask}` : ''}: %40 • Varyant görevinin (${variation}) gerekçeli tamamlanması: %20. Eşdeğer gerekçeli yanıtlar kabul edilir; sunum biçimi ayrıca puan kaybettirmez.`,
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
