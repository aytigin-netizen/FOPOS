import { safeRelativeReturnPath } from "../core/auth-return-path";
import { clearSessionCookieHeader } from "../core/self-hosted-session";

export const dynamic = "force-dynamic";

/**
 * Çıkış: oturum çerezini temizler ve güvenli dönüş adresine yönlendirir.
 *
 * Sites dağıtımında bu yol platform tarafından karşılanır. Workers
 * dağıtımında ise uygulamanın kendi oturumunu sonlandırır.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const returnTo = safeRelativeReturnPath(
    url.searchParams.get("return_to") ?? "/",
  );

  return new Response(null, {
    status: 303,
    headers: {
      location: new URL(returnTo, request.url).toString(),
      "set-cookie": clearSessionCookieHeader(),
      "cache-control": "no-store",
    },
  });
}
