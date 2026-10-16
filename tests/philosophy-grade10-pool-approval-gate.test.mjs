import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { grade10PoolContentApproval } from '../app/modules/exam-builder/philosophy-early-units-2026.ts';
import { resolveExamContentEngine, activeExamContentEngine } from '../app/modules/exam-builder/exam-content-engine.ts';
import { generatePhilosophyExamReviewContent, philosophyPoolApproved, philosophyCaseCapacity } from '../app/modules/exam-builder/philosophy-exam-content-2026.ts';
import { case1031 } from '../app/modules/exam-builder/philosophy-cases-10-3.ts';
import { grade10Unit31Pool } from '../app/modules/exam-builder/philosophy-grade10-unit3-pool-2026.ts';

const production = resolveExamContentEngine('philosophy');
const CODE = 'FEL.10.3.1';
const input = (ordinal, level = 'analyze') => ({ unitCode: 'F10_U3', outcomeCode: CODE, ordinal, level, points: 20, kind: 'text', datasetVersion: '2026.1', mode: 'standard', profile: 'reading' });

// #235, FEL.10.3.1 için 30 taslak görev/bileşen ekledi. Dosyanın kendisi 9. satırda TASLAK olduğunu
// bildiriyor; bu kapı, onaysız havuzun üretim sınırından geçmesini engeller.
const poolStems = [...readFileSync(new URL('../app/modules/exam-builder/philosophy-grade10-unit3-pool-2026.ts', import.meta.url), 'utf8')
  .matchAll(/t\('[a-z]+',\s*'([^']{25,})'/g)].map((m) => m[1]);
const isPoolStem = (text) => poolStems.some((s) => text.includes(s.slice(0, 55)));

test('onaysız 10. sınıf görev havuzu üretim motoruna hiç girmez', () => {
  assert.equal(philosophyPoolApproved(CODE), false, 'FEL.10.3.1 havuzu onay kaydı olmadan onaylı sayılamaz');
  assert.equal(Object.hasOwn(grade10PoolContentApproval, CODE), false);

  // Çıktının kendisi onaylı: onaylı 10 şablon görev korunur, motor etkin kalır.
  assert.equal(production.covers(CODE, '2026.1'), true);
  assert.equal(production.awaitsContentApproval(CODE, '2026.1'), false);
  assert.notEqual(activeExamContentEngine('philosophy', '2026.1', [CODE]), null);

  // A/B kapasitesi onaysız havuzu saymaz: #235 öncesi değere (2) döner.
  assert.equal(philosophyCaseCapacity(CODE), 2);
  assert.equal(production.variantPoolFor([CODE]), 2);
});

test('onaysız havuz görevleri hiçbir ordinal ile üretilemez', () => {
  for (const level of ['understand', 'apply', 'analyze', 'evaluate', 'create']) {
    // Onaylı şablon bankası bileşen başına 10 girdidir (düzey başına 2 × 5 düzey); ordinal 40 = sınır.
    // Bu sınırın altında hiçbir ordinal, hiçbir düzeyde taslak havuz görevi üretmemelidir.
    for (let ordinal = 0; ordinal < 40; ordinal++) {
      assert.equal(isPoolStem(production.generate(input(ordinal, level)).text), false, `${level} ordinal ${ordinal} taslak havuz görevi üretti`);
    }
    assert.throws(() => production.generate(input(40, level)), /kapasitesi aşıldı/);
  }
});

test('onaylı şablon görevler bozulmadan üretilir', () => {
  for (const level of ['understand', 'apply', 'analyze', 'evaluate', 'create']) {
    for (let ordinal = 0; ordinal < 8; ordinal++) {
      const q = production.generate(input(ordinal, level));
      assert.ok(q.text.length > 0);
      assert.ok(q.criterion.length > 0);
      assert.equal(q.level, level);
    }
  }
});

test('inceleme aracı onay bekleyen havuzu öğretmene gösterir', () => {
  // Kapı üretimi kapatır, incelemeyi değil: onaylayacak görevleri görebilmelidir.
  const draft = [0, 1, 2, 3].map((component) =>
    (generatePhilosophyExamReviewContent({ ...input(component * 8 + 8, 'analyze') }).text)).filter(isPoolStem);
  assert.ok(draft.length >= 1, 'İnceleme üreticisi taslak havuzu göstermeli');
  assert.equal(grade10Unit31Pool.length, 4, 'havuz dört bileşene karşılık gelmeli');
  assert.equal(case1031.pool, grade10Unit31Pool);
});
