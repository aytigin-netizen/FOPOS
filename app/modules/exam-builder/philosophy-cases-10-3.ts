import type { PhilosophyCase } from './philosophy-exam-case.ts';

// FEL.10.3.1 — Varlık felsefesi. Bu vakanın çıktısı, görev bankası genel şablona çevrilirken değişmemelidir
// (tests/fixtures/philosophy-fel1031-golden.json ile kilitli).
const causal = 'Biçimler değişirken aynı adla anılma, değişimin altında kalıcı bir dayanak (töz) bulunabileceğini düşündürür; bu dayanak kimliğin korunmasını açıklar.';
const alternative = 'Kimliği, kalıcı bir töz yerine biçimler arasındaki süreklilik ve ilişkiler açıklıyor olabilir.';
const check = 'Görüş tutarlılık ve açıklama gücü ölçütleriyle sınanır: değişimi ve kimliği çelişkiye düşmeden açıklıyor mu, başka örneklerde de geçerli mi?';
const hiddenPremise = 'Gizli öncül: Aynı adla anılan şeyin altında gerçekten aynı kalan bir dayanak vardır; yani adın korunması, adın gösterdiği şeyin korunduğunu gösterir. Bu öncül kanıtlanmadan kabul edilirse sonuç öncülün içine yerleştirilmiş olur.';
const otherContext = 'Parçaları zamanla yenilenen yapıya aynı ad verilmeye devam edilir. Öğrencinin görüşü burada da kalıcı bir dayanak (töz) arar; arkadaşının görüşü ise adı düzen ve süreklilikle açıklar. Bu durum töz kabulünün her bağlamda zorunlu olmadığını, adın korunmasının süreklilikle de açıklanabileceğini gösterir.';
const opposing = 'Arkadaşın görüşü (oluşu esas alan görüş): Gerçeklik sürekli değişimdir; “su” akışın bir anını sabit gösteren pratik bir adlandırmadır. Gerekçesi: metinde değişmeden kalan bir nitelik gösterilmemiştir. Öğrencinin görüşü ise gerekçesini adın korunmasından alır; ikisinin dayandığı varsayımlar farklıdır.';

