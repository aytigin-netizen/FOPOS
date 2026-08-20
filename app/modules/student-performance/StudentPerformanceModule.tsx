"use client";

import { BarChart3, Download, Plus, ShieldAlert, Target, Trash2, TrendingUp, UsersRound } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createId } from "../../core/id.js";
import { createAnonymousClassSummary } from "../../core/anonymous-class-summary";
import { downloadBlob, safeFileName } from "../../core/file-download";
import { operationErrorMessage } from "../../core/operation-error";
import { useSensitiveSession } from "../../hooks/use-sensitive-session";
import type { StudentRosterTransfer } from "../../core/student-roster-transfer";
import type { ClassWorkspaceContext, SchoolGrade } from "../../core/class-workspace";

type Grade = SchoolGrade;
type Unit = { code: string; name: string; grade: Grade; outcomes: { code: string; short: string }[] };
type PlanMeta = { school: string; academicYear: string; teacher: string; principal: string };
type SkillKey = "questioning" | "analysis" | "comparison" | "justification" | "production";
type Scores = Record<SkillKey, number | null>;
type EvidenceRecord = { id: string; date: string; outcome: string; type: string; scores: Scores; note: string };
type Student = { id: string; no: string; name: string; evidenceRecords: EvidenceRecord[] };
type SupportPlan = { id: string; skill: SkillKey; studentNames: string[]; action: string };

const skills: Array<[SkillKey, string]> = [["questioning", "Sorgulama"], ["analysis", "Çözümleme"], ["comparison", "Karşılaştırma"], ["justification", "Gerekçelendirme"], ["production", "Alan ürünü"]];
const evidenceTypes = ["Ders içi etkinlik", "Çalışma kâğıdı", "Performans görevi", "Sözlü katılım", "Portfolyo"];
const emptyScores = (): Scores => ({ questioning: null, analysis: null, comparison: null, justification: null, production: null });
const today = () => new Date().toISOString().slice(0, 10);
const average = (values: Array<number | null>) => { const scored = values.filter((value): value is number => value !== null); return scored.length ? scored.reduce((sum, value) => sum + value, 0) / scored.length : null; };
const levelLabels = ["", "Başlangıç", "Gelişmekte", "İyi", "Çok İyi"];
const rubricDescriptions = [
  "Öğrenci; alan konusunu, temel kavramları ve problemleri açıklamakta zorlanır. Düşünce ve argümanları değerlendirmede, kavram ve problemleri incelemede desteğe ihtiyaç duyar.",
  "Öğrenci, alan konusunu ve temel kavramları temel düzeyde açıklar. Düşünce ve argümanları sınırlı biçimde değerlendirir; kavram ve problemleri temel düzeyde inceler.",
  "Öğrenci, alan konusunu, temel kavramları ve problemleri doğru biçimde açıklar. Düşünce ve argümanları anlamlı biçimde değerlendirir; kavram ve problemleri doğru biçimde inceler.",
  "Öğrenci; alan konusunu, temel kavramları ve problemleri açık, tutarlı ve kapsamlı biçimde açıklar. Argümanları derinlemesine değerlendirir ve eleştirel biçimde analiz eder.",
];

