# Analiz raporunda süreç bileşeni — 19 Ekim 2026

## Sorun

Sınav aktarımı soruları yalnız öğrenme çıktısı kodu ve puan taşıyordu. Analiz raporundaki "Soru analizi", "Eksik öğrenme çıktıları" ve "Öğrenme durumu" tablolarında satır, çıktının genel açıklamasıyla gösteriliyordu. Aynı çıktıya bağlı birden çok süreç bileşeni (a, b, c) olduğunda, analiz raporu hangi bileşenin başarısız olduğunu göstermiyordu.

## Değişiklik

### 1. Aktarım sözleşmesi

`ExamBlueprintTransfer.questions[]` öğelerine isteğe bağlı `componentStep?: string` alanı eklendi. Bu, sorunun bağlandığı süreç bileşenidir (a, b, c, ç…).

İki yeni doğrulama eklendi:

- `createExamBlueprintTransfer` — `componentStep` tanımlıysa boş olamaz: *"Sınav aktarımındaki süreç bileşeni boş olamaz."*
- `ExamAnalysisModule` — gelen sınavdaki `componentStep`, doğrulanmış müfredattaki çıktının süreç bileşenleri arasında eşleşmeli: *"Gelen sınavda müfredatta bulunmayan süreç bileşeni var."*

### 2. Rapor gösterimi

`outcomeText(code, step?)` artık süreç bileşenini de arar ve çıktı satırına ekler:

```
FEL.11.6.1. Hukuk ve Felsefe — Süreç bileşeni a) Hakkın tanınması
```

Bu biçim "Soru analizi", "Eksik öğrenme çıktıları" ve "Öğrenme durumu" tablolarının üçünde de kullanılır. Böylece öğretmen, eksik çıktının hangi bileşenden kaynaklandığını raporda doğrudan görür.

### 3. Geriye uyumluluk

`componentStep` isteğe bağlıdır. Alanı olmayan eski aktarımlar kabul edilir ve satır, süreç bileşeni bilgisi olmadan (eski biçimde) yazılır. Öğrenme çıktısı eşleşmesi, puan pozitifliği ve toplam puan kuralları değişmemiştir.

## Doğrulama

- `tests/exam-analysis-process-component.test.mjs` yeni sözleşme testidir ve `test:contracts` satırına eklenmiştir.
- 1034/1034 tam test paketi, 900/900 sözleşme testi, `tsc --noEmit` temiz, lint 0 hata.
- Öğrenci/program verisi, üretim geçmişi ve sınav içeriği değişmemiştir.

## Canlı kabul durumu

Bu kayıt **canlı dağıtım kabulü değildir**. 20 Ekim 2026 denetiminde canlı sürümün `#234` (16 Ekim 07:27) olduğu doğrulandı; `#242` canlıda bulunmuyor. Dağıtım sonrası analiz DOCX'inde süreç bileşeni satırlarının görsel incelenmesi gerekir.
