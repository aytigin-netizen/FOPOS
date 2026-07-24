import Link from "next/link";
import { FoposAiDashboard } from "@/app/fopos-ai/FoposAiDashboard";

export default function FoposAiPage() {
  return <main className="ai-page"><nav className="studio-nav"><Link href="/">FOPOS</Link><Link href="/exam-analysis">Sınav Analizi</Link></nav><FoposAiDashboard /></main>;
}
