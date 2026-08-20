import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const matrix = JSON.parse(readFileSync(new URL("./fixtures/trust-chain-closure-matrix.json", import.meta.url), "utf8"));
const readFixture = (stage) => JSON.parse(readFileSync(new URL(`./fixtures/${stage.fixtureFile}`, import.meta.url), "utf8"));

test("Pilot 3.0–3.3 adımları tek ve sabit sırada kapanır", () => {
  assert.equal(matrix.schemaVersion, "1.0.0");
  assert.equal(matrix.matrixId, "opus-fopos-trust-chain-closure-3.4");
  assert.deepEqual(matrix.stages.map(({ pilot }) => pilot), ["3.0", "3.1", "3.2", "3.3"]);
  assert.deepEqual(matrix.stages.map(({ step }) => step), matrix.chainOrder);
});
test("FOPOS her aşamada OPUS ortak fikstür kümesini ve mahremiyet sınırını korur", () => {
  for (const stage of matrix.stages) {
    const fixture = readFixture(stage);
    assert.equal(fixture.fixtureSet, stage.fixtureSet);
    assert.equal(fixture.containsRealStudentData, false);
    assert.equal(stage.requiresNoStudentPersonalData, true);
  }
});
test("desteklenen şema ve politika sürümleri sabittir", () => {
  assert.deepEqual(matrix.stages.map(({ supportedSchemaVersions }) => supportedSchemaVersions), [["1.2.0"], ["1.0.0"], ["1.0.0"], ["1.0.0"]]);
  assert.deepEqual(matrix.stages.map(({ policyVersions }) => policyVersions), [[], ["1.0.0"], ["1.0.0"], ["1.0.0"]]);
});
test("bağımsız makbuz doğrulamasının 256 KiB sınırı çapraz doğrulanır", () => {
  const stage = matrix.stages.find(({ pilot }) => pilot === "3.3");
  assert.ok(stage);
  assert.equal(stage.maxFileSizeBytes, 256 * 1024);
  assert.equal(readFixture(stage).maxFileSizeBytes, stage.maxFileSizeBytes);
});
test("kapanış kapısı yeni türev kanıt veya gerçek öğrenci verisi üretmez", () => {
  assert.equal(matrix.producesDerivedEvidence, false);
  assert.equal(matrix.containsRealStudentData, false);
  assert.deepEqual(matrix.forbiddenKeyFragments, ["studentName", "studentNumber", "fileName", "filePath", "sourceResult"]);
});
