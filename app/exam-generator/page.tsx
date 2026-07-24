import Link from "next/link";
import { ExamGeneratorBuilder } from "@/app/exam-generator/ExamGeneratorBuilder";

export default function ExamGeneratorPage() {
  return (
    <main className="exam-page">
      <nav className="studio-nav" aria-label="Sınav oluşturucu navigasyonu">
        <Link href="/">FOPOS</Link>
        <Link href="/department-minutes">Zümre Tutanağı</Link>
      </nav>
      <ExamGeneratorBuilder />
    </main>
  );
}
