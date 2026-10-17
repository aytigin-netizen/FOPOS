import assert from 'node:assert/strict';
import test from 'node:test';
import { getCurriculumContext } from '../app/data/curriculum-runtime.ts';
import { resolveExamContentEngine } from '../app/modules/exam-builder/exam-content-engine.ts';
import { generatePhilosophyExamReviewContent, philosophyReviewParallelOrdinal } from '../app/modules/exam-builder/philosophy-exam-content-2026.ts';
import { grade10Unit31Pool } from '../app/modules/exam-builder/philosophy-grade10-unit3-pool-2026.ts';

// FEL.10.3.1: dört bileşende de düzey başına 8 görev (şablondan 2 + havuzdan 6). Mevcut 10 şablon görev ve sırası değişmez
// (özgün çıktı kilidi tests/sociology-exam-parity.test.mjs F6 içindedir).
//
// Havuz 17 Ekim 2026’da onaylandı; bu dosya içerik kalitesini inceleme üreticisiyle doğrular.
const production = resolveExamContentEngine('philosophy');
const engine = { ...production, generate: generatePhilosophyExamReviewContent, parallelOrdinal: philosophyReviewParallelOrdinal };
const LEVELS = ['understand', 'apply', 'analyze', 'evaluate', 'create'];
const unit = getCurriculumContext('philosophy').units.find(u => u.code === 'F10_U3');
const outcome = unit.outcomes.find(o => o.code === 'FEL.10.3.1');
const n = outcome.processComponents.length;
const input = (ordinal, level) => ({ unitCode: 'F10_U3', outcomeCode: 'FEL.10.3.1', ordinal, level, points: 13, kind: 'open', datasetVersion: '2026.1', mode: 'standard', profile: 'reading' });

test('FEL.10.3.1 havuzu: dört bileşen × 30 görev, her bileşende düzey başına 6', () => {
  assert.equal(n, 4);
  assert.equal(grade10Unit31Pool.length, 4);
  for (const pool of grade10Unit31Pool) {
    assert.equal(pool.length, 30);
    for (const level of LEVELS) assert.equal(pool.filter(t => t.level === level).length, 6, level);
  }
});

test('FEL.10.3.1 havuzu: kök ve anahtarlar bütün üretilebilir havuzda benzersizdir; yer tutucu sızmaz', () => {
  for (let component = 0; component < n; component++) {
    const stems = new Set(); const keys = new Set(); let count = 0;
    for (const level of LEVELS) for (let v = 0; v < 8; v++) {
      const q = engine.generate(input(v * n + component, level));
      assert.ok(!/undefined|\[object|NaN/.test(q.text + q.answer + q.criterion + q.passage), `${component}/${level}/${v}`);
      stems.add(q.text); keys.add(q.answer); count++;
    }
    assert.equal(count, 40);
    assert.equal(stems.size, 40, `bileşen ${component}: 40 farklı kök`);
    assert.equal(keys.size, 40, `bileşen ${component}: 40 farklı anahtar`);
  }
});

test('FEL.10.3.1 havuzu: düşünür adı, program cümlesi ve bilimsel bulgu iddiası yoktur; kökler soru/emir cümlesidir', () => {
  for (const task of grade10Unit31Pool.flat()) {
    const text = `${task.stem} ${task.key}`;
    assert.doesNotMatch(text, /Platon|Aristoteles|Herakleitos|Parmenides|Descartes|Kant\b|Hegel|Locke|Berkeley|Plutarkhos/, task.stem);
    assert.doesNotMatch(task.stem, /bileşen|kazanım|ortaya koyar|inceler\b.*çerçevesi/i, task.stem);
    assert.doesNotMatch(text, /araştırmalar (göster|kanıtla)|bilim insanları kanıtladı/i, task.stem);
    assert.match(task.stem, /[.?][”)]*$/, task.stem);
    assert.ok(task.stem.length > 40 && task.key.length > 60, task.stem);
  }
});

