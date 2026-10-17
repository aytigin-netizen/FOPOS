// src/curriculum-packages/psychology-2026.ts
// Controlled seviye minimal paket — resmî PDF (psychology-2026.pdf) temel alınmıştır.
// Doğrulama durumu: UNVERIFIED (henüz insan onaylı parite tamamlanmadı).
// Üretim modülleri kapalıdır.

import type { CurriculumPackage } from "../core/curriculum/package-types.ts";

const sourceUrl = "https://meb.gov.tr/psychology-2026"; // resmî URL ile güncelle

export const psychology2026Package: CurriculumPackage = {
  schemaVersion: "1.0.0",
  manifest: {
    schemaVersion: "1.0.0",
    datasetVersion: "2026.1",
    lifecycle: "ACTIVE",
    discipline: { code: "psychology", name: "Psikoloji" },
    defaultGrade: 11,
    source: {
      title: "Psikoloji Dersi Öğretim Programı (2026)",
      year: 2026,
      url: sourceUrl,
      document: "202662515165385-Psikoloji döp.pdf",
      pageCount: 34,
      verificationNote:
        "Kaynak PDF ve metin kayıtlıdır. Ünite/çıktı tablosu (s. 10 civarı) ve haftalık 2 ders saati kuralı paketle karşılaştırıldı. Henüz insan onaylı doğrulama tamamlanmadı.",
    },
    verification: {
      status: "UNVERIFIED",
      sourceId: "meb:psychology:2026",
      sourceVersion: "2026.1",
      verifiedAt: null,
      verificationMethod: null,
      evidence: [
        {
          type: "OFFICIAL_SOURCE",
          reference: sourceUrl,
          note: "Resmî program kaynağı kayıtlıdır; doğrulama kanıt zinciri henüz tamamlanmadı.",
        },
      ],
    },
    applicability: {
      rules: [
        {
          grade: 11,
          officialCourseName: "Psikoloji Dersi",
          schoolTypes: ["general_secondary", "social_sciences_high_school"],
          note: "Psikoloji Dersi ortaöğretim kurumlarında uygulanabilir.",
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
      coreFieldSkills: ["Eleştirel Düşünme", "Bütüncül İnsan Anlayışı"],
    },
    grades: {
      "11": {
        unitCount: 4,
        learningOutcomeCount: 13,
        instructionHours: 68,
        schoolBasedPlanningHours: 4,
      },
    },
  },
  units: [
    {
      code: "PSK.1",
      name: "Psikoloji ile Tanışma",
      grade: 11,
      unitNumber: 1,
      durationHours: 10,
      outcomes: [
        {
          code: "PSK.1.1",
          description: "Psikoloji biliminin temel kavramlarını ve kapsamını açıklar.",
          short: "Psikoloji ile tanışma",
        },
      ],
    },
    {
      code: "PSK.2",
      name: "Gelişimi Anlamak",
      grade: 11,
      unitNumber: 2,
      durationHours: 18,
      outcomes: [
        { code: "PSK.2.1", description: "Gelişim kavramını ve temel ilkelerini açıklar.", short: "Gelişim kavramı" },
        { code: "PSK.2.2", description: "Gelişimi etkileyen etmenleri sınıflandırır.", short: "Gelişim etmenleri" },
        { code: "PSK.2.3", description: "Bilişsel, duygusal ve sosyal gelişim süreçlerini karşılaştırır.", short: "Gelişim süreçleri" },
        { code: "PSK.2.4", description: "Gelişim dönemlerinin özelliklerini günlük yaşam örnekleriyle ilişkilendirir.", short: "Gelişim dönemleri" },
      ],
    },
    {
      code: "PSK.3",
      name: "Nasıl Öğreniriz?",
      grade: 11,
      unitNumber: 3,
      durationHours: 20,
      outcomes: [
        { code: "PSK.3.1", description: "Öğrenme kavramını ve temel yaklaşımlarını açıklar.", short: "Öğrenme kavramı" },
        { code: "PSK.3.2", description: "Öğrenmeyi etkileyen etmenleri sınıflandırır.", short: "Öğrenme etmenleri" },
        { code: "PSK.3.3", description: "Öğrenme yaklaşımlarını karşılaştırır.", short: "Öğrenme yaklaşımları" },
        { code: "PSK.3.4", description: "Etkili öğrenme stratejilerini günlük yaşama uygular.", short: "Öğrenme stratejileri" },
      ],
    },
    {
      code: "PSK.4",
      name: "Bireysel ve Sosyal Uyum",
      grade: 11,
      unitNumber: 4,
      durationHours: 20,
      outcomes: [
        { code: "PSK.4.1", description: "Bireysel uyum kavramını ve önemini açıklar.", short: "Bireysel uyum" },
        { code: "PSK.4.2", description: "Sosyal uyum süreçlerini analiz eder.", short: "Sosyal uyum" },
        { code: "PSK.4.3", description: "Stres ve başa çıkma stratejilerini değerlendirir.", short: "Stres ve başa çıkma" },
        { code: "PSK.4.4", description: "Sağlıklı iletişim ve ilişki becerilerini uygular.", short: "İletişim becerileri" },
      ],
    },
  ],
  assessments: [],
};
