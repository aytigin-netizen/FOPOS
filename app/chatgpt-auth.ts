import { headers } from "next/headers";
import {
  authenticatedUserFromHeaders,
  type AuthenticatedUserIdentity,
} from "./core/authenticated-user";
import {
  getRuntimeEnvironment,
  selfHostedIdentityConfigured,
} from "./core/runtime-environment";
import {
  readCookie,
  SESSION_COOKIE_NAME,
  verifySessionToken,
} from "./core/self-hosted-session";

export type ChatGPTUser = AuthenticatedUserIdentity;

export { chatGPTSignOutPath, safeRelativeReturnPath } from "./core/auth-return-path";

/**
 * Oturum kimliğini çözer.
 *
 * İki sağlayıcı desteklenir:
 * - "chatgpt": OpenAI Sites dağıtımı. Kimlik, barındırma katmanının
 *   doğruladığı başlıklardan okunur.
 * - "self": Cloudflare Workers dağıtımı. Kimlik, imzalı oturum çerezinden
 *   okunur. Bu sağlayıcı yalnızca gerekli üç `FOPOS_*` değeri tanımlıysa
 *   devreye girer.
 *
 * Kendi oturumumuz önce denenir; Sites başlığı ancak onun bulunmadığı
 * durumda değerlendirilir.
 */
export async function getChatGPTUser(): Promise<ChatGPTUser | null> {
  const requestHeaders = await headers();
  const environment = getRuntimeEnvironment();

  if (selfHostedIdentityConfigured(environment) && environment) {
    const cookie = readCookie(
      requestHeaders.get("cookie"),
      SESSION_COOKIE_NAME,
    );
    const session = await verifySessionToken(
      cookie ?? "",
      environment.FOPOS_SESSION_SECRET ?? "",
    );
    if (session) {
      const displayName = session.name?.trim() || session.email;
      return {
        provider: "self",
        providerSubject: session.email,
        displayName,
        email: session.email,
        fullName: session.name?.trim() || null,
      };
    }
  }

  return authenticatedUserFromHeaders(requestHeaders);
}
