import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { earlyUnits, reviewUnits, pendingPhilosophyOutcomes, grade11ContentApproval, earlyUnitTasks } from '../app/modules/exam-builder/philosophy-early-units-2026.ts';
import { resolveExamContentEngine, activeExamContentEngine } from '../app/modules/exam-builder/exam-content-engine.ts';
import { generatePhilosophyExamReviewContent, philosophyReviewParallelOrdinal } from '../app/modules/exam-builder/philosophy-exam-content-2026.ts';
import { reasonFaithSources } from '../app/modules/exam-builder/philosophy-reason-faith-history-2026.ts';

const production = resolveExamContentEngine('philosophy');
const input = (code, ordinal = 0, level = 'analyze') => ({ unitCode: `F11_U${code.split('.')[2]}`, outcomeCode: code, ordinal, level, points: 20, kind: 'text', datasetVersion: '2026.1', mode: 'standard', profile: 'reading' });

test('öğretmen onaylı yeni içerikler üretimde ve karışık kapsamda erişilebilir', () => {
  assert.deepEqual(pendingPhilosophyOutcomes, []);
  assert.equal(grade11ContentApproval.approvedBy, 'Aytekin YILMAZ');
  assert.equal(grade11ContentApproval.approvedAt, '2026-10-13');
  assert.deepEqual([...grade11ContentApproval.outcomes], ['FEL.11.3.2', 'FEL.11.4.1', 'FEL.11.4.2']);
  for (const code of grade11ContentApproval.outcomes) {
    assert.ok(Object.hasOwn(earlyUnits, code));
    assert.equal(production.covers(code, '2026.1'), true);
    assert.equal(production.awaitsContentApproval(code, '2026.1'), false);
    assert.equal(activeExamContentEngine('philosophy', '2026.1', ['FEL.11.1.1', code]), production);
    for (const mode of ['standard', 'bep']) {
      assert.deepEqual(production.generate({...input(code), mode}), generatePhilosophyExamReviewContent({...input(code), mode}));
    }
  }
  assert.match(production.generate(input('FEL.11.3.1')).passage, /Derya.*Eren.*Funda/);
});

test('inceleme A/B çifti her bileşende ve beş düzeyde aynı iz ve puanla farklı görevi üretir', () => {
  for (const code of grade11ContentApproval.outcomes) for (let c = 0; c < reviewUnits[code].length; c++) {
    for (const level of ['understand', 'apply', 'analyze', 'evaluate', 'create']) {
      const a = generatePhilosophyExamReviewContent(input(code, c, level));
      const ordinal = philosophyReviewParallelOrdinal(input(code).unitCode, code, c, [c], a.level, a.generationLevel);
      const b = generatePhilosophyExamReviewContent(input(code, ordinal, level));
      assert.equal(a.componentStep, b.componentStep);
      assert.equal(a.level, level); assert.equal(b.level, level);
      assert.notEqual(a.text, b.text); assert.notEqual(a.answer, b.answer);
      for (const q of [a, b]) assert.equal([...q.criterion.matchAll(/: (\d+) puan\. Tam:/g)].reduce((n,m) => n + Number(m[1]), 0), 20);
      assert.throws(() => philosophyReviewParallelOrdinal(input(code).unitCode, code, c, [c, ordinal, c + 2 * reviewUnits[code].length, c + 3 * reviewUnits[code].length], level, level), /farklı B sorusu kalmadı/);
    }
  }
});

test('resmî 2026 uygulama ayrımları iki yeni inceleme bankasında gerçekten ölçülür', () => {
  const source = readFileSync(new URL('../sources/curriculum-2026/philosophy-2026.txt', import.meta.url), 'utf8');
  assert.match(source, /Tertullianus, Augustinus, Farabi, Gazali/);
  assert.match(source, /tarihsel, kültürel ve düşünsel bağlam/);
  assert.match(source, /edebî unsurlara felsefi bakışın imkânı/);
  for (const focus of reviewUnits['FEL.11.3.2']) {
    const tasks = earlyUnitTasks(focus);
    assert.ok(tasks.some(t => /Augustinus|Gazali|Kierkegaard/.test(t.stem)));
    assert.ok(tasks.some(t => /bağlam|dönem|gelenek/.test(t.stem)));
  }
  assert.equal(reasonFaithSources.length, 3);
  assert.ok(reasonFaithSources.every(s => s.url.startsWith('https://') && s.work && s.section));
  for (const code of ['FEL.11.4.1', 'FEL.11.4.2']) for (const focus of reviewUnits[code]) {
    for (const level of ['understand', 'apply', 'analyze', 'evaluate', 'create']) {
      assert.ok(earlyUnitTasks(focus).some(t => t.level === level && /Eşik|[Oo]kur|[Hh]ikâye/.test(t.stem)), `${code} ${level}`);
    }
  }
});
