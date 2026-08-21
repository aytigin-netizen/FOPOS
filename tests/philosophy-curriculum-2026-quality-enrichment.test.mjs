import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { philosophyPhaseCatalog2026 } from "../app/modules/lesson-studio/phase-catalog-2026.ts";
import { philosophyQualityEnrichment2026 } from "../app/modules/lesson-studio/quality-enrichment-2026.ts";
import { specialPhaseCatalog } from "../app/modules/lesson-studio/phase-catalog.ts";

const curriculum = JSON.parse(
  readFileSync(new URL("../app/data/felsefe_curriculum_2026.json", import.meta.url), "utf8"),
);
const transition = JSON.parse(
  readFileSync(new URL("../app/data/felsefe_curriculum_2026_transition.json", import.meta.url), "utf8"),
);

const enrichment = philosophyQualityEnrichment2026["FEL.10.1.1"];
const phases = philosophyPhaseCatalog2026["FEL.10.1.1"];
const allOutcomeCodes = Object.values(curriculum.grades).flatMap((grade) =>
  grade.units.flatMap((unit) => unit.learning_outcomes.map((outcome) => outcome.outcome_code)),
);

test("kalite zenginleştirmesi kanonik veriden ayrı ve yalnız FEL.10.1.1 kapsamındadır", () => {
  assert.deepEqual(Object.keys(philosophyQualityEnrichment2026), ["FEL.10.1.1"]);
  assert.equal(enrichment.outcomeCode, "FEL.10.1.1");
  assert.equal(enrichment.version, "1.0");
  assert.equal(enrichment.sourceType, "pedagogical-enrichment");
  assert.equal(curriculum.grades["10"].units[0].learning_outcomes[0].outcome_code, "FEL.10.1.1");
  assert.equal(curriculum.grades["10"].units[0].learning_outcomes.length, 1);
});

test("FEL.10.1.1 dokuz aşama ve 80 dakika paritesini korur", () => {
  assert.equal(phases.length, 9);
  assert.deepEqual(phases.map((phase) => phase.duration), [5, 6, 12, 14, 17, 10, 8, 5, 3]);
  assert.equal(phases.reduce((sum, phase) => sum + phase.duration, 0), 80);
});

test("tarihsel kaynak kartları doğrulanabilir ve pedagojik zenginleştirme olarak etiketlidir", () => {
  assert.equal(enrichment.sourceCards.length, 2);
  assert.deepEqual(enrichment.sourceCards.map((card) => card.thinker), ["Thales", "Aristoteles"]);
  for (const card of enrichment.sourceCards) {
    assert.equal(card.sourceType, "pedagogical-enrichment");
    assert.ok(card.context.length > 20);
    assert.ok(card.inquiryQuestion.endsWith("?"));
    assert.ok(card.sourceNote.length > 20);
  }
});

test("felsefi soru kontrolü dört ölçüt ve zorunlu temellendirme taşır", () => {
  assert.deepEqual(
    enrichment.philosophicalQuestionCriteria.map((criterion) => criterion.label),
    ["Kavramsallık", "Temellendirme", "Açıklık", "Tartışılabilirlik"],
  );
  assert.equal(
    enrichment.philosophicalQuestionCriteria.find((criterion) => criterion.id === "justification").required,
    true,
  );
  const inquiry = phases.find((phase) => phase.label === "Sorgulama");
  assert.match(inquiry.facilitator, /Kavramsallık.*Temellendirme.*Açıklık.*Tartışılabilirlik/u);
});

test("alan karşılaştırması beş boyut ve karşı örnek kuralı taşır", () => {
  assert.deepEqual(enrichment.fieldComparison.fields, ["Felsefe", "Bilim", "Din", "Sanat"]);
  assert.equal(enrichment.fieldComparison.dimensions.length, 5);
  assert.ok(enrichment.fieldComparison.rules.some((rule) => rule.includes("karşı örnek")));
  const discussion = phases.find((phase) => phase.label === "Felsefi Tartışma");
  assert.match(discussion.facilitator, /karşı örnek/u);
});

test("biçimlendirici kontrol beş süreç görevi ve üç ölçütlü mini rubrik taşır", () => {
  assert.deepEqual(enrichment.formativeAssessment.tasks.map((task) => task.processStep), ["a", "b", "c", "ç", "d"]);
  assert.deepEqual(
    enrichment.formativeAssessment.rubric.map((criterion) => criterion.label),
    ["Kavramsal doğruluk", "Gerekçelendirme", "Çıktı bağlantısı"],
  );
  assert.ok(enrichment.formativeAssessment.feedbackPattern.includes("Güçlü kanıtın"));
});

test("farklılaştırma tanı veya kimlik kaydetmeden aynı kanıt standardını korur", () => {
  assert.deepEqual(
    enrichment.differentiationByPhase.map((item) => item.phase),
    ["Sorgulama", "Kavram İnşası", "Felsefi Tartışma", "Biçimlendirici Değerlendirme"],
  );
  const serialized = JSON.stringify(enrichment).toLocaleLowerCase("tr-TR");
  for (const forbidden of ["öğrenci adı", "öğrenci kimliği", "sağlık bilgisi", "tanı kodu"]) {
    assert.equal(serialized.includes(forbidden), false);
  }
  assert.ok(enrichment.differentiationByPhase.every((item) => item.unchangedEvidenceStandard.length > 0));
});

test("TYMM eşleştirmeleri aşama, öğrenci eylemi ve kanıt taşır", () => {
  assert.ok(enrichment.tymmEvidenceMappings.length >= 10);
  for (const mapping of enrichment.tymmEvidenceMappings) {
    assert.ok(mapping.component.length > 0);
    assert.ok(mapping.phase.length > 0);
    assert.ok(mapping.learnerAction.length > 0);
    assert.ok(mapping.evidence.length > 0);
  }
  assert.equal(enrichment.tymmEvidenceMappings.some((mapping) => mapping.component.startsWith("OB2.")), false);
});

test("diğer 21 çıktı ve 2024 arşiv kataloğu kapsam dışında kalır", () => {
  assert.equal(allOutcomeCodes.length, 22);
  assert.equal(
    allOutcomeCodes.filter((code) => code !== "FEL.10.1.1").every((code) => philosophyPhaseCatalog2026[code].length === 9),
    true,
  );
  assert.deepEqual(Object.keys(specialPhaseCatalog), ["FEL.10.1.1", "FEL.10.1.2"]);
  assert.equal(transition.compatibilityPolicy.preserveDataset, "2024.1");
  assert.equal(transition.status, "runtime-enabled-deployment-complete");
});

test("kalite zenginleştirmesi ve iç içe girdileri dondurulmuştur", () => {
  assert.equal(Object.isFrozen(philosophyQualityEnrichment2026), true);
  assert.equal(Object.isFrozen(enrichment), true);
  assert.equal(Object.isFrozen(enrichment.sourceCards), true);
  assert.equal(Object.isFrozen(enrichment.sourceCards[0]), true);
  assert.throws(() => {
    enrichment.sourceCards[0].title = "Bozuk";
  }, TypeError);
});
