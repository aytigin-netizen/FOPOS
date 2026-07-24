import assert from "node:assert/strict";
import test from "node:test";
import {
  identityAccountKey,
  normalizeVerifiedIdentity,
} from "../app/core/verified-identity.ts";

test("doğrulanmış sağlayıcı kimliği kanonik hesaba dönüştürülür", () => {
  const identity = normalizeVerifiedIdentity({
    provider: "google",
    providerSubject: "google-user-1",
    email: " Aytekin@Example.COM ",
    emailVerified: true,
    displayName: "  Aytekin   Öğretmen ",
  });

  assert.equal(identity.emailNormalized, "aytekin@example.com");
  assert.equal(identity.displayName, "Aytekin Öğretmen");
  assert.equal(identityAccountKey(identity), "google:google-user-1");
});

test("doğrulanmamış e-posta reddedilir", () => {
  assert.throws(
    () =>
      normalizeVerifiedIdentity({
        provider: "oidc",
        providerSubject: "subject-1",
        email: "teacher@example.com",
        emailVerified: false,
      }),
    /Doğrulanmamış/,
  );
});

test("geçersiz e-posta sağlayıcıdan gelse bile reddedilir", () => {
  assert.throws(
    () =>
      normalizeVerifiedIdentity({
        provider: "microsoft",
        providerSubject: "subject-1",
        email: "not-an-email",
        emailVerified: true,
      }),
    /Geçersiz e-posta/,
  );
});
