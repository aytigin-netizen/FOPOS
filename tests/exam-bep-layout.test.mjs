import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { applyExamBepPresentation } from '../app/modules/exam-builder/exam-bep-presentation.ts';
import { generatePhilosophyExamReviewContent } from '../app/modules/exam-builder/philosophy-exam-content-2026.ts';
import { buildExamPackageArtifact } from '../app/modules/exam-builder/export-exam-package.ts';

test('okuma uyarlaması düşünür baş harfini, tarih aralığını ve sıra sayısını cümle sonu saymaz', () => {
  const passage = 'S. Kierkegaard, 19. yüzyıl Danimarka düşüncesindedir. Gazali, 11–12. yüzyıl İslam düşüncesindedir. İki bağlam farklıdır.';
  const result = applyExamBepPresentation('bep', 'reading', { passage, text: 'Dr. Öğretmen 3. soruyu açıklıyor. Soruyu okuyunuz.', fontSize: 22 }, 'akıl');
  assert.match(result.passage, /S\. Kierkegaard, 19\. yüzyıl/);
  assert.match(result.passage, /11–12\. yüzyıl/);
  assert.match(result.passage, /düşüncesindedir\.\n\nGazali/);
  assert.match(result.text, /Dr\. Öğretmen 3\. soruyu/);
  assert.equal(result.passage.replaceAll(/\s+/g, ' '), passage);
});

test('uzun BEP okuma metni sayfalar arasında akabilir; metin başlığı bir kez basılır ve son bölüm soruya bağlıdır', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'bep-layout-'));
  try {
    const q = generatePhilosophyExamReviewContent({ unitCode: 'F11_U4', outcomeCode: 'FEL.11.4.1', ordinal: 0, level: 'understand', kind: 'text', points: 100, datasetVersion: '2026.1', mode: 'bep', profile: 'reading' });
    for (const audience of ['student', 'teacher']) {
      const artifact = await buildExamPackageArtifact({ school: 'Kabul', academicYear: '2026-2027', grade: 11, subjectName: 'Felsefe', examName: 'Yazılı', booklet: 'A', durationMinutes: 60, mode: 'bep', questions: [{ ...q, outcomeCode: 'FEL.11.4.1', unitCode: 'F11_U4', points: 100, kindLabel: 'Metin temelli', levelLabel: 'Anlama' }] }, audience);
      const path = join(directory, `${audience}.docx`);
      writeFileSync(path, Buffer.from(await artifact.blob.arrayBuffer()));
      const xml = execFileSync('unzip', ['-p', path, 'word/document.xml'], { encoding: 'utf8' });
      const paragraphs = xml.match(/<w:p[ >][\s\S]*?<\/w:p>/g) ?? [];
      const reading = paragraphs.filter(p => p.includes('<w:shd'));
      assert.ok(reading.length > 10, 'uzun metin ayrı okuma bölümlerine ayrılmalı');
      assert.equal(reading.filter(p => p.includes('Felsefe metni')).length, 1);
      for (const p of reading.slice(0, -1)) assert.doesNotMatch(p, /<w:keepNext\/>/);
      assert.match(reading.at(-1), /<w:keepNext\/>/);
      const escape = s => s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
      for (const part of q.passage.split(/\n+/).filter(p => p.trim())) assert.ok(xml.includes(escape(part)));
      assert.doesNotMatch(reading.join(''), /<w:pageBreakBefore/);
    }
  } finally { rmSync(directory, { recursive: true, force: true }); }
});
