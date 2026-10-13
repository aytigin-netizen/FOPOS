import assert from 'node:assert/strict';
import test from 'node:test';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { runWithDatabase } from '../db/runtime-env.ts';
import { readExamHistory, reserveExamHistory } from '../db/exam-generation-history.ts';

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
