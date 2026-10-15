"use client";
import { Plus } from "lucide-react";
import { weekDays, weeklyCellSlots, weeklyTimetableColumns } from "../../core/timetable-grid";
import type { TeachingSlot, TeachingTimetable } from "../../core/teaching-timetable";
import { classCourseName } from "../../core/class-course-catalog";
export function WeeklyTimetable({timetable,onEdit,onAdd,busy,today}:{timetable:TeachingTimetable;onEdit:(slot:TeachingSlot)=>void;onAdd:(day:number,time:string)=>void;busy:boolean;today:number}){
 const columns=weeklyTimetableColumns(timetable);
 let lesson=0;
 const headings=columns.map(p=>({...p,label:p.kind==="break"?"Öğle / ara":p.extra?"Ek saat":`${++lesson}. Ders`}));
 return <>
  <div className="weekly-program-summary"><span><strong>{timetable.slots.filter(s=>!s.date).length}</strong> haftalık ders</span><span>Boş hücreye dokunarak ders ekleyin.</span></div>
  <p id="weekly-grid-hint" className="weekly-grid-hint">Telefonda tabloyu sağa ve sola kaydırın. Saat aralıklarını “Ders ve ara saatleri” bölümünden değiştirebilirsiniz.</p>
  <div className="weekly-grid-scroll" role="region" aria-label="Haftalık ders programı tablosu" aria-describedby="weekly-grid-hint" tabIndex={0}>
   <table className="weekly-grid"><caption className="sr-only">Günlere ve ders saatlerine göre haftalık ders programı. Yalnız belirli tarihlere eklenen dersler aşağıda ayrı gösterilir.</caption>
    <thead><tr><th scope="col">Gün / Saat</th>{headings.map(p=><th key={`${p.kind}-${p.start}`} scope="col" className={p.kind==="break"?"weekly-break":""}><strong>{p.label}</strong><span>{p.start}{p.end?`–${p.end}`:""}</span></th>)}</tr></thead>
    <tbody>{weekDays.map(({day,name})=><tr key={day} className={day===today?"weekly-today":""}><th scope="row">{name}{day===today&&<small>Bugün</small>}</th>{headings.map(p=>{
     if(p.kind==="break")return <td className="weekly-break" key={`break-${p.start}`}><span>Ara</span></td>;
     const slots=weeklyCellSlots(timetable.slots,day,p.start);
     return <td key={`lesson-${p.start}`}>{slots.length?slots.map(slot=><button key={slot.id} type="button" disabled={busy} className="weekly-lesson" onClick={()=>onEdit(slot)} aria-label={`${name} ${p.start}, ${slot.grade}/${slot.branch}, ${classCourseName(slot.subjectCode)} dersini düzenle`}><strong>{slot.grade}/{slot.branch}</strong><span>{classCourseName(slot.subjectCode)}</span></button>):<button type="button" disabled={busy} className="weekly-empty" onClick={()=>onAdd(day,p.start)} aria-label={`${name} ${p.start} saatine ders ekle`}><Plus size={16}/><span className="sr-only">Ders ekle</span></button>}</td>;
    })}</tr>)}</tbody>
   </table>
  </div>
 </>;
}
