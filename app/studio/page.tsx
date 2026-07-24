import Link from "next/link";
import { LessonStudio } from "@/app/studio/LessonStudio";

export default function StudioPage() {
  return (
    <main className="studio-page">
      <nav className="studio-nav" aria-label="Stüdyo navigasyonu">
        <Link href="/">FOPOS</Link>
        <span>Ders Tasarım Stüdyosu</span>
      </nav>
      <LessonStudio />
    </main>
  );
}
