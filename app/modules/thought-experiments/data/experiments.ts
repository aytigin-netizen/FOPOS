import type { ThoughtExperiment } from "../domain/experiment-types";

export const thoughtExperiments: ThoughtExperiment[] = [
  {
      id: "russell-value-of-philosophy",
      wave: "wave2",
      visual: "circle-enlargement",
      contentVersion: "1.0.0",
      wave: "wave2",
      title: "Russell'ın Önyargı Çemberi",
      subtitle: "Gündelik kesinliklerin dışına çıkmak ve felsefenin değeri",
      kind: "thought_experiment",
      grade: 10,
      unitCode: "F10_U1",
      outcomeCodes: ["FEL.10.1.1"],
      theme: "Felsefenin doğası",
      estimatedMinutes: 15,
      summary: "Hiç felsefe sorusu sormadan yalnızca gündelik çıkarların dar çemberinde yaşamak ile belirsizliği göze alarak zihni genişletmek arasında nasıl bir fark vardır?",
      scenario: "Hayatı boyunca yalnızca yakın çevresinin pratik ihtiyaçlarıyla meşgul olmuş, alışkanlıklarının ve çağının yaygın kanaatlerinin dışına hiç çıkmamış bir kişiyi düşünün. Bertrand Russell'ın betimlediği bu kişi, kendi özel ilgilerinin dar çemberi içine kapanmıştır; bildik olanın dışındaki her şeyi tehdit edici veya yararsız sayar. Şimdi bu kişinin pencereyi açıp yalnızca kesin yanıtı bilinen pratik işleri değil, yanıtı henüz kesinleşmemiş büyük soruları —bilgiyi, evreni, değeri ve anlamı— merak etmeye başladığını hayal edin. Felsefe maddi bir kazanç veya kesin bir reçete sunmadığı halde insan yaşamına ne katar?",
      centralQuestion: "Kesin yanıtlar yerine büyük sorular üreten felsefe, bireyin düşünme biçimini ve dünyayla kurduğu ilişkiyi nasıl dönüştürür?",
      concepts: ["Merak ve hayret", "Felsefi soru", "Önyargı", "Şüphe", "Refleksiyon", "Zihinsel özgürlük"],
      discussionQuestions: [
        "Bilimin aksine felsefenin yüzyıllardır aynı sorular üzerinde tartışmaya devam etmesi bir başarısızlık mıdır, yoksa felsefenin doğası gereği bir zenginlik midir?",
        "Gündelik yaşamın yalnızca 'işe yarayan' bilgilere odaklanan dar çemberi içinde kalmak bireysel ve toplumsal kararlarımızı nasıl sınırlar?",
        "Felsefi düşünce; bilim, din ve sanat alanlarıyla hangi noktada ayrışır, hangi noktada onları besler?"
      ],
      counterArgumentPrompts: [
        "Kesin sonuca ulaşmayan sorularla uğraşmanın pratik yaşam sorunlarını çözmekte zaman kaybı olduğunu savunan faydacı bir itiraza karşı felsefenin işlevini savunun.",
        "Bilimsel bilgi ilerledikçe felsefeye artık yer kalmadığını ileri süren bir görüşe felsefi soruların niteliğini göstererek yanıt verin."
      ],
      transferQuestion: "Okulda ya da gündelik medyada herkesin tartışmasız doğru kabul ettiği bir kanaate karşı 'neden böyle düşünüyoruz?' sorusunu sormak neyi değiştirir?",
      facilitatorNotes: [
        "Öğrencilere felsefenin 'hiçbir işe yaramadığı' önyargısıyla başlayıp bunun maddi fayda ile zihinsel ufuk arasındaki farktan kaynaklandığını fark ettirin.",
        "Russell'ın yalnızca 'benlikten vazgeçiş' değil, önyargı ve dogmatizmden arınma anlamında 'zihnin genişlemesi' vurgusunu öne çıkarın.",
        "FEL.10.1.1 sürecindeki a–d basamakları gereği öğrencilerin felsefi soruyu bilimsel, sanatsal ve gündelik sorulardan ayırt eden örnekler üretmesini isteyin.",
        "Metin, Felsefe Problemleri eserinin XV. bölümündeki temel karşıtlığın sınıf tartışmasına uyarlanmış özetidir; birebir çeviri olarak sunulmamalıdır."
      ],
      ageAppropriateness: "10. sınıf ilk ünite için başlangıç etkinliği olarak uygundur. Öğrencilerin felsefe dersine yönelik beklenti ve önyargılarını açığa çıkarmak için kullanılabilir.",
      sourceNotes: [
        "Bertrand Russell'ın The Problems of Philosophy (1912) eserinin XV. Bölümü ('The Value of Philosophy') temel alınmıştır.",
        "Özel çıkarların dar çemberi ve zihnin genişlemesi kavramları sınıf düzeyine göre pedagojik senaryo biçiminde özetlenmiştir."
      ],
      sources: [
        { label: "Bertrand Russell, The Problems of Philosophy, Bölüm XV (Wikisource)", url: "https://en.wikisource.org/wiki/The_Problems_of_Philosophy/Chapter_15", note: "Birincil metin: 'The Value of Philosophy' tam İngilizce metni." },
        { label: "Stanford Encyclopedia of Philosophy — Bertrand Russell", url: "https://plato.stanford.edu/entries/russell/", note: "Russell felsefesine genel akademik başvuru." }
      ]
    },
  {
      id: "wittgenstein-beetle",
      wave: "pilot",
      visual: "beetle-box",
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
      id: "carroll-achilles-tortoise",
      wave: "wave2",
      visual: "achilles-tortoise",
      contentVersion: "1.0.0",
      wave: "wave2",
      title: "Kaplumbağanın Aşil'e Söyledikleri",
      subtitle: "Öncül, çıkarım kuralı ve geçerli argümantasyon",
      kind: "thought_experiment",
      grade: 10,
      unitCode: "F10_U2",
      outcomeCodes: ["FEL.10.2.2"],
      theme: "Mantık ve argümantasyon",
      estimatedMinutes: 15,
      summary: "Bir tartışmada tüm öncülleri kabul edip 'ama yine de sonuca mecbur değilim' diyen birine karşı argümanın geçerliliğini nasıl gösterirsiniz?",
      scenario: "Yarışın ardından dinlenen Aşil ve Kaplumbağa, Eukleides geometrisinden basit bir çıkarımı konuşurlar: (A) Aynı şeye eşit olan iki şey birbirine eşittir; (B) Bu üçgenin iki kenarı aynı doğruya eşittir; dolayısıyla (Z) Bu iki kenar birbirine eşittir. Kaplumbağa A ve B öncüllerini kabul ettiğini ama Z sonucunu henüz kabul etmediğini söyler. Aşil, 'Eğer A ve B doğruysa Z de doğrudur' kuralını yeni bir (C) öncülü olarak deftere yazar. Kaplumbağa (C)'yi de kabul eder ama bu kez 'A, B ve C doğruysa Z doğrudur' diyen (D) öncülünü ister. Defter sonsuza dek uzarken Z sonucuna hiç varılamaz; sorun nerededir?",
      centralQuestion: "Bir argümanda doğruluğunu kabul ettiğimiz önermeler (öncüller) ile bizi sonuca götüren akıl yürütme adımı (çıkarım kuralı) arasındaki fark nedir?",
      concepts: ["Mantık", "Argüman", "Öncül", "Sonuç", "Çıkarım kuralı", "Geçerlilik", "Tutarlılık"],
      discussionQuestions: [
        "Kaplumbağa deftere eklenen bütün şartlı önermeleri kabul ettiği hâlde neden hâlâ sonuca ulaşamıyor?",
        "Önermenin doğruluğunu kabul etmek ile o önermeden geçerli bir çıkarım yapmak arasında nasıl bir fark vardır?",
        "Günlük bir tartışmada karşımızdaki kişi yalnızca öncülleri sıralıyor ama aradaki mantıksal bağı kurmuyorsa argümanı nasıl değerlendiririz?"
      ],
      counterArgumentPrompts: [
        "Bir tartışmada örtük (söylenmemiş) çıkarım kurallarını açık öncül olarak yazmanın yine de argümandaki gizli varsayımları görünür kılmada faydalı olduğunu savunun.",
        "Geçerli bir çıkarımın her zaman doğru bir sonuç üretip üretmediğini, yanlış öncüllü ama geçerli bir argüman örneğiyle açıklayın."
      ],
      transferQuestion: "Haber metinlerinde veya günlük tartışmalarda karşılaştığınız bir iddiayı 'öncüller + çıkarım bağı + sonuç' biçiminde yeniden kurduğunuzda hangi gizli boşluklar ortaya çıkar?",
      facilitatorNotes: [
        "Önce sınıfı ikili gruplara ayırıp A, B ve Z cümlelerini tahtaya yazdırın; öğrencilerin C, D adımlarını ekleyerek çıkmazı bizzat görmesini sağlayın.",
        "FEL.10.2.2 süreci doğrultusunda öğrencilerin kısa bir paragrafı bağlamından koparmadan öncül ve sonuç bileşenlerine ayırmalarını ve kendi cümleleriyle yeniden ifade etmelerini isteyin.",
        "Tartışmada doğruluk (önermenin gerçekliğe uygunluğu) ile geçerlilik (öncüllerden sonucun zorunlu çıkması) kavramlarının farkını mutlaka netleştirin.",
        "Lewis Carroll (Charles Lutwidge Dodgson) diyaloğu Zeno'nun paradoksuna gönderme yapar; ancak buradaki problem hareket değil mantıksal çıkarım gerilemesidir."
      ],
      ageAppropriateness: "10. sınıf Felsefe, Mantık ve Argümantasyon ünitesinin FEL.10.2.2 çıktısı için uygundur. Sembolik mantık detaylarına girmeden doğal dildeki argüman yapısını kavratır.",
      sourceNotes: [
        "Lewis Carroll, 'What the Tortoise Said to Achilles', Mind, New Series, Cilt 4, Sayı 14 (Nisan 1895), s. 278–280 metni temel alınmıştır.",
        "Bu içerik özgün diyalogun sınıf düzeyinde öncül–çıkarım ayrımını öğretmeye yönelik pedagojik uyarlamasıdır."
      ],
      sources: [
        { label: "Lewis Carroll, What the Tortoise Said to Achilles (1895, Wikisource)", url: "https://en.wikisource.org/wiki/What_the_Tortoise_Said_to_Achilles", note: "Birincil metin: Mind dergisi 1895 özgün diyalogu." },
        { label: "Stanford Encyclopedia of Philosophy — Logical Consequence", url: "https://plato.stanford.edu/entries/logical-consequence/", note: "Mantıksal sonuç ve geçerlilik kavramları üzerine akademik başvuru." }
      ]
    },
  {
      id: "theseus-ship",
      wave: "pilot",
      visual: "theseus-ship",
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
      id: "plato-cave",
      wave: "pilot",
      visual: "plato-cave",
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
      id: "trolley-dilemma",
      wave: "pilot",
      visual: "trolley-dilemma",
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
      id: "danto-brillo-boxes",
      wave: "wave2",
      visual: "brillo-boxes",
      contentVersion: "1.0.0",
      wave: "wave2",
      title: "Danto'nun Brillo Kutuları",
      subtitle: "Ayırt edilemez iki nesne, sanat dünyası ve estetik anlam",
      kind: "thought_experiment",
      grade: 10,
      unitCode: "F10_U6",
      outcomeCodes: ["FEL.10.6.1"],
      theme: "Estetik ve sanat felsefesi",
      estimatedMinutes: 15,
      summary: "Bir sanat galerisindeki Brillo kutusu ile market deposundaki birebir aynı görünen temizlik kutusundan biri sanat eseri sayılıp diğeri neden sayılmaz?",
      scenario: "Önünüzde iki kutu duruyor: Biçimleri, boyutları, renkleri ve üzerindeki çizgiler gözle ayırt edilemeyecek kadar aynı. Kutulardan biri bir süpermarketin deposundaki sıradan bir deterjan kolisidir. Diğeri ise Andy Warhol tarafından 1964'te bir sanat galerisinde sergilenen Brillo Kutusu heykelidir. Arthur Danto'nun sorduğu gibi, gözümüzün gördüğü fiziksel özellikler aynıysa, birini sıradan bir eşya diğerini ise sanat yapıtı kılan şey nerededir?",
      centralQuestion: "Fiziksel görünüşleri tamamen aynı iki nesneden birini sanat yapıtı yapan şey nesnenin kendisinde midir, yoksa kuram, tarih ve yorum bağlamında mıdır?",
      concepts: ["Sanat eseri", "Estetik yargı", "Taklit (Mimesis)", "Sanat dünyası", "Güzellik", "Yorum"],
      discussionQuestions: [
        "Bir nesneyi sanat eseri yapan yalnızca güzel görünmesi veya zanaat ustalığı olsaydı, market kutusu ile galeri kutusu arasında nasıl bir fark bulabilirdik?",
        "Sanatçının niyeti, sanat tarihi bilgisi ve sergi mekânı (sanat dünyası) olmadan tek başına nesneye bakarak onun sanat olup olmadığına karar verebilir miyiz?",
        "Eğer her şey uygun bir bağlamda sanat sayılabiliyorsa, sanat ile sıradan gündelik nesne arasındaki sınır tamamen kaybolur mu?"
      ],
      counterArgumentPrompts: [
        "Sanatın yalnızca kurumsal onay veya kuramla tanımlanamayacağını, eserlerde yine de algılanabilir bir biçim ve ustalık aranması gerektiğini savunan bir itiraz geliştirin.",
        "Sokaktaki sıradan bir objeyi müzeye koymanın izleyiciyi kandırmak olup olmadığını tartışan bir karşı argüman kurun."
      ],
      transferQuestion: "Gündelik bir fotoğrafın, bir duvar yazısının veya yapay zekâ görselinin 'sanat' sayılıp sayılmamasına karar verirken hangi ölçütleri kullanıyorsunuz?",
      facilitatorNotes: [
        "Önce klasik sanat kuramlarını (taklit/mimesis, yaratma, oyun) kısaca hatırlatın; ardından Danto'nun sorusunun tam da bu kuramları neden zorladığını gösterin.",
        "Warhol'un 1964 Stable Gallery sergisi ile Danto'nun aynı yıl yayımlanan 'The Artworld' makalesi arasındaki tarihsel bağlantıyı koruyun.",
        "FEL.10.6.1 doğrultusunda öğrencilerin estetik yargıların öznelliği ve ortak estetik yargı imkânı üzerine gerekçe üretmelerini teşvik edin.",
        "Bu senaryo sanat tanımını tek bir kuram lehine kapatmaz; klasik estetik ile çağdaş sanat felsefesi arasındaki gerilimi tartışmaya açar."
      ],
      ageAppropriateness: "10. sınıf Estetik ve Sanat Felsefesi ünitesi (FEL.10.6.1) için uygundur. Öğrencilerin çağdaş sanat, grafiti ve dijital üretim örnekleriyle bağ kurmasını kolaylaştırır.",
      sourceNotes: [
        "Arthur C. Danto, 'The Artworld', The Journal of Philosophy, Cilt 61, Sayı 19 (1964), s. 571–584 ve The Transfiguration of the Commonplace (1981) eserine dayanır.",
        "Metin, Danto'nun 'ayırt edilemez eşler' (indiscernible counterparts) yönteminin lise düzeyine uyarlanmış pedagojik özetidir."
      ],
      sources: [
        { label: "Stanford Encyclopedia of Philosophy — The Definition of Art", url: "https://plato.stanford.edu/entries/art-definition/", note: "Danto'nun Brillo Kutusu örneği ve sanat dünyası kuramı incelemesi." },
        { label: "Stanford Encyclopedia of Philosophy — Aesthetic Judgment", url: "https://plato.stanford.edu/entries/aesthetic-judgment/", note: "Estetik yargının doğası ve öznellik/ortaklık tartışması." }
      ]
    },
  {
      id: "rawls-veil-of-ignorance",
      wave: "wave2",
      visual: "veil-of-ignorance",
      contentVersion: "1.0.0",
      wave: "wave2",
      title: "Rawls'un Bilgisizlik Peçesi",
      subtitle: "Tarafsızlık, başlangıç durumu ve adil toplum ilkeleri",
      kind: "thought_experiment",
      grade: 10,
      unitCode: "F10_U7",
      outcomeCodes: ["FEL.10.7.1"],
      theme: "Siyaset felsefesi",
      estimatedMinutes: 20,
      summary: "Toplumun temel kurallarını belirlerken kendi sınıfınızı, yeteneklerinizi veya konumunuzu bilmeseydiniz nasıl bir adalet ilkesi seçerdiniz?",
      scenario: "Yeni bir toplumun temel hak, özgürlük ve ekonomik paylaşım kurallarını belirlemek üzere bir araya geldiğinizi düşünün. Ancak karar anında bir “bilgisizlik peçesi”nin arkasındasınız: Peçe kalktığında toplumda hangi sosyal sınıfa, ekonomik duruma, doğal yeteneğe, yaşa, cinsiyete veya iyi yaşam anlayışına sahip olacağınızı bilmiyorsunuz. Yalnızca toplumların ve ekonominin genel işleyişine dair temel bilgilere sahipsiniz. Bu belirsizlik içinde, herkes için bağlayıcı olacak temel kuralları nasıl belirlersiniz?",
      centralQuestion: "Kişiler kendi toplumsal konumlarını, doğal yeteneklerini ve çıkarlarını bilmedikleri bir “başlangıç durumu”nda hangi adalet ilkelerini tarafsız biçimde seçerler?",
      concepts: ["Adalet", "Tarafsızlık", "Başlangıç durumu", "Bilgisizlik peçesi", "Eşit özgürlük", "Fark ilkesi"],
      discussionQuestions: [
        "Kendi toplumsal konumunuzu ve yeteneklerinizi bilseydiniz kuralları farklı belirler miydiniz? Tarafsızlık neden bilgi kısıtlamasıyla sağlanmaya çalışılır?",
        "Peçe arkasında herkesin en kötü duruma düşme olasılığını gözetmesi (maximin yaklaşımı) her zaman en makul strateji midir?",
        "Eşit temel özgürlüklerin korunması ile ekonomik eşitsizliklerin en dezavantajlıların yararına düzenlenmesi arasında nasıl bir ilişki vardır?"
      ],
      counterArgumentPrompts: [
        "Kişisel risk almaya açık bir bireyin, en alt konumu güvenceye alan ilkeler yerine daha yüksek ortalama refah sunan bir düzeni savunabileceğini gösteren bir itiraz geliştirin.",
        "Gerçek toplumsal yaşamda insanların kendi kimlik, tarih ve değerlerinden tamamen soyutlanarak karar verip veremeyeceğini sorgulayan bir argüman kurun."
      ],
      transferQuestion: "Bir okulda ya da kentte ortak yaşam kuralları hazırlanırken “bilgisizlik peçesi” yaklaşımı hangi somut adaletsizlikleri görünür kılabilir?",
      facilitatorNotes: [
        "Önce öğrencilere peçenin neyi gizlediğini (sınıf, servet, doğal yetenek, iyi anlayışı) ve neyi açık bıraktığını (toplum ve ekonomi hakkında genel bilgiler) ayırt ettirin.",
        "Locke veya Rousseau'daki doğal durum tasarımları ile Rawls'un varsayımsal “başlangıç durumu” arasındaki yöntemsel farkı vurgulayın.",
        "Fark ilkesini mutlak gelir eşitliği olarak sunmayın; Rawls'a göre eşitsizliklerin yalnızca en az avantajlı kesimin yararına olması koşuluyla kabul edilebileceğini belirtin.",
        "FEL.10.7.1 süreci doğrultusunda öğrencilerin siyaset felsefesinin adalet, eşitlik ve meşruiyet kavramlarıyla metin ve argüman çözümlemesi yapmalarını sağlayın."
      ],
      ageAppropriateness: "10. sınıf Siyaset Felsefesi ünitesi (FEL.10.7.1) için uygundur. Soyut sözleşme fikri okul kuralları veya ortak kaynak paylaşımı gibi somut örneklerle desteklenmelidir.",
      sourceNotes: [
        "Bilgisizlik peçesi (veil of ignorance) ve başlangıç durumu (original position), John Rawls'un A Theory of Justice (1971; gözden geçirilmiş baskı 1999) eserinin III. Bölümünde, özellikle §24 'The Veil of Ignorance' ve §3–§20 bağlamında geliştirilir.",
        "Bu içerik, §24'teki bilgilendirme sınırlarının sınıf düzeyine uyarlanmış pedagojik özetidir; birincil metnin tam çevirisi değildir."
      ],
      sources: [
        { label: "John Rawls, A Theory of Justice, III. Bölüm §24 — SEP Original Position", url: "https://plato.stanford.edu/entries/original-position/", note: "Birincil eser bölüm/kavram referansı (TJ §3, §20, §24) ve akademik doğrulama." },
        { label: "Stanford Encyclopedia of Philosophy — John Rawls", url: "https://plato.stanford.edu/entries/rawls/", note: "Hakkaniyet olarak adalet, eşit özgürlük ve fark ilkesi akademik incelemesi." }
      ]
    },
  {
      id: "plato-euthyphro",
      wave: "wave2",
      visual: "euthyphro-dilemma",
      contentVersion: "1.0.0",
      wave: "wave2",
      title: "Euthyphron İkilemi",
      subtitle: "İlahi irade, değerin ölçütü ve din-ahlak ilişkisi",
      kind: "dilemma",
      grade: 10,
      unitCode: "F10_U8",
      outcomeCodes: ["FEL.10.8.1"],
      theme: "Din felsefesi",
      estimatedMinutes: 15,
      summary: "Bir eylem ilahi irade tarafından emredildiği için mi iyidir, yoksa zaten iyi olduğu için mi emredilir?",
      scenario: "Atina mahkemesinin kapısında karşılaşan Sokrates ve Euthyphron, 'dindarlık / erdemli olan' üzerine tartışır. Euthyphron, bütün tanrıların sevdiği şeyin iyi ve dindar olduğunu söyler. Bunun üzerine Sokrates tartışmayı keskin bir yol ayrımına getirir: 'Bir şey tanrılar tarafından sevildiği için mi iyidir, yoksa zaten iyi olduğu için mi tanrılar onu sever?' İki seçenekten hangisini seçerseniz seçin, değerin ve ahlakın kaynağı hakkında farklı sonuçlar doğar.",
      centralQuestion: "İyi ve doğru kavramlarının kaynağı ilahi iradeye mi bağlıdır, yoksa akıl ve değerin kendi bağımsız ölçütleri de var mıdır?",
      concepts: ["Din felsefesi", "İlahi irade", "Ahlaki iyilik", "Özerklik", "Akıl ve vahiy", "Değer ölçütü"],
      discussionQuestions: [
        "Eğer bir şey 'yalnızca istendiği veya emredildiği için iyi' oluyorsa, iyiliğin akılla anlaşılabilir bir nedeni kalır mı?",
        "Tersine, eğer bir şey 'zaten iyi olduğu için emrediliyorsa', iyilik ölçütü ilahi iradeden bağımsız olarak da kavranabilir mi?",
        "Din felsefesinde bu ikilemi aşmak için 'iyiliğin dışsal bir kural değil, Tanrı'nın kendi doğasıyla özdeş olduğu' yanıtı ikna edici midir?"
      ],
      counterArgumentPrompts: [
        "İyiliğin Tanrı'nın dışındaki bir standart olmadığı, O'nun yetkin doğasının kendisi olduğunu savunarak Sokrates'in ikilemine üçüncü bir çıkış yolu önerin.",
        "Ahlakın dinden tamamen bağımsız akli temellere dayanabileceğini savunan seküler etik yaklaşımını bu ikilem üzerinden gerekçelendirin."
      ],
      transferQuestion: "Kural koyucu bir otoritenin (yasa, gelenek veya yönetici) söylediği bir şeyin doğru olup olmadığını hangi ölçütlerle sorgularız?",
      facilitatorNotes: [
        "Platon'un Euthyphron diyaloğunun (10a–11b) çoktanrılı Atina bağlamında yazıldığını belirtin; tek tanrılı din felsefesine aktarımın sonradan yapılan bir felsefi uyarlama olduğunu açıkça söyleyin.",
        "İkilemi öğrencilerin inançlarını sınayan bir soru gibi değil, 'değerin temeli nedir?' sorusunu açan mantıksal bir ayrım olarak sunun.",
        "Tartışmada 'Tanrı'nın doğası / hikmeti' şeklindeki klasik üçüncü yanıt seçeneğinin de felsefe tarihinde geliştirildiğini mutlaka not edin.",
        "FEL.10.8.1 doğrultusunda din felsefesinin teoloji ve dogmadan farkını akıl-gerekçe yöntemi üzerinden görünür kılın."
      ],
      ageAppropriateness: "10. sınıf Din Felsefesi ünitesi (FEL.10.8.1) için uygundur. Saygılı, kavramsal ve argüman odaklı sınıf tartışması gerektirir.",
      sourceNotes: [
        "Platon, Euthyphron, 10a–11b bölümü esas alınmıştır (Jowett ve akademik Stephanus numaralandırması).",
        "Antik diyalogdaki 'tanrılar ve dindarlık' tartışmasının modern din felsefesindeki 'Tanrı ve ahlaki iyilik' biçimine çevrilmesi öğretmen tarafından kurulan kavramsal köprüdür."
      ],
      sources: [
        { label: "Platon, Euthyphron (İng. tam metin, Wikisource)", url: "https://en.wikisource.org/wiki/Euthyphro_(Jowett)", note: "Birincil metin: 10a–11b bölümü Sokrates–Euthyphron diyaloğu." },
        { label: "Stanford Encyclopedia of Philosophy — Plato's Shorter Ethical Works", url: "https://plato.stanford.edu/entries/plato-ethics-shorter/#2", note: "Euthyphron 10a ikileminin mantıksal çözümlemesi." },
        { label: "Stanford Encyclopedia of Philosophy — Religion and Morality", url: "https://plato.stanford.edu/entries/religion-morality/", note: "Din felsefesinde ilahi buyruk kuramı ve Euthyphron tartışması." }
      ]
    },
  {
      id: "popper-black-swan",
      wave: "wave2",
      visual: "black-swan",
      contentVersion: "1.0.0",
      wave: "wave2",
      title: "Popper'ın Siyah Kuğusu",
      subtitle: "Tümevarım sorunu, bilimsel ölçüt ve yanlışlanabilirlik",
      kind: "thought_experiment",
      grade: 10,
      unitCode: "F10_U9",
      outcomeCodes: ["FEL.10.9.1"],
      theme: "Bilim felsefesi",
      estimatedMinutes: 15,
      summary: "Binlerce beyaz kuğu gözlemlemek 'bütün kuğular beyazdır' yasasını kesinler mi, yoksa tek bir siyah kuğu tüm kuramı yıkmaya yeter mi?",
      scenario: "Avrupa'daki doğa gözlemcilerinin yüzyıllar boyunca gördüğü her kuğu beyazdı. Bu binlerce gözleme dayanarak şu genel kural kuruldu: 'Bütün kuğular beyazdır.' Peki bir milyon beyaz kuğu daha görmek bu önermeyi mantıksal olarak kesin biçimde kanıtlar mı? Avustralya'da tek bir siyah kuğunun görülmesiyle bu genel önerme bir anda geçersiz hale geldi. Karl Popper bu örneği, bilimin doğrulama biriktirerek mi yoksa yanlışlanabilir iddialar sınayarak mı ilerlediğini göstermek için kullanır.",
      centralQuestion: "Bir önermeyi bilimsel yapan şey onu destekleyen gözlemlerin çokluğu mudur, yoksa ilkece yanlışlanabilir olması mıdır?",
      concepts: ["Tümevarım", "Yanlışlanabilirlik", "Bilimsel yasa", "Doğrulama", "Sınırlandırma ölçütü", "Hipotez"],
      discussionQuestions: [
        "Tek bir aykırı gözlem genel bir kuralı çürütebiliyorsa, milyonlarca destekleyici gözlem neden aynı kesinliği sağlayamaz?",
        "Her durumu açıklayabilen ve hiçbir gözlemle çürütülemeyen bir iddia güçlü bir bilim midir, yoksa test edilemediği için bilim dışı mı kalır?",
        "Bir siyah kuğu görüldüğünde bilim insanları kuralı hemen terk etmeli mi, yoksa önce gözlemi ve yardımcı varsayımları mı kontrol etmelidir?"
      ],
      counterArgumentPrompts: [
        "Bilim tarihinde tek bir aykırı gözlem çıktığında bilim insanlarının kuramı hemen atmadığını, bazen kuramı korumak için ek açıklamalar geliştirdiğini savunan bir itiraz kurun.",
        "Yanlışlanabilirlik ölçütünün tarih, sosyoloji veya evrimsel açıklamalar gibi doğrudan deney tekrarının zor olduğu alanlarda nasıl uygulanacağını sorgulayın."
      ],
      transferQuestion: "Günlük hayatta veya haberlerde karşılaştığınız iddialardan hangileri yanlışlanabilir bilimsel bir öngörü, hangileri her koşulda haklı çıkan kapalı bir yorumdur?",
      facilitatorNotes: [
        "Popper'ın yanlışlanabilirlik yaklaşımını Thomas Kuhn'un paradigma yaklaşımıyla tek bir görüşmüş gibi karıştırmayın; Kuhn'un 'olağan bilim' eleştirisini gerekirse ayrı bir karşıt perspektif olarak anın.",
        "Tümevarım (tek tek gözlemlerden genele gitme) ile yanlışlama arasındaki mantıksal bakışımsızlığı netleştirin.",
        "FEL.10.9.1 kapsamında bilimin yöntemsel özelliklerini ve bilimi diğer bilgi türlerinden ayıran ölçütleri tartışmaya açın.",
        "Örnek, Popper'ın mantıksal tümevarım eleştirisinin pedagojik özetidir; tarihsel olarak siyah kuğu örneğinin Hume ve Mill geleneğinden devralındığını not edebilirsiniz."
      ],
      ageAppropriateness: "10. sınıf Bilim Felsefesi ünitesi (FEL.10.9.1) için uygundur. Öğrencilerin fen bilimleri derslerindeki deney/hipotez kavramlarıyla doğrudan bağ kurar.",
      sourceNotes: [
        "Karl Popper, Logik der Forschung (1934) / The Logic of Scientific Discovery (1959) ve Conjectures and Refutations (1963) eserlerindeki yanlışlanabilirlik ölçütüne dayanır.",
        "Bu içerik Popper'ın sınırlandırma (demarcation) ve tümevarım eleştirisinin lise düzeyine uyarlanmış özetidir."
      ],
      sources: [
        { label: "Stanford Encyclopedia of Philosophy — Karl Popper", url: "https://plato.stanford.edu/entries/popper/#ProbIndu", note: "Tümevarım sorunu, yanlışlanabilirlik ve kuğu örneği çözümlemesi." },
        { label: "Stanford Encyclopedia of Philosophy — Science and Pseudo-Science", url: "https://plato.stanford.edu/entries/pseudo-science/", note: "Popper'ın sınırlandırma ölçütü ve eleştirileri." }
      ]
    },
  {
      id: "routley-last-person",
      wave: "pilot",
      visual: "last-human",
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
      id: "searle-chinese-room",
      wave: "pilot",
      visual: "chinese-room",
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
      id: "pascal-wager",
      wave: "pilot",
      visual: "pascals-wager",
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
      id: "unamuno-niebla",
      wave: "wave2",
      visual: "niebla-mist",
      contentVersion: "1.0.0",
      wave: "wave2",
      title: "Unamuno'nun Sis'i: Yazar ile Karakter",
      subtitle: "Kurgu ile gerçeklik sınırı, özgür irade ve edebiyatla felsefe",
      kind: "thought_experiment",
      grade: 11,
      unitCode: "F11_U4",
      outcomeCodes: ["FEL.11.4.1", "FEL.11.4.2"],
      theme: "Edebiyat ve felsefe",
      estimatedMinutes: 20,
      summary: "Bir roman kahramanı kendisini yazan yazarın karşısına çıkıp 'Sen de bir başkasının düşlediği bir karakter değil misin?' diye sorarsa kurgu ile gerçeklik arasındaki sınır nerede kalır?",
      scenario: "Miguel de Unamuno'nun 1914 tarihli Sis (Niebla) romanının kahramanı Augusto Pérez, yaşamının çıkmaza girdiğini görünce intihar etmeyi düşünür; ancak önce Salamanca'ya gidip kendi yazarını, yani Miguel de Unamuno'yu ziyaret etmeye karar verir. Unamuno, Augusto'ya gerçek bir insan olmadığını, yalnızca kendi hayal gücünde yaşayan bir kurgu karakteri olduğunu ve isterse onu hemen öldürebileceğini söyler. Bunun üzerine Augusto başını kaldırıp şu soruyu yöneltir: 'Peki ya siz de, yazarım, bir başkasının —belki Tanrı'nın ya da zamanın— rüyasında yaşayan bir karakter misiniz? Benim kurgu olmam sizin varlığınızı ne kadar güvenceye alır?'",
      centralQuestion: "Edebî bir metin, yalnızca hayal ürünü bir hikâye anlatmak yerine varoluş, özgür irade ve gerçeklik hakkında nasıl felsefi düşünme alanı açar?",
      concepts: ["Edebiyat ve felsefe", "Kurmaca ve gerçeklik", "Özgür irade", "Varoluş", "Üstkurmaca", "Yorumlama"],
      discussionQuestions: [
        "Augusto karakterinin kendi yazarına başkaldırması, edebiyatın felsefi bir düşünme aracına dönüştüğünü nasıl gösterir?",
        "Bir karakterin özgür iradesinden söz edilemeyeceği halde neden okur onu kendi seçimleri olan canlı bir kişi gibi algılar?",
        "Felsefe kavramlarla doğrudan argüman kurarken, roman gibi edebî türler aynı felsefi sorunları neden farklı ve daha somut bir biçimde hissettirebilir?"
      ],
      counterArgumentPrompts: [
        "Edebî eserlerin felsefi kanıtlama yerine duygusal etki yarattığını, bu yüzden felsefenin yerini tutamayacağını savunan bir görüşe karşı edebiyatın felsefi katkısını açıklayın.",
        "Unamuno'nun yazar olarak Augusto'yu yine de öldürebilmesinin kurgu karakterin mutlak bağımlılığını kanıtladığını ileri süren bir teze yanıt verin."
      ],
      transferQuestion: "Okuduğunuz bir roman veya izlediğiniz bir filmde bir karakterin verdiği karar üzerinden felsefi bir soruyu (özgürlük, adalet veya anlam gibi) nasıl tartışmaya açardınız?",
      facilitatorNotes: [
        "Unamuno'nun bu esere klasik romandan ayırmak için 'nivola' adını verdiğini ve felsefi sorgulamayı doğrudan anlatı biçimine yerleştirdiğini belirtin.",
        "Metni 'Augusto ile Unamuno sohbeti'nin gerçekte olmuş bir olay gibi değil, üstkurmaca (metafiction) yoluyla kurulan felsefi bir araç olarak ele alın.",
        "FEL.11.4.1 ve FEL.11.4.2 doğrultusunda öğrencilerin edebî unsurlara felsefi bakış geliştirmesini ve kısa bir felsefi metin/diyalog denemesi kurmasını isteyin.",
        "Senaryo, Niebla'nın 31. bölümündeki karşılaşmanın lise sınıfı için yapılmış pedagojik özetidir; tam çeviri değildir."
      ],
      ageAppropriateness: "11. sınıf Edebiyat ve Felsefe ünitesi (FEL.11.4.1 – FEL.11.4.2) için uygundur. Öğrencilerin sevdiği roman/oyun karakterleriyle kolayca ilişki kurmasını sağlar.",
      sourceNotes: [
        "Miguel de Unamuno, Niebla (1914), Bölüm XXXI (Augusto Pérez ile Unamuno arasındaki diyalog) temel alınmıştır.",
        "Bu içerik 31. bölümün felsefi odağının sınıf tartışması için hazırlanmış uyarlamasıdır; İspanyolca özgün metinle karşılaştırılabilir."
      ],
      sources: [
        { label: "Miguel de Unamuno, Niebla (Wikisource İspanyolca Tam Metin)", url: "https://es.wikisource.org/wiki/Niebla", note: "Birincil metin: Niebla (1914) özgün metni, Bölüm XXXI." },
        { label: "Miguel de Unamuno, Niebla (Internet Archive 1914 Baskısı)", url: "https://archive.org/details/nieblanivola00unam", note: "Tarihsel ilk baskı dijital kaydı." },
        { label: "Stanford Encyclopedia of Philosophy — Fiction", url: "https://plato.stanford.edu/entries/fiction/", note: "Kurmaca nesneler ve gerçeklik ontolojisi üzerine akademik başvuru." }
      ]
    },
  {
      id: "camus-sisyphus",
      wave: "wave2",
      visual: "sisyphus-boulder",
      contentVersion: "1.0.0",
      wave: "wave2",
      title: "Camus'nün Sisifos'u",
      subtitle: "Absürd kavramı, bilinçli farkındalık ve yaşamın anlamı",
      kind: "allegory",
      grade: 11,
      unitCode: "F11_U5",
      outcomeCodes: ["FEL.11.5.1", "FEL.11.5.2"],
      theme: "Hayatın anlamı",
      estimatedMinutes: 20,
      summary: "Zirveye ittiği kaya her seferinde aşağı yuvarlanan Sisifos, yeniden kayasına doğru yürürken çaresiz bir kurban mıdır, yoksa kendi kaderinin farkında özgür bir insan mı?",
      scenario: "Yunan mitolojisinde Sisifos, dev bir kayayı dik bir dağın tepesine kadar itmeye mahkûm edilmiştir; ancak kaya tam zirveye ulaştığında kendi ağırlığıyla tekrar aşağı yuvarlanır ve çaba sonsuza dek başa döner. Albert Camus 1942'de bu eski miti yeniden okuyarak dikkati tam bir ana çeker: Kaya aşağı yuvarlandıktan sonra Sisifos'un yokuş aşağı yürüyüp yeniden kayaya yöneldiği o duraksama anı. Evrenin hazır ve garantili bir anlam sunmadığı yerde insan bu tekrar karşısında umutsuzluğa mı kapılır, yoksa bilinciyle kendi duruşunu mu kurar?",
      centralQuestion: "İnsanın anlam arayışı ile dünyanın sessizliği arasındaki 'absürd' gerilim karşısında birey yaşamına nasıl anlam ve değer kazandırabilir?",
      concepts: ["Hayatın anlamı", "Absürd", "Bilinç", "Özgürlük", "Varoluş", "Sorumluluk"],
      discussionQuestions: [
        "Camus neden kayayı iterken değil de 'yokuş aşağı inerken' Sisifos'un bilincine ve özgürlüğüne odaklanır?",
        "İnsan anlam arayışından vazgeçmeden, ancak evrenden hazır bir anlam beklemeyi bırakarak nasıl bir yaşam tutumu geliştirebilir?",
        "Sürekli tekrarlanan günlük işler ve sorumluluklar karşısında anlamı yalnızca 'sonuca ulaşmakta' aramak bizi neden kırılgan kılar?"
      ],
      counterArgumentPrompts: [
        "Amacına hiç ulaşmayan bir çabanın mutlu sayılamayacağını, insanın yaşama tutunması için aşamalı ve kalıcı amaçlara ihtiyaç duyduğunu savunan bir itiraz geliştirin.",
        "Hayatın anlamının yalnızca bireysel bilinç ve başkaldırıyla değil, başkalarına duyulan sorumluluk, değerler ve ortak hedeflerle kurulduğunu savunan bir karşı görüş yazın."
      ],
      transferQuestion: "Kendi yaşamınızda sonucu hemen garantilenmeyen ama sürdürmeye değer bulduğunuz bir uğraşı 'anlamlı' kılan nedir?",
      facilitatorNotes: [
        "Camus'nün Sisifos Söyleni açılışındaki felsefi soruyu yalnızca soyut felsefi anlamda ('yaşam yaşanmaya değer mi?') ele alın; sınıf içinde hassas ve zarar verici bireysel yönlendirmelerden kesinlikle kaçının.",
        "'Absürd' kavramını basitçe 'saçmalık' olarak değil, 'insanın anlam arzusu ile dünyanın suskunluğu arasındaki gerilim' olarak tanımlayın.",
        "FEL.11.5.1 ve FEL.11.5.2 doğrultusunda farklı anlam yaklaşımlarını (hedonizm, faydacılık, varoluşçuluk, amaç odaklı yaklaşımlar) karşılaştırmalı olarak tartıştırın.",
        "Mitolojik anlatı Homeros (Odysseia XI) kökenlidir; ancak 'Sisifos'u mutlu hayal etmeliyiz' yorumu Camus'nün 1942 tarihli felsefi yorumudur."
      ],
      ageAppropriateness: "11. sınıf Hayatın Anlamı ünitesi (FEL.11.5.1 – FEL.11.5.2) için uygundur. Öğretmen, varoluşsal sorgulamayı yapıcı felsefi tartışma sınırlarında tutmalıdır.",
      sourceNotes: [
        "Albert Camus, Le Mythe de Sisyphe (1942), özellikle 'Le Mythe de Sisyphe' başlıklı sonuç bölümü esas alınmıştır.",
        "Metin Camus'nün denemesinin tam çevirisi değil, felsefi tezin lise sınıfı için yapılandırılmış pedagojik özetidir."
      ],
      sources: [
        { label: "Stanford Encyclopedia of Philosophy — Albert Camus", url: "https://plato.stanford.edu/entries/camus/", note: "Sisifos Söyleni, absürd kavramı ve felsefi çözümleme." },
        { label: "Stanford Encyclopedia of Philosophy — The Meaning of Life", url: "https://plato.stanford.edu/entries/life-meaning/", note: "Hayatın anlamı kuramları içinde absürdizm ve alternatif görüşler." }
      ]
    },
  {
      id: "antigone-law",
      wave: "pilot",
      visual: "antigone",
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
