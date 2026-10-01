import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  specialPhaseCatalog,
  validatePhaseCatalog,
} from "../app/modules/lesson-studio/phase-catalog.ts";
import { selectPhaseSequence } from "../app/modules/lesson-studio/phase-selector.ts";

const engineSource = await readFile(
  new URL("../app/modules/lesson-studio/lesson-engine.ts", import.meta.url),
  "utf8",
);

test("tanımlı özel akış genel üreticiyi çağırmadan seçilir ve dış mutasyondan yalıtılır", () => {
  let generalCalls = 0;
  const selected = selectPhaseSequence(
    specialPhaseCatalog,
    "FEL.10.1.1",
    () => {
      generalCalls += 1;
      return [{ label: "Genel", duration: 80 }];
    },
  );
  assert.equal(generalCalls, 0);
  assert.deepEqual(selected, specialPhaseCatalog["FEL.10.1.1"]);
  selected[0].label = "Bozuk";
  assert.equal(specialPhaseCatalog["FEL.10.1.1"][0].label, "Hazırlık");
});

test("tanımlı özel akış yoksa genel haftalık üretici tam bir kez kullanılır", () => {
  let generalCalls = 0;
  const selected = selectPhaseSequence(specialPhaseCatalog, "FEL.10.2.1", () => {
    generalCalls += 1;
    return [{ label: "Genel Haftalık Akış", duration: 80 }];
  });
  assert.equal(generalCalls, 1);
  assert.deepEqual(selected, [{ label: "Genel Haftalık Akış", duration: 80 }]);
});

test("FEL.10.1.1 ve FEL.10.1.2 katalog girdileri dokuz aşama ve 80 dakika taşır", () => {
  assert.deepEqual(Object.keys(specialPhaseCatalog), ["FEL.10.1.1", "FEL.10.1.2"]);

  for (const code of Object.keys(specialPhaseCatalog)) {
    const phases = specialPhaseCatalog[code];
    assert.equal(phases.length, 9, `${code} dokuz aşama taşımalıdır.`);
    assert.equal(
      phases.reduce((sum, phase) => sum + phase.duration, 0),
      80,
      `${code} toplam 80 dakika olmalıdır.`,
    );
  }

  assert.equal(specialPhaseCatalog["FEL.10.1.1"][5].evidence, "Özgün felsefi soru");
  assert.equal(specialPhaseCatalog["FEL.10.1.2"][5].evidence, "Üç alanlı soru seti");
});

test("katalog eksik zorunlu alanı reddeder", () => {
  const invalid = structuredClone(specialPhaseCatalog);
  invalid["FEL.10.1.1"][0].evidence = "";
  assert.throws(
    () => validatePhaseCatalog(invalid),
    /FEL\.10\.1\.1 1\. aşamasında evidence alanı zorunludur/u,
  );
});

test("katalog dokuz aşamadan farklı girdiyi reddeder", () => {
  const invalid = structuredClone(specialPhaseCatalog);
  invalid["FEL.10.1.1"] = invalid["FEL.10.1.1"].slice(0, 8);
  assert.throws(
    () => validatePhaseCatalog(invalid),
    /FEL\.10\.1\.1 özel akışı 9 aşama taşımalıdır/u,
  );
});

test("katalog 80 dakika dışındaki toplamı reddeder", () => {
  const invalid = structuredClone(specialPhaseCatalog);
  invalid["FEL.10.1.1"][0].duration = 4;
  assert.throws(
    () => validatePhaseCatalog(invalid),
    /FEL\.10\.1\.1 özel akışı toplam 80 dakika olmalıdır/u,
  );
});

test("kaynak katalog ve içindeki girdiler çalışma anında dondurulmuştur", () => {
  assert.equal(Object.isFrozen(specialPhaseCatalog), true);
  assert.equal(Object.isFrozen(specialPhaseCatalog["FEL.10.1.1"]), true);
  assert.equal(Object.isFrozen(specialPhaseCatalog["FEL.10.1.1"][0]), true);
  assert.throws(() => {
    specialPhaseCatalog["FEL.10.1.1"][0].label = "Bozuk";
  }, TypeError);
});

test("pedagojik motor katalog seçicisini ve seçilen süre toplamını kullanır", () => {
  assert.match(engineSource, /phaseCatalogForDataset/u);
  assert.match(
    engineSource,
    /const phaseCatalog = phaseCatalogForDataset\(datasetVersion\)/u,
  );
  assert.match(
    engineSource,
    /selectPhaseSequence\(phaseCatalog, outcome, \(\) => makePhases\(unit, week\)\)/u,
  );
  assert.match(engineSource, /phases: selectedPhases\.map/u);
  assert.match(engineSource, /selectedPhases\.reduce\(\(sum,phase\)=>sum\+phase\.duration,0\)/u);
  assert.doesNotMatch(engineSource, /const phaseBase/u);
});
