"use client";
import { useState, type RefObject, type FormEvent } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { getCurriculumContext } from "../../data/curriculum-runtime";
import { getLessonStudioWeekCountByProgramRule } from "../../modules/lesson-studio/lesson-studio-week-count";
import type { Unit } from "../../data/curriculum";
import type { SchoolGrade } from "../../core/class-workspace";
import { classProductsAvailable, rosterSchoolGrades } from "../../core/class-course-catalog";
import type { SchoolType } from "../../../src/core/curriculum/package-types";
import { slotsOverlap, type TeachingTimetable, type TeachingSlot } from "../../core/teaching-timetable";
export const days = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];

export function TimetableDialog({dialogRef, timetable, onSave, subjects, date, oneOff}: {
  dialogRef: RefObject<HTMLDialogElement | null>;
  timetable: TeachingTimetable;
  onSave: (next: TeachingTimetable) => boolean;
  subjects: {code:string;name:string}[];
  date:string;
  oneOff:boolean;
}) {
  const [subject, setSubject] = useState(subjects[0]?.code ?? "philosophy");
  const [schoolType, setSchoolType] = useState<SchoolType>("general_secondary");
  const [grade, setGrade] = useState<SchoolGrade>(10);
  const [unitCode, setUnitCode] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  let gradeUnits: Unit[] = [];
  try {if(classProductsAvailable({subjectCode:subject,grade}))gradeUnits=getCurriculumContext(subject,schoolType).units.filter(unit=>unit.grade===grade);}catch{/* Program kaydı içerik paketine bağlı değildir. */}
  const selectedUnit = gradeUnits.find(unit => unit.code === unitCode);
  const maxWeeks = selectedUnit ? getLessonStudioWeekCountByProgramRule(selectedUnit.hours, subject) : 1;
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const slot: TeachingSlot = { id:editing ?? crypto.randomUUID(), weekday:Number(fields.get("weekday")), time:String(fields.get("time")), grade, branch:String(fields.get("branch")).trim().toLocaleUpperCase("tr-TR"), subjectCode:subject, schoolType, unitCode, week:Number(fields.get("week") ?? 1), ...(fields.get("oneOff") ? {date:selected?.date ?? date} : {}) };
    if (!slot.branch) { setMessage("Şube bilgisini girin."); return; }
    if(slot.date)slot.weekday=new Date(`${slot.date}T12:00:00Z`).getUTCDay();
    const collision = timetable.slots.some(item => slotsOverlap(item,slot));
    if (collision) {setMessage("Bu gün ve saatte zaten bir ders var. Mevcut satırı düzenleyin veya farklı bir saat seçin.");return;}
    const next = {...timetable, slots:[...timetable.slots.filter(item => item.id !== editing),slot], bindings:timetable.bindings.filter(item => item.slotId !== editing)};
    if (!onSave(next)) {setMessage("Kaydedilemedi. Depolama iznini kontrol edin.");return;}
    setEditing(null);
    event.currentTarget.reset();
    setMessage("Ders kaydedildi. Başka bir ders ekleyebilir veya programı kapatabilirsiniz.");
  }
  function edit(slot: TeachingSlot) {
    if(!subjects.some(subject=>subject.code===slot.subjectCode)){setMessage("Bu ders etkin branşlarınızda bulunmuyor. Gerekirse kaydı kaldırıp yeniden ekleyin.");return;}
    setSubject(slot.subjectCode);setSchoolType(slot.schoolType);setGrade(slot.grade);setUnitCode(slot.unitCode);setEditing(slot.id);setMessage("");
  }
  function remove(slot:TeachingSlot) {
    if (!window.confirm(`${slot.grade}/${slot.branch} · ${slot.time} dersi programdan kaldırılsın mı? Plan kayıtları korunur.`)) return;
    if(onSave({...timetable,slots:timetable.slots.filter(item=>item.id!==slot.id),bindings:timetable.bindings.filter(item=>item.slotId!==slot.id)})) {if(editing===slot.id)setEditing(null);setMessage("Ders programdan kaldırıldı.");}
  }
  const selected = timetable.slots.find(slot=>slot.id===editing);
  return <dialog ref={dialogRef} className="timetable-dialog" aria-labelledby="timetable-title">
    <header><div><span className="today-eyebrow">HAFTALIK PROGRAM</span><h2 id="timetable-title">Ders programını düzenle</h2></div><button type="button" className="today-icon-button" aria-label="Programı kapat" onClick={()=>dialogRef.current?.close()}><X size={22}/></button></header>
    <p>Program bu tarayıcıda, hesabınız ve öğretim yılınız için saklanır. Diğer cihazlara aktarılmaz.</p>
    <form onSubmit={submit} key={editing ?? `new-${oneOff}`} className="timetable-form">
      <label>Gün<select name="weekday" defaultValue={selected?.weekday ?? new Date(`${date}T12:00:00Z`).getUTCDay()} required>{days.map((day,index)=><option key={day} value={index}>{day}</option>)}</select></label>
      <label>Ders saati<input name="time" type="time" required defaultValue={selected?.time ?? "08:30"}/></label>
      <label>Ders<select value={subject} onChange={event=>{const code=event.target.value;setSubject(code);setUnitCode("");}}>{subjects.map(item=><option key={item.code} value={item.code}>{item.name}</option>)}</select></label>
      <label>Okul türü<select value={schoolType} onChange={event=>{setSchoolType(event.target.value as SchoolType);setUnitCode("");}}><option value="general_secondary">Genel ortaöğretim</option><option value="social_sciences_high_school">Sosyal bilimler lisesi</option></select></label>
      <label>Sınıf<select value={grade} onChange={event=>{setGrade(Number(event.target.value) as SchoolGrade);setUnitCode("");}}>{rosterSchoolGrades.map(value=><option key={value} value={value}>{value}. sınıf</option>)}</select></label>
      <label>Şube<input name="branch" required maxLength={20} placeholder="Örn. A" defaultValue={selected?.branch ?? ""}/></label>
      <label className="timetable-wide">Ünite <span>(isteğe bağlı)</span><select disabled={!gradeUnits.length} value={unitCode} onChange={event=>setUnitCode(event.target.value)}><option value="">{gradeUnits.length?"Dersi tasarlarken seç":"Yalnız ders programı kaydı"}</option>{gradeUnits.map(unit=><option key={unit.code} value={unit.code}>{unit.name}</option>)}</select></label>
      <label>Ünite içindeki hafta<select disabled={!gradeUnits.length} name="week" key={`${unitCode}-${editing}`} defaultValue={selected?.week && selected.week<=maxWeeks ? selected.week : 1}>{Array.from({length:maxWeeks},(_,index)=><option key={index} value={index+1}>{index+1}. hafta</option>)}</select></label>
      <label className="timetable-check"><input name="oneOff" type="checkbox" defaultChecked={Boolean(selected?.date) || (!editing && oneOff)}/>Yalnız bu tarih ({selected?.date ?? date})</label>
      <div className="timetable-wide timetable-actions"><button type="submit" className="today-button"><Plus size={17}/>{editing ? "Değişiklikleri kaydet" : "Dersi programa ekle"}</button>{editing&&<button type="button" className="today-button outline" onClick={()=>setEditing(null)}>Vazgeç</button>}</div>
    </form>
    {!gradeUnits.length&&<p>Bu ders ve sınıf için ünite seçmeden program kaydı oluşturabilirsiniz. Bu kayıt içerik üretimini etkinleştirmez.</p>}
    <p role="status" aria-live="polite">{message}</p>
    <h3>Programdaki dersler</h3>
    {timetable.slots.length ? <ul className="timetable-list">{[...timetable.slots].sort((a,b)=>a.weekday-b.weekday||a.time.localeCompare(b.time)).map(slot=><li key={slot.id}><div><strong>{slot.date ?? days[slot.weekday]} · {slot.time} · {slot.grade}/{slot.branch}</strong><span>{subjects.find(item=>item.code===slot.subjectCode)?.name ?? slot.subjectCode}</span></div><button type="button" className="today-button outline" onClick={()=>edit(slot)}>Düzenle</button><button type="button" className="today-icon-button" aria-label={`${slot.grade}/${slot.branch} ${slot.time} dersini kaldır`} onClick={()=>remove(slot)}><Trash2 size={18}/></button></li>)}</ul> : <p>Henüz ders eklenmedi.</p>}
    <div className="timetable-actions"><button type="button" className="today-button" onClick={()=>dialogRef.current?.close()}>Programı kapat</button></div>
  </dialog>;
}
