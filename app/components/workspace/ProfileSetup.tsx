"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { LoaderCircle, ShieldCheck } from "lucide-react";

export function ProfileSetup({
  suggestedDisplayName,
  accountEmail,
}: {
  suggestedDisplayName: string;
  accountEmail: string;
}) {
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setStatus("Profil güvenli çalışma alanına kaydediliyor…");
    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: form.get("displayName"),
          schoolName: form.get("schoolName"),
          academicYear: form.get("academicYear"),
        }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Profil kaydedilemedi.");
      window.location.reload();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Profil kaydedilemedi.");
      setSaving(false);
    }
  }

  return (
    <main className="profile-setup-shell">
      <section className="profile-setup-card">
        <span className="profile-security-mark">
          <ShieldCheck size={23} /> Güvenli öğretmen çalışma alanı
        </span>
        <h1>FOPOS çalışma alanınızı tamamlayın</h1>
        <p>
          Planlarınız ve belgeleriniz doğrulanmış hesabınıza bağlanmadan önce
          öğretmen profilinizi oluşturun.
        </p>
        <div className="profile-account">
          <small>Doğrulanmış hesap</small>
          <strong>{accountEmail}</strong>
        </div>
        <form onSubmit={submit}>
          <label>
            <span>Adınız ve soyadınız</span>
            <input
              name="displayName"
              defaultValue={suggestedDisplayName}
              autoComplete="name"
              maxLength={160}
              required
            />
          </label>
          <label>
            <span>Okul adı</span>
            <input name="schoolName" maxLength={160} required />
          </label>
          <label>
            <span>Akademik yıl</span>
            <input
              name="academicYear"
              defaultValue="2026-2027"
              inputMode="numeric"
              pattern="[0-9]{4}-[0-9]{4}"
              required
            />
          </label>
          <button type="submit" disabled={saving}>
            {saving ? <LoaderCircle className="spin" size={18} /> : <ShieldCheck size={18} />}
            Güvenli çalışma alanını oluştur
          </button>
          <div role="status" aria-live="polite">{status}</div>
        </form>
      </section>
    </main>
  );
}
