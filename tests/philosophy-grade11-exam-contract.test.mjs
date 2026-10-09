import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { getCurriculumContext } from '../app/data/curriculum-runtime.ts';
import { resolveExamContentEngine, activeExamContentEngine } from '../app/modules/exam-builder/exam-content-engine.ts';
import { allocateWithinCapacity, nextParallelOrdinal } from '../app/modules/exam-builder/exam-variant-math.ts';
import { earlyUnitCriterion } from '../app/modules/exam-builder/philosophy-early-units-2026.ts';
import { isPlaceholderExamAnswer } from '../app/modules/exam-builder/exam-answer-validation.ts';

// 11. SINIF SÖZLEŞME TESTİ — içerikten ÖNCE yazılır.
// Sözleşme: 12 çıktının her biri için (1) A/B üretimi, (2) kapasite, (3) paralel eşleşme, (4) 100 puan.
// Bir çıktı üreticiye girdiğinde (covers=true) bu sözleşmenin tamamını sağlamak zorundadır;
// girmemişse üretici akışı o çıktı için KAPALI kalır (şablon akışına düşer, kısmi içerik sızmaz).
// Yeni içerik yazan PR, çıktıyı yalnız COVERED listesine ekleyerek sözleşmeyi etkinleştirir.
const COVERED = ['FEL.11.1.1', 'FEL.11.1.2', 'FEL.11.2.1', 'FEL.11.2.2', 'FEL.11.3.1', 'FEL.11.3.2', 'FEL.11.4.1', 'FEL.11.4.2', 'FEL.11.5.1', 'FEL.11.5.2', 'FEL.11.6.1', 'FEL.11.6.2'];

const LEVELS = ['understand', 'apply', 'analyze', 'evaluate', 'create'];
const DATASET = '2026.1';
const engine = resolveExamContentEngine('philosophy');
const context = getCurriculumContext('philosophy');
const grade11 = context.units.filter((u) => u.grade === 11);
const outcomes = grade11.flatMap((u) => u.outcomes.map((o) => ({ unit: u, outcome: o, code: o.code, components: o.processComponents })));
const capacityOf = (o) => o.components.length * (engine.variantPool / 2);

