import { resolveCurriculumPackage } from "../../src/core/curriculum/curriculum-resolver.ts";
import type { CurriculumPackage, SchoolType } from "../../src/core/curriculum/package-types.ts";
import { type Grade, type Unit } from "./curriculum.ts";
import { CurriculumFeatureUnavailableError } from "../core/curriculum-feature-unavailable.ts";
import { philosophy2026RuntimeUnits } from "./philosophy-2026-runtime.ts";

export type CurriculumContext = {
  subjectCode: string;
  subjectName: string;
  datasetVersion: string;
  sourceTitle: string;
  sourceYear: number;
  defaultGrade: Grade;
  supportedGrades: Grade[];
  unitCount: number;
  learningOutcomeCount: number;
  schoolType: SchoolType | null;
  applicabilityNote: string | null;
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
    const concepts =
      unit.keywords && unit.keywords.length
        ? [...unit.keywords]
        : unit.name
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
        processComponents: outcome.processComponents?.map((component) => ({
          ...component,
        })) ?? [],
      })),
      competencyFramework: unit.competencyFramework
        ? {
            fieldSkills: [...unit.competencyFramework.fieldSkills],
            conceptualSkills: [...unit.competencyFramework.conceptualSkills],
            tendencies: [...unit.competencyFramework.tendencies],
            socialEmotionalLearning: [
              ...unit.competencyFramework.socialEmotionalLearning,
            ],
            values: [...unit.competencyFramework.values],
            literacy: [...unit.competencyFramework.literacy],
            interdisciplinaryRelations: [
              ...unit.competencyFramework.interdisciplinaryRelations,
            ],
            interSkillRelations: [...unit.competencyFramework.interSkillRelations],
          }
        : {
            fieldSkills: ["Eleştirel Sosyolojik Düşünme"],
            conceptualSkills: [],
            tendencies: [],
            socialEmotionalLearning: [],
            values: [],
            literacy: [],
            interdisciplinaryRelations: [],
            interSkillRelations: [],
          },
      contentFramework: [...(unit.contentFramework ?? [unit.name])],
      canonicalLearningEvidence: unit.canonicalLearningEvidence ?? null,
      pedagogicalEvidence:
        unit.canonicalLearningEvidence
        ?? "Öğrenme kanıtı türü, resmî program ve öğretmen kararı birlikte gözetilerek belirlenir.",
      learningTeachingExperiences: unit.learningTeachingExperiences ?? {
        basicAssumptions:
          "Öğrencilerin hazırbulunuşluğu ders öncesinde öğretmen tarafından belirlenir.",
        preAssessment:
          "Ünite kavramlarına ilişkin açık uçlu sorular ve kısa gözlem görevleri kullanılabilir.",
        bridging:
          "Öğrencilerin güncel toplumsal gözlemleri ünite bağlamıyla ilişkilendirilir.",
      },
      differentiation: unit.differentiation ?? {
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
  if (curriculumPackage.manifest.datasetVersion !== "2026.1") {
    throw new CurriculumFeatureUnavailableError(
      "Felsefe ders tasarımı çalışma zamanı",
      "philosophy",
      curriculumPackage.manifest.datasetVersion,
    );
  }
  const runtimeUnits = philosophy2026RuntimeUnits;
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
    return {
      ...structuredClone(richUnit),
      code: packageUnit.code,
      name: packageUnit.name,
      hours: packageUnit.durationHours,
      grade: packageUnit.grade as Grade,
      keywords: [...(packageUnit.keywords ?? richUnit.keywords)],
      outcomes: packageUnit.outcomes.map((outcome) => ({
        code: outcome.code,
        description: outcome.description,
        short: richUnit.outcomes.find((candidate) => candidate.code === outcome.code)?.short
          ?? outcome.description,
        processComponents: outcome.processComponents?.map((component) => ({ ...component })) ?? [],
      })),
      competencyFramework: packageUnit.competencyFramework
        ? structuredClone(packageUnit.competencyFramework)
        : structuredClone(richUnit.competencyFramework),
      contentFramework: [...(packageUnit.contentFramework ?? richUnit.contentFramework)],
      canonicalLearningEvidence: packageUnit.canonicalLearningEvidence ?? null,
      learningTeachingExperiences: packageUnit.learningTeachingExperiences
        ? structuredClone(packageUnit.learningTeachingExperiences)
        : structuredClone(richUnit.learningTeachingExperiences),
      differentiation: packageUnit.differentiation
        ? structuredClone(packageUnit.differentiation)
        : structuredClone(richUnit.differentiation),
    };
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
    throw new CurriculumFeatureUnavailableError(
      "Ders tasarımı çalışma zamanı",
      disciplineCode,
      curriculumPackage.manifest.datasetVersion,
    );
  }
  return adapter(curriculumPackage);
}

export function getCurriculumContext(
  subjectCode: string,
  schoolType?: SchoolType,
): CurriculumContext {
  const { curriculumPackage } = resolveCurriculumPackage({
    disciplineCode: subjectCode,
    datasetVersion: "2026.1",
  });
  const allPackageUnits = resolveRuntimeUnits(curriculumPackage);
  const applicabilityRules = curriculumPackage.manifest.applicability?.rules ?? [];
  const allowedGrades = schoolType && applicabilityRules.length
    ? new Set(
        applicabilityRules
          .filter((rule) => rule.schoolTypes.includes(schoolType))
          .map((rule) => rule.grade),
      )
    : null;
  const packageUnits = allowedGrades
    ? allPackageUnits.filter((unit) => allowedGrades.has(unit.grade))
    : allPackageUnits;
  if (!packageUnits.length) {
    throw new CurriculumFeatureUnavailableError(
      "Müfredat okul türü uygulanabilirliği",
      curriculumPackage.manifest.discipline.code,
      curriculumPackage.manifest.datasetVersion,
    );
  }
  const supportedGrades = [
    ...new Set(packageUnits.map((unit) => unit.grade)),
  ].sort((left, right) => left - right) as Grade[];
  const defaultGrade = supportedGrades.includes(curriculumPackage.manifest.defaultGrade as Grade)
    ? curriculumPackage.manifest.defaultGrade as Grade
    : supportedGrades[0];
  const restrictedRules = schoolType
    ? applicabilityRules.filter((rule) => !rule.schoolTypes.includes(schoolType))
    : [];
  return {
    subjectCode: curriculumPackage.manifest.discipline.code,
    subjectName: curriculumPackage.manifest.discipline.name,
    datasetVersion: curriculumPackage.manifest.datasetVersion,
    sourceTitle: curriculumPackage.manifest.source.title,
    sourceYear: curriculumPackage.manifest.source.year,
    defaultGrade,
    supportedGrades,
    unitCount: packageUnits.length,
    learningOutcomeCount: packageUnits.flatMap((unit) => unit.outcomes).length,
    schoolType: schoolType ?? null,
    applicabilityNote: restrictedRules.map((rule) => rule.note).filter(Boolean).join(" ") || null,
    units: packageUnits,
  };
}
