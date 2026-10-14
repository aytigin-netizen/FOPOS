# Ortak metin ve kitapçık yerleşimi

## Kanıt ve kapsam

Kullanıcının gönderdiği 11. sınıf A öğrenci kitapçığı ile A öğretmen paketindeki sekiz soru metni, numarası ve puanı birebir eşleşir; 13×4 + 12×4 = 100 puan. Öğrenci çıktısında turnuva ve kütüphane metinleri soruların arasına tekrar giriyor, 8. soru tek başına üçüncü sayfaya taşıyordu.

## Düzeltme

Ortak metinlere bağlı sorular ilk görünme sırasıyla kararlı biçimde gruplanır. Örnekte eski 1,2,3,4,6,7,5,8 sırası yeni 1–8 olur: turnuva 1–6, kütüphane 7–8. Her metin bir kez basılır. Ekrandaki düzen, öğrenci ve öğretmen çıktıları, cevap anahtarı ve analiz tablosu aynı soru sırasını kullanır. Nesne kimliği, kaynak A/B bağı, puan, cevap alanı ve font korunur; yeni soru üretilmez ve üretim geçmişi sıfırlanmaz. Ayrı ünite veya puntoya ait metinler aynı gruba alınmaz. Metinsiz sorular tekil kalır.

Öğretmen dosyasındaki eski 4. soruda toplumsal örnek vermek puan koşuluyken yönergede böyle bir istek yoktu. Üçüncü ölçüt, görüşün her kurala uygulanabilirliğinin güçlü ve zayıf yanlarla gerekçelendirilmesine bağlandı; örnek destekleyici olabilir fakat zorunlu değildir. Soru kökü ve puanı korunur.

## Doğrulama

- 828/828 sözleşme; derleme sonrası 940/940 tam test.
- Tür denetimi ve Worker/hosting artifact kontrolü başarılı. Lint sıfır hata, iki mevcut uyarı.
- Regresyonlar standart/BEP × A/B × öğrenci/öğretmen için iki ayrı metnin birer kez basılmasını ve soru/anahtar sırasının aynı olmasını denetler; öğrenci dosyasına anahtar sızmaz.
- Gerçek kullanıcı dosyasından çıkarılan aynı soru setiyle yerel yeniden üretimde öğrenci 2, öğretmen 6 sayfa. Öğrencinin iki, öğretmenin altı sayfası görsel incelendi. Son soru ayrı bir öğrenci sayfasına taşmıyor, kesilme ve taşma görülmedi. Bu yerel yeniden üretim, canlıdan indirilen yeni dosya olarak sunulmaz.

Canlı dağıtım ve son kabul bu kaydın yazıldığı aşamada henüz yapılmadı.
