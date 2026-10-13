import type { Task } from './philosophy-early-units-2026.ts';
import { task, W } from './philosophy-grade11-units-2026.ts';

// Öğretmen tarafından istenen yeni özgün metin–soru–anahtar havuzu; 2026 kazanımı değildir.
// Eski Eşik/kulüp metninden hiçbir görev bu havuza alınmaz. Her görev kendi metnini taşır.
const readings = [
  {
    context: 'Okul dergisinde yayımlanan “Boş Sandalye” adlı kısa anlatıda sınıf temsilcisi Nisa, toplantıda konuşmayan arkadaşının boş sandalyesini görünce “Sessiz kalan herkes kararı kabul etmiş midir?” diye sorar. Toplantı tutanağı yalnız konuşanların oylarını kaydeder. Anlatıcı Nisa’nın sorusunu aktarır fakat arkadaşın neden konuşmadığını söylemez. Bir okur sessizliği onay sayar; başka bir okur konuşma imkânının olup olmadığını bilmeden böyle bir sonuca varılamayacağını savunur.',
    problem: 'Sessizlik onay sayılabilir mi?',
    evidence: 'Tutanak yalnız konuşanların oylarını kaydeder; arkadaşın neden sustuğu verilmez.',
    inference: 'Sessizlik tek başına onayı kanıtlamaz; konuşma imkânı ve gerekçesi araştırılmalıdır.',
    limit: 'Metin arkadaşın gerçekte karşı çıktığını da kanıtlamaz.',
    question: 'Bir anlatıda söylenmeyen bilgi, okurun sorumluluk yorumunu nasıl sınırlar?',
  },
  {
    context: '“İki Pencere” adlı kısa anlatıda Deniz, aynı meydanı iki pencereden seyreder: birinden insanlar aceleyle geçer, diğerinden yavaşça durup konuşur görünür. Deniz “Bir yeri anlamak için tek bakış yeter mi?” diye sorar. Anlatıcı iki görüntünün aynı saatte alındığını belirtir, fakat pencerelerin meydanın hangi bölümüne baktığını söylemez. Bir okur iki görünümün çeliştiğini, diğeri farklı parçaların birlikte incelenmesi gerektiğini ileri sürer.',
    problem: 'Tek bakış bir bütünü anlamaya yeter mi?',
    evidence: 'İki görüntü aynı saattendir; pencerelerin meydanın hangi bölümünü gösterdiği bilinmez.',
    inference: 'Farklı bakışlar birbirini tamamlayabilir; çelişki kararı için görülen bölümler karşılaştırılmalıdır.',
    limit: 'Metin her bakışın eşit derecede güvenilir olduğunu göstermez.',
    question: 'Bakış açısını değiştiren bir anlatı, gerekçelendirmeye nasıl katkı sağlayabilir?',
  },
  {
    context: '“Emanet Defter” adlı anlatıda kütüphane görevlisi Ela, ödünç alınan bir defterin içindeki isimsiz notu bulur: “Bir sırrı saklamak her zaman güven midir?” Notun kime ait olduğu bilinmez. Ela, defter sahibine ulaşmadan notu duyurmanın kişiyi zor durumda bırakabileceğini düşünür; bir okur ise notun başkalarını ilgilendirebileceğini söyler. Anlatıcı yalnız bu iki ihtimali verir, notun gerçekten birini tehlikeye atıp atmadığını açıklamaz.',
    problem: 'Bir sırrı saklamak her koşulda güveni korur mu?',
    evidence: 'Notun sahibi ve olası zararı bilinmez; Ela duyurmanın sakıncasını, okur başkalarını ilgilendirme ihtimalini düşünür.',
    inference: 'Koruma ile paylaşma arasında karar vermek için notun etkisine ilişkin ek bilgi gerekir.',
    limit: 'Metin notun mutlaka duyurulması veya mutlaka saklanması gerektiğini göstermez.',
    question: 'Belirsiz bilgiyle kurulan iki görüşün gerekçeleri hangi bakımdan sınanmalıdır?',
  },
  {
    context: '“Son Satır” adlı kısa anlatıda Arda bir mektubun son cümlesini siler: “Haklı çıkmak mı, anlaşılmak mı istiyorum?” Mektubun önceki sayfalarında tartışmanın neden başladığı anlatılmaz. Bir okur sorunun öz eleştiri olduğunu söyler; başka bir okur Arda’nın yalnız karşı tarafı ikna etmek istediğini düşünür. Anlatıcı Arda’nın sonraki kararını açıklamaz; iki okur da yalnız mektuptaki soruya dayanır.',
    problem: 'Haklı çıkmak ile anlaşılmak aynı amaç mıdır?',
    evidence: 'Mektupta amaç sorusu bulunur; tartışmanın nedeni ve Arda’nın sonraki kararı verilmez.',
    inference: 'Soru iki amacı ayırmaya imkân verir fakat Arda’nın hangi amacı seçtiğini belirlemez.',
    limit: 'Metin Arda’nın kesin niyetini veya sonunda ne yaptığını bildirmez.',
    question: 'Açık uçlu bir son, okurun yorumunu hangi metin kanıtıyla sınırlar?',
  },
] as const;

