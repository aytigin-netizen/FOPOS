import type { PhilosophyCase } from './philosophy-exam-case.ts';

// FEL.10.8.1 — Din felsefesi. Özgün vaka: Tanrı’nın varlığına yönelik bir argümanın (düzenden düzenleyene çıkarım) yeterliliği
// ve imanın kanıtla ilişkisi. Üç ses de bir yük taşır: argümana dayanan (teizm), gerekçe göremeyip karar vermeyen (agnostisizm),
// imanı kanıttan bağımsız güven sayan. Hiçbiri doğru ilan edilmez; hiçbir görev öğrenciden kendi inancını beyan etmesini istemez.
// Düşünür adı ve alıntı yok. Kapsam notu: evrenin sonluluğu/sonsuzluğu ve ruhun ölümsüzlüğü bu vakanın dışındadır;
// mucize, vahiy, ibadet ve kutsal anahtar kavramları vakada ele alınmaz.
// ÖĞRETMEN ONAYI: vaka metni Aytekin tarafından onaylandı.
const causal = 'Gökyüzündeki düzen bir sebep olmadan kendiliğinden ortaya çıkamaz; düzenin sebebi, düzeni kuran bilinçli bir varlık olabilir. Bu görüş, düzenin nedenini bilinçli bir düzenleyene bağlar.';
const suspend = 'Gökyüzündeki düzenin başka açıklamaları da düşünülebilir; bu açıklamalar bilinçli bir düzenleyeni gerektirmeyebilir ya da bilgimizin dışında kalabilir. Bu görüş, düzenden bilinçli düzenleyene geçişi gerekçesiz bulur ve karar vermeyi askıda bırakır.';
const alternative = 'Düzen ne doğrudan bir düzenleyene işaret eder ne de düzenleyen ihtimalini dışlar: düzenin kaynağına ilişkin bilgimiz sınırlıysa düzen bir düzenleyen için zayıf ya da güçlü bir delil sayılabilir; delilin ağırlığı tartışmalıdır. Bu durumda sonuç, kesin “vardır” ya da “yoktur” yerine delilin derecesine göre verilir.';
const hiddenPremise = 'Gizli öncül: Düzenli bir görünüm ancak bilinçli bir düzenleyenden gelir. Bu öncül kanıtlanmadan kabul edilirse, düzenin başka kaynaklardan gelebileceği ihtimali baştan dışlanmış olur ve düzenden düzenleyene çıkarım, düzenin kaynağına dair bilgi sahibi olunmadan yapılmış sayılır.';
const opposing = 'Ekin’in görüşü (karar vermeyi askıda bırakan görüş): Düzen görmek düzeni kuranın bilinçli biri olduğunu göstermez; bunun için gerekçe görülmediğinden “vardır” ya da “yoktur” denmemelidir. Gerekçesi: düzenden düzenleyene geçişin kanıtlanmamış olması; ancak “gerekçe göremiyorum” ile “gerekçe yoktur” aynı şey değildir ve karar vermemenin kendisi de gerekçe ister. Deniz’in görüşü ise gerekçesini düzenin varlığından alır; ikisinin dayandığı varsayımlar farklıdır.';

