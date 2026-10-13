import type { Task } from './philosophy-early-units-2026.ts';
import { task, W } from './philosophy-grade11-units-2026.ts';

// Özgün öğretmen hikâyesi: bir yazardan alıntı veya resmî ders kitabı metni değildir.
export const literaryReading = 'Özgün kısa hikâye — Eşik: Okul kütüphanesinin kapısında bir öğrenci durdu. Arkadaşının ödünç aldığı kitabı geri getirmişti. Kitabın arasındaki notta “Bunu benim getirdiğimi söyle” yazıyordu. Öğrenci, “Arkadaşımı korumak istiyorum; ama kitabı benim getirdiğimi saklarsam doğruyu söylemiş olur muyum?” diye düşündü. Görevli, kitabı kimin getirdiğini sordu. Öğrenci kapının eşiğinde cevap vermeden bekledi. Okuma notu: Anlatıcının anlattığı durum ile karakterin düşüncesi ve yazarın görüşü aynı değildir. Metinde yalnızca karakterin bir sorusu ve henüz sonuçlandırmadığı bir seçim vardır. Bir okur, “Yardım etmek arkadaşlığı korur; fakat yardım etmek için doğruyu gizlemek zorunlu değildir. Bu nedenle arkadaşlık, her durumda doğruyu gizlemeyi gerektirmez” argümanını kurar. Bu argüman okurun yorumudur; karakterin söylediği veya yazarın onayladığı bir sonuç değildir. İnceleme soruları: Bu hikâyedeki kavram, soru ve argümanlara felsefi açıdan nasıl bakılabilir? Hikâye diliyle felsefi düşünce nasıl ifade edilebilir?';

type Row = [Task['level'], string, string, [string, string, string]];
function strand(component: string, rows: Row[]): Task[] {
  return rows.map(([level, stem, key, descriptions], index) => task(level, stem, key,
    [`Eşik ${component} ${index + 1} metin kanıtı`, descriptions[0]],
    [`Eşik ${component} ${index + 1} felsefi işlem`, descriptions[1]],
    [`Eşik ${component} ${index + 1} çıkarım sınırı`, descriptions[2]]));
}

