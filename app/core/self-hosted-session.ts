/**
 * Kendi sunucumuzda çalışan FOPOS için oturum yönetimi.
 *
 * OpenAI Sites dağıtımı kimliği barındırdığı başlıklardan okur. Workers
 * dağıtımında bu başlıklar bulunmaz; bunun yerine öğretmenin Worker secret
 * olarak tanımladığı geçiş kodu ile bir kez giriş yapılır ve geri dönen
 * çerez HMAC-SHA256 ile imzalanmış oturum taşır.
 *
 * Tasarım kuralları:
 * - Çerez `HttpOnly` + `Secure` + `SameSite=Lax`; JavaScript okuyamaz.
 * - Oturum yalnızca imza ve süre doğrulanırsa kabul edilir.
 * - Geçiş kodu karşılaştırması sabit zamanlıdır (özet üzerinden).
 * - İmzalama anahtarı hiçbir zaman çereze yazılmaz.
 */

export const SESSION_COOKIE_NAME = "fopos_session";

const SESSION_VERSION = 1;
const DEFAULT_SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;

export type SelfHostedSessionPayload = {
  version: number;
  email: string;
  name: string | null;
  issuedAt: number;
  expiresAt: number;
};

function encodeBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function decodeBase64Url(value: string): Uint8Array | null {
  try {
    const padded = value.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(padded + "=".repeat((4 - (padded.length % 4)) % 4));
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }
    return bytes;
  } catch {
    return null;
  }
}

function encodeUtf8(value: string): Uint8Array<ArrayBuffer> {
  const encoded = new TextEncoder().encode(value);
  // TextEncoder çıktısı tip düzeyinde ArrayBufferLike olabilir; WebCrypto
  // BufferSource bekler. Ayrı bir ArrayBuffer'a kopyalamak tipi kesinleştirir.
  const buffer = new ArrayBuffer(encoded.byteLength);
  new Uint8Array(buffer).set(encoded);
  return new Uint8Array(buffer);
}

async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", encodeUtf8(value));
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * İki özet aynı uzunlukta olduğu için karakter karakter karşılaştırma
 * sabit zamanlıdır: fark, erken çıkış olmadan biriktirilir.
 */
function constantTimeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}

async function hmacBase64Url(value: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encodeUtf8(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encodeUtf8(value));
  return encodeBase64Url(new Uint8Array(signature));
}

/**
 * Geçiş kodu karşılaştırması.
 *
 * Kodlar doğrudan karşılaştırılmaz; ikisinin de SHA-256 özeti alınır ve
 * özetler sabit zamanlı olarak karşılaştırılır. Böylece eşleşmeyen kodun
 * hangi karakterde ayrıldığı zamanlama üzerinden sızdırılmaz.
 */
export async function accessCodeMatches(
  provided: string,
  expected: string,
): Promise<boolean> {
  if (!expected) return false;
  const [providedDigest, expectedDigest] = await Promise.all([
    sha256Hex(provided),
    sha256Hex(expected),
  ]);
  return constantTimeEqual(providedDigest, expectedDigest);
}

export async function createSessionToken(
  identity: { email: string; name?: string | null },
  secret: string,
  options: { ttlSeconds?: number; now?: number } = {},
): Promise<string> {
  const now = options.now ?? Math.floor(Date.now() / 1000);
  const ttl = options.ttlSeconds ?? DEFAULT_SESSION_TTL_SECONDS;
  const payload: SelfHostedSessionPayload = {
    version: SESSION_VERSION,
    email: identity.email.trim().toLocaleLowerCase("en-US"),
    name: identity.name?.trim() || null,
    issuedAt: now,
    expiresAt: now + ttl,
  };
  const encodedPayload = encodeBase64Url(encodeUtf8(JSON.stringify(payload)));
  const signature = await hmacBase64Url(encodedPayload, secret);
  return `${encodedPayload}.${signature}`;
}

export async function verifySessionToken(
  token: string,
  secret: string,
  options: { now?: number } = {},
): Promise<SelfHostedSessionPayload | null> {
  if (!token || !secret) return null;
  const separator = token.lastIndexOf(".");
  if (separator <= 0) return null;

  const encodedPayload = token.slice(0, separator);
  const providedSignature = token.slice(separator + 1);

  const expectedSignature = await hmacBase64Url(encodedPayload, secret);
  if (!constantTimeEqual(providedSignature, expectedSignature)) return null;

  const bytes = decodeBase64Url(encodedPayload);
  if (!bytes) return null;

  let payload: SelfHostedSessionPayload;
  try {
    payload = JSON.parse(new TextDecoder().decode(bytes)) as SelfHostedSessionPayload;
  } catch {
    return null;
  }

  if (payload?.version !== SESSION_VERSION) return null;
  if (typeof payload.email !== "string" || !payload.email.includes("@")) {
    return null;
  }
  const now = options.now ?? Math.floor(Date.now() / 1000);
  if (typeof payload.expiresAt !== "number" || payload.expiresAt <= now) {
    return null;
  }
  return payload;
}

export function readCookie(
  cookieHeader: string | null | undefined,
  name: string,
): string | null {
  if (!cookieHeader) return null;
  for (const part of cookieHeader.split(";")) {
    const separator = part.indexOf("=");
    if (separator === -1) continue;
    const key = part.slice(0, separator).trim();
    if (key !== name) continue;
    const value = part.slice(separator + 1).trim();
    if (!value) return null;
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  }
  return null;
}

export function sessionCookieHeader(
  token: string,
  options: { ttlSeconds?: number; secure?: boolean } = {},
): string {
  const ttl = options.ttlSeconds ?? DEFAULT_SESSION_TTL_SECONDS;
  const attributes = [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${ttl}`,
  ];
  if (options.secure !== false) attributes.push("Secure");
  return attributes.join("; ");
}

export function clearSessionCookieHeader(options: { secure?: boolean } = {}): string {
  const attributes = [
    `${SESSION_COOKIE_NAME}=`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=0",
  ];
  if (options.secure !== false) attributes.push("Secure");
  return attributes.join("; ");
}
