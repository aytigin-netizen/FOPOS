import assert from "node:assert/strict";
import test from "node:test";

import { philosophyPhaseCatalog2026 } from "../app/modules/lesson-studio/phase-catalog-2026.ts";
import {
  PILOT_QUALITY_OUTCOME_CODES,
  getPilotQualityContract,
  getWeeklyOutcomeRole,
  philosophyPilotQualityContracts2026,
} from "../app/modules/lesson-studio/pilot-quality-contract-2026.ts";
import { specializePhasesForWeek } from "../app/modules/lesson-studio/weekly-content-2026.ts";

const expectedCodes = [
  "FEL.10.8.1",
  "FEL.11.2.1", "FEL.11.2.2",
  "FEL.11.3.1", "FEL.11.3.2",
  "FEL.11.5.1", "FEL.11.5.2",
];

test("Dalga 1A yalnız onaylı yedi öğrenme çıktısını kapsar", () => {
  assert.deepEqual([...PILOT_QUALITY_OUTCOME_CODES], expectedCodes);
  assert.deepEqual(Object.keys(philosophyPilotQualityContracts2026), expectedCodes);
});

test("pilot dört ünitede 20 benzersiz kanonik haftayı kapsar", () => {
  const unitWeeks = new Map();
  for (const contract of Object.values(philosophyPilotQualityContracts2026)) unitWeeks.set(contract.unitCode, contract.weeklyOutcomeRoles.length);
  assert.deepEqual([...unitWeeks.entries()], [["F10_U8", 3], ["F11_U2", 6], ["F11_U3", 5], ["F11_U5", 6]]);
  assert.equal([...unitWeeks.values()].reduce((sum, count) => sum + count, 0), 20);
});

test("her pilot çıktı sekiz alanlı kalite sözleşmesini taşır", () => {
  for (const code of expectedCodes) {
    const contract = getPilotQualityContract(code);
    assert.equal(contract.outcomeCode, code);
    assert.equal(contract.version, "2026.3-1A");
    assert.equal(contract.sourceType, "pedagogical-enrichment");
    assert.ok(contract.sourceGuidance.length > 80);
    assert.ok(contract.conceptSafety.length >= 3);
    assert.ok(contract.taskStandard.length > 50);
    assert.equal(contract.assessmentCriteria.length, 4);
    assert.ok(contract.feedbackPattern.includes("revizyonda"));
    assert.ok(contract.revisionExpectation.length > 50);
    assert.ok(contract.differentiation.support.length > 50);
    assert.ok(contract.differentiation.enrichment.length > 50);
    assert.ok(contract.differentiation.unchangedEvidenceStandard.length > 50);
  }
});

test("hassas konu sözleşmesi kişisel açıklamayı zorunlu kılmaz ve alternatif katılım sunar", () => {
  for (const contract of Object.values(philosophyPilotQualityContracts2026)) {
    assert.ok(contract.sensitiveTopicSafety.teacherNotice.length > 50);
    assert.match(contract.sensitiveTopicSafety.voluntaryDisclosureRule, /zorunda değildir|istenmez/u);
    assert.ok(contract.sensitiveTopicSafety.alternativeParticipation.length > 50);
  }
  assert.match(getPilotQualityContract("FEL.11.5.1").sensitiveTopicSafety.teacherNotice, /koruyucu yönlendirme/u);
  assert.match(getPilotQualityContract("FEL.10.8.1").sensitiveTopicSafety.teacherNotice, /kişisel inancı/u);
});

test("çok çıktılı ünitelerde birincil ve ikincil roller birbirini tamamlar", () => {
  for (const [first, second, weeks] of [
    ["FEL.11.2.1", "FEL.11.2.2", 6], ["FEL.11.3.1", "FEL.11.3.2", 5], ["FEL.11.5.1", "FEL.11.5.2", 6],
  ]) {
    for (let week = 1; week <= weeks; week += 1) {
      const firstRole = getWeeklyOutcomeRole(first, week);
      const secondRole = getWeeklyOutcomeRole(second, week);
      assert.equal(firstRole.week, week);
      assert.equal(secondRole.week, week);
      assert.notEqual(firstRole.role, secondRole.role, `${first}/${second} ${week}. hafta`);
    }
  }
});

test("FEL.10.8.1 tek çıktılı ünitede üç haftanın tamamında birincildir", () => {
  for (let week = 1; week <= 3; week += 1) assert.equal(getWeeklyOutcomeRole("FEL.10.8.1", week).role, "primary");
});

test("pilot haftalık akış kalite, rol, güvenlik, ölçme ve revizyonu görünür kılar", () => {
  for (const code of expectedCodes) {
    const contract = getPilotQualityContract(code);
    for (const weeklyRole of contract.weeklyOutcomeRoles) {
      const phases = specializePhasesForWeek(code, weeklyRole.week, philosophyPhaseCatalog2026[code]);
      assert.equal(phases.length, 9);
      assert.equal(phases.reduce((sum, phase) => sum + phase.duration, 0), 80);
      const serialized = JSON.stringify(phases);
      assert.match(serialized, new RegExp(weeklyRole.role === "primary" ? "Birincil çıktı rolü" : "İkincil çıktı rolü", "u"));
      assert.match(serialized, /Kavram güvenliği/u);
      assert.match(serialized, /Ölçütler:/u);
      assert.match(serialized, /Değişmeyen standart:/u);
      assert.match(serialized, /kişisel açıklama yapmak zorunda değildir/u);
    }
  }
});

test("pilot kalite kayıtları ve iç içe alanları değiştirilemezdir", () => {
  assert.equal(Object.isFrozen(philosophyPilotQualityContracts2026), true);
  for (const contract of Object.values(philosophyPilotQualityContracts2026)) {
    assert.equal(Object.isFrozen(contract), true);
    assert.equal(Object.isFrozen(contract.conceptSafety), true);
    assert.equal(Object.isFrozen(contract.differentiation), true);
    assert.equal(Object.isFrozen(contract.sensitiveTopicSafety), true);
    assert.equal(Object.isFrozen(contract.weeklyOutcomeRoles), true);
    assert.equal(Object.isFrozen(contract.weeklyOutcomeRoles[0]), true);
  }
});

test("pilot dışındaki çıktılar yeni sözleşmeden etkilenmez", () => {
  assert.equal(getPilotQualityContract("FEL.10.7.1"), null);
  assert.equal(getWeeklyOutcomeRole("FEL.10.7.1", 1), null);
  const phases = specializePhasesForWeek("FEL.10.7.1", 1, philosophyPhaseCatalog2026["FEL.10.7.1"]);
  assert.doesNotMatch(JSON.stringify(phases), /Birincil çıktı rolü|Kavram güvenliği|Değişmeyen standart:/u);
});