export const literaryProblems = strand('problem açıklama', [
  ['understand', 'Eşik hikâyesindeki felsefi soruyu ve iki kavramı açıklayınız; hikâyeyi felsefi açıdan incelemek ile hikâye diliyle felsefe yapmak arasındaki farkı belirtiniz.',
    'Soru: arkadaşlığı korumak için doğruyu gizlemek gerekir mi? Kavramlar arkadaşlık ve doğruluk veya sorumluluktur. İlk problem mevcut hikâyedeki kavram ve soruları incelemektir; ikinci problem hikâye dilini felsefi düşüncenin ifade aracı yapmaktır. Karakterin sorusu yazarın kesin cevabı değildir.',
    ['karakterin sorusunu doğru belirtir', 'iki kavramı ve iki problem arasındaki farkı açıklar', 'karakterin sorusunu yazarın cevabına dönüştürmez']],
  ['apply', '“Eşik hikâyesinde doğruluk ile arkadaşlık kavramlarının ilişkisini incelemek” ve “aynı soruyu yeni bir hikâyeyle ifade etmek” çalışmalarını iki edebiyat–felsefe problemiyle eşleştirip gerekçelendiriniz.',
    'İlki edebî unsurlara felsefi bakış: hazır metindeki kavram ve ilişkiyi inceleme. İkincisi edebî unsurlarla felsefe yapma: hikâye dilini felsefi soru veya görüşü ifade etmekte kullanma. Eşleştirme metin inceleme ve metin oluşturma farkına dayanır.',
    ['ilk çalışmayı edebî unsurlara felsefi bakışla eşleştirir', 'ikinci çalışmayı edebî unsurlarla felsefe yapmayla eşleştirir', 'eşleştirmeyi inceleme–ifade farkıyla gerekçelendirir']],
  ['analyze', 'Eşik hikâyesindeki karakterin sorusu ile okurun argümanını ayırınız; bunların yazarın görüşünü kesin olarak belirleyip belirlemediğini çözümleyiniz.',
    'Karakter doğruyu gizlemenin doğrulukla bağdaşıp bağdaşmadığını sorar ve cevap vermez. Okur yardım etmek için gizlemenin zorunlu olmamasından arkadaşlığın her durumda gizlemeyi gerektirmediğini çıkarır. İkisi de yazarın kesin görüşünü kanıtlamaz; karakter, okur ve yazar ayrı konumlardır.',
    ['karakterin sorusunu doğru gösterir', 'okurun argümanını sorudan ayırır', 'karakter ve okuru yazarla özdeşleştirmeme sınırını açıklar']],
  ['evaluate', '“Hikâyenin sonunda cevap verilmediği için metinde felsefi değer yoktur” iddiasını Eşik hikâyesindeki kavram ve sorulara dayanarak değerlendiriniz.',
    'Kesin cevap bulunmaması felsefi soru veya değerin yokluğunu göstermez. Doğruluk ve arkadaşlık kavramlarının ilişkisi ve karakterin ikilemi sorgulamaya açılır. Bununla birlikte soru açmak eksiksiz bir argüman kurmakla aynı değildir; felsefi değeri bu sınırla savunan veya gerekçeli eleştiren yanıtlar kabul edilir.',
    ['cevabın bulunmadığı metin durumunu doğru belirtir', 'kavram ve sorularla felsefi değeri değerlendirir', 'soru açmayı eksiksiz argümanla eşitlemez']],
  ['create', 'Eşik hikâyesindeki ikilemden hareketle, edebî bir metne felsefi bakış yönelten yeni bir soru oluşturunuz; bunun hikâye diliyle felsefe yapma probleminden farkını açıklayınız.',
    'Örnek soru: birine yardım etme niyeti yapılan eylemi her durumda doğru kılar mı? Soru hazır hikâyedeki niyet ve doğruluk kavramlarını inceler. Hikâye diliyle felsefe yapmak ise bu soruyu yeni bir edebî anlatımla ele almaktır. Özgün ve metne uygun başka sorular kabul edilir.',
    ['ikilemle ilgili yeni bir felsefi soru oluşturur', 'sorunun hazır metne felsefi bakışını açıklar', 'yeni edebî ifade oluşturmayla farkını korur']],
]);

