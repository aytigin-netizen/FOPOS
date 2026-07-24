import Link from "next/link";
import { ExamAnalysisBuilder } from "@/app/exam-analysis/ExamAnalysisBuilder";

export default function ExamAnalysisPage() {
  return <main className="analysis-page"><nav className="studio-nav" aria-label="Sınav analizi navigasyonu"><Link href="/">FOPOS</Link><Link href="/exam-generator">Sınav Oluşturucu</Link></nav><ExamAnalysisBuilder /></main>;
}
