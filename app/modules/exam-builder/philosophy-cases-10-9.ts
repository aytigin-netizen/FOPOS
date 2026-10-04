import type { PhilosophyCase } from './philosophy-exam-case.ts';

// FEL.10.9.1 — Bilim felsefesi. Özgün vaka: bir iddianın bilimsel sayılmasının ölçütü (sınanabilirlik, gözlemin kuram yüklülüğü,
// ortak çerçeve) ve gözlem ile kuram arasındaki ilişki. Üç ses de bir yük taşır ve üç geçiş farklı türdendir:
// Kerem sınanabilirliği hem gerekli hem yeterli sayar, Lale yeterliliğini zayıflatır, Mert ölçütü çerçeveye bağlar (betimlemeden norma).
// Hiçbiri doğru ilan edilmez. Düşünür adı ve alıntı yok. Kapsam notu: bilimin tarihsel gelişimi, belirli bilim felsefecilerinin
// kuramları ve “yasa” anahtar kavramı bu vakanın dışındadır.
// ÖĞRETMEN ONAYI: vaka metni Aytekin tarafından onaylandı (dolunay-tohum sahnesi; Mert’in sesi yumuşatılmadı, örtük öncülü sınanır).
const causal = 'Bir iddia gözlemle sınanabiliyorsa doğru ya da yanlış çıkabilir; bu yüzden bilimsel iddiayı bilimsel olmayandan ayıran şey sınanabilirliktir. Bu görüş bilimselliği iddianın sınanabilmesine bağlar.';
const framework = 'Neyin gözlem sayılacağını ve nasıl sınanacağını bilim insanlarının ortak kuramları ve çerçevesi belirler; bu yüzden bir iddianın bilimsel sayılması, içinde değerlendirildiği çerçeveye bağlıdır. Bu görüş bilimselliği iddianın değerlendirildiği ortak çerçeveye bağlar.';
const alternative = 'Bilimsellik tek bir ölçüte indirgenemeyebilir: sınanabilirlik, kuramsal tutarlılık, açıklama gücü ve topluluk içi eleştiri birlikte ve derecelendirilerek tartılabilir. Bu durumda bir iddia “bilimsel” ya da “bilimsel değil” diye kesin ayrılmaz; ölçütlerin ne ölçüde karşılandığına göre değerlendirilir.';
const hiddenPremise = 'Gizli öncül: Gözlem, iddiayı kuramdan bağımsız olarak sınayabilen tarafsız bir hakemdir ve sınanabilirlik bilimsel olmak için hem gerekli hem yeterlidir. Bu öncül kanıtlanmadan kabul edilirse, neyin nasıl gözlendiğinin bir kuramla belirlenmesi ve doğrudan gözlenemeyen kuramsal önerilerin durumu hesaba katılmamış olur.';
const opposing = 'Lale’nin görüşü (gözlemin kuram yüklü olduğunu söyleyen görüş): Gözlem kuramdan bağımsız değildir; bu yüzden gözlemle sınama tek başına bilimselliği belirleyemez. Gerekçesi: neyin ölçüleceğini ve nasıl ölçüleceğini bir kuramın belirlemesi; ancak kuram yüklü bir gözlemin yine de iddiayı sınayamayacağı bundan kendiliğinden çıkmaz ve ölçütün ne olacağı ayrıca gösterilmelidir. Kerem’in görüşü ise gerekçesini iddianın sınanabilir olmasından alır; ikisinin dayandığı varsayımlar farklıdır.';

