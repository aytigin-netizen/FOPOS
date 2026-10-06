import type { Level } from './philosophy-exam-case.ts';

type Rubric = [string, string, string];
type ReviewedTask = { level: Level; stem: string; key: string; criteria: Rubric };
const bank: Record<string, Record<number, ReviewedTask>> = {};
export const reviewedCriterionDescriptions: Record<string, string> = {};
function pair(focus: string, slot: number, level: Level, stems: [string, string], keys: [string, string], rubrics: [Rubric, Rubric]) {
  bank[focus] ??= {};
  stems.forEach((stem, i) => {
    for (const criterion of rubrics[i]) reviewedCriterionDescriptions[criterion] = criterion;
    bank[focus][slot + i] = { level, stem, key: keys[i] + ' Aynı ilişkiyi metne dayanarak kuran eşdeğer gerekçeli yanıtlar kabul edilir.', criteria: rubrics[i] };
  });
}
function shared(focus: string, slot: number, level: Level, stems: [string, string], keys: [string, string], rubric: Rubric) {
  pair(focus, slot, level, stems, keys, [rubric, rubric]);
}

// Öğretmen tarafından hazırlanmış görevler; resmî program metni değildir.
const history = 'felsefi düşüncenin özellikleri ve tarihsel gelişimi';
shared(history, 0, 'understand', [
  'Metinde farklı geleneklerin hangi sorulara ağırlık verdiğini kendi cümlelerinizle açıklayınız. Ticaret ve tartışma ortamlarının rolünü, aynı şehirlerde yeni düşünce üretilmeyen dönemleri de dikkate alarak belirtiniz.',
  'Çalışma kâğıdındaki gelenek çeşitliliğini ve şehirlerdeki düşünce üretiminin zamanla değişmesini kendi cümlelerinizle özetleyiniz. Ticaret ve tartışma ortamının bu üretimle ilişkisini açıklayınız.',
], [
  'Hint ve Çin geleneklerinde yaşam ve düzen, Antik Yunan’da doğa ve varlık, Türk-İslam geleneğinde akıl ve bilgi öne çıkar. Ticaret ve tartışma ortamı gelişimi kolaylaştırmış olabilir; aynı şehirlerde üretimsiz dönemler bulunduğu için tek başına garanti vermez.',
  'Gelenekler farklı soruları öne çıkarır; aynı şehirde düşünce üretimi her dönemde sürmez. Ticaret ve farklı görüşleri dinleme kolaylaştırıcı koşullar olarak düşünülebilir; tek neden veya yeterli koşul sayılmaz.',
], ['Geleneklerin farklı soru alanlarını metne uygun açıklama', 'Ticaret ve tartışma ortamının kolaylaştırıcı rolünü açıklama', 'Üretimsiz dönemleri belirterek tek neden veya garanti yargısından kaçınma']);
const question = 'felsefi sorunun özellikleri ve felsefi soru sorma';
shared(question, 0, 'understand', [
  'Kapanış saati ve ödünç alınan kitap soruları ile bilgi-bilgelik sorusunun cevaplanma biçimini kendi cümlelerinizle açıklayınız. Cevabın zor bulunmasının neden tek başına felsefi olma ölçütü sayılamayacağını belirtiniz.',
  'Metindeki olgusal soruları ve kavram sorgulayan soruyu cevaplanma biçimleri bakımından özetleyiniz. Öğrencinin üçüncü soruyu felsefi sayma gerekçesindeki eksikliği açıklayınız.',
], [
  'Saat ve ödünç soruları kayıtla cevaplanır; bilgi-bilgelik sorusu bu kavramların anlam ve ilişkisini sorgular. Kayıtta cevabı bulunan bir sorunun zor olması onu felsefi yapmaz.',
  'Olgusal sorular için kayıtlara, bilgi-bilgelik ilişkisi için kavramsal sorgulamaya başvurulur. Öğrenci güçlüğü ölçüt saymıştır; ödünç kaydının zor bulunması cevaplanma biçimini değiştirmez.',
], ['Saat ve ödünç sorularının kayıtla cevaplandığını açıklama', 'Bilgi-bilgelik sorusunun kavramların anlam ve ilişkisini sorgulattığını açıklama', 'Cevap güçlüğünün tek başına felsefi olma ölçütü olmadığını gerekçelendirme']);

