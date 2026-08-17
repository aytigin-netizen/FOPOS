import {
  validatePhaseCatalog,
  type PhaseCatalog,
  type PhaseDefinition,
} from "./phase-catalog";

function freezePhaseCatalog(catalog: Record<string, PhaseDefinition[]>): PhaseCatalog {
  for (const phases of Object.values(catalog)) {
    for (const phase of phases) Object.freeze(phase);
    Object.freeze(phases);
  }
  return Object.freeze(catalog);
}

const catalog2026Source: Record<string, PhaseDefinition[]> = {
  "FEL.10.1.1": [
    {
      label: "Hazırlık",
      duration: 5,
      facilitator: "Bilgelik, felsefe ve filozof sözcüklerini görünür kılar; öğrencilerden felsefeye ilişkin ilk çağrışımlarını ister.",
      learner: "Felsefenin ne olduğuna dair ilk düşüncesini ve merak ettiği bir soruyu yazar.",
      evidence: "İlk düşünce ve merak sorusu",
    },
    {
      label: "Merak Uyandırma",
      duration: 6,
      facilitator: "Felsefenin ortak bir tanımının mümkün olup olmadığına ilişkin birbirinden farklı kısa tanımlar sunar.",
      learner: "Tanımlar arasındaki gerilimi belirler ve neden tek bir tanımda uzlaşılmasının güç olabileceğini açıklar.",
      evidence: "Tanım gerilimi notu",
    },
    {
      label: "Sorgulama",
      duration: 12,
      facilitator: "Felsefenin anlamı, ortaya çıkışı ve tarihsel gelişimi arasında bağ kuran soru zincirini yönetir.",
      learner: "Felsefenin ortaya çıkış koşullarına ilişkin varsayımları sorgular ve felsefi bir soru üretir.",
      evidence: "Sorgulama zinciri ve felsefi soru",
    },
    {
      label: "Kavram İnşası",
      duration: 14,
      facilitator: "Bilgelik, felsefe, filozof, refleksiyon ve sorgulama kavramlarını örnek ve karşı örneklerle yapılandırır.",
      learner: "Kavramları, felsefi düşüncenin özellikleri ve gelişimiyle ilişkilendiren bir kavram ağı kurar.",
      evidence: "Felsefi kavram ağı",
    },
    {
      label: "Felsefi Tartışma",
      duration: 17,
      facilitator: "Felsefenin bilim, din ve sanatla ilişkisini karşılaştıran, açık fikirlilik ve gerekçelendirme kurallarına dayalı tartışmayı yönetir.",
      learner: "Alanların soru, yöntem ve amaçlarını karşılaştırır; bir iddiayı gerekçelendirip karşı görüşü adil biçimde yeniden kurar.",
      evidence: "Alan karşılaştırma ve argüman kaydı",
    },
    {
      label: "Uygulama",
      duration: 10,
      facilitator: "Güncel bir bireysel veya toplumsal sorunu felsefi incelemeye dönüştürme görevini açıklar.",
      learner: "Sorunu felsefi soru ölçütleriyle yeniden kurar ve felsefenin olası bireysel ya da toplumsal işlevini gösterir.",
      evidence: "Felsefi soru ve işlev kartı",
    },
    {
      label: "Biçimlendirici Değerlendirme",
      duration: 8,
      facilitator: "Anlam, gelişim, felsefi soru, alan ilişkileri ve işlev boyutlarını kapsayan kısa kontrol uygular.",
      learner: "Yanıtlarını bir kavram, bir örnek ve bir gerekçeyle destekler; akran dönütüyle düzeltir.",
      evidence: "Gerekçeli kısa yanıtlar",
    },
    {
      label: "Yansıtma",
      duration: 5,
      facilitator: "Başlangıç düşüncesini yeniden göstererek öğrencinin düşünme sürecindeki değişimi sorgular.",
      learner: "İlk düşüncesindeki değişimi veya sürekliliği bir öğrenme kanıtına dayanarak açıklar.",
      evidence: "Öz-yansıtma kaydı",
    },
    {
      label: "Kapanış",
      duration: 3,
      facilitator: "Felsefenin anlamı, gelişimi ve işlevini birbirine bağlayan sınıf sentezini tamamlar.",
      learner: "Felsefenin işlevine ilişkin bir sonuç ve araştırmaya değer yeni bir soru teslim eder.",
      evidence: "Sonuç ve çıkış sorusu",
    },
  ],
  "FEL.10.2.2": [
    {
      label: "Hazırlık",
      duration: 5,
      facilitator: "Gündelik yaşamdan kısa bir iddia ve gerekçe örneği sunarak argümanın parçalarını fark ettirir.",
      learner: "İddia ile onu destekleyen ifadeleri ilk tahminine göre işaretler.",
      evidence: "İlk argüman işaretlemesi",
    },
    {
      label: "Merak Uyandırma",
      duration: 6,
      facilitator: "Aynı sonuca ulaşıyor görünen fakat mantıksal yapıları farklı iki örnek sunar.",
      learner: "Örneklerden hangisinin daha güçlü olduğunu seçer ve seçim ölçütünü yazar.",
      evidence: "İlk güçlülük ölçütü",
    },
    {
      label: "Sorgulama",
      duration: 12,
      facilitator: "Bir ifadeyi argüman yapan şeyin ne olduğuna ve tutarlılığın nasıl sınanacağına ilişkin soru zincirini yönetir.",
      learner: "Mantık, akıl yürütme, argüman, öncül, sonuç ve tutarlılık kavramlarına yönelik sorular üretir.",
      evidence: "Mantıksal sorgulama notu",
    },
    {
      label: "Kavram İnşası",
      duration: 14,
      facilitator: "Mantık ve argümantasyonun temel kavramlarını örnek, karşı örnek ve sınıflandırma yoluyla yapılandırır.",
      learner: "İfadeleri kavramsal özelliklerine göre sınıflandırır ve kavramlar arasındaki ilişkileri gösterir.",
      evidence: "Mantık ve argümantasyon kavram haritası",
    },
    {
      label: "Felsefi Muhakeme",
      duration: 17,
      facilitator: "Bağlamı korunmuş bir metindeki argümanı öncül ve sonuç bileşenlerine ayırma çalışmasını yönetir.",
      learner: "İfadeleri öncül ve sonuç olarak çözümler, çıkarım bağını açıklar ve olası tutarsızlıkları belirler.",
      evidence: "Öncül–sonuç çözümleme çizelgesi",
    },
    {
      label: "Uygulama",
      duration: 10,
      facilitator: "Güncel bir iddiayı anlamını değiştirmeden yeniden ifade etme ve argüman şemasına dönüştürme görevi verir.",
      learner: "İddiayı nesnel biçimde kendi cümleleriyle yeniden ifade eder; öncül ve sonuçlardan oluşan şemayı kurar.",
      evidence: "Yeniden ifade ve argüman şeması",
    },
    {
      label: "Biçimlendirici Değerlendirme",
      duration: 8,
      facilitator: "Kavram tanıma, öncül–sonuç ayrımı, tutarlılık ve nesnel yeniden ifade boyutlarını ölçen kısa görev uygular.",
      learner: "Bir argümanı çözümler, yanıtını mantıksal yapıya dayanarak gerekçelendirir ve dönütle düzeltir.",
      evidence: "Gerekçeli argüman çözümlemesi",
    },
    {
      label: "Yansıtma",
      duration: 5,
      facilitator: "İlk güçlülük ölçütünü yeniden göstererek öğrencinin kararındaki değişimi sorgular.",
      learner: "Bir argümanı değerlendirirken artık kullandığı ölçütleri ve değişen düşüncesini açıklar.",
      evidence: "Muhakeme öz-yansıtması",
    },
    {
      label: "Kapanış",
      duration: 3,
      facilitator: "Mantıklı düşünme ile dürüst ve sorumlu iletişim arasındaki bağı vurgular.",
      learner: "İyi bir argümanın iki özelliğini ve açık kalan bir sorusunu teslim eder.",
      evidence: "Argüman ölçütleri çıkış bileti",
    },
  ],
};

validatePhaseCatalog(catalog2026Source);

export const philosophyPhaseCatalog2026 = freezePhaseCatalog(catalog2026Source);
