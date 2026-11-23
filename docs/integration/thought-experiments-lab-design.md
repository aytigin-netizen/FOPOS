# Düşünce Deneyleri Laboratuvarı — FOPOS Entegrasyon Tasarımı

**Durum:** İlk pilot statik katalog ve arayüz uygulaması başladı  
**Kaynak depo:** `aytigin-netizen/fopos-db`  
**Hedef depo:** `aytigin-netizen/FOPOS`  
**Hedef dal:** `integration/thought-experiments-lab`  
**Tasarım tarihi:** 23 Kasım 2026  
**Kapsam:** İlk pilot için içerik ve etkileşim arayüzü; üretken yapay zekâ ve canlı sınıf entegrasyonu bu aşamanın dışında.

## 1. Karar özeti

Düşünce Deneyleri Laboratuvarı, FOPOS'a bağımsız bir öğretmen modülü olarak eklenecek; ancak fopos-db'deki bileşen ve veri katmanı doğrudan kopyalanmayacaktır. İlk sürüm, doğrulanmış ve sürümlenmiş statik deney kataloğu ile tarayıcı içi etkileşimlerden oluşacaktır. Öğretmenin kendi oluşturduğu deneyler ve favorileri, sonraki alt aşamada FOPOS'un öğretmen hesabına bağlı D1 kalıcılık katmanına taşınacaktır.

- FOPOS'un mevcut kimlik, oturum, yetki ve D1 altyapısı korunur.
- Müfredatın tek doğruluk kaynağı FOPOS `2026.1` kayıt defteridir.
- Öğrenci adı, okul numarası, e-posta veya başka doğrudan tanımlayıcı veri laboratuvarın veri modeline alınmaz.
- Deney metinleri ve öğretmen tarafından onaylanan içerik, üretken yapay zekâ olmadan çalışır.
- fopos-db Express/Node, PostgreSQL, Firestore, Firebase ve Gemini/OpenAI uçları bu modül için taşınmaz.
- Canlı sınıf, QR katılımı, sınıf oylaması ve öğrenci yanıtlarının kalıcı toplanması ayrı mimari ve gizlilik kararı gerektirir; ilk pilotta kapalıdır.

## 2. Kullanıcı ve pedagojik akış

Birincil kullanıcı öğretmendir. Modül, ders öncesi hazırlıkta ve ders sırasında projeksiyon/tahta üzerinden kullanılacak şekilde tasarlanır.

1. Öğretmen sınıf düzeyini (10 veya 11) ve felsefi temayı seçer.
2. Katalogdan bir düşünce deneyi açar; amaç, senaryo, temel ikilem ve kavramları inceler.
3. Öğrencilere önce bireysel düşünme süresi verir; ardından A/B veya açık uçlu konumlandırma yaptırır.
4. Öğrencilerden seçimlerini gerekçelendirmelerini ve güçlü bir karşı argüman kurmalarını ister.
5. Öğretmen, tartışmayı soru seti ve kolaylaştırıcı ipuçlarıyla derinleştirir.
6. Ders sonunda transfer/çıkış sorusuyla öğrenmeyi toparlar.

Modül bir içerik sunucusu değil, öğretmenin pedagojik kararını destekleyen bir kolaylaştırma aracıdır. Öğretmen seçimi, tartışma biçimini ve değerlendirmeyi kendisi belirler.

## 3. İlk sürüm kapsamı

### Dahil

- Deney kataloğu: arama, tema ve sınıf filtresi.
- Deney ayrıntısı: kısa tanıtım, senaryo, ikilem, felsefi kavramlar, tartışma soruları.
- Öğretmen sunum görünümü: okunaklı, projeksiyona uygun, dikkat dağıtmayan ekran.
- Etkileşimli düşünme: seçenek seçimi, gerekçe yazma alanı ve karşı argüman istemleri; ilk sürümde yalnız geçici istemci durumu.
- Öğretmen kolaylaştırıcı notları ve ders sonu transfer sorusu.
- Müfredat bağlantısı: yalnız FOPOS kayıt defterinde bulunan ve doğrulanan öğrenme çıktıları için.
- Erişilebilirlik: klavye ile kullanım, görünür odak, etiketli kontroller, yeterli kontrast ve dar ekran uyumu.

### İlk sürüm dışında

- Yapay zekâ ile yeni deney üretimi veya deney görseli üretimi.
- Öğrenci girişi, QR kodu, canlı sınıf oturumu, gerçek zamanlı oy ve katılımcı listesi.
- Öğrenci bazında yanıt, not, davranış işareti veya kişisel profil saklama.
- Firebase/Firestore eşitlemesi ya da tarayıcı localStorage'ını kalıcı veri deposu olarak kullanma.
- Otomatik başarı puanı, öğrenci sıralaması veya öğretmen yerine pedagojik karar verme.

