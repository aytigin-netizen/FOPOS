# FOPOS alan adı ve geçiş dönemi politikası

**Durum:** Onaylandı — 3 Kasım 2026  
**Kapsam:** Üretim adresi, teknik yedek adresi ve eski ChatGPT Sites erişimi.

## 1. Birincil adres

FOPOS'un tek resmî ve kullanıcıya gösterilecek canlı adresi:

**https://foposophos.com**

README, kullanıcı yönlendirmeleri, yeni teknik belgeler, destek metinleri ve canlı doğrulama komutları bu adresi kullanmalıdır. Başka bir adres birincil veya eşdeğer kullanıcı adresi olarak sunulmamalıdır.

## 2. Teknik yedek

`https://fopos-ders-studyosu.aytigin.workers.dev` Cloudflare Workers teknik yedek/teşhis adresidir. Normal kullanıcı yönlendirmelerinde kullanılmaz.

## 3. Eski ChatGPT Sites adresi

`https://fopos-ders-studyosu.aytigin.chatgpt.site` geçiş döneminde **geçici yedek erişim** olarak korunacaktır.

- Eski adres hemen silinmeyecek veya devre dışı bırakılmayacaktır.
- Günlük çalışma ve yeni kayıt oluşturma için kullanılmamalıdır.
- Yeni kayıtların yalnızca birincil adreste oluşturulması, iki ortam arasında veri ayrışmasını önler.
- Eski adres, gerektiğinde eski ortamdaki verileri veya davranışı karşılaştırmak için erişilebilir tutulur.
- Eski adresin kapatılması, silinmesi veya kalıcı olarak bırakılması bu belgenin otomatik sonucu değildir; ayrı kullanıcı onayı gerektirir.

## 4. Kapatma öncesi koşullar

Eski adres ancak aşağıdaki koşullar birlikte karşılandıktan ve ayrı karar verildikten sonra devreden çıkarılabilir:

1. Yeni alan adında öğretmen girişi, mevcut veriler ve yeni kayıtların kalıcılığı doğrulanmış olmalıdır.
2. Eski ortamda yalnızca yedek olarak tutulması gereken başka veri veya iş akışı kalmadığı kontrol edilmelidir.
3. Gerekli dışa aktarma/yedekler güvenli biçimde saklanmalı ve okunabilirlikleri doğrulanmalıdır.
4. Kullanıcı, eski erişimin kapatılmasını ayrıca onaylamalıdır.

## 5. Teknik kaynakların rolleri

`config/deploy-target.json` içinde:

- `liveUrl`: birincil adres (`https://foposophos.com`)
- `workersDevUrl`: teknik yedek/teşhis adresi
- `legacyUrl`: geçici eski ChatGPT Sites adresi

Dağıtım ve canlı doğrulama otomasyonları `liveUrl` değerini kullanmalıdır. `legacyUrl` yalnız geçiş, tarihsel kayıt ve gerektiğinde veri kurtarma bağlamında tutulur.

## 6. Tarihsel belgeler

Geçmişteki canlı kabul, dağıtım, sürüm ölçümü ve veri taşıma kayıtlarında eski adresin bulunması doğrudur; bu kayıtlar geriye dönük değiştirilmemelidir. Güncel yönlendirme ve operasyon belgeleri ise birincil adresi açıkça `https://foposophos.com` olarak belirtmelidir.
