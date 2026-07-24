import assert from "node:assert/strict";
import test from "node:test";
import { createSessionToken, digestSessionToken } from "../app/core/session-security.ts";
import {
  findActiveSession,
  insertSession,
  revokeAllUserSessions,
  revokeSession,
} from "../app/server/auth/session-repository.ts";

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
          return { success: true };
        },
        async first() {
          return firstRow;
        },
      };
    },
  };
}

test("oturum deposu ham belirteci SQL parametrelerine yazmaz", async () => {
  const database = databaseDouble();
  const rawToken = createSessionToken();
  const stored = await insertSession(database, {
    id: "session-1",
    userId: "user-1",
    rawToken,
    now: new Date("2026-07-24T08:00:00.000Z"),
  });

  assert.equal(database.calls.length, 1);
  assert.equal(database.calls[0].query.includes(rawToken), false);
  assert.equal(database.calls[0].values.includes(rawToken), false);
  assert.equal(stored.tokenDigest, await digestSessionToken(rawToken));
  assert.equal(database.calls[0].values[2], stored.tokenDigest);
});

test("etkin oturum yalnız belirteç özeti üzerinden bulunur", async () => {
  const rawToken = createSessionToken();
  const tokenDigest = await digestSessionToken(rawToken);
  const database = databaseDouble({
    id: "session-1",
    user_id: "user-1",
    token_digest: tokenDigest,
    created_at: "2026-07-24T08:00:00.000Z",
    last_seen_at: "2026-07-24T08:10:00.000Z",
    expires_at: "2026-07-24T20:00:00.000Z",
    revoked_at: null,
  });

  const session = await findActiveSession(
    database,
    rawToken,
    new Date("2026-07-24T08:20:00.000Z"),
  );

  assert.equal(session?.userId, "user-1");
  assert.deepEqual(database.calls[0].values, [tokenDigest]);
});

test("iptal edilmiş oturum etkin kabul edilmez", async () => {
  const rawToken = createSessionToken();
  const database = databaseDouble({
    id: "session-1",
    user_id: "user-1",
    token_digest: await digestSessionToken(rawToken),
    created_at: "2026-07-24T08:00:00.000Z",
    last_seen_at: "2026-07-24T08:10:00.000Z",
    expires_at: "2026-07-24T20:00:00.000Z",
    revoked_at: "2026-07-24T08:15:00.000Z",
  });

  assert.equal(
    await findActiveSession(
      database,
      rawToken,
      new Date("2026-07-24T08:20:00.000Z"),
    ),
    null,
  );
});

test("tek oturum ve tüm kullanıcı oturumları sunucuda iptal edilir", async () => {
  const database = databaseDouble();
  const now = new Date("2026-07-24T09:00:00.000Z");

  await revokeSession(database, "session-1", now);
  await revokeAllUserSessions(database, "user-1", now);

  assert.match(database.calls[0].query, /WHERE id = \?/u);
  assert.deepEqual(database.calls[0].values, [now.toISOString(), "session-1"]);
  assert.match(database.calls[1].query, /WHERE user_id = \?/u);
  assert.deepEqual(database.calls[1].values, [now.toISOString(), "user-1"]);
});
