import canonicalCurriculum from '../../data/felsefe_curriculum_2026.json' with { type: 'json' };
import { applyExamBepPresentation } from './exam-bep-presentation.ts';
import { nextParallelOrdinal } from './exam-variant-math.ts';

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
const DATASET_VERSION = '2026.1';
export const PHILOSOPHY_VARIANT_POOL = 10;

type Level = 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';
type Role = 'concept' | 'problem' | 'evaluate' | 'inspect';
type ConceptDef = { term: string; meaning: string; inText: string };

type PhilosophyCase = {
  context: string;
  concepts: string;
  roles: Role[]; // süreç bileşenleriyle aynı sırada
  components: string[]; // öğretmen için bileşen çerçevesi
  claimant: string; // “… sözündeki” biçiminde tamlayan
  opponent: string;
  claim: string;
  objection: string;
  conceptDefs: ConceptDef[]; // [oluş, töz, madde, fenomen, öz]
  existenceProblem: string;
  identityProblem: string;
  problem: string;
  dispute: string;
  facts: [string, string];
  causal: string;
  counter: string;
  alternative: string;
  check: string;
  hiddenPremise: string;
  thoughtExperiment: string;
  argument: { premises: [string, string]; conclusion: string };
  definition: { claim: string; flaw: string };
  otherContextPrompt: string;
  otherContext: string;
  opposing: string;
  comparison: string;
  consistencyCheck: string;
  objectionAssessment: string;
  conceptMap: string;
  answer: string;
  question: string;
};

