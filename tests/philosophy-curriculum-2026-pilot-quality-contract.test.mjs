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
  "FEL.10.5.1", "FEL.10.6.1", "FEL.10.7.1",
  "FEL.10.8.1",
  "FEL.10.9.1",
  "FEL.11.1.1", "FEL.11.1.2",
  "FEL.11.2.1", "FEL.11.2.2",
  "FEL.11.3.1", "FEL.11.3.2",
  "FEL.11.4.1", "FEL.11.4.2",
  "FEL.11.5.1", "FEL.11.5.2",
  "FEL.11.6.1", "FEL.11.6.2",
];

test("Dalga 1A ve Dalga 1B Paket 1-2 yalnız onaylı on yedi öğrenme çıktısını kapsar", () => {
  assert.deepEqual([...PILOT_QUALITY_OUTCOME_CODES], expectedCodes);
  assert.deepEqual(Object.keys(philosophyPilotQualityContracts2026), expectedCodes);
});

test("kalite sözleşmeleri on bir ünitede 51 benzersiz kanonik haftayı kapsar", () => {
  const unitWeeks = new Map();
  for (const contract of Object.values(philosophyPilotQualityContracts2026)) unitWeeks.set(contract.unitCode, contract.weeklyOutcomeRoles.length);
  assert.deepEqual([...unitWeeks.entries()], [["F10_U5", 4], ["F10_U6", 3], ["F10_U7", 4], ["F10_U8", 3], ["F10_U9", 3], ["F11_U1", 6], ["F11_U2", 6], ["F11_U3", 5], ["F11_U4", 6], ["F11_U5", 6], ["F11_U6", 5]]);
  assert.equal([...unitWeeks.values()].reduce((sum, count) => sum + count, 0), 51);
});

test("her pilot çıktı sekiz alanlı kalite sözleşmesini taşır", () => {
  for (const code of expectedCodes) {
    const contract = getPilotQualityContract(code);
    assert.equal(contract.outcomeCode, code);
    assert.equal(contract.version, code.match(/^FEL\.10\.(8)\.1$|^FEL\.11\.(2|3|5)\.[12]$/u) ? "2026.3-1A" : "2026.3-1B");
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
    ["FEL.11.1.1", "FEL.11.1.2", 6],
    ["FEL.11.2.1", "FEL.11.2.2", 6], ["FEL.11.3.1", "FEL.11.3.2", 5], ["FEL.11.5.1", "FEL.11.5.2", 6],
    ["FEL.11.4.1", "FEL.11.4.2", 6], ["FEL.11.6.1", "FEL.11.6.2", 5],
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

test("Dalga 1B Paket 1 dört çıktıyı 14 haftada birincil tutar", () => {
  for (const [code, weeks] of [["FEL.10.5.1", 4], ["FEL.10.6.1", 3], ["FEL.10.7.1", 4], ["FEL.10.9.1", 3]]) {
    for (let week = 1; week <= weeks; week += 1) assert.equal(getWeeklyOutcomeRole(code, week).role, "primary");
    assert.equal(getWeeklyOutcomeRole(code, weeks + 1), null);
  }
});

test("Dalga 1B Paket 1 üniteye özgü güvenlik sınırlarını taşır", () => {
  assert.match(getPilotQualityContract("FEL.10.5.1").sensitiveTopicSafety.voluntaryDisclosureRule, /ailesinin değerlerini/u);
  assert.match(getPilotQualityContract("FEL.10.6.1").sensitiveTopicSafety.teacherNotice, /sanatsal yeteneği/u);
  assert.match(getPilotQualityContract("FEL.10.7.1").sensitiveTopicSafety.voluntaryDisclosureRule, /parti tercihini/u);
  assert.match(getPilotQualityContract("FEL.10.9.1").sensitiveTopicSafety.teacherNotice, /tıbbi tavsiyeye/u);
});

test("Dalga 1B Paket 2 rol geçişlerini 3+3, 2+4 ve 2+3 olarak dondurur", () => {
  for (const [first, second, expectedFirst] of [
    ["FEL.11.1.1", "FEL.11.1.2", ["primary", "primary", "primary", "secondary", "secondary", "secondary"]],
    ["FEL.11.4.1", "FEL.11.4.2", ["primary", "primary", "secondary", "secondary", "secondary", "secondary"]],
    ["FEL.11.6.1", "FEL.11.6.2", ["primary", "primary", "secondary", "secondary", "secondary"]],
  ]) {
    assert.deepEqual(getPilotQualityContract(first).weeklyOutcomeRoles.map((item) => item.role), expectedFirst);
    assert.deepEqual(getPilotQualityContract(second).weeklyOutcomeRoles.map((item) => item.role), expectedFirst.map((role) => role === "primary" ? "secondary" : "primary"));
  }
});

test("Dalga 1B Paket 2 altı çıktı ve 17 benzersiz haftada ortak M1–M4 sözleşmesini taşır", () => {
  const package2Codes = ["FEL.11.1.1", "FEL.11.1.2", "FEL.11.4.1", "FEL.11.4.2", "FEL.11.6.1", "FEL.11.6.2"];
  assert.equal(new Set(package2Codes.map((code) => getPilotQualityContract(code).unitCode)).size, 3);
  assert.equal(new Map(package2Codes.map((code) => { const contract = getPilotQualityContract(code); return [contract.unitCode, contract.weeklyOutcomeRoles.length]; })).values().reduce((sum, weeks) => sum + weeks, 0), 17);
  for (const code of package2Codes) {
    const contract = getPilotQualityContract(code);
    assert.deepEqual(contract.assessmentCriteria, ["M1 Kavramsal doğruluk", "M2 Felsefi gerekçelendirme", "M3 Karşı görüş ve değerlendirme", "M4 Kaynak ve ürün bütünlüğü"]);
    assert.match(contract.feedbackPattern, /M1–M4/u);
    assert.match(contract.revisionExpectation, /görünür/u);
  }
});

test("Dalga 1B Paket 2 çevre, edebiyat ve hukuk güvenlik sınırlarını taşır", () => {
  assert.match(getPilotQualityContract("FEL.11.1.1").sensitiveTopicSafety.voluntaryDisclosureRule, /ailesinin tüketim/u);
  assert.match(getPilotQualityContract("FEL.11.1.2").sensitiveTopicSafety.teacherNotice, /yönlendirilmiş aktivizm/u);
  assert.match(getPilotQualityContract("FEL.11.4.1").conceptSafety.join(" "), /Anlatıcı, karakter ve yazar/u);
  assert.match(getPilotQualityContract("FEL.11.4.2").sensitiveTopicSafety.voluntaryDisclosureRule, /varoluşsal deneyimini/u);
  assert.match(getPilotQualityContract("FEL.11.6.1").sensitiveTopicSafety.teacherNotice, /hukuki danışmanlık/u);
  assert.match(getPilotQualityContract("FEL.11.6.2").conceptSafety.join(" "), /bireysel hukuki tavsiye/u);
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

test("onay kapsamı dışındaki çıktı yeni sözleşmeden etkilenmez", () => {
  assert.equal(getPilotQualityContract("FEL.10.1.1"), null);
  assert.equal(getWeeklyOutcomeRole("FEL.10.1.1", 1), null);
  const phases = specializePhasesForWeek("FEL.10.1.1", 1, philosophyPhaseCatalog2026["FEL.10.1.1"]);
  assert.doesNotMatch(JSON.stringify(phases), /Birincil çıktı rolü|Kavram güvenliği|Değişmeyen standart:/u);
});
