"use client";

import { LoaderCircle, Plus, School } from "lucide-react";
import { type FormEvent, useState } from "react";
import type { ClassWorkspaceContext } from "../../core/class-workspace";

export function ClassWorkspaceEmptyState({
  onCreated,
}: {
  onCreated: (workspace: ClassWorkspaceContext) => void;
}) {
  const [grade, setGrade] = useState<10 | 11>(10);
  const [branchCode, setBranchCode] = useState("A");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function create(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const normalizedBranch = branchCode.trim().toLocaleUpperCase("tr-TR");
      const response = await fetch("/api/class-workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grade, branchCode: normalizedBranch }),
      });
      const payload = (await response.json()) as {
        workspaces?: ClassWorkspaceContext[];
        error?: string;
      };
      if (!response.ok || !payload.workspaces) {
        throw new Error(payload.error ?? "Sınıf oluşturulamadı.");
      }
      const workspace = payload.workspaces.find(
        (item) =>
          !item.archivedAt &&
          item.grade === grade &&
          item.branchCode === normalizedBranch,
      );
      if (!workspace) {
        throw new Error("Oluşturulan sınıf çalışma alanı açılamadı.");
      }
      onCreated(workspace);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Sınıf oluşturulamadı.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="class-context-empty class-context-create">
      <School size={32} />
      <h2>İlk sınıf ve şubenizi oluşturun</h2>
      <p>
        Oluşturduğunuz sınıf kalıcı çalışma alanına kaydedilir ve Öğrenci
        Listeleri ekranında hemen açılır.
      </p>
      <form onSubmit={create}>
        <label>
          <span>Sınıf</span>
          <select
            value={grade}
            onChange={(event) =>
              setGrade(Number(event.target.value) as 10 | 11)
            }
          >
            <option value="10">10. sınıf</option>
            <option value="11">11. sınıf</option>
          </select>
        </label>
        <label>
          <span>Şube</span>
          <input
            value={branchCode}
            onChange={(event) =>
              setBranchCode(event.target.value.toLocaleUpperCase("tr-TR"))
            }
            maxLength={4}
            placeholder="A"
            required
          />
        </label>
        <button
          type="submit"
          className="primary-button"
          disabled={busy || !branchCode.trim()}
        >
          {busy ? (
            <LoaderCircle className="spin" size={17} />
          ) : (
            <Plus size={17} />
          )}
          Sınıfı oluştur ve aç
        </button>
      </form>
      {message ? (
        <small className="import-status" role="alert">
          {message}
        </small>
      ) : null}
    </section>
  );
}
