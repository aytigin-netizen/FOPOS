import assert from "node:assert/strict";
import test from "node:test";
import { assertGenerationMatchesRecord } from "../app/core/document-generation-record.ts";
import { listDocumentGenerations } from "../db/document-generations.ts";
import { runWithDatabase } from "../db/runtime-env.ts";
import fs from "node:fs";

function decodeCursor(cursor) {
  const normalized = cursor.replace(/-/gu, "+").replace(/_/gu, "/").padEnd(Math.ceil(cursor.length / 4) * 4, "=");
  return JSON.parse(Buffer.from(normalized, "base64").toString("utf8"));
}

function fakeDocumentGenerationDatabase(rows) {
  return {
    prepare(sql) {
      let args = [];
      return {
        bind(...values) {
          args = values;
          return this;
        },
        async all() {
          let filtered = [...rows];
          const userId = args[0];
          const academicYear = args[1];
          filtered = filtered.filter((row) => row.user_id === userId && row.academic_year === academicYear);
          if (sql.includes("document_type = ?")) {
            const documentType = args[2];
            filtered = filtered.filter((row) => row.document_type === documentType);
          }
          if (sql.includes("curriculum_id = ?")) {
            const curriculumId = args[sql.includes("document_type = ?") ? 3 : 2];
            filtered = filtered.filter((row) => row.curriculum_id === curriculumId);
          }
          if (sql.includes("id = ? OR id LIKE")) {
            const searchIndex = 2 + (sql.includes("document_type = ?") ? 1 : 0) + (sql.includes("curriculum_id = ?") ? 1 : 0);
            const search = String(args[searchIndex]);
            filtered = filtered.filter((row) =>
              row.id === search ||
              row.id.toLowerCase().startsWith(search.toLowerCase()) ||
              row.request_id.toLowerCase().startsWith(search.toLowerCase()) ||
              row.decision_id.toLowerCase().startsWith(search.toLowerCase()) ||
              row.record_id.toLowerCase().startsWith(search.toLowerCase()),
            );
          }
          if (sql.includes("generated_at < ? OR (generated_at = ? AND id < ?)") && args.length >= 4) {
            const offsetIndex = args.length - 4;
            const generatedAt = String(args[offsetIndex]);
            const generatedAtEq = String(args[offsetIndex + 1]);
            const id = String(args[offsetIndex + 2]);
            filtered = filtered.filter((row) =>
              row.generated_at < generatedAt ||
              (row.generated_at === generatedAtEq && row.id < id),
            );
          }
          filtered.sort((a, b) => (a.generated_at === b.generated_at ? (a.id < b.id ? 1 : -1) : (a.generated_at < b.generated_at ? 1 : -1)));
          const limit = Number(args.at(-1));
          return { results: filtered.slice(0, limit) };
        },
      };
    },
  };
}

const record = {
  schemaVersion: "1.0.0", recordId: "OPUS-PR-pilot", revision: 2, status: "approved",
  createdAt: "2026-07-31T15:00:00.000Z", updatedAt: "2026-07-31T15:30:00.000Z", previousRevision: 1,
  approval: { approvedAt: "2026-07-31T15:30:00.000Z", statement: "Kontrol ettim", actorRole: "teacher" },
  curriculum: { subjectCode: "philosophy", datasetVersion: "2024.1", grade: 10, unitCode: "F10_U1", outcomeCode: "FEL.10.1.1" },
  lessonContext: { week: 1, durationMinutes: 80, profile: "Dengeli" },
  pedagogicalDecision: { strategy: "Sorgulama", methods: [], learningEvidence: "Gerekçeli görüş" },
};
const trace = {
  eventId: "123e4567-e89b-12d3-a456-426614174000", contractVersion: "1.1.0", decisionId: "decision:OPUS-PR-pilot:r2", requestId: "OPUS-OUT-pilot:daily-plan",
  documentType: "daily-plan", teacherId: "current-teacher", approvedAt: "2026-07-31T15:30:00.000Z",
  curriculum: { moduleId: "fopos", curriculumId: "philosophy-tr-2024", gradeLevelId: "grade-10", unitId: "f10-u1", outcomeCode: "FEL.10.1.1" },
};

