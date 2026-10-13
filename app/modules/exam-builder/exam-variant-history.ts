// Yalnız soru bankası kapsamı ve tüketilen tur tutulur; öğretmen/öğrenci verisi içermez.
const PREFIX = 'fopos-exam-variants-v1:';
type Storage = Pick<globalThis.Storage, 'getItem' | 'setItem'>;
export function examVariantHistoryKey(subject: string, dataset: string, rows: { code: string; questionCount: number; questionKind: string; cognitiveLevel: string }[]): string {
  return PREFIX + JSON.stringify([subject, dataset, rows.filter(r => r.questionCount > 0)
    .map(r => [r.code, r.questionCount, r.questionKind, r.cognitiveLevel]).sort((a, b) => String(a[0]).localeCompare(String(b[0])))]);
}
export function readExamVariantRound(storage: Storage, key: string): number {
  const raw = storage.getItem(key);
  if (raw === null) return 0;
  const round = Number(raw);
  if (!/^\d+$/.test(raw) || !Number.isSafeInteger(round)) throw new Error('Soru üretim geçmişi okunamadı; tekrar riski nedeniyle üretim durduruldu.');
  return round;
}
export function reserveExamVariantRound(storage: Storage, key: string, expectedRound: number): void {
  if (readExamVariantRound(storage, key) !== expectedRound) throw new Error('Bu kapsam başka bir sekmede üretildi. Sayfayı yenileyip kalan üretimi kontrol ediniz.');
  storage.setItem(key, String(expectedRound + 1));
  if (readExamVariantRound(storage, key) !== expectedRound + 1) throw new Error('Üretim geçmişi kaydedilemedi; tekrar riski nedeniyle üretim durduruldu.');
}