const fields = 'felsefenin bilim, din ve sanatla ilişkisi';
shared(fields, 0, 'understand', [
  'Metindeki bilim insanı, sanatçı ve inananın suya yaklaşımını kendi cümlelerinizle açıklayınız. Bu yaklaşımların dayanaklarını sorgulamanın nasıl bir felsefi etkinlik olduğunu ve alanların yerini alıp almadığını belirtiniz.',
  'Suyun kaynamasını araştırma, suyu resimde simge olarak kullanma ve arınma pratiği örneklerini amaç ve yöntemleriyle özetleyiniz. Felsefenin bu örneklerle nasıl ilişki kurabileceğini açıklayınız.',
], [
  'Bilim deney ve gözlem, sanat yorum ve ifade, din inanç ve pratik yönünden ele alınır. Kanıt, anlam ve temellendirme üzerine sorgulama felsefi bir ilişkidir; bu etkinliklerin yerine geçmez. Bilim, sanat ve din içinde de dayanaklar sorgulanabilir; metindeki ayrım mutlak tekel olarak okunmamalıdır.',
  'Kaynama araştırması olgusal koşulları, resim anlamı, arınma pratiği inanç ve pratiği öne çıkarır. Felsefe yöntem, anlam ve gerekçe üzerine sorular sorabilir; alanların değerini veya varlığını ortadan kaldırmaz. Bu alanların kendi içinde de sorgulama yapılabileceğini belirten gerekçeli açıklama kabul edilir.',
], ['Üç örneğin amaç ve yöntemlerini metne uygun ayırma', 'Kanıt, anlam veya inancın dayanağını sorgulamayı felsefi ilişkiyle açıklama', 'Felsefi sorgulamayı alanların yerine geçme veya onları değersiz sayma olarak sunmama']);
shared(fields, 2, 'apply', [
  'Bir biyolog ağacın büyümesini ölçüyor, bir ressam aynı ağacı özlem simgesi olarak çiziyor, bir kişi ağacı dinî bir anlatıyla ilişkilendiriyor. “Bir iddiayı kanıt saymamızı sağlayan nedir?” sorusunun bu çalışmalardan hangisinin dayanağına yöneldiğini, nedenini ve çalışmanın yerine geçip geçmediğini metindeki ayrımı kullanarak açıklayınız.',
  'Bir araştırmacı sesin yayılmasını ölçüyor, bir müzisyen seslerle duygusunu ifade ediyor, bir kişi sesi ibadet pratiğiyle ilişkilendiriyor. “Bir eseri güzel saymamızın dayanağı nedir?” sorusunun bu çalışmalardan hangisinin dayanağına yöneldiğini, nedenini ve çalışmanın yerine geçip geçmediğini metindeki ayrımı kullanarak açıklayınız.',
], [
  'Soru, biyoloğun bilimsel iddialarında kanıtın ne sayıldığını sorgular. Ölçümü yapmak yerine onun gerekçelendirme dayanağını ele alır; deneysel çalışmanın yerini almaz. Kanıt sorusunun başka alanlarla da ilişkisini gerekçelendiren yanıtlar kabul edilir.',
  'Soru, müzisyenin sanat etkinliğinde güzellik yargısının dayanağını sorgular. Eseri üretmek yerine değerlendirme ölçütlerini ele alır; sanatın yerini almaz. Başka alanlara ilişkin gerekçeli bağlantılar da kabul edilir.',
], ['Yeni sorunun yöneldiği alanı ve dayanağı doğru belirleme', 'Metindeki amaç veya yöntem ayrımını yeni soruya uygulama', 'Dayanağı sorgulamak ile ilgili çalışmayı yapmak arasındaki farkı açıklama']);
shared(fields, 6, 'evaluate', [
  'Bir öğrenci “Suyun kaynama koşullarını deneyle bulduğumuza göre kanıtın ne sayılacağını ayrıca sorgulamak gereksizdir” diyor. Bu çıkarımı metindeki bilim örneği ve felsefi sorgulama ilişkisine dayanarak değerlendiriniz; gerekçeli kararınızı yazınız.',
  'Bir öğrenci “Sanatçı suya anlam verdiğine göre bir yorumun hangi dayanakla benimsendiğini ayrıca sorgulamak gereksizdir” diyor. Bu çıkarımı metindeki sanat örneği ve felsefi sorgulama ilişkisine dayanarak değerlendiriniz; gerekçeli kararınızı yazınız.',
], [
  'Deney kaynama koşullarını araştırır; kanıtın niteliği üzerine sorgulama başka bir sorudur. Deneyin başarısından bu sorgulamanın gereksizliği çıkmaz. Bilimin kendi yöntemini de sorgulayabileceğini belirten yanıt kabul edilir; felsefenin tek yetkili olduğu varsayılmaz.',
  'Sanatçı anlam üretir; yorumu benimsemenin gerekçesini sorgulamak başka bir sorudur. Anlam verilmiş olması sorgulamayı gereksiz kılmaz. Sanatçının da yorumunu sorgulayabileceğini belirten yanıt kabul edilir; felsefenin tek yetkili olduğu varsayılmaz.',
], ['Örnekteki etkinliğin ne yaptığını metne dayanarak gösterme', 'Etkinliğin başarısından sorgulamanın gereksizliğine geçişi gerekçeli değerlendirme', 'Kararı alanların yerini alma veya sorgulama tekeli iddiası kurmadan gerekçelendirme']);

