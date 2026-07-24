import {
  WORKSPACE_SCHEMA_VERSION,
  type TeacherProfile,
} from "./secure-workspace.ts";

export interface TeacherProfileInput {
  displayName: string;
  schoolName: string;
  academicYear: string;
}

function normalizeSingleLine(value: string, field: string): string {
  const normalized = value.trim().replace(/\s+/gu, " ");

  if (!normalized) throw new Error(`${field} boş bırakılamaz.`);
  if (normalized.length > 160) throw new Error(`${field} çok uzun.`);
  if (/[\u0000-\u001F\u007F]/u.test(normalized)) {
    throw new Error(`${field} geçersiz karakter içeriyor.`);
  }

  return normalized;
}

function normalizeAcademicYear(value: string): string {
  const normalized = value.trim();
  const match = /^(\d{4})-(\d{4})$/u.exec(normalized);

  if (!match || Number(match[2]) !== Number(match[1]) + 1) {
    throw new Error("Akademik yıl YYYY-YYYY biçiminde ve ardışık olmalıdır.");
  }

  return normalized;
}

export function createTeacherProfile(
  identity: {
    id: string;
    ownerUserId: string;
    workspaceId: string;
  },
  input: TeacherProfileInput,
  now: string,
): TeacherProfile {
  if (!identity.id || !identity.ownerUserId || !identity.workspaceId) {
    throw new Error("Profil sahiplik bilgisi eksik.");
  }

  const timestamp = new Date(now);
  if (!Number.isFinite(timestamp.getTime())) {
    throw new Error("Profil zamanı geçersiz.");
  }

  return {
    schemaVersion: WORKSPACE_SCHEMA_VERSION,
    id: identity.id,
    ownerUserId: identity.ownerUserId,
    workspaceId: identity.workspaceId,
    displayName: normalizeSingleLine(input.displayName, "Öğretmen adı"),
    branch: "Felsefe",
    schoolName: normalizeSingleLine(input.schoolName, "Okul adı"),
    academicYear: normalizeAcademicYear(input.academicYear),
    locale: "tr-TR",
    createdAt: timestamp.toISOString(),
    updatedAt: timestamp.toISOString(),
  };
}

export function updateTeacherProfile(
  current: TeacherProfile,
  input: TeacherProfileInput,
  now: string,
): TeacherProfile {
  const next = createTeacherProfile(
    {
      id: current.id,
      ownerUserId: current.ownerUserId,
      workspaceId: current.workspaceId,
    },
    input,
    now,
  );

  return {
    ...next,
    createdAt: current.createdAt,
  };
}
