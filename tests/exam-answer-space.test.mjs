import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { examAnswerSpace } from '../app/modules/exam-builder/exam-answer-space.ts';
import { buildExamPackageArtifact } from '../app/modules/exam-builder/export-exam-package.ts';
import { generatePhilosophyExamReviewContent, philosophyReviewParallelOrdinal } from '../app/modules/exam-builder/philosophy-exam-content-2026.ts';

test('yazma yönergesi ve biçim, bilişsel düzey değişse veya eski kayıtta biçim eksik olsa da uzun alanı korur', () => {
  for (const levelLabel of ['Anlama', 'Çözümleme', 'Oluşturma']) {
    assert.equal(examAnswerSpace({ text: 'En az 8 cümlelik bir metin yazınız.', levelLabel }).lineCount, 12);
    assert.equal(examAnswerSpace({ text: 'Metin yazınız.', levelLabel, responseFormat: 'extended' }).lineCount, 12);
  }
  assert.equal(examAnswerSpace({ text: 'En az 10 cümlelik metin yazınız.', levelLabel: 'Oluşturma' }).lineCount, 15);
  assert.equal(examAnswerSpace({ text: 'Tanımlayınız.', levelLabel: 'Anlama' }).lineCount, 3);
  assert.equal(examAnswerSpace({ text: 'Değerlendiriniz.', levelLabel: 'Değerlendirme' }).lineCount, 5);
  assert.equal(examAnswerSpace({ text: 'En az 8 cümlelik metin yazınız.', levelLabel: 'Oluşturma', fontSize: 32 }).lineHeight, 480);
});

test('A/B yazma soruları biçim bilgisini üreticiden gerçek DOCX’e taşır; 12 tam genişlikte satır vardır', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'exam-answer-space-'));
  try {
    for (const unit of [3, 4]) for (const mode of ['standard', 'bep']) for (const profile of ['reading', 'visual']) {
      const input = { unitCode: `F11_U${unit}`, outcomeCode: `FEL.11.${unit}.2`, ordinal: 2, level: 'create', kind: 'text', points: 100, datasetVersion: '2026.1', mode, profile };
      const a = generatePhilosophyExamReviewContent(input);
      const ordinal = philosophyReviewParallelOrdinal(input.unitCode, input.outcomeCode, input.ordinal, [input.ordinal], a.level, a.generationLevel);
      const b = generatePhilosophyExamReviewContent({ ...input, ordinal });
      for (const [i, q] of [a, b].entries()) {
        assert.equal(q.responseFormat, 'extended');
        const booklet = i ? 'B' : 'A';
        const question = { ...q, points: 100, unitCode: input.unitCode, outcomeCode: input.outcomeCode, levelLabel: 'Oluşturma', kindLabel: 'Metin temelli' };
        for (const audience of ['student', 'teacher']) {
          const artifact = await buildExamPackageArtifact({ school: 'Kabul', academicYear: '2026-2027', grade: 11, subjectName: 'Felsefe', examName: 'Yazılı', booklet, durationMinutes: 40, mode, questions: [question] }, audience);
          const path = join(directory, `${unit}-${mode}-${profile}-${booklet}-${audience}.docx`);
          writeFileSync(path, Buffer.from(await artifact.blob.arrayBuffer()));
          const xml = execFileSync('unzip', ['-p', path, 'word/document.xml'], { encoding: 'utf8' });
          const paragraphs = xml.match(/<w:p[ >][\s\S]*?<\/w:p>/g) ?? [];
          const answerLines = paragraphs.filter(p => p.includes('w:pStyle w:val="ExamAnswerLine"'));
          assert.equal(answerLines.length, 12, path);
          for (const paragraph of answerLines) {
            assert.match(paragraph, /w:bottom w:val="dotted"/);
            assert.match(paragraph, /w:between w:val="dotted"/);
            assert.doesNotMatch(paragraph, /<w:ind|<w:tabs/);
          }
          assert.equal(xml.includes('CEVAP ANAHTARI VE DERECELİ PUANLAMA ANAHTARI'), audience === 'teacher');
          assert.match(xml, /Toplam: 100 puan/);
        }
      }
    }
  } finally { rmSync(directory, { recursive: true, force: true }); }
});
