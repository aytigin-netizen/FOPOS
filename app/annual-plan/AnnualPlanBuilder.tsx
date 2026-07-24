"use client";

import { useState } from "react";
import { AnnualPlanExport } from "@/app/annual-plan/AnnualPlanExport";
import { createAnnualPlan, getAnnualPlanDefaults, isValidAcademicYear } from "@/modules/annual-plan/model";
import type { AnnualPlanInput, AnnualPlanMetadata } from "@/modules/annual-plan/types";

export function AnnualPlanBuilder() {
  const [input, setInput] = useState<AnnualPlanInput>(getAnnualPlanDefaults);
  const yearIsValid = isValidAcademicYear(input.metadata.academicYear)
    && input.metadata.academicYear === "2026-2027";
  const plan = yearIsValid ? createAnnualPlan(input) : null;

  function updateMetadata(field: keyof AnnualPlanMetadata, value: string) {
    setInput((current) => ({ ...current, metadata: { ...current.metadata, [field]: value } }));
  }

  return (
    <div className="annual-layout">
      <aside className="studio-panel annual-form">
        <div>
          <span className="eyebrow">Takvim ve müfredat bağlantılı</span>
          <h1 className="studio-title">Yıllık Plan</h1>
          <p className="studio-intro">Üniteleri ders saatlerine göre öğretim haftalarına dağıtır. Önizleme inceleme tamamlanana kadar taslaktır.</p>
        </div>

        <div className="field-group">
          <span className="field-label">Sınıf</span>
          <div className="segmented">
            {([10, 11] as const).map((grade) => (
              <button className={input.grade === grade ? "segment active" : "segment"} key={grade} onClick={() => setInput((current) => ({ ...current, grade }))} type="button">
                {grade}. sınıf
              </button>
            ))}
          </div>
        </div>

        <div className="metadata-grid">
          <TextField label="İl" value={input.metadata.province} onChange={(value) => updateMetadata("province", value)} />
          <TextField label="İlçe" value={input.metadata.district} onChange={(value) => updateMetadata("district", value)} />
          <TextField label="Okul" value={input.metadata.schoolName} onChange={(value) => updateMetadata("schoolName", value)} />
          <TextField label="Şube(ler)" value={input.metadata.branches} onChange={(value) => updateMetadata("branches", value)} />
          <TextField label="Öğretim yılı" value={input.metadata.academicYear} onChange={(value) => updateMetadata("academicYear", value)} invalid={!yearIsValid} />
          <TextField label="Öğretmen" value={input.metadata.teacherName} onChange={(value) => updateMetadata("teacherName", value)} />
          <TextField label="Zümre başkanı" value={input.metadata.departmentHead} onChange={(value) => updateMetadata("departmentHead", value)} />
          <TextField label="Müdür" value={input.metadata.principalName} onChange={(value) => updateMetadata("principalName", value)} />
        </div>

        {!yearIsValid && <p className="form-error">Bu sürümde doğrulanmış “2026-2027” çalışma takvimi kullanılmalıdır.</p>}

        <div className="calendar-card">
          <strong>2026–2027 çalışma takvimi</strong>
          <span>Başlangıç: 14 Eylül 2026</span>
          <span>1. ara tatil: 16–20 Kasım</span>
          <span>Yarıyıl: 25 Ocak–5 Şubat</span>
          <span>2. ara tatil: 8–12 Mart</span>
          <span>Bitiş: 25 Haziran 2027</span>
        </div>

        <div className="draft-warning">
          <strong>Belge durumu: TASLAK</strong>
          <span>Takvim ve müfredat dağılımı öğretmen tarafından kontrol edilmeden dışa aktarılamaz.</span>
        </div>
      </aside>

      <section className="annual-preview">
        {plan ? (
          <>
            <header className="annual-header">
              <div><span className="draft-badge">YILLIK PLAN TASLAĞI</span><h2>{plan.title}</h2><p>{input.metadata.schoolName || "Okul adı"} · {input.metadata.province || "İl"} / {input.metadata.district || "İlçe"}</p></div>
              <div className="annual-summary"><strong>36</strong><span>öğretim haftası</span><strong>72</strong><span>ders saati</span></div>
            </header>

            <div className="annual-table-wrap">
              <table className="annual-table">
                <thead><tr><th>Hafta</th><th>Tarih</th><th>Ünite / kapsam</th><th>Öğrenme çıktısı ve süreç</th><th>Değer / okuryazarlık</th><th>Belirli günler</th></tr></thead>
                <tbody>
                  {plan.weeks.map((week) => (
                    <tr className={week.kind === "school-based" ? "school-based-row" : ""} key={week.sequence}>
                      <td><strong>{week.sequence}</strong><small>{week.semester}. dönem</small></td>
                      <td>{formatTurkishDate(week.startDate)}<br />{formatTurkishDate(week.endDate)}</td>
                      <td><strong>{week.unitTitle}</strong><small>{week.kind === "curriculum" ? `${week.unitWeek}. ünite haftası · ${week.topic}` : week.topic}</small></td>
                      <td><strong>{week.outcomeCode ?? "OTP"}</strong><small>{week.outcomeTitle}</small><small>{week.processComponents[0]}</small></td>
                      <td><small>{week.values.join(", ") || "Zümre kararı"}</small><small>{week.literacies.join(", ") || "—"}</small></td>
                      <td>{week.specialDays.join(", ") || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <AnnualPlanExport plan={plan} />

            <footer className="annual-signatures">
              <div><span>Felsefe öğretmeni</span><strong>{input.metadata.teacherName || "Ad Soyad"}</strong></div>
              <div><span>Zümre başkanı</span><strong>{input.metadata.departmentHead || "Ad Soyad"}</strong></div>
              <div><span>Okul müdürü / onay alanı</span><strong>{input.metadata.principalName || "Ad Soyad"}</strong></div>
            </footer>
          </>
        ) : (
          <div className="invalid-preview"><strong>Plan üretimi durduruldu.</strong><p>Geçerli bir öğretim yılı girildiğinde önizleme yeniden oluşturulur.</p></div>
        )}
      </section>
    </div>
  );
}

function TextField({ label, value, onChange, invalid = false }: { label: string; value: string; onChange: (value: string) => void; invalid?: boolean }) {
  return <label className="field-group"><span className="field-label">{label}</span><input aria-invalid={invalid} value={value} onChange={(event) => onChange(event.target.value)} /></label>;
}

function formatTurkishDate(value: string): string {
  return new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
}
