"use client";

import { Plus, Save, ShieldAlert, Trash2, Upload, UsersRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ManagedStudentRoster } from "../../core/managed-student-roster";
import { createManagedRoster } from "../../core/managed-student-roster";
import { classProductsAvailable } from "../../core/class-course-catalog";
import { validateRosterInput } from "../../core/saved-student-roster";
import { createStudentRosterTransfer, type StudentRosterTransfer } from "../../core/student-roster-transfer";
import { mappedStudentRows, readStudentSpreadsheet } from "../../core/student-spreadsheet-import";
import { StudentImportPreview } from "../../components/student-import/StudentImportPreview";
import type { ClassWorkspaceContext } from "../../core/class-workspace";
import { assertStudentImportWorkspace, bindStudentImportToWorkspace, type ClassBoundStudentImport } from "../../core/class-bound-student-import";

export default function StudentRostersModule({classContext,subjectName,rosters,onChange,onTransfer}:{classContext:ClassWorkspaceContext;subjectName:string;rosters:ManagedStudentRoster[];onChange:(rosters:ManagedStudentRoster[])=>void;onTransfer:(transfer:StudentRosterTransfer,target:"analysis"|"performance")=>void}){
  const grade = classContext.grade,branch=classContext.branchCode;
  const [draft,setDraft]=useState<ManagedStudentRoster|null>(rosters.find(item=>item.grade===grade&&item.branch===branch)??null);
  const [revision,setRevision]=useState(draft?.revision??0);
  const [title,setTitle]=useState(""),[pastedRows,setPastedRows]=useState(""),[message,setMessage]=useState("");
  const [filePreview,setFilePreview]=useState<ClassBoundStudentImport|null>(null);
  const [deleteConfirmedId,setDeleteConfirmedId]=useState<string|null>(null);
  const [loading,setLoading]=useState(true),[loadFailed,setLoadFailed]=useState(false),[busy,setBusy]=useState(false),[reload,setReload]=useState(0);
  const alive=useRef(true);
  useEffect(()=>{alive.current=true;return()=>{alive.current=false;};},[]);
  useEffect(()=>{
    const controller=new AbortController();
    const retained=draft?.dirty?draft:null;
    void fetch(`/api/student-rosters?classId=${encodeURIComponent(classContext.id)}`,{cache:"no-store",signal:controller.signal}).then(async response=>{
      const payload=await response.json() as {roster:ManagedStudentRoster|null;revision:number;error?:string};
      if(!response.ok)throw new Error(payload.error??"Liste açılamadı.");
      if(controller.signal.aborted)return;
      const next=retained??payload.roster;
      setDraft(next);setRevision(retained?retained.revision??0:payload.revision);onChange(next?[next]:[]);setLoadFailed(false);
      setMessage(retained?"Kaydedilmemiş değişiklikleriniz korunuyor. Hesaba yazmak için kaydedin.":payload.roster?"Öğrenci listeniz hesabınızdan açıldı.":"Bu sınıf için henüz kaydedilmiş liste yok.");
    }).catch(error=>{if(!controller.signal.aborted){setLoadFailed(true);setMessage(error instanceof Error?error.message:"Liste açılamadı.");}}).finally(()=>{if(!controller.signal.aborted)setLoading(false);});
    return()=>controller.abort();
    // The parent callback updates session memory; it must not trigger another read.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[classContext.id,reload]);
  function update(next:ManagedStudentRoster){const changed={...next,revision,dirty:true};setDraft(changed);onChange([changed]);setMessage("Kaydedilmemiş değişiklikler var. Öğrenci listesini kaydedin.");}
  function stage(roster:ManagedStudentRoster){
    if(draft&&!window.confirm("Yüklü liste yeni satırlarla değiştirilecek. Hesaptaki kayıt yalnız Kaydet düğmesine bastığınızda güncellenir. Devam edilsin mi?"))return;
    update(roster);setTitle("");setPastedRows("");setFilePreview(null);
  }
  function addRoster(){try{stage(createManagedRoster({title:title.trim()||`${grade}-${branch} ${subjectName}`,grade,branch,pastedRows}));}catch(error){setMessage(error instanceof Error?error.message:"Liste oluşturulamadı.");}}
  async function selectFile(file:File){try{const preview=await readStudentSpreadsheet(file);if(alive.current){setFilePreview(bindStudentImportToWorkspace(preview,classContext));setMessage("Dosya önizlemesi hazır. Onaydan sonra listeyi ayrıca kaydedin.");}}catch(error){if(alive.current){setFilePreview(null);setMessage(error instanceof Error?error.message:"Dosya okunamadı.");}}}
  function confirmFile(){if(!filePreview)return;try{assertStudentImportWorkspace(filePreview,classContext);const rows=mappedStudentRows(filePreview).map(({no,name})=>`${no};${name}`);stage(createManagedRoster({title:title.trim()||`${grade}-${branch} ${subjectName}`,grade,branch,pastedRows:rows.join("\n")}));}catch(error){setMessage(error instanceof Error?error.message:"Dosya listesi oluşturulamadı.");}}
  async function save(){if(!draft)return;setBusy(true);try{
    const roster=validateRosterInput(draft);
    const response=await fetch("/api/student-rosters",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({classId:classContext.id,expectedRevision:revision,roster})});
    const payload=await response.json() as {roster:ManagedStudentRoster;revision:number;error?:string};
    if(!response.ok)throw new Error(payload.error??"Liste kaydedilemedi.");
    if(!payload.roster)throw new Error("Liste başka bir ekranda silindi. Hesaptaki güncel listeyi yeniden açın.");
    if(!alive.current)return;
    setDraft(payload.roster);setRevision(payload.revision);onChange([payload.roster]);setMessage("Öğrenci listesi hesabınıza kaydedildi. Sayfayı kapatabilir veya başka cihazdan açabilirsiniz.");
  }catch(error){if(alive.current)setMessage(error instanceof Error?error.message:"Liste kaydedilemedi.");}finally{if(alive.current)setBusy(false);}}
  async function remove(){if(!draft||deleteConfirmedId!==draft.id)return;
    if(!revision){setDraft(null);onChange([]);setDeleteConfirmedId(null);setMessage("Kaydedilmemiş liste kaldırıldı.");return;}
    setBusy(true);try{
      const response=await fetch("/api/student-rosters",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({classId:classContext.id,expectedRevision:revision})});
      const payload=await response.json() as {revision:number;error?:string};if(!response.ok)throw new Error(payload.error??"Liste silinemedi.");
      if(!alive.current)return;setDraft(null);setRevision(payload.revision);onChange([]);setDeleteConfirmedId(null);setMessage("Öğrenci listesi hesabınızdan silindi. Sınav Analizi'ne daha önce aktarılan oturum kopyaları ayrıca temizlenmelidir.");
    }catch(error){if(alive.current)setMessage(error instanceof Error?error.message:"Liste silinemedi.");}finally{if(alive.current)setBusy(false);}
  }
  function reopen(){if((draft?.dirty||pastedRows||filePreview)&&!window.confirm("Kaydedilmemiş değişiklikler bırakılıp hesaptaki güncel liste açılsın mı?"))return;setDraft(null);onChange([]);setFilePreview(null);setPastedRows("");setLoading(true);setReload(reload+1);}
  function transfer(roster:ManagedStudentRoster,target:"analysis"|"performance"){onTransfer(createStudentRosterTransfer({grade:roster.grade,branch:roster.branch,students:roster.students}),target);}
  return <section className="rosters-module" id="top" data-sensitive-session={draft?.dirty||pastedRows.trim()||filePreview?"active":"inactive"}>
    <header className="annual-hero"><div><span className="eyebrow"><UsersRound size={15}/> FOPOS • Öğrenci Listeleri</span><h1>Sınıf listeleriniz<br/><em>hesabınızda saklanır.</em></h1><p>{classContext.academicYear} · {grade}/{branch} · {subjectName}. Numara ve ad-soyad bilgilerini kaydedip başka cihazdan yeniden açabilirsiniz.</p></div></header>
    <p className="import-status" role="status" aria-live="polite">{loading?"Kayıtlı öğrenci listesi açılıyor…":message}</p>
    <button className="secondary-button" type="button" disabled={loading||busy} onClick={reopen}>Hesaptaki güncel listeyi yeniden aç</button>
    <fieldset disabled={loading||busy||loadFailed} className="persistent-roster-fields">
      <section className="builder-card"><h2>Liste yükle veya satır yapıştır</h2><label className="field"><span>Liste adı (isteğe bağlı)</span><input value={title} onChange={event=>setTitle(event.target.value)} placeholder={`${grade}-${branch} ${subjectName}`}/></label><label className="field"><span>Öğrenci satırları</span><textarea value={pastedRows} onChange={event=>setPastedRows(event.target.value)} placeholder={"101;Ada Yılmaz\n102;Deniz Kaya"}/></label>
      <label className="upload-button roster-upload"><Upload size={16}/> XLS, XLSX veya CSV seç<input aria-label="Öğrenci listeleri dosyası" data-testid="roster-file-input" type="file" accept=".xls,.xlsx,.csv" onChange={event=>{const file=event.target.files?.[0];event.currentTarget.value="";if(file)void selectFile(file);}}/></label>
      {filePreview&&<StudentImportPreview allowTotal={false} preview={filePreview} contextLabel={`${filePreview.academicYear} • ${filePreview.grade}-${filePreview.branch}`} onChange={next=>setFilePreview({...filePreview,...next})} onCancel={()=>{setFilePreview(null);setMessage("Dosya önizlemesi iptal edildi.");}} onConfirm={confirmFile}/>}
      <button className="secondary-button" type="button" onClick={addRoster}><Plus size={17}/> Yapıştırılan satırlardan liste oluştur</button>
      <div className="calendar-note meeting-warning"><ShieldAlert size={18}/><div><strong>Öğretmen hesabınıza bağlı kayıt</strong><span>Yalnız öğrenci kimliği, numara ve ad-soyad saklanır. Puan, sağlık veya BEP bilgisi girmeyin. Önizleme ve düzenlemeler Kaydet düğmesine kadar kalıcı değildir.</span></div></div></section>
      {draft?<section className="saved-roster-editor"><header><div><h2>{grade}/{branch} öğrenci listesi</h2><p>{draft.students.length} öğrenci · {draft.dirty?"Kaydedilmemiş değişiklikler":`Hesaba kaydedildi · Sürüm ${revision}`}</p></div><button className="secondary-button" type="button" onClick={()=>update({...draft,students:[...draft.students,{no:"",name:""}]})}><Plus size={17}/> Öğrenci ekle</button></header>
        <label className="field"><span>Kaydedilecek liste adı</span><input value={draft.title} onChange={event=>update({...draft,title:event.target.value})}/></label>
        <div className="roster-edit-grid">{draft.students.map((student,index)=><div key={student.id??`new-${index}`}><label className="field"><span>{index+1}. öğrenci numarası</span><input inputMode="numeric" maxLength={20} value={student.no} onChange={event=>update({...draft,students:draft.students.map((item,i)=>i===index?{...item,no:event.target.value}:item)})}/></label><label className="field"><span>Ad soyad</span><input maxLength={200} value={student.name} onChange={event=>update({...draft,students:draft.students.map((item,i)=>i===index?{...item,name:event.target.value}:item)})}/></label><button className="row-delete" type="button" aria-label={`${index+1}. öğrenciyi listeden çıkar`} onClick={()=>{if(window.confirm("Bu öğrenci listeden çıkarılsın mı? Değişiklik Kaydet ile uygulanır."))update({...draft,students:draft.students.filter((_,i)=>i!==index)});}}><Trash2 size={16}/></button></div>)}</div>
        <div className="roster-actions"><button className="secondary-button" type="button" disabled={!classProductsAvailable(classContext)} onClick={()=>transfer(draft,"analysis")}>Sınav Analizine gönder</button><button className="secondary-button" type="button" disabled={!classProductsAvailable(classContext)} onClick={()=>transfer(draft,"performance")}>Öğrenci Performansına gönder</button></div>
        {!classProductsAvailable(classContext)&&<p>Bu ders ve sınıf için öğrenci listesi kaydı açıktır. Analiz ve performans araçları, içerikleri doğrulandığında kullanılabilir.</p>}
        <div className="roster-delete-confirm"><label><input type="checkbox" checked={deleteConfirmedId===draft.id} onChange={event=>setDeleteConfirmedId(event.target.checked?draft.id:null)}/> Silmeyi onayla (hesaptaki öğrenci listesini kaldırır)</label><button className="secondary-button" type="button" disabled={deleteConfirmedId!==draft.id} onClick={()=>void remove()}><Trash2 size={16}/> Listeyi sil</button></div>
        <button className="primary-button" type="button" disabled={!draft.dirty} onClick={()=>void save()}><Save size={18}/> {busy?"Kaydediliyor…":"Öğrenci listesini kaydet"}</button>
      </section>:!loading&&<section className="performance-empty"><h2>Henüz kaydedilmiş öğrenci listesi yok</h2><p>Excel dosyasını yükleyip önizlemeyi onaylayın; ardından Öğrenci listesini kaydet düğmesine basın.</p></section>}
    </fieldset>
  </section>;
}
