"use client";

import { Archive, BarChart3, CheckCircle2, ClipboardList, Gauge, LoaderCircle, Plus, RotateCcw, School, ShieldCheck } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";

type Workspace = {
  id: string;
  subjectCode: string;
  academicYear: string;
  grade: 10 | 11;
  branchCode: string;
  archivedAt: string | null;
};

const branchAlphabet = ["A", "B", "C", "D", "E", "F"];

function nextBranch(workspaces: Workspace[], grade: 10 | 11) {
  const used = new Set(
    workspaces
      .filter((item) => item.grade === grade)
      .map((item) => item.branchCode),
  );
  return branchAlphabet.find((item) => !used.has(item)) ?? "";
}

export default function ClassWorkspacesModule({
  activeSessionWorkspaceId,
  hasSensitiveSession,
  onClearSensitiveSession,
  onOpenWorkspace,
  onWorkspaceCreated,
}: {
  activeSessionWorkspaceId: string;
  hasSensitiveSession: boolean;
  onClearSensitiveSession: () => void;
  onOpenWorkspace: (workspaceId: string, target: "rosters" | "analysis" | "performance") => void;
  onWorkspaceCreated: (workspace: Workspace) => void;
}) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [academicYear, setAcademicYear] = useState("");
  const [grade, setGrade] = useState<10 | 11>(10);
  const [branchCode, setBranchCode] = useState("A");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [archiveConfirmedId, setArchiveConfirmedId] = useState<string | null>(null);

  async function load(suggestedGrade: 10 | 11) {
    const response = await fetch("/api/class-workspaces");
    const payload = (await response.json()) as { workspaces?: Workspace[]; academicYear?: string; error?: string };
    if (!response.ok || !payload.workspaces || !payload.academicYear) {
      throw new Error(payload.error ?? "Sınıf çalışma alanları açılamadı.");
    }
    setWorkspaces(payload.workspaces);
    setAcademicYear(payload.academicYear);
    setBranchCode(nextBranch(payload.workspaces, suggestedGrade) || "A");
  }

  useEffect(() => {
    const timer = window.setTimeout(() => void load(10).catch((error) => setMessage(error.message)), 0);
    return () => window.clearTimeout(timer);
  }, []);

  async function create(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      const response = await fetch("/api/class-workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grade, branchCode }),
      });
      const payload = (await response.json()) as { workspaces?: Workspace[]; academicYear?: string; error?: string };
      if (!response.ok || !payload.workspaces) throw new Error(payload.error ?? "Sınıf oluşturulamadı.");
      setWorkspaces(payload.workspaces);
      setBranchCode(nextBranch(payload.workspaces, grade));
      const created = payload.workspaces.find(
        (item) =>
          !item.archivedAt &&
          item.grade === grade &&
          item.branchCode === branchCode.trim().toLocaleUpperCase("tr-TR"),
      );
      if (created) onWorkspaceCreated(created);
      setMessage(`${grade}/${branchCode.trim().toLocaleUpperCase("tr-TR")} çalışma alanı oluşturuldu.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Sınıf oluşturulamadı.");
    } finally {
      setBusy(false);
    }
  }

  async function toggle(item: Workspace) {
    const archivesActiveSession =
      !item.archivedAt &&
      hasSensitiveSession &&
      item.id === activeSessionWorkspaceId;
    if (archivesActiveSession && archiveConfirmedId !== item.id) {
      setMessage("Etkin öğrenci oturumunu temizleme onayını işaretleyin.");
      return;
    }
    if (
      archivesActiveSession &&
      !window.confirm(
        "Bu sınıf arşivlenmeden önce oturumdaki öğrenci listeleri ve bekleyen aktarımlar silinecek. Devam etmek istiyor musunuz?",
      )
    ) return;
    setBusy(true);
    try {
      const response = await fetch("/api/class-workspaces", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, archived: !item.archivedAt }),
      });
      const payload = (await response.json()) as { workspaces?: Workspace[]; error?: string };
      if (!response.ok || !payload.workspaces) throw new Error(payload.error ?? "Sınıf güncellenemedi.");
      setWorkspaces(payload.workspaces);
      if (archivesActiveSession) onClearSensitiveSession();
      setArchiveConfirmedId(null);
      setMessage(item.archivedAt ? "Sınıf yeniden etkinleştirildi." : "Sınıf arşivlendi.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Sınıf güncellenemedi.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="class-workspaces-module">
      <header className="class-workspaces-hero">
        <div><span className="eyebrow"><School size={15}/> Güvenli Öğretmen Çalışma Alanı</span><h1>Sınıf ve Şubeler</h1><p>{academicYear || "Etkin öğretim yılı"} için sınıf çalışma alanlarını yönetin.</p></div>
        <div className="class-privacy-seal"><ShieldCheck size={32}/><strong>Kimliksiz yapı</strong><span>Öğrenci verisi saklanmaz</span></div>
      </header>
      {message ? <div className="archive-message" role="status">{message}</div> : null}
      <section className="class-workspace-create">
        <div><span className="section-kicker"><Plus size={14}/> Yeni çalışma alanı</span><h2>Sınıf ve şube ekleyin</h2><p>Yalnız sınıf düzeyi ve şube kodu kalıcıdır. Öğrenci listeleri, numaralar, puanlar ve gözlem notları oturum belleğinde kalır.</p></div>
        <form onSubmit={create}>
          <label>Sınıf<select value={grade} onChange={(e) => { const nextGrade = Number(e.target.value) as 10 | 11; setGrade(nextGrade); setBranchCode(nextBranch(workspaces, nextGrade)); }}><option value="10">10. sınıf</option><option value="11">11. sınıf</option></select></label>
          <label>Şube<input value={branchCode} onChange={(e) => setBranchCode(e.target.value.toLocaleUpperCase("tr-TR"))} maxLength={4} placeholder="Şube kodu yazın" required /><small>Örn. A, B veya 1A</small></label>
          <button className="primary-button" disabled={busy || !branchCode.trim()}>{busy ? <LoaderCircle className="spin" size={17}/> : <Plus size={17}/>}Çalışma alanı oluştur</button>
        </form>
      </section>
      <section className="class-workspace-list">
        <div className="archive-list-heading"><div><span className="section-kicker">Etkin öğretim yılı</span><h2>{academicYear || "—"} sınıfları</h2></div><span>{workspaces.filter((item) => !item.archivedAt).length} etkin</span></div>
        {workspaces.length === 0 ? <div className="archive-empty"><School size={28}/><strong>Henüz sınıf çalışma alanı yok</strong><span>İlk sınıf ve şubenizi yukarıdan ekleyin.</span></div> :
          <div className="class-workspace-grid">{workspaces.map((item) => { const activeSensitive = !item.archivedAt && hasSensitiveSession && item.id === activeSessionWorkspaceId; return <article className={item.archivedAt ? "archived" : ""} key={item.id}><div><strong>{item.grade}/{item.branchCode}</strong><span>{item.archivedAt ? "Arşivlenmiş" : activeSensitive ? "Etkin öğrenci oturumu var" : "Etkin çalışma alanı"}</span></div>{item.archivedAt ? <Archive size={22}/> : <CheckCircle2 size={22}/>} {!item.archivedAt ? <div className="class-workspace-actions"><button type="button" className="primary-button" onClick={() => onOpenWorkspace(item.id, "rosters")}><ClipboardList size={15}/> Öğrenci listesini aç</button><button type="button" className="secondary-button" onClick={() => onOpenWorkspace(item.id, "analysis")}><BarChart3 size={15}/> Sınav analizi</button><button type="button" className="secondary-button" onClick={() => onOpenWorkspace(item.id, "performance")}><Gauge size={15}/> Performans</button></div> : null} {activeSensitive ? <label className="archive-session-confirm"><input type="checkbox" checked={archiveConfirmedId === item.id} onChange={(event) => setArchiveConfirmedId(event.target.checked ? item.id : null)} />Oturumdaki öğrenci verilerinin silineceğini anlıyorum</label> : null}<button className="secondary-button class-archive-button" disabled={busy || (activeSensitive && archiveConfirmedId !== item.id)} onClick={() => void toggle(item)}>{item.archivedAt ? <RotateCcw size={15}/> : <Archive size={15}/>} {item.archivedAt ? "Etkinleştir" : "Arşivle"}</button></article>})}</div>}
      </section>
    </section>
  );
}
