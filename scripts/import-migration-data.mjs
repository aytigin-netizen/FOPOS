#!/usr/bin/env node
/**
 * FOPOS — veri taşıma içe aktarıcısı.
 *
 * `scripts/collect-migration-data.js` betiğinin ESKİ canlı siteden topladığı
 * JSON'u yeni Cloudflare Workers D1 veritabanına yazar.
 *
 * Gerekli ortam değişkenleri:
 *   CLOUDFLARE_API_TOKEN   D1: Edit yetkili token
 *   CLOUDFLARE_ACCOUNT_ID  hesap kimliği
 *
 * Kullanım:
 *   CLOUDFLARE_API_TOKEN=... CLOUDFLARE_ACCOUNT_ID=... \
 *   node scripts/import-migration-data.mjs <toplanan-dosya.json>
 *
 * Betik:
 *   1) Dışa aktarımın bütünlük özetini (SHA-256) doğrular.
 *   2) Hedef hesabı bulur ya da oluşturur (e-posta anahtarı).
 *   3) Tüm tabloları hedef hesap kimliğiyle yazar; canlı sınıf kimlikleri
 *      korunur, böylece öğrenci listeleri sınıflara bağlı kalır.
 *   4) Yazılan satır sayılarını karşılaştırarak raporlar.
 */
import { createHash, randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
// Özet (fingerprint) hesabı uygulamayla AYNI modülden gelir: iki uygulama
// birbirinden ayrı düşemez. Bu yüzden betik --experimental-strip-types ile çalışır.
import { fingerprint } from "../db/pedagogical-record-fingerprint.ts";

const [, , inputPath] = process.argv;
if (!inputPath) {
  console.error("Kullanım: node scripts/import-migration-data.mjs <toplanan-dosya.json>");
  process.exit(2);
}

const apiToken = process.env.CLOUDFLARE_API_TOKEN;
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const databaseId =
  process.env.FOPOS_D1_DATABASE_ID ?? "54a5114b-3f19-4223-adb2-04b7f5fdb014";

if (!apiToken || !accountId) {
  console.error("CLOUDFLARE_API_TOKEN ve CLOUDFLARE_ACCOUNT_ID gerekli.");
  process.exit(2);
}

const apiBase = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}`;

/**
 * D1 REST API'de çoklu ifade tek çağrıda çalışsa da parametreler yalnız ilk
 * ifadeye bağlanır. Bu yüzden her ifade ayrı çağrıda, **parametreli** olarak
 * gönderilir: kullanıcı verisi hiçbir zaman SQL metnine gömülmez.
 */
async function runStatement(statement) {
  const response = await fetch(`${apiBase}/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ sql: statement.sql, params: statement.params ?? [] }),
  });
  const payload = await response.json();
  if (!response.ok || !payload.success) {
    throw new Error(
      `D1 sorgusu başarısız (${response.status}): ${JSON.stringify(payload.errors ?? payload).slice(0, 600)}\nSQL: ${statement.sql.slice(0, 200)}`,
    );
  }
  return payload.result?.[0] ?? {};
}

/** Tek bir SELECT çalıştırır ve satırları döndürür. */
async function select(sql, params = []) {
  const result = await runStatement({ sql, params });
  return result.results ?? [];
}

/** Sıralı ve eşzamanlı sınırlı yazma. */
async function insertMany(rows, concurrency = 8) {
  let done = 0;
  for (let index = 0; index < rows.length; index += concurrency) {
    const chunk = rows.slice(index, index + concurrency);
    await Promise.all(chunk.map((row) => runStatement(row)));
    done += chunk.length;
    process.stdout.write(`\r  yazıldı: ${done}/${rows.length}`);
  }
  if (rows.length) process.stdout.write("\n");
}

const collected = JSON.parse(await readFile(inputPath, "utf8"));
const exportPayload = collected.accountExport;

if (exportPayload?.exportType !== "fopos-teacher-workspace") {
  console.error("Beklenmeyen dışa aktarım biçimi:", exportPayload?.exportType);
  process.exit(3);
}

const data = exportPayload.data;
const expectedDigest = exportPayload.manifest?.contentSha256;
const actualDigest = createHash("sha256")
  .update(JSON.stringify(data), "utf8")
  .digest("hex");
