import {
  createSessionTimes,
  digestSessionToken,
  isSessionActive,
  type SessionPolicy,
  type SessionTimes,
} from "../../core/session-security.ts";

interface SqlResult<T = unknown> {
  success: boolean;
  results?: T[];
}

interface SqlStatement {
  bind(...values: unknown[]): SqlStatement;
  run<T = unknown>(): Promise<SqlResult<T>>;
  first<T = unknown>(): Promise<T | null>;
}

export interface SessionDatabase {
  prepare(query: string): SqlStatement;
}

interface SessionRow {
  id: string;
  user_id: string;
  token_digest: string;
  created_at: string;
  last_seen_at: string;
  expires_at: string;
  revoked_at: string | null;
}

export interface StoredSession extends SessionTimes {
  id: string;
  userId: string;
  tokenDigest: string;
}

function toStoredSession(row: SessionRow): StoredSession {
  return {
    id: row.id,
    userId: row.user_id,
    tokenDigest: row.token_digest,
    createdAt: row.created_at,
    lastSeenAt: row.last_seen_at,
    expiresAt: row.expires_at,
    revokedAt: row.revoked_at,
  };
}

export async function insertSession(
  database: SessionDatabase,
  input: {
    id: string;
    userId: string;
    rawToken: string;
    now: Date;
    policy?: SessionPolicy;
  },
): Promise<StoredSession> {
  if (!input.id || !input.userId) {
    throw new Error("Oturum kimliği ve kullanıcı kimliği zorunludur.");
  }

  const tokenDigest = await digestSessionToken(input.rawToken);
  const times = createSessionTimes(input.now, input.policy);
  const result = await database
    .prepare(
      `INSERT INTO secure_sessions (
        id, user_id, token_digest, created_at, last_seen_at, expires_at, revoked_at
      ) VALUES (?, ?, ?, ?, ?, ?, NULL)`,
    )
    .bind(
      input.id,
      input.userId,
      tokenDigest,
      times.createdAt,
      times.lastSeenAt,
      times.expiresAt,
    )
    .run();

  if (!result.success) {
    throw new Error("Güvenli oturum kaydedilemedi.");
  }

  return {
    id: input.id,
    userId: input.userId,
    tokenDigest,
    ...times,
  };
}

export async function findActiveSession(
  database: SessionDatabase,
  rawToken: string,
  now: Date,
  policy?: SessionPolicy,
): Promise<StoredSession | null> {
  const tokenDigest = await digestSessionToken(rawToken);
  const row = await database
    .prepare(
      `SELECT id, user_id, token_digest, created_at, last_seen_at, expires_at, revoked_at
       FROM secure_sessions
       WHERE token_digest = ?
       LIMIT 1`,
    )
    .bind(tokenDigest)
    .first<SessionRow>();

  if (!row) return null;

  const session = toStoredSession(row);
  if (!isSessionActive(session, now, policy)) return null;

  return session;
}

export async function touchSession(
  database: SessionDatabase,
  session: StoredSession,
  now: Date,
): Promise<StoredSession> {
  if (!isSessionActive(session, now)) {
    throw new Error("Süresi dolmuş veya iptal edilmiş oturum yenilenemez.");
  }

  const lastSeenAt = now.toISOString();
  const result = await database
    .prepare(
      `UPDATE secure_sessions
       SET last_seen_at = ?
       WHERE id = ? AND revoked_at IS NULL`,
    )
    .bind(lastSeenAt, session.id)
    .run();

  if (!result.success) throw new Error("Oturum etkinliği güncellenemedi.");
  return { ...session, lastSeenAt };
}

export async function revokeSession(
  database: SessionDatabase,
  sessionId: string,
  now: Date,
): Promise<void> {
  if (!sessionId) throw new Error("İptal edilecek oturum belirtilmedi.");

  const result = await database
    .prepare(
      `UPDATE secure_sessions
       SET revoked_at = ?
       WHERE id = ? AND revoked_at IS NULL`,
    )
    .bind(now.toISOString(), sessionId)
    .run();

  if (!result.success) throw new Error("Oturum iptal edilemedi.");
}

export async function revokeAllUserSessions(
  database: SessionDatabase,
  userId: string,
  now: Date,
): Promise<void> {
  if (!userId) throw new Error("Kullanıcı kimliği belirtilmedi.");

  const result = await database
    .prepare(
      `UPDATE secure_sessions
       SET revoked_at = ?
       WHERE user_id = ? AND revoked_at IS NULL`,
    )
    .bind(now.toISOString(), userId)
    .run();

  if (!result.success) {
    throw new Error("Kullanıcının oturumları iptal edilemedi.");
  }
}
