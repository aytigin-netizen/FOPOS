import assert from "node:assert/strict";
import test from "node:test";
import {
  createWorkspaceScopedStorage,
  inspectLegacyArchivePresence,
  workspaceArchiveKey,
} from "../app/core/workspace-scoped-storage.ts";
import { RECORD_ARCHIVE_KEY } from "../app/core/pedagogical-record-store.ts";
import {
  findWorkspaceDocument,
  insertWorkspaceDocument,
} from "../app/server/workspace/document-repository.ts";

function memoryStorage() {
  const values = new Map();
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
    values,
  };
}

function databaseDouble(firstRow = null) {
  const calls = [];
  return {
    calls,
    prepare(query) {
      const call = { query, values: [] };
      calls.push(call);
      return {
        bind(...values) {
          call.values = values;
          return this;
        },
        async run() {
          return { success: true, results: [] };
        },
        async first() {
          return firstRow;
        },
      };
    },
  };
}

test("yerel pedagojik arşiv kullanıcı ve çalışma alanına göre ayrılır", () => {
  const storage = memoryStorage();
  const first = createWorkspaceScopedStorage(storage, {
    userId: "user_0001",
    workspaceId: "workspace_0001",
  });
  const second = createWorkspaceScopedStorage(storage, {
    userId: "user_0002",
    workspaceId: "workspace_0002",
  });

  first.setItem(RECORD_ARCHIVE_KEY, "first");
  second.setItem(RECORD_ARCHIVE_KEY, "second");

  assert.equal(first.getItem(RECORD_ARCHIVE_KEY), "first");
  assert.equal(second.getItem(RECORD_ARCHIVE_KEY), "second");
  assert.notEqual(
    workspaceArchiveKey({
      userId: "user_0001",
      workspaceId: "workspace_0001",
    }),
    workspaceArchiveKey({
      userId: "user_0002",
      workspaceId: "workspace_0002",
    }),
  );
});

test("v46 arşivi açık içe aktarma olmadan değiştirilmez", () => {
  const storage = memoryStorage();
  storage.setItem(RECORD_ARCHIVE_KEY, "legacy-v46");

  const scoped = createWorkspaceScopedStorage(storage, {
    userId: "user_0001",
    workspaceId: "workspace_0001",
  });
  scoped.setItem(RECORD_ARCHIVE_KEY, "v47");

  assert.equal(storage.getItem(RECORD_ARCHIVE_KEY), "legacy-v46");
  assert.deepEqual(inspectLegacyArchivePresence(storage), {
    exists: true,
    requiresExplicitImport: true,
  });
});

test("sunucu belge yazımı sahip ve çalışma alanı kimliklerini taşır", async () => {
  const database = databaseDouble();
  await insertWorkspaceDocument(database, {
    schemaVersion: "47.0.0",
    id: "document-1",
    ownerUserId: "user-1",
    workspaceId: "workspace-1",
    kind: "daily_plan",
    state: "draft",
    revision: 1,
    previousRevisionId: null,
    curriculumSourceRefs: ["FEL.10.1.1"],
    traceId: "trace-1",
    createdAt: "2026-07-24T12:00:00.000Z",
    updatedAt: "2026-07-24T12:00:00.000Z",
    payload: { title: "Günlük plan" },
  });

  assert.match(database.calls[0].query, /owner_user_id/u);
  assert.match(database.calls[0].query, /workspace_id/u);
  assert.equal(database.calls[0].values[1], "user-1");
  assert.equal(database.calls[0].values[2], "workspace-1");
});

test("belge okuma yalnız id ile değil sahiplik kapsamıyla yapılır", async () => {
  const database = databaseDouble(null);
  const result = await findWorkspaceDocument(
    database,
    { userId: "user-1", workspaceId: "workspace-1" },
    "document-1",
  );

  assert.equal(result, null);
  assert.match(
    database.calls[0].query,
    /WHERE id = \? AND owner_user_id = \? AND workspace_id = \?/u,
  );
  assert.deepEqual(database.calls[0].values, [
    "document-1",
    "user-1",
    "workspace-1",
  ]);
});