const cases: Record<string, PhilosophyCase> = {
  'FEL.10.3.1': {
    context: 'Bir öğrenci, buz küpünün eriyip suya, sonra buhara dönüştüğünü izler ve şöyle der: “Biçim sürekli değişse de ona hep ‘su’ diyoruz; demek ki bu değişimin altında değişmeyen bir şey olmalı.” Sınıf arkadaşı karşı çıkar: “Değişmeyen bir şey yok; ‘su’ yalnızca akışın bir anına verdiğimiz bir addır.” Aynı arkadaş, rüyasında gördüğü bir sahnenin “var” sayılıp sayılamayacağını da sorar. Öğretmen, bir şeyin var olup olmadığı sorusu ile var olan şeyin ne olduğu sorusunun ayrı felsefi problemler olduğunu söyler.',
    concepts: 'varlık, oluş, töz, fenomen, madde, öz',
    roles: ['concept', 'problem', 'evaluate', 'inspect'],
    components: [
      'Varlık felsefesi var olanı ve var olmanın anlamını sorgular. Metinde su bir madde örneğidir; buzdan buhara değişen biçimler oluşu, değişse de “su” denmesini sağlayan dayanak ise öz veya töz kavramını gündeme getirir.',
      'İki problem ayrılır: rüya sahnesinin var sayılıp sayılamayacağı varlığın var olup olmadığına; suyun değişen biçimlerinin ardında gerçekte ne olduğu varlığın ne olduğuna ilişkindir.',
      'Değişimin altında kalıcı bir dayanak (töz) bulunduğunu savunan görüş kimliğin korunmasını açıklar; yalnız oluşu esas alan görüş değişimi öne çıkarır. Değerlendirme, görüşlerin tutarlılığına ve metindeki durumu açıklama gücüne bakar.',
      'Metinde kavramlar madde, oluş ve öz/töz; problemler değişim içinde kimliğin korunması ve rüya sahnesinin varlığı; argüman ise öğrencinin “su” adının korunmasından kalıcı bir dayanak çıkardığı akıl yürütmedir. Bu akıl yürütme kanıtlanmış değildir; dayandığı öncüller sınanmalıdır.',
    ],
    claimant: 'buz küpünü izleyen öğrencinin',
    opponent: 'sınıf arkadaşının',
    claim: 'Biçim sürekli değişse de ona hep “su” diyoruz; demek ki bu değişimin altında değişmeyen bir şey olmalı.',
    objection: 'Değişmeyen bir şey yok; “su” yalnızca akışın bir anına verdiğimiz bir addır.',
    conceptDefs: [
      { term: 'oluş', meaning: 'varlığın sürekli değişim ve dönüşüm içinde olması', inText: 'buzun suya, suyun buhara dönüşmesi oluşu gösterir' },
      { term: 'töz', meaning: 'değişen niteliklerin altında kalan, kendi başına var olan kalıcı dayanak', inText: 'öğrencinin “altta değişmeyen bir şey olmalı” sözü bir töz düşüncesidir' },
      { term: 'madde', meaning: 'mekânda yer kaplayan, cisimsel gerçeklik', inText: 'su, buz ve buhar madde örnekleridir' },
      { term: 'fenomen', meaning: 'algılanan görünüş; bir şeyin bize göründüğü biçim', inText: 'buz, su ve buhar suyun bize göründüğü biçimlerdir' },
      { term: 'öz', meaning: 'bir şeyi o şey yapan temel nitelik', inText: '“su” denmesini sağlayan ortak nitelik bir öz olarak düşünülebilir' },
    ],
    existenceProblem: 'rüyada görülen sahnenin “var” sayılıp sayılamayacağı',
    identityProblem: 'suyun değişen biçimlerinin ardında gerçekte ne olduğu',
    problem: 'değişim içinde kimliğin korunması',
    dispute: 'Değişimin altında kalıcı bir dayanak (töz) bulunup bulunmadığı sorusunda ayrışırlar: öğrenci buna “evet”, arkadaşı “hayır, yalnız akış var” der.',
    facts: ['buz küpünün eriyip suya ve buhara dönüşmesi', 'biçim değişirken “su” adının korunması'],
    causal: 'Biçimler değişirken aynı adla anılma, değişimin altında kalıcı bir dayanak (töz) bulunabileceğini düşündürür; bu dayanak kimliğin korunmasını açıklar.',
    counter: 'Her şeyin sürekli oluş olduğunu savunan bir görüş, “aynı su” ifadesinin yalnız dilsel bir alışkanlık olduğunu söyleyebilir; bu durumda kalıcı dayanak varsayımı zorunlu değildir.',
    alternative: 'Kimliği, kalıcı bir töz yerine biçimler arasındaki süreklilik ve ilişkiler açıklıyor olabilir.',
    check: 'Görüş tutarlılık ve açıklama gücü ölçütleriyle sınanır: değişimi ve kimliği çelişkiye düşmeden açıklıyor mu, başka örneklerde de geçerli mi?',
    hiddenPremise: 'Gizli öncül: Aynı adla anılan şeyin altında gerçekten aynı kalan bir dayanak vardır; yani adın korunması, adın gösterdiği şeyin korunduğunu gösterir. Bu öncül kanıtlanmadan kabul edilirse sonuç öncülün içine yerleştirilmiş olur.',
    thoughtExperiment: 'Örnek düşünce deneyi: Bir nesnenin parçaları tek tek değiştirilip sonunda ilk parçalarından hiçbiri kalmasa, nesne yine aynı nesne midir? “Evet” yanıtı kimliğin parçalardan bağımsız bir dayanağa (veya parçalar arası sürekliliğe), “hayır” yanıtı kimliğin parçalara bağlı olduğuna işaret edebilir. Deney kesin kanıt değil, görüşün sezgilerimizle uyuşma ölçüsünü gösterir.',
    argument: { premises: ['Biçim değişse de ona aynı adla “su” denir.', 'Aynı adla anılan şeyin altında aynı kalan bir dayanak vardır.'], conclusion: 'Değişimin altında kalıcı bir dayanak (töz) vardır.' },
    definition: { claim: 'Varlık, yalnızca duyularla algılanabilen şeydir.', flaw: 'Bu tanım çok dardır: su buharı çoğu zaman gözle görülmese de madde olarak var kabul edilir; ayrıca düşünce ve rüya gibi duyusal olmayan durumların varlık statüsü tanım tarafından tartışılmadan dışarıda bırakılır. Daha iyi bir tanım bu karşı durumları keyfî biçimde dışarıda bırakmamalıdır.' },
    otherContextPrompt: 'parçaları zamanla yenilenen bir yapıya, parçalar değişse de aynı ad verilmektedir',
    otherContext: 'Parçaları zamanla yenilenen yapıya aynı ad verilmeye devam edilir. Öğrencinin görüşü burada da kalıcı bir dayanak (töz) arar; arkadaşının görüşü ise adı düzen ve süreklilikle açıklar. Bu durum töz kabulünün her bağlamda zorunlu olmadığını, adın korunmasının süreklilikle de açıklanabileceğini gösterir.',
    opposing: 'Arkadaşın görüşü (oluşu esas alan görüş): Gerçeklik sürekli değişimdir; “su” akışın bir anını sabit gösteren pratik bir adlandırmadır. Gerekçesi: metinde değişmeden kalan bir nitelik gösterilmemiştir. Öğrencinin görüşü ise gerekçesini adın korunmasından alır; ikisinin dayandığı varsayımlar farklıdır.',
    comparison: 'Töz görüşü kimliği iyi açıklar ama gözlenemeyen bir dayanak varsayar; oluş görüşü değişimi iyi açıklar ama kimliğin nasıl korunduğunu açıklamakta güçlük çeker. Üstünlük, tutarlılık, açıklama gücü ve sadelik ölçütlerine göre belirlenir; her iki yönde gerekçeli yanıtlar kabul edilir.',
    consistencyCheck: 'Tutarlılık ölçütüne göre: öğrencinin görüşü, kalıcı dayanağın nasıl bilindiğini açıklamak zorundadır; arkadaşın görüşü ise “aynı su” kullanımının neden tutarlı olduğunu açıklamak zorundadır. İki görüş de bir açıklama borcu taşır; hiçbiri açık bir çelişkiye düşmez.',
    objectionAssessment: 'Güçlü yönü: değişimi ciddiye alır ve adın yalnız adlandırma olabileceğini gösterir. Zayıf yönü: “aynı su” demenin neden tutarlı bir kullanım olduğunu ve kimliğin nasıl korunduğunu açıklamaz.',
    conceptMap: 'Örnek: varlık → madde (cisimsel yön); varlık → oluş (değişim yönü); oluş ↔ töz (değişimin altında kalıcı bir şey olup olmadığı); fenomen → öz (görünüş ile onu o şey yapan nitelik).',
    answer: 'Varlık felsefesi var olanı ve var olmanın ne demek olduğunu sorgular; temel kavramları varlık, varoluş, madde, idea, fenomen, oluş, öz ve tözdür. Ortak soruları görünüş ile asıl gerçeklik, değişim ile kalıcılık arasındaki ilişkidir.',
    question: 'Değişen bir şeyin aynı şey olarak kalmasını sağlayan nedir?',
  },
};

