# FOPOS v47 — Güvenli Öğretmen Çalışma Alanı

## Amaç

FOPOS v47, v46.0.0 sürümünü değiştirmeden öğretmenin yıl boyunca kullandığı veriler için kullanıcıya özel, denetlenebilir ve taşınabilir bir çalışma alanı kurar.

## Bağlayıcı ilkeler

- v46 kayıt biçimleri salt okunur uyumluluk katmanı üzerinden korunur; sessiz veri dönüşümü yapılmaz.
- Her kalıcı kayıt bir öğretmen hesabına ve çalışma alanına aittir.
- Öğrenci kimlik verisi ile pedagojik belge verisi ayrı güvenlik sınırlarında tutulur.
- Öğrenci kişisel verisi harici yapay zekâ sağlayıcısına gönderilmez.
- Gerçek öğrenci verisi testlerde ve telemetride kullanılmaz.
- Yetkilendirme yalnız arayüzde değil, her sunucu veri erişiminde uygulanır.
- Onaylanmış belgeler yerinde değiştirilmez; yeni revizyon oluşturulur.
- Dışa aktarma ve silme kullanıcı tarafından başlatılır, kapsamı gösterilir ve denetim kaydı üretir.

## Hedef mimari

### Kimlik ve hesap

İlk ürün rolü `teacher`dır. Kimlik sağlayıcı ayrıntısı uygulama alan modelinden ayrılır. Uygulama yalnız doğrulanmış `user_id`, oturum kimliği ve güven düzeyiyle çalışır. Parola uygulama veritabanında saklanmaz.

### Güvenli oturum

- Yalnız `Secure`, `HttpOnly`, `SameSite=Lax` oturum çerezi
- Oturum kimliğinin kendisi yerine SHA-256 özeti saklama
- Oturum döndürme, mutlak süre sonu ve hareketsizlik süresi
- Oturum kapatmada ve hesap güvenliği olayında sunucu taraflı iptal
- Durum değiştiren isteklerde Origin doğrulaması ve CSRF koruması
- Kimlik doğrulama uçlarında hız sınırı
- Hassas sayfalarda `Cache-Control: no-store`

### Öğretmen profili ve çalışma alanı

Bir kullanıcı bir veya daha fazla çalışma alanına üye olabilir. İlk sürümde kişisel öğretmen çalışma alanı kullanılır. Profil; öğretmen adı, branş, okul, akademik yıl tercihleri ve erişilebilirlik tercihlerini içerir. Sınıf, şube ve belgeler çalışma alanına bağlanır.

### Veri bölgeleri

| Bölge | Örnek | Kural |
| --- | --- | --- |
| Kimlik | kullanıcı, sağlayıcı bağlantısı, oturum | En dar erişim; gizli günlük yok |
| Profil | öğretmen, okul, akademik yıl | Kullanıcıya/çalışma alanına özel |
| Pedagojik kayıt | plan, sınav, zümre, revizyon | Sürümlemeli; onay kaydı değişmez |
| Öğrenci kasası | ad, okul numarası, sınıf listesi | Ayrı tablo ve servis sınırı; AI çıkışı yok |
| Kimliksiz analitik | en az 5 katılımcılı sınıf özeti | Yeniden kimliklendirmeyi önleyen sözleşme |
| Denetim | güvenlik ve veri yaşam döngüsü olayları | Hassas içerik yerine olay üstverisi |

## Saklama stratejisi

Cloudflare D1, ilişkisel hesap, profil, üyelik, belge üstverisi ve denetim kayıtları için hedef depodur. Büyük dosyalar gerekirse R2'de tutulur; D1 yalnız nesne anahtarı ve bütünlük özetini taşır. `.openai/hosting.json` içinde D1/R2 bağları etkinleştirilmeden üretim kalıcılığı açılmaz.

Yerel v46 kayıtları otomatik olarak sunucuya yüklenmez. Geçiş sihirbazı ileride kayıtları tarar, sürümü doğrular, kullanıcıya kapsamı gösterir ve açık onaydan sonra yeni çalışma alanına kopyalar. Kaynak kayıt, geçiş başarılı ve doğrulanmış olsa bile kullanıcı ayrıca silmedikçe korunur.

## Aşamalar

1. **Güvenlik temeli:** alan sözleşmeleri, veri sınıfları, sahiplik kuralları, D1 şeması, tehdit modeli ve test kapıları.
2. **Hesap ve oturum:** kimlik sağlayıcı adaptörü, güvenli çerez, oturum iptali/döndürme, CSRF ve hız sınırı.
3. **Öğretmen profili:** profil, okul, akademik yıl, kişisel çalışma alanı ve ilk kurulum akışı.
4. **Kullanıcıya özel kayıt:** taslak/onaylı/arşiv belge yaşam döngüsü, revizyon ve eşzamanlı güncelleme koruması.
5. **Öğrenci kasası:** sınıf/şube/liste saklama, veri minimizasyonu, ayrı erişim servisi ve anonim özet kapısı.
6. **Taşınabilirlik:** v46 yerel kayıt geçişi, dışa aktarma, yedekleme, seçmeli silme ve hesap kapatma.
7. **Yayın kapısı:** yetki izolasyonu, oturum, migrasyon, erişilebilirlik, yedek geri yükleme ve tarayıcı E2E testleri; ardından kontrollü canlı geçiş.

## İlk sürüm kabul ölçütleri

- Başka kullanıcı veya çalışma alanına ait kayıt kimliği tahmin edilse bile veri okunamaz/değiştirilemez.
- Oturum özeti ele geçirilse dahi ham oturum belirteci elde edilemez.
- Onaylı belge güncellemesi yeni revizyon üretir.
- Öğrenci kasasından AI istemi üretilemez; yalnız sözleşmeye uygun anonim sınıf özeti kullanılabilir.
- Kullanıcı kendi verisini dışa aktarabilir ve seçili kapsamı doğrulamalı biçimde silebilir.
- v46.0.0 etiketi ve kayıtları değişmeden kalır.
