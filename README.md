# FOPOS v47 — Güvenli Öğretmen Çalışma Alanı

FOPOS, OPUS pedagojik işletim sistemi çekirdeğinin felsefe öğretimine yönelik
ilk alan uygulamasıdır. Bu depo çalışan prototipi, sunucu veri katmanını,
güvenlik sınırlarını ve TYMM 2024 müfredat bağını birlikte taşır.

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
- Öğrenci adları, numaraları, puanları ve BEP/sağlık verileri D1'e yazılmaz;
  yalnız hassas oturum belleğinde tutulur.

### Kimlik ve dağıtım sınırı

Mevcut üretim dağıtımı **Sign in with ChatGPT** kimliğini kullanır. Kimlik,
Sites tarafından doğrulanıp sunucuya iletilen başlıklardan okunur. Uygulama
parola saklamaz ve kendi OAuth çerezini üretmez.

Bu bilinçli v47 kararı şu anlama gelir:

- mevcut Sites dağıtımında öğretmenlerin ChatGPT hesabıyla giriş yapması gerekir;
- uygulama çekirdeği kimliği `AuthenticatedUserIdentity` sözleşmesiyle tüketir;
- bağımsız alan adı ve bağımsız hesap sistemi gelecekte eklenirse yeni bir
  doğrulanmış kimlik sağlayıcı adaptörü gerekir;
- istemciden gönderilen e-posta hiçbir zaman kimlik kanıtı sayılmaz.

Bağımsız kimlik sağlayıcısı eklenmeden bu depo “platformdan bağımsız hesap
sistemi” olarak sunulmamalıdır.

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

Canlı uygulama: <https://fopos-ders-studyosu.aytigin.chatgpt.site>