export const case1081: PhilosophyCase = {
  context: 'Okul gezisinde gece gökyüzünü izleyen üç öğrenci tartışıyor. Deniz der ki: “Yıldızların ve gezegenlerin bu düzenli hareketi kendiliğinden olamaz; düzen varsa onu kuran bir Tanrı vardır.” Ekin karşılık verir: “Düzen görmemiz, düzeni kuranın bilinçli biri olduğunu göstermez; bunu bilmek için bir gerekçe göremiyorum, o yüzden Tanrı vardır da demem, yoktur da demem.” Üçüncü öğrenci Fidan ekler: “Bence Tanrı’ya kanıtla ulaşılmaz; iman güvenle ilgilidir, kanıt aramak onu yanlış yere koymaktır.” Öğretmen, Tanrı’nın varlığına yönelik bir argümanın yeterli olup olmadığı ile imanın kanıtla ilişkisinin ayrı felsefi problemler olduğunu belirtir.',
  concepts: 'Tanrı, iman, inanç, agnostisizm',
  roles: ['concept', 'problem', 'evaluate', 'inspect'],
  components: [
    'Din felsefesi dinin konusunu ve kavramlarını, özellikle Tanrı’nın varlığına ilişkin soruları sorgular. Metinde Deniz’in “Tanrı” sözü Tanrı ve teizm kavramlarını; Ekin’in karar vermemesi agnostisizm kavramını; Fidan’ın “iman güvenle ilgilidir” sözü iman ve inanç kavramlarını gündeme getirir. Mucize, vahiy, ibadet ve kutsal bu vakada ele alınmaz; kapsam dışıdır.',
    'Not: bu vaka evrenin sonluluğu ya da sonsuzluğu ve ruhun ölümsüzlüğü problemlerini işlemez; bunlar kapsam dışıdır. Tanrı’nın varlığına ilişkin görüşler arasında teizm, ateizm ve agnostisizm sayılır; metinde teizm ile agnostisizm bulunur, ateizm metinde yer almaz. İki problem ayrılır: düzenden bir düzenleyene çıkan bir argümanın Tanrı’nın varlığını göstermeye yetip yetmediği birinci problemdir; imanın kanıtla ilişkisi, yani Tanrı’nın varlığına ilişkin bir görüşe kanıtla mı yoksa güvenle mi ulaşılacağı ikinci problemdir.',
    'Düzenden düzenleyene geçen argüman düzenin açıklanmasını ister; karar vermeyi askıya alan görüş gerekçesiz çıkarımdan kaçınır; iman görüşü gerekçe aramanın imanın niteliğini değiştirdiğini söyler. Değerlendirme, görüşlerin tutarlılığına ve metindeki durumu açıklama gücüne bakar. Düzenin bir düzenleyeni gösterip göstermediği ile imanın kanıt gerektirip gerektirmediği vakada tartışmalıdır; her görüşün gerekçesi tutarlılık ölçütüyle değerlendirilmelidir.',
    'Metinde kavramlar Tanrı, iman, inanç ve agnostisizm; problemler argümanın yeterliliği ve imanın kanıtla ilişkisi; argümanlar ise Deniz’in düzenden düzenleyene, Ekin’in gerekçe göremeyişten karar vermemeye ve Fidan’ın imanın güven olmasından kanıt aranmamasına vardığı akıl yürütmelerdir. Bu akıl yürütmeler kanıtlanmış değildir; dayandıkları örtük öncüller sınanmalıdır.',
  ],
  field: { name: 'Din felsefesi', lower: 'din felsefesi', genitive: 'Din felsefesinin', dative: 'din felsefesine', center: 'Tanrı' },
  claimant: 'düzenden Tanrı’nın varlığını çıkaran Deniz’in',
  claimantShort: 'Düzenden Tanrı’yı çıkaran Deniz’in',
  opponent: 'Ekin’in',
  claim: 'Yıldızların ve gezegenlerin bu düzenli hareketi kendiliğinden olamaz; düzen varsa onu kuran bir Tanrı vardır.',
  objection: 'Düzen görmemiz, düzeni kuranın bilinçli biri olduğunu göstermez; bunu bilmek için bir gerekçe göremiyorum, o yüzden Tanrı vardır da demem, yoktur da demem.',
  conceptDefs: [
    { term: 'din', meaning: 'insanların Tanrı’ya ya da kutsal saydıkları bir gerçekliğe ilişkin inanç, ibadet ve yaşam biçimlerinden oluşan bütün', inText: 'Deniz’in Tanrı sözü, dinin merkezindeki Tanrı anlayışına dayanır' },
    { term: 'Tanrı', meaning: 'dinlerin merkezindeki, evrenin ve insanın kaynağı ya da ötesi olarak tasarlanan varlık anlayışı', inText: 'Deniz’in düzeni kuran olarak andığı varlık Tanrı kavramıdır' },
    { term: 'iman', meaning: 'bir kişinin Tanrı’ya ve dinin bildirdiklerine duyduğu güven ve bağlılık', inText: 'Fidan’ın “iman güvenle ilgilidir” sözü imanı güven olarak ele alır' },
    { term: 'inanç', meaning: 'bir şeyin doğru olduğunu kabul etme hâli; dinsel olmak zorunda değildir', inText: 'Ekin’in “bilmek için gerekçe göremiyorum” sözü inançla gerekçe arasındaki ilişkiyi gündeme getirir' },
    { term: 'teizm', meaning: 'Tanrı’nın var olduğu görüşü', inText: 'Deniz’in “bir Tanrı vardır” sözü bu görüşe örnektir' },
    { term: 'agnostisizm', meaning: 'Tanrı’nın varlığı ya da yokluğu konusunda kesin bir karara varılamayacağı ya da varılmaması gerektiği görüşü', inText: 'Ekin’in “vardır da demem, yoktur da demem” sözü bu görüşe örnektir' },
  ],
  slots: { pair: [2, 3], applyPair: [4, 5], single: 3, choicePair: [2, 3], inspect: [1, 2, 3, 5] },
  choiceTopic: 'Fidan’ın sözünü',
  contrastKey: 'İkisi, Tanrı’ya ilişkin bir görüşe nasıl ulaşıldığı sorusunda karşılaşır. Kavramlar: inanç, bir şeyin doğru olduğunu kabul etme hâlidir; iman, bir kişinin Tanrı’ya ve dinin bildirdiklerine duyduğu güven ve bağlılıktır. İmanın bir inanç türü mü yoksa kanıttan bağımsız bir güven mi olduğu ve kanıt gerektirip gerektirmediği vakada tartışılan sorudur; anahtar bu soruyu önceden karara bağlamaz.',
  singleApplyNote: 'Gündelik örnek öğrenciye aittir; örneğin “inanç” anlamına uygun olması, yani bir şeyin doğru olduğunu kabul etme hâli olması beklenir. Dinsel olmayan bir örnek de kabul edilir.',
  problems: {
    a: { label: 'Argüman yeterli mi?', text: 'Tanrı’nın varlığına yönelik bir argümanın (düzenden düzenleyene çıkarımın) bu varlığı göstermeye yetip yetmediği' },
    b: { label: 'İman kanıt ister mi?', text: 'imanın kanıtla ilişkisi, yani Tanrı’nın varlığına ilişkin bir görüşe kanıtla mı yoksa güvenle mi ulaşılacağı' },
    pairLabel: '“argüman yeterli mi?” ve “iman kanıt ister mi?”',
    priorityStem: 'Bu iki problemden (“argüman yeterli mi?” ve “iman kanıt ister mi?”) hangisinin metindeki tartışmada daha öncelikli olduğunu gerekçelendiriniz.',
    typeKey: 'Tanrı’nın varlığına yönelik argüman problemine girer: düzenden düzenleyene çıkarımın bu varlığı gösterip göstermediği sorulmaktadır; bu, imanın kanıtla ilişkisini soran problemden ayrı bir problemdir.',
    priorityKey: 'Her iki yanıt da gerekçeliyse kabul edilir. “Argüman yeterli mi?” yanıtı: Deniz ile Ekin’in doğrudan ayrıştığı nokta düzenden düzenleyene çıkarımdır. “İman kanıt ister mi?” yanıtı: bir argümanın yeterli sayılması, kanıtın ne kadar belirleyici olduğuna bağlıdır; ancak bu da tartışmalıdır, çünkü bir argüman imanın kanıt isteyip istemediği sorusu çözülmeden de değerlendirilebilir; yani iki soru birbirinden bağımsız ilerleyebilir. Ölçüt: iki problemin ayrımının doğru kullanılması.',
  },
  problem: 'Tanrı’nın varlığına yönelik argümanın yeterliliği ve imanın kanıtla ilişkisi',
  problemKey: 'Problem: gökyüzündeki düzenden bir düzenleyenin varlığına geçilip geçilemeyeceği sorusu; bu durum Tanrı’nın varlığına yönelik bir argümanın bu varlığı gösterip göstermediği problemini doğurur.',
  dispute: 'Düzenin bir düzenleyeni gösterip göstermediği konusunda ayrışırlar: Deniz düzenin Tanrı’ya işaret ettiğini, Ekin ise bunun için gerekçe görmediğini söyler.',
  facts: ['gece gökyüzünde yıldızların ve gezegenlerin düzenli hareket etmesi', 'düzenli bir görünümün bilinçli bir düzenleyenden gelebileceği düşüncesi'],
  causal,
  counter: 'Düzenli görünen her şeyin bilinçli bir düzenleyenden geldiği doğrulanmış değildir: kristallerin ya da mevsimlerin düzeni bilinçli bir düzenleyen gerektirmeden de açıklanabilir. Ayrıca bir düzenleyen varsa, onun düzeninin kaynağı sorusu da sorulabilir.',
  strainedAssumption: 'düzenin ancak bilinçli bir düzenleyenden gelebileceği.',
  alternative,
  check: 'Görüş tutarlılık ve açıklama gücü ölçütleriyle sınanır: düzenden düzenleyene geçişi gerekçelendiriyor mu, düzenin başka açıklamalarını hesaba katıyor mu, karşı görüşlerin (gerekçe göremeyen ile imanı kanıttan bağımsız sayan) yükünü de aynı ölçütle tartıyor mu?',
  hiddenPremise,
  thoughtExperimentPrompt: 'Düzenden bir düzenleyenin varlığına geçişi sınayan bir düşünce deneyi kurunuz; deneyin hangi soruya ışık tuttuğunu belirtiniz.',
  thoughtExperiment: 'Örnek düşünce deneyi: Issız bir kumsalda dalgaların bıraktığı düzenli çizgiler ve taşların bir alfabe gibi dizilmiş hâli görüyorsunuz. Çizgilerin dalgalardan geldiğini biliyorsanız bir düzenleyen aramazsınız; taşlar alfabe gibi dizilmişse aranır. Yani düzen tek başına düzenleyen gerektirmez, düzenin türü ve ona dair bilgimiz de önemlidir. Gökyüzü düzeninin bu türlerden hangisine girdiği ise vakada tartışmalıdır. Deney, düzenden düzenleyene çıkarımın düzenin türüne bağlı olup olmadığı sorusuna ışık tutar. Deney kesin kanıt değil, çıkarımın hangi koşullarda güçlü görünüp hangi koşullarda zayıf kaldığını gösterir.',
  twoExplanations: {
    prompt: 'Metinde gökyüzündeki düzenin nasıl yorumlanabileceği hangi görüşlerle açıklanabilir? İki farklı açıklamayı görüşlerini belirterek ayrı ayrı yazınız.',
    labels: ['(düzen bilinçli bir düzenleyene işaret eder)', '(düzen tek başına bir düzenleyeni göstermez)'],
    texts: [causal, suspend],
  },
  everyday: {
    prompt: 'Gündelik hayattan, bir şeye kanıta bakarak mı yoksa güvenerek mi inandığınız dinsel olmayan bir örnek veriniz (örneğin bir doktora ya da bir habere güvenmek) ve metindeki problemle ilişkisini kurunuz.',
    key: 'Örnek öğrenciye aittir ve dinsel olmayan bir örnek beklenir. Beklenen: inancın kanıta mı güvene mi dayandığının örnekte gösterilmesi ve “imanın kanıtla ilişkisi” problemiyle bağ kurulması; güvenin kanıtla ne zaman desteklendiğinin ya da desteklenmediğinin tartışılması.',
  },
  conclusionQuote: 'düzen varsa onu kuran bir Tanrı vardır',
  objectionTarget: 'Ekin, düzenden düzenleyene çıkarımı kabul etmez; düzenin bilinçli bir düzenleyeni gösterdiğine dair bir gerekçe görmediğini söyler; yani düzenin bilinçli bir düzenleyenden geldiği öncülünü reddeder.',
  argument: { premises: ['Gökyüzündeki düzen kendiliğinden olamaz.', 'Düzenli bir görünüm ancak bilinçli bir düzenleyenden gelir.'], conclusion: 'Düzeni kuran bir Tanrı vardır.' },
  argumentNote: 'Not: ikinci öncül metinde söylenmemiş, sözün dayandığı örtük öncüldür; yeniden yazma onu görünür kılar. Metinde açıkça verilen yalnız birinci öncül ve sonuçtur.',
  thirdVoice: {
    claim: 'Bence Tanrı’ya kanıtla ulaşılmaz; iman güvenle ilgilidir, kanıt aramak onu yanlış yere koymaktır.',
    argument: { premises: ['İman güvenle ilgilidir.', 'Güvenle ilgili olan şey kanıtla temellendirilemez ya da temellendirilmemelidir.'], conclusion: 'Tanrı’ya kanıtla ulaşılmaz; kanıt aramak imanı yanlış yere koyar.' },
    implicitNote: 'Örtük öncül, güvenle ilgili olan her şeyin kanıtla temellendirilemeyeceğini ya da temellendirilmemesi gerektiğini varsayar; bu tartışmalıdır. Güven gündelik hayatta çoğu zaman kanıta dayanır (bir doktora ya da bir habere güvenmek gibi) ve kanıtla desteklenen güven ile desteklenmeyen güven arasındaki fark da sorulabilir. Öte yandan imanın kanıttan bağımsız bir güven olduğu da tartışılabilir bir iddiadır: imanın bu tanımı kabul edilirse sonuç çıkar, kabul edilmezse çıkmaz.',
  },
  overrides: [
    {
      role: 'inspect', level: 'evaluate', nth: 1,
      stem: 'Ekin’in, düzenleyeni gösteren bir gerekçe göremediği için karar vermeme tutumuna vardığı geçiş hangi öncüle dayanır? Bu geçiş, Deniz’in düzenden düzenleyene geçişinden nasıl farklıdır?',
      key: 'Her iki yanıt da gerekçeliyse kabul edilir. Ekin’in örtük öncülü: bir iddiayı destekleyen gerekçe görülmüyorsa karar vermemek gerekir. Bu öncül kabul edilirse “gerekçe göremiyorum” ile “gerekçe yoktur” aynı şey değildir; gerekçeyi yeterince aramamış ya da göremiyor olma ihtimali ayrıca tartışılmalıdır. Deniz’in geçişi düzenden düzenleyene bir sonuç çıkarır; Ekin’in geçişi gerekçe yokluğundan karar vermemeye varır, yani sonuç çıkarmaktan kaçınır. İkisi aynı türden bir atlama değildir: biri bir sonucu, öteki bir tutumu (askıya almayı) savunur ve her biri ayrı bir gerekçe ister. Ölçüt: örtük öncülün doğru gösterilmesi ve iki geçişin farkının ayırt edilmesi.',
    },
    {
      role: 'problem', level: 'create', nth: 1,
      stem: 'Metindeki tartışma, imanın kanıt isteyip istemediği sorusunu doğurur. Bu soruya iki olası yanıt yazınız ve her birini gerekçelendiriniz.',
      key: 'Her iki yanıt da gerekçeliyse kabul edilir. Yanıt 1: İman kanıt ister; çünkü bir şeye güvenmek için çoğu zaman o şeyin güvenilir olduğunu gösteren bir neden gerekir (örneğin bir doktora güvenmek). Bu yanıt güvenin kanıtla desteklenmesini ister, ama hangi türden ve ne kadar kanıtın yeterli sayılacağı sorusunu açık bırakır. Yanıt 2: İman kanıt istemez; iman kanıttan bağımsız bir güven ve bağlılıktır, kanıt aramak imanın niteliğini değiştirir. Bu yanıt Fidan’ın tanımına daha sadıktır, ama imanın hangi koşulda yersiz olabileceğini ve iki farklı imanın nasıl ayırt edileceğini açıklamakta güçlük çeker. Ölçüt: iman ve inanç kavramlarının doğru kullanılması ve güvenin kanıtla ilişkisinin tartışılması.',
    },
  ],
  definition: { claim: 'İman, kanıtsız kabuldür.', flaw: 'Bu tanım imanı kanıt yokluğuyla eşitler ve tartışılan sonucu tanıma yerleştirir: kişi kanıt olarak gördüğü şeye dayanarak iman ediyorsa tanım onu dışarıda bırakır; tersinden, kanıtsız kabul edilen her şey (örneğin söylenti) iman sayılırdı. Aynı sorun tersine de geçerlidir: imanı “kanıta dayanan bilgi” sayan bir tanım da sonucu önceden kurar. Daha iyi bir tanım, imanı kanıtın varlığı ya da yokluğu üzerinden değil, güven ve bağlılık üzerinden kurar ve kanıtla ilişkisini ayrıca sorar.' },
  otherContextPrompt: 'bir araştırmacı, bir kristalin düzenli yapısının bilinçli bir düzenleyenden gelip gelmediğini sormaktadır',
  otherContext: 'Deniz’in görüşüne göre düzenli görünüm bilinçli bir düzenleyeni gösterir; bu durumda kristalin yapısı da bir düzenleyene işaret eder. Kristalin düzeni bilinçli bir düzenleyen olmadan da açıklanabildiği için bu sonuç, görüşün gereğinden geniş olabileceğini düşündürür; görüşü savunan kişi ise gökyüzü düzeni ile kristal düzeninin farklı türden olduğunu söyleyerek sonucu koruyabilir. Her iki yol da gerekçelendirilmelidir.',
  newReasonExample: 'Gökyüzündeki hareketlerin matematiksel olarak hesaplanabilir olması, düzenin rastlantıdan çok bir ilkeye dayandığını düşündüren bir gerekçedir; ancak bir ilkenin bulunması, ilkeyi koyanın bilinçli olduğunu kendiliğinden göstermez.',
  opposing,
  createArgument: {
    reason1: 'Düzenli görünen şeylerin çoğunun arkasında bir ilke ya da sebep bulunur.',
    reason2: 'Ancak bir ilkenin bulunması, o ilkeyi koyanın bilinçli bir Tanrı olduğunu göstermez; ilke bilinçli bir düzenleyen olmadan da var olabilir.',
  },
  comparison: 'Düzen argümanı gökyüzü düzeninden bir düzenleyene çıkarım yapar ve düzenin açıklanmasını ister; ama çıkarımın dayandığı örtük öncülü kanıtlamakta güçlük çeker. Karar vermeyi askıya alan görüş gerekçesiz çıkarımdan kaçınır; ama “gerekçe göremiyorum”un “gerekçe yok” anlamına gelmediğini ve karar vermemenin de bir tutum olduğunu açıklamak zorundadır. İman görüşü gerekçe aramanın imanın niteliğini değiştirdiğini söyler; ama bu tanım kabul edilmezse sonuç çıkmaz. Üstünlük, tutarlılık, açıklama gücü ve sadelik ölçütlerine göre belirlenir; her yönde gerekçeli yanıtlar kabul edilir.',
  consistencyCheck: 'Tutarlılık ölçütüne göre: Deniz’in görüşü, düzenin başka açıklamalarını ve düzenleyenin kendisinin açıklanıp açıklanamayacağını ele almak zorundadır; Ekin’in görüşü, “gerekçe göremiyorum” ile “gerekçe yok” farkını ve karar vermemenin kendi gerekçesini ele almak zorundadır; Fidan’ın görüşü ise imanın tanımının neden kabul edilmesi gerektiğini ve güvenin kanıtla ilişkisini ele almak zorundadır. Üç görüş de açıklama borcu taşır; hiçbiri açık bir çelişkiye düşmez.',
  objectionAssessment: 'Güçlü yönü: düzenden düzenleyene geçişte gerekçenin eksik olduğunu gösterir ve kesin hüküm vermekten kaçınır. Zayıf yönü: “gerekçe göremiyorum” ile “gerekçe yoktur” aynı şey değildir ve karar vermemenin kendisi de gerekçe ister; ayrıca düzenin başka açıklamaları verilmemiştir. Not: bu zayıflık itirazın yanlış olduğunu göstermez; yük iki yönde de gerekçe sunmaktır.',
  conceptMap: 'Örnek: Tanrı → inanç (Tanrı’ya ilişkin görüşler); iman ↔ inanç (güven ile doğru kabul etme); teizm ↔ agnostisizm (vardır diyen ile karar vermeyen); iman ↔ kanıt (kanıtla ilişki tartışmalıdır).',
  answer: 'Din felsefesi dinin konusunu, kavramlarını ve temel problemlerini sorgular; temel kavramları din, Tanrı, iman, inanç, teizm ve agnostisizmdir. Temel problemleri Tanrı’nın varlığına ilişkin görüşler, bu varlığa yönelik argümanların yeterli olup olmadığı ve imanın kanıtla ilişkisidir; evrenin sonluluğu ya da sonsuzluğu ve ruhun ölümsüzlüğü de bu alanın soruları arasındadır, ancak bu vakada işlenmez.',
  question: 'Düzenli bir evren, bir düzenleyenin varlığını gösterir mi?',
  questionAnswers: [
    'Gösterir: düzenin kendiliğinden ortaya çıkması beklenemez; bu yüzden düzenin kaynağı olarak bilinçli bir düzenleyen düşünülür.',
    'Göstermez: düzenin başka kaynakları olabilir ya da kaynağını bilemeyiz; bu yüzden düzenden düzenleyene geçiş gerekçesiz kalır.',
  ],
};
