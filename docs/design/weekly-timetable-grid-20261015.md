# Haftalık ders çizelgesi

Kullanıcının paylaştığı iki örnek izlenerek ders programı düzenleyicisi günler satırlarda, dersler sütunlarda olacak biçimde düzenlendi. Pazartesi–Pazar, ders başlangıç/bitiş aralıkları, ara sütunları, sınıf/şube ve açık ders adı görünür. Bugünün satırı FOPOS yeşiliyle vurgulanır. Telefonda yatay kaydırma ve sabit gün sütunu kullanılır. Boş hücre gün/saat seçili yeni ders formunu, dolu hücre düzenleme formunu açar. Yalnız belirli tarihe eklenen dersler haftalık tekrar gibi gösterilmez; ayrı listede korunur.

Başlangıçta ilk örnekteki sekiz ders ve ara saatleri önerilir. Öğretmen Ders ve ara saatleri bölümünden okulunun gerçek saatlerini tanımlar; 24 aralığa kadar ders/ara ekleyebilir. En az bir ders gerekir, ters veya çakışan aralıklar reddedilir. İkinci örnekteki gibi on ders saati de tanımlanabilir. Görsellerdeki sınıf/ders kayıtları otomatik eklenmedi.

TeachingTimetable v1 biçimine isteğe bağlı periods alanı eklendi (start, end, kind). Mevcut ders kimlikleri, saatleri, tarih istisnaları ve plan bağlantıları değiştirilmez. Tanımlanan aralıklara uymayan eski dersler Ek saat sütununda görünür; saat düzenlemek dersleri taşımaz/silmez. Eski v1 kayıtları aynen okunur; periods mevcut kalıcı hesap programıyla aynı atomik revizyonlu API üzerinden saklanır. Yeni tablo veya SQL geçişi yoktur. Öğrenci kayıtlarına dokunulmaz.

Davranış testleri gün sırası, tek günlük ders ayrımı, ek saatlerde eski kayıtların görünürlüğü, saat aralıklarının kalıcı serileştirilmesi ve doğrulanması ile ders/plan bağlantılarının korunmasını kapsar. Desteklenen tarayıcı kontrol becerisi bulunmadığından görsel tarayıcı kabulü yapılamadı.
