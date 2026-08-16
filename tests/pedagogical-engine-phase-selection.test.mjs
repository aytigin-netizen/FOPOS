import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { selectPhaseSequence } from "../app/modules/lesson-studio/phase-selector.ts";

const engineSource = await readFile(
  new URL("../app/modules/lesson-studio/lesson-engine.tsx", import.meta.url),
  "utf8",
);

function outcomeBlock(outcomeCode, nextMarker) {
  const start = engineSource.indexOf(`"${outcomeCode}": [`);
  assert.notEqual(start, -1, `${outcomeCode} özel akışı bulunmalıdır.`);
  const end = engineSource.indexOf(nextMarker, start + 1);
  assert.notEqual(end, -1, `${outcomeCode} özel akış sınırı bulunmalıdır.`);
  return engineSource.slice(start, end);
}

function durations(block) {
  return [...block.matchAll(/duration:\s*(\d+)/gu)].map((match) => Number(match[1]));
}

test("tanımlı özel akış genel üreticiyi çağırmadan seçilir ve dış mutasyondan yalıtılır", () => {
  let generalCalls = 0;
  const special = {
    "FEL.10.1.1": [
      { label: "Hazırlık", duration: 5 },
      { label: "Kapanış", duration: 3 },
    ],
  };
  const selected = selectPhaseSequence(
    special,
    "FEL.10.1.1",
    () => {
      generalCalls += 1;
      return [{ label: "Genel", duration: 80 }];
    },
  );
  assert.equal(generalCalls, 0);
  assert.deepEqual(selected, special["FEL.10.1.1"]);
  selected[0].label = "Bozuk";
  assert.equal(special["FEL.10.1.1"][0].label, "Hazırlık");
});

test("tanımlı özel akış yoksa genel haftalık üretici tam bir kez kullanılır", () => {
  let generalCalls = 0;
  const selected = selectPhaseSequence({}, "FEL.10.2.1", () => {
    generalCalls += 1;
    return [{ label: "Genel Haftalık Akış", duration: 80 }];
  });
  assert.equal(generalCalls, 1);
  assert.deepEqual(selected, [{ label: "Genel Haftalık Akış", duration: 80 }]);
});

test("FEL.10.1.1 ve FEL.10.1.2 alan-özgü akışları dokuz aşama ve 80 dakika taşır", () => {
  const first = outcomeBlock("FEL.10.1.1", '"FEL.10.1.2": [');
  const second = outcomeBlock("FEL.10.1.2", "\n};");
  for (const [code, block] of [["FEL.10.1.1", first], ["FEL.10.1.2", second]]) {
    const phaseDurations = durations(block);
    assert.equal(phaseDurations.length, 9, `${code} dokuz aşama taşımalıdır.`);
    assert.equal(
      phaseDurations.reduce((sum, duration) => sum + duration, 0),
      80,
      `${code} toplam 80 dakika olmalıdır.`,
    );
  }
  assert.match(first, /Özgün felsefi soru/u);
  assert.match(second, /Üç alanlı soru seti/u);
});

test("pedagojik motor özel seçiciyi, genel geri dönüşü ve seçilen süre toplamını kullanır", () => {
  assert.match(engineSource, /selectPhaseSequence\(phaseBase, outcome, \(\) => makePhases\(unit, week\)\)/u);
  assert.match(engineSource, /phases: selectedPhases\.map/u);
  assert.match(engineSource, /selectedPhases\.reduce\(\(sum,phase\)=>sum\+phase\.duration,0\)/u);
  assert.doesNotMatch(engineSource, /void phaseBase/u);
});
