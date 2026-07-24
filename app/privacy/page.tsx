import Link from "next/link";
import { PrivacyCenter } from "@/app/privacy/PrivacyCenter";

export default function PrivacyPage() {
  return (
    <main className="privacy-page">
      <nav className="studio-nav"><Link href="/">FOPOS</Link><Link href="/release-readiness">Yayın Hazırlık Merkezi</Link></nav>
      <header className="privacy-header">
        <span className="eyebrow">Privacy by Design</span>
        <h1>Gizlilik Merkezi</h1>
        <p>Öğrenci verisinin nerede işlendiğini, ne kadar süre tutulduğunu ve öğretmenin veriyi nasıl silebildiğini açıklar.</p>
      </header>
      <PrivacyCenter />
    </main>
  );
}

