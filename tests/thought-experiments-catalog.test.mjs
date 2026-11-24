import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";
import { thoughtExperiments } from "../app/modules/thought-experiments/data/experiments.ts";
import { sceneArtworks } from "../app/modules/thought-experiments/data/scene-artworks.ts";

const curriculum = JSON.parse(
  await readFile(new URL("../app/data/felsefe_curriculum_2026.json", import.meta.url), "utf8"),
);

test("katalog 16 benzersiz deneyi 10. ve 11. sınıflara dengeli biçimde dağıtır", () => {
  assert.equal(thoughtExperiments.length, 16);
  assert.equal(thoughtExperiments.filter((item) => item.grade === 10).length, 10);
  assert.equal(thoughtExperiments.filter((item) => item.grade === 11).length, 6);
  assert.equal(new Set(thoughtExperiments.map((item) => item.id)).size, 16);
  assert.equal(thoughtExperiments.filter((item) => item.wave === "pilot").length, 8);
  assert.equal(thoughtExperiments.filter((item) => item.wave === "wave2").length, 8);
});

test("her deney FOPOS 2026.1 müfredatındaki gerçek ünite ve öğrenme çıktısına bağlanır", () => {
  for (const experiment of thoughtExperiments) {
    const grade = curriculum.grades[String(experiment.grade)];
    const unit = grade.units.find((item) => item.unit_code === experiment.unitCode);
    assert.ok(unit, `${experiment.id}: ${experiment.unitCode} ünitesi bulunamadı`);
    for (const code of experiment.outcomeCodes) {
      assert.ok(unit.learning_outcomes.some((outcome) => outcome.outcome_code === code), `${experiment.id}: ${code} çıktısı ilgili ünitede bulunamadı`);
    }
    assert.ok(experiment.sources.length > 0);
    assert.ok(experiment.sources.every((source) => /^https:\/\//u.test(source.url)));
    assert.ok(experiment.discussionQuestions.length >= 2);
    assert.ok(experiment.counterArgumentPrompts.length >= 1);
    assert.ok(experiment.facilitatorNotes.length >= 2);
    assert.ok(experiment.ageAppropriateness.length > 20);
  }
});

test("16 deneyin her biri yerel görsel ve erişilebilir alternatif metin taşır", async () => {
  assert.equal(Object.keys(sceneArtworks).length, 16);
  for (const experiment of thoughtExperiments) {
    const artwork = sceneArtworks[experiment.visual];
    assert.ok(artwork, `${experiment.id}: görsel eşleştirmesi eksik`);
    assert.ok(artwork.src.startsWith("/assets/thought-experiments/"));
    assert.ok(artwork.alt.length > 15);
    assert.ok(artwork.caption.length > 15);
    await stat(new URL(`../public${artwork.src}`, import.meta.url));
  }
});

test("görsel bileşeni 16 görsel türünün tamamını tanımlar", async () => {
  const visualSource = await readFile(new URL("../app/modules/thought-experiments/components/ExperimentVisual.tsx", import.meta.url), "utf8");
  for (const kind of Object.keys(sceneArtworks)) {
    assert.ok(visualSource.includes(`"${kind}"`) || visualSource.includes(`${kind}:`), `${kind}: diyagram desteği eksik`);
  }
});
