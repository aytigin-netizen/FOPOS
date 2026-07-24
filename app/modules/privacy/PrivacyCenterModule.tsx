"use client";

import { Database, Eraser, FileDown, ShieldCheck } from "lucide-react";

const lifecycle = [
  ["Öğrenci kimliği", "Yalnız açık öğrenci modülünün belleği", "Modül temizleme, sayfa yenileme veya sekme kapanışı"],
  ["Soru puanları", "Yalnız Sınav Analizi belleği", "Öğrenci oturumu temizlendiğinde"],
  ["FOPOS AI kanıtı", "En az 5 kişilik toplulaştırılmış sınıf özeti", "Uygulama oturumu sona erdiğinde"],
  ["DOCX / JSON çıktıları", "Öğretmenin seçtiği cihaz konumu", "Kurumun saklama politikasına göre"],
] as const;

export default function PrivacyCenterModule({ onOpenAnalysis }: { onOpenAnalysis: () => void }) {
  return (
    <section className="privacy-center-module" id="top">
      <header className="privacy-center-hero"><span className="eyebrow"><ShieldCheck size={15}/> Privacy by Design</span><h1>Gizlilik<br/><em>öğretmenin denetiminde.</em></h1><p>FOPOS’un hangi veriyi nerede işlediğini, ne zaman sildiğini ve FOPOS AI’ya hangi sınırlarla aktardığını açıkça görün.</p></header>
      <section className="privacy-principle-grid">
        <article><Database size={22}/><strong>Bellek içi işleme</strong><span>Öğrenci listeleri ve puanlar kalıcı tarayıcı deposuna yazılmaz.</span></article>
        <article><ShieldCheck size={22}/><strong>Kimliksiz AI</strong><span>En az beş kişilik toplulaştırılmış özet dışında veri kabul edilmez.</span></article>
        <article><Eraser size={22}/><strong>Açık silme onayı</strong><span>Hassas oturumlar ayrı öğretmen onayı olmadan temizlenmez.</span></article>
        <article><FileDown size={22}/><strong>Denetimli çıktı</strong><span>Belgeler yalnız öğretmen incelemesi ve açık indirme işlemiyle oluşur.</span></article>
      </section>
      <section className="privacy-lifecycle-card"><h2>Veri yaşam döngüsü</h2><div className="privacy-lifecycle-table"><table><thead><tr><th>Veri</th><th>İşlendiği yer</th><th>Yaşam döngüsü</th></tr></thead><tbody>{lifecycle.map(([data, location, retention])=><tr key={data}><th>{data}</th><td>{location}</td><td>{retention}</td></tr>)}</tbody></table></div></section>
      <aside className="privacy-action-card"><div><strong>Kimlikli sınav verisini temizlemek mi istiyorsunuz?</strong><p>Sınav Analizi modülündeki “Öğrenci oturumunu temizle” kontrolü listeyi, puanları ve aktarım önizlemesini birlikte siler.</p></div><button className="secondary-button" onClick={onOpenAnalysis}>Sınav Analizine git</button></aside>
    </section>
  );
}

