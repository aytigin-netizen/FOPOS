import assert from "node:assert/strict";
import test from "node:test";
import { insertAccount } from "../app/server/auth/account-repository.ts";
import { ensurePersonalWorkspace } from "../app/server/workspace/personal-workspace-repository.ts";

function batchDatabase(firstRow = null) {
  const calls = [];
  const batches = [];

  return {
    calls,
    batches,
    prepare(query) {
      const call = { query, values: [] };
      calls.push(call);
      return {
        bind(...values) {
          call.values = values;
          return this;
        },
        async run() {
          return { success: true };
        },
        async first() {
          return firstRow;
        },
      };
    },
    async batch(statements) {
      batches.push(statements);
      return statements.map(() => ({ success: true }));
    },
  };
}

test("kullanıcı ve sağlayıcı kimliği aynı atomik işlemde oluşturulur", async () => {
  const database = batchDatabase();
  const account = await insertAccount(database, {
    userId: "user-1",
    identityAccountId: "identity-1",
    identity: {
      provider: "google",
      providerSubject: "subject-1",
      emailNormalized: "teacher@example.com",
      displayName: "Aytekin Öğretmen",
    },
    now: new Date("2026-07-24T10:00:00.000Z"),
  });

  assert.equal(account.id, "user-1");
  assert.equal(database.batches.length, 1);
  assert.equal(database.batches[0].length, 2);
  assert.match(database.calls[0].query, /INSERT INTO users/u);
  assert.match(database.calls[1].query, /INSERT INTO identity_accounts/u);
});

test("kişisel alan kurulumu tek atomik ve tekrar çalıştırılabilir işlem kullanır", async () => {
  const database = batchDatabase({
    workspace_id: "workspace-1",
    workspace_name: "Aytekin Öğretmen Çalışma Alanı",
    profile_id: "profile-1",
    owner_user_id: "user-1",
    display_name: "Aytekin Öğretmen",
    branch: "Felsefe",
    school_name: "Örnek Anadolu Lisesi",
    academic_year: "2026-2027",
    locale: "tr-TR",
    profile_created_at: "2026-07-24T10:00:00.000Z",
    profile_updated_at: "2026-07-24T10:00:00.000Z",
  });

  const workspace = await ensurePersonalWorkspace(database, {
    userId: "user-1",
    workspaceId: "workspace-1",
    profileId: "profile-1",
    profile: {
      displayName: "Aytekin Öğretmen",
      schoolName: "Örnek Anadolu Lisesi",
      academicYear: "2026-2027",
    },
    now: new Date("2026-07-24T10:00:00.000Z"),
  });

  assert.equal(workspace.id, "workspace-1");
  assert.equal(workspace.profile.ownerUserId, "user-1");
  assert.equal(database.batches.length, 1);
  assert.equal(database.batches[0].length, 3);
  assert.match(database.calls[0].query, /ON CONFLICT\(personal_owner_user_id\) DO NOTHING/u);
  assert.match(database.calls[1].query, /ON CONFLICT\(workspace_id, user_id\) DO NOTHING/u);
  assert.match(database.calls[2].query, /ON CONFLICT\(owner_user_id, workspace_id\) DO NOTHING/u);
});
