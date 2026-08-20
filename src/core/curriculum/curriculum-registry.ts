import { loadPackage } from "./package-loader.ts";
import type { CurriculumPackage, Discipline } from "./package-types.ts";

export type CurriculumRegistration = {
  discipline: Discipline;
  supportedGrades: Array<10 | 11 | 12>;
  load: () => CurriculumPackage;
};

const registrations = new Map<string, CurriculumRegistration>([
  [
    "philosophy",
    {
      discipline: { code: "philosophy", name: "Felsefe" },
      supportedGrades: [10, 11],
      load: () => loadPackage("philosophy"),
    },
  ],
  [
    "sociology",
    {
      discipline: { code: "sociology", name: "Sosyoloji" },
      supportedGrades: [11, 12],
      load: () => loadPackage("sociology"),
    },
  ],
]);

export function listRegisteredDisciplines(): Discipline[] {
  return [...registrations.values()].map(({ discipline }) => ({
    ...discipline,
  }));
}

export function supportedGradesForDiscipline(code: string): Array<10 | 11 | 12> {
  const registration = registrations.get(code.trim().toLocaleLowerCase("en-US"));
  return registration ? [...registration.supportedGrades] : [];
}

export function getCurriculumRegistration(code: string) {
  const registration = registrations.get(
    code.trim().toLocaleLowerCase("en-US"),
  );
  return registration
    ? {
        discipline: { ...registration.discipline },
        supportedGrades: [...registration.supportedGrades],
        load: registration.load,
      }
    : null;
}