export const literaryLife = strand('hayatla ilişki', [
  ['understand', 'Eşik hikâyesindeki sorunun okul yaşamındaki bir karşılığını açıklayınız; karakterin kararının neden metinden kesin çıkarılamadığını belirtiniz.',
    'Örnek: arkadaşına yardım etmek için yaptığı katkıyı saklayıp saklamama ikilemi. Doğruluk ile arkadaşlık ilişkisi okul yaşamında da karşılaşılır. Karakter cevap vermediği için hangi kararı verdiği kesin değildir. Başka uygun örnekler kabul edilir.',
    ['okul yaşamından somut bir karşılık verir', 'örneği doğruluk–arkadaşlık ilişkisiyle açıklar', 'karakterin kararının verilmediğini korur']],
  ['apply', 'Şu yeni durumu Eşik hikâyesinin sorusuyla ilişkilendiriniz: Bir öğrenci grup ödevinde arkadaşının çalışmadığını biliyor; arkadaşını korumak için herkesin eşit çalıştığını söylemesi isteniyor.',
    'İki durumda da arkadaşlığı koruma isteği doğruyu söyleme yükümlülüğüyle gerilir. Yeni durumda eşit emek verilmediği bilgisi vardır; yardımın mutlaka gerçeği gizlemeyi gerektirdiği kabul edilmemelidir. Hikâyedeki karakterin sonucu yeni öğrenciye otomatik aktarılmaz.',
    ['yeni durumdaki doğruluk–arkadaşlık gerilimini gösterir', 'iki durumun ortak sorusunu ilişkilendirir', 'hikâyede verilmeyen sonucu yeni duruma taşımaz']],
  ['analyze', 'Okuduğu hikâyeden sonra “birine yardım etmek ile onun yerine doğruyu gizlemek aynı şey değildir” diyen öğrencinin yaşamla kurduğu ilişkiyi çözümleyiniz; bu yorumun dayanağını ve sınırını belirtiniz.',
    'Öğrenci yardım ile gizlemeyi kavramsal olarak ayırır; yaşamda yardımı başka biçimde yapabileceğini düşünür. Dayanak okurun gizlemenin zorunlu olmadığı argümanıdır. Sınır bu yorumun karakterin veya yazarın kesin görüşü olmamasıdır.',
    ['yardım ile gizleme ayrımını çözümler', 'okurun argümanını dayanak olarak gösterir', 'yorumu karakterin veya yazarın kesin görüşü saymaz']],
  ['evaluate', '“Eşik hikâyesini okuyan herkes günlük yaşamda daha doğru davranır” iddiasını hikâyenin düşündürme gücü ve sınırları açısından değerlendiriniz.',
    'Hikâye doğruluk ve arkadaşlık üzerine düşünmeyi başlatabilir. Fakat okurlar farklı yorum yapabilir ve düşünmek doğru davranışı garanti etmez. Bu nedenle herkes için zorunlu sonuç iddiası aşırıdır; metne dayanan başka gerekçeli değerlendirmeler kabul edilir.',
    ['hikâyenin düşündürme katkısını belirtir', 'yorum farkı veya düşünme–davranış farkını değerlendirir', 'herkes için garanti iddiasını gerekçeyle sınırlar']],
  ['create', 'Eşik hikâyesindeki soruyla ilişkili, okul yaşamında geçebilecek yeni bir durum yazınız; durumun hangi felsefi soruyu gündeme getirdiğini ve hikâyeyle farkını belirtiniz.',
    'Örnek: arkadaşının yaptığı çizimi kendi adıyla sunması istenen öğrenci yardım etmekle emeğin sahibini gizlemek arasında kalır. Soru: arkadaşlık emeğin sahibini gizlemeyi gerektirir mi? Fark: kitap getirme yerine eser sahipliği söz konusudur. Başka özgün durumlar ve doğru farklar kabul edilir.',
    ['okul yaşamıyla ilgili özgün durum yazar', 'durumdaki felsefi soruyu belirtir', 'Eşik ile somut farkını gösterir']],
]);

