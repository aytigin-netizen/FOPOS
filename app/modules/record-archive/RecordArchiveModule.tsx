"use client";

import {
  Archive,
  CheckCircle2,
  Database,
  Download,
  FileJson,
  History,
  LoaderCircle,
  RotateCcw,
  ShieldCheck,
  Trash2,
  Upload,
  UserX,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { PedagogicalRecord, RecordStatus } from "../../core/pedagogical-record";
import type { GenerationProvenance } from "../../core/opus-generation-bridge";
import {
  inspectRecordArchive,
  readRecordArchiveRecords,
  type RecordArchiveStatus,
} from "../../core/pedagogical-record-store";

const statusLabels: Record<RecordStatus, string> = {
  draft: "Taslak",
  in_review: "İncelemede",
  approved: "Öğretmen onaylı",
  superseded: "Önceki sürüm",
};

type AccountDataPolicy = {
  activeRevisionCount: number;
  trashedRevisionCount: number;
  lastDeletedAt: string | null;
  trashRetentionDays: number;
  policies: {
    accountAndProfile: string;
    pedagogicalRecords: string;
    studentData: string;
    exportedFiles: string;
  };
};

type AccountClosureSummary = {
  profileExists: boolean;
  recordRevisionCount: number;
};

type AcademicYearArchiveSummary = {
  academicYear: string;
  recordCount: number;
  revisionCount: number;
};

type DocumentGenerationRecord = GenerationProvenance & {
  eventId: string;
  generatedAt: string;
  recordId: string;
  revision: number;
  curriculumDatasetVersion: string;
  academicYear: string;
};

export default function RecordArchiveModule() {
  const [records, setRecords] = useState<PedagogicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [localStatus, setLocalStatus] = useState<RecordArchiveStatus | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [importing, setImporting] = useState(false);
  const [exportConfirmed, setExportConfirmed] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [policy, setPolicy] = useState<AccountDataPolicy | null>(null);
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [accountEmail, setAccountEmail] = useState("");
  const [closureSummary, setClosureSummary] =
    useState<AccountClosureSummary | null>(null);
  const [accountDeleteConfirmed, setAccountDeleteConfirmed] = useState(false);
  const [accountConfirmationText, setAccountConfirmationText] = useState("");
  const [accountEmailConfirmation, setAccountEmailConfirmation] = useState("");
  const [closingAccount, setClosingAccount] = useState(false);
  const [activeAcademicYear, setActiveAcademicYear] = useState("");
  const [selectedAcademicYear, setSelectedAcademicYear] = useState("");
  const [academicYearArchives, setAcademicYearArchives] = useState<
    AcademicYearArchiveSummary[]
  >([]);
  const [generations, setGenerations] = useState<DocumentGenerationRecord[]>([]);
  const [generationSearch, setGenerationSearch] = useState("");
  const [generationDocumentType, setGenerationDocumentType] = useState("all");
  const [generationCurriculum, setGenerationCurriculum] = useState("all");
  const [openGenerationEventId, setOpenGenerationEventId] = useState<string | null>(null);

  async function loadRecords(academicYear?: string) {
    setLoading(true);
    try {
      const query = new URLSearchParams({ scope: "archive" });
      if (academicYear) query.set("academicYear", academicYear);
      const response = await fetch(`/api/pedagogical-records?${query.toString()}`);
      const payload = (await response.json()) as {
        records?: PedagogicalRecord[];
        activeAcademicYear?: string;
        selectedAcademicYear?: string;
        years?: AcademicYearArchiveSummary[];
        generations?: DocumentGenerationRecord[];
        error?: string;
      };
      if (
        !response.ok ||
        !payload.records ||
        !payload.activeAcademicYear ||
        !payload.selectedAcademicYear
      ) {
        throw new Error(payload.error ?? "Kayıt arşivi açılamadı.");
      }
      setRecords(payload.records);
      setActiveAcademicYear(payload.activeAcademicYear);
      setSelectedAcademicYear(payload.selectedAcademicYear);
      setAcademicYearArchives(payload.years ?? []);
      setGenerations(payload.generations ?? []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Kayıt arşivi açılamadı.");
    } finally {
      setLoading(false);
    }
  }

  async function loadPolicy() {
    try {
      const response = await fetch("/api/account-data-management");
      const payload = (await response.json()) as {
        policy?: AccountDataPolicy;
        error?: string;
      };
      if (!response.ok || !payload.policy) {
        throw new Error(payload.error ?? "Saklama politikası okunamadı.");
      }
      setPolicy(payload.policy);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Saklama politikası okunamadı.",
      );
    }
  }

  async function loadAccountClosureSummary() {
    try {
      const response = await fetch("/api/account-closure");
      const payload = (await response.json()) as {
        accountEmail?: string;
        summary?: AccountClosureSummary;
        error?: string;
      };
      if (!response.ok || !payload.accountEmail || !payload.summary) {
        throw new Error(payload.error ?? "Hesap kapatma kapsamı okunamadı.");
      }
      setAccountEmail(payload.accountEmail);
      setClosureSummary(payload.summary);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Hesap kapatma kapsamı okunamadı.",
      );
    }
  }

  useEffect(() => {
    const initialLoad = window.setTimeout(() => {
      void loadRecords();
      void loadPolicy();
      void loadAccountClosureSummary();
      setLocalStatus(inspectRecordArchive(window.localStorage));
    }, 0);
    return () => window.clearTimeout(initialLoad);
  }, []);

  const histories = useMemo(() => {
    const grouped = new Map<string, PedagogicalRecord[]>();
    for (const record of records) {
      grouped.set(record.recordId, [...(grouped.get(record.recordId) ?? []), record]);
    }
    return [...grouped.values()].map((history) =>
      history.sort((a, b) => b.revision - a.revision),
    );
  }, [records]);

  const generationCurricula = useMemo(
    () => [...new Set(generations.map((item) => item.curriculum.curriculumId))].sort(),
    [generations],
  );

  const filteredGenerations = useMemo(() => {
    const search = generationSearch.trim().toLocaleLowerCase("tr-TR");
    return generations.filter((item) =>
      (generationDocumentType === "all" || item.documentType === generationDocumentType) &&
      (generationCurriculum === "all" || item.curriculum.curriculumId === generationCurriculum) &&
      (!search || [item.decisionId, item.recordId, item.requestId, item.eventId]
        .some((value) => value.toLocaleLowerCase("tr-TR").includes(search))),
    );
  }, [generationCurriculum, generationDocumentType, generationSearch, generations]);

  function exportGenerationAuditPackage() {
    const payload = {
      schemaVersion: "1.0.0",
      exportedAt: new Date().toISOString(),
      academicYear: selectedAcademicYear,
      containsStudentPersonalData: false,
      events: filteredGenerations.map((event) => ({
        eventId: event.eventId,
        requestId: event.requestId,
        decisionId: event.decisionId,
        recordId: event.recordId,
        revision: event.revision,
        documentType: event.documentType,
        contractVersion: event.contractVersion,
        approvedAt: event.approvedAt,
        generatedAt: event.generatedAt,
        curriculum: event.curriculum,
        curriculumDatasetVersion: event.curriculumDatasetVersion,
        academicYear: event.academicYear,
      })),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `FOPOS_OPUS_Denetim_Paketi_${selectedAcademicYear || "arsiv"}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage(`${filteredGenerations.length} üretim olayı içeren denetim paketi indirildi.`);
  }

  async function importLocalArchive() {
    if (!confirmed || localStatus?.state !== "ready") return;
    setImporting(true);
    setMessage("v46 yerel kayıtları doğrulanıyor ve hesabınıza kopyalanıyor…");
    try {
      const localRecords = readRecordArchiveRecords(window.localStorage);
      const response = await fetch("/api/pedagogical-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ records: localRecords }),
      });
      const payload = (await response.json()) as {
        imported?: number;
        records?: PedagogicalRecord[];
        error?: string;
      };
      if (!response.ok || !payload.records) {
        throw new Error(payload.error ?? "Yerel kayıtlar içe aktarılamadı.");
      }
      await loadRecords(activeAcademicYear || undefined);
      setConfirmed(false);
      setMessage(
        `${payload.imported ?? 0} revizyon hesabınıza kopyalandı. v46 yerel arşivi silinmedi.`,
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Yerel kayıtlar içe aktarılamadı.");
    } finally {
      setImporting(false);
    }
  }

  async function exportAccountData() {
    if (!exportConfirmed) return;
    setExporting(true);
    setMessage("Hesap verileriniz güvenli pakete hazırlanıyor…");
    try {
      const response = await fetch("/api/account-export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmed: true }),
      });
      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? "Hesap verileri dışa aktarılamadı.");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      const disposition = response.headers.get("content-disposition") ?? "";
      const filename =
        /filename="([^"]+)"/u.exec(disposition)?.[1] ??
        "FOPOS_Hesap_Verileri.json";
      anchor.href = url;
      anchor.download = filename;
      anchor.click();
      URL.revokeObjectURL(url);
      setExportConfirmed(false);
      setMessage(
        "Hesap verileri indirildi. Paket öğrenci kişisel verisi ve oturum bilgisi içermez.",
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Hesap verileri dışa aktarılamadı.",
      );
    } finally {
      setExporting(false);
    }
  }

  async function deleteAccountRecords() {
    if (
      !policy ||
      !deleteConfirmed ||
      confirmationText !== "KAYITLARIMI SİL"
    ) {
      return;
    }
    setDeleting(true);
    setMessage("Pedagojik kayıtlar güvenli silme alanına taşınıyor…");
    try {
      const response = await fetch("/api/account-data-management", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete_records",
          confirmed: true,
          confirmationText,
          expectedRevisionCount: policy.activeRevisionCount,
        }),
      });
      const payload = (await response.json()) as {
        policy?: AccountDataPolicy;
        error?: string;
      };
      if (!response.ok || !payload.policy) {
        throw new Error(payload.error ?? "Kayıtlar silinemedi.");
      }
      setPolicy(payload.policy);
      setRecords([]);
      setDeleteConfirmed(false);
      setConfirmationText("");
      setMessage(
        `Pedagojik kayıtlar silme alanına taşındı. ${payload.policy.trashRetentionDays} gün içinde geri yükleyebilirsiniz.`,
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Kayıtlar silinemedi.");
    } finally {
      setDeleting(false);
    }
  }

  async function restoreAccountRecords() {
    setRestoring(true);
    setMessage("Silinen pedagojik kayıtlar geri yükleniyor…");
    try {
      const response = await fetch("/api/account-data-management", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "restore_records" }),
      });
      const payload = (await response.json()) as {
        policy?: AccountDataPolicy;
        error?: string;
      };
      if (!response.ok || !payload.policy) {
        throw new Error(payload.error ?? "Kayıtlar geri yüklenemedi.");
      }
      setPolicy(payload.policy);
      await loadRecords(selectedAcademicYear || undefined);
      setMessage("Pedagojik kayıtlar hesabınıza geri yüklendi.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Kayıtlar geri yüklenemedi.",
      );
    } finally {
      setRestoring(false);
    }
  }

  async function closeAccountPermanently() {
    if (
      !closureSummary ||
      !accountDeleteConfirmed ||
      accountConfirmationText !== "HESABIMI KALICI OLARAK SİL" ||
      accountEmailConfirmation.trim().toLocaleLowerCase("en-US") !== accountEmail
    ) {
      return;
    }
    setClosingAccount(true);
    setMessage("Hesabınız ve bağlı veriler kalıcı olarak siliniyor…");
    try {
      const response = await fetch("/api/account-closure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          confirmed: true,
          confirmationText: accountConfirmationText,
          accountEmail: accountEmailConfirmation,
          expectedProfileExists: closureSummary.profileExists,
          expectedRecordRevisionCount: closureSummary.recordRevisionCount,
        }),
      });
      const payload = (await response.json()) as {
        deleted?: boolean;
        signOutPath?: string;
        error?: string;
      };
      if (!response.ok || !payload.deleted || !payload.signOutPath) {
        throw new Error(payload.error ?? "Hesap kalıcı olarak silinemedi.");
      }
      window.location.assign(payload.signOutPath);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Hesap kalıcı olarak silinemedi.",
      );
      setClosingAccount(false);
    }
  }

  return (
    <section className="record-archive-module">
      <header className="record-archive-hero">
        <div>
          <span className="eyebrow"><Archive size={15} /> Güvenli Öğretmen Çalışma Alanı</span>
          <h1>Kayıt Arşivi</h1>
          <p>
            Ders tasarımlarınız ve revizyonları doğrulanmış öğretmen hesabınıza
            bağlı tutulur. Önceki sürümler değişmeden kalır.
          </p>
        </div>
        <div className="archive-security-seal">
          <ShieldCheck size={34} />
          <strong>Hesaba bağlı</strong>
          <span>Öğrenci kişisel verisi içermez</span>
        </div>
      </header>

      <div className="archive-summary-grid">
        <article><Database size={20} /><strong>{histories.length}</strong><span>Pedagojik kayıt</span></article>
        <article><History size={20} /><strong>{records.length}</strong><span>Toplam revizyon</span></article>
        <article><CheckCircle2 size={20} /><strong>{records.filter((item) => item.status === "approved").length}</strong><span>Onaylı revizyon</span></article>
        <article><FileJson size={20} /><strong>{generations.length}</strong><span>Üretilen belge izi</span></article>
      </div>

      <section className="generation-audit-list" aria-labelledby="generation-audit-title">
        <div className="archive-list-heading">
          <div>
            <span className="section-kicker"><ShieldCheck size={14} /> OPUS denetim zinciri</span>
            <h2 id="generation-audit-title">Kalıcı belge üretim izleri</h2>
          </div>
          <span>{filteredGenerations.length} / {generations.length} olay</span>
        </div>
        <div className="generation-audit-filters">
          <label>Karar veya olay kimliği<input value={generationSearch} onChange={(event) => setGenerationSearch(event.target.value)} placeholder="Karar, kayıt, istek veya olay kimliği" /></label>
          <label>Belge türü<select value={generationDocumentType} onChange={(event) => setGenerationDocumentType(event.target.value)}><option value="all">Tüm belge türleri</option><option value="daily-plan">Günlük plan</option><option value="annual-plan">Yıllık plan</option></select></label>
          <label>Müfredat kaynağı<select value={generationCurriculum} onChange={(event) => setGenerationCurriculum(event.target.value)}><option value="all">Tüm müfredatlar</option>{generationCurricula.map((curriculumId) => <option key={curriculumId} value={curriculumId}>{curriculumId}</option>)}</select></label>
          <button className="secondary-button" disabled={filteredGenerations.length === 0} onClick={exportGenerationAuditPackage}><Download size={16} /> JSON denetim paketi</button>
        </div>
        {filteredGenerations.length === 0 ? (
          <div className="archive-empty">
            <FileJson size={28} />
            <strong>{generations.length === 0 ? "Bu öğretim yılında belge üretim izi yok" : "Filtrelerle eşleşen üretim olayı yok"}</strong>
            <span>{generations.length === 0 ? "Onaylı bir günlük veya yıllık plan indirildiğinde karar ve müfredat kaynağı burada saklanır." : "Arama veya filtreleri değiştirin."}</span>
          </div>
        ) : filteredGenerations.map((generation) => {
          const decision = records.find((record) => record.recordId === generation.recordId && record.revision === generation.revision);
          const isOpen = openGenerationEventId === generation.eventId;
          return <article className="generation-audit-card" key={generation.eventId}>
            <div>
              <strong>{generation.documentType === "daily-plan" ? "Günlük plan" : generation.documentType === "annual-plan" ? "Yıllık plan" : generation.documentType}</strong>
              <span>Olay {generation.eventId}</span>
            </div>
            <dl>
              <div><dt>Revizyon</dt><dd>{generation.revision}</dd></div>
              <div><dt>Öğretmen onayı</dt><dd>{new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(generation.approvedAt))}</dd></div>
              <div><dt>Üretim zamanı</dt><dd>{new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(generation.generatedAt))}</dd></div>
              <div><dt>Müfredat kaynağı</dt><dd>{generation.curriculum.curriculumId} • {generation.curriculumDatasetVersion}</dd></div>
              <div><dt>Öğrenme çıktısı</dt><dd>{generation.curriculum.outcomeCode}</dd></div>
              <div><dt>Sözleşme</dt><dd>{generation.contractVersion}</dd></div>
            </dl>
            <div className="generation-audit-actions">
              <span>{generation.decisionId}</span>
              <button className="secondary-button" onClick={() => setOpenGenerationEventId(isOpen ? null : generation.eventId)}>{isOpen ? "Karar ayrıntısını kapat" : "Bu belge hangi karardan üretildi?"}</button>
            </div>
            {isOpen ? <section className="generation-decision-detail" aria-label="Bağlı pedagojik kararın salt okunur ayrıntısı">
              <strong>Salt okunur pedagojik karar • Revizyon {generation.revision}</strong>
              {decision ? <dl>
                <div><dt>Durum</dt><dd>{statusLabels[decision.status]}</dd></div>
                <div><dt>Öğrenme çıktısı</dt><dd>{decision.curriculum.outcomeCode}</dd></div>
                <div><dt>Strateji</dt><dd>{decision.pedagogicalDecision.strategy}</dd></div>
                <div><dt>Öğrenme kanıtı</dt><dd>{decision.pedagogicalDecision.learningEvidence}</dd></div>
                <div><dt>Hafta / süre</dt><dd>{decision.lessonContext.week}. hafta • {decision.lessonContext.durationMinutes} dk.</dd></div>
                <div><dt>Onay</dt><dd>{decision.approval?.statement ?? "Onay beyanı yok"}</dd></div>
              </dl> : <p>Bağlı karar bu öğretim yılı arşivinde bulunamadı.</p>}
            </section> : null}
          </article>
        })}
      </section>

      <section className="academic-year-archive-filter">
        <div>
          <span className="section-kicker">
            <History size={14} /> Öğretim yılı arşivi
          </span>
          <h2>Yıla göre kayıtları görüntüleyin</h2>
          <p>
            Geçmiş yıl kayıtları salt arşiv görünümünde korunur. Yeni öğretim
            yılına kopyalanmaz, değiştirilmez veya yeniden onaylanmaz.
          </p>
        </div>
        <label>
          Öğretim yılı
          <select
            value={selectedAcademicYear}
            disabled={loading || !activeAcademicYear}
            onChange={(event) => void loadRecords(event.target.value)}
          >
            {[
              ...(academicYearArchives.some(
                (item) => item.academicYear === activeAcademicYear,
              )
                ? []
                : [
                    {
                      academicYear: activeAcademicYear,
                      recordCount: 0,
                      revisionCount: 0,
                    },
                  ]),
              ...academicYearArchives,
            ]
              .filter((item) => item.academicYear)
              .map((item) => (
                <option key={item.academicYear} value={item.academicYear}>
                  {item.academicYear}
                  {item.academicYear === activeAcademicYear
                    ? " • Etkin yıl"
                    : " • Geçmiş yıl"}
                  {` • ${item.recordCount} kayıt / ${item.revisionCount} revizyon`}
                </option>
              ))}
          </select>
        </label>
      </section>

      {message ? <div className="archive-message" role="status" aria-live="polite">{message}</div> : null}

      <section className="local-import-card">
        <div>
          <span className="section-kicker"><Upload size={14} /> v46 geçişi</span>
          <h2>Yerel kayıtları kontrollü biçimde aktarın</h2>
          <p>{localStatus?.message ?? "Yerel arşiv denetleniyor…"}</p>
          {localStatus?.state === "ready" ? (
            <small>
              {localStatus.recordCount} kayıt • {localStatus.revisionCount} revizyon.
              Aktarım kopyalama işlemidir; tarayıcıdaki v46 arşivi silinmez.
            </small>
          ) : null}
        </div>
        {localStatus?.state === "ready" ? (
          <div className="import-confirmation">
            <label>
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(event) => setConfirmed(event.target.checked)}
              />
              Bu kayıtları hesabıma kopyalamayı onaylıyorum.
            </label>
            <button
              className="primary-button"
              disabled={!confirmed || importing}
              onClick={() => void importLocalArchive()}
            >
              {importing ? <LoaderCircle className="spin" size={17} /> : <Upload size={17} />}
              Hesabıma aktar
            </button>
          </div>
        ) : null}
      </section>

      <section className="account-export-card">
        <div>
          <span className="section-kicker"><FileJson size={14} /> Hesap verileri</span>
          <h2>Taşınabilir bir kopya indirin</h2>
          <p>
            JSON paketi hesap e-postanızı, öğretmen profilinizi ve hesabınıza
            bağlı pedagojik kayıtların revizyon geçmişini içerir.
          </p>
          <ul>
            <li>İçerir: profil, pedagojik kayıtlar ve bütünlük özeti</li>
            <li>İçermez: öğrenci listeleri, puanlar, BEP/sağlık verileri</li>
            <li>İçermez: oturum bilgileri ve sistem iç kimlikleri</li>
          </ul>
        </div>
        <div className="export-confirmation">
          <label>
            <input
              type="checkbox"
              checked={exportConfirmed}
              onChange={(event) => setExportConfirmed(event.target.checked)}
            />
            Paketin kapsamını okudum ve hesap verilerimin indirilmesini
            onaylıyorum.
          </label>
          <button
            className="primary-button"
            disabled={!exportConfirmed || exporting}
            onClick={() => void exportAccountData()}
          >
            {exporting ? (
              <LoaderCircle className="spin" size={17} />
            ) : (
              <Download size={17} />
            )}
            JSON paketini indir
          </button>
        </div>
      </section>

      <section className="retention-policy-card">
        <div className="retention-policy-copy">
          <span className="section-kicker">
            <ShieldCheck size={14} /> Saklama ve güvenli silme
          </span>
          <h2>Verilerinizin yaşam döngüsünü yönetin</h2>
          <p>
            Hesabınız ve öğretmen profiliniz bu işlemden etkilenmez. Yalnızca
            hesaba bağlı pedagojik kayıtlar silme alanına taşınır.
          </p>
          {policy ? (
            <ul>
              <li>Hesap ve profil: {policy.policies.accountAndProfile}</li>
              <li>Pedagojik kayıtlar: {policy.policies.pedagogicalRecords}</li>
              <li>Öğrenci verisi: {policy.policies.studentData}</li>
              <li>Dışa aktarılan dosyalar: {policy.policies.exportedFiles}</li>
            </ul>
          ) : (
            <p>Saklama politikası yükleniyor…</p>
          )}
          {policy?.trashedRevisionCount ? (
            <div className="trash-recovery">
              <div>
                <strong>{policy.trashedRevisionCount} revizyon geri alınabilir</strong>
                <span>
                  Silinen kayıtlar {policy.trashRetentionDays} gün sonra kalıcı
                  olarak temizlenir.
                </span>
              </div>
              <button
                className="secondary-button"
                disabled={restoring}
                onClick={() => void restoreAccountRecords()}
              >
                {restoring ? (
                  <LoaderCircle className="spin" size={17} />
                ) : (
                  <RotateCcw size={17} />
                )}
                Kayıtları geri yükle
              </button>
            </div>
          ) : null}
        </div>
        <div className="delete-records-panel">
          <span className="section-kicker"><Trash2 size={14} /> Tehlikeli işlem</span>
          <strong>Pedagojik kayıtlarımı sil</strong>
          <p>
            {policy?.activeRevisionCount ?? records.length} etkin revizyon silme
            alanına taşınacak. v46 yerel arşiviniz ve indirdiğiniz dosyalar
            etkilenmez.
          </p>
          <label>
            <input
              type="checkbox"
              checked={deleteConfirmed}
              onChange={(event) => setDeleteConfirmed(event.target.checked)}
            />
            Kapsamı ve 30 günlük geri alma süresini anladım.
          </label>
          <label className="confirmation-phrase">
            Onaylamak için <strong>KAYITLARIMI SİL</strong> yazın
            <input
              value={confirmationText}
              onChange={(event) => setConfirmationText(event.target.value)}
              autoComplete="off"
            />
          </label>
          <button
            className="danger-button"
            disabled={
              !deleteConfirmed ||
              confirmationText !== "KAYITLARIMI SİL" ||
              (policy?.activeRevisionCount ?? 0) < 1 ||
              deleting
            }
            onClick={() => void deleteAccountRecords()}
          >
            {deleting ? (
              <LoaderCircle className="spin" size={17} />
            ) : (
              <Trash2 size={17} />
            )}
            Kayıtları silme alanına taşı
          </button>
        </div>
      </section>

      <section className="account-closure-card">
        <div>
          <span className="section-kicker">
            <UserX size={14} /> Hesabı kapat
          </span>
          <h2>FOPOS hesabımı kalıcı olarak sil</h2>
          <p>
            Bu işlem öğretmen profilinizi, etkin ve silme alanındaki tüm
            pedagojik revizyonları ve FOPOS hesap kaydınızı kalıcı olarak siler.
            30 günlük geri alma süresi bu işlem için geçerli değildir.
          </p>
          <ul>
            <li>
              Silinecek: öğretmen profili ve{" "}
              {closureSummary?.recordRevisionCount ?? "—"} pedagojik revizyon
            </li>
            <li>
              Etkilenmez: tarayıcınızdaki v46 yerel arşivi ve daha önce
              indirdiğiniz dosyalar
            </li>
            <li>
              Öğrenci kişisel verisi hesapta kalıcı tutulmadığı için silinecek
              hesap paketinde bulunmaz
            </li>
            <li>İşlem tamamlandığında güvenli biçimde çıkış yapılır</li>
          </ul>
          <p className="closure-export-reminder">
            Saklamak istediğiniz içerik varsa önce yukarıdaki JSON paketini
            indirin.
          </p>
        </div>
        <div className="account-closure-confirmation">
          <label>
            <input
              type="checkbox"
              checked={accountDeleteConfirmed}
              onChange={(event) =>
                setAccountDeleteConfirmed(event.target.checked)
              }
            />
            Bu işlemin geri alınamayacağını ve hesabımın yeniden
            oluşturulmasının eski verileri geri getirmeyeceğini anlıyorum.
          </label>
          <label>
            Hesap e-postanızı yazın
            <input
              value={accountEmailConfirmation}
              onChange={(event) =>
                setAccountEmailConfirmation(event.target.value)
              }
              autoComplete="off"
              inputMode="email"
            />
          </label>
          <label>
            Onaylamak için <strong>HESABIMI KALICI OLARAK SİL</strong> yazın
            <input
              value={accountConfirmationText}
              onChange={(event) =>
                setAccountConfirmationText(event.target.value)
              }
              autoComplete="off"
            />
          </label>
          <button
            className="danger-button"
            disabled={
              !accountDeleteConfirmed ||
              accountConfirmationText !== "HESABIMI KALICI OLARAK SİL" ||
              accountEmailConfirmation.trim().toLocaleLowerCase("en-US") !==
                accountEmail ||
              !closureSummary ||
              closingAccount
            }
            onClick={() => void closeAccountPermanently()}
          >
            {closingAccount ? (
              <LoaderCircle className="spin" size={17} />
            ) : (
              <UserX size={17} />
            )}
            Hesabımı kalıcı olarak sil
          </button>
        </div>
      </section>

      <section className="archive-list" aria-busy={loading}>
        <div className="archive-list-heading">
          <div>
            <span className="section-kicker">
              {selectedAcademicYear === activeAcademicYear
                ? "Etkin öğretim yılı"
                : "Geçmiş yıl arşivi"}
            </span>
            <h2>{selectedAcademicYear || "—"} revizyon geçmişi</h2>
          </div>
          <span>{loading ? "Yükleniyor…" : `${histories.length} kayıt`}</span>
        </div>
        {loading ? (
          <div className="archive-empty"><LoaderCircle className="spin" size={24} /> Kayıtlar yükleniyor…</div>
        ) : histories.length === 0 ? (
          <div className="archive-empty">
            <Archive size={28} />
            <strong>Henüz hesap kaydı yok</strong>
            <span>Ders Tasarım Stüdyosu’nda oluşturduğunuz ilk plan burada görünecek.</span>
          </div>
        ) : (
          histories.map((history) => {
            const latest = history[0];
            return (
              <article className="archive-record-card" key={latest.recordId}>
                <div className="archive-record-title">
                  <div>
                    <strong>{latest.curriculum.unitCode}</strong>
                    <span>{latest.curriculum.outcomeCode} • {latest.curriculum.grade}. sınıf • {latest.lessonContext.week}. hafta</span>
                  </div>
                  <span className={`archive-status ${latest.status}`}>{statusLabels[latest.status]}</span>
                </div>
                <p>{latest.pedagogicalDecision.strategy}</p>
                <details>
                  <summary>{history.length} revizyonu göster</summary>
                  {history.map((record) => (
                    <div className="archive-revision-row" key={`${record.recordId}-${record.revision}`}>
                      <span>Revizyon {record.revision}</span>
                      <span>{statusLabels[record.status]}</span>
                      <time dateTime={record.updatedAt}>
                        {new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(new Date(record.updatedAt))}
                      </time>
                    </div>
                  ))}
                </details>
              </article>
            );
          })
        )}
      </section>
    </section>
  );
}
