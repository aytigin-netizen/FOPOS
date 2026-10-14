import assert from 'node:assert/strict';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { reviewUnits, earlyUnitTasks } from '../app/modules/exam-builder/philosophy-early-units-2026.ts';
import { generatePhilosophyExamReviewContent, philosophyReviewParallelOrdinal } from '../app/modules/exam-builder/philosophy-exam-content-2026.ts';
import { buildExamPackageArtifact } from '../app/modules/exam-builder/export-exam-package.ts';

const output = resolve(process.argv[2] ?? 'outputs/grade11-content-review');
await mkdir(output, { recursive: true });
const levels = ['understand', 'apply', 'analyze', 'evaluate', 'create'];
const labels = { understand: 'Anlama', apply: 'Uygulama', analyze: 'Çözümleme', evaluate: 'Değerlendirme', create: 'Oluşturma' };
const report = ['# 11. sınıf ünite içerik incelemesi', '', 'Yeni içeriklerin öğretmen incelemesi için üretilmiş kayıt. Üretim onayı anlamına gelmez.', ''];
const escape = s => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const selectedUnits = process.argv[3] ? [Number(process.argv[3])] : [3, 4];
const round = Number(process.argv[4] ?? 0);
const questionCount = Number(process.argv[5] ?? 5);
assert.ok([5, 8].includes(questionCount));
assert.ok(selectedUnits.every(unit => [3, 4, 5, 6].includes(unit)));
assert.ok(Number.isInteger(round) && round >= 0 && round <= 1);
assert.ok(round === 0 || selectedUnits.every(unit => unit === 4));
for (const unit of selectedUnits) {
  const codes = [`FEL.11.${unit}.1`, `FEL.11.${unit}.2`];
  for (const code of codes) for (const [c, focus] of reviewUnits[code].entries()) {
    report.push(`## ${code} ${String.fromCharCode(97 + c)} bileşeni`, '', focus.context, '');
    for (const t of earlyUnitTasks(focus)) report.push(`### ${labels[t.level]}`, '', t.stem, '', `**Örnek anahtar:** ${t.key}`, '', `**Ölçütler:** ${t.criteria.join(' / ')}`, '');
  }
  for (const mode of ['standard', 'bep']) {
    const slots = codes.flatMap(code => reviewUnits[code].map((_, c) => ({ code, c })));
    const a = Array.from({ length: questionCount }, (_, i) => ({ ...slots[i % slots.length], cycle: Math.floor(i / slots.length) })).map(({ code, c, cycle }, i) => {
      const input = { unitCode: `F11_U${unit}`, outcomeCode: code, ordinal: c + 2 * (round + cycle) * reviewUnits[code].length, level: levels[i % levels.length], points: Math.floor(100 / questionCount) + (i < 100 % questionCount ? 1 : 0), kind: 'text', datasetVersion: '2026.1', mode, profile: 'reading' };
      return { input, q: generatePhilosophyExamReviewContent(input) };
    });
    for (const booklet of ['A', 'B']) {
      const questions = a.map(({ input, q }) => {
        if (booklet === 'B') {
          const ordinal = philosophyReviewParallelOrdinal(input.unitCode, input.outcomeCode, input.ordinal, [input.ordinal], q.level, q.generationLevel);
          q = generatePhilosophyExamReviewContent({ ...input, ordinal });
        }
        return { ...q, outcomeCode: input.outcomeCode, unitCode: input.unitCode, points: input.points, kindLabel: 'Metin temelli', levelLabel: labels[q.level] };
      });
      assert.equal(questions.reduce((n,q) => n + q.points, 0), 100);
      for (const audience of ['student', 'teacher']) {
        const name = `unit${unit}-${mode}-${booklet}-${audience}.docx`;
        const artifact = await buildExamPackageArtifact({ school: 'İçerik İnceleme Okulu', academicYear: '2026-2027', grade: 11, subjectName: 'Felsefe', examName: 'Ünite İçerik İncelemesi', booklet, durationMinutes: mode === 'bep' ? 60 : 40, mode, bepLabel: 'Okuma desteği', questions }, audience);
        const path = resolve(output, name);
        await writeFile(path, Buffer.from(await artifact.blob.arrayBuffer()));
        const xml = execFileSync('unzip', ['-p', path, 'word/document.xml'], { encoding: 'utf8', maxBuffer: 20_000_000 });
        for (const q of questions) {
          for (const line of q.text.split('\n')) assert.ok(xml.includes(escape(line)), `${name}: soru`);
          for (const line of q.passage.split('\n')) assert.ok(xml.includes(escape(line)), `${name}: metin`);
          if (audience === 'teacher') {
            assert.ok(xml.includes(escape(q.answer)), `${name}: anahtar`);
            for (const line of q.criterion.split('\n')) assert.ok(xml.includes(escape(line)), `${name}: ölçüt`);
          } else {
            assert.ok(!xml.includes(escape(q.answer)), `${name}: anahtar sızıntısı`);
            assert.ok(!xml.includes(escape(q.componentDescription)), `${name}: bileşen sızıntısı`);
          }
        }
        assert.ok((await readFile(path)).length > 0);
      }
    }
  }
}
await writeFile(resolve(output, 'icerik-inceleme.md'), report.join('\n'));
console.log(`${selectedUnits.length * 8} DOCX: soru–metin–anahtar–ölçüt eşleşmesi ve 100 puan doğrulandı; tur ${round + 1}.`);
