import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  accessCodeMatches,
  clearSessionCookieHeader,
  createSessionToken,
  readCookie,
  SESSION_COOKIE_NAME,
  sessionCookieHeader,
  verifySessionToken,
} from "../app/core/self-hosted-session.ts";
import {
  getRuntimeEnvironment,
  runWithEnvironment,
  selfHostedIdentityConfigured,
} from "../app/core/runtime-environment.ts";
import { renderSelfHostedLoginPage } from "../app/core/self-hosted-login-page.ts";

const SECRET = "test-session-secret-0123456789";
const EMAIL = "ogretmen@example.com";

test("geçiş kodu yalnız birebir eşleşmede kabul edilir", async () => {
  assert.equal(await accessCodeMatches("koda-123", "koda-123"), true);
  assert.equal(await accessCodeMatches("koda-123", "koda-124"), false);
  assert.equal(await accessCodeMatches("koda-12", "koda-123"), false);
  assert.equal(await accessCodeMatches("", ""), false);
});

test("tanımsız beklenen kod hiçbir girişi kabul etmez", async () => {
  // Boş secret ile üretilmiş bir oturumun kimlik sayılması engellenir.
  assert.equal(await accessCodeMatches("", ""), false);
  assert.equal(await accessCodeMatches("koda", ""), false);
});

test("oturum çerezi imzalanır ve doğrulanır", async () => {
  const token = await createSessionToken(
    { email: EMAIL, name: "Aytekin Yılmaz" },
    SECRET,
  );
  assert.equal(token.includes("."), true);

  const payload = await verifySessionToken(token, SECRET);
  assert.equal(payload?.email, EMAIL);
  assert.equal(payload?.name, "Aytekin Yılmaz");
  assert.equal(payload?.version, 1);
});

test("öğretmen e-postası küçük harfe indirgenir", async () => {
  const token = await createSessionToken(
    { email: "  OGRETMEN@EXAMPLE.COM " },
    SECRET,
  );
  const payload = await verifySessionToken(token, SECRET);
  assert.equal(payload?.email, "ogretmen@example.com");
});

test("kurcalanmış çerez reddedilir", async () => {
  const token = await createSessionToken({ email: EMAIL }, SECRET);
  const [payloadPart, signature] = token.split(".");
  const tamperedPayload = `${payloadPart.slice(0, -2)}XY.${signature}`;
  assert.equal(await verifySessionToken(tamperedPayload, SECRET), null);

  const tamperedSignature = `${payloadPart}.${signature.slice(0, -2)}XY`;
  assert.equal(await verifySessionToken(tamperedSignature, SECRET), null);
});

test("farklı imzalama anahtarı oturumu kabul etmez", async () => {
  const token = await createSessionToken({ email: EMAIL }, SECRET);
  assert.equal(await verifySessionToken(token, "baska-secret"), null);
});

test("süresi dolmuş oturum reddedilir", async () => {
  const now = 1_800_000_000;
  const token = await createSessionToken({ email: EMAIL }, SECRET, {
    now,
    ttlSeconds: 60,
  });
  assert.equal((await verifySessionToken(token, SECRET, { now: now + 30 }))?.email, EMAIL);
  assert.equal(await verifySessionToken(token, SECRET, { now: now + 120 }), null);
});

test("biçimsiz çerez değerleri reddedilir", async () => {
  assert.equal(await verifySessionToken("", SECRET), null);
  assert.equal(await verifySessionToken("nokta yok", SECRET), null);
  assert.equal(await verifySessionToken("..", SECRET), null);
  assert.equal(await verifySessionToken("a.b", SECRET), null);
});

test("çerez başlıkları güvenlik bayraklarını taşır", () => {
  const header = sessionCookieHeader("token-degeri");
  assert.equal(header.includes(`${SESSION_COOKIE_NAME}=token-degeri`), true);
  assert.equal(header.includes("HttpOnly"), true);
  assert.equal(header.includes("Secure"), true);
  assert.equal(header.includes("SameSite=Lax"), true);
  assert.equal(header.includes("Path=/"), true);

  const cleared = clearSessionCookieHeader();
  assert.equal(cleared.includes("Max-Age=0"), true);
  assert.equal(cleared.includes("HttpOnly"), true);
});

test("çerez okuma yalnız adı eşleşen değeri döndürür", () => {
  const header = "a=1; fopos_session=deger; b=2";
  assert.equal(readCookie(header, SESSION_COOKIE_NAME), "deger");
  assert.equal(readCookie(header, "b"), "2");
  assert.equal(readCookie(header, "yok"), null);
  assert.equal(readCookie(null, SESSION_COOKIE_NAME), null);
  assert.equal(readCookie("fopos_session=", SESSION_COOKIE_NAME), null);
});

