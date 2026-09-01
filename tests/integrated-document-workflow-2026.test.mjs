import assert from "node:assert/strict";
import test from "node:test";

import { createAnnualPlanDecision } from "../app/core/annual-plan-decision.ts";
import {
  createDepartmentMeetingDecision,
  departmentMeetingContentFingerprint,
} from "../app/core/department-meeting-decision.ts";
import { createExamBlueprintTransfer } from "../app/core/exam-blueprint-transfer.ts";
import { createExamDecision } from "../app/core/exam-decision.ts";
import { getCurriculumContext } from "../app/data/curriculum-runtime.ts";
import {
  assertIntegratedWorkflowChain,
  createIntegratedWorkflowScope,
  integratedWorkflowReference,
} from "../app/modules/integrated-workflow/integrated-workflow-contract.ts";
import { makeResult } from "../app/modules/lesson-studio/lesson-engine.ts";
import { philosophyPhaseCatalog2026 } from "../app/modules/lesson-studio/phase-catalog-2026.ts";
import { getOutcomeForWeek } from "../app/modules/lesson-studio/week-outcome.ts";
import { specializePhasesForWeek } from "../app/modules/lesson-studio/weekly-content-2026.ts";

const curriculum = getCurriculumContext("philosophy");
const integratedScenarioCatalog = Object.freeze([
  {
    wave: "pilot",
    unitCode: "F10_U4",
    week: 4,
    outcomeCode: "FEL.10.4.1",
  },
  {
    wave: "pilot",
    unitCode: "F11_U1",
    week: 6,
    outcomeCode: "FEL.11.1.2",
  },
  {
    wave: "A",
    unitCode: "F11_U2",
    week: 6,
    outcomeCode: "FEL.11.2.2",
    expectedOutcomeSequence: [
      "FEL.11.2.1", "FEL.11.2.1", "FEL.11.2.2",
      "FEL.11.2.2", "FEL.11.2.2", "FEL.11.2.2",
    ],
    safetyPatterns: [
      /marka tavsiyesi vermeden/u,
      /yapay zekâ üretimini kendi özgün kanıtı gibi sunmadan/u,
      /alıntı ile parafrazı ayırır/u,
    ],
  },
  {
    wave: "A",
    unitCode: "F11_U5",
    week: 6,
    outcomeCode: "FEL.11.5.2",
    expectedOutcomeSequence: [
      "FEL.11.5.1", "FEL.11.5.1", "FEL.11.5.2",
      "FEL.11.5.2", "FEL.11.5.2", "FEL.11.5.2",
    ],
    safetyPatterns: [
      /Kişisel hayat öyküsü, inanç veya ruh sağlığı açıklaması yerine/u,
      /alıntı, parafraz, sadeleştirme ve öğretmen uyarlamasını ayırır/iu,
      /felsefi rubrikle akran dönütü/u,
    ],
  },
  {
    wave: "A",
    unitCode: "F11_U3",
    week: 5,
    outcomeCode: "FEL.11.3.2",
    expectedOutcomeSequence: [
      "FEL.11.3.1", "FEL.11.3.1", "FEL.11.3.2",
      "FEL.11.3.2", "FEL.11.3.2",
    ],
    safetyPatterns: [
      /kişisel inanç beyanı yerine kurmaca ya da üçüncü kişi görüşünü seçebilir/u,
      /alıntı ile parafrazı ayırır/u,
      /dinî kanaate göre değil felsefi ölçütlerle/u,
    ],
  },
  {
    wave: "B",
    unitCode: "F11_U6",
    week: 5,
    outcomeCode: "FEL.11.6.2",
    expectedOutcomeSequence: [
      "FEL.11.6.1", "FEL.11.6.1", "FEL.11.6.2",
      "FEL.11.6.2", "FEL.11.6.2",
    ],
    safetyPatterns: [
      /Gerçek kişi verisi, dava stratejisi veya bireysel hukuki danışmanlık üretmeden/u,
      /Alıntı, parafraz, sadeleştirme ve öğretmen uyarlamasını ayırır/u,
      /her kaynak parçasını en fazla 100 kelimeyle sınırlar/u,
    ],
  },
  {
    wave: "B",
    unitCode: "F11_U4",
    week: 6,
    outcomeCode: "FEL.11.4.2",
    expectedOutcomeSequence: [
      "FEL.11.4.1", "FEL.11.4.1", "FEL.11.4.2",
      "FEL.11.4.2", "FEL.11.4.2", "FEL.11.4.2",
    ],
    safetyPatterns: [
      /Her alıntıyı en fazla 100 kelimeyle sınırlar/u,
      /alıntı, parafraz, sadeleştirme ve öğretmen uyarlamasını ayırır/u,
      /Edebî zevki, yaratıcı yazarlığı veya kişisel yaşantısı yerine felsefi rubrik/u,
    ],
  },
  {
    wave: "F10-A",
    unitCode: "F10_U2",
    week: 3,
    outcomeCode: "FEL.10.2.2",
    expectedOutcomeSequence: [
      "FEL.10.2.1", "FEL.10.2.2", "FEL.10.2.2",
    ],
    safetyPatterns: [
      /bağlam ve anlamını koruyarak/u,
      /öncül–sonuç yapısını/u,
      /karşı görüşü adil biçimde yeniden kurup/u,
    ],
  },
  {
    wave: "F10-A",
    unitCode: "F10_U8",
    week: 3,
    outcomeCode: "FEL.10.8.1",
    expectedOutcomeSequence: [
      "FEL.10.8.1", "FEL.10.8.1", "FEL.10.8.1",
    ],
    safetyPatterns: [
      /kişisel inançtan bağımsız olarak/u,
      /tek bir görüşü ait olduğu inanç geleneğinin tamamıyla özdeşleştirmez/u,
      /dinî kanaate göre değil felsefi rubrikle/u,
    ],
  },
  {
    wave: "F10-A",
    unitCode: "F10_U9",
    week: 3,
    outcomeCode: "FEL.10.9.1",
    expectedOutcomeSequence: [
      "FEL.10.9.1", "FEL.10.9.1", "FEL.10.9.1",
    ],
    safetyPatterns: [
      /bilimsel bulgu, bilim insanının kişisel görüşü ve bilim felsefesi argümanını ayırarak/u,
      /tek çalışmayı bilimsel uzlaşma gibi sunmaz/u,
      /Sağlık örneğini tıbbi tavsiyeye dönüştürmez/u,
    ],
  },
  {
    wave: "F10-B",
    unitCode: "F10_U7",
    week: 4,
    outcomeCode: "FEL.10.7.1",
    expectedOutcomeSequence: [
      "FEL.10.7.1", "FEL.10.7.1", "FEL.10.7.1", "FEL.10.7.1",
    ],
    safetyPatterns: [
      /alıntı, parafraz, sadeleştirme veya öğretmen uyarlaması/u,
      /metni güncel kişi veya partiyle özdeşleştirmez/u,
      /siyasi kanaate göre değil felsefi rubrikle/u,
    ],
  },
  {
    wave: "F10-B",
    unitCode: "F10_U5",
    week: 4,
    outcomeCode: "FEL.10.5.1",
    expectedOutcomeSequence: [
      "FEL.10.5.1", "FEL.10.5.1", "FEL.10.5.1", "FEL.10.5.1",
    ],
    safetyPatterns: [
      /Kişisel itiraf gerektirmeyen/u,
      /hukuki, toplumsal ve ahlaki yargıları ayırarak/u,
      /argümanı adil biçimde yeniden kurar/u,
    ],
  },
  {
    wave: "F10-B",
    unitCode: "F10_U3",
    week: 5,
    outcomeCode: "FEL.10.3.1",
    expectedOutcomeSequence: [
      "FEL.10.3.1", "FEL.10.3.1", "FEL.10.3.1", "FEL.10.3.1", "FEL.10.3.1",
    ],
    safetyPatterns: [
      /Kaynağı, eser bilgisi ve alıntı\/parafraz durumu doğrulanmış/u,
      /anlamı korunarak uyarlanmış/u,
      /görüşü metin kanıtıyla değerlendirip/u,
    ],
  },
  {
    wave: "F10-C",
    unitCode: "F10_U1",
    week: 5,
    outcomeCode: "FEL.10.1.1",
    expectedOutcomeSequence: [
      "FEL.10.1.1", "FEL.10.1.1", "FEL.10.1.1", "FEL.10.1.1", "FEL.10.1.1",
    ],
    safetyPatterns: [
      /izin ve görüşme etiği kurallarına uygun/u,
      /yanıtlarını ders ölçütleriyle çözümler, kaynaklandırır/u,
      /kaynak ve izin kayıtlı röportaj ürünü/u,
    ],
  },
  {
    wave: "F10-C",
    unitCode: "F10_U6",
    week: 3,
    outcomeCode: "FEL.10.6.1",
    expectedOutcomeSequence: [
      "FEL.10.6.1", "FEL.10.6.1", "FEL.10.6.1",
    ],
    safetyPatterns: [
      /Eseri ve alıntı\/parafraz durumu belirtilmiş/u,
      /anlamı korunarak yaş düzeyine uyarlanmış/u,
      /kültürel beğenileri tek ölçüte indirgemeden/u,
    ],
  },
]);

