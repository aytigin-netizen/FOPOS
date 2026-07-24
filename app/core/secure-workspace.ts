export const WORKSPACE_SCHEMA_VERSION = "47.0.0" as const;

export type WorkspaceRole = "owner" | "teacher";
export type DataClassification =
  | "identity"
  | "profile"
  | "pedagogical"
  | "student_sensitive"
  | "anonymous_analytics"
  | "audit_metadata";

export type DocumentState = "draft" | "in_review" | "approved" | "archived";

export interface OwnedEntity {
  schemaVersion: typeof WORKSPACE_SCHEMA_VERSION;
  id: string;
  ownerUserId: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeacherProfile extends OwnedEntity {
  displayName: string;
  branch: "Felsefe";
  schoolName: string;
  academicYear: string;
  locale: "tr-TR";
}

export interface WorkspaceMembership {
  schemaVersion: typeof WORKSPACE_SCHEMA_VERSION;
  workspaceId: string;
  userId: string;
  role: WorkspaceRole;
  createdAt: string;
  revokedAt: string | null;
}

export interface SecureSession {
  schemaVersion: typeof WORKSPACE_SCHEMA_VERSION;
  id: string;
  userId: string;
  tokenDigest: string;
  createdAt: string;
  lastSeenAt: string;
  expiresAt: string;
  revokedAt: string | null;
}

export interface WorkspaceDocument extends OwnedEntity {
  kind:
    | "lesson_design"
    | "daily_plan"
    | "annual_plan"
    | "department_meeting"
    | "exam"
    | "exam_analysis"
    | "student_performance";
  state: DocumentState;
  revision: number;
  previousRevisionId: string | null;
  curriculumSourceRefs: string[];
  traceId: string;
}

export interface StudentVaultRecord extends OwnedEntity {
  classification: "student_sensitive";
  classBranchId: string;
  encryptedPayload: string;
  encryptionKeyVersion: number;
}

export interface AuditEvent {
  schemaVersion: typeof WORKSPACE_SCHEMA_VERSION;
  id: string;
  actorUserId: string | null;
  workspaceId: string | null;
  action:
    | "session.created"
    | "session.revoked"
    | "profile.updated"
    | "document.created"
    | "document.approved"
    | "document.revised"
    | "data.exported"
    | "data.deleted";
  targetType: string;
  targetId: string | null;
  occurredAt: string;
  traceId: string;
}

export function assertWorkspaceAccess(
  entity: Pick<OwnedEntity, "ownerUserId" | "workspaceId">,
  actor: { userId: string; workspaceIds: readonly string[] },
): void {
  const ownsEntity = entity.ownerUserId === actor.userId;
  const belongsToWorkspace = actor.workspaceIds.includes(entity.workspaceId);

  if (!ownsEntity || !belongsToWorkspace) {
    throw new Error("Bu kayda erişim yetkiniz yok.");
  }
}

export function canSendToExternalAi(
  classification: DataClassification,
): boolean {
  return classification === "anonymous_analytics";
}

export function nextDocumentRevision(
  current: WorkspaceDocument,
  nextId: string,
  now: string,
): WorkspaceDocument {
  if (current.state !== "approved") {
    throw new Error("Yalnız onaylı bir belgeden yeni revizyon türetilebilir.");
  }

  return {
    ...current,
    id: nextId,
    state: "draft",
    revision: current.revision + 1,
    previousRevisionId: current.id,
    createdAt: now,
    updatedAt: now,
  };
}
