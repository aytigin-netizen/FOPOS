import Link from "next/link";
import { AnnualPlanBuilder } from "@/app/annual-plan/AnnualPlanBuilder";

export default function AnnualPlanPage() {
  return (
    <main className="annual-page">
      <nav className="studio-nav" aria-label="Yıllık plan navigasyonu">
        <Link href="/">FOPOS</Link>
        <Link href="/daily-plan">Günlük Plan</Link>
      </nav>
      <AnnualPlanBuilder />
    </main>
  );
}
