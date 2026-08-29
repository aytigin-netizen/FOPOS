import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { createExamDecision } from "../app/core/exam-decision.ts";
import { toApprovedGenerationDecision } from "../app/core/opus-generation-bridge.ts";
import { approveRecord, submitForReview } from "../app/core/pedagogical-record.ts";
import { getCurriculumContext } from "../app/data/curriculum-runtime.ts";
import { buildDailyPlanArtifact } from "../app/modules/daily-plan/export-daily-plan.ts";
import { makeResult } from "../app/modules/lesson-studio/lesson-engine.ts";
import { getOutcomeForWeek } from "../app/modules/lesson-studio/week-outcome.ts";

const scenarios = Object.freeze([
  ["F10_U2", 1], ["F10_U2", 3], ["F10_U7", 1], ["F10_U7", 4],
  ["F10_U9", 1], ["F10_U9", 3], ["F11_U1", 1], ["F11_U1", 6],
  ["F11_U2", 1], ["F11_U2", 6], ["F11_U6", 1], ["F11_U6", 5],
]);
const units = getCurriculumContext("philosophy").units;
const meta = { school: "Kabul Okulu", academicYear: "2026-2027", date: "29.08.2026", teacher: "Felsefe Öğretmeni", principal: "Okul Müdürü", specialDays: "—" };

async function docxXmlFor(unitCode, week) {
  const unit = units.find((item) => item.code === unitCode);
  assert.ok(unit, unitCode);
  const outcome = getOutcomeForWeek(unit, week);
  const result = makeResult(unit, outcome.code, "balanced", week, "2026.1");
  const approved = approveRecord(submitForReview(result.pedagogicalRecord), "Belge paritesi için öğretmen incelemesi tamamlandı.");
  const artifact = await buildDailyPlanArtifact(result, meta, "Felsefe", toApprovedGenerationDecision(approved, "daily-plan"));
  const directory = mkdtempSync(join(tmpdir(), "fopos-parity-"));
  const path = join(directory, artifact.fileName);
  writeFileSync(path, Buffer.from(await artifact.blob.arrayBuffer()));
  return { result, xml: execFileSync("unzip", ["-p", path, "word/document.xml"], { encoding: "utf8", maxBuffer: 20_000_000 }) };
}

test("12/12 temsil haftası gerçek DOCX XML içinde yapılandırılmış ürün alanlarını ve 80 dakikayı korur", async () => {
  for (const [unitCode, week] of scenarios) {
    const { result, xml } = await docxXmlFor(unitCode, week);
    assert.equal(result.phases.length, 9);
    assert.equal(result.phases.reduce((sum, phase) => sum + phase.duration, 0), 80);
    for (const pattern of [/80 Dakikalık Ders Akışı/u, /Metin, Performans Ürünü ve Kaynak Kaydı/u, /Metin inceleme bağlamı/u, /Performans amacı/u, /Kaynak kaydı/u, /Rubrik bağlantısı/u, /Ölçüt \/ ağırlık/u]) assert.match(xml, pattern);
  }
});

test("F10_U9 H3 ve F11_U6 H5 DOCX belgelerinde altı boyutlu, düzey tanımlı 100 puanlık analitik rubrik görünür", async () => {
  for (const [unitCode, week, titlePattern] of [["F10_U9", 3, /Bilim felsefesi kaynaklı metin analitik rubriği/u], ["F11_U6", 5, /Hukuk felsefesi kaynaklı performans analitik rubriği/u]]) {
    const { result, xml } = await docxXmlFor(unitCode, week);
    assert.equal(result.productVisibility.rubric.criteria.length, 6);
    assert.equal(result.productVisibility.rubric.criteria.reduce((sum, item) => sum + item.weight, 0), 100);
    assert.ok(result.productVisibility.rubric.criteria.every((item) => item.levels.length === 4));
    assert.match(xml, titlePattern);
    assert.match(xml, /4 — Tam/u);
    assert.match(xml, /1 — Başlangıç/u);
  }
});

test("12 temsil kapsamının standart ve BEP ikizleri seçili ünite/çıktıyı ve temel felsefi kanıtı korur", () => {
  for (const [unitCode, week] of scenarios) {
    const unit = units.find((item) => item.code === unitCode);
    assert.ok(unit);
    const outcome = getOutcomeForWeek(unit, week);
    const common = { academicYear: "2026-2027", subjectCode: "philosophy", datasetVersion: "2026.1", grade: unit.grade, examName: "Temsil Kapsam Sınavı", unitCodes: [unit.code], outcomeCodes: [outcome.code], questionCount: 5, durationMinutes: 40, totalPoints: 100 };
    const standard = createExamDecision({ scope: { ...common, mode: "standard" } });
    const bep = createExamDecision({ scope: { ...common, mode: "bep", durationMinutes: 60, adaptationKey: "reading" } });
    for (const record of [standard, bep]) {
      assert.match(record.pedagogicalDecision.learningEvidence, new RegExp(`Üniteler: ${unit.code}`));
      assert.match(record.pedagogicalDecision.learningEvidence, new RegExp(`Öğrenme çıktıları: ${outcome.code.replaceAll(".", "\\.")}`));
    }
    const baseEvidence = (value) => value.replace(/Uyarlama: yok|Eğitimsel uyarlama: reading/u, "Uyarlama: <erişim>");
    assert.equal(baseEvidence(standard.pedagogicalDecision.learningEvidence), baseEvidence(bep.pedagogicalDecision.learningEvidence));
  }
});