type Entry = { level: Level; stem: (c: PhilosophyCase) => string; key: (c: PhilosophyCase) => string };

const cap = (value: string) => value.charAt(0).toLocaleUpperCase('tr-TR') + value.slice(1);
const def = (c: PhilosophyCase, term: string) => {
  const found = c.conceptDefs.find((item) => item.term === term);
  if (!found) throw new Error(`Kavram tanımı eksik: ${term}`);
  return found;
};

const banks: Record<Role, Entry[]> = {
  concept: [
    { level: 'understand', stem: (c) => `“${def(c, 'oluş').term}” ve “${def(c, 'töz').term}” kavramlarını kendi cümlelerinizle açıklayınız; her birini metinden bir ifadeyle ilişkilendiriniz.`, key: (c) => `Oluş: ${def(c, 'oluş').meaning}. Töz: ${def(c, 'töz').meaning}. Metinle ilişki: ${def(c, 'oluş').inText}; ${def(c, 'töz').inText}.` },
    { level: 'understand', stem: () => 'Varlık felsefesinin neyi sorguladığını, metindeki durumdan bir örnek vererek açıklayınız.', key: (c) => `${c.answer} Metinden örnek: ${c.facts[0]}.` },
    { level: 'apply', stem: (c) => `“${def(c, 'madde').term}” ve “${def(c, 'oluş').term}” kavramlarını metindeki duruma uygulayınız.`, key: (c) => `Madde: ${def(c, 'madde').meaning}; ${def(c, 'madde').inText}. Oluş: ${def(c, 'oluş').meaning}; ${def(c, 'oluş').inText}.` },
    { level: 'apply', stem: (c) => `“${def(c, 'fenomen').term}” kavramını metindeki durumdan ve gündelik hayattan birer örnekle açıklayınız.`, key: (c) => `Fenomen: ${def(c, 'fenomen').meaning}. Metinden örnek: ${def(c, 'fenomen').inText}. Gündelik örnek öğrenciye aittir; örneğin “görünüş” anlamına uygun olması ve görünüşün ardında bir şey sorulabilmesi beklenir.` },
    { level: 'analyze', stem: (c) => `“${def(c, 'töz').term}” ile “${def(c, 'oluş').term}” kavramları arasındaki ilişkiyi çözümleyiniz: Hangi soruda karşılaşırlar, hangi bakımdan ayrılırlar?`, key: (c) => `İkisi değişim ve kimlik sorusunda karşılaşır. Ayrım: oluş ${def(c, 'oluş').meaning} olarak değişimi öne çıkarır; töz ${def(c, 'töz').meaning} olarak değişenin altında kalanı öne çıkarır.` },
    { level: 'analyze', stem: () => 'Metinde “su” adının korunması hangi kavramlarla açıklanabilir? İki farklı açıklamayı kavramlarını belirterek ayrı ayrı yazınız.', key: (c) => `Açıklama 1 (töz/öz): ${c.causal} Açıklama 2 (oluş): ${c.alternative}` },
    { level: 'evaluate', stem: (c) => `“${c.definition.claim}” tanımını kapsayıcılığı açısından değerlendiriniz.`, key: (c) => `Tanım sınaması: ${c.definition.flaw}` },
    { level: 'evaluate', stem: (c) => `Metindeki kimlik sorusunu açıklamak için “${def(c, 'öz').term}” ile “${def(c, 'töz').term}” kavramlarından hangisinin daha uygun olduğunu gerekçelendiriniz.`, key: (c) => `Her iki tercih de gerekçeliyse kabul edilir. Ölçüt: kavramların doğru kullanımı (öz: ${def(c, 'öz').meaning}; töz: ${def(c, 'töz').meaning}) ve gerekçenin metindeki duruma bağlanması.` },
    { level: 'create', stem: () => 'Metindeki kavramlardan en az üçünü kullanarak varlık felsefesine ilişkin bir soru ve bu soruya iki cümlelik bir yanıt yazınız.', key: (c) => `Örnek soru: ${c.question} Örnek yanıt: ${c.causal} Kabul ölçütü: soru varlık felsefesi alanındadır ve en az üç kavram doğru kullanılmıştır.` },
    { level: 'create', stem: () => 'Merkezinde “varlık” olan bir kavram haritasını yazıyla anlatınız: en az dört kavramı ve aralarındaki üç ilişkiyi belirtiniz.', key: (c) => `${c.conceptMap} Kabul ölçütü: en az dört kavram, üç ilişki ve ilişkilerin kısa gerekçesi.` },
  ],
  problem: [
    { level: 'understand', stem: () => 'Metinde geçen iki problemi (“var mı?” ve “nedir?”) birbirinden ayırarak açıklayınız.', key: (c) => `“Var mı?” problemi: ${c.existenceProblem}. “Nedir?” problemi: ${c.identityProblem}.` },
    { level: 'understand', stem: (c) => `Metindeki “${c.problem}” problemini kendi cümlelerinizle anlatınız.`, key: (c) => `Problem: ${c.facts[0]} olurken ${c.facts[1]}; bu durum değişimin altında kalıcı bir şey olup olmadığı sorusunu doğurur.` },
    { level: 'apply', stem: (c) => `${cap(c.existenceProblem)} sorusu hangi problem türüne girer? Gerekçelendiriniz.`, key: () => '“Var mı?” türüne girer: bir şeyin var sayılıp sayılamayacağı sorulmaktadır; bu, o şeyin ne olduğu sorusundan ayrı bir problemdir.' },
    { level: 'apply', stem: () => 'Gündelik hayattan, değişirken aynı adla anılmaya devam eden bir örnek veriniz ve metindeki problemle ilişkisini kurunuz.', key: (c) => `Örnek öğrenciye aittir. Beklenen: örnekte değişen ve aynı kalan öğenin ayrılması ve “${c.problem}” problemiyle bağ kurulması.` },
    { level: 'analyze', stem: (c) => `${cap(c.claimant)} sözündeki gizli öncülü belirtip sınayınız.`, key: (c) => `${c.hiddenPremise} Sınama: ${c.check}` },
    { level: 'analyze', stem: (c) => `${cap(c.opponent)} itirazının, ${c.claimant} sözündeki hangi öncüle yöneldiğini çözümleyiniz.`, key: (c) => `İtiraz şu öncüle yöneliktir: “${c.argument.premises[1]}” Arkadaşı, adın korunmasının altta aynı kalan bir şey göstermediğini, adın yalnız pratik bir adlandırma olduğunu savunur.` },
    { level: 'evaluate', stem: (c) => `${cap(c.claimant)} sonucunun (“değişimin altında değişmeyen bir şey olmalı”), verdiği gerekçeyle ne ölçüde desteklendiğini değerlendiriniz.`, key: (c) => `Gerekçe sonucu kesin kılmaz: ${c.hiddenPremise} Ancak gerekçe boş değildir: ${c.causal} Değerlendirme ölçütü: ${c.check}` },
    { level: 'evaluate', stem: () => '“Var mı?” ve “nedir?” problemlerinden hangisinin metindeki tartışmada daha öncelikli olduğunu gerekçelendiriniz.', key: () => 'Her iki yanıt da gerekçeliyse kabul edilir. “Nedir?” yanıtı: tartışma değişen biçimlerin ardındakini sorar. “Var mı?” yanıtı: önce neyin var sayılacağı belirlenmelidir. Ölçüt: iki problemin ayrımının doğru kullanılması.' },
    { level: 'create', stem: () => 'Parçaları tek tek değiştirilen bir nesne üzerinden kimlik problemini sınayan bir düşünce deneyi kurunuz; deneyin hangi soruya ışık tuttuğunu belirtiniz.', key: (c) => c.thoughtExperiment },
    { level: 'create', stem: () => 'Metindeki problemden hareketle yeni bir felsefi soru yazınız ve bu soruya iki olası yanıt veriniz.', key: (c) => `Örnek soru: ${c.question} Yanıt 1: ${c.causal} Yanıt 2: ${c.alternative}` },
  ],
  evaluate: [
    { level: 'understand', stem: (c) => `${cap(c.claimant)} görüşünü ve ${c.opponent} itirazını kendi cümlelerinizle özetleyiniz.`, key: (c) => `Görüş: ${c.claim} İtiraz: ${c.objection}` },
    { level: 'understand', stem: () => 'Metindeki iki görüşün hangi soruda ayrıştığını belirtiniz.', key: (c) => c.dispute },
    { level: 'apply', stem: (c) => `${cap(c.claimant)} görüşünü şu duruma uygulayınız: ${c.otherContextPrompt}. Görüşe göre sonuç ne olur?`, key: (c) => c.otherContext },
    { level: 'apply', stem: () => 'Tutarlılık ölçütünü metindeki iki görüşe de uygulayınız: hangi görüş hangi noktada açıklama borcu taşır?', key: (c) => c.consistencyCheck },
    { level: 'analyze', stem: () => 'Metindeki iki görüşün dayandığı gerekçeleri ve varsayımları ayrı ayrı çözümleyiniz.', key: (c) => `Öğrencinin görüşü: gerekçe ${c.facts[1]}; varsayım: ${c.hiddenPremise} ${c.opposing}` },
    { level: 'analyze', stem: (c) => `${cap(c.claimant)} görüşüne yöneltilebilecek bir karşı örnek veriniz ve karşı örneğin hangi varsayımı zorladığını belirtiniz.`, key: (c) => `Karşı örnek: ${c.counter} Zorlanan varsayım: aynı adla anılan şeyin altında aynı kalan bir dayanak bulunduğu.` },
    { level: 'evaluate', stem: () => 'Metindeki iki görüşten hangisinin durumu daha iyi açıkladığını açıklama gücü ve sadelik ölçütleriyle gerekçelendiriniz.', key: (c) => `${c.comparison}` },
    { level: 'evaluate', stem: (c) => `${cap(c.opponent)} “${c.objection}” itirazını değerlendiriniz: güçlü ve zayıf yönleri nelerdir?`, key: (c) => c.objectionAssessment },
    { level: 'create', stem: () => 'Metindeki iki görüşü uzlaştıran ya da ikisinin dışında kalan üçüncü bir görüş geliştiriniz; bu görüşü sınayacak bir ölçüt belirtiniz.', key: (c) => `Örnek: ${c.alternative} Ölçüt: ${c.check}` },
    { level: 'create', stem: (c) => `${cap(c.claimant)} görüşünü destekleyecek yeni bir gerekçe (başka bir örnek) üretiniz ve bu gerekçenin sınırını belirtiniz.`, key: (c) => `Örnek gerekçe: ${c.otherContext} Sınır: ${c.counter}` },
  ],
  inspect: [
    { level: 'understand', stem: () => 'Metinde geçen felsefi kavramları belirleyiniz ve her birini bir cümleyle tanımlayınız.', key: (c) => `Kavramlar: madde (${def(c, 'madde').meaning}); oluş (${def(c, 'oluş').meaning}); töz (${def(c, 'töz').meaning}); fenomen (${def(c, 'fenomen').meaning}).` },
    { level: 'understand', stem: () => 'Metindeki problemi ve metinde karşılaşan iki görüşü belirleyiniz.', key: (c) => `Problem: ${c.problem}. Görüş 1: ${c.claim} Görüş 2: ${c.objection}` },
    { level: 'apply', stem: (c) => `${cap(c.claimant)} sözünü öncül ve sonuç olarak yeniden yazınız.`, key: (c) => `Öncül 1: ${c.argument.premises[0]} Öncül 2: ${c.argument.premises[1]} Sonuç: ${c.argument.conclusion}` },
    { level: 'apply', stem: () => 'Metindeki gözlem bilgisi ile felsefi iddiayı ayırarak yazınız.', key: (c) => `Gözlem bilgisi: ${c.facts[0]}. Felsefi iddia: ${c.causal} Gözlem bir olgudur; iddia ise olgunun nasıl açıklanacağına ilişkin sınanması gereken bir yorumdur.` },
    { level: 'analyze', stem: (c) => `${cap(c.claimant)} akıl yürütmesinin hangi öncüle en çok bağlı olduğunu belirleyiniz; bu öncül yanlışsa sonucun ne olacağını yazınız.`, key: (c) => `En çok bağlı olduğu öncül: “${c.argument.premises[1]}” Bu öncül yanlışsa sonuç desteksiz kalır.` },
    { level: 'analyze', stem: () => 'Metindeki kavram, problem ve argümanı ayrı ayrı gösteriniz.', key: (c) => `Kavramlar: ${c.concepts}. Problem: ${c.problem}. Argüman: ${c.argument.premises.join(' ')} Sonuç: ${c.argument.conclusion}` },
    { level: 'evaluate', stem: (c) => `${cap(c.claimant)} akıl yürütmesinin sonucunu kesinleştirmek için hangi ek öncüle ihtiyaç olduğunu belirtiniz ve bu öncülü değerlendiriniz.`, key: (c) => `${c.hiddenPremise} Değerlendirme: ${c.check}` },
    { level: 'evaluate', stem: () => 'Metindeki iki görüşün gerekçelerinden hangisinin metinde daha açık gösterildiğini belirtiniz; açık gösterilmenin doğru olmayı gerektirip gerektirmediğini tartışınız.', key: (c) => `Öğrencinin gerekçesi metinde açıkça gösterilir (${c.facts[1]}); arkadaşın itirazı ise bir iddia olarak kalır, kanıtı gösterilmemiştir. Ancak açık gösterilmek doğru olmak demek değildir: öğrencinin gerekçesi de kanıtlanmamış bir öncüle dayanır. ${c.hiddenPremise}` },
    { level: 'create', stem: () => 'Metne uygun, tek bir iddia ve iki gerekçeden oluşan yeni bir kısa argüman yazınız.', key: (c) => `Örnek: İddia: ${c.alternative} Gerekçe 1: ${c.facts[0]} sürekli değişen biçimlerden oluşur. Gerekçe 2: ${c.opposing}` },
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
