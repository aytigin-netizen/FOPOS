import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const page = await readFile(
  new URL("../app/page.tsx", import.meta.url),
  "utf8",
);
const annual = await readFile(
  new URL("../app/modules/annual-plan/AnnualPlanModule.tsx", import.meta.url),
  "utf8",
);
const meeting = await readFile(
  new URL(
    "../app/modules/department-meeting/DepartmentMeetingModule.tsx",
    import.meta.url,
  ),
  "utf8",
);
const analysis = await readFile(
  new URL(
    "../app/modules/exam-analysis/ExamAnalysisModule.tsx",
    import.meta.url,
  ),
  "utf8",
);
const exam = await readFile(
  new URL("../app/modules/exam-builder/ExamBuilder.tsx", import.meta.url),
  "utf8",
);

test("dinamik sonuç bölümleri programatik odak alır", () => {
  for (const source of [page, annual, meeting, analysis, exam]) {
    assert.match(source, /tabIndex=\{-1\}/);
    assert.match(source, /\.focus\(\)/);
  }
});

test("yalnız ikon içeren soru işlem düğmelerinin erişilebilir adı vardır", () => {
  assert.match(exam, /aria-label=\{`Soru \$\{i \+ 1\} yukarı taşı`\}/);
  assert.match(exam, /aria-label=\{`Soru \$\{i \+ 1\} aşağı taşı`\}/);
  assert.match(exam, /aria-label=\{`Soru \$\{i \+ 1\} sil`\}/);
  assert.match(analysis, /aria-label=\{`Soru \$\{i \+ 1\} tanımını sil`\}/);
});

test("tablo benzeri dinamik puan alanları bağlamsal ad taşır", () => {
  assert.match(analysis, /öğrenci okul numarası/);
  assert.match(analysis, /öğrenci adı soyadı/);
  assert.match(analysis, /öğrenci, soru \$\{qi \+ 1\} puanı/);
  assert.match(exam, /Soru \$\{i \+ 1\} bilişsel düzeyi/);
  assert.match(exam, /Soru \$\{i \+ 1\} puanı/);
});
