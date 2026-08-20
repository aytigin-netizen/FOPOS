"use client";

import {
  BookOpen,
  CalendarRange,
  CheckCircle2,
  History,
  LoaderCircle,
  Save,
  School,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";

type Profile = {
  displayName: string;
  schoolName: string;
  academicYear: string;
  revision: number;
};

type ProfileRevision = Profile & { changedAt: string };

type DisciplineAssignment = {
  disciplineCode: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
};

type AvailableDiscipline = {
  code: string;
  name: string;
  status: "available";
};

export default function ProfileSettingsModule({
  hasSensitiveSession,
}: {
  hasSensitiveSession: boolean;
}) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [history, setHistory] = useState<ProfileRevision[]>([]);
  const [recordRevisionCount, setRecordRevisionCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [rolloverConfirmed, setRolloverConfirmed] = useState(false);
  const [rolloverConfirmationText, setRolloverConfirmationText] = useState("");
  const [disciplineLoading, setDisciplineLoading] = useState(true);
  const [disciplineSaving, setDisciplineSaving] = useState(false);
  const [availableDisciplines, setAvailableDisciplines] = useState<AvailableDiscipline[]>([]);
  const [disciplineAssignments, setDisciplineAssignments] = useState<DisciplineAssignment[]>([]);
  const [disciplineDraft, setDisciplineDraft] = useState<DisciplineAssignment[]>([]);

  async function loadProfile() {
    setLoading(true);
    try {
      const response = await fetch("/api/profile");
      const payload = (await response.json()) as {
        profile?: Profile;
        history?: ProfileRevision[];
        recordRevisionCount?: number;
        error?: string;
      };
      if (!response.ok || !payload.profile) {
        throw new Error(payload.error ?? "Öğretmen profili açılamadı.");
      }
      setProfile(payload.profile);
      setHistory(payload.history ?? []);
      setRecordRevisionCount(payload.recordRevisionCount ?? 0);
      setDisplayName(payload.profile.displayName);
      setSchoolName(payload.profile.schoolName);
      setAcademicYear(payload.profile.academicYear);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Öğretmen profili açılamadı.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadDisciplines() {
    setDisciplineLoading(true);
    try {
      const response = await fetch("/api/teacher-disciplines");
      const payload = (await response.json()) as {
        assignments?: DisciplineAssignment[];
        availableDisciplines?: AvailableDiscipline[];
        error?: string;
      };
      if (!response.ok || !payload.assignments || !payload.availableDisciplines) {
        throw new Error(payload.error ?? "Branş ayarları açılamadı.");
      }
      setAvailableDisciplines(payload.availableDisciplines);
      setDisciplineAssignments(payload.assignments);
      setDisciplineDraft(payload.assignments);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Branş ayarları açılamadı.");
    } finally {
      setDisciplineLoading(false);
    }
  }

  useEffect(() => {
    const initialLoad = window.setTimeout(() => {
      void loadProfile();
      void loadDisciplines();
    }, 0);
    return () => window.clearTimeout(initialLoad);
  }, []);

  const yearChanged = Boolean(profile && academicYear !== profile.academicYear);
  const rolloverReady =
    !yearChanged ||
    (!hasSensitiveSession &&
      rolloverConfirmed &&
      rolloverConfirmationText === "YENİ ÖĞRETİM YILINA GEÇ");
  const hasChanges = Boolean(
    profile &&
      (displayName.trim() !== profile.displayName ||
        schoolName.trim() !== profile.schoolName ||
        academicYear.trim() !== profile.academicYear),
  );

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!profile || !hasChanges || !rolloverReady) return;
    setSaving(true);
    setMessage("Profil değişiklikleri güvenli biçimde kaydediliyor…");
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName,
          schoolName,
          academicYear,
          expectedRevision: profile.revision,
          rolloverConfirmed,
          rolloverConfirmationText,
        }),
      });
      const payload = (await response.json()) as {
        profile?: Profile;
        history?: ProfileRevision[];
        recordRevisionCount?: number;
        error?: string;
      };
      if (!response.ok || !payload.profile) {
        throw new Error(payload.error ?? "Profil güncellenemedi.");
      }
      setProfile(payload.profile);
      setHistory(payload.history ?? []);
      setRecordRevisionCount(payload.recordRevisionCount ?? 0);
      setDisplayName(payload.profile.displayName);
      setSchoolName(payload.profile.schoolName);
      setAcademicYear(payload.profile.academicYear);
      setRolloverConfirmed(false);
      setRolloverConfirmationText("");
      setMessage("Profil güncellendi. Yeni bilgiler çalışma alanına uygulanıyor…");
      window.setTimeout(() => window.location.reload(), 700);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Profil güncellenemedi.");
      setSaving(false);
    }
  }

  const disciplineHasChanges =
    JSON.stringify(
      disciplineAssignments.map(({ disciplineCode, isDefault }) => ({
        disciplineCode,
        isDefault,
      })),
    ) !==
    JSON.stringify(
      disciplineDraft.map(({ disciplineCode, isDefault }) => ({
        disciplineCode,
        isDefault,
      })),
    );

  function toggleDiscipline(code: string, selected: boolean) {
    if (
      !selected &&
      disciplineDraft.length === 1 &&
      disciplineDraft[0]?.disciplineCode === code
    ) {
      setMessage("Çalışma alanında en az bir branş seçili kalmalıdır.");
      return;
    }
    setDisciplineDraft((current) => {
      if (selected) {
        if (current.some((item) => item.disciplineCode === code)) return current;
        return [
          ...current,
          {
            disciplineCode: code,
            isDefault: current.length === 0,
            createdAt: "",
            updatedAt: "",
          },
        ];
      }
      const remaining = current.filter((item) => item.disciplineCode !== code);
      if (current.find((item) => item.disciplineCode === code)?.isDefault) {
        return remaining.map((item, index) => ({
          ...item,
          isDefault: index === 0,
        }));
      }
      return remaining;
    });
  }

  function makeDefaultDiscipline(code: string) {
    setDisciplineDraft((current) =>
      current.map((item) => ({
        ...item,
        isDefault: item.disciplineCode === code,
      })),
    );
  }

  async function saveDisciplines() {
    if (!disciplineHasChanges || disciplineDraft.length === 0) return;
    setDisciplineSaving(true);
    setMessage("Branş atamaları güvenli biçimde kaydediliyor…");
    try {
      const response = await fetch("/api/teacher-disciplines", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignments: disciplineDraft.map(
            ({ disciplineCode, isDefault }) => ({
              disciplineCode,
              isDefault,
            }),
          ),
        }),
      });
      const payload = (await response.json()) as {
        assignments?: DisciplineAssignment[];
        availableDisciplines?: AvailableDiscipline[];
        error?: string;
      };
      if (!response.ok || !payload.assignments) {
        throw new Error(payload.error ?? "Branş atamaları güncellenemedi.");
      }
      setDisciplineAssignments(payload.assignments);
      setDisciplineDraft(payload.assignments);
      if (payload.availableDisciplines) {
        setAvailableDisciplines(payload.availableDisciplines);
      }
      setMessage("Branş atamaları güncellendi.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Branş atamaları güncellenemedi.",
      );
    } finally {
      setDisciplineSaving(false);
    }
  }

  return (
    <section className="profile-settings-module">
      <header className="profile-settings-hero">
        <div>
          <span className="eyebrow">
            <ShieldCheck size={15} /> Güvenli Öğretmen Çalışma Alanı
          </span>
          <h1>Profil ve Öğretim Yılı</h1>
          <p>
            Kimlik ve okul bilgilerinizi güncelleyin; yeni öğretim yılına mevcut
            kayıtları değiştirmeden kontrollü biçimde geçin.
          </p>
        </div>
        <div className="profile-version-seal">
          <History size={31} />
          <strong>Revizyon {profile?.revision ?? "—"}</strong>
          <span>Değişiklik geçmişi korunur</span>
        </div>
      </header>

      {message ? (
        <div className="archive-message" role="status" aria-live="polite">
          {message}
        </div>
      ) : null}

      <form className="profile-settings-grid" onSubmit={saveProfile}>
        <section className="profile-edit-card" aria-busy={loading}>
          <span className="section-kicker">
            <UserRound size={14} /> Öğretmen profili
          </span>
          <h2>Çalışma alanı bilgileri</h2>
          {loading ? (
            <div className="profile-settings-loading">
              <LoaderCircle className="spin" size={22} /> Profil yükleniyor…
            </div>
          ) : (
            <>
              <label>
                <span><UserRound size={15} /> Öğretmen adı</span>
                <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} maxLength={160} required />
              </label>
              <label>
                <span><School size={15} /> Okul adı</span>
                <input value={schoolName} onChange={(event) => setSchoolName(event.target.value)} maxLength={160} required />
              </label>
              <label>
                <span><CalendarRange size={15} /> Öğretim yılı</span>
                <input
                  value={academicYear}
                  onChange={(event) => {
                    setAcademicYear(event.target.value);
                    setRolloverConfirmed(false);
                    setRolloverConfirmationText("");
                  }}
                  placeholder="2026-2027"
                  pattern="\d{4}-\d{4}"
                  maxLength={9}
                  required
                />
                <small>Ardışık iki yılı YYYY-YYYY biçiminde yazın.</small>
              </label>
            </>
          )}
        </section>

        <section className={`academic-rollover-card ${yearChanged ? "active" : ""}`}>
          <span className="section-kicker">
            <CalendarRange size={14} /> Öğretim yılı geçişi
          </span>
          <h2>
            {yearChanged
              ? `${profile?.academicYear} → ${academicYear || "yeni yıl"}`
              : "Mevcut öğretim yılı korunuyor"}
          </h2>
          <p>
            {recordRevisionCount} pedagojik revizyon hesabınızda değişmeden
            kalır. Geçiş yalnız profilinizin yeni çalışma yılı varsayılanını
            günceller; eski kayıtları silmez, yeniden yazmaz veya otomatik
            onaylamaz.
          </p>
          {yearChanged ? (
            <div className="rollover-confirmation">
              {hasSensitiveSession ? (
                <div className="rollover-session-warning" role="alert">
                  Etkin öğrenci oturumu varken öğretim yılı değiştirilemez.
                  Önce Öğrenci Listeleri ekranında oturum verilerini temizleyin.
                </div>
              ) : null}
              <label>
                <input type="checkbox" checked={rolloverConfirmed} onChange={(event) => setRolloverConfirmed(event.target.checked)} />
                Mevcut kayıtların korunacağını ve yeni yılın bundan sonraki
                çalışma alanı varsayılanı olacağını anlıyorum.
              </label>
              <label>
                Onaylamak için <strong>YENİ ÖĞRETİM YILINA GEÇ</strong> yazın
                <input value={rolloverConfirmationText} onChange={(event) => setRolloverConfirmationText(event.target.value)} autoComplete="off" />
              </label>
            </div>
          ) : (
            <div className="rollover-safe-note">
              <CheckCircle2 size={18} />
              Öğretim yılı değişmediği sürece ek geçiş onayı gerekmez.
            </div>
          )}
          <button className="primary-button" type="submit" disabled={!hasChanges || !rolloverReady || saving || loading}>
            {saving ? <LoaderCircle className="spin" size={17} /> : <Save size={17} />}
            Değişiklikleri kaydet
          </button>
        </section>
      </form>

      <section className="discipline-settings-card" aria-busy={disciplineLoading}>
        <div className="discipline-settings-heading">
          <div>
            <span className="section-kicker">
              <BookOpen size={14} /> Branş ve müfredat
            </span>
            <h2>Öğretmen branşları</h2>
            <p>
              Bir veya daha fazla hazır branşı çalışma alanınıza bağlayın ve
              sınıf oluştururken kullanılacak varsayılan branşı seçin.
            </p>
          </div>
          <span className="discipline-count">
            {disciplineDraft.length} etkin branş
          </span>
        </div>

        {disciplineLoading ? (
          <div className="profile-settings-loading">
            <LoaderCircle className="spin" size={22} /> Branşlar yükleniyor…
          </div>
        ) : (
          <>
            <div className="discipline-options" role="group" aria-label="Öğretmen branşları">
              {availableDisciplines.map((discipline) => {
                const assignment = disciplineDraft.find(
                  (item) => item.disciplineCode === discipline.code,
                );
                return (
                  <article
                    className={assignment ? "discipline-option selected" : "discipline-option"}
                    key={discipline.code}
                  >
                    <label className="discipline-select">
                      <input
                        type="checkbox"
                        checked={Boolean(assignment)}
                        onChange={(event) =>
                          toggleDiscipline(discipline.code, event.target.checked)
                        }
                      />
                      <span>
                        <strong>{discipline.name}</strong>
                        <small>{discipline.code} • Müfredat paketi hazır</small>
                      </span>
                    </label>
                    <label className="discipline-default">
                      <input
                        type="radio"
                        name="default-discipline"
                        checked={assignment?.isDefault ?? false}
                        disabled={!assignment}
                        onChange={() => makeDefaultDiscipline(discipline.code)}
                      />
                      Varsayılan
                    </label>
                  </article>
                );
              })}
            </div>
            <div className="discipline-settings-actions">
              <p>
                Yeni branşlar, doğrulanmış müfredat paketleri eklendikçe bu
                listede otomatik görünür. Etkin bir sınıfta kullanılan branş
                kaldırılamaz.
              </p>
              <button
                type="button"
                className="primary-button"
                disabled={!disciplineHasChanges || disciplineSaving}
                onClick={() => void saveDisciplines()}
              >
                {disciplineSaving ? (
                  <LoaderCircle className="spin" size={17} />
                ) : (
                  <Save size={17} />
                )}
                Branşları kaydet
              </button>
            </div>
          </>
        )}
      </section>

      <section className="profile-history-card">
        <div>
          <span className="section-kicker"><History size={14} /> Profil geçmişi</span>
          <h2>Son profil revizyonları</h2>
        </div>
        {history.length === 0 ? (
          <p>Henüz geçmiş profil revizyonu bulunmuyor.</p>
        ) : (
          <div className="profile-history-list">
            {history.map((item) => (
              <article key={item.revision}>
                <strong>Revizyon {item.revision}</strong>
                <span>{item.displayName} • {item.schoolName}</span>
                <span>{item.academicYear}</span>
                <time dateTime={item.changedAt}>
                  {new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(item.changedAt))}
                </time>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
