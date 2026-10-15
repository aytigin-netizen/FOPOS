"use client";
import { useState } from "react";
import { defaultTimetablePeriods, validateTimetablePeriods, type TimetablePeriod } from "../../core/timetable-grid";
export function TimetableHoursEditor({periods,onSave,onClose}:{periods?:TimetablePeriod[];onSave:(periods:TimetablePeriod[])=>Promise<boolean>;onClose:()=>void}){
 const [rows,setRows]=useState<TimetablePeriod[]>(()=>[...(periods??defaultTimetablePeriods)].map(p=>({...p})));
 const [busy,setBusy]=useState(false),[message,setMessage]=useState("");
 function update(index:number,patch:Partial<TimetablePeriod>){setRows(rows.map((p,i)=>i===index?{...p,...patch}:p));}
 return <section className="weekly-hours-editor" aria-label="Ders ve ara saatleri"><h3>Ders ve ara saatleri</h3><p>Okulunuzun saatlerini girin. Mevcut dersler taşınmaz veya silinmez; yeni saatlere uymayanlar çizelgede “Ek saat” olarak görünür.</p>
  <form onSubmit={async event=>{event.preventDefault();try{const safe=validateTimetablePeriods(rows);setBusy(true);if(await onSave(safe))onClose();else setMessage("Saatler kaydedilemedi. Bağlantınızı kontrol edin.");}catch(error){setMessage(error instanceof Error?error.message:"Saatleri kontrol edin.");}finally{setBusy(false);}}}>
   <fieldset disabled={busy}><legend className="sr-only">Saat aralıkları</legend>{rows.map((p,index)=><div className="weekly-hours-row" key={index}><label>Tür<select value={p.kind} onChange={e=>update(index,{kind:e.target.value as TimetablePeriod["kind"]})}><option value="lesson">Ders</option><option value="break">Ara</option></select></label><label>Başlangıç<input type="time" value={p.start} required onChange={e=>update(index,{start:e.target.value})}/></label><label>Bitiş<input type="time" value={p.end} required onChange={e=>update(index,{end:e.target.value})}/></label><button type="button" className="today-button outline" aria-label={`${index+1}. saat aralığını kaldır`} onClick={()=>setRows(rows.filter((_,i)=>i!==index))}>Kaldır</button></div>)}
   <div className="timetable-actions"><button type="button" disabled={rows.length>=24} className="today-button outline" onClick={()=>setRows([...rows,{start:"",end:"",kind:"lesson"}])}>Saat aralığı ekle</button><button className="today-button" type="submit">Saatleri kaydet</button><button type="button" className="today-button outline" onClick={onClose}>Vazgeç</button></div></fieldset>
  </form><p role="status">{message}</p>
 </section>;
}
