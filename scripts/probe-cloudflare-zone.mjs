#!/usr/bin/env node
/**
 * Cloudflare zone durum probu — SALT OKUNUR.
 *
 * Amaç: panelde bulunması zor ayarların (WAF, Bot Fight, zone settings, DNS)
 * gerçek durumunu API üzerinden ölçmek. Hiçbir yazma işlemi YAPMAZ:
 * yalnız GET istekleri gönderilir (tests/cloudflare-zone-probe.test.mjs bunu
 * sözleşmeyle sabitler).
 *
 * Kullanım:
 *   CLOUDFLARE_API_TOKEN=... node scripts/probe-cloudflare-zone.mjs
 *
 * Çıktı:
 *   - stdout: okunabilir rapor
 *   - cloudflare-zone-probe.json: makine okunur ayrıntı
 *   - $GITHUB_STEP_SUMMARY varsa: özet
 */

import { appendFileSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..");

/** Panelden kopyalanırken başına/sonuna boşluk ya da tırnak girebilen token'ı temizler. */
export function normalizeToken(raw) {
  return String(raw ?? "")
    .trim()
    .replace(/^['"]|['"]$/g, "")
    .replace(/\s+/g, "");
}

/** Zone settings listesinden güvenlikle ilgili olanları ayıklar. */
export function settingsDigest(result) {
  if (!Array.isArray(result)) return null;
  const wanted = new Set([
    "always_use_https",
    "min_tls_version",
    "tls_1_3",
    "ssl",
    "security_level",
    "browser_check",
    "challenge_ttl",
    "waf",
    "advanced_ddos",
    "browser_integrity_check",
    "opportunistic_encryption",
    "automatic_https_rewrites",
    "ipv6",
    "websockets",
    "hotlink_protection",
  ]);
  const out = {};
  for (const item of result) {
    if (wanted.has(item.id)) out[item.id] = item.value;
  }
  return out;
}

/** DNS kayıtlarını kısa ve okunabilir biçime indirger. */
export function dnsDigest(result) {
  if (!Array.isArray(result)) return null;
  return result.map((r) => ({
    type: r.type,
    name: r.name,
    content: r.content,
    proxied: r.proxied ?? null,
    proxied_status: r.proxied_status ?? null,
    ttl: r.ttl,
  }));
}

/** WAF / ruleset listesini indirger. */
export function rulesetDigest(result) {
  if (!Array.isArray(result)) return null;
  return result.map((r) => ({
    id: r.id,
    name: r.name,
    kind: r.kind,
    phase: r.phase,
    version: r.version,
    last_updated: r.last_updated ?? null,
  }));
}

/** Worker custom domain listesini indirger. */
export function domainsDigest(result) {
  if (!Array.isArray(result)) return null;
  return result.map((d) => ({
    id: d.id,
    hostname: d.hostname,
    service: d.service,
    zone_id: d.zone_id,
    environment: d.environment ?? null,
  }));
}

/** Bir uç çağrısının HTTP durumunu ve hata mesajını tek satıra indirger. */
export function summarize(probe) {
  const codes = probe.errors ? ` (${probe.errors})` : "";
  return `${probe.ok ? "✓" : "✗"} HTTP ${probe.http}${codes}`;
}

export function loadTarget() {
  return JSON.parse(readFileSync(resolve(repoRoot, "config/deploy-target.json"), "utf8"));
}

async function api(pathname, token) {
  const url = `https://api.cloudflare.com/client/v4${pathname}`;
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    const text = await response.text();
    let body = null;
    try {
      body = JSON.parse(text);
    } catch {
      body = { raw: text.slice(0, 400) };
    }
    return {
      path: pathname,
      http: response.status,
      ok: response.ok && body?.success !== false,
      errors: Array.isArray(body?.errors)
        ? body.errors.map((e) => `${e.code}: ${e.message}`).join(" | ")
        : null,
      result: body?.result,
    };
  } catch (error) {
    return {
      path: pathname,
      http: 0,
      ok: false,
      errors: `istek hatası: ${error?.message ?? error}`,
      result: null,
    };
  }
}

export async function runProbe({ token, accountId, zoneId, domainName }) {
  const probes = {};
  probes.tokenVerify = await api("/user/tokens/verify", token);
  probes.zone = await api(`/zones/${zoneId}`, token);
  probes.zoneByName = await api(`/zones?name=${domainName}`, token);
  probes.dnsRecords = await api(`/zones/${zoneId}/dns_records?per_page=100`, token);
  probes.zoneSettings = await api(`/zones/${zoneId}/settings`, token);
  probes.rulesets = await api(`/zones/${zoneId}/rulesets`, token);
  probes.firewallRules = await api(`/zones/${zoneId}/firewall/rules?per_page=50`, token);
  probes.botManagement = await api(`/zones/${zoneId}/bot_management`, token);
  probes.workersDomains = await api(`/accounts/${accountId}/workers/domains`, token);
  probes.workersScripts = await api(`/accounts/${accountId}/workers/scripts`, token);
  probes.d1 = await api(`/accounts/${accountId}/d1/database`, token);

  const zoneInfo = probes.zone.result ?? null;
  const plan = zoneInfo?.plan ?? null;

  return {
    probedAt: new Date().toISOString(),
    accountId,
    zoneId,
    zone: zoneInfo
      ? {
          name: zoneInfo.name,
          status: zoneInfo.status,
          paused: zoneInfo.paused,
          type: zoneInfo.type,
          plan: plan
            ? {
                id: plan.id,
                name: plan.name,
                is_subscribed: plan.is_subscribed ?? null,
                can_subscribe: plan.can_subscribe ?? null,
              }
            : null,
          name_servers: zoneInfo.name_servers,
          original_registrar: zoneInfo.original_registrar ?? null,
          original_name_servers: zoneInfo.original_name_servers ?? null,
        }
      : null,
    dnsRecords: dnsDigest(probes.dnsRecords.result),
    zoneSettings: settingsDigest(probes.zoneSettings.result),
    rulesets: rulesetDigest(probes.rulesets.result),
    firewallRules: probes.firewallRules.ok ? probes.firewallRules.result : null,
    botManagement: probes.botManagement.ok ? probes.botManagement.result : null,
    workersDomains: domainsDigest(probes.workersDomains.result),
    endpoints: Object.fromEntries(
      Object.entries(probes).map(([key, value]) => [
        key,
        { path: value.path, http: value.http, ok: value.ok, errors: value.errors },
      ]),
    ),
  };
}

export function renderReport(report) {
  const lines = [];
  lines.push("## Cloudflare zone probu (salt okunur)");
  lines.push("");
  lines.push(`- Zone: \`${report.zoneId}\` · hesap: \`${report.accountId}\``);
  lines.push(
    `- Zone durumu: **${report.zone?.status ?? "bilinmiyor"}** · plan: **${report.zone?.plan?.name ?? "bilinmiyor"}**`,
  );
  lines.push("");
  lines.push("### Uç erişimleri");
  lines.push("");
  lines.push("| Uç | Sonuç |");
  lines.push("| --- | --- |");
  for (const [key, value] of Object.entries(report.endpoints)) {
    lines.push(`| \`${key}\` | ${summarize(value)} |`);
  }
  lines.push("");
  lines.push("### DNS kayıtları");
  lines.push("");
  if (Array.isArray(report.dnsRecords) && report.dnsRecords.length > 0) {
    lines.push("| Tip | Ad | İçerik | Proxy |");
    lines.push("| --- | --- | --- | --- |");
    for (const r of report.dnsRecords) {
      lines.push(
        `| ${r.type} | ${r.name} | ${String(r.content).slice(0, 60)} | ${r.proxied ?? "-"} |`,
      );
    }
  } else {
    lines.push("(okunamadı veya kayıt yok)");
  }
  lines.push("");
  lines.push("### Zone ayarları");
  lines.push("");
  lines.push("```json");
  lines.push(JSON.stringify(report.zoneSettings ?? {}, null, 2));
  lines.push("```");
  lines.push("");
  lines.push("### WAF / ruleset'ler");
  lines.push("");
  lines.push("```json");
  lines.push(JSON.stringify(report.rulesets ?? {}, null, 2));
  lines.push("```");
  lines.push("");
  lines.push("### Worker custom domain'leri");
  lines.push("");
  lines.push("```json");
  lines.push(JSON.stringify(report.workersDomains ?? {}, null, 2));
  lines.push("```");
  return lines.join("\n");
}

async function main() {
  const token = normalizeToken(process.env.CLOUDFLARE_API_TOKEN);
  const target = loadTarget();
  const report = await runProbe({
    token,
    accountId: target.accountId,
    zoneId: target.zoneId,
    domainName: target.domainName,
  });

  writeFileSync(resolve(repoRoot, "cloudflare-zone-probe.json"), JSON.stringify(report, null, 2));

  const summary = renderReport(report);
  console.log(summary);
  if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${summary}\n`);
  }
}

const invokedDirectly =
  process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedDirectly) {
  await main();
}