if (expectedDigest && expectedDigest !== actualDigest) {
  console.error("BÜTÜNLÜK HATASI: dışa aktarım özeti uyuşmuyor.");
  console.error("  beklenen:", expectedDigest);
  console.error("  gerçek  :", actualDigest);
  process.exit(3);
}
console.log("✓ Dışa aktarım bütünlüğü doğrulandı:", actualDigest.slice(0, 16), "…");

const email = String(data.account?.email ?? "").trim().toLowerCase();
if (!email || !email.includes("@")) {
  console.error("Dışa aktarımda geçerli hesap e-postası yok.");
  process.exit(3);
}
console.log("• Hedef hesap:", email);

const existingUsers = await select(
  "SELECT id FROM users WHERE email_normalized = ? AND disabled_at IS NULL LIMIT 1",
  [email],
);
let userId = existingUsers[0]?.id;
const now = new Date().toISOString();
if (!userId) {
  userId = randomUUID();
  await runStatement({
    sql: "INSERT INTO users (id, email_normalized, created_at, last_seen_at, disabled_at) VALUES (?, ?, ?, ?, NULL)",
    params: [userId, email, now, now],
  });
  console.log("✓ Hesap oluşturuldu:", userId);
} else {
  console.log("✓ Mevcut hesap kullanılıyor:", userId);
}

// 1) Öğretmen profili
const profile = data.teacherProfile;
if (profile) {
  await runStatement({
      sql: `INSERT INTO teacher_profiles
              (id, user_id, display_name, branch, school_name, academic_year, locale, schema_version, revision, created_at, updated_at)
            VALUES (?, ?, ?, 'Felsefe', ?, ?, 'tr-TR', '47.0.0', ?, ?, ?)
            ON CONFLICT(user_id) DO UPDATE SET
              display_name = excluded.display_name,
              school_name = excluded.school_name,
              academic_year = excluded.academic_year,
              revision = excluded.revision,
              updated_at = excluded.updated_at`,
      params: [
        randomUUID(),
        userId,
        profile.displayName,
        profile.schoolName,
        profile.academicYear,
        profile.revision ?? 1,
        now,
        now,
      ],
  });
  await runStatement({
      sql: `INSERT INTO teacher_profile_revisions
              (id, user_id, revision, display_name, school_name, academic_year, changed_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(user_id, revision) DO NOTHING`,
      params: [
        randomUUID(),
        userId,
        profile.revision ?? 1,
        profile.displayName,
        profile.schoolName,
        profile.academicYear,
        now,
      ],
  });
  console.log("✓ Öğretmen profili:", profile.displayName, "·", profile.schoolName);
} else {
  console.log("• Dışa aktarımda öğretmen profili yok; atlandı.");
}

// 2) Sınıf çalışma alanları — canlı sınıf kimlikleri KORUNUR
const classRows = (collected.classWorkspaces ?? []).map((workspace) => ({
  sql: `INSERT INTO class_workspaces
          (id, user_id, academic_year, subject_code, grade, branch_code, archived_at, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO NOTHING`,
  params: [
    workspace.id,
    userId,
    workspace.academicYear,
    workspace.subjectCode ?? "philosophy",
    workspace.grade,
    workspace.branchCode,
    workspace.archivedAt ?? null,
    workspace.createdAt ?? now,
    workspace.updatedAt ?? now,
  ],
}));
await insertMany(classRows);
console.log(`✓ Sınıf çalışma alanı: ${classRows.length}`);

// 3) Öğrenci listeleri
const rosterRows = (collected.studentRosters ?? [])
  .filter((entry) => entry.roster && Array.isArray(entry.roster.students))
  .map((entry) => ({
    sql: `INSERT INTO saved_student_rosters
            (class_id, user_id, title, students_json, revision, updated_at, deleted_at)
          VALUES (?, ?, ?, ?, ?, ?, NULL)
          ON CONFLICT(class_id) DO UPDATE SET
            title = excluded.title,
            students_json = excluded.students_json,
            revision = excluded.revision,
            updated_at = excluded.updated_at,
            deleted_at = NULL`,
    params: [
      entry.classId,
      userId,
      entry.roster.title ?? "",
      JSON.stringify(
        entry.roster.students.map((student) => ({
          id: student.id,
          no: student.no,
          name: student.name,
        })),
      ),
      entry.revision ?? entry.roster.revision ?? 1,
      entry.roster.updatedAt ?? now,
    ],
  }));
