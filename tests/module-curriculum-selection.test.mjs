import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const analysis = await readFile(
  new URL(
    "../app/modules/exam-analysis/ExamAnalysisModule.tsx",
    import.meta.url,
  ),
  "utf8",
);
const builder = await readFile(
  new URL("../app/modules/exam-builder/ExamBuilder.tsx", import.meta.url),
  "utf8",
);
const compactAnalysis = analysis.replace(/\s+/g, "");
const compactBuilder = builder.replace(/\s+/g, "");

test("sınav analizi geçersiz üniteyi ilk kayda sessizce düşürmez", () => {
  assert.match(analysis, /function requireUnit/);
  assert.match(analysis, /doğrulanmış ünite bulunamadı/);
  assert.match(
    compactAnalysis,
    /constunit=requireUnit\(units,grade,unitCode\)/,
  );
  assert.doesNotMatch(compactAnalysis, /\|\|gradeUnits\[0\]/);
  assert.doesNotMatch(analysis, /find\(\(u\) => u\.code === code\)!/);
});

test("sınav oluşturucu geçersiz kapsamı başka öğrenme çıktısıyla değiştirmez", () => {
  assert.match(builder, /Seçime uygun doğrulanmış öğrenme çıktısı bulunamadı/);
  assert.match(builder, /kodlu doğrulanmış ünite bulunamadı/);
  assert.doesNotMatch(compactBuilder, /scope\.length\?scope:availableOutcomes/);
  assert.doesNotMatch(compactBuilder, /scope\[0\]\|\|availableOutcomes\[0\]/);
});
