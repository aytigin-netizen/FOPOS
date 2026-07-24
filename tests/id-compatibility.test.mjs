import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { createId } from "../app/core/id.js";

test("kimlik üretimi randomUUID desteğine zorunlu olarak bağlı değildir", () => {
  const first = createId();
  const second = createId();
  assert.ok(first.length >= 16);
  assert.notEqual(first, second);
});

test("uygulama modülleri doğrudan crypto.randomUUID çağırmaz", async () => {
  const files = [
    "../app/core/pedagogical-record.ts",
    "../app/modules/exam-analysis/ExamAnalysisModule.tsx",
    "../app/modules/exam-builder/ExamBuilder.tsx",
  ];
  const sources = await Promise.all(
    files.map((file) => readFile(new URL(file, import.meta.url), "utf8")),
  );
  assert.doesNotMatch(sources.join("\n"), /crypto\.randomUUID\(\)/);
  assert.match(sources.join("\n"), /createId\(/);
});