const functions = 'felsefenin bireysel ve toplumsal işlevleri';
shared(functions, 0, 'understand', [
  'İddiayı paylaşmadan önce kaynak sorgulayan öğrenci ile ortak karardan önce gerekçe karşılaştıran sınıfın ne yaptığını kendi cümlelerinizle açıklayınız. Uzlaşma sağlanmamasının bu etkinliklerin katkısıyla ilişkisini belirtiniz.',
  'Metindeki kişisel yargıyı gözden geçirme ve ortak kararın dayanaklarını görünür kılma etkinliklerini özetleyiniz. Tartışmanın tek öneride birleşmemesi bu katkılar hakkında ne gösterir, neyi göstermez?',
], [
  'Kaynak sorgulama bireysel yargının gözden geçirilmesini, gerekçeleri karşılaştırma ortak kararın dayanaklarının görünmesini sağlar. Uzlaşma olmayabilir; bu durum katkıların yokluğunu göstermez.',
  'Öğrenci kendi yargısını, sınıf kararın gerekçelerini gözden geçirir. Tek öneride birleşilmemesi uzlaşmanın garanti edilmediğini gösterir; sorgulamanın yararsızlığını göstermez.',
], ['Kaynak sorgulamanın bireysel yargıya katkısını açıklama', 'Gerekçe karşılaştırmanın ortak karara katkısını açıklama', 'Katkı ile hızlı uzlaşma garantisini birbirinden ayırma']);
shared(functions, 2, 'apply', [
  'Ece bir sağlık iddiasını paylaşmadan kaynağını inceliyor. Sınıf ise gezi yeri için farklı gerekçeleri karşılaştırıyor fakat anlaşamıyor. Metindeki işlevleri bu iki duruma uygulayınız; her bir katkıyı ve anlaşmazlıktan çıkarılamayacak sonucu açıklayınız.',
  'Mert bir haberin gerekçelerini araştırarak ilk görüşünü gözden geçiriyor. Okul kulübü bütçe kullanımını tartışıyor fakat tek kararda birleşemiyor. Metindeki işlevleri bu iki duruma uygulayınız; her bir katkıyı ve anlaşmazlıktan çıkarılamayacak sonucu açıklayınız.',
], [
  'Ece’nin kaynak incelemesi kişisel yargıyı gözden geçirmeye; gezi tartışması kararın gerekçelerini görünür kılmaya katkı sağlar. Anlaşmazlık sorgulamanın yararsız olduğunu göstermez; doğru karar garantisi de kurulmaz.',
  'Mert kişisel yargısını gözden geçirir; bütçe tartışması ortak kararın dayanaklarını görünür kılar. Tek karar çıkmaması katkıyı ortadan kaldırmaz; uzlaşma veya doğru karar garanti edilmez.',
], ['Yeni durumdaki bireysel sorgulamayı metindeki işlevle ilişkilendirme', 'Yeni durumdaki ortak tartışmayı metindeki toplumsal işlevle ilişkilendirme', 'Anlaşmazlıktan yararsızlık veya kesin doğru karar garantisi çıkarmama']);
shared(functions, 6, 'evaluate', [
  'Bir öğrenci “Sınıf tek öneride birleşemediğine göre gerekçeleri karşılaştırmak hiçbir işe yaramamıştır” diyor. Bu çıkarımı metindeki kişisel ve toplumsal katkıları kullanarak değerlendiriniz; gerekçeli kararınızı yazınız.',
  'Bir öğrenci “Kaynak sorgulayan kişi ve gerekçeleri tartışan sınıf mutlaka doğru karar verir” diyor. Bu çıkarımı metindeki kişisel ve toplumsal katkıları kullanarak değerlendiriniz; gerekçeli kararınızı yazınız.',
], [
  'Kaynak sorgulamak yargıyı gözden geçirmeyi, gerekçe karşılaştırmak kararın dayanaklarını görmeyi sağlar. Uzlaşma yokluğundan hiçbir katkı olmadığı çıkmaz; katkı hızlı uzlaşmayla eşitlenemez.',
  'Yargıyı gözden geçirme ve gerekçeleri görünür kılma gelişime katkı sağlar; mutlaka doğru karar vermeyi garanti etmez. Katkı ile sonuç garantisi birbirinden ayrılmalıdır.',
], ['Metindeki bireysel ve toplumsal katkıları dayanak gösterme', 'Verilen çıkarımda katkı ile sonuç garantisinin karıştırılmasını gösterme', 'Yararsızlık veya kesin başarı genellemesine gitmeden gerekçeli karar kurma']);

