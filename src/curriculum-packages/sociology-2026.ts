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
    programRules: {
      weeklyHours: 2,
      annualTotalHoursPerGrade: 72,
      instructionHoursPerGrade: 68,
      schoolBasedPlanningHoursPerGrade: 4,
      schoolBasedPlanningFocus:
        "Zümre öğretmenler kurulu tarafından ders kapsamında yapılması kararlaştırılan okul dışı öğrenme etkinlikleri, araştırma ve gözlem, sosyal etkinlikler, proje çalışmaları, 
yerel çalışmalar, okuma çalışmaları vb. çalışmalar için ayrılan süredir.",
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
      outcomes: [
        {
          code: "SOS.11.1.1",
          description:
            "Sosyolojinin doğuş sürecini tarihsel bağlamda anlamlandırabilme",
          processComponents: [
            { step: "a", description: "Sosyolojinin doğuşuna etki eden düşünürlerin görüşlerini analiz eder." },
            { step: "b", description: "Sosyolojinin doğduğu dönemin sosyal, ekonomik ve siyasal koşullarını fark eder." },
            { step: "c", description: "Sosyolojinin doğduğu tarihsel koşullar ile günümüz toplumlarının koşullarını karşılaştırır." },
            { step: "ç", description: "Sosyolojinin kurucu isimlerinin sosyoloji anlayışlarını açıklar." },
          ],
        },
        {
          code: "SOS.11.1.2",
          description: "Sosyolojik düşünme biçimini sorgulayabilme",
          processComponents: [
            { step: "a", description: "Sosyolojik düşünme biçimi ile ilgili merak ettiği konuyu tanımlar." },
            { step: "b", description: "Sosyolojik düşünme biçimi ile ilgili merak ettiği konu hakkında sorular sorar." },
            { step: "c", description: "Sosyolojik düşünme biçimi ile ilgili merak ettiği konu hakkında bilgi toplar." },
            { step: "ç", description: "Toplanan bilgilerin doğruluğunu değerlendirir." },
            { step: "d", description: "Doğrulanmış bilgilerden hareketle sosyolojik düşünme biçimine uygun çıkarımlar yapar." },
          ],
        },
        {
          code: "SOS.11.1.3",
          description:
            "Sosyolojide kullanılan farklı yöntemleri karşılaştırabilme",
          processComponents: [
            { step: "a", description: "Nicel ve nitel araştırma yöntemleri ile bu yöntemlerin dayandığı görüşlerin temel özelliklerini belirler." },
            { step: "b", description: "Nicel ve nitel araştırma yöntemlerinin benzerliklerini listeler." },
            { step: "c", description: "Nicel ve nitel araştırma yöntemlerinin farklılıklarını listeler." },
          ],
        },
      ],
    },
    {
      code: "SOS.11.2",
      grade: 11,
      name: "Türkiye’de Modernleşme ve Sosyoloji",
      durationHours: 14,
      outcomes: [
        {
          code: "SOS.11.2.1",
          description:
            "Osmanlı’dan Cumhuriyet’e modernleşmenin neden ve sonuçlarını yorumlayabilme",
          processComponents: [
            { step: "a", description: "Osmanlı’da başlayıp Cumhuriyet Dönemi’nde derinleşerek devam eden modernleşmenin nedenlerini inceler." },
            { step: "b", description: "Osmanlı’da başlayıp Cumhuriyet Dönemi’nde derinleşerek devam eden modernleşmenin sonuçlarını inceler." },
            { step: "c", description: "Modernleşmenin sonuçlarını tarihsel bağlamda sorgular." },
            { step: "ç", description: "Modernleşmenin nedenlerini ve sonuçlarını tarihsel bağlamda yeniden ifade eder." },
          ],
        },
        {
          code: "SOS.11.2.2",
          description:
            "Türkiye’de sosyolojinin doğuşu ve gelişim sürecini tarihsel bir kurgu içinde yapılandırabilme",
          processComponents: [
            { step: "a", description: "Türkiye’de sosyolojinin gelişim sürecine ilişkin olay, olgu ve düşünsel yönelimleri inceleyerek nedensel ilişkiler ortaya koyar." },
            { step: "b", description: "Ortaya koyduğu ilişkileri tarihsel bağlamda bütünleştirerek uyumlu bir bütün oluşturur." },
          ],
        },
        {
          code: "SOS.11.2.3",
          description:
            "Türk modernleşmesinin Türk edebiyatına yansımasını yorumlayabilme",
          processComponents: [
            { step: "a", description: "Edebi eserlerde modernleşme konusunu inceler." },
            { step: "b", description: "İncelediği konuyu sosyoloji ile ilişkisi içinde bağlamdan kopmadan yazılı/sözlü metne dönüştürür." },
            { step: "c", description: "Eserlerdeki ilgili düşünceleri anlamı değiştirmeden kendi cümleleriyle ifade eder." },
          ],
        },
      ],
    },
    {
      code: "SOS.11.3",
      grade: 11,
      name: "Kültür ve Toplumsal Yapı",
      durationHours: 12,
      outcomes: [
        {
          code: "SOS.11.3.1",
          description: "Kültürün işlevlerini yapılandırabilme",
          processComponents: [
            { step: "a", description: "Kültürün işlevlerini inceleyerek toplumla ilişkisini ortaya koyar." },
            { step: "b", description: "Bu ilişkiye dayanarak tutarlı ve uyumlu bir bütün oluşturur." },
          ],
        },
        {
          code: "SOS.11.3.2",
       
   description:
            "Toplumsal yapının unsurlarını ve bu unsurlar arasındaki ilişkileri çözümleyebilme",
          processComponents: [
            { step: "a", description: "Toplumsal yapıyı oluşturan unsurları belirler." },
            { step: "b", description: "Toplumsal yapıyı oluşturan unsurlar arasındaki ilişkileri belirler." },
          ],
        },
        {
          code: "SOS.11.3.3",
          description:
            "Toplumsal tabakalaşmayı ve toplumsal hareketliliği özetleyebilme",
          processComponents: [
            { step: "a", description: "Toplumsal tabakalaşmayı ve toplumsal hareketliliği çözümler." },
            { step: "b", description: "Toplumsal tabakalaşma ve toplumsal hareketlilik türlerini sınıflandırır." },
            { step: "c", description: "Toplumsal tabakalaşmanın ve toplumsal hareketliliğin etkilerini yorumlar." },
          ],
        },
      ],
    },
    {
      code: "SOS.11.4",
      grade: 11,
      name: "Toplumsal Kurumlar",
      durationHours: 16,
      outcomes: [
        {
          code: "SOS.11.4.1",
          description:
            "Aile kurumunun işlevi ve yapısı ile evlilik türleri üzerine eleştirel düşünebilme",
          processComponents: [
            { step: "a", description: "Aile kurumunun işlevinin ne olduğunu, aile tiplerini ve evlilik türlerini sorgular." },
            { step: "b", description: "Aile kurumunun işlevi, aile tipleri ve evlilik türleri ile ilgili akıl yürütür." },
            { step: "c", description: "Akıl yürütme ile ulaştığı çıkarımı yansıtır." },
          ],
        },
        {
          code: "SOS.11.4.2",
          description:
            "Eğitim kurumunun işlevi ve toplumsal yaşamdaki önemi ve değeri üzerine eleştirel düşünebilme",
          processComponents: [
            { step: "a", description: "Eğitim kurumunun işlevinin ne olduğunu, toplumsal yaşam için önemini ve değerini sorgular." },
            { step: "b", description: "Sorgulanan problem ve durumla ilgili akıl yürütür." },
            { step: "c", description: "Akıl yürütme ile ulaştığı çıkarımı yansıtır." },
          ],
        },
        {
          code: "SOS.11.4.3",
          description: "Din kurumunun işlevlerini yapılandırabilme",
          processComponents: [
            { step: "a", description: "Din kurumunun işlevlerini inceleyerek mantıksal ilişkiler ortaya koyar." },
            { step: "b", description: "Tespitlerine dayanarak tutarlı ve uyumlu bir bütün oluşturur." },
          ],
        },
        {
          code: "SOS.11.4.4",
          description:
            "Ekonomi kurumunun işlevi ve toplumsal yaşam açısından önemi hakkında çıkarım yapabilme",
          processComponents: [
            { step: "a", description: "Ekonomi kurumunun işlevi hakkında varsayımda bulunur." },
            { step: "b", description: "Ekonomik işleyişte tekrar eden yapısal unsurları listeler." },
            { step: "c", description: "Ekonomik sistemleri karşılaştırır." },
            { step: "ç", description: "Devletin ekonomiye müdahalesi hakkında önerme sunar." },
            { step: "d", description: "Önermeleri değerlendirir." },
          ],
        },
        {
          code: "SOS.11.4.5",
          description:
            "Siyaset kurumunun işlevi ve önemi hakkında eleştirel düşünebilme",
          processComponents: [
            { step: "a", description: "Siyaset kurumunun işlevinin ne olduğu ile toplumsal yaşamdaki yeri ve önemini sorgular." },
            { step: "b", description: "Sorgulanan durumla ilgili akıl yürütür." },
            { step: "c", description: "Akıl yürütme ile ulaştığı çıkarımı yansıtır." },
          ],
        },
        {
          code: "SOS.11.4.6",
          description:
            "Toplumsal kurumların işlevlerini birbirleriyle ilişkisi içinde inceleyerek toplumun işleyişini yapılandırabilme",
          processComponents: [
            { step: "a", description: "Toplumsal kurumların işlevlerini inceleyerek mantıksal ilişkiler ortaya koyar." },
            { step: "b", description: "Bu ilişkilere dayanarak tutarlı ve uyumlu bir bütün oluşturur." },
          ],
        },
      ],
    },
    {
      code: "SOS.11.5",
      grade: 11,
      name: "Güncel Sosyolojik Meseleler",
      durationHours: 10,
      outcomes: [
        {
          code: "SOS.11.5.1",
          description:
            "İslam karşıtlığı problemi ile ilgili eleştirel düşünebilme",
          processComponents: [
            { step: "a", description: "İslam karşıtlığı problemini sorgular." },
            { step: "b", description: "İslam karşıtlığı problemi ile ilgili akıl yürütür." },
            { step: "c", description: "Akıl yürütmeyle ulaştığı çıkarımları yansıtır." },
          ],
        },
        {
          code: "SOS.11.5.2",
          description:
            "Küreselleşme olgusunun toplumsal etkilerini çözümleyebilme",
          processComponents: [
            { step: "a", description: "Küreselleşme olgusunu meydana getiren unsurları belirler." },
            { step: "b", description: "Küreselleşme olgusunu meydana getiren unsurlar arasındaki ilişkileri belirler." },
          ],
        },
        {
          code: "SOS.11.5.3",
          description:
            "Yapay zekâ teknolojileri kaynaklı toplumsal sorunlar hakk
ında eleştirel düşünebilme",
          processComponents: [
            { step: "a", description: "Yapay zekâ teknolojileri kaynaklı toplumsal sorunları sorgular." },
            { step: "b", description: "Sorgulanan durumla ilgili akıl yürütür." },
            { step: "c", description: "Akıl yürütme ile ulaştığı çıkarımı yansıtır." },
          ],
        },
      ],
    },
    {
      code: "SOS.12.1",
      grade: 12,
      name: "Bilim Sosyolojisi",
      durationHours: 20,
      outcomes: [
        {
          code: "SOS.12.1.1",
          description: "Bilim ve toplum ilişkisini çözümleyebilme",
          processComponents: [
            { step: "a", description: "Bilim ve toplum ilişkisini oluşturan unsurları belirler." },
            { step: "b", description: "Bu unsurlar arasındaki ilişkileri belirler." },
          ],
        },
        {
          code: "SOS.12.1.2",
          description:
            "Bilim ve toplum ilişkisi üzerine eleştirel düşünebilme",
          processComponents: [
            { step: "a", description: "Bilim ve güç ilişkisini sorgular." },
            { step: "b", description: "Bilim ve güç ilişkisiyle ilgili akıl yürütür." },
            { step: "c", description: "Akıl yürütmeyle ulaştığı çıkarımları yansıtır." },
          ],
        },
      ],
    },
    {
      code: "SOS.12.2",
      grade: 12,
      name: "Örnek Sosyolojik Uygulamalar",
      durationHours: 48,
      outcomes: [
        {
          code: "SOS.12.2.1",
          description:
            "Güncel toplumsal meseleler hakkında eleştirel düşünebilme",
          processComponents: [
            { step: "a", description: "Güncel toplumsal meseleleri sorgular." },
            { step: "b", description: "Güncel toplumsal meselelerle ilgili akıl yürütür." },
            { step: "c", description: "Akıl yürütme ile elde ettiği çıkarımları yansıtır." },
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
