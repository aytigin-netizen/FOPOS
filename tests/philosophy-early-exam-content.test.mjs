import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { getCurriculumContext } from '../app/data/curriculum-runtime.ts';
import { resolveExamContentEngine, activeExamContentEngine } from '../app/modules/exam-builder/exam-content-engine.ts';
import { buildExamPackageArtifact } from '../app/modules/exam-builder/export-exam-package.ts';
import { earlyUnits, earlyUnitTasks, earlyUnitCriterion } from '../app/modules/exam-builder/philosophy-early-units-2026.ts';
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
 const {rescoreQuestion}=new Function('earlyUnitCriterion', `${prefix};return {rescoreQuestion};`)(earlyUnitCriterion);
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

test('her çözümleme görevinin kökü gerçek bir görev yönergesidir; ölçüt etiketi değildir',()=>{
 for (const [code,focuses] of Object.entries(earlyUnits)) focuses.forEach((focus,i)=>{
  const tasks=earlyUnitTasks(focus);
  const all=new Set(tasks.flatMap(t=>t.criteria));
  for (const task of tasks) {
   assert.ok(!all.has(task.stem),`${code}#${i+1}: görev kökü ölçüt etiketiyle aynı: ${task.stem}`);
   assert.match(task.stem,/[.?]$/,`${code}#${i+1}: görev kökü cümle gibi bitmiyor (ölçüt etiketi olabilir): ${task.stem}`);
   assert.equal(task.criteria.length,3);
   assert.ok(task.stem.length>40,`${code}#${i+1}: görev kökü çok kısa: ${task.stem}`);
  }
 });
});


test('atlas çözümlemesinde puanlanan çoğunluk gerekçesi soru yönergesinde açıkça istenir',()=>{
 const q=engine.generate(input(units[1],units[1].outcomes[1],0,'analyze',12));
 assert.match(q.text,/öncülleri ve sonucu ayırınız/);
 assert.match(q.text,/çıkarım türünü ve çelişkili ifadeyi belirleyiniz/);
 assert.match(q.text,/geçerliliği ile “sınıfta herkes öyle düşünüyor” gerekçesini karşılaştır/);
 assert.match(q.criterion,/Geçerlilik ile çoğunluk kabulünün gerekçe olarak ayrılması: 4 puan/);
});

test('onaylanan paket: farklı tanım vurguları, bağımsız uygulama ve ayrık kavram puanları A/B üretiminde korunur',()=>{
 const definition=earlyUnits['FEL.10.1.1'][0];
 assert.doesNotMatch(definition.context,/tartışmadan benimser|kendi tanımına uyan/);
 const cases=[
  [units[0],units[0].outcomes[0],0,'understand',13,/hangi yönlere|öncelikli/],
  [units[0],units[0].outcomes[0],1,'apply',13,/yeni duruma uygulayınız/],
  [units[1],units[1].outcomes[1],0,'understand',12,/üç duruma|ilgili kavramları/],
  [units[1],units[1].outcomes[1],1,'apply',12,/öncül\(ler\) ve sonuç/],
 ];
 for(const [u,o,component,level,points,stem] of cases){
  const a=engine.generate(input(u,o,component,level,points));
  const ordinal=engine.parallelOrdinal(u.code,o.code,component,[component],a.level,a.generationLevel);
  const b=engine.generate(input(u,o,ordinal,level,points));
  for(const q of [a,b]){
   assert.match(q.text,stem);assert.equal(q.level,level);
   assert.doesNotMatch(q.text,/P1:|P2:|C:/);
   assert.equal([...q.criterion.matchAll(/: (\d+) puan\. Tam:/g)].reduce((sum,m)=>sum+Number(m[1]),0),points);
   if(o.code==='FEL.10.2.2'&&component===0){
    assert.equal((q.criterion.match(/Adlandırma:.*\(1 puan\)/g)||[]).length,3);
    assert.equal((q.criterion.match(/Açıklama:.*\(3 puan\)/g)||[]).length,3);
    assert.match(q.criterion,/İki bileşen bağımsız puanlanır/);
    assert.equal(earlyUnitCriterion(12,q.scoringCriteria),q.criterion);
    assert.match(earlyUnitCriterion(20,q.scoringCriteria),/İki bileşen bağımsız puanlanır/);
   }
  }
 }
});


