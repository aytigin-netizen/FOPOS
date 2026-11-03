# FOPOS zone güvenlik katmanı — foposophos.com
#
# Bu dosya zone kapsamlı güvenlik tarafını yönetir:
#
#   1. "FOPOS Zone Security" API token'ı (zone kapsamlı izinlerle)
#   2. Always Use HTTPS + minimum TLS sürümü
#   3. Bot Fight Mode (Free plan) — değişkenle kapatılabilir
#   4. www takma adı (CNAME) DNS kaydı
#
# Bootstrap kuralı (main.tf ile aynı): token'ı üreten kimlik, üretilen token'dan
# AYRI olmalıdır; yani bootstrap token'ın "API Tokens Edit" yetkisi olmalıdır.
#
#   export CLOUDFLARE_API_TOKEN="<API Tokens Edit yetkili token>"
#   export CLOUDFLARE_ACCOUNT_ID="78707a7d9957d76cdbe2148031ae381f"
#
# Not: İzin gruplarının kimlikleri adıyla çözülür; Cloudflare her sürümde
# kimlikleri yeniden numaralandırdığı için sabit kimlik yazılmaz.

variable "domain_name" {
  description = "FOPOS'un birincil alan adı."
  type        = string
  default     = "foposophos.com"
}

variable "zone_security_token_name" {
  description = "Üretilecek zone güvenlik token'ının adı."
  type        = string
  default     = "FOPOS Zone Security"
}

variable "enable_bot_fight_mode" {
  description = <<-EOT
    Bot Fight Mode (Free plan) açık mı olacak? Varsayılan KAPALI: Bot Fight Mode
    tarayıcı imzası taşımayan istekleri JavaScript challenge'ı ile karşılar ve
    canlı doğrulama betiği (scripts/verify-live-deployment.mjs) challenge'a
    takılırsa CI kırmızıya döner. Ayrıntı: docs/design/domain-hardening-20261103.md
  EOT
  type        = bool
  default     = false
}

variable "minimum_tls_version" {
  description = "Zone için kabul edilen en düşük TLS sürümü."
  type        = string
  default     = "1.2"
}

# --- İzin grupları: ad + kapsam ile çözülür -------------------------------

data "cloudflare_api_token_permission_groups_list" "zone_settings_write" {
  name  = "Zone%20Settings%20Write"
  scope = "com.cloudflare.api.account.zone"
}

data "cloudflare_api_token_permission_groups_list" "zone_waf_write" {
  name  = "Zone%20WAF%20Write"
  scope = "com.cloudflare.api.account.zone"
}

data "cloudflare_api_token_permission_groups_list" "bot_management_write" {
  name  = "Bot%20Management%20Write"
  scope = "com.cloudflare.api.account.zone"
}

data "cloudflare_api_token_permission_groups_list" "dns_write" {
  name  = "DNS%20Write"
  scope = "com.cloudflare.api.account.zone"
}

locals {
  # Bulunamayan izin grubu uygulamayı durdurmaz; çözülenler raporlanır.
  zone_permission_candidates = {
    zone_settings_write  = try(one(data.cloudflare_api_token_permission_groups_list.zone_settings_write.result).id, "")
    zone_waf_write       = try(one(data.cloudflare_api_token_permission_groups_list.zone_waf_write.result).id, "")
    bot_management_write = try(one(data.cloudflare_api_token_permission_groups_list.bot_management_write.result).id, "")
    dns_write            = try(one(data.cloudflare_api_token_permission_groups_list.dns_write.result).id, "")
  }

  zone_permission_ids = [
    for id in values(local.zone_permission_candidates) : id if id != ""
  ]
}

# --- Zone güvenlik token'ı ------------------------------------------------

resource "cloudflare_api_token" "fopos_zone_security" {
  name = var.zone_security_token_name

  policies = [{
    effect = "allow"

    permission_groups = [
      for id in local.zone_permission_ids : { id = id }
    ]

    # Yalnız FOPOS zone'u; hesabın başka zone'larına erişim yok.
    resources = jsonencode({
      "com.cloudflare.api.account.zone.${var.zone_id}" = "*"
    })
  }]
}

# --- Zone ayarları --------------------------------------------------------

resource "cloudflare_zone_setting" "always_use_https" {
  zone_id    = var.zone_id
  setting_id = "always_use_https"
  value      = "on"
}

resource "cloudflare_zone_setting" "min_tls_version" {
  zone_id    = var.zone_id
  setting_id = "min_tls_version"
  value      = var.minimum_tls_version
}

# --- Bot koruması ---------------------------------------------------------

resource "cloudflare_bot_management" "fopos" {
  zone_id    = var.zone_id
  fight_mode = var.enable_bot_fight_mode
}

# --- www takma adı --------------------------------------------------------

resource "cloudflare_dns_record" "www_alias" {
  zone_id = var.zone_id
  name    = "www"
  type    = "CNAME"
  content = var.domain_name
  ttl     = 1
  proxied = true
  comment = "FOPOS birincil alan adına takma ad"
}

# --- Çıktılar -------------------------------------------------------------

output "zone_security_token_value" {
  description = "Zone güvenlik token'ının DEĞERİ. GitHub Actions secret'ı olarak kullanılabilir."
  value       = cloudflare_api_token.fopos_zone_security.value
  sensitive   = true
}

output "zone_permission_ids" {
  description = "Çözülen zone izin gruplarının kimlikleri (çözülemeyenler boş bırakılır)."
  value       = local.zone_permission_candidates
}
