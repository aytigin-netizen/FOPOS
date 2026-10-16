import type { Task } from './philosophy-early-units-2026.ts';
import { task } from './philosophy-grade11-units-2026.ts';

// Kaynak: 2026 Felsefe Öğretim Programı s. 19, FEL.10.2.1 a ve b.
// Senaryolar özgün öğretmen zenginleştirmesidir; araştırma bulgusu veya resmî metin değildir.
// Bileşen başına 30 yeni görev; mevcut görevlerin konumları ve yeni görevlerin düzey sırası korunur.
// Her görevin ölçütü yalnız kendi soru kökünde istenen yanıt kanıtlarına dayanır.
// İnceleme taslağı: bu kayıt öğretmen içerik onayı değildir.
type Rubric = [string, string, string];
function reviewed(level: Task['level'], stem: string, key: string, rubric: Rubric): Task {
  const criterion = (label: string): [string, string] => [label, label];
  return task(level, stem, key + ' Gerekçeli ve sorunun kapsamına uygun alternatif yanıtlar kabul edilir.', criterion(rubric[0]), criterion(rubric[1]), criterion(rubric[2]));
}

export const extraThinkingLanguageA: Task[] = [
  // uA1
  reviewed("understand",
    "Bir öğrenci kötü geçen bir günü yalnızca “sıkıldım” diyerek anlatıyor; “bunaldım”, “isteksizim” ve “ilgimi kaybettim” sözcüklerini öğrendikten sonra aynı günü daha ayrıntılı anlatabiliyor. Bu örnekte sözcük bilgisi ile düşünme arasında nasıl bir ilişki görüldüğünü kendi cümlelerinizle açıklayınız.",
    "Yeni sözcükler öğrencinin yaşadığı durumu daha ince ayırmasına ve ayrıntılı ifade etmesine yardımcı olmuştur; yani bu örnekte dil düşünceyi ayrıntılandırmaya katkı sağlamıştır. Bu tek örnekten her düşünmenin sözcüklere bağlı olduğu sonucu çıkmaz. Aynı ilişkiyi örneğe dayanarak kuran eşdeğer gerekçeli yanıtlar kabul edilir.",
    ["Yeni duygu sözcüklerinin daha ayrıntılı anlatmayla bağlantısını kurma", "Duygu ayrımının düşünceyi ayrıntılandırmaya olası katkısını açıklama", "Sözcük bilgisi ve düşünme ilişkisini verilen olayla tutarlı ifade etme"]),
  // uA2
  reviewed("understand",
    "Bir müzisyen yeni bir melodiyi önce zihninde kuruyor, sonra notaya döküyor; melodiyi kurarken sözcük kullanmadığını söylüyor. Bu örneğin düşünme ile dil arasındaki ilişki hakkında hangi soruyu gündeme getirdiğini açıklayınız.",
    "Örnek, sözcük kullanılmadan da zihinsel bir çalışmanın yürütülebileceğini düşündürür ve “Sözcüksüz düşünme mümkün müdür?” sorusunu gündeme getirir. Melodi kurmanın “düşünme” sayılıp sayılmayacağı tartışılabilir; bu tek örnek bütün düşünmenin dile bağlı olmadığını kanıtlamaz. Gerekçeli eşdeğer yanıtlar kabul edilir.",
    ["Melodi kurmanın sözcüksüz yürütüldüğü varsayımını doğru aktarma", "Melodi örneğinden düşünme ve dil ilişkisine yönelik soru çıkarma", "Sorunun melodi kurmayı düşünme sayma kabulüyle bağlantısını açıklama"]),
  // uA3
  reviewed("understand",
    "Bir çocuk “gölge” sözcüğünü öğrendikten sonra gittiği her yerde gölgeleri göstermeye başlıyor. Bu durumda sözcüğün öğrenilmesi ile gölgelere dikkat etme arasındaki ilişkinin ne olabileceğini açıklayınız.",
    "Sözcüğün öğrenilmesi çocuğun dikkatini gölgelere yöneltmiş olabilir; bu durumda dil, ayırt etmeyi kolaylaştıran bir etken olur. Ancak çocuk gölgeleri sözcüğü bilmeden de görmüş olabilir; bu yüzden sözcüğü öğrenmenin tek neden olduğu söylenemez. Gerekçeli eşdeğer yanıtlar kabul edilir.",
    ["Gölge sözcüğünün öğrenilmesiyle dikkat değişimini ilişkilendirme", "Dikkatin sözcük öğrenmeyle yönlenmiş olabileceğini açıklama", "Gölge olayında olası ilişkiyi kesin nedensellik diye sunmama"]),
  // uA4
  reviewed("understand",
    "Bir okulda sözcük dağarcığı geniş öğrencilerin yazılı sınav notları da yüksek çıkıyor. “Birlikte görülmek” ile “biri ötekinin nedeni olmak” arasındaki farkı bu örnek üzerinden açıklayınız.",
    "İki durumun birlikte görülmesi, birinin ötekinin nedeni olduğunu göstermez. Sözcük dağarcığı notu yükseltmiş olabilir; ama çok okumak ya da derse ilgi gibi üçüncü bir etken ikisini de etkilemiş olabilir ya da başarılı öğrenciler daha çok sözcük öğrenmiş olabilir. Nedensel ilişki için ek gözlem gerekir.",
    ["Sözcük dağarcığı ile notun birlikte değişmesini belirleme", "Birlikte görülmenin neden olmayı tek başına göstermediğini açıklama", "İki ilişki türü arasındaki farkı okul örneğine bağlama"]),
  // uA5
  reviewed("understand",
    "Bir öğrenci bir sorunun cevabını kafasında bulduğunu ama ifade edecek sözcükleri bulamadığını söylüyor. Bu sözün düşünme ile dil ilişkisi hakkında neyi düşündürebileceğini ve neyi kesin olarak göstermediğini açıklayınız.",
    "Söz, düşüncenin sözcüğe dökülmeden de bulunabileceğini düşündürür. Fakat öğrencinin “bildiği” şeyin sözcüksüz mü yoksa içinden konuşarak mı yürüdüğü bu sözden anlaşılmaz; tek bir kişinin ifadesi bütün düşüncenin dilden bağımsız olduğunu kanıtlamaz. Gerekçeli eşdeğer yanıtlar kabul edilir.",
    ["Cevabı bulma ile ifade edecek sözcüğü bulmayı ayırma", "Öğrencinin sözünün düşündürdüğü olası ilişkiyi açıklama", "Bu sözün düşünmenin tümü hakkında kesin kanıt olmadığını belirtme"]),
  // uA6
  reviewed("understand",
    "Oyun oynayan çocuklar yeni bir hareket icat edip ona kendi uydurdukları bir ad veriyor. Bu örnekte düşünme ile dil arasındaki ilişkinin hangi yönde işlediğini açıklayınız ve bunun, yeni sözcük öğrenerek duyguyu ayrıntılandırma örneğinden nasıl ayrıldığını belirtiniz.",
    "Bu örnekte önce hareket (yeni durum, düşünce) vardır ve dil buna uyarlanır: ilişki düşünceden dile doğrudur. Duygu sözcüklerini öğrenerek duyguyu ayrıntılandırma örneğinde ise ilişki dilden düşünceye doğrudur. İki örnek birlikte ilişkinin tek yönlü olmayabileceğini düşündürür.",
    ["Hareketin oluşturulması ile adlandırılmasının sırasını belirleme", "Hareketi adlandırmada düşünceden dile yönü açıklama", "Adlandırmayı duygu sözcüklerinin katkısıyla yön bakımından karşılaştırma"]),
  // pA1
  reviewed("apply",
    "Bir mimar, yapacağı binanın odalarını zihninde döndürerek tasarlıyor; sonra tasarımı sözcüklerle ve çizimle anlatıyor. Bu durumu metindeki bisikletçi örneğiyle ilişkilendiriniz: hangi bakımdan benzerler ve bu örnek “her düşünme sözcüklerle yürür” yargısı hakkında ne gösterir?",
    "Her iki durumda da işlem sırasında her adım söze dökülmemektedir. Zihinde döndürmenin sözcüksüz yürüdüğü kabul edilirse örnek, bütün düşünmenin sözcüklerle yürüdüğü yargısını zorlayabilir. Ancak dışarıya anlatmamak içinden dil kullanılmadığını göstermez; işlemin düşünme sayılması ve dilin nasıl tanımlandığı da açıklanmalıdır. Tasarımı sonradan anlatmak dilin paylaşma işlevini gösterir.",
    ["Mimar ve bisikletçiyi sözel anlatım gerektirmeyen işlem bakımından eşleştirme", "Zihinsel tasarımın sözcüklere dökülmesinden önceki aşamayı açıklama", "İçinden dil kullanımı ve düşünme tanımı bakımından çıkarım sınırını belirtme"]),
  // pA2
  reviewed("apply",
    "Bir sınıf “tahmin” ve “kanıt” sözcüklerinin farkını öğrendikten sonra fen raporlarında iddialarını daha açık yazmaya başlıyor. Metindeki duygu sözcükleri örneğini bu duruma uygulayarak dilin düşünmeye katkısını açıklayınız ve bu katkının sınırını belirtiniz.",
    "Duygu sözcüklerinde olduğu gibi yeni bir ayrımı gösteren sözcükler (tahmin–kanıt) iddiaların daha açık kurulmasına katkı sağlar; bu, dilin düşünceyi ayrıntılandırabildiğini gösterir. Sınır: iki sözcüğü öğrenen sınıfın raporlarının düzelmesi bütün düşünmenin dile bağlı olduğunu kanıtlamaz; raporlarda başka etkenler de rol oynamış olabilir.",
    ["Tahmin ve kanıt ayrımını duygu sözcükleri örneğiyle eşleştirme", "Kavramsal ayrımın fen raporundaki iddialara katkısını açıklama", "Raporlardaki değişimin tek nedeninin sözcükler olduğunun kanıtlanmadığını belirtme"]),
  // pA3
  reviewed("apply",
    "Usta bir satranç oyuncusu bir pozisyona bakıp iyi hamleyi sözcüklere dökmeden “görüyor”; yarışmadan sonra hamlesinin gerekçesini ayrıntılı biçimde anlatıyor. Sözcüksüz yürütülen işlemi ve sonradan sözcüklerle anlatılan kısmı ayırarak düşünme ile dil ilişkisi hakkında ne söylenebileceğini açıklayınız.",
    "Senaryoda hamleyi sözcüklere dökmeden fark etme ile gerekçeyi sonradan anlatma farklı aşamalardır. İkinci aşama dilin gerekçeleri açığa çıkarma ve paylaşma işlevini gösterir. İlk aşama sözcüksüz düşünme olasılığını tartışmaya açar; fakat bu anlatım içinden dil kullanımı olmadığını veya bütün düşünmenin dilden bağımsız olduğunu kanıtlamaz.",
    ["Hamleyi fark etme ile gerekçesini anlatmayı ayırma", "Satrançta sözlü anlatmanın düşünceyi paylaşma işlevini açıklama", "Satranç örneğini düşünme ve dil ilişkisine tutarlı biçimde uygulama"]),
  // pA4
  reviewed("apply",
    "İki arkadaş bir şiirin anlamını konuşurken biri, konuşma sırasında şiire ilk okumadaki yorumundan farklı bir anlam verdiğini fark ediyor. Metindeki ilişkiyi bu duruma uygulayarak ilişkinin hangi yönde işlediğini ve bu yönün kesin olup olmadığını açıklayınız.",
    "Konuşma (dil) yorumun değişmesine yol açmış görünür; yani ilişki bu örnekte dilden düşünceye doğrudur: dile dökme çabası yorumu yeniden kurmuştur. Ancak yorum başka etkenle (arkadaşın sorusu, yeniden okuma) de değişmiş olabilir; bu örnekten dilin tek belirleyici olduğu sonucu çıkmaz. Gerekçeli eşdeğer yanıtlar kabul edilir.",
    ["Şiiri konuşma ile yorum değişimini ilişkilendirme", "Şiir örneğinde dilden düşünceye olası etkiyi açıklama", "Yeniden okuma gibi başka açıklamaların dışlanmadığını belirtme"]),
  // pA5
  reviewed("apply",
    "Yol tarifi isteyen bir yabancıya semtini iyi bilen bir öğrenci önce yolu zihninde izliyor, sonra “üçüncü sokaktan sağa dönün” diye anlatıyor. Bu durumda zihinde yolu izlemenin ve anlatmanın düşünme–dil ilişkisindeki yerini ayırarak açıklayınız.",
    "Yolu zihinde izlemek ile yönleri sözcüklerle başkasına anlatmak ayrı aşamalardır. Tarif, yol bilgisinin iletilmesini sağlar. Zihinde izleme sırasında içinden dil kullanılıp kullanılmadığı belirtilmemiştir; bu nedenle o aşamanın tümüyle dil dışı olduğu ileri sürülemez. Önceki tasarımın tarife yön vermesi düşünceden dile bağlantı olarak açıklanabilir.",
    ["Yolu zihinde izleme ile sözel tarif aşamalarını ayırma", "Sözel tarifin yol bilgisini iletme işlevini açıklama", "Zihinde izlemeyi içinden dil kullanılmadığının kanıtı saymama"]),
  // pA6
  reviewed("apply",
    "Bir çocuk “dün” ve “yarın” sözcüklerini öğrendikten sonra yapacağı işleri günlere ayırarak planlamaya başlıyor. Metindeki duygu sözcükleri örneğine dayanarak bu durumda dilin düşünmeye katkısının ne olabileceğini ve katkının kanıtlanması için başka neyin bilinmesi gerektiğini yazınız.",
    "Zaman sözcükleri çocuğun işleri sıralamasını ve ayırmasını kolaylaştırmış olabilir; duygu sözcüklerinde olduğu gibi dil düşünceyi ayrıntılandırmaya katkı sağlar. Katkıyı kanıtlamak için çocuğun sözcükleri öğrenmeden önce de plan yapıp yapamadığının bilinmesi gerekir; bilinmiyorsa değişim başka etkenlerden (yaş, deneyim) de kaynaklanmış olabilir.",
    ["Zaman sözcükleriyle duygu sözcüklerinin işlevini eşleştirme", "Dün ve yarın ayrımının planlamaya olası katkısını açıklama", "Önceki beceri ve başka etkenler hakkında gereken ek bilgiyi belirtme"]),
  // nA1
  reviewed("analyze",
    "Bir öğrenci “Sözcük dağarcığı geniş olanlar iyi düşünür; demek ki çok sözcük bilmek iyi düşünmeyi sağlar” diyor. Bu çıkarımın dayandığı kabulü belirleyiniz ve aynı gözlemi açıklayabilecek iki farklı açıklama yazınız.",
    "Gizli kabul: iki durumun birlikte görülmesi, birinin ötekinin nedeni olduğunu gösterir. Başka açıklamalar: çok okuyan öğrenci hem çok sözcük bilir hem iyi düşünür (ortak neden); iyi düşünen öğrenci sözcük öğrenmeye daha çok ilgi gösterir (ters yön). Sözcüklerin katkısı olabilir ama gözlem tek başına bunu kanıtlamaz.",
    ["Sözcük bilgisi ile iyi düşünme arasındaki nedensellik kabulünü belirleme", "Aynı gözlem için birinci farklı açıklamayı yazma", "Aynı gözlem için birinciden farklı ikinci açıklamayı yazma"]),
  // nA2
  reviewed("analyze",
    "“Dil düşünceyi biçimlendirir” ve “dil, düşüncenin yalnızca aracıdır” yargılarının her biri hangi gözlemle desteklenebilir? İki yargıyı ayırarak her birinin dayanağını ve sınırını çözümleyiniz.",
    "Biçimlendirme yargısını, yeni kavram ayrımını öğrenince değerlendirmeyi yeniden kurma örneği destekleyebilir; bu tek örnek bütün düşünmenin dilce belirlendiğini kanıtlamaz. Aracılık yargısını, önceden belirlenmiş yol bilgisinin karşıdakine anlatılması örneği destekleyebilir. Bu olay, dilin her zaman yalnız taşıyıcı olduğunu kanıtlamaz; ifade ederken değişme örnekleri ayrıca hesaba katılmalıdır. Sözcüksüz işlem tek başına dilin aracılık işlevini göstermez.",
    ["Biçimlendirme ve yalnız araç olma iddialarını birbirinden ayırma", "Her iddia için uygun bir gözlemi dayanakla ilişkilendirme", "Gözlemin ilgili genel iddiayı kanıtlama sınırını açıklama"]),
  // nA3
  reviewed("analyze",
    "Bir öğrenci “Bir dilde ‘turuncu’ sözcüğü yoksa o dilin konuşurları turuncu ve kırmızı renk örneklerini ayıramaz” diyor. Bu yargının dayandığı kabulü belirleyiniz ve kabulü sınayabilecek bir gündelik durum tasarlayınız; neyin gözleneceğini açıklayınız.",
    "Gizli kabul, tek bir renk adının bulunmamasının ilgili renk ayrımını da imkânsız kılmasıdır. Örnek tasarım: turuncu adını bilmeyen bir kişiden, biçim ve büyüklükleri aynı kırmızı ve turuncu kartları renklerine göre eşleştirmesi istenir. Kişi ayırabilirse ayrımın tek sözcüğe zorunlu bağımlılığı iddiası zorlanır. Bu tasarım gerçek araştırma bulgusu değildir; ayıramaması da tek başına sözcük yokluğunun neden olduğunu kanıtlamaz. Meyveleri türlerine göre ayırmak renk ayrımını sınamaz.",
    ["Renk adının yokluğuyla renk ayrımının yokluğunu eşitleyen kabulü belirleme", "Renk ayrımını gösterecek davranışı gözlem olarak belirtme", "Kabulü sınayabilecek gündelik durumu gerekçesiyle kurma"]),
  // nA4
  reviewed("analyze",
    "Bir kişi anadilinde karşılığı olmayan bir yabancı sözcüğü uzun bir cümleyle anlatıyor ve dinleyiciler sözcüğün anlamını kavrıyor. Dinleyicilerin anlamı kavrayabilmesi hangi yargıyı zorlar? Çözümleyerek açıklayınız.",
    "Karşılığı olmayan bir anlamın başka sözcüklerle anlatılıp kavranabilmesi, “sözcüğü olmayan şey düşünülemez ya da anlaşılamaz” yargısını zorlar. Anlam tek sözcükle olmasa da dilin başka araçlarıyla kurulabilmiştir; bu da düşüncenin tek bir sözcüğe bağlı olmadığını düşündürür. Yine de anlatmanın dil kullanılarak yapıldığı, bu örneğin “dilsiz anlam” kanıtı olmadığı not edilmelidir.",
    ["Tek sözcüklük karşılığın yokluğunu kavramın anlaşılamamasıyla ayırma", "Uzun açıklamanın hangi sözcük zorunluluğu iddiasını zorladığını belirtme", "Açıklamanın yine dil kullanarak yapıldığını çözümlemeye dahil etme"]),
  // nA5
  reviewed("analyze",
    "Bir öğrenci üç gözlemi sıralıyor: (1) yeni sözcük öğrenen çocuk daha ayrıntılı konuşuyor; (2) usta bisikletçi hareketlerini söze dökmüyor; (3) bir fikri yazmaya çalışan kişi fikrini değiştiriyor. Her gözlemde hangi ilişki yönünün desteklenebileceğini ve hangisinin ayrıca gösterilmesi gerektiğini çözümleyiniz.",
    "Birinci gözlem, dilin ifadeyi ayrıntılandırmasına ve düşünce ayrımlarına olası katkıya işaret eder; daha ayrıntılı konuşmak tek başına düşüncenin değiştiğini kesinleştirmez. İkinci gözlem yalnız söze dökmemeyi gösterir; bütün dilsel süreçlerden bağımsızlık kanıtlanmış değildir. Üçüncü gözlem dilsel ifade çabası ile düşünce değişimi arasında olası dilden düşünceye bağlantıdır. Karşılıklı etki demek için düşüncenin ifade seçimini nasıl yönlendirdiği de ayrıca gösterilmelidir.",
    ["Yeni sözcük gözleminde dilden düşünceye olası etkiyi ayırma", "Bisiklet gözlemini yalnız söze dökmeme düzeyinde yorumlama", "Yazma gözleminde karşılıklılık için iki yönün ayrıca gösterilmesi gerektiğini açıklama"]),
  // nA6
  reviewed("analyze",
    "Bir öğrenci “Sözcük bilmediğim için bunu düşünemedim” diyor; öğretmeni ise “Düşünemediğin için sözcük bulamadın” diyor. İki sözün hangi nedensel yönü savunduğunu çözümleyiniz ve hangi ek gözlemle ayrılabileceklerini belirtiniz.",
    "Öğrenci sözcük eksikliğinden düşünme güçlüğüne, öğretmen düşünme güçlüğünden sözcük bulamamaya giden yönü savunur. Yeni sözcük verildiğinde ve sözcük verilmeden örnekle açıklama yapıldığında kişinin kavramsal ayrımı kurup kuramadığı karşılaştırılabilir. Sözcükten sonra ilerleme, dilin katkısına dayanak olabilir; ilerleme olmaması öteki açıklamayı kanıtlamaz. Önceki bilgi, verilen yardımın içeriği gibi başka etkenler de gözetilmelidir.",
    ["Öğrencinin sözüyle öğretmenin sözündeki neden yönlerini ayırma", "İki açıklamayı ayırmaya yardımcı ek gözlem önerme", "Önerilen gözlemin hangi açıklamaya nasıl dayanak sağlayacağını belirtme"]),
  // eA1
  reviewed("evaluate",
    "Bir öğrenci “Dil, düşünceyi olduğu gibi taşıyan bir araçtır; düşünceyi hiç değiştirmez” diyor. Bu yargıyı yeni sözcük öğrenince duyguyu daha ayrıntılı ayırma örneğine dayanarak değerlendiriniz; tek örneğin çıkarım sınırını da belirtiniz.",
    "Senaryoda yeni sözcüklerle duyguları daha ayrıntılı ayırma, dilin düşünceyi hiç değiştirmediği savını zorlar. Dilin iletme işlevi bulunması, yalnız ilettiği sonucunu vermez. Olay dilin düşünceyi ayrıntılandırabileceğine dayanak sağlar; her dil kullanımının düşünceyi değiştirdiğini veya her düşünmenin dile bağlı olduğunu kanıtlamaz.",
    ["Dilin hiç değiştirmediği yargısına açık değerlendirme verme", "Duygu ayrımını değerlendirmesine dayanak gösterme", "Tek örneğin bütün düşünmeye genellenemeyeceğini değerlendirmeye katma"]),
  // eA2
  reviewed("evaluate",
    "Bir öğrenci “Sözcüğü olmayan şey düşünülemez” yargısını savunuyor; arkadaşı karşı örnek olarak bir müzisyenin melodiyi sözcük kullanmadan kurduğunu gösteriyor. Karşı örneğin yargıyı ne ölçüde çürüttüğünü değerlendiriniz.",
    "Karşı örnek, melodi kurmanın sözcüksüz yürütüldüğünü gösterir; melodi kurma “düşünme” sayılırsa yargı çürür. Savunan kişi melodi kurmanın düşünme olmadığını ya da müzisyenin farkında olmadan içinden konuştuğunu öne sürebilir. Bu yüzden karşı örnek, “düşünme”nin nasıl tanımlandığına bağlı olarak yargıyı çürütür ya da zorlar; tanım açıkça belirtilirse tartışma netleşir. Gerekçeli yargılar kabul edilir.",
    ["Melodi karşı örneği hakkında gerekçeli yargı verme", "Karşı örneğin düşünme tanımına bağlılığını açıklama", "Varsayılan sözcüksüz işlemle bütün dilsel bağımsızlığı ayırma"]),
  // eA3
  reviewed("evaluate",
    "Bir öğrenci “Sözcük dağarcığı geniş öğrencilerin notları yüksek; öyleyse sözcük öğretmek notları mutlaka yükseltir” çıkarımını yapıyor. Bu çıkarımın ne ölçüde desteklendiğini değerlendiriniz.",
    "Notların ve sözcük dağarcığının birlikte yüksek olması, sözcük öğretmenin notları mutlaka yükselteceğini göstermez. Çok okuma, ön bilgi veya ters yön gibi açıklamalar mümkündür. Sözcük öğretmenin katkısı, ayrıca sınanabilecek bir olasılıktır; gözlenen birliktelikten doğrudan kesin ya da kanıtlanmış nedensel sonuç çıkarılamaz.",
    ["Not artışındaki mutlaka ifadesini gerekçeli değerlendirme", "Birlikte görülmenin kesin nedenselliği göstermediğini belirtme", "Ortak etken veya ters yön olasılığını değerlendirmeye katma"]),
  // eA4
  reviewed("evaluate",
    "Ece, duygu sözcüklerini öğrenince duygularını daha ayrıntılı ayırmasını gerekçe göstererek “Dil düşünceyi belirler” diyor. Kaan, çocukların yeni bir oyun kuralı tasarlayıp onu anlatmak için yeni bir ifade bulmasını gerekçe göstererek “Düşünce dili belirler” diyor. İki görüşten hangisini daha ikna edici bulduğunuzu ya da nasıl ilişkilendireceğinizi bu örneklere dayanarak değerlendiriniz.",
    "Ece’nin örneği dilden düşünceye olası katkıya, Kaan’ın örneği düşüncede kurulan ayrımın ifadeyi yönlendirmesine dayanak sağlar. Bunlardan birini veya iki yönün ilişkilendirildiği görüşü savunan gerekçeli yanıt kabul edilir. Örnekler her durumda tam belirleme sonucunu zorunlu kılmaz. Sözcüksüz işlem, tek başına düşüncenin dili etkilediğine kanıt değildir.",
    ["İki görüşten biri veya ikisinin ilişkisi hakkında yargı verme", "Yargısını verilen iki farklı yön örneğine dayandırma", "Örneklerin genel belirleme iddialarına yetip yetmediğini tartışma"]),
  // eA5
  reviewed("evaluate",
    "Bir öğrenci tek bir örneğe (duygu sözcüklerini öğrenen bir arkadaşına) bakarak “Dil bütün düşünmeyi belirler” diyor. Bu çıkarımın dayanağını ve eksiğini değerlendiriniz.",
    "Dayanak: örnekte dil düşünceyi ayrıntılandırmıştır; bu gerçek bir katkıdır. Eksik: tek bir örnek bütün düşünme için genelleme sağlamaz; bisikletçi gibi sözcüksüz işlem örnekleri de vardır. Çıkarım daraltılırsa (“dil düşünceyi ayrıntılandırabilir”) desteklenir.",
    ["Duygu sözcükleri örneğinin sağladığı dayanağı belirleme", "Tek olaydan bütün düşünmeye geçişteki eksiği değerlendirme", "Dayanağı ve eksiği birlikte hesaba katan karar verme"]),
  // eA6
  reviewed("evaluate",
    "“Yeni bir sözcük öğrenmek düşünceyi hiçbir biçimde etkilemez” yargısını iki kurgusal örnekle değerlendiriniz: biri belirli bir düşünme becerisinde değişim gözlenmeyen, diğeri değişim gözlenen bir durum olsun. Bu örneklerin genel yargıyı ne ölçüde desteklediğini açıklayınız.",
    "Değişim gözlenmeyen durum: renkleri zaten ayırabilen bir kişi yeni renk adını öğrenince aynı kartları aynı biçimde eşleştirir. Değişim gözlenen durum: kişi yeni duygu ayrımlarıyla günlüğündeki değerlendirmesini yeniden kurar. İlk durum yalnız gözlenen beceride değişim olmadığını gösterir; düşüncenin hiçbir yönünün etkilenmediğini kanıtlamaz. İkinci durumdaki değişim sözcük öğrenmeye bağlıysa hiçbir biçimde etkilemez savını zorlar. Kurgusal senaryolar bilimsel bulgu sayılmaz.",
    ["Sözcük öğrenmenin gözlenen beceriyi değiştirmediği örnek yazma", "Sözcük öğrenmenin gözlenen beceriyi değiştirdiği örnek yazma", "İki örneğin hiçbir biçimde etkilemez yargısıyla ilişkisini değerlendirme"]),
  // cA1
  reviewed("create",
    "Dilin düşünmeye katkısı hakkında metindekilerden farklı yeni bir soru yazınız ve bu soruya, bütün düşünme için kesin genelleme yapmadan, bir örneğe dayanan kısa bir yanıt veriniz.",
    "Örnek soru: Bir şiir yazarken sözcük seçmek düşünceyi değiştirir mi? Yanıt: Şair “hüzün” yerine “özlem” sözcüğünü seçince anlatmak istediği duyguyu daha doğru kavrayabilir; bu örnek sözcük seçiminin düşünceyi ayrıntılandırabileceğini gösterir, bütün düşünmenin dile bağlı olduğunu kanıtlamaz. Düşünme–dil ilişkisine ilişkin ve gerekçeli eşdeğer yanıtlar kabul edilir.",
    ["Dilin düşünmeye katkısına yönelik farklı bir soru yazma", "Yazdığı soruya somut örnekle desteklenen kısa yanıt verme", "Yanıtını bütün düşünmeye ilişkin kesin genellemeden kurma"]),
  // cA2
  reviewed("create",
    "Düşünmenin sözcüksüz yürütülebildiğini düşündüren, metindeki bisikletçi örneğinden farklı kısa bir durum yazınız; durumun hangi bakımdan sözcüksüz yürütülen işlemi gösterdiğini ve işlemin “düşünme” sayılmasına yönelik bir itirazı belirtiniz.",
    "Örnek durum: Bir yüzücü akıntıya karşı kulaç atışını anlık olarak değiştirir; bunu sözcüklerle düşünmez. İşlem sözcüksüz yürütülür. İtiraz: bu bir refleks ya da alışkanlıktır, “düşünme” sayılmaz. Karşı yanıt: işlem karar ve ayarlama içerdiği için düşünme sayılabilir. Eşdeğer özgün durumlar ve gerekçeli itirazlar kabul edilir.",
    ["Bisikletçiden farklı sözcüksüz işlem durumu tasarlama", "Tasarladığı işlemin hangi bakımdan sözcüksüz olduğunu açıklama", "İşlemin düşünme sayılmasına yönelik gerekçeli itiraz belirtme"]),
  // cA3
  reviewed("create",
    "Dil ile düşünme arasındaki ilişki hakkında farklı görüşte iki öğrencinin konuştuğu dört cümlelik bir diyalog yazınız; öğrencilerin her biri bir örnek göstersin.",
    "Örnek diyalog: Ece: Yeni sözcük öğrenince duygumu daha iyi ayırıyorum; demek ki dil düşünceyi şekillendiriyor. Kaan: Ben satrançta hamleyi sözcüksüz görüyorum; dil her zaman gerekmiyor. Ece: Ama hamlenin gerekçesini anlatınca eksiğimi buluyorum. Kaan: O zaman dil bazen düşünceyi düzeltiyor, bazen yalnız taşıyor. Farklı görüşleri örneklerle gösteren özgün diyaloglar kabul edilir.",
    ["Farklı görüşlü iki öğrenciyi içeren dört cümlelik diyalog yazma", "Diyalogda birinci öğrencinin görüşünü örnekle destekleme", "Diyalogda ikinci öğrencinin farklı görüşünü örnekle destekleme"]),
  // cA4
  reviewed("create",
    "“Dilin sözcükleri olmadan hiçbir düşünme gerçekleşemez” yargısını zorlayabilecek kurgusal bir karşı örnek yazınız ve örneğin yargının hangi kısmını zorladığını açıklayınız.",
    "Örnek: Bir kişi konuşmadan ve içinden sözcük kullanmadan bir yapboz parçasını zihninde döndürdüğünü varsayar. Bu işlemi düşünme sayarsak, örnek sözcüklerin her düşünme için zorunlu olduğu savını zorlar. Böyle bir örneğin tasarlanması gerçek dünyada sözcüksüz düşünmenin kanıtlandığı anlamına gelmez; düşünmenin nasıl tanımlandığını açıklayan alternatif karşı örnekler kabul edilir.",
    ["Tam belirleme yargısını sınayan özgün karşı örnek yazma", "Karşı örneğin yargının hangi kısmını zorladığını açıklama", "İstenen yargı ile karşı örneğin bağlantısını tutarlı gerekçelendirme"]),
  // cA5
  reviewed("create",
    "Dilin düşünceyi ayrıntılandırdığını gösteren bir gündelik yaşam örneğini iki aşamalı olarak (sözcüğü öğrenmeden önce ve sonra) yazınız ve bu örneğin neyi kanıtlamadığını belirtiniz.",
    "Örnek: Önce: bir öğrenci kitapları yalnız “güzel” ve “güzel değil” diye ayırır. Sonra: “akıcı”, “sürükleyici” ve “öğretici” sözcüklerini öğrenince kitapları bu ölçütlere göre karşılaştırır. Örnek dilin ayrıntılandırmaya katkısını gösterir; bütün düşünmenin dile bağlı olduğunu kanıtlamaz. Eşdeğer özgün örnekler kabul edilir.",
    ["Sözcük öğrenmeden önceki durumu somut olarak yazma", "Sözcük öğrenme sonrasındaki ayrıntılandırmayı aynı durumda gösterme", "İki aşamalı örneğin kanıtlamadığı genellemeyi belirtme"]),
  // cA6
  reviewed("create",
    "Dilin düşünceye katkısını sınamak isteyen bir öğretmen için kısa bir gözlem planı yazınız: hangi iki grubu karşılaştırır, neyi ölçer, sonucu nasıl yorumlar?",
    "Örnek plan: başlangıçta aynı ayrım görevini yapan ve benzer sonuç alan iki grup karşılaştırılır. Bir gruba kavramsal ayrımla ilgili sözcükler, ötekine eşit süreyle bu ayrımı içermeyen çalışma verilir. Aynı ayırma görevinin önce ve sonraki sonuçları karşılaştırılır. Yeni sözcüklerle ilerleme, bu koşullarda katkıya dayanak olabilir; başlangıç farkı, verilen açıklama ve deneyim gibi etkenler gözetilir. İlerleme olmaması düşünmenin dilden bağımsızlığını kanıtlamaz. Başka gerekçeli planlar kabul edilir.",
    ["Sözcük öğrenme bakımından karşılaştırılacak iki grup önerme", "İki grupta aynı ölçütle gözlenecek beceriyi belirtme", "Olası sonucu başka etkenleri gözeterek sınırlı yorumlama"]),
];

