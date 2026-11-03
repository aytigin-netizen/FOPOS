import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  cnamePayload,
  dnsRecordIsCorrect,
  routePatternFor,
} from "../scripts/ensure-domain-aliases.mjs";

const deployTarget = JSON.parse(
  await readFile(new URL("../config/deploy-target.json", import.meta.url), "utf8"),
);

test("doğru CNAME kaydı doğru sayılır", () => {
  assert.equal(
    dnsRecordIsCorrect(
      { type: "CNAME", content: "foposophos.com", proxied: true },
      "foposophos.com",
    ),
    true,
  );
  assert.equal(
    dnsRecordIsCorrect(
      { type: "CNAME", content: "FOPOSOPHOS.COM", proxied: true },
      "foposophos.com",
    ),
    true,
  );
});

test("yanlış tip, içerik veya proxy durumu doğru sayılmaz", () => {
  assert.equal(
    dnsRecordIsCorrect({ type: "A", content: "foposophos.com", proxied: true }, "foposophos.com"),
    false,
  );
  assert.equal(
    dnsRecordIsCorrect(
      { type: "CNAME", content: "eski.example.com", proxied: true },
      "foposophos.com",
    ),
    false,
  );
  assert.equal(
    dnsRecordIsCorrect(
      { type: "CNAME", content: "foposophos.com", proxied: false },
      "foposophos.com",
    ),
    false,
  );
  assert.equal(dnsRecordIsCorrect(null, "foposophos.com"), false);
});

test("CNAME gövdesi takma adı ve proxy durumunu taşır", () => {
  assert.deepEqual(cnamePayload("www.foposophos.com", "foposophos.com"), {
    type: "CNAME",
    name: "www.foposophos.com",
    content: "foposophos.com",
    proxied: true,
    ttl: 1,
  });
});

test("takma ad betiği çalışma hedefini birincil alan adından türetir", () => {
  assert.equal(deployTarget.domainName, "foposophos.com");
  assert.match(deployTarget.zoneId, /^[0-9a-f]{32}$/);
  assert.equal(deployTarget.workerName, "fopos-ders-studyosu");
});

test("Worker route deseni takma adı tüm yollara uygular", () => {
  assert.equal(routePatternFor("www.foposophos.com"), "www.foposophos.com/*");
});