const language = 'düşünme ve dil arasındaki nedensel ilişkiler';
shared(language, 0, 'understand', [
  'Duygu sözcüklerini öğrenen öğrenci ile hareketlerini sözcüklere dökmeyen bisikletçinin örneklerini kendi cümlelerinizle açıklayınız. Bu iki örnek düşünme ve dil hakkında hangi sınırlı bilgiyi verir?',
  'Yeni sözcüklerin duyguları ayırmadaki rolünü ve bisikletçinin sözel anlatım olmadan yaptığı işlemi özetleyiniz. Bu örneklerden bütün düşünme hakkında kesin bir yargı kurulup kurulamayacağını belirtiniz.',
], [
  'Yeni sözcükler duyguları ayırmayı ve ifade etmeyi kolaylaştırır; bisikletçi her işlemi sözcüğe dökmez. Bu örnekler dilin katkısını ve sözel anlatım olmadan işlem yapılabildiğini gösterir; bütün düşünmenin niteliğini kesin olarak kanıtlamaz. Bisiklet işleminin düşünme sayılmasına gerekçeli itiraz kabul edilir.',
  'Duygu ayrımı dilin katkısına örnektir; denge ayarlama sözel anlatımla yürütülmeyebilir. İki örnekten tüm düşünmenin dile bağlı olduğu veya olmadığı sonucu kanıtlanamaz. Denge ayarlamanın düşünme olup olmadığını tartışan gerekçeli açıklama kabul edilir.',
], ['Yeni sözcüklerin duygu ayrımına katkısını açıklama', 'Bisiklet örneğinde sözel anlatım olmadan işlemin yürütüldüğünü açıklama', 'İki örnekten bütün düşünme için kesin sonuç çıkarmama']);
shared(language, 2, 'apply', [
  'Selin “kızgınım” derken kırgınlık ve hayal kırıklığı sözcüklerini öğrenince duygusunu daha ayrıntılı anlatıyor. Bir kaleci ise her hareketini söylemeden topa uzanıyor. Metindeki ilişkiyi bu iki duruma uygulayınız; dilin katkısını, sözel anlatım gerektirmeyen işlemi ve çıkarım sınırını açıklayınız.',
  'Berk “korkuyorum” derken kaygı ve endişe sözcükleriyle duygusunu daha ayrıntılı anlatıyor. Bir dansçı ise her adımı söylemeden hareketini ayarlıyor. Metindeki ilişkiyi bu iki duruma uygulayınız; dilin katkısını, sözel anlatım gerektirmeyen işlemi ve çıkarım sınırını açıklayınız.',
], [
  'Sözcük ayrımı Selin’in duygusunu ayrıntılandırmasına katkı sağlar; kaleci hareketini sözel anlatmadan ayarlar. Bu, bütün düşünmenin dilden bağımsız veya dile bağlı olduğunu kanıtlamaz. Hareketin düşünme sayılmasına gerekçeli itiraz kabul edilir.',
  'Sözcük ayrımı Berk’in ifadesini ayrıntılandırır; dansçı işlemi her adımı söylemeden yürütür. Bütün düşünme hakkında kesin bağımlılık veya bağımsızlık sonucu çıkmaz. Hareketin düşünme sayılmasına gerekçeli itiraz kabul edilir.',
], ['Yeni sözcüklerin yeni durumdaki duygu ayrımına katkısını gösterme', 'Sözel anlatım olmadan yürütülen işlemi metindeki bisiklet örneğiyle ilişkilendirme', 'İki örnekten tüm düşünme için bağımlılık veya bağımsızlık kanıtı çıkarmama']);
const mutual = 'düşünme ve dil ilişkisine yönelik uyumlu bir bütün oluşturma';
shared(mutual, 0, 'understand', [
  'Eşit ve adil sözcüklerini ayıran grup ile şemasını cümleye dönüştürünce değiştiren öğrencinin yaşadığı değişimi açıklayınız. Metindeki düşünme-dil ilişkisini kendi cümlelerinizle özetleyiniz.',
  'Metindeki kavram ayrımı ve şemayı söze dönüştürme örneklerini özetleyiniz. Bu örneklerde dilin düşünceyle ilişkisinin hangi yönleri görünür oluyor? Kendi cümlelerinizle açıklayınız.',
], [
  'Kavram ayrımı görüşlerin daha açık kurulmasını sağlar; ifade etme çabası eksik ayrıntıyı fark ettirip şemayı değiştirmiştir. Dil düşünceyi ifade edip düzenlerken ifade süreci düşünceyi de etkileyebilir; biri tek belirleyici sayılmaz.',
  'Eşit-adil ayrımı yargıyı açıklaştırır; cümleye dönüştürme düşüncenin yeniden düzenlenmesine yol açar. İlişki yalnız düşüncenin dilde taşınması değildir; örnekler karşılıklı etkiyi gösterir.',
], ['Eşit-adil ayrımının yargının açıklığına katkısını açıklama', 'İfade etme çabasının şemayı değiştirdiğini açıklama', 'İki örneği tek yönlü taşıma yerine karşılıklı ilişkiyle özetleme']);
shared(mutual, 2, 'apply', [
  'Bir grup “başarılı” ve “hızlı” sözcüklerini ayırınca önerisini açıklaştırıyor. Ada çözüm çizimini cümlelerle anlatırken eksik bir adımı fark edip çizimi değiştiriyor. İki olayı metindeki örneklerle eşleştiriniz ve düşünme-dil ilişkisi hakkında bunları birlikte açıklayan bir yargı kurunuz.',
  'Bir grup “istek” ve “ihtiyaç” sözcüklerini ayırınca bütçe önerisini açıklaştırıyor. Bora tasarımını yazarken eksik bir bağlantı fark edip tasarımı değiştiriyor. İki olayı metindeki örneklerle eşleştiriniz ve düşünme-dil ilişkisi hakkında bunları birlikte açıklayan bir yargı kurunuz.',
], [
  'Başarılı-hızlı ayrımı eşit-adil ayrımıyla; çizimdeki eksik adımı yazarken fark etme şemanın değişmesiyle eşleşir. Dil düşünceyi düzenleyip ifade eder; ifade etme çabası düşünceyi de değiştirebilir. Tek yönlü veya tek belirleyici yargı kurulmaz.',
  'İstek-ihtiyaç ayrımı eşit-adil ayrımıyla; tasarımı yazarken eksik bağlantıyı fark etme şemanın değişmesiyle eşleşir. İki örnek karşılıklı ilişkiyle açıklanır; dilin yalnız taşıyıcı olduğu veya her şeyi belirlediği söylenmez.',
], ['Yeni kavram ayrımını eşit-adil örneğine doğru uygulama', 'Yazarken fark edilen eksiği şemanın değişmesi örneğine doğru uygulama', 'İki olayı karşılıklı ilişki gösteren ve tek belirleyici kurmayan bir yargıyla birleştirme']);
shared(mutual, 6, 'evaluate', [
  'Bir öğrenci “Düşünce tamamlanır; dil onu olduğu gibi taşır, düşünceyi değiştirmez” diyor. Bu yargıyı metindeki iki örneği kullanarak değerlendiriniz ve gerekçeli kararınızı yazınız.',
  'Bir öğrenci “Şemayı cümleye dönüştürme şemayı değiştirdiğine göre bütün düşünceyi yalnız dil belirler” diyor. Bu yargıyı metindeki iki örneği kullanarak değerlendiriniz ve gerekçeli kararınızı yazınız.',
], [
  'Kavram ayrımı yargıyı açıklaştırır; yazma sırasında eksik ayrıntı fark edilip şema değişir. Bu örnekler dilin yalnız taşıdığı yargısını sınırlar; karşılıklı ilişkiyi destekler, dilin tek belirleyici olduğunu kanıtlamaz.',
  'Kavram ayrımı ve şemanın değişmesi dilin katkısını gösterir; tek bir şema olayı bütün düşünceyi yalnız dilin belirlediğini göstermez. Karşılıklı etki kabul edilebilir, tek belirleyici genellemesi sınırlandırılmalıdır.',
], ['Kavram ayrımı ve şemanın değişmesi örneklerini dayanak gösterme', 'Verilen tek yönlü veya tek belirleyici yargının dayanaklarla ilişkisini değerlendirme', 'Karşılıklı etkiyi koruyup kesin tek belirleyici genellemesinden kaçınarak karar kurma']);

