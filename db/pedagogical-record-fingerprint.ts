import type { PedagogicalRecord } from "../app/core/pedagogical-record";

/**
 * Pedagojik kaydın değişmez (immutable) bölümünün kanonik gösterimi.
 *
 * Bu dizi `immutable_fingerprint` özetinin girdisidir. **Sıra önemlidir**:
 * özet bu sıraya göre hesaplanır. Kayıt yazma yolu, mevcut satırın özetiyle
 * yeniden hesaplanan özeti karşılaştırır; sapma kaydın bozulduğu anlamına
 * gelir.
 *
 * Modül bilinçli olarak veritabanına bağımlılığı olmayan tek bir dosyada
 * tutulur: hem kayıt yolu hem de veri taşıma içe aktarıcısı aynı işlevi
 * kullanır, böylece iki uygulama birbirinden ayrı düşemez.
 */
export function immutableData(record: PedagogicalRecord): string {
  return JSON.stringify({
    schemaVersion: record.schemaVersion,
    recordId: record.recordId,
    revision: record.revision,
    createdAt: record.createdAt,
    previousRevision: record.previousRevision,
    curriculum: record.curriculum,
    lessonContext: record.lessonContext,
    pedagogicalDecision: record.pedagogicalDecision,
  });
}

export async function fingerprint(record: PedagogicalRecord): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(immutableData(record)),
  );
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}
