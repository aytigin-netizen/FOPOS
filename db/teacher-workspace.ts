import { getDatabase } from "./runtime-env";

export type WorkspaceAccount = {
  id: string;
  emailNormalized: string;
};

export type TeacherProfileRecord = {
  id: string;
  userId: string;
  displayName: string;
  schoolName: string;
  academicYear: string;
  revision: number;
};

export type TeacherProfileRevision = Pick<
  TeacherProfileRecord,
  "displayName" | "schoolName" | "academicYear" | "revision"
> & {
  changedAt: string;
};

export const ACADEMIC_YEAR_ROLLOVER_CONFIRMATION =
  "YENİ ÖĞRETİM YILINA GEÇ";

function database() {
  return getDatabase();
}

function normalizeEmail(email: string) {
  const normalized = email.trim().toLocaleLowerCase("en-US");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(normalized)) {
    throw new Error("Doğrulanmış kullanıcı e-postası geçersiz.");
  }
  return normalized;
}

export async function ensureWorkspaceAccount(
  email: string,
): Promise<WorkspaceAccount> {
  const db = database();
  const emailNormalized = normalizeEmail(email);
  const existing = await db
    .prepare(
      `SELECT id, email_normalized
       FROM users
       WHERE email_normalized = ? AND disabled_at IS NULL
       LIMIT 1`,
    )
    .bind(emailNormalized)
    .first<{ id: string; email_normalized: string }>();

  if (existing) {
    await db
      .prepare("UPDATE users SET last_seen_at = ? WHERE id = ?")
      .bind(new Date().toISOString(), existing.id)
      .run();
    return { id: existing.id, emailNormalized: existing.email_normalized };
  }

  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const result = await db
    .prepare(
      `INSERT INTO users (
        id, email_normalized, created_at, last_seen_at, disabled_at
      ) VALUES (?, ?, ?, ?, NULL)
      ON CONFLICT(email_normalized) DO NOTHING`,
    )
    .bind(id, emailNormalized, now, now)
    .run();

  if (!result.success) throw new Error("FOPOS hesabı oluşturulamadı.");

  const account = await db
    .prepare(
      `SELECT id, email_normalized
       FROM users
       WHERE email_normalized = ? AND disabled_at IS NULL
       LIMIT 1`,
    )
    .bind(emailNormalized)
    .first<{ id: string; email_normalized: string }>();

  if (!account) throw new Error("FOPOS hesabı doğrulanamadı.");
  return { id: account.id, emailNormalized: account.email_normalized };
}

export async function getTeacherProfile(
  userId: string,
): Promise<TeacherProfileRecord | null> {
  const row = await database()
    .prepare(
      `SELECT id, user_id, display_name, school_name, academic_year, revision
       FROM teacher_profiles
       WHERE user_id = ?
       LIMIT 1`,
    )
    .bind(userId)
    .first<{
      id: string;
      user_id: string;
      display_name: string;
      school_name: string;
      academic_year: string;
      revision: number;
    }>();

  return row
    ? {
        id: row.id,
        userId: row.user_id,
        displayName: row.display_name,
        schoolName: row.school_name,
        academicYear: row.academic_year,
        revision: row.revision,
      }
    : null;
}

function singleLine(value: unknown, label: string, maxLength = 160) {
  if (typeof value !== "string") throw new Error(`${label} geçersiz.`);
  const normalized = value.trim().replace(/\s+/gu, " ");
  if (!normalized) throw new Error(`${label} boş bırakılamaz.`);
  if (normalized.length > maxLength) throw new Error(`${label} çok uzun.`);
  if (/[\u0000-\u001F\u007F]/u.test(normalized)) {
    throw new Error(`${label} geçersiz karakter içeriyor.`);
  }
  return normalized;
}

function academicYear(value: unknown) {
  const normalized = singleLine(value, "Akademik yıl", 9);
  const match = /^(\d{4})-(\d{4})$/u.exec(normalized);
  if (!match || Number(match[2]) !== Number(match[1]) + 1) {
    throw new Error("Akademik yıl ardışık iki yıl olmalıdır.");
  }
  return normalized;
}

