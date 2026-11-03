#!/usr/bin/env node
/**
 * FOPOS alan adı takma adlarını (alias) Cloudflare'da garanti eder.
 *
 * Durum (3 Kasım 2026 ölçümü): zone'da yalnız bir kayıt vardı
 * (AAAA foposophos.com → 100::) ve Worker custom domain listesinde
 * yalnız `foposophos.com` bulunuyordu. `www.foposophos.com` bu yüzden
 * NXDOMAIN döndürüyordu.
 *
 * Bu betik iki şeyi idempotent olarak yapar:
 *   1. DNS kaydı: CNAME www → foposophos.com (proxied)
 *   2. Worker custom domain: www.foposophos.com → fopos-ders-studyosu
 *
 * Kullanım:
 *   CLOUDFLARE_API_TOKEN=... node scripts/ensure-domain-aliases.mjs
 *
 * Çıkış kodu: 0 (hepsi hazır) · 1 (bir adım başarısız)
 */

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..");
const API = "https://api.cloudflare.com/client/v4";

function normalizeToken(raw) {
  return String(raw ?? "")
    .trim()
    .replace(/^['"]|['"]$/g, "")
    .replace(/\s+/g, "");
}

async function call(token, method, pathname, body) {
  const response = await fetch(`${API}${pathname}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const text = await response.text();
  let parsed = null;
  try {
    parsed = JSON.parse(text);
  } catch {
    parsed = { raw: text.slice(0, 300) };
  }
  return {
    http: response.status,
    ok: response.ok && parsed?.success !== false,
    errors: Array.isArray(parsed?.errors)
      ? parsed.errors.map((e) => `${e.code}: ${e.message}`).join(" | ")
      : null,
    result: parsed?.result ?? null,
  };
}

/** DNS kaydı zaten doğru mu? */
export function dnsRecordIsCorrect(record, expectedContent) {
  if (!record) return false;
  return (
    record.type === "CNAME" &&
    String(record.content).toLowerCase() === expectedContent.toLowerCase() &&
    record.proxied === true
  );
}

/** Bir CNAME kaydının gövdesi. */
export function cnamePayload(name, content) {
  return { type: "CNAME", name, content, proxied: true, ttl: 1 };
}

export async function ensureDomainAliases({ token, target }) {
  const { accountId, zoneId, domainName, workerName } = target;
  const aliasHost = `www.${domainName}`;
  const results = [];

  // 1) DNS kaydı
  const list = await call(
    token,
    "GET",
    `/zones/${zoneId}/dns_records?name=${encodeURIComponent(aliasHost)}`,
  );
  if (!list.ok) {
    results.push({
      step: "dns:list",
      ok: false,
      detail: `HTTP ${list.http} ${list.errors ?? ""}`,
    });
  } else {
    const existing = (list.result ?? [])[0] ?? null;
    if (dnsRecordIsCorrect(existing, domainName)) {
      results.push({
        step: "dns:cname",
        ok: true,
        detail: "zaten doğru (değişiklik yok)",
        recordId: existing.id,
      });
    } else {
      const created = await call(
        token,
        "POST",
        `/zones/${zoneId}/dns_records`,
        cnamePayload(aliasHost, domainName),
      );
      results.push({
        step: "dns:cname",
        ok: created.ok,
        detail: created.ok
          ? `oluşturuldu: ${aliasHost} → ${domainName} (proxied)`
          : `HTTP ${created.http} ${created.errors ?? ""}`,
        recordId: created.result?.id ?? null,
      });
    }
  }

  // 2) Worker custom domain — PUT idempotent (POST "Method not allowed" verir).
  const attached = await call(
    token,
    "PUT",
    `/accounts/${accountId}/workers/domains`,
    { hostname: aliasHost, service: workerName, zone_id: zoneId },
  );
  results.push({
    step: "worker:custom-domain",
    ok: attached.ok,
    detail: attached.ok
      ? `${aliasHost} → ${workerName}`
      : `HTTP ${attached.http} ${attached.errors ?? ""}`,
    recordId: attached.result?.id ?? null,
  });

  return results;
}

async function main() {
  const token = normalizeToken(process.env.CLOUDFLARE_API_TOKEN);
  if (!token) {
    console.error("CLOUDFLARE_API_TOKEN boş.");
    process.exit(1);
  }
  const target = JSON.parse(
    readFileSync(resolve(repoRoot, "config/deploy-target.json"), "utf8"),
  );
  const results = await ensureDomainAliases({ token, target });
  for (const r of results) {
    console.log(`${r.ok ? "✓" : "✗"} ${r.step} — ${r.detail}`);
  }
  const failed = results.filter((r) => !r.ok);
  if (failed.length) {
    console.error(`\n${failed.length} adım başarısız.`);
    process.exit(1);
  }
  console.log("\nTakma adlar hazır.");
}

const invokedDirectly =
  process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedDirectly) {
  await main();
}