const source = readFileSync(new URL('../app/modules/exam-builder/ExamBuilder.tsx', import.meta.url), 'utf8');
const prefix = stripTypeScriptTypes(source.slice(0, source.indexOf('export default function')).replace(/import[\s\S]*?from\s+"[^"]+";/g, ''));
const { allocate, variantBudgetOf, rescoreQuestion } = new Function('earlyUnitCriterion', `${prefix};return {allocate,variantBudgetOf,rescoreQuestion};`)(earlyUnitCriterion);

const input = ({ unit, code }, ordinal, level = 'analyze', points = 100) => ({ unitCode: unit.code, outcomeCode: code, ordinal, level, points, kind: 'text', datasetVersion: DATASET, mode: 'standard', profile: 'reading' });
const sumPoints = (criterion) => [...criterion.matchAll(/: (\d+) puan\. Tam:/g)].reduce((n, m) => n + Number(m[1]), 0);

// Tek çıktının tam sözleşmesi: bileşen × düzey için A, paralel B, kapasite sınırı ve 100 puan.
function assertOutcomeContract(o, { questionCount = capacityOf(o) } = {}) {
  assert.ok(engine.covers(o.code, DATASET), `${o.code} üreticide kapsanmalı`);
  const n = o.components.length;
  for (let c = 0; c < n; c++) for (const level of LEVELS) {
    const a = engine.generate(input(o, c, level));
    // Eşleşme: A, çıktının c. süreç bileşenini taşır; iz müfredatla doğrulanır.
    assert.equal(a.componentStep, o.components[c].step, `${o.code} A bileşen adımı`);
    assert.equal(a.componentDescription, o.components[c].description, `${o.code} A bileşen açıklaması`);
    assert.ok(engine.validTrace({ unitCode: o.unit.code, outcomeCode: o.code, componentStep: a.componentStep, componentDescription: a.componentDescription }));
    assert.equal(a.generationLevel, level);
    assert.ok(!isPlaceholderExamAnswer(a.answer), `${o.code} A anahtarı yer tutucu olamaz`);
    // Paralel B: aynı çıktı, bileşen, düzey; farklı metin; A'nın ordinali yeniden kullanılmaz.
    const ordinal = engine.parallelOrdinal(o.unit.code, o.code, c, [c], a.level, a.generationLevel);
    assert.notEqual(ordinal, c);
    assert.equal(ordinal % n, c, `${o.code} B aynı bileşende kalmalı`);
    const b = engine.generate(input(o, ordinal, a.generationLevel));
    assert.equal(b.level, a.level); assert.equal(b.componentStep, a.componentStep); assert.equal(b.componentDescription, a.componentDescription);
    assert.notEqual(b.text, a.text); assert.ok(!isPlaceholderExamAnswer(b.answer));
    // Not: gözden geçirilmiş paralel çiftlerde (aynı iddiayı farklı sözle soran eşdeğer sorular) anahtar aynı olabilir;
    // bu yüzden anahtar eşitliği yasaklanmaz, yalnız metin farkı ve yer tutucu yokluğu aranır.
    // Kapasite: A ve B'nin kullandığı ordinaller tükenince yeni B üretilmez (sessiz tekrar yok).
    assert.throws(() => engine.parallelOrdinal(o.unit.code, o.code, c, [c, ordinal], a.level, a.generationLevel), /B sorusu kalmadı/);
    // 100 puan: tek soru 100 puan olduğunda ölçüt toplamı 100; yeniden puanlamada anahtar değişmez.
    assert.equal(sumPoints(a.criterion), 100); assert.equal(sumPoints(b.criterion), 100);
    for (const points of [7, 13, 100]) {
      const r = rescoreQuestion(a, points);
      assert.equal(sumPoints(r.criterion), points); assert.equal(r.answer, a.answer);
    }
  }
  // Kapasite formülü: bileşen sayısı × (havuz / 2); bu sayıda soru A+B birlikte sığar, bir fazlası sığmaz.
  const row = { questionCount, processComponents: o.components };
  assert.ok(variantBudgetOf([row], engine.variantPool) >= 1, `${o.code}: ${questionCount} soru A+B birlikte sığmalı`);
  assert.equal(variantBudgetOf([{ ...row, questionCount: capacityOf(o) + 1 }], engine.variantPool), 0, `${o.code}: kapasiteyi aşan belirtke üretim bütçesi sıfır olmalı`);
}

test('müfredat: 11. sınıf 6 ünite, 12 çıktı, 2 veya 3 bileşen; kod ve ünite eşleşir', () => {
  assert.equal(grade11.length, 6);
  assert.equal(outcomes.length, 12);
  assert.deepEqual(outcomes.map((o) => o.code), ['FEL.11.1.1', 'FEL.11.1.2', 'FEL.11.2.1', 'FEL.11.2.2', 'FEL.11.3.1', 'FEL.11.3.2', 'FEL.11.4.1', 'FEL.11.4.2', 'FEL.11.5.1', 'FEL.11.5.2', 'FEL.11.6.1', 'FEL.11.6.2']);
  assert.deepEqual(outcomes.map((o) => o.components.length), [2, 3, 2, 3, 2, 3, 2, 3, 2, 3, 2, 3]);
  for (const o of outcomes) assert.ok(o.code.startsWith(`FEL.11.${o.unit.code.slice(-1)}.`));
  for (const o of outcomes) for (const c of o.components) assert.ok(c.step && c.description);
});

test('kapasite: çıktı başına bileşen × (havuz/2); 12 çıktının toplamı 30 soru', () => {
  assert.equal(engine.variantPool % 2, 0, 'A ve B için havuz çift olmalı');
  assert.deepEqual(outcomes.map(capacityOf), outcomes.map((o) => o.components.length * (engine.variantPool / 2)));
  assert.equal(outcomes.reduce((n, o) => n + capacityOf(o), 0), 30 * (engine.variantPool / 2));
});

test('kapasiteye duyarlı belirtke: hiçbir çıktıya A+B sığmayacak kadar soru verilmez; toplam aşılmadıkça', () => {
  const caps = outcomes.map(capacityOf);
  const total = caps.reduce((a, b) => a + b, 0);
  for (let n = 1; n <= total; n++) {
    const split = allocateWithinCapacity(n, caps);
    assert.equal(split.reduce((a, b) => a + b, 0), n);
    split.forEach((q, i) => assert.ok(q <= caps[i], `n=${n}: ${outcomes[i].code} kapasitesi (${caps[i]}) aşıldı`));
    const rows = outcomes.map((o, i) => ({ questionCount: split[i], processComponents: o.components }));
    assert.ok(variantBudgetOf(rows, engine.variantPool) >= 1, `n=${n}: A+B birlikte sığmalı`);
  }
  // Toplam kapasiteyi aşarsa fazlalık dağıtılır ve üretim bütçesi sıfıra düşer (öğretmen uyarı görür).
  const over = allocateWithinCapacity(total + 1, caps);
  assert.equal(over.reduce((a, b) => a + b, 0), total + 1);
  assert.equal(variantBudgetOf(outcomes.map((o, i) => ({ questionCount: over[i], processComponents: o.components })), engine.variantPool), 0);
});

test('paralel eşleşme matematiği: B, A ve önceki B ordinallerini yeniden kullanmaz; bileşen sabit kalır', () => {
  for (const o of outcomes) {
    const n = o.components.length;
    for (let c = 0; c < n; c++) {
      const used = [c];
      for (let step = 0; step < 6; step++) {
        const next = nextParallelOrdinal(n, c, used);
        assert.equal(next % n, c); assert.ok(!used.includes(next));
        used.push(next);
      }
    }
  }
});

test('100 puan: 1–30 soruluk her sınavda puan toplamı tam 100, dağılım farkı en çok 1', () => {
  for (let n = 1; n <= 30; n++) {
    const pts = allocate(100, n);
    assert.equal(pts.length, n);
    assert.equal(pts.reduce((a, b) => a + b, 0), 100);
    assert.ok(Math.max(...pts) - Math.min(...pts) <= 1);
    assert.ok(pts.every((p) => Number.isInteger(p) && p >= 1));
  }
});

test('kapsam beyanı: üretici yalnız COVERED listesindeki 11. sınıf çıktılarını kapsar; kalanı kapalıdır', () => {
  const declared = new Set(COVERED);
  for (const code of declared) assert.ok(outcomes.some((o) => o.code === code), `${code} 11. sınıf çıktısı değil`);
  for (const o of outcomes) {
    assert.equal(engine.covers(o.code, DATASET), declared.has(o.code), `${o.code}: kapsam beyanı ile üretici uyuşmuyor`);
    assert.equal(activeExamContentEngine('philosophy', DATASET, [o.code]) !== null, declared.has(o.code));
    if (!declared.has(o.code)) assert.throws(() => engine.generate(input(o, 0)), /Geçersiz Felsefe|kapasite|doğrulanmış/);
  }
  // Kısmi içerik sızmaz: seçimde kapsanmayan tek çıktı bile varsa üretici akışı tümden kapalıdır.
  const uncovered = outcomes.find((o) => !declared.has(o.code));
  if (uncovered) assert.equal(activeExamContentEngine('philosophy', DATASET, [...declared, uncovered.code]), null);
  assert.equal(activeExamContentEngine('philosophy', 'unsupported', COVERED), null);
});

test('kapsanan her 11. sınıf çıktısı A/B, kapasite, paralel eşleşme ve 100 puan sözleşmesini sağlar', () => {
  for (const o of outcomes.filter((x) => COVERED.includes(x.code))) assertOutcomeContract(o);
});

test('kapsanan çıktılardan tam A/B kitapçığı: eşleşme, aynı puan, 100 toplam, A≠B', () => {
  const covered = outcomes.filter((x) => COVERED.includes(x.code));
  if (!covered.length) return; // İçerik gelene kadar kapalı; yukarıdaki kapsam beyanı bunu zorunlu kılar.
  const slots = covered.flatMap((o) => o.components.map((_, c) => ({ o, c })));
  const pts = allocate(100, slots.length);
  const a = slots.map(({ o, c }, i) => engine.generate(input(o, c, 'analyze', pts[i])));
  const used = new Map();
  const b = slots.map(({ o, c }, i) => {
    const key = o.code; const list = used.get(key) ?? []; used.set(key, list);
    const A = a[i]; list.push(c);
    const ordinal = engine.parallelOrdinal(o.unit.code, o.code, c, list, A.level, A.generationLevel); list.push(ordinal);
    return engine.generate(input(o, ordinal, A.generationLevel, pts[i]));
  });
  assert.equal(pts.reduce((x, y) => x + y, 0), 100);
  a.forEach((q, i) => { assert.equal(sumPoints(q.criterion), pts[i]); assert.equal(sumPoints(b[i].criterion), pts[i]); assert.equal(b[i].level, q.level); assert.equal(b[i].componentStep, q.componentStep); assert.notEqual(b[i].text, q.text); });
  assert.equal(new Set(b.map((q) => `${q.passage}|${q.text}`)).size, b.length, 'B içinde tekrar eden soru olmamalı');
  assert.equal(new Set(a.map((q) => `${q.passage}|${q.text}`)).size, a.length, 'A içinde tekrar eden soru olmamalı');
});

test('harita kendini sınar: aynı sözleşme işleyicisi kapsanan 10. sınıf çıktısında çalışır (boş geçmez)', () => {
  const g10 = context.units.find((u) => u.code === 'F10_U1');
  const o = { unit: g10, outcome: g10.outcomes[0], code: g10.outcomes[0].code, components: g10.outcomes[0].processComponents };
  // 10. sınıf havuzu da 2'dir; aynı kapasite formülü ve paralel eşleşme geçerlidir.
  assertOutcomeContract(o);
});