export async function saveInitialTeacherProfile(
  userId: string,
  input: {
    displayName: unknown;
    schoolName: unknown;
    academicYear: unknown;
  },
): Promise<TeacherProfileRecord> {
  const db = database();
  const displayName = singleLine(input.displayName, "Öğretmen adı");
  const schoolName = singleLine(input.schoolName, "Okul adı");
  const year = academicYear(input.academicYear);
  const now = new Date().toISOString();
  const profileId = crypto.randomUUID();

  const result = await db
    .prepare(
      `INSERT INTO teacher_profiles (
        id, user_id, display_name, branch, school_name, academic_year,
        locale, schema_version, revision, created_at, updated_at
      ) VALUES (?, ?, ?, 'Felsefe', ?, ?, 'tr-TR', '47.0.0', 1, ?, ?)
      ON CONFLICT(user_id) DO NOTHING`,
    )
    .bind(profileId, userId, displayName, schoolName, year, now, now)
    .run();

  if (!result.success) throw new Error("Öğretmen profili kaydedilemedi.");
  const profile = await getTeacherProfile(userId);
  if (!profile) throw new Error("Öğretmen profili doğrulanamadı.");
  await db
    .prepare(
      `INSERT INTO teacher_profile_revisions (
        id, user_id, revision, display_name, school_name, academic_year, changed_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(user_id, revision) DO NOTHING`,
    )
    .bind(
      crypto.randomUUID(),
      userId,
      profile.revision,
      profile.displayName,
      profile.schoolName,
      profile.academicYear,
      now,
    )
    .run();
  return profile;
}

export async function listTeacherProfileRevisions(
  userId: string,
): Promise<TeacherProfileRevision[]> {
  const result = await database()
    .prepare(
      `SELECT display_name, school_name, academic_year, revision, changed_at
       FROM teacher_profile_revisions
       WHERE user_id = ?
       ORDER BY revision DESC
       LIMIT 20`,
    )
    .bind(userId)
    .all<{
      display_name: string;
      school_name: string;
      academic_year: string;
      revision: number;
      changed_at: string;
    }>();
  return (result.results ?? []).map((row) => ({
    displayName: row.display_name,
    schoolName: row.school_name,
    academicYear: row.academic_year,
    revision: row.revision,
    changedAt: row.changed_at,
  }));
}

export async function getProfilePedagogicalRecordCount(userId: string) {
  const row = await database()
    .prepare(
      `SELECT COUNT(*) AS total
       FROM pedagogical_records
       WHERE user_id = ?`,
    )
    .bind(userId)
    .first<{ total: number }>();
  return row?.total ?? 0;
}

export async function updateTeacherProfile(
  userId: string,
  input: {
    displayName?: unknown;
    schoolName?: unknown;
    academicYear?: unknown;
    expectedRevision?: unknown;
    rolloverConfirmed?: unknown;
    rolloverConfirmationText?: unknown;
  },
): Promise<TeacherProfileRecord> {
  const current = await getTeacherProfile(userId);
  if (!current) throw new Error("Güncellenecek öğretmen profili bulunamadı.");
  if (
    !Number.isInteger(input.expectedRevision) ||
    input.expectedRevision !== current.revision
  ) {
    throw new Error("Profil başka bir işlemde değişti. Bilgileri yeniden kontrol edin.");
  }

  const displayName = singleLine(input.displayName, "Öğretmen adı");
  const schoolName = singleLine(input.schoolName, "Okul adı");
  const year = academicYear(input.academicYear);
  const yearChanged = year !== current.academicYear;
  if (
    yearChanged &&
    (input.rolloverConfirmed !== true ||
      input.rolloverConfirmationText !== ACADEMIC_YEAR_ROLLOVER_CONFIRMATION)
  ) {
    throw new Error("Öğretim yılı değişikliği için açık onay gerekir.");
  }

  const revision = current.revision + 1;
  const changedAt = new Date().toISOString();
  const db = database();
  const results = await db.batch([
    db
      .prepare(
        `UPDATE teacher_profiles
         SET display_name = ?, school_name = ?, academic_year = ?,
             revision = ?, updated_at = ?
         WHERE user_id = ? AND revision = ?`,
      )
      .bind(
        displayName,
        schoolName,
        year,
        revision,
        changedAt,
        userId,
        current.revision,
      ),
    db
      .prepare(
        `INSERT INTO teacher_profile_revisions (
          id, user_id, revision, display_name, school_name, academic_year, changed_at
        )
        SELECT ?, user_id, revision, display_name, school_name, academic_year, ?
        FROM teacher_profiles
        WHERE user_id = ? AND revision = ?`,
      )
      .bind(crypto.randomUUID(), changedAt, userId, revision),
  ]);
  if (results.some((result) => !result.success)) {
    throw new Error("Öğretmen profili güncellenemedi.");
  }
  const updated = await getTeacherProfile(userId);
  if (!updated || updated.revision !== revision) {
    throw new Error("Profil güncellemesi doğrulanamadı.");
  }
  return updated;
}
