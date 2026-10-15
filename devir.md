# FOPOS — Güncel Devir Kaydı

Tarih: 15 Ekim 2026 (akşam)

## Güncel durum özeti (15 Ekim 2026)

Ana dal `ca7c4fb` (#228), açık PR yok. FEL.11.1–11.3 havuzları bileşen başına 40 görev; öğretmen çalışma alanına Bugün paneli, kalıcı öğrenci listeleri (9–12. sınıf, dört ders) ve kalıcı haftalık ders çizelgesi eklendi. #221–#228 için görsel tarayıcı kabulü ve canlı dağıtım doğrulaması bekliyor; ayrıntı ve açık riskler `durum.md` başındaki 15 Ekim (akşam) bölümünde.

## Kalıcı tekrar düzeltmesi — tamamlandı

Kullanıcı yeni 8 soruluk sınavda önceki A/B'den üç soru tekrarını doğruladı. #202 / canlı sürüm 167 kabulü yalnız ilk A/B ayrımını gösteriyordu. #204 (d82ebe4), öğretmen hesabına bağlı atomik çıktı geçmişini, önceki A/B'nin birlikte tüketimini ve 11.4 için dört yeni özgün anlatı ile bunlara bağlı 100 yeni görev/anahtar çiftini getirdi. Eski Eşik/kulüp görevleri 11.4 seçim havuzundan çıkarıldı; geçmiş sıfırlama düğmesi kaldırıldı. CI başarılı; Sites sürüm 168 canlı. 8 soruluk yeni A/B'nin dört gerçek DOCX'i indirildi ve 15 sayfası görsel incelendi. Toplam 16 yeni soruda eski 5 soruluk A/B ve bildirilen 8 soruluk kitapçıkla tam eşleşme sıfır. İkinci tarayıcı sekmesinde aynı hesabın tükenmiş kapsamı gördüğü doğrulandı. Kayıt: `docs/quality/exam-account-history-live-acceptance-20261013.md`.

## Önceki tarihsel kabul

#202/#203 ve sürüm 167 kanıtı: docs/quality/exam-history-live-acceptance-20261013.md. Eski 6 Ekim kaydı: docs/quality/exam-closure-20261006.md. Müfredat yetkisi: AGENTS.md ve sources/curriculum-2026/manifest.json.
