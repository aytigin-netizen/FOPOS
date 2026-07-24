import {
  RECORD_ARCHIVE_KEY,
  type KeyValueStorage,
} from "./pedagogical-record-store.ts";

export const WORKSPACE_ARCHIVE_PREFIX = "fopos.workspace.v47";

function validateOpaqueId(value: string, field: string): string {
  const normalized = value.trim();

  if (!/^[A-Za-z0-9_-]{8,128}$/u.test(normalized)) {
    throw new Error(`${field} güvenli anahtar biçiminde değil.`);
  }

  return normalized;
}

export function workspaceArchiveKey(scope: {
  userId: string;
  workspaceId: string;
}): string {
  const userId = validateOpaqueId(scope.userId, "Kullanıcı kimliği");
  const workspaceId = validateOpaqueId(
    scope.workspaceId,
    "Çalışma alanı kimliği",
  );

  return `${WORKSPACE_ARCHIVE_PREFIX}.${userId}.${workspaceId}.pedagogical-records`;
}

export function createWorkspaceScopedStorage(
  storage: KeyValueStorage,
  scope: { userId: string; workspaceId: string },
): KeyValueStorage {
  const scopedKey = workspaceArchiveKey(scope);
  const resolveKey = (key: string) =>
    key === RECORD_ARCHIVE_KEY ? scopedKey : key;

  return {
    getItem(key) {
      return storage.getItem(resolveKey(key));
    },
    setItem(key, value) {
      storage.setItem(resolveKey(key), value);
    },
    removeItem(key) {
      storage.removeItem(resolveKey(key));
    },
  };
}

export function inspectLegacyArchivePresence(
  storage: KeyValueStorage,
): { exists: boolean; requiresExplicitImport: true } {
  return {
    exists: storage.getItem(RECORD_ARCHIVE_KEY) !== null,
    requiresExplicitImport: true,
  };
}
