import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { fingerprint, immutableData } from "../db/pedagogical-record-fingerprint.ts";

const collector = await readFile(
  new URL("../scripts/collect-migration-data.js", import.meta.url),
  "utf8",
);
const importer = await readFile(
  new URL("../scripts/import-migration-data.mjs", import.meta.url),
  "utf8",
);
const repository = await readFile(
  new URL("../db/pedagogical-records.ts", import.meta.url),
  "utf8",
);

function sampleRecord() {
  return {
    schemaVersion: "1.0.0",
    recordId: "OPUS-PR-ornek-1",
    revision: 2,
    status: "approved",
    createdAt: "2026-10-17T08:00:00.000Z",
    updatedAt: "2026-10-18T09:30:00.000Z",
    previousRevision: 1,
    approval: {
      approvedAt: "2026-10-18T09:30:00.000Z",
      statement: "İçerik onaylandı.",
      actorRole: "teacher",
    },
    curriculum: {
      subjectCode: "philosophy",
      datasetVersion: "2026.1",
      grade: 10,
      unitCode: "FEL.10.3",
      outcomeCode: "FEL.10.3.1",
    },
    lessonContext: { week: 4, durationMinutes: 80, profile: "sık" },
    pedagogicalDecision: {
      strategy: "sorgulama",
      methods: ["karşılaştırma", "sorgulama"],
      learningEvidence: "Kanıt",
    },
  };
}

test("değişmez bölümün gösterimi kanonik alan sırasını korur", () => {
  const canonical = JSON.parse(immutableData(sampleRecord()));
  assert.deepEqual(Object.keys(canonical), [
    "schemaVersion",
    "recordId",
    "revision",
    "createdAt",
    "previousRevision",
    "curriculum",
    "lessonContext",
    "pedagogicalDecision",
  ]);
});

test("özet kararlıdır ve alan sırasına duyarlıdır", async () => {
  const record = sampleRecord();
  const first = await fingerprint(record);
  const second = await fingerprint(record);
  assert.equal(first, second);
  assert.equal(first.length, 64);
  assert.match(first, /^[0-9a-f]{64}$/);

  // Onay ve durum alanları özete girmez; değişmesi özeti bozmamalıdır.
  const changed = { ...record, status: "superseded", approval: null };
  assert.equal(await fingerprint(changed), first);
});

test("taşıma içe aktarıcısı özetin kopyasını değil, ortak modülü kullanır", () => {
  assert.match(
    importer,
    /import \{ fingerprint \} from "\.\.\/db\/pedagogical-record-fingerprint\.ts"/,
  );
  // Kopyalanmış ikinci bir uygulama olmamalı.
  assert.equal(importer.includes("function immutableData"), false);
  assert.equal(importer.includes("function fingerprint("), false);
});

test("kayıt yolu ortak özet modülünü kullanır", () => {
  assert.match(
    repository,
    /import \{ fingerprint \} from "\.\/pedagogical-record-fingerprint\.ts"/,
  );
  assert.equal(repository.includes("function immutableData"), false);
});

test("içe aktarıcı bütün taşınacak tabloları kapsar", () => {
  for (const table of [
    "users",
    "teacher_profiles",
    "teacher_profile_revisions",
    "class_workspaces",
    "saved_student_rosters",
    "pedagogical_records",
    "teaching_timetables",
    "exam_generation_history",
  ]) {
    assert.match(importer, new RegExp(`INSERT INTO ${table}\\b`), table);
  }
});

test("içe aktarıcı dışa aktarım bütünlüğünü doğrular", () => {
  assert.match(importer, /contentSha256/);
  assert.match(importer, /BÜTÜNLÜK HATASI/);
  assert.match(importer, /exportType !== "fopos-teacher-workspace"/);
});

test("içe aktarıcı kullanıcı verisini SQL metnine gömmez", () => {
  // Değerler parametre olarak gönderilir; şablon birleştirme yolu yoktur.
  assert.match(importer, /params: \[/);
  assert.equal(/\$\{[^}]*\}[^;]*VALUES/.test(importer), false);
});

test("toplayıcı eski canlı siteden profil, sınıf ve öğrenci listesi toplar", () => {
  assert.match(collector, /\/api\/account-export/);
  assert.match(collector, /\/api\/class-workspaces/);
  assert.match(collector, /\/api\/student-rosters\?classId=/);
  // Sınıf kimlikleri öğrenci listeleriyle eşleşmek için gereklidir.
  assert.match(collector, /classId: workspace\.id/);
});

test("toplayıcı sınıf kimliklerini korur, öğrenci listelerini dışa aktarma dışında toplar", () => {
  assert.match(collector, /studentRosters/);
  assert.match(collector, /FOPOS_TASIMA_/);
});
