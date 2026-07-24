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
- Modül durumlarını gösteren başlangıç ekranı
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
npm run lint
npm run build
```

## Mimari yön

```text
app/       Kullanıcı arayüzü ve sayfa düzeni
core/      OPUS Core alan tanımları ve ortak kurallar
curriculum/ 10. ve 11. sınıf müfredat veri modeli
modules/   FOPOS modülleri ve modül kataloğu
```

Temel ilkeler: Curriculum First, Learning Outcomes First, Decision Before Generation, Pedagogy Before Content, Validation Before Delivery, Single Source of Truth ve Modular Product Architecture.

## Sıradaki adımlar

1. 10. ve 11. sınıf müfredat veri modelini eklemek.
2. Ders Tasarım Stüdyosu modülünü gerçek veriyle çalıştırmak.
3. Günlük/yıllık plan, zümre, sınav ve sınav analizi modüllerini bağımsızlaştırmak.
4. Belge üretimi, kalıcı veri ve FOPOS AI karar desteğini eklemek.
