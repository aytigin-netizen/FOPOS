# FOPOS — Cloudflare Workers dağıtım runbook'u

> Plan ve gerekçe: `docs/design/cloudflare-workers-deploy-20261101.md`
> Bu dosya **adımların sırasını** ve **her adımın doğrulamasını** taşır.

## 0. Gereksinimler

| Gereken | Nerede | Not |
| --- | --- | --- |
| Cloudflare API token | `CLOUDFLARE_API_TOKEN` | Workers Scripts: Edit · D1: Edit · Account: Read |
| Cloudflare Account ID | `CLOUDFLARE_ACCOUNT_ID` | Hesabın Workers & Pages sayfasında |
| GitHub PAT | `GITHUB_PAT` | Depoya yazma + Actions secret'larına erişim |
| Node.js ≥ 22.13 | — | `engines` ile aynı |

## 1. D1 veritabanı

```bash
# D1 oluştur
npx wrangler d1 create fopos-ders-studyosu \
  --account-id "$CLOUDFLARE_ACCOUNT_ID"

# Çıktıdaki database_id değerini wrangler.workers.jsonc içine yaz
# (binding "DB", database_name "fopos-ders-studyosu" olarak kalır)
```

`database_id` bir sır değildir; depoda tutulabilir.

## 2. Migration

Migration dosyaları drizzle biçimindedir (`drizzle/*.sql`). D1 migration
defteri `wrangler d1 migrations apply` yerine `d1 execute --file` ile
yönetilir; her dosya sırayla uygulanır.

```bash
for f in drizzle/0*.sql; do
  npx wrangler d1 execute DB --remote \
    -c wrangler.workers.jsonc --file="$f" || exit 1
done
```

**Doğrulama:**

```bash
npx wrangler d1 execute DB --remote -c wrangler.workers.jsonc \
  --command="SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
```

Beklenen: `users`, `teacher_profiles`, `teacher_profile_revisions`,
`pedagogical_records`, `student_rosters` (varsa), `class_workspaces`,
`teacher_disciplines`, `teacher_discipline_assignments`,
`teaching_timetables`, `exam_generation_history`, `generation_events`,
`generation_archive_cursor`, `artifact_integrity` ve `d1_migrations`
benzeri yardımcı tablolar.

> **Not:** D1'de tablo sayısı 16 migration dosyasının toplam etkisidir;
> `drizzle/meta/_journal.json` sıralamayı verir.

## 3. Worker secret'ları

```bash
# Geçiş kodu (öğretmenin bildiği gizli kod)
npx wrangler secret put FOPOS_ACCESS_CODE      -c wrangler.workers.jsonc

# Oturum imzalama anahtarı (en az 32 karakter, rastgele)
openssl rand -base64 32 | npx wrangler secret put FOPOS_SESSION_SECRET -c wrangler.workers.jsonc

# Öğretmen e-postası: veri anahtarıdır. Sites'teki ChatGPT hesabının
# e-postasıyla AYNI olmalıdır; aksi halde veri taşıma eşleşmez.
npx wrangler secret put FOPOS_TEACHER_EMAIL   -c wrangler.workers.jsonc

# Görünen ad (isteğe bağlı)
npx wrangler secret put FOPOS_TEACHER_NAME    -c wrangler.workers.jsonc
```

**Kritik:** `FOPOS_TEACHER_EMAIL`, canlıdaki verilerin `users.email_normalized`
anahtarıyla **birebir aynı** olmalıdır. Değilse yeni D1 boş kalır ve eski veriler
bağlanmaz. Canlı hesabın e-postası hesap dışa aktarma dosyasında görünür.

## 4. Derleme ve dağıtım

```bash
npm ci
npm run build:workers     # FOPOS_CF_DEPLOY=1 → wrangler.workers.jsonc kullanılır
npm run deploy:workers   # npx wrangler deploy
```

`npm run build:workers` sonrası `.wrangler/deploy/config.json` üretilir ve
`wrangler deploy` derleme çıktısını kullanır.

**Canlı adres:** `https://fopos-ders-studyosu.aytigin.workers.dev`
(worker adı `wrangler.workers.jsonc` → `name`, hesap subdomain'i `aytigin`)

## 5. Doğrulama

```bash
node scripts/verify-live-deployment.mjs \
  https://fopos-ders-studyosu.aytigin.workers.dev
```

Beklenen: tüm işaretler `VAR` ve çıkış kodu 0. İşaretler PR numaralarına
bağlıdır (#234, #235/#238, #241, #242, #246).

**Kimlik kontrolü** (tarayıcı veya curl):

```bash
# 1) Giriş sayfası 200 döner
curl -s -o /dev/null -w "%{http_code}\n" \
  https://fopos-ders-studyosu.aytigin.workers.dev/signin-with-chatgpt?return_to=%2F

# 2) Kimliksiz API isteği 401 döner
curl -s -o /dev/null -w "%{http_code}\n" \
  https://fopos-ders-studyosu.aytigin.workers.dev/api/pedagogical-records

# 3) Giriş sonrası çerezle 200 döner
```

## 6. Veri taşıma (canlı Sites → yeni D1)

1. Canlıda oturum açıkken **Hesap → Veri dışa aktar** ile JSON alın.
   (Uygulama `db/account-export.ts` ve `/api/account-export` ile dışa aktarır.)
2. Dışa aktarılan dosyadaki `users.email_normalized` değeri ile
   `FOPOS_TEACHER_EMAIL` eşleşmeli.
3. Yeni D1'ye içe aktarma: dışa aktarma biçimi doğrudan `INSERT` ile
   uygulanamaz; kayıtların `users`/`teacher_profiles` satırları önce
   oluşturulur, sonra içerik kayıtları eklenir. **Bu adım canlı veriye
   dokunduğu için ayrıca doğrulama gerektirir** (satır sayıları karşılaştırılır).

## 7. Otomasyon (isteğe bağlı)

`.github/workflows/deploy-workers.yml`: `main` push → `npm ci` →
`npm run build:workers` → `npm run deploy:workers`.

Gereken GitHub secret'ları:

| Secret | Değer |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | Workers + D1 yetkili token |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Account ID |

Bu iş akışı `wrangler.workers.jsonc` içindeki `database_id` değerini kullanır;
`FOPOS_*` değerleri Worker'a **secret** olarak yazıldığı için depoda tutulmaz.

Alternatif: Cloudflare **Workers Builds** (GitHub → Workers Builds bağlantısı).
Ödev Takibi projesi bu yolu kullanıyor; panelde tek seferlik kurulum gerektirir.
