# Öğretmen paketinde TYMM çerçeve izi — 19 Ekim 2026

## Kapsam

Öğretmen sınav paketine (öğrenci paketi değil) ünite düzeyinde TYMM çerçeve izi eklenir. İz, öğretim programında ilgili ünite için tanımlı üç alanı taşır: **alan becerileri**, **eğilimler**, **değerler**.

Çerçeve soru başına ölçülmez. Pakette açıkça şu uyarı yer alır: *"Aşağıdaki alan becerisi, eğilim ve değerler öğretim programında ilgili ünite için tanımlıdır; sorular tek tek bunları ölçtüğünü iddia etmez. Her sorunun bağlandığı süreç bileşeni cevap anahtarında ayrıca verilir."*

Öğrenci paketi değişmez; TYMM bölümü yalnız `audience === "teacher"` koşulunda üretilir.

## Veri akışı

1. `Unit` tipine `competencyFramework?: { fieldSkills?: string[]; tendencies?: string[]; values?: string[] }` alanı eklendi.
2. `ExamBuilder`, seçili üniteler için `tymmByUnit` haritasını kurar (eksik alanlar boş diziye indirgenir).
3. `buildExamPackageArtifact` için `tymmByUnit` girdisi eklendi.
4. Her sorunun kendi `tymm` alanı varsa o önceliklidir; yoksa ünite kodundan haritadan çözülür. Bu sıralama, soru düzeyinde çerçeve verildiğinde ünite düzeyinin onu ezmesini engeller.
5. Belgede çerçeve gösterimi, çerçevesi olan her ünite için bir kez yazılır (aynı üniteden gelen sorular için tekrarlanmaz).

`tymm` alanı `ExportExamPackageQuestion` tarafında isteğe bağlıdır; alanı olmayan eski aktarımlar ve sınav geçmişi kayıtları etkilenmez.

## Doğrulama

- `tests/exam-tymm-trace.test.mjs` yeni sözleşme testidir ve `test:contracts` satırına eklenmiştir.
- 1034/1034 tam test paketi, 900/900 sözleşme testi, `tsc --noEmit` temiz, lint 0 hata.
- Öğrenci/program verisi, üretim geçmişi, sınav içeriği, puanlama ve onay kayıtları değişmemiştir.

## Canlı kabul durumu

Bu kayıt **canlı dağıtım kabulü değildir**. 20 Ekim 2026 denetiminde canlı sürümün `#234` (16 Ekim 07:27) olduğu doğrulandı; `#241` canlıda bulunmuyor. Dağıtım sonrası canlıdan indirilen öğretmen DOCX'inde "TYMM ÇERÇEVE İZİ" başlığının ve çerçeve satırlarının görsel incelenmesi gerekir.