function scenarioUnit(unitCode) {
  const unit = curriculum.units.find((item) => item.code === unitCode);
  assert.ok(unit, `${unitCode} kanonik müfredatta bulunmalıdır.`);
  return unit;
}

function scenarioScope(scenario) {
  return createIntegratedWorkflowScope({
    academicYear: "2026-2027",
    subjectCode: "philosophy",
    datasetVersion: "2026.1",
    unit: scenarioUnit(scenario.unitCode),
    week: scenario.week,
    outcomeCode: scenario.outcomeCode,
  });
}

const f10Scenario = integratedScenarioCatalog.find((scenario) => scenario.unitCode === "F10_U4");
const f11Scenario = integratedScenarioCatalog.find((scenario) => scenario.unitCode === "F11_U1");
assert.ok(f10Scenario);
assert.ok(f11Scenario);
const f10Unit = scenarioUnit(f10Scenario.unitCode);
const f11Unit = scenarioUnit(f11Scenario.unitCode);

function pilotScope() {
  return scenarioScope(f10Scenario);
}

function f11PilotScope() {
  return scenarioScope(f11Scenario);
}

function pilotChain(scope = pilotScope(), pilotUnit = f10Unit) {
  const annualPlan = createAnnualPlanDecision({
    scope: {
      academicYear: scope.academicYear,
      subjectCode: scope.subjectCode,
      datasetVersion: scope.datasetVersion,
      grade: scope.grade,
    },
    units: curriculum.units,
  });
  const dailyPlan = makeResult(pilotUnit, scope.outcomeCode, "balanced", scope.week, scope.datasetVersion).pedagogicalRecord;
  const meetingItems = [{
    title: `${pilotUnit.name} bütünleşik uygulama kararı`,
    discussion: "Yıllık plan, günlük plan ve ölçme kanıtlarının ortak kapsamı görüşüldü.",
    decision: `${integratedWorkflowReference(scope)} — öğretim ve ölçme belgelerinde korunacaktır.`,
    status: "accepted",
  }];
  const departmentMeeting = createDepartmentMeetingDecision({
    scope: {
      academicYear: scope.academicYear,
      subjectCode: scope.subjectCode,
      datasetVersion: scope.datasetVersion,
      schemaGrade: scope.grade,
      meetingPeriod: "Yıl Başı",
      meetingDate: "01.09.2026",
      meetingNo: "1",
      agendaItemCount: 1,
      resolvedItemCount: 1,
      participantCount: 2,
      contentFingerprint: departmentMeetingContentFingerprint(meetingItems),
      meetingHeld: true,
    },
  });
  departmentMeeting.pedagogicalDecision.learningEvidence += ` • ${integratedWorkflowReference(scope)}`;
  const commonExam = {
    academicYear: scope.academicYear,
    subjectCode: scope.subjectCode,
    datasetVersion: scope.datasetVersion,
    grade: scope.grade,
    examName: `${pilotUnit.name} Pilot Sınavı`,
    unitCodes: [scope.unitCode],
    outcomeCodes: [scope.outcomeCode],
    questionCount: 5,
    totalPoints: 100,
  };
  const standardExam = createExamDecision({
    scope: { ...commonExam, mode: "standard", durationMinutes: 40 },
  });
  const bepExam = createExamDecision({
    scope: { ...commonExam, mode: "bep", durationMinutes: 60, adaptationKey: "reading" },
  });
  const examAnalysisTransfer = createExamBlueprintTransfer({
    grade: scope.grade,
    examName: "1. Dönem 1. Sınav",
    questions: [
      { unitCode: scope.unitCode, outcomeCode: scope.outcomeCode, maxPoints: 20 },
      { unitCode: scope.unitCode, outcomeCode: scope.outcomeCode, maxPoints: 20 },
      { unitCode: scope.unitCode, outcomeCode: scope.outcomeCode, maxPoints: 20 },
      { unitCode: scope.unitCode, outcomeCode: scope.outcomeCode, maxPoints: 20 },
      { unitCode: scope.unitCode, outcomeCode: scope.outcomeCode, maxPoints: 20 },
    ],
  });
  return { annualPlan, dailyPlan, departmentMeeting, standardExam, bepExam, examAnalysisTransfer };
}