export const case1091: PhilosophyCase = {
  context: 'Okul bilim şenliğinde bir stant, “dolunayda ekilen tohum daha hızlı büyür” diyor. Jüri üyesi üç öğrenci bu iddianın bilimsel sayılıp sayılmayacağını tartışıyor. Kerem der ki: “Gözlemle sınanabilen bir iddia bilimseldir; sınanamayan bilimsel değildir.” Lale karşılık verir: “Gözlem kuramdan bağımsız değildir; neyi nasıl ölçeceğimizi bir kuram belirler. Bu yüzden gözlemle sınama, bir iddianın bilimsel olup olmadığını tek başına belirleyemez.” Üçüncü öğrenci Mert ekler: “Bilimsel olup olmadığını bilim insanlarının ortak çerçevesi belirler; çerçevenin dışında kalan bir soruya bilimsel ya da değil demek anlamsızdır.” Öğretmen, bilimin ne olduğu ile bilimi oluşturan unsurların (gözlem, hipotez, kuram) ayrı felsefi problemler olduğunu belirtir.',
  concepts: 'bilim, gözlem, kuram, paradigma',
  roles: ['concept', 'problem', 'evaluate', 'inspect'],
  components: [
    'Bilim felsefesi bilimin ne olduğunu, bilimi oluşturan unsurları ve bilimsel bilginin nasıl elde edildiğini sorgular. Metinde standın iddiası bir hipotezdir; Kerem’in ve Lale’nin sözleri gözlem ile kuram kavramlarını; Mert’in “ortak çerçeve” sözü paradigma kavramını gündeme getirir. Bilimin tarihsel gelişimi, bilim dallarının sınıflandırması ve yasa kavramı bu vakada ele alınmaz; kapsam dışıdır.',
    'Not: bu vaka belirli bilim felsefecilerinin kuramlarını ve bilimin tarihsel gelişimini işlemez; bunlar kapsam dışıdır. İki problem ayrılır: bilimi bilim olmayandan neyin ayırdığı, yani bilimin ne olduğu birinci problemdir; bilimi oluşturan unsurlar olan gözlem, hipotez ve kuram arasındaki ilişki, yani gözlemin kuramı sınamaya yetip yetmediği ikinci problemdir.',
    'Sınanabilirlik ölçütü bilimi gözlemle sınama üzerinden ayırır; gözlemin kuram yüklü olduğunu söyleyen görüş bu ölçütün tek başına yetmediğini söyler; çerçeve görüşü ölçütü bilim insanlarının ortak çerçevesine bağlar. Değerlendirme, görüşlerin tutarlılığına ve metindeki durumu açıklama gücüne bakar. Bir iddianın bilimsel sayılması için sınanabilirliğin gerekli ya da yeterli olup olmadığı ve ölçütün çerçeveden bağımsız olup olmadığı vakada tartışmalıdır; her görüşün gerekçesi tutarlılık ölçütüyle değerlendirilmelidir.',
    'Metinde kavramlar bilim, gözlem, kuram ve paradigma; problemler bilimin ne olduğu ve gözlem ile kuram arasındaki ilişki; argümanlar ise Kerem’in sınanabilirlikten bilimselliğe, Lale’nin gözlemin kuram yüklü olmasından ölçüt olamayacağına ve Mert’in çerçeveden ölçütün çerçeve olduğuna vardığı akıl yürütmelerdir. Bu akıl yürütmeler kanıtlanmış değildir; dayandıkları örtük öncüller sınanmalıdır.',
  ],
  field: { name: 'Bilim felsefesi', lower: 'bilim felsefesi', genitive: 'Bilim felsefesinin', dative: 'bilim felsefesine', center: 'bilim' },
  claimant: 'sınanabilirliği ölçüt sayan Kerem’in',
  claimantShort: 'Sınanabilirliği ölçüt sayan Kerem’in',
  opponent: 'Lale’nin',
  claim: 'Gözlemle sınanabilen bir iddia bilimseldir; sınanamayan bilimsel değildir.',
  objection: 'Gözlem kuramdan bağımsız değildir; neyi nasıl ölçeceğimizi bir kuram belirler. Bu yüzden gözlemle sınama, bir iddianın bilimsel olup olmadığını tek başına belirleyemez.',
  conceptDefs: [
    { term: 'bilim', meaning: 'olguları açıklamayı ve anlamayı amaçlayan sistemli bilgi etkinliği; bilimi bilim olmayandan neyin ayırdığı tartışmalıdır', inText: 'standın iddiasının bilimsel sayılıp sayılmayacağı sorusu bilimin ne olduğu sorusudur' },
    { term: 'bilimsel yöntem', meaning: 'bilim insanlarının bilgiye ulaşmak için izlediği yol; hangi adımları içerdiği ve tek bir yöntem olup olmadığı tartışmalıdır', inText: 'Kerem’in “sınanabilen” sözü, bilimsel yöntemin sınama adımına dayanır' },
    { term: 'gözlem', meaning: 'olguları duyularla ya da araçlarla algılayıp kaydetme', inText: 'tohumların büyümesini ölçmek bir gözlemdir' },
    { term: 'hipotez', meaning: 'olguları açıklamak üzere ileri sürülen ve henüz sınanmamış ya da sınanmakta olan önerme', inText: 'standın “dolunayda ekilen tohum daha hızlı büyür” iddiası bir hipotezdir' },
    { term: 'kuram', meaning: 'birbiriyle ilişkili hipotezleri ve açıklamaları bir bütün hâlinde bağlayan açıklama çerçevesi', inText: 'Lale’nin “bir kuram belirler” sözü, gözlemin bir açıklama çerçevesine bağlı olduğunu söyler' },
    { term: 'paradigma', meaning: 'bir bilim topluluğunun belli bir dönemde paylaştığı kuram, yöntem ve soru çerçevesi', inText: 'Mert’in “ortak çerçeve” sözü paradigma kavramına dayanır' },
  ],
  slots: { pair: [4, 2], applyPair: [3, 5], single: 1, choicePair: [4, 5], inspect: [0, 2, 4, 5] },
  choiceTopic: 'Mert’in sözünü',
  contrastKey: 'İkisi, bir iddianın nasıl sınanacağı sorusunda karşılaşır. Kavramlar: gözlem, olguları duyularla ya da araçlarla algılayıp kaydetmedir; kuram, birbiriyle ilişkili hipotezleri ve açıklamaları bir bütün hâlinde bağlayan açıklama çerçevesidir. Gözlemin kuramdan bağımsız yapılıp yapılamayacağı ve gözlemin kuramı sınamaya yetip yetmediği vakada tartışılan sorudur; anahtar bu soruyu önceden karara bağlamaz.',
  singleApplyNote: 'Gündelik örnek öğrenciye aittir; örneğin “bilimsel yöntem” anlamına uygun olması, yani bilgiye ulaşmak için izlenen bir yolu göstermesi beklenir.',
  problems: {
    a: { label: 'Bilim nedir?', text: 'bilimi bilim olmayandan neyin ayırdığı' },
    b: { label: 'Gözlem kuramı sınar mı?', text: 'gözlem, hipotez ve kuram arasındaki ilişki, yani gözlemin kuramı sınamaya yetip yetmediği' },
    pairLabel: '“bilim nedir?” ve “gözlem kuramı sınar mı?”',
    priorityStem: 'Bu iki problemden (“bilim nedir?” ve “gözlem kuramı sınar mı?”) hangisinin metindeki tartışmada daha öncelikli olduğunu gerekçelendiriniz.',
    typeKey: 'Bilimin ne olduğu problemine girer: bir iddianın bilimsel sayılmasının ölçütü sorulmaktadır; bu, bilimi oluşturan unsurlar arasındaki ilişkiyi (gözlemin kuramı sınayıp sınamadığını) soran problemden ayrı bir problemdir.',
    priorityKey: 'Her iki yanıt da gerekçeliyse kabul edilir. “Bilim nedir?” yanıtı: Kerem ile Mert’in ayrıştığı nokta ölçüttür ve standın iddiası bu ölçüte göre değerlendirilir. “Gözlem kuramı sınar mı?” yanıtı: gözlemin kuramdan bağımsız olup olmadığı belirlenmeden sınanabilirlik ölçütü kullanılamaz; ancak bu da tartışmalıdır, çünkü bir ölçüt gözlem ile kuram ilişkisi çözülmeden de önerilebilir; yani iki soru birbirinden bağımsız ilerleyebilir. Ölçüt: iki problemin ayrımının doğru kullanılması.',
  },
  problem: 'bilimin ne olduğu ve gözlem ile kuram arasındaki ilişki',
  problemKey: 'Problem: standın iddiasının bilimsel sayılıp sayılmayacağı sorusu; bu durum bilimi bilim olmayandan ayıran ölçütün ne olduğu, yani bilimin ne olduğu problemini doğurur.',
  dispute: 'Bilimsellik ölçütü konusunda ayrışırlar: Kerem ölçütü gözlemle sınanabilirlik sayar, Lale gözlemin tek başına yetmediğini, Mert ise ölçütün bilim insanlarının ortak çerçevesine bağlı olduğunu söyler.',
  facts: ['standın dolunayda ekilen tohumun daha hızlı büyüdüğünü ileri sürmesi', 'tohumların büyümesinin ölçülerek gözlemlenebilir olması'],
  causal,
  counter: 'Sınanabilirlik her durumda yeterli görünmeyebilir: tek tek sınanabilen ama hiçbir kurama bağlanmamış iddiaların tek başına bilim sayılıp sayılmayacağı açık değildir; öte yandan doğrudan gözlenemeyen bir kuramsal öneri dolaylı ölçümlerle sınanıyorsa bilimsel sayılabilir. Yani ölçüt hem fazla geniş hem fazla dar olabilir.',
  strainedAssumption: 'sınanabilirliğin bilimsel olmak için hem gerekli hem yeterli olduğu.',
  alternative,
  check: 'Görüş tutarlılık ve açıklama gücü ölçütleriyle sınanır: ölçütün hem gerekli hem yeterli olduğunu gerekçelendiriyor mu, gözlem ile kuram ilişkisini hesaba katıyor mu, karşı görüşlerin (gözlemin kuram yüklü olduğunu söyleyen ile çerçeveyi ölçüt sayan) yükünü de aynı ölçütle tartıyor mu?',
  hiddenPremise,
  thoughtExperimentPrompt: 'Gözlemin kuramdan bağımsız olup olmadığını sınayan bir düşünce deneyi kurunuz; deneyin hangi soruya ışık tuttuğunu belirtiniz.',
  thoughtExperiment: 'Örnek düşünce deneyi: Aynı tohum tarlasına iki kişi bakıyor. Biri dolunayın büyümeyi etkilediğini düşünüyor ve büyümeyi dolunay günlerinde ölçüyor; öteki bunun etkisiz olduğunu düşünüyor ve ölçümü rastgele günlere yayıyor. İkisi de aynı tohumlara bakıyor ama farklı şeyleri kaydediyor ve farklı şeyleri anlamlı sayıyor. Gözlem bu kadar kurama bağlıysa gözlem iddiayı sınayamaz; ama iki kişi sonuçlarını birleştirip ortak bir ölçüm yapabiliyorsa gözlem yine de bir sınama işi görebilir. Deney, gözlemin kuramdan ne ölçüde bağımsız olduğu sorusuna ışık tutar. Deney kesin kanıt değil, gözlem ile kuram ilişkisinin iki yönünü gösterir.',
  twoExplanations: {
    prompt: 'Metinde standın iddiasının bilimsel sayılması hangi görüşlerle açıklanabilir? İki farklı açıklamayı görüşlerini belirterek ayrı ayrı yazınız.',
    labels: ['(bilimsellik sınanabilirlikten gelir)', '(bilimsellik ortak çerçeveden gelir)'],
    texts: [causal, framework],
  },
  everyday: {
    prompt: 'Gündelik hayattan, bir iddiayı gözlemle sınadığınız ya da sınayamadığınız bir örnek veriniz (örneğin bir yemek tarifini denemek) ve metindeki problemle ilişkisini kurunuz.',
    key: 'Örnek öğrenciye aittir. Beklenen: iddianın nasıl gözlemle sınandığının ya da neden sınanamadığının örnekte gösterilmesi ve “bilim nedir” ya da “gözlem kuramı sınar mı” problemiyle bağ kurulması; sınamanın hangi kurama ya da beklentiye dayandığının tartışılması.',
  },
  conclusionQuote: 'Gözlemle sınanabilen bir iddia bilimseldir',
  objectionTarget: 'Lale, gözlemin kuramdan bağımsız bir hakem olduğu öncülünü reddeder; neyi nasıl ölçeceğimizi bir kuramın belirlediğini söyler; yani sınamanın bilimselliği tek başına belirlemeye yetmediğini savunur.',
  argument: { premises: ['Bilimsel bir iddia gözlemle sınanabilir olmalıdır.', 'Gözlem, iddiayı kuramdan bağımsız ve tarafsız biçimde sınayabilir.'], conclusion: 'Gözlemle sınanabilen iddia bilimseldir; sınanamayan bilimsel değildir.' },
  argumentNote: 'Not: ikinci öncül metinde söylenmemiş, sözün dayandığı örtük öncüldür; yeniden yazma onu görünür kılar. Metinde açıkça verilen yalnız birinci öncül ve sonuçtur.',
  thirdVoice: {
    claim: 'Bilimsel olup olmadığını bilim insanlarının ortak çerçevesi belirler; çerçevenin dışında kalan bir soruya bilimsel ya da değil demek anlamsızdır.',
    argument: { premises: ['Bilim insanları ortak bir çerçeve içinde çalışır.', 'Bir sözün bilimsel olup olmadığı yalnızca o çerçeveye göre belirlenir.'], conclusion: 'Çerçevenin dışında kalan bir soruya bilimsel ya da değil demek anlamsızdır.' },
    implicitNote: 'Örtük öncül, bilimsellik ölçütünün çerçeveden başka bir şey olmadığını varsayar; bu tartışmalıdır. Bilim insanlarının ortak bir çerçeve içinde çalışması bir olgudur; ölçütün yalnızca bu çerçeveye bağlı olması ise ayrı bir iddiadır. Çerçeve dışı soruya bilimsel ya da değil demek gerçekten anlamsızsa, farklı çerçevelerdeki iddialar (örneğin bir astroloji topluluğunun kendi çerçevesi) karşılaştırılamaz hâle gelir; ama çerçeveler arası karşılaştırma mümkünse çerçeve dışı bir ölçüt de vardır. Bu nedenle ölçütün çerçeveden bağımsız olup olmadığı kabul edilmedikçe sonuç çıkmaz.',
  },
  overrides: [
    {
      role: 'inspect', level: 'evaluate', nth: 1,
      stem: 'Lale’nin, gözlemin kuram yüklü olduğunu söyleyerek gözlemle sınamanın tek başına yetmediği sonucuna vardığı geçiş hangi öncüle dayanır? Bu geçiş, Kerem’in sınanabilirlikten bilimselliğe geçişinden nasıl farklıdır?',
      key: 'Her iki yanıt da gerekçeliyse kabul edilir. Lale’nin örtük öncülü: gözlem kuram yüklüyse gözlemle sınama bir iddiayı bilimsel kılmaya yetmez; yani kuram yüklülük sınamanın yeterliliğini zayıflatır. Bu öncül kabul edilirse kuram yüklü bir gözlemin yine de iddiayı sınayıp sınayamayacağı ayrıca tartışılmalıdır; “gözlem kuramdan bağımsız değildir” ile “gözlem sınama işi göremez” aynı şey değildir. Kerem’in geçişi sınanabilirliği bilimsellik için hem gerekli hem yeterli sayar; Lale’nin geçişi sınanabilirliğin yeterli olmadığını söyler. İkisi aynı türden bir atlama değildir: biri bir ölçütün yeterliliğini savunur, öteki yetersizliğini; her biri ayrı bir gerekçe ister. Ölçüt: örtük öncülün doğru gösterilmesi ve iki geçişin farkının ayırt edilmesi.',
    },
    {
      role: 'problem', level: 'create', nth: 1,
      stem: 'Mert’in ölçütüne göre, bir astroloji topluluğunun kendi ortak çerçevesi içinde astroloji bilimsel sayılır mı? İki olası yanıt yazınız ve her birini gerekçelendiriniz.',
      key: 'Her iki yanıt da gerekçeliyse kabul edilir. Yanıt 1: Sayılır; çünkü Mert’e göre bilimsellik ortak çerçeveye bağlıdır ve çerçeve içinde astroloji de kendi kurallarına göre çalışır. Bu yanıt Mert’in ölçütüne sadıktır, ama bilim ile bilim olmayan arasında dışarıdan bir ayrım yapılamayacağı sonucunu doğurur; bu sonucun kabul edilebilir olup olmadığı tartışmalıdır. Yanıt 2: Sayılmaz; çünkü bir çerçevenin içinde çalışılması o çerçevenin bilimsel olduğunu göstermez, çerçevenin kendisi de eleştiriye ve karşılaştırmaya açık olmalıdır. Bu yanıt çerçeve dışı bir ölçüt kabul eder; bu durumda çerçevenin dışındaki bir soruya bilimsel ya da değil demenin anlamsız olduğu görüşüyle çelişir ve ölçütün ne olduğu açıklanmalıdır. Ölçüt: bilim ve paradigma kavramlarının doğru kullanılması ve çerçeve içi ölçüt ile çerçeve dışı ölçüt arasındaki gerilimin tartışılması.',
    },
  ],
  definition: { claim: 'Bilim, gözlemle sınanabilen bilgidir.', flaw: 'Bu tanım bilimi sınanabilirlikle eşitler ve tartışılan sonucu tanıma yerleştirir: doğrudan gözlenemeyen kuramsal öneriler ve gözlemin kuram yüklü olması hesaba katılmaz; tersinden, gözlemle sınanabilen her bilgi (örneğin tek tek tahminler) bilim sayılırdı. Aynı sorun tersine de geçerlidir: bilimi “bilim topluluğunun kabul ettiği bilgi” sayan bir tanım da sonucu önceden kurar. Daha iyi bir tanım, bilimi tek bir ölçüte indirgemeden kurar ve ölçütün ne olduğunu ayrıca sorar.' },
  otherContextPrompt: 'bir stant, gözlenemeyen çok küçük bir parçacığın varlığını yalnızca dolaylı ölçümlerle ileri sürmektedir',
  otherContext: 'Kerem’in görüşüne göre gözlemle sınanamayan bir iddia bilimsel değildir; bu durumda gözlenemeyen parçacığa ilişkin iddia bilimsel sayılmaz. Dolaylı ölçümlerle sınanabildiği için bu sonuç sezgilerle çatışabilir ve görüşün gereğinden dar olabileceğini düşündürür; görüşü savunan kişi ise dolaylı ölçümün de bir gözlem olduğunu söyleyerek sonucu koruyabilir. Her iki yol da gerekçelendirilmelidir.',
  newReasonExample: 'Sınanabilir iddialar yanlış çıkabildiği için hatalar zamanla düzeltilebilir; bu, sınanabilirliğin bilgiyi geliştirdiğini düşündüren bir gerekçedir; ancak sınanabilir olmak bilimsel olmak için yeterli olmayabilir.',
  opposing,
  createArgument: {
    reason1: 'Sınanabilen iddialar yanlış çıkabilir ve yanlış çıkan iddia ayıklanır.',
    reason2: 'Ancak sınanabilir olmak, iddianın bir kurama bağlandığını ya da bilimsel olduğunu kendiliğinden göstermez; tek tek sınanabilen iddialar da bilim sayılmayabilir.',
  },
  comparison: 'Sınanabilirlik ölçütü bilimi açık ve uygulanabilir bir ölçütle ayırır; ama doğrudan gözlenemeyen kuramsal önerileri ve gözlemin kuram yüklülüğünü açıklamakta güçlük çeker. Kuram yüklülük görüşü gözlemin tarafsız olmadığını gösterir; ama bilimselliğin ölçütünün ne olacağını açıklamakta güçlük çeker. Çerçeve görüşü bilimin topluluk içinde nasıl işlediğini açıklar; ama çerçeveler arasında bilimsel ile bilimsel olmayanı nasıl ayıracağını açıklamakta güçlük çeker. Üstünlük, tutarlılık, açıklama gücü ve sadelik ölçütlerine göre belirlenir; her yönde gerekçeli yanıtlar kabul edilir.',
  consistencyCheck: 'Tutarlılık ölçütüne göre: Kerem’in görüşü, doğrudan gözlenemeyen kuramsal önerileri ve gözlemin kuram yüklülüğünü ele almak zorundadır; Lale’nin görüşü, kuram yüklü gözlemin yine de sınama işi görüp görmediğini ve bilimselliğin ölçütünün ne olacağını ele almak zorundadır; Mert’in görüşü ise çerçeveler arası karşılaştırmanın nasıl yapılacağını ve çerçeve içi ölçütün neden yeterli olduğunu ele almak zorundadır. Üç görüş de açıklama borcu taşır; hiçbiri açık bir çelişkiye düşmez.',
  objectionAssessment: 'Güçlü yönü: gözlemin tarafsız bir hakem olmadığını gösterir ve sınanabilirliğin tek başına yetmediği kuşkusunu yerinde kılar. Zayıf yönü: kuram yüklü gözlemin yine de iddiayı sınayıp sınayamayacağını ve ölçütün ne olacağını söylemez. Not: bu zayıflık itirazın yanlış olduğunu göstermez; yük iki yönde de gerekçe sunmaktır.',
  conceptMap: 'Örnek: bilim → bilimsel yöntem (bilimin nasıl ilerlediği); hipotez ↔ gözlem (sınanan ile sınayan); gözlem ↔ kuram (kuram yüklülük tartışması); kuram ↔ paradigma (tek kuram ile ortak çerçeve).',
  answer: 'Bilim felsefesi bilimin ne olduğunu, bilimi oluşturan unsurları ve bilimsel bilginin nasıl elde edildiğini sorgular; temel kavramları bilim, bilimsel yöntem, gözlem, hipotez, kuram, paradigma ve yasadır. Temel problemleri bilimin ne olduğu ve bilimi oluşturan unsurlardır.',
  question: 'Gözlemle sınanabilmek bir iddiayı bilimsel yapar mı?',
  questionAnswers: [
    'Yapar: gözlemle sınanabilen iddia doğru ya da yanlış çıkabilir; bu yüzden bilimsel iddiayı bilimsel olmayandan ayıran şey sınanabilirliktir.',
    'Yapmaz: gözlem kuramdan bağımsız değildir ve sınanabilir her iddia bilim olmak zorunda değildir; bilimsellik için başka ölçütler de gerekir.',
  ],
};
