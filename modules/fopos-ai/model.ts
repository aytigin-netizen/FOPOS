import type { ExamAnalysis } from "@/modules/exam-analysis/types";
import type { AiRecommendation, FoposAiDecisionSupport } from "@/modules/fopos-ai/types";

export function createDecisionSupport(analysis: ExamAnalysis): FoposAiDecisionSupport {
  const warnings: string[] = [];
  if (!analysis.participantCount) warnings.push("Katılımcı verisi yok; pedagojik öneri üretilemez.");
  if (analysis.incompleteCount) warnings.push(`${analysis.incompleteCount} öğrencinin puan/katılım girişi eksik.`);
  if (analysis.participantCount > 0 && analysis.participantCount < 5) warnings.push("Örneklem küçük; sonuçlar sınırlı güvenle yorumlanmalıdır.");
  const confidence = !analysis.participantCount
    ? "insufficient"
    : analysis.incompleteCount || analysis.participantCount < 5
      ? "limited"
      : "adequate";
  const recommendations: AiRecommendation[] = confidence === "insufficient" ? [] : analysis.outcomeAnalysis.map((outcome) => ({
    id: `recommendation-${outcome.outcomeCode}`,
    priority: outcome.priority,
    outcomeCode: outcome.outcomeCode,
    title: outcome.priority === "critical" ? "Öncelikli yeniden öğretim" : outcome.priority === "monitor" ? "İzleme ve pekiştirme" : "Transferle sürdürme",
    rationale: outcome.evidence,
    action: outcome.intervention,
    monitoring: outcome.priority === "critical"
      ? "Bir hafta içinde aynı çıktıya bağlı kısa, puansız bir öğrenme kanıtı uygulayın."
      : outcome.priority === "monitor"
        ? "İki ders sonra metin çözümleme göreviyle yeniden ölçün."
        : "Yeni bağlamdaki transfer görevinde performansı izleyin.",
    evidence: {
      outcomeCode: outcome.outcomeCode,
      achievementRate: outcome.achievementRate,
      participantCount: outcome.participantCount,
      questionCount: analysis.questionAnalysis.filter((item) => item.question.outcomeCode === outcome.outcomeCode).length,
    },
  }));
  return {
    status: "suggestion",
    confidence,
    summary: {
      classAverage: analysis.classAverage,
      passRate: analysis.passRate,
      strongestOutcome: analysis.strongestOutcome?.outcomeCode ?? null,
      weakestOutcome: analysis.weakestOutcome?.outcomeCode ?? null,
      warnings,
    },
    recommendations,
    privacy: { studentNamesReceived: false, aggregateDataOnly: true },
    governance: { changesOfficialRecords: false, changesIepTargets: false, teacherApprovalRequired: true },
  };
}
