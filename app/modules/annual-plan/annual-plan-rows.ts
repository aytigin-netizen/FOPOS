import type { AnnualPlanUnit } from "./annual-plan-types.ts";
import { annualOnlySources } from "./annual-only-curricula.ts";
import type { Grade } from "../../data/curriculum.ts";
import { resolveAnnualPlanWeekFramework } from "./annual-plan-2026-framework.ts";

export type AnnualRow = {
  week: number | null;
  startDate: string;
  unitCode: string;
  unitWeek: number;
  outcomeCode: string;
  month: string;
  dates: string;
  hours: number;
  unit: string;
  topic: string;
  outcome: string;
  components: string;
  socialEmotional: string;
  values: string;
  literacy: string;
  special: string;
  kind: "lesson" | "break" | "planning" | "social" | "blank";
};

const trMonths = [
  "OCAK",
  "ŞUBAT",
  "MART",
  "NİSAN",
  "MAYIS",
  "HAZİRAN",
  "TEMMUZ",
  "AĞUSTOS",
  "EYLÜL",
  "EKİM",
  "KASIM",
  "ARALIK",
];
const shortMonths = [
  "Oca",
  "Şub",
  "Mar",
  "Nis",
  "May",
  "Haz",
  "Tem",
  "Ağu",
  "Eyl",
  "Eki",
  "Kas",
  "Ara",
];
const specialDays: Record<string, string> = {
  "9-14": "İlköğretim Haftası",
  "9-19": "Gaziler Günü",
  "10-29": "Cumhuriyet Bayramı",
  "11-10": "Atatürk Haftası",
  "11-24": "Öğretmenler Günü",
  "12-10": "İnsan Hakları ve Demokrasi Haftası",
  "3-18": "Çanakkale Zaferi",
  "4-23": "Ulusal Egemenlik ve Çocuk Bayramı",
  "5-19": "Atatürk’ü Anma, Gençlik ve Spor Bayramı",
  "6-5": "Çevre ve İklim Değişikliği Haftası",
};

type AcademicCalendar = {
  start: string;
  end: string;
  breaks: Array<{ start: string; end: string; label: string }>;
  specialWeeks?: Record<string, { kind: "planning" | "social" | "blank"; label: string; detail: string }>;
  examWeeks?: Record<string, string>;
  specialDaysByWeek?: Record<string, string>;
};

export const academicCalendars: Record<string, AcademicCalendar> = {
  "2025-2026": {
    start: "2025-09-08",
    end: "2026-06-26",
    breaks: [
      { start: "2025-11-10", end: "2025-11-14", label: "ARA TATİL" },
      { start: "2026-01-19", end: "2026-01-30", label: "YARIYIL TATİLİ" },
      { start: "2026-03-16", end: "2026-03-20", label: "ARA TATİL" },
    ],
    specialWeeks: {
      "2025-11-03": { kind: "planning", label: "OKUL TEMELLİ PLANLAMA", detail: "1. Dönem 1. Sınav • okul temelli planlama" },
      "2026-06-08": { kind: "planning", label: "OKUL TEMELLİ PLANLAMA", detail: "Okulun ve öğrencilerin ihtiyaçlarına göre planlanır." },
      "2026-06-15": { kind: "social", label: "SOSYAL ETKİNLİK", detail: "Sosyal etkinlik çalışmaları" },
      "2026-06-22": { kind: "blank", label: "ÇERÇEVE YILLIK PLANDA BOŞ BIRAKILMIŞ", detail: "Okul ve yerel takvim kararına göre öğretmen tarafından planlanır." },
    },
    examWeeks: {
      "2026-01-05": "1. Dönem 2. Sınav",
      "2026-04-06": "2. Dönem 1. Sınav",
      "2026-06-01": "2. Dönem 2. Sınav",
    },
  },
  "2026-2027": {
    start: "2026-09-14",
    end: "2027-06-25",
    breaks: [
      { start: "2026-11-16", end: "2026-11-20", label: "ARA TATİL" },
      { start: "2027-01-25", end: "2027-02-05", label: "YARIYIL TATİLİ" },
      { start: "2027-03-08", end: "2027-03-12", label: "ARA TATİL" },
    ],
    specialWeeks: {
      "2027-01-18": { kind: "planning", label: "OKUL TEMELLİ PLANLAMA", detail: "Okulun, çevrenin ve öğrencilerin ihtiyaçlarına göre zümre kararıyla planlanır." },
      "2027-06-14": { kind: "planning", label: "OKUL TEMELLİ PLANLAMA", detail: "Okulun, çevrenin ve öğrencilerin ihtiyaçlarına göre zümre kararıyla planlanır." },
      "2027-06-21": { kind: "social", label: "SOSYAL ETKİNLİK", detail: "Sosyal etkinlik çalışmaları" },
    },
    specialDaysByWeek: {
      "2026-09-14": "15 Temmuz Demokrasi ve Millî Birlik Günü",
      "2026-10-26": "Cumhuriyet Bayramı (29 Ekim)",
      "2026-11-09": "Atatürk Haftası (10-16 Kasım)",
      "2026-11-23": "Öğretmenler Günü (24 Kasım)",
      "2026-11-30": "Dünya Engelliler Günü (3 Aralık)",
      "2027-03-01": "İstiklâl Marşı'nın Kabulü ve Mehmet Akif Ersoy'u Anma Günü (12 Mart)",
      "2027-03-15": "Türk Dünyası ve Toplulukları Haftası (16-22 Mart) • Çanakkale Zaferi ve Şehitleri Anma Günü (18 Mart)",
      "2027-04-19": "Ulusal Egemenlik ve Çocuk Bayramı (23 Nisan)",
      "2027-04-26": "Kût'ül Amâre Zaferi (29 Nisan)",
      "2027-05-17": "Atatürk'ü Anma, Gençlik ve Spor Bayramı (19 Mayıs)",
      "2027-05-24": "İstanbul'un Fethi (29 Mayıs)",
    },
  },
};

