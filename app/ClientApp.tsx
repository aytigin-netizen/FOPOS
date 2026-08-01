"use client";

import {
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  Clock3,
  Download,
  FileCheck2,
  Layers3,
  LoaderCircle,
  PanelTop,
  RefreshCw,
  Route,
  School,
  ShieldCheck,
  Sparkles,
  Target,
  UsersRound,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import ExamBuilder from "./modules/exam-builder/ExamBuilder";
import { AppFooter } from "./components/navigation/AppFooter";
import { Dashboard } from "./components/dashboard/Dashboard";
import {
  AppNavigation,
  type AppView,
} from "./components/navigation/AppNavigation";
import { resolveOutcome, type Grade, type Unit } from "./data/curriculum";
import { getCurriculumContext } from "./data/curriculum-runtime";
import { listRegisteredDisciplines } from "../src/core/curriculum/curriculum-registry";
import AnnualPlanModule from "./modules/annual-plan/AnnualPlanModule";
import DepartmentMeetingModule from "./modules/department-meeting/DepartmentMeetingModule";
import {
  getWeekFocus,
  makeResult,
  profiles,
  type PlanMeta,
  type PlanResult,
  type ProfileKey,
  type ResultTab,
} from "./modules/lesson-studio/lesson-engine";
import { exportDailyPlan } from "./modules/daily-plan/export-daily-plan";
import ExamAnalysisModule from "./modules/exam-analysis/ExamAnalysisModule";
import StudentPerformanceModule from "./modules/student-performance/StudentPerformanceModule";
import StudentRostersModule from "./modules/student-rosters/StudentRostersModule";
import ResourceCenterModule, { type ResourceSection } from "./modules/resource-center/ResourceCenterModule";
import FoposAiModule from "./modules/fopos-ai/FoposAiModule";
import PrivacyCenterModule from "./modules/privacy/PrivacyCenterModule";
import RecordArchiveModule from "./modules/record-archive/RecordArchiveModule";
import ProfileSettingsModule from "./modules/profile-settings/ProfileSettingsModule";
import ClassWorkspacesModule from "./modules/class-workspaces/ClassWorkspacesModule";
import { ClassWorkspaceSelector } from "./components/workspace/ClassWorkspaceSelector";
import { ClassWorkspaceEmptyState } from "./components/workspace/ClassWorkspaceEmptyState";
import type { ClassWorkspaceContext } from "./core/class-workspace";
import type { AnonymousClassSummary } from "./core/anonymous-class-summary";
import type { StudentRosterTransfer } from "./core/student-roster-transfer";
import type { ManagedStudentRoster } from "./core/managed-student-roster";
import type { ExamBlueprintTransfer } from "./core/exam-blueprint-transfer";
import { useSensitiveSession } from "./hooks/use-sensitive-session";
import { operationErrorMessage } from "./core/operation-error";
import { cleanCurriculumText, formatCurriculumList } from "./core/curriculum-text";
import {
  approveRecord,
  deriveProduct,
  reviseRecord,
  submitForReview,
  type PedagogicalRecord,
} from "./core/pedagogical-record";
import type { GenerationProvenance } from "./core/opus-generation-bridge";

export type OutcomeCode = string;
export type UnitCode = string;
export default function ClientApp({
  teacherDisplayName,
  schoolName,
  academicYear,
  defaultDisciplineCode,
  isAuthenticated,
}: {
  teacherDisplayName: string;
  schoolName: string;
  academicYear: string;
  defaultDisciplineCode: string;
  isAuthenticated: boolean;
}) {
  const initialCurriculum = getCurriculumContext(defaultDisciplineCode);
  const [view, setView] = useState<AppView>("home");
  const [aiSummary, setAiSummary] = useState<AnonymousClassSummary | null>(null);
  const [resourceSection, setResourceSection] = useState<ResourceSection>("curriculum");
  const [subjectCode, setSubjectCode] = useState(defaultDisciplineCode);
  const [availableCurricula, setAvailableCurricula] = useState<
    Array<{ code: string; name: string }>
  >(isAuthenticated
    ? [{ code: initialCurriculum.subjectCode, name: initialCurriculum.subjectName }]
    : listRegisteredDisciplines());
  const curriculum = useMemo(
    () => getCurriculumContext(subjectCode),
    [subjectCode],
  );
  const units = curriculum.units;
  const [grade, setGrade] = useState<Grade>(initialCurriculum.defaultGrade);
  const [unitCode, setUnitCode] = useState<UnitCode>(
    initialCurriculum.units.find(
      (item) => item.grade === initialCurriculum.defaultGrade,
    )?.code ?? initialCurriculum.units[0].code,
  );
  const [week, setWeek] = useState(1);
  const [outcome, setOutcome] = useState<OutcomeCode>(
    initialCurriculum.units.find((item) => item.code === unitCode)?.outcomes[0]
      .code ?? "",
  );
  const [profile, setProfile] = useState<ProfileKey>("balanced");
  const [result, setResult] = useState<PlanResult | null>(null);
  const [activeTab, setActiveTab] = useState<ResultTab>("plan");
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [operationMessage, setOperationMessage] = useState("");
  const [teacherReviewConfirmed, setTeacherReviewConfirmed] = useState(false);
  const [generationProvenance, setGenerationProvenance] =
    useState<GenerationProvenance | null>(null);
  const [recordSaveStatus, setRecordSaveStatus] =
    useState("Henüz kaydedilmedi");
  const [recordHistory, setRecordHistory] = useState<PedagogicalRecord[]>([]);
  const [pendingRosterTransfer, setPendingRosterTransfer] = useState<StudentRosterTransfer | null>(null);
  const [pendingRosterTarget, setPendingRosterTarget] = useState<"analysis" | "performance" | null>(null);
  const [pendingExamTransfer, setPendingExamTransfer] = useState<ExamBlueprintTransfer | null>(null);
  const [sessionRosters, setSessionRosters] = useState<ManagedStudentRoster[]>([]);
  const [classWorkspaces, setClassWorkspaces] = useState<ClassWorkspaceContext[]>([]);
  const [selectedClassWorkspaceId, setSelectedClassWorkspaceId] = useState("");
  const [classWorkspaceMessage, setClassWorkspaceMessage] = useState("");
  const [meta, setMeta] = useState<PlanMeta>({
    school: schoolName,
    academicYear,
    date: "",
    teacher: teacherDisplayName,
    principal: "",
    specialDays: "",
  });
  const resultsRef = useRef<HTMLDivElement>(null);
  useSensitiveSession(sessionRosters.length > 0 || pendingRosterTransfer !== null);
  useEffect(() => {
    if (!isAuthenticated) return;
    let active = true;
    void fetch("/api/teacher-disciplines")
      .then(async (response) => {
        const payload = (await response.json()) as {
          assignments?: Array<{ disciplineCode: string; isDefault: boolean }>;
          availableDisciplines?: Array<{ code: string; name: string }>;
        };
        if (!response.ok || !payload.assignments || !payload.availableDisciplines) {
          throw new Error("Branş müfredatları açılamadı.");
        }
        if (!active) return;
        const assigned = new Set(
          payload.assignments.map((item) => item.disciplineCode),
        );
        setAvailableCurricula(
          payload.availableDisciplines.filter((item) => assigned.has(item.code)),
        );
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [isAuthenticated]);
  useEffect(() => {
    if (!isAuthenticated) return;
    if (!["rosters", "analysis", "performance", "classes"].includes(view)) return;
    let active = true;
    void fetch("/api/class-workspaces")
      .then(async (response) => {
        const payload = (await response.json()) as { workspaces?: ClassWorkspaceContext[]; error?: string };
        if (!response.ok || !payload.workspaces) throw new Error(payload.error ?? "Sınıf çalışma alanları açılamadı.");
        if (!active) return;
        const available = payload.workspaces.filter((item) => !item.archivedAt);
        setClassWorkspaces(available);
        setSelectedClassWorkspaceId((current) => available.some((item) => item.id === current) ? current : (available[0]?.id ?? ""));
        setClassWorkspaceMessage("");
      })
      .catch((error) => {
        if (active) setClassWorkspaceMessage(error instanceof Error ? error.message : "Sınıf çalışma alanları açılamadı.");
      });
    return () => { active = false; };
  }, [isAuthenticated, view]);
  const selectedClassWorkspace = classWorkspaces.find((item) => item.id === selectedClassWorkspaceId) ?? null;
  const selectedClassCurriculum = selectedClassWorkspace
    ? getCurriculumContext(selectedClassWorkspace.subjectCode)
    : curriculum;
  const hasSensitiveStudentSession =
    sessionRosters.length > 0 || pendingRosterTransfer !== null;

  function clearSensitiveStudentSession() {
    setSessionRosters([]);
    setPendingRosterTransfer(null);
    setPendingRosterTarget(null);
  }

  function selectClassWorkspace(nextId: string) {
    if (nextId === selectedClassWorkspaceId) return true;
    if ((sessionRosters.length > 0 || pendingRosterTransfer) && !window.confirm("Sınıf çalışma alanı değişirse bu oturumdaki öğrenci listeleri ve bekleyen aktarımlar silinir. Devam etmek istiyor musunuz?")) return false;
    setSessionRosters([]);
    setPendingRosterTransfer(null);
    setPendingRosterTarget(null);
    setSelectedClassWorkspaceId(nextId);
    return true;
  }

  function registerClassWorkspace(workspace: ClassWorkspaceContext) {
    setClassWorkspaces((current) => {
      const next = current.filter((item) => item.id !== workspace.id);
      return [...next, workspace].sort(
        (left, right) =>
          left.subjectCode.localeCompare(right.subjectCode, "en") ||
          left.grade - right.grade ||
          left.branchCode.localeCompare(right.branchCode, "tr"),
      );
    });
    setSelectedClassWorkspaceId(workspace.id);
    setClassWorkspaceMessage("");
  }

  function openClassWorkspace(
    workspaceId: string,
    target: "rosters" | "analysis" | "performance",
  ) {
    if (!selectClassWorkspace(workspaceId)) return;
    setView(target);
    setResult(null);
  }
  const gradeUnits = units.filter((item) => item.grade === grade);
  const selectedUnitCandidate = units.find(
    (item) => item.grade === grade && item.code === unitCode,
  );
  if (!selectedUnitCandidate) {
    throw new Error(`${curriculum.subjectName} için ${unitCode} ünitesi bulunamadı.`);
  }
  const selectedUnit: Unit = selectedUnitCandidate;
  const selectedOutcomeResult = resolveOutcome(selectedUnit, outcome);
  if (!selectedOutcomeResult.ok) throw new Error(selectedOutcomeResult.message);
  const selectedOutcome = selectedOutcomeResult.value;

  function changeGrade(nextGrade: Grade) {
    const firstUnit = units.find((item) => item.grade === nextGrade);
    if (!firstUnit)
      throw new Error(
        `${nextGrade}. sınıf için doğrulanmış müfredat bulunamadı.`,
      );
    setGrade(nextGrade);
    setUnitCode(firstUnit.code);
    setOutcome(firstUnit.outcomes[0].code);
    setWeek(1);
    setResult(null);
  }

  function changeUnit(nextCode: UnitCode) {
    const nextUnit = units.find(
      (item) => item.grade === grade && item.code === nextCode,
    );
    if (!nextUnit) throw new Error(`${nextCode} kodlu ünite bulunamadı.`);
    setUnitCode(nextCode);
    setOutcome(nextUnit.outcomes[0].code);
    setWeek(1);
    setResult(null);
  }

  function changeSubject(nextSubjectCode: string) {
    const nextCurriculum = getCurriculumContext(nextSubjectCode);
    const nextGrade = nextCurriculum.defaultGrade;
    const nextUnit =
      nextCurriculum.units.find((item) => item.grade === nextGrade) ??
      nextCurriculum.units[0];
    if (!nextUnit || !nextUnit.outcomes[0]) {
      throw new Error(`${nextCurriculum.subjectName} müfredat kapsamı açılamadı.`);
    }
    setSubjectCode(nextSubjectCode);
    setGrade(nextGrade);
    setUnitCode(nextUnit.code);
    setOutcome(nextUnit.outcomes[0].code);
    setWeek(1);
    setResult(null);
  }

  const totalDuration = useMemo(
    () => result?.phases.reduce((sum, phase) => sum + phase.duration, 0) ?? 80,
    [result],
  );
  async function storeResult(next: PlanResult) {
    if (!isAuthenticated) {
      setRecordSaveStatus(
        `Misafir oturumunda hazırlandı • Revizyon ${next.pedagogicalRecord.revision}`,
      );
      setRecordHistory((current) => [
        ...current.filter(
          (item) =>
            !(
              item.recordId === next.pedagogicalRecord.recordId &&
              item.revision === next.pedagogicalRecord.revision
            ),
        ),
        next.pedagogicalRecord,
      ]);
      setResult(next);
      return;
    }
    setRecordSaveStatus("Güvenli çalışma alanına kaydediliyor…");
    try {
      const response = await fetch("/api/pedagogical-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(next.pedagogicalRecord),
      });
      const payload = (await response.json()) as {
        history?: PedagogicalRecord[];
        error?: string;
      };
      if (!response.ok || !payload.history) {
        throw new Error(payload.error ?? "Kayıt saklanamadı.");
      }
      setRecordSaveStatus(
        `Hesabınıza kaydedildi • Revizyon ${next.pedagogicalRecord.revision}`,
      );
      setRecordHistory(payload.history);
      setResult(next);
    } catch (error) {
      setRecordSaveStatus(
        error instanceof Error ? error.message : "Kayıt saklanamadı",
      );
      throw error;
    }
  }

  async function generatePlan() {
    setGenerating(true);
    setOperationMessage("Ders planı hazırlanıyor…");
    try {
      const outcomeResult = resolveOutcome(selectedUnit, outcome);
      if (!outcomeResult.ok) throw new Error(outcomeResult.message);
      setResult(null);
      setProgress(18);
      await new Promise((resolve) => setTimeout(resolve, 260));
      setProgress(42);
      await new Promise((resolve) => setTimeout(resolve, 260));
      setProgress(68);
      await new Promise((resolve) => setTimeout(resolve, 260));
      setProgress(92);
      await new Promise((resolve) => setTimeout(resolve, 220));
      await storeResult(
        makeResult(
          selectedUnit,
          outcome,
          profile,
          week,
          curriculum.datasetVersion,
        ),
      );
      setProgress(100);
      setActiveTab(view === "daily" ? "official" : "plan");
      setTeacherReviewConfirmed(false);
      setOperationMessage("Ders planı başarıyla hazırlandı.");
      window.setTimeout(() => {
        resultsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        resultsRef.current?.focus();
      }, 80);
    } catch (error) {
      setProgress(0);
      setOperationMessage(
        operationErrorMessage(error, "Ders planı hazırlanamadı."),
      );
    } finally {
      setGenerating(false);
    }
  }

  async function downloadDailyPlan() {
    if (!result) return;
    setExporting(true);
    setOperationMessage("Günlük plan dosyası hazırlanıyor…");
    try {
      const provenance = await exportDailyPlan(
        result,
        meta,
        curriculum.subjectName,
        isAuthenticated
          ? async (trace) => {
              const response = await fetch("/api/document-generations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(trace),
              });
              const payload = (await response.json()) as { error?: string };
              if (!response.ok) {
                throw new Error(payload.error ?? "OPUS üretim izi arşivlenemedi.");
              }
            }
          : undefined,
      );
      setGenerationProvenance(provenance);
      setOperationMessage(
        isAuthenticated
          ? "Günlük plan indirildi ve OPUS üretim izi kalıcı arşive kaydedildi."
          : "Günlük plan indirildi. Misafir üretim izi yalnız bu oturumda gösterilir.",
      );
    } catch (error) {
      setOperationMessage(
        operationErrorMessage(error, "Günlük plan indirilemedi."),
      );
    } finally {
      setExporting(false);
    }
  }
  async function sendToTeacherReview() {
    if (!result) return;
    setOperationMessage("Kayıt öğretmen incelemesine gönderiliyor…");
    try {
      await storeResult({
        ...result,
        pedagogicalRecord: submitForReview(result.pedagogicalRecord),
      });
      setTeacherReviewConfirmed(false);
      setOperationMessage("Kayıt öğretmen incelemesine gönderildi.");
    } catch (error) {
      setOperationMessage(
        operationErrorMessage(error, "Kayıt incelemeye gönderilemedi."),
      );
    }
  }
  async function approveCurrentRecord() {
    if (!result || !teacherReviewConfirmed) return;
    setOperationMessage("Öğretmen onayı kaydediliyor…");
    try {
      await storeResult({
        ...result,
        pedagogicalRecord: approveRecord(
          result.pedagogicalRecord,
          `Müfredat bağlantısını, pedagojik uygunluğu ve ${curriculum.subjectName} alan içeriğini kontrol ettim.`,
        ),
      });
      setOperationMessage("Öğretmen onayı hesabınıza kaydedildi.");
    } catch (error) {
      setOperationMessage(
        operationErrorMessage(error, "Öğretmen onayı kaydedilemedi."),
      );
    }
  }
  async function createRevision() {
    if (!result) return;
    setOperationMessage("Yeni revizyon hazırlanıyor…");
    try {
      const generated = makeResult(
          selectedUnit,
          outcome,
          profile,
          week,
          curriculum.datasetVersion,
        ),
        next = reviseRecord(result.pedagogicalRecord, {
          lessonContext: generated.pedagogicalRecord.lessonContext,
          pedagogicalDecision: generated.pedagogicalRecord.pedagogicalDecision,
        }).next,
        product = deriveProduct(next, "lesson_design");
      await storeResult({
        ...generated,
        pedagogicalRecord: next,
        product,
        traceId: product.productId,
      });
      setTeacherReviewConfirmed(false);
      setOperationMessage(`Revizyon ${next.revision} hesabınıza kaydedildi.`);
    } catch (error) {
      setOperationMessage(
        operationErrorMessage(error, "Yeni revizyon kaydedilemedi."),
      );
    }
  }

  return (
    <main className="app-shell" data-sensitive-session={sessionRosters.length > 0 || pendingRosterTransfer ? "active" : "inactive"}>
      <AppNavigation
        view={view}
        teacherDisplayName={teacherDisplayName}
        curriculumLabel={`${curriculum.subjectName} • TYMM ${curriculum.sourceYear}`}
        isAuthenticated={isAuthenticated}
        onChange={(next) => {
          if (pendingRosterTransfer && next !== pendingRosterTarget) { setPendingRosterTransfer(null); setPendingRosterTarget(null); }
          if (pendingExamTransfer && next !== "analysis") setPendingExamTransfer(null);
          setView(next);
          setResult(null);
        }}
      />

      <div className="app-content">

      {!isAuthenticated ? (
        <div className="guest-access-banner" role="status">
          <ShieldCheck size={18} />
          <span>
            <strong>Misafir kullanım</strong>
            Planlama ve içerik modüllerini üyeliksiz kullanabilirsiniz. Kalıcı
            kayıt, sınıf yönetimi ve öğrenci işlemleri için daha sonra giriş
            yapabilirsiniz.
          </span>
          <a href="/signin-with-chatgpt?return_to=%2F">Ücretsiz giriş yap</a>
        </div>
      ) : null}

      {operationMessage && (
        <div className="calendar-note" role="status" aria-live="polite">
          <CircleAlert size={18} /> <span>{operationMessage}</span>
        </div>
      )}
      {["studio", "daily", "annual", "exam"].includes(view) ? (
        <section className="class-context-bar curriculum-context-bar" aria-label="Etkin branş müfredatı">
          <div>
            <BookOpen size={20} />
            <span>
              <strong>Etkin branş müfredatı</strong>
              <small>
                {curriculum.sourceTitle} • {curriculum.sourceYear}
              </small>
            </span>
          </div>
          <label>
            <span>Branş</span>
            <select
              value={subjectCode}
              onChange={(event) => changeSubject(event.target.value)}
            >
              {availableCurricula.map((item) => (
                <option value={item.code} key={item.code}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <p>
            <ShieldCheck size={15} /> Ünite ve öğrenme çıktıları seçilen resmî
            paketten alınır.
          </p>
        </section>
      ) : null}

      {classWorkspaceMessage && ["rosters", "analysis", "performance"].includes(view) ? (
        <div className="class-context-empty" role="alert"><School size={28}/><h2>Sınıf bağlamı açılamadı</h2><p>{classWorkspaceMessage}</p></div>
      ) : ["rosters", "analysis", "performance"].includes(view) && !selectedClassWorkspace ? (
        view === "rosters" ? <ClassWorkspaceEmptyState onCreated={registerClassWorkspace} /> : <div className="class-context-empty"><School size={32}/><h2>Önce bir sınıf çalışma alanı oluşturun</h2><p>Öğrenci verilerini güvenli ve doğru bağlamda işlemek için etkin bir sınıf/şube gerekir.</p><button className="primary-button" onClick={() => setView("classes")}>Sınıf ve Şubelere git</button></div>
      ) : (
        <>
        {selectedClassWorkspace && ["rosters", "analysis", "performance"].includes(view) ? <ClassWorkspaceSelector workspaces={classWorkspaces} selectedId={selectedClassWorkspaceId} onSelect={selectClassWorkspace} onManage={() => setView("classes")} /> : null}
      {view === "home" ? (
        <Dashboard teacherDisplayName={teacherDisplayName} isAuthenticated={isAuthenticated} onOpen={(next,section)=>{if(section)setResourceSection(section);setView(next);setResult(null)}} />
      ) : view === "annual" ? (
        <AnnualPlanModule key={subjectCode} meta={meta} setMeta={setMeta} curriculum={curriculum} />
      ) : view === "meeting" ? (
        <DepartmentMeetingModule baseMeta={meta} />
      ) : view === "exam" ? (
        <ExamBuilder key={subjectCode} baseMeta={meta} units={units} subjectName={curriculum.subjectName} subjectCode={curriculum.subjectCode} datasetVersion={curriculum.datasetVersion} defaultGrade={curriculum.defaultGrade} onTransferToAnalysis={(transfer) => { setPendingExamTransfer(transfer); setView("analysis"); setResult(null); }} />
      ) : view === "rosters" ? (
        <StudentRostersModule key={selectedClassWorkspace!.id} classContext={selectedClassWorkspace!} subjectName={selectedClassCurriculum.subjectName} rosters={sessionRosters} onChange={setSessionRosters} onTransfer={(transfer,target)=>{setPendingRosterTransfer(transfer);setPendingRosterTarget(target);setView(target);}} />
      ) : view === "analysis" ? (
        <ExamAnalysisModule key={selectedClassWorkspace!.id} classContext={selectedClassWorkspace!} baseMeta={meta} units={selectedClassCurriculum.units} incomingExam={pendingExamTransfer} onResolveExam={() => setPendingExamTransfer(null)} incomingRoster={pendingRosterTarget === "analysis" ? pendingRosterTransfer : null} onResolveRoster={() => {setPendingRosterTransfer(null);setPendingRosterTarget(null)}} onTransferRoster={(transfer) => { setPendingRosterTransfer(transfer); setPendingRosterTarget("performance"); setView("performance"); setResult(null); }} onSendToAi={(summary) => { setAiSummary(summary); setView("ai"); setResult(null); }} />
      ) : view === "ai" ? (
        <FoposAiModule summary={aiSummary} onOpenAnalysis={() => setView("analysis")} />
      ) : view === "performance" ? (
        <StudentPerformanceModule key={selectedClassWorkspace!.id} classContext={selectedClassWorkspace!} subjectName={selectedClassCurriculum.subjectName} baseMeta={meta} units={selectedClassCurriculum.units} incomingRoster={pendingRosterTarget === "performance" ? pendingRosterTransfer : null} onResolveRoster={() => {setPendingRosterTransfer(null);setPendingRosterTarget(null)}} />
      ) : view === "resources" ? (
        <ResourceCenterModule units={units} subjectName={curriculum.subjectName} initialSection={resourceSection} onOpen={(next)=>{setView(next);setResult(null)}} />
      ) : view === "privacy" ? (
        <PrivacyCenterModule onOpenAnalysis={() => setView("analysis")} />
      ) : view === "archive" ? (
        <RecordArchiveModule />
      ) : view === "classes" ? (
        <ClassWorkspacesModule activeSessionWorkspaceId={selectedClassWorkspaceId} hasSensitiveSession={hasSensitiveStudentSession} onClearSensitiveSession={clearSensitiveStudentSession} onWorkspaceCreated={registerClassWorkspace} onOpenWorkspace={openClassWorkspace} />
      ) : view === "settings" ? (
        <ProfileSettingsModule hasSensitiveSession={hasSensitiveStudentSession} />
      ) : (
        <>
          <section className={`hero ${view === "studio" ? "studio-hero" : "daily-hero"}`} id="top">
            <div className="hero-copy">
              <span className="eyebrow">
                <Sparkles size={15} />{" "}
                {view === "daily"
                  ? "FOPOS v47 • MEB Uyumlu Günlük Plan"
                  : "FOPOS v47 • Professional Edition"}
              </span>
              <h1>
                {view === "daily" ? (
                  <>
                    Resmî günlük planı
                    <br />
                    <em>tek akışta</em> hazırlayın.
                  </>
                ) : (
                  <>
                    {curriculum.subjectName} dersini
                    <br />
                    <em>karardan uygulamaya</em> tasarlayın.
                  </>
                )}
              </h1>
              <p>
                {view === "daily"
                  ? "Sınıf, ünite ve haftayı seçin; sistem TYMM bileşenleri, 80 dakikalık öğrenme-öğretme yaşantıları, ölçme, farklılaştırma ve imza alanlarıyla tam günlük plan oluştursun."
                  : "Üniteyi ve haftalık kapsamı seçin; sistem o haftaya ait pedagojik kararı kursun, 80 dakikalık ders akışını hazırlasın ve sekiz kalite boyutunda doğrulasın."}
              </p>
              <div className="hero-stats" aria-label="Uygulama kapsamı">
                <div>
                  <strong>15</strong>
                  <span>Kanonik ünite</span>
                </div>
                <div>
                  <strong>80</strong>
                  <span>Dakikalık akış</span>
                </div>
                <div>
                  <strong>8</strong>
                  <span>Kalite kapısı</span>
                </div>
              </div>
            </div>

            <form
              className="builder-card"
              onSubmit={(event) => {
                event.preventDefault();
                void generatePlan();
              }}
            >
              <div className="card-heading">
                <span className="step-badge">01</span>
                <div>
                  <h2>
                    {view === "daily"
                      ? "Yeni günlük plan"
                      : "Yeni ders tasarımı"}
                  </h2>
                  <p>
                    {view === "daily"
                      ? "Resmî plan bilgilerini tanımlayın"
                      : "Müfredat bağlamını tanımlayın"}
                  </p>
                </div>
              </div>

              <div className="field-grid compact-grid">
                <label className="field">
                  <span>Sınıf</span>
                  <div className="select-wrap">
                    <select
                      value={grade}
                      onChange={(event) =>
                        changeGrade(Number(event.target.value) as Grade)
                      }
                    >
                      {curriculum.supportedGrades.map((item) => (
                        <option value={item} key={item}>
                          {item}. Sınıf
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} />
                  </div>
                </label>
                <label className="field">
                  <span>Ders süresi</span>
                  <div className="select-wrap locked">
                    <select disabled defaultValue="80">
                      <option>80 dakika</option>
                    </select>
                    <Clock3 size={16} />
                  </div>
                </label>
              </div>

              <label className="field">
                <span>Ünite</span>
                <div className="select-wrap">
                  <select
                    value={unitCode}
                    onChange={(event) =>
                      changeUnit(event.target.value as UnitCode)
                    }
                  >
                    {gradeUnits.map((item) => (
                      <option key={item.code} value={item.code}>
                        {item.code} • {item.name}
                      </option>
                    ))}
                  </select>
                  <BookOpen size={16} />
                </div>
                <small className="field-help">
                  {selectedUnit.hours} haftalık ünite •{" "}
                  {selectedUnit.keywords.join(" · ")}
                </small>
              </label>

              <label className="field">
                <span>Haftalık kapsam</span>
                <div className="select-wrap">
                  <select
                    value={week}
                    onChange={(event) => {
                      setWeek(Number(event.target.value));
                      setResult(null);
                    }}
                  >
                    {Array.from(
                      { length: selectedUnit.hours },
                      (_, index) => index + 1,
                    ).map((item) => (
                      <option key={item} value={item}>
                        {item}. Hafta • {getWeekFocus(selectedUnit, item)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} />
                </div>
                <small className="field-help">
                  Ünitenin {week}/{selectedUnit.hours}. haftası için tek ders
                  oturumu hazırlanır.
                </small>
              </label>

              <label className="field">
                <span>Hedef öğrenme çıktısı</span>
                <div className="select-wrap">
                  <select
                    value={outcome}
                    onChange={(event) =>
                      setOutcome(event.target.value as OutcomeCode)
                    }
                  >
                    {selectedUnit.outcomes.map((item) => (
                      <option key={item.code} value={item.code}>
                        {item.code} • {item.short}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={16} />
                </div>
                <small className="field-help">
                  {selectedOutcome.description}
                </small>
              </label>

              <label className="field">
                <span>Sınıf profili</span>
                <div className="select-wrap">
                  <select
                    value={profile}
                    onChange={(event) =>
                      setProfile(event.target.value as ProfileKey)
                    }
                  >
                    {Object.entries(profiles).map(([key, item]) => (
                      <option key={key} value={key}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                  <UsersRound size={16} />
                </div>
                <small className="field-help">
                  {profiles[profile].description}
                </small>
              </label>

              <details
                className="official-fields"
                open={view === "daily" ? true : undefined}
              >
                <summary>
                  <FileCheck2 size={17} /> Günlük plan resmî bilgileri{" "}
                  <ChevronDown size={16} />
                </summary>
                <div className="official-fields-grid">
                  <label className="field">
                    <span>Okul adı</span>
                    <input
                      value={meta.school}
                      onChange={(e) =>
                        setMeta({ ...meta, school: e.target.value })
                      }
                    />
                  </label>
                  <label className="field">
                    <span>Öğretim yılı</span>
                    <input
                      value={meta.academicYear}
                      onChange={(e) =>
                        setMeta({ ...meta, academicYear: e.target.value })
                      }
                    />
                  </label>
                  <label className="field">
                    <span>Ders tarihi / tarih aralığı</span>
                    <input
                      placeholder="Örn. 08-12 Aralık 2025"
                      value={meta.date}
                      onChange={(e) =>
                        setMeta({ ...meta, date: e.target.value })
                      }
                    />
                  </label>
                  <label className="field">
                    <span>Belirli gün ve haftalar</span>
                    <input
                      placeholder="Varsa yazın"
                      value={meta.specialDays}
                      onChange={(e) =>
                        setMeta({ ...meta, specialDays: e.target.value })
                      }
                    />
                  </label>
                  <label className="field">
                    <span>Ders öğretmeni</span>
                    <input
                      value={meta.teacher}
                      onChange={(e) =>
                        setMeta({ ...meta, teacher: e.target.value })
                      }
                    />
                  </label>
                  <label className="field">
                    <span>Okul müdürü</span>
                    <input
                      value={meta.principal}
                      onChange={(e) =>
                        setMeta({ ...meta, principal: e.target.value })
                      }
                    />
                  </label>
                </div>
              </details>

              <div className="output-choice">
                <div className="choice-check">
                  <Check size={14} />
                </div>
                <div>
                  <strong>
                    {view === "daily"
                      ? `${week}. hafta için tam resmî günlük plan`
                      : `${week}. hafta için 80 dakikalık ders tasarımı`}
                  </strong>
                  <span>
                    {view === "daily"
                      ? "TYMM bileşenleri, işleniş, ölçme, farklılaştırma ve onay alanları"
                      : `${selectedUnit.hours} haftalık ünitenin yalnızca seçilen haftası`}
                  </span>
                </div>
                <FileCheck2 size={20} />
              </div>

              {generating && (
                <div className="generation-progress" aria-live="polite">
                  <div>
                    <span>
                      {progress < 40
                        ? "Müfredat çözümleniyor"
                        : progress < 65
                          ? "Pedagojik karar kuruluyor"
                          : progress < 90
                            ? "Ders akışı tasarlanıyor"
                            : "Kalite kapıları çalışıyor"}
                    </span>
                    <strong>%{progress}</strong>
                  </div>
                  <div className="progress-track">
                    <span style={{ width: `${progress}%` }} />
                  </div>
                </div>
              )}

              <button
                className="primary-button"
                type="submit"
                disabled={generating}
              >
                {generating ? (
                  <LoaderCircle className="spin" size={19} />
                ) : (
                  <Sparkles size={19} />
                )}
                {generating
                  ? "FOPOS çalışıyor…"
                  : result
                    ? view === "daily"
                      ? "Günlük planı yeniden üret"
                      : "Ders tasarımını yeniden üret"
                    : view === "daily"
                      ? "Günlük planı oluştur"
                      : "Ders tasarımını oluştur"}
              </button>
              <p className="privacy-note">
                <ShieldCheck size={14} /> Öğrenci kişisel verisi kullanılmaz
                veya saklanmaz.
              </p>
            </form>
          </section>

          {view === "studio" && (
            <nav className="studio-workflow" aria-label="Ders tasarımı çalışma akışı">
              <ol>
                <li className={!result && !generating ? "active" : "complete"} aria-current={!result && !generating ? "step" : undefined}>
                  <span>01</span><div><strong>Müfredat bağlamı</strong><small>Sınıf, ünite ve çıktı</small></div>
                </li>
                <li className={generating ? "active" : result ? "complete" : "pending"} aria-current={generating ? "step" : undefined}>
                  <span>02</span><div><strong>Tasarım üretimi</strong><small>80 dakikalık pedagojik akış</small></div>
                </li>
                <li className={result?.pedagogicalRecord.status === "approved" ? "complete" : result ? "active" : "pending"} aria-current={result && result.pedagogicalRecord.status !== "approved" ? "step" : undefined}>
                  <span>03</span><div><strong>Öğretmen incelemesi</strong><small>Karar, akış ve kontroller</small></div>
                </li>
                <li className={result?.pedagogicalRecord.status === "approved" ? "active" : "pending"} aria-current={result?.pedagogicalRecord.status === "approved" ? "step" : undefined}>
                  <span>04</span><div><strong>Onaylı belge</strong><small>Revizyon bağlantılı DOCX</small></div>
                </li>
              </ol>
            </nav>
          )}

          <section
            className="principles-strip"
            aria-label="FOPOS çalışma ilkeleri"
          >
            <div>
              <Target size={18} />
              <span>
                <strong>Curriculum First</strong>Müfredat tek doğruluk
                kaynağıdır
              </span>
            </div>
            <div>
              <Route size={18} />
              <span>
                <strong>Decision Before Generation</strong>Önce karar, sonra
                materyal
              </span>
            </div>
            <div>
              <ShieldCheck size={18} />
              <span>
                <strong>Validation Before Delivery</strong>Teslimden önce sekiz
                kontrol
              </span>
            </div>
          </section>

          {!result && !generating && (
            <section className="empty-state-section">
              <div className="section-kicker">
                {curriculum.supportedGrades.join(" ve ")}. sınıf müfredatı uçtan uca hazır
              </div>
              <h2>On beş ünite, eksiksiz bir pedagojik zincir.</h2>
              <div className="feature-grid">
                <article>
                  <span>
                    <BookOpen size={21} />
                  </span>
                  <h3>Müfredat bağlamı</h3>
                  <p>
                    On beş kanonik ünite, yirmi iki resmî öğrenme çıktısı ve
                    temel kavramlarıyla eşleşir.
                  </p>
                </article>
                <article>
                  <span>
                    <Layers3 size={21} />
                  </span>
                  <h3>Pedagojik karar</h3>
                  <p>
                    Strateji, yöntem, sınıf uyarlaması, gerekçe ve risk
                    önlemleri birlikte kurulur.
                  </p>
                </article>
                <article>
                  <span>
                    <PanelTop size={21} />
                  </span>
                  <h3>80 dakikalık akış</h3>
                  <p>
                    Dokuz aşamada öğretmen eylemi, öğrenci eylemi ve öğrenme
                    kanıtı tanımlanır.
                  </p>
                </article>
                <article>
                  <span>
                    <FileCheck2 size={21} />
                  </span>
                  <h3>Doğrulama ve DOCX</h3>
                  <p>
                    Sekiz kalite boyutu raporlanır; onaylı plan düzenlenebilir
                    Word belgesine dönüşür.
                  </p>
                </article>
              </div>
            </section>
          )}

          {result && (
            <section className="results-section" ref={resultsRef} tabIndex={-1}>
              <div className="results-header">
                <div>
                  <span
                    className={
                      result.pedagogicalRecord.status === "approved"
                        ? "approved-pill"
                        : "review-pill"
                    }
                  >
                    <CheckCircle2 size={15} />{" "}
                    {result.pedagogicalRecord.status === "approved"
                      ? "ÖĞRETMEN ONAYLI"
                      : "KURAL KONTROLÜ TAMAMLANDI"}
                  </span>
                  <h2>{result.unit.name}</h2>
                  <p>
                    {result.unit.grade}. Sınıf • {result.unit.code} •{" "}
                    {result.week.number}/{result.unit.hours}. hafta •{" "}
                    {result.outcome.code} • {totalDuration} dakika •{" "}
                    {result.profile}
                  </p>
                  <small className="trace-line">
                    Kayıt: {result.pedagogicalRecord.recordId} • Revizyon{" "}
                    {result.pedagogicalRecord.revision} • Ürün:{" "}
                    {result.product.productId}
                  </small>
                  <small className="trace-line">
                    {recordSaveStatus} • Öğrenci verisi içermez
                  </small>
                </div>
                <div className="result-actions">
                  <button className="secondary-button" onClick={() => void createRevision()}>
                    <RefreshCw size={17} /> Yeni revizyon
                  </button>
                  <button
                    className="download-button"
                    onClick={() => void downloadDailyPlan()}
                    disabled={
                      exporting ||
                      result.pedagogicalRecord.status !== "approved"
                    }
                  >
                    {exporting ? (
                      <LoaderCircle className="spin" size={17} />
                    ) : (
                      <Download size={17} />
                    )}
                    {exporting ? "Hazırlanıyor…" : "Günlük planı DOCX indir"}
                  </button>
                </div>
              </div>
              <div
                className="record-approval-bar"
                role="region"
                aria-label="Pedagojik kayıt onayı"
              >
                <div>
                  <strong>Durum: {result.pedagogicalRecord.status}</strong>
                  <span>
                    Revizyon {result.pedagogicalRecord.revision}; eski onaylar
                    yeni revizyona aktarılmaz.
                  </span>
                </div>
                {result.pedagogicalRecord.status === "draft" ? (
                  <button
                    className="secondary-button"
                    onClick={() => void sendToTeacherReview()}
                  >
                    Öğretmen incelemesine gönder
                  </button>
                ) : null}
                {result.pedagogicalRecord.status === "in_review" ? (
                  <>
                    <label>
                      <input
                        type="checkbox"
                        checked={teacherReviewConfirmed}
                        onChange={(event) =>
                          setTeacherReviewConfirmed(event.target.checked)
                        }
                      />{" "}
                      İçeriği kontrol ettim
                    </label>
                    <button
                      className="secondary-button"
                      disabled={!teacherReviewConfirmed}
                      onClick={() => void approveCurrentRecord()}
                    >
                      Öğretmen onayı ver
                    </button>
                  </>
                ) : null}
                {result.pedagogicalRecord.status === "approved" ? (
                  <>
                    <span className="approved-pill">
                      <CheckCircle2 size={15} /> ÖĞRETMEN ONAYLI
                    </span>
                    <span>
                      Belge üretim kapısı açık; yalnız bu revizyona ait onay
                      kullanılabilir.
                    </span>
                  </>
                ) : null}
              </div>
              {generationProvenance?.requestId ===
              `${result.product.productId}:daily-plan` ? (
                <div className="record-history" role="status">
                  <strong>OPUS üretim izi kaydedildi</strong>
                  <p>
                    Sözleşme {generationProvenance.contractVersion} • Karar{" "}
                    {generationProvenance.decisionId} • Onay{" "}
                    {generationProvenance.approvedAt}
                  </p>
                  <p>
                    {generationProvenance.curriculum.curriculumId} /{" "}
                    {generationProvenance.curriculum.gradeLevelId} /{" "}
                    {generationProvenance.curriculum.unitId} /{" "}
                    {generationProvenance.curriculum.outcomeCode}
                  </p>
                </div>
              ) : null}
              {recordHistory.length > 1 ? (
                <details className="record-history">
                  <summary>Revizyon geçmişi ({recordHistory.length})</summary>
                  {recordHistory.map((item) => (
                    <div className="record-history-item" key={item.revision}>
                      <span>
                        Revizyon {item.revision} • {item.status} •{" "}
                        {item.curriculum.outcomeCode}
                      </span>
                      {item.revision === result.pedagogicalRecord.revision ? (
                        <b>Güncel</b>
                      ) : null}
                    </div>
                  ))}
                  <p>
                    Geçmiş kayıtlar değiştirilmez; düzenleme yeni ve onaysız
                    revizyon oluşturur.
                  </p>
                </details>
              ) : null}

              <div
                className="result-tabs"
                role="tablist"
                aria-label="Ders planı bölümleri"
              >
                {view === "daily" && (
                  <button
                    role="tab"
                    aria-selected={activeTab === "official"}
                    className={activeTab === "official" ? "active" : ""}
                    onClick={() => setActiveTab("official")}
                  >
                    <FileCheck2 size={17} /> Resmî plan önizleme
                  </button>
                )}
                <button
                  role="tab"
                  aria-selected={activeTab === "plan"}
                  className={activeTab === "plan" ? "active" : ""}
                  onClick={() => setActiveTab("plan")}
                >
                  <PanelTop size={17} /> Ders akışı
                </button>
                <button
                  role="tab"
                  aria-selected={activeTab === "decision"}
                  className={activeTab === "decision" ? "active" : ""}
                  onClick={() => setActiveTab("decision")}
                >
                  <Sparkles size={17} /> Pedagojik karar
                </button>
                <button
                  role="tab"
                  aria-selected={activeTab === "validation"}
                  className={activeTab === "validation" ? "active" : ""}
                  onClick={() => setActiveTab("validation")}
                >
                  <ShieldCheck size={17} /> Doğrulama{" "}
                  <span
                    aria-label={`${result.validation.checks.length} doğrulama kaydı`}
                  >
                    {result.validation.checks.length}
                  </span>
                </button>
              </div>

              {activeTab === "official" && (
                <div className="tab-panel official-preview">
                  <div className="document-sheet">
                    <div className="document-title">
                      <strong>
                        {meta.academicYear} EĞİTİM-ÖĞRETİM YILI{" "}
                        {meta.school.toLocaleUpperCase("tr-TR")}
                      </strong>
                      <span>
                        {result.unit.grade}. SINIF{" "}
                        {curriculum.subjectName.toLocaleUpperCase("tr-TR")} DERSİ
                        GÜNLÜK PLANI
                      </span>
                    </div>
                    <div className="document-table identity-table">
                      <div>
                        <b>Dersin Adı</b>
                        <span>{curriculum.subjectName}</span>
                        <b>Sınıf</b>
                        <span>{result.unit.grade}</span>
                      </div>
                      <div>
                        <b>Ders Tarihi</b>
                        <span>{meta.date || "Belirtilmedi"}</span>
                        <b>Ders Saati</b>
                        <span>2 (80 dakika)</span>
                      </div>
                      <div>
                        <b>Ünite</b>
                        <span>
                          {result.unit.code} — {result.unit.name}
                        </span>
                      </div>
                      <div>
                        <b>Konu</b>
                        <span>{result.week.focus}</span>
                      </div>
                      <div>
                        <b>Öğrenme Çıktısı</b>
                        <span>
                          {result.outcome.code} — {result.outcome.description}
                        </span>
                      </div>
                      <div>
                        <b>Süreç Bileşenleri</b>
                        <span>
                          {result.outcome.processComponents.map(component => `${component.step}) ${component.description}`).join(" ")}
                        </span>
                      </div>
                      <div>
                        <b>Öğrenme Çıktısı Açıklaması</b>
                        <span>Öğrencinin {result.week.focus.toLocaleLowerCase("tr-TR")} odağında kavramları ayırt etmesi, görüşleri gerekçeleriyle değerlendirmesi ve alana ilişkin gerekçeli bir ürün ortaya koyması sağlanır.</span>
                      </div>
                      <div><b>Yöntem ve Teknikler</b><span>{result.decision.methods.join(", ")}</span></div>
                      <div><b>Araç ve Gereçler</b><span>Ders kitabı, alan metni, akıllı tahta, kavram/argüman kartları, öğrenci çalışma kâğıdı</span></div>
                      <div>
                        <b>Ölçme ve Değerlendirme</b>
                        <span>
                          Süreç gözlemi, akran değerlendirmesi, çıkış bileti ve{" "}
                          {selectedUnit.evidence.toLocaleLowerCase("tr-TR")}{" "}
                          kullanılır.
                        </span>
                      </div>
                      <div>
                        <b>Belirli Gün ve Haftalar</b>
                        <span>{meta.specialDays || "—"}</span>
                      </div>
                      <div>
                        <b>Alan Becerileri</b><span>{formatCurriculumList(result.unit.competencyFramework.fieldSkills)}</span>
                      </div>
                      <div><b>Kavramsal Beceriler</b><span>{formatCurriculumList(result.unit.competencyFramework.conceptualSkills)}</span></div>
                      <div><b>Eğilimler</b><span>{formatCurriculumList(result.unit.competencyFramework.tendencies)}</span></div>
                      <div><b>Sosyal-Duygusal Öğrenme Becerileri</b><span>{formatCurriculumList(result.unit.competencyFramework.socialEmotionalLearning)}</span></div>
                      <div><b>Değerler</b><span>{formatCurriculumList(result.unit.competencyFramework.values)}</span></div>
                      <div><b>Okuryazarlık Becerileri</b><span>{formatCurriculumList(result.unit.competencyFramework.literacy)}</span></div>
                      <div><b>Disiplinler Arası İlişkiler</b><span>{formatCurriculumList(result.unit.competencyFramework.interdisciplinaryRelations)}</span></div>
                      <div><b>Beceriler Arası İlişkiler</b><span>{formatCurriculumList(result.unit.competencyFramework.interSkillRelations)}</span></div>
                      <div><b>İçerik Çerçevesi</b><span>{formatCurriculumList(result.unit.contentFramework)}</span></div>
                      <div><b>Anahtar Kavramlar</b><span>{formatCurriculumList(result.unit.keywords)}</span></div>
                    </div>
                    <section className="document-curriculum-sections">
                      <h3>Öğrenmeye Hazırlık</h3>
                      <p><b>Temel kabuller:</b> {cleanCurriculumText(result.unit.learningTeachingExperiences.basicAssumptions)}</p>
                      <p><b>Ön değerlendirme süreci:</b> {cleanCurriculumText(result.unit.learningTeachingExperiences.preAssessment)}</p>
                      <p><b>Köprü kurma:</b> {cleanCurriculumText(result.unit.learningTeachingExperiences.bridging)}</p>
                      <h3>Ünite Düzeyinde Öğrenme Kanıtları</h3>
                      <p>{cleanCurriculumText(result.unit.learningEvidence)}</p>
                      <h3>Farklılaştırma</h3>
                      <p><b>Ders içi uyarlama:</b> {result.profile === profiles.support.label ? "Kavram kartları, görsel şemalar, somut örnekler ve cümle başlatıcıları kullanılır." : result.profile === profiles.quiet.label ? "Düşün-eşleş-paylaş, yazılı katılım ve yapılandırılmış söz alma kullanılır." : "Görsel, işitsel ve uygulamalı görevler öğrenci ihtiyaçlarına göre dengelenir."}</p>
                      <p><b>Zenginleştirme:</b> {cleanCurriculumText(result.unit.differentiation.enrichment)}</p>
                      <p><b>Destekleme:</b> {cleanCurriculumText(result.unit.differentiation.support)}</p>
                    </section>
                    <section className="document-summary">
                      <b>ÖZET • 80 DAKİKALIK DERSİN İŞLENİŞİ</b>
                      {result.phases.map((phase, index) => (
                        <div key={phase.id}>
                          <strong>
                            {index + 1}. {phase.label} ({phase.duration} Dakika)
                          </strong>
                          <p>
                            <b>Etkinlik:</b> {phase.facilitator} {phase.learner}
                          </p>
                          <p>
                            <b>Öğrenme kanıtı:</b> {phase.evidence}
                          </p>
                        </div>
                      ))}
                    </section>
                    <div className="signature-row">
                      <span>
                        <b>{meta.teacher}</b>
                        <small>Ders Öğretmeni</small>
                      </span>
                      <span>
                        <b>
                          Onay tarihi / İmza:
                          <br />
                          .... / .... / ........
                        </b>
                        <small>
                          {meta.principal}
                          <br />
                          Okul Müdürü
                        </small>
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "plan" && (
                <div className="tab-panel">
                  <div className="panel-intro">
                    <div>
                      <span className="step-badge">02</span>
                      <div>
                        <h3>
                          {result.week.number}. hafta • 80 dakikalık ders akışı
                        </h3>
                        <p>{result.week.focus} • 9 aşama</p>
                      </div>
                    </div>
                    <strong>
                      <Clock3 size={16} /> {totalDuration} dk
                    </strong>
                  </div>
                  <div className="timeline">
                    {result.phases.map((phase, index) => (
                      <article className="phase-card" key={phase.id}>
                        <div className="phase-index">
                          <span>{String(index + 1).padStart(2, "0")}</span>
                          <i />
                        </div>
                        <div className="phase-content">
                          <div className="phase-title">
                            <div>
                              <h4>{phase.label}</h4>
                              <span>{phase.id}</span>
                            </div>
                            <strong>{phase.duration} dk</strong>
                          </div>
                          <div className="phase-grid">
                            <div>
                              <span>Öğretmen eylemi</span>
                              <p>{phase.facilitator}</p>
                            </div>
                            <div>
                              <span>Öğrenci eylemi</span>
                              <p>{phase.learner}</p>
                            </div>
                            <div className="evidence-box">
                              <span>Beklenen kanıt</span>
                              <p>
                                <FileCheck2 size={15} /> {phase.evidence}
                              </p>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "decision" && (
                <div className="tab-panel decision-panel">
                  <div className="panel-intro">
                    <div>
                      <span className="step-badge">02</span>
                      <div>
                        <h3>Pedagojik karar özeti</h3>
                        <p>İçerik üretilmeden önce kurulan öğretim mantığı</p>
                      </div>
                    </div>
                  </div>
                  <div className="decision-grid">
                    <article className="decision-main">
                      <span className="mini-label">Makro strateji</span>
                      <h4>{result.decision.strategy}</h4>
                      <p>{result.decision.rationale}</p>
                      <div className="method-list">
                        {result.decision.methods.map((method) => (
                          <span key={method}>
                            <Check size={13} /> {method}
                          </span>
                        ))}
                      </div>
                    </article>
                    <aside>
                      <div className="aside-heading">
                        <CircleAlert size={18} />
                        <h4>Pedagojik riskler</h4>
                      </div>
                      {result.decision.risks.map((risk) => (
                        <div className="risk-item" key={risk.title}>
                          <strong>{risk.title}</strong>
                          <p>{risk.response}</p>
                        </div>
                      ))}
                    </aside>
                  </div>
                </div>
              )}

              {activeTab === "validation" && (
                <div className="tab-panel validation-panel">
                  <div className="validation-summary">
                    <div>
                      <span className="review-pill">
                        <ShieldCheck size={15} /> Kural kontrolleri tamamlandı
                      </span>
                      <h3>Kesin kontroller ile öğretmen incelemesi ayrıldı.</h3>
                      <p>
                        Müfredat, süre ve izlenebilirlik kuralla doğrulandı;
                        alan içeriği ve pedagojik uygunluk öğretmen kararındadır.
                      </p>
                      <small>
                        {result.traceId} • {result.createdAt}
                      </small>
                    </div>
                  </div>
                  <div className="checks-list">
                    <h4>Doğrulama kayıtları</h4>
                    {result.validation.checks.map((check) => (
                      <div key={check.code}>
                        {check.status === "passed" ? (
                          <CheckCircle2 size={18} />
                        ) : (
                          <CircleAlert size={18} />
                        )}
                        <span>
                          <strong>{check.label}</strong>
                          <small>{check.note}</small>
                          <small>Kaynak: {check.source}</small>
                        </span>
                        <code>{check.code}</code>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}
        </>
      )}
        </>
      )}

      <AppFooter
        subjectName={curriculum.subjectName}
        supportedGrades={curriculum.supportedGrades}
        sourceYear={curriculum.sourceYear}
      />
      </div>
    </main>
  );
}
