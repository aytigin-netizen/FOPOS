import type { PhilosophyCase } from './philosophy-exam-case.ts';

// FEL.10.5.1 — Ahlak felsefesi. Özgün vaka: evrensel ahlak yasasının imkânı (ortak yargı ↔ toplumsal alışkanlık)
// ve özgürlük–sorumluluk (üçüncü ses). Düşünür adı ve alıntı yok; öğretmen incelemesi bekliyor.
// Kapsam notu: erdem, kötü ve vicdan kavramları ile ahlak kuramlarının ayrıntısı bu vakanın dışındadır.
const causal = 'Yalanın her toplumda kötü sayılması, toplumlardan bağımsız bir ahlak yasasının bulunabileceğini düşündürür; bu yasa, farklı toplumlardaki ortak yargıyı açıklar.';
const sharedNeed = 'Toplumlar birlikte yaşamanın güven gerektirdiğini deneyimlediği için benzer kurallara varmış olabilir; bu durumda ortak yargı toplumlardan bağımsız bir yasanın değil, ortak bir ihtiyacın ürünüdür.';
const alternative = 'Ahlaki yargıların bir kısmı toplumlara göre değişirken bir kısmı (örneğin masum birine zarar vermenin yanlışlığı) ortak ihtiyaçlarla ya da ortak ilkelerle açıklanıyor olabilir; bu durumda evrensellik “ya hep ya hiç” değil, ahlak alanının bir bölümüne ilişkin sınanabilir bir iddiadır.';
const hiddenPremise = 'Gizli öncül: Bir yargının her toplumda paylaşılması, o yargının toplumlardan bağımsız bir yasaya dayandığını gösterir; yani ortak kabul evrenselliğin göstergesidir. Bu öncül kanıtlanmadan kabul edilirse ortak kabulün başka nedenleri (ortak ihtiyaçlar, birbirini etkileyen kültürler) baştan dışlanmış olur.';
const opposing = 'Arkadaşın görüşü (ahlakı toplumsal alışkanlığa bağlayan görüş): Neyin iyi sayılacağını her toplum kendi alışkanlıklarıyla belirler; bu yüzden toplumlardan bağımsız bir yasa yoktur. Gerekçesi: ahlaki görüşlerin toplumdan topluma değişmesi; ancak bu değişimin somut örnekleri metinde gösterilmemiştir. Öğrencinin görüşü ise gerekçesini yargının her toplumda paylaşılmasından alır; ikisinin dayandığı varsayımlar farklıdır.';

