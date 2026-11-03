import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  dnsDigest,
  domainsDigest,
  normalizeToken,
  renderReport,
  rulesetDigest,
  settingsDigest,
  summarize,
} from "../scripts/probe-cloudflare-zone.mjs";

const deployTarget = JSON.parse(
  await readFile(new URL("../config/deploy-target.json", import.meta.url), "utf8"),
);

test("token normalizasyonu boşluk ve tırnakları temizler", () => {
  assert.equal(normalizeToken("  cfut_abc123  "), "cfut_abc123");
  assert.equal(normalizeToken('"cfut_abc123"'), "cfut_abc123");
  assert.equal(normalizeToken("'cfut_abc123'"), "cfut_abc123");
  assert.equal(normalizeToken("cfut\n abc123"), "cfutabc123");
  assert.equal(normalizeToken(undefined), "");
});

test("zone ayarlarından yalnız güvenlikle ilgili olanlar seçilir", () => {
  const digest = settingsDigest([
    { id: "always_use_https", value: "on" },
    { id: "min_tls_version", value: "1.2" },
    { id: "ssl", value: "strict" },
    { id: "some_unrelated_setting", value: "x" },
  ]);
  assert.deepEqual(digest, {
    always_use_https: "on",
    min_tls_version: "1.2",
    ssl: "strict",
  });
  assert.equal(settingsDigest(null), null);
});

test("DNS, ruleset ve domain özetleri alanları doğru taşır", () => {
  assert.deepEqual(
    dnsDigest([{ type: "A", name: "foposophos.com", content: "104.21.2.109", proxied: true, ttl: 1 }]),
    [
      {
        type: "A",
        name: "foposophos.com",
        content: "104.21.2.109",
        proxied: true,
        proxied_status: null,
        ttl: 1,
      },
    ],
  );
  assert.deepEqual(
    rulesetDigest([{ id: "abc", name: "zone", kind: "zone", phase: "http_request_firewall_custom", version: "3" }]),
    [
      {
        id: "abc",
        name: "zone",
        kind: "zone",
        phase: "http_request_firewall_custom",
        version: "3",
        last_updated: null,
      },
    ],
  );
  assert.deepEqual(
    domainsDigest([{ id: "d1", hostname: "foposophos.com", service: "fopos-ders-studyosu", zone_id: "z1" }]),
    [
      {
        id: "d1",
        hostname: "foposophos.com",
        service: "fopos-ders-studyosu",
        zone_id: "z1",
        environment: null,
      },
    ],
  );
});

test("uç özeti HTTP durumunu ve hata kodunu gösterir", () => {
  assert.equal(summarize({ ok: true, http: 200, errors: null }), "✓ HTTP 200");
  assert.equal(
    summarize({ ok: false, http: 403, errors: "9109: Invalid access token" }),
    "✗ HTTP 403 (9109: Invalid access token)",
  );
});

test("rapor çıktısı zone durumu ve uç tablosunu içerir", () => {
  const report = {
    zoneId: "z",
    accountId: "a",
    zone: { status: "active", plan: { name: "Free Website" } },
    endpoints: { dnsRecords: { path: "/p", http: 200, ok: true, errors: null } },
    dnsRecords: [],
    zoneSettings: { always_use_https: "on" },
    rulesets: [],
    workersDomains: [],
  };
  const rendered = renderReport(report);
  assert.match(rendered, /active/);
  assert.match(rendered, /Free Website/);
  assert.match(rendered, /dnsRecords/);
  assert.match(rendered, /always_use_https/);
});

test("dağıtım hedefi zone kimliğini ve birincil alan adını taşır", () => {
  assert.match(deployTarget.zoneId, /^[0-9a-f]{32}$/);
  assert.equal(deployTarget.domainName, "foposophos.com");
  assert.equal(deployTarget.liveUrl, "https://foposophos.com");
});

test("zone probu salt okunurdur: yazma metotları kullanılmaz", async () => {
  const source = await readFile(
    new URL("../scripts/probe-cloudflare-zone.mjs", import.meta.url),
    "utf8",
  );
  for (const method of ["POST", "PUT", "PATCH", "DELETE"]) {
    assert.equal(
      new RegExp(`method\\s*:\\s*["'\`]${method}["'\`]`).test(source),
      false,
      `probu ${method} kullanmamalı`,
    );
  }
  assert.equal(/await fetch\([^)]*,\s*\{[^}]*method/s.test(source), false);
});
