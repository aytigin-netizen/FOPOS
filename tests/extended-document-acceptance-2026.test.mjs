import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { buildAnnualPlanArtifact } from "../app/modules/annual-plan/export-annual-plan.ts";
import { buildExamPackageArtifact } from "../app/modules/exam-builder/export-exam-package.ts";
import { buildDepartmentMeetingArtifact } from "../app/modules/department-meeting/export-department-meeting.ts";

async function xmlFor(artifact) {
  const directory = mkdtempSync(join(tmpdir(), "fopos-extended-acceptance-"));
  const path = join(directory, artifact.fileName);
  writeFileSync(path, Buffer.from(await artifact.blob.arrayBuffer()));
  return execFileSync("unzip", ["-p", path, "word/document.xml"], { encoding: "utf8", maxBuffer: 30_000_000 });
}

test("10 ve 11. sınıf Yıllık Plan gerçek DOCX/XML kabulü", async () => {
  for (const grade of [10, 11]) {
    const rows = Array.from({ length: 36 }, (_, index) => ({
      week: index + 1, month: "EYLÜL", dates: `${index + 1}-${index + 5} Eyl`, hours: 2,
      unit: index < 34 ? `F${grade}_U${Math.floor(index / 5) + 1}` : "OKUL TEMELLİ PLANLAMA",
      topic: index < 34 ? `Haftalık felsefe odağı ${index + 1}` : "Okulun ve öğrencilerin ihtiyaçlarına göre planlanır.",
      outcome: index < 34 ? `FEL.${grade}.${Math.floor(index / 5) + 1}.1` : "Okul temelli planlama",
      components: "a) Kavramları ayırt eder.", socialEmotional: "İş birliği", values: "Sorumluluk",
      literacy: "Bilgi okuryazarlığı", special: "—",
    }));
    const xml = await xmlFor(await buildAnnualPlanArtifact({
      academicYear: "2026-2027", school: "Kabul Okulu", teacher: "Felsefe Öğretmeni", principal: "Okul Müdürü",
      grade, subjectName: "Felsefe", sourceTitle: "Felsefe Dersi Öğretim Programı", sourceYear: 2024, rows,
    }));
    for (const pattern of [/ÜNİTELENDİRİLMİŞ YILLIK PLAN TASLAĞI/u, /Süreç Bileşenleri/u, /Sosyal-Duygusal Öğrenme/u, /OKUL TEMELLİ PLANLAMA/u, /Tarih \/ İmza/u, /Onay tarihi \/ İmza/u]) assert.match(xml, pattern);
    assert.equal(rows.filter((row) => row.unit !== "OKUL TEMELLİ PLANLAMA").reduce((sum, row) => sum + row.hours, 0), 68);
    assert.equal(rows.filter((row) => row.unit === "OKUL TEMELLİ PLANLAMA").reduce((sum, row) => sum + row.hours, 0), 4);
  }
});

const examScenarios = [
  ["F10_U2", "FEL.10.2.1"], ["F10_U2", "FEL.10.2.2"], ["F10_U7", "FEL.10.7.1"], ["F10_U7", "FEL.10.7.1"],
  ["F10_U9", "FEL.10.9.1"], ["F10_U9", "FEL.10.9.1"], ["F11_U1", "FEL.11.1.1"], ["F11_U1", "FEL.11.1.2"],
  ["F11_U2", "FEL.11.2.1"], ["F11_U2", "FEL.11.2.2"], ["F11_U6", "FEL.11.6.1"], ["F11_U6", "FEL.11.6.2"],
];

test("12 kapsamın standart/BEP ikizlerinde 48 gerçek sınav DOCX/XML kabulü", async () => {
  let artifactCount = 0;
  for (const [unitCode, outcomeCode] of examScenarios) {
    const grade = Number(outcomeCode.split(".")[1]);
    const questions = Array.from({ length: 5 }, (_, index) => ({
      outcomeCode, unitCode, kindLabel: index % 2 ? "Kısa cevap" : "Açık uçlu", levelLabel: "Çözümleme",
      passage: index === 0 ? `${unitCode} temel felsefi kanıt metni` : undefined,
      text: `${unitCode} kapsamındaki problemi gerekçeli olarak çözümleyiniz (${index + 1}).`, points: 20,
      answer: `${outcomeCode} için beklenen temel felsefi kanıt.`, criterion: "Kavram 5, gerekçe 10, sonuç 5 puan.",
    }));
    for (const mode of ["standard", "bep"]) {
      const input = {
        school: "Kabul Okulu", academicYear: "2026-2027", grade, subjectName: "Felsefe", examName: "Temsil Kapsam Sınavı",
        booklet: "A", durationMinutes: mode === "bep" ? 60 : 40, mode, bepLabel: "Okuma ve işlemleme desteği",
        bepNote: "Süre ve sunum uyarlaması", bepGoals: "Sentetik BEP hedefi", teacher: "Felsefe Öğretmeni", principal: "Okul Müdürü", questions,
      };
      const [studentXml, teacherXml] = await Promise.all([
        buildExamPackageArtifact(input, "student").then(xmlFor), buildExamPackageArtifact(input, "teacher").then(xmlFor),
      ]);
      artifactCount += 2;
      assert.match(studentXml, new RegExp(unitCode));
      assert.doesNotMatch(studentXml, /CEVAP ANAHTARI|BEP uyarlaması/u);
      assert.match(teacherXml, /BELİRTKE TABLOSU/u);
      assert.match(teacherXml, /CEVAP ANAHTARI VE DERECELİ PUANLAMA ANAHTARI/u);
      assert.match(teacherXml, /Toplam: 100 puan/u);
      assert.match(teacherXml, new RegExp(unitCode));
      assert.match(teacherXml, new RegExp(outcomeCode.replaceAll(".", "\\.")));
      if (mode === "bep") assert.match(teacherXml, /BEP uyarlaması/u);
    }
  }
  assert.equal(artifactCount, 48);
});

test("altı zümre türünün gerçek DOCX/XML kabulü", async () => {
  const periods = ["Ders yılı başı", "Kasım ara değerlendirme", "İkinci dönem başı", "Nisan ara değerlendirme", "Ders yılı sonu", "Olağanüstü toplantı"];
  for (const [index, periodLabel] of periods.entries()) {
    const xml = await xmlFor(await buildDepartmentMeetingArtifact({
      year: "2026-2027", school: "Kabul Okulu", field: "Felsefe Grubu", meetingNo: String(index + 1), periodLabel,
      date: "30.08.2026", time: "10.00", place: "Öğretmenler Odası", chair: "Zümre Başkanı", principal: "Okul Müdürü",
      members: ["Zümre Başkanı", "Zümre Üyesi"], items: [
        { title: "Açılış, yoklama ve gündemin görüşülmesi", discussion: "Gündem görüşüldü.", decision: "Gündem kabul edildi.", status: "adopted" },
        { title: "Dilek, temenniler ve kapanış", discussion: "Toplantı tamamlandı.", decision: "Karar alınmadı.", status: "discussed" },
      ],
    }));
    for (const pattern of [/GÜNDEM MADDELERİ/u, /GÜNDEM MADDELERİNİN GÖRÜŞÜLMESİ/u, /ALINAN KARARLAR/u, /İMZA ÇİZELGESİ/u, /müdür imzası veya elektronik imza değildir/u, /Onay tarihi \/ İmza/u]) assert.match(xml, pattern);
  }
});
