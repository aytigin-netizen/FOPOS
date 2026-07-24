import Link from "next/link";
import { DailyPlanBuilder } from "@/app/daily-plan/DailyPlanBuilder";

export default function DailyPlanPage() {
  return (
    <main className="daily-page">
      <nav className="studio-nav" aria-label="Günlük plan navigasyonu">
        <Link href="/">FOPOS</Link>
        <Link href="/studio">Ders Tasarım Stüdyosu</Link>
      </nav>
      <DailyPlanBuilder />
    </main>
  );
}
