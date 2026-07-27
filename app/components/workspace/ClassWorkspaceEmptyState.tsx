"use client";

import { LoaderCircle, Plus, School } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import type { ClassWorkspaceContext } from "../../core/class-workspace";

type DisciplineOption = {
  code: string;
  name: string;
  isDefault: boolean;
};

export function ClassWorkspaceEmptyState({
  onCreated,
}: {
  onCreated: (workspace: ClassWorkspaceContext) => void;
}) {
  const [disciplines, setDisciplines] = useState<DisciplineOption[]>([]);
  const [subjectCode, setSubjectCode] = useState("");
  const [grade, setGrade] = useState<10 | 11>(10);
  const [branchCode, setBranchCode] = useState("A");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetch("/api/class-workspaces")
        .then(async (response) => {
          const payload = (await response.json()) as {
            disciplines?: DisciplineOption[];
            defaultDisciplineCode?: string;
            error?: string;
          };
          if (
            !response.ok ||
            !payload.disciplines ||
            !payload.defaultDisciplineCode
          ) {
            throw new Error(payload.error ?? "Branş bağlamı açılamadı.");
          }
          setDisciplines(payload.disciplines);
          setSubjectCode(payload.defaultDisciplineCode);
        })
        .catch((error) =>
          setMessage(
            error instanceof Error ? error.message : "Branş bağlamı açılamadı.",
          ),
        );
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  async function create(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const normalizedBranch = branchCode.trim().toLocaleUpperCase("tr-TR");
      const response = await fetch("/api/class-workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectCode,
          grade,
          branchCode: normalizedBranch,
        }),
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
          item.subjectCode === subjectCode &&
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
        Varsayılan branşınız seçili açılır. Yalnız müfredat paketi hazır ve
        hesabınıza atanmış branşlarla çalışma alanı oluşturabilirsiniz.
      </p>
      <form onSubmit={create}>
        <label>
          <span>Branş</span>
          <select
            value={subjectCode}
            onChange={(event) => setSubjectCode(event.target.value)}
            required
          >
            {disciplines.map((discipline) => (
              <option value={discipline.code} key={discipline.code}>
                {discipline.name}
                {discipline.isDefault ? " • Varsayılan" : ""}
              </option>
            ))}
          </select>
        </label>
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
          disabled={busy || !subjectCode || !branchCode.trim()}
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
