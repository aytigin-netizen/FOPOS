"use client";
import { useEffect, useRef, useState } from "react";
import { emptyTimetable, parseTimetable, timetableKey, type TeachingTimetable } from "../core/teaching-timetable";

type State = {timetable:TeachingTimetable;revision:number};
async function requestProgram(academicYear:string, next?:State):Promise<State> {
  const response=await fetch(`/api/teaching-timetable?academicYear=${encodeURIComponent(academicYear)}`, {
    cache:"no-store", ...(next?{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({academicYear,expectedRevision:next.revision,timetable:next.timetable})}:{})
  });
  const body=await response.json();
  if(!response.ok)throw Object.assign(new Error(body.error??"Program kaydedilemedi."),{status:response.status});
  return {revision:body.revision,timetable:parseTimetable(JSON.stringify(body.timetable))};
}
export function useTeachingTimetable(accountKey: string, academicYear: string, isAuthenticated=false) {
  const key = timetableKey(accountKey, academicYear);
  const currentKey=useRef(key);
  const state=useRef<State>({timetable:emptyTimetable(),revision:0});
  const saving=useRef(false);
  const [loadedKey, setLoadedKey] = useState("");
  const [timetable, setTimetable] = useState<TeachingTimetable>(emptyTimetable);
  const [storageMessage, setStorageMessage] = useState("");
  useEffect(() => {
    let cancelled=false;
    currentKey.current=key;
    const load = async () => {
      let local:TeachingTimetable|null=null;
      let localError=false;
      try {const text=window.localStorage.getItem(key);if(text)local=parseTimetable(text);}
      catch {localError=true;}
      try {
        let result:State={timetable:local??emptyTimetable(),revision:0};
        let message=localError?"Ders programı okunamadı; mevcut kayıt otomatik olarak değiştirilmedi.":"";
        if(isAuthenticated){
          result=await requestProgram(academicYear);
          if(cancelled)return;
          if(result.revision===0&&local&&(local.slots.length||local.bindings.length)){
            // Only create an absent account record; atomic revision check prevents overwrites.
            try{
              result=await requestProgram(academicYear,{timetable:local,revision:0});
              message="Bu tarayıcıdaki ders programı hesabınıza kalıcı olarak aktarıldı.";
            }catch(error){
              if((error as {status?:number}).status!==409)throw error;
              result=await requestProgram(academicYear);
              message="Hesaptaki güncel program açıldı; bu tarayıcıdaki program yedeği korundu.";
            }
          }else if(local&&JSON.stringify(local)!==JSON.stringify(result.timetable)){
            // Keep the original device copy; never merge incompatible plans silently.
            try{window.localStorage.setItem(`${key}:backup:${crypto.randomUUID()}`,JSON.stringify(local));}catch{/* Existing device key remains untouched. */}
            message="Hesabınızdaki güncel program açıldı. Bu cihazdaki farklı program yedek olarak korundu.";
          }
          message ||= "Ders programınız hesabınızda kalıcı olarak saklanıyor.";
        }
        if(cancelled)return;
        state.current=result;setTimetable(result.timetable);setStorageMessage(message);setLoadedKey(key);
      }catch(error){
        if(cancelled)return;
        setTimetable(local??emptyTimetable());
        setStorageMessage(`${error instanceof Error?error.message:"Program yüklenemedi."} Mevcut tarayıcı kayıtları korundu. Bağlantıyı kontrol edip sayfayı yenileyin.`);
      }
    };
    void load();
    const onStorage = (event: StorageEvent) => { if (!isAuthenticated&&(event.key === key || event.key === null)) void load(); };
    window.addEventListener("storage", onStorage);
    return () => {cancelled=true;window.removeEventListener("storage", onStorage);};
  }, [key,academicYear,isAuthenticated]);
  async function saveTimetable(next: TeachingTimetable) {
    if(loadedKey!==key||saving.current)return false;
    saving.current=true;
    const saveKey=key;
    try {
      const safe=parseTimetable(JSON.stringify(next));
      // Preserve attempted edits even if the network fails or another device wins.
      if(isAuthenticated){try{window.localStorage.setItem(`${key}:pending`,JSON.stringify(safe));}catch{/* Account storage remains available without a browser cache. */}}
      else window.localStorage.setItem(key,JSON.stringify(safe));
      const result=isAuthenticated?await requestProgram(academicYear,{timetable:safe,revision:state.current.revision}):{timetable:safe,revision:0};
      if(currentKey.current!==saveKey)return false;
      state.current=result;setTimetable(result.timetable);
      try{window.localStorage.setItem(key,JSON.stringify(result.timetable));window.localStorage.removeItem(`${key}:pending`);}catch{/* Account commit already succeeded. */}
      setStorageMessage(isAuthenticated?"Ders programınız hesabınıza kaydedildi.":"Program bu tarayıcıya kaydedildi. Kalıcı hesap kaydı için giriş yapın.");
      return true;
    }catch(error){
      if(currentKey.current===saveKey)setStorageMessage(`Program kaydedilemedi. ${error instanceof Error?error.message:"Bağlantınızı kontrol edin."}`);
      return false;
    }finally{saving.current=false;}
  }
  function downloadDeviceBackup(){
    try{
      const copies:Record<string,unknown>={};
      for(let i=0;i<window.localStorage.length;i++){
        const name=window.localStorage.key(i);
        if(name&&(name===key||name.startsWith(`${key}:`)))copies[name]=JSON.parse(window.localStorage.getItem(name)??"null");
      }
      const url=URL.createObjectURL(new Blob([JSON.stringify({academicYear,copies},null,2)],{type:"application/json"}));
      const link=document.createElement("a");link.href=url;link.download=`FOPOS-Ders-Programi-Yedegi-${academicYear}.json`;link.click();
      setTimeout(()=>URL.revokeObjectURL(url),1000);
    }catch{setStorageMessage("Cihaz yedeği indirilemedi. Tarayıcı depolama iznini kontrol edin.");}
  }
  return { downloadDeviceBackup, timetable:loadedKey === key ? timetable : emptyTimetable(), ready:loadedKey === key, storageMessage, saveTimetable };
}