function addDays(date: Date, days: number) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}
function dateLabel(start: Date) {
  const end = addDays(start, 4);
  return start.getMonth() === end.getMonth()
    ? `${start.getDate()}-${end.getDate()} ${shortMonths[end.getMonth()]}`
    : `${start.getDate()} ${shortMonths[start.getMonth()]}-${end.getDate()} ${shortMonths[end.getMonth()]}`;
}
function localDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}
function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function specialDaysForWeek(start: Date) {
  return Array.from({ length: 5 }, (_, day) => addDays(start, day))
    .map((date) => specialDays[`${date.getMonth() + 1}-${date.getDate()}`])
    .filter((item): item is string => Boolean(item))
    .join(" • ") || "—";
}
export function annualRows(grade: Grade, academicYear: string, units: AnnualPlanUnit[], subjectCode: string, datasetVersion: string): AnnualRow[] {
  const calendar = academicCalendars[academicYear];
  if (!calendar) throw new Error("Bu öğretim yılı için doğrulanmış MEB takvimi bulunmuyor.");
  const annualPlanWeek = resolveAnnualPlanWeekFramework(subjectCode, datasetVersion);
  const curriculum = units.filter((u) => u.grade === grade);
  if (!curriculum.length) throw new Error("Bu sınıf ve okul türü için yıllık plan kapsamı bulunamadı.");
  const planningFocus = annualOnlySources[subjectCode]?.schoolBasedPlanningFocus;
  const allocations = curriculum.flatMap((unit) =>
    Array.from({ length: Math.ceil(unit.hours / 2) }, (_, i) => ({
      unit,
      index: i + 1,
      total: Math.ceil(unit.hours / 2),
    })),
  );
  let lessonIndex = 0;
  let instructionalWeek = 0;
  let fallbackPlanningWeeks = 0;
  const firstWeek = localDate(calendar.start);
  const lastDay = localDate(calendar.end);
  const weekCount = Math.ceil((lastDay.getTime() - firstWeek.getTime() + 86400000) / (7 * 86400000));
  return Array.from({ length: weekCount }, (_, index) => {
    const start = addDays(firstWeek, index * 7);
    const weekKey = dateKey(start);
    const breakPeriod = calendar.breaks.find((item) => weekKey >= item.start && weekKey <= item.end);
    const specialWeek = calendar.specialWeeks?.[weekKey];
    const special = calendar.specialDaysByWeek?.[weekKey] ?? specialDaysForWeek(start);
    const base = {
      week: null as number | null,
      startDate: weekKey,
      unitCode: "",
      unitWeek: 0,
      outcomeCode: "",
      month: trMonths[start.getMonth()],
      dates: dateLabel(start),
      hours: 2,
    };
    if (breakPeriod)
      return {
        ...base,
        unit: breakPeriod.label,
        topic: "Ders yapılmaz",
        outcome: "—",
        components: "—",
        socialEmotional: "—",
        values: "—",
        literacy: "—",
        hours: 0,
        special,
        kind: "break" as const,
      };
    instructionalWeek += 1;
    base.week = instructionalWeek;
    if (specialWeek)
      return {
        ...base,
        unit: specialWeek.label,
        topic: specialWeek.kind === "planning" && planningFocus ? planningFocus : specialWeek.detail,
        outcome: specialWeek.detail,
        components: specialWeek.label,
        socialEmotional: specialWeek.label,
        values: specialWeek.label,
        literacy: specialWeek.label,
        special,
        kind: specialWeek.kind,
      };
    const slot = allocations[lessonIndex++];
    if (!slot) {
      const isPlanning = fallbackPlanningWeeks < 2;
      fallbackPlanningWeeks += 1;
      return {
        ...base,
        unit: isPlanning ? "OKUL TEMELLİ PLANLAMA" : "SOSYAL ETKİNLİK",
        topic: isPlanning ? (planningFocus ?? "Okulun ve öğrencilerin ihtiyaçlarına göre planlanır.") : "Sosyal etkinlik çalışmaları",
        outcome: isPlanning ? "Okul temelli planlama" : "Sosyal etkinlik",
        components: isPlanning ? "Okul temelli planlama" : "Sosyal etkinlik",
        socialEmotional: isPlanning ? "Okul temelli planlama" : "Sosyal etkinlik",
        values: isPlanning ? "Okul temelli planlama" : "Sosyal etkinlik",
        literacy: isPlanning ? "Okul temelli planlama" : "Sosyal etkinlik",
        special,
        kind: isPlanning ? "planning" as const : "social" as const,
      };
    }
    const officialWeek = annualPlanWeek(slot.unit.code, slot.index - 1);
    const outcome = slot.unit.outcomes.find((candidate) => candidate.code === officialWeek.outcomeCode);
    if (!outcome) throw new Error(`${slot.unit.code} için ${officialWeek.outcomeCode} öğrenme çıktısı bulunamadı.`);
    const processComponents = officialWeek.componentSteps.map((step) => {
      const component = outcome.processComponents.find((candidate) => candidate.step === step);
      if (!component) throw new Error(`${officialWeek.outcomeCode} için ${step}) süreç bileşeni bulunamadı.`);
      return `${component.step}) ${component.description}`;
    }).join(" ");
    const examLabel = calendar.examWeeks?.[weekKey];
    return {
      ...base,
      unitCode: slot.unit.code,
      unitWeek: slot.index,
      outcomeCode: outcome.code,
      unit: slot.unit.name.toLocaleUpperCase("tr-TR"),
      topic: `${examLabel ? `${examLabel} • ` : ""}${slot.unit.contentFramework.join("\n")}${slot.index === 1 && slot.unit.requiredEnrichment?.length ? "\nSosyal bilimler lisesi zorunlu zenginleştirme: " + slot.unit.requiredEnrichment.join(" • ") : ""}`,
      outcome: `${examLabel ? `${examLabel}\n` : ""}${outcome.code} — ${outcome.description}`,
      components: processComponents,
      socialEmotional: slot.unit.competencyFramework.socialEmotionalLearning.join(" • ") || "—",
      values: slot.unit.competencyFramework.values.join(" • ") || "—",
      literacy: slot.unit.competencyFramework.literacy.join(" • ") || "—",
      special,
      kind: "lesson" as const,
    };
  });
}

export function annualRowForDate(rows: AnnualRow[], date: string) {
  return rows.find(row => date >= row.startDate && date <= new Date(Date.parse(row.startDate + "T12:00:00Z") + 6 * 86400000).toISOString().slice(0,10)) ?? null;
}
