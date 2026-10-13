import type { Task } from './philosophy-early-units-2026.ts';
import { task, W } from './philosophy-grade11-units-2026.ts';

// Program s.60: tarihsel/kültürel bağlam ve düşünür argümanları.
// Kısa alıntılar aşağıdaki birincil eserlerin İngilizce çevirilerinden Türkçeye çevrilmiştir.
// Bilgi notları öğretmen uyarlamasıdır; MEB'in veya düşünürün birebir cümleleri değildir.
export const reasonFaithHistory = 'Akıl ve inanç ilişkisi üzerine üç kısa okuma. Augustinus, geç Antik Çağ Hristiyan düşüncesinde, Vaaz 89, bölüm 1: “İnanç anlamadan önce gelmelidir.” Bilgi notu: İnanç, anlamaya açılan bir başlangıçtır; burada anlamanın gereksiz olduğu söylenmez. Gazali, 11–12. yüzyıl İslam düşüncesinde, el-Munkız mine’d-Dalâl, şüpheden kurtuluş bölümü: “Aklın apaçık ilkeleri yeniden kabul edilebilir göründü.” Bilgi notu: Gazali bu güvenin yeniden kazanılmasını yalnız bir kanıt kurmaya değil, Tanrı’nın gönlüne verdiği aydınlanmaya bağlar; aklın ilkelerini bütünüyle reddetmez. S. Kierkegaard, 19. yüzyıl Danimarka Hristiyan düşüncesinde, Korku ve Titreme, birinci problem: “İnanç tam da düşünmenin sona erdiği yerde başlar.” Bilgi notu: Johannes de silentio adlı anlatıcı inancı düşüncenin kuşatamadığı bir paradoks olarak ele alır; bu, her gerekçesiz iddianın doğru olduğu anlamına gelmez. Bu notlar üç düşünürün bütün görüşlerini kapsamaz. İnceleme sorusu: İnancın temellendirilmesinde aklın ve gönlün rolü nedir?';

export const reasonFaithSources = [
  { author: 'Augustinus', work: 'Vaaz 89', section: '1', url: 'https://www.newadvent.org/fathers/160389.htm' },
  { author: 'Gazali', work: 'el-Munkız mine’d-Dalâl', section: 'Bölüm I, şüpheden kurtuluş', url: 'https://www.ghazali.org/books/md/IIA-02main.htm' },
  { author: 'S. Kierkegaard', work: 'Korku ve Titreme', section: 'Birinci problem; Johannes de silentio anlatıcısı', url: 'https://www.religion-online.org/book-chapter/chapter-3-problem-one-is-there-such-a-thing-as-a-teleological-suspension-of-the-ethical/' },
] as const;

type Row = [Task['level'], string, string, [string, string, string]];
function bank(component: string, rows: Row[]): Task[] {
  return rows.map(([level, stem, key, descriptions], index) => task(level, stem, key,
    [`Tarihsel akıl-inanç ${component} ${index + 1} birinci kanıt`, descriptions[0]],
    [`Tarihsel akıl-inanç ${component} ${index + 1} ikinci kanıt`, descriptions[1]],
    [`Tarihsel akıl-inanç ${component} ${index + 1} ilişkilendirme`, descriptions[2]]));
}

