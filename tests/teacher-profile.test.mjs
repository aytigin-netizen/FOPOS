import assert from "node:assert/strict";
import test from "node:test";
import {
  createTeacherProfile,
  updateTeacherProfile,
} from "../app/core/teacher-profile.ts";

const identity = {
  id: "profile-1",
  ownerUserId: "user-1",
  workspaceId: "workspace-1",
};

test("öğretmen profili güvenli ve kanonik değerlerle oluşturulur", () => {
  const profile = createTeacherProfile(
    identity,
    {
      displayName: "  Aytekin   Öğretmen ",
      schoolName: " Örnek  Anadolu Lisesi ",
      academicYear: "2026-2027",
    },
    "2026-07-24T12:00:00.000Z",
  );

  assert.equal(profile.displayName, "Aytekin Öğretmen");
  assert.equal(profile.schoolName, "Örnek Anadolu Lisesi");
  assert.equal(profile.branch, "Felsefe");
  assert.equal(profile.locale, "tr-TR");
  assert.equal(profile.schemaVersion, "47.0.0");
});

test("akademik yıl ardışık iki yılı göstermelidir", () => {
  assert.throws(
    () =>
      createTeacherProfile(
        identity,
        {
          displayName: "Aytekin Öğretmen",
          schoolName: "Örnek Anadolu Lisesi",
          academicYear: "2026-2028",
        },
        "2026-07-24T12:00:00.000Z",
      ),
    /ardışık/,
  );
});

test("profil güncellemesi sahipliği ve oluşturulma zamanını korur", () => {
  const original = createTeacherProfile(
    identity,
    {
      displayName: "Aytekin Öğretmen",
      schoolName: "Eski Okul",
      academicYear: "2026-2027",
    },
    "2026-07-24T12:00:00.000Z",
  );
  const updated = updateTeacherProfile(
    original,
    {
      displayName: "Aytekin Öğretmen",
      schoolName: "Yeni Okul",
      academicYear: "2027-2028",
    },
    "2026-08-01T12:00:00.000Z",
  );

  assert.equal(updated.ownerUserId, original.ownerUserId);
  assert.equal(updated.workspaceId, original.workspaceId);
  assert.equal(updated.createdAt, original.createdAt);
  assert.notEqual(updated.updatedAt, original.updatedAt);
});
