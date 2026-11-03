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
 *   2. Worker route: www.foposophos.com/* → fopos-ders-studyosu
 *
 * Neden route, neden custom domain değil: Worker *custom domain* eklenirken
 * Cloudflare DNS kaydını kendisi yönetmek ister; dışarıdan yönetilen bir
 * CNAME/A kaydı varsa 409 (100117 "already has externally managed DNS
 * records") ile reddeder. DNS kaydı elle yönetildiği için route kullanılır:
 * aynı işi görür, DNS kaydının sahibi biz kalırız.
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
    raw: parsed,
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

/** Takma ad için Worker route deseni. */
export function routePatternFor(aliasHost) {
  return `${aliasHost}/*`;
}

export async function ensureDomainAliases({ token, target }) {
  const { accountId, zoneId, domainName, workerName } = target;
  const aliasHost = `www.${domainName}`;
  const results = [];

  // 0) Takma ad zaten Worker'a bağlı mı? wrangler.workers.jsonc içindeki
  //    `routes` listesi dağıtımda Worker'ın custom domain listesini eşitler:
  //    tanımlı olmayan alan adı SİLİNİR. Bu yüzden birincil doğrulama
  //    yapılandırmadır, API çağrısı değil.
  const domains = await call(
    token,
    "GET",
    `/accounts/${accountId}/workers/domains`,
  );
  const attachedDomain = domains.ok
    ? (domains.result ?? []).find((d) => d.hostname === aliasHost)
    : null;
  if (attachedDomain) {
    results.push({
      step: "worker:custom-domain",
      ok: true,
      detail: `zaten bağlı: ${aliasHost} → ${attachedDomain.service ?? workerName}`,
      recordId: attachedDomain.id,
    });
    return results;
  }

  // 1) DNS kaydı (yalnız route yolunda gerekir)
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

  // 2) Worker bağlantısı. İki yol vardır ve ikisi de aynı işi görür:
  //
  //    a) Worker route  → DNS kaydı bizde kalır, route Worker'a bağlar.
  //    b) Worker custom domain → Cloudflare DNS kaydını kendisi yönetir.
  //
  //    Tercih sırası (a), çünkü DNS kaydının sahibi biz kalır. Token'da zone
  //    kapsamlı "Workers Routes Write" yetkisi yoksa (HTTP 403) (b) yoluna
  //    düşülür; bu yolda Cloudflare DNS kaydının kendisini yöneteceği için
  //    dışarıdan yönetilen CNAME önce silinir (aksi hâlde 409).
  const routePattern = routePatternFor(aliasHost);
  const routes = await call(token, "GET", `/zones/${zoneId}/workers/routes`);
  const existingRoute = routes.ok
    ? (routes.result ?? []).find((r) => r.pattern === routePattern)
    : null;

  if (existingRoute) {
    const bound = existingRoute.script === workerName;
    results.push({
      step: "worker:route",
      ok: bound,
      detail: bound
        ? `zaten bağlı: ${routePattern} → ${workerName}`
        : `çakışma: ${routePattern} → ${existingRoute.script ?? "?"}`,
      recordId: existingRoute.id,
    });
    return results;
  }

  if (routes.ok) {
    const created = await call(token, "POST", `/zones/${zoneId}/workers/routes`, {
      pattern: routePattern,
      script: workerName,
    });
    if (created.ok) {
      results.push({
        step: "worker:route",
        ok: true,
        detail: `oluşturuldu: ${routePattern} → ${workerName}`,
        recordId: created.result?.id ?? null,
      });
      return results;
    }
    results.push({
      step: "worker:route",
      ok: false,
      detail: `HTTP ${created.http} ${created.errors ?? ""} — custom domain yoluna düşülüyor`,
    });
  } else {
    results.push({
      step: "worker:route",
      ok: false,
      detail: `HTTP ${routes.http} ${routes.errors ?? ""} — custom domain yoluna düşülüyor`,
    });
  }

  // 2b) Custom domain yolu. Önce uç bir kez denenir: DNS kaydı bizde
  //     olduğu için 409 döner, ama 409 "yetki var, kayıt çakışıyor"
  //     demektir. Ancak 409 alındıysa CNAME silinir ve tekrar denenir;
  //     yetki yoksa (403) DNS kaydı yerinde bırakılır.
  const attachPayload = {
    hostname: aliasHost,
    service: workerName,
    zone_id: zoneId,
  };
  const firstAttempt = await call(
    token,
    "PUT",
    `/accounts/${accountId}/workers/domains`,
    attachPayload,
  );
  if (firstAttempt.ok) {
    results.push({
      step: "worker:custom-domain",
      ok: true,
      detail: `${aliasHost} → ${workerName} (custom domain)`,
      recordId: firstAttempt.result?.id ?? null,
    });
    return results;
  }

  if (firstAttempt.http !== 409) {
    results.push({
      step: "worker:custom-domain",
      ok: false,
      detail: `HTTP ${firstAttempt.http} ${firstAttempt.errors ?? ""}`,
    });
    return results;
  }

  // 409: DNS kaydı dışarıdan yönetiliyor. Cloudflare'ın kaydı kendi
  // yönetmesi için mevcut kayıt silinir ve custom domain yeniden denenir.
  const current = await call(
    token,
    "GET",
    `/zones/${zoneId}/dns_records?name=${encodeURIComponent(aliasHost)}`,
  );
  const external = (current.result ?? [])[0] ?? null;
  if (!external) {
    results.push({
      step: "dns:release",
      ok: false,
      detail: "409 alındı ama silinecek DNS kaydı bulunamadı",
    });
    return results;
  }
  const removed = await call(
    token,
    "DELETE",
    `/zones/${zoneId}/dns_records/${external.id}`,
  );
  results.push({
    step: "dns:release",
    ok: removed.ok,
    detail: removed.ok
      ? `dışarıdan yönetilen CNAME silindi (${external.id})`
      : `HTTP ${removed.http} ${removed.errors ?? ""}`,
  });
  if (!removed.ok) return results;

  const attached = await call(
    token,
    "PUT",
    `/accounts/${accountId}/workers/domains`,
    attachPayload,
  );
  results.push({
    step: "worker:custom-domain",
    ok: attached.ok,
    detail: attached.ok
      ? `${aliasHost} → ${workerName} (custom domain)`
      : `HTTP ${attached.http} ${attached.errors ?? ""}`,
    recordId: attached.result?.id ?? null,
  });

  return results;
}

/** Tanı modu: ilgili uçların ham yanıtlarını basar (yazma yapmaz). */
export async function diagnose({ token, target }) {
  const { accountId, zoneId, domainName, workerName } = target;
  const aliasHost = `www.${domainName}`;
  const endpoints = [
    ["GET", `/zones/${zoneId}`],
    ["GET", `/zones/${zoneId}/dns_records?per_page=100`],
    ["GET", `/zones/${zoneId}/workers/routes`],
    ["GET", `/accounts/${accountId}/workers/domains`],
  ];
  for (const [method, pathname] of endpoints) {
    const response = await call(token, method, pathname);
    console.log(`\n--- ${method} ${pathname} → HTTP ${response.http}`);
    console.log(JSON.stringify(response.raw).slice(0, 1500));
  }
  console.log(`\n--- takma ad hedefi: ${aliasHost} / worker: ${workerName}`);
  return { aliasHost, workerName };
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
  if (process.argv.includes("--diagnose")) {
    await diagnose({ token, target });
    return;
  }
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
