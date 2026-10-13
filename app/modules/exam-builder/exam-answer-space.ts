export type AnswerSpaceQuestion = {
  text: string;
  levelLabel: string;
  responseFormat?: 'extended';
  fontSize?: number;
};

// Eski kayıtlarda biçim alanı bulunmayabilir; açık cümle yönergesi de korunur.
export function examAnswerSpace(question: AnswerSpaceQuestion) {
  const minimumSentences = Number(question.text.match(/en\s+az\s+(\d+)\s+cümle/iu)?.[1] ?? 0);
  const extended = question.responseFormat === 'extended' || minimumSentences >= 8;
  return {
    extended,
    lineCount: extended ? Math.max(12, Math.ceil(minimumSentences * 1.5))
      : ['Değerlendirme', 'Oluşturma'].includes(question.levelLabel) ? 5 : 3,
    lineHeight: question.fontSize === 32 ? 480 : 360,
  };
}
