import assert from 'node:assert/strict';
import test from 'node:test';
import { reviewUnits as earlyUnits, earlyUnitTasks, earlyUnitCriterion } from '../app/modules/exam-builder/philosophy-early-units-2026.ts';
import { grade11CriterionDescriptions, WRITING_CRITERION_LABELS } from '../app/modules/exam-builder/philosophy-grade11-units-2026.ts';
import { generatePhilosophyExamReviewContent } from '../app/modules/exam-builder/philosophy-exam-content-2026.ts';
import { rightsContext, rightsTasks } from '../app/modules/exam-builder/philosophy-grade11-unit6-rights-2026.ts';
import { getCurriculumContext } from '../app/data/curriculum-runtime.ts';
import { isPlaceholderExamAnswer } from '../app/modules/exam-builder/exam-answer-validation.ts';

const LEVELS = ['understand', 'apply', 'analyze', 'evaluate', 'create'];
const CODES = ['FEL.11.6.1', 'FEL.11.6.2'];
const unit = getCurriculumContext('philosophy').units.find((u) => u.code === 'F11_U6');
const sum = (c) => [...c.matchAll(/: (\d+) puan\. Tam:/g)].reduce((n, m) => n + Number(m[1]), 0);

test('FEL.11.6: bileşen sayısı müfredatla aynı; her bileşende 40 görev, her düzeyde sekiz görev', () => {
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

test('FEL.11.6: öğrenci metni bileşene uygun vakadır; bileşen cümlesi, düşünür adı ve kapsam dışı kavramlar girmez', () => {
  const contexts = [...new Set(CODES.flatMap((c) => earlyUnits[c].map((f) => f.context)))];
  assert.equal(contexts.length, 2);
  assert.equal(earlyUnits['FEL.11.6.2'][0].context, rightsContext);
  assert.match(rightsContext, /eşit yararlanacağını/);
  assert.match(rightsContext, /farklı bir inceleme kuruluna/);
  assert.match(rightsContext, /düzeltme kararı bağlayıcı/);
  for (const part of ['voleybol turnuvası yönergesinde', 'Gülay: “Yönerge yetkili kurul', 'Hasan: “Birine yardım ettiği için', 'Nehir: “Hukuk ile ahlak ayrı ölçütlerdir']) assert.ok(contexts[0].includes(part), part);
  assert.doesNotMatch(contexts[0], /Kierkegaard|Nietzsche|Heidegger|Camus|Sartre|Epiktetos|Sokrates|Schopenhauer|Farabi|Augustinus|Kung|Hobbes|Locke|Rousseau|Aristoteles|Platon|Hegel|Kant/);
  assert.doesNotMatch(contexts[0], /ölüm cezası|intihar|umutsuz|depresyon|ruhsal|doğal hukuk|pozitif hukuk/i);
  for (const outcome of unit.outcomes) for (const c of outcome.processComponents) assert.ok(!contexts[0].includes(c.description));
  for (const code of CODES) earlyUnits[code].forEach((f) => earlyUnitTasks(f).forEach((t) => {
    assert.ok(!t.stem.includes('FEL.11'), 'görev kökü kazanım kodu taşımamalı');
    assert.doesNotMatch(`${t.stem} ${t.key}`, /ölüm cezası|intihar|idam/i, 'kapsam dışı: ceza türleri ve ölüm cezası');
  }));
});

test('FEL.11.6: her ölçüt etiketinin kendi açıklaması vardır; genel “doğru ve eksiksiz” yedeğine düşülmez', () => {
  for (const code of CODES) earlyUnits[code].forEach((f) => earlyUnitTasks(f).forEach((t) => {
    for (const label of t.criteria) assert.ok(grade11CriterionDescriptions[label], `açıklama yok: ${label}`);
    for (const points of [7, 13, 100]) {
      const criterion = earlyUnitCriterion(points, t.criteria);
      assert.equal(sum(criterion), points);
      assert.doesNotMatch(criterion, /Tam: doğru ve eksiksiz/);
    }
  }));
});

test('FEL.11.6.2 c: yazım görevleri programın 7 ölçütünün 32/32/36 gruplamasını kullanır', () => {
  const tasks = earlyUnitTasks(earlyUnits['FEL.11.6.2'][2]);
  const writing = tasks.filter((t) => t.criteria[1] === WRITING_CRITERION_LABELS[1]);
  assert.equal(writing.length, 4); assert.ok(writing.every((t) => t.level === 'create'));
  assert.ok(writing.every((t) => t.stem.includes('en az 8 cümlelik')));
  assert.ok(writing.every((t) => /Tek bir doğru metin yoktur/.test(t.key) && /küçültülmüş/.test(t.key)));
  const lines = earlyUnitCriterion(100, writing[0].criteria).split('\n');
  assert.match(lines[0], /: 32 puan\. Tam:/); assert.match(lines[1], /: 32 puan\. Tam:/); assert.match(lines[2], /: 36 puan\. Tam:/);
  for (const points of [1, 7, 13, 25, 100]) assert.equal(sum(earlyUnitCriterion(points, writing[0].criteria)), points);
});


test('FEL.11.6.2 a: kırk görev hak güvencesini ölçer ve üretim izi doğru bileşene bağlıdır', () => {
  assert.equal(rightsTasks.length, 40);
  assert.deepEqual(earlyUnitTasks(earlyUnits['FEL.11.6.2'][0]), rightsTasks);
  // Eski salt öncül–sonuç bankası bu koşulu sağlamaz: görev hakkın korunmasına yönelmelidir.
  for (const t of rightsTasks) {
    assert.match(t.stem, /hak|özgürlük|erişim|başvuru|koruma|güvence|denetim/i);
    assert.match(t.key, /hak|erişim|başvuru|koruma|güvence|düzeltme|denetle|denetim|inceleme/i);
    for (const label of t.criteria) assert.ok(grade11CriterionDescriptions[label]);
  }
  for (const mode of ['standard', 'bep']) for (const kind of ['text', 'short', 'open', 'scenario']) {
    for (const level of LEVELS) for (let variant = 0; variant < 8; variant++) {
      const q = generatePhilosophyExamReviewContent({ unitCode: 'F11_U6', outcomeCode: 'FEL.11.6.2', ordinal: variant * 3, level, points: 13, kind, datasetVersion: '2026.1', mode, profile: 'reading' });
      assert.equal(q.componentStep, 'a');
      assert.match(q.componentDescription, /Hak ve özgürlüklerin hukuksal temellerini çözümler/);
      assert.equal(q.level, level);
      assert.equal(sum(q.criterion), 13);
      assert.match(`${q.passage} ${q.text}`, /kütüphane/);
      assert.doesNotMatch(`${q.passage} ${q.text}`, /voleybol|Gülay|Hasan|Nehir/);
    }
  }
});

test('FEL.11.6: turnuva görevleri olmayan panoya gönderme yapmaz', () => {
  for (const code of CODES) for (const focus of earlyUnits[code]) for (const t of earlyUnitTasks(focus)) {
    assert.doesNotMatch(t.stem, /panoya|panodaki|panoda/i);
  }
});


test('Hasan değerlendirmesi yönergede istenmeyen toplumsal örneği puan koşulu yapmaz', () => {
 const t=earlyUnitTasks(earlyUnits['FEL.11.6.1'][1]).find(t=>t.stem.includes('her kurala uygulanıp uygulanamayacağını'));
 assert.ok(t);
 assert.doesNotMatch(t.stem,/örnek/);
 assert.match(t.key,/örnek.*zorunlu değildir/);
 assert.match(grade11CriterionDescriptions[t.criteria[2]],/her kurala uygulanıp uygulanamayacağını/);
 assert.match(grade11CriterionDescriptions[t.criteria[2]],/örnek vermek zorunlu değildir/);
});

test('11.6 kabul örnekleri: soru işlemleriyle ölçütler eşleşir ve Nehir’e ek koşul yüklenmez', () => {
  const tasks = CODES.flatMap(code => earlyUnits[code].flatMap(f => earlyUnitTasks(f)));
  const find = prefix => { const t = tasks.find(t => t.stem.startsWith(prefix)); assert.ok(t, prefix); return t; };
  const choice = find('Üç görüşten hangisinin bir kurala');
  assert.deepEqual(choice.criteria, ['İşlevsel görüşün seçilmesi (hukuk)', 'İtiraz bakımından işlevin açıklanması (hukuk)', 'Seçimin metne dayalı gerekçesi (hukuk)']);
  assert.match(choice.key, /zorunlu değildir/);
  assert.deepEqual(find('“Takım vicdanına göre davrandı”').criteria, ['Vicdan ifadesinin iki anlamı (hukuk)', 'Anlamların farkı (hukuk)', 'Vicdan ve hukuk sorunu (hukuk)']);
  const comparison = find('Gülay ile Nehir’in ortak');
  assert.deepEqual(comparison.criteria, ['Ortak kabulün belirlenmesi (hukuk)', 'Görüşlerin ayrıldığı nokta (hukuk)', 'Karşılaştırmanın metin dayanağı (hukuk)']);
  assert.match(comparison.key, /sorar/);
  for (const prefix of ['Gülay’ın görüşünü “problem', 'Nehir’in görüşünü “problem']) {
    const t = find(prefix);
    assert.deepEqual(t.criteria, ['Paragrafta felsefi problem (hukuk)', 'Paragrafta kavramın açıklanması (hukuk)', 'Paragrafta gerekçeli argüman (hukuk)']);
    for (const points of [12, 13]) assert.equal(sum(earlyUnitCriterion(points, t.criteria)), points);
  }
  const application = find('Nehir’in görüşünü şu duruma uygulayınız: Bir sürücü');
  assert.doesNotMatch(application.key, /ağır bir haksızlık|koşullar aranmalıdır/);
  assert.match(application.key, /ayrı değerlendirilir/);
});
