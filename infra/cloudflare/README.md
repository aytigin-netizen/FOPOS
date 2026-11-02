# Cloudflare dağıtım token'ı (Terraform)

FOPOS'un GitHub Actions iş akışının (`Deploy Cloudflare Workers`) Cloudflare'a
erişmek için kullandığı API token'ını yöneten altyapı tanımı.

## Neden Terraform?

Panelden üretilen token'ın ne yetkisi olduğu, ne zaman üretildiği ve neden
var olduğu kayıt altında değildir. Burada üç şey açıkça yazılıdır:
hangi izinler veriliyor, hangi hesaba bağlı, hangi kaynaklara dokunabilir.

## Token'ın yetkileri

| Permission group ID | Ad | Neden |
| --- | --- | --- |
| `e086da7e2179491d91ee5f35b3ca210a` | Workers Scripts Write | Worker'ı yayınlamak (`wrangler deploy`) |
| `09b2857d1c31407795e75e3fed8617a1` | D1 Write | Migration uygulamak, doğrulama sorguları çalıştırmak |
| `c1fde68c7bcc44588cbb6ddbc16d6480` | Account Settings Read | Hesap bağlamı (worker subdomain, hesap kimliği) |

Üçü de **hesap (account) kapsamlıdır** → tek politika bloğu yeterlidir.
Bölge (zone) kapsamlı bir grup karıştırılırsa Cloudflare token oluşturma
doğrulamasını reddeder ("Insufficient policy blocks" / 403).

Kapsam: `com.cloudflare.api.account.*` = `*` → hesaptaki tüm Worker ve D1
kaynakları. Bu hesapta tek Worker (`fopos-ders-studyosu`) ve tek D1
(`fopos-db`) vardır.

## Bootstrap gereksinimi

**Önemli:** Token'ı üreten Terraform, üretilen token'ın yetkisinden ayrı bir
kimlikle çalışır. Yani bootstrap kimliğin **"API Tokens Edit"** yetkisine
sahip olmalıdır; üretilen token'ın yetkileri ise yalnızca yukarıdaki üç
gruptur.

İki bootstrap seçeneği:

**A. Global API Key** (panel → API Tokens → Global API Key → View)

```
export CLOUDFLARE_API_KEY="..."
export CLOUDFLARE_EMAIL="aytigin@gmail.com"
```

**B. "API Tokens Edit" yetkili bir token**

```
export CLOUDFLARE_API_TOKEN="..."
```

## Kullanım

```bash
cd infra/cloudflare
terraform init
terraform apply                      # sonuçta token değeri yazdırılır
terraform output -raw token_value    # değeri tekrar okumak için
```

## Token değerini GitHub'a taşıma

Üretilen değer, depodaki tek gizli değişkendir:

```
CLOUDFLARE_API_TOKEN  →  Depo ayarları → Secrets and variables → Actions
```

Hesap kimliği secret **gerekmez**; `config/deploy-target.json` içinden okunur.

Doğrulama: iş akışı çalıştığında "Token özeti (sha256, ilk 16)" satırını
yazar. Bu satır beklenen özetle eşleşiyorsa secret doğru girilmiştir.

## Güvenlik

- `terraform.tfstate` token değerini **düz metin** içerir → `.gitignore`'da
  (`.terraform/` ve `*.tfstate`).
- Token'ı ürettikten sonra değeri yalnızca bir kez görürsünüz. GitHub
  secret'ına yazdıktan sonra terraform state'i güvenli bir yere taşıyın veya
  silin.
- Token'ın ömrü bitince: `terraform apply` ile yenisini üretip secret'ı
  güncelleyin.
