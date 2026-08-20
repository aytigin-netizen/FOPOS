import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import { phaseCatalogTransition } from "../app/modules/lesson-studio/phase-catalog-transition.ts";
import { specialPhaseCatalog } from "../app/modules/lesson-studio/phase-catalog.ts";

const dataset = JSON.parse(
  await readFile(new URL("../app/data/felsefe_curriculum_2026.json", import.meta.url), "utf8"),
);
const units = [...dataset.grades["10"].units, ...dataset.grades["11"].units];

test("2026 kanonik verisinin bütün ünitelerinde yetkinlik çerçevesi bulunur", () => {
  assert.equal(units.length, 15);
  for (const unit of units) {
    const framework = unit.competency_framework;
    assert.ok(framework, unit.unit_code);
    assert.ok(framework.field_skills.length > 0, unit.unit_code);
    assert.ok(framework.tendencies.length > 0, unit.unit_code);
    assert.ok(framework.cross_program_components.social_emotional_learning.length > 0, unit.unit_code);
    assert.ok(framework.cross_program_components.values.length > 0, unit.unit_code);
    assert.ok(framework.cross_program_components.literacy.length > 0, unit.unit_code);
    assert.ok(framework.interdisciplinary_relations.length > 0, unit.unit_code);
    assert.ok(framework.inter_skill_relations.length > 0, unit.unit_code);
  }
});

test("2026 alan becerileri sınıf düzeyine göre resmî yapıyı korur", () => {
  assert.deepEqual(
    dataset.grades["10"].units[0].competency_framework.field_skills,
    ["SBAB13. Felsefi Sorgulama"],
  );
  assert.deepEqual(
    dataset.grades["10"].units[1].competency_framework.conceptual_skills,
    ["KB2.13. Yapılandırma"],
  );
  for (const unit of dataset.grades["11"].units) {
    assert.deepEqual(unit.competency_framework.field_skills, [
      "SBAB14. Felsefi Muhakeme",
      "SBAB15. Felsefi Düşünce Ortaya Koyma",
    ]);
  }
});

test("2026 phase geçişi arşiv kataloğunu koruyarak çalışma zamanını etkinleştirir", () => {
  assert.equal(phaseCatalogTransition.fromDatasetVersion, "2024.1");
  assert.equal(phaseCatalogTransition.toDatasetVersion, "2026.1");
  assert.equal(phaseCatalogTransition.runtimeEnabled, true);
  assert.deepEqual(Object.keys(specialPhaseCatalog), ["FEL.10.1.1", "FEL.10.1.2"]);
});

test("emekli ve yeni çıktıların phase durumları açıkça tanımlıdır", () => {
  const byCode = new Map(
    phaseCatalogTransition.entries.map((entry) => [entry.outcomeCode, entry]),
  );
  assert.equal(byCode.get("FEL.10.1.1").state, "active");
  assert.equal(byCode.get("FEL.10.1.2").state, "archived-only");
  assert.equal(byCode.get("FEL.10.2.1").state, "active");
  assert.equal(byCode.get("FEL.10.2.2").state, "active");
});

test("phase geçiş politikası ve iç girdileri değiştirilemezdir", () => {
  assert.equal(Object.isFrozen(phaseCatalogTransition), true);
  assert.equal(Object.isFrozen(phaseCatalogTransition.entries), true);
  assert.equal(Object.isFrozen(phaseCatalogTransition.entries[0]), true);
});
