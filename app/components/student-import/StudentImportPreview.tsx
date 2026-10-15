"use client";

import { Trash2 } from "lucide-react";
import { assertStudentColumnMapping, mappedStudentName, type StudentSpreadsheetPreview } from "../../core/student-spreadsheet-import";

export function StudentImportPreview({ preview, contextLabel, onChange, onCancel, onConfirm, allowTotal = true }: { preview: StudentSpreadsheetPreview; contextLabel: string; onChange: (preview: StudentSpreadsheetPreview) => void; onCancel: () => void; onConfirm: () => void; allowTotal?: boolean }) {
  const columnCount = Math.max(...preview.rows.map((row) => row.length), 0);
  const options = Array.from({ length: columnCount }, (_, index) => <option key={index} value={index}>{index + 1}. sütun • {preview.columnLabels[index] || "Başlıksız"}</option>);
  const separate = preview.nameMode === "separate";
  const studentRows = preview.rows.slice(preview.headerRow + 1).filter(row => /^\d+$/.test(row[preview.numberColumn] ?? "")).slice(0, 5);
  let mappingError = "";
  try { assertStudentColumnMapping(preview, allowTotal); } catch (error) { mappingError = error instanceof Error ? error.message : "Sütun eşlemesini kontrol edin."; }
  return <section className="import-preview" data-testid="student-import-preview" aria-labelledby="shared-import-preview-title">
    <div className="import-preview-heading"><div><strong id="shared-import-preview-title">İçe aktarma önizlemesi</strong><span>{preview.fileName} • {contextLabel} • Henüz öğrenci listesine uygulanmadı</span></div><button type="button" className="row-delete" onClick={onCancel} aria-label="İçe aktarma önizlemesini iptal et"><Trash2 size={15}/></button></div>
    <div className="import-mapping-grid">
      <label className="field"><span>Başlık satırı</span><input type="number" min={1} max={preview.rows.length} value={preview.headerRow + 1} onChange={event=>{const headerRow=Number(event.target.value)-1;onChange({...preview,headerRow,columnLabels:Array.from({length:columnCount},(_,index)=>preview.rows[headerRow]?.[index]||"Başlıksız")});}}/></label>
      <label className="field"><span>Ad ve soyad düzeni</span><select value={separate ? "separate" : "combined"} onChange={event=>onChange({...preview,nameMode:event.target.value as "combined"|"separate"})}><option value="combined">Ad-soyad tek sütunda</option><option value="separate">Ad ve soyad ayrı sütunlarda</option></select></label>
      <label className="field"><span>Öğrenci numarası sütunu</span><select value={preview.numberColumn} onChange={(event)=>onChange({ ...preview, numberColumn:Number(event.target.value) })}><option value={-1}>Sütun seçin</option>{options}</select></label>
      <label className="field"><span>{separate ? "Adı sütunu" : "Ad-soyad sütunu"}</span><select value={preview.nameColumn} onChange={(event)=>onChange({ ...preview, nameColumn:Number(event.target.value) })}><option value={-1}>Sütun seçin</option>{options}</select></label>
      {separate&&<label className="field"><span>Soyadı sütunu</span><select value={preview.surnameColumn ?? -1} onChange={event=>onChange({...preview,surnameColumn:Number(event.target.value)})}><option value={-1}>Sütun seçin</option>{options}</select></label>}
      {allowTotal&&<label className="field"><span>E-Okul toplam puanı (isteğe bağlı)</span><select value={preview.totalColumn} onChange={(event)=>onChange({ ...preview, totalColumn:Number(event.target.value) })}><option value={-1}>Toplam puanı alma</option>{options}</select></label>}
    </div>
    {separate&&<p className="import-name-note">Adı ve soyadı seçilen sütunlardan birleştirilir; birden fazla isim ve Türkçe karakterler korunur.</p>}
    <div className={`import-preview-table ${allowTotal ? "import-preview-table--scores" : ""}`} role="table" aria-label="İlk beş öğrenci satırı önizlemesi"><div role="row"><strong role="columnheader">Öğrenci numarası</strong><strong role="columnheader">Ad soyad</strong>{allowTotal&&<strong role="columnheader">E-Okul toplamı</strong>}</div>{studentRows.map((row,index)=><div role="row" key={index}><span role="cell">{row[preview.numberColumn]||"Eksik"}</span><span role="cell">{mappedStudentName(preview,row)||"Eksik"}</span>{allowTotal&&<span role="cell">{preview.totalColumn>=0?row[preview.totalColumn]||"Boş":"Alınmayacak"}</span>}</div>)}</div>
    {mappingError&&<p role="status" className="import-name-note">{mappingError}</p>}
    <div className="import-preview-actions"><span>Önizlemede yalnız numara ve ad-soyad gösterilir{allowTotal ? "; E-Okul toplamı ayrı bir kontrol değeridir. Toplam puan soru puanlarına dağıtılmaz." : ". Cinsiyet, pansiyon durumu ve özet satırları öğrenci kaydına aktarılmaz."}</span><button type="button" className="primary-button" disabled={Boolean(mappingError)} onClick={onConfirm}>Eşlemeyi onayla ve içe aktar</button></div>
  </section>;
}
