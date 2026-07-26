"use client";

import {
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

  useEffect(() => {
    const initialLoad = window.setTimeout(() => void loadProfile(), 0);
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
