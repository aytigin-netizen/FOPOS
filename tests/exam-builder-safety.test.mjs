import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(
  new URL("../app/modules/exam-builder/ExamBuilder.tsx", import.meta.url),
  "utf8",
);
const compactSource = source.replace(/\s+/g, "");

test("öğrenci kitapçığı ile öğretmen paketi ayrıdır", () => {
  assert.match(source, /audience: "student" \| "teacher"/);
  assert.match(source, /audience === "teacher"/);
  assert.match(source, /Ogrenci_Kitapcigi/);
  assert.match(source, /Ogretmen_Paketi/);
  assert.doesNotMatch(source, /window\.print\(\)/);
});

test("öğrenci kitapçığı kimlik ve puan alanlarını içerir", () => {
  assert.match(source, /studentInfoCell\("Adı Soyadı:", 50\)/);
  assert.match(source, /studentInfoCell\("Okul No:", 25\)/);
  assert.match(source, /studentInfoCell\("Aldığı Puan:", 25\)/);
  assert.match(source, /audience === "student"/);
});

test("dışa aktarma yapısal kontrol ve öğretmen onayına bağlıdır", () => {
  assert.match(
    compactSource,
    /constexportReady=structuralReady&&teacherReviewConfirmed&&approvedScopeMatches/,
  );
  assert.match(
    compactSource,
    /disabled=\{!exportReady\|\|exportingAudience!==null\}/,
  );
  assert.match(
    compactSource,
    /Soruları,cevapları,puanlarıvemüfredatbağlantılarınıkontrolettim/,
  );
});

test("BEP mahremiyeti ve öğretmen doğrulaması görünürdür", () => {
  assert.match(compactSource, /bepGoals\.trim\(\)\.length>0&&bepPlanConfirmed/);
  assert.match(
    source,
    /Öğrenci adı, tanı, sağlık bilgisi veya bireysel BEP belgesi/,
  );
  assert.match(source, /audience === "teacher" && mode === "bep"/);
});

test("A ve B kitapçıkları çıktı, düzey ve puan bakımından karşılaştırılır", () => {
  assert.match(
    source,
    /question\.outcomeCode.*question\.level.*question\.points/,
  );
  assert.match(source, /bookletEquivalent/);
});

test("belirtke tablosu sınavdan önce öğrenme çıktısı bazında soru dağıtır", () => {
  assert.match(source, /Belirtke tablosu/);
  assert.match(source, /blueprintCounts/);
  assert.match(source, /blueprintTotal === count/);
  assert.match(source, /blueprintRows\.flatMap/);
  assert.match(compactSource, /disabled=\{!blueprintValid\}/);
  assert.match(source, /Toplam puan üretimde/);
});

test("öğretmen DOCX paketi webdeki belirtke dağılımını taşır", () => {
  assert.match(source, /teacherBlueprintTable/);
  assert.match(source, /BELİRTKE TABLOSU/);
  assert.match(source, /Öğrenme çıktısı/);
  assert.match(source, /Soru türü/);
  assert.match(source, /Bilişsel düzey/);
  assert.match(source, /audience === "teacher"/);
  assert.match(source, /kindLabels\[question\.kind\]/);
  assert.match(source, /levelLabels\[question\.level\]/);
});

test("belirtke tablosu çıktı bazında soru türü ve bilişsel düzey belirler", () => {
  assert.match(source, /type BlueprintKind = Kind \| "mixed"/);
  assert.match(source, /blueprintKinds/);
  assert.match(source, /blueprintLevels/);
  assert.match(source, /plannedKind/);
  assert.match(source, /plannedLevel/);
  assert.match(source, /Otomatik karışım/);
  assert.match(source, /aria-label=\{`\$\{row\.code\} soru türü`\}/);
  assert.match(source, /aria-label=\{`\$\{row\.code\} bilişsel düzeyi`\}/);
});