## 4. FOPOS mimarisine yerleşim

### Ön yüz

- Modül, FOPOS'un mevcut modül gezinmesine yeni bir görünüm olarak eklenir.
- Bağımsız ekranların ilk istemci paketinden ayrılması kuralına uyar; `app/ClientApp.tsx` içinde dinamik `lazy(() => import(...))` ile yüklenir.
- Yükleme/hata durumları mevcut `AsyncModuleBoundary` bileşenini kullanır.
- Kaynak bileşen fopos-db'deki `ThoughtExperimentsLab.tsx` yalnız davranış ve içerik referansı olarak incelenir. FOPOS tasarım sistemi, bileşen sınırları, tipleri ve erişilebilirlik standartlarına göre yeniden kurulur.
- Modül kendi içinde katalog, filtre, deney ayrıntısı ve sunum/kolaylaştırma alt bileşenlerine ayrılır. Tek büyük bileşen halinde taşınmaz.

Önerilen yerleşim:

```text
app/modules/thought-experiments/
  ThoughtExperimentsModule.tsx
  components/
    ExperimentCatalog.tsx
    ExperimentDetail.tsx
    ExperimentPresentation.tsx
    FacilitatorPanel.tsx
  data/
    experiments.ts
  domain/
    experiment-types.ts
    curriculum-link.ts
  styles/
    thought-experiments.css
```

Dosya yerleşimi öneridir; mevcut FOPOS modül ve stil düzeni incelenerek uygulama aşamasında kesinleştirilir.

### Müfredat bağlantısı

- FOPOS `src/core/curriculum/curriculum-registry.ts` ve yüklenen `philosophy@2026.1` paketi tek otoritedir.
- fopos-db'deki `TYMM_CURRICULUM_TOPICS`, `tymmCode`, `unitId` veya benzeri alanlar doğrudan FOPOS'a aktarılmaz.
- Her deney, FOPOS'un gerçek öğrenme çıktısı kodlarına bağlanır. Kod ve açıklama, kayıt defterinden/paketten çözülür; deney veri dosyasında müfredat metninin ikinci kopyası tutulmaz.
- Kaynakla eşleşmesi kanıtlanamayan deney, yanlış veya tahmini bir çıktı koduyla gösterilmez. `Müfredat bağlantısı doğrulanmadı` olarak işaretlenir ve müfredat filtrelerinde resmi eşleşme gibi sunulmaz.
- Felsefe 10 ve 11 kapsamı ilk pilotun sınırıdır. Katalogda başka disiplin etiketi bulunması yeni branşın etkin olduğu anlamına gelmez.

## 5. Alan modeli ve içerik sözleşmesi

İlk pilotun statik katalog kaydı için önerilen tip:

```ts
type ThoughtExperiment = {
  id: string;                 // kalıcı, değişmez slug
  contentVersion: string;     // ör. 1.0.0
  title: string;
  subtitle: string;
  summary: string;
  scenario: string;
  dilemma: {
    question: string;
    options?: Array<{ id: string; label: string; perspective: string }>;
  };
  concepts: string[];
  discussionQuestions: string[];
  counterArgumentPrompts: string[];
  transferQuestion: string;
  facilitatorNotes: string[];
  gradeLevels: Array<10 | 11>;
  themes: string[];
  curriculumLinks: Array<{
    datasetVersion: "2026.1";
    subjectCode: "philosophy";
    outcomeCode: string;
    verification: "verified" | "pending";
    evidenceRef?: string;
  }>;
  sourceNotes: string[];
  review: {
    status: "draft" | "pedagogically_reviewed" | "approved";
    reviewedAt?: string;
  };
};
```

Kurallar:

- `id` içerik revizyonlarında değişmez; içerik değişikliği `contentVersion` artırır.
- Her deneyde yaş/sınıf uygunluğu, tartışma hedefi, temel kavram ve kaynak notu bulunur.
- Felsefi görüşler tek doğru cevap gibi kodlanmaz. Seçenekler, gerekçelendirme ve karşı görüş üretimini teşvik eder.
- Filozoflara atfedilen görüşlerde eser/bağlam kaynağı belirtilir; doğrulanamayan atıflar kesin ifade olarak kullanılmaz.
- Kaynak görselleri lisans ve köken kontrolü yapılmadan içeriğe eklenmez.
- İçerik onayı öğretmen/alan uzmanı incelemesinden geçer; otomatik üretim onay yerine geçmez.

## 6. Kalıcılık ve API kararı

### Pilot 1: kalıcılık gerektirmeyen deneyim

