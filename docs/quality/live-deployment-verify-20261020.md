# Canlı dağıtım doğrulama aracı — 20 Ekim 2026

## Amaç
`live-deployment-gap-20261020.md` ölçümü elle yapılmıştı. `scripts/verify-live-deployment.mjs` aynı yöntemi (içerik işareti, chunk hash'i değil) tekrarlanabilir kılar: canlı SPA'nın JS parçalarını import zinciri boyunca indirir ve PR'lara bağlı metin işaretlerini arar.

## Kullanım
`node scripts/verify-live-deployment.mjs https://fopos-ders-studyosu.aytigin.chatgpt.site` — tüm işaretler varsa çıkış 0, eksik varsa 1.

## İşaretler
#234 (`Önceki sorularla sınav oluştur`), #235/#238 (`Sadelik`, `Taş, su ve hava madde midir?`, onay kaydı `Aytekin YILMAZ` + `2026-10-17`), #241 (`TYMM ÇERÇEVE İZİ`), #242 (`Sınav aktarımındaki süreç bileşeni boş olamaz.`), #246 (`Beceriler arası ilişkiler`, `Okuryazarlık becerileri`). Her yeni PR için bir işaret eklenmelidir.

## Sınırlar
- Betik bu ortamda canlı siteye karşı **çalıştırılamadı** (dış ağ kapalı); yalnız yerel sahte sunucuyla sınandı (tam senaryo → 0, eksik işaret → 1). Canlı sonuç ayrıca kaydedilmelidir.
- Metin varlığı davranışı kanıtlamaz: #238'in kapasite etkisi (2→8) ve #236 kapısı yalnız onay literalinin varlığıyla dolaylı doğrulanır; canlı kabulde 10.3.1 için gerçek bir sınav üretimi de yapılmalıdır.
- Sonuç `docs/quality/live-deployment-<tarih>.md` olarak kaydedilir; #238, #241, #242 ve #246 canlı kabulü henüz yazılmamıştır.
