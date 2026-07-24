"use client";

import { useState } from "react";
import { getCurriculum, type GradeLevel } from "@/curriculum";
import {
  createExam,
  durations,
  examNames,
  getExamDefaults,
  iepProfiles,
  questionCounts,
  textRatios,
} from "@/modules/exam-generator/model";
import type { ExamInput, ExamMetadata, IepProfile } from "@/modules/exam-generator/types";

export function ExamGeneratorBuilder() {
  const [input, setInput] = useState<ExamInput>(getExamDefaults);
  const [packageView, setPackageView] = useState<"student" | "teacher">("student");
  const curriculum = getCurriculum(input.grade);
  const unit = curriculum.units.find((item) => item.code === input.unitCode) ?? curriculum.units[0];
  const normalized = unit.code === input.unitCode ? input : {
    ...input,
    unitCode: unit.code,
    outcomeCodes: unit.outcomes.map((outcome) => outcome.code),
  };
  const exam = createExam(normalized);

  function updateMetadata(field: keyof ExamMetadata, value: string | number) {
    setInput((current) => ({ ...current, metadata: { ...current.metadata, [field]: value } }));
  }

  function selectGrade(grade: GradeLevel) {
    const nextUnit = getCurriculum(grade).units[0];
    setInput((current) => ({
      ...current,
      grade,
      unitCode: nextUnit.code,
      outcomeCodes: nextUnit.outcomes.map((outcome) => outcome.code),
    }));
  }

  function selectUnit(unitCode: string) {
    const nextUnit = curriculum.units.find((item) => item.code === unitCode);
    if (!nextUnit) return;
    setInput((current) => ({
      ...current,
      unitCode,
      outcomeCodes: nextUnit.outcomes.map((outcome) => outcome.code),
    }));
  }

  function toggleOutcome(code: string) {
    setInput((current) => {
      const selected = current.outcomeCodes.includes(code);
      const outcomeCodes = selected
        ? current.outcomeCodes.filter((item) => item !== code)
        : [...current.outcomeCodes, code];
      return outcomeCodes.length ? { ...current, outcomeCodes } : current;
    });
  }

  return (
    <div className="exam-layout">
      <aside className="studio-panel exam-form">
        <div><span className="eyebrow">Müfredat ve belirtke bağlantılı</span><h1 className="studio-title">Sınav Oluşturucu</h1><p className="studio-intro">Açık uçlu ve kısa cevaplı sorulardan güvenli öğrenci ve öğretmen paketleri üretir.</p></div>
        <div className="metadata-grid">
          <TextField label="Okul" value={input.metadata.schoolName} onChange={(value) => updateMetadata("schoolName", value)} />
          <TextField label="Öğretim yılı" value={input.metadata.academicYear} onChange={(value) => updateMetadata("academicYear", value)} />
          <TextField label="Sınıf / şube" value={input.metadata.classBranch} onChange={(value) => updateMetadata("classBranch", value)} />
          <TextField label="Öğretmen" value={input.metadata.teacherName} onChange={(value) => updateMetadata("teacherName", value)} />
          <TextField label="Tarih" type="date" value={input.metadata.date} onChange={(value) => updateMetadata("date", value)} />
          <SelectField label="Sınav adı" value={input.metadata.examName} onChange={(value) => updateMetadata("examName", value)}>
            {examNames.map((name) => <option key={name}>{name}</option>)}
          </SelectField>
        </div>

        <div className="field-group"><span className="field-label">Sınıf</span><div className="segmented">
          {([10, 11] as const).map((grade) => <button className={input.grade === grade ? "segment active" : "segment"} key={grade} onClick={() => selectGrade(grade)} type="button">{grade}. sınıf</button>)}
        </div></div>
        <SelectField label="Ünite" value={unit.code} onChange={selectUnit}>
          {curriculum.units.map((item) => <option key={item.code} value={item.code}>{item.order}. {item.title}</option>)}
        </SelectField>
        <fieldset className="outcome-picker"><legend>Öğrenme çıktıları</legend>
          {unit.outcomes.map((outcome) => <label key={outcome.code}><input type="checkbox" checked={input.outcomeCodes.includes(outcome.code)} onChange={() => toggleOutcome(outcome.code)} /><span><strong>{outcome.code}</strong>{outcome.title}</span></label>)}
        </fieldset>

        <div className="triple-grid">
          <SelectField label="Soru sayısı" value={String(input.questionCount)} onChange={(value) => setInput((current) => ({ ...current, questionCount: Number(value) as ExamInput["questionCount"] }))}>
            {questionCounts.map((count) => <option key={count} value={count}>{count} soru</option>)}
          </SelectField>
          <SelectField label="Süre" value={String(input.metadata.duration)} onChange={(value) => updateMetadata("duration", Number(value))}>
            {durations.map((duration) => <option key={duration} value={duration}>{duration} dakika</option>)}
          </SelectField>
          <SelectField label="Metin temelli" value={String(input.textQuestionRatio)} onChange={(value) => setInput((current) => ({ ...current, textQuestionRatio: Number(value) as ExamInput["textQuestionRatio"] }))}>
            {textRatios.map((ratio) => <option key={ratio} value={ratio}>%{ratio}</option>)}
          </SelectField>
        </div>

        <div className="field-group"><span className="field-label">Sınav modu</span><div className="segmented">
          <button className={input.mode === "standard" ? "segment active" : "segment"} type="button" onClick={() => setInput((current) => ({ ...current, mode: "standard", iepProfile: null }))}>Standart</button>
          <button className={input.mode === "iep" ? "segment active" : "segment"} type="button" onClick={() => setInput((current) => ({ ...current, mode: "iep", iepProfile: "reading" }))}>BEP uyarlamalı</button>
        </div></div>
        {input.mode === "iep" && <>
          <SelectField label="Uyarlama profili" value={input.iepProfile ?? "reading"} onChange={(value) => setInput((current) => ({ ...current, iepProfile: value as IepProfile }))}>
            {Object.values(iepProfiles).map((profile) => <option key={profile.profile} value={profile.profile}>{profile.label}</option>)}
          </SelectField>
          <TextField label="BEP birimi / kurul kararı" value={input.iepDecision} onChange={(value) => setInput((current) => ({ ...current, iepDecision: value }))} />
          <p className="privacy-note">Öğrenci adı, tanı veya sağlık bilgisi girmeyin. Hedef değişmez; yalnızca erişim biçimi uyarlanır.</p>
        </>}
        <label className="approval-check"><input type="checkbox" checked={input.teacherApproved} onChange={(event) => setInput((current) => ({ ...current, teacherApproved: event.target.checked }))} /><span>Soruları, puanları, cevap anahtarını, belirtke tablosunu ve A–B eşdeğerliğini kontrol ettim.</span></label>
      </aside>

      <article className="exam-sheet">
        <div className="package-tabs">
          <button className={packageView === "student" ? "active" : ""} onClick={() => setPackageView("student")} type="button">Öğrenci kitapçığı</button>
          <button className={packageView === "teacher" ? "active" : ""} onClick={() => setPackageView("teacher")} type="button">Öğretmen paketi</button>
        </div>
        <header className="exam-header"><span className="draft-badge">SINAV TASLAĞI · A KİTAPÇIĞI</span><h2>{input.metadata.schoolName || "Okul adı"} – {input.metadata.examName}</h2><p>{input.grade}. sınıf · {unit.title} · {input.metadata.duration} dakika · 100 puan</p></header>
        <div className="student-info"><span>Adı Soyadı:</span><span>Numarası:</span><span>Sınıfı / Şubesi: {input.metadata.classBranch || "—"}</span></div>
        <section className="question-list">
          {exam.bookletA.map((question) => <div className="exam-question" key={question.id}>
            <div className="question-heading"><strong>{question.order}. Soru</strong><span>{question.points} puan</span></div>
            {question.stimulus && <blockquote>{question.stimulus}</blockquote>}
            <p>{question.prompt}</p><div className="answer-lines" />
            {packageView === "teacher" && <div className="teacher-key"><strong>{question.outcomeCode} · {question.cognitiveLevel}</strong><p>{question.answerKey}</p><ul>{question.rubric.map((item) => <li key={item}>{item}</li>)}</ul></div>}
          </div>)}
        </section>
        {packageView === "teacher" && <>
          <section className="blueprint"><h3>Belirtke tablosu</h3><table><thead><tr><th>Öğrenme çıktısı</th><th>Soru</th><th>Puan</th><th>Bilişsel düzey</th></tr></thead><tbody>
            {exam.blueprint.map((row) => <tr key={row.outcomeCode}><td><strong>{row.outcomeCode}</strong><small>{row.outcomeTitle}</small></td><td>{row.questionCount}</td><td>{row.totalPoints}</td><td>{row.cognitiveLevels.join(", ")}</td></tr>)}
          </tbody></table></section>
          {exam.iepAdaptation && <section className="iep-card"><h3>BEP uyarlama kaydı – öğretmen nüshası</h3><strong>{exam.iepAdaptation.label}</strong><ul>{exam.iepAdaptation.adjustments.map((item) => <li key={item}>{item}</li>)}</ul><p>Kurul/birim kararı: {input.iepDecision || "Belirtilmedi"}</p></section>}
        </>}
        <div className={`validation-banner ${exam.validation.exportAllowed ? "complete" : ""}`}><strong>{exam.validation.exportAllowed ? "Dışa aktarıma hazır" : "Öğretmen onayı bekleniyor"}</strong><span>100 puan · geçerli çıktılar · cevap/rubrik · A–B eşdeğerliği kontrol edildi.</span></div>
      </article>
    </div>
  );
}

function TextField({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return <label className="field-group"><span className="field-label">{label}</span><input type={type} value={value} onChange={(event) => onChange(event.target.value)} /></label>;
}
function SelectField({ label, value, onChange, children }: { label: string; value: string; onChange: (value: string) => void; children: React.ReactNode }) {
  return <label className="field-group"><span className="field-label">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}>{children}</select></label>;
}
