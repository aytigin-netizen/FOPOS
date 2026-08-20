import assert from "node:assert/strict";
import test from "node:test";
import {
  createClassWorkspace,
  listClassWorkspaces,
  setClassWorkspaceArchived,
} from "../db/class-workspaces.ts";
import { runWithDatabase } from "../db/runtime-env.ts";

function fakeDatabase() {
  const rows = [
    {
      id: "workspace-a",
      user_id: "teacher-a",
      academic_year: "2026-2027",
      subject_code: "philosophy",
      grade: 10,
      branch_code: "A",
      archived_at: null,
      created_at: "2026-07-26T00:00:00.000Z",
      updated_at: "2026-07-26T00:00:00.000Z",
    },
    {
      id: "workspace-c",
      user_id: "teacher-a",
      academic_year: "2026-2027",
      subject_code: "psychology",
      grade: 11,
      branch_code: "C",
      archived_at: "2026-07-27T00:00:00.000Z",
      created_at: "2026-07-26T00:00:00.000Z",
      updated_at: "2026-07-27T00:00:00.000Z",
    },
    {
      id: "workspace-b",
      user_id: "teacher-b",
      academic_year: "2026-2027",
      subject_code: "philosophy",
      grade: 10,
      branch_code: "B",
      archived_at: null,
      created_at: "2026-07-26T00:00:00.000Z",
      updated_at: "2026-07-26T00:00:00.000Z",
    },
  ];
  const assignments = [
    { user_id: "teacher-a", discipline_code: "philosophy" },
    { user_id: "teacher-a", discipline_code: "sociology" },
    { user_id: "teacher-b", discipline_code: "philosophy" },
  ];
  return {
    rows,
    prepare(sql) {
      let args = [];
      return {
        bind(...values) {
          args = values;
          return this;
        },
        async first() {
          if (sql.includes("SELECT academic_year FROM teacher_profiles")) {
            return { academic_year: "2026-2027" };
          }
          if (sql.includes("FROM teacher_discipline_assignments")) {
            const [userId, disciplineCode] = args;
            return assignments.some(
              (item) =>
                item.user_id === userId &&
                item.discipline_code === disciplineCode,
            )
              ? { 1: 1 }
              : null;
          }
          if (sql.includes("SELECT subject_code")) {
            const [id, userId, year] = args;
            const workspace = rows.find(
              (row) =>
                row.id === id &&
                row.user_id === userId &&
                row.academic_year === year,
            );
            return workspace ? { subject_code: workspace.subject_code } : null;
          }
          if (sql.includes("SELECT archived_at")) {
            const [userId, year, subjectCode, grade, branchCode] = args;
            return (
              rows.find(
                (row) =>
                  row.user_id === userId &&
                  row.academic_year === year &&
                  row.subject_code === subjectCode &&
                  row.grade === grade &&
                  row.branch_code === branchCode,
              ) ?? null
            );
          }
          return null;
        },
        async all() {
          const [userId, year] = args;
          return {
            results: rows.filter(
              (row) =>
                row.user_id === userId && row.academic_year === year,
            ),
          };
        },
        async run() {
          if (sql.includes("INSERT INTO class_workspaces")) {
            const [
              id,
              userId,
              year,
              subjectCode,
              grade,
              branchCode,
              createdAt,
              updatedAt,
            ] = args;
            rows.push({
              id,
              user_id: userId,
              academic_year: year,
              subject_code: subjectCode,
              grade,
              branch_code: branchCode,
              archived_at: null,
              created_at: createdAt,
              updated_at: updatedAt,
            });
          }
          return { success: true };
        },
      };
    },
  };
}

test("sınıf çalışma alanları öğretmen ve ders alanı sınırını davranışta korur", async () => {
  const database = fakeDatabase();
  const listed = await runWithDatabase(database, () =>
    listClassWorkspaces("teacher-a"),
  );
  assert.deepEqual(
    listed.workspaces.map((workspace) => workspace.id),
    ["workspace-a", "workspace-c"],
  );
  assert.equal(listed.workspaces[0].subjectCode, "philosophy");

  const created = await runWithDatabase(database, () =>
    createClassWorkspace("teacher-a", {
      subjectCode: "sociology",
      grade: 12,
      branchCode: "A",
    }),
  );
  assert.equal(
    created.workspaces.some(
      (workspace) =>
        workspace.subjectCode === "sociology" &&
        workspace.grade === 12 &&
        workspace.branchCode === "A",
    ),
    true,
  );
  assert.equal(
    created.workspaces.some((workspace) => workspace.id === "workspace-b"),
    false,
  );
});

test("12. sınıf yalnız destekleyen branşta çalışma alanına açılır", async () => {
  const database = fakeDatabase();
  await assert.doesNotReject(
    runWithDatabase(database, () =>
      createClassWorkspace("teacher-a", {
        subjectCode: "sociology",
        grade: 12,
        branchCode: "D",
      }),
    ),
  );
  await assert.rejects(
    runWithDatabase(database, () =>
      createClassWorkspace("teacher-a", {
        subjectCode: "philosophy",
        grade: 12,
        branchCode: "D",
      }),
    ),
    /12\. sınıf müfredatı bulunmuyor/,
  );
});


test("atanmamış branşla sınıf çalışma alanı oluşturulamaz", async () => {
  await assert.rejects(
    runWithDatabase(fakeDatabase(), () =>
      createClassWorkspace("teacher-a", {
        subjectCode: "psychology",
        grade: 10,
        branchCode: "C",
      }),
    ),
    /öğretmen profilinize atanmamış/,
  );
});


test("arşivlenmiş sınıf atanmamış branşla yeniden etkinleştirilemez", async () => {
  await assert.rejects(
    runWithDatabase(fakeDatabase(), () =>
      setClassWorkspaceArchived("teacher-a", {
        id: "workspace-c",
        archived: false,
      }),
    ),
    /öğretmen profilinize atanmamış/,
  );
});
