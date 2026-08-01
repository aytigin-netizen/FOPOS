import type { Grade } from "../data/curriculum";
import type { PedagogicalRecord } from "./pedagogical-record";

export type DepartmentMeetingDecisionScope = {
  readonly academicYear: string;
  readonly subjectCode: string;
  readonly datasetVersion: string;
  readonly schemaGrade: Grade;
  readonly meetingPeriod: string;
  readonly meetingDate: string;
  readonly meetingNo: string;
  readonly agendaItemCount: number;
  readonly resolvedItemCount: number;
  readonly participantCount: number;
  readonly contentFingerprint: string;
  readonly meetingHeld: true;
};

function requireText(value: string, label: string): string {
  const normalized = value.trim();
  if (!normalized) throw new Error(`${label} boş olamaz.`);
  return normalized;
}

function stableFingerprint(value: string): string {
  let hash = 2166136261;
  for (const character of value) {
    hash ^= character.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, "0").toUpperCase();
}

function normalizedScope(scope: DepartmentMeetingDecisionScope) {
  const academicYear = requireText(scope.academicYear, "Öğretim yılı");
  if (!/^\d{4}-\d{4}$/u.test(academicYear)) throw new Error("Öğretim yılı YYYY-YYYY biçiminde olmalıdır.");
  const subjectCode = requireText(scope.subjectCode, "Branş").toLocaleLowerCase("en-US");
  const datasetVersion = requireText(scope.datasetVersion, "Müfredat veri seti sürümü");
  const meetingPeriod = requireText(scope.meetingPeriod, "Toplantı türü");
  const meetingDate = requireText(scope.meetingDate, "Toplantı tarihi");
  const meetingNo = requireText(scope.meetingNo, "Toplantı numarası");
  const contentFingerprint = requireText(scope.contentFingerprint, "Tutanak içerik özeti");
  if (!scope.meetingHeld) throw new Error("Gerçekleşmemiş toplantı resmî tutanak kararına dönüşemez.");
  if (!Number.isInteger(scope.agendaItemCount) || scope.agendaItemCount < 1) throw new Error("Gündem maddesi sayısı geçersiz.");
  if (scope.resolvedItemCount !== scope.agendaItemCount) throw new Error("Tüm gündem maddeleri sonuçlandırılmalıdır.");
  if (!Number.isInteger(scope.participantCount) || scope.participantCount < 1) throw new Error("En az bir gerçek katılımcı gerekir.");
  return { ...scope, academicYear, subjectCode, datasetVersion, meetingPeriod, meetingDate, meetingNo, contentFingerprint };
}

export function departmentMeetingRecordId(scope: DepartmentMeetingDecisionScope): string {
  const value = normalizedScope(scope);
  const identity = stableFingerprint(JSON.stringify({
    academicYear: value.academicYear,
    subjectCode: value.subjectCode,
    meetingPeriod: value.meetingPeriod,
    meetingDate: value.meetingDate,
    meetingNo: value.meetingNo,
  }));
  return `OPUS-PR-MEETING-${value.academicYear}-${value.subjectCode.toLocaleUpperCase("en-US")}-${identity}`;
}

export function departmentMeetingContentFingerprint(items: readonly {
  readonly title: string;
  readonly discussion: string;
  readonly decision: string;
  readonly status: string;
}[]): string {
  return stableFingerprint(JSON.stringify(items.map((item) => ({
    title: item.title.trim(),
    discussion: item.discussion.trim(),
    decision: item.decision.trim(),
    status: item.status,
  }))));
}

export function departmentMeetingDecisionMatches(
  record: PedagogicalRecord,
  scope: DepartmentMeetingDecisionScope,
): boolean {
  return record.recordId === departmentMeetingRecordId(scope) &&
    record.pedagogicalDecision.learningEvidence.includes(`İçerik özeti: ${normalizedScope(scope).contentFingerprint}`);
}

export function createDepartmentMeetingDecision(input: {
  readonly scope: DepartmentMeetingDecisionScope;
  readonly revision?: number;
  readonly previousRevision?: number | null;
}): PedagogicalRecord {
  const scope = normalizedScope(input.scope);
  const revision = input.revision ?? 1;
  if (!Number.isInteger(revision) || revision < 1) throw new Error("Zümre tutanağı karar revizyonu geçersiz.");
  const now = new Date().toISOString();
  return {
    schemaVersion: "1.0.0",
    recordId: departmentMeetingRecordId(scope),
    revision,
    status: "draft",
    createdAt: now,
    updatedAt: now,
    previousRevision: input.previousRevision ?? null,
    approval: null,
    curriculum: {
      subjectCode: scope.subjectCode,
      datasetVersion: scope.datasetVersion,
      grade: scope.schemaGrade,
      unitCode: "DEPARTMENT_MEETING_MINUTES",
      outcomeCode: `MEETING.${stableFingerprint(scope.meetingPeriod)}`,
    },
    lessonContext: {
      week: 1,
      durationMinutes: 1,
      profile: "Gerçekleşmiş zümre toplantısı",
    },
    pedagogicalDecision: {
      strategy: "Öğretmen doğrulamalı kurumsal toplantı kaydı",
      methods: ["Gerçekleşme doğrulaması", "Madde bazlı görüşme ve karar kaydı", "Yetkili imza ayrımı"],
      learningEvidence: [
        `Toplantı türü: ${scope.meetingPeriod}`,
        `Toplantı tarihi: ${scope.meetingDate}`,
        `Toplantı no: ${scope.meetingNo}`,
        `Gündem/Sonuçlanan: ${scope.agendaItemCount}/${scope.resolvedItemCount}`,
        `Katılımcı sayısı: ${scope.participantCount}`,
        `İçerik özeti: ${scope.contentFingerprint}`,
        "Toplantının gerçekleştiği öğretmen tarafından doğrulandı.",
        "Katılımcı adları ve öğrenci kişisel verileri üretim izine dahil değildir.",
        "OPUS onayı müdür onayı veya elektronik imza değildir.",
      ].join(" • "),
    },
  };
}
