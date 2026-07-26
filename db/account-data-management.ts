import { getDatabase } from "./runtime-env";

export const RECORD_TRASH_RETENTION_DAYS = 30;
export const RECORD_DELETE_CONFIRMATION = "KAYITLARIMI SİL";

function retentionCutoff() {
  const cutoff = new Date();
  cutoff.setUTCDate(cutoff.getUTCDate() - RECORD_TRASH_RETENTION_DAYS);
  return cutoff.toISOString();
}

async function purgeExpiredTrash(userId: string) {
  const result = await getDatabase()
    .prepare(
      `DELETE FROM pedagogical_records
       WHERE user_id = ?
         AND deleted_at IS NOT NULL
         AND deleted_at < ?`,
    )
    .bind(userId, retentionCutoff())
    .run();
  if (!result.success) throw new Error("Süresi dolan kayıtlar temizlenemedi.");
}

export async function getAccountDataPolicy(userId: string) {
  await purgeExpiredTrash(userId);
  const row = await getDatabase()
    .prepare(
      `SELECT
         SUM(CASE WHEN deleted_at IS NULL THEN 1 ELSE 0 END) AS active_revisions,
         SUM(CASE WHEN deleted_at IS NOT NULL THEN 1 ELSE 0 END) AS trashed_revisions,
         MAX(deleted_at) AS last_deleted_at
       FROM pedagogical_records
       WHERE user_id = ?`,
    )
    .bind(userId)
    .first<{
      active_revisions: number | null;
      trashed_revisions: number | null;
      last_deleted_at: string | null;
    }>();
  return {
    activeRevisionCount: row?.active_revisions ?? 0,
    trashedRevisionCount: row?.trashed_revisions ?? 0,
    lastDeletedAt: row?.last_deleted_at ?? null,
    trashRetentionDays: RECORD_TRASH_RETENTION_DAYS,
    policies: {
      accountAndProfile: "Hesap etkin olduğu sürece saklanır.",
      pedagogicalRecords:
        "Öğretmen silene kadar saklanır; silinen kayıtlar 30 gün geri alınabilir.",
      studentData:
        "Öğrenci kişisel verileri kalıcı hesap arşivinde saklanmaz; yalnız etkin oturum belleğinde işlenir.",
      exportedFiles:
        "İndirilen dosyaların saklama ve silme sorumluluğu öğretmene aittir.",
    },
  };
}

export async function movePedagogicalRecordsToTrash(
  userId: string,
  expectedRevisionCount: number,
) {
  const policy = await getAccountDataPolicy(userId);
  if (policy.activeRevisionCount !== expectedRevisionCount) {
    throw new Error(
      "Kayıt sayısı değişti. Silme kapsamını yeniden kontrol edin.",
    );
  }
  if (expectedRevisionCount < 1) {
    throw new Error("Silinecek etkin pedagojik kayıt bulunamadı.");
  }
  const deletedAt = new Date().toISOString();
  const result = await getDatabase()
    .prepare(
      `UPDATE pedagogical_records
       SET deleted_at = ?
       WHERE user_id = ? AND deleted_at IS NULL`,
    )
    .bind(deletedAt, userId)
    .run();
  if (!result.success) throw new Error("Pedagojik kayıtlar silme alanına taşınamadı.");
  return getAccountDataPolicy(userId);
}

export async function restorePedagogicalRecords(userId: string) {
  await purgeExpiredTrash(userId);
  const result = await getDatabase()
    .prepare(
      `UPDATE pedagogical_records
       SET deleted_at = NULL
       WHERE user_id = ? AND deleted_at IS NOT NULL`,
    )
    .bind(userId)
    .run();
  if (!result.success) throw new Error("Pedagojik kayıtlar geri yüklenemedi.");
  return getAccountDataPolicy(userId);
}
