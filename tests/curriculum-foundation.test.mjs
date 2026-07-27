import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { loadCurriculumDataset } from "../app/core/curriculum-loader.ts";
import { resolveCurriculumUnit } from "../app/core/curriculum-resolver.ts";
import { createCurriculumRegistry, curriculumDatasetKey, curriculumRegistry } from "../app/core/curriculum-registry.ts";

const raw = JSON.parse(await readFile(new URL("../app/data/felsefe_curriculum_2024.json", import.meta.url), "utf8"));
const key = curriculumDatasetKey("philosophy", "2024.1");

test("registry kanonik veri setini kararlı bileşik anahtarla kaydeder", () => {
  assert.equal(key, "philosophy@2024.1");
  assert.equal(curriculumRegistry.get(key)?.source, "felsefe_curriculum_2024.json");
  assert.throws(() => createCurriculumRegistry([
    { subject: { code: "philosophy", name: "Felsefe", courseType: "independent" }, schemaVersion: "1.0.0", datasetVersion: "2024.1", source: "a.json" },
    { subject: { code: "PHILOSOPHY", name: "Felsefe", courseType: "independent" }, schemaVersion: "1.0.0", datasetVersion: "2024.1", source: "b.json" },
  ]), /Yinelenen/);
});

test("loader kayıt sözleşmesi ve veri sürümünü sınırda doğrular", () => {
  const descriptor = curriculumRegistry.get(key);
  assert.ok(descriptor);
  const loaded = loadCurriculumDataset(descriptor, raw);
  assert.equal(loaded.dataset.dataset_version, "2024.1");
  assert.equal(loaded.catalog.units.length, 15);
  assert.throws(() => loadCurriculumDataset(descriptor, { ...raw, dataset_version: "2025.1" }), /sürümü uyuşmuyor/);
  assert.throws(() => loadCurriculumDataset(descriptor, { ...raw, grades: { 10: null } }), /sınıf üniteleri geçersiz/);
});

test("resolver ders, sürüm, sınıf ve üniteyi birlikte çözer", () => {
  const descriptor = curriculumRegistry.get(key);
  assert.ok(descriptor);
  const loadedDatasets = new Map([[key, loadCurriculumDataset(descriptor, raw)]]);
  const found = resolveCurriculumUnit({ registry: curriculumRegistry, loadedDatasets, subjectCode: "philosophy", datasetVersion: "2024.1", grade: 10, unitCode: "F10_U1" });
  assert.equal(found.ok, true);
  if (found.ok) assert.equal(found.unit.learning_outcomes[0].outcome_code, "FEL.10.1.1");
  const missing = resolveCurriculumUnit({ registry: curriculumRegistry, loadedDatasets, subjectCode: "philosophy", datasetVersion: "2024.1", grade: 12, unitCode: "F10_U1" });
  assert.deepEqual(missing.ok && missing.unit, false);
  assert.equal(missing.ok ? "" : missing.code, "UNIT_NOT_FOUND");
});

test("resolver bilinmeyen ders veya sürüm için başka veri setine sessizce düşmez", () => {
  const loadedDatasets = new Map();
  for (const [subjectCode, datasetVersion] of [["sociology", "2024.1"], ["philosophy", "2025.1"]]) {
    const result = resolveCurriculumUnit({ registry: curriculumRegistry, loadedDatasets, subjectCode, datasetVersion, grade: 10, unitCode: "F10_U1" });
    assert.equal(result.ok, false);
    assert.equal(result.ok ? "" : result.code, "DATASET_NOT_FOUND");
  }
  const unloaded = resolveCurriculumUnit({ registry: curriculumRegistry, loadedDatasets, subjectCode: "philosophy", datasetVersion: "2024.1", grade: 10, unitCode: "F10_U1" });
  assert.equal(unloaded.ok ? "" : unloaded.code, "DATASET_NOT_LOADED");
});
