PRAGMA foreign_keys = ON;

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email_normalized TEXT NOT NULL UNIQUE,
  email_verified_at TEXT,
  created_at TEXT NOT NULL,
  disabled_at TEXT
);

CREATE TABLE identity_accounts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  provider_subject TEXT NOT NULL,
  created_at TEXT NOT NULL,
  UNIQUE(provider, provider_subject)
);

CREATE TABLE secure_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_digest TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL,
  last_seen_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  revoked_at TEXT
);
CREATE INDEX secure_sessions_user_active_idx
  ON secure_sessions(user_id, revoked_at, expires_at);

CREATE TABLE workspaces (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  created_by_user_id TEXT NOT NULL REFERENCES users(id),
  created_at TEXT NOT NULL,
  archived_at TEXT
);

CREATE TABLE workspace_memberships (
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK(role IN ('owner', 'teacher')),
  created_at TEXT NOT NULL,
  revoked_at TEXT,
  PRIMARY KEY(workspace_id, user_id)
);

CREATE TABLE teacher_profiles (
  id TEXT PRIMARY KEY,
  owner_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  branch TEXT NOT NULL CHECK(branch = 'Felsefe'),
  school_name TEXT NOT NULL DEFAULT '',
  academic_year TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'tr-TR',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE(owner_user_id, workspace_id)
);

CREATE TABLE workspace_documents (
  id TEXT PRIMARY KEY,
  owner_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  kind TEXT NOT NULL,
  state TEXT NOT NULL CHECK(state IN ('draft', 'in_review', 'approved', 'archived')),
  revision INTEGER NOT NULL CHECK(revision > 0),
  previous_revision_id TEXT REFERENCES workspace_documents(id),
  schema_version TEXT NOT NULL,
  trace_id TEXT NOT NULL,
  curriculum_source_refs_json TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE(workspace_id, kind, id, revision)
);
CREATE INDEX workspace_documents_owner_idx
  ON workspace_documents(owner_user_id, workspace_id, kind, state);

-- Öğrenci kasası uygulama katmanında ayrı anahtarla şifrelenmiş veri taşır.
-- Bu tabloya açık ad, okul numarası veya BEP/sağlık bilgisi yazılmaz.
CREATE TABLE student_vault_records (
  id TEXT PRIMARY KEY,
  owner_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  class_branch_id TEXT NOT NULL,
  encrypted_payload TEXT NOT NULL,
  encryption_key_version INTEGER NOT NULL CHECK(encryption_key_version > 0),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX student_vault_owner_idx
  ON student_vault_records(owner_user_id, workspace_id, class_branch_id);

CREATE TABLE audit_events (
  id TEXT PRIMARY KEY,
  actor_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  workspace_id TEXT REFERENCES workspaces(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT,
  occurred_at TEXT NOT NULL,
  trace_id TEXT NOT NULL,
  metadata_json TEXT NOT NULL DEFAULT '{}'
);
CREATE INDEX audit_events_workspace_time_idx
  ON audit_events(workspace_id, occurred_at);
