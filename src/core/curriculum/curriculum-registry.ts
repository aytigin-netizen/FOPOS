import { loadPackage } from "./package-loader.ts";
import type { CurriculumPackage, Discipline } from "./package-types.ts";

export type CurriculumRegistration = {
  discipline: Discipline;
  datasetVersion: string;
  supportedGrades: Array<10 | 11 | 12>;
  load: () => CurriculumPackage;
};

const registrations = new Map<string, CurriculumRegistration>([
  [
    "philosophy@2024.1",
    {
      discipline: { code: "philosophy", name: "Felsefe" },
      datasetVersion: "2024.1",
      supportedGrades: [10, 11],
      load: () => loadPackage({ disciplineCode: "philosophy", datasetVersion: "2024.1" }),
    },
  ],
  [
    "philosophy@2026.1",
    {
      discipline: { code: "philosophy", name: "Felsefe" },
      datasetVersion: "2026.1",
      supportedGrades: [10, 11],
      load: () => loadPackage({ disciplineCode: "philosophy", datasetVersion: "2026.1" }),
    },
  ],
  [
    "sociology@2026.1",
    {
      discipline: { code: "sociology", name: "Sosyoloji" },
      datasetVersion: "2026.1",
      supportedGrades: [11, 12],
      load: () => loadPackage({ disciplineCode: "sociology", datasetVersion: "2026.1" }),
    },
  ],
]);

export function listRegisteredDisciplines(): Discipline[] {
  return [...new Map(
    [...registrations.values()].map(({ discipline }) => [discipline.code, discipline]),
  ).values()].map((discipline) => ({ ...discipline }));
}

export function supportedGradesForDiscipline(code: string): Array<10 | 11 | 12> {
  const normalized = code.trim().toLocaleLowerCase("en-US");
  return [...new Set(
    [...registrations.values()]
      .filter(({ discipline }) => discipline.code === normalized)
      .flatMap(({ supportedGrades }) => supportedGrades),
  )].sort((left, right) => left - right) as Array<10 | 11 | 12>;
}

export function getCurriculumRegistration(code: string, datasetVersion: string) {
  const registration = registrations.get(
    `${code.trim().toLocaleLowerCase("en-US")}@${datasetVersion.trim()}`,
  );
  return registration
    ? {
        discipline: { ...registration.discipline },
        datasetVersion: registration.datasetVersion,
        supportedGrades: [...registration.supportedGrades],
        load: registration.load,
      }
    : null;
}
