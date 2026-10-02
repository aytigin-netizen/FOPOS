import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import test from 'node:test';
import { stripTypeScriptTypes } from 'node:module';
import { getCurriculumContext } from '../app/data/curriculum-runtime.ts';
import { resolveAnnualPlanWeekFramework } from '../app/modules/annual-plan/annual-plan-2026-framework.ts';
import { buildAnnualPlanArtifact } from '../app/modules/annual-plan/export-annual-plan.ts';

// Execute the live row producer, including its calendar, without mounting React.
const source = readFileSync(new URL('../app/modules/annual-plan/AnnualPlanModule.tsx', import.meta.url), 'utf8');
const prefix = source.slice(0, source.indexOf('export default function')).replace(/import[\s\S]*?from\s+"[^"]+";/g, '');
const code = stripTypeScriptTypes(prefix);
const annualRows = new Function('resolveAnnualPlanWeekFramework', `${code}; return annualRows;`)(resolveAnnualPlanWeekFramework);

test('Sosyoloji kapsamı 21 çıktı / 62 bileşendir; geçersiz hafta ve sürüm üretim yapmaz', () => {
  const context = getCurriculumContext('sociology');
  const outcomes = context.units.flatMap(unit => unit.outcomes);
  assert.equal(outcomes.length, 21);
  assert.equal(outcomes.flatMap(outcome => outcome.processComponents).length, 62);
  const week = resolveAnnualPlanWeekFramework('sociology', '2026.1');
  for (const invalid of [-1, 0.5, NaN, 8]) assert.throws(() => week('SOS.11.1', invalid));
  assert.throws(() => week('F10_U1', 0));
  assert.throws(() => resolveAnnualPlanWeekFramework('sociology', '2024'));
  assert.ok(Object.isFrozen(week('SOS.11.1', 0).componentSteps));
});

for (const grade of [11, 12]) test(`Sosyoloji ${grade}: canlı satırlar 68+4 saat ve resmî çıktı/bileşen kapsamını korur`, async () => {
  const curriculum = getCurriculumContext('sociology');
  const units = curriculum.units.filter(unit => unit.grade === grade);
  const rows = annualRows(grade, '2026-2027', curriculum.units, curriculum.subjectCode, curriculum.datasetVersion);
  const lessons = rows.filter(row => row.kind === 'lesson');
  assert.equal(lessons.length, 34);
  assert.equal(lessons.reduce((sum, row) => sum + row.hours, 0), 68);
  assert.equal(rows.filter(row => row.kind === 'planning').reduce((sum, row) => sum + row.hours, 0), 4);
  assert.equal(rows.filter(row => row.kind === 'break').length, 4);
  assert.ok(rows.filter(row => row.kind === 'break').every(row => row.hours === 0 && row.week === null));
  assert.deepEqual(rows.filter(row => row.kind !== 'break').map(row => row.week), Array.from({ length: 37 }, (_, i) => i + 1));
  for (const unit of units) {
    const selected = lessons.filter(row => row.unit === unit.name.toLocaleUpperCase('tr-TR'));
    assert.equal(selected.length * 2, unit.hours, unit.code);
    for (const outcome of unit.outcomes) {
      const matching = selected.filter(row => row.outcome.startsWith(`${outcome.code} — `));
      assert.ok(matching.length, outcome.code);
      assert.ok(matching.every(row => row.outcome.includes(outcome.description)), outcome.code);
      for (const component of outcome.processComponents) assert.ok(matching.some(row => row.components.includes(`${component.step}) ${component.description}`)), `${outcome.code}/${component.step}`);
    }
  }
  const artifact = await buildAnnualPlanArtifact({ academicYear: '2026-2027', school: 'Kabul Okulu', teacher: 'Ders Öğretmeni', principal: 'Okul Müdürü', grade, subjectName: curriculum.subjectName, sourceTitle: curriculum.sourceTitle, sourceYear: curriculum.sourceYear, rows });
  const directory = mkdtempSync(join(tmpdir(), 'sociology-annual-'));
  try {
    const path = join(directory, artifact.fileName);
    writeFileSync(path, Buffer.from(await artifact.blob.arrayBuffer()));
    const xml = execFileSync('unzip', ['-p', path, 'word/document.xml'], { encoding: 'utf8', maxBuffer: 4 * 1024 * 1024 });
    assert.match(xml, /w:orient="landscape"/);
    for (const row of lessons) for (const field of ['outcome', 'components']) assert.ok(xml.includes(row[field].replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')), `${row.week}/${field}`);
    assert.match(xml, /SOSYOLOJİ DERSİ/);
    assert.doesNotMatch(xml, /FEL\.\d/);
  } finally { rmSync(directory, { recursive: true, force: true }); }
});