test("F10_U4 4. hafta kanonik bütünleşik kapsam anahtarı üretir", () => {
  const scope = pilotScope();
  assert.equal(scope.unitCode, "F10_U4");
  assert.equal(scope.week, 4);
  assert.equal(scope.outcomeCode, "FEL.10.4.1");
  assert.match(scope.key, /^OPUS-IWR-2026-2027-PHILOSOPHY-2026.1-G10-F10-U4-H4-FEL.10.4.1-R1$/u);
});

test("Bilgi Felsefesi kapsam dışı 5. ve 6. haftaları sessizce kabul etmez", () => {
  for (const week of [5, 6]) {
    assert.throws(() => createIntegratedWorkflowScope({
      academicYear: "2026-2027",
      subjectCode: "philosophy",
      datasetVersion: "2026.1",
      unit: f10Unit,
      week,
      outcomeCode: "FEL.10.4.1",
    }), /kapsamı dışında/u);
  }
});

test("F11_U1 6. hafta kanonik bütünleşik kapsam anahtarı üretir", () => {
  const scope = f11PilotScope();
  assert.equal(scope.unitCode, "F11_U1");
  assert.equal(scope.week, 6);
  assert.equal(scope.outcomeCode, "FEL.11.1.2");
  assert.match(scope.key, /^OPUS-IWR-2026-2027-PHILOSOPHY-2026.1-G11-F11-U1-H6-FEL.11.1.2-R1$/u);
});