type Reading = typeof readings[number];
type Level = Task['level'];
const criteria = [
  ['Yeni edebî metin olgu kanıtı', 'yeni metindeki olguyu ve sorudaki ilgili problemi metne dayanarak doğru belirler'],
  ['Yeni edebî metin kavram gerekçe', 'ilgili kavramı kullanarak gerekçeyi veya argüman bağlantısını açıkça kurar'],
  ['Yeni edebî metin yorum sınırı', 'metinde verilmemiş bilgiyi gerçek kanıttan ayırır ve sonucunu sınırlar'],
] as const;
function pair(level: Level, reading: Reading, stem: string, key: string): Task & { context: string } {
  return { ...task(level, stem, key, ...criteria.map(c => [...c] as [string, string]) as [[string, string], [string, string], [string, string]]), context: reading.context };
}

const builders: ((r: Reading) => Record<Level, [string, string]>)[] = [
  r => ({
    understand: [`Anlatıdaki olayın doğurduğu “${r.problem}” sorusunu açıklayınız. Anlatılan olayla okurun bu olay üzerine sorduğu felsefi soruyu ayırınız.`, `Olay kanıtı: ${r.evidence} Felsefi soru: ${r.problem} Olayı aktarmak ile soru aracılığıyla kavramı incelemek ayrı işlemlerdir.`],
    apply: [`“${r.question}” sorusunu bu anlatıya uygulayınız; verilen bir kanıtı ve bulunmayan bir bilgiyi kullanınız.`, `Metin kanıtı: ${r.evidence} Uygulama: ${r.inference} Eksik bilginin sınırı: ${r.limit}`],
    analyze: [`Anlatıdaki iki okurun yorumunun ayrıldığı varsayımı belirleyiniz. Hangi metin bilgisi bu ayrılığı çözmeye yetmez?`, `Okurlar aynı metni farklı tamamlar. ${r.evidence} Bu bilgi tek bir kesin yorumu zorunlu kılmaz. ${r.limit}`],
    evaluate: [`“${r.inference}” yargısını anlatıdaki kanıta ve yorum sınırına göre değerlendiriniz.`, `Yargının dayanağı: ${r.evidence} Yargının sınırı: ${r.limit} Gerekçeli başka yorumlar da metnin verdiği bilgilerle sınanmalıdır.`],
    create: [`“${r.problem}” sorusundan hareketle anlatının söylemediği şeyi uydurmadan yeni bir felsefi soru ve ona sınırlı bir yanıt oluşturunuz.`, `Örnek soru: ${r.question} Örnek yanıt: ${r.inference} Sınır: ${r.limit} Metne dayanan başka gerekçeli yanıtlar kabul edilir.`],
  }),
  r => ({
    understand: [`Bu anlatının gündelik hayattaki “${r.problem}” ikilemini nasıl görünür kıldığını açıklayınız. Metnin açık bıraktığı noktayı belirtiniz.`, `İkilem: ${r.problem} Görünür kılan bilgi: ${r.evidence} Açık kalan nokta: ${r.limit}`],
    apply: [`Anlatıdaki ikileme benzer günlük bir durum düşününüz. “${r.problem}” sorusunu o durumda kullanırken metnin hangi sınırını korursunuz?`, `Örnek bağlantı metindeki ${r.problem} sorusunu yeni durumda gerekçeyle sınar. Metin kanıtı: ${r.evidence} Sınır: ${r.limit} Eşdeğer somut durumlar kabul edilir.`],
    analyze: [`Anlatıdaki bir okurun yorumunu günlük bir karara doğrudan uygulamanın hangi ek bilgiye ihtiyaç duyduğunu çözümleyiniz.`, `Yorum tek başına kesin karar değildir. ${r.evidence} Ek bilgi, söz konusu kişinin durumu ve sonucuyla ilgilidir. ${r.limit}`],
    evaluate: [`“Bu anlatı günlük hayattaki bütün benzer kararları çözmüştür” iddiasını verilen ve eksik bilgilerle değerlendiriniz.`, `İddia aşırıdır: ${r.evidence} ${r.inference} Ancak ${r.limit} Tek olay bütün kararları belirleyemez.`],
    create: [`“${r.problem}” sorusunu bir günlük yaşam ikilemini görünür kılan iki cümlelik özgün bir mikro anlatıya dönüştürünüz; sonucunu açık bırakma gerekçenizi yazınız.`, `Örnek yapı: bir karar anı ve karşıt iki gerekçe. Problem ${r.problem} ile bağlantılı olmalı; açık uçlu son, ${r.limit} sınırına benzer biçimde okuru gerekçe aramaya yöneltmelidir. Eşdeğer özgün örnekler kabul edilir.`],
  }),
  r => ({
    understand: [`Anlatıdaki iki farklı yorumu ve onları ayıran felsefi soruyu belirleyiniz.`, `İki yorum metinde açıkça karşı karşıyadır; tartışma sorusu ${r.problem} Kanıt: ${r.evidence}`],
    apply: [`Anlatıdan “gözlem–yorum–sonuç” dizisi kurunuz. Yorumun gözlemden zorunlu olarak çıkmadığı noktayı gösteriniz.`, `Gözlem: ${r.evidence} Yorum: ${r.inference} Sonuç kesin değildir; ${r.limit}`],
    analyze: [`“${r.inference}” argümanının dayandığı metin kanıtını ve örtük varsayımını ayırınız.`, `Kanıt: ${r.evidence} Örtük varsayım, eksik bilginin yorumun kesinliğini etkilediğidir. ${r.limit}`],
    evaluate: [`Anlatıdaki karşıt yorumlardan birinin gerekçesini seçip güçlü ve zayıf yönünü metin kanıtıyla değerlendiriniz.`, `Güç: ${r.evidence} Zayıflık: ${r.limit} İki yorumdan birini doğru kabul eden, kanıt ve sınırını gösteren değerlendirmeler kabul edilir.`],
    create: [`Anlatıdaki yorumlardan birine karşı tek bir itiraz ve ona gerekçeli yanıt oluşturunuz; metnin kesinleştirmediği sonucu belirtiniz.`, `Olası itiraz: ${r.evidence} tek başına sonuç için yeterli değildir. Yanıt: ${r.inference} Kesinleştirmeyen sınır: ${r.limit}`],
  }),
  r => ({
    understand: [`“${r.problem}” üzerine bir görüş ile bu görüşe dayanak olan metin bilgisini ayrı cümlelerde yazınız.`, `Görüş örneği: ${r.inference} Dayanak: ${r.evidence} Görüş olgunun kendisi değildir.`],
    apply: [`“${r.inference}” görüşünü bir öncül ve sonuç biçiminde yeniden kurunuz. Metinde verilmeyen bilgiyi ayrıca belirtiniz.`, `Öncül: ${r.evidence} Sonuç: ${r.inference} Bilgi sınırı: ${r.limit}`],
    analyze: [`Anlatıdaki iki yorumdan birinin varsayımını ve buna yöneltilen gerçek bir karşı itirazı çözümleyiniz.`, `Varsayım verilen kanıtın kesin sonuca yettiğidir. Karşı itiraz: ${r.limit} Buna rağmen ${r.evidence} tartışmaya bir dayanak sağlar.`],
    evaluate: [`“${r.inference}” görüşüne karşı “Metin her şeyi açıkça söylüyor” itirazının gücünü ve sınırını değerlendiriniz.`, `İtiraz eksik bilgiyi göz ardı eder. Metin ${r.evidence} diyor; fakat ${r.limit} Görüşün makul olması kesinliğini göstermez.`],
    create: [`“${r.problem}” konusunda en az iki öncül ve bir sonuç içeren argüman yazınız; bir itiraza yanıt veriniz.`, `Örnek ilk öncül: ${r.evidence} İkinci öncül: eksik bilgi tek bir yorumu zorunlu kılmaz. Sonuç: ${r.inference} İtiraza yanıt verirken ${r.limit} korunmalıdır.`],
  }),
  r => ({
    understand: [`“${r.problem}” sorusunu ele alan felsefi bir paragrafta problem, kanıt ve sınırlı sonuç sırasını bu anlatıdan örneklerle açıklayınız.`, `Problem: ${r.problem} Kanıt: ${r.evidence} Sonuç: ${r.inference} Sınır: ${r.limit}`],
    apply: [`Bu anlatı için “problem–gerekçe–sınırlı sonuç” düzeninde üç cümlelik felsefi paragraf yazınız.`, `Örnek: ${r.problem} ${r.evidence} ${r.inference} ${r.limit} Bu bağı kuran özgün paragraflar kabul edilir.`],
    analyze: [`“${r.inference}” cümlesini sonuç olarak alan bir paragrafta hangi gerekçenin yazılması ve hangi aşırı iddiadan kaçınılması gerektiğini çözümleyiniz.`, `Gerekçe: ${r.evidence} Aşırı iddianın sınırı: ${r.limit} Sonuç dayanağını aşmamalıdır.`],
    evaluate: [`Bu anlatıya ilişkin “Metin bütün cevapları verir” cümlesini felsefi metin yazımında temellendirme ve bütünlük bakımından değerlendiriniz.`, `Cümle gerekçesiz ve aşırı geneldir. Dayanak: ${r.evidence} Sınır: ${r.limit} Daha iyi paragraf ${r.inference} sonucunu sınırıyla birlikte kurar.`],
    create: [`“${r.problem}” üzerine en az 8 cümlelik felsefi metin yazınız: problemi tanımlayın, iki kavramı ayırın, anlatıdan bir kanıtla görüşünüzü gerekçelendirin ve gerçek bir itiraza yanıt verin.`, `Örnek çerçeve: problem ${r.problem}; metin kanıtı ${r.evidence}; savunulabilir sınırlı görüş ${r.inference}; karşı itiraz için sınır ${r.limit} Bir doğru cevap yoktur; kavram, argüman, itiraz ve bütünlük bakımından gerekçeli başka metinler kabul edilir.`],
  }),
];

export function newLiteraryTasks(componentIndex: number): Task[] {
  const builder = builders[componentIndex];
  if (!builder) throw new Error('Edebiyat bileşeni bulunamadı.');
  return (['understand', 'apply', 'analyze', 'evaluate', 'create'] as const).flatMap(level => readings.map(r => {
    const [stem, key] = builder(r)[level];
    const uniqueStem = `“${r.problem}” sorusunu gündeme getiren anlatı için: ${stem}`;
    const entry = pair(level, r, uniqueStem, key);
    if (componentIndex === 4 && level === 'create') return { ...task(level, uniqueStem, `${key} Tek bir doğru metin yoktur; programdaki performans görevinin küçültülmüş sınav biçimidir.`, ...W, 'extended'), context: r.context };
    return entry;
  }));
}
