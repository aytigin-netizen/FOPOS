import assert from "node:assert/strict";
import test from "node:test";
import {readFile} from "node:fs/promises";
import {emptyTimetable,parseTimetable,timetableKey,istanbulDay,todaySlots,boundRecord,bindLesson,slotsOverlap} from "../app/core/teaching-timetable.ts";
const slot={id:"lesson-1",weekday:4,time:"10:10",grade:11,branch:"A",subjectCode:"philosophy",schoolType:"general_secondary",unitCode:"FEL.11.1",week:1};
const record={recordId:"record-1",revision:2,status:"approved",curriculum:{subjectCode:"philosophy",grade:11}};

test("İstanbul gece yarısı ve hafta günü sunucu saatinden bağımsızdır",()=>{
  assert.deepEqual(istanbulDay(new Date("2026-10-15T20:59:59Z")),{date:"2026-10-15",weekday:4});
  assert.deepEqual(istanbulDay(new Date("2026-10-15T21:00:00Z")),{date:"2026-10-16",weekday:5});
});
test("program hesabı ve öğretim yılı birbirinden ayrılır",()=>{
  assert.notEqual(timetableKey("teacher-a","2026-2027"),timetableKey("teacher-b","2026-2027"));
  assert.notEqual(timetableKey("teacher-a","2026-2027"),timetableKey("teacher-a","2027-2028"));
  assert.notEqual(timetableKey("guest","2026-2027"),timetableKey("teacher-a","2026-2027"));
});
test("haftalık program ve yalnız bugüne eklenen dersler doğru güne ve saate göre süzülür",()=>{
  const timetable={...emptyTimetable(),slots:[slot,{...slot,id:"earlier",time:"08:30"},{...slot,id:"tomorrow",weekday:5},{...slot,id:"oneoff",time:"12:00",date:"2026-10-15"},{...slot,id:"past",date:"2026-10-08"}]};
  assert.deepEqual(todaySlots(timetable,new Date("2026-10-15T09:00:00Z")).map(item=>item.id),["earlier","lesson-1","oneoff"]);
  assert.deepEqual(todaySlots(timetable,new Date("2026-10-22T09:00:00Z")).map(item=>item.id),["earlier","lesson-1"]);
});
test("haftalık ve tek günlük ders çakışmaları sınıftan bağımsız yakalanır",()=>{
  assert.ok(slotsOverlap(slot,{...slot,id:"other",branch:"B"}));
  assert.ok(slotsOverlap(slot,{...slot,id:"oneoff",date:"2026-10-15"}));
  assert.ok(!slotsOverlap(slot,{...slot,id:"other",weekday:5}));
  assert.ok(!slotsOverlap(slot,{...slot,id:"other",time:"11:00"}));
  assert.ok(!slotsOverlap(slot,{...slot,id:"oneoff",date:"2026-10-16"}));
});
test("program okuması alan izin listesi uygular ve bozuk veriyi reddeder",()=>{
  const parsed=parseTimetable(JSON.stringify({...emptyTimetable(),slots:[{...slot,studentNames:["private"],notes:"private"}]}));
  assert.deepEqual(parsed.slots,[slot]);
  for(const patch of [{time:"25:10"},{grade:8},{weekday:7},{branch:" "},{week:0},{date:"2026-02-30"}])assert.throws(()=>parseTimetable(JSON.stringify({...emptyTimetable(),slots:[{...slot,...patch}]})));
  assert.throws(()=>parseTimetable(JSON.stringify({...emptyTimetable(),slots:[slot,slot]})));
  assert.throws(()=>parseTimetable("not json"));
});
test("Hazır durumu yalnız aynı gün ve dersin açıkça bağlanan revizyonundan gelir",()=>{
  const timetable={...emptyTimetable(),slots:[slot,{...slot,id:"second",branch:"B"}]};
  assert.equal(boundRecord(timetable,slot.id,"2026-10-15",[record]),null);
  const linked=bindLesson(timetable,slot,"2026-10-15",record);
  assert.equal(boundRecord(linked,slot.id,"2026-10-15",[record]),record);
  assert.equal(boundRecord(linked,"second","2026-10-15",[record]),null);
  assert.equal(boundRecord(linked,slot.id,"2026-10-22",[record]),null);
  assert.equal(boundRecord(linked,slot.id,"2026-10-15",[{...record,revision:3}]),null);
  assert.equal(boundRecord(linked,slot.id,"2026-10-15",[{...record,status:"superseded"}]),null);
  assert.equal(boundRecord(linked,slot.id,"2026-10-15",[{...record,curriculum:{...record.curriculum,subjectCode:"sociology"}}]),null);
});
test("aynı dersin yeni kaydı bağlanırken eski günün eşleştirmesi korunur",()=>{
  let timetable={...emptyTimetable(),slots:[slot]};
  timetable=bindLesson(timetable,slot,"2026-10-08",record);
  timetable=bindLesson(timetable,slot,"2026-10-15",record);
  timetable=bindLesson(timetable,slot,"2026-10-15",{...record,revision:3});
  assert.equal(timetable.bindings.length,2);
  assert.equal(timetable.bindings.find(item=>item.date==="2026-10-08").revision,2);
  assert.equal(timetable.bindings.find(item=>item.date==="2026-10-15").revision,3);
});
test("bozuk yerel kayıt otomatik yazılmaz ve depolama hatası görünür kalır",async()=>{
  const hook=await readFile(new URL("../app/hooks/use-teaching-timetable.ts",import.meta.url),"utf8");
  assert.match(hook,/mevcut kayıt otomatik olarak değiştirilmedi/);
  assert.match(hook,/Program kaydedilemedi/);
  assert.match(hook,/event.key === key/);
  const dashboard=await readFile(new URL("../app/components/dashboard/Dashboard.tsx",import.meta.url),"utf8");
  assert.match(dashboard,/if\(!isAuthenticated\)return/);
  assert.match(dashboard,/cache:"no-store"/);
  assert.doesNotMatch(dashboard,/Ödev teslim tarihi yarın|Zümre toplantısı/);
});


test("dört ders 9–12. sınıfta program kaydedip yeniden okunur; eski kayıtlar korunur",async()=>{
  const {classCourseCatalog,rosterSchoolGrades}=await import("../app/core/class-course-catalog.ts");
  const slots=classCourseCatalog.flatMap(course=>rosterSchoolGrades.map(grade=>({...slot,id:`${course.code}-${grade}`,grade,subjectCode:course.code,unitCode:""})));
  const restored=parseTimetable(JSON.stringify({...emptyTimetable(),slots:[slot,...slots]}));
  assert.equal(restored.slots.length,17);assert.deepEqual(restored.slots[0],slot);
  for(const course of classCourseCatalog)for(const grade of rosterSchoolGrades)assert.ok(restored.slots.some(item=>item.subjectCode===course.code&&item.grade===grade));
  const dialog=await readFile(new URL("../app/components/dashboard/TimetableDialog.tsx",import.meta.url),"utf8");
  assert.match(dialog,/rosterSchoolGrades.map/);assert.doesNotMatch(dialog,/context.supportedGrades/);
  const dashboard=await readFile(new URL("../app/components/dashboard/Dashboard.tsx",import.meta.url),"utf8");
  assert.match(dashboard,/schedulingSubjects=\[...classCourseCatalog\]/);
  assert.match(dashboard,/row.status!=="program"/);
});
