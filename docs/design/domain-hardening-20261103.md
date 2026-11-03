# FOPOS alan adı güvenlik ve yapılandırma durumu — 3 Kasım 2026

**Kapsam:** `foposophos.com` zone'unun aktarım sonrası durumu, WAF/Bot korumasının
gerçek kapsamı ve eksik kalan yapılandırma adımları.

**Ölçüm yöntemi:** Cloudflare API'si, GitHub Actions üzerinden
(`scripts/probe-cloudflare-zone.mjs`, salt okunur). Paneldeki menü konumu
değiştiği için ölçüm API üzerinden yapıldı; tahmin kullanılmadı.

---

## 1. Ölçülen durum

| Öğe | Durum | Kanıt |
| --- | --- | --- |
| Alan adı aktarımı (NS) | **Tamam** | `amir.ns.cloudflare.com`, `jamie.ns.cloudflare.com` (DoH ile doğrulandı) |
| Zone durumu | **active** | `GET /zones/{zone}` → `status: active` |
| Zone planı | **Free Website** | `zone.plan.name` |
| Apex çözümlemesi | **Çalışıyor** | `foposophos.com` → `104.21.2.109` / `172.67.129.26` (proxy) |
| HTTP → HTTPS | **Yönlendirme var** | `http://foposophos.com` → `301 https://foposophos.com` |
| TLS sertifikası | **Geçerli** | `CN=foposophos.com`, SAN `*.foposophos.com`, Google Trust Services WE1, 02.11.2026 – 31.01.2027 |
| Zone DNS kayıtları | **Yalnız 1 kayıt** | `AAAA foposophos.com → 100::` (proxied). **MX yok**, `www` yok |
| Worker custom domain | **Yalnız apex** | `foposophos.com` → `fopos-ders-studyosu`. `www.foposophos.com` **yok** |
| `www.foposophos.com` | **NXDOMAIN** | DNS çözümlemesi başarısız (443 bağlantısı kurulamıyor) |
| Zone settings (Always Use HTTPS, TLS) | **Okunamadı** | `GET /zones/{id}/settings` → 403 (9109) |
| WAF ruleset / firewall | **Okunamadı** | `GET /zones/{id}/rulesets` → 403 (10000) |
| Canlı doğrulama | **Geçiyor** | `verify-live-deployment.mjs https://foposophos.com` → tüm işaretler VAR, çıkış 0 |

## 2. WAF panelde neden bulunamadı

Cloudflare 2026 panel düzeninde güvenlik ürünleri **tek bir sayfaya** taşındı.
Eski yol (`Security → WAF → Managed rules`, `Security → Bots`) artık
`Security → Settings` altındaki **kategori filtrelerine** karşılık geliyor.

Doğru yol:

1. Cloudflare paneli → **`foposophos.com`** zone'u.
2. Sol menüde **Security** → **Settings** (sayfanın sağ üstünde `Settings ↗`).
3. Kategori filtresinde:
   - **Web application exploits** → WAF managed ruleset (Free plan: *Cloudflare Free
     Managed Ruleset* — yüksek etkili, yaygın açıklara karşı, Free'da **varsayılan
     olarak dağıtılır**).
   - **Bot traffic** → **Bot fight mode** anahtarı.
4. İstenirse **Security → Analytics → Events** altından tetiklenen istekler izlenir.

> Free planda **Super Bot Fight Mode** ve **Bot Management** yoktur; bunlar Pro+
> plan özellikleridir.

## 3. Neden API ile WAF ayarı yapılamıyor

CI'ın kullandığı `CLOUDFLARE_API_TOKEN` (Workers + D1 + zone Workers Routes)
zone güvenlik uçlarını okuyamıyor:

| Uç | Sonuç |
| --- | --- |
| `GET /zones/{id}/dns_records` | ✓ 200 |
| `GET /zones/{id}/settings` | ✗ 403 (9109 Unauthorized) |
| `GET /zones/{id}/rulesets` | ✗ 403 (10000 Authentication error) |
| `GET /zones/{id}/firewall/rules` | ✗ 403 |
| `GET /zones/{id}/bot_management` | ✗ 403 |

