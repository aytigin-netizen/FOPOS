import {
  createDepartmentMinutes,
  getDepartmentMinutesDefaults,
  isValidAcademicYear,
  meetingTypeLabels,
} from "../modules/department-minutes/model";

const errors: string[] = [];

if (isValidAcademicYear("2026-2028")) errors.push("Ardışık olmayan öğretim yılı kabul edildi.");
if (Object.keys(meetingTypeLabels).length !== 6) errors.push("Toplantı türleri eksik.");

const defaults = getDepartmentMinutesDefaults();
const draft = createDepartmentMinutes(defaults);
if (draft.status !== "draft") errors.push("Tutanak taslak başlamadı.");
if (draft.validation.exportAllowed) errors.push("Eksik taslağın dışa aktarımına izin verildi.");
if (draft.agenda.length < 8) errors.push("Mevzuat gündemi yetersiz.");

const complete = createDepartmentMinutes({
  metadata: {
    ...defaults.metadata,
    schoolName: "Örnek Anadolu Lisesi",
    date: "2026-09-10",
    time: "10:00",
    place: "Öğretmenler Odası",
    chairName: "Zümre Başkanı",
    members: ["Felsefe Öğretmeni"],
  },
  agenda: defaults.agenda.map((item) => ({
    ...item,
    discussion: "Gündem maddesi görüşüldü.",
    decision: "Uygulamanın izlenmesine karar verildi.",
  })),
});
if (!complete.validation.exportAllowed) errors.push("Tam tutanak doğrulanamadı.");
if (complete.decisions.length !== complete.agenda.length) errors.push("Kararlar gündemle eşleşmiyor.");

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log("Zümre tutanağı doğrulaması başarılı: 6 toplantı türü ve dinamik gündem destekleniyor.");
