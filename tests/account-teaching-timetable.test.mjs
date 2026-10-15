import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {runWithDatabase} from '../db/runtime-env.ts';
import {readTeachingTimetable,writeTeachingTimetable,TimetableConflict,validateAcademicYear} from '../db/teaching-timetables.ts';
import {emptyTimetable} from '../app/core/teaching-timetable.ts';
const slot={id:'original',weekday:4,time:'08:30',grade:10,branch:'A',subjectCode:'philosophy',schoolType:'general_secondary',unitCode:'',week:1};
const program={...emptyTimetable(),slots:[slot],bindings:[{slotId:'original',date:'2026-10-15',recordId:'plan-1',revision:2}]};
function database(){
 const sql=new DatabaseSync(':memory:');
 sql.exec('CREATE TABLE teaching_timetables(user_id TEXT,academic_year TEXT,timetable_json TEXT,revision INTEGER,updated_at TEXT,PRIMARY KEY(user_id,academic_year))');
 return {prepare(query){return {bind(...args){return {async first(){return sql.prepare(query).get(...args)??null;},async run(){const r=sql.prepare(query).run(...args);return {success:true,meta:{changes:Number(r.changes)}};}};}};}};
}
test('kalıcı program yeniden okunur; hesap ve yıl ayrımı korunur',async()=>runWithDatabase(database(),async()=>{
 assert.equal((await readTeachingTimetable('a','2026-2027')).revision,0);
 await writeTeachingTimetable('a','2026-2027',0,program);
 assert.deepEqual((await readTeachingTimetable('a','2026-2027')).timetable,program);
 assert.deepEqual((await readTeachingTimetable('b','2026-2027')).timetable,emptyTimetable());
 assert.equal((await readTeachingTimetable('a','2027-2028')).revision,0);
}));
test('ilk aktarım ve iki cihazın eşzamanlı yazması mevcut programı ezmez',async()=>runWithDatabase(database(),async()=>{
 await writeTeachingTimetable('a','2026-2027',0,program);
 await assert.rejects(writeTeachingTimetable('a','2026-2027',0,emptyTimetable()),TimetableConflict);
 const results=await Promise.allSettled([writeTeachingTimetable('a','2026-2027',1,program),writeTeachingTimetable('a','2026-2027',1,emptyTimetable())]);
 assert.equal(results.filter(r=>r.status==='fulfilled').length,1);
 assert.deepEqual((await readTeachingTimetable('a','2026-2027')).timetable,program);
}));
test('boşaltma da sürümlenir; eski tarayıcı yedeği silinen dersleri geri getiremez',async()=>runWithDatabase(database(),async()=>{
 await writeTeachingTimetable('a','2026-2027',0,program);
 const cleared=await writeTeachingTimetable('a','2026-2027',1,emptyTimetable());
 assert.equal(cleared.revision,2);
 await assert.rejects(writeTeachingTimetable('a','2026-2027',0,program),TimetableConflict);
 assert.deepEqual((await readTeachingTimetable('a','2026-2027')).timetable,emptyTimetable());
}));
test('bozuk program ve yıl kayıt değiştirmez',async()=>runWithDatabase(database(),async()=>{
 for(const year of ['2026-2028','bad',null])assert.throws(()=>validateAcademicYear(year));
 await assert.rejects(writeTeachingTimetable('a','2026-2027',0,{...program,slots:[{...slot,grade:8}]}));
 await assert.rejects(writeTeachingTimetable('a','2026-2027',-1,program));
 assert.equal((await readTeachingTimetable('a','2026-2027')).revision,0);
}));

const {preserveDeviceTimetable,collectDeviceProgramCopies}=await import('../app/core/timetable-device-backup.ts');
function device(initial={}){
 const data=new Map(Object.entries(initial));
 return {getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v),key:i=>[...data.keys()][i]??null,get length(){return data.size;}};
}
test('farklı cihaz programı yedeklenir ve yeniden yüklemede kopya çoğalmaz',async()=>{
 const storage=device({key:JSON.stringify(program)});
 await preserveDeviceTimetable(storage,'key',program,emptyTimetable());
 assert.equal(storage.getItem('key'),JSON.stringify(emptyTimetable()));
 assert.equal(storage.length,2);
 await preserveDeviceTimetable(storage,'key',program,emptyTimetable());
 assert.equal(storage.length,2);
 assert.ok(Object.values(collectDeviceProgramCopies(storage,'key')).includes(JSON.stringify(program)));
});
test('yedek için alan yoksa eski cihaz programı üzerine yazılmaz',async()=>{
 const storage=device({key:JSON.stringify(program)});
 storage.setItem=()=>{throw new Error('quota');};
 await assert.rejects(preserveDeviceTimetable(storage,'key',program,emptyTimetable()));
 assert.equal(storage.getItem('key'),JSON.stringify(program));
});
test('bozuk JSON dahil kopyalar ham veriyle ve yalnız doğru hesap için dışa aktarılır',()=>{
 const storage=device({key:'broken JSON','key:pending':'valid','other':'private'});
 assert.deepEqual(collectDeviceProgramCopies(storage,'key'),{key:'broken JSON','key:pending':'valid'});
});
