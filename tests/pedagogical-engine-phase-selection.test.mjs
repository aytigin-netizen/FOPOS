import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  validatePhaseCatalog,
} from "../app/modules/lesson-studio/phase-catalog.ts";
import { philosophyPhaseCatalog2026 } from "../app/modules/lesson-studio/phase-catalog-2026.ts";
import { selectPhaseSequence } from "../app/modules/lesson-studio/phase-selector.ts";

const engineSource = await readFile(
  new URL("../app/modules/lesson-studio/lesson-engine.ts", import.meta.url),
  "utf8",
);

test("tanımlı özel akış genel üreticiyi çağırmadan seçilir ve dış mutasyondan yalıtılır", () => {
  let generalCalls = 0;
  const selected = selectPhaseSequence(
    philosophyPhaseCatalog2026,
    "FEL.10.1.1",
    () => {
      generalCalls += 1;
      return [{ label: "Genel", duration: 80 }];
    },
  );
  assert.equal(generalCalls, 0);
  assert.deepEqual(selected, philosophyPhaseCatalog2026["FEL.10.1.1"]);
  selected[0].label = "Bozuk";
  assert.equal(philosophyPhaseCatalog2026["FEL.10.1.1"][0].label, "Hazırlık");
});

test("tanımlı özel akış yoksa genel haftalık üretici tam bir kez kullanılır", () => {
  let generalCalls = 0;
  const selected = selectPhaseSequence(philosophyPhaseCatalog2026, "UNKNOWN", () => {
    generalCalls += 1;
    return [{ label: "Genel Haftalık Akış", duration: 80 }];
  });
  assert.equal(generalCalls, 1);
  assert.deepEqual(selected, [{ label: "Genel Haftalık Akış", duration: 80 }]);
});

test("2026 kataloğundaki 22 çıktı dokuz aşama ve 80 dakika taşır", () => {
  assert.equal(Object.keys(philosophyPhaseCatalog2026).length, 22);
  assert.equal(philosophyPhaseCatalog2026["FEL.10.1.2"], undefined);

  for (const code of Object.keys(philosophyPhaseCatalog2026)) {
    const phases = philosophyPhaseCatalog2026[code];
    assert.equal(phases.length, 9, `${code} dokuz aşama taşımalıdır.`);
    assert.equal(
      phases.reduce((sum, phase) => sum + phase.duration, 0),
      80,
      `${code} toplam 80 dakika olmalıdır.`,
    );
  }

  assert.ok(philosophyPhaseCatalog2026["FEL.10.1.1"][5].evidence.length > 0);
  assert.ok(philosophyPhaseCatalog2026["FEL.10.2.2"][5].evidence.length > 0);
});

test("katalog eksik zorunlu alanı reddeder", () => {
  const invalid = structuredClone(philosophyPhaseCatalog2026);
  invalid["FEL.10.1.1"][0].evidence = "";
  assert.throws(
    () => validatePhaseCatalog(invalid),
    /FEL\.10\.1\.1 1\. aşamasında evidence alanı zorunludur/u,
  );
});

test("katalog dokuz aşamadan farklı girdiyi reddeder", () => {
  const invalid = structuredClone(philosophyPhaseCatalog2026);
  invalid["FEL.10.1.1"] = invalid["FEL.10.1.1"].slice(0, 8);
  assert.throws(
    () => validatePhaseCatalog(invalid),
    /FEL\.10\.1\.1 özel akışı 9 aşama taşımalıdır/u,
  );
});

test("katalog 80 dakika dışındaki toplamı reddeder", () => {
  const invalid = structuredClone(philosophyPhaseCatalog2026);
  invalid["FEL.10.1.1"][0].duration = 4;
  assert.throws(
    () => validatePhaseCatalog(invalid),
    /FEL\.10\.1\.1 özel akışı toplam 80 dakika olmalıdır/u,
  );
});

test("kaynak katalog ve içindeki girdiler çalışma anında dondurulmuştur", () => {
  assert.equal(Object.isFrozen(philosophyPhaseCatalog2026), true);
  assert.equal(Object.isFrozen(philosophyPhaseCatalog2026["FEL.10.1.1"]), true);
  assert.equal(Object.isFrozen(philosophyPhaseCatalog2026["FEL.10.1.1"][0]), true);
  assert.throws(() => {
    philosophyPhaseCatalog2026["FEL.10.1.1"][0].label = "Bozuk";
  }, TypeError);
});

test("pedagojik motor katalog seçicisini ve seçilen süre toplamını kullanır", () => {
  assert.match(engineSource, /phaseCatalogForDataset/u);
  assert.match(
    engineSource,
    /const phaseCatalog = phaseCatalogForDataset\(unit.subjectCode, datasetVersion\)/u,
  );
  assert.match(
    engineSource,
    /selectPhaseSequence\(phaseCatalog, outcome, \(\) => makePhases\(unit, week\)\)/u,
  );
  assert.match(engineSource, /phases: selectedPhases\.map/u);
  assert.match(engineSource, /selectedPhases\.reduce\(\(sum,phase\)=>sum\+phase\.duration,0\)/u);
  assert.doesNotMatch(engineSource, /const phaseBase/u);
});