export default function StudentPerformanceModule({ classContext, subjectName, baseMeta, units, incomingRoster, onResolveRoster }: { classContext: ClassWorkspaceContext; subjectName: string; baseMeta: PlanMeta; units: Unit[]; incomingRoster: StudentRosterTransfer | null; onResolveRoster: () => void }) {
  const [grade, setGrade] = useState<Grade>(classContext.grade);
  const [branch, setBranch] = useState(classContext.branchCode);
  const gradeOutcomes = useMemo(() => units.filter((unit) => unit.grade === grade).flatMap((unit) => unit.outcomes), [grade, units]);
  const [students, setStudents] = useState<Student[]>([]);
  const [supportSkill, setSupportSkill] = useState<SkillKey>("questioning");
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [supportAction, setSupportAction] = useState("");
  const [supportConfirmed, setSupportConfirmed] = useState(false);
  const [supportPlans, setSupportPlans] = useState<SupportPlan[]>([]);
  const [clearConfirmed, setClearConfirmed] = useState(false);
  const [formTitle, setFormTitle] = useState(`${subjectName} Becerileri Süreç Değerlendirmesi`);
  const [formDate, setFormDate] = useState("");
  const [exporting, setExporting] = useState(false);
  const [operationMessage, setOperationMessage] = useState("");
  const incomingRosterRef = useRef<HTMLElement>(null);
  const resultsRef = useRef<HTMLElement>(null);
  useSensitiveSession(students.length > 0 || incomingRoster !== null);
  useEffect(() => {
    if (!incomingRoster) return;
    const timer = window.setTimeout(() => {
      incomingRosterRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      incomingRosterRef.current?.focus();
    }, 80);
    return () => window.clearTimeout(timer);
  }, [incomingRoster]);
  const newEvidence = (): EvidenceRecord => { const firstOutcome = gradeOutcomes.at(0); if (!firstOutcome) throw new Error(`${grade}. sınıf için doğrulanmış öğrenme çıktısı bulunamadı.`); return { id: createId(), date: today(), outcome: firstOutcome.code, type: evidenceTypes[0], scores: emptyScores(), note: "" }; };
  const addStudent = () => setStudents((current) => [...current, { id: createId(), no: "", name: "", evidenceRecords: [newEvidence()] }]);
  const updateStudent = (id: string, patch: Partial<Pick<Student, "no" | "name">>) => setStudents((current) => current.map((student) => student.id === id ? { ...student, ...patch } : student));
  const updateEvidence = (studentId: string, evidenceId: string, patch: Partial<EvidenceRecord>) => setStudents((current) => current.map((student) => student.id === studentId ? { ...student, evidenceRecords: student.evidenceRecords.map((record) => record.id === evidenceId ? { ...record, ...patch } : record) } : student));
  const removeEvidence = (studentId: string, evidenceId: string) => setStudents((current) => current.map((student) => student.id === studentId ? { ...student, evidenceRecords: student.evidenceRecords.filter((record) => record.id !== evidenceId) } : student));
  const allEvidence = students.flatMap((student) => student.evidenceRecords);
  const classAverage = average(allEvidence.flatMap((record) => Object.values(record.scores)));
  const skillMap = skills.map(([key, label]) => { const values = allEvidence.map((record) => record.scores[key]).filter((score): score is number => score !== null); return { key, label, count: values.length, average: average(values) }; });
  const latestSkillScore = (student: Student, key: SkillKey) => [...student.evidenceRecords].sort((a, b) => b.date.localeCompare(a.date)).find((record) => record.scores[key] !== null)?.scores[key] ?? null;
  const selectedSkillLabel = skills.find(([key]) => key === supportSkill)?.[1] ?? supportSkill;
  const suggestedIds = students.filter((student) => { const score = latestSkillScore(student, supportSkill); return score !== null && score <= 2; }).map((student) => student.id);
  const createSupportPlan = () => {
    if (!supportConfirmed || !supportAction.trim() || selectedStudentIds.length === 0) return;
    setSupportPlans((current) => [...current, { id: createId(), skill: supportSkill, action: supportAction.trim(), studentNames: students.filter((student) => selectedStudentIds.includes(student.id)).map((student, index) => student.name || student.no || `${index + 1}. öğrenci`) }]);
    setSelectedStudentIds([]); setSupportAction(""); setSupportConfirmed(false);
  };
  const clearSession = () => {
    if (!clearConfirmed) return;
    setStudents([]); setSupportPlans([]); setSelectedStudentIds([]); setSupportAction(""); setSupportConfirmed(false); setClearConfirmed(false);
  };
  const changeContext = (nextGrade: Grade, nextBranch: string) => {
    if (nextGrade === grade && nextBranch === branch) return;
    if (students.length > 0 && !window.confirm("Sınıf veya şube değişirse bu oturumdaki performans kayıtları ve destek planları silinir. Devam etmek istiyor musunuz?")) return;
    setStudents([]); setSupportPlans([]); setSelectedStudentIds([]); setSupportAction(""); setSupportConfirmed(false); setClearConfirmed(false);
    setGrade(nextGrade); setBranch(nextBranch);
  };
  void changeContext;
  const acceptIncomingRoster = () => {
    if (!incomingRoster) return;
    if (students.length > 0 && !window.confirm("Mevcut performans kayıtları aktarılacak öğrenci listesiyle değiştirilecek. Devam etmek istiyor musunuz?")) return;
    const firstOutcome = units.filter((unit) => unit.grade === incomingRoster.grade).flatMap((unit) => unit.outcomes).at(0);
    if (!firstOutcome) throw new Error(`${incomingRoster.grade}. sınıf için doğrulanmış öğrenme çıktısı bulunamadı.`);
    const evidence = (): EvidenceRecord => ({ id: createId(), date: today(), outcome: firstOutcome.code, type: evidenceTypes[0], scores: emptyScores(), note: "" });
    setGrade(incomingRoster.grade); setBranch(incomingRoster.branch);
    setStudents(incomingRoster.students.map((student) => ({ id: createId(), no: student.no, name: student.name, evidenceRecords: [evidence()] })));
    setSupportPlans([]); setSelectedStudentIds([]); setSupportAction(""); setSupportConfirmed(false); setClearConfirmed(false);
    setOperationMessage(`${incomingRoster.students.length} öğrenci performans görünümüne eklendi.`);
    onResolveRoster();
    window.setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      resultsRef.current?.focus();
    }, 80);
  };
  const exportAnonymousSummary = () => {
    const summary = createAnonymousClassSummary({ module: "student_performance", grade, groupSize: students.length, metrics: Object.fromEntries(skillMap.map((item) => [`${item.key}Average`, item.average === null ? null : Number(item.average.toFixed(2))])) });
    downloadBlob(new Blob([JSON.stringify(summary, null, 2)], { type: "application/json" }), `fopos-${grade}-${branch}-kimliksiz-performans-ozeti.json`);
  };
  const latestEvidence = (student: Student) => [...student.evidenceRecords].sort((a, b) => b.date.localeCompare(a.date)).find((record) => average(Object.values(record.scores)) !== null) ?? null;
  const processLevel = (student: Student) => {
    const record = latestEvidence(student);
    const value = record ? average(Object.values(record.scores)) : null;
    return value === null ? null : Math.max(1, Math.min(4, Math.round(value)));
  };
  const exportProcessForm = async () => {
    if (!students.length || students.some((student) => processLevel(student) === null)) {
      setOperationMessage("Süreç formu için her öğrencinin en az bir puanlanmış kanıtı olmalıdır.");
      return;
    }
    setExporting(true);
    setOperationMessage("Süreç değerlendirme formu hazırlanıyor…");
    try {
      const { AlignmentType, BorderStyle, Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType } = await import("docx");
      const border = { style: BorderStyle.SINGLE, size: 1, color: "B8C2CC" };
      const cell = (text: string, width: number, bold = false, size = 15) => new TableCell({ width: { size: width, type: WidthType.PERCENTAGE }, borders: { top: border, bottom: border, left: border, right: border }, children: [new Paragraph({ children: [new TextRun({ text, bold, size })] })] });
      const levels = students.map((student) => processLevel(student) as number);
      const classLevel = Math.round(levels.reduce((sum, level) => sum + level, 0) / levels.length);
      const rows = [
        new TableRow({ children: [cell("Sıra", 5, true), cell("Okul No", 8, true), cell("Ad Soyad", 25, true), ...[1, 2, 3, 4].map((level) => cell(`M${level}\n(1-4)`, 8, true)), cell("Toplam", 10, true), cell("Değerlendirme\n(Toplam Puan)", 20, true)] }),
        ...students.map((student, index) => {
          const level = levels[index];
          return new TableRow({ children: [cell(String(index + 1), 5), cell(student.no, 8), cell(student.name, 25), ...[1, 2, 3, 4].map((candidate) => cell(candidate === level ? String(level) : "", 8)), cell(String(level), 10, true), cell(levelLabels[level], 20)] });
        }),
        new TableRow({ children: [cell(`Sınıf Ortalaması (${students.length} öğrenci)`, 38, true), ...[1, 2, 3, 4].map((candidate) => cell(candidate === classLevel ? String(classLevel) : "", 8, true)), cell(String(classLevel), 10, true), cell(levelLabels[classLevel], 20, true)] }),
      ];
      const rubricRows = [new TableRow({ children: [cell("Madde", 8, true), cell("Açıklama", 92, true)] }), ...rubricDescriptions.map((description, index) => new TableRow({ children: [cell(`M${index + 1}`, 8, true), cell(description, 92, false, 14)] }))];
      const doc = new Document({ creator: "FOPOS v47", title: `${grade}-${branch} Süreç Değerlendirme Formu`, sections: [{ properties: { page: { margin: { top: 500, right: 500, bottom: 500, left: 500 } } }, children: [
        new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${baseMeta.academicYear} EĞİTİM-ÖĞRETİM YILI ${baseMeta.school.toLocaleUpperCase("tr-TR")}\n${grade}. SINIF ${branch} ŞUBESİ ${subjectName.toLocaleUpperCase("tr-TR")} DERSİ SÜREÇ DEĞERLENDİRME FORMU`, bold: true, size: 22 })] }),
        new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [new TableRow({ children: [cell("Dersin Adı", 15, true), cell(subjectName.toLocaleUpperCase("tr-TR"), 55), cell("Sınıf", 10, true), cell(`${grade}/${branch}`, 20)] }), new TableRow({ children: [cell("Form Başlığı", 15, true), cell(formTitle.trim() || "Süreç Değerlendirmesi", 55), cell("Tarih", 10, true), cell(formDate || ".... / .... / ........", 20)] })] }),
        new Paragraph({ children: [new TextRun({ text: "Puanlama Aralığı: ", bold: true }), new TextRun("Madde puanları 1-4 aralığında değerlendirilmiştir. Toplam düzey 1-4 aralığındadır.")] }),
        new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows }),
        new Paragraph({ children: [new TextRun({ text: "Form Maddeleri", bold: true, size: 19 })] }),
        new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: rubricRows }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 220 }, children: [new TextRun({ text: `${baseMeta.teacher}\nDers Öğretmeni                         ${formDate || ".... / .... / ........"}\nOkul Müdürü onayı / imza: ........................\n${baseMeta.principal}\nOkul Müdürü`, bold: true, size: 17 })] }),
      ] }] });
      const blob = await Packer.toBlob(doc);
      downloadBlob(blob, safeFileName(["FOPOS", grade, branch, "Surec_Degerlendirme_Formu"], "docx"));
      setOperationMessage("Süreç değerlendirme formu DOCX olarak indirildi.");
    } catch (error) {
      setOperationMessage(operationErrorMessage(error, "Süreç değerlendirme formu indirilemedi."));
    } finally {
      setExporting(false);
    }
  };

  return <section className="performance-module" id="top" data-sensitive-session={students.length > 0 || incomingRoster ? "active" : "inactive"}>
    {operationMessage && <div className="calendar-note" role="status" aria-live="polite">
<ShieldAlert size={18} />
<span>{operationMessage}</span>
</div>}
    {incomingRoster ? <section className="incoming-roster incoming-roster--attention" role="region" aria-labelledby="incoming-roster-title" ref={incomingRosterRef} tabIndex={-1}>
<div>
<strong id="incoming-roster-title">Öğrenci Listelerinden performansa liste geldi</strong>
<span>{incomingRoster.grade}-{incomingRoster.branch} • {incomingRoster.students.length} öğrenci • Puan ve sınav sonucu içermez</span>
<p>Liste otomatik uygulanmadı. Kabul ederseniz öğrenciler boş performans kanıtlarıyla eklenir; reddederseniz aktarım paketi oturumdan silinir.</p>
</div>
<div>
<button type="button" className="secondary-button" onClick={onResolveRoster}>Aktarımı reddet ve sil</button>
<button type="button" className="primary-button" onClick={acceptIncomingRoster}>{incomingRoster.students.length} öğrenciyi performansa kabul et</button>
</div>
</section> : null}
    <section className="annual-hero performance-hero">
      <div>
<span className="eyebrow">
<TrendingUp size={15} /> FOPOS • Öğrenci Performansı</span>
<h1>Tek sınava değil,<br />
<em>gelişim kanıtlarına</em> bakın.</h1>
<p>Farklı tarihli öğrenme kanıtlarını {subjectName} alan becerileriyle ilişkilendirin; eğilimi ve destek gereksinimini kalıcı etiketler oluşturmadan izleyin.</p>
</div>
      <div className="builder-card">
<div className="card-heading">
<span className="step-badge">01</span>
<div>
<h2>Performans görünümü</h2>
<p>Çoklu kanıt ve beceri temelli izleme</p>
</div>
</div>
<div className="performance-context-grid">
<label className="field">
<span>Sınıf</span>
<select value={grade} disabled>
<option value={grade}>{grade}. Sınıf</option>
</select>
</label>
<label className="field">
<span>Şube</span>
<select value={branch} disabled><option value={branch}>{branch}</option></select>
</label>
</div>
<label className="field">
<span>Süreç değerlendirme formu başlığı</span>
<input value={formTitle} onChange={(event) => setFormTitle(event.target.value)} />
</label>
<label className="field">
<span>Form tarihi</span>
<input type="date" value={formDate} onChange={(event) => setFormDate(event.target.value)} />
</label>
<div className="calendar-note meeting-warning">
<ShieldAlert size={18} />
<div>
<strong>Geçici, yerel çalışma alanı • {grade}-{branch}</strong>
<span>Veriler bu sınıf ve şube bağlamında tutulur; harici yapay zekâya gönderilmez. Öğrenciler kalıcı başarı veya yetenek kategorilerine ayrılmaz.</span>
</div>
</div>
<button type="button" className="primary-button" onClick={addStudent}>
<Plus size={18} /> Öğrenci performans kaydı ekle</button>
</div>
    </section>
    <section className="results-section performance-results" ref={resultsRef} tabIndex={-1}>
      <div className="results-header">
<div>
<span className="review-pill">
<BarChart3 size={15} /> KANITA DAYALI GELİŞİM</span>
<h2>{subjectName} beceri gelişim görünümü</h2>
<p>{students.length} öğrenci • {allEvidence.length} kanıt • Sınıf ortalaması {classAverage === null ? "—" : classAverage.toFixed(1)}</p>
</div>{students.length > 0 && <div className="session-actions">
<button type="button" className="download-button" disabled={exporting} onClick={() => void exportProcessForm()}>
<Download size={16} /> {exporting ? "Hazırlanıyor…" : "Süreç değerlendirme formunu DOCX indir"}</button>
<button type="button" className="secondary-button" disabled={students.length < 5} onClick={exportAnonymousSummary}>Kimliksiz sınıf özetini indir</button>
<label>
<input type="checkbox" checked={clearConfirmed} onChange={(event) => setClearConfirmed(event.target.checked)} /> Oturum verilerinin silineceğini anlıyorum</label>
<button type="button" className="row-delete session-clear" disabled={!clearConfirmed} onClick={clearSession}>Oturumu temizle</button>
</div>}</div>
      {students.length === 0 ? <div className="performance-empty">
<UsersRound size={32} />
<h3>Henüz öğrenci performans kaydı yok</h3>
<p>İlk kaydı ekleyerek tarihli öğrenme kanıtlarını ve {subjectName} beceri gelişimini izlemeye başlayın.</p>
</div> : <>
        <section className="skill-map" aria-labelledby="skill-map-title">
<div>
<h3 id="skill-map-title">Sınıf öğrenme haritası</h3>
<p>Her beceri için girilmiş tüm kanıtların kural tabanlı ortalaması.</p>
</div>
<div className="skill-map-grid">{skillMap.map((item) => <article key={item.key}>
<span>{item.label}</span>
<strong>{item.average === null ? "—" : item.average.toFixed(1)}</strong>
<small>{item.count} değerlendirme</small>
</article>)}</div>
</section>
        <div className="performance-list">{students.map((student, studentIndex) => {
          const dated = [...student.evidenceRecords].sort((a, b) => a.date.localeCompare(b.date));
          const evidenceAverages = dated.map((record) => ({ date: record.date, value: average(Object.values(record.scores)) })).filter((item): item is { date: string; value: number } => item.value !== null);
          const first = evidenceAverages.at(0)?.value; const latest = evidenceAverages.at(-1)?.value;
          const delta = first !== undefined && latest !== undefined && evidenceAverages.length > 1 ? latest - first : null;
          const trend = delta === null ? "Eğilim için en az iki puanlanmış kanıt gerekir" : Math.abs(delta) < 0.15 ? "Dengeli seyir" : delta > 0 ? `Artış +${delta.toFixed(1)}` : `İzleme önceliği ${delta.toFixed(1)}`;
          return <article className="performance-card" key={student.id}>
            <div className="performance-card-header">
<div>
<strong>{student.name || `${studentIndex + 1}. öğrenci`}</strong>
<span>{student.evidenceRecords.length} tarihli kanıt • {trend}</span>
</div>
<button type="button" className="row-delete" onClick={() => setStudents((current) => current.filter((item) => item.id !== student.id))} aria-label={`${studentIndex + 1}. öğrenci performans kaydını sil`}>
<Trash2 size={16} />
</button>
</div>
            <div className="performance-meta-grid">
<label className="field">
<span>Öğrenci numarası</span>
<input value={student.no} onChange={(event) => updateStudent(student.id, { no: event.target.value })} />
</label>
<label className="field">
<span>Ad soyad</span>
<input value={student.name} onChange={(event) => updateStudent(student.id, { name: event.target.value })} />
</label>
</div>
            <div className="evidence-list">{student.evidenceRecords.map((record, recordIndex) => <section className="evidence-card" key={record.id}>
              <div className="evidence-header">
<strong>{recordIndex + 1}. öğrenme kanıtı</strong>{student.evidenceRecords.length > 1 && <button type="button" className="row-delete" onClick={() => removeEvidence(student.id, record.id)} aria-label={`${recordIndex + 1}. öğrenme kanıtını sil`}>
<Trash2 size={15} />
</button>}</div>
              <div className="evidence-meta-grid">
<label className="field">
<span>Kanıt tarihi</span>
<input type="date" value={record.date} onChange={(event) => updateEvidence(student.id, record.id, { date: event.target.value })} />
</label>
<label className="field">
<span>Kanıt türü</span>
<select value={record.type} onChange={(event) => updateEvidence(student.id, record.id, { type: event.target.value })}>{evidenceTypes.map((type) => <option key={type}>{type}</option>)}</select>
</label>
<label className="field evidence-outcome">
<span>Öğrenme çıktısı</span>
<select value={record.outcome} onChange={(event) => updateEvidence(student.id, record.id, { outcome: event.target.value })}>{gradeOutcomes.map((outcome) => <option key={outcome.code} value={outcome.code}>{outcome.code} • {outcome.short}</option>)}</select>
</label>
</div>
              <div className="skill-score-grid" aria-label={`${studentIndex + 1}. öğrenci ${recordIndex + 1}. kanıt beceri puanları`}>{skills.map(([key, label]) => <label key={key}>
<span>{label}</span>
<select value={record.scores[key] ?? ""} onChange={(event) => updateEvidence(student.id, record.id, { scores: { ...record.scores, [key]: event.target.value === "" ? null : Number(event.target.value) } })}>
<option value="">—</option>
<option value={1}>1 • Başlangıç</option>
<option value={2}>2 • Gelişiyor</option>
<option value={3}>3 • Yetkin</option>
<option value={4}>4 • İleri</option>
</select>
</label>)}</div>
              <label className="field">
<span>Öğretmen gözlem ve destek notu</span>
<textarea value={record.note} onChange={(event) => updateEvidence(student.id, record.id, { note: event.target.value })} placeholder="Kanıta dayalı gözlem, destek çalışması ve yeniden değerlendirme notu" />
</label>
            </section>)}</div>
            <button type="button" className="secondary-action add-evidence" onClick={() => setStudents((current) => current.map((item) => item.id === student.id ? { ...item, evidenceRecords: [...item.evidenceRecords, newEvidence()] } : item))}>
<Plus size={16} /> Yeni tarihli kanıt ekle</button>
            <div className="performance-guidance">
<Target size={17} />
<span>{delta === null ? "İkinci tarihli kanıt girildiğinde gelişim eğilimi oluşur." : "Eğilim, yalnızca girilmiş kanıtların özeti olup öğrenci hakkında kalıcı bir etiket veya otomatik karar değildir."}</span>
</div>
          </article>;
        })}</div>
        <section className="support-planner" aria-labelledby="support-title">
<div>
<h3 id="support-title">Grup destek planı</h3>
<p>Sistem yalnızca son kanıta göre destek adayı gösterebilir; grubu, çalışmayı ve uygulama kararını öğretmen belirler.</p>
</div>
<div className="support-layout">
<label className="field">
<span>Odak beceri</span>
<select value={supportSkill} onChange={(event) => { setSupportSkill(event.target.value as SkillKey); setSelectedStudentIds([]); setSupportConfirmed(false); }}>{skills.map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select>
</label>
<button type="button" className="secondary-action" onClick={() => setSelectedStudentIds(suggestedIds)}>Düzeyi 1–2 olanları öneriye göre seç</button>
</div>
          <fieldset className="support-student-list">
<legend>Öğretmenin gruba dahil edeceği öğrenciler</legend>{students.map((student, index) => { const score = latestSkillScore(student, supportSkill); return <label key={student.id}>
<input type="checkbox" checked={selectedStudentIds.includes(student.id)} onChange={(event) => setSelectedStudentIds((current) => event.target.checked ? [...current, student.id] : current.filter((id) => id !== student.id))} />
<span>{student.name || student.no || `${index + 1}. öğrenci`}</span>
<small>Son {selectedSkillLabel} kanıtı: {score ?? "—"}{score !== null && score <= 2 ? " • destek adayı" : ""}</small>
</label>; })}</fieldset>
          <label className="field">
<span>Yeniden öğretim / destek çalışması</span>
<textarea value={supportAction} onChange={(event) => setSupportAction(event.target.value)} placeholder="Örn. Küçük grup argüman çözümleme etkinliği ve izleme kanıtı" />
</label>
<label className="support-confirm">
<input type="checkbox" checked={supportConfirmed} onChange={(event) => setSupportConfirmed(event.target.checked)} />
<span>Bu grubun geçici ve kanıta dayalı olduğunu; nihai plan kararının bana ait olduğunu onaylıyorum.</span>
</label>
<button type="button" className="primary-button" disabled={!supportConfirmed || !supportAction.trim() || selectedStudentIds.length === 0} onClick={createSupportPlan}>Grup destek planını oluştur</button>
          {supportPlans.length > 0 && <div className="support-plan-list">{supportPlans.map((plan) => <article key={plan.id}>
<div>
<strong>{skills.find(([key]) => key === plan.skill)?.[1]} destek planı</strong>
<span>{plan.studentNames.join(", ")}</span>
<p>{plan.action}</p>
</div>
<button type="button" className="row-delete" onClick={() => setSupportPlans((current) => current.filter((item) => item.id !== plan.id))} aria-label="Destek planını sil">
<Trash2 size={15} />
</button>
</article>)}</div>}
        </section>
      </>}
    </section>
  </section>;
}
