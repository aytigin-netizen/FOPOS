# FEL.10.3.1 havuzu: felsefi doğruluk taraması düzeltmeleri (17 Ekim 2026)

Bu kayıt öğretmen içerik onayı değildir. `grade10PoolContentApproval` boş kalır; havuz üretime kapalıdır (#236).

120 görev inceleme üreticisinden çıkarılarak tek tek okundu. Düzeltilenler (K kavram, P problem, D değerlendirme, İ inceleme; 0'dan sıra):

- K19: anahtar "düşünce madde değildir"i kesin kabul ediyordu; tanım gereği yer kaplamayanın madde sayılmadığı, düşüncenin yer kaplayıp kaplamadığının ayrıca tartışıldığı belirtildi.
- İ27: örnek öncül karşı görüşü (süreklilik) destekliyordu; öğrencinin kalıcı dayanak argümanını güçlendiren öncül yazıldı.
- D15: kum kalesi örneği töz görüşü için zorlayıcı değildi (yeniden yapılan kale başka bir kaledir) ve "karşı örnek" fazla iddiaydı; bando örneğiyle ve "gösterme borcu" dilinde yeniden yazıldı.
- D11: "yanma sürecinin düzeni"ni töz sayan anahtar D22 ile çelişiyordu; töz görüşünün göstermesi gereken şey ve güçlüğü olarak yazıldı.
- P13: vakada olmayan söz arkadaşa atfediliyordu; vakadaki cümle kullanıldı.
- K7, K11: uygulama kökü anahtarın sınırını veriyordu; kökten çıkarıldı, anahtarda sınırı belirtmek yanıtı güçlendiren unsur oldu.
- K16 yazım, K13 "sıvı", İ4 (Ece'nin sözü yalnız töz diye okutuluyordu), İ12 (kavram/problem karışıklığı), P9 ("elektron" kapsam dışı), D5 (sadelik asimetrisi).
- Değerlendirme düzeyindeki 18 anahtara "gerekçeli alternatif yanıtlar kabul edilir" eklendi.

Bilerek değiştirilmedi: P12 ve İ18'deki "sonuç öncülün içine yerleştirilmiş olur" cümlesi onaylı vakada da bulunur; karar öğretmene aittir.

Doğrulama: `npm run test:contracts` 893/893, tsc, eslint. İki yeni test bu kalıpların havuza geri girmesini engeller.
