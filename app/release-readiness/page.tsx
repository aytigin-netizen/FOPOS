import Link from "next/link";
import { releaseGates, releaseSummary } from "@/core/release-readiness";

export default function ReleaseReadinessPage() {
  return (
    <main className="release-page">
      <nav className="studio-nav"><Link href="/">FOPOS</Link><Link href="/fopos-ai">FOPOS AI</Link></nav>
      <header className="release-header">
        <div><span className="eyebrow">Validation Before Delivery</span><h1>Yayın Hazırlık Merkezi</h1><p>Canlıya çıkmadan önce ürün, belge, gizlilik, entegrasyon ve hosting kapılarını görünür kılar.</p></div>
        <div className="release-score"><strong>{releaseSummary.passed}/{releaseSummary.total}</strong><span>kapı geçti</span></div>
      </header>
      <section className="release-gates">
        {releaseGates.map((gate) => (
          <article className={`release-gate gate-${gate.status}`} key={gate.id}>
            <div><span>{gate.status === "passed" ? "GEÇTİ" : gate.status === "blocked" ? "BLOKE" : "DEVAM EDİYOR"}</span><h2>{gate.title}</h2></div>
            <p>{gate.evidence}</p>
            {gate.nextAction && <footer><strong>Sıradaki işlem:</strong> {gate.nextAction}</footer>}
          </article>
        ))}
      </section>
      <aside className="release-verdict"><strong>{releaseSummary.publishable ? "Canlı yayına hazır" : "Henüz canlı yayına hazır değil"}</strong><span>Tüm kapılar geçmeden üretim dağıtımı başlatılmaz.</span></aside>
    </main>
  );
}
