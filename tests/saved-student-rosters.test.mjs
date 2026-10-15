import assert from "node:assert/strict";
import test from "node:test";
import { DatabaseSync } from "node:sqlite";
import { readFile } from "node:fs/promises";
import { runWithDatabase } from "../db/runtime-env.ts";
import { readSavedStudentRoster,writeSavedStudentRoster,deleteSavedStudentRoster,RosterConflict } from "../db/saved-student-rosters.ts";
import { validateRosterInput } from "../app/core/saved-student-roster.ts";

const migration=await readFile(new URL("../drizzle/0014_volatile_cable.sql",import.meta.url),"utf8");
function setup(){
  const db=new DatabaseSync(":memory:");
  db.exec(`PRAGMA foreign_keys=ON; CREATE TABLE users(id TEXT PRIMARY KEY); CREATE TABLE teacher_profiles(user_id TEXT,academic_year TEXT); CREATE TABLE class_workspaces(id TEXT PRIMARY KEY,user_id TEXT,grade INTEGER,branch_code TEXT,academic_year TEXT,archived_at TEXT); INSERT INTO users VALUES('a'),('b'); INSERT INTO teacher_profiles VALUES('a','2026-2027'),('b','2026-2027'); INSERT INTO class_workspaces VALUES('class-a','a',10,'A','2026-2027',NULL),('class-b','b',10,'A','2026-2027',NULL),('class-old','a',10,'B','2025-2026',NULL);`);
  db.exec(migration);
  const adapter={beforeWrite:null,prepare(sql){let args=[];return {bind(...values){args=values;return this;},async first(){return db.prepare(sql).get(...args)??null;},async run(){if(adapter.beforeWrite){const hook=adapter.beforeWrite;adapter.beforeWrite=null;hook();}const result=db.prepare(sql).run(...args);return {success:true,meta:{changes:Number(result.changes)}};}};}};
  return {db,adapter,run:fn=>runWithDatabase(adapter,fn)};
}
const input={title:"Kurgusal 10-A",students:[{no:"12",name:"Ada Deniz Çığ"},{no:"24",name:"Çağrı Öztürk"}]};