export const historicalAnalysis = bank('çözümleme', [
  ['understand', 'Augustinus’un bilgi notundaki başlangıç ile amaç arasındaki ilişkiyi açıklayınız; bu ilişkinin aklı gereksiz kılıp kılmadığını belirtiniz.',
    'Başlangıç inanç, amaç anlamadır. İnanç anlamaya açılan bir başlangıç olduğundan akıl ve anlama dışlanmaz; öncelik vermek gereksiz saymak değildir.',
    ['başlangıcı inanç olarak açıklar', 'amacı anlama olarak açıklar', 'öncelik ile aklı dışlama arasındaki farkı gösterir']],
  ['understand', 'Gazali’nin bilgi notunda aklın ilkelerine güvenin yeniden kazanılması ile bunun kaynağını ayrı ayrı açıklayınız.',
    'Gazali aklın apaçık ilkelerini yeniden kabul eder. Bu güveni yalnız kanıt kurmaya değil Tanrı’nın gönlüne verdiği aydınlanmaya bağlar. Güvenin kaynağıyla güvenilen ilkeler aynı şey değildir.',
    ['aklın ilkelerinin yeniden kabul edildiğini belirtir', 'güvenin aydınlanmayla ilişkilendirildiğini açıklar', 'kaynak ile güvenilen ilkeleri ayırır']],
  ['apply', 'Augustinus’un bilgi notunu en az bir öncül ve bir sonuç içeren argüman biçimine dönüştürünüz; bunun metnin yeniden kuruluşu olduğunu belirtiniz.',
    'Yeniden kuruluş: Öncül: inanç anlamaya açılan bir başlangıçtır. Sonuç: anlamaya ulaşmak için önce inanmak gerekir. Bu, bilgi notunun yeniden kuruluşudur; düşünürden birebir alıntı veya bütün görüşlerinin kanıtı değildir.',
    ['inancı anlamaya başlangıç sayan öncülü yazar', 'öncüle uygun önce inanma sonucunu yazar', 'yeniden kuruluşu birebir alıntıdan ayırır']],
  ['apply', 'Gazali’nin bilgi notunu öncül ve sonuç biçimine dönüştürünüz; “akıl bütünüyle geçersizdir” sonucunun bu nottan çıkıp çıkmadığını gösteriniz.',
    'Öncül: aklın ilkelerine güven yalnız bir kanıt kurmayla geri kazanılmamış, gönle verilen aydınlanmayla ilişkilendirilmiştir. Sonuç: bu güvenin kuruluşu yalnız kanıta indirgenemez. Akıl bütünüyle geçersizdir sonucu çıkmaz; ilkeler yeniden kabul edilmiştir.',
    ['kanıt ve aydınlanma bilgisini öncül olarak yazar', 'yalnız kanıta indirgenememe sonucunu çıkarır', 'aklı bütünüyle reddetme sonucunun neden çıkmadığını gösterir']],
  ['analyze', 'Augustinus ile Gazali’nin notlarını, inanç veya gönlün rolü ve aklın konumu bakımından karşılaştırarak çözümleyiniz.',
    'Augustinus inancı anlamaya başlangıç yapar; Gazali aklın ilkelerine güvenin yeniden kuruluşunda gönle verilen aydınlanmayı öne çıkarır. İkisi de aklı bütünüyle dışlamaz; başlangıç–amaç ilişkisi ile güvenin kaynağı farklı vurgulardır.',
    ['Augustinus’un başlangıç–amaç ilişkisini çözümler', 'Gazali’nin güvenin kaynağı vurgusunu çözümler', 'benzerliği ve farklı vurguyu metin kanıtıyla gösterir']],
  ['analyze', 'Kierkegaard’ın anlatıcısının inancı paradoks olarak ele alması ile “her gerekçesiz iddia doğrudur” yargısını ayırınız; ikinci yargının gerektirdiği fakat metinde bulunmayan öncülü belirtiniz.',
    'Not, inancın düşünce tarafından kuşatılamayan paradoksal niteliğini ele alır. Her gerekçesiz iddia doğrudur yargısı için aklın kuşatamadığı her iddianın doğru olduğu öncülü gerekir; not bu öncülü sunmaz. İnancın özgül bağlamı her iddiaya genellenemez.',
    ['paradoks vurgusunu belirtir', 'eksik evrensel öncülü gösterir', 'özgül inanç bağlamıyla tüm iddiaları ayırır']],
  ['evaluate', '“Üç düşünür de aynı şeyi söylüyor: akıl işe yaramaz” yorumunu, en az iki bilgi notundan kanıtla değerlendiriniz.',
    'Yorum aşırı genellemedir. Augustinus anlamayı amaç olarak korur; Gazali aklın ilkelerini yeniden kabul eder. Kierkegaard’ın anlatıcısı inancı düşüncenin kuşatamadığı paradoks sayar; bundan aklın her alanda işe yaramadığı çıkmaz. En az iki uygun kanıtla gerekçelendirilen yanıt kabul edilir.',
    ['yorumun aşırı genelleme olduğunu belirtir', 'en az iki düşünürün notundan doğru kanıt sunar', 'kanıtların yorumu nasıl sınırlandırdığını gerekçelendirir']],
  ['evaluate', '“Bu metinler farklı dönem ve geleneklerden geldiği için karşılaştırılamaz” iddiasını, ortak problem ve bağlam farklılığı açısından değerlendiriniz.',
    'Ortak problem akıl–inanç ilişkisidir; bu bakımdan karşılaştırılabilirler. Geç Antik Çağ Hristiyan, ortaçağ İslam ve 19. yüzyıl Danimarka Hristiyan bağlamları farklıdır. Bu farklar korunmalı; karşılaştırma özdeşleştirme veya bir geleneği üstün sayma değildir.',
    ['ortak akıl–inanç problemini gösterir', 'en az iki dönem ve gelenek farkını doğru belirtir', 'farkların karşılaştırmayı engellemek yerine sınırlandırdığını gerekçelendirir']],
  ['create', 'Augustinus’un yeniden kurulmuş argümanına bir itiraz üretiniz ve itirazın hangi öncüle yöneldiğini gösteriniz.',
    'Örnek itiraz: anlamaya başlanabilmesi için inanç zorunlu mudur, yoksa soru sormak da bir başlangıç olabilir mi? İtiraz, inancın anlamaya zorunlu başlangıç olduğu öncülüne yönelir. Başka bir gerçek itiraz, hedeflediği öncülle birlikte kabul edilir.',
    ['argümana yönelen gerçek bir itiraz oluşturur', 'hedeflenen öncülü açıkça gösterir', 'itirazın öncülü neden zorladığını açıklar']],
  ['create', 'Gazali’nin notundan hareketle akıl ve gönlün ilişkisini sınayan yeni bir felsefi soru oluşturunuz; soruya karşıt iki gerekçeli yanıt yazınız.',
    'Örnek soru: gönülde yaşanan aydınlanma başkaları için de gerekçe olabilir mi? Yanıt 1: kişiyi aklın ilkelerine yeniden yönelttiği için gerekçe olabilir. Yanıt 2: başkalarınca aynı biçimde sınanamadığı için tek başına ortak kanıt sayılamaz. Soruyla tutarlı başka karşıt ve gerekçeli yanıtlar kabul edilir.',
    ['notla ilgili yeni bir felsefi soru yazar', 'soruya karşıt iki yanıt oluşturur', 'iki yanıtı da gerekçelendirir']],
]);