İlk arayüz pilotunda katalog statik, etkileşimler oturum içi geçici state olacaktır. Yenileme sonrası öğrenci/katılımcı yanıtı geri yüklenmez. Böylece henüz veri sözleşmesi ve silme/retention politikası belirlenmemiş sınıf verileri toplanmaz.

### Pilot 2: öğretmen hesabına bağlı kişisel kayıtlar

Favoriler ve öğretmenin özel deneyim taslakları kalıcılaştırılacaksa, FOPOS D1 üzerinde modüle özgü tablo/repository/API tasarlanmalıdır. Önerilen tablolar:

- `thought_experiment_favorites`: `user_id`, `experiment_id`, `created_at`; benzersiz anahtar `(user_id, experiment_id)`.
- `thought_experiment_custom_records`: `id`, `user_id`, `content_json`, `content_version`, `created_at`, `updated_at`, `deleted_at`.

Kişisel kayıtlar yalnız sahibi tarafından okunur/değiştirilir. Sunucu her istekte FOPOS oturum kimliğini doğrular; kullanıcı kimliği istemci gövdesinden kabul edilmez. Yazma istekleri aynı-origin kontrolünden ve şema/boyut doğrulamasından geçer. Silme işlemi ve saklama süresi açıkça tanımlanır.

**Önemli:** Mevcut `/api/pedagogical-records` uç noktası, katı `PedagogicalRecord` sözleşmesi ve müfredat/öğretim yılı kuralları içindir. Düşünce deneyi JSON'unu bu uç noktaya zorla yazmak doğru değildir. Bu modülün kişisel kayıtları için ayrı, dar kapsamlı bir API ve D1 şeması gerekir. İlk statik pilotta bu API'ye ihtiyaç yoktur.

## 7. Güvenlik ve mahremiyet

- FOPOS kimlik/oturum mekanizması tek kimlik kaynağıdır; Firebase kimliği veya istemci e-postası kullanılmaz.
- İlk sürümde öğrenci kimliği, ad-soyad, okul numarası, e-posta, fotoğraf, ses veya bireysel puan istenmez.
- Açık uçlu öğrenci yanıtları ilk sürümde sunucuya gönderilmez ve kalıcı saklanmaz.
- İçerik üretimi için harici AI çağrısı yapılmaz; bu nedenle öğrenci verisi dış modele taşınmaz.
- İleride AI özelliği eklenirse yalnız öğretmen tarafından sağlanan, öğrenci kimliğinden arındırılmış içerik gönderilebilir; ayrı gizlilik sözleşmesi, oran sınırı, maliyet kontrolü ve testler zorunludur.
- İstemciye gizli anahtar konulmaz. API ve yetki kontrolleri sunucu tarafında uygulanır.
- Gerçek öğrenci verisi test fixture'ı veya demo içeriği olarak kullanılmaz.

## 8. fopos-db'den alınacak ve alınmayacak parçalar

| Kaynak unsur | Karar | Gerekçe |
|---|---|---|
| Deney katalog içeriği ve tema çeşitliliği | Seçerek yeniden düzenle | Pedagojik inceleme ve FOPOS veri sözleşmesi gerekir |
| Senaryo/ikilem/karar çatallanması etkileşimleri | Yeniden uygula | FOPOS UI ve erişilebilirlik standardı |
| Sokratik soru ve kolaylaştırıcı istemleri | İçerik referansı olarak kullan | Çıktı ve sınıf düzeyine göre doğrulama |
| Favori ve özel deney localStorage modeli | Taşıma | FOPOS öğretmen hesabı ve D1 yaklaşımı |
| `TYMM_CURRICULUM_TOPICS` | Taşıma | Müfredat tek kaynağı FOPOS 2026.1 |
| Express `server.ts` ve API uçları | Taşıma | FOPOS Workers mimarisiyle uyumsuz |
| Firebase/Firestore senkronizasyonu | Taşıma | FOPOS D1 veri sınırı ve tek hesap modeli |
| Gemini/OpenAI görsel/metin üretimi | İlk aşamada dışarıda | Kimlik, gizlilik, maliyet ve servis sözleşmesi yeniden tasarlanmalı |
| Canlı sınıf/oylama/QR | İlk aşamada dışarıda | Gerçek zamanlı oturum ve öğrenci verisi için ayrı mimari karar |

## 9. Test ve kabul ölçütleri

### İçerik ve müfredat sözleşmeleri

- Her deney benzersiz ve kararlı bir `id` taşır.
- Zorunlu alanlar, sınıf seviyeleri, tema ve soru listeleri şema doğrulamasından geçer.
- `verified` müfredat bağlantılarının tamamı FOPOS `philosophy@2026.1` paketinde bulunur.
- Kayıt dışı/yanlış öğrenme çıktısı kodu resmi eşleşme olarak gösterilemez.
- Eski veya kaynak dışı müfredat verisi modül paketine eklenemez.

