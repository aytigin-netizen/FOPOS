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
const enrichment1021 = philosophyQualityEnrichment2026["FEL.10.2.1"];
const enrichment1022 = philosophyQualityEnrichment2026["FEL.10.2.2"];
const enrichment1031 = philosophyQualityEnrichment2026["FEL.10.3.1"];
const enrichment1041 = philosophyQualityEnrichment2026["FEL.10.4.1"];
const phases = philosophyPhaseCatalog2026["FEL.10.1.1"];
const phases1021 = philosophyPhaseCatalog2026["FEL.10.2.1"];
const phases1022 = philosophyPhaseCatalog2026["FEL.10.2.2"];
const phases1031 = philosophyPhaseCatalog2026["FEL.10.3.1"];
const phases1041 = philosophyPhaseCatalog2026["FEL.10.4.1"];
const allOutcomeCodes = Object.values(curriculum.grades).flatMap((grade) =>
  grade.units.flatMap((unit) => unit.learning_outcomes.map((outcome) => outcome.outcome_code)),
);

test("kalite zenginleştirmesi kanonik veriden ayrı ve onaylı beş çıktı kapsamındadır", () => {
  assert.deepEqual(Object.keys(philosophyQualityEnrichment2026), ["FEL.10.1.1", "FEL.10.2.1", "FEL.10.2.2", "FEL.10.3.1", "FEL.10.4.1"]);
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

test("2024 arşiv kataloğu kapsam dışında kalır", () => {
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


test("FEL.10.2.1 süreç a/b, ilişki kuralları ve üç ölçütlü rubrik taşır", () => {
  assert.equal(enrichment1021.outcomeCode, "FEL.10.2.1");
  assert.equal(enrichment1021.sourceType, "pedagogical-enrichment");
  assert.equal(enrichment1021.exampleCards.length, 2);
  assert.deepEqual(enrichment1021.formativeAssessment.tasks.map((task) => task.processStep), ["a", "b"]);
  assert.deepEqual(
    enrichment1021.formativeAssessment.rubric.map((criterion) => criterion.label),
    ["İlişki doğruluğu", "Nedensel gerekçelendirme", "Model bütünlüğü"],
  );
  assert.ok(enrichment1021.causalRelationRules.some((rule) => rule.includes("doğrudan nedensellik")));
  assert.ok(enrichment1021.coherentModelCriteria.length >= 3);
});

test("FEL.10.2.2 süreç a/b/c ve dört ölçütlü argüman rubriği taşır", () => {
  assert.equal(enrichment1022.outcomeCode, "FEL.10.2.2");
  assert.equal(enrichment1022.argumentCards.length, 2);
  assert.deepEqual(enrichment1022.formativeAssessment.tasks.map((task) => task.processStep), ["a", "b", "c"]);
  assert.deepEqual(
    enrichment1022.formativeAssessment.rubric.map((criterion) => criterion.label),
    ["Kavram doğruluğu", "Öncül–sonuç ayrımı", "Çıkarım bağı", "Nesnel yeniden ifade"],
  );
});

test("mantıksal güvenlik geçerlilik, sağlamlık, tutarlılık, güçlülük ve ikna ediciliği ayırır", () => {
  assert.deepEqual(
    enrichment1022.conceptSafety.map((item) => item.concept),
    ["Tutarlılık", "Geçerlilik", "Sağlamlık", "Güçlülük", "İkna edicilik"],
  );
  const safety = JSON.stringify(enrichment1022.conceptSafety);
  assert.match(safety, /zorunlu/u);
  assert.match(safety, /öncülleri de doğru/u);
  assert.match(safety, /eş anlamlısı değildir/u);
  assert.match(enrichment1022.fallacyCounterexample.rule, /yalnızca yanlış bir öncül.*eşitlenmez/u);
});

test("Ünite 2 akışları ayrı kapsam, dokuz aşama ve 80 dakika paritesi taşır", () => {
  for (const phasesOfOutcome of [phases1021, phases1022]) {
    assert.equal(phasesOfOutcome.length, 9);
    assert.deepEqual(phasesOfOutcome.map((phase) => phase.duration), [5, 6, 12, 14, 17, 10, 8, 5, 3]);
    assert.equal(phasesOfOutcome.reduce((sum, phase) => sum + phase.duration, 0), 80);
  }
  assert.notEqual(JSON.stringify(phases1021), JSON.stringify(phases1022));
  assert.equal(JSON.stringify(phases1021).includes("öncül–sonuç"), false);
  assert.equal(JSON.stringify(phases1022).includes("Nesnel yeniden ifade"), true);
});

test("Ünite 2 farklılaştırma aynı kanıt standardını ve kişisel veri yasağını korur", () => {
  for (const item of [enrichment1021, enrichment1022]) {
    assert.equal(item.differentiationByPhase.length, 4);
    assert.ok(item.differentiationByPhase.every((entry) => entry.unchangedEvidenceStandard.length > 0));
    const serialized = JSON.stringify(item).toLocaleLowerCase("tr-TR");
    for (const forbidden of ["öğrenci adı", "öğrenci kimliği", "sağlık bilgisi", "tanı kodu"]) {
      assert.equal(serialized.includes(forbidden), false);
    }
  }
});

test("Ünite 2 TYMM kayıtları aşama, öğrenci eylemi ve kanıt taşır", () => {
  for (const item of [enrichment1021, enrichment1022]) {
    assert.ok(item.tymmEvidenceMappings.length >= 8);
    for (const mapping of item.tymmEvidenceMappings) {
      assert.ok(mapping.component.length > 0);
      assert.ok(mapping.phase.length > 0);
      assert.ok(mapping.learnerAction.length > 0);
      assert.ok(mapping.evidence.length > 0);
    }
  }
});

test("beş kalite zenginleştirme kaydı ve iç içe girdileri dondurulmuştur", () => {
  for (const item of [enrichment, enrichment1021, enrichment1022, enrichment1031, enrichment1041]) {
    assert.equal(Object.isFrozen(item), true);
    assert.equal(Object.isFrozen(item.formativeAssessment), true);
    assert.equal(Object.isFrozen(item.formativeAssessment.rubric), true);
  }
  assert.equal(Object.isFrozen(enrichment1021.exampleCards[0]), true);
  assert.equal(Object.isFrozen(enrichment1022.argumentCards[0]), true);
  assert.equal(Object.isFrozen(enrichment1031.sourceCards[0]), true);
  assert.equal(Object.isFrozen(enrichment1041.sourceCards[0]), true);
});

test("FEL.10.4.1 epistemolojik kaynak ve kavram güvenliği taşır", () => {
  assert.equal(enrichment1041.outcomeCode, "FEL.10.4.1");
  assert.deepEqual(enrichment1041.sourceCards.map((card) => card.thinker), [
    "Platon",
    "Pyrrhoncu gelenek ve Sextus Empiricus",
    "René Descartes",
    "Descartes, Locke, Kant ve Bergson bağlamları",
  ]);
  assert.deepEqual(enrichment1041.conceptSafety.map((item) => item.concept), [
    "Bilgi–inanç",
    "Doğruluk–gerçeklik",
    "Gerekçelendirme–kanıt",
    "Özne–nesne",
    "Bilgi–sanı",
    "Kuşku–inkâr",
  ]);
  assert.match(enrichment1041.conceptSafety[1].rule, /eş anlamlılaştırılmaz/u);
  assert.match(enrichment1041.sourceCards[1].pedagogicalFunction, /hiçbir şey bilinemez/u);
});

test("FEL.10.4.1 üç problem, dört süreç bileşeni ve metin rubriği taşır", () => {
  assert.equal(enrichment1041.problemMap.dimensions.length, 6);
  for (const problem of ["imkânı", "kaynağı", "doğruluk ölçütleri"]) {
    assert.match(enrichment1041.problemMap.rules.join(" "), new RegExp(problem, "u"));
  }
  assert.deepEqual(enrichment1041.formativeAssessment.tasks.map((task) => task.processStep), ["a", "b", "c", "ç"]);
  assert.deepEqual(enrichment1041.formativeAssessment.rubric.map((criterion) => criterion.label), [
    "Epistemolojik kavram doğruluğu",
    "Problem ayrımı",
    "Görüş ve argüman değerlendirme",
    "Metin kanıtı",
  ]);
  assert.equal(enrichment1041.textAnalysisChecklist.length, 6);
});

test("FEL.10.4.1 dokuz aşama, 80 dakika ve görünür kalite ayrıntıları taşır", () => {
  assert.equal(phases1041.length, 9);
  assert.deepEqual(phases1041.map((phase) => phase.duration), [5, 6, 12, 14, 17, 10, 8, 5, 3]);
  assert.equal(phases1041.reduce((sum, phase) => sum + phase.duration, 0), 80);
  const serialized = JSON.stringify(phases1041);
  for (const required of ["Platon", "Pyrrhon", "Doğruluk–gerçeklik", "Problem ayrımı", "Metin kanıtı"]) {
    assert.match(serialized, new RegExp(required, "u"));
  }
});

test("FEL.10.4.1 farklılaştırma ve TYMM kanıtları kişisel veri tutmadan görünürdür", () => {
  assert.equal(enrichment1041.differentiationByPhase.length, 5);
  assert.ok(enrichment1041.differentiationByPhase.every((entry) => entry.unchangedEvidenceStandard.length > 0));
  assert.ok(enrichment1041.tymmEvidenceMappings.length >= 14);
  const serialized = JSON.stringify(enrichment1041).toLocaleLowerCase("tr-TR");
  for (const forbidden of ["öğrenci adı", "öğrenci kimliği", "sağlık bilgisi", "tanı kodu"]) {
    assert.equal(serialized.includes(forbidden), false);
  }
});

test("FEL.10.3.1 ontolojik kaynak ve kavram güvenliği taşır", () => {
  assert.equal(enrichment1031.outcomeCode, "FEL.10.3.1");
  assert.deepEqual(enrichment1031.sourceCards.map((card) => card.thinker), [
    "Parmenides",
    "Gorgias",
    "Aristoteles ve Herakleitos bağlamları",
  ]);
  assert.deepEqual(enrichment1031.conceptSafety.map((item) => item.concept), [
    "Ontoloji–metafizik",
    "Varlık–varoluş",
    "Öz–töz",
    "Madde–idea",
    "Oluş",
    "Fenomen",
  ]);
  assert.match(enrichment1031.conceptSafety[0].rule, /eş anlamlı sayılmaz/u);
  assert.match(enrichment1031.sourceCards[1].sourceNote, /ciddi tez.*Eleatik savların eleştirisi/u);
});

test("FEL.10.3.1 dört süreç bileşeni, metin incelemesi ve alan rubriği taşır", () => {
  assert.deepEqual(enrichment1031.formativeAssessment.tasks.map((task) => task.processStep), ["a", "b", "c", "ç"]);
  assert.deepEqual(enrichment1031.formativeAssessment.rubric.map((criterion) => criterion.label), [
    "Ontolojik kavram doğruluğu",
    "Problem ayrımı",
    "Argüman değerlendirme",
    "Metin kanıtı",
  ]);
  assert.equal(enrichment1031.textAnalysisChecklist.length, 6);
  assert.equal(enrichment1031.viewComparison.dimensions.length, 6);
  assert.ok(enrichment1031.viewComparison.rules.some((rule) => rule.includes("Parmenides ve Gorgias")));
});

test("FEL.10.3.1 dokuz aşama, 80 dakika ve görünür kalite ayrıntıları taşır", () => {
  assert.equal(phases1031.length, 9);
  assert.deepEqual(phases1031.map((phase) => phase.duration), [5, 6, 12, 14, 17, 10, 8, 5, 3]);
  assert.equal(phases1031.reduce((sum, phase) => sum + phase.duration, 0), 80);
  const serialized = JSON.stringify(phases1031);
  for (const required of ["Parmenides", "Gorgias", "Ontoloji–metafizik", "Problem ayrımı", "Metin kanıtı"]) {
    assert.match(serialized, new RegExp(required, "u"));
  }
});

test("FEL.10.3.1 farklılaştırma ve TYMM kanıtları kişisel veri tutmadan görünürdür", () => {
  assert.equal(enrichment1031.differentiationByPhase.length, 5);
  assert.ok(enrichment1031.differentiationByPhase.every((entry) => entry.unchangedEvidenceStandard.length > 0));
  assert.ok(enrichment1031.tymmEvidenceMappings.length >= 12);
  const serialized = JSON.stringify(enrichment1031).toLocaleLowerCase("tr-TR");
  for (const forbidden of ["öğrenci adı", "öğrenci kimliği", "sağlık bilgisi", "tanı kodu"]) {
    assert.equal(serialized.includes(forbidden), false);
  }
});
