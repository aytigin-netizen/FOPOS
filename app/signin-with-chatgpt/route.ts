import {
  getRuntimeEnvironment,
  selfHostedIdentityConfigured,
} from "../core/runtime-environment";
import { safeRelativeReturnPath } from "../core/auth-return-path";
import { renderSelfHostedLoginPage } from "../core/self-hosted-login-page";
import {
  accessCodeMatches,
  createSessionToken,
  SESSION_COOKIE_NAME,
  readCookie,
  sessionCookieHeader,
  verifySessionToken,
} from "../core/self-hosted-session";

export const dynamic = "force-dynamic";

const NOT_CONFIGURED_MESSAGE =
  "Bu dağıtımda öğretmen girişi yapılandırılmamış. FOPOS_ACCESS_CODE, FOPOS_SESSION_SECRET ve FOPOS_TEACHER_EMAIL tanımlanmalıdır.";

function requestOriginMatches(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export async function GET(request: Request) {
  const environment = getRuntimeEnvironment();
  if (!selfHostedIdentityConfigured(environment) || !environment) {
    return new Response(NOT_CONFIGURED_MESSAGE, {
      status: 503,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  const url = new URL(request.url);
  const returnTo = safeRelativeReturnPath(
    url.searchParams.get("return_to") ?? "/",
  );

  const cookie = readCookie(request.headers.get("cookie"), SESSION_COOKIE_NAME);
  const session = await verifySessionToken(
    cookie ?? "",
    environment.FOPOS_SESSION_SECRET ?? "",
  );
  if (session) {
    return Response.redirect(new URL(returnTo, request.url), 303);
  }

  return new Response(
    renderSelfHostedLoginPage({
      returnTo,
      email: environment.FOPOS_TEACHER_EMAIL ?? null,
    }),
    { status: 200, headers: { "content-type": "text/html; charset=utf-8" } },
  );
}

export async function POST(request: Request) {
  const environment = getRuntimeEnvironment();
  if (!selfHostedIdentityConfigured(environment) || !environment) {
    return new Response(NOT_CONFIGURED_MESSAGE, {
      status: 503,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  // Aynı kök kontrolü: form yalnızca bu uygulamanın kendi sayfasından gönderilebilir.
  if (!requestOriginMatches(request)) {
    return new Response("İstek kaynağı doğrulanamadı.", {
      status: 403,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  let code = "";
  let returnTo = "/";
  try {
    const form = await request.formData();
    code = String(form.get("code") ?? "");
    returnTo = safeRelativeReturnPath(String(form.get("return_to") ?? "/"));
  } catch {
    return new Response("İstek gövdesi okunamadı.", {
      status: 400,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }

  const matches = await accessCodeMatches(
    code.trim(),
    environment.FOPOS_ACCESS_CODE ?? "",
  );
  if (!matches) {
    return new Response(
      renderSelfHostedLoginPage({
        returnTo,
        error: "Geçiş kodu doğru değil.",
        email: environment.FOPOS_TEACHER_EMAIL ?? null,
      }),
      {
        status: 401,
        headers: { "content-type": "text/html; charset=utf-8" },
      },
    );
  }

  const token = await createSessionToken(
    {
      email: environment.FOPOS_TEACHER_EMAIL ?? "",
      name: environment.FOPOS_TEACHER_NAME ?? null,
    },
    environment.FOPOS_SESSION_SECRET ?? "",
  );

  return new Response(null, {
    status: 303,
    headers: {
      location: new URL(returnTo, request.url).toString(),
      "set-cookie": sessionCookieHeader(token),
      "cache-control": "no-store",
    },
  });
}
