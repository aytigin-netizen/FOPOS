import Link from "next/link";
import { DepartmentMinutesBuilder } from "@/app/department-minutes/DepartmentMinutesBuilder";

export default function DepartmentMinutesPage() {
  return (
    <main className="minutes-page">
      <nav className="studio-nav" aria-label="Zümre tutanağı navigasyonu">
        <Link href="/">FOPOS</Link>
        <Link href="/annual-plan">Yıllık Plan</Link>
      </nav>
      <DepartmentMinutesBuilder />
    </main>
  );
}
