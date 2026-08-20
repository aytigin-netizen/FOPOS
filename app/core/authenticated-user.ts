export type AuthProvider = "chatgpt";

export type AuthenticatedUserIdentity = {
  provider: AuthProvider;
  providerSubject: string;
  displayName: string;
  email: string;
  fullName: string | null;
};

const EMAIL_HEADER = "oai-authenticated-user-email";
const FULL_NAME_HEADER = "oai-authenticated-user-full-name";
const FULL_NAME_ENCODING_HEADER =
  "oai-authenticated-user-full-name-encoding";
const PERCENT_ENCODED_UTF8 = "percent-encoded-utf-8";

export function authenticatedUserFromHeaders(
  requestHeaders: Pick<Headers, "get">,
): AuthenticatedUserIdentity | null {
  const rawEmail = requestHeaders.get(EMAIL_HEADER);
  const email = rawEmail?.trim().toLocaleLowerCase("en-US") ?? "";
  if (!email || !email.includes("@")) return null;

  const encodedFullName = requestHeaders.get(FULL_NAME_HEADER);
  const fullName =
    encodedFullName &&
    requestHeaders.get(FULL_NAME_ENCODING_HEADER) === PERCENT_ENCODED_UTF8
      ? safeDecodeURIComponent(encodedFullName)
      : null;

  return {
    provider: "chatgpt",
    providerSubject: email,
    displayName: fullName?.trim() || email,
    email,
    fullName: fullName?.trim() || null,
  };
}

function safeDecodeURIComponent(value: string): string | null {
  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
}
