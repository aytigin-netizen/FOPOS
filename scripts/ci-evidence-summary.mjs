import { appendFile, readFile } from "node:fs/promises";

const baseline = JSON.parse(
  await readFile(new URL("../config/release-baseline-2026.2.json", import.meta.url), "utf8"),
);
const logPath = process.env.CONTRACT_TEST_LOG;
if (!logPath) throw new Error("CONTRACT_TEST_LOG is required.");

const testLog = await readFile(logPath, "utf8");
const count = (pattern, label) => {
  const value = Number(testLog.match(pattern)?.[1]);
  if (!Number.isInteger(value)) throw new Error(`${label} test günlüğünde bulunamadı.`);
  return value;
};
const tapCount = (label) => new RegExp(`^(?:#|ℹ) ${label} (\\d+)$`, "mu");
const tests = count(tapCount("tests"), "Toplam");
const passed = count(tapCount("pass"), "Başarılı");
const failed = count(tapCount("fail"), "Başarısız");

if (tests < baseline.tests.contractBaseline) {
  throw new Error(`Sözleşme test toplamı ${baseline.tests.contractBaseline} tabanının altına düştü: ${tests}.`);
}
if (passed !== tests || failed !== 0) {
  throw new Error(`Sözleşme testleri tam başarılı değil: ${passed}/${tests}, başarısız ${failed}.`);
}

const summary = [
  "## OPUS–FOPOS CI Kanıt Özeti",
  "",
  `- Sürüm temeli: \`${baseline.baselineId}\``,
  `- Kabul commit’i: \`${baseline.acceptedMainCommit}\``,
  `- Çalıştırılan commit: \`${process.env.GITHUB_SHA ?? "yerel"}\``,
  `- Canlı kabul sürümü: **${baseline.acceptedLiveVersion}**`,
  `- Sözleşme testleri: **${passed}/${tests} başarılı** (taban: ${baseline.tests.contractBaseline})`,
  `- Hedef bütünleşik test tabanı: **${baseline.tests.targetedIntegratedBaseline}**`,
  `- Kanonik kapsam: **${baseline.curriculum.unitCount} ünite / ${baseline.curriculum.learningOutcomeCount} çıktı / ${baseline.curriculum.canonicalWeekCount} hafta**`,
  `- Belge zinciri: **${baseline.integratedWorkflow.documentChainStepCount} adım**`,
  `- Pedagojik sözleşme: **${baseline.pedagogy.phaseCount} aşama / ${baseline.pedagogy.durationMinutes} dakika**`,
  "- Artifact doğrulaması: **başarılı** (özet adımı yalnız önceki CI adımları geçtiğinde çalışır)",
  "",
].join("\n");

if (process.env.GITHUB_STEP_SUMMARY) {
  await appendFile(process.env.GITHUB_STEP_SUMMARY, summary, "utf8");
} else {
  process.stdout.write(summary);
}
