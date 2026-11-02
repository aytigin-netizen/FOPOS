# FOPOS — Plus'sız canlıya alma: Cloudflare Workers yolu (1 Kasım 2026)

## 1. Başlangıç durumu (ölçülen)

**Ölçüm tarihi:** 1 Kasım 2026, 14:44–15:10 UTC
**Canlı:** https://fopos-ders-studyosu.aytigin.chatgpt.site → **200**
**main HEAD:** `fa8f89a` (#251, 31 Eki 08:52 UTC)

### Canlı sürüm ölçümü

`scripts/verify-live-deployment.mjs` (reponun kendi doğrulama betiği) çalıştırıldı:

| İşaret | PR | Canlı |
| --- | --- | :--: |
| `Önceki sorularla sınav oluştur` | #234 | VAR |
| `Sadelik` | #235/#238 | YOK |
| `Taş, su ve hava madde midir?` | #235/#238 | YOK |
| `TYMM ÇERÇEVE İZİ` | #241 | YOK |
| `Sınav aktarımındaki süreç bileşeni boş olamaz.` | #242 | YOK |
| `Beceriler arası ilişkiler` | #246 | YOK |
| `Okuryazarlık becerileri` | #246 | YOK |
| onay kaydı (`Aytekin YILMAZ` + `2026-10-17`) | #238 | YOK |

**Sonuç:** canlı **#234** seviyesinde; main'den **#235, #238, #241, #242, #246, #249, #250, #251** eksik.
20 Ekim denetimiyle (`docs/quality/live-deployment-gap-20261020.md`) tutarlı: o gün 6 PR gerideydi,
bugün 8 PR geride. Canlı **erişilebilir** ama **eski**.

### Neden canlıya alınamıyor

Canlı adres `*.aytigin.chatgpt.site` → **OpenAI Sites** katmanı. Bu katman:

1. Dağıtımı ChatGPT aboneliğine (Plus) bağlı.
2. Kimliği **Sites başlıkları** üzerinden doğruluyor:
   `oai-authenticated-user-email`, `oai-authenticated-user-full-name`,
   `oai-authenticated-user-full-name-encoding` (`app/core/authenticated-user.ts`).
3. `/signin-with-chatgpt` ve `/signout-with-chatgpt` yollarını kendisi sunuyor
   (`app/core/auth-return-path.ts`).

Plus bittiği için **yeni dağıtım** yapılamıyor. Mevcut dağıtım çalışmaya devam ediyor
(Sites dağıtımı Plus bitince otomatik düşmüyor) ama **güncellenemiyor**.

## 2. Çıkış yolu: aynı işi Cloudflare Workers'a taşı

`Felsefe-Grubu-Odev-Takip` projesi bu sorunu 26 Ekim'de **çözdü**: Sites yolu tıkandıktan
sonra `aytigin-netizen/Felsefe-Grubu-Odev-Takip-Cloudflare` deposu açıldı, GitHub `main`
push'u → **Cloudflare Workers Builds** → otomatik deploy zincirine geçildi.
FOPOS için aynı desen uygulanabilir; hatta FOPOS'un altyapısı Workers'a **daha hazır**.

### FOPOS'un Workers'a hazır olma nedeni

| Gereken parça | FOPOS'ta | Durum |
| --- | --- | --- |
| Worker girişi | `worker/index.ts` | ✅ var |
| Worker çalışma zamanı | `vinext` 0.0.50 + `@cloudflare/vite-plugin` 1.37.1 + `wrangler` 4.92.0 | ✅ var |
| D1 şeması | `db/schema.ts` + `drizzle/` (16 migration) | ✅ var |
| Sites metadata paketleyici | `build/sites-vite-plugin.ts` | ✅ yalnız `dist/.openai/` paketler — platforma bağımlı değil |
| CI typecheck kapısı | `.github/workflows/ci.yml` (#245) | ✅ var |
| Canlı doğrulama betiği | `scripts/verify-live-deployment.mjs` | ✅ var, **herhangi bir taban adresle çalışır** |
| `wrangler.jsonc` | — | ❌ **yok — eklenecek** |
| Kimlik katmanı | Sites başlıkları | ❌ **değiştirilecek** |

### Engeller (ikisi de çözülebilir)

**Engel 1 — Kimlik.** `getChatGPTUser()` → `authenticatedUserFromHeaders()` yalnız Sites
başlıklarını okuyor. Kendi Worker'ımızda bu başlıklar **yok** → her istek "Misafir" olur,
API rotaları 401 döner, uygulama kullanılamaz.

*Çözüm:* Kimlik sağlayıcısını değiştirilebilir yapmak. Uygulamanın geri kalanı **tek bir
noktada** (`app/core/authenticated-user.ts`) kimliğe bağlıdır; tüm veri erişimi
`user.email` üzerinden anahtarlanır. Değişiklik yüzeyi küçüktür.

**Engel 2 — D1 verisi.** Sites'in D1 veritabanı OpenAI'ın Sites projesinde
(`project_id: appgprj_6a53eaa470ec8191907e0b544f791152`), kullanıcının kendi Cloudflare
hesabında değil. Yeni Worker'ın D1'si **boş** başlar.

*Çözüm:* Uygulama zaten hesap dışa aktarma içeriyor (`db/account-export.ts`,
`app/api/account-export/route.ts`). Canlıdan öğretmen hesabıyla dışa aktarma → yeni D1'ye
içe aktarma.

## 3. Uygulama planı

| Faz | İş | Bağımlılık |
| --- | --- | --- |
| **0** | Taban doğrulama: typecheck + build + tam test paketi (CI ile aynı) | — |
| **1** | Kimlik katmanı: sağlayıcı-uyarlanabilir kimlik + `/signin` rotaları + oturum çerezi | Kimlik stratejisi kararı |
| **2** | `wrangler.jsonc` + `vite.config.ts` gerçek D1 bağlama; D1 oluştur; 16 migration uygula | CF API token + Account ID |
| **3** | İlk `wrangler deploy` + canlı adres (`*.aytigin.workers.dev`) | Faz 2 |
| **4** | Otomasyon: GitHub Actions deploy işi (veya Workers Builds) | Faz 3 |
| **5** | Veri taşıma: canlı export → yeni D1 import | Faz 3 |
| **6** | Doğrulama: `verify-live-deployment.mjs` yeni adres + A/B DOCX kabul | Faz 5 |

### Kimlik stratejisi seçenekleri

**A) Worker içi geçiş kodu (önerilen).** Tek öğretmen için: `FOPOS_ACCESS_CODE` Worker
secret'ı, HMAC imzalı oturum çerezi, aynı-kök denetimi zaten API rotalarında var.
Üçüncü taraf bağımlılığı yok, müşteri paketi büyümüyor, "herkes kendi hesabını açabilir"
deliği yok.

**B) Clerk.** Ödev Takibi'ndeki `deciding-ladybug-4146.clerk.accounts.dev` örneği
kullanılabilir. Daha çok iş (istemci sağlayıcısı, paket), örnek **Development** ve
kayıt modu `public` olduğu için yabancı hesap riski var.

**C) Cloudflare Access.** `workers.dev` üzerinde özel alan adı olmadan uygulanabilirliği
belirsiz; ayrıca e-posta doğrulama + Access başlıkları kimlik eşlemesi gerektirir.

## 4. Gerçekçi beklenti

- Workers adresi `https://fopos-ders-studyosu.aytigin.workers.dev` olur (ödev takibi
  deseni: `<worker>.<hesap-subdomain>.workers.dev`).
- Kimlik Sites'e özgü olduğu için **kullanıcı adı/şifre ya da geçiş kodu** gerekir;
  "ChatGPT ile ücretsiz giriş" bağlantısı Workers sürümünde çalışmaz.
- `workers.dev` adresi e-posta kabulü için **kendi alan adı** gerektirmez, ama öğretmenin
  öğrencilerine/velilerine dağıtılacaksa alan adı düşünülmeli.

## 5. Doğrulama kaynakları

- `docs/quality/live-deployment-gap-20261020.md` — 20 Ekim ölçümü
- `docs/quality/live-deployment-verify-20261020.md` — doğrulama aracının tanımı
- `scripts/verify-live-deployment.mjs` — tekrarlanabilir canlı ölçümü
- `node_modules/.bin/vinext` — Worker derleyicisi
