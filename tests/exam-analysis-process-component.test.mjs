import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { createExamBlueprintTransfer } from "../app/core/exam-blueprint-transfer.ts";

const base = { grade: 10, examName: "1. Sınav" };
const qs = (step) => [{ outcomeCode: "FEL.10.1.1", unitCode: "F10_U1", maxPoints: 50, componentStep: step }, { outcomeCode: "FEL.10.1.1", unitCode: "F10_U1", maxPoints: 50 }];

test("aktarım süreç bileşenini taşır; bileşensiz eski biçim geçerli kalır", () => {
  const transfer = createExamBlueprintTransfer({ ...base, questions: qs("ç") });
  assert.equal(transfer.questions[0].componentStep, "ç");
  assert.equal(transfer.questions[1].componentStep, undefined);
});

test("boş süreç bileşeni aktarımı reddedilir", () => {
  assert.throws(() => createExamBlueprintTransfer({ ...base, questions: qs("  ") }), /süreç bileşeni/);
});

test("analiz modülü bileşeni müfredata karşı doğrular ve raporda gösterir", async () => {
  const src = await readFile(new URL("../app/modules/exam-analysis/ExamAnalysisModule.tsx", import.meta.url), "utf8");
  assert.match(src, /müfredatta bulunmayan süreç bileşeni/);
  assert.match(src, /component: question\.componentStep/);
  assert.match(src, /Süreç bileşeni \$\{component\.step\}\)/);
  assert.match(src, /outcome: e\.target\.value, component: undefined/);
  const builder = await readFile(new URL("../app/modules/exam-builder/ExamBuilder.tsx", import.meta.url), "utf8");
  assert.match(builder, /componentStep: question\.componentStep \|\| undefined/);
});
