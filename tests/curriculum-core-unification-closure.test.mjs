import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { loadPackage } from "../src/core/curriculum/package-loader.ts";

const fixture = JSON.parse(
  await readFile(
    new URL("./fixtures/curriculum-core-unification-closure.json", import.meta.url),
    "utf8",
  ),
);
const activeCanonical = JSON.parse(
  await readFile(
    new URL("../app/data/felsefe_curriculum_2026.json", import.meta.url),
    "utf8",
  ),
);
const loaderSource = await readFile(
  new URL("../src/core/curriculum/package-loader.ts", import.meta.url),
  "utf8",
);
const runtimeSource = await readFile(
  new URL("../app/data/curriculum-runtime.ts", import.meta.url),
  "utf8",
);
const philosophyAdapterSource = await readFile(
  new URL("../src/curriculum-packages/philosophy-2026.ts", import.meta.url),
  "utf8",
);
const pedagogicalSource = await readFile(
  new URL("../app/data/curriculum.ts", import.meta.url),
  "utf8",
);

const canonicalUnits = [
  ...activeCanonical.grades["10"].units,
  ...activeCanonical.grades["11"].units,
];

test("Müfredat Çekirdeği 1.2 kapanış matrisi 1.1 sınırlarını sabitler", () => {
  assert.equal(fixture.schemaVersion, "1.0.0");
  assert.equal(fixture.closureId, "curriculum-core-unification-1.2");
  assert.equal(fixture.canonicalSource, "app/data/felsefe_curriculum_2024.json");
  assert.deepEqual(fixture.disciplines, ["philosophy", "sociology"]);
  assert.deepEqual(fixture.excludedFollowUpWork, [
    "phaseBase",
    "duration-hours-week-model",
    "outcome-specific-lesson-flows",
  ]);
});

test("etkin 2026 kanonik JSON ile yüklenen felsefe paketi kapsam paritesini korur", () => {
  const philosophy = loadPackage("philosophy");
  assert.equal(philosophy.manifest.datasetVersion, "2026.1");
  assert.equal(philosophy.manifest.source.year, 2026);
  assert.equal(philosophy.units.length, fixture.philosophy.unitCount);
  assert.equal(
    philosophy.units.flatMap((unit) => unit.outcomes).length,
    fixture.philosophy.outcomeCount,
  );
  assert.deepEqual(
    philosophy.units.map((unit) => ({
      code: unit.code,
      grade: unit.grade,
      name: unit.name,
      durationHours: unit.durationHours,
      outcomeCodes: unit.outcomes.map((outcome) => outcome.code),
    })),
    canonicalUnits.map((unit) => ({
      code: unit.unit_code,
      grade: unit.grade,
      name: unit.unit_name,
      durationHours: unit.duration_hours,
      outcomeCodes: unit.learning_outcomes.map((outcome) => outcome.outcome_code),
    })),
  );
});

test("ders saati ve okul temelli planlama saatleri sınıf bazında korunur", () => {
  const philosophy = loadPackage("philosophy");
  for (const grade of ["10", "11"]) {
    const expected = fixture.philosophy.grades[grade];
    assert.equal(
      philosophy.units
        .filter((unit) => unit.grade === Number(grade))
        .reduce((sum, unit) => sum + unit.durationHours, 0),
      expected.instructionHours,
    );
    assert.equal(
      activeCanonical.grades[grade].school_based_planning_hours,
      expected.schoolBasedPlanningHours,
    );
  }
});

test("felsefe ve sosyoloji aynı paket yükleyici ve runtime adaptör sınırından geçer", () => {
  assert.match(loaderSource, /philosophy:\s*philosophy2026Package/u);
  assert.match(loaderSource, /sociology:\s*sociology2026Package/u);
  assert.doesNotMatch(loaderSource, /units:\s*\[\]/u);
  assert.match(runtimeSource, /runtimeUnitAdapters/u);
  assert.doesNotMatch(runtimeSource, /subjectCode === "philosophy"/u);

  const philosophy = loadPackage("philosophy");
  const sociology = loadPackage("sociology");
  assert.equal(philosophy.units.length, fixture.philosophy.unitCount);
  assert.ok(sociology.units.length > 0);
  assert.throws(() => loadPackage("psychology"), /paketi bulunamadı/u);
});

test("resmî paket ile pedagojik zenginleştirme ayrımı ve mutasyon yalıtımı korunur", () => {
  assert.match(philosophyAdapterSource, /canonicalCurriculum/u);
  assert.doesNotMatch(philosophyAdapterSource, /strategy:/u);

  assert.match(loaderSource, /structuredClone\(curriculumPackage\)/u);
  assert.match(pedagogicalSource, /competencyFramework/u);
  assert.match(pedagogicalSource, /learningTeachingExperiences/u);

  const first = loadPackage("philosophy");
  first.units[0].name = "Bozuk";
  first.units[0].outcomes[0].description = "Bozuk";
  const second = loadPackage("philosophy");
  assert.notEqual(second.units[0].name, "Bozuk");
  assert.notEqual(second.units[0].outcomes[0].description, "Bozuk");
});