export const historicalArgument = bank('argüman oluşturma', [
  ['understand', 'Bilgi notlarından hareketle Augustinus’un yaklaşımını destekleyen bir gerekçenin hangi sonucu desteklemesi gerektiğini açıklayınız.',
    'Desteklenecek sonuç inancın anlamaya başlangıç olabileceğidir. Uygun gerekçe inanmanın kişiyi anlamayı araştırmaya yöneltmesidir. İnanan herkes bütün doğruları bilir sonucu desteklenmez.',
    ['desteklenecek başlangıç sonucunu açıklar', 'anlamayı araştırmaya yönelme gerekçesini belirtir', 'gerekçeyi bütün doğruları bilme sonucuna genişletmez']],
  ['understand', 'Gazali’nin notuyla tutarlı bir görüş oluştururken korunması gereken iki bilgiyi ve bu bilgilerin ilişkisini açıklayınız.',
    'Aklın ilkeleri yeniden kabul edilir; güvenin geri kazanılması yalnız kanıt kurmaya indirgenmez. Görüş hem aklın rolünü hem gönle verilen aydınlanmayı korumalıdır; bunlardan birini silmek notu değiştirir.',
    ['aklın ilkelerinin yeniden kabulünü açıklar', 'güvenin yalnız kanıta indirgenmediğini açıklar', 'iki bilginin birlikte korunması gerektiğini gösterir']],
  ['apply', 'Şu görüş için Augustinus’un notundan yararlanarak bir öncül ve bir sonuç yazınız: “İnanmak, anlamayı araştırmaya başlangıç olabilir.”',
    'Öncül: Augustinus’un notunda inanç anlamaya açılan bir başlangıçtır. Sonuç: inanmak anlamayı araştırmaya başlangıç olabilir. Bu metin temelli bir yeniden kuruluştur; düşünürün adı tek başına kanıt değildir.',
    ['notun içeriğini öncül olarak kullanır', 'verilen görüşü sonuç olarak kurar', 'adı otorite kanıtı saymadan öncül–sonuç ilişkisini açıklar']],
  ['apply', '“Aklın sınırını kabul etmek aklı bütünüyle reddetmek değildir” görüşünü Gazali’nin notuna dayanarak öncül ve sonuçla savununuz.',
    'Öncül: Gazali güvenin yeniden kuruluşunu yalnız kanıta bağlamaz ama aklın ilkelerini yeniden kabul eder. Sonuç: bu notta aklın sınırı, aklın bütünüyle reddi anlamına gelmez. Savunma hem sınırı hem kabulü birlikte kullanır.',
    ['güvenin yalnız kanıta bağlanmadığını öncülde kullanır', 'aklın ilkelerinin kabulünü öncülde korur', 'reddetmeme sonucunu iki bilgiye dayandırır']],
  ['analyze', 'İnancın temellendirilmesinde aklın rolüne ilişkin bir görüşü en az bir öncül ve bir sonuçla kurunuz. Bir bilgi notuyla ilişkisini ve argümanın dayandığı varsayımı çözümleyiniz.',
    'Örnek: Öncül: kişi anlamadığı bir iddiayı araştırmaya yönelmek için başlangıç güvenine ihtiyaç duyabilir. Sonuç: inanç anlamaya başlangıç olabilir. Augustinus’un notuyla ilişkilidir. Varsayım: başlangıç güveni soru sormayı engellemez. Başka bir görüş, açık öncül–sonuç, doğru not bağlantısı ve gerçek varsayımla kabul edilir.',
    ['en az bir öncül ve bir sonuçla tutarlı argüman kurar', 'bir bilgi notuyla doğru ilişki kurar', 'argümanın dayandığı gerçek varsayımı çözümler']],
  ['analyze', 'Gönlün inançtaki rolüne ilişkin bir görüşü en az bir öncül ve bir sonuçla kurunuz. Gazali’nin notuyla bağlantısını ve başkalarınca sınanabilirlik bakımından varsayımını çözümleyiniz.',
    'Örnek: Öncül: gönülde yaşanan aydınlanma bir kişinin güvenini geri kazandırabilir. Sonuç: gönül kişinin inancında rol oynayabilir. Gazali’nin güvenin geri kazanılması anlatımıyla bağlantılıdır. Varsayım: kişisel güven, ortak kanıtla aynı şey değildir. Kişisel deneyimden herkese zorunlu sonuç çıkaran argüman ayrıca gerekçe ister.',
    ['gönlün rolü için öncül–sonuç kurar', 'Gazali’nin güven anlatımıyla doğru ilişki kurar', 'kişisel deneyim ile ortak sınanabilirlik varsayımını çözümler']],
  ['evaluate', 'Akıl–inanç ilişkisine dair bir görüşü en az bir öncül ve bir sonuçla kurunuz. Augustinus’un veya Gazali’nin notundan yararlanınız; bir itiraz yazıp itiraza yanıt veriniz ve yanıtın yeterliliğini değerlendiriniz.',
    'Örnek: Öncül: başlangıç inancı araştırmayı başlatabilir. Sonuç: inanç anlamaya yardımcı olabilir. Augustinus bağlantısı: inanç anlamaya başlangıçtır. İtiraz: inanç araştırmayı da kapatabilir. Yanıt: başlangıç inancı sorgulamaya açık tutulursa kapatmak zorunda değildir. Yeterlilik: yanıt şartlıdır; bütün inançların sorgulamaya açık olduğunu kanıtlamaz. Farklı gerekçeli görüşler kabul edilir.',
    ['notla bağlantılı öncül–sonuç kurar', 'argümana gerçek bir itiraz ve gerekçeli yanıt yazar', 'yanıtın itirazı hangi ölçüde karşıladığını değerlendirir']],
  ['evaluate', 'İnancın akılla temellendirilmesinin imkânına ilişkin bir görüşü en az bir öncül ve bir sonuçla kurunuz. Kierkegaard’ın anlatıcısının paradoks vurgusuna bir yanıt oluşturunuz; yanıtın sınırını değerlendiriniz.',
    'Örnek: Öncül: bir inancın bütün içeriği kanıtlanamasa da tutarlılığı akılla sınanabilir. Sonuç: akıl inancın değerlendirilmesinde sınırlı bir rol oynayabilir. Yanıt: paradoks vurgusu bu sınırlı sınamayı zorunlu olarak dışlamaz. Sınır: bu, inancın tamamını kanıtlamak veya anlatıcının paradoksunu çözmek değildir. Karşıt ama gerekçeli yanıtlar da kabul edilir.',
    ['temellendirme konusunda öncül–sonuç kurar', 'paradoks vurgusuna gerçek ve gerekçeli yanıt oluşturur', 'yanıtın sınırını değerlendirir']],
  ['create', 'En az iki bilgi notunun dönem ve gelenek farklarını koruyarak ilişkilendirdiğiniz özgün bir akıl–inanç görüşünü en az iki öncül ve bir sonuçla oluşturunuz; bir itiraz ve bu itiraza gerekçeli yanıt yazınız.',
    'Bağlam: Augustinus geç Antik Çağ Hristiyan, Gazali 11–12. yüzyıl İslam düşüncesindedir. Örnek: Öncül 1: Augustinus’ta inanç anlamaya başlangıçtır. Öncül 2: Gazali’de aklın ilkeleri korunur, güvenin kuruluşu yalnız kanıta indirgenmez. Sonuç: inanç araştırmayı başlatabilir, akıl da araştırmada rolünü koruyabilir. İtiraz: başlangıç inancı sonuçları önceden belirleyebilir. Yanıt: inanç araştırma sonuçlarıyla gözden geçirilmeye açık tutulmalıdır. Özgün, tutarlı, metin bağlantılı başka argümanlar kabul edilir.',
    ['en az iki notla dönem ve gelenek farklarını koruyarak doğru ilişki kurar', 'en az iki öncül ve bir sonuçla özgün argüman oluşturur', 'gerçek bir itiraz ve buna gerekçeli yanıt yazar']],
  ['create', 'Aklın sınırı ile gönlün rolünü birlikte ele alan özgün bir görüşü en az iki öncül ve bir sonuçla oluşturunuz; Gazali ve Kierkegaard’ın notlarıyla ilişkisini belirtip bir itiraza gerekçeli yanıt veriniz.',
    'Örnek: Öncül 1: Gazali’nin notu güvenin kuruluşunu yalnız kanıta indirgemez. Öncül 2: Kierkegaard’ın anlatıcısı inancı düşüncenin kuşatamadığı paradoks sayar. Sonuç: inancın kişisel boyutu aklın bütün içeriği kavramasıyla özdeş olmayabilir. İtiraz: kişisellik her iddiayı korunaklı kılabilir. Yanıt: kişisel anlam ile herkese zorunlu doğruluk iddiasını ayırmak gerekir. İki notu özdeşleştirmeyen başka gerekçeli görüşler kabul edilir.',
    ['iki notu doğru ilişkilendirir ve özdeşleştirmez', 'en az iki öncül ve bir sonuçla özgün görüş oluşturur', 'gerçek itiraza gerekçeli yanıt verir']],
]);

