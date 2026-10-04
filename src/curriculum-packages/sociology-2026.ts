import type { CurriculumPackage } from "../core/curriculum/package-types.ts";

const sourceUrl =
  "https://mufredat.meb.gov.tr/Dosyalar/2026625151446241-Sosyoloji%20d%C3%B6p.pdf";

export const sociology2026Package: CurriculumPackage = {
  manifest: {
    schemaVersion: "1.0.0",
    datasetVersion: "2026.1",
    lifecycle: "ACTIVE",
    discipline: { code: "sociology", name: "Sosyoloji" },
    defaultGrade: 11,
    source: {
      title: "Ortaöğretim Sosyoloji Dersi Öğretim Programı",
      year: 2026,
      url: sourceUrl,
      document: "2026625151446241-Sosyoloji döp.pdf",
      pageCount: 48,
      verificationNote:
        "Resmî program ünite, öğrenme çıktısı ve süre tabloları (s. 10) ile haftalık iki ders saati uygulama kuralı (s. 6) paketle karşılaştırıldı. Doğrulama kanıt zinciri (gecis-1-2) insan onayıyla tamamlandı ve paket VERIFIED durumuna geçirildi.",
    },
    verification: {
      status: "VERIFIED",
      sourceId: "meb:sociology:2026",
      sourceVersion: "2026.1",
      verifiedAt: "2026-10-01T17:30:00Z",
      verificationMethod: "official-source-parity-and-contract-tests",
      evidence: [
        {
          type: "OFFICIAL_SOURCE",
          reference: sourceUrl,
          note: "Resmî program kaynağı kayıtlıdır; doğrulama kanıt zinciri gecis-1-2 ile tamamlandı.",
        },
        {
          type: "VERIFICATION_RECORD",
          reference: "tests/sociology-curriculum-2026-source-parity.test.mjs",
          note: "Resmî kaynak parite testi ve sözleşme testleri Aytekin YILMAZ (öğretmen, HUMAN, APPROVED) tarafından 1 Ekim 2026 tarihinde onaylandı.",
        },
      ],
    },
    applicability: {
      rules: [
        {
          grade: 11,
          officialCourseName: "Sosyoloji Dersi 1",
          schoolTypes: ["general_secondary", "social_sciences_high_school"],
          note: "Sosyoloji Dersi 1 ortaöğretim kurumlarında uygulanabilir.",
        },
        {
          grade: 12,
          officialCourseName: "Sosyoloji Dersi 2",
          schoolTypes: ["social_sciences_high_school"],
          note: "Sosyoloji Dersi 2 yalnızca sosyal bilimler liselerinde uygulanır.",
        },
      ],
    },
    programRules: {
      weeklyHours: 2,
      annualTotalHoursPerGrade: 72,
      instructionHoursPerGrade: 68,
      schoolBasedPlanningHoursPerGrade: 4,
      schoolBasedPlanningFocus:
        "Zümre öğretmenler kurulu tarafından ders kapsamında yapılması kararlaştırılan okul dışı öğrenme etkinlikleri, araştırma ve gözlem, sosyal etkinlikler, proje çalışmaları, yerel çalışmalar, okuma çalışmaları vb. çalışmalar için ayrılan süredir.",
      coreFieldSkills: ["Eleştirel Sosyolojik Düşünme", "Tarihsel Empati"],
    },
    grades: {
      "11": {
        unitCount: 5,
        learningOutcomeCount: 18,
        instructionHours: 68,
        schoolBasedPlanningHours: 4,
      },
      "12": {
        unitCount: 2,
        learningOutcomeCount: 3,
        instructionHours: 68,
        schoolBasedPlanningHours: 4,
      },
    },
  },
  units: [
    {
      code: "SOS.11.1",
      grade: 11,
      name: "Sosyolojinin Doğuşu",
      durationHours: 16,
      keywords: [
        "anomi",
        "ilerleme",
        "kentleşme",
        "modernite",
        "toplumsal düzen",
      ],
      competencyFramework: {
        fieldSkills: [
          "SBAB3. Tarihsel Empati (SBAB3.1. Tarihsel Bağılamsallaştırma)",
          "SBAB16. Eleştirel Sosyolojik Düşünme (KB2.8. Sorgulama)",
        ],
        conceptualSkills: ["KB2.7. Karşılaştırma"],
        tendencies: [
          "E1.3. Azim ve Kararlılık",
          "E1.5. Kendine Güvenme (Öz Güven)",
          "E2.2. Sorumluluk",
          "E3.1. Muhakeme",
          "E3.3. Yaratıcılık",
          "E3.5. Açık Fikirlilik",
          "E3.6. Analitiklik",
          "E3.8. Soru Sorma",
          "E3.9. Şüphe Duyma",
        ],
        socialEmotionalLearning: [
          "SDB1.3. Kendine Uyarlama (Öz Yansıtma)",
          "SDB2.1. İletişim",
          "SDB2.2. İş Birliği",
        ],
        values: ["D12. Sabır", "D14. Saygı"],
        literacy: ["OB1. Bilgi Okuryazarlığı", "OB5. Kültür Okuryazarlığı"],
        interdisciplinaryRelations: ["Coğrafya", "Ekonomi", "Felsefe", "Tarih"],
        interSkillRelations: [
          "KB2.6. Bilgi Toplama",
          "KB2.10. Çıkarım Yapma",
          "KB2.18. Tartışma",
        ],
      },
      contentFramework: [
        "Sosyolojinin Doğuşu",
        "Sosyolojik Düşünme Biçimi",
        "Sosyolojide Kullanılan Farklı Yöntemler",
      ],
      canonicalLearningEvidence:
        "Bu ünitedeki öğrenme çıktıları; öz değerlendirme formu, akran değerlendirme formu, açık uçlu sorular ve yapılandırılmış grid kullanılarak değerlendirilebilir. Performans görevi olarak çeşitli sosyolojik araştırma konularının pozitivist ve yorumcu görüşle nasıl ele alınabileceği üzerine iş birlikli sunum hazırlanabilir; görev özellik belirleme, benzerlik ve farklılıkları listeleme, sunum yapma ölçütlerini içeren dereceli puanlama anahtarı ile değerlendirilir.",
      learningTeachingExperiences: {
        basicAssumptions:
          "Bu ünitede öğrencilerin sosyolojiyi ortaya çıkaran tarihsel sürecin genel özellikleri, toplumsal yaşam ve toplum kavramı, bilimsel yöntem hakkında bilgi sahibi olduğu kabul edilir.",
        preAssessment:
          "Öğrencilere sosyolojiyi ortaya çıkaran tarihsel sürecin genel özellikleri, toplumsal yaşam ve toplum kavramı, bilimsel yöntem hakkında açık uçlu sorular sorulabilir.",
        bridging:
          "Geleneksel tarım toplumu, sanayi toplumu ve günümüz toplumunun özelliklerini yansıtan bilgi ve görseller verilerek öğrencilerin bu toplumları ekonomi, siyaset, kültür, eğitim, yerleşim birimleri açısından karşılaştırarak benzerlik ve farklılıklar hakkında fikir üretmesi sağlanabilir.",
      },
      differentiation: {
        enrichment:
          "İbn Haldun'un Mukaddime adlı eserinden toplumsal yaşamın zorunluluğu hakkındaki görüşleri araştırılıp raporlaştırılabilir; A. Comte'un Mustafa Reşit Paşa'ya yazdığı pozitivizm mektubu tarihsel bağlam içinde analiz edilebilir; P. Bourdieu'nun sosyolojiye kazandırdığı temel kavramlar araştırılıp sunulabilir; hermenötik yöntem uygulama örnekleriyle sunum olarak işlenebilir.",
        support:
          "Sosyolojinin konusu ve alanına ilişkin bilgilerin pekiştirilmesinde akran öğretimi veya grup çalışmaları kullanılabilir; tarihsel gelişim sürecinde görsel ve işitsel materyaller, araştırma yöntem ve tekniklerinde karşılaştırma tabloları ile akış diyagramları kullanılabilir.",
      },
      outcomes: [
        {
          code: "SOS.11.1.1",
          description:
            "Sosyolojinin doğuş sürecini tarihsel bağlamda anlamlandırabilme",
          processComponents: [
            {
              step: "a",
              description:
                "Sosyolojinin doğuşuna etki eden düşünürlerin görüşlerini analiz eder.",
            },
            {
              step: "b",
              description:
                "Sosyolojinin doğduğu dönemin sosyal, ekonomik ve siyasal koşullarını fark eder.",
            },
            {
              step: "c",
              description:
                "Sosyolojinin doğduğu tarihsel koşullar ile günümüz toplumlarının koşullarını karşılaştırır.",
            },
            {
              step: "ç",
              description:
                "Sosyolojinin kurucu isimlerinin sosyoloji anlayışlarını açıklar.",
            },
          ],
        },
        {
          code: "SOS.11.1.2",
          description: "Sosyolojik düşünme biçimini sorgulayabilme",
          processComponents: [
            {
              step: "a",
              description:
                "Sosyolojik düşünme biçimi ile ilgili merak ettiği konuyu tanımlar.",
            },
            {
              step: "b",
              description:
                "Sosyolojik düşünme biçimi ile ilgili merak ettiği konu hakkında sorular sorar.",
            },
            {
              step: "c",
              description:
                "Sosyolojik düşünme biçimi ile ilgili merak ettiği konu hakkında bilgi toplar.",
            },
            {
              step: "ç",
              description: "Toplanan bilgilerin doğruluğunu değerlendirir.",
            },
            {
              step: "d",
              description:
                "Doğrulanmış bilgilerden hareketle sosyolojik düşünme biçimine uygun çıkarımlar yapar.",
            },
          ],
        },
        {
          code: "SOS.11.1.3",
          description:
            "Sosyolojide kullanılan farklı yöntemleri karşılaştırabilme",
          processComponents: [
            {
              step: "a",
              description:
                "Nicel ve nitel araştırma yöntemleri ile bu yöntemlerin dayandığı görüşlerin temel özelliklerini belirler.",
            },
            {
              step: "b",
              description:
                "Nicel ve nitel araştırma yöntemlerinin benzerliklerini listeler.",
            },
            {
              step: "c",
              description:
                "Nicel ve nitel araştırma yöntemlerinin farklılıklarını listeler.",
            },
          ],
        },
      ],
    },
    {
      code: "SOS.11.2",
      grade: 11,
      name: "Türkiye’de Modernleşme ve Sosyoloji",
      durationHours: 14,
      keywords: [
        "adem-i merkeziyet",
        "edebiyat",
        "hars",
        "kültür",
        "medeniyet",
        "modernleşme",
      ],
      competencyFramework: {
        fieldSkills: [
          "SBAB4. Değişim ve Sürekliliği Algılama (SBAB4.2. Değişim ve Sürekliliği Neden ve Sonuçlarıyla Yorumlama)",
        ],
        conceptualSkills: [
          "KB2.8. Sorgulama",
          "KB2.13. Yapılandırma",
          "KB2.14. Yorumlama",
        ],
        tendencies: [
          "E1.1. Merak",
          "E1.3. Azim ve Kararlılık",
          "E1.5. Kendine Güvenme (Öz Güven)",
          "E2.1. Empati",
          "E3.4. Gerçeği Arama",
          "E3.6. Analitiklik",
          "E3.7. Sistematiklik",
        ],
        socialEmotionalLearning: ["SDB2.2. İş Birliği", "SDB2.3. Sosyal Farkındalık"],
        values: ["D7. Estetik", "D19. Vatanseverlik"],
        literacy: [
          "OB1. Bilgi Okuryazarlığı",
          "OB4. Görsel Okuryazarlık",
          "OB5. Kültür Okuryazarlığı",
        ],
        interdisciplinaryRelations: ["Türk Dili ve Edebiyatı", "Felsefe", "Tarih"],
        interSkillRelations: [
          "KB2.7. Karşılaştırma",
          "KB2.10. Çıkarım Yapma",
          "KB2.17. Değerlendirme",
          "KB2.18. Tartışma",
        ],
      },
      contentFramework: [
        "Osmanlı'dan Cumhuriyet'e Modernleşme Süreci",
        "Tarihsel Bağlamda Türkiye'de Sosyolojinin Doğuşu ve Gelişimi",
        "Türkiye'de Sosyoloji-Edebiyat İlişkisi",
      ],
      canonicalLearningEvidence:
        "Bu ünitedeki öğrenme çıktıları; açık uçlu sorular, balık kılıçığı diyagramı, kavram haritası, dereceli puanlama anahtarı ve kontrol listesi kullanılarak değerlendirilebilir. Performans görevi olarak Türkiye'de sosyolojinin nasıl doğduğu ve geliştiği hakkında olay-olgu-düşünce ilişkisi çerçevesinde tarihsel olaylar arasında bağlantı kuran bir kronolojik diyagram hazırlanıp sınıfta sunulabilir; görev nedensel ilişkileri ortaya koyma, uyumlu bir bütün oluşturma ve sunum yapma ölçütleriyle dereceli puanlama anahtarı ile değerlendirilir.",
      learningTeachingExperiences: {
        basicAssumptions:
          "Öğrencilerin Osmanlı'da başlayıp Cumhuriyet Dönemi'nde derinleşerek devam eden modernleşme konusunu ve modernleşmenin Türk edebiyatına yansımasını genel hatlarıyla bildiği kabul edilir.",
        preAssessment:
          "Öğrencilerden Türk modernleşmesi çerçevesinde gerçekleşen yenilikleri listelemesi ve Türk modernleşmesini konu edinen romanlara örnek vermesi istenebilir.",
        bridging:
          "Öğrencilere modernleşme konusunun işlendiği Türk edebiyatı eserlerinden alıntı veya yapılandırılmış metinler verilerek bu eserlerde sosyolojiye konu olmuş problemlerin işlendiğini ifade etmeleri istenebilir.",
      },
      differentiation: {
        enrichment:
          "Eski ve yeni seçkinler eğitim, dünya görüşü, sosyal çevre ölçütleriyle karşılaştırılıp tablo hâlinde sunulabilir; Said Halim Paşa ile E. Burke'ün muhafazakârlık anlayışı karşılaştırılabilir; Baykan Sezer'in Batıcılaşma anlayışı ve Attila İlhan'ın Batılılaşma-kültür emperyalizmi ilişkisi görüşleri araştırılıp sunulabilir; Orhan Türkdoğan'ın saha araştırmalarından bir örnek ve Mete Tunçay'ın tek parti yönetimi çalışmasındaki modernleşme değerlendirmesi raporlaştırılabilir.",
        support:
          "Modernleşmenin gelişim süreci için kronolojik cetvel, Türk sosyologlarının ilgilendiği konuları gösteren tablo, Ziya Gökalp ve Sabahattin Bey'in fikirlerini karşılaştıran tablo ve Türk edebiyatı eserleriyle toplumsal konuları eşleştiren tablo kullanılabilir.",
      },
      outcomes: [
        {
          code: "SOS.11.2.1",
          description:
            "Osmanlı’dan Cumhuriyet’e modernleşmenin neden ve sonuçlarını yorumlayabilme",
          processComponents: [
            {
              step: "a",
              description:
                "Osmanlı’da başlayıp Cumhuriyet Dönemi’nde derinleşerek devam eden modernleşmenin nedenlerini inceler.",
            },
            {
              step: "b",
              description:
                "Osmanlı’da başlayıp Cumhuriyet Dönemi’nde derinleşerek devam eden modernleşmenin sonuçlarını inceler.",
            },
            {
              step: "c",
              description:
                "Modernleşmenin sonuçlarını tarihsel bağlamda sorgular.",
            },
            {
              step: "ç",
              description:
                "Modernleşmenin nedenlerini ve sonuçlarını tarihsel bağlamda yeniden ifade eder.",
            },
          ],
        },
        {
          code: "SOS.11.2.2",
          description:
            "Türkiye’de sosyolojinin doğuşu ve gelişim sürecini tarihsel bir kurgu içinde yapılandırabilme",
          processComponents: [
            {
              step: "a",
              description:
                "Türkiye’de sosyolojinin gelişim sürecine ilişkin olay, olgu ve düşünsel yönelimleri inceleyerek nedensel ilişkiler ortaya koyar.",
            },
            {
              step: "b",
              description:
                "Ortaya koyduğu ilişkileri tarihsel bağlamda bütünleştirerek uyumlu bir bütün oluşturur.",
            },
          ],
        },
        {
          code: "SOS.11.2.3",
          description:
            "Türk modernleşmesinin Türk edebiyatına yansımasını yorumlayabilme",
          processComponents: [
            {
              step: "a",
              description: "Edebî eserlerde modernleşme konusunu inceler.",
            },
            {
              step: "b",
              description:
                "İncelediği konuyu sosyoloji ile ilişkisi içinde bağlamdan kopmadan yazılı/sözlü metne dönüştürür.",
            },
            {
              step: "c",
              description:
                "Eserlerdeki ilgili düşünceleri anlamı değiştirmeden kendi cümleleriyle ifade eder.",
            },
          ],
        },
      ],
    },
    {
      code: "SOS.11.3",
      grade: 11,
      name: "Kültür ve Toplumsal Yapı",
      durationHours: 12,
      keywords: [
        "Avrupamerkezcilik",
        "değer",
        "etnosentrizm",
        "norm",
        "prekarya",
        "rol",
        "statü",
      ],
      competencyFramework: {
        fieldSkills: [
          "SBAB16. Eleştirel Sosyolojik Düşünme (KB2.4. Çözümleme)",
        ],
        conceptualSkills: ["KB2.3. Özetleme", "KB2.13. Yapılandırma"],
        tendencies: [
          "E1.1. Merak",
          "E1.3. Azim ve Kararlılık",
          "E1.5. Kendine Güvenme (Öz Güven)",
          "E3.1. Muhakeme",
          "E3.4. Gerçeği Arama",
          "E3.10. Eleştirel Bakma",
        ],
        socialEmotionalLearning: [
          "SDB1.3. Kendine Uyarlama (Öz Yansıtma)",
          "SDB2.1. İletişim",
          "SDB2.3. Sosyal Farkındalık",
        ],
        values: ["D3. Çalışkanlık", "D11. Özgürlük", "D16. Sorumluluk"],
        literacy: [
          "OB1. Bilgi Okuryazarlığı",
          "OB4. Görsel Okuryazarlık",
          "OB5. Kültür Okuryazarlığı",
        ],
        interdisciplinaryRelations: [
          "Coğrafya",
          "Din Kültürü ve Ahlak Bilgisi",
          "Felsefe",
          "Hukuk",
          "Psikoloji",
          "Tarih",
        ],
        interSkillRelations: [
          "KB2.4. Çözümleme",
          "KB2.7. Karşılaştırma",
          "KB2.14. Yorumlama",
          "KB2.15. Yansıtma",
          "KB2.16. Muhakeme",
          "KB2.18. Tartışma",
          "KB3.3. Eleştirel Düşünme",
        ],
      },
      contentFramework: [
        "Kültür",
        "Toplumsal Yapı",
        "Toplumsal Tabakalaşma ve Toplumsal Hareketlilik",
      ],
      canonicalLearningEvidence:
        "Bu ünitedeki öğrenme çıktıları; yansıtma yazısı, balık kılıçığı diyagramı, kontrol listesi, anlam çözümleme tablosu, öz değerlendirme formu, akran değerlendirme formu ve açık uçlu sorular kullanılarak değerlendirilebilir. Performans görevi olarak çevrelerindeki büyüklerle görüşerek ve güvenilir kaynaklardan yararlanarak düğün, cenaze, yenidoğan ritüelleri, kılık kıyafet, yemek gibi konulardan birinde meydana gelen değişmeye ilişkin iş birlikli araştırma yapılıp sınıfta sunulabilir.",
      learningTeachingExperiences: {
        basicAssumptions:
          "Öğrencilerin kültür, toplum ve gelenek kavramları ile toplumsal yapı hakkında temel bilgilere sahip olduğu kabul edilir.",
        preAssessment:
          "Öğrencilere kültür, toplum, gelenek kavramları ve toplumsal yapı hakkında açık uçlu sorular sorulabilir.",
        bridging:
          "Öğrencilerin kendi deneyimlerinden yola çıkarak kültürün toplumsal yapının işleyişindeki rolü hakkında fikir üretmeleri istenebilir.",
      },
      differentiation: {
        enrichment:
          "Dil-kültür ilişkisi bağlamında Sapir-Whorf hipotezi araştırılıp sunulabilir; Sabahattin Bey'in adem-i merkeziyet ve teşebbüs-i şahsi kavramları üzerinden Osmanlı toplumsal yapısı dönüşümü düşünceleri raporlaştırılabilir; Titanic gemisinde kurtarılan yolcuların sınıfsal oranları toplumsal tabakalaşma açısından değerlendirilebilir.",
        support:
          "Kültürün işlevlerinde fotoğraf ve video gibi görsel materyaller; toplumsal yapının unsurları ve işleyişi için diyagram; toplumsal tabakalaşma modelleri için tablo ve grafikler kullanılabilir.",
      },
      outcomes: [
        {
          code: "SOS.11.3.1",
          description: "Kültürün işlevlerini yapılandırabilme",
          processComponents: [
            {
              step: "a",
              description:
                "Kültürün işlevlerini inceleyerek toplumla ilişkisini ortaya koyar.",
            },
            {
              step: "b",
              description:
                "Bu ilişkiye dayanarak tutarlı ve uyumlu bir bütün oluşturur.",
            },
          ],
        },
        {
          code: "SOS.11.3.2",
          description:
            "Toplumsal yapının unsurlarını ve bu unsurlar arasındaki ilişkileri çözümleyebilme",
          processComponents: [
            {
              step: "a",
              description: "Toplumsal yapıyı oluşturan unsurları belirler.",
            },
            {
              step: "b",
              description:
                "Toplumsal yapıyı oluşturan unsurlar arasındaki ilişkileri belirler.",
            },
          ],
        },
        {
          code: "SOS.11.3.3",
          description:
            "Toplumsal tabakalaşmayı ve toplumsal hareketliliği özetleyebilme",
          processComponents: [
            {
              step: "a",
              description:
                "Toplumsal tabakalaşmayı ve toplumsal hareketliliği çözümler.",
            },
            {
              step: "b",
              description:
                "Toplumsal tabakalaşma ve toplumsal hareketlilik türlerini sınıflandırır.",
            },
            {
              step: "c",
              description:
                "Toplumsal tabakalaşmanın ve toplumsal hareketliliğin etkilerini yorumlar.",
            },
          ],
        },
      ],
    },
    {
      code: "SOS.11.4",
      grade: 11,
      name: "Toplumsal Kurumlar",
      durationHours: 16,
      keywords: [
        "meşruiyet",
        "müfredat",
        "otorite",
        "sosyalizasyon",
        "sosyal kontrol",
        "üretim biçimi",
      ],
      competencyFramework: {
        fieldSkills: [
          "SBAB16. Eleştirel Sosyolojik Düşünme (KB3.3. Eleştirel Düşünme)",
        ],
        conceptualSkills: ["KB2.10. Çıkarım Yapma", "KB2.13. Yapılandırma"],
        tendencies: [
          "E1.1. Merak",
          "E1.2. Bağımsızlık",
          "E1.3. Azim ve Kararlılık",
          "E3.1. Muhakeme",
          "E3.3. Yaratıcılık",
          "E3.6. Analitiklik",
        ],
        socialEmotionalLearning: [
          "SDB1.2. Kendini Düzenleme (Öz Düzenleme)",
          "SDB2.1. İletişim",
          "SDB2.2. İş Birliği",
        ],
        values: [
          "D1. Adalet",
          "D2. Aile Bütünlüğü",
          "D4. Dostluk",
          "D15. Sevgi",
          "D17. Tasarruf",
        ],
        literacy: ["OB1. Bilgi Okuryazarlığı", "OB4. Görsel Okuryazarlık"],
        interdisciplinaryRelations: [
          "Coğrafya",
          "Din Kültürü ve Ahlak Bilgisi",
          "Felsefe",
          "Hukuk",
          "Psikoloji",
          "Tarih",
        ],
        interSkillRelations: [
          "KB2.4. Çözümleme",
          "KB2.7. Karşılaştırma",
          "KB2.8. Sorgulama",
          "KB2.18. Tartışma",
          "KB3.1. Karar Verme",
        ],
      },
      contentFramework: [
        "Aile",
        "Eğitim",
        "Din",
        "Ekonomi",
        "Siyaset",
        "Toplumsal Kurumların Aralarındaki İlişkiler",
      ],
      canonicalLearningEvidence:
        "Bu ünitedeki öğrenme çıktıları; dereceli puanlama anahtarı, öğrenme günlüğü, öz değerlendirme formu, çalışma kâğıdı, kontrol listesi, kavram haritası ve açık uçlu sorular ile değerlendirilebilir. Performans görevi olarak Osmanlı'daki Ahi teşkilatı araştırılarak günümüz toplumuna nasıl uyarlanabileceği ve toplumsal yaşama katkıları üzerine öneriler içeren bir metin yazılabilir.",
      learningTeachingExperiences: {
        basicAssumptions:
          "Öğrencilerin aile, eğitim, din, ekonomi ve siyaset kavramları ile bunların genel özelliklerini bildiği kabul edilir.",
        preAssessment:
          "Öğrencilere aile, eğitim, din, ekonomi ve siyaset kavramlarının genel özelliklerine dair açık uçlu sorular sorulabilir.",
        bridging:
          "Öğrencilerden kendi yaşantılarından hareketle aile, eğitim, din, ekonomi ve siyaset kurumlarının karşılıklı etkileşim içinde toplumun düzenini ve işleyişini nasıl sağladığını açıklamaları istenebilir.",
      },
      differentiation: {
        enrichment:
          "Aile istatistikleri üzerinden yirmi yıl öncesi ile günümüz karşılaştırılabilir; Kemal Tahir'in Devlet Ana'sındaki devlet-toplum anlayışı, İdris Küçükömer'in sağ-sol ayrımı düşünceleri, Nurettin Topçu'nun Türkiye'nin Maarif Dâvası, Şerif Mardin'in Din ve İdeoloji'sindeki kavram-problem-argümanlar, Sabri Ülgener'in ekonomik davranış ve kalkınma düşünceleri ile Nizamülmülk'ün Siyasetname'si rapor ve metin çalışmalarıyla işlenebilir.",
        support:
          "Aile işlevlerinde iş birlikli öğrenme; eğitim kurumunda akran öğretimi; din kurumunda videolarla görsel okuma; ekonomi kurumunda temel kavramları açıklayan özet metinler; siyaset kurumunda kavram haritası; kurumların etkileşimi için diyagram kullanılabilir.",
      },
      outcomes: [
        {
          code: "SOS.11.4.1",
          description:
            "Aile kurumunun işlevi ve yapısı ile evlilik türleri üzerine eleştirel düşünebilme",
          processComponents: [
            {
              step: "a",
              description:
                "Aile kurumunun işlevinin ne olduğunu, aile tiplerini ve evlilik türlerini sorgular.",
            },
            {
              step: "b",
              description:
                "Aile kurumunun işlevi, aile tipleri ve evlilik türleri ile ilgili akıl yürütür.",
            },
            {
              step: "c",
              description: "Akıl yürütme ile ulaştığı çıkarımı yansıtır.",
            },
          ],
        },
        {
          code: "SOS.11.4.2",
          description:
            "Eğitim kurumunun işlevi ve toplumsal yaşamdaki önemi ve değeri üzerine eleştirel düşünebilme",
          processComponents: [
            {
              step: "a",
              description:
                "Eğitim kurumunun işlevinin ne olduğunu, toplumsal yaşam için önemini ve değerini sorgular.",
            },
            {
              step: "b",
              description: "Sorgulanan problem ve durumla ilgili akıl yürütür.",
            },
            {
              step: "c",
              description: "Akıl yürütme ile ulaştığı çıkarımı yansıtır.",
            },
          ],
        },
        {
          code: "SOS.11.4.3",
          description: "Din kurumunun işlevlerini yapılandırabilme",
          processComponents: [
            {
              step: "a",
              description:
                "Din kurumunun işlevlerini inceleyerek mantıksal ilişkiler ortaya koyar.",
            },
            {
              step: "b",
              description:
                "Tespitlerine dayanarak tutarlı ve uyumlu bir bütün oluşturur.",
            },
          ],
        },
        {
          code: "SOS.11.4.4",
          description:
            "Ekonomi kurumunun işlevi ve toplumsal yaşam açısından önemi hakkında çıkarım yapabilme",
          processComponents: [
            {
              step: "a",
              description:
                "Ekonomi kurumunun işlevi hakkında varsayımda bulunur.",
            },
            {
              step: "b",
              description:
                "Ekonomik işleyişte tekrar eden yapısal unsurları listeler.",
            },
            {
              step: "c",
              description: "Ekonomik sistemleri karşılaştırır.",
            },
            {
              step: "ç",
              description:
                "Devletin ekonomiye müdahalesi hakkında önerme sunar.",
            },
            {
              step: "d",
              description: "Önermeleri değerlendirir.",
            },
          ],
        },
        {
          code: "SOS.11.4.5",
          description:
            "Siyaset kurumunun işlevi ve önemi hakkında eleştirel düşünebilme",
          processComponents: [
            {
              step: "a",
              description:
                "Siyaset kurumunun işlevinin ne olduğu ile toplumsal yaşamdaki yeri ve önemini sorgular.",
            },
            {
              step: "b",
              description: "Sorgulanan durumla ilgili akıl yürütür.",
            },
            {
              step: "c",
              description: "Akıl yürütme ile ulaştığı çıkarımı yansıtır.",
            },
          ],
        },
        {
          code: "SOS.11.4.6",
          description:
            "Toplumsal kurumların işlevlerini birbirleriyle ilişkisi içinde inceleyerek toplumun işleyişini yapılandırabilme",
          processComponents: [
            {
              step: "a",
              description:
                "Toplumsal kurumların işlevlerini inceleyerek mantıksal ilişkiler ortaya koyar.",
            },
            {
              step: "b",
              description:
                "Bu ilişkilere dayanarak tutarlı ve uyumlu bir bütün oluşturur.",
            },
          ],
        },
      ],
    },
    {
      code: "SOS.11.5",
      grade: 11,
      name: "Güncel Sosyolojik Meseleler",
      durationHours: 10,
      keywords: [
        "algoritma",
        "ayrımcılık",
        "hegemonya",
        "öteki",
        "stereotip",
      ],
      competencyFramework: {
        fieldSkills: [
          "SBAB16. Eleştirel Sosyolojik Düşünme (KB3.3. Eleştirel Düşünme)",
        ],
        conceptualSkills: ["KB2.4. Çözümleme", "KB3.2. Problem Çözme"],
        tendencies: [
          "E1.1. Merak",
          "E1.3. Azim ve Kararlılık",
          "E1.5. Kendine Güvenme (Öz Güven)",
          "E3.1. Muhakeme",
          "E3.2. Odaklanma",
          "E3.7. Sistematiklik",
          "E3.8. Soru Sorma",
        ],
        socialEmotionalLearning: [
          "SDB1.2. Kendini Düzenleme (Öz Düzenleme)",
          "SDB2.1. İletişim",
          "SDB2.2. İş Birliği",
        ],
        values: [
          "D3. Çalışkanlık",
          "D6. Dürüstlük",
          "D8. Mahremiyet",
          "D10. Mütevazılık",
          "D13. Sağlıklı Yaşam",
          "D20. Yardımseverlik",
        ],
        literacy: [
          "OB2. Dijital Okuryazarlık",
          "OB4. Görsel Okuryazarlık",
          "OB5. Kültür Okuryazarlığı",
          "OB6. Vatandaşlık Okuryazarlığı",
          "OB7. Veri Okuryazarlığı",
        ],
        interdisciplinaryRelations: [
          "Din Kültürü ve Ahlak Bilgisi",
          "Bilişim",
          "Tarih",
        ],
        interSkillRelations: [
          "KB2.2. Gözlemleme",
          "KB2.11. Gözleme Dayalı Tahmin Etme",
          "KB2.14. Yorumlama",
          "KB2.16. Muhakeme (Akıl Yürütme)",
          "KB2.17. Değerlendirme",
          "KB2.18. Tartışma",
        ],
      },
      contentFramework: [
        "İslam Karşıtlığı",
        "Küreselleşmenin Toplumsal Etkileri",
        "Yapay Zekâ Kaynaklı Toplumsal Sorunlar",
      ],
      canonicalLearningEvidence:
        "Bu ünitedeki öğrenme çıktıları; açık uçlu sorular, kelime ilişkilendirme testi, öz değerlendirme formu, cümle tamamlama, kısa cevaplı sorular, giriş-çıkış kartları ve dereceli puanlama anahtarı kullanılarak değerlendirilebilir. Performans görevi olarak grup çalışmasıyla nefret suçu, ayrımcılık, kültürel ön yargı, etnosentrizm, ötekileştirme kavramları çerçevesinde İslam karşıtlığı ile baş etmeyi amaçlayan bir kamu spotu sunumu hazırlanabilir.",
      learningTeachingExperiences: {
        basicAssumptions:
          "Öğrencilerin kültürel ayrımcılık, küreselleşme ve dijital teknolojiler hakkında temel bilgilere sahip olduğu kabul edilir.",
        preAssessment:
          "Ayrımcılık, ön yargı, nefret söylemi, empati kavramları hakkında kelime ilişkilendirme testi uygulanabilir; küreselleşme ve dijital teknolojilerin toplumsal hayata etkilerine dair açık uçlu sorular sorulabilir.",
        bridging:
          "Öğrencilerden İslam karşıtlığı, küreselleşme ve yapay zekâ konusunda yaşadıkları deneyimleri paylaşmaları istenebilir.",
      },
      differentiation: {
        enrichment:
          "İslam karşıtlığı oryantalizm, hegemonya ve emperyalizm kavramlarıyla ilişkisi içinde raporlaştırılabilir; küreselleşmenin egemen güçlerin hâkimiyetini pekiştirip pekiştirmediği tartışılabilir; yapay zekânın eğitim kurum ve aktörlerini bekleyen gelecek üzerine çıkarımlı bir sunum hazırlanabilir.",
        support:
          "Kültürel ayrımcılık konusunda akran öğretimi veya grup çalışmaları; küreselleşmenin tarihsel gelişiminde görsel ve işitsel materyaller; yapay zekânın kullanım alanlarını gösteren görsel materyaller kullanılabilir.",
      },
      outcomes: [
        {
          code: "SOS.11.5.1",
          description:
            "İslam karşıtlığı problemi ile ilgili eleştirel düşünebilme",
          processComponents: [
            {
              step: "a",
              description: "İslam karşıtlığı problemini sorgular.",
            },
            {
              step: "b",
              description: "İslam karşıtlığı problemi ile ilgili akıl yürütür.",
            },
            {
              step: "c",
              description:
                "Akıl yürütmeyle ulaştığı çıkarımları yansıtır.",
            },
          ],
        },
        {
          code: "SOS.11.5.2",
          description:
            "Küreselleşme olgusunun toplumsal etkilerini çözümleme",
          processComponents: [
            {
              step: "a",
              description:
                "Küreselleşme olgusunu meydana getiren unsurları belirler.",
            },
            {
              step: "b",
              description:
                "Küreselleşme olgusunu meydana getiren unsurlar arasındaki ilişkileri belirler.",
            },
          ],
        },
        {
          code: "SOS.11.5.3",
          description:
            "Yapay zekâ teknolojileri kaynaklı toplumsal sorunlar hakkında eleştirel düşünebilme",
          processComponents: [
            {
              step: "a",
              description:
                "Yapay zekâ teknolojileri kaynaklı toplumsal sorunları sorgular.",
            },
            {
              step: "b",
              description: "Sorgulanan durumla ilgili akıl yürütür.",
            },
            {
              step: "c",
              description: "Akıl yürütme ile ulaştığı çıkarımı yansıtır",
            },
          ],
        },
      ],
    },
    {
      code: "SOS.12.1",
      grade: 12,
      name: "Bilim Sosyolojisi",
      durationHours: 20,
      keywords: [
        "bilimsel topluluk",
        "güç",
        "paradigma",
        "pozitivizm",
      ],
      competencyFramework: {
        fieldSkills: [
          "SBAB16. Eleştirel Sosyolojik Düşünme (KB2.4. Çözümleme, KB3.3. Eleştirel Düşünme)",
        ],
        conceptualSkills: [],
        tendencies: [
          "E1.3. Azim ve Kararlılık",
          "E3.4. Gerçeği Arama",
          "E3.10. Eleştirel Bakma",
        ],
        socialEmotionalLearning: ["SDB2.1. İletişim", "SDB2.2. İş Birliği"],
        values: ["D20. Yardımseverlik"],
        literacy: ["OB3. Finansal Okuryazarlık"],
        interdisciplinaryRelations: ["Felsefe", "Tarih"],
        interSkillRelations: [
          "KB2.5. Sınıflandırma",
          "KB2.8. Sorgulama",
          "KB2.10. Çıkarım Yapma",
          "KB2.16. Muhakeme",
          "KB2.18. Tartışma",
        ],
      },
      contentFramework: [
        "Bilim ve Toplum İlişkisi",
        "Bilim ve Toplum İlişkisine Eleştirel Yaklaşım",
      ],
      canonicalLearningEvidence:
        "Bu ünitedeki öğrenme çıktıları; açık uçlu sorular, öz değerlendirme formu, grup değerlendirme formu, dereceli puanlama anahtarı ve kontrol listesi kullanılarak değerlendirilebilir. Performans görevi olarak bilimsel bilginin güç yapılarıyla olan ilişkisini eleştirel bir bakışla sorgulayan bir dijital sunum hazırlanıp sınıfta sunulabilir; görev sorgulama, akıl yürütme ve sunum yapma ölçütleriyle dereceli puanlama anahtarı ile değerlendirilir.",
      learningTeachingExperiences: {
        basicAssumptions:
          "Öğrencilerin bilimin özelliklerini, toplumsal işlevlerini ve tarihsel gelişimini bildiği kabul edilir.",
        preAssessment:
          "Bilimin özellikleri, toplumsal işlevleri ve tarihsel gelişimi ile ilgili kısa cevaplı sorular sorulabilir.",
        bridging:
          "Farklı alanlardaki bilimsel gelişmelerin arka planında yer alan ekonomik ve siyasal motivasyonların neler olabileceği hakkında görüş belirtmeleri istenebilir.",
      },
      differentiation: {
        enrichment:
          "E. Shils'in merkez-çevre kuramının bilim bağlamında uluslararası alana uyarlanması ve beyin göçünün bilim-güç ilişkileri bağlamında çözümlenmesi raporlaştırılabilir; psikolojinin pazarlama sektörüne hizmeti araştırılıp sunulabilir.",
        support:
          "Bilimsel kurumlarla ilgili belgesel filmler izletilebilir; bilim-teknoloji-kalkınma ilişkisini gösteren diyagramlar hazırlatılabilir.",
      },
      outcomes: [
        {
          code: "SOS.12.1.1",
          description: "Bilim ve toplum ilişkisini çözümleyebilme",
          processComponents: [
            {
              step: "a",
              description:
                "Bilim ve toplum ilişkisini oluşturan unsurları belirler.",
            },
            {
              step: "b",
              description:
                "Bu unsurlar arasındaki ilişkileri belirler.",
            },
          ],
        },
        {
          code: "SOS.12.1.2",
          description: "Bilim ve toplum ilişkisi üzerine eleştirel düşünebilme",
          processComponents: [
            {
              step: "a",
              description: "Bilim ve güç ilişkisini sorgular.",
            },
            {
              step: "b",
              description: "Bilim ve güç ilişkisiyle ilgili akıl yürütür.",
            },
            {
              step: "c",
              description:
                "Akıl yürütmeyle ulaştığı çıkarımları yansıtır.",
            },
          ],
        },
      ],
    },
    {
      code: "SOS.12.2",
      grade: 12,
      name: "Örnek Sosyolojik Uygulamalar",
      durationHours: 48,
      keywords: [
        "dikkat ekonomisi",
        "okul kültürü",
        "sosyalizasyon",
        "suç",
      ],
      competencyFramework: {
        fieldSkills: [
          "SBAB16. Eleştirel Sosyolojik Düşünme (KB3.3. Eleştirel Düşünme)",
        ],
        conceptualSkills: [],
        tendencies: [
          "E1.5. Kendine Güvenme (Öz Güven)",
          "E2.1. Empati",
          "E3.3. Yaratıcılık",
          "E3.4. Gerçeği Arama",
          "E3.6. Analitiklik",
        ],
        socialEmotionalLearning: [
          "SDB2.1. İletişim",
          "SDB2.2. İş Birliği",
          "SDB2.3. Sosyal Farkındalık",
          "SDB3.1. Uyum",
          "SDB3.2. Esneklik",
          "SDB3.3. Sorumlu Karar Verme",
        ],
        values: [
          "D2. Aile Bütünlüğü",
          "D8. Mahremiyet",
          "D9. Merhamet",
          "D14. Saygı",
          "D16. Sorumluluk",
          "D20. Yardımseverlik",
        ],
        literacy: [
          "OB1. Bilgi Okuryazarlığı",
          "OB2. Dijital Okuryazarlık",
          "OB4. Görsel Okuryazarlık",
          "OB7. Veri Okuryazarlığı",
          "OB8. Sürdürülebilirlik Okuryazarlığı",
        ],
        interdisciplinaryRelations: ["Felsefe", "Tarih"],
        interSkillRelations: [
          "KB2.3. Özetleme",
          "KB2.5. Sınıflandırma",
          "KB2.8. Sorgulama",
          "KB2.10. Çıkarım Yapma",
          "KB2.13. Yapılandırma",
          "KB2.14. Yorumlama",
          "KB2.16. Muhakeme (Akıl Yürütme)",
          "KB2.18. Tartışma",
        ],
      },
      contentFramework: [
        "Güncel Toplumsal Meseleler: Aile, Sosyalizasyon ve Suç İlişkisi",
        "Okul Kültürü",
        "Akran Nezaketine Aykırı Davranışlar",
        "Dezavantajlı Gruplar",
        "Afetler ve Toplum",
        "Dikkat Ekonomisi",
      ],
      canonicalLearningEvidence:
        "Bu ünitedeki öğrenme çıktıları; dereceli puanlama anahtarı, kontrol listesi ve öz değerlendirme formu ile değerlendirilebilir. Performans görevi olarak öğrencilerin akıl yürütme ve yargılarını kısa belgesel senaryosu, farkındalık afişi veya sosyal medya kampanyası taslağı hâlinde hazırlayıp sınıfta sunmaları istenebilir.",
      learningTeachingExperiences: {
        basicAssumptions:
          "Öğrencilerin sosyolojinin temel kavramlarını ve araştırma yöntemlerini bildiği kabul edilir.",
        preAssessment:
          "Öğrencilere sosyolojinin temel kavramları ve araştırma yöntemleri hakkında açık uçlu sorular sorulabilir.",
        bridging:
          "Öğrencilerin çevrelerinde gözlemlediği toplumsal sorunlar hakkında kısa bilgi vermeleri ve sosyolojinin bu sorunların çözümüne nasıl katkı sağlayacağı konusunda fikir üretmesi sağlanabilir.",
      },
      differentiation: {
        enrichment:
          "Yapay zekâyı üreten ülkeler ile yalnızca kullanıcı düzeyinde olan ülkelerin kültürel, ekonomik ve siyasal etkilenmeleri karşılaştırmalı olarak araştırılıp raporlaştırılabilir.",
        support:
          "Öğrencilere sosyolojik araştırmalarda kullanılan yöntemlerin aşamalarını gösteren görseller verilebilir.",
      },
      outcomes: [
        {
          code: "SOS.12.2.1",
          description:
            "Güncel toplumsal meseleler hakkında eleştirel düşünebilme",
          processComponents: [
            {
              step: "a",
              description: "Güncel toplumsal meseleleri sorgular.",
            },
            {
              step: "b",
              description: "Güncel toplumsal meselelerle ilgili akıl yürütür.",
            },
            {
              step: "c",
              description:
                "Akıl yürütme ile elde ettiği çıkarımları yansıtır.",
            },
          ],
        },
      ],
    },
  ],
  assessments: [
    {
      code: "sociology-11",
      name: "Sosyoloji Dersi 1 öğrenme kanıtları",
      outcomeCodes: [
        "SOS.11.1.1",
        "SOS.11.1.2",
        "SOS.11.1.3",
        "SOS.11.2.1",
        "SOS.11.2.2",
        "SOS.11.2.3",
        "SOS.11.3.1",
        "SOS.11.3.2",
        "SOS.11.3.3",
        "SOS.11.4.1",
        "SOS.11.4.2",
        "SOS.11.4.3",
        "SOS.11.4.4",
        "SOS.11.4.5",
        "SOS.11.4.6",
        "SOS.11.5.1",
        "SOS.11.5.2",
        "SOS.11.5.3",
      ],
    },
    {
      code: "sociology-12",
      name: "Sosyoloji Dersi 2 öğrenme kanıtları",
      outcomeCodes: ["SOS.12.1.1", "SOS.12.1.2", "SOS.12.2.1"],
    },
  ],
};
