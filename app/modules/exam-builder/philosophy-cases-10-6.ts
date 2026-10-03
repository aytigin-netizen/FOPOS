import type { PhilosophyCase } from './philosophy-exam-case.ts';

// FEL.10.6.1 — Estetik ve sanat felsefesi. Özgün vaka: güzelliğin nesnel mi öznel mi olduğu ve ortak estetik yargının
// imkânı (nesnelci ↔ öznelci) ile “sanat nedir?” sorusu (taklit ölçütü, üçüncü ses). Düşünür adı ve alıntı yok.
// Kapsam notu: güzelliğin hakikat/iyilik/yüce ile ilişkisi ile yaratım ve oyun olarak sanat kuramları bu vakanın dışındadır.
// ÖĞRETMEN İNCELEMESİ BEKLİYOR.
const causal = 'Resmin oranları ve renk uyumu gibi ölçülebilir nitelikler güzelliğin kaynağı sayılırsa, bu nitelikler herkes için aynı olduğundan güzellik yargısı da herkes için aynı olmalıdır; bu görüş güzelliği nesnenin niteliği sayar.';
const subjective = 'Güzellik, izleyenin nesneye verdiği tepkiye bağlıdır; farklı kişilerin farklı tepki vermesi doğaldır. Bu görüş güzel yargısını kişinin hoşlanmasına dayandırır ve herkesi bağlayan bir yargıyı gereksiz kılar.';
const alternative = 'Güzel yargısı ne yalnızca nesnenin ölçülebilir niteliklerine ne de yalnızca kişinin hazzına bağlıdır: güzel diyen kişi, yargısının başkaları için de geçerli olmasını bekler; ama bu beklentiyi ölçülebilir bir kurala bağlamak ya da herkesin onaylayacağını göstermek zorunda değildir. Bu durumda ortak yargı bir kanıt değil, başkalarına yöneltilen bir beklentidir.';
const hiddenPremise = 'Gizli öncül: Güzelliği nesnenin niteliklerinden gelen bir şey herkes için güzeldir; yani nesnel bir niteliğin varlığı herkesin yargısını bağlar. Bu öncül kanıtlanmadan kabul edilirse oran ve uyum gibi niteliklerin gerçekten güzelliği oluşturduğu varsayılmış olur ve insanların aynı eserde ayrışması açıklanmadan bırakılır.';
const opposing = 'Arkadaşın görüşü (güzelliği izleyenin hoşlanmasına bağlayan görüş): Güzel yargısı izleyenin hoşlanmasına dayanır; hoşlanma kişiden kişiye değiştiği için herkesi bağlayan bir yargı olamaz. Gerekçesi: insanların beğenilerinin farklı olması; ancak bu farkın somut örnekleri metinde gösterilmemiştir ve “hoşlanma” ile “güzel bulma”nın aynı şey olduğu da kanıtlanmamıştır. Öğrencinin görüşü ise gerekçesini resmin niteliklerinden alır; ikisinin dayandığı varsayımlar farklıdır.';

