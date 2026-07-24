import type { GradeCurriculum } from "@/curriculum/types";

const sharedOutcomeComponents = {
  fieldSkills: ["SBAB14.1", "SBAB15"],
} as const;

export const grade11Curriculum = {
  courseCode: "FEL",
  courseName: "Felsefe",
  model: "Türkiye Yüzyılı Maarif Modeli",
  publicationYear: 2024,
  grade: 11,
  weeklyLessonHours: 2,
  annualLessonHours: 72,
  schoolBasedPlanningHours: 4,
  units: [
    {
      code: "FEL.11.1",
      grade: 11,
      order: 1,
      title: "Çevre Sorunları ve Felsefe",
      slug: "cevre-sorunlari-ve-felsefe",
      lessonHours: 12,
      purpose:
        "Öğrencilerin çevreyle ilgili felsefi soru ve problemleri hayatla ilişkilendirerek anlamlandırması ve felsefi düşünce ortaya koyması.",
      outcomes: [
        {
          code: "FEL.11.1.1",
          title: "Çevre ile ilgili felsefi soru ve problemleri anlayabilme",
          processComponents: [
            "Çevre ile ilgili felsefi soru ve problemleri açıklar.",
            "Çevre ile ilgili felsefi soru ve problemleri hayatla ilişkilendirerek değerlendirir.",
          ],
        },
        {
          code: "FEL.11.1.2",
          title: "Çevre sorunlarıyla ilgili felsefi düşünce ortaya koyabilme",
          processComponents: [
            "Çevre ile ilgili felsefi problemleri çözümler.",
            "Çevre sorunları ile ilgili görüş ve argüman oluşturur.",
            "Çevre sorunları ile ilgili felsefi bir metin yazar.",
          ],
        },
      ],
      contentFramework: [
        "Çevre ile İlgili Problemler (Çevrenin Tahribatı, Çevre Kirliliği, Küresel Isınma, Sürdürülebilirlik)",
        "Çevre Etiği (İnsan Merkezci Etik, Canlı Merkezci Etik, Çevre Merkezci Etik)",
      ],
      keyConcepts: ["çevre", "çevre etiği", "değer", "doğa"],
      components: {
        ...sharedOutcomeComponents,
        tendencies: ["E3.1", "E3.2", "E3.5", "E3.7", "E3.11"],
        socialEmotionalSkills: ["SDB2.1", "SDB3.2"],
        values: ["D3", "D5", "D9", "D16", "D17", "D18", "D19", "D20"],
        literacies: ["OB1", "OB7", "OB8"],
        interdisciplinaryRelations: ["Biyoloji", "Coğrafya", "Tarih", "Sosyoloji"],
        crossSkills: ["KB2.7", "KB2.10", "KB2.14", "KB2.18", "KB3.2"],
      },
      sourceUrl: "https://tymm.meb.gov.tr/felsefe-dersi/unite/66",
    },
    {
      code: "FEL.11.2",
      grade: 11,
      order: 2,
      title: "Teknoloji ve Hayat",
      slug: "teknoloji-ve-hayat",
      lessonHours: 12,
      purpose:
        "Öğrencilerin teknoloji ile ilgili felsefi soru ve problemleri hayatla ilişkilendirerek anlamlandırması ve felsefi düşünce ortaya koyması.",
      outcomes: [
        {
          code: "FEL.11.2.1",
          title: "Teknoloji ile ilgili felsefi soru ve problemleri anlayabilme",
          processComponents: [
            "Teknoloji ile ilgili felsefi soru ve problemleri açıklar.",
            "Teknoloji ile ilgili felsefi soru ve problemleri hayatla ilişkilendirerek değerlendirir.",
          ],
        },
        {
          code: "FEL.11.2.2",
          title: "Teknoloji ve hayat ilişkisiyle ilgili felsefi düşünce ortaya koyabilme",
          processComponents: [
            "Teknoloji ve hayat ilişkisiyle ilgili felsefi problemleri çözümler.",
            "Teknoloji ve hayat ilişkisiyle ilgili görüş ve argüman oluşturur.",
            "Teknoloji ve hayat ilişkisiyle ilgili felsefi metin yazar.",
          ],
        },
      ],
      contentFramework: [
        "Teknoloji ve İnsan Hayatı",
        "Teknoloji Bağlamında Ontolojik Problemler (Ontolojik Anlam Kaybı, Yabancılaşma, Zaman-Mekân Algısı ve Sanal Evren)",
        "Teknoloji Bağlamında Aksiyolojik Problemler (Güvenlik Sorunları, Değerlerin Tahribatı, Ahlaki Eylemin İmkânı)",
      ],
      keyConcepts: ["ontolojik anlam", "tekhne", "teknoloji karşıtlığı", "teknoloji taraftarlığı", "teknokrasi", "zaman ve mekân"],
      components: {
        ...sharedOutcomeComponents,
        tendencies: ["E2.2", "E3.1", "E3.4", "E3.5", "E3.7", "E3.11"],
        socialEmotionalSkills: ["SDB2.1", "SDB3.1"],
        values: ["D2", "D3", "D8", "D13", "D16", "D17", "D19"],
        literacies: ["OB1", "OB2", "OB3"],
        interdisciplinaryRelations: ["Biyoloji", "Coğrafya", "Tarih", "Psikoloji"],
        crossSkills: ["KB2.7", "KB2.10", "KB2.14", "KB2.18", "KB3.2", "KB3.3"],
      },
      sourceUrl: "https://tymm.meb.gov.tr/felsefe-dersi/unite/69",
    },
    {
      code: "FEL.11.3",
      grade: 11,
      order: 3,
      title: "Akıl ve İnanç",
      slug: "akil-ve-inanc",
      lessonHours: 10,
      purpose:
        "Öğrencilerin akıl-inanç ilişkisine yönelik felsefi soru ve problemleri hayatla ilişkilendirerek anlamlandırması ve felsefi düşünce ortaya koyması.",
      outcomes: [
        {
          code: "FEL.11.3.1",
          title: "Akıl-inanç ilişkisiyle ilgili felsefi soru ve problemleri anlayabilme",
          processComponents: [
            "Akıl-inanç ilişkisiyle ilgili felsefi soru ve problemleri açıklar.",
            "Akıl-inanç ilişkisiyle ilgili felsefi soru ve problemleri hayatla ilişkilendirerek değerlendirir.",
          ],
        },
        {
          code: "FEL.11.3.2",
          title: "Akıl-inanç ilişkisiyle ilgili felsefi düşünce ortaya koyabilme",
          processComponents: [
            "Akıl-inanç ilişkisiyle ilgili felsefi problemleri çözümler.",
            "Akıl-inanç ilişkisiyle ilgili görüş ve argüman oluşturur.",
            "Akıl-inanç ilişkisiyle ilgili felsefi metin yazar.",
          ],
        },
      ],
      contentFramework: ["Akıl-İnanç İlişkisine Yönelik Felsefi Görüşler"],
      keyConcepts: ["akıl", "gönül", "inanç"],
      components: {
        ...sharedOutcomeComponents,
        tendencies: ["E1.1", "E2.1", "E3.1", "E3.5", "E3.7", "E3.11"],
        socialEmotionalSkills: ["SDB2.1"],
        values: ["D3", "D10", "D12", "D16"],
        literacies: ["OB1"],
        interdisciplinaryRelations: ["Din Kültürü ve Ahlak Bilgisi", "Tarih"],
        crossSkills: ["KB2.7", "KB2.10", "KB2.14", "KB2.18", "KB3.3"],
      },
      sourceUrl: "https://tymm.meb.gov.tr/felsefe-dersi/unite/77",
    },
    {
      code: "FEL.11.4",
      grade: 11,
      order: 4,
      title: "Edebiyat ve Felsefe",
      slug: "edebiyat-ve-felsefe",
      lessonHours: 12,
      purpose:
        "Öğrencilerin edebiyat-felsefe ilişkisine yönelik soru ve problemleri hayatla ilişkilendirerek anlamlandırması ve felsefi düşünce ortaya koyması.",
      outcomes: [
        {
          code: "FEL.11.4.1",
          title: "Edebiyat-felsefe ilişkisi ile ilgili soru ve problemleri anlayabilme",
          processComponents: [
            "Edebiyat-felsefe ilişkisi ile ilgili felsefi soru ve problemleri açıklar.",
            "Edebiyat-felsefe ilişkisi temelinde oluşan soru ve problemlerin hayatla ilişkisini değerlendirir.",
          ],
        },
        {
          code: "FEL.11.4.2",
          title: "Edebiyat-felsefe ilişkisi ile ilgili felsefi düşünce ortaya koyabilme",
          processComponents: [
            "Edebiyat-felsefe ilişkisi ile ilgili felsefi problemleri çözümler.",
            "Edebiyat-felsefe ilişkisi ile ilgili felsefi görüş ve argüman oluşturur.",
            "Edebiyat-felsefe ilişkisi ile ilgili felsefi metin yazar.",
          ],
        },
      ],
      contentFramework: ["Dil, Edebiyat ve Felsefe İlişkisi", "Edebî Unsurlara Felsefi Bakış"],
      keyConcepts: ["edebiyat", "felsefi roman", "felsefi şiir"],
      components: {
        ...sharedOutcomeComponents,
        tendencies: ["E1.5", "E2.1", "E3.1", "E3.5", "E3.7", "E3.11"],
        socialEmotionalSkills: ["SDB2.1"],
        values: ["D3", "D7", "D14", "D15", "D16"],
        literacies: ["OB1", "OB5", "OB9"],
        interdisciplinaryRelations: ["Türk Dili ve Edebiyatı"],
        crossSkills: ["KB2.4", "KB2.7", "KB2.8", "KB2.10", "KB2.14", "KB2.18", "KB3.3"],
      },
      sourceUrl: "https://tymm.meb.gov.tr/felsefe-dersi/unite/85",
    },
    {
      code: "FEL.11.5",
      grade: 11,
      order: 5,
      title: "Hayatın Anlamı",
      slug: "hayatin-anlami",
      lessonHours: 12,
      purpose:
        "Öğrencilerin hayatın anlamına yönelik felsefi soru ve problemleri anlamlandırması ve felsefi düşünce ortaya koyması.",
      outcomes: [
        {
          code: "FEL.11.5.1",
          title: "Hayatın anlamına ilişkin felsefi soru ve problemleri anlayabilme",
          processComponents: [
            "Hayatın anlamına ilişkin felsefi soru ve problemleri açıklar.",
            "Hayatın anlamına ilişkin felsefi soru ve problemleri hayatıyla ilişkilendirerek değerlendirir.",
          ],
        },
        {
          code: "FEL.11.5.2",
          title: "Hayatın anlamına ilişkin felsefi düşünce ortaya koyabilme",
          processComponents: [
            "Hayatın anlamına ilişkin felsefi problemleri çözümler.",
            "Hayatın anlamına ilişkin felsefi görüş ve argüman oluşturur.",
            "Hayatın anlamına ilişkin felsefi metin yazar.",
          ],
        },
      ],
      contentFramework: ["Mutluluk ve Hayat İlişkisi", "Varoluş ve Kendi Olma"],
      keyConcepts: ["kaygı", "kendi olma", "mutluluk", "ölüm", "saçma", "umutsuzluk", "varoluş", "yabancılaşma"],
      components: {
        ...sharedOutcomeComponents,
        tendencies: ["E1.3", "E3.1", "E3.2", "E3.3", "E3.5", "E3.7", "E3.8", "E3.10", "E3.11"],
        socialEmotionalSkills: ["SDB1.3", "SDB2.1"],
        values: ["D3", "D10", "D11", "D12", "D16"],
        literacies: ["OB1", "OB4"],
        interdisciplinaryRelations: ["Türk Dili ve Edebiyatı", "Din Kültürü ve Ahlak Bilgisi", "Psikoloji"],
        crossSkills: ["KB2.7", "KB2.8", "KB2.10", "KB2.13", "KB2.14", "KB2.18", "KB3.1"],
      },
      sourceUrl: "https://tymm.meb.gov.tr/felsefe-dersi/unite/93",
    },
    {
      code: "FEL.11.6",
      grade: 11,
      order: 6,
      title: "Hukuk ve Felsefe",
      slug: "hukuk-ve-felsefe",
      lessonHours: 10,
      purpose:
        "Öğrencilerin hukukun doğasına yönelik felsefi soru ve problemleri hayatla ilişkilendirerek anlamlandırması ve hukuk sorunları üzerine felsefi düşünce ortaya koyması.",
      outcomes: [
        {
          code: "FEL.11.6.1",
          title: "Hukukun doğasına yönelik soru ve felsefi problemleri anlayabilme",
          processComponents: [
            "Hukukun doğasına yönelik felsefi soru ve problemleri açıklar.",
            "Hukukun doğasına yönelik felsefi soru ve problemleri toplumsal hayat ile ilişkilendirerek değerlendirir.",
          ],
        },
        {
          code: "FEL.11.6.2",
          title: "Hukuk sorunları üzerine felsefi düşünce ortaya koyabilme",
          processComponents: [
            "Hak ve özgürlüklerin hukuksal temellerini çözümler.",
            "Temel hukuk sorunlarına yönelik görüş ve argüman oluşturur.",
            "Hukuk sorunlarına ilişkin felsefi bir metin yazar.",
          ],
        },
      ],
      contentFramework: [
        "Hukukun Gereği ve Önemi",
        "Hukukun Kaynağı [Doğal (Tabii) Hukuk, Pozitif Hukuk]",
        "Ahlak-Hukuk İlişkisi",
      ],
      keyConcepts: ["ceza", "hakkaniyet", "hukuk", "suç", "yasa"],
      components: {
        ...sharedOutcomeComponents,
        tendencies: ["E2.5", "E3.1", "E3.5", "E3.6", "E3.7", "E3.11"],
        socialEmotionalSkills: ["SDB3.3"],
        values: ["D1", "D3", "D8", "D14", "D16"],
        literacies: ["OB1", "OB4", "OB6"],
        interdisciplinaryRelations: ["Tarih", "Sosyoloji", "İnsan Hakları ve Demokrasi"],
        crossSkills: ["KB2.7", "KB2.8", "KB2.10", "KB2.14", "KB2.18", "KB3.3"],
      },
      sourceUrl: "https://tymm.meb.gov.tr/felsefe-dersi/unite/103",
    },
  ],
} as const satisfies GradeCurriculum;
