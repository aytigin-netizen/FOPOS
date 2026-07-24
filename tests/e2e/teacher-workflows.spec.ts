import { expect, test } from "@playwright/test";

test("ana ekran yedi hazır modülü ve yayın merkezini gösterir", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "FOPOS", exact: true })).toBeVisible();
  await expect(page.getByText("7 hazır temel")).toBeVisible();
  await expect(page.getByRole("link", { name: "Yayın hazırlık durumunu görüntüle →" })).toBeVisible();
});

test("10. ve 11. sınıf günlük plan akışı müfredatla birlikte değişir", async ({ page }) => {
  await page.goto("/daily-plan");

  const grade10 = page.getByRole("button", { name: "10. sınıf" });
  const grade11 = page.getByRole("button", { name: "11. sınıf" });
  await expect(grade10).toHaveClass(/active/);
  await expect(grade11).toHaveCount(1);
  await grade11.click();
  await expect(grade11).toHaveClass(/active/);

  const approval = page.getByLabel("Belge içeriğini kontrol ettim; dışa aktarmayı onaylıyorum.");
  await approval.check();
  await expect(page.getByRole("button", { name: "DOCX indir" })).toBeEnabled();
  await expect(page.getByRole("button", { name: "PDF indir" })).toBeEnabled();
});

test("11. sınıf yıllık plan 36 haftayı ve yatay çıktıları hazırlar", async ({ page }) => {
  await page.goto("/annual-plan");

  const grade11 = page.getByRole("button", { name: "11. sınıf" });
  await expect(grade11).toHaveCount(1);
  await grade11.click();
  await expect(page.locator(".annual-table tbody tr")).toHaveCount(36);

  await page.getByLabel("2026–2027 çalışma takvimini kontrol ettim.").check();
  await page.getByLabel("36 haftalık müfredat dağılımını kontrol ettim.").check();
  await expect(page.getByRole("button", { name: "Yatay DOCX indir" })).toBeEnabled();
  await expect(page.getByRole("button", { name: "Yatay PDF indir" })).toBeEnabled();
});

test("sınav paketi öğretmen onayından önce kilitlidir", async ({ page }) => {
  await page.goto("/exam-generator");

  const docx = page.getByRole("button", { name: "DOCX sınav paketini indir" });
  const pdf = page.getByRole("button", { name: "PDF sınav paketini indir" });
  await expect(docx).toBeDisabled();
  await expect(pdf).toBeDisabled();

  await page.getByLabel("Soruları, puanları, cevap anahtarını, belirtke tablosunu ve A–B eşdeğerliğini kontrol ettim.").check();
  await expect(docx).toBeEnabled();
  await expect(pdf).toBeEnabled();
});

test("sınav analizi kimliksiz raporu eksik veri varken dışa açmaz", async ({ page }) => {
  await page.goto("/exam-analysis");

  await expect(page.getByText("Rapor yalnızca toplulaştırılmış sonuçları içerir; öğrenci adı ve okul numarası dışa aktarılmaz.")).toBeVisible();
  await expect(page.getByRole("button", { name: "DOCX analiz raporunu indir" })).toBeDisabled();
  await expect(page.getByRole("button", { name: "PDF analiz raporunu indir" })).toBeDisabled();
});

test("öğrenci kimlikleri öğretmen isteğiyle oturumdan silinir", async ({ page }) => {
  await page.goto("/exam-analysis");

  await page.getByLabel("e-Okul / Excel listesini yapıştır").fill("701\tAyşe Deneme");
  await page.getByRole("button", { name: "Listeyi önizle ve aktar" }).click();
  await expect(page.getByText("Ayşe Deneme")).toBeVisible();

  await page.getByRole("button", { name: "Oturumdaki öğrenci verilerini sil" }).click();
  await expect(page.getByText("Ayşe Deneme")).toHaveCount(0);
});

test("gizlilik merkezi veri yaşam döngüsünü açıklar", async ({ page }) => {
  await page.goto("/privacy");

  await expect(page.getByRole("heading", { name: "Gizlilik Merkezi" })).toBeVisible();
  await expect(page.getByText("Öğrenci kimliği", { exact: true })).toBeVisible();
  await expect(page.getByText("Yalnızca açık sınav analizi ekranının belleği").first()).toBeVisible();
});