test("kimlik yalnız üç değer birlikte tanımlıysa etkinleşir", () => {
  assert.equal(selfHostedIdentityConfigured(null), false);
  assert.equal(selfHostedIdentityConfigured({}), false);
  assert.equal(
    selfHostedIdentityConfigured({
      FOPOS_ACCESS_CODE: "a",
      FOPOS_SESSION_SECRET: "b",
    }),
    false,
  );
  assert.equal(
    selfHostedIdentityConfigured({
      FOPOS_ACCESS_CODE: "a",
      FOPOS_SESSION_SECRET: "b",
      FOPOS_TEACHER_EMAIL: EMAIL,
    }),
    true,
  );
});

test("ortam bağlamı istek boyunca erişilebilir kalır", () => {
  assert.equal(getRuntimeEnvironment(), null);
  runWithEnvironment({ FOPOS_TEACHER_EMAIL: EMAIL }, () => {
    assert.equal(getRuntimeEnvironment()?.FOPOS_TEACHER_EMAIL, EMAIL);
  });
});

test("giriş sayfası geçiş kodunu ister ve dönüş adresini korur", () => {
  const html = renderSelfHostedLoginPage({
    returnTo: "/dersler",
    email: EMAIL,
  });
  assert.equal(html.includes('name="code"'), true);
  assert.equal(html.includes('value="/dersler"'), true);
  assert.equal(html.includes("FOPOS"), true);
  assert.equal(html.includes(EMAIL), true);
});

test("giriş sayfası hata mesajını güvenli gösterir", () => {
  const html = renderSelfHostedLoginPage({
    returnTo: "/",
    error: "Geçiş kodu doğru değil.",
  });
  assert.equal(html.includes("Geçiş kodu doğru değil."), true);
  assert.equal(html.includes('role="alert"'), true);
});

test("giriş sayfası dönüş adresindeki HTML'yi kaçırmaz", () => {
  const html = renderSelfHostedLoginPage({
    returnTo: '"><script>alert(1)</script>',
  });
  assert.equal(html.includes("<script>alert(1)</script>"), false);
  assert.equal(html.includes("&lt;script&gt;"), true);
});

test("kimlik katmanı hem Sites başlıklarını hem kendi oturumunu destekler", async () => {
  const identity = await readFile(
    new URL("../app/core/authenticated-user.ts", import.meta.url),
    "utf8",
  );
  const chatGPTAuth = await readFile(
    new URL("../app/chatgpt-auth.ts", import.meta.url),
    "utf8",
  );
  const worker = await readFile(
    new URL("../worker/index.ts", import.meta.url),
    "utf8",
  );

  // Sites başlıkları desteklenmeye devam eder.
  assert.equal(identity.includes("oai-authenticated-user-email"), true);
  assert.equal(chatGPTAuth.includes("authenticatedUserFromHeaders"), true);

  // Worker ortamı kimlik çözümleyicisine taşınır.
  assert.equal(worker.includes("runWithEnvironment"), true);
  assert.equal(worker.includes("FOPOS_SESSION_SECRET"), true);
  assert.equal(chatGPTAuth.includes("getRuntimeEnvironment"), true);
  assert.equal(chatGPTAuth.includes("verifySessionToken"), true);
});

test("giriş ve çıkış rotaları uygulamanın kullandığı yollarda sunulur", async () => {
  const signIn = await readFile(
    new URL("../app/signin-with-chatgpt/route.ts", import.meta.url),
    "utf8",
  );
  const signOut = await readFile(
    new URL("../app/signout-with-chatgpt/route.ts", import.meta.url),
    "utf8",
  );
  const navigation = await readFile(
    new URL("../app/components/navigation/AppNavigation.tsx", import.meta.url),
    "utf8",
  );
  const clientApp = await readFile(
    new URL("../app/ClientApp.tsx", import.meta.url),
    "utf8",
  );

  // İstemci bağlantıları değişmeden kalır: Worker kendi giriş yolunu sunar.
  assert.equal(navigation.includes("/signin-with-chatgpt"), true);
  assert.equal(navigation.includes("/signout-with-chatgpt"), true);
  assert.equal(clientApp.includes("/signin-with-chatgpt"), true);

  // Giriş rotası kodu doğrular, çerez yazar ve dönüş adresini korur.
  assert.equal(signIn.includes("accessCodeMatches"), true);
  assert.equal(signIn.includes("sessionCookieHeader"), true);
  assert.equal(signIn.includes("safeRelativeReturnPath"), true);
  assert.equal(signIn.includes('requestOriginMatches'), true);

  // Çıkış rotası oturumu temizler.
  assert.equal(signOut.includes("clearSessionCookieHeader"), true);
});
