# Canlı dağıtım açığı — 20 Ekim 2026 ölçümü

## Ölçüm

**Tarih:** 20 Ekim 2026
**Canlı:** https://fopos-ders-studyosu.aytigin.chatgpt.site
**main HEAD (ölçüm anı):** `dc6dde7` (#241, 19 Eki 16:09 UTC)
**Sonuç:** Canlı sürüm **`#234` (`23885e1`, 16 Eki 07:27)** — main'in **6 PR** gerisinde.

## Yöntem

Canlı, istemci tarafında yüklenen bir SPA'dır; HTML'de ders içeriği bulunmaz. Bu yüzden sürüm tespiti iki aşamalı yapıldı.

**1. Doğru yöntem: içerik karşılaştırması.** Canlı `ExamBuilder` chunk'ı indirilir (`/assets/ExamBuilder-<hash>.js`), metin literal'leri çıkarılır ve aday sürümlerin yerel derlemeleriyle karşılaştırılır. Hash'ler normalize edilir.

**2. Kullanılmayan yöntem: chunk hash'i.** Aynı commit (`dc6dde7`) iki kez derlendiğinde farklı chunk hash'leri üretildi (`ExamBuilder-BD2t23og.js` ↔ `ExamBuilder-CptuZx9C.js`). Chunk adları birbirine gömülü olduğu için hash zinciri kırılgan. **Chunk hash'i tek başına sürüm kimliği olarak kullanılamaz.** (Daha önce bu yöntemle yapılan "canlı ≈ #188" çıkarımı bu nedenle düzeltildi.)

## Kanıt matrisi

| İşaret | Kaynak | Canlı | #234 | main (#241) |
| --- | --- | :--: | :--: | :--: |
| `Önceki sorularla sınav oluştur` | #234 | 2 | 2 | 2 |
| `Pınar` / `Vildan` (11.5 vaka) | #212 | 1 / 1 | 1 / 1 | 1 / 1 |
| `Sadelik` (10.3.1 havuzu) | #235 | 0 | 0 | 1 |
| `Taş, su ve hava madde midir?` | #235 | 0 | 0 | 1 |
| `Değişirken aynı kalan nedir?` | #235 | 0 | 0 | 1 |
| `TYMM ÇERÇEVE İZİ` | #241 | 0 | 0 | 1 |
| `Sınav aktarımındaki süreç bileşeni boş olamaz.` | #242 | 0 | — | 1 |

Metin-literal benzerliği (Jaccard): **#234 → %98,15** · #233 → %96,68 · main → %93,46 · #232 → %92,21.

## Canlıda eksik olan birleşmeler

| PR | İçerik | Canlı etkisi |
| --- | --- | --- |
| #235 | FEL.10.3.1 havuzu bileşen başına 40 göreve | Kapasite 8'de kalıyor |
| #236 | Onay bekleyen havuzları üretim dışı bırakan kapı | Taslak havuz onaysız üretime girebiliyor |
| #237 | FEL.10.3.1 havuzunun felsefi doğruluk düzeltmeleri | Düzeltilmemiş görevler canlıda |
| #238 | Aytekin YILMAZ'ın 17 Ekim FEL.10.3.1 havuz onayı | **Öğretmen onayı kayıtta, canlıda etkisiz** |
| #241 | Öğretmen paketinde TYMM çerçeve izi | Öğretmen paketi canlıda eksik |
| #242 | Analiz raporunda süreç bileşeni | Analiz raporu canlıda eski halinde |

`#239` (Psikoloji paketi) ve `#240` (geri alma) canlıya hiç çıkmadı; net etkisi yoktur.

## Dağıtım izi

GitHub API'de bu depo için **0 deployment** kaydı ve **0 environment** vardır. Dağıtım Cloudflare tarafında yapılıyor, depo tarafında iz bırakılmıyor. Bu yüzden yukarıdaki ölçüm elle, chunk indirilerek yapılmıştır.

## Öneri

Her dağıtımdan sonra aynı ölçüm tekrar edilmeli ve `docs/quality/live-deployment-<tarih>.md` deseniyle kayda geçirilmelidir. Mevcut kabul kayıtları (`exam-account-history-live-acceptance-20261013.md`, `grade10-unit3-1-pool-approval-20261017.md`) bu deseni zaten kullanıyor; #238, #241 ve #242 için canlı kabul kaydı henüz yazılmamıştır.