const logic = 'mantık ve argümantasyonun temel kavramları';
shared(logic, 2, 'apply', [
  '“Bütün kulüp üyeleri kayıtlıdır. Ece kulüp üyesidir. Öyleyse Ece kayıtlıdır.” Bir kişi aynı zamanda ve aynı bakımdan “Ece hem kayıtlıdır hem kayıtlı değildir” diyor; bir başkası “Ece kayıtlıdır çünkü herkes öyle düşünüyor” diyor. Metindeki ayrımları uygulayarak öncülleri ve sonucu, çelişkiyi ve çoğunluk gerekçesinin değerini açıklayınız.',
  '“Bütün okul araçları numaralıdır. Bu mikroskop okul aracıdır. Öyleyse bu mikroskop numaralıdır.” Bir kişi aynı zamanda ve aynı bakımdan “Mikroskop hem numaralıdır hem numaralı değildir” diyor; bir başkası “Numaralıdır çünkü herkes öyle düşünüyor” diyor. Metindeki ayrımları uygulayarak öncülleri ve sonucu, çelişkiyi ve çoğunluk gerekçesinin değerini açıklayınız.',
], [
  'İlk iki yargı öncül, Ece’nin kayıtlı olması sonuçtur; genel kural Ece’ye uygulanmıştır. Aynı zamanda ve bakımdan kayıtlı/kayıtsız birlikte doğru olamaz. Herkesin inanması doğruluğu kanıtlamaz. Terim adı yerine doğru işlev açıklaması da kabul edilir.',
  'İlk iki yargı öncül, mikroskobun numaralı olması sonuçtur. Aynı zamanda ve bakımdan numaralı/numarasız birlikte doğru olamaz. Çoğunluk kabulü doğruluğu kanıtlamaz. Terim adı yerine doğru işlev açıklaması da kabul edilir.',
], ['Yeni argümanda iki öncülü ve sonucu ayırıp kuralın uygulanmasını açıklama', 'Aynı zamanda ve bakımdan karşıt ifadelerin birlikte doğru olamayacağını açıklama', 'Çoğunluk kabulünün önermenin doğruluğunu kanıtlamadığını açıklama']);
shared(logic, 6, 'evaluate', [
  'Bir öğrenci “Atlas hakkında kurulan çıkarım geçerlidir; öyleyse öncüllerin gerçekte doğru olup olmadığını araştırmaya gerek yoktur” diyor. Bu yargıyı atlas argümanının yapısını ve doğruluk iddiasının dayanağını kullanarak değerlendiriniz.',
  'Bir öğrenci “Sınıftaki herkes atlasın kayıtlı olduğuna inandığı için bu gerekçe, kayıt kuralı ve atlasın okul kitabı olduğu bilgisiyle kurulan çıkarım kadar güçlüdür” diyor. Bu yargıyı atlas argümanının yapısını ve doğruluk iddiasının dayanağını kullanarak değerlendiriniz.',
], [
  'Genel kayıt kuralı ve atlasın okul kitabı olması sonucu mantıksal olarak destekler. Geçerlilik, öncüller doğruysa sonucun doğru olmasıyla ilgilidir; öncüllerin gerçekte doğruluğunu tek başına göstermez. Kayıt kontrolü gerekebilir.',
  'Kural ve özel durumdan çıkarım mantıksal bağ taşır; çoğunluk kabulü atlasın gerçekten kayıtlı olduğunu kanıtlamaz. Geçerli çıkarım da öncüllerin fiilî doğruluğunu tek başına garanti etmez. İnsanların kayıt gibi bağımsız dayanak sunmasıyla salt çoğunluğa dayanma ayrılır.',
], ['Atlas argümanındaki kural ile özel durumun sonucu nasıl desteklediğini açıklama', 'Geçerliliği fiilî doğruluk veya salt çoğunluk kabulünden ayırma', 'Verilen iddiaya metindeki dayanak ve sınırı kullanarak gerekçeli karar verme']);
const premises = 'ifadeleri bağlamını koruyarak öncül ve sonuca ayırma';
shared(premises, 0, 'understand', [
  'Temsilcinin sözündeki giriş kuralını, Deniz hakkındaki bilgiyi ve ulaşılan sonucu kendi cümlelerinizle açıklayınız. “Bu hafta” ifadesi ve üyelik koşulu nasıl korunmalıdır?',
  'Metindeki iki öncülü ve sonucu özetleyiniz. Üyeliğin gerekli koşul olması ile üyeliğin giriş için tek başına yeterli olması arasındaki farkı bu metin bakımından açıklayınız.',
], [
  'Bu hafta girebilen herkes üye olmalıdır; Deniz üye değildir, bu yüzden bu hafta giremez. Zaman sınırı korunur. Üyelik gereklidir; üye olan herkesin mutlaka girebileceği belirtilmemiştir.',
  'Kural bu hafta giriş için üyelik gerektirir; Deniz’in üyeliği yoktur; bu hafta giremez. Üyelik yokluğu girişi engeller, fakat üyelik varlığı başka koşullar olabileceğinden tek başına giriş garantisi vermez.',
], ['Bu hafta giriş için üyeliğin gerekli koşul olduğunu açıklama', 'Deniz’in üye olmaması ile bu hafta girememesi sonucunu ayırma', 'Zaman sınırını ve gerekli koşul ile yeterli koşul ayrımını koruma']);
shared(premises, 6, 'evaluate', [
  'Bir öğrenci “Deniz bu hafta giremiyorsa hiçbir zaman kütüphaneye giremez” diyor. Bu çıkarımı temsilcinin kuralı ve Deniz hakkındaki bilgiye dayanarak değerlendiriniz; zaman sınırını ve üyeliğin gerekli koşul olup tek başına yeterlilik garantisi vermediğini açıklayarak kararınızı gerekçelendiriniz.',
  'Bir öğrenci “Deniz daha sonra kulübe üye olursa aynı kurala göre kütüphaneye mutlaka girer” diyor. Bu çıkarımı temsilcinin kuralı ve Deniz hakkındaki bilgiye dayanarak değerlendiriniz; zaman sınırını ve üyeliğin gerekli koşul olup tek başına yeterlilik garantisi vermediğini açıklayarak kararınızı gerekçelendiriniz.',
], [
  'Kural bu haftayla sınırlıdır; Deniz’in üye olmaması bu hafta girememesini açıklar. Hiçbir zaman sonucu başka dönemlere genişletildiği için bu öncüllerden çıkmaz.',
  'Kural yalnız bu haftayı kapsar ve üyeliği gerekli koşul sayar. Sonraki dönemlerin kuralı verilmemiştir; üyeliğin tek başına yeterli olduğu da söylenmemiştir. Mutlaka girer sonucu bu öncüllerden çıkmaz.',
], ['Kuralın bu haftayla sınırlı olduğunu dayanak gösterme', 'Üyeliğin gerekli koşul olduğunu ve tek başına giriş garantisi verilmediğini açıklama', 'Verilen genişletilmiş sonucun öncüllerden çıkıp çıkmadığını gerekçelendirme']);

