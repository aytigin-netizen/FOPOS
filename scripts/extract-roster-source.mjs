#!/usr/bin/env node
/**
 * FOPOS — öğrenci listesi kaynağı çıkarıcısı.
 *
 * FOPOS'un öğrenci listeleri hesap dışa aktarımında **bilerek dışarıda
 * bırakılır** (öğrenci kişisel verisi). Aynı öğretmenin sınıf listeleri
 * "Felsefe Grubu Ödev Takibi" uygulamasının D1 veritabanında bulunur ve
 * aynı Cloudflare hesabında saklanır. Bu betik o listeleri, FOPOS'un
 * taşıma içe aktarıcısının anlayacağı biçime çıkarır.
 *
 * Gerekli ortam değişkenleri:
 *   CLOUDFLARE_API_TOKEN   D1: Edit yetkili token
 *   CLOUDFLARE_ACCOUNT_ID  hesap kimliği
 *
 * Kullanım:
 *   node scripts/extract-roster-source.mjs <çıktı.json> [ödev-takibi-db-id]
 */
import { writeFile } from "node:fs/promises";

const [, , outputPath, databaseIdArg] = process.argv;
if (!outputPath) {
  console.error(
    "Kullanım: node scripts/extract-roster-source.mjs <çıktı.json> [ödev-takibi-db-id]",
  );
  process.exit(2);
}

const apiToken = process.env.CLOUDFLARE_API_TOKEN;
const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const databaseId = databaseIdArg ?? "6aafacb9-3456-4037-8f3a-cfaafe956e5c";

if (!apiToken || !accountId) {
  console.error("CLOUDFLARE_API_TOKEN ve CLOUDFLARE_ACCOUNT_ID gerekli.");
  process.exit(2);
}

const apiBase = `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}`;

async function query(sql, params = []) {
  const response = await fetch(`${apiBase}/query`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ sql, params }),
  });
  const payload = await response.json();
  if (!response.ok || !payload.success) {
    throw new Error(
      `D1 sorgusu başarısız: ${JSON.stringify(payload.errors ?? payload).slice(0, 500)}`,
    );
  }
  return payload.result?.[0]?.results ?? [];
}

// Sahip hesabı: en çok sınıfı ve öğrencisi olan teacher_id.
const owners = await query(
  `SELECT c.teacher_id AS teacher_id, COUNT(DISTINCT c.id) AS classes
     FROM teacher_classes c
    GROUP BY c.teacher_id
    ORDER BY classes DESC, c.teacher_id ASC`,
);
if (!owners.length) throw new Error("Ödev Takibi veritabanında sınıf bulunamadı.");
const teacherId = owners[0].teacher_id;
console.log("Sahip hesabı:", teacherId);

const classes = await query(
  `SELECT c.id AS id, c.label AS label, c.grade AS grade, c.school_year AS school_year
     FROM teacher_classes c
    WHERE c.teacher_id = ? AND c.archived = 0
    ORDER BY c.grade ASC, c.id ASC`,
  [teacherId],
);

const rosterRows = await query(
  `SELECT class_id AS class_id, number AS number, name AS name
     FROM teacher_roster
    WHERE teacher_id = ? AND archived = 0
    ORDER BY class_id ASC, number ASC`,
  [teacherId],
);

const byClass = new Map();
for (const row of rosterRows) {
  if (!byClass.has(row.class_id)) byClass.set(row.class_id, []);
  byClass.get(row.class_id).push({ no: String(row.number), name: row.name });
}

const parsed = classes.map((row) => {
  // "10/A" → grade 10, branch "A"
  const match = /^(\d{1,2})\s*\/\s*([A-ZÇĞİÖŞÜ0-9]{1,4})$/u.exec(
    String(row.label ?? row.id),
  );
  const grade = match ? Number(match[1]) : row.grade;
  const branch = match
    ? match[2].toLocaleUpperCase("tr-TR")
    : String(row.id).replace(/^\d{1,2}/u, "").toLocaleUpperCase("tr-TR");
  const students = byClass.get(row.id) ?? [];
  return {
    grade,
    branch,
    label: row.label ?? row.id,
    schoolYear: row.school_year,
    students,
  };
});

const unmatched = parsed.filter((entry) => !entry.branch || entry.branch.length > 4);
if (unmatched.length) {
  console.warn("Şube kodu çözümlenemeyen sınıflar:", unmatched.map((e) => e.label));
}

const source = {
  source: "Felsefe Grubu Ödev Takibi (D1: felsefe-odev-takip)",
  databaseId,
  teacherId,
  schoolYear: parsed[0]?.schoolYear ?? null,
  extractedAt: new Date().toISOString(),
  classes: parsed,
};

await writeFile(outputPath, `${JSON.stringify(source, null, 2)}\n`, "utf8");

const total = parsed.reduce((sum, entry) => sum + entry.students.length, 0);
console.log(
  `✓ ${parsed.length} sınıf, ${total} öğrenci → ${outputPath}`,
);
for (const entry of parsed) {
  console.log(`   ${entry.label.padEnd(8)} ${entry.students.length} öğrenci`);
}
