import assert from "node:assert/strict";
import test from "node:test";
import {
  createDepartmentMeetingDecision,
  departmentMeetingContentFingerprint,
  departmentMeetingDecisionMatches,
  departmentMeetingRecordId,
} from "../app/core/department-meeting-decision.ts";
import { generateApprovedDocument, toApprovedGenerationDecision } from "../app/core/opus-generation-bridge.ts";
import { approveRecord, submitForReview } from "../app/core/pedagogical-record.ts";

const items = [
  { title: "Açılış", discussion: "Gündem görüşüldü.", decision: "Gündem kabul edildi.", status: "adopted" },
];
const scope = {
  academicYear: "2026-2027",
  subjectCode: "philosophy",
  datasetVersion: "2026.1",
  schemaGrade: 10,
  meetingPeriod: "year_start",
  meetingDate: "2026-09-07",
  meetingNo: "1",
  agendaItemCount: 1,
  resolvedItemCount: 1,
  participantCount: 2,
  contentFingerprint: departmentMeetingContentFingerprint(items),
  meetingHeld: true,
};

test("zümre kimliği öğretim yılı, branş, tür, tarih ve toplantı numarasına bağlıdır", () => {
  const id = departmentMeetingRecordId(scope);
  assert.equal(id, departmentMeetingRecordId({ ...scope, contentFingerprint: "DEADBEEF", participantCount: 3 }));
  assert.notEqual(id, departmentMeetingRecordId({ ...scope, meetingDate: "2026-09-08" }));
  assert.notEqual(id, departmentMeetingRecordId({ ...scope, meetingPeriod: "extraordinary" }));
});

test("gerçekleşmemiş veya sonuçlandırılmamış toplantı onay kararı oluşturamaz", () => {
  assert.throws(() => createDepartmentMeetingDecision({ scope: { ...scope, meetingHeld: false } }), /Gerçekleşmemiş toplantı/);
  assert.throws(() => createDepartmentMeetingDecision({ scope: { ...scope, resolvedItemCount: 0 } }), /Tüm gündem maddeleri/);
  assert.throws(() => createDepartmentMeetingDecision({ scope: { ...scope, participantCount: 0 } }), /En az bir gerçek katılımcı/);
});

test("içerik değişikliği aynı toplantıda yeni revizyon gerektirir", () => {
  const first = createDepartmentMeetingDecision({ scope });
  const changedScope = { ...scope, contentFingerprint: departmentMeetingContentFingerprint([{ ...items[0], decision: "Yeni karar" }]) };
  assert.equal(first.recordId, departmentMeetingRecordId(changedScope));
  assert.equal(departmentMeetingDecisionMatches(first, scope), true);
  assert.equal(departmentMeetingDecisionMatches(first, changedScope), false);
  const second = createDepartmentMeetingDecision({ scope: changedScope, revision: 2, previousRevision: 1 });
  assert.equal(second.revision, 2);
  assert.equal(second.previousRevision, 1);
});

test("OPUS zümre üretimi ayrı ve değişmez olay izi üretir", async () => {
  const approved = approveRecord(submitForReview(createDepartmentMeetingDecision({ scope })), "Gerçek toplantı ve içerik doğrulandı.");
  const decision = toApprovedGenerationDecision(approved, "department-meeting-minutes");
  assert.equal(decision.curriculum.gradeLevelId, "all-grades");
  assert.equal(decision.curriculum.unitId, "department-meeting-minutes");
  const request = { id: approved.recordId + ":r1:department-meeting-minutes", decisionId: decision.id, documentType: "department-meeting-minutes" };
  const first = await generateApprovedDocument(decision, request, async () => ({ fileName: "minutes.docx" }));
  const second = await generateApprovedDocument(decision, request, async () => ({ fileName: "minutes.docx" }));
  assert.notEqual(first.provenance.eventId, second.provenance.eventId);
  assert.equal(first.provenance.documentType, "department-meeting-minutes");
  assert.equal(Object.isFrozen(first.provenance), true);
  assert.doesNotMatch(JSON.stringify(first.provenance), /katılımcı|öğrenci|principal|müdür/iu);
});
