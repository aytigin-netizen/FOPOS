import { FoposMark } from "../brand/FoposMark";
export function AppFooter({
  subjectName,
  supportedGrades,
  sourceYear,
}: {
  subjectName: string;
  supportedGrades: number[];
  sourceYear: number;
}) {
  return <footer><div className="brand footer-brand"><span className="brand-mark"><FoposMark/></span><span><strong>FOPOS</strong><small>Pedagogical Operating System</small></span></div><p>Türkiye Yüzyılı Maarif Modeli {sourceYear} • {supportedGrades.join("–")}. Sınıf {subjectName}</p><span>v47.0 • Professional Edition</span></footer>;
}