### UI ve erişilebilirlik

- Modül lazy-load edilir; ilk istemci paketine eklenmez.
- Yükleniyor ve hata durumları `AsyncModuleBoundary` üzerinden görünür.
- Katalog arama/filtre, klavye ve dar ekran testlerinden geçer.
- Deney seçimi ve sunum görünümü modül dışındaki ders planı durumunu sıfırlamaz.
- Seçenek seçimi, gerekçe alanı ve sıfırlama davranışı deterministik test edilir.

### Gizlilik ve güvenlik

- İlk sürümde öğrenci verisi içeren ağ isteği bulunmaz.
- Öğrenci yanıtları yenileme sonrası geri yüklenmez.
- İleride eklenecek öğretmen kayıt API'si oturumsuz erişimi reddeder; kullanıcılar arası erişim izolasyonu test edilir.
- Gizli anahtarlar ve harici AI çağrıları istemci paketinde bulunmaz.

### Kalite kapısı

- Yeni testler mevcut FOPOS sözleşme testleriyle birlikte çalışır.
- `npm run test:contracts`, `npm run typecheck`, `npm run lint` ve `npm run build` başarılı olmadan PR kabul edilmez.
- Test kapsamı, modülün davranış ve mahremiyet sınırlarını doğrular; yalnız kaynak-regex testleriyle yetinilmez.

## 10. Uygulama aşamaları

1. **Aşama A — İçerik envanteri:** fopos-db deneylerini tek tek çıkar; kaynak, sınıf seviyesi, kavram, soru ve müfredat adayını kaydet.
2. **Aşama B — Pedagojik doğrulama:** deney metinlerini ve filozof atıflarını incele; FOPOS 2026.1 çıktı bağlantılarını kanıtla.
3. **Aşama C — Statik katalog ve UI:** yalnız onaylı içeriklerle katalog, ayrıntı ve sunum akışını geliştir.
4. **Aşama D — Test ve erişilebilirlik:** içerik, modül sınırı, klavye, responsive ve gizlilik sözleşmelerini ekle.
5. **Aşama E — Öğretmen kişisel kayıtları:** favori/özel deney ihtiyacı doğrulanırsa D1 migration, repository ve API tasarla.
6. **Aşama F — Sonraki ürün kararları:** AI üretimi ve canlı sınıf, ayrı güvenlik/mahremiyet/mimari denetimden sonra ele alınır.

Her aşama kendi kabul ölçütlerini karşılamadan bir sonraki aşamaya geçilmez.

## 11. Açık kararlar

Kodlamaya başlamadan önce çözülmesi gereken tek ürün kararı, ilk pilotun hangi içerik setiyle açılacağıdır. Önerim, ilk teslimatta 6–8 adet yüksek kaliteli ve kaynaklandırılmış deneyle sınırlı bir katalog oluşturmaktır. Sayı hedef değil; içerik doğruluğu ve ders içinde kullanılabilirlik önceliklidir.

Diğer kararlar tasarım önerisi olarak sabitlenmiştir: FOPOS ana ürün, D1 tek kalıcı veri katmanı, 2026.1 tek müfredat kaynağı, AI ve canlı sınıf ilk sürüm dışında.


## 11. Öğretmen onayı ve ilk uygulama durumu

- Sekiz pilot kayıt öğretmen tarafından onaylandı: 10. sınıfta dört, 11. sınıfta dört kayıt.
- Antigone etkinliğine FEL.11.6.2 sürecini destekleyen hak/özgürlük çözümlemesi ve gerekçeli kısa görüş metni adımları eklendi.
- İçerik türleri ayrı değerlerle tutulur: `thought_experiment`, `allegory`, `dilemma`.
- Statik içerik `app/modules/thought-experiments/data/experiments.ts` içinde; tip sözleşmesi `domain/experiment-types.ts` içindedir.
- Modül `ClientApp` içinden lazy-load edilir ve FOPOS gezinmesinde bağımsız ekran olarak açılır.
- Öğrenme çıktısı kodu ve açıklaması, `getCurriculumContext("philosophy")` üzerinden FOPOS kanonik müfredat paketinden çözülür. Modülde ikinci bir müfredat açıklaması kopyası tutulmaz.
- Katalog arama, sınıf ve içerik türü filtreleri; ayrıntı, öğretmen notları, kaynak bağlantıları ve sunum görünümü uygulanmıştır.
- Sınıf içi görüş seçimi ve gerekçe alanı yalnızca sayfa belleğinde tutulur; API, localStorage veya harici AI çağrısı kullanılmaz.
- İlk uygulama dalı: `integration/thought-experiments-lab`. PR, merge ve dağıtım henüz yapılmamıştır.
