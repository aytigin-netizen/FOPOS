import { existsSync, readFileSync } from "node:fs";
import { privacyDataMap, privacyPolicy } from "../modules/privacy/model";

const errors: string[] = [];
if (privacyPolicy.storage !== "memory-only") errors.push("Kimlikli öğrenci verisi yalnızca bellekte tutulmalıdır.");
if (privacyPolicy.externalTransfer !== "aggregated-only") errors.push("Harici karar desteği yalnızca toplulaştırılmış veri almalıdır.");
if (privacyDataMap.length !== 4) errors.push("Veri yaşam döngüsü haritası eksik.");
if (!existsSync("app/privacy/page.tsx")) errors.push("Gizlilik Merkezi rotası bulunamadı.");

const analysisBuilder = readFileSync("app/exam-analysis/ExamAnalysisBuilder.tsx", "utf8");
if (!analysisBuilder.includes("Oturumdaki öğrenci verilerini sil")) errors.push("Sınav analizi silme kontrolü bulunamadı.");
if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
console.log("Gizlilik doğrulaması başarılı: bellek içi işleme, kimliksiz AI ve açık silme yaşam döngüsü hazır.");

