import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { buildExamPackageArtifact } from "../app/modules/exam-builder/export-exam-package.ts";

const curriculum = JSON.parse(await readFile(new URL("../app/data/felsefe_curriculum_2026.json", import.meta.url), "utf8"));
const unit = curriculum.grades["10"].units[0];
const cf = unit.competency_framework;
const tymm = { fieldSkills: cf.field_skills, tendencies: cf.tendencies, values: cf.cross_program_components.values };
const q = (i) => ({ outcomeCode: "FEL.10.1.1", unitCode: unit.unit_code, kindLabel: "Açık uçlu", levelLabel: "Anlama", componentStep: "a",
  componentDescription: "Felsefenin anlamını merak eder.", text: `Soru ${i}`, points: i === 1 ? 50 : 50, answer: "Gerekçeli yanıt.", criterion: "Gerekçe 5 puan.", tymm });
const input = { school: "Okul", academicYear: "2026-2027", grade: 10, subjectName: "Felsefe", examName: "1. Sınav", booklet: "A", durationMinutes: 40, mode: "standard", questions: [q(1), q(2)] };

async function xml(blob) {
  const { default: JSZip } = await import("jszip");
  const zip = await JSZip.loadAsync(await blob.arrayBuffer());
  return zip.file("word/document.xml").async("string");
}

test("öğretmen paketi TYMM çerçeve izini ve alan becerisini içerir", async () => {
  const { blob } = await buildExamPackageArtifact(input, "teacher");
  const doc = await xml(blob);
  assert.match(doc, /TYMM ÇERÇEVE İZİ/);
  assert.match(doc, /SBAB13\. Felsefi Sorgulama/);
  assert.match(doc, /Alan becerisi \(ünite çerçevesi\)/);
  assert.match(doc, /iddia etmez/);
});

test("öğrenci kitapçığında TYMM izi görünmez", async () => {
  const { blob } = await buildExamPackageArtifact(input, "student");
  const doc = await xml(blob);
  assert.doesNotMatch(doc, /TYMM|SBAB13/);
});

test("TYMM verisi yoksa paket yine üretilir ve TYMM bölümü eklenmez", async () => {
  const { blob } = await buildExamPackageArtifact({ ...input, questions: input.questions.map((question) => ({ ...question, tymm: undefined })) }, "teacher");
  const doc = await xml(blob);
  assert.doesNotMatch(doc, /TYMM ÇERÇEVE İZİ/);
});

test("ünite koduna göre verilen TYMM çerçevesi sorulara uygulanır", async () => {
  const { blob } = await buildExamPackageArtifact({ ...input, questions: input.questions.map((question) => ({ ...question, tymm: undefined })), tymmByUnit: { [unit.unit_code]: tymm } }, "teacher");
  assert.match(await xml(blob), /SBAB13\. Felsefi Sorgulama/);
});

test("öğretmen paketi SDB, okuryazarlık ve ilişkileri ünite çerçevesinden yazar; öğrenci paketinde görünmez", async () => {
  const cp = cf.cross_program_components;
  const full = { ...tymm, socialEmotionalLearning: cp.social_emotional_learning, literacy: cp.literacy,
    interdisciplinaryRelations: cf.interdisciplinary_relations, interSkillRelations: cf.inter_skill_relations };
  const withFull = { ...input, questions: input.questions.map((question) => ({ ...question, tymm: full })) };
  const teacher = await xml((await buildExamPackageArtifact(withFull, "teacher")).blob);
  assert.match(teacher, /Sosyal-duygusal öğrenme becerileri/);
  assert.match(teacher, new RegExp(cp.social_emotional_learning[0].replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(teacher, /Okuryazarlık becerileri/);
  assert.match(teacher, new RegExp(cp.literacy[0].replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.match(teacher, /Disiplinler arası ilişkiler/);
  assert.match(teacher, /Beceriler arası ilişkiler/);
  const student = await xml((await buildExamPackageArtifact(withFull, "student")).blob);
  assert.doesNotMatch(student, /Sosyal-duygusal|Okuryazarlık becerileri/);
});

test("eski çağrılar (yalnız üç alan) yeni satırları yazmaz", async () => {
  const doc = await xml((await buildExamPackageArtifact(input, "teacher")).blob);
  assert.doesNotMatch(doc, /Sosyal-duygusal öğrenme becerileri:|Okuryazarlık becerileri:/);
});