export const literaryAnalysis = strand('argüman çözümleme', [
  ['understand', 'Okurun argümanındaki iki öncülü ve sonucu ayırınız; bu argümanın kime ait olduğunu belirtiniz.',
    'Öncül 1: yardım etmek arkadaşlığı korur. Öncül 2: yardım etmek için doğruyu gizlemek zorunlu değildir. Sonuç: arkadaşlık her durumda doğruyu gizlemeyi gerektirmez. Argüman okurundur; karakterin veya yazarın kesin görüşü değildir.',
    ['iki öncülü doğru ayırır', 'sonucu doğru belirtir', 'argümanı okura ait olarak gösterir']],
  ['apply', 'Okurun argümanını, “grup arkadaşına yardım etmek için herkesin eşit çalıştığını söylemek zorunlu değildir” durumuna uygulayarak öncül ve sonuç biçiminde yazınız.',
    'Öncül: grup arkadaşına yardım etmenin, katkıyı gizlemek dışında yolları vardır. Sonuç: arkadaşlığı korumak herkesin eşit çalıştığını söylemeyi zorunlu kılmaz. Okurun yardım–gizleme ayrımı yeni duruma uygulanır; karakterin kararı hakkında iddia kurulmaz.',
    ['yeni duruma uygun yardım öncülü kurar', 'gizlemenin zorunlu olmadığı sonucunu çıkarır', 'okurun ayrımını uygular ve karaktere karar atfetmez']],
  ['analyze', 'Okurun argümanının sonucunu destekleyen temel öncülü ve bu öncül çıkarılırsa oluşacak temellendirme boşluğunu çözümleyiniz.',
    'Temel öncül yardım için doğruyu gizlemenin zorunlu olmamasıdır. Bu öncül çıkarılırsa yardımın arkadaşlığı korumasından, arkadaşlığın her durumda gizlemeyi gerektirmediği sonucu tek başına çıkmaz. İkinci öncül olası yardım yollarını gizlemeyle özdeşleştirmeyi engeller.',
    ['gizlemenin zorunlu olmadığı öncülü belirtir', 'bu öncül olmadan sonucun desteklenmediğini çözümler', 'yardım ve gizlemeyi özdeşleştirmeme ilişkisini gösterir']],
  ['evaluate', '“Yazar arkadaşlığı önemsediği için doğruyu gizlemeyi savunuyor” yorumunu Eşik hikâyesinin soru ve argümanlarını kullanarak değerlendiriniz.',
    'Yorum metni aşar. Karakter soru sorar ve henüz cevap vermez; okur yardım için gizlemenin zorunlu olmadığını savunur. Anlatıcı, karakter, okur ve yazar özdeş değildir; yazarın niyeti verilmemiştir. Bu sınırları kanıtla gösteren değerlendirme kabul edilir.',
    ['karakterin cevapsız sorusunu kanıt olarak gösterir', 'okurun gizlemenin zorunlu olmadığı argümanını doğru kullanır', 'yazarın görüşünün verilmediğini gerekçelendirir']],
  ['create', 'Okurun argümanına, yardım ile doğruyu gizleme ayrımını hedef alan bir itiraz oluşturunuz; itirazın yöneldiği öncülü belirtiniz.',
    'Örnek itiraz: bazı durumlarda arkadaşın istediği tek yardım doğruyu gizlemek olabilir; bu durumda başka yardım yolunun bulunup bulunmadığı ayrıca gösterilmelidir. Hedef, yardım için gizlemenin zorunlu olmadığı öncüldür. Bir örneğin bütün durumları kanıtlamadığı farkıyla başka gerçek itirazlar kabul edilir.',
    ['argümana gerçek bir itiraz oluşturur', 'yardım için gizlemenin zorunlu olmadığı öncülü hedef gösterir', 'itirazı metinde olmayan bir karara değil öncüle bağlar']],
]);

