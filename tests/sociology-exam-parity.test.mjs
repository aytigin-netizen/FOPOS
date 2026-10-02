import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import test from 'node:test';
import { getCurriculumContext } from '../app/data/curriculum-runtime.ts';
const source = readFileSync(new URL('../app/modules/exam-builder/ExamBuilder.tsx', import.meta.url), 'utf8');
const prefix = stripTypeScriptTypes(source.slice(0, source.indexOf('export default function')).replace(/import[\s\S]*?from\s+"[^"]+";/g, ''));
const body = stripTypeScriptTypes(source.slice(source.indexOf('  function generate()'), source.indexOf('  function update(')));
let domain = {};
try { domain = await import('../app/modules/exam-builder/sociology-exam-content-2026.ts'); } catch (error) { if (error.code !== 'ERR_MODULE_NOT_FOUND') throw error; }
function produce(subjectCode, outcomes, mode = 'standard', bep = 'reading', setBooklet = () => {}) {
 const context = getCurriculumContext(subjectCode);
 let result;
 const scope = outcomes;
 const blueprintRows = outcomes.map(o => ({...o, questionCount: o.questionCount ?? 1, questionKind: o.questionKind ?? 'text', cognitiveLevel: o.cognitiveLevel ?? 'analyze'}));
 const count = blueprintRows.reduce((n,o) => n + o.questionCount, 0);
 const run = new Function('scope','blueprintValid','blueprintTotal','count','blueprintRows','textRatio','gradeUnits','kind','setQuestions','invalidateApproval','window','resultsRef','createId','subjectCode','datasetVersion','mode','bep', 'generateSociologyExamContent', 'setBooklet', `${prefix}\n${body}\ngenerate();`);
 run(scope,true,count,count,blueprintRows,75,context.units,'open',q=>result=q,()=>{}, {setTimeout(){}},{current:null},()=>crypto.randomUUID(),subjectCode,context.datasetVersion,mode,bep,domain.generateSociologyExamContent,setBooklet);
 return result;
}
const sociology = getCurriculumContext('sociology');
const all = sociology.units.flatMap(u=>u.outcomes.map(o=>({...o,unitCode:u.code})));
test('gerçek üretici farklı Sosyoloji çıktılarında farklı soru ve cevap üretir',()=>{
 const [a,b] = produce('sociology',all.slice(0,2));
 assert.notEqual(a.text,b.text); assert.notEqual(a.answer,b.answer);
 assert.ok(a.componentStep); assert.ok(a.componentDescription);
});
test('gerçek üretici 21 çıktı / 62 süreç bileşenini ve 100 puanı korur',()=>{
 for (const outcome of all) {
  const questions = produce('sociology',[{...outcome,questionCount:outcome.processComponents.length}]);
  assert.equal(questions.reduce((n,q)=>n+q.points,0),100);
  assert.deepEqual(questions.map(q=>q.componentStep),outcome.processComponents.map(c=>c.step));
  for (const q of questions) {assert.ok(q.criterion.includes(q.componentDescription));assert.ok(q.answer.length>100);}
 }
});
test('beş BEP profili gerçek öğrenci sorusunu uyarlar, çıktıyı korur',()=>{
 const [base] = produce('sociology',[all[0]]);
 for (const profile of ['reading','writing','attention','cognitive','visual']) {
  const [q] = produce('sociology',[all[0]],'bep',profile);
  assert.ok(q.text !== base.text || q.fontSize !== base.fontSize,profile);
  assert.equal(q.outcomeCode,base.outcomeCode); assert.equal(q.componentStep,base.componentStep); assert.equal(q.points,100);
 }
});

import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { buildExamPackageArtifact } from '../app/modules/exam-builder/export-exam-package.ts';
const mapping = source.slice(source.indexOf('questions: shown.map(') + 'questions: '.length, source.indexOf('    }, audience);')).trim().replace(/,$/,'');
const mapQuestions = new Function('shown',`${prefix}; return ${mapping};`);
const escape = value=>value.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
async function xmlFor(questions, audience, profile = 'reading') {
 const artifact = await buildExamPackageArtifact({school:'Test Okulu',academicYear:'2026-2027',grade:questions[0].outcomeCode.includes('.12.')?12:11,subjectName:'Sosyoloji',examName:'1. Dönem 1. Sınav',booklet:'A',durationMinutes:40,mode:'bep',bepLabel:profile,bepGoals:'ÖĞRETMENE ÖZEL HEDEF',teacher:'Öğretmen',questions:mapQuestions(questions)},audience);
 const dir=mkdtempSync(join(tmpdir(),'sociology-exam-'));
 try {const path=join(dir,'exam.docx');writeFileSync(path,Buffer.from(await artifact.blob.arrayBuffer()));return execFileSync('unzip',['-p',path,'word/document.xml'],{encoding:'utf8',maxBuffer:8*1024*1024});} finally {rmSync(dir,{recursive:true,force:true});}
}
for (const grade of [11,12]) test(`Sosyoloji ${grade}: gerçek üretici → gerçek UI eşlemesi → öğrenci ve öğretmen DOCX`,async()=>{
 const questions=produce('sociology',all.filter(o=>o.code.startsWith(`SOS.${grade}.`)).map(o=>({...o,questionCount:o.processComponents.length})));
 const student=await xmlFor(questions,'student'), teacher=await xmlFor(questions,'teacher');
 for (const q of questions) {
  for (const xml of [student,teacher]) {for (const line of [...q.text.split("\n"), ...q.passage.split("\n")].filter(Boolean)) assert.ok(xml.includes(escape(line)));}
  for(const line of q.answer.split("\n")) assert.ok(teacher.includes(escape(line)));assert.ok(teacher.includes(escape(q.criterion)));assert.ok(teacher.includes(escape(`${q.outcomeCode} / ${q.componentStep}) ${q.componentDescription}`)));
 }
 assert.doesNotMatch(student,/ÖĞRETMENE ÖZEL HEDEF|CEVAP ANAHTARI|BEP uyarlaması/);
 assert.match(teacher,/ÖĞRETMENE ÖZEL HEDEF/);
});
test('BEP sunumları DOCX içinde korunur; görsel profil gerçek büyük punto ve aralık kullanır',async()=>{
 for (const profile of ['reading','writing','attention','cognitive','visual']) {
  const questions=produce('sociology',[all[0]],'bep',profile), xml=await xmlFor(questions,'student',profile);
  for (const line of questions[0].text.split("\n")) assert.ok(xml.includes(escape(line)));
  assert.match(xml, /<w:br\/>/);
  if(profile==='visual'){assert.match(xml,/w:sz w:val="32"/);assert.match(xml,/w:line="360"/);}
 }
});
test('geçersiz ünite, çıktı, sürüm ve ordinal üretim yapmaz',()=>{
 const valid={unitCode:all[0].unitCode,outcomeCode:all[0].code,ordinal:0,kind:'text',level:'analyze',points:100,datasetVersion:'2026.1',mode:'standard',profile:'reading'};
 for(const patch of [{unitCode:'SOS.12.1'},{outcomeCode:'FEL.10.1.1'},{datasetVersion:'2024'},{ordinal:-1},{ordinal:0.5},{mode:'bep',profile:'unknown'}]) assert.throws(()=>domain.generateSociologyExamContent({...valid,...patch}));
 assert.equal(domain.validSociologyExamTrace(valid.unitCode,valid.outcomeCode,'a',all[0].processComponents[0].description),true);
 assert.equal(domain.validSociologyExamTrace(valid.unitCode,valid.outcomeCode,'z','uydurma'),false);
});
test('tek çıktıda sekiz soru yinelenmez; türler ve düzeyler içerikte uygulanır',()=>{
 const questions=produce('sociology',[{...all[0],questionCount:8}]);
 assert.equal(new Set(questions.map(q=>q.text)).size,8);
 for(const kind of ['text','short','open','scenario']) for(const level of ['understand','apply','analyze','evaluate','create']) {
  const q=domain.generateSociologyExamContent({unitCode:all[0].unitCode,outcomeCode:all[0].code,ordinal:0,kind,level,points:100,datasetVersion:'2026.1',mode:'standard',profile:'reading'});
  assert.equal(Boolean(q.passage),kind==='text'); assert.ok(q.text.length>100);
 }
});
test('Felsefe gerçek üretici tüm ünitelerde mevcut metin ve cevapları korur',()=>{
 const philosophy=getCurriculumContext('philosophy');
 // Existing philosophy helpers and expected answer wording remain unchanged.
 const helpers=new Function(`${prefix};return {passageVariant,textQuestion,ordinaryQuestion,textSkills};`)();
 for(const unit of philosophy.units) for(const kind of ['text','short','open','scenario']) {
  const [q]=produce('philosophy',[{...unit.outcomes[0],unitCode:unit.code,questionKind:kind}]);
  assert.equal(q.passage,kind==='text'?helpers.passageVariant(unit,0):'');
  assert.equal(q.text,kind==='text'?helpers.textQuestion(unit,0):helpers.ordinaryQuestion(unit,0,kind,'analyze'));
  assert.equal(q.answer,kind==='text'?`Yanıt, soruda istenen okuma becerisini göstermeli; ${unit.keywords.slice(0,3).join(', ')} kavramlarından uygun olanları doğru kullanmalı ve çıkarımını metinden kanıtla desteklemelidir.`:`Yanıt ${unit.name} bağlamındaki kavramı doğru açıklamalı ve görüşünü gerekçelendirmelidir.`);
  assert.equal(q.componentStep,undefined);assert.equal(q.points,100);
 }
});

test('gerçek ekleme, tür/düzey düzenleme, puan dengeleme ve B kitapçığı bileşen bağını korur',()=>{
 const functions=stripTypeScriptTypes(source.slice(source.indexOf('  function update('),source.indexOf('  async function persistExamRecord(')));
 let questions=produce('sociology',[all[0]]),booklet='A';
 const setters={setQuestions(value){questions=typeof value==='function'?value(questions):value;},setBooklet(value){booklet=value;}};
 const controls=()=>new Function('scope','gradeUnits','shown','questions','booklet','setQuestions','setBooklet','invalidateApproval','createId','subjectCode','datasetVersion','mode','bep','generateSociologyExamContent',`${prefix}\n${functions};return {add,update,balance,makeB};`)([all[0]],sociology.units,questions.filter(q=>q.booklet===booklet),questions,booklet,setters.setQuestions,setters.setBooklet,()=>{},()=>crypto.randomUUID(),'sociology','2026.1','bep','writing',domain.generateSociologyExamContent);
 controls().add();assert.equal(questions.length,2);assert.equal(questions[1].componentStep,'b');assert.match(questions[1].text,/sözlü/);
 controls().update(questions[0].id,{kind:'scenario',level:'create'});assert.equal(questions[0].passage,'');assert.match(questions[0].text,/araştırma sorusu/);assert.equal(questions[0].componentStep,'a');
 controls().balance();assert.equal(questions.reduce((n,q)=>n+q.points,0),100);
 controls().makeB();assert.equal(booklet,'B');
 const a=questions.filter(q=>q.booklet==='A'),b=questions.filter(q=>q.booklet==='B').reverse();
 const withoutId=q=>{const copy={...q};delete copy.id;return copy;};
 assert.deepEqual(a.map(withoutId),b.map(q=>({...withoutId(q),booklet:'A'})));
});
test('Felsefe öğrenci ve öğretmen DOCX gerçek üretici içeriğini korur',async()=>{
 const context=getCurriculumContext('philosophy');const unit=context.units[0];
 const questions=produce('philosophy',[{...unit.outcomes[0],unitCode:unit.code}]);
 for(const audience of ['student','teacher']) {
  const artifact=await buildExamPackageArtifact({school:'Test',academicYear:'2026-2027',grade:10,subjectName:'Felsefe',examName:'1. Dönem 1. Sınav',booklet:'A',durationMinutes:40,mode:'standard',questions:mapQuestions(questions)},audience);
  const dir=mkdtempSync(join(tmpdir(),'philosophy-exam-'));
  try {const path=join(dir,'exam.docx');writeFileSync(path,Buffer.from(await artifact.blob.arrayBuffer()));const xml=execFileSync('unzip',['-p',path,'word/document.xml'],{encoding:'utf8'});assert.ok(xml.includes(escape(questions[0].text)));for(const line of questions[0].passage.split("\n").filter(Boolean))assert.ok(xml.includes(escape(line)));assert.doesNotMatch(xml,/SOS\.11|SOS\.12/);if(audience==='teacher')assert.ok(xml.includes(escape(questions[0].answer)));else assert.doesNotMatch(xml,/CEVAP ANAHTARI/);} finally {rmSync(dir,{recursive:true,force:true});}
 }
});

function editingSession(outcome, count, mode = 'standard', profile = 'reading') {
 const functions=stripTypeScriptTypes(source.slice(source.indexOf('  function update('),source.indexOf('  async function persistExamRecord(')));
 let questions=produce('sociology',[{...outcome,questionCount:count}],mode,profile),booklet='A';
 const controls=()=>new Function('scope','gradeUnits','shown','questions','booklet','setQuestions','setBooklet','invalidateApproval','createId','subjectCode','datasetVersion','mode','bep','generateSociologyExamContent',`${prefix}\n${functions};return {add,update,remove,move,balance,makeB};`)([outcome],sociology.units,questions.filter(q=>q.booklet===booklet),questions,booklet,value=>{questions=typeof value==='function'?value(questions):value;},value=>{booklet=value;},()=>{},()=>crypto.randomUUID(),'sociology','2026.1',mode,profile,domain.generateSociologyExamContent);
 return {controls,get questions(){return questions;}};
}
const twoComponentOutcome=all.find(o=>o.processComponents.length===2);
const uniqueQuestions=qs=>new Set(qs.map(q=>`${q.passage}|${q.text}`)).size;
test('P2: tüm çıktılarda 17–20 aynı tür/düzey soru tekrarsız üretilir',()=>{
 for(const outcome of all) for(const count of [17,18,19,20]) for(const kind of ['text','short','open','scenario']) {
  const qs=produce('sociology',[{...outcome,questionCount:count,questionKind:kind}]);
  assert.equal(uniqueQuestions(qs),count,`${outcome.code}/${kind}/${count}`);
  assert.equal(qs.reduce((sum,q)=>sum+q.points,0),100);
 }
});
test('P2: tür ve düzey gidiş-dönüşü tam varyantı ve BEP sunumunu korur',()=>{
 for(const mode of ['standard','bep']) for(const ordinal of [2,16,19]) {
  const session=editingSession(twoComponentOutcome,20,mode,'writing');
  const original={...session.questions[ordinal]};
  session.controls().update(original.id,{kind:'scenario'});
  session.controls().update(original.id,{kind:original.kind});
  assert.deepEqual(session.questions[ordinal],original,`${mode}/${ordinal}/kind`);
  session.controls().update(original.id,{level:'create'});
  session.controls().update(original.id,{level:original.level});
  assert.deepEqual(session.questions[ordinal],original,`${mode}/${ordinal}/level`);
  assert.equal(uniqueQuestions(session.questions),20);
 }
});
test('P2: aradan silme → ekleme → dengeleme → B kitapçığı ve DOCX tekrar üretmez',async()=>{
 for(const count of [3,20]) {
 const session=editingSession(twoComponentOutcome,count);
 const retained=session.questions.filter((_,i)=>i!==1);
 session.controls().remove(session.questions[1].id);
 session.controls().add();
 assert.equal(uniqueQuestions(session.questions),count);
 const added=session.questions.at(-1);
 session.controls().update(added.id,{level:'analyze'});
 session.controls().balance();
 assert.equal(uniqueQuestions(session.questions),count);
 assert.equal(new Set(session.questions.map(q=>q.contentOrdinal)).size,count);
 for(const q of retained) assert.equal(session.questions.find(x=>x.id===q.id).text,q.text);
 session.controls().makeB();
 const b=session.questions.filter(q=>q.booklet==='B');
 assert.equal(uniqueQuestions(b),count);assert.equal(b.reduce((sum,q)=>sum+q.points,0),100);
 for(const audience of ['student','teacher']) {
  const xml=await xmlFor(b,audience);
  for(const q of b) for(const line of q.text.split('\n')) assert.ok(xml.includes(escape(line)));
 }
 }
});

test('P2 sınırları: BEP 20 soruda, tekrarlı sil/ekle ve kapasite aşımı güvenlidir',()=>{
 for(const profile of ['reading','writing','attention','cognitive','visual']) {
  const qs=produce('sociology',[{...twoComponentOutcome,questionCount:20}],'bep',profile);
  assert.equal(uniqueQuestions(qs),20,profile);
 }
 const session=editingSession(twoComponentOutcome,20);
 for(let i=0;i<25;i++) {
  session.controls().remove(session.questions[i%session.questions.length].id);
  session.controls().add();
  session.controls().update(session.questions.at(-1).id,{level:'analyze'});
  assert.equal(uniqueQuestions(session.questions),20,`cycle ${i}`);
 }
 const capacity=twoComponentOutcome.processComponents.length*20;
 const qs=produce('sociology',[{...twoComponentOutcome,questionCount:capacity}]);
 assert.equal(uniqueQuestions(qs),capacity);
 assert.throws(()=>produce('sociology',[{...twoComponentOutcome,questionCount:capacity+1}]),/kapasitesi aşıldı/);
});

test('P2: B kitapçığından mod/profil/kapsam değişimi temizler ve yeniden üretim A kitapçığını gösterir',()=>{
 const handlers=[...source.matchAll(/on(?:Click|Change)=\{\((?:e)?\) => \{([\s\S]*?)\}\}/g)].map(match=>match[1]).filter(handler=>handler.includes('setQuestions([])'));
 assert.equal(handlers.length,5);
 const gradeHandler=source.slice(source.indexOf('  function changeGrade('),source.indexOf('  function generate()'));
 for(const subject of ['sociology','philosophy']) {
  const context=getCurriculumContext(subject),unit=context.units.find(u=>u.grade===11),outcome={...unit.outcomes[0],unitCode:unit.code};
  for(const handler of [...handlers,`${gradeHandler};changeGrade(11);`]) {
   let booklet='B',questions=[{booklet:'B'}],invalidated=false;
   const bindings={mode:handler.includes('setMode("standard")')?"bep":"standard",units:context.units,e:{target:{value:'writing',selectedOptions:[{value:outcome.code}]}},setMode(){},setBep(){},setGrade(){},setSelectedUnits(){},setSelectedOutcomes(){},setBlueprintCounts(){},setBlueprintKinds(){},setBlueprintLevels(){},setBepPlanConfirmed(){},setQuestions(value){questions=value;},setBooklet(value){booklet=value;},invalidateApproval(){invalidated=true;}};
   new Function(...Object.keys(bindings),stripTypeScriptTypes(`function runHandler(){${handler}};runHandler();`))(...Object.values(bindings));
   assert.deepEqual(questions,[]);assert.equal(booklet,'A');assert.equal(invalidated,true);
   const generated=produce(subject,[outcome],'standard','reading',value=>{booklet=value;});
   const shown=generated.filter(q=>q.booklet===booklet);
   assert.equal(shown.length,1);assert.equal(shown.reduce((sum,q)=>sum+q.points,0),100);
  }
  let booklet='B';const generated=produce(subject,[outcome],'standard','reading',value=>{booklet=value;});
  assert.equal(booklet,'A');assert.equal(generated.filter(q=>q.booklet===booklet).length,1);
 }
});

test('P2: zaten seçili standart/BEP düğmesi soruları, kitapçığı ve onayı korur',()=>{
 const handlers=[...source.matchAll(/onClick=\{\(\) => \{([\s\S]*?)\}\}/g)].map(m=>m[1]).filter(h=>h.includes('setMode('));
 assert.equal(handlers.length,2);
 for(const handler of handlers) {
  const mode=handler.includes('setMode("standard")')?'standard':'bep';
  const questions=[{booklet:'B',text:'Öğretmenin elle düzenlediği soru'}];let calls=0;
  const bindings={mode,setMode(){calls++;},setQuestions(){calls++;},setBooklet(){calls++;},setBepPlanConfirmed(){calls++;},invalidateApproval(){calls++;}};
  new Function(...Object.keys(bindings),stripTypeScriptTypes(`function runHandler(){${handler}};runHandler();`))(...Object.values(bindings));
  assert.equal(calls,0,mode);assert.equal(questions[0].text,'Öğretmenin elle düzenlediği soru');
 }
});
test('P2: cevaplar hem süreç bileşeni hem varyant görevi için ayrı beklenen kanıt içerir',()=>{
 for(const outcome of all) {
  const qs=produce('sociology',[{...outcome,questionCount:20}]);
  assert.equal(new Set(qs.map(q=>q.answer)).size,20,outcome.code);
  const counter=qs[outcome.processComponents.length];
  assert.match(counter.answer,/Karşı örnek/u,outcome.code);
  assert.match(counter.criterion,/Varyant/u,outcome.code);
  const alternative=qs[outcome.processComponents.length*2];
  assert.match(alternative.answer,/Alternatif açıklama/u,outcome.code);
  assert.match(alternative.answer,/Sınama/u,outcome.code);
 }
});
test('P2: farklı görevlerin beklenen cevapları öğretmen DOCX içinde korunur',async()=>{
 const qs=produce('sociology',[{...twoComponentOutcome,questionCount:20}]);
 const xml=await xmlFor(qs,'teacher');
 assert.equal(new Set(qs.map(q=>q.answer)).size,20);
 for(const q of qs) for(const line of q.answer.split('\n')) assert.ok(xml.includes(escape(line)));
});

test('beklenen cevaplar bileşenin somut kanıtını ve varyantın karşı örnek/sınama içeriğini verir',()=>{
 const cases=[['SOS.11.1.1',0,/Comte.*Durkheim/],['SOS.11.1.3',1,/Anket ve görüşme.*sistemli veri/],['SOS.11.4.1',0,/evlilik türünü sınıflandıracak bilgi yoktur/],['SOS.11.4.4',3,/Kamu ulaşım desteği/],['SOS.11.3.3',3,/Karşı örnek: Diploma aldığı hâlde meslek konumu değişmeyen/],['SOS.12.2.1',6,/Alternatif açıklama: Konut arzı ve gelir.*Sınama: Mahallelere ve dönemlere/]];
 for(const [code,ordinal,expected] of cases) {
  const outcome=all.find(o=>o.code===code);
  const qs=produce('sociology',[{...outcome,questionCount:ordinal+1}]);
  assert.match(qs[ordinal].answer,expected);
 }
 for(const outcome of all) {
  const qs=produce('sociology',[{...outcome,questionCount:outcome.processComponents.length}]);
  const componentEvidence=qs.map(q=>q.answer.split('\n')[0].replace(/^Bileşen .+? için örnek yanıt: /,''));
  assert.equal(new Set(componentEvidence).size,outcome.processComponents.length,outcome.code);
  assert.ok(componentEvidence.every(answer=>answer.length>50&&!outcome.processComponents.some(c=>c.description===answer)));
 }
});

test('P2: BEP profil değişimi eski doğrulamayı iptal eder ve yeni onay gerektirir',()=>{
 const handler=[...source.matchAll(/onChange=\{\(e\) => \{([\s\S]*?)\}\}/g)].map(m=>m[1]).find(h=>h.includes('setBep(e.target.value'));
 assert.ok(handler);
 const readiness=source.slice(source.indexOf('  const bepReady ='),source.indexOf('  const bepReady =')+250).match(/const bepReady =([\s\S]*?);/)[1];
 for(const profile of ['reading','writing','attention','cognitive','visual']) {
  let bepPlanConfirmed=true,questions=[{booklet:'B'}],booklet='B',bep='previous',invalidated=false;
  const bindings={e:{target:{value:profile}},setBep(value){bep=value;},setQuestions(value){questions=value;},setBooklet(value){booklet=value;},setBepPlanConfirmed(value){bepPlanConfirmed=value;},invalidateApproval(){invalidated=true;}};
  new Function(...Object.keys(bindings),stripTypeScriptTypes(`function runHandler(){${handler}};runHandler();`))(...Object.values(bindings));
  assert.equal(bep,profile);assert.equal(bepPlanConfirmed,false);assert.deepEqual(questions,[]);assert.equal(booklet,'A');assert.equal(invalidated,true);
  const ready=new Function('mode','bepGoals','bepPlanConfirmed',`return (${readiness});`);
  assert.equal(ready('bep','Hedef mevcut',bepPlanConfirmed),false);
  const regenerated=produce('sociology',[all[0]],'bep',profile);
  assert.equal(regenerated.length,1);assert.equal(ready('bep','Hedef mevcut',bepPlanConfirmed),false);
  assert.equal(ready('bep','Hedef mevcut',true),true);
  assert.equal(ready('standard','',false),true);
 }
});

test('P2: öğretmen DOCX cevap bölümleri gerçek Word satır sonlarıyla ayrılır',async()=>{
 const qs=produce('sociology',[all[0]]);
 const teacher=await xmlFor(qs,'teacher');
 const key=teacher.slice(teacher.indexOf('CEVAP ANAHTARI VE DERECELİ PUANLAMA ANAHTARI'));
 const paragraphs=[...key.matchAll(/<w:p(?:\s[^>]*)?>[\s\S]*?<\/w:p>/g)].map(m=>m[0]);
 const lines=qs[0].answer.split('\n');
 assert.equal(lines.length,3);
 const answerParagraph=paragraphs.find(p=>p.includes(escape(lines[0])));
 assert.ok(answerParagraph);
 assert.equal([...answerParagraph.matchAll(/<w:br\s*\/>/g)].length,lines.length-1);
 for(const line of lines) assert.ok(answerParagraph.includes(escape(line)));
 assert.doesNotMatch(answerParagraph,/<w:t[^>]*>[^<]*\n[^<]*<\/w:t>/);
 const student=await xmlFor(qs,'student');
 for(const line of lines) assert.ok(!student.includes(escape(line)));
});

test('P2: senaryo/vaka türü açık uçludan ayrı görev, cevap ve puanlama üretir',()=>{
 for(const outcome of all) for(const mode of ['standard','bep']) {
  const [open]=produce('sociology',[{...outcome,questionKind:'open'}],mode,'writing');
  const [scenario]=produce('sociology',[{...outcome,questionKind:'scenario'}],mode,'writing');
  assert.notEqual(scenario.text,open.text,outcome.code);assert.notEqual(scenario.answer,open.answer,outcome.code);assert.notEqual(scenario.criterion,open.criterion,outcome.code);
  assert.match(scenario.text,/Vaka görevi:.*kanıt.*öneri/u);assert.match(scenario.answer,/Vaka değerlendirmesi:/u);assert.match(scenario.answer,/Öneri ve olası etkileri:/u);assert.match(scenario.criterion,/Vaka görevi/u);
  assert.equal(scenario.outcomeCode,open.outcomeCode);assert.equal(scenario.componentStep,open.componentStep);assert.equal(scenario.level,open.level);assert.equal(scenario.points,100);
 }
});
test('P2: gerçek editör açık uçlu → senaryo → açık uçlu geçişinde görevi ve cevabı eşler',()=>{
 const session=editingSession(twoComponentOutcome,3);
 const id=session.questions[2].id;
 session.controls().update(id,{kind:'open'});const open={...session.questions[2]};
 session.controls().update(id,{kind:'scenario'});const scenario={...session.questions[2]};
 assert.notEqual(scenario.text,open.text);assert.notEqual(scenario.answer,open.answer);assert.equal(scenario.contentOrdinal,open.contentOrdinal);
 session.controls().update(id,{kind:'open'});assert.deepEqual(session.questions[2],open);
});
test('P2: senaryo görevi öğrenci DOCX, karşılığı öğretmen DOCX içinde korunur',async()=>{
 const qs=produce('sociology',[{...twoComponentOutcome,questionKind:'scenario'}]);
 const student=await xmlFor(qs,'student'),teacher=await xmlFor(qs,'teacher');
 for(const xml of [student,teacher]) for(const line of qs[0].text.split('\n')) assert.ok(xml.includes(escape(line)));
 assert.match(student,/Vaka görevi:/u);
 assert.match(teacher,/Vaka değerlendirmesi:/u);assert.match(teacher,/Öneri ve olası etkileri:/u);
 for(const line of qs[0].answer.split('\n')) assert.ok(teacher.includes(escape(line)));
 assert.doesNotMatch(student,/Vaka değerlendirmesi:|Öneri ve olası etkileri:/u);
});

test('senaryo görevi beş bilişsel düzeyi ve beş BEP sunumunu korur',()=>{
 const tasks={understand:/durumu açıklayınız/,apply:/kavramı uygulayınız/,analyze:/neden ve sonuçlarıyla çözümleyiniz/,evaluate:/güçlü yönünü, sınırını/,create:/veri toplama yolunu tasarlayınız/};
 for(const [level,expected] of Object.entries(tasks)) for(const profile of ['reading','writing','attention','cognitive','visual']) {
  const [q]=produce('sociology',[{...twoComponentOutcome,questionKind:'scenario',cognitiveLevel:level}],'bep',profile);
  assert.equal(q.level,level);assert.match(q.text,expected);assert.match(q.answer,/Vaka değerlendirmesi:/);assert.match(q.criterion,/Vaka görevi:/);
  assert.equal(q.componentStep,twoComponentOutcome.processComponents[0].step);assert.equal(q.points,100);
  if(profile==='visual')assert.equal(q.fontSize,32);
 }
});
