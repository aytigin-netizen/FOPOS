# FOPOS — Felsefe Öğretmeni Pedagojik İşletim Sistemi

FOPOS, lise felsefe öğretmenlerinin öğretim yılı boyunca yürüttüğü planlama, ölçme-değerlendirme ve pedagojik karar süreçlerini tek ortamda birleştiren web tabanlı bir çalışma alanıdır.

Sistem; **Türkiye Yüzyılı Maarif Modeli (2024) Ortaöğretim Felsefe Dersi Öğretim Programı** temel alınarak 10. ve 11. sınıflar için geliştirilmiştir.

> Güncel ürün tabanı: **FOPOS v46 — Pedagojik Karar Destek Sistemi**

## Canlı uygulama

[FOPOS Ders Tasarım Stüdyosu](https://fopos-ders-studyosu.aytigin.chatgpt.site)

## Temel ilkeler

- Müfredat öncelikli tasarım
- Öğrenme çıktısı önceliği
- Üretimden önce pedagojik karar
- İçerikten önce öğretim yaklaşımı
- Teslimden önce doğrulama
- Tek doğruluk kaynağı
- Modüler ürün mimarisi
- Öğretmen onayı ve izlenebilir revizyon
- Öğrenci verisinde veri minimizasyonu ve oturum güvenliği

## Modüller

| Modül | Kapsam |
| --- | --- |
| Ana Panel | Modüllere ve temel öğretmen iş akışlarına erişim |
| Ders Tasarım Stüdyosu | 10–11. sınıf, ünite, hafta ve öğrenme çıktısına bağlı 80 dakikalık ders tasarımı |
| Günlük Plan | Müfredat bağlantılı günlük plan, öğretmen onayı ve belge çıktısı |
| Yıllık Plan | Akademik takvim, ünite/hafta dağılımı ve yıllık plan çıktısı |
| Zümre Tutanağı | Toplantı türleri, dinamik gündem, kararlar ve imza alanları |
| Sınav Oluşturucu | Standart ve BEP uyarlamalı sınav, cevap anahtarı ve puanlama ölçütleri |
| Öğrenci Listeleri | Güvenli liste aktarımı ve modüller arası kontrollü veri transferi |
| Sınav Analizi | Soru ve öğrenme çıktısı düzeyinde sınıf başarı analizi |
| Öğrenci Performansı | Öğrenci gelişiminin ölçüt ve dönem temelinde izlenmesi |
| Kaynak Merkezi | Müfredat ve öğretim kaynaklarına düzenli erişim |
| FOPOS AI | Kimliksiz sınıf özetlerinden durum, öğrenme açığı ve pedagojik müdahale önerileri |
| Gizlilik Merkezi | Hassas oturum verisi görünürlüğü, silme kontrolleri ve veri yaşam döngüsü açıklamaları |

## Müfredat kapsamı

- 10. sınıf: 9 ünite
- 11. sınıf: 6 ünite
- Toplam: 15 ünite ve 22 doğrulanmış öğrenme çıktısı

Müfredat verisi merkezi bir kaynak olarak tutulur; planlama, sınav ve analiz modülleri aynı sınıf–ünite–öğrenme çıktısı sözleşmesini kullanır.

## Veri güvenliği

- Gerçek öğrenci verisi kaynak kod deposunda tutulmaz.
- Hassas öğrenci verileri dış servise gönderilmeden oturum içinde işlenir.
- FOPOS AI, öğrenci adlarını değil kimliksiz sınıf özetlerini kullanır.
- Kimliksiz sınıf özeti üretimi için en az 5 katılımcı şartı uygulanır.
- Kullanıcı, Gizlilik Merkezi üzerinden hassas oturum verilerini inceleyebilir ve temizleyebilir.
- Yerel pedagojik kayıt arşivi bozuk, uyumsuz veya aşırı büyük veri durumlarına karşı doğrulanır.

## Belge çıktıları

Uygun modüllerde DOCX ve PDF çıktıları desteklenir. Üretilen belgeler öğretmen onayı, müfredat bağlantısı ve içerik doğrulaması akışından geçirilir.

## Teknoloji

- Next.js / Vinext
- React 19
- TypeScript
- Cloudflare Workers / Sites
- Tailwind CSS
- `docx` ve `xlsx`
- Node.js 22+

## Yerel geliştirme

### Gereksinimler

- Node.js `>=22.13.0`
- npm
- Linux ortamında `flock`, `curl` ve GNU `timeout`

### Kurulum ve çalıştırma

```bash
npm ci
npm run dev
```

### Kalite kontrolleri

```bash
npm run test:contracts
npm run lint
npm run build
```

GitHub Actions, her pull request ve `main` dalı güncellemesinde sözleşme testlerini, lint kontrolünü ve üretim derlemesini çalıştırır.

## Proje yapısı

```text
app/
  components/       Arayüz ve gezinme bileşenleri
  core/             Veri güvenliği ve alan sözleşmeleri
  data/             Merkezi müfredat verisi
  hooks/            Oturum ve arayüz davranışları
  modules/          Bağımsız FOPOS modülleri
scripts/            Kurulum, derleme ve artifact doğrulama araçları
tests/              Ürün sözleşmesi ve güvenlik testleri
.github/workflows/  Sürekli entegrasyon yapılandırması
.openai/             Sites barındırma yapılandırması
```

## Sürümleme ve geliştirme akışı

- Kararlı sürümler `vMAJOR.MINOR.PATCH` biçiminde etiketlenir.
- Değişiklikler ayrı bir dalda hazırlanır ve pull request üzerinden `main` dalına alınır.
- PR birleştirilmeden önce otomatik kalite kapısının başarılı olması gerekir.
- Canlı dağıtım, doğrulanmış kaynak durumu üzerinden gerçekleştirilir.

## Durum

FOPOS v46 kaynak ağacı GitHub ile eşitlenmiş ve üretimde doğrulanmıştır. Depo, sonraki modül geliştirmelerinde tek doğruluk kaynağı olarak kullanılacaktır.
