import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const page = await readFile(
  new URL("../app/page.tsx", import.meta.url),
  "utf8",
);
const exporter = await readFile(
  new URL("../app/modules/daily-plan/export-daily-plan.ts", import.meta.url),
  "utf8",
);
const compactPage = page.replace(/\s+/g, "");
const compactExporter = exporter.replace(/\s+/g, "");

test("dışa aktarma öğretmen onayına bağlıdır", () => {
  assert.match(compactPage, /status!=="approved"/);
  assert.match(compactExporter, /status!=="approved"/);
});

test("inceleme, onay ve revizyon ayrıdır", () => {
  assert.match(page, /submitForReview/);
  assert.match(page, /teacherReviewConfirmed/);
  assert.match(page, /reviseRecord/);
  assert.match(page, /Yeni revizyon/);
});
