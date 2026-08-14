import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  createPortableAuditVerificationReceipt,
  validatePortableAuditVerificationReceipt,
} from "../app/core/portable-audit-verification-receipt.ts";
import { validatePortableAuditResult } from "../app/core/portable-audit-result.ts";

const receiptParityFixtures = JSON.parse(
  readFileSync(
    new URL("./fixtures/portable-audit-verification-receipt-parity.json", import.meta.url),
    "utf8",
  ),
);
const portableResultFixtures = JSON.parse(
  readFileSync(new URL("./fixtures/portable-audit-result-parity.json", import.meta.url), "utf8"),
);

test("Pilot 3.2 yalnız geçerli taşınabilir sonuçtan makbuz üretir", async () => {
  const sourceResult = portableResultFixtures.cases.find(({ id }) => id === "valid-1.0.0").payload;
  assert.equal((await validatePortableAuditResult(sourceResult)).status, "valid");
  const receipt = await createPortableAuditVerificationReceipt({
    sourceResult,
    verifiedAt: "2026-08-14T09:00:00.000Z",
  });
  assert.equal(receipt.status, "valid");
  assert.equal(receipt.result.digest, sourceResult.resultIntegrity.digest);
  assert.equal((await validatePortableAuditVerificationReceipt(receipt)).status, "valid");
  assert.doesNotMatch(
    JSON.stringify(receipt),
    /studentName|studentNumber|fileName|filePath|sources|sourceResult/iu,
  );
});

test("Pilot 3.2 reddedilmiş taşınabilir sonuçtan makbuz üretmez", async () => {
  const sourceResult = portableResultFixtures.cases.find(({ id }) => id === "tampered-content").payload;
  await assert.rejects(
    () => createPortableAuditVerificationReceipt({
      sourceResult,
      verifiedAt: "2026-08-14T09:00:00.000Z",
    }),
    /yalnızca geçerli taşınabilir denetim sonucundan/u,
  );
});

test("Pilot 3.2 ortak fikstür kümesinin güvenlik ve kapsam beyanını doğrular", () => {
  assert.equal(
    receiptParityFixtures.fixtureSet,
    "opus-fopos-portable-audit-verification-receipt-parity-3.2",
  );
  assert.equal(receiptParityFixtures.containsRealStudentData, false);
  assert.deepEqual(receiptParityFixtures.cases.map(({ id }) => id), [
    "valid-1.0.0",
    "reordered-equivalent",
    "tampered-content",
    "unsupported-schema-version",
    "unsupported-policy-version",
    "invalid-result-fields",
    "student-personal-data",
    "source-file-path",
    "embedded-source-result",
  ]);
});

for (const fixture of receiptParityFixtures.cases) {
  test(`Pilot 3.2 ${fixture.id} için OPUS ile aynı sonucu üretir`, async () => {
    const result = await validatePortableAuditVerificationReceipt(fixture.payload);
    assert.equal(result.status, fixture.expected.status);
    assert.equal(result.schemaVersion, fixture.expected.schemaVersion);
    assert.equal(result.computedDigest, fixture.expected.computedDigest);
    assert.deepEqual(result.errors, fixture.expected.errors);
  });
}

test("Pilot 3.2 alan sırası değişen eşdeğer makbuzda aynı SHA-256 özetini korur", () => {
  const [validCase, reorderedCase] = receiptParityFixtures.cases;
  assert.match(validCase.expected.computedDigest, /^[0-9a-f]{64}$/u);
  assert.equal(reorderedCase.expected.computedDigest, validCase.expected.computedDigest);
});
