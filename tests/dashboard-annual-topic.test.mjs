import assert from 'node:assert/strict';
import test from 'node:test';
import { annualRows, annualRowForDate } from '../app/modules/annual-plan/annual-plan-rows.ts';
import { getCurriculumContext } from '../app/data/curriculum-runtime.ts';
import { emptyTimetable, bindLesson, boundRecord } from '../app/core/teaching-timetable.ts';

test('Bugün konusu yıllık planla aynı satırdan gelir; tatilde ders konusu üretilmez',()=>{
 const ctx=getCurriculumContext('philosophy','general_secondary');
 const rows=annualRows(10,'2026-2027',ctx.units,ctx.subjectCode,ctx.datasetVersion);
 const row=annualRowForDate(rows,'2026-10-16');
 assert.equal(row,rows[4]);assert.equal(row.unitWeek,5);assert.ok(row.topic.length);assert.ok(row.outcomeCode);
 assert.equal(annualRowForDate(rows,'2026-11-18').kind,'break');
 assert.equal(annualRowForDate(rows,'2026-08-16'),null);
});
test('80 dakika iki saate bağlanır; sınıf, ders, okul türü ve tarih ayrımı korunur',()=>{
 const a={id:'a',weekday:5,time:'13:25',grade:10,branch:'C',subjectCode:'philosophy',schoolType:'general_secondary',unitCode:'',week:1};
 const b={...a,id:'b',time:'14:10'};
 const others=[{...b,id:'other-class',branch:'D'},{...b,id:'other-course',subjectCode:'sociology'},{...b,id:'other-school',schoolType:'social_sciences_high_school'},{...b,id:'other-day',weekday:4}];
 const record={recordId:'p',revision:1,status:'approved',curriculum:{subjectCode:'philosophy',grade:10},lessonContext:{durationMinutes:80}};
 const original={...emptyTimetable(),slots:[a,b,...others]};
 const linked=bindLesson(original,a,'2026-10-16',record);
 assert.equal(linked.bindings.length,2);assert.equal(boundRecord(linked,'b','2026-10-16',[record]),record);
 for(const slot of others)assert.equal(boundRecord(linked,slot.id,'2026-10-16',[record]),null);
 assert.equal(boundRecord(linked,'b','2026-10-23',[record]),null);
 const legacy={...original,bindings:[linked.bindings[0]]};
 assert.equal(boundRecord(legacy,'b','2026-10-16',[record]),record);
 assert.deepEqual(original.bindings,[]);
 assert.equal(bindLesson(original,a,'2026-10-16',{...record,lessonContext:{durationMinutes:40}}).bindings.length,1);
});
