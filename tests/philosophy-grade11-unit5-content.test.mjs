import assert from 'node:assert/strict';
import test from 'node:test';
import { reviewUnits as earlyUnits, earlyUnitTasks, earlyUnitCriterion } from '../app/modules/exam-builder/philosophy-early-units-2026.ts';
import { grade11CriterionDescriptions, WRITING_CRITERION_LABELS } from '../app/modules/exam-builder/philosophy-grade11-units-2026.ts';
import { getCurriculumContext } from '../app/data/curriculum-runtime.ts';
import { isPlaceholderExamAnswer } from '../app/modules/exam-builder/exam-answer-validation.ts';

const LEVELS = ['understand', 'apply', 'analyze', 'evaluate', 'create'];
const CODES = ['FEL.11.5.1', 'FEL.11.5.2'];
const unit = getCurriculumContext('philosophy').units.find((u) => u.code === 'F11_U5');
const sum = (c) => [...c.matchAll(/: (\d+) puan\. Tam:/g)].reduce((n, m) => n + Number(m[1]), 0);

test('FEL.11.5: bileşen sayısı müfredatla aynı; her bileşende 40 görev, her düzeyde sekiz görev', () => {
  assert.deepEqual(CODES.map((c) => earlyUnits[c].length), [2, 3]);
  for (const code of CODES) {
    const outcome = unit.outcomes.find((o) => o.code === code);
    assert.equal(earlyUnits[code].length, outcome.processComponents.length);
    earlyUnits[code].forEach((focus, i) => {
      const tasks = earlyUnitTasks(focus);
      assert.equal(tasks.length, 40, `${code}#${i + 1}`);
      for (const level of LEVELS) assert.equal(tasks.filter((t) => t.level === level).length, 8, `${code}#${i + 1} ${level}`);
      assert.equal(new Set(tasks.map((t) => t.stem)).size, 40, 'görev kökleri yinelenmemeli');
      assert.equal(new Set(tasks.map((t) => t.key)).size, 40, 'cevap anahtarları yinelenmemeli');
      for (const t of tasks) { assert.ok(!isPlaceholderExamAnswer(t.key)); assert.match(t.stem, /[.?]”?$/); assert.equal(new Set(t.criteria).size, 3); }
    });
  }
});

test('FEL.11.5: öğrenci metni yalnız tek vakadır; bileşen cümlesi, düşünür adı ve kapsam dışı kavramlar girmez', () => {
  const contexts = [...new Set(CODES.flatMap((c) => earlyUnits[c].map((f) => f.context)))];
  assert.equal(contexts.length, 1);
  for (const part of ['“Hayatı anlamlı kılan nedir?” başlıklı bir pano', 'Pınar: “Hayatı anlamlı kılan', 'Tuna: “Anlam mutlulukla ölçülmez', 'Vildan: “Hayatın anlamı bize hazır verilmez']) assert.ok(contexts[0].includes(part), part);
  assert.doesNotMatch(contexts[0], /Kierkegaard|Nietzsche|Heidegger|Camus|Sartre|Epiktetos|Sokrates|Schopenhauer|Farabi|Augustinus|Kung/);
  assert.doesNotMatch(contexts[0], /ölüm|intihar|umutsuz|depresyon|ruhsal/i);
  for (const outcome of unit.outcomes) for (const c of outcome.processComponents) assert.ok(!contexts[0].includes(c.description));
  for (const code of CODES) earlyUnits[code].forEach((f) => earlyUnitTasks(f).forEach((t) => {
    assert.ok(!t.stem.includes('FEL.11'), 'görev kökü kazanım kodu taşımamalı');
    assert.doesNotMatch(`${t.stem} ${t.key}`, /intihar|umutsuz|depresyon|kendine zarar/i, 'kapsam dışı: ruhsal sıkıntı');
  }));
});

test('FEL.11.5: her ölçüt etiketinin kendi açıklaması vardır; genel “doğru ve eksiksiz” yedeğine düşülmez', () => {
  for (const code of CODES) earlyUnits[code].forEach((f) => earlyUnitTasks(f).forEach((t) => {
    for (const label of t.criteria) assert.ok(grade11CriterionDescriptions[label], `açıklama yok: ${label}`);
    for (const points of [7, 13, 100]) {
      const criterion = earlyUnitCriterion(points, t.criteria);
      assert.equal(sum(criterion), points);
      assert.doesNotMatch(criterion, /Tam: doğru ve eksiksiz/);
    }
  }));
});

test('FEL.11.5.2 c: yazım görevleri programın 7 ölçütünün 32/32/36 gruplamasını kullanır', () => {
  const tasks = earlyUnitTasks(earlyUnits['FEL.11.5.2'][2]);
  const writing = tasks.filter((t) => t.criteria[1] === WRITING_CRITERION_LABELS[1]);
  assert.equal(writing.length, 4); assert.ok(writing.every((t) => t.level === 'create'));
  assert.ok(writing.every((t) => t.stem.includes('en az 8 cümlelik')));
  assert.ok(writing.every((t) => /Tek bir doğru metin yoktur/.test(t.key) && /küçültülmüş/.test(t.key)));
  const lines = earlyUnitCriterion(100, writing[0].criteria).split('\n');
  assert.match(lines[0], /: 32 puan\. Tam:/); assert.match(lines[1], /: 32 puan\. Tam:/); assert.match(lines[2], /: 36 puan\. Tam:/);
  for (const points of [1, 7, 13, 25, 100]) assert.equal(sum(earlyUnitCriterion(points, writing[0].criteria)), points);
});
