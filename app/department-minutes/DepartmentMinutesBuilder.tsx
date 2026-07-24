"use client";

import { useState } from "react";
import {
  createDefaultAgenda,
  createDepartmentMinutes,
  getDepartmentMinutesDefaults,
  isValidAcademicYear,
  meetingTypeLabels,
} from "@/modules/department-minutes/model";
import type {
  AgendaItem,
  DepartmentMinutesInput,
  DepartmentMinutesMetadata,
  MeetingType,
} from "@/modules/department-minutes/types";

export function DepartmentMinutesBuilder() {
  const [input, setInput] = useState<DepartmentMinutesInput>(getDepartmentMinutesDefaults);
  const yearIsValid = isValidAcademicYear(input.metadata.academicYear);
  const minutes = yearIsValid ? createDepartmentMinutes(input) : null;

  function updateMetadata(field: keyof DepartmentMinutesMetadata, value: string) {
    setInput((current) => ({ ...current, metadata: { ...current.metadata, [field]: value } }));
  }

  function changeMeetingType(meetingType: MeetingType) {
    setInput((current) => ({
      metadata: { ...current.metadata, meetingType },
      agenda: createDefaultAgenda(meetingType),
    }));
  }

  function updateAgenda(id: string, field: keyof Pick<AgendaItem, "title" | "discussion" | "decision">, value: string) {
    setInput((current) => ({
      ...current,
      agenda: current.agenda.map((item) => item.id === id ? { ...item, [field]: value } : item),
    }));
  }

  function addAgendaItem() {
    setInput((current) => ({
      ...current,
      agenda: [...current.agenda, {
        id: `agenda-${Date.now()}`,
        title: "Yeni gündem maddesi",
        discussion: "",
        decision: "",
      }],
    }));
  }

  function removeAgendaItem(id: string) {
    setInput((current) => current.agenda.length === 1
      ? current
      : { ...current, agenda: current.agenda.filter((item) => item.id !== id) });
  }

  function updateMember(index: number, value: string) {
    setInput((current) => ({
      ...current,
      metadata: {
        ...current.metadata,
        members: current.metadata.members.map((member, memberIndex) => memberIndex === index ? value : member),
      },
    }));
  }

  return (
    <div className="minutes-layout">
      <aside className="studio-panel minutes-form">
        <div>
          <span className="eyebrow">Mevzuat bağlantılı</span>
          <h1 className="studio-title">Zümre Tutanağı</h1>
          <p className="studio-intro">Toplantı bilgilerini, gündem görüşmelerini ve kararları tek taslakta yönetin.</p>
        </div>

        <SelectField label="Toplantı türü" value={input.metadata.meetingType} onChange={(value) => changeMeetingType(value as MeetingType)}>
          {Object.entries(meetingTypeLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </SelectField>

        <div className="metadata-grid">
          <TextField label="Okul" value={input.metadata.schoolName} onChange={(value) => updateMetadata("schoolName", value)} />
          <TextField label="Öğretim yılı" value={input.metadata.academicYear} onChange={(value) => updateMetadata("academicYear", value)} invalid={!yearIsValid} />
          <TextField label="Toplantı no" value={input.metadata.meetingNumber} onChange={(value) => updateMetadata("meetingNumber", value)} />
          <TextField label="Tarih" type="date" value={input.metadata.date} onChange={(value) => updateMetadata("date", value)} />
          <TextField label="Saat" type="time" value={input.metadata.time} onChange={(value) => updateMetadata("time", value)} />
          <TextField label="Yer" value={input.metadata.place} onChange={(value) => updateMetadata("place", value)} />
          <TextField label="Zümre başkanı" value={input.metadata.chairName} onChange={(value) => updateMetadata("chairName", value)} />
          <TextField label="Okul müdürü" value={input.metadata.principalName} onChange={(value) => updateMetadata("principalName", value)} />
        </div>
        {!yearIsValid && <p className="form-error">Öğretim yılı “2026-2027” gibi ardışık iki yıl olmalıdır.</p>}

        <div className="field-group">
          <span className="field-label">Zümre üyeleri</span>
          {input.metadata.members.map((member, index) => (
            <input aria-label={`${index + 1}. zümre üyesi`} key={index} value={member} onChange={(event) => updateMember(index, event.target.value)} />
          ))}
          <button className="secondary-button" type="button" onClick={() => setInput((current) => ({
            ...current,
            metadata: { ...current.metadata, members: [...current.metadata.members, ""] },
          }))}>+ Üye ekle</button>
        </div>

        <div className="agenda-editor">
          <div className="agenda-editor-heading"><span className="field-label">Gündem, görüşme ve kararlar</span><button className="secondary-button" type="button" onClick={addAgendaItem}>+ Madde ekle</button></div>
          {input.agenda.map((item, index) => (
            <section className="agenda-edit-card" key={item.id}>
              <div className="agenda-edit-title"><strong>{index + 1}. madde</strong><button type="button" onClick={() => removeAgendaItem(item.id)} aria-label={`${index + 1}. maddeyi sil`}>Sil</button></div>
              <TextArea label="Gündem" value={item.title} onChange={(value) => updateAgenda(item.id, "title", value)} />
              <TextArea label="Görüşme" value={item.discussion} onChange={(value) => updateAgenda(item.id, "discussion", value)} />
              <TextArea label="Karar" value={item.decision} onChange={(value) => updateAgenda(item.id, "decision", value)} />
            </section>
          ))}
        </div>
      </aside>

      <article className="minutes-sheet">
        {minutes ? (
          <>
            <header className="minutes-header">
              <span className="draft-badge">ZÜMRE TUTANAĞI TASLAĞI</span>
              <h2>{minutes.title}</h2>
              <p>{input.metadata.schoolName || "Okul adı"}</p>
              <small>{minutes.legalBasis}</small>
            </header>
            <dl className="minutes-facts">
              <div><dt>Toplantı</dt><dd>{input.metadata.meetingNumber || "—"}</dd></div>
              <div><dt>Tarih / saat</dt><dd>{input.metadata.date || "—"} · {input.metadata.time || "—"}</dd></div>
              <div><dt>Yer</dt><dd>{input.metadata.place || "—"}</dd></div>
              <div><dt>Başkan</dt><dd>{input.metadata.chairName || "—"}</dd></div>
            </dl>
            <section className="minutes-section"><h3>Hazır bulunanlar</h3><p>{input.metadata.members.filter(Boolean).join(", ") || "Zümre üyeleri"}</p></section>
            <section className="minutes-section">
              <h3>Gündem ve görüşmeler</h3>
              {minutes.agenda.map((item, index) => (
                <div className="minutes-agenda-item" key={item.id}>
                  <strong>{index + 1}. {item.title}</strong>
                  <p>{item.discussion || "Görüşme metni girilmedi."}</p>
                  <p><b>Karar:</b> {item.decision || "Karar girilmedi."}</p>
                </div>
              ))}
            </section>
            <section className="minutes-section decisions"><h3>Karar özeti</h3>
              {minutes.decisions.length ? <ol>{minutes.decisions.map((item) => <li key={item.number}>{item.text}</li>)}</ol> : <p>Henüz karar girilmedi.</p>}
            </section>
            <div className={`validation-banner ${minutes.validation.exportAllowed ? "complete" : ""}`}>
              <strong>{minutes.validation.exportAllowed ? "Belge kontrolleri tamamlandı" : "Belge henüz tamamlanmadı"}</strong>
              <span>Eksik görüşme, karar veya toplantı bilgileri tamamlanmadan dışa aktarım açılmaz.</span>
            </div>
            <footer className="annual-signatures">
              <div><span>Zümre başkanı</span><strong>{input.metadata.chairName || "Ad Soyad / imza"}</strong></div>
              <div><span>Zümre üyeleri</span><strong>Ad Soyad / imza</strong></div>
              <div><span>Okul müdürü onay alanı</span><strong>{input.metadata.principalName || "Ad Soyad / imza"}</strong></div>
            </footer>
          </>
        ) : <div className="invalid-preview"><strong>Tutanak üretimi durduruldu.</strong><p>Geçerli bir öğretim yılı girin.</p></div>}
      </article>
    </div>
  );
}

function TextField({ label, value, onChange, type = "text", invalid = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; invalid?: boolean }) {
  return <label className="field-group"><span className="field-label">{label}</span><input aria-invalid={invalid} type={type} value={value} onChange={(event) => onChange(event.target.value)} /></label>;
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="field-group"><span className="field-label">{label}</span><textarea rows={3} value={value} onChange={(event) => onChange(event.target.value)} /></label>;
}

function SelectField({ label, value, onChange, children }: { label: string; value: string; onChange: (value: string) => void; children: React.ReactNode }) {
  return <label className="field-group"><span className="field-label">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}>{children}</select></label>;
}
