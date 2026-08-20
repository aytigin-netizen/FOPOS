"use client";

import { Plus, ShieldAlert, Trash2, Upload, UsersRound } from "lucide-react";
import { useState } from "react";
import type { ManagedStudentRoster } from "../../core/managed-student-roster";
import { createManagedRoster } from "../../core/managed-student-roster";
import { createStudentRosterTransfer, type StudentRosterTransfer } from "../../core/student-roster-transfer";
import { readStudentSpreadsheet } from "../../core/student-spreadsheet-import";
import { StudentImportPreview } from "../../components/student-import/StudentImportPreview";
import type { ClassWorkspaceContext } from "../../core/class-workspace";
import {
  assertStudentImportWorkspace,
  bindStudentImportToWorkspace,
  type ClassBoundStudentImport,
} from "../../core/class-bound-student-import";

export default function StudentRostersModule({ classContext, subjectName, rosters, onChange, onTransfer }: { classContext: ClassWorkspaceContext; subjectName: string; rosters: ManagedStudentRoster[]; onChange: (rosters: ManagedStudentRoster[]) => void; onTransfer: (transfer: StudentRosterTransfer, target: "analysis" | "performance") => void }) {
  const [title, setTitle] = useState(""), grade = classContext.grade, branch = classContext.branchCode, [pastedRows, setPastedRows] = useState(""), [message, setMessage] = useState(""), [deleteConfirmedId, setDeleteConfirmedId] = useState<string | null>(null), [filePreview, setFilePreview] = useState<ClassBoundStudentImport | null>(null);
  const addRoster = () => { try { const roster = createManagedRoster({ title, grade, branch, pastedRows }); if (rosters.some((item) => item.grade === grade && item.branch === branch)) throw new Error(`${grade}-${branch} için zaten bir oturum listesi var.`); onChange([...rosters, roster]); setTitle(""); setPastedRows(""); setMessage(`${roster.title}: ${roster.students.length} öğrenci eklendi.`); } catch (error) { setMessage(error instanceof Error ? error.message : "Liste oluşturulamadı."); } };
  const transfer = (roster: ManagedStudentRoster, target: "analysis" | "performance") => onTransfer(createStudentRosterTransfer({ grade: roster.grade, branch: roster.branch, students: roster.students }), target);
  const selectFile = async (file: File) => { try { setFilePreview(bindStudentImportToWorkspace(await readStudentSpreadsheet(file), classContext)); setMessage(`${file.name}: ${classContext.academicYear} • ${grade}-${branch} için güvenli önizleme hazır.`); } catch (error) { setFilePreview(null); setMessage(error instanceof Error ? error.message : "Dosya okunamadı."); } };
  const confirmFile = () => { if (!filePreview) return; try { assertStudentImportWorkspace(filePreview, classContext); const rows = filePreview.rows.slice(filePreview.headerRow + 1).filter((row)=>row.some(Boolean)).map((row,index)=>{const no=row[filePreview.numberColumn]||"",name=row[filePreview.nameColumn]||"";if(!no||!name)throw new Error(`${filePreview.headerRow+index+2}. satırda öğrenci numarası veya ad soyad eksik.`);return `${no};${name}`}); const roster=createManagedRoster({title,grade,branch,pastedRows:rows.join("\n")});if(rosters.some((item)=>item.grade===grade&&item.branch===branch))throw new Error(`${grade}-${branch} için zaten bir oturum listesi var.`);onChange([...rosters,roster]);setFilePreview(null);setTitle("");setPastedRows("");setMessage(`${roster.title}: ${roster.students.length} öğrenci dosyadan öğretmen onayıyla eklendi.`)}catch(error){setMessage(error instanceof Error?error.message:"Dosya listesi oluşturulamadı.")}};
  return <section className="rosters-module" id="top" data-sensitive-session={rosters.length > 0 || pastedRows.trim() || filePreview ? "active" : "inactive"}>
    <section className="annual-hero">
<div>
<span className="eyebrow">
<UsersRound size={15}/> FOPOS • Öğrenci Listeleri</span>
<h1>Sınıf listelerini<br/>
<em>bağlamında yönetin.</em>
</h1>
<p>Numara ve ad-soyad bilgilerini yalnız bu oturumda sınıf/şubeye bağlayın; gerektiğinde hedef modüle öğretmen kararıyla gönderin.</p>
</div>
<div className="builder-card">
<div className="card-heading">
<span className="step-badge">01</span>
<div>
<h2>Yeni oturum listesi</h2>
<p>Satır yapıştırın veya güvenli dosya seçin</p>
</div>
</div>
<label className="field">
<span>Liste adı</span>
<input value={title} onChange={(event)=>setTitle(event.target.value)} placeholder={`Örn. ${grade}-${branch} ${subjectName}`}/>
</label>
<div className="performance-context-grid">
<label className="field">
<span>Sınıf</span>
<select value={grade} disabled>
<option value={grade}>{grade}. Sınıf</option>
</select>
</label>
<label className="field">
<span>Şube</span>
<select value={branch} disabled>
<option value={branch}>{branch}</option>
</select>
</label>
</div>
<label className="field">
<span>Öğrenci satırları</span>
<textarea value={pastedRows} onChange={(event)=>setPastedRows(event.target.value)} placeholder={"101;Ada Yılmaz\n102;Deniz Kaya"}/>
</label>
<label className="upload-button roster-upload">
<Upload size={16}/> XLS, XLSX veya CSV seç<input aria-label="Öğrenci listeleri dosyası" data-testid="roster-file-input" type="file" accept=".xls,.xlsx,.csv" onChange={(event)=>{const file=event.target.files?.[0];event.currentTarget.value="";if(file)void selectFile(file)}}/>
</label>{filePreview?<StudentImportPreview preview={filePreview} contextLabel={`${filePreview.academicYear} • ${filePreview.grade}-${filePreview.branch}`} onChange={(next)=>setFilePreview({...filePreview,...next})} onCancel={()=>{setFilePreview(null);setMessage("Dosya önizlemesi iptal edildi.")}} onConfirm={confirmFile}/>:null}<div className="calendar-note meeting-warning">
<ShieldAlert size={18}/>
<div>
<strong>Oturum belleği</strong>
<span>Listeler kalıcı depoya ve harici servise gönderilmez. Puan, sağlık veya BEP bilgisi girmeyin.</span>
</div>
</div>
<button type="button" className="primary-button" onClick={addRoster}>
<Plus size={17}/> Yapıştırılan satırlardan liste oluştur</button>{message&&<small className="import-status" role="status">{message}</small>}</div>
</section>
    <section className="results-section">
<div className="results-header">
<div>
<span className="review-pill">OTURUM LİSTELERİ</span>
<h2>Sınıf ve şube listeleri</h2>
<p>{rosters.length} liste • {rosters.reduce((sum,item)=>sum+item.students.length,0)} öğrenci kaydı</p>
</div>
</div>{rosters.length===0?<div className="performance-empty">
<UsersRound size={30}/>
<h3>Henüz oturum listesi yok</h3>
<p>İlk listeyi oluşturduğunuzda burada sınıf ve şube bağlamıyla görünür.</p>
</div>:<div className="roster-list">{rosters.map((roster)=>
<article key={roster.id}>
<div>
<strong>{roster.title}</strong>
<span>{roster.grade}-{roster.branch} • {roster.students.length} öğrenci</span>
<small>Yalnız numara ve ad-soyad</small>
</div>
<div className="roster-actions">
<button type="button" className="secondary-button" onClick={()=>transfer(roster,"analysis")}>Sınav Analizine gönder</button>
<button type="button" className="secondary-button" onClick={()=>transfer(roster,"performance")}>Öğrenci Performansına gönder</button>
<label>
<input type="checkbox" checked={deleteConfirmedId===roster.id} onChange={(event)=>setDeleteConfirmedId(event.target.checked?roster.id:null)}/> Silmeyi onayla</label>
<button type="button" className="row-delete" disabled={deleteConfirmedId!==roster.id} onClick={()=>{onChange(rosters.filter((item)=>item.id!==roster.id));setDeleteConfirmedId(null)}} aria-label={`${roster.title} listesini sil`}>
<Trash2 size={16}/>
</button>
</div>
</article>)}</div>}</section>
  </section>;
}
