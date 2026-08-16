export type PhaseDefinition = {
  label: string;
  duration: number;
  facilitator: string;
  learner: string;
  evidence: string;
};

export type PhaseCatalog = Readonly<Record<string, readonly PhaseDefinition[]>>;

const requiredTextFields = ["label", "facilitator", "learner", "evidence"] as const;

export function validatePhaseCatalog(
  catalog: PhaseCatalog,
  expectedPhaseCount = 9,
  expectedDuration = 80,
): void {
  for (const [outcomeCode, phases] of Object.entries(catalog)) {
    if (phases.length !== expectedPhaseCount) {
      throw new Error(`${outcomeCode} özel akışı ${expectedPhaseCount} aşama taşımalıdır.`);
    }

    phases.forEach((phase, index) => {
      for (const field of requiredTextFields) {
        if (typeof phase[field] !== "string" || phase[field].trim().length === 0) {
          throw new Error(`${outcomeCode} ${index + 1}. aşamasında ${field} alanı zorunludur.`);
        }
      }
      if (!Number.isFinite(phase.duration) || phase.duration <= 0) {
        throw new Error(`${outcomeCode} ${index + 1}. aşamasında duration pozitif olmalıdır.`);
      }
    });

    const totalDuration = phases.reduce((sum, phase) => sum + phase.duration, 0);
    if (totalDuration !== expectedDuration) {
      throw new Error(`${outcomeCode} özel akışı toplam ${expectedDuration} dakika olmalıdır.`);
    }
  }
}

function freezePhaseCatalog(catalog: Record<string, PhaseDefinition[]>): PhaseCatalog {
  for (const phases of Object.values(catalog)) {
    for (const phase of phases) Object.freeze(phase);
    Object.freeze(phases);
  }
  return Object.freeze(catalog);
}

const catalogSource: Record<string, PhaseDefinition[]> = {
  "FEL.10.1.1": [
    {
      label: "Hazırlık",
      duration: 5,
      facilitator: "Tahtaya ‘Felsefe bir cevap mı, yoksa arayış mı?’ sorusunu yazar.",
      learner: "Soruyu sessizce düşünür ve ilk çağrışımını tek kelimeyle not eder.",
      evidence: "Başlangıç çağrışımı",
    },
    {
      label: "Merak Uyandırma",
      duration: 5,
      facilitator: "Birbiriyle çelişen iki kısa felsefe tanımı sunar.",
      learner: "Hangi tanıma yakın olduğunu gerekçesiz olarak seçer.",
      evidence: "İlk konumlanma",
    },
    {
      label: "Sorgulama",
      duration: 12,
      facilitator: "‘Felsefenin ortak bir tanımı mümkün müdür?’ sorusunu açar.",
      learner: "Tanımların ortak ve ayrışan yönlerini ikili gruplarda belirler.",
      evidence: "Karşılaştırma notu",
    },
    {
      label: "Kavram İnşası",
      duration: 14,
      facilitator: "Bilgelik, sevgi, arayış, episteme ve doxa ilişkisini yapılandırır.",
      learner: "Kavramları ilişkilendiren küçük bir kavram ağı oluşturur.",
      evidence: "Kavram ağı",
    },
    {
      label: "Felsefi Tartışma",
      duration: 18,
      facilitator: "Akvaryum tartışmasını yönetir; iddia ve gerekçe ayrımını görünür kılar.",
      learner: "Bir tanımı savunur, karşı görüşe soru sorar ve yanıt verir.",
      evidence: "İddia–gerekçe kaydı",
    },
    {
      label: "Uygulama",
      duration: 10,
      facilitator: "Gündelik bir ikilemin felsefi olup olmadığını sorar.",
      learner: "İkilemi felsefi soru ölçütlerine göre dönüştürür.",
      evidence: "Özgün felsefi soru",
    },
    {
      label: "Biçimlendirici Değerlendirme",
      duration: 8,
      facilitator: "Üç kısa açık uçlu kontrol sorusu uygular.",
      learner: "Felsefe tanımını kavram ve gerekçeyle yeniden yazar.",
      evidence: "Çıkış öncesi yanıt",
    },
    {
      label: "Yansıtma",
      duration: 5,
      facilitator: "İlk konumlanmayı yeniden gösterir.",
      learner: "Görüşünün değişip değişmediğini ve nedenini açıklar.",
      evidence: "Öz-yansıtma",
    },
    {
      label: "Kapanış",
      duration: 3,
      facilitator: "Dersi tek cümlelik bir sentezle kapatır.",
      learner: "‘Felsefe benim için…’ cümlesini tamamlar.",
      evidence: "Kapanış cümlesi",
    },
  ],
  "FEL.10.1.2": [
    {
      label: "Hazırlık",
      duration: 5,
      facilitator: "Bilim, din, sanat ve felsefeden dört soru örneği sunar.",
      learner: "Soruları alanlarla eşleştirir.",
      evidence: "Ön sınıflandırma",
    },
    {
      label: "Merak Uyandırma",
      duration: 5,
      facilitator: "‘Her soru felsefi midir?’ karşı örneğini paylaşır.",
      learner: "İlk ölçüt önerisini yazar.",
      evidence: "İlk ölçüt",
    },
    {
      label: "Sorgulama",
      duration: 12,
      facilitator: "Felsefi sorunun özelliklerini açığa çıkaran soru zinciri kurar.",
      learner: "Sorgulanabilirlik, evrensellik ve gerekçelendirme ölçütlerini keşfeder.",
      evidence: "Ölçüt listesi",
    },
    {
      label: "Kavram İnşası",
      duration: 14,
      facilitator: "Eleştirel, refleksif, tutarlı, sistemli ve yığılımlı olmayı örnekler.",
      learner: "Özellikleri örnek ve karşı örneklerle eşler.",
      evidence: "Özellik–örnek matrisi",
    },
    {
      label: "Felsefi Tartışma",
      duration: 18,
      facilitator: "‘Felsefe bilimden daha temel midir?’ yapılandırılmış tartışmasını yönetir.",
      learner: "Bir konum savunur, karşı argümanı adil biçimde yeniden kurar.",
      evidence: "Argüman kartı",
    },
    {
      label: "Uygulama",
      duration: 10,
      facilitator: "Yakın çevreden güncel bir sorun seçtirir.",
      learner: "Sorunu bilimsel, sanatsal ve felsefi sorulara dönüştürür.",
      evidence: "Üç alanlı soru seti",
    },
    {
      label: "Biçimlendirici Değerlendirme",
      duration: 8,
      facilitator: "Felsefenin bireysel ve toplumsal işlevlerine yönelik mini vaka verir.",
      learner: "Vakadaki felsefi işlevi belirler ve gerekçelendirir.",
      evidence: "Vaka yanıtı",
    },
    {
      label: "Yansıtma",
      duration: 5,
      facilitator: "‘Bugün hangi düşünme alışkanlığını kullandın?’ diye sorar.",
      learner: "Kendi düşünme sürecinden kanıt verir.",
      evidence: "Öz değerlendirme",
    },
    {
      label: "Kapanış",
      duration: 3,
      facilitator: "Felsefenin işlevini sınıfın cümlelerinden sentezler.",
      learner: "Bir işlevi ve bir açık soruyu teslim eder.",
      evidence: "Çıkış bileti",
    },
  ],
};

validatePhaseCatalog(catalogSource);

export const specialPhaseCatalog = freezePhaseCatalog(catalogSource);
