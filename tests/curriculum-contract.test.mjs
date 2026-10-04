import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import test from "node:test";
import {
  createCurriculumCatalog,
  resolveCatalogUnit,
} from "../app/core/curriculum-catalog.ts";
import {
  getCurriculumRegistration,
  listRegisteredDisciplines,
} from "../src/core/curriculum/curriculum-registry.ts";
import { resolveCurriculumPackage } from "../src/core/curriculum/curriculum-resolver.ts";
import { loadPackage } from "../src/core/curriculum/package-loader.ts";
import { validateCurriculumPackage } from "../src/core/curriculum/validation.ts";

const dataset=JSON.parse(await readFile(new URL("../app/data/felsefe_curriculum_2026.json",import.meta.url),"utf8"));
const activeDataset=JSON.parse(await readFile(new URL("../app/data/felsefe_curriculum_2026.json",import.meta.url),"utf8"));
const source=await readFile(new URL("../app/data/curriculum.ts",import.meta.url),"utf8");
const page=await readFile(new URL("../app/ClientApp.tsx",import.meta.url),"utf8");
const runtimeSource=await readFile(new URL("../app/data/curriculum-runtime.ts",import.meta.url),"utf8");
const allUnits=[...dataset.grades["10"].units,...dataset.grades["11"].units];

test("kanonik müfredat sürümü ve kapsamı doğrulanır",()=>{
  assert.equal(dataset.schema_version,"1.0.0");
  assert.equal(dataset.dataset_version,"2026.1");
  assert.equal(dataset.grades["10"].unit_count,9);
  assert.equal(dataset.grades["11"].unit_count,6);
  assert.equal(allUnits.length,15);
  assert.equal(allUnits.flatMap(unit=>unit.learning_outcomes).length,22);
  for(const grade of ["10","11"]){
    assert.equal(dataset.grades[grade].units.reduce((sum,unit)=>sum+unit.duration_hours,0),68);
    assert.equal(dataset.grades[grade].school_based_planning_hours,4);
  }
});

test("çalışma zamanı müfredatı 2026.1 paketinden gelir, 0000.1 kopyasını taşımaz",()=>{
  // Kaldırılmış kaynak çalışma zamanında yüklenemez.
  assert.doesNotMatch(source,/felsefe_curriculum_unsupported\.json/);
  assert.doesNotMatch(source,/const enrichments/);
  assert.doesNotMatch(source,/curriculumMetadata/);
  // Çalışma zamanı yalnızca 2026.1 kabul eder.
  assert.match(runtimeSource,/philosophy2026RuntimeUnits/);
  assert.match(runtimeSource,/datasetVersion !== "2026\.1"/);
  assert.equal(activeDataset.dataset_version,"2026.1");
  // 0000.1 artık kayıtlı veya çözümlenebilir değildir.
  assert.equal(getCurriculumRegistration("philosophy","0000.1"), null);
  assert.throws(() => resolveCurriculumPackage({disciplineCode:"philosophy",datasetVersion:"0000.1"}));
});

test("TYMM program bileşenleri ve öğrenme yaşantısı alanları kanonik veriden taşınır",()=>{
  assert.match(source,/competencyFramework/);
  assert.match(source,/processComponents/);
  assert.match(source,/learningTeachingExperiences/);
  assert.match(source,/differentiation/);
  assert.match(source,/contentFramework/);
});

test("geçersiz bağlam ilk kayda sessizce düşmez",()=>{
  const catalog = createCurriculumCatalog({
    datasetVersion: "0000.1",
    subject: {
      code: "philosophy",
      name: "Felsefe",
      courseType: "independent",
    },
    units: [
      {
        grade: 10,
        code: "F10_U1",
        outcomeCodes: ["FEL.10.1.1"],
      },
    ],
  });
  assert.equal(
    resolveCatalogUnit(catalog, "philosophy", 9, "F10_U1").ok,
    false,
  );
  assert.equal(
    resolveCatalogUnit(catalog, "philosophy", 10, "BULUNMAYAN").ok,
    false,
  );
  assert.doesNotMatch(page,/\?\? units\[0\]/);
  assert.doesNotMatch(page,/\?\? gradeUnits\[0\]/);
});

test("müfredat çekirdeği ders alanı ve sınıf düzeyinden bağımsızdır", () => {
  // Branş kimliği paket manifestinden okunur; çalışma zamanı modülü tek bir
  // branşa sabitlenmez.
  assert.match(runtimeSource, /curriculumPackage\.manifest\.discipline\.code/);
  assert.match(runtimeSource, /curriculumPackage\.manifest\.discipline\.name/);
  assert.doesNotMatch(source, /subjectCode: "philosophy"/);
  assert.doesNotMatch(source, /createCurriculumCatalog/);

  const sociology = createCurriculumCatalog({
    datasetVersion: "0000.1",
    subject: {
      code: "sociology",
      name: "Sosyoloji",
      courseType: "independent",
    },
    units: [
      {
        grade: 12,
        code: "SOC.12.U1",
        outcomeCodes: ["SOC.12.1.1"],
      },
    ],
  });
  assert.deepEqual(sociology.supportedGrades, [12]);
  assert.equal(
    resolveCatalogUnit(sociology, "sociology", 12, "SOC.12.U1").ok,
    true,
  );
  assert.equal(
    resolveCatalogUnit(sociology, "philosophy", 12, "SOC.12.U1").ok,
    false,
  );
});

