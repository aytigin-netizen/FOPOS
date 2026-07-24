"use client";

import { useState } from "react";
import { clearFoposBrowserStorage, privacyDataMap, privacyPolicy } from "@/modules/privacy/model";

export function PrivacyCenter() {
  const [message, setMessage] = useState("Bu sayfa tarayıcıda kalıcı öğrenci verisi bulundurmaz.");

  function clearBrowserData() {
    const cleared = clearFoposBrowserStorage(window.localStorage)
      + clearFoposBrowserStorage(window.sessionStorage);
    setMessage(cleared
      ? `${cleared} FOPOS tarayıcı kaydı silindi. Açık modüllerdeki verileri de ilgili “Oturum verilerini sil” düğmesiyle temizleyin.`
      : "Kalıcı FOPOS tarayıcı kaydı bulunamadı. Açık modüllerdeki veriler yalnızca sayfa belleğindedir.");
  }

  return (
    <div className="privacy-center">
      <section className="privacy-principles" aria-label="Gizlilik ilkeleri">
        <article><strong>Bellekte</strong><span>Kimlikli öğrenci verisi kalıcı depolamaya yazılmaz.</span></article>
        <article><strong>Kimliksiz AI</strong><span>Karar desteği yalnızca toplulaştırılmış kanıt kullanır.</span></article>
        <article><strong>Öğretmen denetimi</strong><span>Belge ancak açık onay ve indirme işlemiyle oluşur.</span></article>
        <article><strong>Kısa yaşam döngüsü</strong><span>Veri sıfırlama, yenileme veya sekme kapanışıyla sona erer.</span></article>
      </section>

      <section className="privacy-policy-card">
        <div>
          <span className="eyebrow">Politika v{privacyPolicy.version}</span>
          <h2>Veri yaşam döngüsü</h2>
        </div>
        <div className="privacy-table-wrap">
          <table className="privacy-table">
            <thead><tr><th>Veri</th><th>Örnek</th><th>Nerede?</th><th>Ne zaman silinir?</th></tr></thead>
            <tbody>{privacyDataMap.map((item) => (
              <tr key={item.category}><th>{item.category}</th><td>{item.examples}</td><td>{item.location}</td><td>{item.lifecycle}</td></tr>
            ))}</tbody>
          </table>
        </div>
      </section>

      <section className="privacy-actions">
        <div><h2>Tarayıcı verisi denetimi</h2><p>{message}</p></div>
        <button className="secondary-button" type="button" onClick={clearBrowserData}>FOPOS tarayıcı kayıtlarını temizle</button>
      </section>
    </div>
  );
}

