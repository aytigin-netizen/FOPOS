import ClientApp from "./ClientApp";
import { getChatGPTUser } from "./chatgpt-auth";
import { ProfileSetup } from "./components/workspace/ProfileSetup";
import {
  ensureWorkspaceAccount,
  getTeacherProfile,
} from "../db/teacher-workspace";
import {
  ensureDefaultTeacherDiscipline,
  listTeacherDisciplines,
} from "../db/teacher-disciplines";

export const dynamic = "force-dynamic";

export default async function Home() {
  const chatGPTUser = await getChatGPTUser();
  if (!chatGPTUser) {
    return (
      <ClientApp
        teacherDisplayName="Misafir Öğretmen"
        schoolName=""
        academicYear="2026-2027"
        defaultDisciplineCode="philosophy"
        isAuthenticated={false}
      />
    );
  }
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
  await ensureDefaultTeacherDiscipline(account.id);
  const disciplines = await listTeacherDisciplines(account.id);
  const defaultDisciplineCode =
    disciplines.find((discipline) => discipline.isDefault)?.disciplineCode ??
    "philosophy";

  return (
    <ClientApp
      teacherDisplayName={profile.displayName}
      schoolName={profile.schoolName}
      academicYear={profile.academicYear}
      defaultDisciplineCode={defaultDisciplineCode}
      isAuthenticated
    />
  );
}
