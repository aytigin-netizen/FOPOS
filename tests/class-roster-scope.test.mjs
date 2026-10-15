import assert from "node:assert/strict";
import test from "node:test";
import {DatabaseSync} from "node:sqlite";
import {readFile} from "node:fs/promises";
import {runWithDatabase} from "../db/runtime-env.ts";
import {createClassWorkspace} from "../db/class-workspaces.ts";
import {writeSavedStudentRoster,readSavedStudentRoster} from "../db/saved-student-rosters.ts";
import {classCourseCatalog,rosterSchoolGrades,classProductsAvailable} from "../app/core/class-course-catalog.ts";
const migration=await readFile(new URL('../drizzle/0014_volatile_cable.sql',import.meta.url),'utf8');
function setup(){
 const db=new DatabaseSync(':memory:');db.exec(`PRAGMA foreign_keys=ON;CREATE TABLE users(id TEXT PRIMARY KEY);CREATE TABLE teacher_profiles(user_id TEXT,academic_year TEXT);CREATE TABLE class_workspaces(id TEXT PRIMARY KEY,user_id TEXT,academic_year TEXT,subject_code TEXT,grade INTEGER,branch_code TEXT,archived_at TEXT,created_at TEXT,updated_at TEXT,UNIQUE(user_id,academic_year,subject_code,grade,branch_code));INSERT INTO users VALUES('a'),('b');INSERT INTO teacher_profiles VALUES('a','2026-2027'),('b','2026-2027');`);db.exec(migration);
 const adapter={prepare(sql){let args=[];return {bind(...values){args=values;return this;},async first(){return db.prepare(sql).get(...args)??null;},async all(){return {success:true,results:db.prepare(sql).all(...args)};},async run(){const result=db.prepare(sql).run(...args);return {success:true,meta:{changes:Number(result.changes)}};}};}};
 return {db,run:fn=>runWithDatabase(adapter,fn)};
}
test("dört dersin 9–12. sınıfları oluşturulur; aynı şubenin listeleri derslere göre ayrı saklanır",async()=>{
 const {db,run}=setup();const ids=[];
 for(const course of classCourseCatalog)for(const grade of rosterSchoolGrades){
  const state=await run(()=>createClassWorkspace('a',{subjectCode:course.code,grade,branchCode:'A'}));
  const cls=state.workspaces.find(item=>item.subjectCode===course.code&&item.grade===grade);assert.ok(cls);ids.push(cls.id);
  await run(()=>writeSavedStudentRoster('a',cls.id,0,{title:`${course.name} ${grade}-A`,students:[{no:'12',name:'Kurgusal Öğrenci'}]}));
  const saved=await run(()=>readSavedStudentRoster('a',cls.id));assert.equal(saved.roster.grade,grade);assert.equal(saved.roster.title,`${course.name} ${grade}-A`);
  await assert.rejects(()=>run(()=>readSavedStudentRoster('b',cls.id)),/Etkin sınıf/);
 }
 assert.equal(new Set(ids).size,16);assert.equal(db.prepare('SELECT COUNT(*) AS count FROM saved_student_rosters').get().count,16);
 await assert.rejects(()=>run(()=>createClassWorkspace('a',{subjectCode:'history',grade:9,branchCode:'A'})),/Felsefe, Sosyoloji/);
 await assert.rejects(()=>run(()=>createClassWorkspace('a',{subjectCode:'logic',grade:8,branchCode:'A'})),/9, 10, 11 veya 12/);
 db.close();
});
test("liste kataloğunu genişletmek hazır olmayan üretim kapsamını açmaz",()=>{
 assert.deepEqual(rosterSchoolGrades,[9,10,11,12]);
 assert.equal(classProductsAvailable({subjectCode:'philosophy',grade:9}),false);
 assert.equal(classProductsAvailable({subjectCode:'philosophy',grade:12}),false);
 for(const subjectCode of ['psychology','logic'])for(const grade of rosterSchoolGrades)assert.equal(classProductsAvailable({subjectCode,grade}),false);
 assert.equal(classProductsAvailable({subjectCode:'philosophy',grade:10}),true);
});
