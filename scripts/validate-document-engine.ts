import { createDailyPlan, getDailyPlanDefaults } from "../modules/daily-plan/model";
import { createAnnualPlan, getAnnualPlanDefaults } from "../modules/annual-plan/model";
import { createDepartmentMinutes, getDepartmentMinutesDefaults } from "../modules/department-minutes/model";
import { createExam, getExamDefaults } from "../modules/exam-generator/model";
import { buildAnnualPlanDocument } from "../modules/document-engine/annual-plan";
import { buildDepartmentMinutesDocument } from "../modules/document-engine/department-minutes";
import { buildExamPackageDocument } from "../modules/document-engine/exam-package";
import { buildDailyPlanDocument } from "../modules/document-engine/daily-plan";
import { renderDocxBuffer } from "../modules/document-engine/docx";
import { validateDocument } from "../modules/document-engine/model";

async function main() {
  const defaults = getDailyPlanDefaults();
  const plan = createDailyPlan({
    ...defaults,
    metadata: {
      ...defaults.metadata,
      schoolName: "Örnek Anadolu Lisesi",
      teacherName: "Örnek Öğretmen",
      date: "2026-09-14",
    },
  });

  const blocked = buildDailyPlanDocument(plan, false);
  if (validateDocument(blocked).valid) throw new Error("Onaysız belge dışa aktarmaya açıldı.");

  const approved = buildDailyPlanDocument(plan, true);
  const validation = validateDocument(approved);
  if (!validation.valid) throw new Error(validation.errors.join("\n"));
  if (approved.approvalStatement.toLocaleLowerCase("tr-TR").includes("uygundur")) {
    throw new Error("Belge otomatik kurumsal onay ifadesi içeriyor.");
  }

  const buffer = await renderDocxBuffer(approved);
  if (buffer.length < 1_000 || buffer.subarray(0, 2).toString() !== "PK") {
    throw new Error("Geçerli bir DOCX paketi üretilemedi.");
  }

  for (const grade of [10, 11] as const) {
    const annualPlan = createAnnualPlan({ ...getAnnualPlanDefaults(), grade });
    const blockedAnnual = buildAnnualPlanDocument(annualPlan, false);
    if (validateDocument(blockedAnnual).valid) throw new Error(`${grade}. sınıf onaysız yıllık plan dışa aktarıldı.`);

    const approvedAnnual = buildAnnualPlanDocument(annualPlan, true);
    if (approvedAnnual.layout !== "landscape" || approvedAnnual.sections[1]?.paragraphs?.length !== 36) {
      throw new Error(`${grade}. sınıf yıllık plan belge yapısı eksik.`);
    }
    const annualBuffer = await renderDocxBuffer(approvedAnnual);
    if (annualBuffer.length < 10_000 || annualBuffer.subarray(0, 2).toString() !== "PK") {
      throw new Error(`${grade}. sınıf için geçerli yıllık plan DOCX paketi üretilemedi.`);
    }
  }

  const minutesDefaults = getDepartmentMinutesDefaults();
  const completeMinutes = createDepartmentMinutes({
    metadata: {
      ...minutesDefaults.metadata,
      schoolName: "Örnek Anadolu Lisesi",
      date: "2026-09-10",
      time: "10:00",
      place: "Öğretmenler Odası",
      chairName: "Zümre Başkanı",
      principalName: "Okul Müdürü",
      members: ["Felsefe Öğretmeni"],
    },
    agenda: minutesDefaults.agenda.map((item) => ({
      ...item,
      discussion: "Gündem maddesi ayrıntılı olarak görüşüldü.",
      decision: "Uygulamanın izlenmesine karar verildi.",
    })),
  });
  if (validateDocument(buildDepartmentMinutesDocument(completeMinutes, false)).valid) {
    throw new Error("Kullanıcı onayı olmadan zümre tutanağı dışa aktarıldı.");
  }
  const minutesDocument = buildDepartmentMinutesDocument(completeMinutes, true);
  if (minutesDocument.sections[3]?.paragraphs?.length !== completeMinutes.agenda.length) {
    throw new Error("Zümre tutanağı gündem maddeleri belgeyle eşleşmiyor.");
  }
  const minutesBuffer = await renderDocxBuffer(minutesDocument);
  if (minutesBuffer.length < 5_000 || minutesBuffer.subarray(0, 2).toString() !== "PK") {
    throw new Error("Geçerli bir zümre tutanağı DOCX paketi üretilemedi.");
  }

  const examDraft = createExam(getExamDefaults());
  if (validateDocument(buildExamPackageDocument(examDraft)).valid) {
    throw new Error("Öğretmen onayı olmadan sınav paketi dışa aktarıldı.");
  }
  const exam = createExam({ ...getExamDefaults(), teacherApproved: true });
  const examDocument = buildExamPackageDocument(exam);
  const questionSections = examDocument.sections.slice(1, 5);
  if (questionSections.some((section) => section.paragraphs?.length !== exam.bookletA.length)) {
    throw new Error("Sınav kitapçıkları veya cevap anahtarları eksik üretildi.");
  }
  const examBuffer = await renderDocxBuffer(examDocument);
  if (examBuffer.length < 5_000 || examBuffer.subarray(0, 2).toString() !== "PK") {
    throw new Error("Geçerli bir sınav DOCX paketi üretilemedi.");
  }

  console.log("Document Engine doğrulaması başarılı: Plan, tutanak ve sınav DOCX paketleri üretildi.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
