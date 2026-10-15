import { getChatGPTUser } from "../../chatgpt-auth";
import { ensureWorkspaceAccount } from "../../../db/teacher-workspace";
import { readTeachingTimetable,writeTeachingTimetable,validateAcademicYear,TimetableConflict } from "../../../db/teaching-timetables";
export const dynamic="force-dynamic";
function fail(error:unknown){return Response.json({error:error instanceof Error?error.message:"Program işlemi tamamlanamadı."},{status:error instanceof TimetableConflict?409:400,headers:{"Cache-Control":"no-store"}});}
export async function GET(request:Request){
  const user=await getChatGPTUser();if(!user)return Response.json({error:"Oturum gerekli."},{status:401});
  try{const account=await ensureWorkspaceAccount(user.email);return Response.json(await readTeachingTimetable(account.id,validateAcademicYear(new URL(request.url).searchParams.get("academicYear"))),{headers:{"Cache-Control":"no-store"}});}catch(error){return fail(error);}
}
export async function PUT(request:Request){
  const user=await getChatGPTUser();if(!user)return Response.json({error:"Oturum gerekli."},{status:401});
  const origin=request.headers.get("origin");if(!origin||origin!==new URL(request.url).origin)return Response.json({error:"İstek kaynağı doğrulanamadı."},{status:403});
  if(Number(request.headers.get("content-length"))>500000)return Response.json({error:"Program boyut sınırını aşıyor."},{status:413});
  try{
    const reader=request.body?.getReader();if(!reader)throw new Error("İstek gövdesi boş.");
    const decoder=new TextDecoder();let text="",size=0;
    while(true){const chunk=await reader.read();if(chunk.done)break;size+=chunk.value.byteLength;if(size>500000){await reader.cancel();return Response.json({error:"Program boyut sınırını aşıyor."},{status:413});}text+=decoder.decode(chunk.value,{stream:true});}text+=decoder.decode();
    const body=JSON.parse(text) as {academicYear?:unknown;expectedRevision:number;timetable?:unknown};
    const account=await ensureWorkspaceAccount(user.email),year=validateAcademicYear(body.academicYear);
    const state=await writeTeachingTimetable(account.id,year,body.expectedRevision,body.timetable);
    return Response.json(state,{headers:{"Cache-Control":"no-store"}});
  }catch(error){return fail(error);}
}
