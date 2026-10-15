# Ders programı sınıf ve ders kapsamı — 15 Ekim 2026

Ders programı formu da sınıf listesi kataloğuna bağlandı. Her ders için 9, 10, 11, 12. sınıflar; Felsefe, Sosyoloji, Psikoloji ve Mantık seçilebilir. Program kaydı, öğretmenin etkin içerik üretim branşlarından ve müfredatın desteklediği sınıf sayısından bağımsızdır. Program doğrulaması 9. sınıfı kabul eder. Veri biçimi sürümü ve depolama anahtarı değişmedi; önceki program satırları korunur. Program hâlâ tarayıcıda, hesap ve öğretim yılına göre saklanır; bu paket sunucuya program kaydı eklemez.

Hazır içerik bulunmayan ders/sınıf seçildiğinde form ünite olmadan kaydedilebilir; bilinmeyen müfredat yüklenmez. Bugün panelinde bu satırlar ders adıyla, Program kaydı durumu ve Düzenle eylemiyle görünür. Bunlar hatalı bir Plan yok uyarısına veya hazırlık bildirimine dönüşmez. Günlük plan üretimi ayrıca korunur; 9. sınıf veya etkin olmayan ders için başka sınıfın içeriği açılmaz. Üretim branşı ayarları ve resmî müfredat değişmedi.

Doğrulama: TypeScript, 858 sözleşme testi ve 970 testlik tam paket başarılı. Ek regresyon 16 ders/sınıf birleşiminin program doğrulaması ve yeniden okunmasını, eski bir program satırının korunmasını ve formun bağımsız katalog kullanmasını sınar. Üretim Worker derlemesi başarılı. Desteklenen tarayıcı kontrol becerisi bulunmadığından görsel tarayıcı kabulü yapılamadı.
