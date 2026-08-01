import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey(),
    emailNormalized: text("email_normalized").notNull(),
    createdAt: text("created_at").notNull(),
    lastSeenAt: text("last_seen_at").notNull(),
    disabledAt: text("disabled_at"),
  },
  (table) => [
    uniqueIndex("users_email_normalized_idx").on(table.emailNormalized),
  ],
);

export const teacherProfiles = sqliteTable(
  "teacher_profiles",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    displayName: text("display_name").notNull(),
    branch: text("branch").notNull().default("Felsefe"),
    schoolName: text("school_name").notNull(),
    academicYear: text("academic_year").notNull(),
    locale: text("locale").notNull().default("tr-TR"),
    schemaVersion: text("schema_version").notNull().default("47.0.0"),
    revision: integer("revision").notNull().default(1),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [
    uniqueIndex("teacher_profiles_user_id_idx").on(table.userId),
  ],
);

export const teacherDisciplineAssignments = sqliteTable(
  "teacher_discipline_assignments",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    disciplineCode: text("discipline_code").notNull(),
    isDefault: integer("is_default").notNull().default(0),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [
    uniqueIndex("teacher_discipline_assignments_user_code_idx").on(
      table.userId,
      table.disciplineCode,
    ),
    uniqueIndex("teacher_discipline_assignments_user_default_idx")
      .on(table.userId)
      .where(sql`${table.isDefault} = 1`),
  ],
);

export const teacherProfileRevisions = sqliteTable(
  "teacher_profile_revisions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    revision: integer("revision").notNull(),
    displayName: text("display_name").notNull(),
    schoolName: text("school_name").notNull(),
    academicYear: text("academic_year").notNull(),
    changedAt: text("changed_at").notNull(),
  },
  (table) => [
    uniqueIndex("teacher_profile_revisions_user_revision_idx").on(
      table.userId,
      table.revision,
    ),
    index("teacher_profile_revisions_user_changed_idx").on(
      table.userId,
      table.changedAt,
    ),
  ],
);

export const classWorkspaces = sqliteTable(
  "class_workspaces",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    academicYear: text("academic_year").notNull(),
    subjectCode: text("subject_code").notNull().default("philosophy"),
    grade: integer("grade").notNull(),
    branchCode: text("branch_code").notNull(),
    archivedAt: text("archived_at"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  },
  (table) => [
    uniqueIndex("class_workspaces_user_year_subject_grade_branch_idx").on(
      table.userId,
      table.academicYear,
      table.subjectCode,
      table.grade,
      table.branchCode,
    ),
    index("class_workspaces_user_year_idx").on(
      table.userId,
      table.academicYear,
    ),
  ],
);

export const pedagogicalRecords = sqliteTable(
  "pedagogical_records",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    recordId: text("record_id").notNull(),
    revision: integer("revision").notNull(),
    status: text("status").notNull(),
    immutableFingerprint: text("immutable_fingerprint").notNull(),
    payloadJson: text("payload_json").notNull(),
    academicYear: text("academic_year"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
    deletedAt: text("deleted_at"),
  },
  (table) => [
    uniqueIndex("pedagogical_records_user_record_revision_idx").on(
      table.userId,
      table.recordId,
      table.revision,
    ),
    index("pedagogical_records_user_updated_idx").on(
      table.userId,
      table.updatedAt,
    ),
    index("pedagogical_records_user_year_updated_idx").on(
      table.userId,
      table.academicYear,
      table.updatedAt,
    ),
  ],
);

export const documentGenerations = sqliteTable(
  "document_generations",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    requestId: text("request_id").notNull(),
    decisionId: text("decision_id").notNull(),
    recordId: text("record_id").notNull(),
    revision: integer("revision").notNull(),
    documentType: text("document_type").notNull(),
    contractVersion: text("contract_version").notNull(),
    approvedAt: text("approved_at").notNull(),
    generatedAt: text("generated_at").notNull(),
    curriculumId: text("curriculum_id").notNull(),
    curriculumDatasetVersion: text("curriculum_dataset_version").notNull(),
    curriculumOutcomeCode: text("curriculum_outcome_code").notNull(),
    curriculumJson: text("curriculum_json").notNull(),
    academicYear: text("academic_year").notNull(),
    artifactIntegrityAlgorithm: text("artifact_integrity_algorithm"),
    artifactSha256: text("artifact_sha256"),
  },
  (table) => [
    index("document_generations_user_request_idx").on(table.userId, table.requestId),
    index("document_generations_user_year_generated_idx").on(table.userId, table.academicYear, table.generatedAt),
    index("document_generations_user_record_revision_idx").on(table.userId, table.recordId, table.revision),
  ],
);