test("müfredat kayıt defteri felsefe ve resmî sosyoloji paketlerini açar", () => {
  assert.deepEqual(listRegisteredDisciplines(), [
    { code: "philosophy", name: "Felsefe" },
    { code: "sociology", name: "Sosyoloji" },
  ]);
  assert.equal(
    getCurriculumRegistration("sociology", "2026.1")?.discipline.name,
    "Sosyoloji",
  );
  assert.equal(
    getCurriculumRegistration("philosophy", "0000.1"),
    null,
  );
  assert.equal(
    getCurriculumRegistration("philosophy", "2026.1")?.datasetVersion,
    "2026.1",
  );
});

test("felsefe paketi etkin kanonik TYMM 2026 kapsamını kayıpsız yükler", () => {
  const philosophy = loadPackage({ disciplineCode: "philosophy", datasetVersion: "2026.1" });
  assert.equal(philosophy.manifest.source.year, 2026);
  assert.equal(philosophy.manifest.datasetVersion, "2026.1");
  assert.equal(philosophy.manifest.verification.status, "VERIFIED");
  assert.equal(philosophy.manifest.verification.sourceVersion, "2026.1");
  assert.ok(philosophy.manifest.verification.evidence.some(
    (evidence) => evidence.type === "OFFICIAL_SOURCE",
  ));
  assert.ok(philosophy.manifest.verification.evidence.some(
    (evidence) => evidence.type === "VERIFICATION_RECORD",
  ));
  assert.equal(philosophy.units.length, 15);
  assert.equal(
    philosophy.units.flatMap((unit) => unit.outcomes).length,
    22,
  );
  for (const grade of [10, 11]) {
    assert.equal(
      philosophy.units
        .filter((unit) => unit.grade === grade)
        .reduce((sum, unit) => sum + unit.durationHours, 0),
      68,
    );
  }
  assert.deepEqual(
    philosophy.units.map((unit) => ({
      code: unit.code,
      grade: unit.grade,
      durationHours: unit.durationHours,
      outcomeCodes: unit.outcomes.map((outcome) => outcome.code),
    })),
    [...activeDataset.grades["10"].units, ...activeDataset.grades["11"].units].map((unit) => ({
      code: unit.unit_code,
      grade: unit.grade,
      durationHours: unit.duration_hours,
      outcomeCodes: unit.learning_outcomes.map((outcome) => outcome.outcome_code),
    })),
  );
});

test("paket yükleyici felsefe ve sosyolojiyi aynı sözleşmeden çözer", () => {
  assert.equal(
    loadPackage({ disciplineCode: "sociology", datasetVersion: "2026.1" }).manifest.datasetVersion,
    "2026.1",
  );
  assert.doesNotMatch(runtimeSource, /subjectCode === "philosophy"/);
  assert.throws(
    () => loadPackage({ disciplineCode: "psychology", datasetVersion: "2026.1" }),
    /paketi bulunamadı/,
  );
  assert.throws(
    () => loadPackage(),
    /branş ve veri seti sürümü gereklidir/,
  );
});

test("çözümleyici branş ve veri seti sürümünü açıkça ister, fallback yapmaz", () => {
  const active = resolveCurriculumPackage({
    disciplineCode: "philosophy",
    datasetVersion: "2026.1",
  });
  assert.equal(active.source, "registry");
  assert.equal(active.disciplineCode, "philosophy");
  assert.equal(active.datasetVersion, "2026.1");

  assert.throws(() => resolveCurriculumPackage({ disciplineCode: "philosophy", datasetVersion: "0000.1" }), /müfredat kaydı bulunamadı/);

  assert.throws(
    () => resolveCurriculumPackage({ disciplineCode: "philosophy", datasetVersion: "2099.1" }),
    /müfredat kaydı bulunamadı/,
  );
  assert.throws(
    () => resolveCurriculumPackage({ disciplineCode: "psychology", datasetVersion: "2026.1" }),
    /müfredat kaydı bulunamadı/,
  );
  assert.throws(
    () => resolveCurriculumPackage(),
    /branş ve veri seti sürümü gereklidir/,
  );
});

test("paket doğrulaması bilinmeyen öğrenme çıktısı bağlantısını reddeder", () => {
  const invalid = structuredClone(
    loadPackage({ disciplineCode: "philosophy", datasetVersion: "2026.1" }),
  );
  invalid.assessments.push({
    code: "exam",
    name: "Sınav",
    outcomeCodes: ["UNKNOWN"],
  });
  assert.throws(() => validateCurriculumPackage(invalid), /bilinmeyen çıktıya/);
});

