import type {
  AgendaItem,
  DepartmentMinutes,
  DepartmentMinutesInput,
  DepartmentMinutesMetadata,
  MeetingType,
} from "@/modules/department-minutes/types";

export const meetingTypeLabels: Record<MeetingType, string> = {
  "year-start": "Ders yılı başı",
  "november-break": "Kasım ara tatili",
  "second-term-start": "İkinci dönem başı",
  "april-break": "Nisan ara tatili",
  "year-end": "Ders yılı sonu",
  extraordinary: "Olağanüstü",
};

export const defaultDepartmentMetadata: DepartmentMinutesMetadata = {
  schoolName: "",
  academicYear: "2026-2027",
  meetingType: "year-start",
  meetingNumber: "1",
  date: "",
  time: "",
  place: "",
  chairName: "",
  principalName: "",
  members: [""],
};

const commonAgenda = [
  "Açılış, yoklama ve gündemin okunması",
  "Türkiye Yüzyılı Maarif Modeli Felsefe Dersi Öğretim Programı'nın incelenmesi",
  "Yıllık planların, ders saatlerinin ve okul temelli planlama çalışmalarının değerlendirilmesi",
  "Öğretim yöntemleri, materyaller, değerler ve çoklu okuryazarlık becerileri",
  "Ölçme-değerlendirme, ortak sınavlar ve öğrenme eksikliklerinin izlenmesi",
  "Kaynaştırma/BEP uygulamaları ve farklılaştırma",
  "Sosyal sorumluluk, iş sağlığı ve güvenliği ile kurumlar arası iş birliği",
  "Dilek ve temenniler, kapanış",
] as const;

const agendaByType: Partial<Record<MeetingType, readonly string[]>> = {
  "november-break": ["İlk ara dönem uygulama sonuçları ve gerekli tedbirler"],
  "second-term-start": ["Birinci dönem başarı verileri ve ikinci dönem öncelikleri"],
  "april-break": ["İkinci ara dönem ilerleme durumu ve yıl sonu tedbirleri"],
  "year-end": ["Yıl sonu başarı sonuçları, program değerlendirmesi ve gelecek yıl önerileri"],
  extraordinary: ["Olağanüstü toplantı gerekçesinin görüşülmesi"],
};

export function createDefaultAgenda(type: MeetingType): AgendaItem[] {
  return [...commonAgenda, ...(agendaByType[type] ?? [])].map((title, index) => ({
    id: `agenda-${index + 1}`,
    title,
    discussion: "",
    decision: "",
  }));
}

export function getDepartmentMinutesDefaults(): DepartmentMinutesInput {
  return {
    metadata: { ...defaultDepartmentMetadata, members: [...defaultDepartmentMetadata.members] },
    agenda: createDefaultAgenda(defaultDepartmentMetadata.meetingType),
  };
}

export function isValidAcademicYear(value: string): boolean {
  const match = /^(\d{4})-(\d{4})$/.exec(value);
  return Boolean(match && Number(match[2]) === Number(match[1]) + 1);
}

export function createDepartmentMinutes(input: DepartmentMinutesInput): DepartmentMinutes {
  if (!isValidAcademicYear(input.metadata.academicYear)) {
    throw new Error("Öğretim yılı YYYY-YYYY biçiminde ve ardışık olmalıdır.");
  }
  if (!input.agenda.length) {
    throw new Error("Tutanakta en az bir gündem maddesi bulunmalıdır.");
  }

  const requiredFieldsComplete = [
    input.metadata.schoolName,
    input.metadata.date,
    input.metadata.time,
    input.metadata.place,
    input.metadata.chairName,
  ].every((value) => value.trim().length > 0);
  const agendaComplete = input.agenda.every(
    (item) => item.title.trim() && item.discussion.trim() && item.decision.trim(),
  );
  const memberListComplete = input.metadata.members.some((member) => member.trim());

  return {
    status: "draft",
    title: `${input.metadata.academicYear} Eğitim Öğretim Yılı Felsefe Dersi Zümre Öğretmenler Kurulu ${meetingTypeLabels[input.metadata.meetingType]} Toplantı Tutanağı`,
    legalBasis: "Millî Eğitim Bakanlığı Eğitim Kurulları ve Zümreleri Yönergesi (Madde 12, 21.01.2025 değişiklikleri dâhil)",
    metadata: input.metadata,
    agenda: input.agenda,
    decisions: input.agenda
      .filter((item) => item.decision.trim())
      .map((item, index) => ({ number: index + 1, text: item.decision.trim() })),
    validation: {
      requiredFieldsComplete,
      agendaComplete,
      memberListComplete,
      exportAllowed: requiredFieldsComplete && agendaComplete && memberListComplete,
    },
  };
}
