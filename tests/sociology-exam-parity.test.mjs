import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import test from 'node:test';
import { getCurriculumContext } from '../app/data/curriculum-runtime.ts';
import { resolveExamContentEngine, activeExamContentEngine } from '../app/modules/exam-builder/exam-content-engine.ts';
const source = readFileSync(new URL('../app/modules/exam-builder/ExamBuilder.tsx', import.meta.url), 'utf8');
const prefix = stripTypeScriptTypes(source.slice(0, source.indexOf('export default function')).replace(/import[\s\S]*?from\s+"[^"]+";/g, ''));
const body = stripTypeScriptTypes(source.slice(source.indexOf('  function generate()'), source.indexOf('  function update(')));
const { variantBudgetOf } = new Function(`${prefix}; return {variantBudgetOf};`)();
// Ölçüm testi için: yapay havuz sınırı (bütçe kapısı) kaldırılır; gerçek sınırı üretici koyar.
let poolOverride = null;
function engineFor(subjectCode, outcomeCodes = null) {
 const engine = outcomeCodes ? activeExamContentEngine(subjectCode, '2026.1', outcomeCodes) : resolveExamContentEngine(subjectCode);
 return engine && poolOverride !== null ? { ...engine, variantPool: poolOverride } : engine;
}
const sociologyPool = resolveExamContentEngine('sociology').variantPool;
let domain = {};
try { domain = await import('../app/modules/exam-builder/sociology-exam-content-2026.ts'); } catch (error) { if (error.code !== 'ERR_MODULE_NOT_FOUND') throw error; }
function produce(subjectCode, outcomes, mode = 'standard', bep = 'reading', setBooklet = () => {}, variantRound = 0) {
 const context = getCurriculumContext(subjectCode);
 let result;
 const scope = outcomes;
 const blueprintRows = outcomes.map(o => ({...o, questionCount: o.questionCount ?? 1, questionKind: o.questionKind ?? 'text', cognitiveLevel: o.cognitiveLevel ?? 'analyze'}));
 const count = blueprintRows.reduce((n,o) => n + o.questionCount, 0);
 const run = new Function('scope','blueprintValid','blueprintTotal','count','blueprintRows','textRatio','gradeUnits','kind','setQuestions','invalidateApproval','window','resultsRef','createId','subjectCode','datasetVersion','mode','bep', 'engine', 'setBooklet', 'variantRound','setVariantRound', `${prefix}\n${body}\ngenerate();`);
 run(scope,true,count,count,blueprintRows,75,context.units,'open',q=>result=q,()=>{}, {setTimeout(){}},{current:null},()=>crypto.randomUUID(),subjectCode,context.datasetVersion,mode,bep,engineFor(subjectCode,outcomes.map(o=>o.code)),setBooklet,variantRound,()=>{});
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
  // İçeriği doğrulanmış çıktılar (şu an FEL.10.3.1) bilinçli olarak üretici akışına geçti; kalanlar şablon akışında aynen korunur.
  if (activeExamContentEngine('philosophy', philosophy.datasetVersion, [unit.outcomes[0].code])) { assert.equal(q.contentOrdinal,0); assert.equal(q.componentStep,unit.outcomes[0].processComponents[0].step); continue; }
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
 const controls=()=>new Function('scope','gradeUnits','shown','questions','booklet','setQuestions','setBooklet','invalidateApproval','createId','subjectCode','datasetVersion','mode','bep','engine','setOperationMessage','operationErrorMessage',`${prefix}\n${functions};return {add,update,balance,makeB};`)([all[0]],sociology.units,questions.filter(q=>q.booklet===booklet),questions,booklet,setters.setQuestions,setters.setBooklet,()=>{},()=>crypto.randomUUID(),'sociology','2026.1','bep','writing',engineFor('sociology'),()=>{},(error,fallback)=>String(error?.message??fallback));
 controls().add();assert.equal(questions.length,2);assert.equal(questions[1].componentStep,'b');assert.match(questions[1].text,/sözlü/);
 controls().update(questions[0].id,{kind:'scenario',level:'create'});assert.equal(questions[0].passage,'');assert.match(questions[0].text,/araştırma sorusu/);assert.equal(questions[0].componentStep,'a');
 controls().balance();assert.equal(questions.reduce((n,q)=>n+q.points,0),100);
 controls().makeB();assert.equal(booklet,'B');
 const a=questions.filter(q=>q.booklet==='A'),b=questions.filter(q=>q.booklet==='B').reverse();
 assert.deepEqual(b.map(q=>q.sourceQuestionId),a.map(q=>q.id));
 for(const [i,q] of b.entries()){const src=a[i];for(const field of ['unitCode','outcomeCode','componentStep','componentDescription','kind','level','points'])assert.equal(q[field],src[field],field);assert.notEqual(q.contentOrdinal,src.contentOrdinal);assert.notEqual(q.text,src.text);}
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

function editingSession(outcome, count, mode = 'standard', profile = 'reading', subjectCode = 'sociology', variantRound = 0) {
 const functions=stripTypeScriptTypes(source.slice(source.indexOf('  function update('),source.indexOf('  async function persistExamRecord(')));
 let questions=produce(subjectCode,[{...outcome,questionCount:count}],mode,profile,()=>{},variantRound),booklet='A',operationMessage='';
 const controls=()=>new Function('scope','gradeUnits','shown','questions','booklet','setQuestions','setBooklet','invalidateApproval','createId','subjectCode','datasetVersion','mode','bep','engine','setOperationMessage','operationErrorMessage',`${prefix}\n${functions};return {add,update,remove,move,balance,makeB};`)([outcome],getCurriculumContext(subjectCode).units,questions.filter(q=>q.booklet===booklet),questions,booklet,value=>{questions=typeof value==='function'?value(questions):value;},value=>{booklet=value;},()=>{},()=>crypto.randomUUID(),subjectCode,getCurriculumContext(subjectCode).datasetVersion,mode,profile,engineFor(subjectCode,[outcome.code]),message=>{operationMessage=message;},(error,fallback)=>String(error?.message??fallback));
 return {controls, selectBooklet(value){booklet=value;}, get questions(){return questions;}, set questions(value){questions=value;}, get operationMessage(){return operationMessage;}};
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
   const bindings={mode:handler.includes('setMode("standard")')?"bep":"standard",units:context.units,e:{target:{value:'writing',selectedOptions:[{value:outcome.code}]}},setMode(){},setBep(){},setGrade(){},setSelectedUnits(){},setSelectedOutcomes(){},setBlueprintCounts(){},setBlueprintKinds(){},setBlueprintLevels(){},setVariantRound(){},setBepPlanConfirmed(){},setQuestions(value){questions=value;},setBooklet(value){booklet=value;},invalidateApproval(){invalidated=true;}};
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

function bookletReadiness(questions, booklet = 'B') {
 const readiness = stripTypeScriptTypes(source.slice(source.indexOf('  const duplicateCount ='), source.indexOf('  const exportReady =')));
 const shown = questions.filter(q => q.booklet === booklet);
 return new Function('shown','questions','availableOutcomes','subjectCode','engine','total','mode','bepGoals','bepPlanConfirmed', `${prefix}\n${readiness}; return {bookletEquivalent, structuralReady};`)(shown, questions, all, 'sociology', engineFor('sociology'), shown.reduce((n,q)=>n+q.points,0), 'standard', '', false);
}
test('P2: B kitapçığında tür değişimi eşdeğerliği ve yapısal onayı engeller; geri dönüş düzeltir', () => {
 for (const mode of ['standard','bep']) {
  const session = editingSession({...twoComponentOutcome, questionKind:'open'}, 3, mode);
  session.controls().makeB();
  assert.deepEqual(bookletReadiness(session.questions), {bookletEquivalent:true, structuralReady:true});
  const question = session.questions.find(q=>q.booklet==='B');
  session.controls().update(question.id, {kind:'scenario'});
  assert.deepEqual(bookletReadiness(session.questions), {bookletEquivalent:false, structuralReady:false});
  session.controls().update(question.id, {kind:question.kind});
  assert.deepEqual(bookletReadiness(session.questions), {bookletEquivalent:true, structuralReady:true});
 }
});
test('Felsefe: aynı türde ters sıralı A/B eşdeğerdir; farklı türde eşdeğer değildir', () => {
 const context = getCurriculumContext('philosophy');
 const outcome = {...context.units[0].outcomes[0], unitCode:context.units[0].code, questionCount:3, questionKind:'open'};
 const a = produce('philosophy', [outcome]);
 const b = [...a].reverse().map(q=>({...q,id:crypto.randomUUID(),sourceQuestionId:q.id,booklet:'B'}));
 assert.equal(bookletReadiness([...a,...b]).bookletEquivalent,true);
 b[0] = {...b[0],kind:'scenario'};
 assert.equal(bookletReadiness([...a,...b]).bookletEquivalent,false);
});

test('P2: B puan dengeleme ters sırada A/B soru–puan eşleşmesini korur', () => {
 for(const mode of ['standard','bep']) for(const count of [3,6,17,20]) {
  const session=editingSession({...twoComponentOutcome,questionKind:'open'},count,mode);
  session.controls().makeB();
  const before=session.questions.map(q=>({...q}));
  session.controls().balance();
  assert.deepEqual(session.questions,before,`${mode}/${count}`);
  assert.deepEqual(bookletReadiness(session.questions),{bookletEquivalent:true,structuralReady:true});
  const b=session.questions.find(q=>q.booklet==='B');
  session.controls().update(b.id,{points:1});
  session.controls().balance();
  assert.deepEqual(session.questions,before);
 }
});
test('Felsefe: B dengeleme karşılık gelen A puanlarını korur ve DOCX aynı puanları taşır',async()=>{
 const context=getCurriculumContext('philosophy');
 const outcome={...context.units[0].outcomes[0],unitCode:context.units[0].code,questionKind:'open'};
 const session=editingSession(outcome,3,'standard','reading','philosophy');
 session.controls().makeB();
 const before=session.questions.map(q=>({...q}));
 session.controls().balance();
 assert.deepEqual(session.questions,before);
 assert.equal(bookletReadiness(session.questions).bookletEquivalent,true);
 const b=session.questions.filter(q=>q.booklet==='B');
 const xml=await xmlFor(b,'student');
 for(const q of b)assert.ok(xml.includes(escape(`${q.points} puan`)));
});
test('P2: B dengeleme farklı soru türünü eşdeğer saymaz',()=>{
 const session=editingSession({...twoComponentOutcome,questionKind:'open'},3);
 session.controls().makeB();
 session.controls().update(session.questions.find(q=>q.booklet==='B').id,{kind:'scenario'});
 session.controls().balance();
 assert.deepEqual(bookletReadiness(session.questions),{bookletEquivalent:false,structuralReady:false});
});

for(const subject of ['sociology','philosophy']) test(`${subject}: sabit A/B bağlantısı düzenleme ve dengeleme boyunca korunur`,async()=>{
 const context=getCurriculumContext(subject);
 const outcome=subject==='sociology'?twoComponentOutcome:{...context.units[0].outcomes[0],unitCode:context.units[0].code};
 for(const mode of ['standard','bep']) for(const field of ['text','passage','answer','criterion']) {
  const session=editingSession({...outcome,questionKind:'open'},3,mode,'reading',subject);
  session.controls().makeB();
  const target=session.questions.find(q=>q.booklet==='B');
  const originalA=session.questions.find(q=>q.id===target.sourceQuestionId);
  assert.ok(originalA);
  session.controls().update(target.id,{[field]:'Öğretmen düzenlemesi'});
  session.controls().move(target.id,1);
  session.controls().update(target.id,{points:1});
  session.controls().balance();
  const changed=session.questions.find(q=>q.id===target.id);
  assert.equal(changed[field],'Öğretmen düzenlemesi');
  assert.equal(changed.points,originalA.points);
  assert.equal(bookletReadiness(session.questions).bookletEquivalent,true);
  session.selectBooklet('A');
  session.controls().move(originalA.id,1);
  session.controls().balance();
  for(const b of session.questions.filter(q=>q.booklet==='B'))assert.equal(b.points,session.questions.find(a=>a.id===b.sourceQuestionId).points);
  assert.equal(bookletReadiness(session.questions).bookletEquivalent,true);
  if(mode==='standard'&&field==='text')for(const audience of ['student','teacher']) {
   const xml=await xmlFor(session.questions.filter(q=>q.booklet==='B'),audience);
   assert.ok(xml.includes('Öğretmen düzenlemesi'));
   assert.doesNotMatch(xml,/sourceQuestionId/);
  }
 }
});
for(const subject of ['sociology','philosophy']) test(`${subject}: silme/ekleme ve tür/düzey değişimleri eşdeğerliği gizlemez; B yeniden kurulur`,()=>{
 const context=getCurriculumContext(subject);
 const outcome=subject==='sociology'?twoComponentOutcome:{...context.units[0].outcomes[0],unitCode:context.units[0].code};
 for(const active of ['A','B']) for(const action of ['kind','level','remove-add']) {
  const session=editingSession({...outcome,questionKind:'open'},3,'standard','reading',subject);
  session.controls().makeB();session.selectBooklet(active);
  const target=session.questions.find(q=>q.booklet===active);
  if(action==='remove-add'){session.controls().remove(target.id);session.controls().add();}
  else session.controls().update(target.id,{[action]:action==='kind'?'scenario':'create'});
  session.controls().balance();
  assert.equal(bookletReadiness(session.questions).bookletEquivalent,false,`${active}/${action}`);
  session.controls().makeB();
  assert.equal(bookletReadiness(session.questions).bookletEquivalent,true,`${active}/${action}/rebuild`);
  const b=session.questions.filter(q=>q.booklet==='B');
  assert.equal(new Set(b.map(q=>q.sourceQuestionId)).size,b.length);
  const invalid=b.map((q,i)=>i===0?{...q,sourceQuestionId:b[1].sourceQuestionId}:q);
  assert.equal(bookletReadiness([...session.questions.filter(q=>q.booklet==='A'),...invalid]).bookletEquivalent,false);
  assert.equal(bookletReadiness(session.questions.map(q=>q.booklet==='B'?{...q,sourceQuestionId:undefined}:q)).bookletEquivalent,false);
 }
});

// Kalıcı ilke: B kitapçığında aynı çıktı, bileşen, tür, düzey ve puan korunur; sorular A'nın kopyası değil paralel varyanttır.
test('P2: Sosyoloji B kitapçığı tüm çıktılarda paralel formdur (aynı çıktı/bileşen/tür/düzey/puan, farklı varyant)',()=>{
 for(const outcome of all) for(const count of [outcome.processComponents.length,10,20]) for(const mode of ['standard','bep']) {
  const session=editingSession({...outcome,questionKind:'open'},count,mode);
  session.controls().makeB();
  const a=session.questions.filter(q=>q.booklet==='A'),b=session.questions.filter(q=>q.booklet==='B');
  assert.equal(b.length,a.length,`${outcome.code}/${count}`);
  const aOrdinals=new Set(a.map(q=>q.contentOrdinal)),aTexts=new Set(a.map(q=>`${q.passage}|${q.text}`));
  for(const q of b){
   const src=a.find(x=>x.id===q.sourceQuestionId);assert.ok(src,`${outcome.code}/${count}`);
   for(const field of ['unitCode','outcomeCode','componentStep','componentDescription','kind','level','points'])assert.equal(q[field],src[field],`${outcome.code}/${count}/${field}`);
   assert.ok(!aOrdinals.has(q.contentOrdinal),`${outcome.code}/${count}: B varyantı A'da kullanılmış`);
   assert.ok(!aTexts.has(`${q.passage}|${q.text}`),`${outcome.code}/${count}: B sorusu A'nın tekrarı`);
  }
  assert.equal(uniqueQuestions(b),b.length);
  assert.equal(b.reduce((n,q)=>n+q.points,0),100);
  assert.deepEqual(bookletReadiness(session.questions),{bookletEquivalent:true,structuralReady:true},`${outcome.code}/${count}/${mode}`);
 }
});
test('P2: B yeniden kurulumu deterministiktir ve B varyantı A ile çakışırsa yapısal onay engellenir',()=>{
 const session=editingSession({...twoComponentOutcome,questionKind:'open'},3);
 session.controls().makeB();
 const first=session.questions.filter(q=>q.booklet==='B').map(q=>{const rest={...q};delete rest.id;return rest;});
 session.controls().makeB();
 assert.deepEqual(session.questions.filter(q=>q.booklet==='B').map(q=>{const rest={...q};delete rest.id;return rest;}),first);
 const a=session.questions.filter(q=>q.booklet==='A');
 const clash=session.questions.map(q=>q.booklet==='B'&&q.sourceQuestionId===a[0].id?{...q,contentOrdinal:a[0].contentOrdinal}:q);
 assert.equal(bookletReadiness(clash).structuralReady,false);
});
// B üretimi kapasite sınırına takılırsa öğretmen düğmeye bastığında hiçbir geri bildirim
// görmezdi: makeB doğrudan onClick'e bağlıydı ve atılan hata yakalanmıyordu.
test('P2: B kitapçığı üretilemezse öğretmene hata gösterilir ve durum bozulmaz',()=>{
 const outcome={...twoComponentOutcome,questionKind:'open'};
 // (1) Varyant numarası eksik soru: düğme patlamaz, mesaj gösterilir, sorular değişmez.
 const missing=editingSession(outcome,3);
 const beforeMissing=missing.questions.map(q=>({...q}));
 const stripped=missing.questions.map((q,i)=>{if(i)return q;const rest={...q};delete rest.contentOrdinal;return rest;});
 missing.questions=stripped;
 assert.doesNotThrow(()=>missing.controls().makeB());
 assert.match(missing.operationMessage,/varyant numarası eksik/);
 assert.equal(missing.questions.filter(q=>q.booklet==='B').length,0);
 assert.equal(missing.questions.length,beforeMissing.length);
 // (2) Kapasite aşımı: aynı çıktıya varyant numarası taşımayan ek sorular sığmıyor.
 const over=editingSession(outcome,40);
 const beforeOver=over.questions.length;
 assert.doesNotThrow(()=>over.controls().makeB());
 assert.match(over.operationMessage,/kapasite\w* aşıldı/);
 assert.equal(over.questions.filter(q=>q.booklet==='B').length,0);
 assert.equal(over.questions.length,beforeOver);
 // (3) Kapasite içindeyken hâlâ normal çalışır ve mesaj üretilmez.
 const fine=editingSession(outcome,6);
 fine.controls().makeB();
 assert.equal(fine.questions.filter(q=>q.booklet==='B').length,6);
 assert.equal(fine.operationMessage,'');
});

// "Sınavı oluştur" her basıldığında bir sonraki varyant bandına geçer; A ve B
// birlikte havuzu tükettiği için bütçe önceden hesaplanır ve tükenince açık hata verilir.
test('P3: Sınavı oluştur her basıldığında farklı varyantlar üretir',()=>{
 for(const outcome of all){
  const budget=variantBudgetOf([{...outcome,questionCount:4}], sociologyPool);
  assert.ok(budget>=1,`${outcome.code}: bütçe en az 1 olmalı`);
  const rounds=Math.min(budget,3);
  const seen=new Set();
  for(let round=0;round<rounds;round++){
   const questions=produce('sociology',[{...outcome,questionCount:4,questionKind:'open'}],'standard','reading',()=>{},round);
   assert.equal(questions.length,4,`${outcome.code}/${round}`);
   assert.equal(questions.reduce((n,q)=>n+q.points,0),100,`${outcome.code}/${round}`);
   assert.equal(uniqueQuestions(questions),4,`${outcome.code}/${round}: üretim içinde tekrar var`);
   // ordinal geçerli aralıkta ve bileşen korunuyor
   for(const q of questions)assert.ok(q.contentOrdinal>=0,`${outcome.code}/${round}`);
   seen.add(questions.map(q=>q.text).join('|'));
  }
  if(rounds>1)assert.equal(seen.size,rounds,`${outcome.code}: her basış farklı soru üretmeli`);
 }
});
test('P3: farklı üretimlerde de A/B paralel form ve eşdeğerlik korunur',()=>{
 for(const outcome of [all[0],all.find(o=>o.processComponents.length===2),all.find(o=>o.processComponents.length===5)]){
  for(const round of [1,2]){
   const session=editingSession({...outcome,questionKind:'open'},6,'standard','reading','sociology',round);
   session.controls().makeB();
   const a=session.questions.filter(q=>q.booklet==='A'),b=session.questions.filter(q=>q.booklet==='B');
   assert.equal(b.length,a.length,`${outcome.code}/${round}`);
   const aOrdinals=new Set(a.map(q=>q.contentOrdinal));
   for(const q of b){
    const src=a.find(x=>x.id===q.sourceQuestionId);
    assert.ok(src,`${outcome.code}/${round}`);
    for(const field of ['unitCode','outcomeCode','componentStep','componentDescription','kind','level','points'])assert.equal(q[field],src[field],`${outcome.code}/${round}/${field}`);
    assert.ok(!aOrdinals.has(q.contentOrdinal),`${outcome.code}/${round}: B A'nın varyantını tekrar ediyor`);
   }
   assert.deepEqual(bookletReadiness(session.questions),{bookletEquivalent:true,structuralReady:true},`${outcome.code}/${round}`);
  }
 }
});
test('P3: varyant bütçesi tükenince açık hata verilir, üretim durur',()=>{
 const outcome={...all.find(o=>o.processComponents.length===2),questionKind:'open'};
 const budget=variantBudgetOf([{...outcome,questionCount:6}], sociologyPool);
 assert.ok(budget>=1,'bütçe hesaplanabilmeli');
 assert.throws(()=>produce('sociology',[{...outcome,questionCount:6}],'standard','reading',()=>{},budget),/farklı varyant kalmadı/);
 // bütçe dolmadan üretim çalışır
 assert.doesNotThrow(()=>produce('sociology',[{...outcome,questionCount:6}],'standard','reading',()=>{},budget-1));
});
// Gerçek ölçüm: her turda üretim + B kitapçığı fiilen koşturulur; sonuç bütçe formülünden bağımsızdır.
// Kapı kaldırıldığı için tur sayısını üreticinin kendi kapasite hatası belirler.
function measuredRounds(outcome, questionCount, subjectCode = 'sociology') {
 const saved = poolOverride; poolOverride = 100000;
 try {
  let rounds = 0;
  for (let round = 0; round < 40; round++) {
   try {
    const session = editingSession({ ...outcome, questionKind: 'open' }, questionCount, 'standard', 'reading', subjectCode, round);
    session.controls().makeB();
    if (session.operationMessage) break;
    if (session.questions.filter(q => q.booklet === 'B').length !== questionCount) break;
    rounds++;
   } catch { break; }
  }
  return rounds;
 } finally { poolOverride = saved; }
}
test('P3: varyant bütçesi, A+B birlikte fiilen sığan tur sayısına eşittir (gerçek ölçüm)', () => {
 let checked = 0;
 for (const components of [...new Set(all.map(o => o.processComponents.length))]) {
  const outcome = all.find(o => o.processComponents.length === components);
  for (const questionCount of [4, 6, 10, 17, 20]) {
   const row = { questionCount, processComponents: outcome.processComponents };
   const measured = measuredRounds(outcome, questionCount);
   assert.equal(variantBudgetOf([row], sociologyPool), Math.max(1, measured), `L=${components}/n=${questionCount}`);
   checked++;
  }
 }
 assert.ok(checked >= 10, 'ölçüm en az on hücreyi kapsamalı');
});
test('P3: bütçenin izin verdiği her turda A ve B birlikte hatasız üretilir', () => {
 for (const components of [...new Set(all.map(o => o.processComponents.length))]) {
  const outcome = all.find(o => o.processComponents.length === components);
  for (const questionCount of [4, 10, 17, 20]) {
   const budget = variantBudgetOf([{ questionCount, processComponents: outcome.processComponents }], sociologyPool);
   for (let round = 0; round < budget; round++) {
    const session = editingSession({ ...outcome, questionKind: 'open' }, questionCount, 'standard', 'reading', 'sociology', round);
    session.controls().makeB();
    assert.equal(session.operationMessage, '', `L=${components}/n=${questionCount}/tur ${round}: ${session.operationMessage}`);
    assert.equal(session.questions.filter(q => q.booklet === 'B').length, questionCount, `L=${components}/n=${questionCount}/tur ${round}`);
   }
  }
 }
});
test('P3: bütçe uç durumları', () => {
 assert.equal(variantBudgetOf([{ questionCount: 0, processComponents: [1, 2] }], sociologyPool), 0, 'sorusuz çıktıda bütçe yok');
 assert.equal(variantBudgetOf([{ questionCount: 4 }], sociologyPool), 0, 'bileşensiz çıktıda bütçe yok');
});

// Ders-bağımsızlık sözleşmesi: Sınav Oluşturucu akışı derse özgü dallanma taşımaz; ders farkı yalnızca üretici kaydıyla ifade edilir.
test('P4: ExamBuilder derse özgü dallanma içermez; farklar üretici kaydındadır', () => {
 assert.doesNotMatch(source, /subjectCode\s*[!=]==?\s*["'](sociology|philosophy|psychology|logic)["']/, 'ExamBuilder içinde ders koduyla dallanma var');
 assert.doesNotMatch(source, /from\s+["'][^"']*sociology[^"']*["']/i, "ExamBuilder doğrudan bir derse özgü modülü içe aktarıyor");
});
test('P4: üretici kaydı sözleşmeyi sağlar; kapsanmayan seçim şablon akışında kalır', () => {
 const engine = resolveExamContentEngine('sociology');
 assert.ok(engine && Number.isInteger(engine.variantPool) && engine.variantPool > 0);
 for (const fn of ['generate', 'parallelOrdinal', 'validTrace', 'covers']) assert.equal(typeof engine[fn], 'function', fn);
 assert.equal(resolveExamContentEngine(' Sociology '), engine, 'ders kodu normalize edilir');
 for (const code of ['psychology', 'logic', '']) assert.equal(resolveExamContentEngine(code), null, code);
 // Felsefe üreticisi kayıtlı ama yalnız içeriği doğrulanmış çıktıları kapsar.
 const philosophy = getCurriculumContext('philosophy');
 const codes = philosophy.units.flatMap(u => u.outcomes.map(o => o.code));
 const covered = codes.filter(c => resolveExamContentEngine('philosophy').covers(c, philosophy.datasetVersion));
 assert.deepEqual(covered, ['FEL.10.3.1'], 'Kapsanan Felsefe çıktıları yalnız içeriği yazılmış olanlar olmalı');
 assert.equal(resolveExamContentEngine('philosophy').covers('FEL.10.3.1', '2024'), false, 'Veri sürümü uyuşmazsa kapsanmaz');
 assert.ok(activeExamContentEngine('philosophy', philosophy.datasetVersion, ['FEL.10.3.1']), 'Tamamen kapsanan seçim üretici akışına girer');
 assert.equal(activeExamContentEngine('philosophy', philosophy.datasetVersion, ['FEL.10.3.1', 'FEL.10.1.1']), null, 'Kısmen kapsanan seçim şablon akışında kalır');
 assert.equal(activeExamContentEngine('philosophy', philosophy.datasetVersion, []), null);
 assert.equal(activeExamContentEngine('psychology', '2026.1', ['PSI.10.1.1']), null);
 // Kapsanmayan Felsefe çıktısı mevcut şablon üretimini aynen korur: varyant alanı yok.
 const unit = philosophy.units.find(u => u.outcomes.some(o => o.code === 'FEL.10.1.1'));
 const questions = produce('philosophy', [{ ...unit.outcomes[0], unitCode: unit.code, questionCount: 4 }]);
 assert.equal(questions.length, 4);
 assert.ok(questions.every(q => q.contentOrdinal === undefined), 'Kapsanmayan Felsefe çıktısında varyant numarası olmamalı');
});

// ---- Felsefe üreticisi (FEL.10.3.1) ----
const philosophyAll = getCurriculumContext('philosophy').units.flatMap(u => u.outcomes.map(o => ({ ...o, unitCode: u.code })));
const fel1031 = philosophyAll.find(o => o.code === 'FEL.10.3.1');
const philosophyInput = (ordinal, extra = {}) => ({ unitCode: fel1031.unitCode, outcomeCode: 'FEL.10.3.1', ordinal, kind: 'open', level: 'analyze', points: 10, datasetVersion: '2026.1', mode: 'standard', profile: 'reading', ...extra });
const philosophyEngine = resolveExamContentEngine('philosophy');

test('F1: FEL.10.3.1 dört resmî süreç bileşenini sırayla üretir; kazanım cümlesi öğrenci metninde değil, öğretmen anahtarında ve ölçütte yer alır', () => {
 const steps = fel1031.processComponents.map(c => c.step);
 assert.deepEqual(steps, ['a', 'b', 'c', 'ç']);
 for (let i = 0; i < 4; i++) {
  const q = philosophyEngine.generate(philosophyInput(i));
  const description = fel1031.processComponents[i].description;
  assert.equal(q.componentStep, steps[i]);
  assert.equal(q.componentDescription, description);
  assert.ok(philosophyEngine.validTrace({ unitCode: fel1031.unitCode, outcomeCode: 'FEL.10.3.1', componentStep: q.componentStep, componentDescription: q.componentDescription }));
  assert.ok(!q.text.includes(description), `${steps[i]}: kazanım/bileşen cümlesi öğrenci sorusunda görünmemeli`);
  assert.ok(!q.passage.includes(description));
  assert.ok(!/İnceleme odağı/.test(q.text + q.passage), 'öğrenci metninde "İnceleme odağı" olmamalı');
  assert.ok(q.criterion.includes(description), 'ölçüt (öğretmen) bileşen cümlesini taşır');
  assert.ok(q.answer.includes(`Bileşen çerçevesi (${steps[i]})`));
 }
 assert.equal(philosophyEngine.validTrace({ unitCode: fel1031.unitCode, outcomeCode: 'FEL.10.3.1', componentStep: 'a', componentDescription: 'uydurma' }), false);
});

test('F1b: metin görüşü ve itirazı açıkça içerir; soru kökünde anılan her malzeme (tanım, iddia) soruda bulunur', () => {
 const passage = philosophyEngine.generate(philosophyInput(0, { kind: 'text' })).passage;
 assert.ok(passage.includes('altında değişmeyen bir şey olmalı'), 'metinde açık bir iddia olmalı');
 assert.ok(passage.includes('yalnızca akışın bir anına verdiğimiz bir addır'), 'metinde açık bir itiraz olmalı');
 // Tanım sınama görevi tanımı kendi kökünde taşır (yalnız anahtarda değil).
 const definitionQuestion = [...Array(40).keys()].map(i => philosophyEngine.generate(philosophyInput(i, { level: 'evaluate' }))).find(q => q.answer.includes('Tanım sınaması:'));
 assert.ok(definitionQuestion, 'tanım sınaması görevi bulunmalı');
 assert.ok(definitionQuestion.text.includes('Varlık, yalnızca duyularla algılanabilen şeydir.'), 'tanım soru kökünde yazılı olmalı');
 // "o durum" gönderimi yapan görev durumu kökte verir.
 const contextQuestion = [...Array(40).keys()].map(i => philosophyEngine.generate(philosophyInput(i, { level: 'apply' }))).find(q => q.text.includes('şu duruma uygulayınız'));
 assert.ok(contextQuestion && contextQuestion.text.includes('parçaları zamanla yenilenen bir yapıya'), 'uygulanacak durum soru kökünde verilmeli');
});

test('F2: 10 varyant × 4 bileşen = 40 farklı soru; 41. kapasite hatası verir; her görevin cevap anahtarı vardır', () => {
 assert.equal(philosophyEngine.variantPool, 10);
 for (const level of ['understand', 'apply', 'analyze', 'evaluate', 'create']) {
  const texts = new Set(); const answers = new Set();
  for (let i = 0; i < 40; i++) {
   const q = philosophyEngine.generate(philosophyInput(i, { level }));
   assert.ok(q.text && q.answer && q.criterion, `${level}/${i}`);
   assert.ok(!/undefined|\[object|NaN/.test(q.text + q.answer + q.criterion + q.passage), `${level}/${i}: boş alan sızdı`);
   texts.add(q.text); answers.add(q.answer);
  }
  assert.equal(texts.size, 40, `${level}: 40 farklı soru kökü`);
  assert.equal(answers.size, 40, `${level}: 40 farklı cevap anahtarı`);
 }
 assert.throws(() => philosophyEngine.generate(philosophyInput(40)), /kapasite/);
});

test('F2b: talep edilen düzeye uyan görevler önce gelir; düzey değişince görev değişir; bir bileşende hiçbir görev tekrar etmez', () => {
 for (let component = 0; component < 4; component++) {
  const byLevel = {};
  for (const level of ['understand', 'apply', 'analyze', 'evaluate', 'create']) {
   const stems = [...Array(10).keys()].map(v => philosophyEngine.generate(philosophyInput(v * 4 + component, { level })).text);
   assert.equal(new Set(stems).size, 10, `bileşen ${component}/${level}: 10 görev farklı olmalı`);
   byLevel[level] = stems;
  }
  const firsts = new Set(Object.values(byLevel).map(stems => stems[0]));
  assert.equal(firsts.size, 5, `bileşen ${component}: her düzey kendi ilk görevini almalı`);
  const all = new Set(Object.values(byLevel).flat());
  assert.equal(all.size, 10, `bileşen ${component}: banka tam 10 görevdir`);
 }
});

test('F2c: dört bileşenin görevleri birbirinden farklıdır (aynı düzey/varyantta bile)', () => {
 for (const level of ['understand', 'apply', 'analyze', 'evaluate', 'create']) for (let v = 0; v < 10; v++) {
  const stems = [0, 1, 2, 3].map(component => philosophyEngine.generate(philosophyInput(v * 4 + component, { level })).text);
  assert.equal(new Set(stems).size, 4, `${level}/varyant ${v}: bileşenler aynı soruyu üretmemeli`);
 }
});

test('F3: bütün tür × düzey × mod × BEP profili birleşimleri üretilir ve BEP içeriği değiştirmez', () => {
 for (const kind of ['text', 'short', 'open', 'scenario']) for (const level of ['understand', 'apply', 'analyze', 'evaluate', 'create']) {
  const standard = philosophyEngine.generate(philosophyInput(5, { kind, level }));
  assert.ok(standard.answer.includes('Beklenen yanıt:'));
  for (const profile of ['reading', 'writing', 'attention', 'cognitive', 'visual']) {
   const bep = philosophyEngine.generate(philosophyInput(5, { kind, level, mode: 'bep', profile }));
   assert.equal(bep.answer, standard.answer, `${kind}/${level}/${profile}: BEP cevap anahtarını değiştirmemeli`);
   assert.equal(bep.componentStep, standard.componentStep);
  }
 }
 assert.throws(() => philosophyEngine.generate(philosophyInput(0, { mode: 'bep', profile: 'x' })), /BEP/);
 assert.throws(() => philosophyEngine.generate(philosophyInput(0, { level: 'x' })), /düzey/);
 assert.throws(() => philosophyEngine.generate(philosophyInput(0, { datasetVersion: '2024' })), /2026\.1/);
 assert.throws(() => philosophyEngine.generate(philosophyInput(0, { outcomeCode: 'FEL.10.1.1', unitCode: philosophyAll.find(o => o.code === 'FEL.10.1.1').unitCode })), /Geçersiz/);
});

test('F4: Felsefe B kitapçığı A\'nın ters kopyası değil; aynı bileşenin farklı varyantıdır', () => {
 const session = editingSession({ ...fel1031, questionKind: 'open' }, 4, 'standard', 'reading', 'philosophy');
 const a = session.questions.map(q => ({ text: q.text, step: q.componentStep, ord: q.contentOrdinal }));
 session.controls().makeB();
 assert.equal(session.operationMessage, '');
 const b = session.questions.filter(q => q.booklet === 'B');
 assert.equal(b.length, 4);
 const aQs = session.questions.filter(q => q.booklet !== 'B');
 const bySteps = (qs) => qs.map(q => q.componentStep).sort().join();
 assert.equal(bySteps(b), bySteps(aQs), 'B, A ile aynı bileşen dağılımını korumalı');
 const aTexts = new Set(aQs.map(q => q.text));
 assert.ok(b.every(q => !aTexts.has(q.text)), 'B hiçbir A sorusunun kopyası olmamalı');
 assert.ok(b.every(q => !aQs.some(x => x.contentOrdinal === q.contentOrdinal)), 'B farklı varyant numarası kullanmalı');
});

test('F5: Felsefe "Sınavı oluştur" her basışta farklı soru üretir ve bütçe gerçek ölçümle eşleşir', () => {
 const rounds = [0, 1].map(r => editingSession({ ...fel1031, questionKind: 'open' }, 4, 'standard', 'reading', 'philosophy', r).questions.map(q => q.text));
 assert.notDeepEqual(rounds[0], rounds[1]);
 for (const questionCount of [4, 8, 12, 16, 20]) {
  const row = { questionCount, processComponents: fel1031.processComponents };
  const measured = measuredRounds(fel1031, questionCount, 'philosophy');
  const budget = variantBudgetOf([row], philosophyEngine.variantPool);
  assert.equal(budget, Math.max(1, measured), `${questionCount} soru: bütçe ${budget}, ölçülen ${measured}`);
 }
});

// ---- Ortak metin: aynı metne bağlı sorular için metin kâğıda bir kez basılır ----
import { planSharedPassages } from '../app/modules/exam-builder/exam-passage-groups.ts';

test('P5: ortak metin planlayıcı ardışık aynı metni tek gruba toplar; farklı/boş metin grubu böler', () => {
 const slots = planSharedPassages([{ passage: 'A metni' }, { passage: ' A   metni ' }, { passage: 'A metni' }, { passage: '' }, { passage: 'B metni' }, { passage: 'A metni' }, { passage: 'C' }]);
 assert.deepEqual(slots.map(s => s.show), [true, false, false, false, true, true, true]);
 assert.equal(slots[0].label, '1–3. soruları aşağıdaki metne göre cevaplayınız.');
 assert.equal(slots[4].label, '', 'tek soruluk metinde grup etiketi olmaz');
 assert.equal(slots[5].label, '');
 assert.deepEqual(planSharedPassages([]), []);
 assert.deepEqual(planSharedPassages([{}, { passage: undefined }]).map(s => s.show), [false, false]);
});

test('P5: şablon metni okuma yönergesi taşımaz; aynı ünitenin metni her soruda birebir aynıdır', () => {
 const helpers = new Function(`${prefix};return {passageVariant};`)();
 const philosophy = getCurriculumContext('philosophy');
 const unit = philosophy.units.find(u => u.code === 'F10_U3');
 const first = helpers.passageVariant(unit, 0);
 for (let i = 1; i < 8; i++) assert.equal(helpers.passageVariant(unit, i), first, `metin ${i}`);
 assert.doesNotMatch(first, /dikkat ediniz|okuyunuz|düşününüz|belirleyiniz/, 'metnin içinde soru yönergesi olmamalı');
});

for (const audience of ['student', 'teacher']) test(`P5: Felsefe 10. sınıf sınavı (${audience}) — aynı metin bir kez basılır, 8 soru numarası ve grup etiketi vardır`, async () => {
 const philosophy = getCurriculumContext('philosophy');
 const unit = philosophy.units.find(u => u.code === 'F10_U3');
 const outcome = { ...unit.outcomes[0], unitCode: unit.code, questionKind: 'text' };
 const questions = produce('philosophy', [{ ...outcome, questionCount: 8 }]);
 assert.equal(questions.length, 8);
 const artifact = await buildExamPackageArtifact({ school: 'Test', academicYear: '2026-2027', grade: 10, subjectName: 'Felsefe', examName: '1. Dönem 1. Sınav', booklet: 'A', durationMinutes: 40, mode: 'standard', questions: mapQuestions(questions) }, audience);
 const dir = mkdtempSync(join(tmpdir(), 'philosophy-passage-'));
 try {
  const path = join(dir, 'exam.docx'); writeFileSync(path, Buffer.from(await artifact.blob.arrayBuffer()));
  const xml = execFileSync('unzip', ['-p', path, 'word/document.xml'], { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 });
  const body = escape(questions[0].passage).slice(0, 60);
  assert.equal(xml.split(body).length - 1, 1, 'ortak metin yalnız bir kez basılmalı');
  assert.ok(xml.includes('1–8. soruları aşağıdaki metne göre cevaplayınız.'), 'grup etiketi olmalı');
  for (let n = 1; n <= 8; n++) assert.ok(xml.includes(`${n}. `), `${n}. soru basılmalı`);
 } finally { rmSync(dir, { recursive: true, force: true }); }
});