test("paket doğrulaması eksik canonical alanı ve tutarsız sınıf özetini reddeder", () => {
  const missingComponents = structuredClone(
    loadPackage({ disciplineCode: "philosophy", datasetVersion: "2026.1" }),
  );
  missingComponents.units[0].outcomes[0].processComponents = [];
  assert.throws(
    () => validateCurriculumPackage(missingComponents),
    /Canonical süreç bileşenleri eksik/u,
  );

  const inconsistentSummary = structuredClone(
    loadPackage({ disciplineCode: "philosophy", datasetVersion: "2026.1" }),
  );
  inconsistentSummary.manifest.grades["10"].instructionHours += 2;
  assert.throws(
    () => validateCurriculumPackage(inconsistentSummary),
    /canonical paket özeti tutarsız/u,
  );
});

test("resmî doğrulama yalnız kaynak ve doğrulama kanıtı zinciriyle kabul edilir", () => {
  const missingEvidence = structuredClone(
    loadPackage({ disciplineCode: "philosophy", datasetVersion: "2026.1" }),
  );
  missingEvidence.manifest.verification.evidence = missingEvidence.manifest.verification.evidence
    .filter((evidence) => evidence.type !== "VERIFICATION_RECORD");
  assert.throws(
    () => validateCurriculumPackage(missingEvidence),
    /resmî kaynak ve doğrulama kanıtı/u,
  );

  const versionMismatch = structuredClone(
    loadPackage({ disciplineCode: "philosophy", datasetVersion: "2026.1" }),
  );
  versionMismatch.manifest.verification.sourceVersion = "0000.1";
  assert.throws(
    () => validateCurriculumPackage(versionMismatch),
    /kaynak sürümü veri seti sürümüyle eşleşmiyor/u,
  );

  const falseClaim = structuredClone(
    loadPackage({ disciplineCode: "sociology", datasetVersion: "2026.1" }),
  );
  falseClaim.manifest.verification.status = "UNVERIFIED";
  falseClaim.manifest.verification.verifiedAt = "2026-09-15T00:00:00.000Z";
  assert.throws(
    () => validateCurriculumPackage(falseClaim),
    /doğrulama iddiası taşıyamaz/u,
  );
});

test("yüklenen paket değişiklikleri sonraki yüklemelere sızmaz", () => {
  const selector = { disciplineCode: "philosophy", datasetVersion: "2026.1" };
  const first = loadPackage(selector);
  first.manifest.discipline.code = "corrupted";
  first.units.push({
    code: "CORRUPTED",
    grade: 10,
    name: "Bozuk",
    durationHours: 1,
    outcomes: [],
  });
  const second = loadPackage(selector);
  assert.equal(second.manifest.discipline.code, "philosophy");
  assert.equal(second.units.length, 15);
});

test("kayıt girdisi değişiklikleri listeleme ve çözümlemeyi bozamıyor", () => {
  const registration = getCurriculumRegistration("philosophy", "2026.1");
  assert.ok(registration);
  registration.discipline.code = "corrupted";
  registration.load = () => {
    throw new Error("corrupted");
  };
  assert.deepEqual(listRegisteredDisciplines(), [
    { code: "philosophy", name: "Felsefe" },
    { code: "sociology", name: "Sosyoloji" },
  ]);
  assert.equal(
    resolveCurriculumPackage({
      disciplineCode: "philosophy",
      datasetVersion: "2026.1",
    }).disciplineCode,
    "philosophy",
  );
});

test("2026 sosyoloji paketi resmî kapsamı ve kaynak izini korur", () => {
  const sociology = loadPackage({ disciplineCode: "sociology", datasetVersion: "2026.1" });
  assert.deepEqual(
    sociology.manifest.discipline,
    { code: "sociology", name: "Sosyoloji" },
  );
  assert.equal(sociology.manifest.defaultGrade, 11);
  assert.equal(sociology.manifest.source.year, 2026);
  assert.equal(sociology.manifest.verification.status, "VERIFIED");
  assert.match(sociology.manifest.source.url, /mufredat\.meb\.gov\.tr/);
  assert.deepEqual(
    sociology.units.filter((unit) => unit.grade === 11).map((unit) => unit.durationHours),
    [16, 14, 12, 16, 10],
  );
  assert.deepEqual(
    sociology.units.filter((unit) => unit.grade === 12).map((unit) => unit.durationHours),
    [20, 48],
  );
  assert.equal(
    sociology.units
      .filter((unit) => unit.grade === 11)
      .reduce((sum, unit) => sum + unit.durationHours, 0),
    68,
  );
  assert.equal(
    sociology.units
      .filter((unit) => unit.grade === 12)
      .reduce((sum, unit) => sum + unit.durationHours, 0),
    68,
  );
  assert.equal(
    sociology.units.flatMap((unit) => unit.outcomes).length,
    21,
  );
});
