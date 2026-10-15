import type { PedagogicalRecord } from "./pedagogical-record.ts";
import type { SchoolType } from "../../src/core/curriculum/package-types.ts";

export type TeachingSlot = {
  id: string;
  weekday: number;
  time: string;
  grade: 9 | 10 | 11 | 12;
  branch: string;
  subjectCode: string;
  schoolType: SchoolType;
  unitCode: string;
  week: number;
  date?: string;
};
export type LessonBinding = { slotId: string; date: string; recordId: string; revision: number };
export type TeachingTimetable = { version: 1; slots: TeachingSlot[]; bindings: LessonBinding[] };
export const emptyTimetable = (): TeachingTimetable => ({ version: 1, slots: [], bindings: [] });
export function timetableKey(accountKey: string, academicYear: string) {
  return `fopos:timetable:v1:${encodeURIComponent(accountKey)}:${academicYear}`;
}
export function istanbulDay(now: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Istanbul", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now);
  const value = (key: string) => parts.find(part => part.type === key)?.value ?? "";
  const date = `${value("year")}-${value("month")}-${value("day")}`;
  return { date, weekday: new Date(`${date}T12:00:00Z`).getUTCDay() };
}
const datePattern = /^\d{4}-\d{2}-\d{2}$/u;
function validDate(value: string) {
  if (!datePattern.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0,10) === value;
}
export function slotsOverlap(a: TeachingSlot, b: TeachingSlot) {
  if (a.id === b.id || a.time !== b.time) return false;
  if (a.date && b.date) return a.date === b.date;
  if (!a.date && !b.date) return a.weekday === b.weekday;
  const single = a.date ? a : b;
  const weekly = a.date ? b : a;
  return new Date(`${single.date}T12:00:00Z`).getUTCDay() === weekly.weekday;
}
export function parseTimetable(text: string): TeachingTimetable {
  const value: unknown = JSON.parse(text);
  if (!value || typeof value !== "object") throw new Error("Program biçimi geçersiz.");
  const data = value as TeachingTimetable;
  if (data.version !== 1 || !Array.isArray(data.slots) || !Array.isArray(data.bindings) || data.slots.length > 150 || data.bindings.length > 2000) throw new Error("Program biçimi veya boyutu geçersiz.");
  const ids = new Set<string>();
  const slots = data.slots.map(slot => {
    if (!slot || typeof slot.id !== "string" || !slot.id || slot.id.length > 100 || ids.has(slot.id) || !Number.isInteger(slot.weekday) || slot.weekday < 0 || slot.weekday > 6 || !/^([01]\d|2[0-3]):[0-5]\d$/u.test(slot.time) || ![9,10,11,12].includes(slot.grade) || typeof slot.branch !== "string" || !slot.branch.trim() || slot.branch.length > 20 || typeof slot.subjectCode !== "string" || !slot.subjectCode || slot.subjectCode.length > 40 || typeof slot.unitCode !== "string" || slot.unitCode.length > 60 || !["general_secondary", "social_sciences_high_school"].includes(slot.schoolType) || !Number.isInteger(slot.week) || slot.week < 1 || slot.week > 40 || (slot.date !== undefined && !validDate(slot.date))) throw new Error("Ders satırı doğrulanamadı.");
    ids.add(slot.id);
    // Store only timetable fields, never arbitrary imported payloads or student data.
    return { id:slot.id, weekday:slot.weekday, time:slot.time, grade:slot.grade, branch:slot.branch.trim(), subjectCode:slot.subjectCode, schoolType:slot.schoolType, unitCode:slot.unitCode, week:slot.week, ...(slot.date ? {date:slot.date} : {}) };
  });
  const keys = new Set<string>();
  const bindings = data.bindings.map(binding => {
    const key = `${binding?.slotId}:${binding?.date}`;
    if (!binding || !ids.has(binding.slotId) || !validDate(binding.date) || typeof binding.recordId !== "string" || !binding.recordId || binding.recordId.length > 200 || !Number.isInteger(binding.revision) || binding.revision < 1 || keys.has(key)) throw new Error("Ders ve plan eşleştirmesi doğrulanamadı.");
    keys.add(key);
    return {slotId:binding.slotId,date:binding.date,recordId:binding.recordId,revision:binding.revision};
  });
  return { version:1, slots, bindings };
}
export function todaySlots(timetable: TeachingTimetable, now: Date) {
  const day = istanbulDay(now);
  return timetable.slots.filter(slot => slot.date ? slot.date === day.date : slot.weekday === day.weekday).sort((a,b) => a.time.localeCompare(b.time) || a.id.localeCompare(b.id));
}
export function boundRecord(timetable: TeachingTimetable, slotId: string, date: string, records: PedagogicalRecord[]) {
  const binding = timetable.bindings.find(item => item.slotId === slotId && item.date === date);
  if (!binding) return null;
  const slot = timetable.slots.find(item => item.id === slotId);
  return records.find(record => record.recordId === binding.recordId && record.revision === binding.revision && record.status !== "superseded" && record.curriculum.subjectCode === slot?.subjectCode && record.curriculum.grade === slot?.grade) ?? null;
}
export function bindLesson(timetable: TeachingTimetable, slot: TeachingSlot, date: string, record: PedagogicalRecord): TeachingTimetable {
  if (record.curriculum.subjectCode !== slot.subjectCode || record.curriculum.grade !== slot.grade) return timetable;
  return parseTimetable(JSON.stringify({ ...timetable, bindings:[...timetable.bindings.filter(item => !(item.slotId === slot.id && item.date === date)), {slotId:slot.id,date,recordId:record.recordId,revision:record.revision}].slice(-2000) }));
}
