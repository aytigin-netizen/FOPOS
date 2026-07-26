"use client";

import { Plus, School, ShieldCheck } from "lucide-react";
import type { ClassWorkspaceContext } from "../../core/class-workspace";

export function ClassWorkspaceSelector({
  workspaces,
  selectedId,
  onSelect,
  onManage,
}: {
  workspaces: ClassWorkspaceContext[];
  selectedId: string;
  onSelect: (id: string) => void;
  onManage: () => void;
}) {
  const selected = workspaces.find((item) => item.id === selectedId);
  return (
    <section className="class-context-bar" aria-label="Etkin sınıf çalışma alanı">
      <div><School size={20} /><span><strong>Etkin sınıf bağlamı</strong><small>{selected ? `${selected.academicYear} • ${selected.grade}/${selected.branchCode}` : "Bir çalışma alanı seçin"}</small></span></div>
      <label><span>Sınıf ve şube</span><select value={selectedId} onChange={(event) => onSelect(event.target.value)}>{workspaces.map((item) => <option value={item.id} key={item.id}>{item.grade}/{item.branchCode} • {item.academicYear}</option>)}</select></label>
      <button type="button" className="secondary-button" onClick={onManage}><Plus size={15} /> Yeni sınıf / şube</button>
      <p><ShieldCheck size={15} /> Öğrenci verileri yalnızca bu sekmenin oturum belleğinde tutulur.</p>
    </section>
  );
}
