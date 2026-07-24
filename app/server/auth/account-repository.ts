import type {
  CanonicalIdentity,
  IdentityProvider,
} from "../../core/verified-identity.ts";
import type { SessionDatabase } from "./session-repository.ts";

interface UserRow {
  id: string;
  email_normalized: string;
  email_verified_at: string | null;
  disabled_at: string | null;
}

interface IdentityAccountRow {
  id: string;
  user_id: string;
  provider: IdentityProvider;
  provider_subject: string;
}

export interface AccountRecord {
  id: string;
  emailNormalized: string;
  emailVerifiedAt: string | null;
  disabledAt: string | null;
}

function toAccount(row: UserRow): AccountRecord {
  return {
    id: row.id,
    emailNormalized: row.email_normalized,
    emailVerifiedAt: row.email_verified_at,
    disabledAt: row.disabled_at,
  };
}

export async function findAccountByProviderIdentity(
  database: SessionDatabase,
  identity: Pick<CanonicalIdentity, "provider" | "providerSubject">,
): Promise<AccountRecord | null> {
  const row = await database
    .prepare(
      `SELECT u.id, u.email_normalized, u.email_verified_at, u.disabled_at
       FROM identity_accounts AS i
       INNER JOIN users AS u ON u.id = i.user_id
       WHERE i.provider = ? AND i.provider_subject = ?
       LIMIT 1`,
    )
    .bind(identity.provider, identity.providerSubject)
    .first<UserRow>();

  if (!row) return null;
  if (row.disabled_at) throw new Error("Bu kullanıcı hesabı devre dışı.");
  return toAccount(row);
}

export async function findAccountByEmail(
  database: SessionDatabase,
  emailNormalized: string,
): Promise<AccountRecord | null> {
  const row = await database
    .prepare(
      `SELECT id, email_normalized, email_verified_at, disabled_at
       FROM users
       WHERE email_normalized = ?
       LIMIT 1`,
    )
    .bind(emailNormalized)
    .first<UserRow>();

  return row ? toAccount(row) : null;
}

export async function insertAccount(
  database: SessionDatabase,
  input: {
    userId: string;
    identityAccountId: string;
    identity: CanonicalIdentity;
    now: Date;
  },
): Promise<AccountRecord> {
  if (!input.userId || !input.identityAccountId) {
    throw new Error("Hesap kimlikleri eksik.");
  }

  const now = input.now.toISOString();
  const userResult = await database
    .prepare(
      `INSERT INTO users (
        id, email_normalized, email_verified_at, created_at, disabled_at
      ) VALUES (?, ?, ?, ?, NULL)`,
    )
    .bind(input.userId, input.identity.emailNormalized, now, now)
    .run();

  if (!userResult.success) throw new Error("Kullanıcı hesabı oluşturulamadı.");

  const identityResult = await database
    .prepare(
      `INSERT INTO identity_accounts (
        id, user_id, provider, provider_subject, created_at
      ) VALUES (?, ?, ?, ?, ?)`,
    )
    .bind(
      input.identityAccountId,
      input.userId,
      input.identity.provider,
      input.identity.providerSubject,
      now,
    )
    .run();

  if (!identityResult.success) {
    throw new Error("Kimlik sağlayıcı bağlantısı oluşturulamadı.");
  }

  return {
    id: input.userId,
    emailNormalized: input.identity.emailNormalized,
    emailVerifiedAt: now,
    disabledAt: null,
  };
}

export async function linkProviderIdentity(
  database: SessionDatabase,
  input: {
    identityAccountId: string;
    userId: string;
    identity: CanonicalIdentity;
    now: Date;
  },
): Promise<void> {
  if (!input.identityAccountId || !input.userId) {
    throw new Error("Kimlik bağlantısı bilgileri eksik.");
  }

  const result = await database
    .prepare(
      `INSERT INTO identity_accounts (
        id, user_id, provider, provider_subject, created_at
      ) VALUES (?, ?, ?, ?, ?)`,
    )
    .bind(
      input.identityAccountId,
      input.userId,
      input.identity.provider,
      input.identity.providerSubject,
      input.now.toISOString(),
    )
    .run();

  if (!result.success) throw new Error("Kimlik sağlayıcı bağlantısı kurulamadı.");
}

export async function findIdentityAccount(
  database: SessionDatabase,
  identity: Pick<CanonicalIdentity, "provider" | "providerSubject">,
): Promise<IdentityAccountRow | null> {
  return database
    .prepare(
      `SELECT id, user_id, provider, provider_subject
       FROM identity_accounts
       WHERE provider = ? AND provider_subject = ?
       LIMIT 1`,
    )
    .bind(identity.provider, identity.providerSubject)
    .first<IdentityAccountRow>();
}
