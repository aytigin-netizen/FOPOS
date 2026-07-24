"use client";

import { useState } from "react";
import { ExamAnalysisExport } from "@/app/exam-analysis/ExamAnalysisExport";
import { analyzeExam, calculateStudentTotal, getAnalysisDefaults, parseStudentList } from "@/modules/exam-analysis/model";
import type { AttendanceStatus, ExamAnalysisInput } from "@/modules/exam-analysis/types";

export function ExamAnalysisBuilder() {
  const [input, setInput] = useState<ExamAnalysisInput>(getAnalysisDefaults);
  const [listText, setListText] = useState("");
  const [importError, setImportError] = useState("");
  const analysis = analyzeExam(input);

  function importStudents() {
    try {
      const students = parseStudentList(listText, input.exam.bookletA.length);
      if (!students.length) throw new Error("Geçerli okul numarası ve ad-soyad satırı bulunamadı.");
      setInput((current) => ({ ...current, students, teacherReviewed: false }));
      setImportError("");
    } catch (error) {
      setImportError(error instanceof Error ? error.message : "Liste okunamadı.");
    }
  }

  function updateAttendance(id: string, attendance: AttendanceStatus) {
    setInput((current) => ({
      ...current,
      teacherReviewed: false,
      students: current.students.map((student) => student.id === id
        ? { ...student, attendance, questionScores: attendance === "absent" ? student.questionScores.map(() => null) : student.questionScores }
        : student),
    }));
  }

  function updateScore(id: string, questionIndex: number, value: string) {
    const max = input.exam.bookletA[questionIndex].points;
    const score = value === "" ? null : Math.max(0, Math.min(max, Number(value)));
    setInput((current) => ({
      ...current,
      teacherReviewed: false,
      students: current.students.map((student) => student.id === id
        ? { ...student, attendance: "present", questionScores: student.questionScores.map((item, index) => index === questionIndex ? score : item) }
        : student),
    }));
  }

  return (
    <div className="analysis-layout">
      <aside className="studio-panel analysis-panel">
        <div><span className="eyebrow">Sınav şeması bağlantılı</span><h1 className="studio-title">Sınav Analizi</h1><p className="studio-intro">Soru puanlarını girin; sınıf, soru ve öğrenme çıktısı sonuçlarını kanıtlarıyla görün.</p></div>
        <div className="transfer-card"><strong>Hazırlanmış sınav aktarıldı</strong><span>{input.exam.metadata.examName}</span><span>{input.exam.grade}. sınıf · {input.exam.unitTitle}</span><span>{input.exam.bookletA.length} soru · 100 puan</span></div>
        <label className="field-group"><span className="field-label">e-Okul / Excel listesini yapıştır</span><textarea rows={7} placeholder={"101\tAyşe Yılmaz\n102\tMehmet Kaya"} value={listText} onChange={(event) => setListText(event.target.value)} /></label>
        <button className="secondary-button" type="button" onClick={importStudents}>Listeyi önizle ve aktar</button>
        {importError && <p className="form-error">{importError}</p>}
        <p className="privacy-note">Öğrenci verileri analiz ekranında tutulur; harici karar motoruna gönderilmez. Y1 toplam notu soru puanlarına otomatik dağıtılmamalıdır.</p>
        <label className="approval-check"><input type="checkbox" checked={input.teacherReviewed} onChange={(event) => setInput((current) => ({ ...current, teacherReviewed: event.target.checked }))} /><span>Öğrenci listesini, katılım durumlarını ve soru puanlarını kontrol ettim.</span></label>
        <label className="approval-check"><input type="checkbox" checked={input.safeSharingConfirmed} onChange={(event) => setInput((current) => ({ ...current, safeSharingConfirmed: event.target.checked }))} /><span>Raporun güvenli paylaşım koşullarını kontrol ettim.</span></label>
      </aside>

      <section className="analysis-workspace">
        <header className="analysis-header"><div><span className="draft-badge">SINAV ANALİZİ TASLAĞI</span><h2>{input.exam.metadata.examName}</h2><p>{input.exam.grade}. sınıf · {input.exam.unitTitle}</p></div><div className="analysis-score"><strong>{analysis.classAverage ?? "—"}</strong><span>sınıf ortalaması</span></div></header>
        <div className="analysis-summary">
          <div><strong>{analysis.classSize}</strong><span>Sınıf mevcudu</span></div>
          <div><strong>{analysis.participantCount}</strong><span>Katılımcı</span></div>
          <div><strong>{analysis.absentCount}</strong><span>Katılmadı</span></div>
          <div><strong>{analysis.incompleteCount}</strong><span>Eksik giriş</span></div>
          <div><strong>{analysis.passRate ?? "—"}%</strong><span>Başarı oranı</span></div>
        </div>
        <div className="score-table-wrap"><table className="score-table"><thead><tr><th>No</th><th>Adı Soyadı</th><th>Durum</th>
          {input.exam.bookletA.map((question) => <th key={question.id}>S{question.order}<small>/{question.points}</small></th>)}<th>Toplam</th><th>Y1 kontrol</th></tr></thead><tbody>
          {input.students.map((student) => <tr key={student.id}><td>{student.schoolNumber}</td><td>{student.fullName}</td><td><select value={student.attendance} onChange={(event) => updateAttendance(student.id, event.target.value as AttendanceStatus)}><option value="undecided">Karar ver</option><option value="present">Sınava girdi</option><option value="absent">Katılmadı</option></select></td>
            {student.questionScores.map((score, index) => <td key={index}><input aria-label={`${student.fullName} ${index + 1}. soru`} disabled={student.attendance === "absent"} type="number" min={0} max={input.exam.bookletA[index].points} value={score ?? ""} onChange={(event) => updateScore(student.id, index, event.target.value)} /></td>)}
            <td><strong>{calculateStudentTotal(student) ?? "—"}</strong></td><td><input type="number" min={0} max={100} value={student.controlScore ?? ""} onChange={(event) => setInput((current) => ({ ...current, teacherReviewed: false, students: current.students.map((item) => item.id === student.id ? { ...item, controlScore: event.target.value === "" ? null : Number(event.target.value) } : item) }))} /></td></tr>)}
        </tbody></table></div>
        <div className="analysis-columns">
          <section className="analysis-card"><h3>Öğrenme çıktısı analizi</h3>{analysis.outcomeAnalysis.map((item) => <div className={`outcome-result priority-${item.priority}`} key={item.outcomeCode}><div><strong>{item.outcomeCode}</strong><span>%{item.achievementRate} · {item.priority === "critical" ? "Kritik" : item.priority === "monitor" ? "İzlenmeli" : "Yeterli"}</span></div><small>{item.evidence}</small><p>{item.intervention}</p></div>)}</section>
          <section className="analysis-card"><h3>Soru analizi</h3>{analysis.questionAnalysis.map((item) => <div className="question-result" key={item.question.id}><strong>S{item.question.order} · {item.question.outcomeCode}</strong><span>%{item.achievementRate}</span><progress max={100} value={item.achievementRate} /></div>)}</section>
        </div>
        <div className={`validation-banner ${analysis.validation.exportAllowed ? "complete" : ""}`}><strong>{analysis.validation.exportAllowed ? "Analiz raporu dışa aktarıma hazır" : "Analiz henüz tamamlanmadı"}</strong><span>Eksik puanlar, katılım kararları ve öğretmen kontrolleri tamamlanmalıdır.</span></div>
        <ExamAnalysisExport analysis={analysis} exam={input.exam} />
      </section>
    </div>
  );
}
