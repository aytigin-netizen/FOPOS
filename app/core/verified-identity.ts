export type IdentityProvider = "google" | "microsoft" | "oidc";

export interface VerifiedIdentityAssertion {
  provider: IdentityProvider;
  providerSubject: string;
  email: string;
  emailVerified: boolean;
  displayName?: string | null;
}

export interface CanonicalIdentity {
  provider: IdentityProvider;
  providerSubject: string;
  emailNormalized: string;
  displayName: string | null;
}

function cleanRequired(value: string, field: string, maxLength: number): string {
  const normalized = value.trim();

  if (!normalized) throw new Error(`${field} eksik.`);
  if (normalized.length > maxLength) throw new Error(`${field} çok uzun.`);
  if (/[\u0000-\u001F\u007F]/u.test(normalized)) {
    throw new Error(`${field} geçersiz karakter içeriyor.`);
  }

  return normalized;
}

export function normalizeVerifiedIdentity(
  assertion: VerifiedIdentityAssertion,
): CanonicalIdentity {
  if (!assertion.emailVerified) {
    throw new Error("Doğrulanmamış e-posta ile hesap açılamaz.");
  }

  const providerSubject = cleanRequired(
    assertion.providerSubject,
    "Sağlayıcı kullanıcı kimliği",
    255,
  );
  const emailNormalized = cleanRequired(
    assertion.email,
    "E-posta adresi",
    320,
  ).toLocaleLowerCase("en-US");

  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(emailNormalized) ||
    emailNormalized.includes("..")
  ) {
    throw new Error("Geçersiz e-posta adresi.");
  }

  const displayName = assertion.displayName?.trim().replace(/\s+/gu, " ") || null;
  if (displayName && displayName.length > 160) {
    throw new Error("Görünen ad çok uzun.");
  }

  return {
    provider: assertion.provider,
    providerSubject,
    emailNormalized,
    displayName,
  };
}

export function identityAccountKey(
  identity: Pick<CanonicalIdentity, "provider" | "providerSubject">,
): string {
  return `${identity.provider}:${identity.providerSubject}`;
}
