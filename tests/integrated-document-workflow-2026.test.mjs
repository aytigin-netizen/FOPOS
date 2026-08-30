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

const curriculum = getCurriculumContext("philosophy");
const unit = curriculum.units.find((item) => item.code === "F10_U4");
assert.ok(unit);

function pilotScope() {
  return createIntegratedWorkflowScope({
    academicYear: "2026-2027",
    subjectCode: "philosophy",
    datasetVersion: "2026.1",
    unit,
    week: 4,
    outcomeCode: "FEL.10.4.1",
  });
}

function pilotChain(scope = pilotScope()) {
  const annualPlan = createAnnualPlanDecision({
    scope: {
      academicYear: scope.academicYear,
      subjectCode: scope.subjectCode,
      datasetVersion: scope.datasetVersion,
      grade: scope.grade,
    },
    units: curriculum.units,
  });
  const dailyPlan = makeResult(unit, scope.outcomeCode, "balanced", scope.week, scope.datasetVersion).pedagogicalRecord;
  const meetingItems = [{
    title: "Bilgi Felsefesi bütünleşik uygulama kararı",
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
    examName: "Bilgi Felsefesi Pilot Sınavı",
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
      unit,
      week,
      outcomeCode: "FEL.10.4.1",
    }), /kapsamı dışında/u);
  }
});

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