export const extraThinkingLanguageB: Task[] = [
  // uB1
  reviewed("understand",
    "Bir öğrenci projesinin planını kafasında “tamam” sanıyor; yazmaya başlayınca iki adımın birbiriyle çeliştiğini fark edip planı değiştiriyor. Bu örnekte yazma sürecinin düşünceye ne yaptığını kendi cümlelerinizle açıklayınız.",
    "Yazma (dile dökme) süreci öğrencinin planındaki çelişkiyi fark etmesini sağlamış ve düşüncesini değiştirmiştir; yani ifade etme çabası düşünceyi de etkilemiştir. Bu, dilin düşünceyi yalnız taşımadığını gösteren bir örnektir; tek örnekle dilin tek belirleyici olduğu sonucu çıkmaz.",
    ["Yazma öncesi plan ile fark edilen çelişkiyi ayırma", "Yazma sırasında planın nasıl değiştiğini açıklama", "Değişimi dilin düşünceyle ilişkisine bağlama"]),
  // uB2
  reviewed("understand",
    "“Düşünce önce gelir, dil yalnız onu taşır” yargısının neyi iddia ettiğini bir gündelik örnekle açıklayınız.",
    "Yargı, düşüncenin dil olmadan önceden tam oluştuğunu ve dilin bu hazır düşünceyi değiştirmeden başkasına ilettiğini iddia eder. Örnek: bir kişi aklındaki yol tarifini hazır bildiğini söyler ve yalnız anlatır. Yargı, ilişkiyi tek yönlü sayar.",
    ["Yalnız taşıma yargısının önceden hazır düşünce kabulünü açıklama", "Bu kabulü gösteren gündelik örnek verme", "Örneğin neden yalnız taşıma yargısına uyduğunu açıklama"]),
  // uB3
  reviewed("understand",
    "İki arkadaş bir kuralın adil olup olmadığını tartışırken “eşit” ve “adil” sözcüklerinin farkını konuşuyor; tartışmadan sonra ikisi de kuralla ilgili görüşünü yeniden yazıyor. Bu örnekte sözcük ayrımının görüşlere etkisini açıklayınız.",
    "Sözcük ayrımı (eşit ve adil), kuralı değerlendirirken kullanılan ölçütleri netleştirir; öğrenciler görüşlerini bu ayrıma göre yeniden yazmıştır. Yani kavram ayrımı düşünceyi düzenlemiş ve görüşlerin açıklığını artırmıştır. Bu etki, görüşleri tek başına belirlediği anlamına gelmez.",
    ["Eşit ve adil ayrımının görüşlere etkisini belirleme", "Kavram ayrımıyla görüşün yeniden yazılmasını ilişkilendirme", "Sözcük ayrımının düşünceyi düzenleme katkısını açıklama"]),
  // uB4
  reviewed("understand",
    "Bir öğretmen “Düşünce ve dil birbirini karşılıklı etkiler” diyor. Bu sözdeki “karşılıklı” sözcüğünün ne anlama geldiğini bir örnekle açıklayınız.",
    "“Karşılıklı”, etkinin iki yönde işlemesi demektir: dil düşünceyi ayrıntılandırır ve düzenler; düşünce de yeni ifadeler üretilmesine yol açar. Örnek: bir öğrenci kavramları ayırınca fikirleri netleşir (dilden düşünceye); netleşen fikirlerini anlatmak için yeni sözcükler arar (düşünceden dile).",
    ["Karşılıklı etkiyi iki yönlü ilişki olarak açıklama", "Verdiği örnekte dilden düşünceye etkiyi gösterme", "Aynı örnekte düşünceden dile etkiyi ayrıca gösterme"]),
  // uB5
  reviewed("understand",
    "Bir öğrenci bir film hakkındaki fikrini içinden “güzeldi” diye geçiriyor; arkadaşı “Neden?” diye sorunca fikrini gerekçeleriyle toparlarken filmin sevdiği ve sevmediği yanlarını ayırıyor. Bu örnekte sorunun ve gerekçelendirmenin düşünceye etkisini açıklayınız.",
    "Arkadaşın sorusu ve gerekçe verme çabası öğrencinin fikrini ayrıntılandırmıştır: tek bir “güzeldi” yargısı yerine ayrıntılı bir değerlendirme ortaya çıkmıştır. İfade etme (dil) çabası düşünceyi etkilemiştir. Bu etki, fikrin önceden hiç var olmadığı anlamına gelmez; önceki fikir de ifadeye zemin olmuştur.",
    ["Neden sorusuyla başlayan gerekçelendirme sürecini açıklama", "Güzeldi yargısının ayrıntılı değerlendirmeye dönüşmesini gösterme", "Soruyu ve gerekçelendirmeyi düşünce değişimiyle ilişkilendirme"]),
  // uB6
  reviewed("understand",
    "Bir öğrenci “Dil de düşünce de kendi başına işler, aralarında ilişki yoktur” diyor. Bu yargının metindeki iki örnekle (eşit–adil ayrımı, şemayı cümleye dönüştürme) neden uyumlu olmadığını açıklayınız.",
    "Eşit–adil ayrımı, sözcük ayrımının görüşlerin açıklığını etkilediğini; şemayı cümleye dönüştürme ise ifade etmenin düşünceyi değiştirebildiğini gösterir. Bu iki örnek dil ile düşünme arasında ilişki bulunduğunu gösterir; “ilişki yoktur” yargısıyla uyumlu değildir.",
    ["Eşit ve adil ayrımının ilişki yoktur yargısıyla gerilimini açıklama", "Şemayı cümleye dönüştürmenin ilişki yoktur yargısıyla gerilimini açıklama", "İki örneği bağlantısızlık yargısıyla tutarlı biçimde karşılaştırma"]),
  // pB1
  reviewed("apply",
    "Bir öğrenci ödev taslağını yazarken ilk paragrafın ikinci paragrafla çeliştiğini fark edip ilk paragrafı değiştiriyor. Metindeki şemayı cümleye dönüştürme örneğiyle ilişkilendirerek bu durumda dil ile düşünme arasındaki ilişkinin yönünü açıklayınız.",
    "Taslağı yazma öğrencinin çelişkiyi fark etmesini sağlamıştır; şemayı cümleye dönüştürürken eksik ayrıntıyı fark etme örneğiyle aynı ilişkidir: ifade etme çabası düşünceyi değiştirir. İlişki bu örnekte yazmadan (dilden) düşünceye doğru işlemiştir; ancak öğrencinin ilk paragraftaki düşüncesi de yazmaya zemin olmuştur: ilişki karşılıklıdır.",
    ["Paragraf çelişkisini şemada fark edilen eksikle eşleştirme", "Yazma çabasının ödev taslağındaki düşünceye etkisini açıklama", "Bu olayda gösterilen etki yönünü doğru belirtme"]),
  // pB2
  reviewed("apply",
    "Bir grup “görev” ve “sorumluluk” sözcüklerinin farkını konuştuktan sonra sınıf kurallarına ilişkin önerisini daha açık yazıyor. Eşit–adil ayrımı örneğini bu duruma uygulayarak dilin düşünceye katkısını ve bu katkının sınırını açıklayınız.",
    "Eşit–adil örneğinde olduğu gibi “görev” ve “sorumluluk” ayrımı önerideki ölçütleri netleştirmiştir; yani kavram ayrımı düşünceyi düzenler. Sınır: bu ayrım önerinin içeriğini tek başına belirlemez; grubun kendi görüşleri de rol oynar. Dilin tek belirleyici olduğu sonucu çıkmaz.",
    ["Görev ve sorumluluk ayrımını eşit ve adil ayrımına uygulama", "Yeni ayrımın sınıf kurallarına ilişkin öneriye katkısını açıklama", "Ayrımın öneriyi tek başına belirlediği sonucundan kaçınma"]),
  // pB3
  reviewed("apply",
    "Bir öğrenci bir matematik sorusunun çözümünü zihninde “tamamlamış” sanıyor; arkadaşına sesli anlatırken bir adımı atladığını fark ediyor. Bu durumu “Düşünce önce gelir, dil yalnız onu taşır” yargısına uygulayarak yargının bu durumu açıklayıp açıklayamadığını belirtiniz.",
    "Yargı, çözümün hazır olduğunu ve anlatmanın yalnız onu taşıdığını varsayar. Oysa öğrenci anlatırken eksik adımı fark etmiştir; yani anlatma düşünceyi değiştirmiştir. Yargı bu durumu açıklayamaz; “dil düşünceyi bazen yalnız taşır, bazen değiştirir” biçimindeki daraltılmış yargı durumu açıklar.",
    ["Yalnız taşıma yargısının matematik çözümüne ilişkin kabulünü belirleme", "Anlatırken eksik adımı fark etmenin bu kabulle ilişkisini açıklama", "Yargının verilen durumu açıklama yeterliliğine karar verme"]),
  // pB4
  reviewed("apply",
    "Bir tartışma kulübünde bir öğrenci fikrini sesli savunurken kendi öncüllerinden birinin dayanaksız olduğunu fark ediyor. Metindeki ilişkiyi bu duruma uygulayarak ilişkinin hangi yönde işlediğini ve bunun karşılıklı ilişki yargısını nasıl desteklediğini yazınız.",
    "Sesli savunma (dil) öğrencinin öncülündeki eksikliği fark etmesine yol açmıştır: dilden düşünceye etki. Öğrencinin fikri ise savunmaya konu olduğu için önce düşünce vardır: düşünceden dile. Böylece ilişki iki yönde işlemiş, karşılıklı ilişki yargısı desteklenmiştir. Tek örnekle her durumda karşılıklılık kanıtlanmaz.",
    ["Öğrencinin mevcut fikrinin savunma ifadelerini yönlendirdiğini gösterme", "Sesli savunmanın öncülün yeniden düşünülmesine etkisini gösterme", "Tartışma örneğinde iki yönü ayırarak karşılıklılığı gerekçelendirme"]),
  // pB5
  reviewed("apply",
    "Bir kulüp etkinlik duyurusunu yazarken “katılım zorunlu mu, gönüllü mü?” sorusuyla karşılaşıyor ve bu iki sözcüğü ayırınca kulüp kurallarını yeniden düzenliyor. Bu durumu eşit–adil ayrımı örneğiyle karşılaştırarak benzer ve farklı yanını yazınız.",
    "Benzerlik: iki durumda da bir sözcük ayrımı kuralların ve görüşlerin yeniden düzenlenmesine yol açmıştır (dilden düşünceye etki). Fark: eşit–adil örneğinde ayrım okul kaynaklarının dağıtımına ilişkin görüşleri, burada ise kulüp kurallarını etkilemiştir. Gerekçeli eşdeğer karşılaştırmalar kabul edilir.",
    ["İki sözcük ayrımı örneğinin ortak işlevini belirleme", "Duyuru ve okul kaynakları bağlamlarının farkını açıklama", "Benzerlik ve farklılığı kavramların düşünceye katkısıyla ilişkilendirme"]),
  // pB6
  reviewed("apply",
    "Bir öğrenci günlüğüne yazarken önce “kötü bir gündü” diye yazıyor; sonra o günü cümlelerle anlatınca öfkesinin asıl nedeninin farklı olduğunu fark ediyor. Metindeki şemayı cümleye dönüştürme örneğini bu duruma uygulayınız ve bu durumdan “dil düşünceyi tek başına belirler” sonucunun çıkıp çıkmadığını belirtiniz.",
    "Yazma süreci öğrencinin öfkesinin nedenine ilişkin düşüncesini değiştirmiştir; şemayı cümleye dönüştürme örneğiyle aynı ilişkidir. Ancak öğrencinin yaşadığı gün ve duygusu (düşünce) yazmanın konusudur; dil tek başına belirleyici değildir. “Dil düşünceyi tek başına belirler” sonucu çıkmaz; karşılıklı etki söylenebilir.",
    ["Günlüğe yazmayı şemayı cümleye dönüştürmeyle eşleştirme", "Duygunun nedeni hakkındaki düşüncenin değişimini açıklama", "Yazma örneğinden dilin tek başına belirlediği sonucunu çıkarmama"]),
  // nB1
  reviewed("analyze",
    "Bir öğrenci “Şemayı cümleye dönüştürünce şemam değişti; demek ki dil düşünceyi tamamen belirliyor” diyor. Çıkarımın hangi adımında aşırı genelleme yapıldığını belirleyiniz ve yargıyı metinle uyumlu biçimde yeniden kurunuz.",
    "Aşırı genelleme: şemanın değişmesinden “tamamen belirliyor” sonucuna geçişte. Örnek, ifade etmenin düşünceyi etkileyebildiğini gösterir; tamamen belirlemeyi göstermez, çünkü şema önceden zaten vardı. Uyumlu yeniden kurma: “İfade etme çabası düşünceyi değiştirebilir; dil ile düşünce birbirini etkiler.”",
    ["Şemanın değişmesinden tamamen belirlemeye geçişi ayırma", "Bu geçişteki aşırı genellemeyi gerekçelendirme", "Yargıyı örneğin desteklediği kapsamda yeniden kurma"]),
  // nB2
  reviewed("analyze",
    "“Düşünce önce gelir, dil yalnız onu taşır” ve “dil düşünceyi tamamen belirler” yargılarını karşılaştırınız: her ikisi ilişkiyi hangi bakımdan tek yönlü kurar ve ikisini birden aşan bir yargı nasıl kurulabilir?",
    "Birinci yargı yalnız düşünceden dile, ikincisi yalnız dilden düşünceye yön tanır; her ikisi de ilişkiyi tek yönlü kurar. İkisini aşan yargı: dil ve düşünce birbirini etkiler; dil düşünceyi ayrıntılandırıp düzenler, düşünce de yeni ifadeler gerektirir; hiçbiri tek belirleyici değildir.",
    ["Yalnız taşıma iddiasının düşünceden dile yönünü ayırma", "Tam belirleme iddiasının dilden düşünceye yönünü ayırma", "İki yönün ilişkisini içeren gerekçeli ortak yargı kurma"]),
  // nB3
  reviewed("analyze",
    "Bir öğrenci metindeki iki örneği (eşit–adil ayrımı ve şemayı cümleye dönüştürme) tek bir yargıda toplamak istiyor. İki örneğin ortak yönünü ve birbirinden ayrılan yönünü çözümleyerek her ikisini birden açıklayan bir yargı yazınız.",
    "Ortak yön, dilsel çalışma sırasında görüşlerin yeniden düzenlenmesidir. Ayrılan yön: eşit–adil ayrımı değerlendirme ölçütlerini açıklaştırır; şemadaki ayrımı anlatma gereği cümle seçimini yönlendirir, cümle kurma çabası da şemayı düzeltmeye katkı sağlar. Birleşik yargı: bu olaylarda düşünce ifade seçimini yönlendirebilir ve dilsel ifade düşüncenin yeniden düzenlenmesine katkıda bulunabilir; bütün durumlara ilişkin zorunluluk çıkmaz.",
    ["İki ana örneğin ortak düşünceyi düzenleme yönünü çözümleme", "Kavram ayrımıyla ifade seçimi ve şema düzeltmesinin farkını ayırma", "Her iki örneği karşılayan kapsamı sınırlı yargı yazma"]),
  // nB4
  reviewed("analyze",
    "Bir öğrenci “Karşılıklı ilişki demek, dil ile düşüncenin aynı şey olması demektir” diyor. Bu çıkarımdaki yanlış adımı çözümleyerek “karşılıklı ilişki” ile “aynı şey olmak” arasındaki farkı açıklayınız.",
    "Yanlış adım, etkileşimden özdeşlik sonucuna geçilmesidir. Karşılıklı etki, iki yönlü bir ilişkiyi; özdeşlik, aynı şey olmayı ifade eder. Etkileşim tek başına özdeşliği kanıtlamaz, özdeş olmadıklarını da tek başına kanıtlamaz. Dil ile düşüncenin farklı veya aynı sayılmasına ilişkin görüş ayrıca kavramsal gerekçe ister; dil sadece sesli sözcüklere indirgenmez.",
    ["Karşılıklı ilişki ile özdeşlik arasındaki çıkarım adımını belirleme", "Etkileşimin tek başına özdeşliği göstermediğini açıklama", "Dil ve düşünceyi ayırma veya özdeş sayma için ek gerekçe gerektiğini belirtme"]),
  // nB5
  reviewed("analyze",
    "Bir öğretmen iki gözlem aktarıyor: (1) kavram ayrımını öğrenen öğrenciler görüşlerini daha açık yazıyor; (2) hazırlıksız konuşan bir öğrenci konuşurken fikrini değiştiriyor. Bu iki gözlemin uyumlu bir yargıda birleşip birleşmediğini çözümleyiniz.",
    "Birinci gözlem kavram ayrımı ile daha açık ifade arasındaki, ikinci gözlem konuşma ile fikir değişimi arasındaki bağlantıdır. İkisi dilsel çalışmanın düşünceyi düzenlemeye katkıda bulunabileceği yargısında birleştirilebilir. İki gözlemde de esas olarak dilden düşünceye olası etki gösterilmiştir; ters yöndeki etki bu gözlemlerden tek başına kanıtlanmaz. Başka gerekçeli, kapsamı sınırlı ortak yargılar kabul edilir.",
    ["Kavram ayrımı ve konuşurken değişim gözlemlerini ayrı çözümleme", "İki gözlemi birlikte açıklayan yargı kurma", "Gözlemlerde açıkça gösterilmeyen ters yönü kanıtlanmış saymama"]),
  // nB6
  reviewed("analyze",
    "Bir öğrenci “Her iki örnek de dilin düşünceyi etkilediğini gösteriyor; öyleyse düşünce dili hiç etkilemez” diyor. Bu çıkarımın dayandığı kabulü belirleyiniz ve çıkarımın neden geçersiz olduğunu açıklayınız.",
    "Gizli kabul: dilin düşünceyi etkilediği gösterilince etkinin tek yönlü olduğu sonucu çıkar. Oysa dilin düşünceyi etkilemesi, düşüncenin dili etkilemediğini göstermez; ikisi birlikte doğru olabilir. Düşünce yeni sözcük ve ifade üretilmesine de yol açabilir; çıkarım geçersizdir.",
    ["Bir yönün varlığından ters yönün yokluğuna geçiş kabulünü belirleme", "İki etkinin birlikte mümkün olduğunu açıklama", "Çıkarımın geçersizliğini yönler arasındaki ilişkiyle gerekçelendirme"]),
  // eB1
  reviewed("evaluate",
    "Bir öğrenci “İfade etme çabası düşünceyi değiştirdiğine göre düşünce dilden önce var olamaz” diyor. Bu yargıyı metindeki şema örneğine dayanarak değerlendiriniz.",
    "Şema belirli cümlelere dönüştürülmeden önce vardır ve cümle kurma sırasında değişir. Bu, düşüncenin belirli bir ifadeden önce bulunması ile ifade sürecinde değişmesinin bağdaşabildiğini gösterir. Şemanın önceden varlığı, o düşüncenin daha önce hiçbir dilsel süreçle ilişkili olmadığını göstermez. Öğrencinin tüm düşünmenin bütün dil kullanımından önce var olamayacağı savı bu olayla ne kesin kanıtlanır ne kesin çürütülür; savın kapsamı ve düşünme tanımı açıklanmalıdır.",
    ["Şemanın belirli cümlelerden önce bulunduğunu dayanak gösterme", "Belirli ifadeden önce bulunmayı bütün dilden bağımsızlıktan ayırma", "Öğrencinin dilden önce var olamaz yargısını gerekçeli değerlendirme"]),
  // eB2
  reviewed("evaluate",
    "Bir öğrenci “Eşit ile adil sözcüklerini ayırmak görüşleri açıklaştırdı; öyleyse sözcük ayrımı her tartışmayı çözer” diyor. Bu çıkarımın ne ölçüde desteklendiğini değerlendiriniz.",
    "Örnek, sözcük ayrımının görüşleri açıklaştırabildiğini gösterir. “Her tartışmayı çözer” genellemesi desteklenmez: bazı tartışmalar değer ayrılığından kaynaklanır ve sözcük ayrımı onları ortadan kaldırmaz. Çıkarım daraltılırsa (“görüşlerin netleşmesine yardım edebilir”) desteklenir.",
    ["Görüşü açıklaştırma ile her tartışmayı çözmeyi ayırma", "Sözcük ayrımının çözemeyebileceği anlaşmazlığı gerekçelendirme", "Her tartışmayı çözer çıkarımının desteği hakkında karar verme"]),
  // eB3
  reviewed("evaluate",
    "Bir öğrenci “Karşılıklı ilişki görüşü, hiçbir şeyi açıklamayan ucuz bir uzlaşmadır” diyor. Bu eleştiriyi metindeki iki örneğe dayanarak değerlendiriniz.",
    "Karşılıklı demek tek başına açıklama değildir; iki yönün nasıl işlediği gösterilmelidir. Eşit–adil ayrımı dilden düşünceye katkıdır. Şemada fark edilen ayrımı anlatma gereği cümle seçimini yönlendirir (düşünceden dile); cümle kurarken eksikliği fark etme şemayı değiştirir (dilden düşünceye). Bu bağlantıları gösteren görüş eleştiriyi yanıtlayabilir; tek olaydaki bağlantı her durumda karşılıklılığı kanıtlamaz. Eleştiriyi başka dayanaklarla savunan gerekçeli değerlendirmeler de kabul edilir.",
    ["Karşılıklılık eleştirisi hakkında açık gerekçeli yargı verme", "Metinde düşünceden dile ve dilden düşünceye dayanakları ayrı gösterme", "İki yönü adlandırmanın ötesinde nasıl bağlandıklarını değerlendirme"]),
  // eB4
  reviewed("evaluate",
    "Bir öğrenci “Dil yalnız düşünceyi taşıyorsa bir fikri yazarken değişmemesi gerekirdi; fikirler yazarken sık sık değişiyor, o hâlde dil düşünceyi taşımaktan fazlasını yapıyor” diyor. Bu akıl yürütmeyi değerlendiriniz.",
    "Yalnız taşıma savı, ifade etmenin düşünceyi değiştirmediğini öne sürer. Yazarken fikirlerin değişmesi bu savı sorgulamaya açar; fakat değişimin yazmanın dilsel yönünden mi, yeniden düşünme veya yeni bilgiden mi kaynaklandığı belirlenmelidir. “Yazma sırasında değişiyor” öncülünden “yazma nedeniyle değişiyor” sonucu tek başına çıkmaz. Senaryodaki şema gibi ek dayanaklarla dilin katkısı savunulabilir; savı gerekçeyle sınırlayan alternatif değerlendirmeler kabul edilir.",
    ["Yalnız taşıma savı ile fikir değişimi gözlemini ayırma", "Yazarken değişimin başka nedenlerini değerlendirme", "Gözlemin dilsel neden iddiasını ne ölçüde desteklediğine karar verme"]),
  // eB5
  reviewed("evaluate",
    "İki öğrenciden biri “Dil düşünceyi biçimlendirir”, diğeri “Düşünce dili biçimlendirir” diyor; öğretmen “İkisini de örneklerle sınayalım” diyor. Bu yaklaşımın felsefi tartışma için neden uygun olduğunu değerlendirerek kendi yargınızı yazınız.",
    "İddiaları örneklerle sınamak, dayanaklarını ve sınırlarını görünür kılar. Kavram ayrımının değerlendirmeyi açıklaştırması dilden düşünceye; yeni tasarlanan oyun kuralını anlatmak için ifade geliştirilmesi düşünceden dile örnektir. Sözcüksüz işlem tek başına düşünceden dile etki kanıtı değildir. Karşı örnekleri ve tanımları gözeterek öğretmenin yaklaşımını savunan veya gerekçeli biçimde sınırlayan yanıtlar kabul edilir.",
    ["İki görüşü örneklerle sınamanın felsefi işlevini değerlendirme", "Düşünceden dile ve dilden düşünceye uygun örnekleri ayırma", "Kendi kararında örneklerin sınırını veya karşı örneği hesaba katma"]),
  // eB6
  reviewed("evaluate",
    "“Dil ile düşünce karşılıklı etkileşir” yargısı için bir güçlü ve bir zayıf yan belirleyiniz ve yargının metne uygun biçimde nasıl sınırlandırılabileceğini yazınız.",
    "Güçlü yan: şemadaki ayrımı anlatma gereği ifade seçimini yönlendirir; cümle kurma ise şemayı düzeltmeye katkı sağlar. Bunlar iki ayrı yöndür. Zayıf yan: sınırlı örnekler her düşünme veya dil kullanımında iki yönün zorunlu işleyeceğini göstermez. Yeniden yazım: Bu örneklerde düşünce ifade seçimini yönlendirebilir ve dilsel ifade düşüncenin yeniden düzenlenmesine katkı sağlayabilir.",
    ["Karşılıklı etki yargısının metindeki güçlü dayanağını belirtme", "Karşılıklı etki yargısının zayıf veya sınırlı yanını belirtme", "Yargıyı iki yönün dayanağına uygun kapsamda yeniden yazma"]),
  // cB1
  reviewed("create",
    "Dil ile düşünce arasında karşılıklı etkiyi gösteren, metindeki örneklerden farklı bir gündelik durum yazınız; durumda etkinin iki yönünü ayrı cümlelerle belirtiniz.",
    "Örnek: Bir öğrenci “yorgunum” yerine “odaklanamıyorum, ilgimi kaybediyorum” sözcüklerini kullanınca sorununu ayırt eder (dilden düşünceye). Sorununu ayırt edince arkadaşına anlatmak için “ilgi” hakkında yeni ifadeler bulur (düşünceden dile). Etkinin iki yönünü ayrı cümlelerle gösteren özgün durumlar kabul edilir.",
    ["Metindekilerden farklı gündelik durum tasarlama", "Durumda dilden düşünceye etkiyi ayrı cümlede gösterme", "Durumda düşünceden dile etkiyi ayrı cümlede gösterme"]),
  // cB2
  reviewed("create",
    "“Düşünce önce gelir, dil yalnız onu taşır” yargısına karşı, şemayı cümleye dönüştürme örneğinden farklı kısa bir karşı örnek yazınız.",
    "Örnek karşı örnek: Bir öğrenci deney sonucunu rapora yazarken verileri iki grupta sınıflamak zorunda kalır ve yazarken yeni bir sınıflama ölçütü fark eder. Yazma düşünceyi değiştirmiştir; bu da “yalnız taşır” yargısını zorlar. Eşdeğer özgün karşı örnekler kabul edilir.",
    ["Şemayı cümleye dönüştürmeden farklı karşı örnek yazma", "Örnekte dilsel ifade çabasının düşünceyi nasıl etkilediğini gösterme", "Örneği yalnız taşıma yargısına karşı tutarlı kurma"]),
  // cB3
  reviewed("create",
    "Dil ile düşünme arasındaki karşılıklı ilişkiyi tek bir cümlede anlatan, kesin genellemeden kaçınan bir yargı yazınız ve bu yargıyı destekleyen, etkinin farklı yönlerini gösteren iki örnek veriniz.",
    "Örnek yargı: Dilsel ayrımlar düşüncemizi düzenlemeye, düşüncede fark ettiğimiz ayrımlar da anlatımımızı kurmaya katkı sağlayabilir. Birinci örnek: Eşit ve adil kavramlarını ayırma, kaynak dağıtımı görüşünü netleştirir (dilden düşünceye). İkinci örnek: Yeni oyun kuralını tasarlayan çocuklar onu anlatmak için yeni ifade geliştirir (düşünceden dile). İki yönü gerçekten ayıran başka gerekçeli örnekler kabul edilir.",
    ["Karşılıklı ilişki hakkında kapsamı sınırlı tek cümlelik yargı yazma", "Yargının bir yönünü gösteren birinci örneği verme", "Yargının diğer yönünü gösteren ikinci örneği verme"]),
  // cB4
  reviewed("create",
    "Dilin düşünceyi hiç etkilemediğini savunan bir arkadaşınıza iki cümlelik bir yanıt ve bir örnekle karşılık yazınız.",
    "Örnek yanıt: Her sözcük düşünceyi değiştirmez; ama eşit ile adil ayrımını öğrenen öğrenciler görüşlerini daha açık yazabildi. Bu örnek, dilin düşünceye etkisinin bulunabildiğini gösterir. Eşdeğer gerekçeli yanıtlar kabul edilir.",
    ["Dilin hiç etkilemediği savına iki cümlelik yanıt yazma", "Yanıtı somut bir etki örneğiyle destekleme", "Örneğin hiç etkilemez savını nasıl sınırladığını açıklama"]),
  // cB5
  reviewed("create",
    "Bir öğrenci dil ile düşünce ilişkisini “Dil, düşüncenin elbisesidir” diye benzetiyor. Bu benzetmenin neyi iyi, neyi eksik anlattığını belirtiniz ve karşılıklı ilişkiyi daha iyi gösteren yeni bir benzetme yazınız.",
    "Elbise benzetmesi düşüncenin başkasına sunulması yönünü anlatabilir; fakat ifadenin düşünceyi dönüştürme yönünü görünmez bırakabilir. Elbisenin kişiyi hiç değiştirmediği kabulü zorunlu değildir. Yeni benzetme: Bahçenin planı ve bahçe birlikte düzenlenir; bahçede fark edilen ihtiyaç çizimi değiştirir, çizimde fark edilen düzen de bahçeyi yeniden kurmaya yön verir. Benzetmede bahçe düşünceye, planın çizimi dilsel ifadeye karşılık gelir; iki yön ve benzetmenin sınırlılığı gerekçeyle gösterilir. Başka tutarlı benzetmeler kabul edilir.",
    ["Elbise benzetmesinin iyi anlattığı yönü açıklama", "Elbise benzetmesinin eksik bıraktığı yönü gerekçelendirme", "Yeni benzetmede düşünceden dile ve dilden düşünceye yönleri gösterme"]),
  // cB6
  reviewed("create",
    "Okul gazetesi için “Konuşurken fikrimiz değişir mi?” başlıklı bir köşe yazısının üç cümlelik girişini yazınız; girişte bir gözlem, bir soru ve bir sınırlama bulunsun.",
    "Örnek giriş: Bir arkadaşıma fikrimi anlatırken onu bambaşka bir yerden toparladığımı fark ettim. Acaba konuşmak fikirlerimizi gerçekten değiştiriyor mu? Her konuşma fikri değiştirmez, ama bazı durumlarda sözcük seçmek düşüncemizi netleştirebilir. Gözlem, soru ve sınırlama içeren özgün girişler kabul edilir.",
    ["Üç cümlelik köşe yazısı girişinde gözlem sunma", "Girişte düşünme ve dil ilişkisine yönelik soru kurma", "Girişte verilen gözlemin kapsamını sınırlayan ifade kullanma"]),
];

export const grade10Unit21Extras: Task[][] = [extraThinkingLanguageA, extraThinkingLanguageB];
