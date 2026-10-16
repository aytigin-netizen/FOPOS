import assert from 'node:assert/strict';
import test from 'node:test';
import { getCurriculumContext } from '../app/data/curriculum-runtime.ts';
import { resolveExamContentEngine } from '../app/modules/exam-builder/exam-content-engine.ts';
import { earlyUnits, earlyUnitTasks, earlyUnitCriterion } from '../app/modules/exam-builder/philosophy-early-units-2026.ts';

// FEL.10.2.1 havuzu: iki bileşende de düzey başına 8 görev (mevcut 2 + yeni 6). Mevcut 10 görev ve sırası değişmez.
const engine = resolveExamContentEngine('philosophy');
const LEVELS = ['understand', 'apply', 'analyze', 'evaluate', 'create'];
const unit = getCurriculumContext('philosophy').units.find(u => u.code === 'F10_U2');
const outcome = unit.outcomes.find(o => o.code === 'FEL.10.2.1');
const banks = earlyUnits['FEL.10.2.1'].map(f => earlyUnitTasks(f));

test('FEL.10.2.1: iki bileşen, her düzeyde 8 görev; ilk 10 görevin düzey sırası korunur', () => {
  assert.equal(banks.length, 2);
  for (const bank of banks) {
    assert.equal(bank.length, 40);
    for (const level of LEVELS) assert.equal(bank.filter(t => t.level === level).length, 8, level);
    assert.deepEqual(bank.slice(0, 10).map(t => t.level), ['understand', 'understand', 'apply', 'apply', 'analyze', 'analyze', 'evaluate', 'evaluate', 'create', 'create']);
  }
});

test('FEL.10.2.1: kök ve anahtarlar bütün havuzda benzersizdir, boş değildir', () => {
  const all = banks.flat();
  assert.equal(new Set(all.map(t => t.stem)).size, all.length);
  assert.equal(new Set(all.map(t => t.key)).size, all.length);
  for (const t of all) {
    assert.ok(t.stem.length > 40 && t.key.length > 80, t.stem);
    assert.match(t.stem, /[.?]$/, t.stem);
    assert.equal(t.criteria.length, 3);
    assert.equal(new Set(t.criteria).size, 3);
  }
});

test('FEL.10.2.1: yeni görevlerde düşünür adı, program cümlesi ve bilimsel bulgu iddiası yoktur', () => {
  const added = banks.flatMap(b => b.slice(10));
  assert.equal(added.length, 60);
  for (const t of added) {
    const text = `${t.stem} ${t.key}`;
    assert.doesNotMatch(text, /Sapir|Whorf|Vygotsky|Wittgenstein|Chomsky|Piaget|Platon|Aristoteles|Descartes|Locke|Hegel|Kant\b/, t.stem);
    assert.doesNotMatch(t.stem, /bileşen|kazanım|ortaya koyar|uyumlu bir bütün oluştur/i, t.stem);
    assert.doesNotMatch(text, /araştırmalar (göster|kanıtla)|bilim insanları kanıtladı/i, t.stem);
  }
});

test('FEL.10.2.1: ölçüt etiketleri puanlanır; her düzeyde puan toplamı korunur', () => {
  for (const t of banks.flatMap(b => b.slice(10))) {
    const c = earlyUnitCriterion(13, t.criteria);
    const sum = [...c.matchAll(/: (\d+) puan\. Tam:/g)].reduce((n, m) => n + Number(m[1]), 0);
    assert.equal(sum, 13, t.stem);
    assert.doesNotMatch(c, /Tam: doğru ve eksiksiz/, t.criteria.join('|'));
  }
});

