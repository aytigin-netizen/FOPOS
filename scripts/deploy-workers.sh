#!/usr/bin/env bash
# FOPOS — Cloudflare Workers dağıtımı (tek komut).
#
# Gerekli ortam değişkenleri:
#   CLOUDFLARE_API_TOKEN   Workers Scripts: Edit · D1: Edit · Account Settings: Read
#   CLOUDFLARE_ACCOUNT_ID  hesap kimliği
#   FOPOS_TEACHER_EMAIL    canlıdaki ChatGPT hesabının e-postası (veri anahtarı)
#   FOPOS_ACCESS_CODE      öğretmenin giriş geçiş kodu
#   FOPOS_SESSION_SECRET   oturum imzalama anahtarı (verilmezse üretilir)
#
# Kullanım:
#   CLOUDFLARE_API_TOKEN=... CLOUDFLARE_ACCOUNT_ID=... \
#   FOPOS_TEACHER_EMAIL=... FOPOS_ACCESS_CODE=... \
#   bash scripts/deploy-workers.sh
set -euo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${project_root}"

config="wrangler.workers.jsonc"
worker_name="$(node -e "
const fs=require('fs');
const raw=fs.readFileSync('$config','utf8').replace(/\/\/.*$/gm,'');
console.log(JSON.parse(raw).name);
")"

log() { printf '\n\033[1m== %s ==\033[0m\n' "$1"; }
fail() { printf '\033[31mHATA: %s\033[0m\n' "$1" >&2; exit 1; }

for variable in CLOUDFLARE_API_TOKEN CLOUDFLARE_ACCOUNT_ID FOPOS_TEACHER_EMAIL FOPOS_ACCESS_CODE; do
  [[ -n "${!variable:-}" ]] || fail "${variable} tanımsız."
done

if [[ -z "${FOPOS_SESSION_SECRET:-}" ]]; then
  FOPOS_SESSION_SECRET="$(openssl rand -base64 32 | tr -d '\n')"
  echo "FOPOS_SESSION_SECRET üretildi (bu çalışmada bir kez kullanılacak)."
fi

log "1/6 Token doğrulaması"
verify_code="$(curl -s -o /tmp/cf-verify.json -w '%{http_code}' \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  https://api.cloudflare.com/client/v4/user/tokens/verify)"
# Kapsamlı tokenlarda bu uç 401 döner; bu tek başına geçersizlik kanıtı değildir.
# Bu yüzden asıl kontrol, aşağıdaki Workers/D1 uçlarıdır.
echo "token doğrulama ucu: HTTP ${verify_code}"

log "2/6 Workers yetkisi kontrolü"
workers_code="$(curl -s -o /tmp/cf-workers.json -w '%{http_code}' \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  "https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/workers/scripts")"
[[ "${workers_code}" == "200" ]] || {
  head -c 400 /tmp/cf-workers.json; echo
  fail "Workers Scripts: Read/Edit yetkisi yok (HTTP ${workers_code}). Token'ı Workers Scripts: Edit ile yenile."
}
echo "Workers erişimi: OK"

log "3/6 D1 veritabanı (${worker_name})"
database_id="$(node -e "
const fs=require('fs');
const raw=fs.readFileSync('$config','utf8').replace(/\/\/.*\$/gm,'');
console.log(JSON.parse(raw).d1_databases[0].database_id);
")"
if [[ "${database_id}" == "00000000-0000-4000-8000-000000000000" ]]; then
  create_response="$(curl -s -X POST \
    -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"${worker_name}\"}" \
    "https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/d1/database")"
  database_id="$(printf '%s' "${create_response}" | node -e "
let raw=''; process.stdin.on('data',d=>raw+=d).on('end',()=>{
  const parsed=JSON.parse(raw);
  if(!parsed.success){ console.error(raw.slice(0,400)); process.exit(1); }
  console.log(parsed.result.uuid);
});")"
  echo "D1 oluşturuldu: ${database_id}"
  sed -i.bak "s/00000000-0000-4000-8000-000000000000/${database_id}/" "${config}"
  rm -f "${config}.bak"
  echo "database_id ${config} içine yazıldı."
else
  echo "D1 zaten yapılandırılmış: ${database_id}"
fi

log "4/6 Migration uygulaması"
for migration in drizzle/0*.sql; do
  npx wrangler d1 execute DB --remote -c "${config}" --file="${migration}" >/dev/null \
    || fail "Migration uygulanamadı: ${migration}"
  echo "  ✓ $(basename "${migration}")"
done

log "5/6 Worker secret'ları"
printf '%s' "${FOPOS_ACCESS_CODE}" | npx wrangler secret put FOPOS_ACCESS_CODE -c "${config}" >/dev/null
printf '%s' "${FOPOS_SESSION_SECRET}" | npx wrangler secret put FOPOS_SESSION_SECRET -c "${config}" >/dev/null
printf '%s' "${FOPOS_TEACHER_EMAIL}" | npx wrangler secret put FOPOS_TEACHER_EMAIL -c "${config}" >/dev/null
printf '%s' "${FOPOS_TEACHER_NAME:-FOPOS Öğretmen}" | npx wrangler secret put FOPOS_TEACHER_NAME -c "${config}" >/dev/null
echo "  ✓ FOPOS_ACCESS_CODE, FOPOS_SESSION_SECRET, FOPOS_TEACHER_EMAIL, FOPOS_TEACHER_NAME"

log "6/6 Derleme ve dağıtım"
npm run build:workers
npx wrangler deploy

live_url="https://${worker_name}.$(curl -s -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  "https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/workers/subdomain" \
  | node -e "let raw='';process.stdin.on('data',d=>raw+=d).on('end',()=>{
      try{console.log(JSON.parse(raw).result.subdomain);}catch{console.log('');}
    })").workers.dev"

printf '\n\033[1m== Dağıtım tamam ==\033[0m\n'
echo "Canlı adres: ${live_url}"
echo "Doğrulama:"
echo "  node scripts/verify-live-deployment.mjs ${live_url}"
