export type MeetingType =
  | "year-start"
  | "november-break"
  | "second-term-start"
  | "april-break"
  | "year-end"
  | "extraordinary";

export interface DepartmentMinutesMetadata {
  schoolName: string;
  academicYear: string;
  meetingType: MeetingType;
  meetingNumber: string;
  date: string;
  time: string;
  place: string;
  chairName: string;
  principalName: string;
  members: readonly string[];
}

export interface AgendaItem {
  id: string;
  title: string;
  discussion: string;
  decision: string;
}

export interface DepartmentMinutesInput {
  metadata: DepartmentMinutesMetadata;
  agenda: readonly AgendaItem[];
}

export interface DepartmentMinutes {
  status: "draft";
  title: string;
  legalBasis: string;
  metadata: DepartmentMinutesMetadata;
  agenda: readonly AgendaItem[];
  decisions: readonly { number: number; text: string }[];
  validation: {
    requiredFieldsComplete: boolean;
    agendaComplete: boolean;
    memberListComplete: boolean;
    exportAllowed: boolean;
  };
}