test("liste hesaba yazılır ve yeni okumada tüm adlar ve kimlikler korunur",async()=>{
  const {db,run}=setup();
  const saved=await run(()=>writeSavedStudentRoster('a','class-a',0,input));
  assert.equal(saved.revision,1);assert.equal(saved.roster.students.length,2);
  const again=await run(()=>readSavedStudentRoster('a','class-a'));
  assert.deepEqual(again,saved);assert.ok(again.roster.students.every(s=>s.id.length>8));
  db.close();
});
test("başka hesap, başka sınıf ve geçmiş yıl kayıtlarına erişilemez",async()=>{
  const {db,run}=setup();await run(()=>writeSavedStudentRoster('a','class-a',0,input));
  for(const op of [()=>readSavedStudentRoster('b','class-a'),()=>writeSavedStudentRoster('b','class-a',1,input),()=>deleteSavedStudentRoster('b','class-a',1),()=>writeSavedStudentRoster('a','class-old',0,input)])await assert.rejects(()=>run(op),/Etkin sınıf/);
  assert.equal((await run(()=>readSavedStudentRoster('b','class-b'))).roster,null);db.close();
});
test("ad, numara ve öğrenci ekleme/silme kaydedilir; mevcut öğrenci kimliği değişmez",async()=>{
  const {db,run}=setup();const one=await run(()=>writeSavedStudentRoster('a','class-a',0,input));
  const student=one.roster.students[0];
  const two=await run(()=>writeSavedStudentRoster('a','class-a',1,{title:input.title,students:[{...student,no:"99",name:"Ada Deniz Çığ Yeni"},{no:"55",name:"Kurgusal Yeni"}]}));
  assert.equal(two.roster.students[0].id,student.id);assert.equal(two.roster.students[0].no,"99");assert.ok(!two.roster.students.some(s=>s.no==="24"));
  const reimport=await run(()=>writeSavedStudentRoster('a','class-a',2,{title:input.title,students:two.roster.students.map(({no,name})=>({no,name}))}));
  assert.equal(reimport.roster.students[0].id,student.id);db.close();
});
test("bayat ekran kaydı ezemez; silinen liste eski ekranla geri getirilemez",async()=>{
  const {db,run}=setup();await run(()=>writeSavedStudentRoster('a','class-a',0,input));await run(()=>writeSavedStudentRoster('a','class-a',1,input));
  await assert.rejects(()=>run(()=>writeSavedStudentRoster('a','class-a',1,input)),RosterConflict);
  await assert.rejects(()=>run(()=>deleteSavedStudentRoster('a','class-a',1)),RosterConflict);
  const removed=await run(()=>deleteSavedStudentRoster('a','class-a',2));assert.equal(removed.revision,3);
  assert.equal((await run(()=>readSavedStudentRoster('a','class-a'))).roster,null);
  assert.equal(db.prepare('SELECT students_json FROM saved_student_rosters').get().students_json,'[]');
  await assert.rejects(()=>run(()=>writeSavedStudentRoster('a','class-a',0,input)),RosterConflict);
  const fresh=await run(()=>writeSavedStudentRoster('a','class-a',3,input));assert.equal(fresh.revision,4);db.close();
});
test("sınıf yazma sırasında arşivlenirse veya öğretim yılı değişirse atomik koşul engeller",async()=>{
  for(const query of ["UPDATE class_workspaces SET archived_at='now' WHERE id='class-a'","UPDATE teacher_profiles SET academic_year='2027-2028' WHERE user_id='a'"]){
    const {db,run,adapter}=setup();await run(()=>writeSavedStudentRoster('a','class-a',0,input));adapter.beforeWrite=()=>db.exec(query);
    await assert.rejects(()=>run(()=>writeSavedStudentRoster('a','class-a',1,{...input,title:'Changed'})),RosterConflict);
    assert.equal(db.prepare('SELECT title FROM saved_student_rosters').get().title,input.title);db.close();
  }
});
test("geçersiz satırlar ve yinelenen numaralar reddedilir; kayıt alanları izin listesiyle sınırlıdır",()=>{
  assert.throws(()=>validateRosterInput({...input,students:[input.students[0],input.students[0]]}),/Yinelenen/);
  assert.throws(()=>validateRosterInput({...input,students:[{no:'12',name:'=CMD'}]}),/formül/);
  assert.throws(()=>validateRosterInput({...input,students:[]}),/1–500/);
  const result=validateRosterInput({...input,health:'private',students:[{...input.students[0],score:100,bep:'private'}]});
  assert.deepEqual(result,{title:input.title,students:[input.students[0]]});
});
test("hesap silinince bağlı öğrenci listesi de silinir",async()=>{
  const {db,run}=setup();await run(()=>writeSavedStudentRoster('a','class-a',0,input));db.prepare("DELETE FROM users WHERE id='a'").run();assert.equal(db.prepare('SELECT COUNT(*) AS count FROM saved_student_rosters').get().count,0);db.close();
});
test("API oturum kimliğini kullanır, yazma kaynağını denetler ve kimlikleri önbelleğe almaz",async()=>{
  const route=await readFile(new URL('../app/api/student-rosters/route.ts',import.meta.url),'utf8');
  assert.match(route,/getChatGPTUser/);assert.match(route,/ensureWorkspaceAccount\(user.email\)/);assert.match(route,/origin!==new URL\(request.url\).origin/);assert.match(route,/"Cache-Control":"no-store"/);assert.match(route,/409/);
  const ui=await readFile(new URL('../app/modules/student-rosters/StudentRostersModule.tsx',import.meta.url),'utf8');assert.match(ui,/Öğrenci listesini kaydet/);assert.match(ui,/expectedRevision:revision/);assert.doesNotMatch(ui,/localStorage|sessionStorage/);
});
