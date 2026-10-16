# 10. sınıf görev havuzu onay kapısı (#236)

## Neden

#235, FEL.10.3.1 için 120 taslak görev ekledi ve bunları doğrudan üretim motoruna bağladı. Havuz dosyasının kendisi 9. satırda bunu açıkça bildiriyor:

> `// TASLAK: felsefi doğruluk incelemesi Aytekin'de. Bu dosya içerik onayı, birleştirme ya da canlı dağıtım kaydı değildir.`

ve #235'in kalite kaydı da aynı cümleyi tekrarlıyor. Buna rağmen içerik onayı alınmadan üretime bağlandı.

## Var olan kapı neden yakalamadı

`awaitsContentApproval` yalnızca `pendingPhilosophyOutcomes` listesine bakar ve bu liste `[]`. Onay kayıtları (`grade11ContentApproval`, `grade11FinalUnitsContentApproval`) yalnızca 11. sınıf çıktılarını kapsar; **10. sınıf havuzlarının onay mekanizması hiç yoktu**. Bu nedenle FEL.10.3.1 için `awaitsContentApproval` `false` döndü ve motor etkin kaldı.

Ölçülen etki (bu dalda, kapı öncesi):

| Ölçüm | Değer |
| --- | --- |
| `variantPoolFor(['FEL.10.3.1'])` | 8 (#235 öncesi 2) |
| Ordinal 0–119, 5 düzey, üretimde taslak görev | 24 / 32 = **%75** |
| Sınav oluşturucunun erişebildiği ordinal sınırı | 40 (`bileşen(4) × banka(10)`) |
| Onay kaydı | **yok** |

`allocateWithinComponentBands` kapasiteyi `bileşen × floor(pool/2)` ile hesapladığı için 8'lik havuz, üretilen sınavlarda 3. ve 4. varyantların kullanılmasına yol açıyor; yani bir 10.3.1 sınavının dörtte üçü onaysız içerik olabiliyordu.

## Değişiklik

Kapı çıktı düzeyinden **havuz düzeyine** taşındı. Çıktının kendisi onaylı olduğu için (onaylı 10 şablon görev) motor etkin kalır; onaylanmamış havuz ise hiçbir ordinal ile üretilemez.

- `philosophy-early-units-2026.ts`: `grade10PoolContentApproval` onay kaydı eklendi. Şu an boştur — hiçbir 10. sınıf havuzu onaylı değildir. Kayıt, öğretmen havuzu inceleyip onayladığında doldurulur.
- `philosophy-exam-content-2026.ts`:
  - `philosophyPoolApproved(outcomeCode)` kapı fonksiyonu.
  - `orderedBank` onaysız havuzu bankaya hiç almaz.
  - `philosophyCaseCapacity` yalnız onaylı görevleri sayar → FEL.10.3.1 kapasitesi 8'den 2'ye döner (#235 öncesi değer).
  - `parallelOrdinal` (B kitapçığı) de aynı kapıdan geçer.
  - **İnceleme üreticisi kasten açık bırakıldı**: `generatePhilosophyExamReviewContent` onay bekleyen havuzu göstermeye devam eder. Kapı üretimi kapatır, incelemeyi değil — onaylayacak görevleri göremezse onay da verilemez.

## Testler

- Yeni: `tests/philosophy-grade10-pool-approval-gate.test.mjs` — onaysız havuzun motora girmemesi, ordinal 0–39 boyunca hiçbir düzeyde taslak görev üretilmemesi, ordinal 40'ın kapasite hatası vermesi, onaylı şablon görevlerin bozulmaması, inceleme üreticisinin havuzu göstermesi.
- `tests/philosophy-grade10-unit3-pool.test.mjs` #235'te üretim motorunu kullanıyordu ve onaysız içeriğin üretimde olduğunu varsayıyordu. İçerik kalitesi denetimleri (benzersizlik, yasak içerik, düzey eşleşmesi) **inceleme üreticisine** taşındı; kapasite testi "üretimde 2" olacak şekilde düzeltildi. 40 benzersiz görev hâlâ inceleme aracında doğrulanır.

## Doğrulama

Sözleşme paketi, `tsc --noEmit` (değişen dosyalarda temiz), değişen dosyalarda eslint. Sonuçlar `#236` birleştirme kaydında.

## Canlı durum (bu dal yazılırken ölçüldü)

`fopos-ders-studyosu.aytigin.chatgpt.site` → `assets/ExamBuilder-D82kLtw_.js` içinde FEL.10.3.1'in **onaylı** vaka metni bulundu, **taslak havuz metni bulunmadı**. Yani canlı, main'in gerisindedir ve öğrenciler şu anda onaysız içerik görmemektedir. Bu kapı olmadan yapılacak bir dağıtım 120 onaysız görevi öğrencilere açardı.

Bu kayıt öğretmen içerik onayı, birleştirme ya da canlı dağıtım kaydı değildir.
