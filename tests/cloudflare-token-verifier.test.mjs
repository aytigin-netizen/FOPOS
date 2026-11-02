import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { crc32 } from "node:zlib";
import { promisify } from "node:util";
import test from "node:test";

const run = promisify(execFile);

const SCRIPT = "scripts/verify-cloudflare-token.mjs";

// Örnek token KAYNAK KODDA LİTERAL OLARAK YAZILMAZ: geçerli CRC32 checksum
// taşıyan bir dizi GitHub push koruması tarafından gerçek Cloudflare token'ı
// sanar ve push'u reddeder. Bu yüzden çalışma anında üretilir.
const BODY = "FOPOSdeployTokenExampleBody0123456789abc";
const VALID_TOKEN = `cfut_${BODY}${crc32(BODY).toString(16).padStart(8, "0")}`;

test("örnek token tam 53 karakter ve geçerli checksum taşır", () => {
  assert.equal(VALID_TOKEN.length, 53);
  assert.equal(VALID_TOKEN.startsWith("cfut_"), true);
});

const verify = async (token, extraArgs = []) => {
  try {
    const { stdout } = await run("node", [SCRIPT, ...extraArgs, token], { cwd: process.cwd() });
    return { code: 0, stdout };
  } catch (error) {
    return { code: error.code ?? 1, stdout: `${error.stdout ?? ""}${error.stderr ?? ""}` };
  }
};

test("geçerli token checksum ile onaylanır", async () => {
  const result = await verify(VALID_TOKEN);
  assert.equal(result.code, 0, result.stdout);
  assert.match(result.stdout, /uzunluk: 53/);
  assert.match(result.stdout, /checksum doğru/);
});

test("bir karakter eksik token yeniden kurulur ve konumu bildirilir", async () => {
  const result = await verify(VALID_TOKEN.slice(0, 52));
  assert.equal(result.code, 1, result.stdout);
  assert.match(result.stdout, /1 karakter eksik/);
  // Sessiz kipte sırrın kendisi yazılmaz.
  const quiet = await verify(VALID_TOKEN.slice(0, 52), ["--quiet"]);
  assert.equal(quiet.code, 1, quiet.stdout);
  assert.match(quiet.stdout, /Eksik karakter 52\. konumda/);
  assert.ok(!quiet.stdout.includes(VALID_TOKEN), "sessiz kipte token loglanmamalı");
});

test("bir karakter fazla token çözülür", async () => {
  const result = await verify(`${VALID_TOKEN}x`);
  assert.equal(result.code, 1, result.stdout);
  assert.match(result.stdout, /1 karakter fazla/);
});

test("checksum uyuşmayan gövde reddedilir", async () => {
  const tampered = `cfut_${"A".repeat(40)}00000000`;
  const result = await verify(tampered);
  assert.equal(result.code, 1, result.stdout);
  assert.match(result.stdout, /checksum yanlış/);
});

test("token biçimi yanlışsa açık biçim beklentisi bildirilir", async () => {
  const result = await verify("kisa-token");
  assert.equal(result.code, 1, result.stdout);
  assert.match(result.stdout, /cfut_ \+ 40 gövde \+ 8 checksum = 53 karakter/);
});

test("surround whitespace ve tırnaklar normalleştirilir", async () => {
  const result = await verify(`  "${VALID_TOKEN}"  `);
  assert.equal(result.code, 0, result.stdout);
  assert.match(result.stdout, /checksum doğru/);
});