test("F11_U1 3→4 çıktı geçişini korur ve kapsam dışı 7. haftayı reddeder", () => {
  assert.deepEqual(
    Array.from({ length: 6 }, (_, index) => getOutcomeForWeek(f11Unit, index + 1).code),
    ["FEL.11.1.1", "FEL.11.1.1", "FEL.11.1.1", "FEL.11.1.2", "FEL.11.1.2", "FEL.11.1.2"],
  );
  assert.throws(() => createIntegratedWorkflowScope({
    academicYear: "2026-2027",
    subjectCode: "philosophy",
    datasetVersion: "2026.1",
    unit: f11Unit,
    week: 7,
    outcomeCode: "FEL.11.1.2",
  }), /kapsamı dışında/u);
});

test("F11_U1 6. hafta kaynak, normatif sonuç ve tarafsızlık güvenliğini korur", () => {
  const phases = specializePhasesForWeek(
    "FEL.11.1.2",
    6,
    philosophyPhaseCatalog2026["FEL.11.1.2"],
  );
  const serialized = JSON.stringify(phases);
  assert.equal(phases.length, 9);
  assert.equal(phases.reduce((sum, phase) => sum + phase.duration, 0), 80);
  assert.match(serialized, /yönlendirilmiş aktivizm istemeden/u);
  assert.match(serialized, /alıntı ile parafrazı ayırıp/u);
  assert.match(serialized, /Kaynaklı felsefi metin, analitik rubrik, akran dönütü ve öz değerlendirme/u);
});

test("F11 yıllık plandan sınav analizine altı aşama aynı pilot kapsamını korur", () => {
  const scope = f11PilotScope();
  const result = assertIntegratedWorkflowChain(scope, pilotChain(scope, f11Unit));
  assert.equal(result.scopeKey, scope.key);
  assert.equal(result.unitCode, "F11_U1");
  assert.equal(result.week, 6);
  assert.equal(result.outcomeCode, "FEL.11.1.2");
  assert.equal(result.standardAndBepShareOutcome, true);
  assert.equal(result.examAnalysisTotalPoints, 100);
});

