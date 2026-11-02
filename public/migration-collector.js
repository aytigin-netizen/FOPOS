/*
 * FOPOS — veri taşıma toplayıcısı (ESKİ canlı site).
 *
 * Bu betik, öğretmenin tarayıcısında ESKİ canlı sitede
 * (https://fopos-ders-studyosu.aytigin.chatgpt.site) oturum açıkken
 * çalıştırılır. Oturum çerezi sayesinde kimliği kendisi taşır; şifre
 * veya anahtar gerekmez.
 *
 * Topladığı veriler:
 *   1) /api/account-export        → profil, sınıf çalışma alanları, pedagojik
 *                                    kayıtlar, programlar, sınav üretim geçmişi
 *                                    (öğrenci listeleri bilerek dışarıda bırakılır)
 *   2) /api/class-workspaces      → canlı sınıf kimlikleri (UUID)
 *   3) /api/student-rosters       → her sınıfın öğrenci listesi
 *
 * Çıktı: `FOPOS_TASIMA_<tarih>.json` dosyası indirilir.
 *
 * Kullanım — eski canlı sitede tarayıcı konsoluna yapıştırın:
 *
 *   (async()=>{const s=document.createElement('script');s.src='https://fopos-ders-studyosu.aytigin.workers.dev/migration-collector.js';document.body.appendChild(s)})()
 *
 * Bu betiğin sunulduğu siteye bağlı değildir: istekler her zaman çalıştığı
 * sayfanın adresine gider. Bu yüzden eski canlı sitede çalıştırıldığında
 * ESKİ sitenin verisini toplar.
 */
(async function collectMigrationData() {
  const banner = document.createElement("div");
  banner.setAttribute("role", "status");
  banner.style.cssText = [
    "position:fixed",
    "inset:auto 16px 16px auto",
    "z-index:2147483647",
    "max-width:380px",
    "padding:14px 16px",
    "border-radius:12px",
    "background:#23201c",
    "color:#fff",
    "font:14px/1.5 system-ui,-apple-system,Segoe UI,sans-serif",
    "box-shadow:0 10px 30px rgba(0,0,0,.28)",
    "white-space:pre-wrap",
  ].join(";");
  document.body.appendChild(banner);

  const show = (message, ok = false) => {
    banner.textContent = message;
    banner.style.background = ok ? "#3f5a2e" : "#23201c";
    console.log("[FOPOS taşıma]", message);
  };

  async function getJson(url) {
    const response = await fetch(url, {
      credentials: "same-origin",
      headers: { accept: "application/json" },
    });
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText} — ${url}`);
    }
    return response.json();
  }

  async function postJson(url, body) {
    const response = await fetch(url, {
      method: "POST",
      credentials: "same-origin",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText} — ${url}`);
    }
    return response.json();
  }

  try {
    show("Hesap dışa aktarımı alınıyor…");
    const exportPayload = await postJson("/api/account-export", { confirmed: true });

    show("Sınıf çalışma alanları alınıyor…");
    const workspaceState = await getJson("/api/class-workspaces");
    const workspaces = Array.isArray(workspaceState?.workspaces)
      ? workspaceState.workspaces
      : [];

    show(`${workspaces.length} sınıf bulundu; öğrenci listeleri alınıyor…`);
    const rosters = [];
    for (const workspace of workspaces) {
      try {
        const state = await getJson(
          `/api/student-rosters?classId=${encodeURIComponent(workspace.id)}`,
        );
        rosters.push({
          classId: workspace.id,
          classLabel: `${workspace.academicYear} · ${workspace.grade}/${workspace.branchCode}`,
          revision: state?.revision ?? 0,
          roster: state?.roster ?? null,
        });
        show(
          `Sınıf alındı: ${workspace.grade}/${workspace.branchCode} (${rosters.length}/${workspaces.length})`,
        );
      } catch (error) {
        rosters.push({
          classId: workspace.id,
          classLabel: `${workspace.academicYear} · ${workspace.grade}/${workspace.branchCode}`,
          revision: 0,
          roster: null,
          error: String(error),
        });
        show(`Sınıf alınamadı: ${workspace.grade}/${workspace.branchCode}\n${error}`);
      }
    }

    const collected = {
      collectedBy: "FOPOS migration collector",
      collectedAt: new Date().toISOString(),
      origin: location.origin,
      accountExport: exportPayload,
      classWorkspaces: workspaces,
      studentRosters: rosters,
    };

    const date = new Date().toISOString().slice(0, 10);
    const blob = new Blob([JSON.stringify(collected, null, 2)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `FOPOS_TASIMA_${date}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(link.href), 10_000);

    const rosterCount = rosters.filter((entry) => entry.roster).length;
    const studentCount = rosters.reduce(
      (sum, entry) => sum + (entry.roster?.students?.length ?? 0),
      0,
    );
    show(
      `TAMAM ✓\n${workspaces.length} sınıf · ${rosterCount} öğrenci listesi · ${studentCount} öğrenci\n` +
        `FOPOS_TASIMA_${date}.json indirildi.\n` +
        `Bu pencereyi kapatabilirsiniz.`,
      true,
    );
  } catch (error) {
    show(`HATA:\n${String(error)}\n\nBu sayfada oturum açık mı? Sayfayı yenileyip tekrar deneyin.`);
    console.error("[FOPOS taşıma] HATA:", error);
  }
})();