export const literaryArgument = strand('görüş oluşturma', [
  ['understand', 'Eşik hikâyesindeki felsefi değeri savunacak bir argümanın hangi soru ve kavramlara dayanabileceğini açıklayınız; kararın verilmeyişinin etkisini belirtiniz.',
    'Argüman doğruluk ile arkadaşlık kavramları ve yardım için gizleme gerekip gerekmediği sorusuna dayanabilir. Kararın verilmeyişi okuru gerekçe üretmeye çağırır; fakat hikâyenin tek doğru cevabı verdiğini göstermez.',
    ['hikâyedeki felsefi soruyu doğru açıklar', 'argümana dayanak olabilecek kavramları belirtir', 'açık sonun soru açtığını fakat tek cevabı vermediğini gösterir']],
  ['apply', '“Eşik hikâyesi felsefi açıdan incelenebilir” görüşünü hikâyeden bir öncül ve bir sonuçla savununuz; hikâyede bulunmayan bir kararı kanıt olarak kullanmayınız.',
    'Öncül: hikâye doğruluk ve arkadaşlık arasında gerekçe isteyen bir soru açar. Sonuç: kavram ve soru bakımından felsefi açıdan incelenebilir. Karakterin doğruyu söylediği ya da sakladığı bilinmez; bunlar kanıt yapılamaz.',
    ['hikâyede bulunan soru veya kavramı öncül yapar', 'felsefi inceleme sonucunu öncüle bağlar', 'karaktere verilmemiş bir karar atfetmez']],
  ['analyze', 'Eşik hikâyesinin felsefi değerine ilişkin bir görüşü en az bir öncül ve bir sonuçla kurunuz; argümanın dayandığı varsayımı ve hikâyedeki kanıtını çözümleyiniz.',
    'Örnek: Öncül: felsefi değer taşıyan metin kavramsal sorgulamayı başlatabilir. Öncül: Eşik yardım ve doğruluk ilişkisini sorgulatır. Sonuç: Eşik felsefi değer taşıyabilir. Varsayım: açık cevap vermeyen metin de felsefi değer taşıyabilir. Kanıt karakterin sorusudur. Farklı tutarlı görüşler kabul edilir.',
    ['öncül–sonuç içeren görüş kurar', 'gerçek varsayımı ve ilişkisini çözümler', 'hikâyede bulunan kanıtı kullanır']],
  ['evaluate', 'Eşik hikâyesinin felsefi değerine ilişkin bir görüşü en az bir öncül ve bir sonuçla kurunuz. Görüşe bir itiraz ve gerekçeli yanıt yazınız; yanıtın yeterliliğini değerlendiriniz.',
    'Örnek: Öncül: hikâye doğruluk ve arkadaşlık ilişkisini sorgulatır. Sonuç: felsefi değer taşıyabilir. İtiraz: soru açmak eksiksiz argüman kurmak değildir. Yanıt: değer taşımak eksiksiz bir felsefi metin olmakla aynı değildir; hikâye incelemeyi başlatabilir. Yeterlilik: bu yanıt katkıyı savunur, hikâyenin tamamlanmış argüman verdiğini kanıtlamaz. Farklı gerekçeli görüşler kabul edilir.',
    ['öncül–sonuçla metin bağlantılı görüş kurar', 'gerçek itiraza gerekçeli yanıt verir', 'yanıtın gücünü ve sınırını değerlendirir']],
  ['create', 'Eşik hikâyesine felsefi bakıştan hareketle özgün bir görüşü en az iki öncül ve bir sonuçla oluşturunuz; hikâyedeki bir kanıtı kullanıp bir karşı görüşe gerekçeli yanıt veriniz.',
    'Örnek: Öncül 1: karakterin sorusu yardım ile doğruluğu birlikte düşündürür. Öncül 2: kavramlar arasındaki gerilimi görünür kılmak sorgulamaya katkıdır. Sonuç: açık sonlu hikâyeler felsefi değer taşıyabilir. Karşı görüş: açık cevap yoktur. Yanıt: açık cevap yokluğu kavramsal sorgulamanın yokluğu değildir. Başka tutarlı ve metin kanıtlı görüşler kabul edilir.',
    ['en az iki öncül ve bir sonuçla özgün görüş kurar', 'hikâyede bulunan gerçek kanıtı kullanır', 'gerçek karşı görüşe gerekçeli yanıt verir']],
]);

