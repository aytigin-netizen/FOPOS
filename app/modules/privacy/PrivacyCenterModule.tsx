"use client";

import { Database, Eraser, FileDown, ShieldCheck } from "lucide-react";

const lifecycle = [
  ["Kaydedilmiş öğrenci listesi", "Öğretmen hesabına ve sınıfa bağlı sunucu veri alanı", "Öğretmen listeyi veya hesabını sildiğinde; sayfa kapanınca korunur"],
  ["Kaydedilmemiş öğrenci düzenlemeleri", "Yalnız açık öğrenci modülünün belleği", "Kaydetmeden sayfa kapatılırsa kaybolur"],
  ["Soru puanları", "Yalnız Sınav Analizi belleği", "Öğrenci oturumu temizlendiğinde"],
  ["FOPOS AI kanıtı", "En az 5 kişilik toplulaştırılmış sınıf özeti", "Uygulama oturumu sona erdiğinde"],
  ["DOCX / JSON çıktıları", "Öğretmenin seçtiği cihaz konumu", "Kurumun saklama politikasına göre"],
] as const;

export default function PrivacyCenterModule({ onOpenAnalysis }: { onOpenAnalysis: () => void }) {
  return (
    <section className="privacy-center-module" id="top">
      <header className="privacy-center-hero"><span className="eyebrow"><ShieldCheck size={15}/> Privacy by Design</span><h1>Gizlilik<br/><em>öğretmenin denetiminde.</em></h1><p>FOPOS’un hangi veriyi nerede işlediğini, ne zaman sildiğini ve FOPOS AI’ya hangi sınırlarla aktardığını açıkça görün.</p></header>
      <section className="privacy-principle-grid">
        <article><Database size={22}/><strong>Kayıt ve oturum ayrımı</strong><span>Öğrenci listeleri açık Kaydet işlemiyle hesaba yazılır; kalıcı tarayıcı deposuna yazılmaz. Sınav puanları oturum belleğinde kalır.</span></article>
        <article><ShieldCheck size={22}/><strong>Kimliksiz AI</strong><span>En az beş kişilik toplulaştırılmış özet dışında veri kabul edilmez.</span></article>
        <article><Eraser size={22}/><strong>Açık silme onayı</strong><span>Kaydedilmemiş düzenlemeler ve hassas analiz oturumları öğretmen onayıyla temizlenir.</span></article>
        <article><FileDown size={22}/><strong>Denetimli çıktı</strong><span>Belgeler yalnız öğretmen incelemesi ve açık indirme işlemiyle oluşur.</span></article>
      </section>
      <section className="privacy-lifecycle-card"><h2>Veri yaşam döngüsü</h2><div className="privacy-lifecycle-table"><table><thead><tr><th>Veri</th><th>İşlendiği yer</th><th>Yaşam döngüsü</th></tr></thead><tbody>{lifecycle.map(([data, location, retention])=><tr key={data}><th>{data}</th><td>{location}</td><td>{retention}</td></tr>)}</tbody></table></div></section>
      <aside className="privacy-action-card"><div><strong>Kimlikli sınav verisini temizlemek mi istiyorsunuz?</strong><p>Sınav Analizi modülündeki “Öğrenci oturumunu temizle” kontrolü analizdeki oturum kopyasını, puanları ve aktarım önizlemesini temizler. Hesaba kaydedilmiş sınıf listesini silmez.</p></div><button className="secondary-button" onClick={onOpenAnalysis}>Sınav Analizine git</button></aside>
    </section>
  );
}

