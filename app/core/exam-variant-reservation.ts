// Fresh A/B history is never reset. Reuse is a separate, explicit generation choice.
export function planExamReservation(round: number, reuseRound: number, width: number, maxRound: number, allowReuse = false) {
  if (![round, reuseRound, width, maxRound].every(Number.isSafeInteger)
    || round < 0 || reuseRound < 0 || width < 1 || width > 10 || maxRound < 1 || maxRound > 100) {
    throw new Error('Sınav varyant kapasitesi geçersiz.');
  }
  if (width > maxRound) throw new Error('Bu belirtkede A ve B için yeterli farklı soru yok. Soru sayısını azaltınız veya kapsamı genişletiniz.');
  if (round + width <= maxRound) return { start: round, next: round + width, reused: false, reuseRound };
  if (!allowReuse) throw new Error('Bu çıktılar için yeni A/B sorusu kalmadı. Önceki sorularla sınav oluşturmayı seçebilirsiniz.');
  if (reuseRound === Number.MAX_SAFE_INTEGER) throw new Error('Yeniden kullanım kaydı sınırına ulaşıldı.');
  // Each returned band fits A and B in the existing pool. A separate monotonic
  // cursor rotates reuse choices, without hiding previously consumed content.
  return { start: reuseRound % (maxRound - width + 1), next: round, reused: true, reuseRound: reuseRound + 1 };
}
