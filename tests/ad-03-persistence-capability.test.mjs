import assert from "node:assert/strict";
import test from "node:test";
import { saveDocumentGeneration } from "../db/document-generations.ts";
import { savePedagogicalRecord } from "../db/pedagogical-records.ts";
import { runWithDatabase } from "../db/runtime-env.ts";

const baseRecord = {
  schemaVersion: "1.0.0",
  recordId: "OPUS-PR-ad03",
  revision: 1,
  status: "draft",
  createdAt: "2026-09-08T10:00:00.000Z",
  updatedAt: "2026-09-08T10:00:00.000Z",
  previousRevision: null,
  approval: null,
  curriculum: {
    subjectCode: "philosophy",
    datasetVersion: "2026.1",
    grade: 10,
    unitCode: "F10_U1",
    outcomeCode: "FEL.10.1.1",
  },
  lessonContext: { week: 1, durationMinutes: 80, profile: "Dengeli" },
  pedagogicalDecision: { strategy: "Sorgulama", methods: [], learningEvidence: "Gerekçe" },
};

const approvedRecord = {
  ...baseRecord,
  status: "approved",
  approval: {
    approvedAt: "2026-09-08T10:05:00.000Z",
    statement: "Kontrol ettim",
    actorRole: "teacher",
  },
};

const provenance = {
  eventId: "123e4567-e89b-12d3-a456-426614174000",
  contractVersion: "1.2.0",
  decisionId: "decision:OPUS-PR-ad03:r1",
  requestId: "OPUS-OUT-ad03",
  documentType: "daily-plan",
  teacherId: "current-teacher",
  approvedAt: approvedRecord.approval.approvedAt,
  curriculum: {
    moduleId: "fopos",
    curriculumId: "philosophy-tr-2026",
    gradeLevelId: "grade-10",
    unitId: "f10-u1",
    outcomeCode: "FEL.10.1.1",
  },
  artifactIntegrity: {
    algorithm: "SHA-256",
    digest: "a".repeat(64),
    source: "final-artifact-bytes",
  },
};

function fakeDatabase(sourceRecord) {
  let writes = 0;
  return {
    get writes() {
      return writes;
    },
    prepare(sql) {
      return {
        bind() {
          return this;
        },
        async first() {
          if (sql.includes("FROM teacher_profiles")) return { academic_year: "2026-2027" };
          if (sql.includes("status = 'approved'")) {
            return sourceRecord
              ? { payload_json: JSON.stringify(sourceRecord), academic_year: "2026-2027" }
              : null;
          }
          if (sql.includes("FROM pedagogical_records")) return null;
          return null;
        },
        async all() {
          return { results: [] };
        },
        async run() {
          writes += 1;
          return { success: true };
        },
      };
    },
  };
}

async function saveRecord(subjectCode) {
  const database = fakeDatabase();
  const record = { ...baseRecord, curriculum: { ...baseRecord.curriculum, subjectCode } };
  await runWithDatabase(database, () => savePedagogicalRecord("teacher-a", record));
  return database.writes;
}

async function saveGeneration(subjectCode) {
  const database = fakeDatabase({
    ...approvedRecord,
    curriculum: { ...approvedRecord.curriculum, subjectCode },
  });
  const trace = {
    ...provenance,
    curriculum: {
      ...provenance.curriculum,
      curriculumId: `${subjectCode}-tr-2026`,
    },
  };
  await runWithDatabase(database, () => saveDocumentGeneration("teacher-a", trace));
  return database.writes;
}

test("Sociology pedagojik kayıt persistence'ına erişemez", async () => {
  await assert.rejects(() => saveRecord("sociology"), /pedagojik kayıt saklama etkin değil/u);
});

test("unknown domain pedagojik kayıt persistence'ında fail-closed reddedilir", async () => {
  await assert.rejects(() => saveRecord("psychology"), /pedagojik kayıt saklama etkin değil/u);
});

test("Philosophy pedagojik kayıt persistence davranışını korur", async () => {
  assert.equal(await saveRecord("philosophy"), 1);
});

test("Sociology document generation persistence'ına erişemez", async () => {
  await assert.rejects(() => saveGeneration("sociology"), /belge üretimi etkin değil/u);
});

test("unknown domain document generation persistence'ında fail-closed reddedilir", async () => {
  await assert.rejects(() => saveGeneration("psychology"), /belge üretimi etkin değil/u);
});

test("Philosophy document generation persistence davranışını korur", async () => {
  assert.equal(await saveGeneration("philosophy"), 1);
});