export const case1061: PhilosophyCase = {
  context: 'Okulun sanat sergisinde, bir manzara resminin önünde öğrenciler tartışır. Bir öğrenci şöyle der: “Bu resmin oranları ve renk uyumu ona güzellik veriyor; güzellik resmin kendisindedir, bu yüzden herkesin ona güzel demesi gerekir.” Sınıf arkadaşı karşı çıkar: “Güzellik izleyenin gözündedir; bana hoş gelen şey güzeldir, sana hoş gelmeyebilir. Herkesi bağlayan bir güzellik yargısı olamaz.” Üçüncü bir öğrenci yan duvardaki soyut tabloyu göstererek şunu söyler: “Bu tabloda gerçek hiçbir şey taklit edilmemiş; bu yüzden bu bir sanat eseri değildir.” Öğretmen, güzelliğin nesnenin kendisinde mi yoksa izleyende mi olduğu sorusu ile bir şeyin sanat eseri sayılmasının ölçütü sorusunun ayrı felsefi problemler olduğunu belirtir.',
  concepts: 'estetik, hoş, güzellik, sanat, sanat eseri, taklit',
  roles: ['concept', 'problem', 'evaluate', 'inspect'],
  components: [
    'Estetik ve sanat felsefesi güzelliği, sanatı ve estetik yargıları sorgular. Metinde resmin güzel bulunması güzellik ve hoş kavramlarını; sergideki resimlerin sanat eseri sayılıp sayılmayacağı sanat ve sanat eseri kavramlarını gündeme getirir; üçüncü öğrencinin “taklit” sözü sanatın ne olduğuna ilişkin bir kavramdır.',
    'Not: bu vaka güzelliğin hakikat, iyilik ve yüceyle ilişkisini ve sanatı yaratım ya da oyun olarak gören kuramları işlemez; bunların ayrıntısı kapsam dışıdır. İki problem ayrılır: güzelliğin nesnenin kendisinde mi yoksa izleyende mi olduğu ve buna bağlı olarak herkesi bağlayan bir estetik yargının mümkün olup olmadığı birinci problemdir; bir şeyin sanat eseri sayılmasının ölçütünün ne olduğu ikinci problemdir.',
    'Güzelliği nesnenin niteliklerinde gören görüş ortak estetik yargıyı açıklar; güzelliği izleyenin hoşlanmasına bağlayan görüş beğeni farklılıklarını açıklar. Değerlendirme, görüşlerin tutarlılığına ve metindeki durumu açıklama gücüne bakar. “Hoşlanma” ile “güzel bulma” ayrı kavramlardır; bu ayrımın korunup korunmadığı da değerlendirilmelidir. Sanatı taklide bağlayan görüşün müzik ve ebru gibi örnekleri açıklayıp açıklayamadığı da sınanır.',
    'Metinde kavramlar güzellik, hoş, sanat eseri ve taklit; problemler güzelliğin nesnel olup olmadığı ve sanatın ne olduğu; argümanlar ise ilk öğrencinin resmin niteliklerinden herkesi bağlayan bir yargı çıkardığı akıl yürütme ile üçüncü öğrencinin taklit yokluğundan sanat olmadığı sonucuna vardığı akıl yürütmedir. Bu akıl yürütmeler kanıtlanmış değildir; dayandıkları örtük öncüller sınanmalıdır.',
  ],
  field: { name: 'Estetik ve sanat felsefesi', lower: 'estetik ve sanat felsefesi', genitive: 'Estetik ve sanat felsefesinin', dative: 'estetik ve sanat felsefesine', center: 'sanat' },
  claimant: 'güzelliğin resmin kendisinde olduğunu söyleyen öğrencinin',
  claimantShort: 'Güzelliği resmin kendisinde gören öğrencinin',
  opponent: 'sınıf arkadaşının',
  claim: 'Bu resmin oranları ve renk uyumu ona güzellik veriyor; güzellik resmin kendisindedir, bu yüzden herkesin ona güzel demesi gerekir.',
  objection: 'Güzellik izleyenin gözündedir; bana hoş gelen şey güzeldir, sana hoş gelmeyebilir. Herkesi bağlayan bir güzellik yargısı olamaz.',
  conceptDefs: [
    { term: 'estetik', meaning: 'duyusal deneyimi, güzelliği ve sanatı felsefi olarak inceleyen alan', inText: 'resmin güzel olup olmadığı ve bu yargının başkaları için de geçerli olup olmadığı estetiğin sorusudur' },
    { term: 'hoş', meaning: 'kişinin bir şeyden kendi için aldığı haz; kişiden kişiye değişebilen öznel beğeni', inText: 'arkadaşın “bana hoş gelen” sözü kişisel hoşlanmaya dayanır' },
    { term: 'güzellik', meaning: 'bir şeyin estetik bakımdan değerli bulunmasını ifade eden kavram; nesnenin niteliği mi izleyenin yargısı mı olduğu tartışmalıdır', inText: 'öğrencinin “güzellik resmin kendisindedir” sözü güzelliği nesnede arar' },
    { term: 'sanat', meaning: 'insanın duygu ve düşüncelerini çeşitli araçlarla (resim, müzik, şiir vb.) ifade ettiği etkinlik', inText: 'sergideki resimleri yapmak bir sanat etkinliğidir' },
    { term: 'sanat eseri', meaning: 'sanat etkinliğinin ortaya koyduğu ürün', inText: 'manzara resminin ve soyut tablonun sanat eseri sayılıp sayılmayacağı tartışmanın konusudur' },
    { term: 'taklit', meaning: 'bir şeyi olduğu gibi benzetmeye çalışma; sanatı gerçeği taklit etmek olarak gören görüşün temel kavramı', inText: 'üçüncü öğrencinin “gerçek hiçbir şey taklit edilmemiş” sözü bu kavrama dayanır' },
  ],
  slots: { pair: [2, 1], applyPair: [3, 4], single: 5, choicePair: [1, 2], inspect: [2, 1, 3, 5] },
  choiceTopic: 'sınıf arkadaşının sözünü',
  contrastKey: 'İkisi, bir şeyin beğenilmesi konusunda karşılaşır. Ayrım: hoş, kişinin kendi için aldığı haz olarak kişiden kişiye değişebilen öznel beğeniyi öne çıkarır; güzellik ise estetik bakımdan değerli bulmayı ifade ettiği için başkalarının da yargıya katılması beklenen bir iddia taşıyabilir. Bu iddianın haklı olup olmadığı ayrıca tartışılır.',
  singleApplyNote: 'Gündelik örnek öğrenciye aittir; örneğin “taklit” anlamına uygun olması, yani bir şeyi olduğu gibi benzetmeye çalışan bir etkinlik olması beklenir.',
  problems: {
    a: { label: 'Nesnel mi?', text: 'güzelliğin nesnenin kendisinde mi yoksa izleyende mi olduğu ve herkesi bağlayan bir estetik yargının mümkün olup olmadığı' },
    b: { label: 'Sanat nedir?', text: 'bir şeyin sanat eseri sayılmasının ölçütünün ne olduğu' },
    pairLabel: '“güzellik nesnel mi?” ve “sanat nedir?”',
    priorityStem: 'Bu iki problemden (“güzellik nesnel mi?” ve “sanat nedir?”) hangisinin metindeki tartışmada daha öncelikli olduğunu gerekçelendiriniz.',
    typeKey: 'Güzellik ve ortak estetik yargının imkânı problemine girer: güzelliğin nesnede mi izleyende mi olduğu ve herkesi bağlayan bir yargının mümkün olup olmadığı sorulmaktadır; bu, bir şeyin sanat eseri sayılmasının ölçütünü soran “sanat nedir?” sorusundan ayrı bir problemdir.',
    priorityKey: 'Her iki yanıt da gerekçeliyse kabul edilir. “Güzellik” yanıtı: iki öğrencinin asıl ayrıştığı nokta güzelliğin kaynağı ve yargının bağlayıcılığıdır. “Sanat nedir?” yanıtı: bir şeye güzel demeden önce onun sanat eseri sayılıp sayılmadığı belirlenmelidir; ancak bu da tartışmalıdır, çünkü doğa güzel olabilir ve sanat eseri güzel olmayabilir, yani iki soru birbirinden bağımsız ilerleyebilir. Ölçüt: iki problemin ayrımının doğru kullanılması.',
  },
  problem: 'güzelliğin nesnede mi izleyende mi olduğu ve ortak güzellik yargısının imkânı',
  problemKey: 'Problem: resmin oranları ve renk uyumunun güzelliği oluşturup oluşturmadığı ile güzel yargısının yalnızca kişisel hoşlanma olup olmadığı sorusu; bu durum herkesi bağlayan bir estetik yargının mümkün olup olmadığı problemini doğurur.',
  dispute: 'Güzelliğin nesnenin kendisinde mi yoksa izleyenin hoşlanmasında mı olduğu ve herkesi bağlayan bir yargının mümkün olup olmadığı sorusunda ayrışırlar: öğrenci “nesnede, herkesi bağlar”, arkadaşı “izleyende, herkesi bağlamaz” der.',
  facts: ['resmin oranları ve renk uyumunun gözlemlenmesi', 'resmin oranları ve renk uyumunun güzelliğin kaynağı gösterilmesi'],
  causal,
  counter: 'Oran ve renk uyumu bakımından birbirine çok benzeyen iki tablodan birini güzel, ötekini sıradan bulan insanlar vardır; bu durumda ölçülebilir nitelikler tek başına güzelliği belirlemiyor olabilir. Ayrıca farklı kültürlerde farklı oran ve uyum anlayışlarının bulunması, “oran ve uyum” ölçütünün herkes için aynı olmadığını düşündürür.',
  strainedAssumption: 'ölçülebilir niteliklerin tek başına güzelliği oluşturduğu ve herkesin yargısını bağladığı.',
  alternative,
  check: 'Görüş tutarlılık ve açıklama gücü ölçütleriyle sınanır: farklı insanların aynı eserde nasıl hem ayrıştığını hem de çoğu zaman uzlaştığını çelişkiye düşmeden açıklıyor mu, hoş ile güzel arasındaki ayrımı koruyor mu, başka eserler için de geçerli mi?',
  hiddenPremise,
  thoughtExperimentPrompt: 'Hoş ile güzel arasındaki ilişkiyi sınayan bir düşünce deneyi kurunuz; deneyin hangi soruya ışık tuttuğunu belirtiniz.',
  thoughtExperiment: 'Örnek düşünce deneyi: Beğenileri tamamen farklı iki kişi aynı resme bakmaktadır. Biri “bu bana hoş geliyor”, öteki “bu hoşuma gitmiyor ama güzel olduğunu görüyorum” demektedir. İkinci kişinin sözü anlamlıysa hoş ile güzel birbirinden ayrılabilir; anlamsızsa güzel yargısı hoşlanmaya indirgenir. Deney, güzel bulmanın kişisel hoşlanmadan farklı bir yargı olup olmadığı sorusuna ışık tutar. Deney kesin kanıt değil, görüşün sezgilerimizle uyuşma ölçüsünü gösterir.',
  twoExplanations: {
    prompt: 'Metinde bir resmin güzel sayılması hangi görüşlerle açıklanabilir? İki farklı açıklamayı görüşlerini belirterek ayrı ayrı yazınız.',
    labels: ['(güzellik nesnenin niteliğindedir)', '(güzellik izleyenin hoşlanmasına bağlıdır)'],
    texts: [causal, subjective],
  },
  everyday: {
    prompt: 'Gündelik hayattan, ilk bakışta hoşunuza gitmeyen ama sonradan güzel bulduğunuz (ya da tersi) bir eser veya nesne örneği veriniz ve metindeki problemle ilişkisini kurunuz.',
    key: 'Örnek öğrenciye aittir. Beklenen: hoşlanma ile güzel bulma arasındaki ayrımın örnekte gösterilmesi ve “güzelliğin nesnede mi izleyende mi olduğu” problemiyle bağ kurulması; örnekteki değişimin beğeninin mi yoksa güzel yargısının mı değiştiğini gösterip göstermediğinin tartışılması.',
  },
  conclusionQuote: 'herkesin ona güzel demesi gerekir',
  objectionTarget: 'Arkadaşı, güzelliğin nesnede bulunmadığını, güzel yargısının izleyenin hoşlanmasına dayandığını ve bu yüzden herkesi bağlayamayacağını savunur; yani niteliklerden bağlayıcılığa geçişi ve güzelliği nesnenin niteliği saymayı reddeder.',
  argument: { premises: ['Resmin oranları ve renk uyumu ona güzellik verir.', 'Güzelliği nesnenin niteliklerinden gelen bir şey herkes için güzeldir.'], conclusion: 'Herkesin bu resme güzel demesi gerekir.' },
  argumentNote: 'Not: ikinci öncül metinde söylenmemiş, sözün dayandığı örtük öncüldür; yeniden yazma onu görünür kılar. Metinde açıkça verilen yalnız birinci öncül ve sonuçtur.',
  thirdVoice: {
    claim: 'Bu tabloda gerçek hiçbir şey taklit edilmemiş; bu yüzden bu bir sanat eseri değildir.',
    argument: { premises: ['Bu tabloda gerçek hiçbir şey taklit edilmemiştir.', 'Gerçeği taklit etmeyen bir şey sanat eseri sayılamaz.'], conclusion: 'Bu tablo sanat eseri değildir.' },
    implicitNote: 'Örtük öncül, sanat eseri sayılmanın tek ölçütünün gerçeği taklit etmek olduğunu varsayar; bu, sanatı taklit olarak gören görüşün temel iddiasıdır ve tartışmalıdır. Bu öncül kabul edilirse müzik ve ebru gibi gerçek bir şeyi taklit etmeyen ama yaygın biçimde sanat sayılan etkinlikleri de sanat dışı saymak gerekir. Başka sanat anlayışları ölçütü, sanatçının duygu ve düşüncesini ifade etmesi ya da yeni bir şey ortaya koyması gibi nitelikler olarak görür. Soyut tablonun sanat eseri sayılmaması sonucu, örtük öncül kabul edilmedikçe çıkmaz.',
  },
  overrides: [
    {
      role: 'inspect', level: 'evaluate', nth: 1,
      stem: 'Üçüncü öğrencinin akıl yürütmesine, gerçek bir şeyi taklit etmediği hâlde sanat sayılan bir örnek (müzik ya da ebru gibi) gösterilirse öğrenci ne yapabilir? Öğrenci hangi öncülünü değiştirmek zorunda kalır?',
      key: 'Her iki yol da gerekçeliyse kabul edilir. Yol 1: Öğrenci örtük öncülü korur (taklit etmeyen sanat sayılmaz) ve müzik ile ebruyu sanat dışı sayar; bu sonuç, sanatın yaygın kullanımıyla çatışır ve öncülün gereğinden dar olabileceğini düşündürür. Yol 2: Öğrenci örtük öncülü zayıflatır (taklit sanatın yalnız bir yönüdür) ve soyut tablonun sanat sayılmasına izin verir; bu durumda başka bir sanat ölçütü gerekir. Ölçüt: değiştirilecek öncülün doğru gösterilmesi ve seçilen yolun sonuçlarının tartışılması.',
    },
  ],
  definition: { claim: 'Sanat eseri, güzel olan her şeydir.', flaw: 'Bu tanım hem geniştir hem dardır: gün batımı ya da bir dağ manzarası güzel olabilir ama insan etkinliğinin ürünü olmadığı için sanat eseri sayılmaz; öte yandan acıyı ya da çirkinliği anlatmak için yapılmış bazı eserler güzel olmayabilir ama sanat eseri sayılır. Daha iyi bir tanım, sanat eserini güzellikten bağımsız olarak insanın etkinliği ve ifadesiyle ilişkilendirebilmelidir.' },
  otherContextPrompt: 'birbirinden habersiz iki toplum, simetrik desenleri aynı şekilde güzel bulmaktadır',
  otherContext: 'Öğrencinin görüşüne göre bu uyum, simetri gibi nesnel niteliklerin güzelliği oluşturduğunun göstergesidir. Arkadaşının görüşü ise uyumu insanların benzer duyusal yapısıyla ya da benzer alışkanlıklarla açıklayabilir ve bunun yine de herkesi bağlayan bir yargı olduğunu göstermediğini söyler. Bu durum, ortak beğeninin güzelliğin nesnel olduğunu zorunlu kılmadığını ama onu dışlamadığını gösterir; ortak beğeni ile herkesi bağlayan yargı da aynı şey değildir.',
  newReasonExample: 'Birbirinden habersiz birçok kültürde belirli oranların ve simetrinin beğenilmesi, güzelliğin en azından bir kısmının nesnenin niteliklerine bağlı olduğunu düşündüren bir gerekçedir.',
  opposing,
  createArgument: {
    reason1: 'Birbirinden bağımsız birçok kültür belirli oranları ve uyumu benzer biçimde güzel bulur.',
    reason2: 'Bu ortak beğeni, insanların benzer duyusal yapılarıyla da açıklanabildiği için kesin bir kanıt değil, sınanması gereken bir ipucudur.',
  },
  comparison: 'Nesnelci görüş ortak beğenileri ve eserler arasındaki değer ayrımlarını açıklar; ama insanların aynı eserde ayrışmasını ve oran ile uyum ölçütlerinin kültürlere göre değişmesini açıklamakta güçlük çeker. Öznelci görüş beğeni farklılıklarını kolayca açıklar; ama bir eserin ötekinden daha güzel olduğunu söyleyebilmenin ve güzel bulma ile yalnızca hoşlanma arasındaki ayrımın nasıl mümkün olduğunu açıklamakta güçlük çeker. Üstünlük, tutarlılık, açıklama gücü ve sadelik ölçütlerine göre belirlenir; her iki yönde gerekçeli yanıtlar kabul edilir.',
  consistencyCheck: 'Tutarlılık ölçütüne göre: öğrencinin görüşü, insanların aynı eserde ayrışmasını açıklamak zorundadır (yanılanlar mı var, yoksa niteliklerin tek başına yetmediği mi anlaşılmalı); arkadaşın görüşü ise bir eserin ötekinden daha güzel olduğunu söyleyebilmenin ve güzel bulma ile hoşlanma arasındaki ayrımın nasıl mümkün olduğunu açıklamak zorundadır. İki görüş de açıklama borcu taşır; hiçbiri açık bir çelişkiye düşmez.',
  objectionAssessment: 'Güçlü yönü: beğeni farklılıklarını ve kişisel hoşlanmanın rolünü ciddiye alır. Zayıf yönü: hoşlanma ile güzel bulmayı aynı sayar; “bana hoş geliyor” ile “güzel” demenin ayrı yargılar olabileceğini (örneğin hoşlanmadığı hâlde bir eserin güzel olduğunu kabul eden kişi) açıklamaz ve farklı beğenilerin somut örneklerini vermez.',
  conceptMap: 'Örnek: estetik → güzellik (güzelliği inceler); güzellik ↔ hoş (herkesi bağlayan yargı iddiası ile kişisel haz); sanat → sanat eseri (etkinlik ve ürünü); sanat ↔ taklit (sanatın gerçeği taklit etmesi gerekip gerekmediği).',
  answer: 'Estetik ve sanat felsefesi güzelliği, sanatı ve estetik yargıları sorgular; temel kavramları estetik, hoş, güzellik, sanat ve sanat eseridir. Ortak soruları, güzelliğin nesnel mi öznel mi olduğu, ortak estetik yargıların mümkün olup olmadığı ve bir şeyin sanat eseri sayılmasının ölçütüdür.',
  question: 'Bir şeyin güzel olduğunu söylemek, yalnızca hoşuma gittiğini söylemekten farklı mıdır?',
  questionAnswers: [
    'Farklıdır: güzel diyen kişi yargısının başkaları için de geçerli olmasını bekler; hoşlanan kişi böyle bir beklenti taşımaz.',
    'Farklı değildir: güzel demek, kişisel hoşlanmayı başka sözcüklerle söylemektir ve herkesi bağlayan bir yargı yoktur.',
  ],
};
