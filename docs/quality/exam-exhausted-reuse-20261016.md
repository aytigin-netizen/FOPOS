# Havuz tükendiğinde sınav oluşturmaya devam etme

## Kullanıcı kararı ve sorun

16 Ekim 2026: Aytekin, Hukuk ve Felsefe ünitesinde “Bu belirtke için farklı varyant kalmadı” uyarısı nedeniyle sınav oluşturamadığını bildirdi ve soru havuzu bitse de sınav oluşturabilmeyi istedi. Önceki tekrarsız üretim kararı, bu yeni açık istekle iki akışa ayrılır: kullanılmamış sorulardan üretim ve havuz bitince öğretmenin açıkça seçtiği yeniden kullanım. Yeniden kullanım yeni soru eklemek anlamına gelmez.

## Davranış

- Kullanılmamış A/B bandı varsa mevcut tekrarsız üretim sürer.
- Seçilen belirtkeye yetecek kullanılmamış bant kalmadığında düğme “Önceki sorularla sınav oluştur” olur ve etkin kalır. Yanında önceki sınavlarda kullanılmış soruların gelebileceği açıklanır.
- Öğretmen bu düğmeye bastığında yeniden kullanım isteği sunucuya açık boolean alanla gönderilir. Açık seçim olmadan tükenmiş havuz otomatik tekrara dönmez.
- Tek sınavdaki A ve B yine ayrı sorulardan üretilir, aynı çıktı/bileşen/düzey ve puan ilişkisi korunur. Yapısal olarak bir A/B çiftine bile yetmeyen belirtke bu seçenekle aşılmaz.
- Sonuç alanında yeniden kullanım görünür. “Tekrar yok” metni yalnız mevcut kitapçığı kapsadığını açıklar. Öğretmenin kalıcı onay notu yeniden kullanım seçimini kaydeder.
- Üretim sırasında başka cihaz son kullanılmamış bandı tüketirse istek sessizce yeniden kullanıma dönüşmez; hata sonrasında hesap geçmişi yenilenerek uygun düğme gösterilir.

## Veri ve atomiklik

Mevcut `exam_generation_history.rounds_json` içindeki çıktı kodlarının tekrarsız üretim sayaçları azaltılmaz veya silinmez. Yeniden kullanım için aynı JSON'da `reuse:<çıktı kodu>` anahtarlarında ayrı artan sayaçlar bulunur. Kapsamdaki en yüksek yeniden kullanım sayacı, A/B çiftinin sığacağı aralıkta döndürülür; her rezervasyon aynı compare-and-swap ile yazılır. İki sekme aynı sayacı eşzamanlı tüketemez; tam bir döngü sonunda eski soruların yeniden gelmesi bu akışın açıklanan davranışıdır.

Yeni görevler havuza eklenince tekrarsız üretim sayacı korunmuş olduğundan yeni bantlar tekrar kullanılabilir. Yeniden kullanım sayacı bunları tüketmiş gibi göstermez. Hesap, ders, veri seti ve çıktı ayrımı korunur. Bozuk geçmiş sıfırlanmaz; doğrulama hatası verir. Öğrenci listesi, ders programı ve diğer tablolar değişmez; şema geçişi yoktur. Hesap silinmesinde aynı geçmiş satırıyla yeniden kullanım sayaçları da silinir.

## Doğrulama

Hedefli 21 test ve TypeScript geçti. Gerçek SQLite testlerinde: tükenme sonrası 12 rezervasyon, eski tekrarsız sayacın korunması, iki cihaz yarışı, başka öğretmen/çıktı ayrımı, büyüyen havuzun yeni bandına geçiş, bozuk kayıt ve yetersiz A/B reddi doğrulandı. Gerçek üretici işlevleriyle Hukuk ve Felsefe için 5 ve 8 soruluk üretimlerin her biri tükenme sonrasında 12 kez çalıştırıldı: her seferinde A/B toplamında 10 veya 16 farklı soru, kitapçık başına 100 puan ve cevap/ölçüt varlığı doğrulandı. Düğmenin tükenmeye değil yapısal A/B kapasitesine bağlı olduğu mevcut arayüz sözleşmesinde güncellendi.

Tür denetimi temiz; değişen kod/testlerde eslint temiz; üretim Worker derlemesi ve tam paket 1015/1015 başarılı. Dağıtım sonucu PR kapanışına kaydedilecektir. Desteklenen tarayıcı kontrol becerisi bulunmadığından gerçek öğretmen oturumuyla tıklama ve canlı DOCX görsel kabulü bu teknik testlerin yerine geçmiş sayılmaz.
