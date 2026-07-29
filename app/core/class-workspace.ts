export type SchoolGrade = 10 | 11 | 12;

export type ClassWorkspaceContext = {
  id: string;
  subjectCode: string;
  academicYear: string;
  grade: SchoolGrade;
  branchCode: string;
  archivedAt: string | null;
};
