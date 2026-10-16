import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { examVariantHistoryKey, readExamVariantRound, reserveExamVariantRound, resetExamVariantHistory } from '../app/modules/exam-builder/exam-variant-history.ts';
import { resolveExamContentEngine } from '../app/modules/exam-builder/exam-content-engine.ts';
import { getCurriculumContext } from '../app/data/curriculum-runtime.ts';
import { allocateWithinComponentBands } from '../app/modules/exam-builder/exam-variant-math.ts';
import { earlyUnitCriterion } from '../app/modules/exam-builder/philosophy-early-units-2026.ts';
import { planExamReservation } from '../app/core/exam-variant-reservation.ts';

const storage = () => { const data = new Map(); return { getItem:k=>data.get(k) ?? null, setItem:(k,v)=>data.set(k,v), removeItem:k=>data.delete(k), key:i=>[...data.keys()][i] ?? null, get length(){return data.size;} }; };
const engine = resolveExamContentEngine('philosophy');
const unit = getCurriculumContext('philosophy').units.find(u => u.code === 'F11_U4');
const rows = unit.outcomes.map(o=>({...o,unitCode:unit.code,questionCount:o.processComponents.length,questionKind:'text',cognitiveLevel:'mixed'}));
const source = readFileSync(new URL('../app/modules/exam-builder/ExamBuilder.tsx', import.meta.url), 'utf8');
const prefix = stripTypeScriptTypes(source.slice(0,source.indexOf('export default function')).replace(/import[\s\S]*?from\s+"[^"]+";/g,''));
const generate = stripTypeScriptTypes(source.slice(source.indexOf('  function generate('),source.indexOf('  function update(')));
const makeB = stripTypeScriptTypes(source.slice(source.indexOf('  function makeB()'),source.indexOf('  async function approveExamDecision(')));

function produce(round, selectedUnit = unit, count = 5) {
    const counts = allocateWithinComponentBands(count, selectedUnit.outcomes.map(o=>o.processComponents.length), engine.variantPoolFor(selectedUnit.outcomes.map(o=>o.code)));
    const selectedRows = selectedUnit.outcomes.map((o,i)=>({...o,unitCode:selectedUnit.code,questionCount:counts[i],questionKind:'text',cognitiveLevel:'mixed'}));
    let questions;
    const bindings = {scope:selectedRows,blueprintRows:selectedRows,blueprintValid:true,blueprintTotal:count,count,textRatio:100,gradeUnits:[selectedUnit],kind:'text',
      engine,variantPool:engine.variantPoolFor(selectedRows.map(r=>r.code)),historyReady:true,effectiveVariantRound:round,
      setQuestions:q=>{questions=q;},setBooklet(){},invalidateApproval(){},window:{setTimeout(){}},resultsRef:{current:null},
      createId:()=>crypto.randomUUID(),datasetVersion:'2026.1',mode:'standard',bep:'reading'};
    new Function(...Object.keys(bindings),`${prefix}\n${generate}\ngenerate();`)(...Object.values(bindings));
    const parallel = {questions,engine,createId:bindings.createId,datasetVersion:'2026.1',mode:'standard',bep:'reading',setQuestions:fn=>{questions=fn(questions);},setBooklet(){},invalidateApproval(){},setOperationMessage:m=>{throw new Error(m);},operationErrorMessage:e=>e.message};
    new Function(...Object.keys(parallel),`${prefix}\n${makeB}\nmakeB();`)(...Object.values(parallel));
    return questions;
}

test('11.4 yeni A/B çiftleri önceki metinleri dışlar; hesap turu ilerleyince çakışmaz',()=>{
  const first=produce(0),second=produce(1);
  assert.equal(first.length,10);assert.equal(second.length,10);
  assert.equal(new Set([...first,...second].map(q=>q.text)).size,20);
  assert.ok([...first,...second].every(q=>!q.passage.includes('Eşik')&&!q.text.includes('Gamze')));
  for(const questions of [first,second]) for(const booklet of ['A','B']) {
    const shown=questions.filter(q=>q.booklet===booklet);
    assert.equal(shown.reduce((n,q)=>n+q.points,0),100);
    for(const q of shown) assert.equal(q.criterion,earlyUnitCriterion(q.points,q.scoringCriteria));
  }
  const third=produce(2),fourth=produce(3);
  assert.equal(new Set([...first,...second,...third,...fourth].map(q=>q.text)).size,40);
  assert.throws(()=>produce(4),/farklı varyant kalmadı/);
});

test('Hukuk ve Felsefe: 5 ve 8 soruluk sınav tükenme sonrasında tekrar tekrar üretilebilir; A/B farklı ve 100 puandır',()=>{
  const law=getCurriculumContext('philosophy').units.find(u=>u.code==='F11_U6');
  assert.ok(law);
  for(const count of [5,8]) {
    const maxRound=engine.variantPoolFor(law.outcomes.map(o=>o.code))/2;
    const counts=allocateWithinComponentBands(count,law.outcomes.map(o=>o.processComponents.length),maxRound*2);
    const width=Math.max(...counts.map((n,i)=>Math.ceil(n/law.outcomes[i].processComponents.length)));
    let reuseRound=0;
    for(let repeat=0;repeat<12;repeat++) {
      const reservation=planExamReservation(maxRound,reuseRound,width,maxRound,true);
      reuseRound=reservation.reuseRound;
      const questions=produce(reservation.start,law,count);
      assert.equal(questions.length,2*count);
      assert.equal(new Set(questions.map(q=>q.text)).size,2*count);
      for(const booklet of ['A','B']) {
        const shown=questions.filter(q=>q.booklet===booklet);
        assert.equal(shown.length,count);
        assert.equal(shown.reduce((n,q)=>n+q.points,0),100);
        assert.ok(shown.every(q=>q.answer && q.scoringCriteria.length===3));
      }
    }
  }
});

test('her bileşen ve düzeyde dört farklı görev ve anahtar; ikinci B ilk çifte dönmez',()=>{
  for(const row of rows) for(let c=0;c<row.processComponents.length;c++) for(const level of ['understand','apply','analyze','evaluate','create']) {
    const n=row.processComponents.length, generated=[];
    for(let v=0;v<4;v++) generated.push(engine.generate({unitCode:unit.code,outcomeCode:row.code,ordinal:c+v*n,level,points:20,kind:'text',datasetVersion:'2026.1',mode:'standard',profile:'reading'}));
    assert.equal(new Set(generated.map(q=>q.text)).size,4);
    assert.equal(new Set(generated.map(q=>q.answer)).size,4);
    assert.ok(generated.every(q=>q.level===level&&q.componentStep===row.processComponents[c].step));
    assert.equal(engine.parallelOrdinal(unit.code,row.code,c+2*n,[c+2*n],level,level),c+3*n);
    assert.equal(engine.variantPoolFor([row.code]),8);
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
  for(const value of ['oops','-1','1.5','9007199254740992']) {store.setItem('fopos-exam-variants-v2:'+JSON.stringify(['philosophy','2026.1',rows[0].code]),value);assert.throws(()=>readExamVariantRound(store,key),/tekrar riski/);}
  assert.throws(()=>readExamVariantRound({getItem(){throw new Error('blocked');}},key),/blocked/);
  assert.throws(()=>reserveExamVariantRound({getItem(){return null;},setItem(){throw new Error('blocked');}},key,0),/blocked/);
});


test('5 ve 8 soru aynı çıktı geçmişini paylaşır; tür/düzey veya kapsam daraltılması geçmişi açmaz',()=>{
  const store=storage();
  const five=rows.map((r,i)=>({...r,questionCount:i===0?2:3}));
  const eight=rows.map(r=>({...r,questionCount:4,questionKind:'open',cognitiveLevel:'evaluate'}));
  const key=examVariantHistoryKey('philosophy','2026.1',five);
  assert.equal(key,examVariantHistoryKey('philosophy','2026.1',eight));
  reserveExamVariantRound(store,key,0,2);
  assert.equal(readExamVariantRound(store,examVariantHistoryKey('philosophy','2026.1',[rows[0]])),2);
  resetExamVariantHistory(store,examVariantHistoryKey('philosophy','2026.1',[rows[0]]));
  assert.equal(readExamVariantRound(store,examVariantHistoryKey('philosophy','2026.1',[rows[0]])),0);
  assert.equal(readExamVariantRound(store,examVariantHistoryKey('philosophy','2026.1',[rows[1]])),2);
});

test('eski ayar geçmişleri korunur; bozuk kaydı sıfırlama açık ve kapsamla sınırlıdır',()=>{
  const store=storage();
  const old='fopos-exam-variants-v1:'+JSON.stringify(['philosophy','2026.1',rows.map(r=>[r.code, r.processComponents.length*2,'text','mixed'])]);
  store.setItem(old,'1');
  const key=examVariantHistoryKey('philosophy','2026.1',rows);
  assert.equal(readExamVariantRound(store,key),2);
  store.setItem(old,'oops');
  assert.throws(()=>readExamVariantRound(store,key),/tekrar riski/);
  resetExamVariantHistory(store,key);
  assert.equal(readExamVariantRound(store,key),0);
  reserveExamVariantRound(store,key,0);
  assert.equal(readExamVariantRound(store,key),1);
});

test('eski sorunun tür/düzey düzenlemesi negatif ordinal ile üretim yapmaz',()=>{
  const update=stripTypeScriptTypes(source.slice(source.indexOf('  function update('),source.indexOf('  function remove(')));
  let message, changed=false;
  const bindings={questions:[{id:'old'}], engine:{generate(){throw new Error('çağrılmamalı');}},setOperationMessage:m=>message=m,setQuestions(){changed=true;}};
  new Function(...Object.keys(bindings),update+'\nupdate("old", {kind:"open"});')(...Object.values(bindings));
  assert.match(message,/varyant kaydı yok/);
  assert.equal(changed,false);
});


test('4. ünite 5 soru ilk bileşen bandına sığar, 8 soru iki bandı tüketir',()=>{
  assert.deepEqual(allocateWithinComponentBands(5,[2,3],4),[2,3]);
  assert.equal(allocateWithinComponentBands(8,[2,3],4).reduce((n,v)=>n+v,0),8);
  assert.deepEqual(allocateWithinComponentBands(8,[3,3,4],2),[3,3,2]);
});


test('11.4–6: sekiz soruluk ilk sınavdan kalan geçmiş kullanılmamış ikinci A/B çiftini engellemez', () => {
 for (const unitNumber of [4,5,6]) {
  const selected=getCurriculumContext('philosophy').units.find(u=>u.code===`F11_U${unitNumber}`);
  const codes=selected.outcomes.map(o=>o.code);
  assert.equal(engine.variantPoolFor(codes),8);
  const first=produce(0,selected,8), second=produce(2,selected,8);
  assert.equal(first.length,16); assert.equal(second.length,16);
  assert.equal(new Set([...first,...second].map(q=>q.text)).size,32);
  for(const set of [first,second]) for(const booklet of ['A','B']) assert.equal(set.filter(q=>q.booklet===booklet).reduce((n,q)=>n+q.points,0),100);
  assert.throws(()=>produce(4,selected,8),/farklı varyant kalmadı/);
 }
});
