# FEL.11.3.1 vaka tabanlı görev havuzu

15 Ekim 2026. Başlangıç: `7347095` (#217). Ayrı dal: `codex/grade11-unit3-case-pool-20261015-e48afd8`.

## Kaynak ve kapsam

`AGENTS.md` okundu. Tek resmî kaynak `sources/curriculum-2026/philosophy-2026.pdf`; PDF doğrudan `pdftotext -layout` ile okundu. Basılı s. 59: FEL.11.3.1(a) soruları açıklar; (b) hayatla ilişkilendirerek değerlendirir. Bilme–anlama–güvenme, inancın temellendirilmesinde aklın rolü ve problemin insan hayatı açısından önemi bu paketin çerçevesidir. Yeni sorular pedagojik zenginleştirmedir; program alıntısı veya resmî soru değildir.

İki bileşene 30'ar yeni soru–anahtar–ölçüt üçlüsü eklendi. Her bileşen 40 görev, beş düzeyin her biri 8 görev içerir; toplam 80 görev, bunların 60'ı yenidir. Derya–Eren–Funda metni ve ilk 10 görev değiştirilmedi. Her düzeyin ilk iki görevi de korunur; mevcut geçmişin görev sırası değiştirilmez. İnceleme ve üretim kayıtları aynı genişletilmiş havuzu kullanır. FEL.11.3.2'nin üç bileşeni ve kaynaklı tarihsel okuması değişmez.

## İçerik incelemesi

Yeni görevlerin soru, örnek cevap ve üç ölçütü birlikte okundu. Her görev için ayrı ölçüt açıklaması vardır; görüş seçimi yerine istenen açıklama, örnek, ayrım veya gerekçe değerlendirilir. Açık uçlu üretimde alternatif tutarlı cevaplara izin verilir.

- Gerekçe kesin ispata eşitlenmez; gerekçe sunamamak yanlışlığın kanıtı sayılmaz.
- İnancın edinilme nedeni ile doğruluğunun dayanağı ayrılır.
- Bilgiyi doğru kabul etmek, kişiye güvenmek, dilemek ve davranışa geçmek özdeşleştirilmez.
- Akılla karara bağlayamamak ile çelişki içermek ayrılır; aklın sınırı iddiası çelişkiyi doğru kılmaz.
- Umut ve bağlılığın davranışa katkısı, inancın doğru olması veya sonucu garanti etmesi olarak sunulmaz.
- Funda'nın birlikte anma tutumu zorunlu olarak üstün sayılmaz; bağlanmanın açıklama yükü korunur.

Bu inceleme yeni bir öğretmen içerik onayı değildir. Önceki onay kayıtları değiştirilmedi. Bu paket ana dala birleştirilmedi ve canlıya dağıtılmadı. #215/#217 için belirtilen felsefi inceleme eksikleri bu paketin kapsamında kapatılmış sayılmaz.

## Doğrulama

Hedefli testler: 11/11. Bileşen/düzey sayısı, kök ve anahtar tekilliği, ölçütlerin puan toplamı, eski görevlerin ve tarihsel okumanın korunması doğrulanır. Standart ve BEP modlarında her düzeyde sekiz ayrı görev/dört A/B çifti üretilir; dokuzuncu eş görev istendiğinde kapasite hatası açıkça verilir. Bu yerel üretim kontrolüdür; canlı DOCX kabulü değildir.

Geniş doğrulama: sözleşmeler 832/832, derleme sonrası tüm testler 944/944 başarılı. `npm run typecheck` ve `npm run build` başarılı; ESM Worker ve hosting manifesti doğrulandı. Geniş sözleşmedeki eski 11.3.1 iki görevlik kapasite varsayımı kaldırıldı; kısa havuz sınaması 11.3.2 için korunur, 11.3.1'in sekiz görevlik sınırı ayrı testle doğrulanır.

Lint: 0 hata; değiştirilmeyen iki Sosyoloji testinde mevcut iki kullanılmayan değişken uyarısı. Son içerik düzenlemesi sonrası hedefli 11 test yeniden başarılı.
