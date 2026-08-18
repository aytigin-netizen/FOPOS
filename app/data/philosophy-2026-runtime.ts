import canonicalCurriculum from "./felsefe_curriculum_2026.json" with { type: "json" };
import { philosophyPhaseCatalog2026 } from "../modules/lesson-studio/phase-catalog-2026.ts";
import type { Grade, Unit } from "./curriculum.ts";

const canonicalUnits = [
  ...canonicalCurriculum.grades["10"].units,
  ...canonicalCurriculum.grades["11"].units,
];

function unique(values: string[]) {
  return [...new Set(values)];
}

export const philosophy2026RuntimeUnits: Unit[] = canonicalUnits.map((unit) => {
  const phases = unit.learning_outcomes.flatMap(
    (outcome) => philosophyPhaseCatalog2026[outcome.outcome_code] ?? [],
  );
  if (!phases.length) {
    throw new Error(`${unit.unit_code} için 2026 pedagojik akışları bulunamadı.`);
  }
  const firstOutcome = unit.learning_outcomes[0];
  const concepts = unit.keywords.slice(0, 4).join(", ");
  const cross = unit.competency_framework.cross_program_components;
  return {
    subjectCode: "philosophy",
    code: unit.unit_code,
    name: unit.unit_name,
    hours: unit.duration_hours,
    grade: unit.grade as Grade,
    purpose: unit.learning_outcomes.map((outcome) => outcome.description).join("; "),
    keywords: [...unit.keywords],
    outcomes: unit.learning_outcomes.map((outcome) => ({
      code: outcome.outcome_code,
      description: outcome.description,
      short: outcome.description,
      processComponents: outcome.process_components.map((component) => ({ ...component })),
    })),
    competencyFramework: {
      fieldSkills: [...unit.competency_framework.field_skills],
      conceptualSkills: [...unit.competency_framework.conceptual_skills],
      tendencies: [...unit.competency_framework.tendencies],
      socialEmotionalLearning: [...cross.social_emotional_learning],
      values: [...cross.values],
      literacy: [...cross.literacy],
      interdisciplinaryRelations: [...unit.competency_framework.interdisciplinary_relations],
      interSkillRelations: [...unit.competency_framework.inter_skill_relations],
    },
    contentFramework: [...unit.content_framework],
    learningEvidence: unique(phases.map((phase) => phase.evidence)).join(" • "),
    learningTeachingExperiences: {
      basicAssumptions: "Öğrencilerin hazırbulunuşluğu, kanonik kavramlar ve öğrenme çıktısının süreç bileşenleri üzerinden belirlenir.",
      preAssessment: `“${firstOutcome.description}” çıktısına ilişkin açık uçlu soru, kavram çağrışımı ve kısa gerekçelendirme kullanılır.`,
      bridging: `${concepts} kavramları öğrencilerin günlük yaşam deneyimleri ve güncel örneklerle ilişkilendirilir.`,
    },
    differentiation: {
      enrichment: "Felsefi metin, karşı görüş, özgün argüman ve araştırma göreviyle kapsam derinleştirilir.",
      support: "Kavram kartları, örnek–karşı örnek, görsel şema ve cümle başlatıcılarıyla aşamalı destek sağlanır.",
    },
    strategy: "Alan-Özgü Felsefi Sorgulama ve Muhakeme",
    methods: unique(phases.map((phase) => phase.label)),
    opening: `${unit.unit_name} alanındaki temel problem gündelik bir örnek üzerinden nasıl görünür hâle gelir?`,
    inquiry: `${firstOutcome.description} için hangi kavramlar, sorular ve gerekçeler gereklidir?`,
    discussion: `${unit.unit_name} alanındaki farklı görüşler hangi gerekçelerle savunulabilir?`,
    application: `Öğrenci ${concepts} kavramlarından yararlanarak yeni bir duruma ilişkin gerekçeli felsefi görüş geliştirir.`,
    evidence: unique(phases.map((phase) => phase.evidence)).at(-1) ?? "Gerekçeli felsefi ürün",
  };
});
