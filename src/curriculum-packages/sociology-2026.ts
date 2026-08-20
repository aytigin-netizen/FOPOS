import type { CurriculumPackage } from "../core/curriculum/package-types.ts";

const sourceUrl =
  "https://mufredat.meb.gov.tr/Dosyalar/2026625151446241-Sosyoloji%20d%C3%B6p.pdf";

export const sociology2026Package: CurriculumPackage = {
  manifest: {
    schemaVersion: "1.0.0",
    datasetVersion: "2026.1",
    discipline: { code: "sociology", name: "Sosyoloji" },
    defaultGrade: 11,
    source: {
      title: "Ortaöğretim Sosyoloji Dersi Öğretim Programı",
      year: 2026,
      url: sourceUrl,
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
      name: "Toplumsal Kurumlar",
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
