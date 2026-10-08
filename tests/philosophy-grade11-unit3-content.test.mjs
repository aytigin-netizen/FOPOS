import assert from 'node:assert/strict';
import test from 'node:test';
import { earlyUnits, earlyUnitTasks, earlyUnitCriterion } from '../app/modules/exam-builder/philosophy-early-units-2026.ts';
import { grade11CriterionDescriptions, WRITING_CRITERION_LABELS } from '../app/modules/exam-builder/philosophy-grade11-units-2026.ts';
import { resolveExamContentEngine } from '../app/modules/exam-builder/exam-content-engine.ts';
import { getCurriculumContext } from '../app/data/curriculum-runtime.ts';
import { isPlaceholderExamAnswer } from '../app/modules/exam-builder/exam-answer-validation.ts';

const LEVELS = ['understand', 'apply', 'analyze', 'evaluate', 'create'];
const CODES = ['FEL.11.3.1', 'FEL.11.3.2'];
const engine = resolveExamContentEngine('philosophy');
const unit = getCurriculumContext('philosophy').units.find((u) => u.code === 'F11_U3');
const sum = (c) => [...c.matchAll(/: (\d+) puan\. Tam:/g)].reduce((n, m) => n + Number(m[1]), 0);

test('FEL.11.3: bileşen sayısı müfredatla aynı; her bileşende 10 görev, her düzeyde tam iki görev', () => {
  assert.deepEqual(CODES.map((c) => earlyUnits[c].length), [2, 3]);
  for (const code of CODES) {
    const outcome = unit.outcomes.find((o) => o.code === code);
    assert.equal(earlyUnits[code].length, outcome.processComponents.length);
    earlyUnits[code].forEach((focus, i) => {
      const tasks = earlyUnitTasks(focus);
      assert.equal(tasks.length, 10, `${code}#${i + 1}`);
      for (const level of LEVELS) assert.equal(tasks.filter((t) => t.level === level).length, 2, `${code}#${i + 1} ${level}`);
      assert.equal(new Set(tasks.map((t) => t.stem)).size, 10, 'görev kökleri yinelenmemeli');
      assert.equal(new Set(tasks.map((t) => t.key)).size, 10, 'cevap anahtarları yinelenmemeli');
      for (const t of tasks) { assert.ok(!isPlaceholderExamAnswer(t.key)); assert.match(t.stem, /[.?]$/); assert.equal(new Set(t.criteria).size, 3); }
    });
  }
});

test('FEL.11.3: öğrenci metni yalnız onaylı tek vakadır; kazanım/bileşen cümlesi, dinî kapsam dışı kavramlar ve düşünür adı girmez', () => {
  const contexts = [...new Set(CODES.flatMap((c) => earlyUnits[c].map((f) => f.context)))];
  assert.equal(contexts.length, 1);
  for (const part of ['“İnanç kanıt ister mi?” başlıklı bir söyleşi', 'Derya: “Bir haberin doğruluğunu sormadan kabul etmeyiz', 'Eren: “Bir işin değerli olduğuna ya da yarının daha iyi olacağına inanmayı kanıtlayarak kurmuyoruz', 'Funda: “Akıl bir inancı sınayabilir, ama onun yerini tutamaz', 'birbirinin yerini tutup tutamayacağına dayandığını belirtir']) assert.ok(contexts[0].includes(part), part);
  assert.ok(!contexts[0].includes('sevdiğimiz insana'), 'Eren’in örneği güven/sevgiden kaydırıldı');
  assert.doesNotMatch(contexts[0], /Tanrı|vahiy|mucize|ibadet|kutsal|ateizm|agnostik|Allah|Kur’an|İncil/i);
  for (const outcome of unit.outcomes) for (const c of outcome.processComponents) assert.ok(!contexts[0].includes(c.description));
  for (const code of CODES) earlyUnits[code].forEach((f) => earlyUnitTasks(f).forEach((t) => assert.ok(!t.stem.includes('FEL.11'), 'görev kökü kazanım kodu taşımamalı')));
});

test('FEL.11.3: her ölçüt etiketinin kendi açıklaması vardır; genel “doğru ve eksiksiz” yedeğine düşülmez', () => {
  for (const code of CODES) earlyUnits[code].forEach((f) => earlyUnitTasks(f).forEach((t) => {
    for (const label of t.criteria) assert.ok(grade11CriterionDescriptions[label], `açıklama yok: ${label}`);
    for (const points of [7, 13, 100]) {
      const criterion = earlyUnitCriterion(points, t.criteria);
      assert.equal(sum(criterion), points);
      assert.doesNotMatch(criterion, /Tam: doğru ve eksiksiz/);
    }
  }));
});

test('FEL.11.3.2 c: yazım görevleri programın 7 ölçütünün 32/32/36 gruplamasını kullanır; sınav toplamı 100', () => {
  const tasks = earlyUnitTasks(earlyUnits['FEL.11.3.2'][2]);
  const writing = tasks.filter((t) => t.criteria[0] === WRITING_CRITERION_LABELS[0]);
  assert.equal(writing.length, 2); assert.ok(writing.every((t) => t.level === 'create'));
  assert.ok(writing.every((t) => t.stem.includes('en az 8 cümlelik')));
  assert.ok(writing.every((t) => /Tek bir doğru metin yoktur/.test(t.key) && /küçültülmüş/.test(t.key)));
  const lines = earlyUnitCriterion(100, writing[0].criteria).split('\n');
  assert.match(lines[0], /: 32 puan\. Tam:/); assert.match(lines[1], /: 32 puan\. Tam:/); assert.match(lines[2], /: 36 puan\. Tam:/);
  for (const points of [1, 7, 13, 25, 100]) assert.equal(sum(earlyUnitCriterion(points, writing[0].criteria)), points);
});

