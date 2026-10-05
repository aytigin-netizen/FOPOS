import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { getCurriculumContext } from '../app/data/curriculum-runtime.ts';
import { resolveExamContentEngine } from '../app/modules/exam-builder/exam-content-engine.ts';
import { allocateWithinCapacity } from '../app/modules/exam-builder/exam-variant-math.ts';
import { earlyUnits, earlyUnitTasks } from '../app/modules/exam-builder/philosophy-early-units-2026.ts';
import { buildExamPackageArtifact } from '../app/modules/exam-builder/export-exam-package.ts';

const source = readFileSync(new URL('../app/modules/exam-builder/ExamBuilder.tsx', import.meta.url), 'utf8');
const prefix = stripTypeScriptTypes(source.slice(0, source.indexOf('export default function')).replace(/import[\s\S]*?from\s+"[^"]+";/g, ''));
const generate = stripTypeScriptTypes(source.slice(source.indexOf('  function generate()'), source.indexOf('  function update(')));
const makeB = stripTypeScriptTypes(source.slice(source.indexOf('  function makeB()'), source.indexOf('  async function persistExamRecord')));
const { expandExamBlueprint } = new Function(`${prefix}; return {expandExamBlueprint};`)();
const exportMapping = source.slice(source.indexOf('questions: shown.map(') + 'questions: '.length, source.indexOf('    }, audience);')).trim().replace(/,$/, '');
const mapQuestions = new Function('shown', `${prefix}; return ${exportMapping};`);
const context = getCurriculumContext('philosophy');
const engine = resolveExamContentEngine('philosophy');
const units = context.units.filter(u => u.grade === 10 && ['F10_U1', 'F10_U2'].includes(u.code));
const outcomes = units.flatMap(u => u.outcomes.map(o => ({ ...o, unitCode: u.code })));
const labels = { understand: 'Anlama', apply: 'Uygulama', analyze: 'Çözümleme', evaluate: 'Değerlendirme', create: 'Oluşturma' };

function rowsFor(count = 8) {
  const counts = allocateWithinCapacity(count, outcomes.map(o => o.processComponents.length));
  return outcomes.map((o, i) => ({ ...o, questionCount: counts[i], questionKind: 'mixed', cognitiveLevel: 'mixed' }));
}
function produce(rows, mode = 'standard', bep = 'reading') {
  let questions;
  const count = rows.reduce((sum, row) => sum + row.questionCount, 0);
  const run = new Function('scope', 'blueprintValid', 'blueprintTotal', 'count', 'blueprintRows', 'textRatio', 'gradeUnits', 'kind', 'setQuestions', 'invalidateApproval', 'window', 'resultsRef', 'createId', 'datasetVersion', 'mode', 'bep', 'engine', 'setBooklet', 'variantRound', 'setVariantRound', `${prefix}\n${generate}\ngenerate();`);
  run(outcomes, true, count, count, rows, 75, context.units, 'open', q => { questions = q; }, () => {}, { setTimeout() {} }, { current: null }, () => crypto.randomUUID(), context.datasetVersion, mode, bep, engine, () => {}, 0, () => {});
  const parallel = new Function('questions', 'engine', 'createId', 'datasetVersion', 'mode', 'bep', 'setQuestions', 'setBooklet', 'invalidateApproval', 'setOperationMessage', 'operationErrorMessage', `${prefix}\n${makeB}\nmakeB();`);
  let failure;
  parallel(questions, engine, () => crypto.randomUUID(), context.datasetVersion, mode, bep, updater => { questions = updater(questions); }, () => {}, () => {}, message => { failure = message; }, error => error.message);
  assert.equal(failure, undefined);
  return questions;
}

test('otomatik öneri Felsefe üretici yeteneğidir; Sosyoloji varsayılanı korunur', () => {
  assert.equal(engine.supportsLevelDistribution, true);
  assert.equal(resolveExamContentEngine('sociology').supportsLevelDistribution, false);
  assert.match(source, /useState<BlueprintLevel>\(supportsLevelDistribution \? "mixed" : "analyze"\)/);
});

test('8 soruluk gerçek üretim beş düzeyde görev, cevap ve puanla A/B eşdeğerliğini korur', () => {
  const questions = produce(rowsFor());
  const a = questions.filter(q => q.booklet === 'A');
  const b = questions.filter(q => q.booklet === 'B');
  assert.deepEqual(Object.keys(labels).map(level => a.filter(q => q.level === level).length), [2, 2, 2, 1, 1]);
  for (const booklet of [a, b]) {
    assert.equal(booklet.length, 8);
    assert.equal(booklet.reduce((sum, q) => sum + q.points, 0), 100);
    for (const q of booklet) {
      const component = outcomes.find(o => o.code === q.outcomeCode).processComponents.findIndex(c => c.step === q.componentStep);
      const tasks = earlyUnitTasks(earlyUnits[q.outcomeCode][component]);
      const matching = tasks.filter(t => t.level === q.level);
      assert.ok(matching.some(t => q.text.includes(t.stem) && q.answer.includes(t.key)));
      assert.equal(q.generationLevel, q.level);
      assert.equal([...q.criterion.matchAll(/: (\d+) puan\. Tam:/g)].reduce((sum, m) => sum + Number(m[1]), 0), q.points);
    }
  }
  for (const q of b) {
    const original = a.find(x => x.id === q.sourceQuestionId);
    for (const key of ['outcomeCode', 'componentStep', 'kind', 'level', 'points']) assert.equal(q[key], original[key]);
    assert.notEqual(q.text, original.text);
    assert.notEqual(q.contentOrdinal, original.contentOrdinal);
  }
});

test('öğretmenin sabit düzeyleri korunur; sıfır sorulu satır ve kapasite sınırı dağılımı bozmaz', () => {
  const rows = rowsFor();
  rows[0].cognitiveLevel = 'evaluate';
  const plan = expandExamBlueprint(rows);
  assert.ok(plan.filter(q => q.code === rows[0].code).every(q => q.plannedLevel === 'evaluate'));
  const fixed = rows.map(row => ({ ...row, cognitiveLevel: 'apply' }));
  assert.ok(produce(fixed).every(q => q.level === 'apply'));
  for (const count of [1, 4, 8, 10]) assert.equal(produce(rowsFor(count)).length, count * 2);
  assert.throws(() => produce(rowsFor(11)), /aynı bilişsel düzeyde yeterli soru yok/);
  assert.deepEqual(expandExamBlueprint([{ ...rows[0], questionCount: 0 }]), []);
  assert.ok(produce(rows).filter(q => q.outcomeCode === rows[0].code).every(q => q.level === 'evaluate'));
});

test('BEP sunumları karma düzeyli A/B eşdeğerliğini korur', () => {
  for (const profile of ['reading', 'writing', 'attention', 'cognitive', 'visual']) {
    const questions = produce(rowsFor(), 'bep', profile);
    assert.equal(new Set(questions.map(q => q.level)).size, 5);
    for (const q of questions.filter(q => q.booklet === 'B')) {
      const a = questions.find(x => x.id === q.sourceQuestionId);
      assert.equal(q.level, a.level);
      assert.equal(q.componentStep, a.componentStep);
      assert.equal(q.points, a.points);
    }
  }
});

test('karma düzeyli A/B öğrenci ve öğretmen Word çıktıları aynı görevleri ve gerçek düzeyleri taşır', async () => {
  const questions = produce(rowsFor());
  const dir = mkdtempSync(join(tmpdir(), 'exam-diversity-'));
  const escape = s => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  try {
    for (const booklet of ['A', 'B']) for (const audience of ['student', 'teacher']) {
      const selected = questions.filter(q => q.booklet === booklet);
      const artifact = await buildExamPackageArtifact({ school: 'Test', academicYear: '2026-2027', grade: 10, subjectName: 'Felsefe', examName: 'Yazılı', booklet, durationMinutes: 40, mode: 'standard', questions: mapQuestions(selected) }, audience);
      const path = join(dir, `${booklet}-${audience}.docx`);
      writeFileSync(path, Buffer.from(await artifact.blob.arrayBuffer()));
      const xml = execFileSync('unzip', ['-p', path, 'word/document.xml'], { encoding: 'utf8' });
      for (const q of selected) {
        for (const line of [...q.text.split('\n'), ...q.passage.split('\n')].filter(Boolean)) assert.ok(xml.includes(escape(line)));
        if (audience === 'teacher') {
          assert.ok(xml.includes(escape(q.answer)));
          assert.ok(xml.includes(labels[q.level]));
          for (const line of q.criterion.split('\n')) assert.ok(xml.includes(escape(line)));
        } else assert.ok(!xml.includes(escape(q.answer)));
      }
    }
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
