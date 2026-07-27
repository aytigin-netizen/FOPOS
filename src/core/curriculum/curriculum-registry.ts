import { loadPackage } from "./package-loader.ts";
import type { CurriculumPackage, Discipline } from "./package-types.ts";

export type CurriculumRegistration = {
  discipline: Discipline;
  load: () => CurriculumPackage;
};

const registrations = new Map<string, CurriculumRegistration>([
  [
    "philosophy",
    {
      discipline: { code: "philosophy", name: "Felsefe" },
      load: () => loadPackage("philosophy"),
    },
  ],
]);

export function listRegisteredDisciplines(): Discipline[] {
  return [...registrations.values()].map(({ discipline }) => ({
    ...discipline,
  }));
}

export function getCurriculumRegistration(code: string) {
  const registration = registrations.get(
    code.trim().toLocaleLowerCase("en-US"),
  );
  return registration
    ? {
        discipline: { ...registration.discipline },
        load: registration.load,
      }
    : null;
}
