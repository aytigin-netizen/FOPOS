import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { safeFileName, safeFileSegment } from "../app/core/file-download.ts";

const exportFiles = [
  "../app/modules/daily-plan/export-daily-plan.ts",
  "../app/modules/exam-builder/ExamBuilder.tsx",
  "../app/modules/exam-analysis/ExamAnalysisModule.tsx",
  "../app/modules/annual-plan/AnnualPlanModule.tsx",
  "../app/modules/department-meeting/DepartmentMeetingModule.tsx",
];
const sources = await Promise.all(
  exportFiles.map((file) => readFile(new URL(file, import.meta.url), "utf8")),
);
const pageSource = await readFile(
  new URL("../app/page.tsx", import.meta.url),
  "utf8",
);

test("dosya adlarında kullanıcı girdisi güvenli bölüme dönüştürülür", () => {
  assert.equal(
    safeFileSegment("11/A Felsefe: 2026–2027"),
    "11_A_Felsefe_2026_2027",
  );
  assert.equal(
    safeFileName(["FOPOS", "Şube 11/A"], ".DOCX"),
    "FOPOS_Sube_11_A.docx",
  );
  assert.doesNotMatch(safeFileName(["../../gizli"], "docx"), /\.\.|\//);
});

test("bütün belge indirmeleri ortak güvenli yaşam döngüsünü kullanır", () => {
  for (const source of sources) {
    assert.match(source, /downloadBlob\(/);
    assert.match(source, /safeFileName\(/);
    assert.doesNotMatch(source, /URL\.createObjectURL/);
  }
});

test("belgeler yönetici adına otomatik uygunluk kararı üretmez", () => {
  assert.doesNotMatch(sources.join("\n"), /UYGUNDUR/);
  assert.doesNotMatch(pageSource, /UYGUNDUR/);
  assert.match(sources[0], /Onay tarihi \/ İmza/);
});

test("günlük plan çıktısı öğretmen onayı ile kural doğrulamasını ayırır", () => {
  assert.match(sources[0], /Kontrol ve Öğretmen Onayı Kaydı/);
  assert.match(sources[0], /Öğretmen incelemesi — onaylandı/);
  assert.doesNotMatch(sources[0], /\[\$\{check\.status\}\]/);
  assert.match(sources[0], /creator: "FOPOS v5\.0 Professional Edition"/);
});

test("günlük plan akış satırları sayfalar arasında bölünmez", () => {
  assert.match(sources[0], /cantSplit: true/);
  assert.match(sources[0], /headerCell\("Öğrenme kanıtı", 20\)/);
});

test("günlük plan kanonik TYMM alanlarını görünür biçimde dışa aktarır", () => {
  for (const heading of [
    "Alan Becerileri", "Eğilimler", "Sosyal-Duygusal Öğrenme Becerileri",
    "Okuryazarlık Becerileri", "Disiplinler Arası İlişkiler",
    "Beceriler Arası İlişkiler", "İçerik Çerçevesi", "Anahtar Kavramlar",
    "Öğrenmeye Hazırlık", "Ünite Düzeyinde Öğrenme Kanıtları",
    "Zenginleştirme", "Destekleme",
  ]) assert.ok(sources[0].includes(heading), `${heading} alanı eksik`);
});

test("PDF aktarımından kalan kenar başlıkları ve bölünmüş kelimeler temizlenir", () => {
  assert.match(sources[0], /cleanCurriculumText/);
});

test("günlük plan belgesi webdeki pedagojik risk ve ürün izini taşır", () => {
  assert.match(sources[0], /Pedagojik Riskler ve Önlemler/);
  assert.match(sources[0], /result\.decision\.risks\.map/);
  assert.match(sources[0], /Ürün: \$\{result\.product\.productId\}/);
});
