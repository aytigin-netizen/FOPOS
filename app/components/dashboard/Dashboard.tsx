"use client";

import { ArrowRight, Bell, BookOpen, CalendarDays, ClipboardCheck, ExternalLink, Plus, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { AppView } from "../navigation/AppNavigation";
import type { ResourceSection } from "../../modules/resource-center/ResourceCenterModule";
import type { PedagogicalRecord } from "../../core/pedagogical-record";
import { boundRecord, istanbulDay, todaySlots, type TeachingSlot, type TeachingTimetable } from "../../core/teaching-timetable";
import { getCurriculumContext } from "../../data/curriculum-runtime";
import { lessonStudioWeeklyHours } from "../../modules/lesson-studio/lesson-studio-week-count";
import { TimetableDialog } from "./TimetableDialog";

function currentWelcome(now:Date){
  const hour=Number(new Intl.DateTimeFormat("en-GB",{timeZone:"Europe/Istanbul",hour:"2-digit",hourCycle:"h23"}).format(now));
  return { date:new Intl.DateTimeFormat("tr-TR",{timeZone:"Europe/Istanbul",day:"numeric",month:"long",year:"numeric",weekday:"long"}).format(now), greeting:hour<12?"Günaydın":hour<18?"İyi günler":"İyi akşamlar" };
}
const tools:[AppView,string,typeof BookOpen][]=[["annual","Yıllık Plan",CalendarDays],["exam","Sınav",ClipboardCheck],["resources","Kaynak Merkezi",BookOpen]];

export function Dashboard({onOpen,teacherDisplayName,isAuthenticated,timetable,ready,storageMessage,onSaveTimetable,subjects,currentRecord,onOpenLesson,onContinue,onNewDesign}: {
  onOpen:(view:AppView,resourceSection?:ResourceSection)=>void;
  teacherDisplayName:string;
  isAuthenticated:boolean;
  timetable:TeachingTimetable;
  ready:boolean;
  storageMessage:string;
  onSaveTimetable:(next:TeachingTimetable)=>boolean;
  subjects:{code:string;name:string}[];
  currentRecord:PedagogicalRecord|null;
  onOpenLesson:(slot:TeachingSlot,date:string,record:PedagogicalRecord|null)=>void;
  onContinue:(record:PedagogicalRecord)=>void;
  onNewDesign:()=>void;
}){
  const [now,setNow]=useState<Date|null>(null);
  const [records,setRecords]=useState<PedagogicalRecord[]>([]);
  const [recordState,setRecordState]=useState<"loading"|"ready"|"error">(isAuthenticated?"loading":"ready");
  const [retry,setRetry]=useState(0);
  const [notifications,setNotifications]=useState(false);
  const [oneOff,setOneOff]=useState(false);
  const dialogRef=useRef<HTMLDialogElement>(null);
  useEffect(()=>{
    const refresh=()=>setNow(new Date());refresh();
    const timer=window.setInterval(refresh,30_000);window.addEventListener("focus",refresh);
    return()=>{window.clearInterval(timer);window.removeEventListener("focus",refresh);};
  },[]);
  useEffect(()=>{
    if(!isAuthenticated)return;
    const controller=new AbortController();
    void fetch("/api/pedagogical-records",{signal:controller.signal,cache:"no-store"}).then(async response=>{
      const payload=await response.json() as {records?:PedagogicalRecord[]};
      if(!response.ok||!Array.isArray(payload.records))throw Error("Kayıtlar açılamadı.");
      if(!controller.signal.aborted){setRecords(payload.records);setRecordState("ready");}
    }).catch(()=>{if(!controller.signal.aborted)setRecordState("error");});
    return()=>controller.abort();
  },[isAuthenticated,retry]);
  const schedulingSubjects=subjects.filter(subject=>Object.hasOwn(lessonStudioWeeklyHours,subject.code));
  const allRecords=[...(currentRecord?[currentRecord]:[]),...records.filter(record=>!(currentRecord&&record.recordId===currentRecord.recordId&&record.revision===currentRecord.revision))];
  const usableRecords=allRecords.filter(record=>record.status!=="superseded"&&subjects.some(subject=>subject.code===record.curriculum.subjectCode));
  const lastRecord=[...usableRecords].sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt)||b.revision-a.revision)[0];
  const date=now?istanbulDay(now).date:"";
  const lessons=now?todaySlots(timetable,now):[];
  const lessonRows=lessons.map(slot=>{
    let record=boundRecord(timetable,slot.id,date,usableRecords);
    try {if(record && record.curriculum.datasetVersion!==getCurriculumContext(slot.subjectCode,slot.schoolType).datasetVersion)record=null;}catch{record=null;}
    let unitName="Ünite seçilmedi";
    try {unitName=getCurriculumContext(slot.subjectCode,slot.schoolType).units.find(unit=>unit.code===(record?.curriculum.unitCode??slot.unitCode))?.name??unitName;}catch{/* Unsupported stored subjects stay visible for correction. */}
    const binding=timetable.bindings.some(item=>item.slotId===slot.id&&item.date===date);
    return {slot,record,unitName,status:record?.status==="approved"?"ready":record?"draft":binding?(recordState==="loading"?"loading":"unverified"):"missing"};
  });
  const pending=lessonRows.filter(row=>row.status!=="ready");
  const attention=recordState==="loading"?[]:pending.slice(0,3);
  const welcome=now?currentWelcome(now):null;
  function openProgram(single=false){setOneOff(single);dialogRef.current?.showModal();}
  const recordTitle=(record:PedagogicalRecord)=>{
    try{return getCurriculumContext(record.curriculum.subjectCode).units.find(unit=>unit.code===record.curriculum.unitCode)?.name??record.curriculum.unitCode;}catch{return record.curriculum.unitCode;}
  };
  return <div className="dashboard today-dashboard" id="top">
    <header className="today-header"><div><span className="today-eyebrow">{welcome?.date.toLocaleUpperCase("tr-TR")??"BUGÜN"}</span><h1>{welcome?`${welcome.greeting}${teacherDisplayName.trim()?`, ${teacherDisplayName.trim()}`:""}.`:"Öğretmen çalışma alanı"}</h1><p>{!ready||!now?"Günün hazırlanıyor…":!timetable.slots.length?"Ders programını ekleyerek güne başla.":recordState==="loading"?`Bugün ${lessons.length} dersin var. Plan kayıtları kontrol ediliyor…`:`Bugün ${lessons.length} dersin var, ${pending.length} dersin hazırlık bekliyor.`}</p></div><div className="today-notifications"><button className="today-icon-button" aria-label={attention.length?`${attention.length} ders hazırlık bekliyor`:"Bildirimler"} aria-expanded={notifications} aria-controls="today-notifications" onClick={()=>setNotifications(!notifications)}><Bell size={21}/>{attention.length>0&&<span className="today-badge">{pending.length}</span>}</button>{notifications&&<div id="today-notifications" className="today-notification-menu"><strong>Bildirimler</strong><p>{recordState==="error"?"Plan kayıtları doğrulanamadı.":pending.length?`${pending.length} ders için plan hazırlığı bekliyor. Ayrıntılar aşağıda.`:"Yeni bildirim yok."}</p></div>}</div></header>
    {!schedulingSubjects.length&&<p className="today-message">Ders programı için plan üretimi etkin bir branş seçilmelidir. Branşlarınızı Ayarlar bölümünden kontrol edebilirsiniz.</p>}
    {storageMessage&&<p className="today-message" role="alert">{storageMessage}</p>}
    {recordState==="error"&&<div className="today-message" role="alert"><span>Plan kayıtları açılamadı. Bağlı planların durumu doğrulanamadı.</span><button className="today-button outline" onClick={()=>{setRecordState("loading");setRetry(retry+1);}}>Yeniden dene</button></div>}
    <div className="today-columns">
      <section className="today-card today-lessons" aria-labelledby="today-lessons-title"><header><h2 id="today-lessons-title">Bugünün dersleri</h2><div className="today-card-actions"><button className="today-button" disabled={!ready||!now||!schedulingSubjects.length} onClick={()=>openProgram()}><Plus size={16}/>{timetable.slots.length?"Programı düzenle":"Ders programı ekle"}</button><button className="today-text-button" onClick={()=>onOpen("daily")}>Günlük Plan →</button></div></header>
      {!ready||!now?<p role="status">Ders programı yükleniyor…</p>:!timetable.slots.length?<div className="today-empty"><CalendarDays size={38}/><h3>Günün burada başlasın.</h3><p>Dersleri ekle, günlük plan kendiliğinden dolsun. Programdaki bir dersi açtığında tarih, sınıf ve ders seçimleri hazırlanır.</p><button className="today-button" onClick={()=>openProgram()}>Ders programını ekle</button></div>:!lessons.length?<div className="today-empty"><CalendarDays size={34}/><h3>Bugün programında ders yok.</h3><p>Haftalık programını düzenleyebilir veya yalnızca bugün için bir ders ekleyebilirsin.</p></div>:<ol className="today-lesson-list">{lessonRows.map(({slot,record,unitName,status})=><li key={slot.id}><time>{slot.time}</time><div className="today-lesson-copy"><strong>{slot.grade}/{slot.branch} · {unitName}</strong><span>{subjects.find(item=>item.code===slot.subjectCode)?.name??slot.subjectCode} · {record?.curriculum.outcomeCode??(slot.unitCode?`${slot.week}. hafta`:"Öğrenme çıktısı seçilecek")}</span><small>{status==="ready"?"Öğretmen onaylı plan":status==="draft"?(record?.status==="in_review"?"Öğretmen incelemesi bekliyor":"Ders tasarımı yarım"):status==="loading"?"Kayıt kontrol ediliyor…":status==="unverified"?"Bağlı kayıt doğrulanamadı":"Plan yok"}</small></div><button className={`today-button ${status==="ready"?"success":status==="draft"?"gold":"outline"}`} disabled={status==="loading"} onClick={()=>onOpenLesson(slot,date,record)}>{status==="ready"?"Hazır →":status==="draft"?"Tamamla":status==="loading"?"Kontrol ediliyor":status==="unverified"?"Kontrol et":"Tasarla"}</button></li>)}</ol>}
      {ready&&now&&schedulingSubjects.length>0&&<button className="today-add-lesson" onClick={()=>openProgram(true)}>Programında olmayan bir ders mi var? <strong>Ders ekle</strong></button>}
      </section>
      <section className="today-card today-attention" aria-labelledby="today-attention-title"><h2 id="today-attention-title">Dikkat gerektirenler</h2>{recordState==="loading"?<p role="status">Plan durumları kontrol ediliyor…</p>:attention.length?<ul>{attention.map(({slot,record,status})=><li key={slot.id} className={status==="missing"?"warning":""}><button onClick={()=>onOpenLesson(slot,date,record)}><strong>{status==="draft"?"Ders tasarımını tamamla":status==="unverified"?"Plan bağlantısını kontrol et":"Günlük planı hazırla"}</strong><span>{slot.time} · {slot.grade}/{slot.branch} · {subjects.find(item=>item.code===slot.subjectCode)?.name??slot.subjectCode}</span><ArrowRight size={18}/></button></li>)}</ul>:<div className="today-attention-empty"><Sparkles size={25}/><p>{recordState==="error"?"Kayıtlar doğrulandığında bekleyen dersler burada görünecek.":!timetable.slots.length?"Programını eklediğinde hazırlık bekleyen dersleri burada göreceksin.":"Bugün için bekleyen ders hazırlığı görünmüyor."}</p></div>}{pending.length>3&&<p className="today-attention-note">Diğer {pending.length-3} ders, bugünün dersleri listesinde.</p>}</section>
    </div>
    <section className="today-studio"><div><span className="today-eyebrow">DERS TASARIM STÜDYOSU</span><h2>Müfredattan 80 dakikalık akış üret.</h2><p>{lastRecord?`Son çalışma: ${lastRecord.curriculum.grade}. sınıf · ${recordTitle(lastRecord)} · ${lastRecord.lessonContext.week}. hafta`:"Bir ünite ve öğrenme çıktısı seçerek ilk ders tasarımını hazırla."}</p></div><div className="today-studio-actions"><button className="today-button gold" onClick={onNewDesign}>Yeni ders tasarımı</button>{lastRecord&&<button className="today-button outline" onClick={()=>onContinue(lastRecord)}>Devam et</button>}</div></section>
    <section className="today-tools" aria-labelledby="today-tools-title"><h2 id="today-tools-title">Diğer araçlar</h2><div>{tools.map(([key,title,Icon])=><button key={key} onClick={()=>onOpen(key,key==="resources"?"curriculum":undefined)}><Icon size={19}/>{title}<ArrowRight size={16}/></button>)}<a href="https://felsefe-odev-takibi.aytigin.chatgpt.site" target="_blank" rel="noopener noreferrer"><BookOpen size={19}/>Ödev ve Değerlendirme <ExternalLink size={16}/><span className="sr-only"> (yeni sekmede)</span></a></div></section>
    {now&&schedulingSubjects.length>0&&<TimetableDialog dialogRef={dialogRef} timetable={timetable} onSave={onSaveTimetable} subjects={schedulingSubjects} date={date} oneOff={oneOff}/>}
  </div>;
}
