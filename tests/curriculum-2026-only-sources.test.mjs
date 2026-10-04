import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import test from "node:test";
import { loadPackage } from "../src/core/curriculum/package-loader.ts";
import { resolveCurriculumPackage } from "../src/core/curriculum/curriculum-resolver.ts";
import { getOfficialSource, listOfficialSources } from "../src/core/curriculum/source-registry.ts";
import { phaseCatalogForDataset } from "../app/modules/lesson-studio/phase-catalog-runtime.ts";

const root = new URL("../", import.meta.url);
const manifest = JSON.parse(await readFile(new URL("sources/curriculum-2026/manifest.json", root), "utf8"));
const normalize = (text) => text.normalize("NFKC")
  .replace(/-\s*\n\s*/gu, "").replace(/\s+/gu, "").toLocaleLowerCase("tr-TR");

test("desteklenmeyen sürüm paketi ve kaynak verisi yoktur; eski sürüm yeni kaynağa sessizce düşmez", async () => {
  const dataFiles = (await readdir(new URL("app/data/", root))).filter((path) => /^felsefe_curriculum_/u.test(path));
  assert.deepEqual(dataFiles.sort(), ["felsefe_curriculum_2026.json", "felsefe_curriculum_2026_transition.json"]);
  const packageFiles = await readdir(new URL("src/curriculum-packages/", root));
  assert.deepEqual(packageFiles.filter((path) => /^philosophy-/u.test(path)), ["philosophy-2026.ts"]);
  assert.equal(getOfficialSource("meb:philosophy:unsupported"), null);
  assert.ok(listOfficialSources().every((source) => source.datasetVersion === "2026.1"));
  assert.throws(() => loadPackage({ disciplineCode: "philosophy", datasetVersion: "0000.1" }));
  assert.throws(() => resolveCurriculumPackage({ disciplineCode: "philosophy", datasetVersion: "0000.1" }));
  assert.throws(() => phaseCatalogForDataset("philosophy", "0000.1"));
});

test("dört dersin yüklenen PDF ve metin kanıtı hash ile sabitlenir", async () => {
  assert.equal(manifest.soleOfficialYear, 2026);
  assert.deepEqual(manifest.sources.map((source) => source.disciplineCode), ["philosophy", "sociology", "psychology", "logic"]);
  for (const source of manifest.sources) {
    assert.equal(source.sourceYear, 2026);
    for (const [path, digest] of [[source.pdfPath, source.sha256], [source.textPath, source.textSha256]]) {
      assert.equal(createHash("sha256").update(await readFile(new URL(path, root))).digest("hex"), digest);
    }
    const text = await readFile(new URL(source.textPath, root), "utf8");
    assert.match(text.slice(0, 300), /2[O0]26/u);
  }
});

for (const disciplineCode of ["philosophy", "sociology"]) {
  test(`${disciplineCode}: bütün öğrenme çıktıları ve süreç bileşenleri yüklenen 2026 metninde bulunur`, async () => {
    const source = manifest.sources.find((source) => source.disciplineCode === disciplineCode);
    const text = normalize(await readFile(new URL(source.textPath, root), "utf8"));
    const curriculum = loadPackage({ disciplineCode, datasetVersion: "2026.1" });
    for (const unit of curriculum.units) {
      for (const outcome of unit.outcomes) {
        assert.ok(text.includes(normalize(outcome.code)), outcome.code);
        assert.ok(text.includes(normalize(outcome.description)), outcome.code);
        for (const component of outcome.processComponents ?? []) {
          // 2026 PDF s. 51'de "Çevre sorunlarıyla ile ilgili" dizgi hatası vardır.
          // Kanonik metindeki dil düzeltmesi açıkça bu tek ifadeyle sınırlıdır.
          const description = outcome.code === "FEL.11.1.2" && component.step === "a"
            ? component.description.replace("sorunlarıyla ilgili", "sorunlarıyla ile ilgili")
            : component.description;
          assert.ok(text.includes(normalize(description)), `${outcome.code}/${component.step}: ${description}`);
        }
      }
    }
  });
}

test("Psikoloji ve Mantık kaynak kaydı tamamlanmış runtime paketi anlamına gelmez", () => {
  for (const disciplineCode of ["psychology", "logic"]) {
    assert.equal(manifest.sources.find((source) => source.disciplineCode === disciplineCode).runtimePackageAvailable, false);
    assert.throws(() => loadPackage({ disciplineCode, datasetVersion: "2026.1" }));
  }
});

test("Felsefenin 15 ünitesindeki TYMM bileşenleri kendi 2026 ünite başlığında doğrulanır", async () => {
  const source = manifest.sources.find((source) => source.disciplineCode === "philosophy");
  const text = await readFile(new URL(source.textPath, root), "utf8");
  const headings = [...text.matchAll(/\d+\.\s*ÜNİTE:[^\n]+/gu)];
  const curriculum = loadPackage({ disciplineCode: "philosophy", datasetVersion: "2026.1" });
  for (const unit of curriculum.units) {
    const heading = headings.findLast((heading) => normalize(heading[0]).endsWith(normalize(unit.name)));
    assert.ok(heading, unit.code);
    const next = headings.find((candidate) => candidate.index > heading.index);
    const segment = normalize(text.slice(heading.index, next?.index));
    const framework = segment.slice(0, segment.indexOf("öğrenmeçıktıları"));
    assert.ok(framework.length > 0, unit.code);
    for (const [field, values] of Object.entries(unit.competencyFramework)) {
      for (const value of values) {
        // PDF'deki dört dizgi farkı açık ve üniteye bağlıdır; kodlar değişmez.
        const printCorrections = {
          "F10_U5/SDB1.1. Kendini Tanıma (Öz Farkındalık)": "SDB1.1. Kendini Tanıma (Öz Farkındalık",
          "F11_U2/SDB1.1. Kendini Tanıma (Öz Farkındalık)": "SDB1.1. Kendini Tanıma (Öz Farkındalık",
          "F11_U5/D10. Mütevazılık": "D10. Mütavazılık",
          "F11_U6/SDB1.2. Kendini Düzenleme (Öz Düzenleme)": "SDB1.2. Kendini Düzenleme (Öz Düzenleme",
        };
        const printed = printCorrections[`${unit.code}/${value}`] ?? value;
        assert.ok(framework.includes(normalize(printed)), `${unit.code}/${field}: ${value}`);
      }
    }
  }
});
