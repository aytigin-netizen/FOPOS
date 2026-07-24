import assert from "node:assert/strict";
import test from "node:test";
import {
  assertTrustedMutationOrigin,
  clearSessionCookie,
  createSessionTimes,
  createSessionToken,
  digestSessionToken,
  isSessionActive,
  readSessionToken,
  serializeSessionCookie,
} from "../app/core/session-security.ts";

test("oturum belirteci yüksek entropili ve URL güvenlidir", () => {
  const first = createSessionToken();
  const second = createSessionToken();

  assert.match(first, /^[A-Za-z0-9_-]{43}$/u);
  assert.notEqual(first, second);
});

test("sunucuda ham belirteç yerine kararlı özet saklanır", async () => {
  const token = createSessionToken();
  const digest = await digestSessionToken(token);

  assert.notEqual(digest, token);
  assert.equal(digest, await digestSessionToken(token));
  assert.match(digest, /^[A-Za-z0-9_-]{43}$/u);
});

test("oturum çerezi güvenlik niteliklerini taşır", () => {
  const token = createSessionToken();
  const cookie = serializeSessionCookie(token);

  assert.match(cookie, /^__Host-fopos_session=/u);
  assert.match(cookie, /Path=\//u);
  assert.match(cookie, /HttpOnly/u);
  assert.match(cookie, /Secure/u);
  assert.match(cookie, /SameSite=Lax/u);
  assert.equal(readSessionToken(cookie), token);
  assert.match(clearSessionCookie(), /Max-Age=0/u);
});

test("oturum mutlak ve hareketsizlik sürelerini birlikte uygular", () => {
  const start = new Date("2026-07-24T08:00:00.000Z");
  const session = createSessionTimes(start);

  assert.equal(
    isSessionActive(session, new Date("2026-07-24T08:29:59.000Z")),
    true,
  );
  assert.equal(
    isSessionActive(session, new Date("2026-07-24T08:30:00.000Z")),
    false,
  );
  assert.equal(
    isSessionActive(
      { ...session, lastSeenAt: "2026-07-24T19:45:00.000Z" },
      new Date("2026-07-24T20:00:00.000Z"),
    ),
    false,
  );
  assert.equal(
    isSessionActive(
      { ...session, revokedAt: "2026-07-24T08:10:00.000Z" },
      new Date("2026-07-24T08:11:00.000Z"),
    ),
    false,
  );
});

test("durum değiştiren istek yalnız aynı origin üzerinden kabul edilir", () => {
  assert.doesNotThrow(() =>
    assertTrustedMutationOrigin(
      "https://fopos.example/api/profile",
      "https://fopos.example",
    ),
  );
  assert.throws(
    () =>
      assertTrustedMutationOrigin(
        "https://fopos.example/api/profile",
        "https://evil.example",
      ),
    /Güvenilmeyen/,
  );
  assert.throws(
    () =>
      assertTrustedMutationOrigin(
        "https://fopos.example/api/profile",
        null,
      ),
    /doğrulanamadı/,
  );
});