test("üretim izi onaylı karar, revizyon ve müfredat kaynağına bağlanır", () => {
  assert.deepEqual(assertGenerationMatchesRecord(trace, record), { recordId: record.recordId, revision: 2 });
});
test("başka revizyon veya müfredat kaynağı adına üretim izi oluşturulamaz", () => {
  assert.throws(() => assertGenerationMatchesRecord({ ...trace, decisionId: "decision:OPUS-PR-pilot:r3" }, record), /uyuşmuyor/);
  assert.throws(() => assertGenerationMatchesRecord({ ...trace, curriculum: { ...trace.curriculum, curriculumId: "logic-tr-2026" } }, record), /uyuşmuyor/);
});
test("onaysız karar kalıcı belge üretim izine dönüşemez", () => {
  assert.throws(() => assertGenerationMatchesRecord(trace, { ...record, status: "in_review", approval: null }), /uyuşmuyor/);
});

test("her gerçek indirme ayrı ve değişmez üretim olayıdır", () => {
  const repository = fs.readFileSync(new URL("../db/document-generations.ts", import.meta.url), "utf8");
  const migration = fs.readFileSync(new URL("../drizzle/0009_generation_events.sql", import.meta.url), "utf8");
  assert.match(repository, /const eventId = provenance\.eventId/u);
  assert.doesNotMatch(repository, /SELECT generated_at FROM document_generations/u);
  assert.match(migration, /DROP INDEX `document_generations_user_request_idx`/u);
  assert.match(migration, /CREATE INDEX `document_generations_user_request_idx`/u);
});

test("denetim görünümü filtreleme, karar ayrıntısı ve öğrenci verisiz JSON dışa aktarımı sunar", () => {
  const archive = fs.readFileSync(new URL("../app/modules/record-archive/RecordArchiveModule.tsx", import.meta.url), "utf8");
  assert.match(archive, /Olay, karar, istek veya kayıt kimliği/u);
  assert.match(archive, /Bu belge hangi karardan üretildi\?/u);
  assert.match(archive, /containsStudentPersonalData: false/u);
  assert.match(archive, /JSON denetim paketi/u);
  assert.match(archive, /annual-plan/u);
  assert.match(archive, /Elimdeki DOCX’i doğrula/u);
  assert.match(archive, /sha256Hex/u);
  assert.match(archive, /Denetim paketini doğrula/u);
  assert.match(archive, /Geçerli/u);
  assert.match(archive, /Reddedildi/u);
  assert.match(archive, /verifyGenerationAuditPackageFile/u);
  assert.match(archive, /arşiv kayıtları değiştirilmez/u);
  assert.match(archive, /isGenerationAuditPackageFileSizeAllowed\(file.size\)/u);
  assert.match(archive, /GENERATION_AUDIT_PACKAGE_MAX_EVENT_COUNT/u);
  assert.match(archive, /GENERATION_AUDIT_PACKAGE_MAX_FILE_SIZE_BYTES/u);
  assert.match(archive, /daha küçük bir denetim paketi seçin/u);
});

test("Pilot 1.9 nihai dosya özetini saklar ve eski olayları özet yok durumuyla korur", () => {
  const repository = fs.readFileSync(new URL("../db/document-generations.ts", import.meta.url), "utf8");
  const migration = fs.readFileSync(new URL("../drizzle/0010_artifact_integrity.sql", import.meta.url), "utf8");
  assert.match(repository, /artifact_sha256/u);
  assert.match(repository, /row\.artifact_sha256 \?/u);
  assert.match(migration, /ADD `artifact_sha256` text/u);
});

