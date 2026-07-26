import ClientApp from "./ClientApp";
import { requireChatGPTUser } from "./chatgpt-auth";
import { ProfileSetup } from "./components/workspace/ProfileSetup";
import {
  ensureWorkspaceAccount,
  getTeacherProfile,
} from "../db/teacher-workspace";

export const dynamic = "force-dynamic";

export default async function Home() {
  const chatGPTUser = await requireChatGPTUser("/");
  const account = await ensureWorkspaceAccount(chatGPTUser.email);
  const profile = await getTeacherProfile(account.id);

  if (!profile) {
    return (
      <ProfileSetup
        suggestedDisplayName={chatGPTUser.fullName ?? ""}
        accountEmail={chatGPTUser.email}
      />
    );
  }

  return (
    <ClientApp
      teacherDisplayName={profile.displayName}
      schoolName={profile.schoolName}
      academicYear={profile.academicYear}
    />
  );
}
