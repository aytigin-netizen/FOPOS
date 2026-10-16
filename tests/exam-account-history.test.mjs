import assert from 'node:assert/strict';
import test from 'node:test';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { runWithDatabase } from '../db/runtime-env.ts';
import { readExamHistory, readExamHistoryState, reserveExamHistory } from '../db/exam-generation-history.ts';

const migration = readFileSync(new URL('../drizzle/0013_exam_generation_history.sql', import.meta.url), 'utf8');
function database() {
  const db = new DatabaseSync(':memory:');
  db.exec('PRAGMA foreign_keys = ON; CREATE TABLE users (id TEXT PRIMARY KEY); INSERT INTO users VALUES (\'teacher-a\'),(\'teacher-b\');');
  db.exec(migration);
  return { db, adapter: { prepare(sql) { let args=[]; return { bind(...bound) { args=bound;return this; }, async first() { return db.prepare(sql).get(...args) ?? null; }, async run() { const result=db.prepare(sql).run(...args);return {success:true,meta:{changes:Number(result.changes)}}; } }; } } };
}
const scope={subject:'philosophy',dataset:'2026.1',codes:['FEL.11.4.1','FEL.11.4.2']};
test('hesap geçmişi A/B bantlarını atomik ayırır; cihaz, belirtke ve öğretmen izolasyonu',async()=>{
  const {db,adapter}=database();
  try {await runWithDatabase(adapter,async()=>{
    const pair=await Promise.all([reserveExamHistory('teacher-a',scope,1,2),reserveExamHistory('teacher-a',scope,1,2)]);
    assert.deepEqual(pair.map(p=>p.start).sort(),[0,1]);
    assert.equal(await readExamHistory('teacher-a',{...scope,codes:['FEL.11.4.1']}),2);
    assert.equal(await readExamHistory('teacher-a',{...scope,codes:['FEL.11.4.2']}),2);
    await assert.rejects(()=>reserveExamHistory('teacher-a',scope,1,2),/yeni A\/B sorusu kalmadı/);
    assert.equal((await reserveExamHistory('teacher-b',scope,2,2)).start,0);
    assert.equal(await readExamHistory('teacher-b',scope),2);
    await assert.rejects(()=>reserveExamHistory('teacher-b',{...scope,codes:['FEL.11.4.1']},1,2),/yeni A\/B sorusu kalmadı/);
  });}finally{db.close();}
});
test('bozuk sunucu geçmişi güvenli şekilde üretimi durdurur; hesap silinince geçmiş silinir',async()=>{
  const {db,adapter}=database();
  try {await runWithDatabase(adapter,async()=>{
    await reserveExamHistory('teacher-a',scope,1,2);
    db.prepare('UPDATE exam_generation_history SET rounds_json = ? WHERE user_id = ?').run('{broken','teacher-a');
    await assert.rejects(()=>readExamHistory('teacher-a',scope),/tekrar riski/);
    await assert.rejects(()=>reserveExamHistory('teacher-a',scope,1,2),/tekrar riski/);
    db.prepare('DELETE FROM users WHERE id = ?').run('teacher-a');
    assert.equal(db.prepare('SELECT COUNT(*) AS n FROM exam_generation_history WHERE user_id = ?').get('teacher-a').n,0);
  });}finally{db.close();}
});

test('tükenmiş hesap geçmişi açık seçimle tekrar kullanılabilir; yeni soru geçmişi ve diğer kapsamlar korunur',async()=>{
  const {db,adapter}=database();
  try {await runWithDatabase(adapter,async()=>{
    const law={...scope,codes:['FEL.11.6.1','FEL.11.6.2']};
    await reserveExamHistory('teacher-a',law,4,4);
    for(let i=0;i<12;i++) {
      const replay=await reserveExamHistory('teacher-a',law,2,4,true);
      assert.equal(replay.reused,true);
      assert.equal(replay.start,i%3);
      assert.equal(replay.next,4);
      assert.equal(replay.reuseRound,i+1);
      assert.equal(await readExamHistory('teacher-a',law),4);
    }
    await assert.rejects(()=>reserveExamHistory('teacher-a',law,1,4),/yeni A\/B sorusu kalmadı/);
    assert.deepEqual(await readExamHistoryState('teacher-a',law),{round:4,reuseRound:12});
    assert.deepEqual(await readExamHistoryState('teacher-b',law),{round:0,reuseRound:0});
    assert.equal(await readExamHistory('teacher-a',scope),0);
    // Havuz büyüdüğünde gerçekten kullanılmamış bant tekrar açılır.
    const expanded=await reserveExamHistory('teacher-a',law,1,5,true);
    assert.equal(expanded.reused,false);
    assert.equal(expanded.start,4);
    assert.equal(expanded.next,5);
    assert.equal(expanded.reuseRound,12);
  });}finally{db.close();}
});

test('iki cihazın yeniden kullanımı atomik ilerler; bozuk kayıt ve A/B yetersizliği seçimle aşılamaz',async()=>{
  const {db,adapter}=database();
  try {await runWithDatabase(adapter,async()=>{
    await reserveExamHistory('teacher-a',scope,4,4);
    const pair=await Promise.all([reserveExamHistory('teacher-a',scope,1,4,true),reserveExamHistory('teacher-a',scope,1,4,true)]);
    assert.deepEqual(pair.map(p=>p.start).sort(),[0,1]);
    assert.deepEqual(await readExamHistoryState('teacher-a',scope),{round:4,reuseRound:2});
    await assert.rejects(()=>reserveExamHistory('teacher-a',scope,5,4,true),/yeterli farklı soru yok/);
    db.prepare('UPDATE exam_generation_history SET rounds_json = ? WHERE user_id = ?').run('{broken','teacher-a');
    await assert.rejects(()=>reserveExamHistory('teacher-a',scope,1,4,true),/tekrar riski/);
  });}finally{db.close();}
});
