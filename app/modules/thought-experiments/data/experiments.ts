import type { ThoughtExperiment } from "../domain/experiment-types";

export const thoughtExperiments: ThoughtExperiment[] = [
  {
    id: "wittgenstein-beetle",\n    visual: "beetle-box",
    contentVersion: "1.0.0",
    title: "Wittgenstein'ın Kutu İçindeki Böceği",
    subtitle: "Özel yaşantı, dil ve ortak anlam",
    kind: "thought_experiment",
    grade: 10,
    unitCode: "F10_U2",
    outcomeCodes: ["FEL.10.2.1"],
    theme: "Dil felsefesi",
    estimatedMinutes: 15,
    summary: "Herkesin kutusunda yalnız kendisinin görebildiği bir şey bulunduğunu varsayalım. Bu durumda ortak bir sözcüğün anlamı neye dayanır?",
    scenario: "Bir sınıftaki herkesin kapalı, küçük bir kutusu var. Her öğrenci kendi kutusunun içinde “böcek” olduğunu söylüyor; fakat hiç kimse başkasının kutusuna bakamıyor. Kutuların içindekiler birbirinden farklı olabilir; bir kutu boş bile olabilir. Buna rağmen herkes “böcek” sözcüğünü konuşurken kullanmayı sürdürüyor. Peki sözcüğün ortak anlamı, herkesin özel olarak gördüğü nesneye mi bağlıdır?",
    centralQuestion: "Herkesin kutusunda farklı bir şey, hatta hiçbir şey bulunabiliyorsa “böcek” sözcüğünün ortak anlamı neye dayanır?",
    concepts: ["Özel yaşantı", "Dil", "Anlam", "Kullanım", "Ortak ölçüt"],
    discussionQuestions: [
      "Kutuların içeriğini hiç kimse karşılaştıramıyorsa öğrenciler aynı sözcüğü nasıl öğrenip kullanabilir?",
      "Bir sözcüğün anlamını yalnızca kişinin iç dünyasındaki bir nesne belirleyebilir mi?",
      "“Acı”, “kırmızı” veya “adalet” sözcüklerinde de benzer bir sorun ortaya çıkar mı?"
    ],
    counterArgumentPrompts: [
      "Anlamın özel yaşantıya dayandığını savunan birinin en güçlü gerekçesi ne olabilir?",
      "Ortak kullanımın anlamı açıklamakta yetersiz kaldığı bir örnek kurabilir misiniz?"
    ],
    transferQuestion: "Bir kişinin “acı çekiyorum” demesini anlamamız için onun yaşantısını aynen yaşamamız gerekir mi?",
    facilitatorNotes: [
      "Önce öğrencilerin kutuların içinde ne olabileceğine ilişkin varsayımlarını alın; Wittgenstein'ın sonucunu başlangıçta açıklamayın.",
      "Özel nesne ile sözcüğün kamusal kullanımını birbirinden ayırın.",
      "Wittgenstein'ın tartışmasını “kişisel deneyimler önemsizdir” biçiminde sunmayın; odak, özel nesnenin sözcüğün anlamını tek başına belirleyip belirleyemeyeceğidir."
    ],
    ageAppropriateness: "10. sınıf için uygundur. Soyut özel dil tartışmasına geçmeden önce duygu ve renk sözcükleri gibi tanıdık örneklerle somutlaştırılmalıdır.",
    sourceNotes: [
      "“Kutu içindeki böcek” örneği Philosophical Investigations §293'te yer alır.",
      "Bu etkinlik, metnin sınıf düzeyine uyarlanmış açıklamasıdır; doğrudan çeviri değildir."
    ],
    sources: [
      { label: "Ludwig Wittgenstein, Philosophical Investigations, §293", url: "https://web.stanford.edu/~paulsko/Wittgenstein293.html", note: "Birincil metin; örneğin bölüm numarası doğrulanmıştır." }
    ]
  },
  {
    id: "theseus-ship",\n    visual: "theseus-ship",
    contentVersion: "1.0.0",
    title: "Theseus'un Gemisi",
    subtitle: "Değişim ve özdeşlik problemi",
    kind: "thought_experiment",
    grade: 10,
    unitCode: "F10_U3",
    outcomeCodes: ["FEL.10.3.1"],
    theme: "Varlık felsefesi",
    estimatedMinutes: 15,
    summary: "Bir geminin bütün parçaları zamanla yenilenirse, başlangıçtaki gemiyle aynı varlık olarak kalır mı?",
    scenario: "Bir müzede sergilenen eski bir geminin çürüyen tahtaları yıllar içinde birer birer yenileniyor. Gemi aynı adla, aynı işlevle ve aynı tarihsel öyküyle kullanılmaya devam ediyor. Bir süre sonra ilk tahtalardan hiçbiri kalmıyor. Daha sonra çıkarılan eski tahtalar bir araya getirilerek ikinci bir gemi yapılıyor. Şimdi iki gemiden hangisi başlangıçtaki gemidir?",
    centralQuestion: "Bir varlığın bütün parçaları değiştiğinde onun aynı varlık olarak kaldığını söylememizi sağlayan ölçüt nedir?",
    concepts: ["Özdeşlik", "Süreklilik", "Değişim", "Parça-bütün", "Varlık"],
    discussionQuestions: [
      "Gemiye kimliğini veren şey maddi parçaları mı, biçimi mi, işlevi mi, yoksa tarihsel sürekliliği midir?",
      "Eski tahtalardan yapılan ikinci gemi neden asıl gemi olabilir veya olamaz?",
      "İnsan bedeni ve kişisel kimlik açısından benzer bir problem kurulabilir mi?"
    ],
    counterArgumentPrompts: [
      "Parçaları değişen geminin aynı gemi olduğunu savunan bir ölçüt geliştirin.",
      "Eski parçalarla yapılan geminin asıl gemi olduğunu savunan görüşe nasıl itiraz edersiniz?"
    ],
    transferQuestion: "Bir insanın bedeni ve düşünceleri yıllar içinde değiştiğinde aynı kişi olarak kalmasını ne açıklar?",
    facilitatorNotes: [
      "Öğrencilerden önce “aynı gemi” kararını vermelerini, ardından kullandıkları ölçütü adlandırmalarını isteyin.",
      "İkinci gemi varyantını ilk tartışmadan sonra verin; böylece ilk sezgiler sınanır.",
      "Plutarkhos'un tarihsel anlatısı ile modern paradoksun bütün ayrıntılarını birbirinden ayırın."
    ],
    ageAppropriateness: "10. sınıf için yüksek uygunluk gösterir. Somut nesne ve parça değişimi üzerinden varlık felsefesinin özdeşlik problemine geçiş sağlar.",
    sourceNotes: [
      "Plutarkhos, Theseus'un gemisinin eski tahtalarının yenileriyle değiştirilmesi üzerine tartışmayı aktarır.",
      "Eski tahtaların yeniden birleştirilmesi biçimindeki modern varyant, Plutarkhos'un metninin doğrudan ifadesi değildir."
    ],
    sources: [
      { label: "Plutarkhos, Life of Theseus, 23.1", url: "https://penelope.uchicago.edu/Thayer/e/roman/texts/plutarch/lives/theseus*.html", note: "Birincil antik kaynak; geminin parçalarının yenilenmesi anlatısı." }
    ]
  },
  {
    id: "plato-cave",\n    visual: "plato-cave",
    contentVersion: "1.0.0",
    title: "Platon'un Mağara Alegorisi",
    subtitle: "Görünüş, gerçeklik ve bilginin sınırları",
    kind: "allegory",
    grade: 10,
    unitCode: "F10_U4",
    outcomeCodes: ["FEL.10.4.1"],
    theme: "Bilgi felsefesi",
    estimatedMinutes: 20,
    summary: "Bütün yaşamı boyunca gölgeleri gerçek sanan biri, dışarı çıktığında hakikati nasıl tanıyabilir?",
    scenario: "Doğduğundan beri bir mağarada zincirlenmiş insanların yalnızca önlerindeki duvarda beliren gölgeleri görebildiğini düşünün. Arkalarında yanan ateşin önünden çeşitli nesneler geçirilir ve mahkûmlar bu gölgeleri gerçek nesneler sanır. İçlerinden biri zincirlerinden kurtulup dışarı çıkar. Önce ışığa alışmakta zorlanır; zamanla nesneleri ve sonunda güneşi görür. Mağaraya döndüğünde anlattıklarına diğerleri inanmayabilir.",
    centralQuestion: "Bir insan, bütün yaşamı boyunca gördüğü gölgeleri gerçek sanmışsa, dışarı çıktığında hakikati hangi gerekçeyle tanıyabilir?",
    concepts: ["Görünüş", "Gerçeklik", "Sanı", "Bilgi", "Eğitim", "Hakikat"],
    discussionQuestions: [
      "Mahkûmlar gölgeleri neden gerçek kabul eder?",
      "Dışarı çıkan kişinin yaşadığı zorluk, bilgi edinme süreci hakkında ne gösterir?",
      "Bir toplumun çoğunlukla kabul ettiği bir düşünce yanlış olabilir mi?"
    ],
    counterArgumentPrompts: [
      "Mağaradan çıkan kişinin gördüklerinin daha gerçek olduğunu nasıl temellendirebilirsiniz?",
      "Dışarı çıktığını söyleyen kişinin yanılıyor olabileceğini savunan bir mahkûmun gerekçesi ne olabilir?"
    ],
    transferQuestion: "Sosyal medyada sürekli karşılaştığımız görüntüler ve bilgiler, mağara duvarındaki gölgeler gibi yanıltıcı olabilir mi? Hangi ölçütlerle sınarız?",
    facilitatorNotes: [
      "Alegoriyi önce anlatı olarak ele alın; karakterleri tek tek felsefi kavramlarla eşleştirmeyi öğrencilerin yapmasını sağlayın.",
      "Dijital içerik ve algoritma örneklerini çağdaş benzetme olarak etiketleyin; bunları Platon'un doğrudan iddiası gibi göstermeyin.",
      "Bu kayıt bir alegoridir; modülün içerik türü alanında düşünce deneyi olarak sınıflandırılmamalıdır."
    ],
    ageAppropriateness: "10. sınıf için uygundur. Anlatı yapısı soyut bilgi problemlerine giriş sağlar; çağdaş örnekler öğretmen rehberliğiyle kullanılmalıdır.",
    sourceNotes: [
      "Mağara anlatısı Devlet'in VII. kitabında 514a–517a aralığındadır.",
      "Bu içerik, Platon'un alegorisinin ders amaçlı özetidir; metnin tam çevirisi değildir."
    ],
    sources: [
      { label: "Platon, Republic, VII, 514a–517a", url: "https://adfonteslibrary.org/work-plato-republic", note: "Birincil metin; mağara anlatısının Stephanus numaraları." }
    ]
  },
  {
    id: "trolley-dilemma",\n    visual: "trolley-dilemma",
    contentVersion: "1.0.0",
    title: "Tramvay İkilemi",
    subtitle: "Sonuç, niyet ve eylem sorumluluğu",
    kind: "dilemma",
    grade: 10,
    unitCode: "F10_U5",
    outcomeCodes: ["FEL.10.5.1"],
    theme: "Ahlak felsefesi",
    estimatedMinutes: 20,
    summary: "Beş kişinin kurtulması için tramvayın yönünü değiştirmek ve bir kişinin ölümüne neden olmak ahlaken savunulabilir mi?",
    scenario: "Kontrolden çıkmış bir tramvay ray üzerinde ilerliyor ve önünde çalışmakta olan beş kişi bulunuyor. Tramvayı durduramıyorsunuz. Yanınızda bir makas kolu var; kolu çekerseniz tramvay başka bir raya yönelir. Ancak bu hatta da bir kişi çalışıyor. Hiçbir şey yapmazsanız beş kişi, kolu çekerseniz bir kişi ölecek. Karar vermek zorundasınız.",
    centralQuestion: "Beş kişinin kurtulması için tramvayın yönünü değiştirerek bir kişinin ölümüne neden olmak ahlaken savunulabilir mi?",
    concepts: ["Eylem", "Eylemsizlik", "Niyet", "Sonuç", "Sorumluluk", "Araçsallaştırma"],
    discussionQuestions: [
      "Kararınızda kurtarılan ve zarar gören kişi sayısı belirleyici midir?",
      "Bir zararı önlemek ile bir kişiye doğrudan zarar vermek arasında ahlaki fark var mıdır?",
      "Makas kolunu çekmek ile bir kişiyi fiziksel olarak itmek neden farklı değerlendirilebilir?"
    ],
    counterArgumentPrompts: [
      "Sonuçların toplamına öncelik veren yaklaşımın en güçlü gerekçesini kurun.",
      "Bir kişiyi araç olarak kullanmanın yanlış olduğunu savunan yaklaşımın gerekçesini açıklayın."
    ],
    transferQuestion: "Sağlık kaynaklarının sınırlı olduğu bir durumda öncelik belirlemek için hangi ahlaki ilkeler kullanılmalıdır?",
    facilitatorNotes: [
      "Öğrenciler ilk kararlarını bireysel olarak versin ve gerekçelerini yazsın.",
      "Makas kolu ve köprüden itme varyantlarını ayrı ayrı tartıştırın; senaryoların ahlaki yapısındaki farkı görünür kılın.",
      "Görsel veya anlatımda şiddet ayrıntısı kullanmayın; tartışmanın odağı ahlaki gerekçeler olsun.",
      "Tarihsel kaynakçada Philippa Foot'un 1967 çalışması ile Judith Jarvis Thomson'ın 1976 çalışmasını ayrı gösterin."
    ],
    ageAppropriateness: "10. sınıf için uygundur. Duyarlı içerik nedeniyle grafik anlatım kullanılmamalı; öğrencilerden kişisel travmatik deneyim paylaşmaları istenmemelidir.",
    sourceNotes: [
      "Philippa Foot'un 1967 tarihli çalışması tramvay sürücüsü örneğini tartışmaya sokar.",
      "Judith Jarvis Thomson'ın 1976 tarihli çalışması trolley problem adlandırması ve klasik varyantların gelişiminde belirleyicidir.",
      "Popüler makas kolu senaryosunun bütün ayrıntıları Foot'a tek başına atfedilmemelidir."
    ],
    sources: [
      { label: "Philippa Foot, The Problem of Abortion and the Doctrine of the Double Effect (1967)", url: "https://philpapers.org/archive/FOOTPO-2.pdf", note: "Birincil akademik çalışma; tramvay sürücüsü örneği." },
      { label: "Judith Jarvis Thomson, Killing, Letting Die, and the Trolley Problem (1976)", url: "https://wmit-pages-prod.s3.amazonaws.com/wp-content/uploads/sites/283/2022/06/12154735/thomson2.pdf", note: "Birincil akademik çalışma; trolley problem tartışmasının gelişimi." }
    ]
  },
  {
    id: "routley-last-person",\n    visual: "last-human",
    contentVersion: "1.0.0",
    title: "Routley'in Son İnsan Deneyi",
    subtitle: "İnsan yararı dışında doğanın değeri",
    kind: "thought_experiment",
    grade: 11,
    unitCode: "F11_U1",
    outcomeCodes: ["FEL.11.1.1", "FEL.11.1.2"],
    theme: "Çevre felsefesi",
    estimatedMinutes: 20,
    summary: "Dünyada yaşayan son insan olduğunuzda doğayı ve diğer canlıları yok etmek yine de yanlış mıdır?",
    scenario: "Dünyada yaşayan son insan olduğunuzu ve sizden sonra başka hiçbir insanın yaşamayacağını varsayın. İnsanlara zarar verme ihtimali kalmamıştır. Buna rağmen elinizdeki araçla kalan ormanları, hayvanları ve bitki yaşamını ortadan kaldırabilirsiniz. Böyle bir eylem yalnızca insanlara zarar vermediği için ahlaken kayıtsız mı sayılmalıdır?",
    centralQuestion: "İnsan kalmasa ve insan çıkarı bulunmasa bile doğayı yok etmek ahlaken yanlış olabilir mi?",
    concepts: ["İnsan-merkezcilik", "Doğa-merkezcilik", "Araçsal değer", "İçsel değer", "Çevre etiği"],
    discussionQuestions: [
      "Geride zarar görecek hiçbir insan kalmadığına göre doğayı yok etmek neden yanlış olabilir?",
      "Doğadaki varlıkların değeri yalnızca insanlara sağladıkları faydaya mı bağlıdır?",
      "Bir ekosistemin insanlardan bağımsız olarak korunmaya değer olduğunu savunabilir miyiz?"
    ],
    counterArgumentPrompts: [
      "Doğanın değerinin insan yararından bağımsız olmadığını savunan bir argüman kurun.",
      "İnsan dışı canlıların ve ekosistemlerin kendinde değeri olduğunu savunan bir argüman kurun."
    ],
    transferQuestion: "Bugün alınan bir çevre kararında henüz doğmamış kuşakların veya insan dışı canlıların çıkarları nasıl temsil edilebilir?",
    facilitatorNotes: [
      "Öğrencilerin ilk tepkilerini insanlara zarar ölçütü üzerinden alın; ardından insan bulunmayan senaryoyu tartışmaya açın.",
      "Araçsal değer ve içsel değer ayrımını örneklerle açıklayın.",
      "Routley'in senaryosunun yalnızca ağaç kesmekten ibaret olmadığını; hayvan ve bitki yaşamının da kapsamda olduğunu belirtin."
    ],
    ageAppropriateness: "11. sınıf için güçlü ve doğrudan uygundur. Çevre etiği kavramlarını kullanarak gerekçeli felsefi metin yazmaya elverişlidir.",
    sourceNotes: [
      "Richard Routley'in 1973 tarihli makalesinin §1 bölümünde “The last man example” yer alır.",
      "Bu kayıt, özgün örneğin kapsamını koruyan sınıf düzeyinde bir uyarlamadır."
    ],
    sources: [
      { label: "Richard Routley, Is There a Need for a New, an Environmental Ethic? (1973), §1", url: "https://iseethics.wordpress.com/wp-content/uploads/2013/02/routley-richard-is-there-a-need-for-a-new-an-environmental-ethic-original.pdf", note: "Birincil kaynak; Son İnsan örneği." }
    ]
  },
  {
    id: "searle-chinese-room",\n    visual: "chinese-room",
    contentVersion: "1.0.0",
    title: "Searle'ün Çin Odası",
    subtitle: "Sembol işlemek ve anlamak aynı şey midir?",
    kind: "thought_experiment",
    grade: 11,
    unitCode: "F11_U2",
    outcomeCodes: ["FEL.11.2.1", "FEL.11.2.2"],
    theme: "Teknoloji felsefesi",
    estimatedMinutes: 20,
    summary: "Bir sistem, dili anlamadan kurallara göre doğru yanıtlar üretebiliyorsa gerçekten anlıyor mudur?",
    scenario: "Çince bilmeyen bir kişi kapalı bir odada oturuyor. Odaya Çince semboller içeren kâğıtlar geliyor. Kişinin elinde, bu sembolleri hangi kurala göre eşleştirip dışarıya hangi sembolleri göndereceğini söyleyen ayrıntılı bir kural kitabı var. Dışarıdaki kişiler yanıtları akıcı buluyor ve odadaki kişinin Çince bildiğini düşünüyor. Oysa odadaki kişi sembollerin anlamını bilmiyor; yalnızca kuralları uyguluyor.",
    centralQuestion: "Bir sistem, sembolleri kurallara göre işleyerek doğru yanıtlar üretiyorsa bu durum gerçek anlamayı gösterir mi?",
    concepts: ["Sözdizim", "Anlambilim", "Anlama", "Bilinç", "Yapay zekâ", "Niyetlilik"],
    discussionQuestions: [
      "Doğru yanıt üretmek ile yanıtın anlamını kavramak arasında nasıl bir fark olabilir?",
      "Odada bulunan kişi anlamıyorsa bütün sistemin anlamadığı sonucu zorunlu mudur?",
      "Bir bilgisayarın dil performansı, onun düşündüğünü söylemek için yeterli midir?"
    ],
    counterArgumentPrompts: [
      "Searle'ün argümanına karşı “sistem yanıtı” itirazını açıklayın.",
      "Sembol işleme ile anlama arasında zorunlu bir bağ bulunduğunu savunan bir görüş geliştirin."
    ],
    transferQuestion: "Günümüzde bir yapay zekâ sisteminin akıcı yanıt vermesi, onun ne söylediğini anladığını göstermeye yeter mi? Hangi ek ölçütler aranabilir?",
    facilitatorNotes: [
      "Önce sembolleri ve kural kitabını içeren basit bir eşleştirme örneği gösterin.",
      "Kişi, oda ve bütün sistem düzeylerindeki itirazları birbirinden ayırın.",
      "Güncel yapay zekâ örneklerini Searle'ün 1980 argümanının kanıtı değil, tartışmayı güncelleyen örnekler olarak sunun.",
      "Cahit Arf'a atfedilen sözleri veya Çin Odası'nın kökenini doğrulanmamış biçimde Arf'a bağlamayın."
    ],
    ageAppropriateness: "11. sınıf için uygundur; soyutluğu nedeniyle sembol-kural örneği ve öğretmen rehberliği gerektirir.",
    sourceNotes: [
      "Çin Odası argümanı Searle'ün 1980 tarihli “Minds, Brains, and Programs” makalesinde kurulmuştur.",
      "Makale, argümana yöneltilen itirazları ve Searle'ün yanıtlarını da içerir."
    ],
    sources: [
      { label: "John R. Searle, Minds, Brains, and Programs (1980)", url: "https://zoo.cs.yale.edu/classes/cs471/13s/13s-papers/searle-chinese-room-bbs.pdf", note: "Birincil akademik makale." }
    ]
  },
  {
    id: "pascal-wager",\n    visual: "pascals-wager",
    contentVersion: "1.0.0",
    title: "Pascal'ın Bahsi",
    subtitle: "İnanç, olasılık ve pratik gerekçe",
    kind: "thought_experiment",
    grade: 11,
    unitCode: "F11_U3",
    outcomeCodes: ["FEL.11.3.1", "FEL.11.3.2"],
    theme: "Akıl ve inanç",
    estimatedMinutes: 20,
    summary: "Bir inancı seçmenin olası sonuçları üzerinden yapılan karar hesabı, o inancın doğru olduğunu kanıtlar mı?",
    scenario: "Bir konuda kesin kanıta ulaşamadığınızı ve yine de bir tutum almak zorunda olduğunuzu düşünün. Pascal, Tanrı'nın varlığına inanmak veya inanmamak seçeneklerinin olası sonuçlarını bir karar hesabı içinde ele alır. İnanç lehine seçim yapmanın pratik sonuçlarını tartışır. Ancak bir seçeneğin pratik açıdan daha avantajlı görülmesi, onun doğru olduğunun kanıtlandığı anlamına gelir mi?",
    centralQuestion: "Bir inancı seçmenin olası sonuçları üzerinden yapılan karar hesabı, o inancın doğru olduğunu kanıtlar mı?",
    concepts: ["Akıl", "İnanç", "Olasılık", "Pratik gerekçe", "Kanıt", "Karar"],
    discussionQuestions: [
      "Bir inancı seçmek için pratik gerekçeye sahip olmak, o inancın doğruluğunu bilmekle aynı şey midir?",
      "Pascal'ın hesabı farklı dinî seçenekler ve olasılık itirazları karşısında nasıl sınanabilir?",
      "Samimi inanç, yalnızca kazanç ve kayıp hesabıyla açıklanabilir mi?"
    ],
    counterArgumentPrompts: [
      "Pratik sonuçların bir inanç kararında dikkate alınabileceğini savunan bir gerekçe kurun.",
      "Bir inancın yararlı olmasının onun doğru olduğunu göstermediğini savunan bir itiraz geliştirin."
    ],
    transferQuestion: "Bir kararın olası sonuçları çok önemli olsa bile, kararın doğruluğu için ayrıca hangi kanıt veya gerekçelere ihtiyaç duyarız?",
    facilitatorNotes: [
      "Karar tablosunu basit ve sınırlı tutun; olasılık hesabının varsayımlarını görünür kılın.",
      "Farklı dinî seçenekler, samimiyet ve olasılık itirazlarını öğrencilerin kurmasına alan açın.",
      "Pascal'ın bahsini Tanrı'nın varlığını kanıtlayan bir argüman gibi sunmayın; pratik/ihtiyat gerekçesi ile kanıta dayalı gerekçeyi ayırın.",
      "Pensées §233 numaralandırmasının baskılara göre değişebileceğini not edin."
    ],
    ageAppropriateness: "11. sınıf için uygundur; olasılık ve karar kavramları önceden kısa biçimde açıklanmalıdır. Farklı inançlara saygılı ve tarafsız tartışma dili kullanılmalıdır.",
    sourceNotes: [
      "Pascal'ın yaklaşımı burada kanıta dayalı ispat değil, pratik/ihtiyat gerekçesi olarak ele alınır.",
      "Stanford Encyclopedia of Philosophy, Pensées §233 içinde birden fazla bahis argümanı bulunduğunu belirtir; numaralandırma edisyona göre değişebilir."
    ],
    sources: [
      { label: "Blaise Pascal, Pensées, §233 — akademik açıklama", url: "https://plato.stanford.edu/entries/pascal-wager/", note: "Akademik ikincil kaynak; argümanın kapsamı ve pratik gerekçe ayrımı." }
    ]
  },
  {
    id: "antigone-law",\n    visual: "antigone",
    contentVersion: "1.0.0",
    title: "Antigone: Yasa, Vicdan ve Adalet",
    subtitle: "Yürürlükteki buyruk ve ahlaki yükümlülük",
    kind: "dilemma",
    grade: 11,
    unitCode: "F11_U6",
    outcomeCodes: ["FEL.11.6.1", "FEL.11.6.2"],
    theme: "Hukuk felsefesi",
    estimatedMinutes: 20,
    summary: "Bir yöneticinin yasağı ile kişinin daha yüksek gördüğü ahlaki yükümlülük çatıştığında nasıl karar verilmelidir?",
    scenario: "Thebai Kralı Kreon, kente karşı savaşmış olan Polyneikes'in gömülmesini yasaklar. Antigone ise kardeşini gömmenin tanrısal ve yazılı olmayan bir yükümlülük olduğunu düşünür. Kreon'un buyruğu yürürlüktedir; Antigone bu buyruğa uyarsa vicdani yükümlülüğünü yerine getirmeyecek, çiğnerse cezalandırılma riskini üstlenecektir. İki taraf da kendi kararını düzen, görev ve adalet kavramlarıyla savunur.",
    centralQuestion: "Bir yönetici tarafından konulan yasa ile kişinin daha yüksek gördüğü ahlaki yükümlülük çatıştığında hangi gerekçeyle hareket edilmelidir?",
    concepts: ["Yasa", "Meşruiyet", "Vicdan", "Yazılı olmayan norm", "Hak", "Yükümlülük", "Adalet"],
    discussionQuestions: [
      "Kreon'un kamusal düzen gerekçesi hangi koşullarda güçlü kabul edilebilir?",
      "Antigone'nin defin yükümlülüğü hangi hak, görev veya norm sorununu gündeme getirir?",
      "Bir yasa yürürlükte olduğu hâlde hangi gerekçelerle meşruiyetini kaybedebilir?",
      "Vicdan her durumda yürürlükteki yasadan üstün müdür?"
    ],
    counterArgumentPrompts: [
      "Hukuk güvenliği ve ortak düzen adına Kreon'un yasağını savunan bir argüman kurun.",
      "Yürürlükteki her buyruğun adil olmayabileceğini savunan bir argüman kurun; hangi ölçüte dayandığınızı açıklayın."
    ],
    transferQuestion: "Temel hakları ihlal ettiği düşünülen bir yasa karşısında sivil itaatsizlik hangi koşullarda savunulabilir?",
    facilitatorNotes: [
      "Önce tragedyadaki tarihsel ve edebî bağlamı açıklayın; Antigone'yi doğrudan modern doğal hukuk kuramcısı gibi göstermeyin.",
      "Antigone'nin defin yükümlülüğü ile Kreon'un kamusal düzen gerekçesini kendi bağlamlarında ele alın.",
      "FEL.11.6.2 bağlantısını görünür kılmak için öğrencilerden hak ve özgürlüklerin hukuksal temellerini çözümlemelerini, ardından gerekçeli kısa bir görüş metni yazmalarını isteyin.",
      "Modern doğal hukuk, pozitif hukuk ve sivil itaatsizlik kavramlarına geçişi öğretmen tarafından kurulan karşılaştırma olarak etiketleyin."
    ],
    ageAppropriateness: "11. sınıf için uygundur. Tragedyanın bağlamı ve modern hukuk kavramları arasındaki tarihsel mesafe açık tutulmalıdır.",
    sourceNotes: [
      "Antigone'nin yazılı olmayan normlara ilişkin sözleri Sophokles'in tragedyasında 450–460. dizelerde yer alır.",
      "Tragedyadaki çatışma modern doğal hukuk öğretisinin tam ve doğrudan ifadesi olarak sunulmamalıdır."
    ],
    sources: [
      { label: "Sophokles, Antigone, 450–460", url: "https://chs.harvard.edu/primary-source/sophocles-antigone/", note: "Birincil metin; Antigone'nin Kreon'un buyruğunu sorguladığı bölüm." }
    ]
  }
];
