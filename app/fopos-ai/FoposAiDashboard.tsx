"use client";

import { analyzeExam, getAnalysisDefaults } from "@/modules/exam-analysis/model";
import { createDecisionSupport } from "@/modules/fopos-ai/model";

export function FoposAiDashboard() {
  const defaults = getAnalysisDefaults();
  const questions = defaults.exam.bookletA;
  const analysis = analyzeExam({
    ...defaults,
    students: Array.from({ length: 8 }, (_, index) => ({
      ...defaults.students[index % defaults.students.length],
      id: `anonymous-${index}`,
      fullName: "",
      schoolNumber: "",
      attendance: "present" as const,
      questionScores: questions.map((question, questionIndex) => Math.max(0, question.points - index - questionIndex)),
    })),
  });
  const support = createDecisionSupport(analysis);
  return <div className="ai-dashboard">
    <header className="ai-hero"><div><span className="eyebrow">Şeffaf pedagojik karar desteği</span><h1>FOPOS AI</h1><p>Öğrenci kimliklerini almadan, toplulaştırılmış sınav kanıtlarından öğretmene gerekçeli öneriler sunar.</p></div><span className="ai-status">ÖNERİ · {support.confidence === "adequate" ? "Yeterli kanıt" : "Sınırlı kanıt"}</span></header>
    <section className="ai-summary">
      <div><span>Sınıf ortalaması</span><strong>{support.summary.classAverage ?? "—"}</strong></div>
      <div><span>Başarı oranı</span><strong>%{support.summary.passRate ?? "—"}</strong></div>
      <div><span>En güçlü çıktı</span><strong>{support.summary.strongestOutcome ?? "—"}</strong></div>
      <div><span>Öncelikli açık</span><strong>{support.summary.weakestOutcome ?? "—"}</strong></div>
    </section>
    {support.summary.warnings.map((warning) => <p className="ai-warning" key={warning}>{warning}</p>)}
    <section className="ai-recommendations"><h2>Önceliklendirilmiş pedagojik öneriler</h2>
      {support.recommendations.map((item) => <article className={`ai-card priority-${item.priority}`} key={item.id}><div className="ai-card-title"><div><span>{item.outcomeCode}</span><h3>{item.title}</h3></div><strong>%{item.evidence.achievementRate}</strong></div><p><b>Kanıt:</b> {item.rationale}</p><p><b>Önerilen müdahale:</b> {item.action}</p><p><b>İzleme:</b> {item.monitoring}</p><footer>{item.evidence.questionCount} soru · {item.evidence.participantCount} anonim katılımcı</footer></article>)}
    </section>
    <aside className="ai-governance"><strong>Öğretmen son karar vericidir.</strong><span>Bu ekran resmî kayıtları veya BEP hedeflerini değiştirmez. Her öneri öğretmen değerlendirmesi gerektirir.</span></aside>
  </div>;
}
