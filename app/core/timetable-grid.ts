import type { TeachingTimetable, TeachingSlot } from "./teaching-timetable.ts";
export type TimetablePeriod={start:string;end:string;kind:"lesson"|"break"};
export const defaultTimetablePeriods:TimetablePeriod[]=[
 {start:"07:55",end:"08:35",kind:"lesson"},{start:"08:45",end:"09:25",kind:"lesson"},
 {start:"09:35",end:"10:15",kind:"lesson"},{start:"10:25",end:"11:05",kind:"lesson"},
 {start:"11:15",end:"11:55",kind:"lesson"},{start:"12:00",end:"12:40",kind:"lesson"},
 {start:"12:40",end:"13:25",kind:"break"},{start:"13:25",end:"14:05",kind:"lesson"},
 {start:"14:10",end:"14:50",kind:"lesson"},
];
export const weekDays=[{day:1,name:"Pazartesi"},{day:2,name:"Salı"},{day:3,name:"Çarşamba"},{day:4,name:"Perşembe"},{day:5,name:"Cuma"},{day:6,name:"Cumartesi"},{day:0,name:"Pazar"}];
export function validateTimetablePeriods(value:unknown):TimetablePeriod[]{
 if(!Array.isArray(value)||value.length<1||value.length>24)throw new Error("1–24 ders veya ara saati tanımlayın.");
 const time=/^([01]\d|2[0-3]):[0-5]\d$/;
 const periods=value.map((p:TimetablePeriod)=>{
  if(!p||!time.test(p.start)||!time.test(p.end)||p.end<=p.start||!["lesson","break"].includes(p.kind))throw new Error("Başlangıç/bitiş saatlerini ve ders/ara türünü kontrol edin.");
  return {start:p.start,end:p.end,kind:p.kind};
 }).sort((a,b)=>a.start.localeCompare(b.start));
 if(!periods.some(p=>p.kind==="lesson"))throw new Error("En az bir ders saati tanımlayın.");
 for(let i=1;i<periods.length;i++)if(periods[i].start<periods[i-1].end)throw new Error("Ders ve ara saatleri çakışmamalı.");
 return periods;
}
export function weeklyTimetableColumns(timetable:TeachingTimetable){
 const periods=timetable.periods??defaultTimetablePeriods;
 const columns:({start:string;end:string;kind:"lesson"|"break";extra?:boolean})[]=periods.map(p=>({...p}));
 for(const slot of timetable.slots.filter(s=>!s.date))if(!columns.some(p=>p.kind==="lesson"&&p.start===slot.time))columns.push({start:slot.time,end:"",kind:"lesson",extra:true});
 return columns.sort((a,b)=>a.start.localeCompare(b.start)||a.kind.localeCompare(b.kind));
}
export function weeklyCellSlots(slots:TeachingSlot[],weekday:number,time:string){return slots.filter(s=>!s.date&&s.weekday===weekday&&s.time===time);}
