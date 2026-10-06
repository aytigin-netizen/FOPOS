# FOPOS — Devir Kaydı

Tarih: 6 Ekim 2026
Hazırlayan: Codex

## Son tamamlanan işlem

Aytekin'in onayıyla f5dbc1e uygulama kaynağı canlıya aktarıldı. Sürüm 155, Sites kaynak commit'i 30a288403627c239358eab1de93b14bf988f0b17. Kaynak ağacı GitHub f5dbc1e ile birebir aynı: 9fdce01e9c18bf72981c74fc3a03f7baa9c6b83b.

751/751 sözleşme testi, tür kontrolü, lint (0 hata/2 mevcut uyarı), üretim derlemesi ve Worker doğrulaması başarılı. Gerçek motor ve Word üreticisiyle A/B öğrenci–öğretmen toplam dört DOCX kontrol edildi: 8/8 soru ve metin eşleşmesi; A/B düzey/bileşen paritesi; her kitapçık 100 puan; öğretmen anahtar/ölçütleri korunuyor, öğrenciye cevap sızmıyor. Tarayıcıdan canlı dosya indirme kontrolü yapılmadı.

## Sıradaki geliştirme

#179 sonrasındaki kalan genel şablon görev yuvalarını önce kesin olarak sayıp bileşen/düzey envanteri çıkar. #179 yaklaşık 47 yuva bildiriyor; bu turda yeniden sayılmadı. Ardından soru kökü–bilişsel işlem–anahtar–puanlama ve A/B paritesini birlikte düzelt; kapanan #176–#179 kapsamını gerekçesiz tekrar açma.

Sınav Analiz Formu'nun boş tablo bulgusu, eski önermeler listesi bulgusu ve #178'de bildirilen geniş test taramasındaki dört main başarısızlığı ayrı izlenir; bu yayının başarısı bunların giderildiğini göstermez.

## Kurallar

- Güncel ayrıntılar durum.md; müfredat yetkisi AGENTS.md ve sources/curriculum-2026/manifest.json.
- Başka bir yapay zekânın açık dalını değiştirme; yeni çalışma main'den ayrı dalda yürür.
- Kullanıcının onayı bu yayın, kısa çıktı kabulü ve kayıt güncellemesini kapsar; kalan içerik geliştirmesine başlamadan kapsamı bildir.
- Yeni üretim yalnız 2026 müfredatını kullanır. Resmî içerik değişecekse ilgili PDF okunur.
- Kaynak depo ile Sites deposu commit kimlikleri farklı olabilir; eşdeğerlik dosya ağacıyla kanıtlanır.

Canlı: https://fopos-ders-studyosu.aytigin.chatgpt.site


## 6 Ekim 2026 kesin şablon envanteri

Yaklaşık 47 tahmini yerine kesin sayı: 100 görev yuvasının 52'si genel soru kökünü kullanıyor, 48'i bileşene özgü köke sahip. 52 kökün 46'sı bileşen ifadesi, 6'sı hazır değerlendirme yargısı taşıyor. Dağılım: Anlama 16, Uygulama 12, Çözümleme 0, Değerlendirme 12, Oluşturma 12. Toplam 26 potansiyel A/B düzey çifti. Bütün 100 yuvanın gerçek üretici erişimi, kök/düzey/bileşen eşleşmesi ve ölçüt puan toplamı doğrulandı; ilgili 23/23 mevcut test başarılı, envanter betiği lint/sözdizimi kontrolünden geçti.

Ayrıntılar: docs/quality/early-exam-template-inventory-20261006.md ve JSON. Tekrar üretim: node --experimental-strip-types scripts/inventory-early-exam-templates.mjs. Kaynak commit 50e567d; uygulama dosyası f5dbc1e ile aynı. Bu tur soru içeriği değiştirilmedi ve canlı yayın yapılmadı. Sıradaki geliştirme, 26 çiftin soru–anahtar–ölçüt bakımından birlikte incelenmesidir; genel şablon olması tek başına yanlışlık kanıtı değildir.
