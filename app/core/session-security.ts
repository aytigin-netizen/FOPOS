const SESSION_COOKIE_NAME = "__Host-fopos_session";
const DEFAULT_IDLE_TIMEOUT_SECONDS = 30 * 60;
const DEFAULT_ABSOLUTE_TIMEOUT_SECONDS = 12 * 60 * 60;

export interface SessionPolicy {
  idleTimeoutSeconds: number;
  absoluteTimeoutSeconds: number;
}

export interface SessionTimes {
  createdAt: string;
  lastSeenAt: string;
  expiresAt: string;
  revokedAt: string | null;
}

export const defaultSessionPolicy: SessionPolicy = {
  idleTimeoutSeconds: DEFAULT_IDLE_TIMEOUT_SECONDS,
  absoluteTimeoutSeconds: DEFAULT_ABSOLUTE_TIMEOUT_SECONDS,
};

function base64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);

  return btoa(binary)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replace(/=+$/u, "");
}

export function createSessionToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return base64Url(bytes);
}

export async function digestSessionToken(token: string): Promise<string> {
  if (token.length < 32) {
    throw new Error("Geçersiz oturum belirteci.");
  }

  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(token),
  );
  return base64Url(new Uint8Array(digest));
}

export function createSessionTimes(
  now: Date,
  policy: SessionPolicy = defaultSessionPolicy,
): SessionTimes {
  if (
    policy.idleTimeoutSeconds <= 0 ||
    policy.absoluteTimeoutSeconds <= 0 ||
    policy.idleTimeoutSeconds > policy.absoluteTimeoutSeconds
  ) {
    throw new Error("Geçersiz oturum zaman aşımı politikası.");
  }

  return {
    createdAt: now.toISOString(),
    lastSeenAt: now.toISOString(),
    expiresAt: new Date(
      now.getTime() + policy.absoluteTimeoutSeconds * 1000,
    ).toISOString(),
    revokedAt: null,
  };
}

export function isSessionActive(
  session: SessionTimes,
  now: Date,
  policy: SessionPolicy = defaultSessionPolicy,
): boolean {
  if (session.revokedAt) return false;

  const nowMs = now.getTime();
  const absoluteExpiryMs = Date.parse(session.expiresAt);
  const lastSeenMs = Date.parse(session.lastSeenAt);
  const idleExpiryMs = lastSeenMs + policy.idleTimeoutSeconds * 1000;

  if (
    !Number.isFinite(absoluteExpiryMs) ||
    !Number.isFinite(lastSeenMs) ||
    nowMs >= absoluteExpiryMs ||
    nowMs >= idleExpiryMs
  ) {
    return false;
  }

  return true;
}

export function serializeSessionCookie(
  token: string,
  maxAgeSeconds = DEFAULT_ABSOLUTE_TIMEOUT_SECONDS,
): string {
  if (token.length < 32 || maxAgeSeconds <= 0) {
    throw new Error("Geçersiz oturum çerezi.");
  }

  return [
    `${SESSION_COOKIE_NAME}=${token}`,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    `Max-Age=${Math.floor(maxAgeSeconds)}`,
  ].join("; ");
}

export function clearSessionCookie(): string {
  return [
    `${SESSION_COOKIE_NAME}=`,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    "Max-Age=0",
  ].join("; ");
}

export function readSessionToken(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;

  for (const item of cookieHeader.split(";")) {
    const [name, ...valueParts] = item.trim().split("=");
    if (name === SESSION_COOKIE_NAME) {
      const value = valueParts.join("=");
      return value.length >= 32 ? value : null;
    }
  }

  return null;
}

export function assertTrustedMutationOrigin(
  requestUrl: string,
  originHeader: string | null,
): void {
  if (!originHeader) {
    throw new Error("İstek kaynağı doğrulanamadı.");
  }

  const requestOrigin = new URL(requestUrl).origin;
  const suppliedOrigin = new URL(originHeader).origin;

  if (requestOrigin !== suppliedOrigin) {
    throw new Error("Güvenilmeyen istek kaynağı.");
  }
}

export function noStoreHeaders(): Headers {
  return new Headers({
    "Cache-Control": "no-store, max-age=0",
    Pragma: "no-cache",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Content-Type-Options": "nosniff",
  });
}
