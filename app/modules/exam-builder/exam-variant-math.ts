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