test("Pilot 2.1 üretim arşivini kararlı bileşik imleçle sayfalar", async () => {
  const repository = fs.readFileSync(new URL("../db/document-generations.ts", import.meta.url), "utf8");
  const migration = fs.readFileSync(new URL("../drizzle/0011_generation_archive_cursor.sql", import.meta.url), "utf8");
  assert.match(repository, /ORDER BY generated_at DESC, id DESC LIMIT \?/u);
  assert.match(repository, /generated_at < \? OR \(generated_at = \? AND id < \?\)/u);
  assert.match(repository, /pageSize \+ 1/u);
  assert.match(repository, /version: "1\.1\.0"/u);
  assert.doesNotMatch(repository, /LIMIT 500/u);
  assert.match(migration, /`academic_year`,`generated_at`,`id`/u);
  assert.match(migration, /`academic_year`,`document_type`,`generated_at`,`id`/u);
});

test("tam olay kimliği ve önek araması sayfalar", async () => {
  const rows = [
    {
      id: "123e4567-e89b-12d3-a456-426614174000",
      user_id: "teacher-a",
      request_id: "OPUS-OUT-pilot:daily-plan",
      decision_id: "decision:OPUS-PR-pilot:r2",
      record_id: "OPUS-PR-pilot",
      revision: 2,
      document_type: "daily-plan",
      contract_version: "1.1.0",
      approved_at: "2026-07-31T15:30:00.000Z",
      generated_at: "2026-07-31T16:00:00.000Z",
      curriculum_id: "philosophy-tr-2024",
      curriculum_dataset_version: "2024.1",
      curriculum_outcome_code: "FEL.10.1.1",
      curriculum_json: JSON.stringify({ moduleId: "fopos", curriculumId: "philosophy-tr-2024", gradeLevelId: "grade-10", unitId: "f10-u1", outcomeCode: "FEL.10.1.1" }),
      academic_year: "2026-2027",
      artifact_integrity_algorithm: "SHA-256",
      artifact_sha256: "abc123",
    },
    {
      id: "223e4567-e89b-12d3-a456-426614174000",
      user_id: "teacher-a",
      request_id: "OPUS-OUT-pilot:annual-plan",
      decision_id: "decision:OPUS-PR-pilot:r3",
      record_id: "OPUS-PR-pilot",
      revision: 3,
      document_type: "annual-plan",
      contract_version: "1.1.0",
      approved_at: "2026-07-31T16:30:00.000Z",
      generated_at: "2026-07-31T17:00:00.000Z",
      curriculum_id: "philosophy-tr-2024",
      curriculum_dataset_version: "2024.1",
      curriculum_outcome_code: "FEL.10.1.1",
      curriculum_json: JSON.stringify({ moduleId: "fopos", curriculumId: "philosophy-tr-2024", gradeLevelId: "grade-10", unitId: "f10-u1", outcomeCode: "FEL.10.1.1" }),
      academic_year: "2026-2027",
      artifact_integrity_algorithm: "SHA-256",
      artifact_sha256: "abc123",
    },
  ];
  const database = fakeDocumentGenerationDatabase(rows);
  const payload = await runWithDatabase(database, () =>
    listDocumentGenerations("teacher-a", "2026-2027", { search: "123e4567-e89b-12d3-a456-426614174000" }),
  );
  assert.equal(payload.items.length, 1);
  assert.equal(payload.items[0].eventId, "123e4567-e89b-12d3-a456-426614174000");

  const prefixPayload = await runWithDatabase(database, () =>
    listDocumentGenerations("teacher-a", "2026-2027", { search: "OPUS-" }),
  );
  assert.equal(prefixPayload.items.length, 2);
});

test("bir veya iki karakter aramayı reddeder", async () => {
  const rows = [];
  const database = fakeDocumentGenerationDatabase(rows);
  await assert.rejects(
    async () => runWithDatabase(database, () =>
      listDocumentGenerations("teacher-a", "2026-2027", { search: "OP" }),
    ),
    /Arama en az 3 karakter olmalıdır\./u,
  );
});

