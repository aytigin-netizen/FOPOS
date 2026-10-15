import { assertSafeCellText, STUDENT_IMPORT_LIMITS } from "./student-import-security.ts";
export type SavedStudent = { id: string; no: string; name: string };
export function validateRosterInput(value: unknown): {title:string;students:Array<{id?:string;no:string;name:string}>} {
  if(!value || typeof value!=="object") throw new Error("Öğrenci listesi geçersiz.");
  const input=value as {title?:unknown;students?:unknown};
  const title=assertSafeCellText(input.title,"Liste adı");
  if(typeof input.title!=="string" || !title)throw new Error("Liste adı boş olamaz.");
  if(!Array.isArray(input.students)||input.students.length<1||input.students.length>STUDENT_IMPORT_LIMITS.maxStudents)throw new Error("Liste 1–500 öğrenci içermelidir.");
  const numbers=new Set<string>(),ids=new Set<string>();
  const students=input.students.map((item:unknown,index:number)=>{
    if(!item||typeof item!=="object")throw new Error(`${index+1}. öğrenci geçersiz.`);
    const row=item as {id?:unknown;no?:unknown;name?:unknown};
    const no=assertSafeCellText(row.no,"Öğrenci numarası"),name=assertSafeCellText(row.name,"Ad soyad");
    if(typeof row.no!=="string"||!/^\d{1,20}$/.test(no)||typeof row.name!=="string"||!name)throw new Error(`${index+1}. öğrencinin numarası veya ad soyadı geçersiz.`);
    if(numbers.has(no))throw new Error("Yinelenen öğrenci numarası var.");numbers.add(no);
    const id=typeof row.id==="string"?row.id:undefined;
    if(id && (!/^[a-zA-Z0-9_-]{8,100}$/.test(id)||ids.has(id)))throw new Error("Öğrenci kimliği geçersiz veya yineleniyor.");
    if(id)ids.add(id);
    return {no,name,...(id?{id}:{})};
  });
  return {title,students};
}
