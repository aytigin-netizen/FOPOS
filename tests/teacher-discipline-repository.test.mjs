import assert from "node:assert/strict";
import test from "node:test";
import {
  listTeacherDisciplines,
  replaceTeacherDisciplines,
} from "../db/teacher-disciplines.ts";
import { runWithDatabase } from "../db/runtime-env.ts";

function fakeDatabase(activeSubjects = [], initialRows) {
  const rows =
    initialRows ?? [
      {
        user_id: "teacher-a",
        discipline_code: "philosophy",
        is_default: 1,
        created_at: "2026-07-27T00:00:00.000Z",
        updated_at: "2026-07-27T00:00:00.000Z",
      },
      {
        user_id: "teacher-b",
        discipline_code: "sociology",
        is_default: 1,
        created_at: "2026-07-27T00:00:00.000Z",
        updated_at: "2026-07-27T00:00:00.000Z",
      },
    ];
  let writes = 0;
  return {
    get writes() {
      return writes;
    },
    prepare(sql) {
      let args = [];
      return {
        bind(...values) {
          args = values;
          return this;
        },
        async all() {
          if (sql.includes("SELECT DISTINCT subject_code")) {
            return {
              results: activeSubjects.map((subject_code) => ({ subject_code })),
            };
          }
          const [userId] = args;
          return { results: rows.filter((row) => row.user_id === userId) };
        },
        async run() {
          writes += 1;
          if (sql.startsWith("DELETE FROM teacher_discipline_assignments")) {
            const [userId] = args;
            for (let i = rows.length - 1; i >= 0; i -= 1) {
              if (rows[i].user_id === userId) rows.splice(i, 1);
            }
          } else if (sql.startsWith("INSERT INTO teacher_discipline_assignments")) {
            const [, userId, disciplineCode, isDefault, createdAt, updatedAt] = args;
            rows.push({
              user_id: userId,
              discipline_code: disciplineCode,
              is_default: isDefault,
              created_at: createdAt,
              updated_at: updatedAt,
            });
          }
          return { success: true };
        },
      };
    },
    async batch(statements) {
      const results = [];
      for (const statement of statements) results.push(await statement.run());
      return results;
    },
  };
}

test("branş atamaları yalnız doğrulanmış öğretmen sınırında listelenir", async () => {
  const listed = await runWithDatabase(fakeDatabase(), () =>
    listTeacherDisciplines("teacher-a"),
  );
  assert.deepEqual(
    listed.map((item) => item.disciplineCode),
    ["philosophy"],
  );
});

test("atama kümesi yinelenen veya varsayılansız branşı reddeder", async () => {
  await assert.rejects(
    runWithDatabase(fakeDatabase(), () =>
      replaceTeacherDisciplines("teacher-a", [
        { disciplineCode: "philosophy", isDefault: true },
        { disciplineCode: "philosophy", isDefault: false },
      ]),
    ),
    /birden fazla/,
  );
  await assert.rejects(
    runWithDatabase(fakeDatabase(), () =>
      replaceTeacherDisciplines("teacher-a", [
        { disciplineCode: "philosophy", isDefault: false },
      ]),
    ),
    /Tam olarak bir varsayılan/,
  );
});

test("etkin sınıf çalışma alanında kullanılan branş kaldırılamaz", async () => {
  await assert.rejects(
    runWithDatabase(fakeDatabase(["philosophy"]), () =>
      replaceTeacherDisciplines("teacher-a", [
        { disciplineCode: "sociology", isDefault: true },
      ]),
    ),
    /etkin sınıf çalışma alanında kullanılıyor/,
  );
});

test("öğretmen yeni bir sociology branş ataması yapamaz (capability guard)", async () => {
  await assert.rejects(
    runWithDatabase(fakeDatabase(), () =>
      replaceTeacherDisciplines("teacher-a", [
        { disciplineCode: "philosophy", isDefault: true },
        { disciplineCode: "sociology", isDefault: false },
      ]),
    ),
    /sociology branşı şu anda etkin değil; yeni atama yapılamaz/,
  );
});

test("wait mode: mevcut sociology ataması yeniden gönderildiğinde korunur", async () => {
  const rows = [
    {
      user_id: "teacher-a",
      discipline_code: "philosophy",
      is_default: 1,
      created_at: "2026-07-27T00:00:00.000Z",
      updated_at: "2026-07-27T00:00:00.000Z",
    },
    {
      user_id: "teacher-a",
      discipline_code: "sociology",
      is_default: 0,
      created_at: "2026-07-27T00:00:00.000Z",
      updated_at: "2026-07-27T00:00:00.000Z",
    },
  ];
  const database = fakeDatabase([], rows);
  const updated = await runWithDatabase(database, () =>
    replaceTeacherDisciplines("teacher-a", [
      { disciplineCode: "philosophy", isDefault: true },
      { disciplineCode: "sociology", isDefault: false },
    ]),
  );
  assert.deepEqual(
    updated.map((item) => item.disciplineCode).sort(),
    ["philosophy", "sociology"],
  );
  assert.equal(database.writes, 3); // 1 DELETE + 2 INSERT
});