test("curriculumSource tam eşleşmesi yapar", async () => {
  const rows = [
    {
      id: "123e4567-e89b-12d3-a456-426614174000",
      user_id: "teacher-a",
      request_id: "req-1",
      decision_id: "decision:OPUS-PR-pilot:r2",
      record_id: "OPUS-PR-pilot",
      revision: 2,
      document_type: "daily-plan",
      contract_version: "1.1.0",
      approved_at: "2026-07-31T15:30:00.000Z",
      generated_at: "2026-07-31T16:00:00.000Z",
      curriculum_id: "philosophy-tr-2024",
      curriculum_dataset_version: "2024.1",
      curriculum_outcome_code: "FEL.10.1.1",
      curriculum_json: JSON.stringify({ moduleId: "fopos", curriculumId: "philosophy-tr-2024", gradeLevelId: "grade-10", unitId: "f10-u1", outcomeCode: "FEL.10.1.1" }),
      academic_year: "2026-2027",
      artifact_integrity_algorithm: "SHA-256",
      artifact_sha256: "abc123",
    },
    {
      id: "223e4567-e89b-12d3-a456-426614174000",
      user_id: "teacher-a",
      request_id: "req-2",
      decision_id: "decision:OPUS-PR-pilot:r3",
      record_id: "OPUS-PR-pilot",
      revision: 3,
      document_type: "annual-plan",
      contract_version: "1.1.0",
      approved_at: "2026-07-31T16:30:00.000Z",
      generated_at: "2026-07-31T17:00:00.000Z",
      curriculum_id: "logic-tr-2026",
      curriculum_dataset_version: "2026.1",
      curriculum_outcome_code: "FEL.10.1.1",
      curriculum_json: JSON.stringify({ moduleId: "fopos", curriculumId: "logic-tr-2026", gradeLevelId: "grade-10", unitId: "f10-u1", outcomeCode: "FEL.10.1.1" }),
      academic_year: "2026-2027",
      artifact_integrity_algorithm: "SHA-256",
      artifact_sha256: "abc123",
    },
  ];
  const database = fakeDocumentGenerationDatabase(rows);
  const payload = await runWithDatabase(database, () =>
    listDocumentGenerations("teacher-a", "2026-2027", { curriculumId: "philosophy-tr-2024" }),
  );
  assert.equal(payload.items.length, 1);
  assert.equal(payload.items[0].curriculum.curriculumId, "philosophy-tr-2024");
});

test("queryScope farklı ise imleç reddedilir", async () => {
  const rows = Array.from({ length: 21 }, (_, index) => ({
    id: `123e4567-e89b-12d3-a456-4266141740${String(index).padStart(2, "0")}`,
    user_id: "teacher-a",
    request_id: `OPUS-${index}`,
    decision_id: `decision:OPUS-PR-pilot:r${index}`,
    record_id: "OPUS-PR-pilot",
    revision: 1,
    document_type: "daily-plan",
    contract_version: "1.1.0",
    approved_at: "2026-07-31T15:30:00.000Z",
    generated_at: `2026-07-31T16:${String(59 - index).padStart(2, "0")}:00.000Z`,
    curriculum_id: "philosophy-tr-2024",
    curriculum_dataset_version: "2024.1",
    curriculum_outcome_code: "FEL.10.1.1",
    curriculum_json: JSON.stringify({ moduleId: "fopos", curriculumId: "philosophy-tr-2024", gradeLevelId: "grade-10", unitId: "f10-u1", outcomeCode: "FEL.10.1.1" }),
    academic_year: "2026-2027",
    artifact_integrity_algorithm: "SHA-256",
    artifact_sha256: "abc123",
  }));
  const database = fakeDocumentGenerationDatabase(rows);
  const first = await runWithDatabase(database, () =>
    listDocumentGenerations("teacher-a", "2026-2027", { search: "OPUS-", pageSize: 20 }),
  );
  const cursor = first.nextCursor;
  assert(cursor, "expected a nextCursor for pagination");
  await assert.rejects(
    async () => runWithDatabase(database, () =>
      listDocumentGenerations("teacher-a", "2026-2027", { cursor, documentType: "annual-plan" }),
    ),
    /İmleç mevcut filtre kapsamıyla uyuşmuyor\./u,
  );
});