const restatement = 'ifadeleri anlamını değiştirmeden nesnel biçimde yeniden ifade etme';
shared(restatement, 0, 'understand', [
  'Duyuruda yağış olması ve olmaması durumunda etkinliğin nerede yapılacağını kendi cümlelerinizle açıklayınız. Hangi gün ve kaç etkinlik hakkında bilgi verildiğini belirtiniz.',
  'Cuma günkü etkinliğe ilişkin iki hava koşulunu ve her koşulun yer bilgisini özetleyiniz. Duyurunun zaman ve kapsamını değiştirmeden açıklayınız.',
], [
  'Yağış varsa cuma günkü açık hava etkinliği salonda, yağış yoksa bahçede yapılır. Bilgi cuma günkü tek etkinliği kapsar; bütün etkinlikler veya iptal hakkında hüküm yoktur.',
  'Cuma günkü aynı etkinliğin yeri yağışa bağlıdır: yağışlıysa salon, yağışsızsa bahçe. Gün ve tek etkinlik kapsamı korunur.',
], ['Yağış koşulunu salon bilgisiyle doğru eşleştirme', 'Yağış olmaması koşulunu bahçe bilgisiyle doğru eşleştirme', 'Cuma gününü ve tek etkinlik kapsamını koruma']);
shared(restatement, 2, 'apply', [
  '“Çarşamba günkü gözlem çalışması, hava açık olursa bahçede; kapalı olursa sınıfta yapılacak.” Bu duyuruyu anlamını değiştirmeden kendi cümlelerinizle yeniden yazınız; koruduğunuz iki koşulu, günü ve tek çalışma kapsamını belirtiniz.',
  '“Pazartesi günkü okuma etkinliği, kütüphane açık olursa kütüphanede; kapalı olursa derslikte yapılacak.” Bu duyuruyu anlamını değiştirmeden kendi cümlelerinizle yeniden yazınız; koruduğunuz iki koşulu, günü ve tek etkinlik kapsamını belirtiniz.',
], [
  'Çarşamba günkü gözlem, açık havada bahçede, kapalı havada sınıfta gerçekleştirilecektir. Açık/kapalı iki koşulun yerleri ve çarşamba günü korunur; başka çalışmalar veya iptal eklenmez.',
  'Pazartesi yapılacak okuma için kütüphane açıksa kütüphane, kapalıysa derslik kullanılacaktır. İki koşulun yerleri, pazartesi ve tek okuma etkinliği korunur; yeni iddia eklenmez.',
], ['Birinci koşul ile ona bağlı yer bilgisini yeni duyuruda koruma', 'İkinci koşul ile ona bağlı yer bilgisini yeni duyuruda koruma', 'Yeni duyurunun gününü ve tek etkinlik kapsamını koruyup yorum eklememe']);
shared(restatement, 6, 'evaluate', [
  'Bir öğrenci duyuruyu “Cuma günü bütün etkinlikler salonda yapılır” diye yazıyor. Bu ifadenin özgün duyurunun anlamını koruyup korumadığını iki koşul, zaman ve kapsam bakımından değerlendiriniz; gerekçeli kararınızı yazınız.',
  'Bir öğrenci duyuruyu “Cuma günkü etkinlik yağış yoksa bahçededir; yağış varsa iptal edilir” diye yazıyor. Bu ifadenin özgün duyurunun anlamını koruyup korumadığını iki koşul, zaman ve kapsam bakımından değerlendiriniz; gerekçeli kararınızı yazınız.',
], [
  'Cuma korunmuştur; yağış koşulu kaldırılmış, bahçe seçeneği düşmüş ve tek etkinlik bütün etkinliklere genişletilmiştir. İfade anlamı korumaz.',
  'Cuma ve tek etkinlik korunmuştur; yağışsız durumda bahçe doğrudur. Yağışlı durumda salon yerine iptal eklenmiştir; iki koşulun bütünü korunmadığı için anlam değişir.',
], ['İki koşulun yer bilgilerini öğrenci ifadesiyle karşılaştırma', 'Zaman ve tek etkinlik kapsamının korunup korunmadığını belirtme', 'Korunan ve değişen öğelerden hareketle anlamın korunmasına gerekçeli karar verme']);

