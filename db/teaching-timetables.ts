import { getDatabase } from "./runtime-env.ts";
import { emptyTimetable, parseTimetable } from "../app/core/teaching-timetable.ts";
export class TimetableConflict extends Error {}
export function validateAcademicYear(value: unknown): string {
  if(typeof value!=="string" || !/^\d{4}-\d{4}$/.test(value) || Number(value.slice(5))!==Number(value.slice(0,4))+1) throw new Error("Öğretim yılı geçersiz.");
  return value;
}
export async function readTeachingTimetable(userId:string, academicYear:string) {
  validateAcademicYear(academicYear);
  const row=await getDatabase().prepare("SELECT timetable_json,revision FROM teaching_timetables WHERE user_id=? AND academic_year=?").bind(userId,academicYear).first<{timetable_json:string;revision:number}>();
  return {timetable:row?parseTimetable(row.timetable_json):emptyTimetable(),revision:row?.revision??0};
}
export async function writeTeachingTimetable(userId:string,academicYear:string,expectedRevision:number,value:unknown) {
  validateAcademicYear(academicYear);
  if(!Number.isSafeInteger(expectedRevision)||expectedRevision<0)throw new Error("Program sürümü geçersiz.");
  const timetable=parseTimetable(JSON.stringify(value)),text=JSON.stringify(timetable),now=new Date().toISOString(),db=getDatabase();
  const result=expectedRevision===0
    ?await db.prepare("INSERT INTO teaching_timetables (user_id,academic_year,timetable_json,revision,updated_at) VALUES (?,?,?,1,?) ON CONFLICT(user_id,academic_year) DO NOTHING").bind(userId,academicYear,text,now).run()
    :await db.prepare("UPDATE teaching_timetables SET timetable_json=?,revision=revision+1,updated_at=? WHERE user_id=? AND academic_year=? AND revision=?").bind(text,now,userId,academicYear,expectedRevision).run();
  if(result.meta?.changes!==1)throw new TimetableConflict("Program başka bir cihazda değişti. Sayfayı yenileyin; bu cihazdaki program yedeği korunuyor.");
  return {timetable,revision:expectedRevision+1};
}