export const case1051: PhilosophyCase = {
  context: 'Sınıfta yalan söylemenin ahlaki durumu tartışılır. Bir öğrenci şöyle der: “Dünyanın her yerinde yalan söylemek kötü sayılır; demek ki herkes için geçerli, değişmeyen bir ahlak yasası vardır.” Sınıf arkadaşı karşı çıkar: “Bir yargının birçok toplumda paylaşılması onu evrensel yapmaz; her toplum iyiyi ve kötüyü kendi alışkanlıklarıyla belirler. Ahlaki görüşler toplumdan topluma değiştiğine göre evrensel bir ahlak yasası yoktur.” Üçüncü bir öğrenci ise şunu söyler: “Yaptıklarımız yetiştiğimiz koşullar tarafından belirlendiğine göre, kimseyi yaptığı için sorumlu tutamayız.” Öğretmen, evrensel bir ahlak yasasının mümkün olup olmadığı sorusu ile insanın davranışlarında özgür olup olmadığı sorusunun ayrı felsefi problemler olduğunu belirtir.',
  concepts: 'ahlak, etik, iyi, evrensel ahlak yasası, özgürlük, sorumluluk',
  roles: ['concept', 'problem', 'evaluate', 'inspect'],
  components: [
    'Ahlak felsefesi (etik), davranışların iyi ve kötü bakımından değerlendirilmesini ve bu değerlendirmelerin dayanağını sorgular. Metinde yalanın kötü sayılması bir ahlak yargısıdır; bu yargının herkes için geçerli olup olmadığı sorusu etiğin konusudur; üçüncü öğrencinin sözü özgürlük ve sorumluluk kavramlarını gündeme getirir.',
    'Not: bu vaka yalnızca iki temel problemi (evrensel ahlak yasasının imkânı ve özgürlük) işler; erdem, kötü ve vicdan kavramları ile ahlak kuramlarının ayrıntısı kapsam dışıdır. İki problem ayrılır: bütün insanlar için geçerli bir ahlak yasasının mümkün olup olmadığı birinci problemdir; insanın davranışlarında özgür olup olmadığı ve buna bağlı olarak sorumlu tutulup tutulamayacağı ikinci problemdir.',
    'Toplumlardan bağımsız bir ahlak yasasını savunan görüş ahlaki eleştiriye imkân tanır; ahlakı toplumsal alışkanlığa bağlayan görüş ahlaki farklılıkları açıklar. Değerlendirme, görüşlerin tutarlılığına ve metindeki durumu açıklama gücüne bakar. Ahlaki görüşlerin farklı olması (olgu) ile evrensel bir yasanın bulunmaması (değer iddiası) ayrı şeylerdir; bu geçiş de değerlendirilmelidir.',
    'Metinde kavramlar ahlak, iyi, evrensel ahlak yasası, özgürlük ve sorumluluk; problemler evrensel ahlak yasasının imkânı ve özgürlük; argüman ise ilk öğrencinin yalanın her toplumda kötü sayılmasından evrensel bir yasa çıkardığı akıl yürütmedir. Bu akıl yürütme kanıtlanmış değildir; dayandığı örtük öncül sınanmalıdır.',
  ],
  field: { name: 'Ahlak felsefesi', lower: 'ahlak felsefesi', genitive: 'Ahlak felsefesinin', dative: 'ahlak felsefesine', center: 'ahlak' },
  claimant: 'yalanın her yerde kötü sayıldığını söyleyen öğrencinin',
  claimantShort: 'Yalanın her yerde kötü sayıldığını söyleyen öğrencinin',
  opponent: 'sınıf arkadaşının',
  claim: 'Dünyanın her yerinde yalan söylemek kötü sayılır; demek ki herkes için geçerli, değişmeyen bir ahlak yasası vardır.',
  objection: 'Bir yargının birçok toplumda paylaşılması onu evrensel yapmaz; her toplum iyiyi ve kötüyü kendi alışkanlıklarıyla belirler. Ahlaki görüşler toplumdan topluma değiştiğine göre evrensel bir ahlak yasası yoktur.',
  conceptDefs: [
    { term: 'ahlak', meaning: 'insanın davranışlarını iyi–kötü, doğru–yanlış bakımından değerlendirmeye yarayan değer ve kurallar bütünü', inText: 'yalan söylemenin kötü sayılması bir ahlak yargısıdır' },
    { term: 'etik', meaning: 'ahlakı ve ahlaki yargıların dayanağını felsefi olarak inceleyen alan (ahlak felsefesi)', inText: 'yalanın neden kötü sayıldığını ve bu yargının herkes için geçerli olup olmadığını sorgulamak etiğin işidir' },
    { term: 'iyi', meaning: 'ahlaki bakımdan değerli, yapılması ya da olması gereken sayılan şey', inText: 'yalan söylememenin iyi, yalanın kötü sayılması değer yargılarıdır' },
    { term: 'evrensel ahlak yasası', meaning: 'her toplum ve kişi için geçerli olduğu ileri sürülen, toplumlara göre değişmeyen ahlak ilkesi', inText: 'ilk öğrencinin “herkes için geçerli, değişmeyen bir ahlak yasası vardır” sözü bu düşünceyi savunur' },
    { term: 'özgürlük', meaning: 'insanın davranışlarını kendi seçimiyle belirleyebilmesi', inText: 'üçüncü öğrencinin sözü, yetiştiğimiz koşulların davranışlarımızı belirleyip belirlemediği sorusunu, yani özgürlük problemini açar' },
    { term: 'sorumluluk', meaning: 'insanın yaptığı davranışlardan dolayı hesap verebilir sayılması', inText: 'üçüncü öğrenci, kimseyi yaptığı için sorumlu tutamayacağımızı söyler' },
  ],
  slots: { pair: [0, 1], applyPair: [0, 2], single: 5, choicePair: [4, 5], inspect: [0, 3, 4, 5] },
  choiceTopic: 'üçüncü öğrencinin sözünü',
  contrastKey: 'İkisi, davranışların iyi ve kötü bakımından değerlendirilmesi konusunda karşılaşır. Ayrım: ahlak, davranışları değerlendirmeye yarayan değer ve kurallar bütünü olarak değerlendirmenin kendisini; etik ise bu değerlendirmelerin dayanağını felsefi olarak inceleyen alanı öne çıkarır.',
  singleApplyNote: 'Gündelik örnek öğrenciye aittir; örneğin “sorumluluk” anlamına uygun olması, yani kişinin davranışından hesap verebilir sayılması beklenir.',
  problems: {
    a: { label: 'Mümkün mü?', text: 'bütün insanlar için geçerli bir ahlak yasasının mümkün olup olmadığı' },
    b: { label: 'Özgür mü?', text: 'insanın davranışlarında özgür olup olmadığı' },
    pairLabel: '“evrensel yasa mümkün mü?” ve “insan özgür mü?”',
    priorityStem: 'Bu iki problemden (“evrensel yasa mümkün mü?” ve “insan özgür mü?”) hangisinin metindeki tartışmada daha öncelikli olduğunu gerekçelendiriniz.',
    typeKey: 'Evrensel ahlak yasasının imkânı problemine girer: ahlaki bir ilkenin toplumlardan bağımsız olarak herkes için geçerli olup olamayacağı sorulmaktadır; bu, insanın davranışlarında özgür olup olmadığı sorusundan ayrı bir problemdir.',
    priorityKey: 'Her iki yanıt da gerekçeliyse kabul edilir. “Evrensel yasa” yanıtı: metindeki asıl ayrışma, ahlaki yargıların herkes için geçerli olup olmadığıdır. “Özgürlük” yanıtı: sorumluluk ahlaki değerlendirmenin ön koşuluysa, önce insanın davranışlarında özgür olup olmadığı belirlenmelidir. Ölçüt: iki problemin ayrımının doğru kullanılması.',
  },
  problem: 'evrensel bir ahlak yasasının imkânı',
  problemKey: 'Problem: yalan söylemenin her toplumda kötü sayılması, bu ortak yargının toplumlardan bağımsız bir ahlak yasasına mı yoksa ortak alışkanlık ve ihtiyaçlara mı dayandığı sorusunu doğurur; ahlaki görüşlerin toplumdan topluma değişmesi ise evrensel bir yasanın imkânını tartışmalı kılar.',
  dispute: 'Toplumlardan bağımsız, herkes için geçerli bir ahlak yasası bulunup bulunmadığı sorusunda ayrışırlar: öğrenci buna “evet”, arkadaşı “hayır, yalnız toplumsal alışkanlıklar var” der.',
  facts: ['yalan söylemenin ahlaki bakımdan değerlendirilmesi', 'yalan söylemenin her toplumda kötü sayılması'],
  causal,
  counter: 'Yalanın her yerde kötü sayılması, farklı toplumların birlikte yaşamanın benzer koşullarında benzer kurallara varmasıyla da açıklanabilir; bu durumda ortak yargı evrensel bir yasanın değil, ortak bir ihtiyacın ürünü olabilir. Ayrıca “her yerde kötü sayılır” önermesi de sınanmalıdır: bazı toplumlarda belirli yalanlar (örneğin nezaket gereği söylenenler) hoş görülebilir.',
  strainedAssumption: 'ortak kabul gören bir yargının toplumlardan bağımsız bir yasadan kaynaklandığı.',
  alternative,
  check: 'Görüş tutarlılık ve açıklama gücü ölçütleriyle sınanır: ahlaki farklılıkları ve ortak yargıları çelişkiye düşmeden açıklıyor mu, “her toplumda” iddiası örneklerle destekleniyor mu, başka ahlaki yargılar için de geçerli mi?',
  hiddenPremise,
  thoughtExperimentPrompt: 'Evrensel bir ahlak yasası fikrini sınayan bir düşünce deneyi kurunuz; deneyin hangi soruya ışık tuttuğunu belirtiniz.',
  thoughtExperiment: 'Örnek düşünce deneyi: Birbirinden hiç haberi olmayan iki toplum, masum birine zarar vermeyi aynı şekilde yanlış bulmaktadır; üçüncü bir toplum ise buna izin vermektedir. İlk iki toplumun ortak yargısı üçüncüsünü yanlış çıkarmaya yeter mi, yoksa üçü de yalnızca kendi alışkanlığını mı yansıtmaktadır? Deney, bir ahlaki yargının geçerliliğinin toplumların kabulüne mi yoksa bu kabulden bağımsız bir ölçüte mi bağlı olduğunu sorar. Deney kesin kanıt değil, görüşün sezgilerimizle uyuşma ölçüsünü gösterir.',
  twoExplanations: {
    prompt: 'Metinde yalanın her toplumda kötü sayılması hangi görüşlerle açıklanabilir? İki farklı açıklamayı görüşlerini belirterek ayrı ayrı yazınız.',
    labels: ['(evrensel ahlak yasası)', '(ortak ihtiyaç ve toplumsal alışkanlık)'],
    texts: [causal, sharedNeed],
  },
  everyday: {
    prompt: 'Gündelik hayattan, bir ortamda doğru sayılırken bir başkasında yanlış sayılan bir davranış örneği veriniz ve metindeki problemle ilişkisini kurunuz.',
    key: 'Örnek öğrenciye aittir. Beklenen: davranışın bir ortamda iyi, ötekinde kötü sayıldığının gösterilmesi ve “evrensel bir ahlak yasasının imkânı” problemiyle bağ kurulması; bu farkın evrensel yasa olmadığını mı yoksa yalnızca yargıların farklılığını mı gösterdiğinin tartışılması.',
  },
  conclusionQuote: 'herkes için geçerli, değişmeyen bir ahlak yasası vardır',
  objectionTarget: 'Arkadaşı, bir yargının birçok toplumda paylaşılmasının onu evrensel bir yasa yapmadığını; ortak kabulün alışkanlık ya da ortak ihtiyaçla da açıklanabileceğini savunur.',
  argument: { premises: ['Yalan söylemek her toplumda kötü sayılır.', 'Bir yargının her toplumda paylaşılması, o yargının toplumlardan bağımsız bir yasaya dayandığını gösterir.'], conclusion: 'Herkes için geçerli, değişmeyen bir ahlak yasası vardır.' },
  argumentNote: 'Not: ikinci öncül metinde söylenmemiş, sözün dayandığı örtük öncüldür; yeniden yazma onu görünür kılar. Metinde açıkça verilen yalnız birinci öncül ve sonuçtur.',
  thirdVoice: {
    claim: 'Yaptıklarımız yetiştiğimiz koşullar tarafından belirlendiğine göre, kimseyi yaptığı için sorumlu tutamayız.',
    argument: { premises: ['Yaptıklarımız yetiştiğimiz koşullar tarafından belirlenir.', 'Davranışını kendisi belirlemeyen kişi, o davranıştan sorumlu tutulamaz.'], conclusion: 'Kimse yaptığı davranıştan sorumlu tutulamaz.' },
    implicitNote: 'Örtük öncül, sorumluluğun kişinin davranışını kendisinin belirlemesine bağlı olduğunu varsayar; bu öncül geniş ölçüde kabul görür. Asıl tartışma birinci öncülde ve “kendisinin belirlemesi” ifadesinin anlamındadır: koşullar davranışı tümüyle belirler mi, belirliyorsa sorumluluk yine de savunulabilir mi? Bazı görüşler koşullarca belirlenmişlik ile sorumluluğun bağdaşabileceğini savunur; kuşkucu sonuç bu tartışma çözülmeden kesinleşmez.',
  },
  definition: { claim: 'Ahlaklı davranış, yalnızca yasaların gerektirdiği davranıştır.', flaw: 'Bu tanım hem dar hem geniştir: yasada yer almayan ama ahlaken yapılması gereken davranışları (örneğin yardıma muhtaç birine yardım etmek) dışarıda bırakır; yasanın ahlaken yanlış bir davranışı gerektirdiği durumlarda ise o davranışı ahlaklı saymak zorunda kalır. Ayrıca yasanın kendisinin ahlaken doğru olup olmadığı sorusunu tartışmadan ortadan kaldırır. Daha iyi bir tanım ahlakı yasadan ayırabilmelidir.' },
  otherContextPrompt: 'birbirinden habersiz iki toplum, ödünç alınan bir eşyayı geri vermemeyi aynı şekilde yanlış bulmaktadır',
  otherContext: 'Öğrencinin görüşüne göre iki toplumun birbirinden habersiz aynı yargıya varması, toplumlardan bağımsız bir yasanın göstergesidir. Arkadaşının görüşü ise bu uyumu ortak ihtiyaçla ya da benzer alışkanlıkla açıklayabilir (mülkiyete saygı olmadan birlikte yaşamak zordur). Bu durum, ortak yargının evrensel yasa varsayımını zorunlu kılmadığını ama onu dışlamadığını gösterir; hangi açıklamanın daha iyi olduğu sadelik ve kapsam gibi ek ölçütlere bağlıdır.',
  newReasonExample: 'Birbirinden bağımsız gelişmiş toplumların hepsinde masum birine zarar vermenin yasaklanması, ortak bir yasayı düşündüren bir gerekçedir.',
  opposing,
  createArgument: {
    reason1: 'Birbirinden bağımsız toplumlar masum birine zarar vermeyi benzer biçimde yanlış bulur.',
    reason2: 'Bu ortak yargı birlikte yaşamanın ortak ihtiyaçlarıyla da açıklanabildiği için kesin bir kanıt değil, sınanması gereken bir ipucudur.',
  },
  comparison: 'Evrensel yasa görüşü farklı toplumlardaki ortak yargıları açıklar ve bir toplumun uygulamasının yanlış olabileceğini söylemeye (ahlaki eleştiriye) imkân tanır; ama yasanın nasıl bilindiğini açıklamakta güçlük çeker. Toplumsal alışkanlık görüşü ahlaki farklılıkları kolayca açıklar; ama bir uygulamayı ötekinden daha iyi saymanın ve kendi toplumunu eleştirmenin nasıl mümkün olduğunu açıklamakta güçlük çeker. Üstünlük, tutarlılık, açıklama gücü ve sadelik ölçütlerine göre belirlenir; her iki yönde gerekçeli yanıtlar kabul edilir.',
  consistencyCheck: 'Tutarlılık ölçütüne göre: öğrencinin görüşü, toplumlar arasında gerçekten görülen ahlaki farklılıkları açıklamak zorundadır (bunlar yasanın yanlış anlaşılması mı, yoksa yasa yok mu); arkadaşın görüşü ise bir toplumun kendi uygulamalarını eleştirebilmenin nasıl mümkün olduğunu açıklamak zorundadır. İki görüş de açıklama borcu taşır; hiçbiri açık bir çelişkiye düşmez.',
  objectionAssessment: 'Güçlü yönü: ortak bir yargının mutlaka evrensel bir yasaya dayanmayabileceğini, ortak ihtiyaç ya da alışkanlıkla da açıklanabileceğini gösterir. Zayıf yönü: ahlaki görüşlerin farklı olması (olgu), hiçbir görüşün ötekinden daha doğru olmadığı (değer) anlamına gelmez; itiraz bu geçişi açıklamaz ve farklılığın somut örneklerini vermez.',
  conceptMap: 'Örnek: etik → ahlak (ahlakı felsefi olarak inceler); ahlak → iyi (iyi–kötü yargıları); evrensel ahlak yasası ↔ toplumsal alışkanlık (yargıların herkes için geçerli olup olmadığı); özgürlük → sorumluluk (sorumluluğun özgürlüğe bağlı olup olmadığı).',
  answer: 'Ahlak felsefesi (etik), davranışların iyi ve kötü, doğru ve yanlış bakımından değerlendirilmesini ve bu değerlendirmelerin dayanağını sorgular; temel kavramları ahlak, erdem, etik, iyi, kötü, özgürlük, sorumluluk ve vicdandır. Ortak soruları, ahlaki yargıların herkes için geçerli olup olmadığı ve insanın davranışlarında özgür olup olmadığıdır.',
  question: 'Ahlaki bir yargının herkes için geçerli olduğuna neye bakarak karar verebiliriz?',
  questionAnswers: [
    'Yargının birbirinden bağımsız birçok toplumda paylaşılıp paylaşılmadığına bakabiliriz; ortak yargı, toplumlardan bağımsız bir yasayı düşündürebilir.',
    'Yargının yalnızca toplumsal alışkanlığı mı yoksa ortak bir ihtiyacı ya da ilkeyi mi yansıttığına bakabiliriz; ortak ihtiyaçla açıklanan bir yargı tek başına evrensel bir yasanın kanıtı sayılmaz.',
  ],
};
