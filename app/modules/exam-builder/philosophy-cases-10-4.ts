import type { PhilosophyCase } from './philosophy-exam-case.ts';

// FEL.10.4.1 — Bilgi felsefesi. Özgün vaka: doğruluk ölçütü tartışması (tümel uzlaşım ↔ uygunluk) ve
// bilginin imkânına ilişkin kuşkucu bir söz. Alıntı ve düşünür adı yoktur. ÖĞRETMEN İNCELEMESİ BEKLİYOR.
const causal = 'Haberin çok kişi tarafından kabul edilmesi, haberin doğru olduğunun göstergesi sayılabilir; çünkü pek çok kişinin aynı yanlışa kapılma ihtimali düşük görünür. Bu görüş, doğruluğu kabulün yaygınlığıyla ilişkilendiren tümel uzlaşım ölçütüne dayanır.';
const answerFit = 'Haberin doğruluğu, kaç kişinin kabul ettiğine değil, haberin anlattığı durumla gerçekte olan arasındaki örtüşmeye bağlıdır; bu durumda doğruluğu belirleyen şey haberin gerçeklikle uygunluğudur.';
const alternative = 'Çok kişinin kabulü tek başına doğruluğun ölçütü değildir, ama değersiz de değildir: kabul, ancak bağımsız kişilerin kanıta dayanarak aynı sonuca varması durumunda haberin gerçekte olanla örtüştüğüne dair güçlü bir ipucu sayılır. Bu durumda uzlaşım, uygunluğu sınamak için kullanılan yardımcı bir ölçüt olur.';
const hiddenPremise = 'Gizli öncül: Bir şeyin çok kişi tarafından kabul edilmesi, o şeyin gerçekte de öyle olduğunu gösterir; yani kabulün yaygınlığı doğruluğun göstergesidir. Bu öncül kanıtlanmadan kabul edilirse akıl yürütme, tartışılan noktayı (kabulün doğruluğu gösterip göstermediğini) baştan doğru varsayarak ilerlemiş olur.';
const opposing = 'Arkadaşın görüşü (uygunluk ölçütü): Doğruluk, haberin gerçekte olanla örtüşmesidir; kaç kişinin kabul ettiği bu örtüşmeyi değiştirmez. Gerekçesi: yaygın biçimde kabul edilen bir şeyin yanlış çıkabilmesi mümkündür; ancak bu gerekçe metinde gösterilmemiştir. Öğrencinin görüşü ise gerekçesini kabulün yaygınlığından alır (tümel uzlaşım); ikisinin dayandığı varsayımlar farklıdır.';

