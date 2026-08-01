import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
const source = await readFile(
  new URL(
    "../app/modules/department-meeting/DepartmentMeetingModule.tsx",
    import.meta.url,
  ),
  "utf8",
);
const compactSource = source.replace(/\s+/g, "");
test("zümre taslağı gerçekleşmiş toplantı veya karar iddiası üretmez", () => {
  assert.doesNotMatch(source, /oy birliğiyle kabul edildi/);
  assert.doesNotMatch(source, /karar verilmiştir/);
  assert.doesNotMatch(source, /\\nUYGUNDUR\\n/);
  assert.match(source, /Taslak — görüşülmedi/);
});
test("resmî çıktı gerçekleşme, içerik ve OPUS onayına bağlıdır", () => {
  assert.match(source, /allReviewed/);
  assert.match(source, /teacherApproved/);
  assert.match(source, /meetingHeldConfirmed/);
  assert.match(source, /approvedScopeMatches/);
  assert.match(source, /approveMeetingDecision/);
  assert.match(source, /department-meeting-minutes/);
  assert.match(compactSource, /disabled=\{exporting\|\|!exportReady\}/);
  assert.match(compactSource, /müdürimzasıveyaelektronikimzadeğildir/);
});
test("toplantı ve katılım alanları varsayılan olarak boştur", () => {
  assert.match(compactSource, /date:"",time:"",place:""/);
  assert.match(compactSource, /members:""/);
  assert.match(source, /Yalnız gerçekten katılan üyeleri yazın/);
});
test("ek gündem maddeleri kapanış maddesinden önce yer alır", () => {
  assert.match(source, /const CLOSING_AGENDA_TITLE = "Dilek, temenniler ve kapanış"/);
  assert.match(source, /findLastIndex\([\s\S]*item\.title === CLOSING_AGENDA_TITLE/);
  assert.match(source, /\.\.\.current\.slice\(0, closingIndex\),[\s\S]*nextItem,[\s\S]*\.\.\.current\.slice\(closingIndex\)/);
  assert.match(source, /Yeni madde kapanış maddesinden hemen önce eklenir/);
});
test("web önizlemesi ve DOCX resmî zümre bölüm sırasını paylaşır", () => {
  for (const heading of [
    "GÜNDEM MADDELERİ",
    "GÜNDEM MADDELERİNİN GÖRÜŞÜLMESİ",
    "ALINAN KARARLAR",
  ]) {
    assert.ok((source.match(new RegExp(heading, "g"))?.length ?? 0) >= 2);
  }
  assert.match(source, /meetingNo: "1"/);
  assert.match(source, /field\("Toplantı no", "meetingNo"\)/);
  assert.match(compactSource, /teacherApproved&&meetingHeldConfirmed&&approvedScopeMatches&&m\.meetingNo\.trim\(\)/);
});
test("dönem gündemleri yeni öğretim programının temel bileşenlerini içerir", () => {
  assert.match(source, /Türkiye Yüzyılı Maarif Modeli, öğrenme çıktıları/);
  assert.match(source, /okul temelli faaliyetlerin planlanması/);
  assert.match(source, /Farklılaştırılmış öğretim, BEP/);
  assert.match(source, /sınav analizleri, eksik öğrenmeler ve eylem planları/);
});

test("üretim izi katılımcı adlarını taşımaz ve her indirme ayrı olaydır", () => {
  assert.match(source, /participantCount/);
  assert.match(source, /departmentMeetingContentFingerprint\(items\)/);
  assert.match(source, /generateApprovedDocument/);
  assert.match(source, /OPUS üretim olayı/);
  assert.doesNotMatch(source, /learningEvidence:.*m\.members/s);
});
