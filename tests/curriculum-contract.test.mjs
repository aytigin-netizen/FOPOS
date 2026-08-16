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

const dataset=JSON.parse(await readFile(new URL("../app/data/felsefe_curriculum_2024.json",import.meta.url),"utf8"));
const source=await readFile(new URL("../app/data/curriculum.ts",import.meta.url),"utf8");
const page=await readFile(new URL("../app/ClientApp.tsx",import.meta.url),"utf8");
const runtimeSource=await readFile(new URL("../app/data/curriculum-runtime.ts",import.meta.url),"utf8");
const allUnits=[...dataset.grades["10"].units,...dataset.grades["11"].units];

test("kanonik müfredat sürümü ve kapsamı doğrulanır",()=>{
  assert.equal(dataset.schema_version,"1.0.0");
  assert.equal(dataset.dataset_version,"2024.1");
  assert.equal(dataset.grades["10"].unit_count,9);
  assert.equal(dataset.grades["11"].unit_count,6);
  assert.equal(allUnits.length,15);
  assert.equal(allUnits.flatMap(unit=>unit.learning_outcomes).length,22);
  for(const grade of ["10","11"]){
    assert.equal(dataset.grades[grade].units.reduce((sum,unit)=>sum+unit.duration_hours,0),68);
    assert.equal(dataset.grades[grade].school_based_planning_hours,4);
  }
});

test("resmî alanlar kanonik JSON'dan kurulurken pedagojik zenginleştirme ayrıdır",()=>{
  assert.match(source,/import canonicalCurriculum from "\.\/felsefe_curriculum_2024\.json"/);
  assert.match(source,/const enrichments/);
  assert.match(source,/canonicalUnit\.learning_outcomes\.map/);
  assert.match(source,/curriculumMetadata/);
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
    datasetVersion: "2024.1",
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
  assert.match(source, /subjectCode: "philosophy"/);
  assert.match(source, /subjectName: "Felsefe"/);
  assert.match(source, /createCurriculumCatalog/);

  const sociology = createCurriculumCatalog({
    datasetVersion: "2024.1",
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
    getCurriculumRegistration("sociology")?.discipline.name,
    "Sosyoloji",
  );
});

test("felsefe paketi kanonik TYMM 2024 kapsamını kayıpsız yükler", () => {
  const philosophy = loadPackage("philosophy");
  assert.deepEqual(loadPackage(), philosophy);
  assert.equal(philosophy.manifest.source.year, 2024);
  assert.equal(philosophy.manifest.datasetVersion, "2024.1");
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
    allUnits.map((unit) => ({
      code: unit.unit_code,
      grade: unit.grade,
      durationHours: unit.duration_hours,
      outcomeCodes: unit.learning_outcomes.map((outcome) => outcome.outcome_code),
    })),
  );
});

test("paket yükleyici felsefe ve sosyolojiyi aynı sözleşmeden çözer", () => {
  assert.equal(loadPackage("sociology").manifest.datasetVersion, "2026.1");
  assert.doesNotMatch(runtimeSource, /subjectCode === "philosophy"/);
  assert.throws(() => loadPackage("psychology"), /paketi bulunamadı/);
});

test("çözümleyici etkin branş, varsayılan branş ve yükleyici sırasını korur", () => {
  assert.equal(
    resolveCurriculumPackage({ activeBranch: "philosophy" }).source,
    "active_branch",
  );
  assert.equal(
    resolveCurriculumPackage({
      activeBranch: "psychology",
      defaultBranch: "philosophy",
    }).source,
    "default_branch",
  );
  assert.equal(
    resolveCurriculumPackage({ activeBranch: "sociology" }).disciplineCode,
    "sociology",
  );
  assert.equal(resolveCurriculumPackage().source, "loader");
});

test("paket doğrulaması bilinmeyen öğrenme çıktısı bağlantısını reddeder", () => {
  const invalid = structuredClone(loadPackage());
  invalid.assessments.push({
    code: "exam",
    name: "Sınav",
    outcomeCodes: ["UNKNOWN"],
  });
  assert.throws(() => validateCurriculumPackage(invalid), /bilinmeyen çıktıya/);
});

test("yüklenen paket değişiklikleri sonraki yüklemelere sızmaz", () => {
  const first = loadPackage();
  first.manifest.discipline.code = "corrupted";
  first.units.push({
    code: "CORRUPTED",
    grade: 10,
    name: "Bozuk",
    durationHours: 1,
    outcomes: [],
  });
  const second = loadPackage();
  assert.equal(second.manifest.discipline.code, "philosophy");
  assert.equal(second.units.length, 15);
});

test("kayıt girdisi değişiklikleri listeleme ve çözümlemeyi bozamıyor", () => {
  const registration = getCurriculumRegistration("philosophy");
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
    resolveCurriculumPackage({ activeBranch: "philosophy" }).disciplineCode,
    "philosophy",
  );
});

test("2026 sosyoloji paketi resmî kapsamı ve kaynak izini korur", () => {
  const sociology = loadPackage("sociology");
  assert.deepEqual(
    sociology.manifest.discipline,
    { code: "sociology", name: "Sosyoloji" },
  );
  assert.equal(sociology.manifest.defaultGrade, 11);
  assert.equal(sociology.manifest.source.year, 2026);
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
