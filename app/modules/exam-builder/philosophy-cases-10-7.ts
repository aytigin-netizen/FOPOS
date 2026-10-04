import type { PhilosophyCase } from './philosophy-exam-case.ts';

// FEL.10.7.1 — Siyaset felsefesi. Özgün vaka: bir iktidara uyma borcunun kaynağı (güç mü, onay mı) ve iktidarın meşruiyeti ile
// ideal düzen ve ütopya sorusu. İki görüşün çıkarımı farklı türdendir: biri gücü uyma borcu için “yeterli”, öteki onayı “gerekli” sayar.
// Düşünür adı ve alıntı yok. Kapsam notu: devlet biçimleri ve meşruiyet kuramlarının tarihsel ayrıntısı bu vakanın dışındadır.
// ÖĞRETMEN ONAYI: vaka metni Aytekin tarafından onaylandı (kamp yerine kar fırtınası sahnesi, üçüncü ses ütopya savunucusu).
const causal = 'Kuralı koyan kişi uymayanı gerçekten zorlayabiliyorsa düzen sağlanır; bu yüzden gücü elinde tutan yönetim, düzeni sağladığı ölçüde uyulması gereken bir yönetim sayılır. Bu görüş uyma borcunu gücün düzeni sağlama yeteneğine bağlar.';
const consent = 'Bir yönetime uyma borcu, o yönetimin kendisine tabi olacak kişilerin onayını almasından doğar; onay yoksa yönetim yalnızca güç kullanıyordur. Bu görüş uyma borcunu bireyin kendi onayına bağlar.';
const alternative = 'Uyma borcu ne yalnızca zorlayabilme gücünden ne de yalnızca her bireyin tek tek verdiği onaydan doğar: yönetimin kimlerin yararına ve hangi kurallarla işlediği de meşruiyeti etkileyebilir. Bu durumda meşruiyet, güç ya da onay gibi tek bir ölçüte indirgenemez; ölçütlerin birlikte ve derecelendirilerek tartılması gerekir.';
const hiddenPremise = 'Gizli öncül: Uymayanı zorlayabilen ve düzeni sağlayan yönetime uymak gerekir; yani gücün varlığı uyma borcu doğurur. Bu öncül kanıtlanmadan kabul edilirse, bir yönetimin emirleri ile silahlı birinin emirleri arasındaki fark açıklanamaz ve “uymak zorunda olmak” ile “uymak zorunda bırakılmak” aynı şey sayılmış olur.';
const opposing = 'Bora’nın görüşü (uyma borcunu bireyin onayına bağlayan görüş): Zorlayabilmek uymayı gerektirmez; bir yönetime ancak onay verildiyse uymak gerekir. Gerekçesi: zorlama ile uyma borcunun ayrı şeyler olması; ancak onayın hangi koşullarda geçerli sayılacağı (örneğin sessizlik, çıkacak yerin olmaması) metinde gösterilmemiştir ve onay yoksa her fiilî düzenin gayrimeşru olduğu sonucu da gerekçelendirilmemiştir. Ayşe’nin görüşü ise gerekçesini düzenin yokluğunun doğuracağı zarardan alır; ikisinin dayandığı varsayımlar farklıdır.';

