import assert from "node:assert/strict";
import test from "node:test";
import { authenticatedUserFromHeaders } from "../app/core/authenticated-user.ts";

function headers(values = {}) {
  const normalized = new Map(
    Object.entries(values).map(([key, value]) => [
      key.toLocaleLowerCase("en-US"),
      value,
    ]),
  );
  return {
    get(name) {
      return normalized.get(name.toLocaleLowerCase("en-US")) ?? null;
    },
  };
}

test("kimlik başlığı yoksa kullanıcı üretmez", () => {
  assert.equal(authenticatedUserFromHeaders(headers()), null);
  assert.equal(
    authenticatedUserFromHeaders(
      headers({ "oai-authenticated-user-email": "gecersiz" }),
    ),
    null,
  );
});

test("ChatGPT kimliği normalize edilir ve sağlayıcı sınırı açık kalır", () => {
  const user = authenticatedUserFromHeaders(
    headers({
      "oai-authenticated-user-email": " OGRETMEN@EXAMPLE.COM ",
      "oai-authenticated-user-full-name": "Aytekin%20Y%C4%B1lmaz",
      "oai-authenticated-user-full-name-encoding": "percent-encoded-utf-8",
    }),
  );
  assert.deepEqual(user, {
    provider: "chatgpt",
    providerSubject: "ogretmen@example.com",
    displayName: "Aytekin Yılmaz",
    email: "ogretmen@example.com",
    fullName: "Aytekin Yılmaz",
  });
});

test("bozuk veya doğrulanmamış ad değeri e-posta geri dönüşünü kullanır", () => {
  const user = authenticatedUserFromHeaders(
    headers({
      "oai-authenticated-user-email": "ogretmen@example.com",
      "oai-authenticated-user-full-name": "%E0%A4%A",
      "oai-authenticated-user-full-name-encoding": "percent-encoded-utf-8",
    }),
  );
  assert.equal(user?.displayName, "ogretmen@example.com");
  assert.equal(user?.fullName, null);
});