test('mantık kavram adları düşük soru puanlarında da puan alır',()=>{
 const labels=earlyUnitTasks(earlyUnits['FEL.10.2.2'][0])[0].criteria;
 for(const points of [3,4,6,8,10,12,20,100]){
  const criterion=earlyUnitCriterion(points,labels);
  assert.equal([...criterion.matchAll(/: (\d+) puan\. Tam:/g)].reduce((sum,m)=>sum+Number(m[1]),0),points);
  for(const line of criterion.split('\n').slice(0,3)){
   const parent=Number(line.match(/: (\d+) puan/)[1]);
   const name=Number(line.match(/Adlandırma:.*?\((\d+) puan\)/)[1]);
   const explanation=Number(line.match(/Açıklama:.*?\((\d+) puan\)/)[1]);
   assert.ok(name>0);assert.equal(name+explanation,parent);
  }
 }
});

test('10.1–10.2 soru kökleri her zaman büyük harfle başlar',()=>{
 for(const [code,foci] of Object.entries(earlyUnits)) foci.forEach((f,i)=>{
  for(const task of earlyUnitTasks(f)) assert.equal(task.stem.charAt(0),task.stem.charAt(0).toLocaleUpperCase('tr'),`${code}/${i}: ${task.stem.slice(0,50)}`);
 });
});

test('kalan paralel çiftler: kökte bileşen cümlesi veya yargı yoktur, A ve B aynı düzey ve ölçütlerle kurulur',()=>{
 const pairs=[
  ['FEL.10.2.1',0,[6,7],'evaluate',/Sözcüğü olmayan şeyi düşünemeyiz/],
  ['FEL.10.2.1',1,[8,9],'create',/yeni bir soru|kısa bir durum/],
  ['FEL.10.1.1',2,[4,5],'analyze',/cevabı zor olduğu için felsefidir/],
  ['FEL.10.2.2',2,[4,5],'analyze',/özet/],
  ['FEL.10.1.1',0,[2,3],'apply',/tek bir ortak tanım/],
  ['FEL.10.1.1',0,[6,7],'evaluate',/felsefenin ortak bir tanımı olamaz/],
  ['FEL.10.1.1',0,[8,9],'create',/yeni bir soru|kısa bir durum/],
  ['FEL.10.1.1',1,[6,7],'evaluate',/Ticaret yolları üzerinde olan/],
  ['FEL.10.1.1',1,[8,9],'create',/yeni bir soru|kısa bir durum/],
  ['FEL.10.1.1',2,[2,3],'apply',/hangilerinin felsefi olduğunu/],
  ['FEL.10.1.1',2,[6,7],'evaluate',/kayıtlara bakılarak bulunamayan/],
  ['FEL.10.1.1',2,[8,9],'create',/felsefi soru yazınız|kısa bir durum/],
 ];
 for(const [code,index,slots,level,pattern] of pairs){
  const focus=earlyUnits[code][index];
  const tasks=slots.map(slot=>earlyUnitTasks(focus)[slot]);
  for(const task of tasks){
   assert.equal(task.level,level);assert.match(task.stem,pattern);
   assert.ok(!task.stem.includes(focus.focus),`bileşen cümlesi kökte: ${task.stem}`);
   assert.ok(!task.stem.includes(focus.inference),`yargı kökte: ${task.stem}`);
  }
  assert.notEqual(tasks[0].stem,tasks[1].stem);
  assert.equal(tasks[0].criteria.length,tasks[1].criteria.length);
  if(level==='analyze'||level==='apply') assert.deepEqual(tasks[0].criteria,tasks[1].criteria);
  else assert.notDeepEqual(tasks[0].criteria,tasks[1].criteria);
 }
 const dil=earlyUnitTasks(earlyUnits['FEL.10.2.1'][0]);
 assert.doesNotMatch(dil[6].stem,/çıkarılamaz|sonucu bu örneklerden/);
 assert.match(dil[6].key,/gerekçeli itiraz kabul edilir/);
});

test('kalan paralel çiftler gerçek A/B üretiminde korunur',()=>{
 const cases=[
  [units[1],units[1].outcomes[0],0,'evaluate',13,/Sözcüğü olmayan şeyi düşünemeyiz/],
  [units[1],units[1].outcomes[0],1,'create',12,/yeni bir soru|kısa bir durum/],
  [units[0],units[0].outcomes[0],2,'analyze',13,/cevabı zor olduğu için felsefidir/],
  [units[1],units[1].outcomes[1],2,'analyze',12,/özetini?|özeti/],
  [units[0],units[0].outcomes[0],0,'apply',13,/tek bir ortak tanım/],
  [units[0],units[0].outcomes[0],0,'evaluate',13,/felsefenin ortak bir tanımı olamaz/],
  [units[0],units[0].outcomes[0],0,'create',12,/yeni bir soru|kısa bir durum/],
  [units[0],units[0].outcomes[0],1,'evaluate',13,/Ticaret yolları üzerinde olan/],
  [units[0],units[0].outcomes[0],1,'create',12,/yeni bir soru|kısa bir durum/],
  [units[0],units[0].outcomes[0],2,'apply',13,/hangilerinin felsefi olduğunu/],
  [units[0],units[0].outcomes[0],2,'evaluate',13,/kayıtlara bakılarak bulunamayan/],
  [units[0],units[0].outcomes[0],2,'create',12,/felsefi soru yazınız|kısa bir durum/],
 ];
 for(const [u,o,component,level,points,stem] of cases){
  const a=engine.generate(input(u,o,component,level,points));
  const ordinal=engine.parallelOrdinal(u.code,o.code,component,[component],a.level,a.generationLevel);
  const b=engine.generate(input(u,o,ordinal,level,points));
  assert.notEqual(a.text,b.text);
  for(const q of [a,b]){
   assert.equal(q.level,level);assert.match(q.text,stem);
   assert.match(q.text.charAt(0),/[A-ZÇĞİÖŞÜ“]/);
   assert.equal([...q.criterion.matchAll(/: (\d+) puan\. Tam:/g)].reduce((sum,m)=>sum+Number(m[1]),0),points);
  }
  assert.equal(a.scoringCriteria.length,b.scoringCriteria.length);
 }
});

