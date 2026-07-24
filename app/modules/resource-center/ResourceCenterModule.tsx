"use client";

import { Accessibility, ArrowRight, BookOpen, CheckCircle2, Clock3, FileText, Search, ShieldAlert, ShieldCheck, Target } from "lucide-react";
import { useMemo, useState } from "react";
import type { Grade, Unit } from "../../data/curriculum";
import type { AppView } from "../../components/navigation/AppNavigation";

const normalize = (value: string) => value.toLocaleLowerCase("tr-TR").replace(/\s+/g, " ").trim();

const bepGuides = [
  {title:"Okuma ve anlama",need:"Uzun yönergelerde ana görevi ayırt etmekte zorlanma",adaptations:["Yönergeyi kısa ve tek işlemli adımlara bölün.","Anahtar kavramları kalınlaştırın; örnek soru biçimi gösterin.","Öğrenme çıktısını koruyarak metin yükünü azaltın."],avoid:"Kazanımı daha alt bir kazanımla sessizce değiştirmeyin."},
  {title:"Yazılı ifade",need:"Düşüncesini yazıya aktarırken içerikten bağımsız güçlük yaşama",adaptations:["Cevap için kavram haritası veya maddeleme şablonu sunun.","Uygunsa sözlü yanıt ya da bilgisayarla yazma seçeneği tanıyın.","İçerik puanı ile yazım-düzen ölçütünü ayrı değerlendirin."],avoid:"Yazı güçlüğünü felsefi düşünme yetersizliği olarak yorumlamayın."},
  {title:"Dikkat ve işlem yükü",need:"Çok uyaranlı sayfada görevi sürdürmekte zorlanma",adaptations:["Her sayfada daha az soru ve daha geniş boşluk kullanın.","Uzun görevi görünür aşamalara ayırın.","Kısa, planlı ara ve yeniden odaklanma ipucu sağlayın."],avoid:"Aynı anda çok sayıda yönerge veya dekoratif uyaran eklemeyin."},
  {title:"Görsel erişim",need:"Küçük punto, düşük karşıtlık veya yoğun yerleşimde erişim güçlüğü",adaptations:["Okunaklı yazı tipi, büyütülmüş punto ve güçlü karşıtlık kullanın.","Grafik ve görselleri kısa metinsel açıklamayla destekleyin.","Basılı ya da dijital büyütme seçeneğini önceden deneyin."],avoid:"Bilgiyi yalnız renk, konum veya görsel işaretle aktarmayın."},
  {title:"İşitsel ve dilsel erişim",need:"Sözlü yönergeyi izleme veya akademik dili çözümlemede güçlük",adaptations:["Sözlü yönergeyi yazılı ve görsel biçimde de sunun.","Terimleri değiştirmeden kısa açıklama ve kavram listesi verin.","Öğrenciden yönergeyi kendi sözüyle yeniden ifade etmesini isteyin."],avoid:"Temel felsefe kavramlarını anlamı değiştirecek biçimde sadeleştirmeyin."},
  {title:"Zaman ve ortam",need:"Standart süre ya da sınav ortamının performansı belirgin biçimde sınırlaması",adaptations:["Onaylı BEP kararına uygun ek süreyi önceden belirleyin.","Düşük uyaranlı ortam ve uygun oturma düzeni sağlayın.","Uyarlamayı sınav anında değil, öğretim sürecinde de kullandırın."],avoid:"Birim kararı olmadan kişiye özel süre veya ortam kararı üretmeyin."},
] as const;

const documentGuides: {title:string;category:string;description:string;sections:string[];target:AppView}[] = [
  {title:"Günlük ders planı",category:"Planlama",description:"TYMM bileşenlerini ve ders akışını aynı belgede öğretmen kontrolüyle düzenler.",sections:["Resmî bilgiler","Öğrenme çıktısı ve süreç bileşenleri","Öğrenme-öğretme yaşantıları","Ölçme ve farklılaştırma"],target:"daily"},
  {title:"Yıllık plan",category:"Planlama",description:"Ünite, çıktı, ders saati ve özel haftaları öğretim yılı takvimine dağıtır.",sections:["Ünite ve öğrenme çıktıları","Hafta ve ders saati","Değerler ve okuryazarlık","Açıklamalar ve imza alanları"],target:"annual"},
  {title:"Zümre toplantı tutanağı",category:"Kurul",description:"Gündem, görüşme notları ve karar taslaklarını toplantı türüne göre yapılandırır.",sections:["Toplantı bilgileri","Gündem maddeleri","Görüşmeler","Kararlar ve imza alanları"],target:"meeting"},
  {title:"Yazılı sınav paketi",category:"Ölçme",description:"Belirtke tablosu, öğrenci kitapçığı ve öğretmen paketini aynı kapsamdan üretir.",sections:["Belirtke tablosu","Soru kitapçığı","Cevap anahtarı","Puanlama ve BEP kontrolleri"],target:"exam"},
  {title:"Sınav analiz tutanağı",category:"Ölçme",description:"Soru ve öğrenme çıktısı sonuçlarını iyileştirme kararlarına dönüştürür.",sections:["Sınıf özeti","Soru analizi","Çıktı analizi","İyileştirme planı"],target:"analysis"},
  {title:"Süreç değerlendirme formu",category:"İzleme",description:"Çok tarihli kanıtlarla öğrenci gelişimini ve sınıf öğrenme haritasını izler.",sections:["Kanıt kayıtları","Gelişim eğilimi","Öğrenme haritası","Destek planı"],target:"performance"},
];

