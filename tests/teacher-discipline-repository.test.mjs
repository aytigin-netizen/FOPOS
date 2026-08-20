import assert from "node:assert/strict";
import test from "node:test";
import {
  listTeacherDisciplines,
  replaceTeacherDisciplines,
} from "../db/teacher-disciplines.ts";
import { runWithDatabase } from "../db/runtime-env.ts";

function fakeDatabase(activeSubjects = []) {
  const rows = [
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
  return {
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
      };
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