test("aynı scope ile sonraki sayfa döner", async () => {
  const rows = Array.from({ length: 25 }, (_, index) => ({
    id: `123e4567-e89b-12d3-a456-4266141740${String(index).padStart(2, "0")}`,
    user_id: "teacher-a",
    request_id: `req-${index}`,
    decision_id: `decision:OPUS-PR-pilot:r${index + 1}`,
    record_id: "OPUS-PR-pilot",
    revision: 1,
    document_type: "daily-plan",
    contract_version: "1.1.0",
    approved_at: "2026-07-31T15:30:00.000Z",
    generated_at: `2026-07-31T16:${String(59 - index).padStart(2, "0")}:00.000Z`,
    curriculum_id: "philosophy-tr-2024",
    curriculum_dataset_version: "2024.1",
    curriculum_outcome_code: "FEL.10.1.1",
    curriculum_json: JSON.stringify({ moduleId: "fopos", curriculumId: "philosophy-tr-2024", gradeLevelId: "grade-10", unitId: "f10-u1", outcomeCode: "FEL.10.1.1" }),
    academic_year: "2026-2027",
    artifact_integrity_algorithm: "SHA-256",
    artifact_sha256: "abc123",
  }));
  const database = fakeDocumentGenerationDatabase(rows);
  const first = await runWithDatabase(database, () =>
    listDocumentGenerations("teacher-a", "2026-2027", { pageSize: 20 }),
  );
  assert.equal(first.items.length, 20);
  assert.equal(first.hasMore, true);
  const second = await runWithDatabase(database, () =>
    listDocumentGenerations("teacher-a", "2026-2027", { pageSize: 20, cursor: first.nextCursor }),
  );
  assert.equal(second.items.length, 5);
});

test("search-results imleci type alanını taşır", async () => {
  const rows = Array.from({ length: 25 }, (_, index) => ({
    id: `123e4567-e89b-12d3-a456-4266141740${String(index).padStart(2, "0")}`,
    user_id: "teacher-a",
    request_id: `req-${index}`,
    decision_id: `decision:OPUS-PR-pilot:r${index}`,
    record_id: "OPUS-PR-pilot",
    revision: 1,
    document_type: "daily-plan",
    contract_version: "1.1.0",
    approved_at: "2026-07-31T15:30:00.000Z",
    generated_at: `2026-07-31T16:${String(59 - index).padStart(2, "0")}:00.000Z`,
    curriculum_id: "philosophy-tr-2024",
    curriculum_dataset_version: "2024.1",
    curriculum_outcome_code: "FEL.10.1.1",
    curriculum_json: JSON.stringify({ moduleId: "fopos", curriculumId: "philosophy-tr-2024", gradeLevelId: "grade-10", unitId: "f10-u1", outcomeCode: "FEL.10.1.1" }),
    academic_year: "2026-2027",
    artifact_integrity_algorithm: "SHA-256",
    artifact_sha256: "abc123",
  }));
  const database = fakeDocumentGenerationDatabase(rows);
  const first = await runWithDatabase(database, () => listDocumentGenerations("teacher-a", "2026-2027", { search: "OPUS-", pageSize: 20, scope: "search-results" }));
  const decoded = decodeCursor(first.nextCursor);
  assert.equal(decoded.queryScope.type, "search-results");
  assert.equal(decoded.queryScope.eventId, "OPUS-");
  assert.equal(decoded.queryScope.decisionId, "OPUS-");
});

test("etkin olmayan filtreler null değil, nesneden çıkarılır", async () => {
  const rows = Array.from({ length: 25 }, (_, index) => ({
    id: `123e4567-e89b-12d3-a456-4266141740${String(index).padStart(2, "0")}`,
    user_id: "teacher-a",
    request_id: `req-${index}`,
    decision_id: `decision:OPUS-PR-pilot:r${index}`,
    record_id: "OPUS-PR-pilot",
    revision: 1,
    document_type: "daily-plan",
    contract_version: "1.1.0",
    approved_at: "2026-07-31T15:30:00.000Z",
    generated_at: `2026-07-31T16:${String(59 - index).padStart(2, "0")}:00.000Z`,
    curriculum_id: "philosophy-tr-2024",
    curriculum_dataset_version: "2024.1",
    curriculum_outcome_code: "FEL.10.1.1",
    curriculum_json: JSON.stringify({ moduleId: "fopos", curriculumId: "philosophy-tr-2024", gradeLevelId: "grade-10", unitId: "f10-u1", outcomeCode: "FEL.10.1.1" }),
    academic_year: "2026-2027",
    artifact_integrity_algorithm: "SHA-256",
    artifact_sha256: "abc123",
  }));
  const database = fakeDocumentGenerationDatabase(rows);
  const first = await runWithDatabase(database, () => listDocumentGenerations("teacher-a", "2026-2027", { search: "OPUS-", pageSize: 20, scope: "search-results" }));
  const decoded = decodeCursor(first.nextCursor);
  assert.equal(decoded.queryScope.documentType, undefined);
  assert.equal(decoded.queryScope.curriculumSource, undefined);
  assert.equal(decoded.queryScope.eventId, "OPUS-");
});

