import { getDatabase } from "./runtime-env.ts";
import { validateRosterInput, type SavedStudent } from "../app/core/saved-student-roster.ts";
import type { ManagedStudentRoster } from "../app/core/managed-student-roster.ts";
import type { SchoolGrade } from "../app/core/class-workspace.ts";

export class RosterConflict extends Error {}
const activeClass = `SELECT c.id FROM class_workspaces c JOIN teacher_profiles p ON p.user_id=c.user_id AND p.academic_year=c.academic_year WHERE c.id=? AND c.user_id=? AND c.archived_at IS NULL`;
async function context(userId:string,classId:string){
  const row=await getDatabase().prepare(`SELECT c.id,c.grade,c.branch_code FROM class_workspaces c JOIN teacher_profiles p ON p.user_id=c.user_id AND p.academic_year=c.academic_year WHERE c.id=? AND c.user_id=? AND c.archived_at IS NULL`).bind(classId,userId).first<{id:string;grade:SchoolGrade;branch_code:string}>();
  if(!row)throw new Error("Etkin sınıf çalışma alanı bulunamadı.");return row;
}
export async function readSavedStudentRoster(userId:string,classId:string):Promise<{roster:ManagedStudentRoster|null;revision:number}>{
  const cls=await context(userId,classId);
  const row=await getDatabase().prepare("SELECT title,students_json,revision,updated_at,deleted_at FROM saved_student_rosters WHERE class_id=? AND user_id=?").bind(classId,userId).first<{title:string;students_json:string;revision:number;updated_at:string;deleted_at:string|null}>();
  if(!row||row.deleted_at)return {roster:null,revision:row?.revision??0};
  return {revision:row.revision,roster:{id:`saved-${classId}`,title:row.title,grade:cls.grade,branch:cls.branch_code,students:JSON.parse(row.students_json) as SavedStudent[],revision:row.revision,updatedAt:row.updated_at,dirty:false}};
}
export async function writeSavedStudentRoster(userId:string,classId:string,expectedRevision:number,value:unknown){
  if(!Number.isInteger(expectedRevision)||expectedRevision<0)throw new Error("Liste sürümü geçersiz.");
  const input=validateRosterInput(value);
  const current=await readSavedStudentRoster(userId,classId);
  if(current.revision!==expectedRevision)throw new RosterConflict("Liste başka bir ekranda değişti. Güncel kaydı yeniden açın; değişiklikleriniz henüz kaydedilmedi.");
  const existing=current.roster?.students??[];
  const students=input.students.map(student=>{
    const previous=student.id?existing.find(item=>item.id===student.id):existing.find(item=>item.no===student.no);
    return {id:previous?.id??crypto.randomUUID(),no:student.no,name:student.name};
  });
  const now=new Date().toISOString(),db=getDatabase();
  const result=expectedRevision===0
    ? await db.prepare(`INSERT INTO saved_student_rosters (class_id,user_id,title,students_json,revision,updated_at,deleted_at) SELECT ?,?,?,?,1,?,NULL WHERE EXISTS (${activeClass}) ON CONFLICT(class_id) DO NOTHING`).bind(classId,userId,input.title,JSON.stringify(students),now,classId,userId).run()
    : await db.prepare(`UPDATE saved_student_rosters SET title=?,students_json=?,revision=revision+1,updated_at=?,deleted_at=NULL WHERE class_id=? AND user_id=? AND revision=? AND EXISTS (${activeClass})`).bind(input.title,JSON.stringify(students),now,classId,userId,expectedRevision,classId,userId).run();
  if(result.meta?.changes!==1)throw new RosterConflict("Liste değişti veya sınıf arşivlendi. Kaydı yeniden açın.");
  return readSavedStudentRoster(userId,classId);
}
export async function deleteSavedStudentRoster(userId:string,classId:string,expectedRevision:number){
  if(!Number.isInteger(expectedRevision)||expectedRevision<1)throw new Error("Liste sürümü geçersiz.");
  await context(userId,classId);
  const now=new Date().toISOString();
  const result=await getDatabase().prepare(`UPDATE saved_student_rosters SET title='',students_json='[]',deleted_at=?,updated_at=?,revision=revision+1 WHERE class_id=? AND user_id=? AND revision=? AND deleted_at IS NULL AND EXISTS (${activeClass})`).bind(now,now,classId,userId,expectedRevision,classId,userId).run();
  if(result.meta?.changes!==1)throw new RosterConflict("Liste değişti veya silindi. Kaydı yeniden açın.");
  return {roster:null,revision:expectedRevision+1};
}
