import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { grade10PoolContentApproval } from '../app/modules/exam-builder/philosophy-early-units-2026.ts';
import { resolveExamContentEngine } from '../app/modules/exam-builder/exam-content-engine.ts';
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

const LEVELS = ['understand', 'apply', 'analyze', 'evaluate', 'create'];

// Kapı mekanizmasını sınamak için onay kaydını geçici olarak kaldırır; her durumda geri koyar.
function withoutApproval(fn) {
  const saved = grade10PoolContentApproval[CODE];
  delete grade10PoolContentApproval[CODE];
  try { return fn(); } finally { grade10PoolContentApproval[CODE] = saved; }
}

test('FEL.10.3.1 havuzu 17 Ekim 2026 öğretmen onayıyla açıktır: kayıt, kapasite 8, havuz görevleri üretilir', () => {
  assert.deepEqual(grade10PoolContentApproval[CODE], { approvedBy: 'Aytekin YILMAZ', approvedAt: '2026-10-17' });
  assert.equal(philosophyPoolApproved(CODE), true);
  assert.equal(production.covers(CODE, '2026.1'), true);
  assert.equal(philosophyCaseCapacity(CODE), 8);
  assert.equal(production.variantPoolFor([CODE]), 8);
  // Onay yalnız bu çıktının havuzunu kapsar: başka çıktıların kapasitesi değişmez.
  assert.equal(production.variantPoolFor(['FEL.10.4.1']), 2);
  let seen = 0;
  for (const level of LEVELS) for (let ordinal = 0; ordinal < 160; ordinal++) if (isPoolStem(production.generate(input(ordinal, level)).text)) seen++;
  assert.ok(seen > 0, 'onaylı havuzun görevleri üretimde görünmeli');
});

test('onay kaydı kaldırılırsa havuz üretim motoruna hiç girmez (kapı bozulmamış)', () => withoutApproval(() => {
  assert.equal(philosophyPoolApproved(CODE), false);
  assert.equal(philosophyCaseCapacity(CODE), 2);
  assert.equal(production.variantPoolFor([CODE]), 2);
  // Onaylı şablon bankası bileşen başına 10 girdidir (düzey başına 2 × 5 düzey); ordinal 40 = sınır.
  for (const level of LEVELS) {
    for (let ordinal = 0; ordinal < 40; ordinal++) assert.equal(isPoolStem(production.generate(input(ordinal, level)).text), false, `${level} ordinal ${ordinal}`);
    assert.throws(() => production.generate(input(40, level)), /kapasitesi aşıldı/);
  }
}));

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