// Oluşturma çiftleri: soru/yanıt ve kısa durum ürünleri ayrı ölçütler taşır.
function creation(focus: string, stems: [string, string], keys: [string, string], rubrics: [Rubric, Rubric]) {
  pair(focus, 8, 'create', stems, keys, rubrics);
}
creation(fields, [
  'Metindeki su örneğinden farklı bir bilim, din veya sanat etkinliği seçiniz. Bu etkinliğin dayanağına yönelik yeni bir felsefi soru yazınız ve etkinlik ile felsefi sorgulama arasındaki farkı gösteren gerekçeli bir yanıt veriniz.',
  'Metindeki su örneğinden farklı bir bilim, din veya sanat etkinliğinin dayanağının sorgulandığı kısa bir durum yazınız. Durumda etkinliğin yapılması ile dayanağının sorgulanmasını ayırınız ve farkı açıklayınız.',
], [
  'Örnek: Bir müzik eseri hangi ölçütle güzel sayılır? Eseri çalmak sanat etkinliğidir; güzellik ölçütlerini tartışmak eserin değerlendirme dayanağını sorgular. Alanın yerini almaz. Farklı alan ve gerekçeli yanıtlar kabul edilir.',
  'Örnek: Öğrenciler bir deney yapar, sonra hangi gözlemin iddialarına kanıt sayılacağını tartışır. Deney yapmakla kanıt ölçütünü sorgulamak ayrıdır; biri ötekini değersiz kılmaz.',
], [['Suyla ilgili olmayan bir etkinliğin dayanağına yönelik özgün felsefi soru yazma', 'Soruya doğrudan cevap veren ve etkinlik ile sorgulamayı ayıran yanıt yazma', 'Yanıtı metindeki amaç veya yöntem ayrımına dayandırma'], ['Suyla ilgili olmayan bir etkinlik ve dayanak sorgulaması içeren özgün durum yazma', 'Durumda etkinliği yapmak ile dayanağı sorgulamayı ayrı gösterme', 'Farkı metindeki amaç veya yöntem ayrımıyla açıklama']]);
creation(functions, [
  'Kaynak sorgulama ve sınıf tartışması örneklerinden farklı, felsefi sorgulamanın bireysel veya toplumsal katkısı hakkında yeni bir soru yazınız. Katkıyı ve sonuç garantisinin sınırını açıklayan gerekçeli bir yanıt veriniz.',
  'Kaynak sorgulama ve sınıf tartışması örneklerinden farklı, bireysel veya toplumsal sorgulama içeren kısa bir durum yazınız. Durumun katkısını ve kesin başarı veya uzlaşma garantisi vermediğini açıklayınız.',
], [
  'Örnek: Bir alışkanlığımın gerekçesini sorgulamak kararımı nasıl etkiler? Kendi yargımı gözden geçirmemi sağlar; her kararın mutlaka doğru olacağını garanti etmez. Metindeki katkı-sonuç ayrımıyla bağlantılı farklı yanıtlar kabul edilir.',
  'Örnek: Bir mahallede insanlar park kullanımının adil olup olmadığını gerekçeleriyle tartışır, fakat anlaşamaz. Kararın dayanakları görünür olur; uzlaşma yokluğu bu katkıyı ortadan kaldırmaz.',
], [['Metindekilerden farklı bir katkı sorusu yazma', 'Soruyu belirli bir bireysel veya toplumsal katkıyla cevaplama', 'Katkıyı açıklarken kesin başarı veya uzlaşma garantisi kurmama'], ['Metindekilerden farklı ve sorgulama içeren özgün durum yazma', 'Durumda belirli bir bireysel veya toplumsal katkıyı görünür kılma', 'Katkıyı metinle ilişkilendirip sonuç garantisinden ayırma']]);
creation(language, [
  'Duygu sözcükleri ve bisiklet örneklerinden farklı, dilin düşünmeye katkısı hakkında yeni bir soru yazınız. Sorunuza metindeki bilgilerle ilişkili gerekçeli bir yanıt veriniz; bütün düşünme hakkında kesin genelleme yapmayınız.',
  'Duygu sözcükleri ve bisiklet örneklerinden farklı, dilin düşünmeye katkısını gösteren kısa bir durum yazınız. Durumun metindeki hangi ilişkiyle eşleştiğini ve tüm düşünme için neyi kanıtlamadığını açıklayınız.',
], [
  'Örnek: Eşit ve adil sözcüklerini ayırmak dağıtım kararını nasıl etkiler? Aynı dağıtımın her durumda adil olmayabileceğini daha açık düşünmeye katkı sağlar; bütün düşünmenin dile bağlılığını kanıtlamaz.',
  'Örnek: Bir öğrenci tahmin ve kanıt ayrımını öğrenince araştırma iddiasını daha açık kurar. Sözcük ayrımı düşünceyi ayrıntılandırmaya katkı sağlar; bütün düşünmenin sözcüğe bağlı olduğunu kanıtlamaz.',
], [['Duygu ve bisiklet örneklerinden farklı bir düşünme-dil sorusu yazma', 'Soruyu dilin düşünmeye belirli katkısını göstererek cevaplama', 'Yanıtı metne dayandırıp bütün düşünme için kesin genelleme yapmama'], ['Duygu ve bisiklet örneklerinden farklı özgün durum yazma', 'Durumda dilin düşünmeye katkısını tutarlı gösterme', 'Katkıyı metinle eşleştirip bütün düşünme için kesin genelleme yapmama']]);
creation(logic, [
  'Atlas örneğinden farklı, bir çıkarımın geçerliliği ile bir yargıya çok kişinin inanması arasındaki fark hakkında yeni bir soru yazınız. Sorunuza öncül-sonuç ilişkisini ve çoğunluk gerekçesinin sınırını gösteren bir yanıt veriniz.',
  'Atlas örneğinden farklı, iki öncülden sonuç çıkaran bir kişi ile aynı sonucu yalnız çoğunluğun kabulüne dayandıran başka bir kişinin yer aldığı kısa bir durum yazınız. İki gerekçenin farkını ve geçerliliğin doğruluk garantisi olmadığını açıklayınız.',
], [
  'Örnek: Bütün kulüp üyeleri kayıtlıdır ve Ece üyedir öncülleriyle kayıtlılık sonucu çıkarmak, herkesin Ece’nin kayıtlı olduğuna inanmasından nasıl ayrılır? İlkinde kural ve özel durumdan mantıksal bağ kurulur; ikincisi doğruluk kanıtı değildir. Geçerlilik fiilî öncül doğruluğunu garanti etmez.',
  'Örnek: Ada bütün okul araçlarının numaralı olduğu ve mikroskobun okul aracı olduğu öncüllerinden numaralı sonucunu çıkarır. Berk yalnız herkesin böyle düşündüğünü söyler. İlkinde öncül-sonuç bağı vardır; ikincisinde sayı doğruluk kanıtı değildir. Öncüllerin fiilî doğruluğu ayrıca incelenir.',
], [['Atlas dışındaki çıkarım ve çoğunluk farkına yönelik özgün soru yazma', 'Yanıtta iki öncül-sonuç bağını ve çoğunluk gerekçesini ayırma', 'Çoğunluğu doğruluk kanıtı veya geçerliliği öncül doğruluğu garantisi saymama'], ['Atlas dışındaki iki gerekçe türünü içeren özgün durum yazma', 'Durumda iki öncül ile sonucu ve salt çoğunluk gerekçesini ayrı gösterme', 'Gerekçelerin farkını açıklayıp geçerlilikten fiilî doğruluk garantisi çıkarmama']]);
creation(premises, [
  'Deniz ve kütüphane örneğinden farklı, belirli bir zamanla sınırlı gerekli koşul içeren bir kural ve bu koşulu taşımayan kişi hakkında yeni bir soru yazınız. Yanıtınızda kural ve kişi bilgisini iki öncül olarak ayırıp yalnız belirtilen dönemi kapsayan sonucu veriniz.',
  'Deniz ve kütüphane örneğinden farklı, belirli bir zamanla sınırlı gerekli koşul içeren bir kural ve bu koşulu taşımayan kişinin yer aldığı kısa bir durum yazınız. Durumu iki öncül ve bir sonuç olarak gösterip zaman ve gerekli koşul sınırını açıklayınız.',
], [
  'Örnek soru: Bu ay atölyeye yalnız kayıtlı kişiler girebilir; Ece kayıtlı değilse ne çıkar? P1: Bu ay girebilen herkes kayıtlıdır. P2: Ece kayıtlı değildir. C: Ece bu ay giremez. Hiçbir zaman sonucu ve kayıtlı olan herkesin mutlaka gireceği yargısı çıkmaz.',
  'Örnek durum: Bu hafta laboratuvara giriş için eğitim almış olmak gereklidir; Bora eğitim almamıştır. P1: Bu hafta girebilen herkes eğitim almıştır. P2: Bora eğitim almamıştır. C: Bora bu hafta giremez. Başka dönemlere genişletilmez; eğitimin tek başına yeterli olduğu varsayılmaz.',
], [['Deniz ve kütüphane dışındaki zaman sınırlı gerekli koşul hakkında özgün soru yazma', 'Yanıtta kural ve kişi bilgisini iki öncül, bunlardan çıkan yargıyı sonuç olarak ayırma', 'Yanıtın zamanını koruyup gerekli koşulu tek başına giriş garantisi saymama'], ['Deniz ve kütüphane dışında zaman sınırlı gerekli koşul içeren özgün durum yazma', 'Durumda iki öncül ve bunlardan çıkan sonucu ayrı gösterme', 'Zaman sınırını ve gerekli koşulun yeterli koşul olmadığını açıklama']]);
creation(restatement, [
  'Yağış ve cuma etkinliği örneğinden farklı, iki koşula göre yeri değişen tek bir etkinlik duyurusu yazınız. Duyuruyu anlamını değiştirmeden farklı cümlelerle yeniden ifade ediniz; hangi koşul, zaman ve kapsamı koruduğunuzu açıklayınız.',
  'Yağış ve cuma etkinliği örneğinden farklı, iki koşula göre yeri değişen tek bir etkinlik içeren kısa bir durum yazınız. Durumdaki duyuruyu nesnel biçimde yeniden yazınız; iki koşulu, zamanı ve tek etkinlik kapsamını nasıl koruduğunuzu açıklayınız.',
], [
  'Örnek duyuru: Salı günkü atölye, salon açıksa salonda; kapalıysa derslikte yapılacak. Yeniden ifade: Salı atölyesi için salonun açık olması durumunda salon, kapalı olması durumunda derslik kullanılacaktır. İki koşul, salı ve tek atölye korunur.',
  'Örnek durum: Kulüp, perşembe günkü sergiyi ana bina açıksa ana binada, kapalıysa ek binada yapacağını duyurur. Yeniden ifade: Perşembe sergisinin yeri ana bina açıksa ana bina, değilse ek binadır. İki koşul, perşembe ve tek sergi korunur; iptal veya tüm etkinlikler eklenmez.',
], [['Yağış ve cuma örneği dışında iki koşullu ve zamanlı özgün duyuru yazma', 'Duyuruyu farklı cümlelerle yazarken iki koşulun yerlerini koruma', 'Korunan zamanı ve tek etkinlik kapsamını açıklayıp yeni iddia eklememe'], ['Yağış ve cuma örneği dışında iki koşullu tek etkinlik durumu yazma', 'Durumdaki duyuruyu farklı cümlelerle yazarken iki koşulun yerlerini koruma', 'Korunan zamanı ve tek etkinlik kapsamını açıklayıp yorum eklememe']]);

export function reviewedEarlyTasks(focus: string): Readonly<Record<number, ReviewedTask>> {
  return bank[focus] ?? {};
}