export const literaryWriting = strand('metin yazma', [
  ['understand', 'Şu paragrafın problemini, kavramını ve gerekçesini belirtiniz: “Açık sonlu hikâyeler felsefi değer taşıyabilir mi? Eşik doğruluk ile arkadaşlık ilişkisini sorgulatır. Bu nedenle kesin cevap vermese de felsefi incelemeye malzeme sağlayabilir.”',
    'Problem açık sonlu hikâyenin felsefi değeri; kavram doğruluk veya arkadaşlık; gerekçe hikâyenin bu ilişkiyi sorgulatmasıdır. Sonuç incelemeye malzeme sağlama olarak sınırlandırılır.',
    ['felsefi değer problemini belirtir', 'doğruluk veya arkadaşlık kavramını gösterir', 'sorgulatma gerekçesini ayırır']],
  ['apply', 'Eşik hikâyesini felsefi açıdan inceleyen üç cümlelik bir paragraf yazınız: İlk cümlede soruyu, ikincide metin kanıtını, üçüncüde kanıtın izin verdiği sonucu belirtiniz.',
    'Örnek: Arkadaşlığı korumak doğruyu gizlemeyi gerektirir mi? Karakter bunu sorar ve okur yardımın gizlemeyi zorunlu kılmadığını savunur. Hikâye kavramsal sorgulamaya açıktır, fakat karakterin kararı verilmediğinden kesin karar çıkarılamaz. Aynı sırayı koruyan tutarlı başka paragraflar kabul edilir.',
    ['felsefi soruyu ilk cümlede yazar', 'hikâyeden doğru kanıtı ikinci cümlede kullanır', 'üçüncü cümlede kanıtı aşmayan sonuç kurar']],
  ['analyze', 'Şu paragraftaki çıkarım boşluğunu çözümleyiniz ve geliştirme önerisi yazınız: “Eşik karakteri arkadaşını düşünür. Demek ki yazar her zaman doğruyu gizlemeliyiz diyor.”',
    'Karakterin arkadaşını düşünmesi, gizleme kararı vermesi değildir. Karakterin düşüncesi de yazarın görüşünü kesin göstermez. Her zaman gizleme sonucu için hiçbir kanıt yoktur. Öneri: karakterin sorusunu ve okurun argümanını ayrı göstererek sonucu metnin sorgulamaya açtığı ilişkiyle sınırlamak.',
    ['düşünme ile karar verme farkını çözümler', 'karakter–yazar özdeşliğindeki çıkarım boşluğunu gösterir', 'metin kanıtını koruyan somut geliştirme önerisi yazar']],
  ['evaluate', 'Şu paragrafı problem, temellendirme ve bütünlük bakımından değerlendirip iki farklı geliştirme önerisi yazınız: “Eşik güzel bir hikâyedir. Bu yüzden felsefedir.”',
    'Felsefi problem açık değildir; güzellik tek başına felsefi değer veya felsefe yapma sonucu için gerekçe değildir. Öneri 1: doğruluk–arkadaşlık sorusunu tanımlamak. Öneri 2: hikâyedeki kanıtla felsefi değer sonucunu temellendirip estetik yargıdan ayırmak. Farklı iki somut öneri kabul edilir.',
    ['problem ve temellendirme eksikliğini değerlendirir', 'problemi veya kavramları geliştiren somut öneri yazar', 'gerekçe veya bütünlüğü geliştiren farklı ikinci öneri yazar']],
]);
literaryWriting.push(task('create', 'Eşik hikâyesinin felsefi değerini inceleyen en az 8 cümlelik bir felsefi metin yazınız. En az iki kavramı (doğruluk, arkadaşlık, sorumluluk) kullanınız; karakterin sorusunu ve okurun argümanını çözümleyiniz, görüşünüzü öncül ve sonuçla savununuz ve karşı görüşe gerekçeli yanıt veriniz. Karakter, okur ve yazarın konumlarını ayırınız.',
  'Tek bir doğru metin yoktur. Metin edebî esere felsefi bakış problemini tanımlar, belirtilen kavramlardan en az ikisini yerinde kullanır; karakterin cevapsız sorusu ile okurun yardım–gizleme argümanını ayırır. Örnek görüş: açık sonlu hikâye kavramsal sorgulamaya katkı sağlayabilir. İtiraz: soru açmak eksiksiz argüman değildir. Yanıt: felsefi değer tamamlanmış argümanla aynı değildir. Yazarın verilmemiş görüşü veya karakterin verilmeyen kararı kanıt yapılamaz. Farklı gerekçeli görüşler kabul edilir; performans görevinin küçültülmüş sınav biçimidir.',
  ['Edebî inceleme problem kavram ve metin kanıtı', 'edebî eserin felsefi değeri problemini tanımlar; doğruluk, arkadaşlık, sorumluluk kavramlarından en az ikisini kullanır; karakterin sorusunu ve okurun argümanını metin kanıtıyla çözümler, bunları yazarın görüşü saymaz (%32)'], W[1], W[2], 'extended'));

// Her düzeyde ilk görev eski tartışmayı, ikinci görev edebî metne felsefi bakışı ölçer.
export function withLiteraryReading(existing: Task[], addition: Task[]): Task[] {
  return existing.map((entry, index) => index % 2 === 0 ? entry : addition[Math.floor(index / 2)]);
}
