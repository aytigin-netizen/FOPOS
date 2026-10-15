type DeviceStorage = Pick<Storage,"getItem"|"setItem"|"key"|"length">;
export async function preserveDeviceTimetable(storage:DeviceStorage,key:string,local:unknown,account:unknown,isCancelled=()=>false){
  const text=JSON.stringify(local);
  if(text===JSON.stringify(account))return;
  const digest=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(text));
  if(isCancelled())return;
  const hash=Array.from(new Uint8Array(digest),byte=>byte.toString(16).padStart(2,"0")).join("");
  const backupKey=`${key}:backup:${hash}`;
  if(storage.getItem(backupKey)===null)storage.setItem(backupKey,text);
  storage.setItem(key,JSON.stringify(account));
}
export function collectDeviceProgramCopies(storage:DeviceStorage,key:string){
  const copies:Record<string,string|null>={};
  for(let i=0;i<storage.length;i++){
    const name=storage.key(i);
    if(name&&(name===key||name.startsWith(`${key}:`)))copies[name]=storage.getItem(name);
  }
  return copies;
}