test('çiftlerde ölçüt açıklaması, sorunun istediği ürünün yerine başka ürünü kabul etmez',()=>{
 const create=earlyUnitTasks(earlyUnits['FEL.10.2.1'][1]);
 const [question,situation]=[create[8],create[9]];
 const q=earlyUnitCriterion(12,question.criteria),s=earlyUnitCriterion(12,situation.criteria);
 assert.match(q,/yalnız durum yazmak bu ölçütü karşılamaz/);assert.doesNotMatch(q,/soru ya da durum/);
 assert.match(s,/yalnız soru ve yanıt yazmak bu ölçütü karşılamaz/);assert.doesNotMatch(s,/soru ya da durum/);
 const evaluate=earlyUnitTasks(earlyUnits['FEL.10.2.1'][0]);
 assert.match(earlyUnitCriterion(13,evaluate[7].criteria),/yalnız katılma ya da katılmama bu ölçütü karşılamaz/);
 assert.doesNotMatch(earlyUnitCriterion(13,evaluate[6].criteria),/yeniden yazar/);
});

test('10.1.1 ilk bileşen: ölçütler istenen ürünü ayırır; ilkesel imkânsızlık itirazı metinle karıştırılmaz',()=>{
 const t=earlyUnitTasks(earlyUnits['FEL.10.1.1'][0]);
 const q=earlyUnitCriterion(12,t[8].criteria),s=earlyUnitCriterion(12,t[9].criteria);
 assert.match(q,/yalnız durum yazmak bu ölçütü karşılamaz/);assert.match(s,/yalnız soru ve yanıt yazmak bu ölçütü karşılamaz/);
 assert.doesNotMatch(t[2].stem+t[3].stem,/imkânsız sayılamayacağını/);
 assert.match(t[6].key,/Gallie/);assert.match(t[6].key,/metnin ortak tanımın imkânsızlığını kanıtladığı iddiası kabul edilmez/);
 assert.match(earlyUnitCriterion(13,t[7].criteria),/yalnız katılma ya da katılmama bu ölçütü karşılamaz/);
 assert.doesNotMatch(earlyUnitCriterion(13,t[6].criteria),/yeniden yazar/);
});

test('10.1.1 ikinci ve üçüncü bileşen: ürüne özgü ölçüt, gerek-yeter koşul ayrımı ve natüralist itiraz metinle karıştırılmaz',()=>{
 for(const i of [1,2]){
  const t=earlyUnitTasks(earlyUnits['FEL.10.1.1'][i]);
  const q=earlyUnitCriterion(12,t[8].criteria),s=earlyUnitCriterion(12,t[9].criteria);
  assert.match(q,/yalnız durum yazmak bu ölçütü karşılamaz|cevabı zor olduğu için felsefi saymaz|tek koşula bağlamaz/);
  assert.doesNotMatch(q,/soru ya da durum/);assert.doesNotMatch(s,/soru ya da durum/);
  assert.match(earlyUnitCriterion(13,t[7].criteria),/yalnız katılma ya da katılmama bu ölçütü karşılamaz/);
  assert.doesNotMatch(earlyUnitCriterion(13,t[6].criteria),/yeniden yazar/);
  assert.match(t[6].key,/iddiası kabul edilmez/);
 }
 const k2=earlyUnitTasks(earlyUnits['FEL.10.1.1'][2]);
 assert.match(k2[6].key,/natüralist/);assert.match(k2[6].key,/yeter/);
 assert.doesNotMatch(k2[2].stem+k2[3].stem,/diğer ikisi|neden olgusal/);
 assert.notEqual(k2[2].key,k2[3].key);
});
