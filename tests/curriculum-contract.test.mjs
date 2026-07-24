import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import test from "node:test";

const dataset=JSON.parse(await readFile(new URL("../app/data/felsefe_curriculum_2024.json",import.meta.url),"utf8"));
const source=await readFile(new URL("../app/data/curriculum.ts",import.meta.url),"utf8");
const page=await readFile(new URL("../app/page.tsx",import.meta.url),"utf8");
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
  assert.match(source,/resolveUnit/);
  assert.match(source,/resolveOutcome/);
  assert.doesNotMatch(page,/\?\? units\[0\]/);
  assert.doesNotMatch(page,/\?\? gradeUnits\[0\]/);
});