test('FEL.11.3: dört görev kökü bileşen sırasıyla üretilir; B aynı düzeyde farklı görevdir', () => {
  const input = (code, ordinal, level) => ({ unitCode: 'F11_U3', outcomeCode: code, ordinal, level, points: 20, kind: 'text', datasetVersion: '2026.1', mode: 'standard', profile: 'reading' });
  for (const code of CODES) {
    const n = unit.outcomes.find((o) => o.code === code).processComponents.length;
    for (let c = 0; c < n; c++) for (const level of LEVELS) {
      const a = engine.generate(input(code, c, level));
      const ordinal = engine.parallelOrdinal('F11_U3', code, c, [c], a.level, a.generationLevel);
      const b = engine.generate(input(code, ordinal, level));
      assert.equal(a.level, level); assert.equal(b.level, level);
      assert.notEqual(a.text, b.text); assert.notEqual(a.answer, b.answer);
      assert.ok(a.passage.length > 100); assert.equal(a.passage, b.passage);
    }
  }
});

test('FEL.11.3: öğrencinin kurmadığı argümana ya da seçmediği görüşe gönderme yapan görev yok', () => {
  const dangling = /Kurduğunuz argüman|Kendi argümanınız|argümanınızın|Seçtiğiniz görüş|görüşünüz(?!ü)/;
  for (const code of CODES) {
    earlyUnits[code].forEach((focus, i) => {
      for (const t of earlyUnitTasks(focus)) {
        if (!dangling.test(t.stem)) continue;
        // gönderme yalnız aynı görevde önce kurdurulan/yazdırılan bir şeye yapılabilir
        assert.match(t.stem, /(yazınız|kurunuz|seçiniz)[^.]*\./, `${code}#${i + 1}: ${t.stem}`);
        const before = t.stem.split(dangling.exec(t.stem)[0])[0];
        assert.match(before, /yazınız|kurunuz|seçiniz/, `${code}#${i + 1} gönderme öncesinde kurdurma yok: ${t.stem}`);
      }
    });
  }
});

test('FEL.11.3.2 b: çözümleme ve değerlendirme görevleri önce argüman kurdurur; anahtar ve ölçüt aynı yönergeyi izler', () => {
  const tasks = earlyUnitTasks(earlyUnits['FEL.11.3.2'][1]);
  for (const level of ['analyze', 'evaluate']) {
    const task = tasks.find((t) => t.level === level && t.stem.startsWith('İnanç ile akıl ilişkisi konusunda bir görüşü en az bir öncül'));
    assert.ok(task, level);
    assert.match(task.stem, /en az bir öncül ve bir sonuçla argüman olarak kurunuz/);
    assert.match(task.key, /Öncül:/);
    assert.match(task.key, /Sonuç:/);
    assert.match(grade11CriterionDescriptions[task.criteria[0]], /en az bir öncül ve bir sonuç/);
  }
  const apply = tasks.find((t) => t.level === 'apply' && t.stem.includes('görüş seçiniz'));
  assert.ok(apply, 'uygulama görevi görüşü kendisi seçtirmeli');
});

test('FEL.11.3.2 c: A/B yazma yönergeleri kısa cevap ve BEP modunda çelişmez; ölçüt konu dışı çevre kavramı istemez', () => {
  for (const mode of ['standard', 'bep']) for (const profile of ['reading', 'writing', 'attention', 'cognitive', 'visual']) for (const kind of ['text', 'short', 'open', 'scenario']) {
    const input = { unitCode: 'F11_U3', outcomeCode: 'FEL.11.3.2', ordinal: 2, level: 'create', points: 100, kind, datasetVersion: '2026.1', mode, profile };
    const a = engine.generate(input);
    const ordinal = engine.parallelOrdinal(input.unitCode, input.outcomeCode, input.ordinal, [input.ordinal], a.level, a.generationLevel);
    const b = engine.generate({ ...input, ordinal });
    for (const q of [a, b]) {
      assert.match(q.text, /en az 8 cümlelik/);
      assert.doesNotMatch(q.text, /Kısa ve öz yanıt veriniz/);
      assert.doesNotMatch(q.criterion, /çevre sorun|doğa|çevre etiği|kamera|teknoloji/);
      assert.match(q.criterion, /en az ikisini/);
      assert.equal(sum(q.criterion), 100);
      assert.match(q.criterion, /: 32 puan\. Tam:/);
    }
    assert.notEqual(a.text, b.text);
  }
});

test('FEL.11.3: üçüncü görüş (Funda) ayrıcalıklı değildir; her görüşün değerlendirme anahtarı bir zayıf yan ya da gerekçe yükü taşır', () => {
  for (const code of CODES) earlyUnits[code].forEach((f) => earlyUnitTasks(f).forEach((t) => {
    if (t.level !== 'evaluate' || !/(Derya|Eren|Funda)’nın/.test(t.stem)) return;
    assert.match(t.key, /zayıf|çıkmaz|yetersiz|yük|sakınca|sınır/i, t.stem);
  }));
  const a2 = earlyUnitTasks(earlyUnits['FEL.11.3.2'][0]).find((t) => t.stem.startsWith('Derya, Eren ve Funda’nın argümanlarından hangisinin'));
  assert.ok(a2);
  for (const name of ['Derya', 'Eren', 'Funda']) assert.ok(a2.key.includes(name), `${name} için gerekçe yükü anahtarda yer almalı`);
});
