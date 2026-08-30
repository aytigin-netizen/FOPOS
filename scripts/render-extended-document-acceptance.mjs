import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { buildAnnualPlanArtifact } from "../app/modules/annual-plan/export-annual-plan.ts";
import { buildExamPackageArtifact } from "../app/modules/exam-builder/export-exam-package.ts";
import { buildDepartmentMeetingArtifact } from "../app/modules/department-meeting/export-department-meeting.ts";

const output = resolve(process.argv[2] ?? "tmp/extended-document-acceptance");
await mkdir(output, { recursive: true });
async function save(name, artifact) {
  await writeFile(resolve(output, name), Buffer.from(await artifact.blob.arrayBuffer()));
}
for (const grade of [10, 11]) {
  const rows = Array.from({ length: 36 }, (_, index) => ({
    week: index + 1, month: "EYLÜL", dates: `${index + 1}-${index + 5} Eyl`, hours: 2,
    unit: index < 34 ? `F${grade}_U${Math.floor(index / 5) + 1}` : "OKUL TEMELLİ PLANLAMA",
    topic: `Haftalık felsefe odağı ${index + 1}`, outcome: index < 34 ? `FEL.${grade}.1.1` : "Okul temelli planlama",
    components: "a) Kavramları ayırt eder.", socialEmotional: "İş birliği", values: "Sorumluluk", literacy: "Bilgi okuryazarlığı", special: "—",
  }));
  await save(`annual-${grade}.docx`, await buildAnnualPlanArtifact({
    academicYear: "2026-2027", school: "Kabul Okulu", teacher: "Felsefe Öğretmeni", principal: "Okul Müdürü",
    grade, subjectName: "Felsefe", sourceTitle: "Felsefe Dersi Öğretim Programı", sourceYear: 2024, rows,
  }));
}
const questions = Array.from({ length: 5 }, (_, index) => ({
  outcomeCode: "FEL.11.6.2", unitCode: "F11_U6", kindLabel: "Açık uçlu", levelLabel: "Çözümleme",
  passage: index === 0 ? "Hukuk felsefesi temel kanıt metni" : undefined,
  text: `Hukuk ve adalet ilişkisini gerekçeli çözümleyiniz (${index + 1}).`, points: 20,
  answer: "Beklenen temel felsefi kanıt.", criterion: "Kavram 5, gerekçe 10, sonuç 5 puan.",
}));
for (const mode of ["standard", "bep"]) for (const audience of ["student", "teacher"]) {
  await save(`exam-${mode}-${audience}.docx`, await buildExamPackageArtifact({
    school: "Kabul Okulu", academicYear: "2026-2027", grade: 11, subjectName: "Felsefe", examName: "Temsil Sınavı",
    booklet: "A", durationMinutes: mode === "bep" ? 60 : 40, mode, bepLabel: "Okuma desteği", bepNote: "Süre ve sunum uyarlaması",
    bepGoals: "Sentetik hedef", teacher: "Felsefe Öğretmeni", principal: "Okul Müdürü", questions,
  }, audience));
}
const periods = ["Ders yılı başı", "Kasım ara değerlendirme", "İkinci dönem başı", "Nisan ara değerlendirme", "Ders yılı sonu", "Olağanüstü toplantı"];
for (const [index, periodLabel] of periods.entries()) {
  await save(`meeting-${index + 1}.docx`, await buildDepartmentMeetingArtifact({
    year: "2026-2027", school: "Kabul Okulu", field: "Felsefe Grubu", meetingNo: String(index + 1), periodLabel,
    date: "30.08.2026", time: "10.00", place: "Öğretmenler Odası", chair: "Zümre Başkanı", principal: "Okul Müdürü",
    members: ["Zümre Başkanı", "Zümre Üyesi"], items: [
      { title: "Açılış, yoklama ve gündemin görüşülmesi", discussion: "Gündem görüşüldü.", decision: "Gündem kabul edildi.", status: "adopted" },
      { title: "Dilek, temenniler ve kapanış", discussion: "Toplantı tamamlandı.", decision: "", status: "discussed" },
    ],
  }));
}
console.log(output);