export const historicalWriting = bank('metin yazma', [
  ['understand', 'Şu paragrafın problemini, kavramını ve gerekçesini belirtiniz: “İnanç anlamaya engel midir? Augustinus’un notu inancı anlamaya başlangıç yapar. Bu nedenle önce inanmak, anlamayı bütünüyle dışlamakla aynı değildir.”',
    'Problem inancın anlamaya engel olup olmadığıdır. Kavram inanç veya anlamadır. Gerekçe inancın anlamaya başlangıç olmasıdır; sonuç aklı bütünüyle dışlamama olarak sınırlandırılmıştır.',
    ['problemi doğru belirtir', 'inanç veya anlama kavramını belirtir', 'başlangıç olma gerekçesini ayırır']],
  ['understand', 'Şu paragrafın görüşünü ve onu destekleyen metin kanıtını belirtiniz: “Gazali’nin notunda akıl tümüyle reddedilmez. Çünkü gönle verilen aydınlanmanın ardından aklın ilkeleri yeniden kabul edilir. Güvenin kaynağı ile aklın kullanımı ayrılmalıdır.”',
    'Görüş aklın tümüyle reddedilmediğidir. Kanıt aklın ilkelerinin yeniden kabul edilmesidir. Kaynak ile kullanımın ayrılması kanıtın görüşü nasıl desteklediğini gösterir.',
    ['aklın tümüyle reddedilmediği görüşünü belirtir', 'ilkelerin yeniden kabulü kanıtını belirtir', 'güvenin kaynağıyla aklın kullanımını ayırır']],
  ['apply', 'Şu paragrafı Augustinus’un notuna dayanarak tamamlayınız: “Problem, inanç ile anlamanın ilişkisidir. Notta inanç … olarak görülür. Bu nedenle …; fakat bu sonuç … anlamına gelmez.”',
    'İnanç anlamaya açılan başlangıç olarak görülür. Bu nedenle inanç anlamayı araştırmaya yöneltebilir; fakat bu sonuç aklın veya anlamanın gereksiz olduğu anlamına gelmez. Aynı ilişkiyi koruyan tamamlamalar kabul edilir.',
    ['başlangıç bilgisini doğru tamamlar', 'bilgiye uygun sonuç yazar', 'aklı gereksiz saymayan sınır cümlesi yazar']],
  ['apply', 'Gazali’nin notundan hareketle problem, metin kanıtı ve sonuç sırasıyla üç cümlelik bir paragraf yazınız.',
    'Örnek: Aklın ilkelerine güvenin yalnız kanıtla kurulup kurulmadığı tartışmalıdır. Gazali bu güvenin geri kazanılmasını gönle verilen aydınlanmaya bağlar ve aklın ilkelerini yeniden kabul eder. Dolayısıyla güvenin kaynağı ile aklın kullanımını ayırmak gerekir. Başka tutarlı üç cümle kabul edilir.',
    ['problemi belirten bir cümle yazar', 'Gazali’nin notundan doğru kanıt kullanır', 'kanıta uygun sonucu üçüncü cümlede kurar']],
  ['analyze', 'Şu paragraftaki temellendirme boşluğunu çözümleyiniz: “Kierkegaard ünlü bir düşünürdür. Onun anlatıcısı inancı paradoks sayar. Öyleyse benim bütün inançlarım doğrudur.” Paragrafı geliştirecek bir öneri yazınız.',
    'Ünlü olmak doğruluğun kanıtı değildir. İnancın paradoks sayılması da bütün kişisel inançların doğruluğunu göstermez; bu evrenselleştirme için öncül yoktur. Öneri: sonucu paradoksun aklın sınırını nasıl gündeme getirdiğiyle sınırlayıp metin kanıtıyla temellendirmek.',
    ['otoriteye dayanma sorununu gösterir', 'bütün inançlara geçişteki eksik öncülü çözümler', 'boşluğu giderecek somut öneri yazar']],
  ['analyze', 'Şu paragrafta iki notun nasıl özdeşleştirildiğini çözümleyiniz ve ayrımı koruyan bir sonuç öneriniz: “Augustinus ve Gazali inancı savunur. İkisi de aynı dönemde aynı sebeple aklı reddeder. Bu yüzden aralarında fark yoktur.”',
    'Augustinus geç Antik Çağ Hristiyan, Gazali 11–12. yüzyıl İslam bağlamındadır. Birincisi inancı anlamaya başlangıç yapar; ikincisi aklın ilkelerine güvenin geri kazanılmasını anlatır. İkisi de notlarda aklı bütünüyle reddetmez. Öneri: aklı dışlamama benzerliğiyle başlangıç ve güven kaynağı farkını birlikte korumak.',
    ['dönem ve gelenek farkını çözümler', 'iki nottaki farklı ilişkiyi ve aklı reddetmeme bilgisini gösterir', 'benzerlik ve farkı koruyan sonuç önerir']],
  ['evaluate', 'Şu paragrafı problem, gerekçe ve çıkarım sınırı açısından değerlendiriniz: “İnanç anlamaya başlangıç olabilir mi? Augustinus’un notunda başlangıç olarak ele alınır. O hâlde her insan her iddiaya önce inanmalıdır.”',
    'Problem açık, metin kanıtı uygundur. Fakat özgül akıl–inanç bağlamından her insanın her iddiaya inanması gereğine geçiş aşırı genellemedir. Sonuç, inancın anlamaya başlangıç olabileceğiyle sınırlandırılmalıdır.',
    ['problemin açık olduğunu belirtir', 'gerekçenin metne uygunluğunu değerlendirir', 'sonucun aşırı genellemesini gösterip sınırlandırır']],
  ['evaluate', 'Şu paragrafı Gazali’nin notuna uygunluk ve bütünlük açısından değerlendiriniz; iki farklı geliştirme önerisi yazınız: “Gazali’de güven kanıtla kurulmaz. Bu nedenle akıl kullanılmamalıdır.”',
    'Paragraf eksik ve çıkarımı desteksizdir: not yalnız kanıta indirgenmemeyi söyler ve aklın ilkelerinin yeniden kabulünü korur. Öneri 1: ilkelerin yeniden kabulü bilgisini eklemek. Öneri 2: sonucu güvenin kaynağıyla aklın kullanımını ayıracak biçimde değiştirmek. İki farklı somut öneri kabul edilir.',
    ['nota aykırı genelleme ve çıkarım boşluğunu gösterir', 'ilkelerin kabulünü koruyan somut öneri yazar', 'sonucu veya bütünlüğü geliştiren farklı ikinci öneri yazar']],
]);
historicalWriting.push(
  task('create', 'İnancın temellendirilmesinde aklın rolü üzerine en az 8 cümlelik bir felsefi metin yazınız. En az iki bilgi notunu tarihsel ve kültürel bağlamlarını koruyarak karşılaştırınız; en az iki kavramı (akıl, inanç, gönül) kullanınız, görüşünüzü öncül ve sonuçla savununuz ve bir karşı görüşe gerekçeli yanıt veriniz.',
    'Tek bir doğru metin yoktur. Problem aklın inancı temellendirmedeki rolüdür. En az iki notun dönem/gelenek farkı, argümanı ve benzer/farklı yönleri doğru korunur. Örnek görüş: inanç araştırmaya başlangıç olabilir, fakat aklın eleştirel rolünü kaldırmaz. Augustinus başlangıç, Gazali güvenin kaynağı bakımından kullanılabilir. İtiraz: başlangıç inancı sorgulamayı kapatabilir. Yanıt: başlangıç kabulü eleştiriye açık tutulmalıdır. En az iki belirtilen kavram yerinde kullanılır. Karşıt görüşleri savunan tutarlı metinler de kabul edilir; performans görevinin küçültülmüş sınav biçimidir.',
    ['Tarihsel metin A problem kavram ve karşılaştırma', 'aklın inancı temellendirme problemini tanımlar; akıl, inanç, gönül kavramlarından en az ikisini kullanır; en az iki bilgi notunu dönem/gelenek farkı ve görüşleriyle doğru karşılaştırır (%32)'], W[1], W[2], 'extended'),
  task('create', 'Akıl ile gönlün inançtaki rolü üzerine en az 8 cümlelik bir felsefi metin yazınız. Gazali ve Kierkegaard’ın bilgi notlarını tarihsel ve kültürel bağlamlarıyla karşılaştırınız; en az iki kavramı (akıl, inanç, gönül) kullanınız, görüşünüzü öncül ve sonuçla savununuz ve bir karşı görüşe gerekçeli yanıt veriniz.',
    'Tek bir doğru metin yoktur. Problem akıl ve gönlün inançtaki rolüdür. Gazali’nin 11–12. yüzyıl İslam bağlamında aklın ilkelerine güvenin geri kazanılması ile Kierkegaard’ın 19. yüzyıl Danimarka Hristiyan bağlamında anlatıcısının paradoks vurgusu karşılaştırılır; iki düşünür özdeşleştirilmez. Örnek görüş: kişisel bağlanma ortak akli kanıtla aynı değildir. İtiraz: bu ayrım her gerekçesiz iddiayı koruyabilir. Yanıt: kişisel anlam ile herkese zorunlu doğruluk iddiası ayrılmalıdır. En az iki belirtilen kavram yerinde kullanılır; farklı tutarlı görüşler kabul edilir. Performans görevinin küçültülmüş sınav biçimidir.',
    ['Tarihsel metin B problem kavram ve karşılaştırma', 'akıl ve gönlün inançtaki rolü problemini tanımlar; akıl, inanç, gönül kavramlarından en az ikisini kullanır; Gazali ve Kierkegaard notlarını dönem/gelenek farkı ve görüşleriyle doğru karşılaştırır (%32)'], W[1], W[2], 'extended'),
);