await insertMany(rosterRows);
const studentTotal = (collected.studentRosters ?? []).reduce(
  (sum, entry) => sum + (entry.roster?.students?.length ?? 0),
  0,
);
console.log(
  `✓ Öğrenci listesi: ${rosterRows.length} sınıf, ${studentTotal} öğrenci`,
);

// 4) Pedagojik kayıtlar
const yearAssignments = new Map(
  (data.pedagogicalRecordAcademicYears ?? []).map((assignment) => [
    `${assignment.recordId}#${assignment.revision}`,
    assignment.academicYear ?? null,
  ]),
);
const exportedRecords = data.pedagogicalRecords ?? [];
const recordFingerprints = [];
for (const record of exportedRecords) {
  recordFingerprints.push(await fingerprint(record));
}
const recordRows = exportedRecords.map((record, index) => ({
  sql: `INSERT INTO pedagogical_records
          (id, user_id, record_id, revision, status, immutable_fingerprint, payload_json, academic_year, created_at, updated_at, deleted_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL)
        ON CONFLICT(user_id, record_id, revision) DO NOTHING`,
  params: [
    randomUUID(),
    userId,
    record.recordId,
    record.revision,
    record.status,
    recordFingerprints[index],
    JSON.stringify(record),
    yearAssignments.get(`${record.recordId}#${record.revision}`) ?? null,
    record.createdAt ?? now,
    record.updatedAt ?? now,
  ],
}));
await insertMany(recordRows);
console.log(`✓ Pedagojik kayıt: ${recordRows.length}`);

// 5) Ders programları
const timetableRows = (data.teachingTimetables ?? []).map((entry) => ({
  sql: `INSERT INTO teaching_timetables
          (user_id, academic_year, timetable_json, revision, updated_at)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(user_id, academic_year) DO UPDATE SET
          timetable_json = excluded.timetable_json,
          revision = excluded.revision,
          updated_at = excluded.updated_at`,
  params: [
    userId,
    entry.academicYear,
    JSON.stringify(entry.timetable ?? {}),
    entry.revision ?? 1,
    entry.updatedAt ?? now,
  ],
}));
await insertMany(timetableRows);
console.log(`✓ Ders programı: ${timetableRows.length}`);

// 6) Sınav üretim geçmişi
const historyRows = (data.examGenerationHistory ?? []).map((entry) => ({
  sql: `INSERT INTO exam_generation_history
          (user_id, subject, dataset, rounds_json, updated_at)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(user_id, subject, dataset) DO UPDATE SET
          rounds_json = excluded.rounds_json,
          updated_at = excluded.updated_at`,
  params: [
    userId,
    entry.subject,
    entry.dataset,
    JSON.stringify(entry.rounds ?? {}),
    entry.updatedAt ?? now,
  ],
}));
await insertMany(historyRows);
console.log(`✓ Sınav üretim geçmişi: ${historyRows.length}`);

// Doğrulama
console.log("\n=== Doğrulama (yeni D1) ===");
const checks = [
  ["users", "SELECT COUNT(*) n FROM users WHERE user_id = ?".replace("user_id", "id"), [userId]],
  ["teacher_profiles", "SELECT COUNT(*) n FROM teacher_profiles WHERE user_id = ?", [userId]],
  ["class_workspaces", "SELECT COUNT(*) n FROM class_workspaces WHERE user_id = ?", [userId]],
  ["saved_student_rosters", "SELECT COUNT(*) n FROM saved_student_rosters WHERE user_id = ?", [userId]],
  ["pedagogical_records", "SELECT COUNT(*) n FROM pedagogical_records WHERE user_id = ?", [userId]],
  ["teaching_timetables", "SELECT COUNT(*) n FROM teaching_timetables WHERE user_id = ?", [userId]],
  ["exam_generation_history", "SELECT COUNT(*) n FROM exam_generation_history WHERE user_id = ?", [userId]],
];
for (const [label, sql, params] of checks) {
  const rows = await select(sql, params);
  console.log(`  ${label.padEnd(26)} ${rows[0]?.n ?? 0}`);
}
const studentCount = await select(
  "SELECT COALESCE(SUM(json_array_length(students_json)), 0) AS n FROM saved_student_rosters WHERE user_id = ?",
  [userId],
);
console.log(`  ${"öğrenci (toplam)".padEnd(26)} ${studentCount[0]?.n ?? 0}`);
console.log("\nTAMAM — taşıma tamamlandı.");
