"use client";

import { useState } from "react";
import { DocumentExport } from "@/app/daily-plan/DocumentExport";
import { getCurriculum, type GradeLevel } from "@/curriculum";
import { createDailyPlan, getDailyPlanDefaults } from "@/modules/daily-plan/model";
import type { DailyPlanInput, DailyPlanMetadata } from "@/modules/daily-plan/types";
import {
  classProfiles,
  evidenceOptions,
  getUnitWeekCount,
  teachingMethods,
} from "@/modules/lesson-studio/model";

export function DailyPlanBuilder() {
  const [input, setInput] = useState<DailyPlanInput>(getDailyPlanDefaults);
  const curriculum = getCurriculum(input.lesson.grade);
  const unit = curriculum.units.find((item) => item.code === input.lesson.unitCode) ?? curriculum.units[0];
  const outcome = unit.outcomes.find((item) => item.code === input.lesson.outcomeCode) ?? unit.outcomes[0];
  const weekCount = getUnitWeekCount(unit.code);
  const normalizedInput: DailyPlanInput = {
    ...input,
    lesson: {
      ...input.lesson,
      unitCode: unit.code,
      outcomeCode: outcome.code,
      week: Math.min(input.lesson.week, weekCount),
    },
  };
  const plan = createDailyPlan(normalizedInput);

  function updateMetadata(field: keyof DailyPlanMetadata, value: string) {
    setInput((current) => ({
      ...current,
      metadata: { ...current.metadata, [field]: value },
    }));
  }

  function selectGrade(grade: GradeLevel) {
    const nextCurriculum = getCurriculum(grade);
    const firstUnit = nextCurriculum.units[0];
    setInput((current) => ({
      ...current,
      lesson: {
        ...current.lesson,
        grade,
        unitCode: firstUnit.code,
        outcomeCode: firstUnit.outcomes[0].code,
        week: 1,
      },
    }));
  }

  function selectUnit(unitCode: string) {
    const nextUnit = curriculum.units.find((item) => item.code === unitCode);
    if (!nextUnit) return;
    setInput((current) => ({
      ...current,
      lesson: {
        ...current.lesson,
        unitCode,
        outcomeCode: nextUnit.outcomes[0].code,
        week: 1,
      },
    }));
  }

  return (
    <div className="daily-layout">
      <aside className="studio-panel daily-form" aria-label="Günlük plan bilgileri">
        <div>
          <span className="eyebrow">Müfredat bağlantılı</span>
          <h1 className="studio-title">Günlük Plan</h1>
          <p className="studio-intro">Kurumsal bilgileri ve ders kararlarını girin; plan önizlemesi eş zamanlı oluşsun.</p>
        </div>

        <div className="metadata-grid">
          <TextField label="Okul" value={input.metadata.schoolName} onChange={(value) => updateMetadata("schoolName", value)} />
          <TextField label="Öğretim yılı" value={input.metadata.academicYear} onChange={(value) => updateMetadata("academicYear", value)} />
          <TextField label="Öğretmen" value={input.metadata.teacherName} onChange={(value) => updateMetadata("teacherName", value)} />
          <TextField label="Müdür" value={input.metadata.principalName} onChange={(value) => updateMetadata("principalName", value)} />
          <TextField label="Tarih" type="date" value={input.metadata.date} onChange={(value) => updateMetadata("date", value)} />
          <TextField label="Belirli gün / hafta" value={input.metadata.specialDay} onChange={(value) => updateMetadata("specialDay", value)} />
        </div>

        <div className="field-group">
          <span className="field-label">Sınıf</span>
          <div className="segmented">
            {([10, 11] as const).map((grade) => (
              <button className={input.lesson.grade === grade ? "segment active" : "segment"} key={grade} onClick={() => selectGrade(grade)} type="button">
                {grade}. sınıf
              </button>
            ))}
          </div>
        </div>

        <SelectField label="Ünite" value={unit.code} onChange={selectUnit}>
          {curriculum.units.map((item) => <option key={item.code} value={item.code}>{item.order}. {item.title}</option>)}
        </SelectField>
        <SelectField label="Öğrenme çıktısı" value={outcome.code} onChange={(value) => setInput((current) => ({ ...current, lesson: { ...current.lesson, outcomeCode: value } }))}>
          {unit.outcomes.map((item) => <option key={item.code} value={item.code}>{item.code} · {item.title}</option>)}
        </SelectField>
        <SelectField label="Ünite içi hafta" value={String(normalizedInput.lesson.week)} onChange={(value) => setInput((current) => ({ ...current, lesson: { ...current.lesson, week: Number(value) } }))}>
          {Array.from({ length: weekCount }, (_, index) => index + 1).map((week) => <option key={week} value={week}>{week}. hafta · 80 dakika</option>)}
        </SelectField>
        <SelectField label="Sınıf profili" value={input.lesson.classProfile} onChange={(value) => setInput((current) => ({ ...current, lesson: { ...current.lesson, classProfile: value as DailyPlanInput["lesson"]["classProfile"] } }))}>
          {classProfiles.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
        </SelectField>
        <SelectField label="Yöntem / teknik" value={input.lesson.method} onChange={(value) => setInput((current) => ({ ...current, lesson: { ...current.lesson, method: value } }))}>
          {teachingMethods.map((item) => <option key={item}>{item}</option>)}
        </SelectField>
        <SelectField label="Ölçme / öğrenme kanıtı" value={input.lesson.evidence} onChange={(value) => setInput((current) => ({ ...current, lesson: { ...current.lesson, evidence: value } }))}>
          {evidenceOptions.map((item) => <option key={item}>{item}</option>)}
        </SelectField>
        <TextArea label="Araç ve gereçler" value={input.metadata.materials} onChange={(value) => updateMetadata("materials", value)} />
        <TextArea label="Farklılaştırma" value={input.metadata.differentiation} onChange={(value) => updateMetadata("differentiation", value)} />
        <TextArea label="Günlük hayat bağlantısı" value={input.metadata.dailyLifeConnection} onChange={(value) => updateMetadata("dailyLifeConnection", value)} />
      </aside>

      <article className="plan-sheet">
        <header className="plan-header">
          <div>
            <span className="eyebrow">Günlük ders planı</span>
            <h2>{input.metadata.schoolName || "Okul adı"}</h2>
            <p>{input.metadata.academicYear} · {plan.courseName} · {input.lesson.grade}. sınıf</p>
          </div>
          <div className="duration"><strong>80</strong><span>dakika</span></div>
        </header>

        <dl className="plan-facts">
          <div><dt>Tarih</dt><dd>{input.metadata.date || "—"}</dd></div>
          <div><dt>Ünite / hafta</dt><dd>{plan.lesson.curriculum.unitTitle} · {input.lesson.week}. hafta</dd></div>
          <div><dt>Öğrenme çıktısı</dt><dd>{outcome.code} · {outcome.title}</dd></div>
          <div><dt>Yöntem</dt><dd>{input.lesson.method}</dd></div>
          <div><dt>Belirli gün / hafta</dt><dd>{input.metadata.specialDay || "—"}</dd></div>
          <div><dt>Araç ve gereçler</dt><dd>{input.metadata.materials}</dd></div>
        </dl>

        <section className="plan-section">
          <h3>Öğrenme-öğretme yaşantıları</h3>
          <div className="plan-phases">
            {plan.lesson.phases.map((phase) => (
              <div className="plan-phase" key={phase.order}>
                <span>{phase.order.toString().padStart(2, "0")}</span>
                <div><strong>{phase.title} · {phase.minutes} dk.</strong><p><b>Öğretmen:</b> {phase.teacherAction}</p><p><b>Öğrenci:</b> {phase.studentAction}</p></div>
              </div>
            ))}
          </div>
        </section>

        <div className="plan-columns">
          <section className="plan-section"><h3>Ölçme ve değerlendirme</h3><p><strong>{plan.assessment.evidence}</strong></p><ul>{plan.assessment.criteria.map((item) => <li key={item}>{item}</li>)}</ul></section>
          <section className="plan-section"><h3>Farklılaştırma ve transfer</h3><p>{input.metadata.differentiation}</p><p>{input.metadata.dailyLifeConnection}</p></section>
        </div>

        <section className="plan-section approval">
          <h3>Kalite kontrolü</h3>
          <ul>{plan.approvalChecks.map((item) => <li key={item}>✓ {item}</li>)}</ul>
        </section>

        <DocumentExport plan={plan} />

        <footer className="signature-row">
          <div><span>Hazırlayan öğretmen</span><strong>{input.metadata.teacherName || "Ad Soyad"}</strong></div>
          <div><span>Okul müdürü onay alanı</span><strong>{input.metadata.principalName || "Ad Soyad"}</strong></div>
        </footer>
      </article>
    </div>
  );
}

function TextField({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return <label className="field-group"><span className="field-label">{label}</span><input type={type} value={value} onChange={(event) => onChange(event.target.value)} /></label>;
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label className="field-group"><span className="field-label">{label}</span><textarea rows={3} value={value} onChange={(event) => onChange(event.target.value)} /></label>;
}

function SelectField({ label, value, onChange, children }: { label: string; value: string; onChange: (value: string) => void; children: React.ReactNode }) {
  return <label className="field-group"><span className="field-label">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}>{children}</select></label>;
}
