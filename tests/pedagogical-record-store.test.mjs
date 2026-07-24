import assert from "node:assert/strict";
import test from "node:test";
import { approveRecord, createPedagogicalRecord, reviseRecord, submitForReview } from "../app/core/pedagogical-record.ts";
import { clearRecordArchive, inspectRecordArchive, listRecordRevisions, RECORD_ARCHIVE_KEY, saveRecordRevision } from "../app/core/pedagogical-record-store.ts";

const unit = { code: "F10_U1", name: "Felsefenin Doğası", hours: 10, grade: 10, keywords: [], outcomes: [{ code: "FEL.10.1.1", description: "x", short: "x" }], strategy: "Sorgulama", methods: [], opening: "", inquiry: "", discussion: "", application: "", evidence: "Kanıt" };
const memory = () => { const data = new Map(); return { getItem: (key) => data.get(key) ?? null, setItem: (key, value) => data.set(key, value), removeItem: (key) => data.delete(key) }; };
const draft = () => createPedagogicalRecord({ unit, outcomeCode: "FEL.10.1.1", week: 1, profile: "Dengeli", datasetVersion: "2024.1" });

test("yaşam döngüsü aynı revizyonda, içerik değişikliği yeni revizyonda saklanır", () => {
  const store = memory(), first = draft(), review = submitForReview(first), approved = approveRecord(review, "Kontrol ettim");
  saveRecordRevision(store, first); saveRecordRevision(store, review); saveRecordRevision(store, approved);
  assert.throws(() => saveRecordRevision(store, { ...approved, lessonContext: { ...approved.lessonContext, week: 2 } }), /sessizce/);
  const next = reviseRecord(approved, { lessonContext: { ...approved.lessonContext, week: 2 } }).next;
  saveRecordRevision(store, next);
  assert.deepEqual(listRecordRevisions(store, first.recordId).map((item) => item.revision), [1, 2]);
});

test("bozuk ve uyumsuz arşiv otomatik silinmez", () => {
  for (const raw of ["{bozuk", JSON.stringify({ schemaVersion: "9.0.0", records: {} })]) {
    const store = memory(); store.setItem(RECORD_ARCHIVE_KEY, raw);
    const status = inspectRecordArchive(store);
    assert.ok(["corrupt", "unsupported"].includes(status.state));
    assert.equal(store.getItem(RECORD_ARCHIVE_KEY), raw);
    assert.throws(() => saveRecordRevision(store, draft()), /arşiv|sürümü/);
  }
});

test("arşiv yalnız açık öğretmen onayıyla temizlenir", () => {
  const store = memory(); store.setItem(RECORD_ARCHIVE_KEY, "{bozuk");
  assert.throws(() => clearRecordArchive(store, false), /onayı/);
  assert.equal(store.getItem(RECORD_ARCHIVE_KEY), "{bozuk");
  clearRecordArchive(store, true);
  assert.equal(inspectRecordArchive(store).state, "empty");
});

test("kayıt arşivi öğrenci verisi alanı içermez ve güvenli boyut sınırı uygular", () => {
  const store = memory(), record = draft();
  saveRecordRevision(store, record);
  const raw = store.getItem(RECORD_ARCHIVE_KEY);
  assert.ok(raw);
  assert.doesNotMatch(raw, /student|öğrenci|schoolNumber|fullName/i);
  store.setItem(RECORD_ARCHIVE_KEY, "x".repeat(512_001));
  assert.equal(inspectRecordArchive(store).state, "oversized");
  assert.throws(() => listRecordRevisions(store, record.recordId), /boyut sınırını/);
});
