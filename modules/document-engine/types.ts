export interface DocumentField {
  label: string;
  value: string;
}

export interface DocumentSection {
  heading: string;
  paragraphs?: readonly string[];
  fields?: readonly DocumentField[];
  bullets?: readonly string[];
}

export interface DocumentSpec {
  kind: "daily-plan" | "annual-plan" | "department-minutes" | "exam-package" | "exam-analysis";
  layout?: "portrait" | "landscape";
  title: string;
  fileName: string;
  approved: boolean;
  approvalStatement: string;
  sections: readonly DocumentSection[];
}

export interface DocumentValidation {
  valid: boolean;
  errors: readonly string[];
}
