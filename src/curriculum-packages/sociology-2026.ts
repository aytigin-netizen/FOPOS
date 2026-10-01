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
        "Resmî program ünite, öğrenme çıktısı ve süre tabloları (s. 10) ile haftalık iki ders saati uygulama kuralı (s. 6) paketle karşılaştırıldı. Doğrulama zinciri insan onayıyla tamamlandı (gecis-1-2). Kaynak snapshot resmî URL ile kayıtlıdır; ayrı içerik karması öğretmen kararıyla eklenmedi.",
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
          note: "Resmî program kaynağı snapshot'ı (48 sayfa, kaynak URL'i ile kayıtlı; ayrı içerik karması öğretmen kararıyla eklenmedi), 1 Ekim 2026.",
        },
        {
          type: "VERIFICATION_RECORD",
          reference: "tests/sociology-curriculum-2026-source-parity.test.mjs",
          note: "Resmî program kapsam paritesi sözleşmesi + insan onayı: Aytekin YILMAZ (öğretmen, HUMAN, APPROVED), 1 Ekim 2026. Kayıt: docs/sosyoloji-mufredati-2026-gecis-1-2.md.",
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
        lea
rningOutcomeCount: 3,
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
        },
        {
          code: "SOS.11.1.2",
          description: "Sosyolojik düşünme biçimini sorgulayabilme",
        },
        {
          code: "SOS.11.1.3",
          description:
            "Sosyolojide kullanılan farklı yöntemleri karşılaştırabilme",
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
        },
        {
          code: "SOS.11.2.2",
          description:
            "Türkiye’de sosyolojinin doğuşu ve gelişim sürecini tarihsel bir kurgu içinde yapılandırabilme",
        },
        {
          code: "SOS.11.2.3",
          description:
            "Türk modernleşmesinin Türk edebiyatına yansımasını yorumlayabilme",
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
        },
        {
          code: "SOS.11.3.2",
          description:
            "Toplumsal yapının unsurlarını ve bu unsurlar arasındaki ilişkileri çözümleyebilme",
        },
        {
          code: "SOS.11.3.3",
          description:
            "Toplumsal tabakalaşmayı ve toplumsal hareketliliği özetleyebilme",
        },
      ],
    },
    {
      code: "SOS.11.4",
      grade: 11,
      name: "Toplumsal K
urumlar",
      durationHours: 16,
      outcomes: [
        {
          code: "SOS.11.4.1",
          description:
            "Aile kurumunun işlevi ve yapısı ile evlilik türleri üzerine eleştirel düşünebilme",
        },
        {
          code: "SOS.11.4.2",
          description:
            "Eğitim kurumunun işlevi ve toplumsal yaşamdaki önemi ve değeri üzerine eleştirel düşünebilme",
        },
        {
          code: "SOS.11.4.3",
          description: "Din kurumunun işlevlerini yapılandırabilme",
        },
        {
          code: "SOS.11.4.4",
          description:
            "Ekonomi kurumunun işlevi ve toplumsal yaşam açısından önemi hakkında çıkarım yapabilme",
        },
        {
          code: "SOS.11.4.5",
          description:
            "Siyaset kurumunun işlevi ve önemi hakkında eleştirel düşünebilme",
        },
        {
          code: "SOS.11.4.6",
          description:
            "Toplumsal kurumların işlevlerini birbirleriyle ilişkisi içinde inceleyerek toplumun işleyişini yapılandırabilme",
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
        },
        {
          code: "SOS.11.5.2",
          description:
            "Küreselleşme olgusunun toplumsal etkilerini çözümleyebilme",
        },
        {
          code: "SOS.11.5.3",
          description:
            "Yapay zekâ teknolojileri kaynaklı toplumsal sorunlar hakkında eleştirel düşünebilme",
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
        },
        {
          code: "SOS.12.1.2",
          description:
    
        "Bilim ve toplum ilişkisi üzerine eleştirel düşünebilme",
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