test("tam yıl imleci yalnız type ve academicYear içerir", async () => {
  const rows = Array.from({ length: 25 }, (_, index) => ({
    id: `123e4567-e89b-12d3-a456-4266141740${String(index).padStart(2, "0")}`,
    user_id: "teacher-a",
    request_id: `req-${index}`,
    decision_id: `decision:OPUS-PR-pilot:r${index}`,
    record_id: "OPUS-PR-pilot",
    revision: 1,
    document_type: "daily-plan",
    contract_version: "1.1.0",
    approved_at: "2026-07-31T15:30:00.000Z",
    generated_at: `2026-07-31T16:${String(59 - index).padStart(2, "0")}:00.000Z`,
    curriculum_id: "philosophy-tr-2024",
    curriculum_dataset_version: "2024.1",
    curriculum_outcome_code: "FEL.10.1.1",
    curriculum_json: JSON.stringify({ moduleId: "fopos", curriculumId: "philosophy-tr-2024", gradeLevelId: "grade-10", unitId: "f10-u1", outcomeCode: "FEL.10.1.1" }),
    academic_year: "2026-2027",
    artifact_integrity_algorithm: "SHA-256",
    artifact_sha256: "abc123",
  }));
  const database = fakeDocumentGenerationDatabase(rows);
  const first = await runWithDatabase(database, () => listDocumentGenerations("teacher-a", "2026-2027", { pageSize: 20, scope: "academic-year" }));
  const decoded = decodeCursor(first.nextCursor);
  assert.deepEqual(decoded.queryScope, { type: "academic-year", academicYear: "2026-2027" });
});

test("tam yıl kapsamına filtre verince ret edilir", async () => {
  const rows = [];
  const database = fakeDocumentGenerationDatabase(rows);
  await assert.rejects(
    async () => runWithDatabase(database, () => listDocumentGenerations("teacher-a", "2026-2027", { scope: "academic-year", documentType: "daily-plan" })),
    /Tam yıl kapsamı/u,
  );
});

test("farklı type kullanan imleç reddedilir", async () => {
  const rows = Array.from({ length: 25 }, (_, index) => ({
    id: `123e4567-e89b-12d3-a456-4266141740${String(index).padStart(2, "0")}`,
    user_id: "teacher-a",
    request_id: `req-${index}`,
    decision_id: `decision:OPUS-PR-pilot:r${index}`,
    record_id: "OPUS-PR-pilot",
    revision: 1,
    document_type: "daily-plan",
    contract_version: "1.1.0",
    approved_at: "2026-07-31T15:30:00.000Z",
    generated_at: `2026-07-31T16:${String(59 - index).padStart(2, "0")}:00.000Z`,
    curriculum_id: "philosophy-tr-2024",
    curriculum_dataset_version: "2024.1",
    curriculum_outcome_code: "FEL.10.1.1",
    curriculum_json: JSON.stringify({ moduleId: "fopos", curriculumId: "philosophy-tr-2024", gradeLevelId: "grade-10", unitId: "f10-u1", outcomeCode: "FEL.10.1.1" }),
    academic_year: "2026-2027",
    artifact_integrity_algorithm: "SHA-256",
    artifact_sha256: "abc123",
  }));
  const database = fakeDocumentGenerationDatabase(rows);
  const first = await runWithDatabase(database, () => listDocumentGenerations("teacher-a", "2026-2027", { search: "OPUS-", pageSize: 20, scope: "search-results" }));
  await assert.rejects(
    async () => runWithDatabase(database, () => listDocumentGenerations("teacher-a", "2026-2027", { pageSize: 20, cursor: first.nextCursor, scope: "academic-year" })),
    /İmleç mevcut filtre kapsamıyla uyuşmuyor\./u,
  );
});

