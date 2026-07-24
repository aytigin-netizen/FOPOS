"use client";

import { ArrowRight, Bot, ShieldCheck, Sparkles, Target, TriangleAlert } from "lucide-react";
import type { AnonymousClassSummary } from "../../core/anonymous-class-summary";

function priorityFor(rate: number) {
  if (rate < 50) return { label: "Kritik", className: "critical", action: "Yeniden öğretim ve kavram yanılgısı çalışması planlayın." };
  if (rate < 70) return { label: "İzlenmeli", className: "monitor", action: "Felsefi metin çözümleme ve gerekçeli tartışmayla pekiştirin." };
  return { label: "Yeterli", className: "sufficient", action: "Karşılaştırma ve transfer görevleriyle yeterliği sürdürün." };
}

export default function FoposAiModule({
  summary,
  onOpenAnalysis,
}: {
  summary: AnonymousClassSummary | null;
  onOpenAnalysis: () => void;
}) {
  const successRate = summary?.metrics.successRate ?? null;
  const classAverage = summary?.metrics.classAverage ?? null;
  const priority = priorityFor(successRate ?? 0);

  return (
    <section className="fopos-ai-module" id="top">
      <header className="fopos-ai-hero">
        <div>
          <span className="eyebrow"><Sparkles size={15}/> FOPOS AI • Pedagojik Karar Desteği</span>
          <h1>Kanıttan<br/><em>öğretim kararına.</em></h1>
          <p>Sınav analizinden gelen kimliksiz sınıf özetini yorumlar; öğretmene gerekçeli, önceliklendirilmiş ve denetlenebilir öneriler sunar.</p>
        </div>
        <div className="ai-privacy-seal"><ShieldCheck size={38}/><strong>Kimliksiz veri sınırı</strong><span>Ad, okul numarası ve bireysel puan alınmaz.</span></div>
      </header>

      {!summary ? (
        <section className="ai-empty-state">
          <Bot size={42}/>
          <div><h2>Henüz kimliksiz sınıf özeti yok</h2><p>Sınav Analizi modülünde en az beş tam öğrenci kaydı oluşturun ve yalnız toplulaştırılmış özeti FOPOS AI’ya aktarın.</p></div>
          <button className="primary-button" onClick={onOpenAnalysis}>Sınav Analizine git <ArrowRight size={17}/></button>
        </section>
      ) : (
        <>
          <section className="ai-metric-grid" aria-label="Kimliksiz sınıf özeti">
            <article><span>Sınıf</span><strong>{summary.grade}. sınıf</strong></article>
            <article><span>Grup büyüklüğü</span><strong>{summary.groupSize}</strong></article>
            <article><span>Sınıf ortalaması</span><strong>{classAverage?.toFixed(1) ?? "—"}</strong></article>
            <article><span>Başarı oranı</span><strong>%{successRate?.toFixed(1) ?? "—"}</strong></article>
          </section>
          <section className={`ai-decision-card ${priority.className}`}>
            <div><Target size={24}/><span>Öncelik</span><strong>{priority.label}</strong></div>
            <div><h2>Önerilen pedagojik müdahale</h2><p>{priority.action}</p><small>Gerekçe: {summary.groupSize} kişilik kimliksiz sınıf özetinde başarı oranı %{successRate?.toFixed(1)} ve sınıf ortalaması {classAverage?.toFixed(1)}.</small></div>
          </section>
          <aside className="ai-governance-note"><TriangleAlert size={20}/><div><strong>Öğretmen kararı zorunludur</strong><p>Bu öneri otomatik karar değildir. Öğretmen; sınıf bağlamı, öğrenme çıktıları ve gözlem kanıtlarıyla öneriyi kabul eder, değiştirir veya reddeder.</p></div></aside>
        </>
      )}
    </section>
  );
}

