# Öğretmen paketinde tam TYMM çerçeve izi — 20 Ekim 2026

## Kapsam
#241 öğretmen sınav paketine ünite düzeyinde alan becerisi, eğilim ve değer izini eklemişti. Bu değişiklik, öğretim programında aynı ünite için tanımlı diğer dört bileşeni de ekler: **sosyal-duygusal öğrenme becerileri**, **okuryazarlık becerileri**, **disiplinler arası ilişkiler** ve **beceriler arası ilişkiler**.

## İlke
- Çerçeve soru başına ölçülmez; ünite düzeyinde kaynak veridir. Paketteki "iddia etmez" uyarısı korunur ve yeni bileşenleri de kapsayacak şekilde genişletilmiştir.
- Yalnız `audience === "teacher"` için üretilir; öğrenci kitapçığı değişmez.
- Yeni alanlar `tymm` tipinde isteğe bağlıdır. Yalnız üç alan veren eski çağrılar yeni satırları yazmaz (geriye dönük uyum).
- Her sorunun bağlandığı süreç bileşeni (`componentStep`) cevap anahtarında aynen verilmeye devam eder.

## Veri akışı
`Unit.competencyFramework` (zaten tam veriyi taşıyor) → `ExamBuilder` `tymmByUnit` → `buildExamPackageArtifact`. Müfredat verisi ve sınav içeriği değişmedi.

## Doğrulama
- `tests/exam-tymm-trace.test.mjs`: iki yeni test (öğretmen paketinde dört yeni satır + öğrenci paketinde görünmeme; eski çağrıda yeni satır yok).
- `tsc --noEmit` temiz, sözleşme testleri 902/902, lint 0 hata.
- Bu kayıt canlı dağıtım kabulü değildir.
