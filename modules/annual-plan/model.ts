import { getCurriculum } from "@/curriculum";
import type { AnnualPlan, AnnualPlanInput, AnnualPlanMetadata, AnnualPlanWeek } from "@/modules/annual-plan/types";

export const academicCalendar2026 = {
  schoolStart: "2026-09-14",
  firstBreak: ["2026-11-16", "2026-11-20"],
  firstSemesterEnd: "2027-01-22",
  semesterBreak: ["2027-01-25", "2027-02-05"],
  secondSemesterStart: "2027-02-08",
  secondBreak: ["2027-03-08", "2027-03-12"],
  schoolEnd: "2027-06-25",
} as const;

export const defaultAnnualPlanMetadata: AnnualPlanMetadata = {
  province: "",
  district: "",
  schoolName: "",
  academicYear: "2026-2027",
  teacherName: "",
  departmentHead: "",
  principalName: "",
  branches: "",
};

export function getAnnualPlanDefaults(): AnnualPlanInput {
  return { grade: 10, metadata: { ...defaultAnnualPlanMetadata } };
}

export function isValidAcademicYear(value: string): boolean {
  const match = /^(\d{4})-(\d{4})$/.exec(value);
  return Boolean(match && Number(match[2]) === Number(match[1]) + 1);
}

export function createAnnualPlan(input: AnnualPlanInput): AnnualPlan {
  if (!isValidAcademicYear(input.metadata.academicYear)) {
    throw new Error("Öğretim yılı ardışık iki yıl olarak YYYY-YYYY biçiminde yazılmalıdır.");
  }
  if (input.metadata.academicYear !== "2026-2027") {
    throw new Error("Bu sürümde yalnızca doğrulanmış 2026-2027 çalışma takvimi kullanılabilir.");
  }

  const curriculum = getCurriculum(input.grade);
  const teachingWeeks = createTeachingWeeks();
  const curriculumSlots = curriculum.units.flatMap((unit) => {
    const weekCount = unit.lessonHours / curriculum.weeklyLessonHours;
    return Array.from({ length: weekCount }, (_, index) => ({ unit, unitWeek: index + 1 }));
  });

  if (curriculumSlots.length !== 34 || teachingWeeks.length !== 36) {
    throw new Error("Yıllık plan 34 müfredat ve 2 okul temelli planlama haftası içermelidir.");
  }

  const slots: Array<(typeof curriculumSlots)[number] | null> = [...curriculumSlots];
  slots.splice(17, 0, null);
  slots.push(null);

  const unitWeekCounts = new Map<string, number>();
  const weeks: AnnualPlanWeek[] = slots.map((slot, index) => {
    const dates = teachingWeeks[index];
    if (!slot) {
      return {
        sequence: index + 1,
        startDate: dates.start,
        endDate: dates.end,
        semester: dates.start <= academicCalendar2026.firstSemesterEnd ? 1 : 2,
        kind: "school-based",
        unitCode: null,
        unitTitle: "Okul Temelli Planlama",
        unitWeek: 1,
        topic: "Okulun ihtiyaçları ve öğrenci profiline göre planlanan felsefe çalışması",
        outcomeCode: null,
        outcomeTitle: "Zümre kararıyla belirlenecek",
        processComponents: ["Okul ve öğrenci ihtiyaçlarını belirler.", "Uygulanabilir bir çalışma planlar."],
        values: [],
        literacies: [],
        specialDays: specialDaysFor(dates.start),
      };
    }

    const { unit } = slot;
    const currentUnitWeek = (unitWeekCounts.get(unit.code) ?? 0) + 1;
    unitWeekCounts.set(unit.code, currentUnitWeek);
    const unitTotalWeeks = unit.lessonHours / curriculum.weeklyLessonHours;
    const outcomeIndex = Math.min(
      unit.outcomes.length - 1,
      Math.floor(((currentUnitWeek - 1) * unit.outcomes.length) / unitTotalWeeks),
    );
    const outcome = unit.outcomes[outcomeIndex];
    const topicIndex = Math.min(
      unit.contentFramework.length - 1,
      Math.floor(((currentUnitWeek - 1) * unit.contentFramework.length) / unitTotalWeeks),
    );

    return {
      sequence: index + 1,
      startDate: dates.start,
      endDate: dates.end,
      semester: dates.start <= academicCalendar2026.firstSemesterEnd ? 1 : 2,
      kind: "curriculum",
      unitCode: unit.code,
      unitTitle: unit.title,
      unitWeek: currentUnitWeek,
      topic: unit.contentFramework[topicIndex],
      outcomeCode: outcome.code,
      outcomeTitle: outcome.title,
      processComponents: outcome.processComponents,
      values: unit.components.values,
      literacies: unit.components.literacies,
      specialDays: specialDaysFor(dates.start),
    };
  });

  return {
    status: "draft",
    title: `${input.metadata.academicYear} ${input.grade}. Sınıf Felsefe Dersi Yıllık Plan Taslağı`,
    metadata: input.metadata,
    grade: input.grade,
    weeklyLessonHours: curriculum.weeklyLessonHours,
    totalLessonHours: curriculum.annualLessonHours,
    calendar: academicCalendar2026,
    weeks,
    validation: {
      calendarReviewed: false,
      curriculumReviewed: false,
      exportAllowed: false,
    },
  };
}

function createTeachingWeeks(): Array<{ start: string; end: string }> {
  const weeks: Array<{ start: string; end: string }> = [];
  let monday = parseDate(academicCalendar2026.schoolStart);
  const schoolEnd = parseDate(academicCalendar2026.schoolEnd);

  while (monday <= schoolEnd && weeks.length < 36) {
    const start = formatDate(monday);
    if (!isBreakWeek(start)) {
      weeks.push({ start, end: formatDate(addDays(monday, 4)) });
    }
    monday = addDays(monday, 7);
  }
  return weeks;
}

function isBreakWeek(date: string): boolean {
  return date === academicCalendar2026.firstBreak[0]
    || date === academicCalendar2026.semesterBreak[0]
    || date === "2027-02-01"
    || date === academicCalendar2026.secondBreak[0];
}

function specialDaysFor(startDate: string): readonly string[] {
  const monthDay = startDate.slice(5);
  if (monthDay === "09-14") return ["İlköğretim Haftası"];
  if (monthDay === "10-26") return ["29 Ekim Cumhuriyet Bayramı"];
  if (monthDay === "11-09") return ["10 Kasım Atatürk'ü Anma Günü"];
  if (monthDay === "11-23") return ["24 Kasım Öğretmenler Günü"];
  if (monthDay === "03-15") return ["18 Mart Şehitleri Anma Günü"];
  if (monthDay === "04-19") return ["23 Nisan Ulusal Egemenlik ve Çocuk Bayramı"];
  if (monthDay === "05-17") return ["19 Mayıs Atatürk'ü Anma, Gençlik ve Spor Bayramı"];
  return [];
}

function parseDate(value: string): Date {
  return new Date(`${value}T00:00:00Z`);
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