export const case1031: PhilosophyCase = {
  context: 'Bir öğrenci, buz küpünün eriyip suya, sonra buhara dönüştüğünü izler ve şöyle der: “Biçim sürekli değişse de ona hep ‘su’ diyoruz; demek ki bu değişimin altında değişmeyen bir şey olmalı.” Sınıf arkadaşı karşı çıkar: “Değişmeyen bir şey yok; ‘su’ yalnızca akışın bir anına verdiğimiz bir addır.” Aynı arkadaş, rüyasında gördüğü bir sahnenin “var” sayılıp sayılamayacağını da sorar. Öğretmen, bir şeyin var olup olmadığı sorusu ile var olan şeyin ne olduğu sorusunun ayrı felsefi problemler olduğunu söyler.',
  concepts: 'varlık, oluş, töz, fenomen, madde, öz',
  roles: ['concept', 'problem', 'evaluate', 'inspect'],
  components: [
    'Varlık felsefesi var olanı ve var olmanın anlamını sorgular. Metinde su bir madde örneğidir; buzdan buhara değişen biçimler oluşu, değişse de “su” denmesini sağlayan dayanak ise öz veya töz kavramını gündeme getirir.',
    'İki problem ayrılır: rüya sahnesinin var sayılıp sayılamayacağı varlığın var olup olmadığına; suyun değişen biçimlerinin ardında gerçekte ne olduğu varlığın ne olduğuna ilişkindir.',
    'Değişimin altında kalıcı bir dayanak (töz) bulunduğunu savunan görüş kimliğin korunmasını açıklar; yalnız oluşu esas alan görüş değişimi öne çıkarır. Değerlendirme, görüşlerin tutarlılığına ve metindeki durumu açıklama gücüne bakar.',
    'Metinde kavramlar madde, oluş ve öz/töz; problemler değişim içinde kimliğin korunması ve rüya sahnesinin varlığı; argüman ise öğrencinin “su” adının korunmasından kalıcı bir dayanak çıkardığı akıl yürütmedir. Bu akıl yürütme kanıtlanmış değildir; dayandığı öncüller sınanmalıdır.',
  ],
  field: { name: 'Varlık felsefesi', lower: 'varlık felsefesi', genitive: 'Varlık felsefesinin', dative: 'varlık felsefesine', center: 'varlık' },
  claimant: 'buz küpünü izleyen öğrencinin',
  claimantShort: 'Öğrencinin',
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
  slots: { pair: [0, 1], applyPair: [2, 0], single: 3, choicePair: [4, 1], inspect: [2, 0, 1, 3] },
  choiceTopic: 'kimlik sorusunu',
  contrastKey: 'İkisi değişim ve kimlik sorusunda karşılaşır. Ayrım: oluş varlığın sürekli değişim ve dönüşüm içinde olması olarak değişimi öne çıkarır; töz değişen niteliklerin altında kalan, kendi başına var olan kalıcı dayanak olarak değişenin altında kalanı öne çıkarır.',
  singleApplyNote: 'Gündelik örnek öğrenciye aittir; örneğin “görünüş” anlamına uygun olması ve görünüşün ardında bir şey sorulabilmesi beklenir.',
  problems: {
    a: { label: 'Var mı?', text: 'rüyada görülen sahnenin “var” sayılıp sayılamayacağı' },
    b: { label: 'Nedir?', text: 'suyun değişen biçimlerinin ardında gerçekte ne olduğu' },
    pairLabel: '“var mı?” ve “nedir?”',
    priorityStem: '“Var mı?” ve “nedir?” problemlerinden hangisinin metindeki tartışmada daha öncelikli olduğunu gerekçelendiriniz.',
    typeKey: '“Var mı?” türüne girer: bir şeyin var sayılıp sayılamayacağı sorulmaktadır; bu, o şeyin ne olduğu sorusundan ayrı bir problemdir.',
    priorityKey: 'Her iki yanıt da gerekçeliyse kabul edilir. “Nedir?” yanıtı: tartışma değişen biçimlerin ardındakini sorar. “Var mı?” yanıtı: önce neyin var sayılacağı belirlenmelidir. Ölçüt: iki problemin ayrımının doğru kullanılması.',
  },
  problem: 'değişim içinde kimliğin korunması',
  problemKey: 'Problem: buz küpünün eriyip suya ve buhara dönüşmesi olurken biçim değişirken “su” adının korunması; bu durum değişimin altında kalıcı bir şey olup olmadığı sorusunu doğurur.',
  dispute: 'Değişimin altında kalıcı bir dayanak (töz) bulunup bulunmadığı sorusunda ayrışırlar: öğrenci buna “evet”, arkadaşı “hayır, yalnız akış var” der.',
  facts: ['buz küpünün eriyip suya ve buhara dönüşmesi', 'biçim değişirken “su” adının korunması'],
  causal,
  counter: 'Her şeyin sürekli oluş olduğunu savunan bir görüş, “aynı su” ifadesinin yalnız dilsel bir alışkanlık olduğunu söyleyebilir; bu durumda kalıcı dayanak varsayımı zorunlu değildir.',
  strainedAssumption: 'aynı adla anılan şeyin altında aynı kalan bir dayanak bulunduğu.',
  alternative,
  check,
  hiddenPremise,
  thoughtExperimentPrompt: 'Parçaları tek tek değiştirilen bir nesne üzerinden kimlik problemini sınayan bir düşünce deneyi kurunuz; deneyin hangi soruya ışık tuttuğunu belirtiniz.',
  thoughtExperiment: 'Örnek düşünce deneyi: Bir nesnenin parçaları tek tek değiştirilip sonunda ilk parçalarından hiçbiri kalmasa, nesne yine aynı nesne midir? “Evet” yanıtı kimliğin parçalardan bağımsız bir dayanağa (veya parçalar arası sürekliliğe), “hayır” yanıtı kimliğin parçalara bağlı olduğuna işaret edebilir. Deney kesin kanıt değil, görüşün sezgilerimizle uyuşma ölçüsünü gösterir.',
  twoExplanations: {
    prompt: 'Metinde “su” adının korunması hangi kavramlarla açıklanabilir? İki farklı açıklamayı kavramlarını belirterek ayrı ayrı yazınız.',
    labels: ['(töz/öz)', '(oluş)'],
    texts: [causal, alternative],
  },
  everyday: {
    prompt: 'Gündelik hayattan, değişirken aynı adla anılmaya devam eden bir örnek veriniz ve metindeki problemle ilişkisini kurunuz.',
    key: 'Örnek öğrenciye aittir. Beklenen: örnekte değişen ve aynı kalan öğenin ayrılması ve “değişim içinde kimliğin korunması” problemiyle bağ kurulması.',
  },
  conclusionQuote: 'değişimin altında değişmeyen bir şey olmalı',
  objectionTarget: 'Arkadaşı, adın korunmasının altta aynı kalan bir şey göstermediğini, adın yalnız pratik bir adlandırma olduğunu savunur.',
  argument: { premises: ['Biçim değişse de ona aynı adla “su” denir.', 'Aynı adla anılan şeyin altında aynı kalan bir dayanak vardır.'], conclusion: 'Değişimin altında kalıcı bir dayanak (töz) vardır.' },
  definition: { claim: 'Varlık, yalnızca duyularla algılanabilen şeydir.', flaw: 'Bu tanım çok dardır: su buharı çoğu zaman gözle görülmese de madde olarak var kabul edilir; ayrıca düşünce ve rüya gibi duyusal olmayan durumların varlık statüsü tanım tarafından tartışılmadan dışarıda bırakılır. Daha iyi bir tanım bu karşı durumları keyfî biçimde dışarıda bırakmamalıdır.' },
  otherContextPrompt: 'parçaları zamanla yenilenen bir yapıya, parçalar değişse de aynı ad verilmektedir',
  otherContext,
  newReasonExample: otherContext,
  opposing,
  createArgument: { reason1: 'buz küpünün eriyip suya ve buhara dönüşmesi sürekli değişen biçimlerden oluşur.', reason2: opposing },
  comparison: 'Töz görüşü kimliği iyi açıklar ama gözlenemeyen bir dayanak varsayar; oluş görüşü değişimi iyi açıklar ama kimliğin nasıl korunduğunu açıklamakta güçlük çeker. Üstünlük, tutarlılık, açıklama gücü ve sadelik ölçütlerine göre belirlenir; her iki yönde gerekçeli yanıtlar kabul edilir.',
  consistencyCheck: 'Tutarlılık ölçütüne göre: öğrencinin görüşü, kalıcı dayanağın nasıl bilindiğini açıklamak zorundadır; arkadaşın görüşü ise “aynı su” kullanımının neden tutarlı olduğunu açıklamak zorundadır. İki görüş de bir açıklama borcu taşır; hiçbiri açık bir çelişkiye düşmez.',
  objectionAssessment: 'Güçlü yönü: değişimi ciddiye alır ve adın yalnız adlandırma olabileceğini gösterir. Zayıf yönü: “aynı su” demenin neden tutarlı bir kullanım olduğunu ve kimliğin nasıl korunduğunu açıklamaz.',
  conceptMap: 'Örnek: varlık → madde (cisimsel yön); varlık → oluş (değişim yönü); oluş ↔ töz (değişimin altında kalıcı bir şey olup olmadığı); fenomen → öz (görünüş ile onu o şey yapan nitelik).',
  answer: 'Varlık felsefesi var olanı ve var olmanın ne demek olduğunu sorgular; temel kavramları varlık, varoluş, madde, idea, fenomen, oluş, öz ve tözdür. Ortak soruları görünüş ile asıl gerçeklik, değişim ile kalıcılık arasındaki ilişkidir.',
  question: 'Değişen bir şeyin aynı şey olarak kalmasını sağlayan nedir?',
  questionAnswers: [causal, alternative],
};