test('FEL.10.2.1: üretici bütün 8 varyantı düzeye uygun ve farklı üretir; B kapasitesi 8’de biter', () => {
  const n = outcome.processComponents.length;
  const input = (ordinal, level) => ({ unitCode: 'F10_U2', outcomeCode: 'FEL.10.2.1', ordinal, level, points: 13, kind: 'text', datasetVersion: '2026.1', mode: 'standard', profile: 'reading' });
  for (let component = 0; component < n; component++) for (const level of LEVELS) {
    const stems = new Set();
    for (let v = 0; v < 8; v++) {
      const q = engine.generate(input(v * n + component, level));
      assert.equal(q.level, level);
      assert.equal(q.componentStep, outcome.processComponents[component].step);
      stems.add(q.text);
    }
    assert.equal(stems.size, 8);
    const a = engine.generate(input(component, level));
    const b = engine.parallelOrdinal('F10_U2', 'FEL.10.2.1', component, [component], a.level, a.generationLevel);
    assert.notEqual(engine.generate(input(b, level)).text, a.text);
    assert.throws(() => engine.parallelOrdinal('F10_U2', 'FEL.10.2.1', component, Array.from({ length: 8 }, (_, v) => v * n + component), a.level, a.generationLevel), /B sorusu kalmadı/);
  }
});

test('FEL.10.2.1: A/B kapasitesi yalnız bu çıktı seçildiğinde 8’dir; 10.2.2 ile birlikte en dar çıktı belirler', () => {
  assert.equal(engine.variantPoolFor(['FEL.10.2.1']), 8);
  assert.equal(engine.variantPoolFor(['FEL.10.2.2']), 2);
  assert.equal(engine.variantPoolFor(['FEL.10.2.1', 'FEL.10.2.2']), 2);
});

test('gerekçeli alternatif açıklama isteyen soruda ortak rubrik, istenmeyen genelleme cezası koymaz', () => {
  const task = banks[1].find(t => t.stem.startsWith('“Düşünce önce gelir, dil yalnız onu taşır” yargısının neyi iddia ettiğini'));
  assert.ok(task);
  const rubric = earlyUnitCriterion(12, task.criteria);
  assert.match(rubric, /gündelik örnek/i);
  assert.match(rubric, /önceden hazır düşünce/i);
  // Bu görev görüşü açıklatır; öğrenciyi görüşe katılmakla cezalandırmaz.
  assert.doesNotMatch(rubric, /tek belirleyici olduğu sonucunu çıkarmaz|sınırlı yargı öner|genellemeden kaçın/);
});

test('iki yönlü etki üretiminde yönlerin dayanağı ayrılır, zaman sırası dilsel bağımsızlık kanıtı olmaz', () => {
  const input = (ordinal, level) => ({ unitCode:'F10_U2', outcomeCode:'FEL.10.2.1', ordinal, level, points:20, kind:'text', datasetVersion:'2026.1', mode:'standard', profile:'reading' });
  // evaluate varyant 2: b bileşeninin ilk yeni değerlendirme sorusu.
  const q = engine.generate(input(5, 'evaluate'));
  assert.match(q.passage, /düşündüğü ayrımı anlatabilmek için cümlelerini yeniden kurar/);
  assert.match(q.answer, /belirli bir ifadeden önce/);
  assert.match(q.answer, /hiçbir dilsel süreçle ilişkili olmadığını göstermez/);
  assert.doesNotMatch(q.answer, /düşüncenin dilden önce bulunabildiğini/);
  const synthesis = engine.generate(input(9, 'analyze')); // b yeni analiz 3
  assert.match(synthesis.answer, /ayrımı anlatma gereği cümle seçimini yönlendirir/);
  assert.match(synthesis.answer, /cümle kurma çabası da şemayı düzelt/);
});

test('renk ayrımı ve iki yönlü örnek yazımı soruları kendi ölçülen becerilerine göre puanlanır', () => {
  const color = banks[0].find(t => t.stem.includes('turuncu ve kırmızı renk örneklerini'));
  assert.ok(color);
  assert.match(color.key, /biçim ve büyüklükleri aynı/);
  assert.match(color.key, /Meyveleri türlerine göre ayırmak renk ayrımını sınamaz/);
  const mutual = banks[1].find(t => t.stem.includes('etkinin farklı yönlerini gösteren iki örnek'));
  assert.ok(mutual);
  assert.match(mutual.key, /oyun kuralını/);
  assert.ok(mutual.criteria.some(c => c.includes('diğer yönünü')));
});
