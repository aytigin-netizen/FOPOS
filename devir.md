# FOPOS — Güncel Devir Kaydı

## 20 Ekim 2026 — depo denetimi sonucu

Denetim tamamlandı; ayrıntılı rapor ve kanıt matrisi `docs/quality/live-deployment-gap-20261020.md` ile `docs/quality/` altındaki kalite kayıtlarında. Özet: içerik kapsamı tamamlanmış (22/22 çıktı, onay bekleyen 0, 1034/1034 test, tip kontrolü temiz). Üç sistemik boşluk açık: CI tip kontrolü çalıştırmıyordu (düzeltme #243'te), canlı sürüm #234'tür (main'in 6 PR gerisinde; 17 Ekim FEL.10.3.1 onayı canlıda etkisiz), ve FEL.10.4.1–FEL.10.9.1 çıktılarında A/B kapasitesi düzey başına 2'dir. Sıradaki en yüksek etkili iş: 10.4–10.9 vaka havuzlarının bileşen başına 30 ek görevle yazılması.

## 19 Ekim 2026 — TYMM çerçeve izi ve analiz süreç bileşeni

#241 öğretmen paketine ünite düzeyinde TYMM çerçeve izi ekler; öğrenci paketi değişmez, çerçeve soru başına ölçülmez ve pakette bu açıkça yazılır. #242 sınav aktarımına süreç bileşenini ekler, analiz raporunda satırı çıktı + bileşen olarak gösterir; eski aktarımlar kabul edilir. Kayıtlar: `docs/quality/exam-tymm-trace-20261019.md`, `docs/design/exam-analysis-process-component-20261019.md`. Canlı kabulü yapılmadı.

## 17 Ekim 2026 — FEL.10.3.1 havuzu, onay kapısı ve öğretmen onayı

#235 FEL.10.3.1 havuzunu bileşen başına 40 göreve genişletir; #236 onay bekleyen havuzları üretim dışı bırakan kapıyı ekler; #237 felsefi doğruluk düzeltmelerini yapar; #238 Aytekin YILMAZ'ın 17 Ekim tarihli onayını kayda taşır. Kapasite 2'den 8'e çıkar. Kayıtlar `docs/quality/grade10-unit3-1-pool-*.md` ve `docs/quality/grade10-pool-approval-gate-20261016.md` altında.

## 16 Ekim 2026 — havuz tükenince açık yeniden kullanım

Aytekin, Hukuk ve Felsefe sınavında soru havuzu bitince de üretim yapabilmeyi istedi. Kullanılmamış bant yoksa “Önceki sorularla sınav oluştur” eylemi açılır. Eski tekrarsız geçmiş silinmez; yeniden kullanım ayrı atomik sayaçla kaydedilir. A/B iç farklılığı, puanlar, onay ve kapsam doğrulaması korunur. Öğrenci/program tabloları değişmez. Ayrıntı: `docs/quality/exam-exhausted-reuse-20261016.md`.

## 16 Ekim 2026 — FEL.10.2.1 öğretmen içerik onayı

#231, #232 sonrası main üzerine ayrı dalda incelendi. Karşılıklı etki yönleri, söze dökmeme/dilsel bağımsızlık, belirli ifade/tüm dil ayrımı, renk görevi ve 60 yeni sorunun göreve özgü ölçütleri düzeltildi. Aytekin YILMAZ, #233 düzeltmelerini 16 Ekim 2026 saat 10.10 (Türkiye) tarihinde açıkça onayladı. Birleştirme ve canlı dağıtım aşamasına geçilir; sonuç PR kapanışında ayrıca doğrulanacaktır. Ayrıntı ve öğretmen örnekleri: `docs/quality/grade10-unit2-1-pool-20261016.md`. Öğrenci/program verisi ve üretim geçmişi korunur.

## 16 Ekim 2026 — Sosyoloji, Psikoloji ve Mantık yıllık planları

Yıllık plan ekranında dört ders seçilebilir. Psikoloji (4 ünite, 13 çıktı, 38 süreç bileşeni) ve Mantık (4 ünite, 17 çıktı, 53 süreç bileşeni) 2026 PDF'lerinden yıllık plana özgü kapsam kazanır. Her biri 68+4 saattir; kariyer rehberliği odağı korunur. Sosyoloji okul türü kısıtları doğrulandı. Bugün paneli ortak yıllık plan kaynağından konu okur; ders kartı sınıf/okul türünü yıllık plana taşır. Program ve öğrenci kayıtları değiştirilmez. Psikoloji/Mantık günlük plan ve sınav üretimi henüz etkin değildir. Haftalık dağılım öğretmen kontrolüne açık taslaktır. Kaynak, izin ve doğrulama ayrıntıları: `docs/design/annual-plans-four-subjects-20261016.md`.

Aşağıdaki kayıtlar kendi tarihlerindeki durumu yansıtır.

Tarih: 13 Ekim 2026

## Kalıcı tekrar düzeltmesi — tamamlandı

Kullanıcı yeni 8 soruluk sınavda önceki A/B'den üç soru tekrarını doğruladı. #202 / canlı sürüm 167 kabulü yalnız ilk A/B ayrımını gösteriyordu. #204 (d82ebe4), öğretmen hesabına bağlı atomik çıktı geçmişini, önceki A/B'nin birlikte tüketimini ve 11.4 için dört yeni özgün anlatı ile bunlara bağlı 100 yeni görev/anahtar çiftini getirdi. Eski Eşik/kulüp görevleri 11.4 seçim havuzundan çıkarıldı; geçmiş sıfırlama düğmesi kaldırıldı. CI başarılı; Sites sürüm 168 canlı. 8 soruluk yeni A/B'nin dört gerçek DOCX'i indirildi ve 15 sayfası görsel incelendi. Toplam 16 yeni soruda eski 5 soruluk A/B ve bildirilen 8 soruluk kitapçıkla tam eşleşme sıfır. İkinci tarayıcı sekmesinde aynı hesabın tükenmiş kapsamı gördüğü doğrulandı. Kayıt: `docs/quality/exam-account-history-live-acceptance-20261013.md`.

## Önceki tarihsel kabul

#202/#203 ve sürüm 167 kanıtı: docs/quality/exam-history-live-acceptance-20261013.md. Eski 6 Ekim kaydı: docs/quality/exam-closure-20261006.md. Müfredat yetkisi: AGENTS.md ve sources/curriculum-2026/manifest.json.
