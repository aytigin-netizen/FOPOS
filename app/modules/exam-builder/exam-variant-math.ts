// Ders-bağımsız varyant numaralandırması: sıra numarası = varyant * bileşen sayısı + bileşen.
// B kitapçığı, A'nın bileşeni için A ve B'de daha önce kullanılmamış bir sonraki varyantı alır.
export function nextParallelOrdinal(componentCount: number, ordinal: number, usedOrdinals: Iterable<number>): number {
  if (!Number.isInteger(componentCount) || componentCount < 1 || !Number.isInteger(ordinal) || ordinal < 0) {
    throw new Error('Geçersiz ünite/çıktı/bileşen eşleşmesi.');
  }
  const used = new Set(usedOrdinals);
  const component = ordinal % componentCount;
  let variation = Math.floor(ordinal / componentCount) + 1;
  while (used.has(variation * componentCount + component)) variation += 1;
  return variation * componentCount + component;
}

// Belirtke önerisi: soruları çıktılara eşit böler, ama hiçbir çıktıya A+B birlikte sığmayacak kadar soru vermez.
// Bir çıktının kapasitesi = süreç bileşeni sayısı × (varyant havuzu / 2). Toplam, kapasite toplamını aşarsa
// fazlalık eşit dağıtılır; böylece üretim düğmesi öğretmene açık kapasite uyarısını göstermeye devam eder.
export function allocateWithinCapacity(total: number, caps: readonly number[]): number[] {
  const result = caps.map(() => 0);
  if (!caps.length || total <= 0) return result;
  let remaining = Math.floor(total);
  for (;;) {
    const open = caps.map((cap, i) => i).filter((i) => result[i] < caps[i]).sort((x, y) => result[x] - result[y] || x - y);
    if (!open.length || remaining <= 0) break;
    const share = Math.floor(remaining / open.length);
    const extra = remaining % open.length;
    let given = 0;
    open.forEach((i, k) => {
      const give = Math.min(share + (k < extra ? 1 : 0), caps[i] - result[i]);
      result[i] += give;
      given += give;
    });
    remaining -= given;
    if (given === 0) break;
  }
  for (let k = 0; remaining > 0; k = (k + 1) % caps.length, remaining -= 1) result[k] += 1;
  return result;
}
