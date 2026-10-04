import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { getCurriculumContext } from '../app/data/curriculum-runtime.ts';
import { resolveExamContentEngine, activeExamContentEngine } from '../app/modules/exam-builder/exam-content-engine.ts';
import { buildExamPackageArtifact } from '../app/modules/exam-builder/export-exam-package.ts';
import { earlyUnits, earlyUnitTasks } from '../app/modules/exam-builder/philosophy-early-units-2026.ts';
const engine = resolveExamContentEngine('philosophy');
const context = getCurriculumContext('philosophy');
const units = context.units.filter(u => u.grade === 10 && ['F10_U1','F10_U2'].includes(u.code));
const input = (u,o,ordinal,level='analyze',points=13) => ({unitCode:u.code,outcomeCode:o.code,ordinal,level,points,kind:'text',datasetVersion:'2026.1',mode:'standard',profile:'reading'});
for (const u of units) for (const o of u.outcomes) test(`${o.code}: bütün bileşenler, düzeyler ve anahtarlar`, () => {
 assert.ok(engine.covers(o.code,'2026.1'));
 assert.equal(earlyUnits[o.code].length,o.processComponents.length);
 for(let component=0;component<o.processComponents.length;component++) for(const level of ['understand','apply','analyze','evaluate','create']) {
  const tasks=earlyUnitTasks(earlyUnits[o.code][component]);
  const ordered=[...tasks.filter(t=>t.level===level),...tasks.filter(t=>t.level!==level)];
  const answers=new Set();
  for(let v=0;v<10;v++) {
   const q=engine.generate(input(u,o,v*o.processComponents.length+component,level));
   assert.equal(q.componentStep,o.processComponents[component].step);
   assert.equal(q.componentDescription,o.processComponents[component].description);
   assert.equal(q.level,ordered[v].level);
   assert.equal(q.generationLevel,level);
   assert.ok(q.text.includes(ordered[v].stem)); assert.ok(q.answer.includes(ordered[v].key));
   assert.doesNotMatch(q.answer,/Yanıt, soruda istenen|Beklenen cevabı buraya/);
   assert.equal([...q.criterion.matchAll(/: (\d+) puan\. Tam:/g)].reduce((n,m)=>n+Number(m[1]),0),13);
   assert.match(q.criterion,/kısmi:.*0 puan/s); answers.add(q.answer);
  }
  assert.ok(answers.size>=8, 'Farklı görevler aynı anahtarı tekrar etmemeli');
  const a=engine.generate(input(u,o,component,level));
  const ordinal=engine.parallelOrdinal(u.code,o.code,component,[component],a.level,a.generationLevel);
  const b=engine.generate(input(u,o,ordinal,a.generationLevel));
  assert.equal(b.level,a.level); assert.equal(b.componentStep,a.componentStep); assert.notEqual(b.text,a.text);
  assert.throws(()=>engine.parallelOrdinal(u.code,o.code,component,[component,ordinal],a.level,a.generationLevel),/B sorusu kalmadı/);
 }
});
test('çıktı kapsamı, düşünme-dil ve mantık içerikleri ayrıdır; 11. sınıf üretimi kapalıdır',()=>{
 assert.ok(activeExamContentEngine('philosophy','2026.1',['FEL.10.1.1','FEL.10.2.1','FEL.10.2.2','FEL.10.3.1']));
 assert.equal(activeExamContentEngine('philosophy','2026.1',['FEL.10.1.1','FEL.11.1.1']),null);
 assert.equal(activeExamContentEngine('philosophy','unsupported',['FEL.10.1.1']),null);
 const u=units[1];
 const language=engine.generate(input(u,u.outcomes[0],0));
 const logic=engine.generate(input(u,u.outcomes[1],0));
 assert.match(language.passage,/sözcük|dil/); assert.match(logic.passage,/sonuç|çelişki|kayıtlıdır/); assert.doesNotMatch(logic.passage,/öncül|argüman|çelişkidir/);
 assert.notEqual(language.answer,logic.answer);
});
test('puan değişimi gerçek düzenleyicide anahtarı yeniden puanlar; öğretmen ölçütünü silmez',()=>{
 const source=readFileSync(new URL('../app/modules/exam-builder/ExamBuilder.tsx',import.meta.url),'utf8');
 const prefix=stripTypeScriptTypes(source.slice(0,source.indexOf('export default function')).replace(/import[\s\S]*?from\s+"[^"]+";/g,''));
 const {rescoreQuestion}=new Function(`${prefix};return {rescoreQuestion};`)();
 const q=engine.generate(input(units[0],units[0].outcomes[0],0));
 for(const points of [12,13,20,100]) {
  const updated=rescoreQuestion(q,points);
  assert.equal([...updated.criterion.matchAll(/: (\d+) puan\. Tam:/g)].reduce((n,m)=>n+Number(m[1]),0),points);
  assert.equal(updated.answer,q.answer);
 }
});
test('gerçek Word üreticisi yer tutucu ve genel şablon anahtarı reddeder', async()=>{
 const base={school:'Test',academicYear:'2026-2027',grade:10,subjectName:'Felsefe',examName:'1. Dönem 1. Yazılı Sınavı',booklet:'A',durationMinutes:40,mode:'standard'};
 for(const answer of ['Beklenen cevabı buraya yazınız.','Yanıt, soruda istenen okuma becerisini göstermeli.','']) {
  await assert.rejects(buildExamPackageArtifact({...base,questions:[{outcomeCode:'FEL.10.1.1',unitCode:'F10_U1',kindLabel:'Alan metni',levelLabel:'Çözümleme',text:'Soru',points:100,answer,criterion:'Ölçüt'}]},'teacher'),/tamamlanmadan/);
 }
});

test('ilk iki ünitenin 10 bileşeni öğrenci ve öğretmen Word çıktısında eşleşir',async()=>{
 const {mkdtempSync,writeFileSync,rmSync}=await import('node:fs');
 const {tmpdir}=await import('node:os');const {join}=await import('node:path');const {execFileSync}=await import('node:child_process');
 const levelLabels={understand:'Anlama',apply:'Uygulama',analyze:'Çözümleme',evaluate:'Değerlendirme',create:'Oluşturma'};
 const questions=units.flatMap(u=>u.outcomes.flatMap(o=>o.processComponents.map((c,i)=>{
  const q=engine.generate(input(u,o,i,'analyze',10));
  return {...q,outcomeCode:o.code,unitCode:u.code,points:10,kindLabel:'Alan metni',levelLabel:levelLabels[q.level]};
 })));
 const dir=mkdtempSync(join(tmpdir(),'early-exam-'));
 const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
 try {
  for(const audience of ['student','teacher']) {
   const artifact=await buildExamPackageArtifact({school:'Test',academicYear:'2026-2027',grade:10,subjectName:'Felsefe',examName:'1. Dönem 1. Yazılı Sınavı',booklet:'A',durationMinutes:40,mode:'standard',questions},audience);
   const path=join(dir,`${audience}.docx`);writeFileSync(path,Buffer.from(await artifact.blob.arrayBuffer()));
   const xml=execFileSync('unzip',['-p',path,'word/document.xml'],{encoding:'utf8'});
   for(const q of questions) {
    assert.ok(xml.includes(escape(q.text)));assert.ok(xml.includes(escape(q.passage)));
    if(audience==='teacher') {
     assert.ok(xml.includes(escape(q.answer)));
     for(const line of q.criterion.split('\n')) assert.ok(xml.includes(escape(line)));
     assert.ok(xml.includes(escape(q.componentDescription)));
    } else {
     assert.ok(!xml.includes(escape(q.answer))); assert.ok(!xml.includes(escape(q.componentDescription)));
    }
   }
   assert.doesNotMatch(xml,/Yanıt, soruda istenen|Beklenen cevabı buraya/);
  }
 }finally{rmSync(dir,{recursive:true,force:true});}
});

test('A/B kapasitesi ilk üretimden önce sıfır olabilir; izin verilen turda B eksiksizdir',()=>{
 const source=readFileSync(new URL('../app/modules/exam-builder/ExamBuilder.tsx',import.meta.url),'utf8');
 const prefix=stripTypeScriptTypes(source.slice(0,source.indexOf('export default function')).replace(/import[\s\S]*?from\s+"[^"]+";/g,''));
 const {variantBudgetOf}=new Function(`${prefix};return {variantBudgetOf};`)();
 const u=units[0],o=u.outcomes[0];
 assert.equal(variantBudgetOf([{...o,questionCount:8}],engine.variantPool),0);
 assert.equal(variantBudgetOf([{...o,questionCount:5}],engine.variantPool),1);
 assert.equal(variantBudgetOf([{...o,questionCount:6}],engine.variantPool),0);
 const used=Array.from({length:5},(_,i)=>i);
 for(let i=0;i<5;i++) {
  const a=engine.generate(input(u,o,i));
  const ordinal=engine.parallelOrdinal(u.code,o.code,i,used,a.level,a.generationLevel);
  used.push(ordinal);
  const b=engine.generate(input(u,o,ordinal));
  assert.equal(b.level,a.level);assert.equal(b.componentStep,a.componentStep);assert.notEqual(b.text,a.text);
 }
 const generate=source.slice(source.indexOf('  function generate()'),source.indexOf('  function update('));
 assert.ok(generate.indexOf('if (variantBudget === 0)')<generate.indexOf('const created ='));
 assert.match(source,/disabled=\{!blueprintValid \|\| !engine \|\| variantRoundsLeft === 0\}/);
});

test('tam şablon cümleleri reddedilir; benzer başlayan özgün cevaplar iki Word çıktısında kabul edilir',async()=>{
 const {isPlaceholderExamAnswer}=await import('../app/modules/exam-builder/exam-answer-validation.ts');
 const u=units[0];
 const placeholders=[
  `Yanıt ${u.name} bağlamındaki kavramı doğru açıklamalı ve görüşünü gerekçelendirmelidir.`,
  `Yanıt, soruda istenen okuma becerisini göstermeli; ${u.keywords.slice(0,3).join(', ')} kavramlarından uygun olanları doğru kullanmalı ve çıkarımını metinden kanıtla desteklemelidir.`,
 ];
 const valid=[
  'Yanıt Aristoteles bağlamındaki kavramı töz olarak açıklamalıdır; töz, varlığını başka bir şeye borçlu olmayan varlıktır.',
  'Yanıt, soruda istenen iki öncül arasındaki çelişkiyi göstermelidir: aynı nesne aynı anda hem tümüyle beyaz hem tümüyle siyah olamaz.',
  'Öğretmenin “Beklenen cevabı buraya yazınız.” ifadesi yeterli kanıt değildir; öğrenci gerekçesini açıklamalıdır.',
 ];
 const base={school:'Test',academicYear:'2026-2027',grade:10,subjectName:'Felsefe',examName:'Yazılı',booklet:'A',durationMinutes:40,mode:'standard'};
 const question=answer=>({outcomeCode:'FEL.10.1.1',unitCode:'F10_U1',kindLabel:'Açık uçlu',levelLabel:'Anlama',text:'Soru',points:100,answer,criterion:'Doğru kavram ve gerekçe: 100 puan.'});
 for(const answer of placeholders) {
  assert.equal(isPlaceholderExamAnswer(answer),true);
  for(const audience of ['teacher','student']) await assert.rejects(buildExamPackageArtifact({...base,questions:[question(answer)]},audience),/tamamlanmadan/);
 }
 for(const answer of valid) {
  assert.equal(isPlaceholderExamAnswer(answer),false);
  for(const audience of ['teacher','student']) {
   const result=await buildExamPackageArtifact({...base,questions:[question(answer)]},audience);
   assert.ok(result.blob.size>0);
  }
 }
});

test('varsayılan belirtke çıktı kapasitesini aşmaz: 10.1–10.2, 8 soru, A+B birlikte üretilir', async () => {
  const { allocateWithinCapacity } = await import('../app/modules/exam-builder/exam-variant-math.ts');
  const caps = units.flatMap(u => u.outcomes.map(o => o.processComponents.length));
  assert.deepEqual(caps, [5, 2, 3]);
  assert.deepEqual(allocateWithinCapacity(8, caps), [3, 2, 3]);
  assert.deepEqual(allocateWithinCapacity(10, caps), [5, 2, 3]);
  assert.deepEqual(allocateWithinCapacity(4, [4]), [4]);
  // Toplam kapasiteyi aşarsa fazlalık eşit dağıtılır; kapasite uyarısı üretimde gösterilmeye devam eder.
  assert.equal(allocateWithinCapacity(14, caps).reduce((a, b) => a + b, 0), 14);
  assert.ok(allocateWithinCapacity(14, caps).some((n, i) => n > caps[i]));
  const rows = units.flatMap(u => u.outcomes);
  const counts = allocateWithinCapacity(8, caps);
  rows.forEach((o, r) => {
    const used = Array.from({ length: counts[r] }, (_, i) => i);
    for (let i = 0; i < counts[r]; i++) {
      const a = engine.generate(input(units.find(u => u.outcomes.includes(o)), o, i, 'understand'));
      const ordinal = engine.parallelOrdinal(units.find(u => u.outcomes.includes(o)).code, o.code, i, used, a.level, a.generationLevel);
      used.push(ordinal);
      assert.equal(engine.generate(input(units.find(u => u.outcomes.includes(o)), o, ordinal, 'understand')).level, a.level);
    }
  });
});

import { allocateWithinCapacity, normalizeExamQuestionCount } from '../app/modules/exam-builder/exam-variant-math.ts';

test('soru sayısı girişleri sonlu 1–20 aralığına alınır', () => {
  for (const [input, expected] of [[8, 8], [0, 1], [-4, 1], [8.9, 8], [21, 20], [1e100, 20], [Infinity, 1], [NaN, 1]]) {
    assert.equal(normalizeExamQuestionCount(input), expected);
  }
});

test('kapasite fazlası çok büyük güvenli toplamda da tamamlanır ve toplam korunur', { timeout: 1000 }, () => {
  assert.deepEqual(allocateWithinCapacity(8, [5, 2, 3]), [3, 2, 3]);
  assert.deepEqual(allocateWithinCapacity(14, [5, 2, 3]), [7, 3, 4]);
  const total = Number.MAX_SAFE_INTEGER;
  const result = allocateWithinCapacity(total, [5, 2, 3]);
  assert.equal(result.reduce((sum, count) => sum + count, 0), total);
  assert.deepEqual(allocateWithinCapacity(8, []), []);
  assert.deepEqual(allocateWithinCapacity(0, [5, 2, 3]), [0, 0, 0]);
});

test('sonlu olmayan veya güvenli tam sayı olmayan toplamlar reddedilir', () => {
  for (const value of [NaN, Infinity, -Infinity, 1e100, 1.5]) {
    assert.throws(() => allocateWithinCapacity(value, [5, 2, 3]), /Geçersiz soru sayısı/);
  }
});
