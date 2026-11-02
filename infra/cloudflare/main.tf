terraform {
  required_version = ">= 1.5"

  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.0"
    }
  }
}

# Bootstrap kimlik bilgisi:
#
#   export CLOUDFLARE_API_TOKEN="<API Tokens Edit yetkili bir token>"
#   export CLOUDFLARE_ACCOUNT_ID="78707a7d9957d76cdbe2148031ae381f"
#
# Dikkat: bu kaynak, kendisini oluşturan token'dan AYRI bir token üretir.
# Yani bootstrap token'ın "API Tokens Edit" yetkisi olmalıdır; üretilen
# token'ın yetkileri ise yalnızca aşağıdaki permission_groups ile sınırlıdır.
#
# Alternatif bootstrap: Global API Key (panelden "API Tokens → Global API Key"):
#   export CLOUDFLARE_API_KEY="..."
#   export CLOUDFLARE_EMAIL="aytigin@gmail.com"

provider "cloudflare" {
  api_token = var.bootstrap_api_token != "" ? var.bootstrap_api_token : null
  api_key   = var.bootstrap_api_key != "" ? var.bootstrap_api_key : null
  email     = var.bootstrap_email != "" ? var.bootstrap_email : null
}

variable "bootstrap_api_token" {
  description = "API Tokens Edit yetkili bootstrap token (CLOUDFLARE_API_TOKEN ile verilir)."
  type        = string
  default     = ""
  sensitive   = true
}

variable "bootstrap_api_key" {
  description = "Global API Key (alternatif bootstrap)."
  type        = string
  default     = ""
  sensitive   = true
}

variable "bootstrap_email" {
  description = "Global API Key ile eşleşen hesap e-postası."
  type        = string
  default     = ""
}

variable "account_id" {
  description = "Cloudflare hesap kimliği (sır değildir; config/deploy-target.json ile aynı)."
  type        = string
  default     = "78707a7d9957d76cdbe2148031ae381f"
}

variable "token_name" {
  description = "Uretilecek token'in adi."
  type        = string
  default     = "FOPOS CI Deploy"
}

# FOPOS dagitim zincirinin ihtiyac duydugu en kucuk yetki kumesi.
#
#   Workers Scripts Write -> Worker'i yayinlama (wrangler deploy)
#   D1 Write             -> migration uygulama + dogrulama sorgulari
#   Account Settings Read-> hesap baglami (worker subdomain vb.)
#
# Ucu de hesap (account) kapsamlidir; bu yuzden tek politika blogu yeterlidir.
# Bolge (zone) kapsamli gruplar karistirilirsa token olusturma dogrulamasi basarisiz olur.
resource "cloudflare_api_token" "fopos_ci_deploy" {
  name = var.token_name

  policies = [{
    effect = "allow"

    permission_groups = [
      { id = "09b2857d1c31407795e75e3fed8617a1" }, # D1 Write
      { id = "e086da7e2179491d91ee5f35b3ca210a" }, # Workers Scripts Write
      { id = "c1fde68c7bcc44588cbb6ddbc16d6480" }, # Account Settings Read
    ]

    resources = jsonencode({
      "com.cloudflare.api.account.*" = "*"
    })
  }]
}

output "token_id" {
  description = "Olusturulan token'in Cloudflare kimligi."
  value       = cloudflare_api_token.fopos_ci_deploy.id
}

output "token_value" {
  description = "Olusturulan token'in DEGERI. GitHub Actions secret'i olarak kullanilmali ve yalnizca bir kez gosterilir."
  value       = cloudflare_api_token.fopos_ci_deploy.value
  sensitive   = true
}