export const case1041: PhilosophyCase = {
  context: 'Sınıfta bir haberin doğruluğu tartışılır. Bir öğrenci şöyle der: “Bu haberi binlerce kişi paylaşıyor; bu kadar insan kabul ettiğine göre haber doğrudur.” Sınıf arkadaşı karşı çıkar: “Çok kişinin kabul etmesi haberin doğru olduğunu göstermez; önemli olan haberin gerçekte olanla örtüşüp örtüşmediğidir.” Üçüncü bir öğrenci ise şunu söyler: “Hiçbir haberin doğruluğunu kesin olarak bilemeyiz; elimizdeki her şey sanıdan ibarettir.” Öğretmen, doğru bilginin mümkün olup olmadığı sorusu ile doğruyu yanlıştan hangi ölçütle ayıracağımız sorusunun ayrı felsefi problemler olduğunu belirtir.',
  concepts: 'bilgi, sanı, doğruluk, gerçeklik, uygunluk, tümel uzlaşım',
  roles: ['concept', 'problem', 'evaluate', 'inspect'],
  components: [
    'Bilgi felsefesi bilginin ne olduğunu, imkânını, kaynağını ve doğruluk ölçütlerini sorgular. Bilgi burada klasik tanımıyla (doğru ve gerekçelendirilmiş inanç) ele alınır; bu tanıma yönelik sonraki tartışmalar kapsam dışıdır. Metinde haberin doğru sayılması bilgi ve doğruluk kavramlarını; haberin anlattığı olayın gerçekten yaşanıp yaşanmadığı gerçeklik kavramını gündeme getirir; doğruluğu gösterilmemiş kabul ise sanıya yakındır.',
    'Not: bilginin kaynağı problemi (rasyonalizm, empirizm vb.) bu vakanın kapsamı dışındadır; yalnız bilginin imkânı ve doğruluk ölçütleri işlenir. İki problem ayrılır: hiçbir haberin doğruluğunun kesin olarak bilinip bilinemeyeceği bilginin imkânına; çok kişinin kabul etmesinin doğruluk için yeterli olup olmadığı ve doğruluğun hangi ölçütle sınanacağı doğruluk ölçütlerine ilişkindir.',
    'Doğruluğun ne olduğu (tanım) ile bir önermenin doğru olduğunun nasıl anlaşılacağı (ölçüt) ayrı sorulardır; metindeki tartışma ikincisindedir. Doğruluğu çok kişinin kabulüne bağlayan görüş (tümel uzlaşım) ile gerçekle örtüşmeye bağlayan görüş (uygunluk) karşılaştırılır. Değerlendirme, görüşlerin tutarlılığına ve metindeki durumu açıklama gücüne bakar; ölçütlerin hangi durumlarda geçerli olabileceği de gözetilir.',
    'Metinde kavramlar bilgi, sanı, doğruluk ve gerçeklik; problemler doğruluk ölçütü ve bilginin imkânı; argüman ise öğrencinin çok kişinin kabulünden haberin doğruluğunu çıkardığı akıl yürütmedir. Bu akıl yürütme kanıtlanmış değildir; dayandığı öncül sınanmalıdır.',
  ],
  field: { name: 'Bilgi felsefesi', lower: 'bilgi felsefesi', genitive: 'Bilgi felsefesinin', dative: 'bilgi felsefesine', center: 'bilgi' },
  claimant: 'haberi doğru bulan öğrencinin',
  claimantShort: 'Haberi doğru bulan öğrencinin',
  opponent: 'sınıf arkadaşının',
  claim: 'Bu haberi binlerce kişi paylaşıyor; bu kadar insan kabul ettiğine göre haber doğrudur.',
  objection: 'Çok kişinin kabul etmesi haberin doğru olduğunu göstermez; önemli olan haberin gerçekte olanla örtüşüp örtüşmediğidir.',
  conceptDefs: [
    { term: 'sanı', meaning: 'doğruluğu sınanmamış ya da gerekçelendirilmemiş inanç', inText: 'üçüncü öğrencinin “elimizdeki her şey sanıdan ibarettir” sözü, doğruluğu gösterilemeyen inançlara gönderme yapar' },
    { term: 'bilgi', meaning: 'klasik (geleneksel) tanıma göre, doğru olan ve gerekçelendirilebilen inanç', inText: 'haberin doğru olduğu gösterilebilirse haberin içeriği bilgi sayılır' },
    { term: 'doğruluk', meaning: 'bir önermenin dile getirdiği şeyin gerçekte de öyle olması', inText: 'haberin anlattığı şeyin gerçekte öyle olup olmadığı doğruluk sorusudur; doğruluğun ne olduğu ile hangi ölçütle anlaşılacağı ayrı sorulardır' },
    { term: 'gerçeklik', meaning: 'bir önermenin hakkında olduğu, gerçekte var olan ya da olup biten durum', inText: 'haberin anlattığı olayın gerçekte yaşanıp yaşanmadığı gerçekliğe ilişkindir' },
    { term: 'uygunluk', meaning: 'bir önermenin, hakkında konuştuğu gerçeklik durumuyla örtüşmesini doğruluk ölçütü sayan görüş', inText: 'arkadaşın “gerçekte olanla örtüşüp örtüşmediği” sözü uygunluk ölçütüne dayanır' },
    { term: 'tümel uzlaşım', meaning: 'bir önermenin çok sayıda (herkes ya da çoğu) kişi tarafından kabul edilmesini doğruluk ölçütü sayan görüş', inText: 'öğrencinin “bu kadar insan kabul ettiğine göre” sözü tümel uzlaşım ölçütüne dayanır' },
  ],
  slots: { pair: [0, 1], applyPair: [2, 1], single: 3, choicePair: [4, 5], inspect: [1, 0, 2, 3] },
  choiceTopic: 'doğrulama sorusunu',
  contrastKey: 'İkisi, bir inancın ne zaman bilgi sayılacağı sorusunda karşılaşır. Ayrım: sanı, doğruluğu sınanmamış ya da gerekçelendirilmemiş inanç olarak bir şeyin yalnızca benimsenmiş olmasını; bilgi ise doğru olduğu ve gerekçelendirilebildiği gösterilen inancı öne çıkarır.',
  singleApplyNote: 'Gündelik örnek öğrenciye aittir; örneğin “gerçeklik” anlamına uygun olması (bir iddianın hakkında olduğu durum) ve iddia ile onun hakkında olduğu durum arasında ayrım yapılabilmesi beklenir.',
  problems: {
    a: { label: 'Mümkün mü?', text: 'hiçbir haberin doğruluğunun kesin olarak bilinip bilinemeyeceği' },
    b: { label: 'Hangi ölçütle?', text: 'bir haberin doğruluğunun hangi ölçütle sınanacağı' },
    pairLabel: '“mümkün mü?” ve “hangi ölçütle?”',
    priorityStem: 'Bu iki problemden (“mümkün mü?” ve “hangi ölçütle?”) hangisinin metindeki tartışmada daha öncelikli olduğunu gerekçelendiriniz.',
    typeKey: '“Mümkün mü?” türüne girer (bilginin imkânı): doğru bilginin elde edilip edilemeyeceği sorulmaktadır; bu, doğruluğun hangi ölçütle sınanacağı sorusundan ayrı bir problemdir.',
    priorityKey: 'Her iki yanıt da gerekçeliyse kabul edilir. “Hangi ölçütle?” yanıtı: tartışmadaki asıl ayrışma, haberin doğruluğunu çok kişinin kabulünün mü yoksa gerçekle örtüşmenin mi belirleyeceğidir. “Mümkün mü?” yanıtı: doğruluk hiç bilinemiyorsa ölçüt tartışması anlamını yitirir. Ölçüt: iki problemin ayrımının doğru kullanılması.',
  },
  problem: 'bir haberin doğruluğunun hangi ölçütle belirleneceği',
  problemKey: 'Problem: haberin çok kişi tarafından paylaşılıp kabul edilmesi, bu kabulün haberi doğru saymaya yetip yetmediği sorusunu doğurur; kabulün yaygınlığı ile haberin gerçekte olanla örtüşmesi, doğruluğun ölçütü olarak karşı karşıya gelir.',
  dispute: 'Doğruluğu neyin belirlediği sorusunda ayrışırlar: öğrenci “çok kişinin kabul etmesi”, arkadaşı “gerçekte olanla örtüşme” der.',
  facts: ['haberin binlerce kişi tarafından paylaşılması', 'haberin çok kişi tarafından kabul edilmesi'],
  causal,
  counter: 'Uzun süre pek çok kişi tarafından kabul edildikten sonra yanlışlığı anlaşılan yaygın inanışlar, çok kişinin kabul etmesinin doğruluğu garanti etmediğini gösterir; bu durumda kabulün yaygınlığı ile doğruluk birbirinden ayrılır.',
  strainedAssumption: 'çok kişinin kabul ettiği şeyin gerçekte de öyle olduğu.',
  alternative,
  check: 'Görüş, doğruluk ölçütleriyle sınanır: uygunluk (gerçeklikle örtüşme), tutarlılık (kabul edilmiş diğer bilgilerle çelişmeme) ve tümel uzlaşım (bağımsız ve yaygın kabul) bakımından ne ölçüde destek buluyor; hangi ölçütün hangi durumda daha geçerli olduğu da gözetilir.',
  hiddenPremise,
  thoughtExperimentPrompt: 'Çok kişinin kabul etmesi ile doğruluk arasındaki ilişkiyi sınayan bir düşünce deneyi kurunuz; deneyin hangi soruya ışık tuttuğunu belirtiniz.',
  thoughtExperiment: 'Örnek düşünce deneyi: Bir köyde herkes, kuyudaki suyun içilebilir olduğunu kabul etmektedir; oysa suda kimsenin göremediği bir kirlilik vardır. Herkes aynı şeyi kabul ettiği hâlde su içilemiyorsa, kabulün yaygınlığı doğruluğu garanti etmez. Tersine, yalnızca bir kişi suyun kirli olduğunu bilirken herkes onu yalanlıyorsa, doğruluk çoğunluktan bağımsız kalır. Deney, doğruluğun kabulden mi yoksa gerçeklikle örtüşmeden mi geldiği sorusuna ışık tutar. Deney kesin kanıt değil, görüşün sezgilerimizle uyuşma ölçüsünü gösterir.',
  twoExplanations: {
    prompt: 'Metinde bir haberin doğru sayılması hangi ölçütlerle açıklanabilir? İki farklı açıklamayı ölçütlerini belirterek ayrı ayrı yazınız.',
    labels: ['(tümel uzlaşım)', '(uygunluk)'],
    texts: [causal, answerFit],
  },
  everyday: {
    prompt: 'Gündelik hayattan, çok kişi tarafından kabul edildiği hâlde yanlış çıkan (ya da az kişi tarafından savunulduğu hâlde doğru çıkan) bir iddia örneği veriniz ve metindeki problemle ilişkisini kurunuz.',
    key: 'Örnek öğrenciye aittir. Beklenen: örnekte kabulün yaygınlığı ile iddianın gerçeğe uygunluğunun ayrılması ve “bir haberin doğruluğunun hangi ölçütle belirleneceği” problemiyle bağ kurulması.',
  },
  conclusionQuote: 'haber doğrudur',
  objectionTarget: 'Arkadaşı, çok kişinin kabul etmesinin haberin gerçekte olanla örtüştüğünü göstermediğini, doğruluğun kabulün yaygınlığına değil gerçeklikle örtüşmeye bağlı olduğunu savunur.',
  argument: { premises: ['Bu haberi binlerce kişi paylaşıyor ve kabul ediyor.', 'Bir haberin çok kişi tarafından kabul edilmesi, o haberin doğru olduğunu gösterir.'], conclusion: 'Bu haber doğrudur.' },
  argumentNote: 'Not: ikinci öncül metinde söylenmemiş, sözün dayandığı örtük öncüldür; yeniden yazma onu görünür kılar. Metinde açıkça verilen yalnız birinci öncül ve sonuçtur.',
  thirdVoice: {
    claim: 'Hiçbir haberin doğruluğunu kesin olarak bilemeyiz; elimizdeki her şey sanıdan ibarettir.',
    argument: { premises: ['Hiçbir haberin doğruluğu kesin olarak bilinemez.', 'Doğruluğu kesin olarak bilinemeyen inanç bilgi değil, sanıdır.'], conclusion: 'Elimizdeki her şey sanıdır.' },
    implicitNote: 'Örtük öncül, bilginin kesinlik gerektirdiğini varsayar. Bu öncül, bilgiyi doğru ve gerekçelendirilmiş inanç sayan klasik tanımla çatışır: gerekçe kesinlik anlamına gelmez. Bu yüzden kuşkucu sonuç, örtük öncül kabul edilmedikçe çıkmaz.',
  },
  definition: { claim: 'Bilgi, kendimizden emin olduğumuz her şeydir.', flaw: 'Bu tanım çok geniştir: insan yanlış olan bir şeyden de tamamen emin olabilir; böyle bir durumda tanım yanlış bir inancı bilgi saymak zorunda kalır. Ayrıca emin olmak öznenin ruh hâlidir; bilginin doğruluğu ve gerekçesi gibi nesnel yönleri tanımda hiç yer almaz. Daha iyi bir tanım, bilgiyi en azından doğruluk ve gerekçe gibi ölçütlerle sınırlamalıdır.' },
  otherContextPrompt: 'bir okulda herkes, kaynağını kimsenin bilmediği bir söylentiyi birbirine aktararak doğru kabul etmektedir',
  otherContext: 'Haberi doğru bulan öğrencinin görüşüne göre söylenti herkes tarafından kabul edildiği için doğru sayılır; kabulün yaygınlığı yeterlidir. Arkadaşının görüşü ise söylentinin gerçekte olanla örtüşüp örtüşmediğine bakar; söylenti doğru da olabilir yanlış da, ama kimse sınamadığı için hangisi olduğu bilinemez (doğru olmak ile doğru olduğunun bilinmesi ayrı şeylerdir). Bu durum, tümel uzlaşım ölçütünün kabulün nasıl oluştuğuna (bağımsız sınamaya mı yoksa aktarmaya mı dayandığına) bakmadığı için yanlış bir kabulü de doğru sayabileceğini gösterir.',
  newReasonExample: 'Bir mahallede yaşayanların hepsi, birbirinden bağımsız olarak, belirli bir yolun buzlandığını gözlemlediğini söylüyorsa, bu ortak gözlem yolun gerçekten buzlu olduğuna dair makul bir gerekçedir.',
  opposing,
  createArgument: {
    reason1: 'Bağımsız birçok kişinin kanıtlara dayanarak aynı sonuca varması, sonucun gerçeğe uygun olma olasılığını artırır.',
    reason2: 'Ancak herkes birbirini tekrar ediyorsa aynı sonuç yeni bir kanıt sayılmaz; bu yüzden uzlaşım tek başına ölçüt değil, uygunluğu sınamaya yardımcı bir ölçüttür.',
  },
  comparison: 'Tümel uzlaşım görüşü pratik ve uygulaması kolaydır ama yaygın bir kabulün yanlış çıkabileceğini açıklayamaz; uygunluk görüşü yanlış kabulleri ayıklayabilir ama gerçeklikle karşılaştırma yaparken gerçekliğe yine bilgimiz aracılığıyla ulaştığımız için bu karşılaştırmanın nasıl yapılacağını açıklamakta güçlük çeker. Üstünlük, tutarlılık, açıklama gücü ve sadelik ölçütlerine göre belirlenir; her iki yönde gerekçeli yanıtlar kabul edilir.',
  consistencyCheck: 'Tutarlılık ölçütüne göre: öğrencinin görüşü, bir kabulün sonradan yanlış çıktığı durumları açıklamak zorundadır (aksi hâlde aynı önerme hem doğru hem yanlış sayılır); arkadaşın görüşü ise gerçeklikle karşılaştırmanın nasıl yapılacağını açıklamak zorundadır. İki görüş de açıklama borcu taşır; ancak öğrencinin görüşü, kabulün zamanla değişebildiği durumlarda çelişkiye daha açıktır.',
  objectionAssessment: 'Güçlü yönü: kabulün yaygınlığı ile doğruluğu birbirinden ayırır ve yaygın yanlışların mümkün olduğunu hatırlatır. Zayıf yönü: gerçekle örtüşmenin somut olarak nasıl sınanacağını (örneğin kaynak denetimi ya da diğer bilgilerle tutarlılık) göstermez; itirazın gerekçesi metinde yer almaz.',
  conceptMap: 'Örnek: bilgi → doğruluk (bilgi doğru olmalıdır); doğruluk → gerçeklik (doğruluk gerçeklikle ilişkilidir); bilgi ↔ sanı (doğruluğu gösterilmiş inanç ile gösterilmemiş inanç); doğruluk → ölçütler (uygunluk, tutarlılık, tümel uzlaşım).',
  answer: 'Bilgi felsefesi bilginin ne olduğunu, imkânını, kaynağını ve doğruluk ölçütlerini sorgular; temel kavramları bilgi, sanı, doğruluk ve gerçekliktir. Ortak soruları, bilgi ile sanının nasıl ayrılacağı ve doğruluğun gerçeklikle ilişkisidir.',
  question: 'Bir iddianın doğru olduğuna neye bakarak karar verebiliriz?',
  questionAnswers: [
    'Çok kişinin kabul etmesine bakabiliriz; yaygın kabul, tümel uzlaşım ölçütüne göre doğruluğun göstergesi sayılır.',
    'İddianın gerçekte olanla örtüşüp örtüşmediğine bakabiliriz; uygunluk ölçütüne göre doğruluk gerçeklikle ilişkiye dayanır.',
  ],
};
