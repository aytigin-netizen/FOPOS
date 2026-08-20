import { loadPackage } from "../../src/core/curriculum/package-loader.ts";
import type { CurriculumPackage } from "../../src/core/curriculum/package-types.ts";
import { units as philosophyUnits, type Grade, type Unit } from "./curriculum.ts";
import { philosophy2026RuntimeUnits } from "./philosophy-2026-runtime.ts";

export type CurriculumContext = {
  subjectCode: string;
  subjectName: string;
  datasetVersion: string;
  sourceTitle: string;
  sourceYear: number;
  defaultGrade: Grade;
  supportedGrades: Grade[];
  units: Unit[];
};

const sociologyPedagogy = {
  strategy: "Kanıt ve Vaka Temelli Sosyolojik Sorgulama",
  methods: [
    "Sosyolojik imgelem",
    "Vaka incelemesi",
    "Veri yorumlama",
    "Yapılandırılmış tartışma",
  ],
};

function packageUnitsToRuntime(curriculumPackage: CurriculumPackage): Unit[] {
  return curriculumPackage.units.map((unit) => {
    const concepts = unit.name
      .toLocaleLowerCase("tr-TR")
      .split(/\s+/u)
      .filter((item) => item.length > 3)
      .slice(0, 4);
    return {
      subjectCode: curriculumPackage.manifest.discipline.code,
      code: unit.code,
      name: unit.name,
      hours: unit.durationHours,
      grade: unit.grade as Grade,
      keywords: concepts.length ? concepts : ["toplum", "sosyoloji"],
      purpose: unit.outcomes.map((outcome) => outcome.description).join("; "),
      outcomes: unit.outcomes.map((outcome) => ({
        ...outcome,
        short: outcome.description,
        processComponents: [],
      })),
      competencyFramework: {
        fieldSkills: ["Eleştirel Sosyolojik Düşünme"],
        conceptualSkills: [],
        tendencies: [],
        socialEmotionalLearning: [],
        values: [],
        literacy: [],
        interdisciplinaryRelations: [],
        interSkillRelations: [],
      },
      contentFramework: [unit.name],
      learningEvidence:
        "Öğrenme kanıtı türü, resmî program ve öğretmen kararı birlikte gözetilerek belirlenir.",
      learningTeachingExperiences: {
        basicAssumptions:
          "Öğrencilerin hazırbulunuşluğu ders öncesinde öğretmen tarafından belirlenir.",
        preAssessment:
          "Ünite kavramlarına ilişkin açık uçlu sorular ve kısa gözlem görevleri kullanılabilir.",
        bridging:
          "Öğrencilerin güncel toplumsal gözlemleri ünite bağlamıyla ilişkilendirilir.",
      },
      differentiation: {
        enrichment:
          "Yerel toplumsal örnekler, veri setleri ve araştırma görevleriyle kapsam derinleştirilebilir.",
        support:
          "Kavram kartları, örnek olaylar ve yapılandırılmış soru dizileri kullanılabilir.",
      },
      ...sociologyPedagogy,
      opening: `${unit.name} günlük yaşamımızda nerelerde görünür hâle gelir?`,
      inquiry: `${unit.name} toplumsal ilişkileri açıklamak için nasıl incelenebilir?`,
      discussion: `${unit.name} birey ve toplum arasındaki ilişkiyi nasıl etkiler?`,
      application:
        "Yakın çevresinden bir toplumsal örneği kavram ve kanıt kullanarak sosyolojik açıdan yorumlar.",
      evidence: "Gerekçeli sosyolojik çözümleme",
    };
  });
}

type RuntimeUnitAdapter = (curriculumPackage: CurriculumPackage) => Unit[];

function philosophyUnitsFromPackage(curriculumPackage: CurriculumPackage): Unit[] {
  const runtimeUnits = curriculumPackage.manifest.datasetVersion === "2026.1"
    ? philosophy2026RuntimeUnits
    : philosophyUnits;
  const richUnitsByCode = new Map(runtimeUnits.map((unit) => [unit.code, unit]));
  return curriculumPackage.units.map((packageUnit) => {
    const richUnit = richUnitsByCode.get(packageUnit.code);
    if (!richUnit) {
      throw new Error(`${packageUnit.code} için pedagojik felsefe zenginleştirmesi bulunamadı.`);
    }
    const packageOutcomeCodes = packageUnit.outcomes.map((outcome) => outcome.code);
    const richOutcomeCodes = richUnit.outcomes.map((outcome) => outcome.code);
    if (
      richUnit.grade !== packageUnit.grade ||
      richUnit.hours !== packageUnit.durationHours ||
      richUnit.name !== packageUnit.name ||
      packageOutcomeCodes.length !== richOutcomeCodes.length ||
      packageOutcomeCodes.some((code, index) => code !== richOutcomeCodes[index])
    ) {
      throw new Error(`${packageUnit.code} için kanonik paket ve pedagojik zenginleştirme eşleşmiyor.`);
    }
    return structuredClone(richUnit);
  });
}

const runtimeUnitAdapters: Readonly<Record<string, RuntimeUnitAdapter>> = Object.freeze({
  philosophy: philosophyUnitsFromPackage,
  sociology: packageUnitsToRuntime,
});

function resolveRuntimeUnits(curriculumPackage: CurriculumPackage): Unit[] {
  const disciplineCode = curriculumPackage.manifest.discipline.code;
  const adapter = runtimeUnitAdapters[disciplineCode];
  if (!adapter) {
    throw new Error(`${disciplineCode} branşı için runtime müfredat adaptörü bulunamadı.`);
  }
  return adapter(curriculumPackage);
}

export function getCurriculumContext(subjectCode: string): CurriculumContext {
  const curriculumPackage = loadPackage(subjectCode);
  const packageUnits = resolveRuntimeUnits(curriculumPackage);
  const supportedGrades = [
    ...new Set(packageUnits.map((unit) => unit.grade)),
  ].sort((left, right) => left - right) as Grade[];
  return {
    subjectCode: curriculumPackage.manifest.discipline.code,
    subjectName: curriculumPackage.manifest.discipline.name,
    datasetVersion: curriculumPackage.manifest.datasetVersion,
    sourceTitle: curriculumPackage.manifest.source.title,
    sourceYear: curriculumPackage.manifest.source.year,
    defaultGrade: curriculumPackage.manifest.defaultGrade as Grade,
    supportedGrades,
    units: packageUnits,
  };
}
