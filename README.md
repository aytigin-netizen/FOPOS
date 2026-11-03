# FOPOS v47 — Güvenli Öğretmen Çalışma Alanı

FOPOS, OPUS pedagojik işletim sistemi çekirdeğinin felsefe öğretimine yönelik
ilk alan uygulamasıdır. Bu depo çalışan prototipi, sunucu veri katmanını,
güvenlik sınırlarını ve etkin MEB 2026 Felsefe Dersi Öğretim Programı bağını birlikte taşır.
`2026.1` tek resmî müfredat sürümüdür. Müfredat seçimi, doğrulama ve yeni
belge üretimi yalnız bu sürüm üzerinden yürütülür.

Dört dersin kullanıcı tarafından sağlanan 2026 PDF kaynakları ve SHA-256
özetleri `sources/curriculum-2026/manifest.json` içinde kayıtlıdır. Felsefe ve
Sosyoloji çalışma zamanı paketleri vardır; Psikoloji ve Mantık kaynaklarının
kayıtlı olması bu derslerin üretim modüllerini etkinleştirmez.

## Güncel mimari gerçekler

### Sunucu veri katmanı

- Kalıcı hesap verileri Cloudflare D1 üzerinde tutulur.
- `db/schema.ts` kullanıcı, öğretmen profili, profil revizyonu, sınıf çalışma
  alanı ve pedagojik kayıt tablolarının Drizzle şemasıdır.
- `drizzle/` dizini üretim D1 göçlerini içerir.
- Uygulama depoları D1'e `getDatabase()` üzerinden parametreli hazırlanmış
  sorgularla erişir. Drizzle şeması göç üretimi ve şema doğruluğu içindir.
- Ders stüdyosu kayıtları `/api/pedagogical-records` üzerinden kullanıcı
  kimliğiyle D1'e yazılır; tarayıcı deposu güncel kayıt sistemi değildir.
- `localStorage` yalnız v46 yerel arşivini açık öğretmen onayıyla D1'e
  kopyalamak için geriye uyumlu içe aktarma kaynağıdır. Kopyalama eski kaydı
  otomatik silmez.
- Öğrenci listeleri açık Kaydet işlemiyle `/api/student-rosters` üzerinden
  öğretmen hesabına ve sınıf çalışma alanına bağlı D1 kaydına yazılır. Yalnız
  kalıcı öğrenci kimliği, numara ve ad-soyad tutulur. Sayfa kapandığında korunur.
  Düzenleme/silme revizyon denetimiyle yapılır; arşivli sınıfa yazılmaz.
- Sınav puanları ve BEP/sağlık verileri kalıcı öğrenci listesine yazılmaz.
  Analiz ve performans oturum kopyaları ayrıca temizlenir. Genel hesap JSON
  dışa aktarımı öğrenci listelerini içermez. Hesap silme kayıtlı listeleri siler.

### Kimlik ve dağıtım sınırı

Üretim dağıtımı Cloudflare Workers üzerinde çalışır ve `https://foposophos.com`
alan adını kullanır. Workers ortamında kimlik, `FOPOS_ACCESS_CODE` ile doğrulanan
giriş ve `FOPOS_SESSION_SECRET` ile imzalanan oturum çerezi üzerinden sağlanır.
OpenAI Sites başlıkları yalnızca geriye dönük uyumluluk sağlayıcısıdır.

- öğretmen girişi FOPOS tarafından sunulan geçiş kodu ekranından yapılır;
- oturum kimliği `AuthenticatedUserIdentity` sözleşmesiyle tüketilir;
- istemciden gönderilen e-posta hiçbir zaman kimlik kanıtı sayılmaz;
- kalıcı öğretmen ve sınıf verileri Cloudflare D1 üzerinde tutulur;
- **Tek birincil ve kullanıcıya verilen adres:** `https://foposophos.com`.
- `workers.dev` adresi teknik yedek/teşhis adresidir; birincil kullanıcı adresi değildir.
- Eski ChatGPT Sites adresi geçiş döneminde geçici yedek erişim olarak korunur.
  Günlük kullanım ve yeni kayıtlar için kullanılmamalıdır; böylece iki ayrı
  canlı ortamda veri farklılaşması önlenir.
- Eski adresin kapatılması veya kaldırılması bu geçiş kararının parçası değildir;
  ayrı bir karar ve veri yedekleme kontrolü gerektirir.
- Adreslerin rolü, saklama süresi ve eski adresin devreden çıkarılma koşulları
  `docs/design/domain-transition-policy.md` belgesinde tanımlıdır.

### Branş genişlemesi

`app/core/curriculum-catalog.ts` OPUS'un ders alanından bağımsız müfredat
kataloğudur. Katalog:

- `subject.code`, `subject.name` ve ders türünü,
- desteklenen sınıf düzeylerini,
- ünite ve öğrenme çıktısı kodlarını,
- veri seti sürümünü

taşır ve doğrular.

Felsefe, `philosophy` ders alanı koduyla bu çekirdeğe bağlı ilk katalogdur.
Sosyoloji, psikoloji veya bağımsız mantık kataloğu yeni bir ders alanı ve veri
seti olarak eklenebilir; çekirdek katalog tipi yeniden yazılmaz. Felsefe
içindeki mantık ve argümantasyon ünitesi ise mevcut felsefe kataloğunda kalır.
Sınıf çalışma alanlarının kalıcı anahtarı da ders alanını içerir; böylece aynı
öğretmen/yıl/sınıf/şube için farklı ders alanları çakışmaz.
Öğrenci listesi kataloğu 9, 10, 11 ve 12. sınıflarda Felsefe, Sosyoloji,
Psikoloji ve Mantık kayıtlarını destekler. Bu idari liste kapsamı içerik
üretiminden bağımsızdır; hazır olmayan ders/sınıf için plan, analiz veya
performans modülü etkinleştirilmez.

## Test yaklaşımı

Test paketi üç katman içerir:

1. Saf davranış testleri: kimlik ayrıştırma, müfredat kataloğu, kayıt yaşam
   döngüsü, puan modeli ve dosya güvenliği gerçek fonksiyonları çalıştırır.
2. Depo davranış testleri: öğretmen ve ders alanı izolasyonunu D1 sözleşmesini
   taklit eden kontrollü veritabanı ile çalıştırır.
3. Kaynak sözleşmesi testleri: güvenlik kapılarının UI/API bağlantılarında
   bulunmasını regresyon sinyali olarak denetler.

Kaynak-regex testleri tek başına güvenlik kanıtı değildir; davranış testlerini
tamamlayan mimari kablo kontrolüdür.

## Temel güvenlik kuralları

- Müfredat tek doğruluk kaynağından gelir; bulunmayan çıktı başka kayıtla
  değiştirilmez.
- Öğretmen nihai pedagojik karar ve onay sahibidir.
- Öğrenci kişisel verisi harici yapay zekâya gönderilmez.
- Gerçek öğrenci verisi geliştirme ve otomatik test fixture'ı yapılmaz.
- Hesap yazımları doğrulanmış oturum ve aynı-origin kontrolü ister.
- Revizyonlar sessizce değiştirilmez; onay ve izlenebilirlik korunur.

## Geliştirme

- Node.js `>=22.13.0`
- `npm run test:contracts`
- `npm run lint`
- `npm run build`
- Şema değişikliğinden sonra `npm run db:generate`

Canlı uygulama: <https://foposophos.com>
