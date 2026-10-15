# Sınıf listesi kapsamı — 15 Ekim 2026

Kullanıcı 9 ve 12. sınıfları, Sosyoloji / Psikoloji / Mantık derslerini sınıf oluşturma seçeneklerine eklemeyi istedi.

Sınıf listesi kataloğu içerik üretim kataloğundan ayrıldı. Her öğretmen Felsefe, Sosyoloji, Psikoloji ve Mantık için 9, 10, 11, 12. sınıf çalışma alanı oluşturabilir, Excel listesi yükleyebilir ve kalıcı kaydedebilir. Bu işlem öğretmenin üretim branşı atamasını, varsayılan dersini veya müfredat paketlerini değiştirmez. Geçerli sınıf kaydı için hazır üretim müfredatı/branş ataması şartı kaldırıldı; öğretmen, yıl, ders, sınıf ve şube ayrımı korunur.

Hazır olmayan ders/sınıfın analiz ve performans düğmeleri kapalıdır. Ana menüden aynı modüllere geçilse de açıklamalı koruma gösterilir. Seçili Psikoloji/Mantık veya 9. sınıf kaydı, başka bir dersin müfredatıyla işlenmez; Öğrenci Listeleri ders adını bağımsız katalogdan alır. Resmî müfredat, üretim etkinliği ve plan/sınav yetkileri değişmedi. Yalnız liste için eklenen atanmamış dersler, mevcut öğretmen branşı ayarlarını kilitlemez.

İlk sınıf formu, Sınıf ve Şubeler, sınıf seçici ve sunucu doğrulamaları birlikte güncellendi. Önceki kalıcı öğrenci listesi özelliği korunur. Veri tabanı şeması değişmedi.

Doğrulama: TypeScript ve 857 sözleşme testi başarılı. Gerçek SQLite testi 4 ders × 4 sınıf = 16 çalışma alanını oluşturup her birine ayrı öğrenci listesi yazar ve yeniden okur; ikinci hesabın erişimini reddeder. Hazır olmayan üretim kapsamının kapalı kalması ayrıca doğrulanır. Üretim Worker derlemesi başarılı. Desteklenen tarayıcı kontrol becerisi bulunmadığından canlı kullanıcı arayüzü görsel kabulü yapılamadı.