export type ResourceSection = "curriculum" | "bep" | "documents";

export default function ResourceCenterModule({ units, initialSection = "curriculum", onOpen }: { units: Unit[]; initialSection?: ResourceSection; onOpen:(view:AppView)=>void }) {
  const [grade, setGrade] = useState<"all" | Grade>("all");
  const [query, setQuery] = useState("");
  const [section, setSection] = useState<ResourceSection>(initialSection);
  const filteredUnits = useMemo(() => {
    const search = normalize(query);
    return units.filter((unit) => {
      if (grade !== "all" && unit.grade !== grade) return false;
      if (!search) return true;
      return normalize([unit.code, unit.name, unit.purpose, ...unit.keywords, ...unit.contentFramework, ...unit.outcomes.flatMap((outcome) => [outcome.code, outcome.description, outcome.short])].join(" ")).includes(search);
    });
  }, [grade, query, units]);
  const outcomeCount = filteredUnits.reduce((sum, unit) => sum + unit.outcomes.length, 0);
  const hourCount = filteredUnits.reduce((sum, unit) => sum + unit.hours, 0);
  const filteredBepGuides = useMemo(() => {
    const search = normalize(query);
    return search ? bepGuides.filter((guide) => normalize([guide.title, guide.need, ...guide.adaptations, guide.avoid].join(" ")).includes(search)) : bepGuides;
  }, [query]);
  const filteredDocuments = useMemo(() => {
    const search = normalize(query);
    return search ? documentGuides.filter((document) => normalize([document.title, document.category, document.description, ...document.sections].join(" ")).includes(search)) : documentGuides;
  }, [query]);

  return <section className="resource-center" id="top">
    <header className="resource-hero"><div><span className="eyebrow"><BookOpen size={15}/> FOPOS • TYMM 2024 Kaynak Merkezi</span><h1>Doğrulanmış müfredatı<br/><em>tek ekranda inceleyin.</em></h1><p>10 ve 11. sınıf felsefe ünitelerini, öğrenme çıktılarını ve süreç bileşenlerini planlama öncesinde arayın ve karşılaştırın.</p></div><div className="resource-verification"><ShieldCheck size={24}/><strong>Doğrulanmış veri katmanı</strong><span>Türkiye Yüzyılı Maarif Modeli 2024<br/>Felsefe Dersi • 10–11. Sınıf</span></div></header>
    <nav className="resource-sections" aria-label="Kaynak Merkezi bölümleri"><button className={section === "curriculum" ? "active" : ""} aria-pressed={section === "curriculum"} onClick={()=>{setSection("curriculum");setQuery("")}}><BookOpen size={17}/> Müfredat ve çıktılar</button><button className={section === "bep" ? "active" : ""} aria-pressed={section === "bep"} onClick={()=>{setSection("bep");setQuery("")}}><Accessibility size={17}/> BEP rehberi</button><button className={section === "documents" ? "active" : ""} aria-pressed={section === "documents"} onClick={()=>{setSection("documents");setQuery("")}}><FileText size={17}/> Örnek belgeler</button></nav>
    <div className={`resource-toolbar ${section !== "curriculum" ? "bep-toolbar" : ""}`} role="search">{section === "curriculum" && <label><span>Sınıf</span><select value={grade} onChange={(event) => setGrade(event.target.value === "all" ? "all" : Number(event.target.value) as Grade)}><option value="all">Tüm sınıflar</option><option value="10">10. Sınıf</option><option value="11">11. Sınıf</option></select></label>}<label className="resource-search"><span>{section === "curriculum" ? "Ünite, kod, kavram veya öğrenme çıktısı ara" : section === "bep" ? "İhtiyaç alanı veya uyarlama ara" : "Belge türü, bölüm veya kullanım amacı ara"}</span><div><Search size={17}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={section === "curriculum" ? "Örn. FEL.10.7.1, adalet, teknoloji…" : section === "bep" ? "Örn. okuma, ek süre, görsel erişim…" : "Örn. yıllık plan, belirtke, karar…"}/></div></label></div>
    {section === "curriculum" ? <><div className="resource-summary" aria-live="polite"><div><strong>{filteredUnits.length}</strong><span>Ünite</span></div><div><strong>{outcomeCount}</strong><span>Öğrenme çıktısı</span></div><div><strong>{hourCount}</strong><span>Ders saati</span></div></div>
    {filteredUnits.length ? <div className="resource-unit-list">{filteredUnits.map((unit) => <article className="resource-unit-card" key={unit.code}>
      <div className="resource-unit-heading"><div><span>{unit.grade}. Sınıf • {unit.code}</span><h2>{unit.name}</h2></div><strong><Clock3 size={15}/>{unit.hours} saat</strong></div><p>{unit.purpose}</p><div className="resource-keywords">{unit.keywords.map((keyword) => <span key={keyword}>{keyword}</span>)}</div>
      <div className="resource-outcomes"><h3><Target size={16}/> Öğrenme çıktıları</h3>{unit.outcomes.map((outcome) => <details key={outcome.code}><summary><strong>{outcome.code}</strong><span>{outcome.description}</span></summary><div><h4>Süreç bileşenleri</h4>{outcome.processComponents.map((component, index) => <p key={`${outcome.code}-${index}`}><b>{component.step}</b> {component.description}</p>)}</div></details>)}</div>
      <details className="resource-framework"><summary>İçerik ve program bileşenlerini göster</summary><div><section><h4>İçerik çerçevesi</h4><ul>{unit.contentFramework.map((item) => <li key={item}>{item}</li>)}</ul></section><section><h4>Değerler</h4><p>{unit.competencyFramework.values.join(" • ") || "Belirtilmemiş"}</p><h4>Okuryazarlık</h4><p>{unit.competencyFramework.literacy.join(" • ") || "Belirtilmemiş"}</p></section></div></details>
    </article>)}</div> : <div className="resource-empty"><Search size={24}/><strong>Eşleşen müfredat kaydı bulunamadı</strong><span>Arama ifadesini veya sınıf filtresini değiştirin.</span></div>}</> : section === "bep" ? <section className="bep-guide">
      <div className="bep-principle"><ShieldCheck size={23}/><div><strong>Çıktıyı koru, erişim engelini azalt</strong><p>Uyarlama; öğrencinin onaylı BEP hedeflerine ve BEP geliştirme birimi kararına dayanır. Tanı koymaz, öğrenme çıktısını sessizce değiştirmez.</p></div></div>
      <div className="bep-steps" aria-label="BEP uyarlama çalışma sırası">{["Onaylı planı incele","Gözlenebilir ihtiyacı belirle","Çıktıyı koruyan uyarlamayı seç","Uygula ve kanıtla","Birimle gözden geçir"].map((step,index)=><div key={step}><span>{index+1}</span><strong>{step}</strong></div>)}</div>
      <div className="bep-guide-grid" aria-live="polite">{filteredBepGuides.map((guide)=><article key={guide.title}><header><Accessibility size={19}/><h2>{guide.title}</h2></header><h3>Gözlenebilir ihtiyaç</h3><p>{guide.need}</p><h3>Uygulanabilir uyarlamalar</h3><ul>{guide.adaptations.map((item)=><li key={item}><CheckCircle2 size={15}/><span>{item}</span></li>)}</ul><div className="bep-avoid"><ShieldAlert size={16}/><span><b>Kaçının:</b> {guide.avoid}</span></div></article>)}</div>
      {!filteredBepGuides.length && <div className="resource-empty"><Search size={24}/><strong>Eşleşen BEP rehberi bulunamadı</strong><span>İhtiyaç alanını veya uyarlama ifadesini değiştirin.</span></div>}
      <aside className="bep-privacy"><ShieldAlert size={19}/><div><strong>Mahremiyet ve yetki sınırı</strong><p>Bu rehbere öğrenci adı, tanı, sağlık bilgisi veya bireysel BEP belgesi girilmez. Seçenekler öğretmene karar desteği sunar; BEP geliştirme birimi kararının yerine geçmez.</p></div></aside>
    </section> : <section className="document-guide">
      <div className="document-guide-intro"><FileText size={22}/><div><strong>Boş örnek değil, güvenli üretim başlangıcı</strong><p>Her belge, ilgili FOPOS modülünde düzenlenir ve öğretmen kontrolünden sonra dışa aktarılır. Kartlar belge yapısını gösterir; kişisel bilgi veya imza uydurmaz.</p></div></div>
      <div className="document-guide-grid" aria-live="polite">{filteredDocuments.map((document)=><article key={document.title}><header><span>{document.category}</span><FileText size={20}/></header><h2>{document.title}</h2><p>{document.description}</p><h3>Belge bölümleri</h3><ul>{document.sections.map((item)=><li key={item}><CheckCircle2 size={14}/>{item}</li>)}</ul><button type="button" onClick={()=>onOpen(document.target)}>İlgili modülde hazırla <ArrowRight size={15}/></button></article>)}</div>
      {!filteredDocuments.length && <div className="resource-empty"><Search size={24}/><strong>Eşleşen belge bulunamadı</strong><span>Belge türünü veya bölüm adını değiştirin.</span></div>}
      <aside className="document-safety"><ShieldCheck size={19}/><div><strong>Belge güvenliği</strong><p>Önizlemeler taslaktır. Yönetici onayı, toplantı kararı, imza veya gerçekleşmiş uygulama otomatik üretilmez; son kontrol belgeyi hazırlayan öğretmendedir.</p></div></aside>
    </section>}
  </section>;
}
