/**
 * Kendi sunucumuzdaki giriş sayfasının HTML'i.
 *
 * Uygulamanın geri kalanı bir istemci uygulamasıdır; giriş ekranı ise sunucu
 * tarafında basit bir form olarak sunulur. Böylece istemci paketine ek
 * yük bindirilmez ve giriş akışı Sites katmanından bağımsız çalışır.
 */

export type SelfHostedLoginPageOptions = {
  returnTo: string;
  error?: string | null;
  email?: string | null;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function renderSelfHostedLoginPage(
  options: SelfHostedLoginPageOptions,
): string {
  const returnTo = escapeHtml(options.returnTo);
  const email = options.email ? escapeHtml(options.email) : "";
  const error = options.error
    ? `<p class="error" role="alert">${escapeHtml(options.error)}</p>`
    : "";

  return `<!doctype html>
<html lang="tr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>FOPOS • Giriş</title>
    <style>
      :root { color-scheme: light; }
      * { box-sizing: border-box; }
      body {
        margin: 0; min-height: 100vh; display: flex; align-items: center;
        justify-content: center; padding: 24px;
        font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
        background: #f5f3ef; color: #23201c;
      }
      main {
        width: 100%; max-width: 380px; background: #fff; border-radius: 16px;
        padding: 32px 28px; box-shadow: 0 12px 32px rgba(35, 32, 28, .08);
      }
      .brand { display: flex; align-items: baseline; gap: 10px; margin: 0 0 4px; }
      .brand strong { font-size: 22px; letter-spacing: .06em; }
      .brand span { font-size: 13px; color: #6b645c; }
      h1 { font-size: 17px; margin: 18px 0 6px; }
      p.sub { margin: 0 0 20px; font-size: 13px; color: #6b645c; line-height: 1.5; }
      label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; }
      input {
        width: 100%; padding: 11px 12px; font-size: 15px; border-radius: 10px;
        border: 1px solid #d8d2c8; background: #fbfaf8;
      }
      input:focus { outline: 2px solid #6f7d5e; outline-offset: 1px; border-color: #6f7d5e; }
      button {
        width: 100%; margin-top: 16px; padding: 12px; font-size: 15px;
        font-weight: 600; border: 0; border-radius: 10px; cursor: pointer;
        background: #4f5f3f; color: #fff;
      }
      button:hover { background: #435235; }
      .error {
        margin: 0 0 16px; padding: 10px 12px; font-size: 13px; border-radius: 10px;
        background: #fdeeee; color: #8a2f2f; border: 1px solid #f3cfcf;
      }
      .meta { margin: 18px 0 0; font-size: 12px; color: #8a837a; line-height: 1.5; }
    </style>
  </head>
  <body>
    <main>
      <p class="brand"><strong>FOPOS</strong><span>Öğretmen Çalışma Alanı</span></p>
      <h1>Öğretmen girişi</h1>
      <p class="sub">Devam etmek için geçiş kodunuzu girin.</p>
      ${error}
      <form method="post" action="/signin-with-chatgpt">
        <input type="hidden" name="return_to" value="${returnTo}" />
        <label for="code">Geçiş kodu</label>
        <input
          id="code" name="code" type="password" inputmode="text"
          autocomplete="current-password" required autofocus
        />
        <button type="submit">Giriş yap</button>
      </form>
      <p class="meta">${email ? `Hesap: ${email}<br />` : ""}Oturum bu tarayıcıda 30 gün geçerlidir.</p>
    </main>
  </body>
</html>
`;
}
