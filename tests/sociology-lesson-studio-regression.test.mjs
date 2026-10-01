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
import { getLessonStudioWeekCount } from "../app/modules/lesson-studio/weekly-content-2026.ts";
import { getOutcomeForWeek } from "../app/modules/lesson-studio/week-outcome.ts";
import { makeResult } from "../app/modules/lesson-studio/lesson-engine.ts";
import { buildWeeklyProductVisibility } from "../app/modules/lesson-studio/product-visibility-2026.ts";
import { philosophyPhaseCatalog2026 } from "../app/modules/lesson-studio/phase-catalog-2026.ts";
import { specialPhaseCatalog } from "../app/modules/lesson-studio/phase-catalog.ts";
import { resolveDomainCapability } from "../src/core/domain-adapter/registry.ts";

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

test("sosyoloji alan adaptörü ürün çalışma zamanını kapalı tutar ve tanımsız alan bulunamaz", () => {
  const sociology = resolveDomainCapability("sociology");
  assert.equal(sociology.adapterFound, true);
  assert.equal(sociology.productRuntime, "disabled");
  assert.equal(sociology.pedagogicalGeneration, "disabled");
  assert.equal(sociology.documentGeneration, "disabled");

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

  assert.throws(
    () => phaseCatalogForDataset("sociology", "2026.1"),
    (error) =>
      error instanceof CurriculumFeatureUnavailableError &&
      error.subjectCode === "sociology" &&
      error.datasetVersion === "2026.1",
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
      getLessonStudioWeekCount(unit.code, unit.hours, unit.subjectCode),
      `${unit.code} hafta sayısı program kuralı ve kanonik veri setiyle tutarlı olmalıdır.`,
    );
  }
  assert.equal(
    units.reduce((sum, unit) => sum + getLessonStudioWeekCountByProgramRule(unit.hours, unit.subjectCode), 0),
    68,
  );

  assert.throws(
    () => getLessonStudioWeekCountByProgramRule(4, "sociology"),
    /sociology branşı için haftalık ders tasarımı içeriği henüz yayınlanmadı/u,
  );
  assert.throws(
    () => getLessonStudioWeekCountByProgramRule(4, "history"),
    /branşı için haftalık ders tasarımı içeriği henüz yayınlanmadı/u,
  );
});

test("sosyoloji üretim yolu canlı motor ve ürün görünürlüğü üzerinden fail-closed kalır", () => {
  assert.throws(
    () => getOutcomeForWeek(sociologyUnit, 1),
    /sociology branşı için haftalık ders tasarımı içeriği henüz yayınlanmadı/u,
  );
  assert.throws(
    () => makeResult(sociologyUnit, "SOC.10.1.1", "balanced", 1, "2026.1"),
    /sociology branşı için haftalık ders tasarımı içeriği henüz yayınlanmadı/u,
  );
  assert.throws(
    () => buildWeeklyProductVisibility("FEL.10.1.1", 1, "sociology"),
    /sociology branşı için haftalık ders tasarımı içeriği henüz yayınlanmadı/u,
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
