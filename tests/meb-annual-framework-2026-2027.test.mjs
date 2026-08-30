import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(new URL("../app/modules/annual-plan/AnnualPlanModule.tsx", import.meta.url), "utf8");

test("2026-2027 MEB çerçevesindeki 37 öğretim haftası tatillerden bağımsız numaralanır", () => {
  assert.match(source, /let instructionalWeek = 0/);
  assert.match(source, /instructionalWeek \+= 1/);
  assert.match(source, /week: null as number \| null/);
  assert.match(source, /hours: 0,[\s\S]*kind: "break" as const/);
});

test("MEB çerçevesindeki planlama ve sosyal etkinlik haftaları sabittir", () => {
  for (const date of ["2027-01-18", "2027-06-14"]) {
    assert.match(source, new RegExp(`"${date}": \\{ kind: "planning"`));
  }
  assert.match(source, /"2027-06-21": \{ kind: "social"/);
});

test("MEB çerçevesindeki belirli gün ve haftalar 2026-2027 takvimine bağlıdır", () => {
  for (const label of [
    "15 Temmuz Demokrasi ve Millî Birlik Günü",
    "Kût'ül Amâre Zaferi (29 Nisan)",
    "İstanbul'un Fethi (29 Mayıs)",
  ]) assert.ok(source.includes(label), label);
  assert.match(source, /calendar\.specialDaysByWeek\?\.\[weekKey\] \?\? specialDaysForWeek\(start\)/);
});
