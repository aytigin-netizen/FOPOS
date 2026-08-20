import { getDatabase } from "./runtime-env";

export const ACCOUNT_DELETE_CONFIRMATION = "HESABIMI KALICI OLARAK SİL";

export async function getAccountClosureSummary(userId: string) {
  const row = await getDatabase()
    .prepare(
      `SELECT
         EXISTS(
           SELECT 1 FROM teacher_profiles WHERE user_id = ?
         ) AS profile_exists,
         (
           SELECT COUNT(*) FROM pedagogical_records WHERE user_id = ?
         ) AS record_revisions`,
    )
    .bind(userId, userId)
    .first<{
      profile_exists: number;
      record_revisions: number;
    }>();

  return {
    profileExists: row?.profile_exists === 1,
    recordRevisionCount: row?.record_revisions ?? 0,
  };
}

export async function permanentlyDeleteAccount(
  userId: string,
  expectedProfileExists: boolean,
  expectedRecordRevisionCount: number,
) {
  const summary = await getAccountClosureSummary(userId);
  if (
    summary.profileExists !== expectedProfileExists ||
    summary.recordRevisionCount !== expectedRecordRevisionCount
  ) {
    throw new Error(
      "Hesap verilerinin kapsamı değişti. Kalıcı silme kapsamını yeniden kontrol edin.",
    );
  }

  const db = getDatabase();
  const results = await db.batch([
    db.prepare("DELETE FROM pedagogical_records WHERE user_id = ?").bind(userId),
    db.prepare("DELETE FROM teacher_profile_revisions WHERE user_id = ?").bind(userId),
    db.prepare("DELETE FROM teacher_profiles WHERE user_id = ?").bind(userId),
    db.prepare("DELETE FROM users WHERE id = ?").bind(userId),
  ]);
  if (results.some((result) => !result.success)) {
    throw new Error("Hesap ve bağlı veriler kalıcı olarak silinemedi.");
  }
}
