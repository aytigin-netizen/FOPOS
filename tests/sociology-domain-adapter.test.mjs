import assert from "node:assert/strict";
import test from "node:test";

import {
  getDomainAdapter,
  listDomainAdapters,
} from "../src/core/domain-adapter/registry.ts";

test("domain adapter registry branşı explicit olarak çözümler", () => {
  assert.deepEqual(
    listDomainAdapters().map((adapter) => adapter.discipline.code),
    ["philosophy", "sociology"],
  );
  assert.equal(getDomainAdapter(" Sociology ").discipline.code, "sociology");
  assert.equal(getDomainAdapter("PHILOSOPHY").discipline.code, "philosophy");
  assert.throws(
    () => getDomainAdapter("psychology"),
    /domain adapter bulunamadı/u,
  );
});

test("Sosyoloji adapterı yalnız doğrulanmış curriculum package çekirdeğini bağlar", () => {
  const adapter = getDomainAdapter("sociology");
  const curriculumPackage = adapter.loadCurriculumPackage();

  assert.equal(curriculumPackage.manifest.discipline.code, "sociology");
  assert.equal(curriculumPackage.manifest.datasetVersion, "2026.1");
  assert.deepEqual(adapter.supportedGrades, [11, 12]);
  assert.equal(adapter.readiness.curriculumCore, "official_verified");
  assert.equal(adapter.readiness.pedagogicalMapping, "missing_official_mapping");
  assert.equal(adapter.readiness.productActivation, "disabled");
  assert.equal(curriculumPackage.units.length, 7);
  assert.equal(
    curriculumPackage.units
      .filter((unit) => unit.grade === 11)
      .reduce((total, unit) => total + unit.durationHours, 0),
    68,
  );
  assert.equal(
    curriculumPackage.units
      .filter((unit) => unit.grade === 12)
      .reduce((total, unit) => total + unit.durationHours, 0),
    68,
  );
});

test("Philosophy adapterı mevcut package çözümlemesini korur", () => {
  const adapter = getDomainAdapter("philosophy");
  const curriculumPackage = adapter.loadCurriculumPackage();

  assert.equal(curriculumPackage.manifest.discipline.code, "philosophy");
  assert.deepEqual(adapter.supportedGrades, [10, 11]);
  assert.equal(adapter.readiness.productActivation, "enabled");
  assert.equal(curriculumPackage.units.length, 15);
});

test("adapter kayıtlarının dışarıya verdiği diziler registry içini değiştirmez", () => {
  const first = getDomainAdapter("sociology");
  first.supportedGrades.push(10);
  const second = getDomainAdapter("sociology");

  assert.deepEqual(second.supportedGrades, [11, 12]);
});
