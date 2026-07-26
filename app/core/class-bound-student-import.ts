import type { ClassWorkspaceContext } from "./class-workspace";
import type { StudentSpreadsheetPreview } from "./student-spreadsheet-import";

export type ClassBoundStudentImport = StudentSpreadsheetPreview & {
  workspaceId: string;
  academicYear: string;
  grade: 10 | 11;
  branch: string;
};

export function bindStudentImportToWorkspace(
  preview: StudentSpreadsheetPreview,
  workspace: ClassWorkspaceContext,
): ClassBoundStudentImport {
  if (workspace.archivedAt) {
    throw new Error("Arşivlenmiş sınıf çalışma alanına öğrenci dosyası aktarılamaz.");
  }
  return {
    ...preview,
    workspaceId: workspace.id,
    academicYear: workspace.academicYear,
    grade: workspace.grade,
    branch: workspace.branchCode,
  };
}

export function assertStudentImportWorkspace(
  pending: ClassBoundStudentImport,
  workspace: ClassWorkspaceContext,
) {
  if (
    workspace.archivedAt ||
    pending.workspaceId !== workspace.id ||
    pending.academicYear !== workspace.academicYear ||
    pending.grade !== workspace.grade ||
    pending.branch !== workspace.branchCode
  ) {
    throw new Error(
      "İçe aktarma önizlemesinin sınıf çalışma alanı değişti; dosyayı yeniden seçin.",
    );
  }
}