test("eventId önek indeksleri migration içinde bulunur", () => {
  const migration = fs.readFileSync(new URL("../drizzle/0012_generation_archive_search_indexes.sql", import.meta.url), "utf8");
  assert.match(migration, /document_generations_user_year_event_id_idx/u);
  assert.match(migration, /COLLATE NOCASE/u);
});

test("JSON paketleri OPUS queryScope şeklini kullanır", () => {
  const archive = fs.readFileSync(new URL("../app/modules/record-archive/RecordArchiveModule.tsx", import.meta.url), "utf8");
  assert.match(archive, /type: "search-results"/u);
  assert.match(archive, /type: "academic-year"/u);
  assert.match(archive, /Arama sonuçları/u);
  assert.match(archive, /arama-sonuclari/u);
});

test("Pilot 2.0 öğretim yılı ve belge türü filtrelerini sunucuya taşır", () => {
  const route = fs.readFileSync(new URL("../app/api/document-generations/route.ts", import.meta.url), "utf8");
  const archive = fs.readFileSync(new URL("../app/modules/record-archive/RecordArchiveModule.tsx", import.meta.url), "utf8");
  assert.match(route, /export async function GET/u);
  assert.match(route, /documentType/u);
  assert.match(route, /rawScope !== null && rawScope !== "search-results" && rawScope !== "academic-year"/u);
  assert.match(route, /scope,/u);
  assert.match(archive, /olay daha yükle/u);
  assert.match(archive, /Öğretim yılının tamamı/u);
});

test("Pilot 2.1 yalnız desteklenen sayfa boyutlarını kabul eder", async () => {
  const database = fakeDocumentGenerationDatabase([]);
  for (const pageSize of [20, 50, 100]) {
    const page = await runWithDatabase(database, () =>
      listDocumentGenerations("teacher-a", "2026-2027", { pageSize }),
    );
    assert.equal(page.pageSize, pageSize);
  }
  const defaultPage = await runWithDatabase(database, () =>
    listDocumentGenerations("teacher-a", "2026-2027"),
  );
  assert.equal(defaultPage.pageSize, 50);
  for (const pageSize of [21, Number.NaN, -1, 20.5]) {
    await assert.rejects(
      async () => runWithDatabase(database, () =>
        listDocumentGenerations("teacher-a", "2026-2027", { pageSize }),
      ),
      /Sayfa boyutu geçersiz\./u,
    );
  }
});

test("bilinmeyen arşiv kapsamı reddedilir", async () => {
  const database = fakeDocumentGenerationDatabase([]);
  await assert.rejects(
    async () => runWithDatabase(database, () =>
      listDocumentGenerations("teacher-a", "2026-2027", { scope: "unknown" }),
    ),
    /Arşiv kapsamı geçersiz\./u,
  );
});

test("imleç queryScope type alanını ve kapsam biçimini katı doğrular", async () => {
  const database = fakeDocumentGenerationDatabase([]);
  const baseCursor = {
    version: "1.1.0",
    generatedAt: "2026-07-31T16:00:00.000Z",
    eventId: "123e4567-e89b-12d3-a456-426614174000",
  };
  const encode = (value) => Buffer.from(JSON.stringify(value), "utf8").toString("base64url");

  for (const queryScope of [
    { academicYear: "2026-2027" },
    { type: "unknown", academicYear: "2026-2027" },
    { type: "academic-year", academicYear: "2026-2027", eventId: "OPUS-" },
  ]) {
    await assert.rejects(
      async () => runWithDatabase(database, () =>
        listDocumentGenerations("teacher-a", "2026-2027", {
          cursor: encode({ ...baseCursor, queryScope }),
        }),
      ),
      /Üretim arşivi imleci geçersiz\./u,
    );
  }
});