Gereken yetki (zone kapsamlı): **Zone Settings Read/Edit** ve
**Zone WAF Edit** (Firewall Services). Bu yetkileri taşıyan ayrı bir token
üretilirse WAF ve Bot Fight Mode API'den de açılabilir; üretim
`infra/cloudflare/main.tf` içindeki Terraform tanımıyla tek komutla yönetilebilir.

**Not:** Depodaki ve gizli depodaki eski token'lar (`1b5561d9cd1063fc`,
`842731618d40426d`) artık **ölü** (401). Çalışan tek token CI secret'ındadır ve
değeri API'den okunamaz.

## 4. `www` takma adı (açık kusur)

`www.foposophos.com` hem DNS'te hem de Worker custom domain listesinde yoktu;
bu yüzden NXDOMAIN dönüyordu. 2 Kasım'da eklenen kayıt, alan adı aktarımı
sırasında kaybolmuş görünüyor (zone kimliği değişmemiş).

**Onarım (idempotent):** `scripts/ensure-domain-aliases.mjs`

1. DNS: `CNAME www → foposophos.com` (proxied)
2. Worker custom domain: `www.foposophos.com → fopos-ders-studyosu`
   (`PUT /accounts/{acc}/workers/domains`; `POST` "Method not allowed" verir)

Elle tetikleme: Actions → **Ensure domain aliases** → Run workflow.

## 5. Posta (MX) — dikkat gerektirir

Zone'da **hiç MX kaydı yok**. Alan adı aktarımı Natro'daki kayıtları da
getirmemiş görünüyor. `aytigin@foposophos.com` gibi bir adres kullanılıyorsa
**posta şu anda teslim edilemez**.

Çözüm Natro panelinden MX kayıtlarının okunup Cloudflare DNS'e yazılmasıdır
(Natro'nun MX hedefleri `mail.natro.com` benzeri kayıtlardır; değerler kullanıcıdan
alınmalıdır). Alternatif: alan adına bağlı posta kullanılmıyorsa bu adım atlanır
ve bu belge "atlandı" olarak güncellenir.

## 6. Bot Fight Mode ve CI çakışması (dikkat)

Bot Fight Mode, tarayıcı imzası taşımayan istekleri **mürekkep balonu** (JS
challenge) ile karşılar. `scripts/verify-live-deployment.mjs` düz `fetch` kullanır
ve JavaScript çalıştırmaz → challenge'a takılırsa **CI kırmızıya döner ve
doğrulama "yayınlandı" sanılır**.

Free planda Bot Fight Mode **özel kuralla kapatılamaz** (skip desteği yoktur).
Bu yüzden üç seçenek vardır:

1. Bot Fight Mode **kapalı** bırakılır; koruma yalnız Free Managed Ruleset
   (varsayılan açık) ve DDoS korumasıyla sınırlı kalır.
2. Bot Fight Mode açılır ve CI doğrulaması bu durumda elle tetiklenir
   (`Verify live FOPOS deployment` → Run); deploy iş akışındaki doğrulama adımı
   zaten `continue-on-error` değildir, bu yüzden kırmızıya dönebilir.
3. **Önerilen:** Pro plana geçilir → Super Bot Fight Mode, verified bot
   istisnaları ve skip kurallarıyla CI'ı istisna tutulabilir.

Uygulama öncesi öneri: önce **Security → Analytics → Events** altında mevcut
trafiği gözlemle, sonra karar ver.

## 7. Ek güvenlik başlıkları

Canlı yanıtta `Strict-Transport-Security`, `X-Frame-Options`,
`X-Content-Type-Options`, `Referrer-Policy` ve `Content-Security-Policy`
başlıkları **yok**. Uygulama `self-hosted-session` çerezi `Secure` + `HttpOnly`
kullanıyor (öğretmen oturumu için iyi), ancak HTTP katmanında ek başlıklar
uygulama veya Cloudflare "Modify Response Header" kuralı ile eklenebilir.
