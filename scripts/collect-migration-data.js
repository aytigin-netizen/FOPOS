/*
 * FOPOS — veri taşıma toplayıcısı (ESKİ canlı site).
 *
 * Bu betik, ÖĞRETMENİN tarayıcısında ESKİ canlı sitede
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
 * Kullanım: Bu dosyayı tarayıcıda açıp "Topla" düğmesine basın VEYA
 * konsola aşağıdaki tek satırı yapıştırın:
 *
 *   (async()=>{const s=document.createElement('script');s.src='https://raw.githubusercontent.com/aytigin-netizen/FOPOS/main/scripts/collect-migration-data.js';document.body.appendChild(s)})()
 *
 * (Betik doğrudan konsoldan da çalışır: dosyayı açmanız gerekmez.)
 */
(async function collectMigrationData() {
  const log = (...args) => console.log("[FOPOS taşıma]", ...args);

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
    log("Hesap dışa aktarımı alınıyor…");
    const exportPayload = await postJson("/api/account-export", { confirmed: true });

    log("Sınıf çalışma alanları alınıyor…");
    const workspaceState = await getJson("/api/class-workspaces");
    const workspaces = Array.isArray(workspaceState?.workspaces)
      ? workspaceState.workspaces
      : [];

    log(`${workspaces.length} sınıf bulundu; öğrenci listeleri alınıyor…`);
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
        log(`  ✓ ${workspace.grade}/${workspace.branchCode}`);
      } catch (error) {
        rosters.push({
          classId: workspace.id,
          classLabel: `${workspace.academicYear} · ${workspace.grade}/${workspace.branchCode}`,
          revision: 0,
          roster: null,
          error: String(error),
        });
        log(`  ✗ ${workspace.grade}/${workspace.branchCode}: ${error}`);
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

    log(
      `TAMAM — ${workspaces.length} sınıf, ${rosters.filter((r) => r.roster).length} öğrenci listesi indirildi.`,
    );
  } catch (error) {
    console.error("[FOPOS taşıma] HATA:", error);
    alert(
      "FOPOS taşıma toplayıcısı hata verdi:\n\n" +
        String(error) +
        "\n\nBu sayfada oturum açık mı? Sayfayı yenileyip tekrar deneyin.",
    );
  }
})();