export const case1071: PhilosophyCase = {
  context: 'Kar fırtınası bir dağ yolunu kapatmış; aralarında üç öğrenci ile bir öğretmenin de bulunduğu yüz kadar yolcu bir dinlenme tesisinde mahsur kalmıştır ve ortada yetkili kimse yoktur. İlk gece su ve battaniyeyi bir yolcu dağıtmayı üstlenir, sıraya girmeyenleri listenin sonuna yazar. Beşinci gün nedenini soran yeni gelene “burada böyle yapılır” denir. Tesisin öbür ucunda bir grup, gönüllü nöbet listesini kimse zorlamadan sürdürmektedir. Öğrencilerden Ayşe der ki: “Düzen için kuralı koyan ve uymayanı zorlayabilen biri olmalı; yoksa yüz kişi birbirine girer.” Bora karşılık verir: “Zorlayabilmek uymayı gerektirmez; bir yönetime ancak her birey kendi onayını verdiyse uymak zorundadır.” Üçüncü öğrenci Ceren ekler: “Şimdilik günü kurtarıyoruz, ama ideal bir düzen hedefimiz olmazsa şimdikinin iyi mi kötü mü olduğunu neye göre ölçeceğiz?” Öğretmen, bir düzenin gücü ile haklılığının ve toplumun şimdiki düzeni ile ideal düzeni sorularının ayrı felsefi problemler olduğunu belirtir.',
  concepts: 'iktidar, meşruiyet, ütopya, birey, toplum',
  roles: ['concept', 'problem', 'evaluate', 'inspect'],
  components: [
    'Siyaset felsefesi toplumsal yaşamın nasıl düzenleneceğini, iktidarın neye dayandığını ve nasıl bir düzenin istenmesi gerektiğini sorgular. Metinde kuralı koyan yolcunun uymayanı zorlayabilmesi iktidar ve meşruiyet kavramlarını; bireylerin onayı birey ve toplum kavramlarını; Ceren’in ideal düzen sorusu ütopya kavramını gündeme getirir.',
    'Not: bu vaka devlet biçimlerini ve meşruiyet kuramlarının tarihsel ayrıntısını işlemez; bunlar kapsam dışıdır. İki problem ayrılır: bir iktidara uyulması gerekip gerekmediği ve neyin onu meşru kıldığı birinci problemdir; şimdiki düzenin ideal bir düzene göre ölçülüp ölçülmeyeceği ve ideal düzenin ne olması gerektiği ikinci problemdir. İlk gece konan kuralın beşinci gün gerekçesiz tekrar edilmesi, bir düzenin nasıl kurulduğunu ve kurulduktan sonra gerekçesinden kopabildiğini gösterir; bu, devletin kökeni probleminin küçük ölçekli bir örneğidir, ama vaka bu problemi kuramsal olarak ele almaz.',
    'Gücü uyma borcunun kaynağı sayan görüş düzenin sağlanmasını açıklar; onayı kaynak sayan görüş bireyin rolünü ve zorlama ile uyma arasındaki farkı açıklar. Değerlendirme, görüşlerin tutarlılığına ve metindeki durumu açıklama gücüne bakar. Gücün uyma borcu doğurup doğurmadığı ile onayın bunun için gerekli ya da yeterli olup olmadığı vakada tartışmalıdır; her görüşün gerekçesi tutarlılık ölçütüyle değerlendirilmelidir. Ütopya sorusunda ise şimdiki düzeni ideal bir düzene göre ölçmenin gerekip gerekmediği ve ideal düzenin içeriği sınanır.',
    'Metinde kavramlar iktidar, meşruiyet, birey, toplum ve ütopya; problemler iktidarın meşruiyeti ve ideal düzen; argümanlar ise Ayşe’nin zorlayabilmekten uyma borcuna, Bora’nın onaysızlıktan uymama özgürlüğüne ve Ceren’in ölçüt arayışından ideal hedef gereğine vardığı akıl yürütmelerdir. Bu akıl yürütmeler kanıtlanmış değildir; dayandıkları örtük öncüller sınanmalıdır.',
  ],
  field: { name: 'Siyaset felsefesi', lower: 'siyaset felsefesi', genitive: 'Siyaset felsefesinin', dative: 'siyaset felsefesine', center: 'iktidar' },
  claimant: 'düzen için zorlayabilen bir yönetimi şart koşan Ayşe’nin',
  claimantShort: 'Zorlayabilen bir yönetimi şart koşan Ayşe’nin',
  opponent: 'Bora’nın',
  claim: 'Düzen için kuralı koyan ve uymayanı zorlayabilen biri olmalı; yoksa yüz kişi birbirine girer.',
  objection: 'Zorlayabilmek uymayı gerektirmez; bir yönetime ancak her birey kendi onayını verdiyse uymak zorundadır.',
  conceptDefs: [
    { term: 'siyaset', meaning: 'bir toplumun ortak yaşamının ve ortak işlerinin nasıl düzenleneceğine ilişkin etkinlik ve bu konudaki yetki', inText: 'tesisteki su ve battaniye dağıtımını ve kuralları kimin belirleyeceği sorusu siyasetin konusudur' },
    { term: 'iktidar', meaning: 'bir kişi ya da grubun başkalarının davranışını belirleyebilme gücü', inText: 'su ve battaniyeyi dağıtan yolcunun uymayanı listenin sonuna yazabilmesi bir iktidar örneğidir' },
    { term: 'meşruiyet', meaning: 'bir iktidarın emirlerine uyulması gerekip gerekmediği sorulduğunda gündeme gelen kavram; neyin (güç, onay ya da başka bir şeyin) iktidarı meşru kıldığı tartışmalıdır', inText: 'Ayşe ile Bora’nın ayrıştığı nokta, kuralı koyanın emirlerine neden uyulması gerektiğidir' },
    { term: 'ütopya', meaning: 'mevcut düzenden farklı, istenen bir ideal düzen tasarımı', inText: 'Ceren’in “ideal bir düzen hedefi” sözü ütopya kavramına dayanır' },
    { term: 'birey', meaning: 'toplumu oluşturan, kendi istek ve gerekçeleri olan tek tek kişi', inText: 'Bora’nın “her birey kendi onayını verdiyse” sözü bireyin onayına dayanır' },
    { term: 'toplum', meaning: 'bir arada yaşayan ve ortak düzen kuralları paylaşan insanların oluşturduğu bütün', inText: 'tesisteki yüz kadar yolcunun ortak düzeni küçük ölçekli bir toplum örneğidir' },
  ],
  slots: { pair: [2, 1], applyPair: [4, 5], single: 3, choicePair: [1, 2], inspect: [1, 2, 3, 5] },
  choiceTopic: 'Ayşe ile Bora’nın ayrışmasını',
  contrastKey: 'İkisi, bir yönetime uyulması gerekip gerekmediği sorusunda karşılaşır. Kavramlar: iktidar, başkalarının davranışını belirleyebilme gücüdür; meşruiyet, bir iktidarın emirlerine uyulması gerekip gerekmediği sorulduğunda gündeme gelen kavramdır. Gücün meşruiyeti kendiliğinden verip vermediği, yani iktidarın meşru olmadan da var olup olamayacağı vakada tartışılan sorudur; anahtar bu soruyu önceden karara bağlamaz.',
  singleApplyNote: 'Gündelik örnek öğrenciye aittir; örneğin “ütopya” anlamına uygun olması, yani mevcut düzenden farklı, istenen bir ideal düzen tasarımı olması beklenir.',
  problems: {
    a: { label: 'İktidar meşru mu?', text: 'bir iktidarın emirlerine uyulması gerekip gerekmediği ve neyin onu meşru kıldığı' },
    b: { label: 'İdeal düzen gerekli mi?', text: 'şimdiki düzenin ideal bir düzene göre ölçülüp ölçülmeyeceği ve ideal düzenin ne olması gerektiği' },
    pairLabel: '“iktidar meşru mu?” ve “ideal düzen gerekli mi?”',
    priorityStem: 'Bu iki problemden (“iktidar meşru mu?” ve “ideal düzen gerekli mi?”) hangisinin metindeki tartışmada daha öncelikli olduğunu gerekçelendiriniz.',
    typeKey: 'İktidarın kaynağı ve meşruiyeti problemine girer: zorlayabilmenin uyma borcu doğurup doğurmadığı ve neyin bir iktidarı meşru kıldığı sorulmaktadır; bu, şimdiki düzenin ideal bir düzene göre ölçülüp ölçülmeyeceğini soran “ideal düzen ve ütopya” probleminden ayrı bir problemdir.',
    priorityKey: 'Her iki yanıt da gerekçeliyse kabul edilir. “İktidar meşru mu?” yanıtı: Ayşe ile Bora’nın doğrudan ayrıştığı nokta uyma borcunun kaynağıdır ve tesiste kurallar şimdi işlemektedir. “İdeal düzen” yanıtı: şimdiki düzenin iyi ya da kötü olduğu ölçülemiyorsa meşruiyet tartışması da ölçütsüz kalır; ancak bu da tartışmalıdır, çünkü bir düzene uyma borcu ideal bir düzen tasarlanmadan da sorulabilir, yani iki soru birbirinden bağımsız ilerleyebilir. Ölçüt: iki problemin ayrımının doğru kullanılması.',
  },
  problem: 'bir iktidara uyma borcunun kaynağı ve iktidarın meşruiyeti',
  problemKey: 'Problem: tesiste kuralı koyanın uymayanı zorlayabilmesinin ona uyma borcu doğurup doğurmadığı sorusu; bu durum bir iktidarın neye dayanarak uyulmayı hak ettiği, yani iktidarın kaynağı ve meşruiyeti problemini doğurur.',
  dispute: 'Uyma borcunun kaynağı sorusunda ayrışırlar: Ayşe zorlayabilen bir yönetime uyulması gerektiğini, Bora ise yalnızca onay verilen bir yönetime uyulması gerektiğini söyler.',
  facts: ['ilk gece su ve battaniyeyi dağıtan yolcunun kuralı koyması ve uymayanı listenin sonuna yazması', 'yönetimin yokluğunda yüz kişinin birbirine girebileceği öngörüsü'],
  causal,
  counter: 'Tesisin yönetimini ele geçiren ve herkesi yalnızca zorla yöneten biri düzeni sağlasa bile, tesistekilerin bir kısmı ona uymak zorunda olduklarını düşünmez; bu durumda zorlayabilmek tek başına uyma borcunu doğurmuyor olabilir. Ayrıca düzeni sağlayan ama suyu yalnızca kendi yakınlarına dağıtan bir yönetime uyulması gerektiği de açık değildir.',
  strainedAssumption: 'gücün ve düzeni sağlayabilmenin tek başına uyma borcu doğurduğu.',
  alternative,
  check: 'Görüş tutarlılık ve açıklama gücü ölçütleriyle sınanır: güç ile uyma borcu arasındaki ilişkiyi ve onay ile uyma borcu arasındaki ilişkiyi gerekçelendiriyor mu, yönetimin kimin yararına işlediğini hesaba katıyor mu, başka durumlar için de geçerli mi?',
  hiddenPremise,
  thoughtExperimentPrompt: 'Güç ile uyma borcu arasındaki ilişkiyi sınayan bir düşünce deneyi kurunuz; deneyin hangi soruya ışık tuttuğunu belirtiniz.',
  thoughtExperiment: 'Örnek düşünce deneyi: Tesiste iki farklı yönetim düşünün. Birincisi kimsenin onayını almamış ama kuralları kimsenin zararına olmayacak biçimde uygulayan ve düzeni sağlayan bir yönetimdir; ikincisi herkesin onayını almış ama düzeni sağlayamayan bir yönetimdir. Birincisine uymak gerekiyorsa uyma borcu onaya bağlı değildir; ikincisine uymak gerekiyorsa uyma borcu düzeni sağlama gücüne bağlı değildir; ikisine de uymak gerekiyorsa ya da hiçbirine gerekmiyorsa başka bir ölçüt aranmalıdır. Deney, uyma borcunun gücten mi, onaydan mı, yoksa başka bir şeyden mi doğduğu sorusuna ışık tutar. Deney kesin kanıt değil, görüşlerin sezgilerimizle uyuşma ölçüsünü gösterir.',
  twoExplanations: {
    prompt: 'Metinde bir yönetime uyulması gerektiği hangi görüşlerle açıklanabilir? İki farklı açıklamayı görüşlerini belirterek ayrı ayrı yazınız.',
    labels: ['(uyma borcu güçten doğar)', '(uyma borcu onaydan doğar)'],
    texts: [causal, consent],
  },
  everyday: {
    prompt: 'Gündelik hayattan, bir kurala uymanızın nedeninin zorlanmak mı yoksa o kuralı haklı bulmak ve onaylamak mı olduğu bir örnek veriniz ve metindeki problemle ilişkisini kurunuz.',
    key: 'Örnek öğrenciye aittir. Beklenen: uymanın nedeninin zorlanma mı yoksa onay mı olduğunun örnekte gösterilmesi ve “bir iktidara uyma borcunun kaynağı” problemiyle bağ kurulması; örnekte zorlama kalksaydı kişinin kurala yine uyup uymayacağının tartışılması.',
  },
  conclusionQuote: 'kuralı koyan ve uymayanı zorlayabilen biri olmalı',
  objectionTarget: 'Bora, zorlayabilmenin uyma borcu doğurduğunu kabul etmez; bir yönetime uymanın ancak kişinin kendi onayıyla gerektiğini savunur; yani gücün varlığından uyma borcuna geçişi reddeder.',
  argument: { premises: ['Zorlayabilen biri olmazsa yüz kişi birbirine girer.', 'Düzeni zorla sağlayabilen yönetime uymak gerekir.'], conclusion: 'Uymayanı zorlayabilen bir yönetim bulunmalı ve ona uyulmalıdır.' },
  argumentNote: 'Not: ikinci öncül metinde söylenmemiş, sözün dayandığı örtük öncüldür; yeniden yazma onu görünür kılar. Metinde açıkça verilen yalnız birinci öncül ve sonuçtur.',
  thirdVoice: {
    claim: 'Şimdilik günü kurtarıyoruz, ama ideal bir düzen hedefimiz olmazsa şimdikinin iyi mi kötü mü olduğunu neye göre ölçeceğiz?',
    argument: { premises: ['Şimdiki düzenin iyi ya da kötü olduğu ancak bir ölçüte göre söylenebilir.', 'Böyle bir ölçüt ancak ideal bir düzen tasarımından gelebilir.'], conclusion: 'Bir ideal düzen hedefi olmalıdır.' },
    implicitNote: 'Örtük öncül, şimdiki düzenin iyi ya da kötü olduğunu ölçecek tek ölçütün ideal bir düzen tasarımı olduğunu varsayar; bu tartışmalıdır. Ölçüt başka bir kaynaktan, örneğin somut zararlardan, kişilerin temel gereksinimlerinden ya da adalet duygusundan da gelebilir; bu durumda ideal bir düzen tasarlamadan da şimdikini değerlendirmek mümkün olur. Öte yandan ideal bir düzen tasarlamak “kimin ideali?” sorusunu da açar. Hedefin gerekli olduğu sonucu, örtük öncül kabul edilmedikçe çıkmaz.',
  },
  overrides: [
    {
      role: 'inspect', level: 'evaluate', nth: 1,
      stem: 'Bora’nın, onay vermemiş biri için uymak zorunda olmanın söz konusu olmadığı yönündeki geçişi hangi öncüle dayanır? Bu geçiş, Ayşe’nin zorlayabilen yönetime uyulması gerektiği yönündeki geçişinden nasıl farklıdır?',
      key: 'Her iki yanıt da gerekçeliyse kabul edilir. Bora’nın örtük öncülü: uyma borcunun doğması için bireyin kendi onayının gerekli olduğu. Bu öncül kabul edilirse onay vermemiş biri için hiçbir yönetim bağlayıcı olmaz ve onay alınamayan her fiilî düzen gayrimeşru sayılır; bu sonucun kabul edilebilir olup olmadığı tartışmalıdır. Ayşe’nin geçişi gücü uyma borcu için yeterli sayar; Bora’nın geçişi onayı uyma borcu için gerekli sayar. İkisi aynı türden bir atlama değildir: biri “yeterli”, öteki “gerekli” iddiasıdır ve her biri ayrı bir gerekçe ister. Ölçüt: örtük öncülün doğru gösterilmesi ve iki geçişin farkının (yeterli ve gerekli) ayırt edilmesi.',
    },
    {
      role: 'problem', level: 'create', nth: 1,
      stem: 'Metinde yönetime itiraz etmeyen ama açıkça onay da vermeyen kişiler olduğunu düşünelim. Bora’nın ölçütüne göre sessiz kalanın onayı var sayılır mı? İki olası yanıt yazınız ve her birini gerekçelendiriniz.',
      key: 'Her iki yanıt da gerekçeliyse kabul edilir. Yanıt 1: Sessizlik onay sayılır; çünkü kişi itiraz edebilir ya da yönetimden ayrılabilirken bunu yapmamıştır. Bu yanıt onayın örtük de olabileceğini kabul eder, ama kişinin gerçekten itiraz etme ya da ayrılma imkânı olup olmadığı sorusunu (kar fırtınasında tesisten çıkamayan biri için) açık bırakır. Yanıt 2: Sessizlik onay sayılmaz; onayın kişi tarafından bilerek ve isteyerek verilmesi gerekir. Bu yanıt Bora’nın ölçütüne daha sadıktır, ama neredeyse hiçbir yönetimin herkesin açık onayını almadığı için meşru sayılamayacağı sonucunu doğurur. Ölçüt: onay ve birey kavramlarının doğru kullanılması ve sessizliğin onay sayılması ile onay ölçütünün katılığı arasındaki gerilimin tartışılması.',
    },
  ],
  definition: { claim: 'Meşru iktidar, uymayanı zorlayabilen iktidardır.', flaw: 'Bu tanım hem geniştir hem dardır: silahlı bir çete de uymayanı zorlayabilir ama çoğu kişi onun emirlerine uymayı bir borç saymaz; öte yandan zorlama gücü olmayan ama gönüllü olarak uyulan bir düzen (örneğin nöbet listesi) bu tanıma göre meşru olamaz. Daha iyi bir tanım, meşruiyet ile zorlama gücünü birbirinden ayırabilmeli ve meşruiyetin neye dayandığı sorusunu önceden cevaplamamalıdır.' },
  otherContextPrompt: 'tesisteki yönetim düzeni sağlamakta ama suyu yalnızca kendi yakınlarına dağıtmaktadır',
  otherContext: 'Ayşe’nin görüşüne göre düzen sağlanıyorsa ve yönetim uymayanı zorlayabiliyorsa ona uyulması gerekir; yakınlarını kayırması bu görüşte uyma borcunu kendiliğinden ortadan kaldırmaz. Bu sonuç sezgilerle çatışabilir ve görüşün gereğinden geniş olabileceğini düşündürür; görüşü savunan kişi ise “düzen yine de düzensizlikten iyidir” diyerek sonucu koruyabilir. Her iki yol da gerekçelendirilmelidir.',
  newReasonExample: 'Kurallar uygulatılmadığında herkes yalnızca kendi payını düşünür ve ortak kaynaklar hızla tükenir; bu, zorlayabilen bir düzenin ortak yarar sağladığını düşündüren bir gerekçedir.',
  opposing,
  createArgument: {
    reason1: 'Kuralları uygulatan bir düzen olmadığında ortak kaynaklar hızla tükenir.',
    reason2: 'Ancak düzenin yararlı olması ona uyma borcunun gücten doğduğunu göstermez; yararlı bir düzen onayla da kurulabilir.',
  },
  comparison: 'Güç görüşü düzenin nasıl sağlandığını ve kuralların fiilen işlemesini açıklar; ama güçle yönetenin emirleri ile silahlı birinin emirleri arasındaki farkı açıklamakta güçlük çeker. Onay görüşü zorlama ile uyma borcunu ayırır ve bireyin rolünü ciddiye alır; ama onayın nasıl verildiğini ve onay vermeyen azınlığın durumunu açıklamakta güçlük çeker. Üstünlük, tutarlılık, açıklama gücü ve sadelik ölçütlerine göre belirlenir; her iki yönde gerekçeli yanıtlar kabul edilir.',
  consistencyCheck: 'Tutarlılık ölçütüne göre: Ayşe’nin görüşü, zorlayabilen ama kimsenin yararına işlemeyen bir yönetime uyulup uyulmayacağını açıklamak zorundadır; Bora’nın görüşü ise onayın nasıl verildiğini (açık mı, sessizlikle mi) ve onay vermeyen azınlığın durumunu açıklamak zorundadır. İki görüş de açıklama borcu taşır; hiçbiri açık bir çelişkiye düşmez.',
  objectionAssessment: 'Güçlü yönü: zorlanmak ile uymakla yükümlü olmayı birbirinden ayırır ve bireyin rolünü ciddiye alır. Zayıf yönü: onay yoksa uymak zorunda olunmadığını söyleyen görüş, hemen hiçbir düzenin herkesin açık onayını almadığını açıklamak zorundadır; onayın ne sayılacağı (örneğin sessizlik) belirsizdir ve her fiilî düzenin gayrimeşru sayılması sonucu gerekçelendirilmemiştir. Not: bu zayıflık itirazın yanlış olduğunu göstermez; yük iki yönde de gerekçe sunmaktır.',
  conceptMap: 'Örnek: iktidar → meşruiyet (iktidarın uyulmayı hak edip etmediği sorusu); birey ↔ toplum (bireyin onayı ile ortak düzen); meşruiyet ↔ ütopya (şimdiki düzeni ideal bir düzene göre ölçme); iktidar ↔ birey (zorlama ile onay).',
  answer: 'Siyaset felsefesi toplumsal yaşamın nasıl düzenleneceğini, iktidarın neye dayandığını ve nasıl bir düzenin istenmesi gerektiğini sorgular; temel kavramları iktidar, meşruiyet, devlet, birey, toplum ve ütopyadır. Ortak soruları, iktidarın kaynağı ve meşruiyeti, devletin kökeni ve ideal düzen ile ütopyalardır.',
  question: 'Güç, bir yönetime uyma borcu doğurur mu?',
  questionAnswers: [
    'Doğurur: düzeni sağlayabilen bir yönetim olmadan ortak yaşam çöker; bu yüzden gücü elinde tutan ve düzeni sağlayan yönetime uymak gerekir.',
    'Doğurmaz: uyma borcu yönetimin kendisine tabi olanların onayını almasından doğar; yalnızca güce dayanan bir düzen uymayı değil, boyun eğmeyi doğurur.',
  ],
};
