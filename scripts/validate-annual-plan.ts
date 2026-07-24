import { createAnnualPlan, defaultAnnualPlanMetadata, isValidAcademicYear } from "../modules/annual-plan/model";

const errors: string[] = [];

if (isValidAcademicYear("2026-2028")) errors.push("Ardışık olmayan öğretim yılı kabul edildi.");
if (!isValidAcademicYear("2026-2027")) errors.push("Geçerli öğretim yılı reddedildi.");
try {
  createAnnualPlan({
    grade: 10,
    metadata: { ...defaultAnnualPlanMetadata, academicYear: "2027-2028" },
  });
  errors.push("Takvimi tanımlı olmayan öğretim yılı kabul edildi.");
} catch {
  // Beklenen güvenli davranış.
}

for (const grade of [10, 11] as const) {
  const plan = createAnnualPlan({ grade, metadata: defaultAnnualPlanMetadata });
  const curriculumWeeks = plan.weeks.filter((week) => week.kind === "curriculum");
  const schoolBasedWeeks = plan.weeks.filter((week) => week.kind === "school-based");
  const lessonHours = plan.weeks.length * plan.weeklyLessonHours;

  if (plan.weeks.length !== 36) errors.push(`${grade}. sınıf: ${plan.weeks.length} hafta.`);
  if (curriculumWeeks.length !== 34) errors.push(`${grade}. sınıf: ${curriculumWeeks.length} müfredat haftası.`);
  if (schoolBasedWeeks.length !== 2) errors.push(`${grade}. sınıf: ${schoolBasedWeeks.length} okul temelli hafta.`);
  if (lessonHours !== 72) errors.push(`${grade}. sınıf: ${lessonHours} ders saati.`);
  if (plan.status !== "draft" || plan.validation.exportAllowed) errors.push(`${grade}. sınıf: taslak güvenliği ihlali.`);
  if (plan.weeks.some((week) => ["2026-11-16", "2027-01-25", "2027-02-01", "2027-03-08"].includes(week.startDate))) {
    errors.push(`${grade}. sınıf: tatil haftası plana eklendi.`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("Yıllık plan doğrulaması başarılı: 10. ve 11. sınıf için 36 hafta / 72 saat.");
