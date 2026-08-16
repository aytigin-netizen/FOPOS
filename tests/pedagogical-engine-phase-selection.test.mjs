import assert from "node:assert/strict";
import test from "node:test";

import { makeResult } from "../app/modules/lesson-studio/lesson-engine.tsx";

function createUnit(outcomeCode) {
  return {
    subjectCode: "philosophy",
    code: outcomeCode.startsWith("FEL.10.1.") ? "F10_U1" : "F10_U2",
    name: outcomeCode.startsWith("FEL.10.1.") ? "Felsefenin Doğası" : "Felsefe, Mantık ve Argümantasyon",
    hours: 10,
    grade: 10,
    keywords: ["felsefe", "bilgelik", "sorgulama", "düşünme"],
    purpose: "Felsefi sorgulama ve muhakeme geliştirmek.",
    outcomes: [{
      code: outcomeCode,
      description: "Test öğrenme çıktısı",
      short: "Test çıktısı",
      processComponents: [],
    }],
    competencyFramework: {
      fieldSkills: [],
      conceptualSkills: [],
      tendencies: [],
      socialEmotionalLearning: [],
      values: [],
      literacy: [],
      interdisciplinaryRelations: [],
      interSkillRelations: [],
    },
    contentFramework: [],
    learningEvidence: "Öğrenme kanıtı",
    learningTeachingExperiences: {
      basicAssumptions: "Temel varsayım",
      preAssessment: "Ön değerlendirme",
      bridging: "Köprü kurma",
    },
    differentiation: { enrichment: "Zenginleştirme", support: "Destek" },
    strategy: "Sorgulamaya Dayalı Öğrenme",
    methods: ["Sokratik sorgulama"],
    opening: "Açılış",
    inquiry: "Felsefi sorgulama nasıl kurulur?",
    discussion: "Felsefi düşünceyi ayıran nedir?",
    application: "Bir felsefi soru oluşturur.",
    evidence: "Felsefi soru",
  };
}

function assertPhaseContract(result) {
  assert.equal(result.phases.length, 9);
  assert.equal(
    result.phases.reduce((sum, phase) => sum + phase.duration, 0),
    80,
  );
  assert.deepEqual(
    result.phases.map((phase) => phase.id),
    ["P01", "P02", "P03", "P04", "P05", "P06", "P07", "P08", "P09"],
  );
}

test("FEL.10.1.1 tanımlı alan-özgü dokuz aşamalı akışı kullanır", () => {
  const result = makeResult(
    createUnit("FEL.10.1.1"),
    "FEL.10.1.1",
    "balanced",
    1,
    "2024.1",
  );
  assertPhaseContract(result);
  assert.equal(
    result.phases[0].facilitator,
    "Tahtaya ‘Felsefe bir cevap mı, yoksa arayış mı?’ sorusunu yazar.",
  );
  assert.equal(result.phases[3].evidence, "Kavram ağı");
  assert.equal(result.phases[5].evidence, "Özgün felsefi soru");
});

test("FEL.10.1.2 kendi alan-özgü akışını FEL.10.1.1 ile karıştırmaz", () => {
  const result = makeResult(
    createUnit("FEL.10.1.2"),
    "FEL.10.1.2",
    "quiet",
    1,
    "2024.1",
  );
  assertPhaseContract(result);
  assert.equal(
    result.phases[0].facilitator,
    "Bilim, din, sanat ve felsefeden dört soru örneği sunar.",
  );
  assert.equal(result.phases[3].evidence, "Özellik–örnek matrisi");
  assert.equal(result.phases[5].evidence, "Üç alanlı soru seti");
});

test("özel akışı olmayan öğrenme çıktısı genel haftalık motora düşer", () => {
  const result = makeResult(
    createUnit("FEL.10.2.1"),
    "FEL.10.2.1",
    "support",
    2,
    "2024.1",
  );
  assertPhaseContract(result);
  assert.match(result.phases[0].facilitator, /2\. haftanın/u);
  assert.equal(result.phases[0].evidence, "Haftalık başlangıç kaydı");
  assert.equal(result.phases[3].evidence, "Kavram ilişkileri ağı");
});

test("süre doğrulaması seçilen özel veya genel akışın gerçek toplamını kullanır", () => {
  for (const outcomeCode of ["FEL.10.1.1", "FEL.10.1.2", "FEL.10.2.1"]) {
    const result = makeResult(
      createUnit(outcomeCode),
      outcomeCode,
      "balanced",
      1,
      "2024.1",
    );
    const timeCheck = result.validation.checks.find(({ code }) => code === "TIME-OK");
    assert.match(timeCheck?.note ?? "", /80 dakika/u);
  }
});