for (const scenario of integratedScenarioCatalog.filter(({ wave }) => wave !== "pilot")) {
  test(`${scenario.unitCode} temsil haftası kanonik Dalga ${scenario.wave} kapsam anahtarını üretir`, () => {
    const scope = scenarioScope(scenario);
    assert.equal(scope.unitCode, scenario.unitCode);
    assert.equal(scope.week, scenario.week);
    assert.equal(scope.outcomeCode, scenario.outcomeCode);
    assert.equal(
      scope.key,
      `OPUS-IWR-2026-2027-PHILOSOPHY-2026.1-G${scenarioUnit(scenario.unitCode).grade}-${scenario.unitCode.replace("_", "-")}-H${scenario.week}-${scenario.outcomeCode}-R1`,
    );
  });

  test(`${scenario.unitCode} doğru hafta–çıktı geçişini korur ve kapsam dışı haftayı reddeder`, () => {
    const unit = scenarioUnit(scenario.unitCode);
    assert.deepEqual(
      Array.from({ length: scenario.week }, (_, index) => getOutcomeForWeek(unit, index + 1).code),
      scenario.expectedOutcomeSequence,
    );
    assert.throws(() => createIntegratedWorkflowScope({
      academicYear: "2026-2027",
      subjectCode: "philosophy",
      datasetVersion: "2026.1",
      unit,
      week: scenario.week + 1,
      outcomeCode: scenario.outcomeCode,
    }), /kapsamı dışında/u);
  });

  test(`${scenario.unitCode} temsil haftası 9 aşama, 80 dakika ve ünite güvenliğini korur`, () => {
    const phases = specializePhasesForWeek(
      scenario.outcomeCode,
      scenario.week,
      philosophyPhaseCatalog2026[scenario.outcomeCode],
    );
    const serialized = JSON.stringify(phases);
    assert.equal(phases.length, 9);
    assert.equal(phases.reduce((sum, phase) => sum + phase.duration, 0), 80);
    assert.ok(phases.every((phase) => phase.facilitator && phase.learner && phase.evidence));
    for (const pattern of scenario.safetyPatterns) assert.match(serialized, pattern);
  });

  test(`${scenario.unitCode} yıllık plandan sınav analizine ortak kapsam ve Standart/BEP eşitliği taşır`, () => {
    const scope = scenarioScope(scenario);
    const result = assertIntegratedWorkflowChain(
      scope,
      pilotChain(scope, scenarioUnit(scenario.unitCode)),
    );
    assert.equal(result.scopeKey, scope.key);
    assert.equal(result.unitCode, scenario.unitCode);
    assert.equal(result.week, scenario.week);
    assert.equal(result.outcomeCode, scenario.outcomeCode);
    assert.equal(result.standardAndBepShareOutcome, true);
    assert.equal(result.examAnalysisTotalPoints, 100);
    assert.deepEqual(result.documentStages, [
      "annual-plan",
      "daily-plan",
      "department-meeting-minutes",
      "standard-exam",
      "bep-exam",
      "exam-analysis",
    ]);
  });
}

test("yıllık plandan sınav analizine altı aşama aynı pilot kapsamını korur", () => {
  const scope = pilotScope();
  const result = assertIntegratedWorkflowChain(scope, pilotChain(scope));
  assert.equal(result.scopeKey, scope.key);
  assert.equal(result.standardAndBepShareOutcome, true);
  assert.equal(result.examAnalysisTotalPoints, 100);
  assert.deepEqual(result.documentStages, [
    "annual-plan",
    "daily-plan",
    "department-meeting-minutes",
    "standard-exam",
    "bep-exam",
    "exam-analysis",
  ]);
});

test("zümre karar referansı veya analiz kapsamı bozulursa zinciri reddeder", () => {
  const scope = pilotScope();
  const missingMeetingReference = pilotChain(scope);
  missingMeetingReference.departmentMeeting.pedagogicalDecision.learningEvidence = "İçerik özeti var; pilot kapsam referansı yok.";
  assert.throws(
    () => assertIntegratedWorkflowChain(scope, missingMeetingReference),
    /Zümre tutanağı bütünleşik kapsam kanıtını taşımıyor/u,
  );

  const wrongAnalysisOutcome = pilotChain(scope);
  wrongAnalysisOutcome.examAnalysisTransfer.questions = wrongAnalysisOutcome.examAnalysisTransfer.questions.map((question) => ({
    ...question,
    outcomeCode: "FEL.10.3.1",
  }));
  assert.throws(
    () => assertIntegratedWorkflowChain(scope, wrongAnalysisOutcome),
    /Sınav analizi aktarımı pilot ünite ve öğrenme çıktısını taşımıyor/u,
  );
});
