import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { examVariantHistoryKey, readExamVariantRound, reserveExamVariantRound } from '../app/modules/exam-builder/exam-variant-history.ts';
import { resolveExamContentEngine } from '../app/modules/exam-builder/exam-content-engine.ts';
import { getCurriculumContext } from '../app/data/curriculum-runtime.ts';
import { earlyUnitCriterion } from '../app/modules/exam-builder/philosophy-early-units-2026.ts';

const storage = () => { const data = new Map(); return { getItem:k=>data.get(k) ?? null, setItem:(k,v)=>data.set(k,v) }; };
const engine = resolveExamContentEngine('philosophy');
const unit = getCurriculumContext('philosophy').units.find(u => u.code === 'F11_U4');
const rows = unit.outcomes.map(o=>({...o,unitCode:unit.code,questionCount:o.processComponents.length,questionKind:'text',cognitiveLevel:'mixed'}));
const source = readFileSync(new URL('../app/modules/exam-builder/ExamBuilder.tsx', import.meta.url), 'utf8');
const prefix = stripTypeScriptTypes(source.slice(0,source.indexOf('export default function')).replace(/import[\s\S]*?from\s+"[^"]+";/g,''));
const generate = stripTypeScriptTypes(source.slice(source.indexOf('  function generate()'),source.indexOf('  function update(')));
const makeB = stripTypeScriptTypes(source.slice(source.indexOf('  function makeB()'),source.indexOf('  async function approveExamDecision(')));

test('gerçek UI üretimi, yeniden açılınca ikinci A/B çiftini verir; üçüncü tur tekrarı reddeder',()=>{
  const store = storage();
  const key = examVariantHistoryKey('philosophy','2026.1',rows);
  function openAndGenerate() {
    let questions, failure;
    const round = readExamVariantRound(store,key);
    const bindings = {scope:rows,blueprintRows:rows,blueprintValid:true,blueprintTotal:5,count:5,textRatio:100,gradeUnits:[unit],kind:'text',
      engine,variantPool:engine.variantPoolFor(rows.map(r=>r.code)),historyReady:true,effectiveVariantRound:round,historyKey:key,
      setHistoryState(){},readExamVariantRound,reserveExamVariantRound,setVariantRound(){},variantRound:0,
      setQuestions:q=>{questions=q;},setBooklet(){},invalidateApproval(){},window:{localStorage:store,setTimeout(){}},resultsRef:{current:null},
      createId:()=>crypto.randomUUID(),datasetVersion:'2026.1',mode:'standard',bep:'reading'};
    new Function(...Object.keys(bindings),`${prefix}\n${generate}\ngenerate();`)(...Object.values(bindings));
    const parallel = {questions,engine,createId:bindings.createId,datasetVersion:'2026.1',mode:'standard',bep:'reading',setQuestions:fn=>{questions=fn(questions);},setBooklet(){},invalidateApproval(){},setOperationMessage:m=>{failure=m;},operationErrorMessage:e=>e.message};
    new Function(...Object.keys(parallel),`${prefix}\n${makeB}\nmakeB();`)(...Object.values(parallel));
    assert.equal(failure,undefined);
    return questions;
  }
  const first = openAndGenerate(), second = openAndGenerate();
  assert.equal(first.length,10); assert.equal(second.length,10);
  assert.equal(new Set([...first,...second].map(q=>q.text)).size,20);
  for (const questions of [first,second]) for (const booklet of ['A','B']) {
    const shown=questions.filter(q=>q.booklet===booklet);
    assert.equal(shown.reduce((n,q)=>n+q.points,0),100);
    for(const q of shown) assert.equal(q.criterion,earlyUnitCriterion(q.points,q.scoringCriteria));
  }
  assert.equal(readExamVariantRound(store,key),2);
  assert.throws(openAndGenerate,/farklı varyant kalmadı/);
});

test('her bileşen ve düzeyde dört farklı görev ve anahtar; ikinci B ilk çifte dönmez',()=>{
  for(const row of rows) for(let c=0;c<row.processComponents.length;c++) for(const level of ['understand','apply','analyze','evaluate','create']) {
    const n=row.processComponents.length, generated=[];
    for(let v=0;v<4;v++) generated.push(engine.generate({unitCode:unit.code,outcomeCode:row.code,ordinal:c+v*n,level,points:20,kind:'text',datasetVersion:'2026.1',mode:'standard',profile:'reading'}));
    assert.equal(new Set(generated.map(q=>q.text)).size,4);
    assert.equal(new Set(generated.map(q=>q.answer)).size,4);
    assert.ok(generated.every(q=>q.level===level&&q.componentStep===row.processComponents[c].step));
    assert.equal(engine.parallelOrdinal(unit.code,row.code,c+2*n,[c+2*n],level,level),c+3*n);
    assert.throws(()=>engine.parallelOrdinal(unit.code,row.code,c+3*n,[c+3*n],level,level),/B sorusu kalmadı/);
    for(const q of generated) assert.equal([...q.criterion.matchAll(/: (\d+) puan\. Tam:/g)].reduce((n,m)=>n+Number(m[1]),0),20);
  }
  assert.equal(engine.variantPoolFor(['FEL.11.4.1','FEL.11.3.2']),2);
});

test('geçmiş anahtarı sıralamadan ve kişisel veriden bağımsızdır; bozuk veya erişilemeyen kayıt sessizce sıfırlanmaz',()=>{
  const key=examVariantHistoryKey('philosophy','2026.1',rows);
  assert.equal(key,examVariantHistoryKey('philosophy','2026.1',[...rows].reverse()));
  assert.doesNotMatch(key,/Ankara|Aytekin|öğrenci/);
  const store=storage(); reserveExamVariantRound(store,key,0);
  assert.throws(()=>reserveExamVariantRound(store,key,0),/başka bir sekmede/);
  for(const value of ['oops','-1','1.5','9007199254740992']) {store.setItem(key,value);assert.throws(()=>readExamVariantRound(store,key),/tekrar riski/);}
  assert.throws(()=>readExamVariantRound({getItem(){throw new Error('blocked');}},key),/blocked/);
  assert.throws(()=>reserveExamVariantRound({getItem(){return null;},setItem(){throw new Error('blocked');}},key,0),/blocked/);
});
