import test from "node:test";
import assert from "node:assert/strict";

import { sociology2026Package } from "../src/curriculum-packages/sociology-2026.ts";

const units = sociology2026Package.units;
const outcomes = units.flatMap((unit) => unit.outcomes);
const byCode = new Map(units.map((unit) => [unit.code, unit]));

test("2026 sosyoloji kanonik paketi resmî kaynak kimliğini korur", () => {
  const manifest = sociology2026Package.manifest;
  assert.equal(manifest.schemaVersion, "1.0.0");
  assert.equal(manifest.datasetVersion, "2026.1");
  assert.equal(manifest.lifecycle, "ACTIVE");
  assert.equal(manifest.discipline.code, "sociology");
  assert.equal(manifest.source.year, 2026);
  assert.equal(manifest.source.pageCount, 48);
  assert.equal(manifest.verification.sourceId, "meb:sociology:2026");
});

test("resmî ünite, çıktı ve süre toplamları kaynak tablosuyla eşleşir", () => {
  // Resmî program 1.3 tablosu (s. 10): Ders 1 → 18 çıktı, 68 ders saati + 4 okul
  // temelli planlama = 72; Ders 2 → 3 çıktı, 68 ders saati + 4 = 72.
  assert.equal(units.length, 7);
  assert.equal(outcomes.length, 21);

  const grade11 = units.filter((unit) => unit.grade === 11);
  const grade12 = units.filter((unit) => unit.grade === 12);
  assert.equal(grade11.length, 5);
  assert.equal(grade11.flatMap((unit) => unit.outcomes).length, 18);
  assert.equal(grade11.reduce((sum, unit) => sum + unit.durationHours, 0), 68);
  assert.equal(grade12.length, 2);
  assert.equal(grade12.flatMap((unit) => unit.outcomes).length, 3);
  assert.equal(grade12.reduce((sum, unit) => sum + unit.durationHours, 0), 68);
});

test("resmî ünite kodları, sınıf düzeyleri ve süre dağılımı birebir sabittir", () => {
  assert.deepEqual(
    units.map((unit) => [unit.code, unit.grade, unit.durationHours]),
    [
      ["SOS.11.1", 11, 16],
      ["SOS.11.2", 11, 14],
      ["SOS.11.3", 11, 12],
      ["SOS.11.4", 11, 16],
      ["SOS.11.5", 11, 10],
      ["SOS.12.1", 12, 20],
      ["SOS.12.2", 12, 48],
    ],
  );
  assert.equal(byCode.get("SOS.11.1").name, "Sosyolojinin Doğuşu");
  assert.equal(byCode.get("SOS.11.2").name, "Türkiye’de Modernleşme ve Sosyoloji");
  assert.equal(byCode.get("SOS.11.3").name, "Kültür ve Toplumsal Yapı");
  assert.equal(byCode.get("SOS.11.4").name, "Toplumsal Kurumlar");
  assert.equal(byCode.get("SOS.11.5").name, "Güncel Sosyolojik Meseleler");
  assert.equal(byCode.get("SOS.12.1").name, "Bilim Sosyolojisi");
  assert.equal(byCode.get("SOS.12.2").name, "Örnek Sosyolojik Uygulamalar");
});

test("öğrenme çıktı kodlarının resmî dağılımı korunur", () => {
  assert.deepEqual(
    byCode.get("SOS.11.1").outcomes.map((outcome) => outcome.code),
    ["SOS.11.1.1", "SOS.11.1.2", "SOS.11.1.3"],
  );
  assert.deepEqual(
    byCode.get("SOS.11.2").outcomes.map((outcome) => outcome.code),
    ["SOS.11.2.1", "SOS.11.2.2", "SOS.11.2.3"],
  );
  assert.deepEqual(
    byCode.get("SOS.11.3").outcomes.map((outcome) => outcome.code),
    ["SOS.11.3.1", "SOS.11.3.2", "SOS.11.3.3"],
  );
  assert.deepEqual(
    byCode.get("SOS.11.4").outcomes.map((outcome) => outcome.code),
    ["SOS.11.4.1", "SOS.11.4.2", "SOS.11.4.3", "SOS.11.4.4", "SOS.11.4.5", "SOS.11.4.6"],
  );
  assert.deepEqual(
    byCode.get("SOS.11.5").outcomes.map((outcome) => outcome.code),
    ["SOS.11.5.1", "SOS.11.5.2", "SOS.11.5.3"],
  );
  assert.deepEqual(
    byCode.get("SOS.12.1").outcomes.map((outcome) => outcome.code),
    ["SOS.12.1.1", "SOS.12.1.2"],
  );
  assert.deepEqual(
    byCode.get("SOS.12.2").outcomes.map((outcome) => outcome.code),
    ["SOS.12.2.1"],
  );
  assert.equal(new Set(outcomes.map((outcome) => outcome.code)).size, 21);
  for (const outcome of outcomes) {
    assert.match(outcome.code, /^SOS\.(11|12)\.\d+\.\d+$/u);
    assert.ok(outcome.description.length > 0);
  }
});

test("program kuralı haftalık iki ders saatini ve 72 saatlik yıllık toplamı sabitler", () => {
  // Resmî program (s. 6): Sosyoloji Dersi 1 ve 2 haftada ikişer ders saati
  // uygulanmak üzere hazırlanmıştır; her düzey 72 der saatidir (s. 11).
  const rules = sociology2026Package.manifest.programRules;
  assert.ok(rules, "sosyoloji paketi program kuralı taşımalıdır");
  assert.equal(rules.weeklyHours, 2);
  assert.equal(rules.instructionHoursPerGrade, 68);
  assert.equal(rules.schoolBasedPlanningHoursPerGrade, 4);
  assert.equal(rules.annualTotalHoursPerGrade, 72);
  assert.deepEqual(sociology2026Package.manifest.grades["11"], {
    unitCount: 5,
    learningOutcomeCount: 18,
    instructionHours: 68,
    schoolBasedPlanningHours: 4,
  });
  assert.deepEqual(sociology2026Package.manifest.grades["12"], {
    unitCount: 2,
    learningOutcomeCount: 3,
    instructionHours: 68,
    schoolBasedPlanningHours: 4,
  });
});

test("doğrulama kanıt zinciri tamamlanmadan VERIFIED iddiası taşınamaz", () => {
  const verification = sociology2026Package.manifest.verification;
  assert.equal(verification.status, "UNVERIFIED");
  assert.equal(verification.verifiedAt, null);
  assert.equal(verification.verificationMethod, null);
  assert.equal(
    verification.evidence.some((item) => item.type === "VERIFICATION_RECORD"),
    false,
  );
});
