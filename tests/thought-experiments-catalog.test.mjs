import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { thoughtExperiments } from "../app/modules/thought-experiments/data/experiments.ts";

const curriculum = JSON.parse(
  await readFile(new URL("../app/data/felsefe_curriculum_2026.json", import.meta.url), "utf8"),
);

test("pilot kataloğu sekiz onaylı kayıttan ve dengeli sınıf dağılımından oluşur", () => {
  assert.equal(thoughtExperiments.length, 8);
  assert.equal(thoughtExperiments.filter((item) => item.grade === 10).length, 4);
  assert.equal(thoughtExperiments.filter((item) => item.grade === 11).length, 4);
  assert.equal(new Set(thoughtExperiments.map((item) => item.id)).size, 8);
});

test("her pilot kaydı gerçek FOPOS 2026.1 ünitesine ve öğrenme çıktısına bağlanır", () => {
  for (const experiment of thoughtExperiments) {
    const grade = curriculum.grades[String(experiment.grade)];
    const unit = grade.units.find((item) => item.unit_code === experiment.unitCode);
    assert.ok(unit, `${experiment.id}: ${experiment.unitCode} ünitesi bulunamadı`);
    for (const code of experiment.outcomeCodes) {
      assert.ok(
        unit.learning_outcomes.some((outcome) => outcome.outcome_code === code),
        `${experiment.id}: ${code} çıktısı ilgili ünitede bulunamadı`,
      );
    }
    assert.ok(experiment.sources.length > 0, `${experiment.id}: kaynak eksik`);
    assert.ok(experiment.sources.every((source) => /^https:\/\//u.test(source.url)));
    assert.ok(experiment.discussionQuestions.length >= 2);
    assert.ok(experiment.counterArgumentPrompts.length >= 1);
    assert.ok(experiment.facilitatorNotes.length >= 2);
    assert.ok(experiment.ageAppropriateness.length > 20);
  }
});

test("alegori, düşünce deneyi ve ikilem türleri birbirinden ayrılır", () => {
  const kinds = Object.groupBy(thoughtExperiments, (item) => item.kind);
  assert.equal(kinds.allegory?.length, 1);
  assert.equal(kinds.dilemma?.length, 2);
  assert.equal(kinds.thought_experiment?.length, 5);
  assert.equal(thoughtExperiments.find((item) => item.id === "plato-cave")?.kind, "allegory");
});

test("Pascal ve Antigone için son pedagojik düzeltmeler korunur", () => {
  const pascal = thoughtExperiments.find((item) => item.id === "pascal-wager");
  const antigone = thoughtExperiments.find((item) => item.id === "antigone-law");
  assert.ok(pascal?.facilitatorNotes.some((note) => note.includes("kanıtlayan")));
  assert.ok(antigone?.facilitatorNotes.some((note) => note.includes("hak ve özgürlüklerin hukuksal temellerini")));
  assert.ok(antigone?.discussionQuestions.some((question) => question.includes("meşruiyetini")));
});

test("modül öğrenci yanıtlarını ağa veya kalıcı tarayıcı deposuna göndermez", async () => {
  const moduleSource = await readFile(
    new URL("../app/modules/thought-experiments/ThoughtExperimentsModule.tsx", import.meta.url),
    "utf8",
  );
  assert.doesNotMatch(moduleSource, /fetch\s*\(/u);
  assert.doesNotMatch(moduleSource, /localStorage|sessionStorage/u);
  assert.match(moduleSource, /yalnızca açık sayfa oturumu boyunca bellekte tutulur/u);
  assert.match(moduleSource, /getCurriculumContext\("philosophy"\)/u);
});

test("sekiz deneyin her biri kendine özgü erişilebilir görsel tanımı taşır", async () => {
  const visualKinds = new Set(thoughtExperiments.map((item) => item.visual));
  assert.equal(visualKinds.size, 8);
  assert.ok(thoughtExperiments.every((item) => typeof item.visual === "string" && item.visual.length > 0));
  const visualComponent = await readFile(
    new URL("../app/modules/thought-experiments/components/ExperimentVisual.tsx", import.meta.url),
    "utf8",
  );
  assert.match(visualComponent, /role="img"/u);
  assert.match(visualComponent, /aria-label=\{title\}/u);
  for (const kind of visualKinds) assert.ok(visualComponent.includes(`"${kind}"`), `${kind} görseli bileşende tanımlı olmalı`);
});
