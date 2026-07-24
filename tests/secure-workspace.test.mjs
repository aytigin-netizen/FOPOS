import assert from "node:assert/strict";
import test from "node:test";
import {
  assertWorkspaceAccess,
  canSendToExternalAi,
  nextDocumentRevision,
} from "../app/core/secure-workspace.ts";

const approved = {
  schemaVersion: "47.0.0",
  id: "doc-1",
  ownerUserId: "user-1",
  workspaceId: "workspace-1",
  createdAt: "2026-07-24T00:00:00.000Z",
  updatedAt: "2026-07-24T00:00:00.000Z",
  kind: "daily_plan",
  state: "approved",
  revision: 1,
  previousRevisionId: null,
  curriculumSourceRefs: ["FEL.10.1.1"],
  traceId: "trace-1",
};

test("kayıt erişimi hem kullanıcı hem çalışma alanı üyeliği gerektirir", () => {
  assert.doesNotThrow(() =>
    assertWorkspaceAccess(approved, {
      userId: "user-1",
      workspaceIds: ["workspace-1"],
    }),
  );

  assert.throws(
    () =>
      assertWorkspaceAccess(approved, {
        userId: "user-2",
        workspaceIds: ["workspace-1"],
      }),
    /erişim yetkiniz yok/,
  );

  assert.throws(
    () =>
      assertWorkspaceAccess(approved, {
        userId: "user-1",
        workspaceIds: ["workspace-2"],
      }),
    /erişim yetkiniz yok/,
  );
});

test("harici yapay zekâya yalnız kimliksiz analitik veri gönderilebilir", () => {
  assert.equal(canSendToExternalAi("anonymous_analytics"), true);
  assert.equal(canSendToExternalAi("student_sensitive"), false);
  assert.equal(canSendToExternalAi("identity"), false);
  assert.equal(canSendToExternalAi("pedagogical"), false);
});

test("onaylı belge yerinde değişmez ve yeni taslak revizyon üretir", () => {
  const next = nextDocumentRevision(
    approved,
    "doc-2",
    "2026-07-25T00:00:00.000Z",
  );

  assert.equal(next.id, "doc-2");
  assert.equal(next.state, "draft");
  assert.equal(next.revision, 2);
  assert.equal(next.previousRevisionId, "doc-1");
  assert.equal(approved.id, "doc-1");
  assert.equal(approved.state, "approved");
});

test("onaylanmamış belgeden revizyon türetilemez", () => {
  assert.throws(
    () =>
      nextDocumentRevision(
        { ...approved, state: "draft" },
        "doc-2",
        "2026-07-25T00:00:00.000Z",
      ),
    /Yalnız onaylı/,
  );
});
