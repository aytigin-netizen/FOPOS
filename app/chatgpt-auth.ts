import { headers } from "next/headers";
import {
  authenticatedUserFromHeaders,
  type AuthenticatedUserIdentity,
} from "./core/authenticated-user";

export type ChatGPTUser = AuthenticatedUserIdentity;

export { chatGPTSignOutPath, safeRelativeReturnPath } from "./core/auth-return-path";

export async function getChatGPTUser(): Promise<ChatGPTUser | null> {
  return authenticatedUserFromHeaders(await headers());
}