test('FEL.10.3.1 havuzu: üretici düzeye uygun görevi verir; bileşen sırası vaka rolleriyle eşleşir', () => {
  for (let component = 0; component < n; component++) for (const level of LEVELS) for (let v = 0; v < 8; v++) {
    const q = engine.generate(input(v * n + component, level));
    assert.equal(q.level, level, `${component}/${level}/${v}`);
    assert.equal(q.componentStep, outcome.processComponents[component].step);
  }
});

test('FEL.10.3.1 havuzu: inceleme üreticisinde B kapasitesi 8’de biter; her varyant farklı B sorusu üretir', () => {
  for (let component = 0; component < n; component++) for (const level of LEVELS) {
    const a = engine.generate(input(component, level));
    const used = [component];
    for (let k = 1; k < 8; k++) {
      const b = engine.parallelOrdinal('F10_U3', 'FEL.10.3.1', component, used, a.level, a.generationLevel);
      assert.equal(engine.generate(input(b, level)).level, level);
      used.push(b);
    }
    assert.equal(new Set(used).size, 8);
    assert.throws(() => engine.parallelOrdinal('F10_U3', 'FEL.10.3.1', component, used, a.level, a.generationLevel), /B sorusu kalmadı/);
  }
});

test('FEL.10.3.1 havuzu: onaylı olduğu için üretim kapasitesi 8’dir', () => {
  // Onay kaydı grade10PoolContentApproval içindedir (17 Ekim 2026); kapı mekanizması
  // tests/philosophy-grade10-pool-approval-gate.test.mjs içinde onay kaldırılarak sınanır.
  assert.equal(production.variantPoolFor(['FEL.10.3.1']), 8);
  assert.equal(production.variantPoolFor(['FEL.10.4.1']), 2);
  assert.equal(production.variantPoolFor(['FEL.10.3.1', 'FEL.10.4.1']), 2);
  // İnceleme üreticisi 40 benzersiz görevi gösterir.
  const stems = new Set();
  for (let component = 0; component < n; component++) for (const level of LEVELS) for (let v = 0; v < 8; v++) stems.add(engine.generate(input(v * n + component, level)).text);
  assert.equal(stems.size, 40 * n);
});

// İnceleme düzeltmeleri (felsefi doğruluk taraması): bu kalıplar havuza geri girmemeli.
test('FEL.10.3.1 havuzu: değerlendirme görevlerinin anahtarı gerekçeli alternatif yanıtı kabul eder', () => {
  for (const task of grade10Unit31Pool.flat().filter(t => t.level === 'evaluate')) {
    assert.match(task.key, /alternatif yanıtlar kabul edilir|eşdeğer yanıtlar kabul edilir|Her iki yanıt da gerekçeliyse kabul edilir|Gerekçeli değerlendirmeler kabul edilir/, task.stem);
  }
});

test('FEL.10.3.1 havuzu: uygulama kökü anahtarın sınırını vermez; metin sözü vakadan değiştirilmez; kapsam dışı terim yok', () => {
  const all = grade10Unit31Pool.flat();
  for (const task of all.filter(t => t.level === 'apply')) assert.doesNotMatch(task.stem, /neden kanıtlanmış sayılamaz|neden kesin sonuç vermez/, task.stem);
  const friend = all.find(t => t.stem.startsWith('Metindeki arkadaş'));
  assert.match(friend.stem, /Değişmeyen bir şey yok; ‘su’ yalnızca akışın bir anına verdiğimiz bir addır/);
  assert.doesNotMatch(all.map(t => `${t.stem} ${t.key}`).join(' '), /Elektron|kum kalesi|yanma sürecinin düzeni|düşünce madde değildir/i);
  const lastPremise = all.find(t => t.stem.includes('argümanını güçlendirecek bir öncül'));
  assert.doesNotMatch(lastPremise.key, /parçalar arasındaki sürekli bir bağla/);
});
