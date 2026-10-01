import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { getCurriculumContext } from "../app/data/curriculum-runtime.ts";
import { CurriculumFeatureUnavailableError } from "../app/core/curriculum-feature-unavailable.ts";
import { phaseCatalogForDataset } from "../app/modules/lesson-studio/phase-catalog-runtime.ts";
import {
  getLessonStudioWeekCountByProgramRule,
  lessonStudioWeeklyHours,
} from "../app/modules/lesson-studio/lesson-studio-week-count.ts";
import { getOutcomeForWeek } from "../app/modules/lesson-studio/week-outcome.ts";
import { makeResult } from "../app/modules/lesson-studio/lesson-engine.ts";
import { buildWeeklyProductVisibility } from "../app/modules/lesson-studio/product-visibility-2026.ts";
import {
  getSociologyUnitWeekFocus,
  getSociologyWeeklyContent,
} from "../app/modules/lesson-studio/sociology-weekly-content-2026.ts";
import { sociologyPhaseCatalog2026 } from "../app/modules/lesson-studio/phase-catalog-sociology-2026.ts";
import { philosophyPhaseCatalog2026 } from "../app/modules/lesson-studio/phase-catalog-2026.ts";
import { specialPhaseCatalog } from "../app/modules/lesson-studio/phase-catalog.ts";
import { resolveDomainCapability } from "../src/core/domain-adapter/registry.ts";
import { sociology2026Package } from "../src/curriculum-packages/sociology-2026.ts";

const sociologyUnit = {
  code: "S10_U1",
  name: "Sosyolojiye Giriş",
  hours: 4,
  grade: 10,
  keywords: ["toplum", "sosyalleşme"],
  outcomes: [{ code: "SOC.10.1.1", description: "Toplumu bir yapı olarak açıklar.", processComponents: [] }],
  strategy: "Sorgulamaya dayalı tartışma",
  methods: ["tartışma"],
  opening: "Örnek olay",
  inquiry: "Toplum nedir?",
  discussion: "Birey toplumu nasıl üretir?",
  application: "Gözlem görevi",
  evidence: "Gözlem notu",
  subjectCode: "sociology",
};

test("sosyoloji alan adaptörü ürün çalışma zamanını açar ve tanımsız alan bulunamaz", () => {
  const sociology = resolveDomainCapability("sociology");
  assert.equal(sociology.adapterFound, true);
  assert.equal(sociology.productRuntime, "enabled");
  assert.equal(sociology.pedagogicalGeneration, "enabled");
  assert.equal(sociology.documentGeneration, "enabled");
  assert.equal(sociology.reason, "ready");

  const unknown = resolveDomainCapability("history");
  assert.equal(unknown.adapterFound, false);
  assert.equal(unknown.productRuntime, "disabled");
});

test("aşama kataloğu subjectCode ve datasetVersion ikilisine bağlı davranır", () => {
  assert.equal(
    phaseCatalogForDataset("philosophy", "2026.1"),
    philosophyPhaseCatalog2026,
  );
  assert.equal(phaseCatalogForDataset("philosophy", "2024.1"), specialPhaseCatalog);
  assert.equal(
    phaseCatalogForDataset("sociology", "2026.1"),
    sociologyPhaseCatalog2026,
  );

  assert.throws(
    () => phaseCatalogForDataset("philosophy", "unknown"),
    (error) =>
      error instanceof CurriculumFeatureUnavailableError &&
      error.subjectCode === "philosophy" &&
      error.datasetVersion === "unknown",
  );
  assert.throws(
    () => phaseCatalogForDataset("sociology", "2024.1"),
    CurriculumFeatureUnavailableError,
  );
});

test("hafta sayısı program kuralından türetilir ve birim kodu öneklerine bağlı değildir", () => {
  const dataset = JSON.parse(
    readFileSync(new URL("../app/data/felsefe_curriculum_2026.json", import.meta.url), "utf8"),
  );
  assert.equal(dataset.program_rules.weekly_hours, lessonStudioWeeklyHours.philosophy);

  const units = getCurriculumContext("philosophy").units;
  for (const unit of units) {
    assert.equal(
      getLessonStudioWeekCountByProgramRule(unit.hours, unit.subjectCode),
      Math.ceil(unit.hours / dataset.program_rules.weekly_hours),
      `${unit.code} hafta sayısı program kuralı ve kanonik veri setiyle tutarlı olmalıdır.`,
    );
  }
  // 68 = 15 ünitenin program kuralından türetilmiş hafta sayısı toplamı.
  assert.equal(
    units.reduce((sum, unit) => sum + getLessonStudioWeekCountByProgramRule(unit.hours, unit.subjectCode), 0),
    68,
  );

  // Resmî sosyoloji kuralı (s. 6): haftada iki ders saati.
  assert.equal(lessonStudioWeeklyHours.sociology, 2);
  assert.equal(getLessonStudioWeekCountByProgramRule(16, "sociology"), 8);
  assert.equal(getLessonStudioWeekCountByProgramRule(14, "sociology"), 7);
  assert.equal(getLessonStudioWeekCountByProgramRule(48, "sociology"), 24);

  assert.throws(
    () => getLessonStudioWeekCountByProgramRule(4, "history"),
    /branşı için haftalık ders tasarımı içeriği henüz yayınlanmadı/u,
  );
});

