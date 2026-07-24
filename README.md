# FOPOS

**Felsefe Öğretmeni Pedagojik İşletim Sistemi**

FOPOS, OPUS Core üzerinde geliştirilen; Türkiye Yüzyılı Maarif Modeli (2024) ile uyumlu, müfredat öncelikli ve modüler bir öğretmen çalışma ortamıdır.

## İlk iskelet

Bu sürüm, ürünün ilk çalışabilir teknik temelini kurar:

- Next.js App Router
- React ve TypeScript
- OPUS Core proje tanımı
- FOPOS modül kataloğu
- 10. ve 11. sınıf müfredat veri modeli
- Müfredat bağlantılı yedi öğretmen çalışma modülü
- Kullanıcı onaylı ortak DOCX motoru ve Günlük Plan pilotu
- Yayın hazırlığı kontrol ekranı
- ESLint ve TypeScript doğrulama komutları

## Başlangıç

```bash
npm install
npm run dev
```

Ardından `http://localhost:3000` adresini açın.

## Doğrulama

```bash
npm run typecheck
npm run curriculum:validate
npm run studio:validate
npm run daily-plan:validate
npm run annual-plan:validate
npm run department-minutes:validate
npm run exam-generator:validate
npm run exam-analysis:validate
npm run fopos-ai:validate
npm run release:validate
npm run document:validate
npm run lint
npm run build
```

## Mimari yön

```text
app/       Kullanıcı arayüzü ve sayfa düzeni
core/      OPUS Core alan tanımları ve ortak kurallar
curriculum/ 10. ve 11. sınıf müfredat veri modeli
modules/   FOPOS modülleri, modül kataloğu ve ortak Document Engine
```

Temel ilkeler: Curriculum First, Learning Outcomes First, Decision Before Generation, Pedagogy Before Content, Validation Before Delivery, Single Source of Truth ve Modular Product Architecture.

## Sıradaki adımlar

1. Ortak Document Engine'i diğer modüllere bağlamak.
2. PDF üretimi ve tarayıcı uçtan uca testlerini eklemek.
3. Gizlilik/veri yaşam döngüsü kontrollerini tamamlamak.
4. Barındırma ve alan adı yapılandırmasını tamamlamak.
