import { getChatGPTUser } from "../../chatgpt-auth";
import { ensureWorkspaceAccount } from "../../../db/teacher-workspace";
import { deleteSavedStudentRoster,readSavedStudentRoster,writeSavedStudentRoster,RosterConflict } from "../../../db/saved-student-rosters";
export const dynamic="force-dynamic";
function classId(value:unknown){if(typeof value!=="string"||!value||value.length>150)throw new Error("Sınıf kimliği geçersiz.");return value;}
function fail(error:unknown){return Response.json({error:error instanceof Error?error.message:"Liste işlemi tamamlanamadı."},{status:error instanceof RosterConflict?409:400,headers:{"Cache-Control":"no-store"}});}
export async function GET(request:Request){
  const user=await getChatGPTUser();if(!user)return Response.json({error:"Oturum gerekli."},{status:401});
  try{const account=await ensureWorkspaceAccount(user.email);return Response.json(await readSavedStudentRoster(account.id,classId(new URL(request.url).searchParams.get("classId"))),{headers:{"Cache-Control":"no-store"}});}catch(error){return fail(error);}
}
async function mutate(request:Request,deleting:boolean){
  const user=await getChatGPTUser();if(!user)return Response.json({error:"Oturum gerekli."},{status:401});
  const origin=request.headers.get("origin");if(!origin||origin!==new URL(request.url).origin)return Response.json({error:"İstek kaynağı doğrulanamadı."},{status:403});
  if(Number(request.headers.get("content-length"))>500000)return Response.json({error:"Liste boyut sınırını aşıyor."},{status:413});
  try{
    const reader=request.body?.getReader();if(!reader)throw new Error("İstek gövdesi boş.");
    const decoder=new TextDecoder();let text="",size=0;
    while(true){const chunk=await reader.read();if(chunk.done)break;size+=chunk.value.byteLength;if(size>500000){await reader.cancel();return Response.json({error:"Liste boyut sınırını aşıyor."},{status:413});}text+=decoder.decode(chunk.value,{stream:true});}text+=decoder.decode();
    const body=JSON.parse(text) as {classId?:unknown;expectedRevision:number;roster?:unknown};
    const account=await ensureWorkspaceAccount(user.email),id=classId(body.classId);
    const state=deleting?await deleteSavedStudentRoster(account.id,id,body.expectedRevision):await writeSavedStudentRoster(account.id,id,body.expectedRevision,body.roster);
    return Response.json(state,{headers:{"Cache-Control":"no-store"}});
  }catch(error){return fail(error);}
}
export async function PUT(request:Request){return mutate(request,false);}
export async function DELETE(request:Request){return mutate(request,true);}