test("sosyoloji üretim yolu resmî haftalık içerik ve kazanım bileşenleriyle açılmıştır", () => {
  const context = getCurriculumContext("sociology");
  // 68 saat / 2 = 34 hafta; her iki düzey 34 haftaya bölünür.
  assert.equal(
    context.units.reduce(
      (sum, unit) => sum + getLessonStudioWeekCountByProgramRule(unit.hours, unit.subjectCode),
      0,
    ),
    68,
  );
  for (const unit of context.units) {
    const weekCount = getLessonStudioWeekCountByProgramRule(unit.hours, unit.subjectCode);
    const titles = Array.from({ length: weekCount }, (_, index) =>
      getSociologyUnitWeekFocus(unit.code, index + 1),
    );
    assert.ok(titles.every((title) => typeof title === "string" && title.length > 0), `${unit.code} haftalarının tamamı odağı taşımalıdır.`);
    assert.equal(new Set(titles).size, weekCount, `${unit.code} hafta odakları benzersiz olmalıdır.`);
    assert.equal(getSociologyUnitWeekFocus(unit.code, weekCount + 1), null);
    for (const outcome of unit.outcomes) {
      assert.ok(
        outcome.processComponents.length >= 2,
        `${outcome.code} resmî süreç bileşenlerini taşımalıdır.`,
      );
    }
  }
});

test("sosyoloji canlı motoru 9 aşamalı 80 dakikalık ürün üretir", () => {
  const context = getCurriculumContext("sociology");
  const unit = context.units[0];
  const outcome = getOutcomeForWeek(unit, 1);
  const result = makeResult(unit, outcome.code, "balanced", 1, context.datasetVersion);

  assert.equal(result.validation.status, "RULE_CHECKED");
  assert.equal(result.phases.length, 9);
  assert.equal(result.phases.reduce((sum, phase) => sum + phase.duration, 0), 80);
  assert.equal(result.productVisibility.rubric.totalPoints, 100);
  assert.equal(result.pedagogicalRecord.curriculum.datasetVersion, "2026.1");
  assert.ok(result.outcome.processComponents.length >= 2);
  assert.ok(getSociologyWeeklyContent(outcome.code, 1));
  assert.equal(getSociologyWeeklyContent("SOS.99.9.9", 1), null);
});

test("sosyoloji ürün görünürlüğü sosyolojik rubrik ile açılır", () => {
  const visibility = buildWeeklyProductVisibility("SOS.11.1.1", 1, "sociology");
  assert.equal(visibility.rubric.totalPoints, 100);
  assert.ok(visibility.rubric.title.includes("rubriği"));
  assert.throws(
    () => buildWeeklyProductVisibility("SOS.11.1.1", 1, "history"),
    /branşı için haftalık ders tasarımı içeriği henüz yayınlanmadı/u,
  );
});

test("felsefe 2026 pozitif yolu canlı üretim zincirini bütünlükle korur", () => {
  const context = getCurriculumContext("philosophy");
  const unit = context.units[0];
  const outcome = getOutcomeForWeek(unit, 1);
  const result = makeResult(unit, outcome.code, "balanced", 1, context.datasetVersion);

  assert.equal(result.validation.status, "RULE_CHECKED");
  assert.equal(result.phases.length, 9);
  assert.equal(result.phases.reduce((sum, phase) => sum + phase.duration, 0), 80);
  assert.equal(result.productVisibility.rubric.totalPoints, 100);
  assert.equal(result.pedagogicalRecord.curriculum.datasetVersion, "2026.1");
});

test("kanonik pakette 21 çıktının tamamı resmî süreç bileşenlerini taşır", () => {
  const outcomes = sociology2026Package.units.flatMap((unit) => unit.outcomes);
  assert.equal(outcomes.length, 21);
  for (const outcome of outcomes) {
    assert.ok(
      outcome.processComponents && outcome.processComponents.length >= 2,
      `${outcome.code} en az iki süreç bileşeni taşımalıdır.`,
    );
    for (const component of outcome.processComponents) {
      assert.ok(component.step && component.description, `${outcome.code} bileşenleri step ve description taşımalıdır.`);
    }
  }
});
